import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type {
  HomeAssistant,
  LovelaceCardConfig,
  M3ETabItemConfig,
  M3ETabsCardConfig,
} from '../types/home-assistant';
import {
  expandEditDialogPreviewPane,
  openOfficialHAContainerCardDialog,
} from '../utils/ha-native-card-dialog';
import {
  registerTabsEditor,
  unregisterTabsEditor,
  type M3ETabsEditorHandle,
} from '../utils/popup-editor-bridge';

const MAX_TABS = 4;
const DEFAULT_TAB_ICONS = [
  'mdi:heart-outline',
  'mdi:view-grid-outline',
  'mdi:lightbulb-outline',
  'mdi:thermometer',
];

@customElement('m3e-tabs-card-editor')
export class M3ETabsCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3ETabsCardConfig;
  @state() private _activeTab = 0;

  private _bridgeHandle: M3ETabsEditorHandle = {
    getConfig: () => this._config,
    getActiveTab: () => this._activeTab,
    setActiveTab: (idx) => {
      const maxIdx = Math.max(0, (this._config?.tabs?.length ?? 1) - 1);
      this._activeTab = Math.max(0, Math.min(maxIdx, idx));
    },
    updateTabCards: (tabIdx, cards) => this._updateTabCards(tabIdx, cards),
    openAddCard: (tabIdx) => {
      void this._openAddCard(tabIdx);
    },
    openEditCard: (tabIdx, cardIdx) => {
      void this._openEditCard(tabIdx, cardIdx);
    },
  };

  public connectedCallback(): void {
    super.connectedCallback();
    registerTabsEditor(this._bridgeHandle);
    requestAnimationFrame(() => expandEditDialogPreviewPane());
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    unregisterTabsEditor(this._bridgeHandle);
  }

  public setConfig(config: M3ETabsCardConfig): void {
    const rawTabs = Array.isArray(config.tabs) ? config.tabs.slice(0, MAX_TABS) : [];
    const tabs: M3ETabItemConfig[] =
      rawTabs.length > 0
        ? rawTabs.map((t, i) => ({
            title: t.title ?? `Tab ${i + 1}`,
            icon: t.icon || DEFAULT_TAB_ICONS[i % DEFAULT_TAB_ICONS.length],
            cards: Array.isArray(t.cards) ? t.cards : [],
          }))
        : [{ title: 'Tab 1', icon: DEFAULT_TAB_ICONS[0], cards: [] }];

    this._config = {
      tabs_alignment: 'center',
      default_tab: 0,
      remember_tab: false,
      ...config,
      tabs,
    };

    if (this._activeTab >= tabs.length) {
      this._activeTab = Math.max(0, tabs.length - 1);
    }
  }

  private _emit(next: M3ETabsCardConfig): void {
    this._config = next;
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        bubbles: true,
        composed: true,
        detail: { config: next },
      }),
    );
  }

  private _updateTabCards(tabIdx: number, cards: LovelaceCardConfig[]): void {
    if (!this._config) return;
    const tabs = this._config.tabs.map((tab, i) => (i === tabIdx ? { ...tab, cards } : tab));
    this._emit({ ...this._config, tabs });
  }

  private async _openAddCard(tabIdx: number): Promise<void> {
    if (!this.hass || !this._config) return;
    this._activeTab = tabIdx;
    await openOfficialHAContainerCardDialog({
      hass: this.hass,
      parentConfig: this._config,
      cards: this._config.tabs[tabIdx]?.cards ?? [],
      applyCards: (parent, nextCards) => ({
        ...parent,
        tabs: parent.tabs.map((t, i) => (i === tabIdx ? { ...t, cards: nextCards } : t)),
      }),
      mode: 'add',
      onCardsUpdated: (cards) => this._updateTabCards(tabIdx, cards),
    });
  }

  private async _openEditCard(tabIdx: number, cardIdx: number): Promise<void> {
    if (!this.hass || !this._config) return;
    this._activeTab = tabIdx;
    await openOfficialHAContainerCardDialog({
      hass: this.hass,
      parentConfig: this._config,
      cards: this._config.tabs[tabIdx]?.cards ?? [],
      applyCards: (parent, nextCards) => ({
        ...parent,
        tabs: parent.tabs.map((t, i) => (i === tabIdx ? { ...t, cards: nextCards } : t)),
      }),
      mode: 'edit',
      index: cardIdx,
      onCardsUpdated: (cards) => this._updateTabCards(tabIdx, cards),
    });
  }

  private _addTab(): void {
    if (!this._config || this._config.tabs.length >= MAX_TABS) return;
    const idx = this._config.tabs.length;
    const tabs: M3ETabItemConfig[] = [
      ...this._config.tabs,
      {
        title: `Tab ${idx + 1}`,
        icon: DEFAULT_TAB_ICONS[idx % DEFAULT_TAB_ICONS.length],
        cards: [],
      },
    ];
    this._activeTab = idx;
    this._emit({ ...this._config, tabs });
  }

  private _removeTab(idx: number, ev: Event): void {
    ev.stopPropagation();
    if (!this._config || this._config.tabs.length <= 1) return;
    const tabs = this._config.tabs.filter((_, i) => i !== idx);
    if (this._activeTab >= tabs.length) {
      this._activeTab = tabs.length - 1;
    }
    const defaultTab = Math.min(this._config.default_tab ?? 0, tabs.length - 1);
    this._emit({ ...this._config, tabs, default_tab: defaultTab });
  }

  private _onTabMoved = (ev: CustomEvent<{ oldIndex: number; newIndex: number }>): void => {
    ev.stopPropagation();
    if (!this._config) return;
    const { oldIndex, newIndex } = ev.detail;
    const tabs = [...this._config.tabs];
    if (
      oldIndex === newIndex ||
      oldIndex < 0 ||
      newIndex < 0 ||
      oldIndex >= tabs.length ||
      newIndex >= tabs.length
    ) {
      return;
    }
    const [moved] = tabs.splice(oldIndex, 1);
    tabs.splice(newIndex, 0, moved);
    if (this._activeTab === oldIndex) {
      this._activeTab = newIndex;
    } else if (this._activeTab > oldIndex && this._activeTab <= newIndex) {
      this._activeTab -= 1;
    } else if (this._activeTab < oldIndex && this._activeTab >= newIndex) {
      this._activeTab += 1;
    }
    this._emit({ ...this._config, tabs });
  };

  private _onTabFieldChanged(
    idx: number,
    ev: CustomEvent<{ value: { title?: string; icon?: string } }>,
  ): void {
    ev.stopPropagation();
    if (!this._config) return;
    const val = ev.detail.value;
    const tabs = this._config.tabs.map((tab, i) =>
      i === idx
        ? {
            ...tab,
            title: val.title ?? tab.title,
            icon: val.icon ?? tab.icon,
          }
        : tab,
    );
    this._emit({ ...this._config, tabs });
  }

  private _onOptionsChanged = (
    ev: CustomEvent<{ value: Partial<M3ETabsCardConfig> }>,
  ): void => {
    ev.stopPropagation();
    if (!this._config) return;
    const val = ev.detail.value;
    const nextDefault =
      val.default_tab !== undefined ? Number(val.default_tab) : this._config.default_tab;
    this._emit({
      ...this._config,
      ...val,
      default_tab: Number.isFinite(nextDefault) ? nextDefault : 0,
    });
  };

  private _computeTabLabel = (schema: { name: string }): string => {
    const labels: Record<string, string> = {
      title: 'Titolo tab',
      icon: 'Icona',
    };
    return labels[schema.name] ?? schema.name;
  };

  private _computeOptionLabel = (schema: { name: string }): string => {
    const labels: Record<string, string> = {
      tabs_alignment: 'Allineamento tab',
      default_tab: 'Tab predefinita all’apertura',
      remember_tab: 'Ricorda l’ultima tab selezionata',
    };
    return labels[schema.name] ?? schema.name;
  };

  protected render() {
    if (!this.hass || !this._config) return nothing;
    const tabs = this._config.tabs;

    const optionsSchema = [
      {
        name: 'tabs_alignment',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'center', label: 'Centrato (stile Google Home)' },
              { value: 'start', label: 'Sinistra' },
              { value: 'end', label: 'Destra' },
            ],
          },
        },
      },
      {
        name: 'default_tab',
        selector: {
          select: {
            mode: 'dropdown',
            options: tabs.map((t, i) => ({
              value: String(i),
              label: `${i + 1}. ${t.title || `Tab ${i + 1}`}`,
            })),
          },
        },
      },
      { name: 'remember_tab', selector: { boolean: {} } },
    ];

    return html`
      <div class="editor-root">
        <ha-expansion-panel outlined expanded>
          <ha-icon slot="leading-icon" icon="mdi:tab"></ha-icon>
          <span slot="header">Tab (${tabs.length} / ${MAX_TABS})</span>
          <div class="panel-body">
            <ha-sortable handle-selector=".drag-handle" @item-moved=${this._onTabMoved}>
              <div class="tabs-list">
                ${tabs.map((tab, idx) => {
                  const active = idx === this._activeTab;
                  const cardCount = tab.cards?.length ?? 0;
                  const icon = tab.icon || DEFAULT_TAB_ICONS[idx % DEFAULT_TAB_ICONS.length];

                  return html`
                    <div class="tab-row ${active ? 'is-active' : ''}">
                      <div
                        class="tab-row-header"
                        role="button"
                        tabindex="0"
                        @click=${() => {
                          this._activeTab = idx;
                          this._emit({ ...this._config! });
                        }}
                      >
                        <div class="drag-handle" @click=${(e: Event) => e.stopPropagation()}>
                          <ha-icon icon="mdi:drag"></ha-icon>
                        </div>

                        <div class="tab-row-icon" aria-hidden="true">
                          <ha-icon .icon=${icon}></ha-icon>
                        </div>

                        <div class="tab-row-summary">
                          <span class="tab-row-title">${tab.title || `Tab ${idx + 1}`}</span>
                          <span class="tab-row-sub">
                            ${cardCount === 1 ? '1 card' : `${cardCount} card`}
                            ${active ? ' · In anteprima' : ''}
                          </span>
                        </div>

                        <div class="tab-row-actions">
                          ${tabs.length > 1
                            ? html`
                                <ha-icon-button
                                  class="row-action danger"
                                  .label=${'Elimina tab'}
                                  @click=${(e: Event) => this._removeTab(idx, e)}
                                >
                                  <ha-icon icon="mdi:delete-outline"></ha-icon>
                                </ha-icon-button>
                              `
                            : nothing}
                        </div>
                      </div>

                      ${active
                        ? html`
                            <div class="tab-row-body">
                              <ha-form
                                .hass=${this.hass}
                                .data=${{
                                  title: tab.title ?? '',
                                  icon: tab.icon ?? '',
                                }}
                                .schema=${[
                                  {
                                    type: 'grid',
                                    name: '',
                                    schema: [
                                      { name: 'title', selector: { text: {} } },
                                      { name: 'icon', selector: { icon: {} } },
                                    ],
                                  },
                                ]}
                                .computeLabel=${this._computeTabLabel}
                                @value-changed=${(
                                  e: CustomEvent<{ value: { title?: string; icon?: string } }>,
                                ) => this._onTabFieldChanged(idx, e)}
                              ></ha-form>
                            </div>
                          `
                        : nothing}
                    </div>
                  `;
                })}
              </div>
            </ha-sortable>

            ${tabs.length < MAX_TABS
              ? html`
                  <div class="add-row">
                    <ha-button appearance="filled" size="small" @click=${this._addTab}>
                      <ha-icon slot="start" icon="mdi:plus"></ha-icon>
                      Aggiungi tab
                    </ha-button>
                  </div>
                `
              : nothing}

            <div class="preview-hint">
              Seleziona una tab qui o nell’anteprima a destra per aggiungere, trascinare,
              ridimensionare o modificare le card al suo interno.
            </div>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel outlined>
          <ha-icon slot="leading-icon" icon="mdi:tune"></ha-icon>
          <span slot="header">Aspetto e Comportamento</span>
          <div class="panel-body">
            <ha-form
              .hass=${this.hass}
              .data=${{
                tabs_alignment: this._config.tabs_alignment ?? 'center',
                default_tab: String(this._config.default_tab ?? 0),
                remember_tab: Boolean(this._config.remember_tab),
              }}
              .schema=${optionsSchema}
              .computeLabel=${this._computeOptionLabel}
              @value-changed=${this._onOptionsChanged}
            ></ha-form>
          </div>
        </ha-expansion-panel>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .editor-root {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    ha-expansion-panel {
      display: block;
      --expansion-panel-summary-padding: 0 16px;
      --expansion-panel-content-padding: 0;
    }

    .panel-body {
      padding: 12px 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .tabs-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .tab-row {
      border-radius: var(--ha-border-radius-lg, 12px);
      border: 1px solid var(--outline-color, var(--divider-color));
      background: var(--card-background-color, transparent);
      overflow: hidden;
      transition: border-color 150ms ease;
    }

    .tab-row.is-active {
      border-color: var(--primary-color);
    }

    .tab-row-header {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 52px;
      padding: 4px 6px 4px 8px;
      cursor: pointer;
      user-select: none;
    }

    .tab-row-header:hover {
      background: var(--secondary-background-color, rgba(128, 128, 128, 0.06));
    }

    .drag-handle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 36px;
      color: var(--secondary-text-color);
      cursor: grab;
      flex-shrink: 0;
      --mdc-icon-size: 20px;
    }

    .drag-handle:active {
      cursor: grabbing;
    }

    .tab-row-icon {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: var(--secondary-background-color, rgba(128, 128, 128, 0.12));
      color: var(--secondary-text-color);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      --mdc-icon-size: 19px;
      transition:
        background-color 150ms ease,
        color 150ms ease,
        border-radius 220ms ease;
    }

    .tab-row.is-active .tab-row-icon {
      border-radius: 10px;
      background: var(--md-sys-color-secondary-container, var(--primary-color));
      color: var(--md-sys-color-on-secondary-container, #ffffff);
    }

    .tab-row-summary {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }

    .tab-row-title {
      font-size: 14px;
      font-weight: 500;
      line-height: 1.3;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .tab-row-sub {
      font-size: 12px;
      line-height: 1.3;
      color: var(--secondary-text-color);
    }

    .tab-row-actions {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .row-action {
      color: var(--secondary-text-color);
      --mdc-icon-button-size: 36px;
      --mdc-icon-size: 20px;
    }

    .row-action.danger:hover {
      color: var(--error-color);
    }

    .tab-row-body {
      padding: 12px 14px 14px;
      border-top: 1px solid var(--divider-color);
    }

    .add-row {
      display: flex;
      justify-content: flex-start;
      padding-top: 2px;
    }

    .preview-hint {
      font-size: 12.5px;
      line-height: 1.4;
      color: var(--secondary-text-color);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-tabs-card-editor': M3ETabsCardEditor;
  }
}
