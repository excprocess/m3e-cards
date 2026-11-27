import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type {
  HomeAssistant,
  M3EStackCardConfig,
  M3EStackItemConfig,
} from '../types/home-assistant';

@customElement('m3e-stack-card-editor')
export class M3EStackCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3EStackCardConfig;
  @state() private _expandedIndex = 0;

  public setConfig(config: M3EStackCardConfig): void {
    this._config = {
      ...config,
      items: Array.isArray(config.items) ? config.items.map((i) => ({ ...i })) : [],
    };
  }

  private _emitConfig(next: M3EStackCardConfig): void {
    this._config = next;
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _onTopChanged(ev: CustomEvent<{ value: Record<string, unknown> }>): void {
    if (!this._config) return;
    const val = ev.detail.value;
    const next: M3EStackCardConfig = {
      ...this._config,
      title: (val.title as string) || '',
      icon: (val.icon as string) || '',
      show_unit: Boolean(val.show_unit),
    };
    if (!next.title) delete next.title;
    if (!next.icon) delete next.icon;
    this._emitConfig(next);
  }

  private _onItemChanged(index: number, ev: CustomEvent<{ value: Record<string, unknown> }>): void {
    if (!this._config) return;
    const items = [...(this._config.items ?? [])];
    const updated: M3EStackItemConfig = {
      ...items[index],
      ...(ev.detail.value as Partial<M3EStackItemConfig>),
    } as M3EStackItemConfig;

    if (!updated.name) delete updated.name;
    if (!updated.attribute) delete updated.attribute;

    items[index] = updated;
    this._emitConfig({ ...this._config, items });
  }

  private _addItem(): void {
    if (!this._config) return;
    const items = [...(this._config.items ?? []), { entity: '' }];
    this._expandedIndex = items.length - 1;
    this._emitConfig({ ...this._config, items });
  }

  private _removeItem(index: number, ev: Event): void {
    ev.stopPropagation();
    if (!this._config) return;
    const items = [...(this._config.items ?? [])];
    items.splice(index, 1);
    if (this._expandedIndex >= items.length) {
      this._expandedIndex = Math.max(0, items.length - 1);
    }
    this._emitConfig({ ...this._config, items });
  }

  private _onItemMoved = (ev: CustomEvent<{ oldIndex: number; newIndex: number }>): void => {
    ev.stopPropagation();
    if (!this._config) return;
    const { oldIndex, newIndex } = ev.detail;
    const items = [...(this._config.items ?? [])];
    if (
      oldIndex < 0 ||
      newIndex < 0 ||
      oldIndex >= items.length ||
      newIndex >= items.length ||
      oldIndex === newIndex
    ) {
      return;
    }
    const [moved] = items.splice(oldIndex, 1);
    items.splice(newIndex, 0, moved);
    if (this._expandedIndex === oldIndex) {
      this._expandedIndex = newIndex;
    } else if (this._expandedIndex > oldIndex && this._expandedIndex <= newIndex) {
      this._expandedIndex -= 1;
    } else if (this._expandedIndex < oldIndex && this._expandedIndex >= newIndex) {
      this._expandedIndex += 1;
    }
    this._emitConfig({ ...this._config, items });
  };

  private _buildTopSchema(): unknown[] {
    return [
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'title', selector: { text: {} } },
          { name: 'icon', selector: { icon: {} } },
        ],
      },
      { name: 'show_unit', selector: { boolean: {} } },
    ];
  }

  private _buildItemSchema(item: M3EStackItemConfig): unknown[] {
    const schema: unknown[] = [{ name: 'entity', required: true, selector: { entity: {} } }];

    if (item.entity) {
      schema.push({
        type: 'grid',
        name: '',
        schema: [
          { name: 'name', selector: { text: {} } },
          { name: 'attribute', selector: { attribute: { entity_id: item.entity } } },
        ],
      });
    } else {
      schema.push({ name: 'name', selector: { text: {} } });
    }

    return schema;
  }

  private _computeTopLabel = (schema: { name: string }): string => {
    const labels: Record<string, string> = {
      title: 'Titolo in alto a sinistra',
      icon: 'Icona in alto a sinistra (vuoto = Casa M3)',
      show_unit: 'Mostra unità di misura accanto ai valori',
    };
    return labels[schema.name] ?? schema.name;
  };

  private _computeItemLabel = (schema: { name: string }): string => {
    const labels: Record<string, string> = {
      entity: 'Sensore / Entità',
      name: 'Nome personalizzato (opzionale)',
      attribute: 'Attributo (vuoto = stato / temp. attuale)',
    };
    return labels[schema.name] ?? schema.name;
  };

  private _itemTitle(item: M3EStackItemConfig, index: number): string {
    if (item.name) return item.name;
    if (item.entity) {
      const st = this.hass?.states[item.entity];
      return (st?.attributes.friendly_name as string | undefined) || item.entity;
    }
    return `Sensore #${index + 1}`;
  }

  protected render() {
    if (!this.hass || !this._config) return nothing;
    const items = this._config.items ?? [];

    return html`
      <div class="editor-root">
        <ha-expansion-panel outlined expanded>
          <ha-icon slot="leading-icon" icon="mdi:text-short"></ha-icon>
          <span slot="header">Content</span>
          <div class="panel-body">
            <ha-form
              .hass=${this.hass}
              .data=${{
                title: this._config.title ?? '',
                icon: this._config.icon ?? '',
                show_unit: Boolean(this._config.show_unit),
              }}
              .schema=${this._buildTopSchema()}
              .computeLabel=${this._computeTopLabel}
              @value-changed=${this._onTopChanged}
            ></ha-form>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel outlined expanded>
          <ha-icon slot="leading-icon" icon="mdi:format-list-bulleted"></ha-icon>
          <span slot="header">Sensori (${items.length})</span>
          <div class="panel-body">
            ${items.length === 0
              ? html`<div class="empty-hint">Nessun sensore aggiunto.</div>`
              : html`
                  <ha-sortable
                    handle-selector=".drag-handle"
                    @item-moved=${this._onItemMoved}
                  >
                    <div class="items-list">
                      ${items.map((item, idx) => {
                        const expanded = this._expandedIndex === idx;
                        const stateObj = item.entity ? this.hass?.states[item.entity] : undefined;
                        const formData = {
                          entity: item.entity ?? '',
                          name: item.name ?? '',
                          attribute: item.attribute ?? '',
                        };

                        return html`
                          <div class="item-row ${expanded ? 'is-expanded' : ''}">
                            <div
                              class="item-header"
                              role="button"
                              tabindex="0"
                              @click=${() => {
                                this._expandedIndex = expanded ? -1 : idx;
                              }}
                            >
                              <div class="drag-handle" @click=${(e: Event) => e.stopPropagation()}>
                                <ha-icon icon="mdi:drag"></ha-icon>
                              </div>

                              <div class="item-icon" aria-hidden="true">
                                ${stateObj
                                  ? html`<ha-state-icon
                                      .hass=${this.hass}
                                      .stateObj=${stateObj}
                                    ></ha-state-icon>`
                                  : html`<ha-icon icon="mdi:gauge"></ha-icon>`}
                              </div>

                              <div class="item-summary">
                                <span class="item-title">${this._itemTitle(item, idx)}</span>
                                <span class="item-sub">
                                  ${item.entity
                                    ? item.attribute
                                      ? `${item.entity} · ${item.attribute}`
                                      : item.entity
                                    : 'Seleziona un sensore'}
                                </span>
                              </div>

                              <div class="item-actions">
                                <ha-icon-button
                                  class="row-action"
                                  .label=${expanded ? 'Comprimi' : 'Modifica'}
                                  @click=${(e: Event) => {
                                    e.stopPropagation();
                                    this._expandedIndex = expanded ? -1 : idx;
                                  }}
                                >
                                  <ha-icon
                                    icon=${expanded ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                                  ></ha-icon>
                                </ha-icon-button>
                                <ha-icon-button
                                  class="row-action danger"
                                  .label=${'Rimuovi'}
                                  @click=${(e: Event) => this._removeItem(idx, e)}
                                >
                                  <ha-icon icon="mdi:delete-outline"></ha-icon>
                                </ha-icon-button>
                              </div>
                            </div>

                            ${expanded
                              ? html`
                                  <div class="item-body">
                                    <ha-form
                                      .hass=${this.hass}
                                      .data=${formData}
                                      .schema=${this._buildItemSchema(item)}
                                      .computeLabel=${this._computeItemLabel}
                                      @value-changed=${(
                                        e: CustomEvent<{ value: Record<string, unknown> }>,
                                      ) => this._onItemChanged(idx, e)}
                                    ></ha-form>
                                  </div>
                                `
                              : nothing}
                          </div>
                        `;
                      })}
                    </div>
                  </ha-sortable>
                `}

            <div class="add-row">
              <ha-button appearance="filled" size="small" @click=${this._addItem}>
                <ha-icon slot="start" icon="mdi:plus"></ha-icon>
                Aggiungi sensore
              </ha-button>
            </div>
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

    .empty-hint {
      font-size: 13px;
      color: var(--secondary-text-color);
      padding: 4px 2px;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .item-row {
      border-radius: var(--ha-border-radius-lg, 12px);
      border: 1px solid var(--outline-color, var(--divider-color));
      background: var(--card-background-color, transparent);
      overflow: hidden;
      transition: border-color 150ms ease;
    }

    .item-row.is-expanded {
      border-color: var(--primary-color);
    }

    .item-header {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 52px;
      padding: 4px 6px 4px 8px;
      cursor: pointer;
      user-select: none;
    }

    .item-header:hover {
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

    .item-icon {
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
    }

    .item-summary {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }

    .item-title {
      font-size: 14px;
      font-weight: 500;
      line-height: 1.3;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-sub {
      font-size: 12px;
      line-height: 1.3;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-actions {
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

    .item-body {
      padding: 12px 14px 14px;
      border-top: 1px solid var(--divider-color);
    }

    .add-row {
      display: flex;
      justify-content: flex-start;
      padding-top: 2px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-stack-card-editor': M3EStackCardEditor;
  }
}
