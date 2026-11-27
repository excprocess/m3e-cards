import { LitElement, css, html, nothing, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import '../editors/m3e-popup-card-editor';
import { m3eBaseStyles, m3eDialogStyles } from '../styles/m3e-tokens';
import type {
  HassEntity,
  HomeAssistant,
  LovelaceCardConfig,
  M3EPopupCardConfig,
} from '../types/home-assistant';
import { renderM3EntityIcon } from '../utils/icons';
import { resolveEntityName } from '../utils/entity-display';
import { animateDialogClose, animateDialogOpen } from '../utils/dialog-motion';
import { guardDialogTouchMove } from '../utils/scroll-lock';
import {
  normalizePopupTarget,
  registerPopupTarget,
  unregisterPopupTarget,
} from '../utils/navigation';
import {
  registerM3EPopupForPicker,
  unregisterM3EPopupForPicker,
} from '../utils/navigation-picker-bridge';
import {
  findMatchingPopupEditor,
  readDashboardCardClipboard,
  writeDashboardCardClipboard,
} from '../utils/popup-editor-bridge';

interface HACardElement extends HTMLElement {
  hass?: HomeAssistant;
  setConfig?: (config: LovelaceCardConfig) => void;
  getGridOptions?: () => { columns?: number | 'full'; rows?: number | 'auto' };
}

interface HACardEditModeElement extends HTMLElement {
  hass?: HomeAssistant;
  lovelace?: { editMode: boolean; saveConfig: () => Promise<void> };
  path?: [number, number, number];
  hiddenOverlay?: boolean;
}

interface HASortableElement extends HTMLElement {
  disabled?: boolean;
  draggableSelector?: string;
  rollback?: boolean;
  invertSwap?: boolean;
  options?: Record<string, unknown>;
}

interface HACardHelpers {
  createCardElement: (config: LovelaceCardConfig) => Promise<HACardElement> | HACardElement;
}

interface EnclosingContainer {
  kind: 'section' | 'stack';
  container: HTMLElement;
  cardWrapper: HTMLElement;
  outerSection?: HTMLElement;
}

const ACTIVE_STATES = new Set([
  'on',
  'open',
  'opening',
  'unlocked',
  'playing',
  'heat',
  'heating',
  'cool',
  'cooling',
  'home',
  'active',
  'true',
]);

let cachedHelpersPromise: Promise<HACardHelpers | undefined> | null = null;
function getCardHelpersCached(): Promise<HACardHelpers | undefined> {
  if (!cachedHelpersPromise) {
    const loader = (window as unknown as { loadCardHelpers?: () => Promise<HACardHelpers> })
      .loadCardHelpers;
    cachedHelpersPromise = loader ? loader() : Promise.resolve(undefined);
  }
  return cachedHelpersPromise;
}

function resolveCardGridSpan(
  cfg: LovelaceCardConfig,
  cardEl?: HACardElement,
): { cols: number; rows?: number } {
  const cfgGrid = (cfg.grid_options ?? {}) as { columns?: number | 'full'; rows?: number | 'auto' };
  const defGrid = cardEl?.getGridOptions?.();
  const rawCols = cfgGrid.columns ?? defGrid?.columns ?? 12;
  const cols =
    rawCols === 'full'
      ? 12
      : typeof rawCols === 'number' && Number.isFinite(rawCols)
        ? Math.max(1, Math.min(12, Math.round(rawCols)))
        : 12;

  const rawRows = cfgGrid.rows;
  const rows =
    typeof rawRows === 'number' && Number.isFinite(rawRows) && rawRows > 0
      ? Math.round(rawRows)
      : undefined;

  return { cols, rows };
}

@customElement('m3e-popup-card')
export class M3EPopupCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3EPopupCardConfig;
  @state() private _isOpen = false;
  @state() private _isEditMode = false;
  @state() private _isDialogPreview = false;
  @state() private _isSectionGrid = false;

  @query('dialog.m3e-popup-dialog') private _dialogEl?: HTMLDialogElement;
  @query('.dialog-surface') private _surfaceEl?: HTMLElement;
  @query('.cards-host') private _cardsHostEl?: HTMLElement;
  @query('.preview-cards-host') private _previewHostEl?: HTMLElement;
  @query('.stack-portal') private _stackPortalEl?: HTMLElement;

  private _registeredTarget = '';
  private _prevHeaderEntity?: HassEntity;
  private _cardElements: HACardElement[] = [];
  private _cardWrappers: HTMLElement[] = [];
  private _editModeElements: HACardEditModeElement[] = [];
  private _lastCardsRef?: LovelaceCardConfig[];
  private _lastCardsJson = '';
  private _lastBuildWasPreview = false;
  private _prewarmHandle: number | null = null;

  private _adoptedSiblings: Array<{
    el: HTMLElement;
    parent: Node;
    nextSibling: Node | null;
    prevGridColumn: string;
  }> = [];
  private _hiddenSiblings: HTMLElement[] = [];
  private _collapsedSection?: HTMLElement;

  public static getStubConfig(): M3EPopupCardConfig {
    return {
      type: 'custom:m3e-popup-card',
      hash: '#popup',
      name: 'Pop-up',
      show_header_button: true,
      show_state: true,
      cards: [],
    };
  }

  public static getConfigElement(): HTMLElement {
    return document.createElement('m3e-popup-card-editor');
  }

  public setConfig(config: M3EPopupCardConfig): void {
    if (!config) {
      throw new Error('m3e-popup-card: invalid configuration');
    }
    this._config = {
      show_header_button: true,
      show_state: true,
      ...config,
      hash: config.hash || '#popup',
    };
    this._syncRegistration();
    this._schedulePrewarm();
  }

  public getCardSize(): number {
    return this._isEditMode ? 1 : 0;
  }

  public getGridOptions() {
    if (this._isEditMode) {
      return { columns: 12, min_columns: 6, rows: 1 };
    }
    return { columns: 12, rows: 0 };
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this._syncRegistration();
    this._checkEditMode();
    window.addEventListener('hashchange', this._onLocationChange);
    window.addEventListener('popstate', this._onLocationChange);
    window.addEventListener('location-changed', this._onLocationChange);
    window.addEventListener('m3e-popup-open', this._onPopupOpenEvent as EventListener);
    requestAnimationFrame(() => {
      this._checkEditMode();
      this._syncContainerLayout();
      this._checkTriggerMatch();
      if (this._isDialogPreview) {
        void this._syncEmbeddedCards();
      } else {
        this._schedulePrewarm();
      }
    });
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._prewarmHandle !== null) {
      if ('cancelIdleCallback' in window) {
        window.cancelIdleCallback(this._prewarmHandle);
      } else {
        clearTimeout(this._prewarmHandle);
      }
      this._prewarmHandle = null;
    }
    unregisterPopupTarget(this._registeredTarget);
    unregisterM3EPopupForPicker(this);
    this._registeredTarget = '';
    this._restoreAdoptedSiblings();
    this._restoreContainerStyles();
    window.removeEventListener('hashchange', this._onLocationChange);
    window.removeEventListener('popstate', this._onLocationChange);
    window.removeEventListener('location-changed', this._onLocationChange);
    window.removeEventListener('m3e-popup-open', this._onPopupOpenEvent as EventListener);
  }

  /**
   * Hass Gate:
   * - While closed on the dashboard, skip ALL Lit re-renders unless the header entity's own
   *   object reference changed (so navigation picker metadata stays fresh at near-zero cost).
   * - While open or in preview, propagate `hass` directly to child cards without re-rendering
   *   the outer popup shell unless the header entity or theme changed.
   */
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (
      changedProps.has('_config') ||
      changedProps.has('_isOpen') ||
      changedProps.has('_isEditMode') ||
      changedProps.has('_isDialogPreview') ||
      changedProps.has('_isSectionGrid')
    ) {
      return true;
    }

    if (changedProps.has('hass') && this.hass) {
      if (this._isClosing) return false;
      if (this._isOpen || this._isDialogPreview) {
        for (const el of this._cardElements) el.hass = this.hass;
        for (const em of this._editModeElements) em.hass = this.hass;
      }

      const nextHeaderEnt = this._config?.entity
        ? this.hass.states[this._config.entity]
        : undefined;
      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;

      if (nextHeaderEnt !== this._prevHeaderEntity) {
        this._prevHeaderEntity = nextHeaderEnt;
        this._syncRegistration();
        return this._isOpen || this._isEditMode;
      }

      if (oldHass?.themes?.darkMode !== this.hass.themes?.darkMode) {
        return this._isOpen || this._isEditMode;
      }

      return false;
    }

    return false;
  }

  private _schedulePrewarm(): void {
    if (this._isEditMode || this._isOpen || (this._config?.cards?.length ?? 0) === 0) return;
    if (this._prewarmHandle !== null) return;
    const run = () => {
      this._prewarmHandle = null;
      if (!this._isEditMode && !this._isOpen) {
        void this._ensureCardInstances(this._config?.cards ?? []);
      }
    };
    if ('requestIdleCallback' in window) {
      this._prewarmHandle = window.requestIdleCallback(run, { timeout: 1500 });
    } else {
      this._prewarmHandle = setTimeout(run, 250) as unknown as number;
    }
  }

  private _syncRegistration(): void {
    const next = normalizePopupTarget(this._config?.hash);
    if (next !== this._registeredTarget) {
      unregisterPopupTarget(this._registeredTarget);
      this._registeredTarget = registerPopupTarget(next);
    }
    const resolvedName = resolveEntityName(this.hass, this._entity, this._config?.name);
    registerM3EPopupForPicker(this, this._config?.hash, {
      name: resolvedName || undefined,
      icon: this._config?.icon,
    });
  }

  private _checkEditMode(): void {
    const urlEdit = window.location.search.includes('edit=1');
    let domEdit = false;
    let inPreviewDialog = false;
    let node: Node | null = this;
    while (node) {
      if (node instanceof HTMLElement) {
        const tag = node.tagName.toLowerCase();
        if (tag === 'hui-card-preview' || tag === 'hui-dialog-edit-card') {
          inPreviewDialog = true;
          domEdit = true;
        } else if (tag === 'hui-card-edit-mode' || node.classList.contains('edit-mode')) {
          domEdit = true;
        }
      }
      node = node.parentNode ?? (node instanceof ShadowRoot ? node.host : null);
    }

    const nextEdit = urlEdit || domEdit;
    if (nextEdit !== this._isEditMode || inPreviewDialog !== this._isDialogPreview) {
      this._isEditMode = nextEdit;
      this._isDialogPreview = inPreviewDialog;
      if (nextEdit) {
        if (this._isOpen) this.closePopup(false);
        this._restoreAdoptedSiblings();
        this._restoreContainerStyles();
      } else {
        this._syncContainerLayout();
      }
    }
  }

  private _findEnclosingContainer(): EnclosingContainer | null {
    if (this._isDialogPreview) return null;
    let cardWrapper: HTMLElement | null = this.parentElement;
    while (cardWrapper && cardWrapper.parentElement) {
      const container = cardWrapper.parentElement;
      const rootNode = container.getRootNode();
      if (rootNode instanceof ShadowRoot && rootNode.host) {
        const hostTag = rootNode.host.tagName.toLowerCase();
        if (hostTag === 'hui-grid-section') {
          if (container.firstElementChild === cardWrapper) {
            let outerSection: HTMLElement | undefined;
            const gridHost = rootNode.host as HTMLElement;
            const gridRoot = gridHost.getRootNode();
            if (
              gridRoot instanceof ShadowRoot &&
              gridRoot.host?.tagName.toLowerCase() === 'hui-section'
            ) {
              outerSection = gridRoot.host as HTMLElement;
            } else {
              outerSection = gridHost;
            }
            return { kind: 'section', container, cardWrapper, outerSection };
          }
          return null;
        }
        if (hostTag === 'hui-vertical-stack-card') {
          if (container.firstElementChild === cardWrapper) {
            return { kind: 'stack', container, cardWrapper };
          }
          return null;
        }
      }
      cardWrapper = container;
    }
    return null;
  }

  private _syncContainerLayout(): void {
    const enc = this._findEnclosingContainer();
    this._isSectionGrid = enc?.kind === 'section';

    if (this._isEditMode || this._isOpen || !enc) {
      this._restoreContainerStyles();
      return;
    }

    const siblings = Array.from(enc.container.children).filter(
      (el) => el !== enc.cardWrapper,
    ) as HTMLElement[];
    this._hiddenSiblings = siblings;
    for (const el of siblings) {
      el.style.display = 'none';
    }

    if (enc.outerSection) {
      this._collapsedSection = enc.outerSection;
      enc.outerSection.style.position = 'fixed';
      enc.outerSection.style.width = '0';
      enc.outerSection.style.height = '0';
      enc.outerSection.style.overflow = 'visible';
      enc.outerSection.style.margin = '0';
      enc.outerSection.style.padding = '0';
      enc.outerSection.style.pointerEvents = 'none';
    }
  }

  private _restoreContainerStyles(): void {
    for (const el of this._hiddenSiblings) {
      el.style.display = '';
    }
    this._hiddenSiblings = [];
    if (this._collapsedSection) {
      this._collapsedSection.style.position = '';
      this._collapsedSection.style.width = '';
      this._collapsedSection.style.height = '';
      this._collapsedSection.style.overflow = '';
      this._collapsedSection.style.margin = '';
      this._collapsedSection.style.padding = '';
      this._collapsedSection.style.pointerEvents = '';
      this._collapsedSection = undefined;
    }
  }

  private _adoptContainerSiblings(): void {
    if (this._adoptedSiblings.length > 0 || !this._stackPortalEl) return;
    const enc = this._findEnclosingContainer();
    if (!enc) return;
    this._isSectionGrid = enc.kind === 'section';

    const siblings = Array.from(enc.container.children).filter(
      (el) => el !== enc.cardWrapper,
    ) as HTMLElement[];

    for (const el of siblings) {
      const prevGridColumn = el.style.gridColumn;
      this._adoptedSiblings.push({
        el,
        parent: enc.container,
        nextSibling: el.nextSibling,
        prevGridColumn,
      });
      el.style.display = '';
      if (enc.kind === 'section') {
        const colSpan = getComputedStyle(el).getPropertyValue('--column-size').trim();
        if (colSpan && !el.style.gridColumn) {
          el.style.gridColumn = `span ${colSpan}`;
        }
      }
      this._stackPortalEl.appendChild(el);
    }
  }

  private _restoreAdoptedSiblings(): void {
    if (this._adoptedSiblings.length === 0) return;
    for (const rec of this._adoptedSiblings) {
      rec.el.style.gridColumn = rec.prevGridColumn;
      if (rec.nextSibling && rec.nextSibling.parentNode === rec.parent) {
        rec.parent.insertBefore(rec.el, rec.nextSibling);
      } else {
        rec.parent.appendChild(rec.el);
      }
    }
    this._adoptedSiblings = [];
  }

  private _onLocationChange = (): void => {
    this._checkEditMode();
    this._checkTriggerMatch();
  };

  private _onPopupOpenEvent = (e: CustomEvent<{ target?: string }>): void => {
    if (this._isDialogPreview) return;
    const incoming = normalizePopupTarget(e.detail?.target);
    const mine = normalizePopupTarget(this._config?.hash);
    if (incoming && mine && incoming === mine) {
      void this.openPopup();
    }
  };

  private _checkTriggerMatch(): void {
    if (this._isEditMode) return;
    const mine = normalizePopupTarget(this._config?.hash);
    if (!mine) return;

    const currentHash = window.location.hash.trim().toLowerCase();
    const currentPath = window.location.pathname.trim().toLowerCase();
    const currentFull = `${currentPath}${currentHash}`;

    const matches =
      (mine.startsWith('#') && currentHash === mine) ||
      (mine.startsWith('/') && (currentPath === mine || currentFull === mine));

    if (matches && !this._isOpen) {
      void this.openPopup();
    } else if (!matches && this._isOpen && mine.startsWith('#')) {
      this.closePopup(false);
    }
  }

  public async openPopup(): Promise<void> {
    if (this._isOpen || this._isDialogPreview) return;
    this._isOpen = true;
    await this.updateComplete;

    // Show & animate dialog immediately on frame 1 (zero blocking lag!)
    const dlg = this._dialogEl;
    if (dlg && !dlg.open) {
      dlg.showModal();
    }
    if (this._surfaceEl) {
      animateDialogOpen(this._surfaceEl);
    }

    this._adoptContainerSiblings();
    void this._syncEmbeddedCards();
  }

  private _isClosing = false;

  public closePopup(clearUrlHash = true): void {
    if (!this._isOpen || this._isClosing) return;
    this._isClosing = true;
    const finish = () => {
      this._isClosing = false;
      if (this._dialogEl?.open) this._dialogEl.close();
      this._restoreAdoptedSiblings();
      this._isOpen = false;
      this._syncContainerLayout();
      if (clearUrlHash) {
        const mine = normalizePopupTarget(this._config?.hash);
        if (mine.startsWith('#') && window.location.hash.trim().toLowerCase() === mine) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }
    };

    if (this._dialogEl && this._surfaceEl) {
      animateDialogClose(this._dialogEl, this._surfaceEl, finish);
    } else {
      finish();
    }
  }

  private _persistPreviewCards(nextCards: LovelaceCardConfig[], rebuild = true): void {
    if (!this._config) return;
    this._config = { ...this._config, cards: nextCards };
    this._lastCardsRef = nextCards;
    this._lastCardsJson = JSON.stringify(nextCards);

    const editor = findMatchingPopupEditor(this._config);
    if (editor) {
      editor.updateCards(nextCards);
    } else {
      this.dispatchEvent(
        new CustomEvent('config-changed', {
          bubbles: true,
          composed: true,
          detail: { config: this._config },
        }),
      );
    }
    if (rebuild) {
      void this._syncEmbeddedCards(true);
    }
  }

  private _buildSortablePreviewContainer(
    cardsCfg: LovelaceCardConfig[],
    cardEls: HACardElement[],
  ): HTMLElement {
    const sortable = document.createElement('ha-sortable') as HASortableElement;
    sortable.disabled = false;
    sortable.draggableSelector = '.card';
    sortable.rollback = false;
    sortable.invertSwap = true;
    sortable.options = {
      delay: 100,
      delayOnTouchOnly: true,
      invertedSwapThreshold: 0.7,
    };

    const grid = document.createElement('div');
    grid.className = 'popup-cards-grid edit-mode';
    this._editModeElements = [];
    this._cardWrappers = [];

    for (let i = 0; i < cardEls.length; i++) {
      const cfg = cardsCfg[i];
      const cardEl = cardEls[i];
      const { cols, rows } = resolveCardGridSpan(cfg, cardEl);

      const wrapper = document.createElement('div');
      wrapper.className = 'card';
      wrapper.style.gridColumn = `span ${cols}`;
      wrapper.style.gridRow = rows ? `span ${rows}` : '';

      const editModeEl = document.createElement('hui-card-edit-mode') as HACardEditModeElement;
      editModeEl.hass = this.hass;
      editModeEl.lovelace = {
        editMode: true,
        saveConfig: async () => {},
      };
      editModeEl.path = [0, 0, i];
      editModeEl.hiddenOverlay = false;
      editModeEl.appendChild(cardEl);

      this._editModeElements.push(editModeEl);
      this._cardWrappers.push(wrapper);
      wrapper.appendChild(editModeEl);
      grid.appendChild(wrapper);
    }

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'add-card-pill';
    const addLabel =
      (this.hass as unknown as { localize?: (k: string) => string })?.localize?.(
        'ui.panel.lovelace.editor.section.add_card',
      ) || 'Add card';
    addBtn.setAttribute('aria-label', addLabel);
    addBtn.title = addLabel;
    const plusIcon = document.createElement('ha-svg-icon') as HTMLElement & { path?: string };
    plusIcon.path = 'M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z';
    const textSpan = document.createElement('span');
    textSpan.textContent = addLabel;
    addBtn.appendChild(plusIcon);
    addBtn.appendChild(textSpan);
    addBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      findMatchingPopupEditor(this._config)?.openAddCard();
    });
    grid.appendChild(addBtn);

    // Zero-rebuild in-place reorder!
    sortable.addEventListener('item-moved', (ev: Event) => {
      ev.stopPropagation();
      const { oldIndex, newIndex } = (ev as CustomEvent<{ oldIndex: number; newIndex: number }>)
        .detail;
      if (
        typeof oldIndex !== 'number' ||
        typeof newIndex !== 'number' ||
        oldIndex === newIndex ||
        !this._config
      ) {
        return;
      }
      const nextCards = [...(this._config.cards ?? [])];
      const [movedCfg] = nextCards.splice(oldIndex, 1);
      if (!movedCfg) return;
      nextCards.splice(newIndex, 0, movedCfg);

      const [movedEl] = this._cardElements.splice(oldIndex, 1);
      if (movedEl) this._cardElements.splice(newIndex, 0, movedEl);

      const [movedWrap] = this._cardWrappers.splice(oldIndex, 1);
      if (movedWrap) this._cardWrappers.splice(newIndex, 0, movedWrap);

      const [movedEdit] = this._editModeElements.splice(oldIndex, 1);
      if (movedEdit) this._editModeElements.splice(newIndex, 0, movedEdit);

      for (let i = 0; i < this._editModeElements.length; i++) {
        this._editModeElements[i].path = [0, 0, i];
      }

      this._persistPreviewCards(nextCards, false);
    });

    sortable.addEventListener('drag-start', () => {
      for (const el of this._editModeElements) el.hiddenOverlay = true;
    });
    sortable.addEventListener('drag-end', () => {
      for (const el of this._editModeElements) el.hiddenOverlay = false;
    });

    sortable.addEventListener('ll-edit-card', (ev: Event) => {
      ev.stopPropagation();
      const idx = (ev as CustomEvent<{ path?: number[] }>).detail?.path?.[2];
      if (typeof idx === 'number') {
        findMatchingPopupEditor(this._config)?.openEditCard(idx);
      }
    });

    sortable.addEventListener('ll-duplicate-card', (ev: Event) => {
      ev.stopPropagation();
      const idx = (ev as CustomEvent<{ path?: number[] }>).detail?.path?.[2];
      if (typeof idx !== 'number' || !this._config?.cards?.[idx]) return;
      const nextCards = [...this._config.cards];
      nextCards.splice(idx + 1, 0, JSON.parse(JSON.stringify(nextCards[idx])));
      this._persistPreviewCards(nextCards, true);
    });

    sortable.addEventListener('ll-delete-card', (ev: Event) => {
      ev.stopPropagation();
      const idx = (ev as CustomEvent<{ path?: number[] }>).detail?.path?.[2];
      if (typeof idx !== 'number' || !this._config?.cards) return;
      const nextCards = [...this._config.cards];
      nextCards.splice(idx, 1);
      this._persistPreviewCards(nextCards, true);
    });

    sortable.addEventListener('ll-copy-card', (ev: Event) => {
      ev.stopPropagation();
      const idx = (ev as CustomEvent<{ path?: number[] }>).detail?.path?.[2];
      const card = typeof idx === 'number' ? this._config?.cards?.[idx] : undefined;
      if (card) writeDashboardCardClipboard(card);
    });

    sortable.addEventListener('ll-cut-card', (ev: Event) => {
      ev.stopPropagation();
      const idx = (ev as CustomEvent<{ path?: number[] }>).detail?.path?.[2];
      const card = typeof idx === 'number' ? this._config?.cards?.[idx] : undefined;
      if (!card || typeof idx !== 'number' || !this._config?.cards) return;
      writeDashboardCardClipboard(card);
      const nextCards = [...this._config.cards];
      nextCards.splice(idx, 1);
      this._persistPreviewCards(nextCards, true);
    });

    sortable.addEventListener('ll-paste-card', (ev: Event) => {
      ev.stopPropagation();
      const idx = (ev as CustomEvent<{ path?: number[] }>).detail?.path?.[2];
      const pasted = readDashboardCardClipboard();
      if (!pasted) return;
      const nextCards = [...(this._config?.cards ?? [])];
      const at = typeof idx === 'number' ? Math.min(idx + 1, nextCards.length) : nextCards.length;
      nextCards.splice(at, 0, pasted);
      this._persistPreviewCards(nextCards, true);
    });

    // Zero-rebuild in-place resize!
    sortable.addEventListener('ll-change-grid-options', (ev: Event) => {
      ev.stopPropagation();
      const detail = (
        ev as CustomEvent<{ path?: number[]; gridOptions?: Record<string, unknown> }>
      ).detail;
      const idx = detail?.path?.[2];
      const gridOptions = detail?.gridOptions;
      if (typeof idx !== 'number' || !gridOptions || !this._config?.cards?.[idx]) return;

      const nextCards = [...this._config.cards];
      const updatedCard: LovelaceCardConfig = {
        ...nextCards[idx],
        grid_options: {
          ...((nextCards[idx].grid_options as Record<string, unknown>) ?? {}),
          ...gridOptions,
        },
      };
      nextCards[idx] = updatedCard;

      const wrapper = this._cardWrappers[idx];
      if (wrapper) {
        const { cols, rows } = resolveCardGridSpan(updatedCard, this._cardElements[idx]);
        wrapper.style.gridColumn = `span ${cols}`;
        wrapper.style.gridRow = rows ? `span ${rows}` : '';
      }

      this._persistPreviewCards(nextCards, false);
    });

    sortable.addEventListener('ll-move-to-section', (ev: Event) => {
      ev.stopPropagation();
    });

    sortable.appendChild(grid);
    return sortable;
  }

  private async _ensureCardInstances(cardsCfg: LovelaceCardConfig[]): Promise<HACardElement[]> {
    const json = JSON.stringify(cardsCfg);
    if (json === this._lastCardsJson && this._cardElements.length === cardsCfg.length) {
      return this._cardElements;
    }

    this._lastCardsRef = cardsCfg;
    this._lastCardsJson = json;

    const helpers = await getCardHelpersCached();
    const nextEls: HACardElement[] = [];
    for (const cfg of cardsCfg) {
      try {
        let el: HACardElement | null = null;
        if (helpers?.createCardElement) {
          el = await helpers.createCardElement(cfg);
        } else if (cfg.type?.startsWith('custom:')) {
          el = document.createElement(cfg.type.slice(7)) as HACardElement;
          el.setConfig?.(cfg);
        }
        if (el) {
          if (this.hass) el.hass = this.hass;
          nextEls.push(el);
        }
      } catch {
        // ignore malformed child card
      }
    }
    this._cardElements = nextEls;
    return nextEls;
  }

  private async _syncEmbeddedCards(forceRebuild = false): Promise<void> {
    const cardsCfg = this._config?.cards ?? [];
    const targetHost = this._isDialogPreview ? this._previewHostEl : this._cardsHostEl;
    if (!targetHost) return;

    const refChanged = cardsCfg !== this._lastCardsRef;
    const jsonChanged = refChanged && JSON.stringify(cardsCfg) !== this._lastCardsJson;
    const modeChanged = this._lastBuildWasPreview !== this._isDialogPreview;
    const needsRebuild =
      forceRebuild || jsonChanged || modeChanged || targetHost.childElementCount === 0;

    if (needsRebuild) {
      this._lastBuildWasPreview = this._isDialogPreview;
      const nextEls = await this._ensureCardInstances(cardsCfg);

      if (this._isDialogPreview) {
        const sortable = this._buildSortablePreviewContainer(cardsCfg, nextEls);
        targetHost.replaceChildren(sortable);
      } else {
        this._editModeElements = [];
        this._cardWrappers = [];
        const grid = document.createElement('div');
        grid.className = 'popup-cards-grid';
        for (let i = 0; i < nextEls.length; i++) {
          const { cols, rows } = resolveCardGridSpan(cardsCfg[i], nextEls[i]);
          const cell = document.createElement('div');
          cell.className = 'card';
          cell.style.gridColumn = `span ${cols}`;
          if (rows) cell.style.gridRow = `span ${rows}`;
          cell.appendChild(nextEls[i]);
          grid.appendChild(cell);
        }
        targetHost.replaceChildren(grid);
      }
    }

    if (this.hass) {
      for (const el of this._cardElements) el.hass = this.hass;
      for (const em of this._editModeElements) em.hass = this.hass;
    }
  }

  protected updated(changedProps: PropertyValues): void {
    if (changedProps.has('_config')) {
      this._syncRegistration();
    }
    if (
      (this._isOpen || this._isDialogPreview) &&
      (changedProps.has('_config') ||
        changedProps.has('_isOpen') ||
        changedProps.has('_isDialogPreview'))
    ) {
      void this._syncEmbeddedCards();
    }
  }

  private get _entity(): HassEntity | undefined {
    if (!this.hass || !this._config?.entity) return undefined;
    return this.hass.states[this._config.entity];
  }

  private get _isEntityActive(): boolean {
    const st = String(this._entity?.state ?? '').toLowerCase();
    return ACTIVE_STATES.has(st);
  }

  private _onHeaderActionClick(): void {
    if (!this.hass || !this._config?.entity) return;
    const eid = this._config.entity;
    const domain = eid.split('.')[0];
    navigator.vibrate?.(10);

    if (domain === 'button' || domain === 'input_button') {
      this.hass.callService(domain, 'press', { entity_id: eid });
      return;
    }
    if (domain === 'script' || domain === 'scene') {
      this.hass.callService(domain, 'turn_on', { entity_id: eid });
      return;
    }
    if (domain === 'lock') {
      const locked = this._entity?.state === 'locked';
      this.hass.callService('lock', locked ? 'unlock' : 'lock', { entity_id: eid });
      return;
    }
    if (
      [
        'light',
        'switch',
        'fan',
        'input_boolean',
        'cover',
        'media_player',
        'climate',
        'remote',
        'humidifier',
      ].includes(domain)
    ) {
      this.hass.callService(domain, 'toggle', { entity_id: eid });
      return;
    }

    this.dispatchEvent(
      new CustomEvent('hass-more-info', {
        bubbles: true,
        composed: true,
        detail: { entityId: eid },
      }),
    );
  }

  private _renderHeaderIcon() {
    const ent = this._entity;
    const customIcon = this._config?.icon?.trim();
    if (customIcon && typeof customElements !== 'undefined' && customElements.get('ha-icon')) {
      return html`<ha-icon .icon=${customIcon}></ha-icon>`;
    }
    if (this._config?.use_entity_icon && ent && typeof customElements !== 'undefined') {
      if (customElements.get('ha-state-icon')) {
        return html`<ha-state-icon .hass=${this.hass} .stateObj=${ent}></ha-state-icon>`;
      }
      if (ent.attributes.icon && customElements.get('ha-icon')) {
        return html`<ha-icon .icon=${ent.attributes.icon}></ha-icon>`;
      }
    }
    return renderM3EntityIcon(ent, this._isEntityActive);
  }

  private _renderHeaderBar(isPreview: boolean) {
    const ent = this._entity;
    const isActive = this._isEntityActive;
    const title =
      resolveEntityName(this.hass, ent, this._config?.name) ||
      this._config?.hash ||
      'Pop-up';
    const showHeaderBtn =
      Boolean(this._config?.entity) && this._config?.show_header_button !== false;
    const showState = Boolean(ent) && this._config?.show_state !== false;
    const stateLabel =
      showState && ent
        ? this.hass && typeof this.hass.formatEntityState === 'function'
          ? this.hass.formatEntityState(ent)
          : String(ent.state ?? '')
        : '';

    return html`
      <header class="dialog-header ${isPreview ? 'is-preview' : ''}">
        <!-- Close (X) ALWAYS on the left per M3E guidelines -->
        <button
          type="button"
          class="close-btn"
          aria-label="Chiudi"
          @click=${() => (!isPreview ? this.closePopup(true) : undefined)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"
            />
          </svg>
        </button>

        <div class="dialog-title-wrap">
          <span class="dialog-title">${title}</span>
          ${stateLabel || (isPreview && !this._isDialogPreview)
            ? html`
                <span class="dialog-sub">
                  ${stateLabel}${stateLabel && isPreview && !this._isDialogPreview
                    ? ' · '
                    : ''}${isPreview && !this._isDialogPreview ? this._config?.hash || '#popup' : ''}
                </span>
              `
            : nothing}
        </div>

        <!-- Optional Entity Action Button ALWAYS on the right -->
        ${showHeaderBtn
          ? html`
              <button
                type="button"
                class="header-action-btn ${isActive ? 'is-active' : ''}"
                aria-label=${title}
                aria-pressed=${String(isActive)}
                @click=${() => this._onHeaderActionClick()}
              >
                ${this._renderHeaderIcon()}
              </button>
            `
          : nothing}
      </header>
    `;
  }

  protected render() {
    if (!this._config) return nothing;

    if (this._isDialogPreview) {
      return html`
        <div class="editor-preview-surface">
          ${this._renderHeaderBar(true)}
          <div class="popup-body">
            <div class="preview-cards-host"></div>
          </div>
        </div>
      `;
    }

    return html`
      ${this._isEditMode
        ? html`<div class="edit-header-host">${this._renderHeaderBar(true)}</div>`
        : nothing}

      <dialog
        class="m3e-dialog m3e-popup-dialog"
        @click=${(e: MouseEvent) => {
          if (e.target === this._dialogEl) this.closePopup(true);
        }}
        @cancel=${(e: Event) => {
          e.preventDefault();
          this.closePopup(true);
        }}
        @touchmove=${guardDialogTouchMove}
      >
        <div class="m3e-dialog-surface dialog-surface">
          ${this._renderHeaderBar(false)}

          <div class="popup-body">
            <div class="cards-host"></div>
            <div class="stack-portal ${this._isSectionGrid ? 'is-section-grid' : ''}"></div>
          </div>
        </div>
      </dialog>
    `;
  }

  static styles = [
    m3eBaseStyles,
    m3eDialogStyles,
    css`
      :host {
        display: block;
        height: auto;
      }

      .editor-preview-surface {
        background: var(--md-sys-color-surface, #131316);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        border-radius: 28px;
        padding: 18px 18px 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .edit-header-host {
        display: flex;
        align-items: center;
        min-height: 56px;
        height: 100%;
        padding: 4px 6px;
        box-sizing: border-box;
      }

      .edit-header-host .dialog-header {
        width: 100%;
      }

      dialog.m3e-popup-dialog {
        --m3e-dialog-max-width: 460px;
        --m3e-dialog-mobile-max-height: 92dvh;
      }

      .dialog-header {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .close-btn {
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        border: 0;
        padding: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        cursor: pointer;
        transition:
          background-color var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
      }

      .close-btn:hover {
        background: color-mix(in srgb, currentColor 8%, transparent);
      }

      .close-btn:active {
        transform: scale(0.92);
      }

      .close-btn svg {
        width: 22px;
        height: 22px;
      }

      .dialog-title-wrap {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 1px;
      }

      .dialog-title {
        font-size: 20px;
        font-weight: 500;
        line-height: 24px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .dialog-sub {
        font-size: 12.5px;
        font-weight: 500;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .header-action-btn {
        flex: 0 0 42px;
        width: 42px;
        height: 42px;
        border: 0;
        padding: 0;
        border-radius: 50%;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        display: grid;
        place-items: center;
        cursor: pointer;
        transition:
          transform var(--m3e-spring-spatial-fast),
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default);
      }

      .header-action-btn.is-active {
        border-radius: 14px;
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .header-action-btn:active {
        transform: scale(0.92);
      }

      .header-action-btn svg,
      .header-action-btn ha-icon,
      .header-action-btn ha-state-icon {
        width: 21px;
        height: 21px;
        --mdc-icon-size: 21px;
      }

      .popup-body {
        display: flex;
        flex-direction: column;
        gap: 12px;
        --ha-card-background: var(--md-sys-color-surface-container-high, #24252d);
        --ha-card-box-shadow: none;
        --ha-card-border-width: 0px;
        --m3e-card-border-radius: 24px;
      }

      .popup-cards-grid {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        grid-auto-rows: minmax(56px, auto);
        gap: 10px;
        align-items: stretch;
      }

      .popup-cards-grid > .card {
        position: relative;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }

      .popup-cards-grid > .card > *,
      .popup-cards-grid hui-card-edit-mode {
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
      }

      /* Material 3 Expressive Tonal Pill "+ Add card" button */
      .add-card-pill {
        grid-column: 1 / -1;
        width: 100%;
        height: 52px;
        margin-top: 6px;
        border: 0;
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
        font: inherit;
        font-size: 14.5px;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        cursor: pointer;
        transition:
          transform var(--m3e-spring-spatial-fast),
          border-radius var(--m3e-spring-bouncy),
          filter var(--m3e-spring-effects-fast);
        -webkit-tap-highlight-color: transparent;
      }

      .add-card-pill:hover {
        filter: brightness(1.07);
      }

      .add-card-pill:active {
        transform: scale(0.97);
        border-radius: 18px;
      }

      .add-card-pill ha-svg-icon {
        --mdc-icon-size: 20px;
        display: inline-flex;
      }

      .stack-portal {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .stack-portal.is-section-grid {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: 10px;
        align-items: stretch;
      }

      .stack-portal.is-section-grid > * {
        grid-column: span var(--column-size, 12);
      }

      .cards-host:empty,
      .stack-portal:empty {
        display: none;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-popup-card': M3EPopupCard;
  }
}
