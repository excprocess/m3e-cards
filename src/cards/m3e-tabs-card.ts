import { LitElement, css, html, nothing, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import '../editors/m3e-tabs-card-editor';
import { m3eBaseStyles } from '../styles/m3e-tokens';
import type {
  HomeAssistant,
  LovelaceCardConfig,
  M3ETabItemConfig,
  M3ETabsCardConfig,
} from '../types/home-assistant';
import {
  findMatchingTabsEditor,
  readDashboardCardClipboard,
  writeDashboardCardClipboard,
} from '../utils/popup-editor-bridge';

interface HACardElement extends HTMLElement {
  hass?: HomeAssistant;
  setConfig?: (config: LovelaceCardConfig) => void;
  getGridOptions?: () => {
    columns?: number | 'full';
    rows?: number | 'auto';
    min_columns?: number;
    max_columns?: number;
  };
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

interface CardHelpers {
  createCardElement: (config: LovelaceCardConfig) => HACardElement;
}

interface CachedCardEntry {
  key: string;
  el: HACardElement;
}

let sharedHelpersPromise: Promise<CardHelpers | null> | null = null;

function getCardHelpersCached(): Promise<CardHelpers | null> {
  if (!sharedHelpersPromise) {
    const loader = (window as unknown as { loadCardHelpers?: () => Promise<CardHelpers> })
      .loadCardHelpers;
    sharedHelpersPromise = loader ? loader().catch(() => null) : Promise.resolve(null);
  }
  return sharedHelpersPromise;
}

const DEFAULT_TAB_ICONS = [
  'mdi:heart-outline',
  'mdi:view-grid-outline',
  'mdi:lightbulb-outline',
  'mdi:thermometer',
];

function resolveCardGridSpan(
  cfg: LovelaceCardConfig,
  el?: HACardElement,
): { cols: number; rows?: number } {
  const go = cfg.grid_options as { columns?: number | 'full'; rows?: number | 'auto' } | undefined;
  let cols: number | undefined;
  if (go?.columns === 'full') cols = 12;
  else if (typeof go?.columns === 'number' && Number.isFinite(go.columns)) cols = go.columns;

  if (cols === undefined && el && typeof el.getGridOptions === 'function') {
    try {
      const def = el.getGridOptions();
      if (def?.columns === 'full') cols = 12;
      else if (typeof def?.columns === 'number' && Number.isFinite(def.columns)) cols = def.columns;
    } catch {
      // ignore
    }
  }

  if (cols === undefined) {
    const t = String(cfg.type ?? '');
    if (
      t === 'tile' ||
      t === 'custom:m3e-light-card' ||
      t === 'custom:m3e-status-card' ||
      t === 'custom:m3e-toggle-card' ||
      t === 'custom:m3e-scene-card' ||
      t === 'custom:m3e-status-badge' ||
      t === 'button' ||
      t === 'entity'
    ) {
      cols = 6;
    } else {
      cols = 12;
    }
  }

  const clampedCols = Math.max(3, Math.min(12, Math.round(cols)));
  const rows =
    typeof go?.rows === 'number' && Number.isFinite(go.rows) && go.rows > 0
      ? Math.round(go.rows)
      : undefined;
  return { cols: clampedCols, rows };
}

@customElement('m3e-tabs-card')
export class M3ETabsCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3ETabsCardConfig;
  @state() private _activeTab = 0;
  @state() private _isDialogPreview = false;

  @query('.tab-content-stage') private _stageEl?: HTMLElement;

  private _tabCaches = new Map<number, CachedCardEntry[]>();
  private _activeCardEls: HACardElement[] = [];
  private _editModeEls: HACardEditModeElement[] = [];
  private _cardWrappers: HTMLElement[] = [];
  private _lastRenderedKey = '';
  private _prewarmHandle: number | null = null;
  private _prevDarkMode?: boolean;

  public static getStubConfig(): M3ETabsCardConfig {
    return {
      type: 'custom:m3e-tabs-card',
      tabs_alignment: 'center',
      default_tab: 0,
      remember_tab: false,
      tabs: [
        { title: 'Preferiti', icon: 'mdi:heart-outline', cards: [] },
        { title: 'Dispositivi', icon: 'mdi:view-grid-outline', cards: [] },
        { title: 'Luci', icon: 'mdi:lightbulb-outline', cards: [] },
        { title: 'Clima', icon: 'mdi:thermometer', cards: [] },
      ],
    };
  }

  public static getConfigElement(): HTMLElement {
    return document.createElement('m3e-tabs-card-editor');
  }

  public setConfig(config: M3ETabsCardConfig): void {
    if (!config || !Array.isArray(config.tabs)) {
      throw new Error('m3e-tabs-card: devi definire almeno una tab');
    }
    const tabs: M3ETabItemConfig[] = config.tabs.slice(0, 4).map((tab, idx) => ({
      title: tab.title?.trim() || `Tab ${idx + 1}`,
      icon: tab.icon?.trim() || DEFAULT_TAB_ICONS[idx % DEFAULT_TAB_ICONS.length],
      cards: Array.isArray(tab.cards) ? tab.cards : [],
    }));
    if (tabs.length === 0) {
      tabs.push({ title: 'Tab 1', icon: DEFAULT_TAB_ICONS[0], cards: [] });
    }

    const prevConfig = this._config;
    this._config = {
      tabs_alignment: 'center',
      default_tab: 0,
      remember_tab: false,
      ...config,
      tabs,
    };

    if (!prevConfig) {
      let initial = Math.max(0, Math.min(tabs.length - 1, this._config.default_tab ?? 0));
      if (this._config.remember_tab) {
        const saved = this._readSavedTab();
        if (saved !== null && saved >= 0 && saved < tabs.length) {
          initial = saved;
        }
      }
      this._activeTab = initial;
    } else if (this._activeTab >= tabs.length) {
      this._activeTab = Math.max(0, tabs.length - 1);
    }

    this._schedulePrewarm();
  }

  public getCardSize(): number {
    return 4;
  }

  public getGridOptions() {
    return {
      columns: 12,
      min_columns: 6,
      rows: 'auto' as const,
    };
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this._detectPreviewContext();
    this._syncTabFromEditor();
    this._schedulePrewarm();
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._prewarmHandle !== null) {
      const cancelIdle = (window as unknown as { cancelIdleCallback?: (id: number) => void })
        .cancelIdleCallback;
      if (typeof cancelIdle === 'function') cancelIdle(this._prewarmHandle);
      else window.clearTimeout(this._prewarmHandle);
      this._prewarmHandle = null;
    }
  }

  private _detectPreviewContext(): void {
    let cur: Node | null = this;
    while (cur) {
      if (cur instanceof HTMLElement) {
        const tag = cur.tagName.toLowerCase();
        if (tag === 'hui-card-preview' || tag === 'hui-dialog-edit-card') {
          this._isDialogPreview = true;
          return;
        }
      }
      if (cur.parentNode) cur = cur.parentNode;
      else if (cur instanceof ShadowRoot) cur = cur.host;
      else cur = null;
    }
    this._isDialogPreview = false;
  }

  private _syncTabFromEditor(): void {
    if (!this._isDialogPreview) return;
    const editor = findMatchingTabsEditor();
    if (!editor) return;
    const editorTab = editor.getActiveTab();
    const maxIdx = Math.max(0, (this._config?.tabs.length ?? 1) - 1);
    const clamped = Math.max(0, Math.min(maxIdx, editorTab));
    if (clamped !== this._activeTab) {
      this._activeTab = clamped;
    }
  }

  private _storageKey(): string {
    const sig = (this._config?.tabs ?? []).map((t) => t.title).join('|');
    return `m3e_tabs_active::${sig}`;
  }

  private _readSavedTab(): number | null {
    try {
      const raw = localStorage.getItem(this._storageKey());
      if (raw === null) return null;
      const n = Number(raw);
      return Number.isInteger(n) ? n : null;
    } catch {
      return null;
    }
  }

  private _writeSavedTab(idx: number): void {
    if (!this._config?.remember_tab || this._isDialogPreview) return;
    try {
      localStorage.setItem(this._storageKey(), String(idx));
    } catch {
      // ignore
    }
  }

  /**
   * Hass Gate: never re-render the outer tab bar on unrelated `hass` ticks.
   * Only forwards `hass` directly to the currently active tab's card instances!
   */
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (
      changedProps.has('_config') ||
      changedProps.has('_activeTab') ||
      changedProps.has('_isDialogPreview')
    ) {
      return true;
    }

    if (changedProps.has('hass') && this.hass) {
      for (const el of this._activeCardEls) el.hass = this.hass;
      for (const em of this._editModeEls) em.hass = this.hass;

      const dark = this.hass.themes?.darkMode;
      if (dark !== this._prevDarkMode) {
        this._prevDarkMode = dark;
        return true;
      }
      return false;
    }

    return false;
  }

  private _schedulePrewarm(): void {
    if (this._isDialogPreview || !this._config || this._config.tabs.length <= 1) return;
    if (this._prewarmHandle !== null) return;
    const run = () => {
      this._prewarmHandle = null;
      if (!this._config || this._isDialogPreview) return;
      this._config.tabs.forEach((tab, idx) => {
        if (idx !== this._activeTab && (tab.cards?.length ?? 0) > 0) {
          void this._ensureTabInstances(idx, tab.cards ?? []);
        }
      });
    };
    const reqIdle = (
      window as unknown as {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      }
    ).requestIdleCallback;
    this._prewarmHandle =
      typeof reqIdle === 'function'
        ? reqIdle(run, { timeout: 1500 })
        : window.setTimeout(run, 400);
  }

  private async _ensureTabInstances(
    tabIndex: number,
    cardsCfg: LovelaceCardConfig[],
  ): Promise<HACardElement[]> {
    const helpers = await getCardHelpersCached();
    if (!helpers) return [];

    const existing = this._tabCaches.get(tabIndex) ?? [];
    const byKey = new Map<string, HACardElement[]>();
    for (const item of existing) {
      const list = byKey.get(item.key) ?? [];
      list.push(item.el);
      byKey.set(item.key, list);
    }

    const nextEntries: CachedCardEntry[] = [];
    for (const cfg of cardsCfg) {
      const key = JSON.stringify(cfg);
      const pool = byKey.get(key);
      let el: HACardElement | undefined = pool?.shift();
      if (!el) {
        try {
          el = helpers.createCardElement(cfg);
        } catch {
          const fallback = document.createElement('div') as HACardElement;
          fallback.textContent = `Card error: ${cfg.type}`;
          fallback.style.padding = '12px';
          el = fallback;
        }
      }
      if (this.hass) el.hass = this.hass;
      nextEntries.push({ key, el });
    }

    this._tabCaches.set(tabIndex, nextEntries);
    return nextEntries.map((e) => e.el);
  }

  private _selectTab(nextIndex: number): void {
    const tabs = this._config?.tabs ?? [];
    if (nextIndex < 0 || nextIndex >= tabs.length || nextIndex === this._activeTab) return;

    const dir = nextIndex > this._activeTab ? 1 : -1;
    navigator.vibrate?.(8);
    this._activeTab = nextIndex;
    this._writeSavedTab(nextIndex);

    if (this._isDialogPreview) {
      findMatchingTabsEditor()?.setActiveTab(nextIndex);
    }

    // Crisp GPU-composited directional content reveal
    requestAnimationFrame(() => {
      const stage = this._stageEl;
      if (!stage) return;
      for (const a of stage.getAnimations()) a.cancel();
      stage.animate(
        [
          { transform: `translate3d(${dir * 16}px, 0, 0)`, opacity: 0.3 },
          { transform: 'translate3d(0, 0, 0)', opacity: 1 },
        ],
        {
          duration: 240,
          easing: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
        },
      );
    });
  }

  private _persistTabCards(
    tabIndex: number,
    nextCards: LovelaceCardConfig[],
    rebuild = true,
  ): void {
    if (!this._config) return;
    const nextTabs = this._config.tabs.map((tab, idx) =>
      idx === tabIndex ? { ...tab, cards: nextCards } : tab,
    );
    this._config = { ...this._config, tabs: nextTabs };

    const editor = findMatchingTabsEditor();
    if (editor) {
      editor.updateTabCards(tabIndex, nextCards);
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
      void this._syncActiveTabCards(true);
    }
  }

  private _buildSortablePreviewContainer(
    tabIndex: number,
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
    grid.className = 'tabs-cards-grid edit-mode';
    this._editModeEls = [];
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

      this._editModeEls.push(editModeEl);
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
      findMatchingTabsEditor()?.openAddCard(tabIndex);
    });
    grid.appendChild(addBtn);

    // Zero-rebuild in-place drag reorder
    sortable.addEventListener('item-moved', (ev: Event) => {
      ev.stopPropagation();
      const { oldIndex, newIndex } = (
        ev as CustomEvent<{ oldIndex: number; newIndex: number }>
      ).detail;
      const cur = [...(this._config?.tabs[tabIndex]?.cards ?? [])];
      if (
        oldIndex === newIndex ||
        oldIndex < 0 ||
        newIndex < 0 ||
        oldIndex >= cur.length ||
        newIndex >= cur.length
      ) {
        return;
      }
      const [moved] = cur.splice(oldIndex, 1);
      cur.splice(newIndex, 0, moved);

      const cache = this._tabCaches.get(tabIndex);
      if (cache) {
        const [movedCache] = cache.splice(oldIndex, 1);
        if (movedCache) cache.splice(newIndex, 0, movedCache);
        this._activeCardEls = cache.map((c) => c.el);
      }

      const [movedEdit] = this._editModeEls.splice(oldIndex, 1);
      if (movedEdit) this._editModeEls.splice(newIndex, 0, movedEdit);

      const [movedWrap] = this._cardWrappers.splice(oldIndex, 1);
      if (movedWrap) {
        this._cardWrappers.splice(newIndex, 0, movedWrap);
        const refNode = this._cardWrappers[newIndex + 1] ?? addBtn;
        grid.insertBefore(movedWrap, refNode);
      }
      for (let i = 0; i < this._editModeEls.length; i++) {
        this._editModeEls[i].path = [0, 0, i];
      }
      this._lastRenderedKey = `${tabIndex}|preview|${JSON.stringify(cur)}`;
      this._persistTabCards(tabIndex, cur, false);
    });

    const getCardIdx = (ev: Event): number => {
      const path = (ev as CustomEvent<{ path?: number[] }>).detail?.path;
      return Array.isArray(path) && path.length > 0 ? path[path.length - 1] : -1;
    };

    grid.addEventListener('ll-edit-card', (ev: Event) => {
      ev.stopPropagation();
      const idx = getCardIdx(ev);
      if (idx >= 0) findMatchingTabsEditor()?.openEditCard(tabIndex, idx);
    });

    grid.addEventListener('ll-delete-card', (ev: Event) => {
      ev.stopPropagation();
      const idx = getCardIdx(ev);
      const cur = [...(this._config?.tabs[tabIndex]?.cards ?? [])];
      if (idx < 0 || idx >= cur.length) return;
      cur.splice(idx, 1);
      this._persistTabCards(tabIndex, cur);
    });

    grid.addEventListener('ll-duplicate-card', (ev: Event) => {
      ev.stopPropagation();
      const idx = getCardIdx(ev);
      const cur = [...(this._config?.tabs[tabIndex]?.cards ?? [])];
      if (idx < 0 || idx >= cur.length) return;
      const copy = JSON.parse(JSON.stringify(cur[idx])) as LovelaceCardConfig;
      cur.splice(idx + 1, 0, copy);
      this._persistTabCards(tabIndex, cur);
    });

    grid.addEventListener('ll-copy-card', (ev: Event) => {
      ev.stopPropagation();
      const idx = getCardIdx(ev);
      const cur = this._config?.tabs[tabIndex]?.cards ?? [];
      if (idx < 0 || idx >= cur.length) return;
      writeDashboardCardClipboard(cur[idx]);
    });

    grid.addEventListener('ll-cut-card', (ev: Event) => {
      ev.stopPropagation();
      const idx = getCardIdx(ev);
      const cur = [...(this._config?.tabs[tabIndex]?.cards ?? [])];
      if (idx < 0 || idx >= cur.length) return;
      writeDashboardCardClipboard(cur[idx]);
      cur.splice(idx, 1);
      this._persistTabCards(tabIndex, cur);
    });

    grid.addEventListener('ll-paste-card', (ev: Event) => {
      ev.stopPropagation();
      const clip = readDashboardCardClipboard();
      if (!clip) return;
      const cur = [...(this._config?.tabs[tabIndex]?.cards ?? []), clip];
      this._persistTabCards(tabIndex, cur);
    });

    // Zero-rebuild in-place resize
    grid.addEventListener('ll-change-grid-options', (ev: Event) => {
      ev.stopPropagation();
      const detail = (
        ev as CustomEvent<{ path?: number[]; grid_options?: Record<string, unknown> }>
      ).detail;
      const idx = getCardIdx(ev);
      const cur = [...(this._config?.tabs[tabIndex]?.cards ?? [])];
      if (idx < 0 || idx >= cur.length || !detail?.grid_options) return;
      const nextCfg: LovelaceCardConfig = {
        ...cur[idx],
        grid_options: {
          ...((cur[idx].grid_options as Record<string, unknown>) ?? {}),
          ...detail.grid_options,
        },
      };
      cur[idx] = nextCfg;

      const wrapper = this._cardWrappers[idx];
      const cardEl = this._activeCardEls[idx];
      if (wrapper) {
        const { cols, rows } = resolveCardGridSpan(nextCfg, cardEl);
        wrapper.style.gridColumn = `span ${cols}`;
        wrapper.style.gridRow = rows ? `span ${rows}` : '';
      }
      this._lastRenderedKey = `${tabIndex}|preview|${JSON.stringify(cur)}`;
      this._persistTabCards(tabIndex, cur, false);
    });

    sortable.appendChild(grid);
    return sortable;
  }

  private async _syncActiveTabCards(forceRebuild = false): Promise<void> {
    const stage = this._stageEl;
    if (!stage || !this._config) return;

    const tabIdx = Math.max(0, Math.min(this._config.tabs.length - 1, this._activeTab));
    const cardsCfg = this._config.tabs[tabIdx]?.cards ?? [];
    const renderKey = `${tabIdx}|${this._isDialogPreview ? 'preview' : 'view'}|${JSON.stringify(cardsCfg)}`;

    if (forceRebuild || renderKey !== this._lastRenderedKey || stage.childElementCount === 0) {
      this._lastRenderedKey = renderKey;
      const cardEls = await this._ensureTabInstances(tabIdx, cardsCfg);
      this._activeCardEls = cardEls;

      if (this._isDialogPreview) {
        const sortable = this._buildSortablePreviewContainer(tabIdx, cardsCfg, cardEls);
        stage.replaceChildren(sortable);
      } else {
        this._editModeEls = [];
        this._cardWrappers = [];
        const grid = document.createElement('div');
        grid.className = 'tabs-cards-grid';
        for (let i = 0; i < cardEls.length; i++) {
          const { cols, rows } = resolveCardGridSpan(cardsCfg[i], cardEls[i]);
          const cell = document.createElement('div');
          cell.className = 'card';
          cell.style.gridColumn = `span ${cols}`;
          if (rows) cell.style.gridRow = `span ${rows}`;
          cell.appendChild(cardEls[i]);
          grid.appendChild(cell);
        }
        stage.replaceChildren(grid);
      }
    }

    if (this.hass) {
      for (const el of this._activeCardEls) el.hass = this.hass;
      for (const em of this._editModeEls) em.hass = this.hass;
    }
  }

  protected updated(changedProps: PropertyValues): void {
    if (changedProps.has('_config') && this._isDialogPreview) {
      this._syncTabFromEditor();
    }
    if (
      changedProps.has('_config') ||
      changedProps.has('_activeTab') ||
      changedProps.has('_isDialogPreview')
    ) {
      void this._syncActiveTabCards();
    }
  }

  protected render() {
    if (!this._config) return nothing;
    const tabs = this._config.tabs;
    const alignment = this._config.tabs_alignment || 'center';

    return html`
      <div class="m3e-tabs-root">
        <div
          class="tabs-bar align-${alignment}"
          role="tablist"
          aria-label="Tabs"
        >
          ${tabs.map((tab, idx) => {
            const active = idx === this._activeTab;
            const icon = tab.icon || DEFAULT_TAB_ICONS[idx % DEFAULT_TAB_ICONS.length];
            return html`
              <button
                type="button"
                role="tab"
                class="tab-btn ${active ? 'is-active' : ''}"
                aria-selected=${String(active)}
                aria-label=${tab.title}
                @click=${() => this._selectTab(idx)}
              >
                <span class="tab-icon" aria-hidden="true">
                  <ha-icon .icon=${icon}></ha-icon>
                </span>
                <span class="tab-label-wrap">
                  <span class="tab-label">${tab.title}</span>
                </span>
              </button>
            `;
          })}
        </div>

        <div class="tab-content-stage" role="tabpanel"></div>
      </div>
    `;
  }

  static styles = [
    m3eBaseStyles,
    css`
      :host {
        display: block;
        height: auto;
      }

      .m3e-tabs-root {
        display: flex;
        flex-direction: column;
        gap: 14px;
        width: 100%;
      }

      /* =====================================================================
         FLAT GOOGLE HOME M3 EXPRESSIVE CONNECTED TAB PILLS
         Inactive: 52x52 circle (icon only)
         Active: 16px squircle pill (icon + smoothly revealed title)
         ===================================================================== */
      .tabs-bar {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        gap: 8px;
        width: 100%;
        padding: 2px 0;
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      .tabs-bar::-webkit-scrollbar {
        display: none;
      }

      .tabs-bar.align-center {
        justify-content: center;
      }

      .tabs-bar.align-start {
        justify-content: flex-start;
      }

      .tabs-bar.align-end {
        justify-content: flex-end;
      }

      .tab-btn {
        position: relative;
        flex: 0 0 auto;
        height: 52px;
        min-width: 52px;
        padding: 0 15px;
        border: 0;
        border-radius: 26px;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font: inherit;
        font-size: 14.5px;
        font-weight: 500;
        letter-spacing: 0.01em;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        outline: none;
        -webkit-tap-highlight-color: transparent;
        transition:
          padding var(--m3e-spring-spatial-default),
          border-radius var(--m3e-spring-bouncy),
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default);
      }

      .tab-btn:hover:not(.is-active) {
        background: color-mix(
          in srgb,
          var(--md-sys-color-on-surface, #e3e2e6) 8%,
          var(--md-sys-color-surface-container-high, #282930)
        );
      }

      .tab-btn:focus-visible {
        outline: 2px solid var(--md-sys-color-primary, #a8c7fa);
        outline-offset: 2px;
      }

      .tab-btn.is-active {
        padding: 0 20px;
        border-radius: 16px;
        background: var(--md-sys-color-secondary-container, #3d4758);
        color: var(--md-sys-color-on-secondary-container, #dbe2f9);
        font-weight: 600;
      }

      .tab-btn:active {
        transform: scale(0.94);
        border-radius: 14px;
      }

      .tab-icon {
        width: 22px;
        height: 22px;
        flex: 0 0 22px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        --mdc-icon-size: 22px;
      }

      /* Smooth 0fr -> 1fr spring reveal for active tab label */
      .tab-label-wrap {
        display: grid;
        grid-template-columns: 0fr;
        margin-inline-start: 0;
        transition:
          grid-template-columns var(--m3e-spring-spatial-default),
          margin-inline-start var(--m3e-spring-spatial-default);
      }

      .tab-btn.is-active .tab-label-wrap {
        grid-template-columns: 1fr;
        margin-inline-start: 10px;
      }

      .tab-label {
        overflow: hidden;
        white-space: nowrap;
        min-width: 0;
        opacity: 0;
        transform: translateX(-4px);
        transition:
          opacity var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
      }

      .tab-btn.is-active .tab-label {
        opacity: 1;
        transform: translateX(0);
      }

      /* =====================================================================
         INNER 12-COLUMN SECTIONS-COMPATIBLE CARD GRID
         ===================================================================== */
      .tab-content-stage {
        width: 100%;
        will-change: transform, opacity;
      }

      .tabs-cards-grid {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        grid-auto-rows: minmax(56px, auto);
        gap: 10px;
        align-items: stretch;
      }

      .tabs-cards-grid > .card {
        position: relative;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }

      .tabs-cards-grid > .card > *,
      .tabs-cards-grid hui-card-edit-mode {
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
      }

      /* M3 Expressive Tonal Pill "+ Add card" button (in editor live preview) */
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
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-tabs-card': M3ETabsCard;
  }
}
