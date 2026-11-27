import { LitElement, css, html, nothing, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import '../editors/m3e-popup-card-editor';
import { m3eBaseStyles } from '../styles/m3e-tokens';
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

interface HACardElement extends HTMLElement {
  hass?: HomeAssistant;
  setConfig?: (config: LovelaceCardConfig) => void;
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

@customElement('m3e-popup-card')
export class M3EPopupCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3EPopupCardConfig;
  @state() private _isOpen = false;
  @state() private _isEditMode = false;
  @state() private _isSectionGrid = false;

  @query('dialog.m3e-popup-dialog') private _dialogEl?: HTMLDialogElement;
  @query('.dialog-surface') private _surfaceEl?: HTMLElement;
  @query('.cards-host') private _cardsHostEl?: HTMLElement;
  @query('.stack-portal') private _stackPortalEl?: HTMLElement;

  private _registeredTarget = '';
  private _cardElements: HACardElement[] = [];
  private _lastCardsJson = '';
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
    });
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
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
    let node: Node | null = this;
    while (node) {
      if (node instanceof HTMLElement) {
        const tag = node.tagName.toLowerCase();
        if (
          tag === 'hui-card-preview' ||
          tag === 'hui-dialog-edit-card' ||
          tag === 'hui-card-edit-mode' ||
          node.classList.contains('edit-mode')
        ) {
          domEdit = true;
          break;
        }
      }
      node = node.parentNode ?? (node instanceof ShadowRoot ? node.host : null);
    }
    const nextEdit = urlEdit || domEdit;
    if (nextEdit !== this._isEditMode) {
      this._isEditMode = nextEdit;
      if (nextEdit) {
        if (this._isOpen) this.closePopup(false);
        this._restoreAdoptedSiblings();
        this._restoreContainerStyles();
      } else {
        this._syncContainerLayout();
      }
    }
  }

  /**
   * Detects whether this card is the first card of either:
   * - a native Home Assistant Section (`hui-grid-section` / `hui-section`)
   * - a native Home Assistant `vertical-stack` (`hui-vertical-stack-card`)
   */
  private _findEnclosingContainer(): EnclosingContainer | null {
    // Walk up past hui-card / hui-card-edit-mode wrappers to find the direct card wrapper
    let cardWrapper: HTMLElement | null = this.parentElement;
    while (cardWrapper && cardWrapper.parentElement) {
      const container = cardWrapper.parentElement;
      const rootNode = container.getRootNode();
      if (rootNode instanceof ShadowRoot && rootNode.host) {
        const hostTag = rootNode.host.tagName.toLowerCase();
        if (hostTag === 'hui-grid-section') {
          if (container.firstElementChild === cardWrapper) {
            // Find outer <hui-section> element to collapse it out of Sections grid in view mode
            let outerSection: HTMLElement | undefined;
            const gridHost = rootNode.host as HTMLElement;
            const gridRoot = gridHost.getRootNode();
            if (gridRoot instanceof ShadowRoot && gridRoot.host?.tagName.toLowerCase() === 'hui-section') {
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

    // In View Mode while closed: collapse the section out of grid flow while keeping <dialog> usable
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
    if (this._isOpen) return;
    this._isOpen = true;
    await this.updateComplete;
    await this._syncEmbeddedCards();
    this._adoptContainerSiblings();

    const dlg = this._dialogEl;
    if (dlg && !dlg.open) {
      dlg.showModal();
    }
    if (this._surfaceEl) {
      animateDialogOpen(this._surfaceEl);
    }
  }

  public closePopup(clearUrlHash = true): void {
    if (!this._isOpen) return;
    const finish = () => {
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

  private async _syncEmbeddedCards(): Promise<void> {
    const cardsCfg = this._config?.cards ?? [];
    if (cardsCfg.length === 0) return;

    const json = JSON.stringify(cardsCfg);
    if (json !== this._lastCardsJson) {
      this._lastCardsJson = json;
      const helpers = await (
        window as unknown as { loadCardHelpers?: () => Promise<HACardHelpers> }
      ).loadCardHelpers?.();

      const nextEls: HACardElement[] = [];
      for (const cfg of cardsCfg) {
        try {
          let el: HACardElement | null = null;
          if (helpers?.createCardElement) {
            el = await helpers.createCardElement(cfg);
          } else if (cfg.type?.startsWith('custom:')) {
            const tag = cfg.type.slice(7);
            el = document.createElement(tag) as HACardElement;
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
    }

    if (this._cardsHostEl) {
      const existing = Array.from(this._cardsHostEl.children);
      const same =
        existing.length === this._cardElements.length &&
        existing.every((el, idx) => el === this._cardElements[idx]);
      if (!same) {
        this._cardsHostEl.replaceChildren(...this._cardElements);
      }
    }

    if (this.hass) {
      for (const el of this._cardElements) {
        el.hass = this.hass;
      }
    }
  }

  protected updated(changedProps: PropertyValues): void {
    if (changedProps.has('_config') || changedProps.has('hass')) {
      this._syncRegistration();
    }
    if (
      this._isOpen &&
      (changedProps.has('hass') || changedProps.has('_config') || changedProps.has('_isOpen'))
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
          @click=${() => (isPreview ? void this.openPopup() : this.closePopup(true))}
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
          ${stateLabel || isPreview
            ? html`
                <span class="dialog-sub">
                  ${stateLabel}${stateLabel && isPreview ? ' · ' : ''}${isPreview
                    ? this._config?.hash || '#popup'
                    : ''}
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

    return html`
      ${this._isEditMode
        ? html`<div class="edit-header-host">${this._renderHeaderBar(true)}</div>`
        : nothing}

      <dialog
        class="m3e-popup-dialog"
        @click=${(e: MouseEvent) => {
          if (e.target === this._dialogEl) this.closePopup(true);
        }}
        @cancel=${(e: Event) => {
          e.preventDefault();
          this.closePopup(true);
        }}
        @touchmove=${guardDialogTouchMove}
      >
        <div class="dialog-surface">
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
    css`
      :host {
        display: block;
        height: auto;
      }

      /* Clean native header preview in Dashboard Edit Mode (fits 1 HA Section row = 56px cleanly) */
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

      /* Unified M3E Popup Dialog Shell (matches Status Card & Light Group compact popup) */
      dialog.m3e-popup-dialog {
        margin: auto;
        padding: 0;
        border: 0;
        background: transparent;
        overflow: visible;
        width: min(460px, calc(100vw - 24px));
        max-width: min(460px, calc(100vw - 24px));
        max-height: calc(100dvh - 24px);
        overscroll-behavior: contain;
        pointer-events: auto;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      dialog.m3e-popup-dialog::backdrop {
        background: color-mix(in srgb, var(--md-sys-color-scrim, #000000) 58%, transparent);
        transition: opacity 220ms ease;
      }

      dialog.m3e-popup-dialog.is-closing::backdrop {
        opacity: 0;
      }

      .dialog-surface {
        position: relative;
        background: var(--md-sys-color-surface, #131316);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        border-radius: 32px;
        padding: 20px 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        max-height: calc(100dvh - 24px);
        overflow-y: auto;
        overflow-x: hidden;
        overscroll-behavior: contain;
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.36);
      }

      @media (max-width: 600px) {
        dialog.m3e-popup-dialog {
          margin: auto 0 0 0;
          width: 100vw;
          max-width: 100vw;
          max-height: 92dvh;
          border-radius: 28px 28px 0 0;
          overflow: hidden;
        }

        .dialog-surface {
          border-radius: 28px 28px 0 0;
          max-height: 92dvh;
          box-shadow: none;
          padding: 18px 16px calc(24px + env(safe-area-inset-bottom, 0px));
        }
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

      /* Popup Body: unified elevated surface tokens for all child cards */
      .popup-body {
        display: flex;
        flex-direction: column;
        gap: 12px;
        --ha-card-background: var(--md-sys-color-surface-container-high, #24252d);
        --ha-card-box-shadow: none;
        --ha-card-border-width: 0px;
        --m3e-card-border-radius: 24px;
      }

      .cards-host {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .stack-portal {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      /* Preserve native Home Assistant 12-column Sections grid & card resize spans */
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
