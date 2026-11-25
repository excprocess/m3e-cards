import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type {
  HomeAssistant,
  M3EGlanceCardConfig,
  M3EGlanceItemConfig,
} from '../types/home-assistant';

@customElement('m3e-glance-card-editor')
export class M3EGlanceCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3EGlanceCardConfig;
  @state() private _expandedIndex = 0;

  public setConfig(config: M3EGlanceCardConfig): void {
    this._config = {
      ...config,
      items: Array.isArray(config.items) ? config.items.map((i) => ({ ...i })) : [],
    };
  }

  private _emitConfig(next: M3EGlanceCardConfig): void {
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
    this._emitConfig({
      ...this._config,
      transparent: val.transparent as boolean,
    });
  }

  private _onItemChanged(index: number, ev: CustomEvent<{ value: Record<string, unknown> }>): void {
    if (!this._config) return;
    const items = [...(this._config.items ?? [])];
    const updated: M3EGlanceItemConfig = {
      ...items[index],
      ...(ev.detail.value as Partial<M3EGlanceItemConfig>),
    } as M3EGlanceItemConfig;

    // Clean empty optional fields so YAML stays tidy
    if (!updated.name) delete updated.name;
    if (!updated.attribute) delete updated.attribute;
    if (!updated.secondary_attribute) delete updated.secondary_attribute;
    if (!updated.icon) delete updated.icon;
    if (!updated.unit) delete updated.unit;
    if (!updated.navigation_path) delete updated.navigation_path;

    items[index] = updated;
    this._emitConfig({ ...this._config, items });
  }

  private _addItem(): void {
    if (!this._config) return;
    const items = [...(this._config.items ?? []), { entity: '', tap_action: 'more-info' as const }];
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

  private _moveItem(index: number, delta: -1 | 1, ev: Event): void {
    ev.stopPropagation();
    if (!this._config) return;
    const items = [...(this._config.items ?? [])];
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
    if (this._expandedIndex === index) {
      this._expandedIndex = target;
    } else if (this._expandedIndex === target) {
      this._expandedIndex = index;
    }
    this._emitConfig({ ...this._config, items });
  }

  private _buildItemSchema(item: M3EGlanceItemConfig): unknown[] {
    const schema: unknown[] = [
      { name: 'entity', required: true, selector: { entity: {} } },
    ];

    if (item.entity) {
      schema.push({
        type: 'grid',
        name: '',
        schema: [
          {
            name: 'attribute',
            selector: { attribute: { entity_id: item.entity } },
          },
          {
            name: 'secondary_attribute',
            selector: { attribute: { entity_id: item.entity } },
          },
        ],
      });
    }

    schema.push(
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'name', selector: { text: {} } },
          { name: 'unit', selector: { text: {} } },
        ],
      },
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'icon', selector: { icon: {} } },
          {
            name: 'tap_action',
            selector: {
              select: {
                mode: 'dropdown',
                options: [
                  { value: 'more-info', label: 'Dettagli entità (More-info)' },
                  { value: 'toggle', label: 'Toggle stato' },
                  { value: 'navigate', label: 'Percorso / Bubble / Script' },
                  { value: 'none', label: 'Nessuna azione' },
                ],
              },
            },
          },
        ],
      },
    );

    if (item.tap_action === 'navigate') {
      schema.push({ name: 'navigation_path', selector: { text: {} } });
    }

    return schema;
  }

  private _computeItemLabel = (schema: { name: string }): string => {
    const labels: Record<string, string> = {
      entity: 'Entità',
      attribute: 'Attributo valore (vuoto = stato)',
      secondary_attribute: 'Attributo extra etichetta (es. AQI • Valore)',
      name: 'Nome personalizzato',
      unit: 'Unità / Suffisso (es. °)',
      icon: 'Icona personalizzata (vuoto = M3 auto)',
      tap_action: 'Azione al tap',
      navigation_path: 'Percorso (/lovelace/..., #popup, script.*)',
    };
    return labels[schema.name] ?? schema.name;
  };

  private _computeTopLabel = (schema: { name: string }): string => {
    if (schema.name === 'transparent') {
      return 'Sfondo trasparente (integrato nella dashboard come Google Home)';
    }
    return schema.name;
  };

  private _itemTitle(item: M3EGlanceItemConfig, index: number): string {
    if (item.name) return item.name;
    if (item.entity) {
      const st = this.hass?.states[item.entity];
      return (st?.attributes.friendly_name as string | undefined) || item.entity;
    }
    return `Entità #${index + 1}`;
  }

  protected render() {
    if (!this.hass || !this._config) return nothing;
    const items = this._config.items ?? [];

    return html`
      <div class="editor-root">
        <ha-form
          .hass=${this.hass}
          .data=${{ transparent: this._config.transparent !== false }}
          .schema=${[{ name: 'transparent', selector: { boolean: {} } }]}
          .computeLabel=${this._computeTopLabel}
          @value-changed=${this._onTopChanged}
        ></ha-form>

        <div class="section-header">
          <span class="section-title">Entità At a Glance (${items.length})</span>
        </div>

        <div class="items-list">
          ${items.map((item, idx) => {
            const expanded = this._expandedIndex === idx;
            const formData = {
              entity: item.entity ?? '',
              attribute: item.attribute ?? '',
              secondary_attribute: item.secondary_attribute ?? '',
              name: item.name ?? '',
              unit: item.unit ?? '',
              icon: item.icon ?? '',
              tap_action: item.tap_action ?? 'more-info',
              navigation_path: item.navigation_path ?? '',
            };

            return html`
              <div class="item-card ${expanded ? 'is-expanded' : ''}">
                <div
                  class="item-header"
                  role="button"
                  tabindex="0"
                  @click=${() => {
                    this._expandedIndex = expanded ? -1 : idx;
                  }}
                >
                  <div class="item-header-left">
                    <span class="item-index">${idx + 1}</span>
                    <div class="item-summary">
                      <span class="item-title">${this._itemTitle(item, idx)}</span>
                      <span class="item-sub">
                        ${item.entity
                          ? item.attribute
                            ? `${item.entity} · ${item.attribute}`
                            : item.entity
                          : 'Seleziona un’entità'}
                      </span>
                    </div>
                  </div>
                  <div class="item-actions">
                    <button
                      type="button"
                      class="icon-btn"
                      title="Sposta su"
                      ?disabled=${idx === 0}
                      @click=${(e: Event) => this._moveItem(idx, -1, e)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      class="icon-btn"
                      title="Sposta giù"
                      ?disabled=${idx === items.length - 1}
                      @click=${(e: Event) => this._moveItem(idx, 1, e)}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      class="icon-btn danger"
                      title="Rimuovi"
                      @click=${(e: Event) => this._removeItem(idx, e)}
                    >
                      ×
                    </button>
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
                          @value-changed=${(e: CustomEvent<{ value: Record<string, unknown> }>) =>
                            this._onItemChanged(idx, e)}
                        ></ha-form>
                      </div>
                    `
                  : nothing}
              </div>
            `;
          })}
        </div>

        <button type="button" class="add-btn" @click=${this._addItem}>
          + Aggiungi entità
        </button>
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
      gap: 14px;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 4px;
    }

    .section-title {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.02em;
      color: var(--secondary-text-color);
      text-transform: uppercase;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .item-card {
      border-radius: 16px;
      border: 1px solid var(--divider-color, rgba(128, 128, 128, 0.25));
      background: var(--secondary-background-color, rgba(128, 128, 128, 0.06));
      overflow: hidden;
    }

    .item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 10px 12px;
      cursor: pointer;
      user-select: none;
    }

    .item-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      flex: 1;
    }

    .item-index {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--primary-color, #4285f4);
      color: #ffffff;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .item-summary {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .item-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-sub {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-actions {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }

    .icon-btn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: none;
      background: transparent;
      color: var(--secondary-text-color);
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 150ms ease;
    }

    .icon-btn:hover:not(:disabled) {
      background: rgba(128, 128, 128, 0.16);
      color: var(--primary-text-color);
    }

    .icon-btn:disabled {
      opacity: 0.3;
      cursor: default;
    }

    .icon-btn.danger:hover {
      color: var(--error-color, #d93025);
      background: rgba(217, 48, 37, 0.12);
    }

    .item-body {
      padding: 4px 12px 14px;
      border-top: 1px solid var(--divider-color, rgba(128, 128, 128, 0.18));
    }

    .add-btn {
      align-self: flex-start;
      padding: 10px 18px;
      border-radius: 9999px;
      border: none;
      background: var(--primary-color, #4285f4);
      color: #ffffff;
      font-family: inherit;
      font-size: 13.5px;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 150ms ease, transform 150ms ease;
    }

    .add-btn:hover {
      opacity: 0.92;
    }

    .add-btn:active {
      transform: scale(0.97);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-glance-card-editor': M3EGlanceCardEditor;
  }
}
