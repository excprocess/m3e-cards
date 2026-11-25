import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type {
  HassEntity,
  HomeAssistant,
  M3EStackCardConfig,
  M3EStackItemConfig,
} from '../types/home-assistant';
import { m3eBaseStyles } from '../styles/m3e-tokens';
import '../editors/m3e-stack-card-editor';

@customElement('m3e-stack-card')
export class M3EStackCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3EStackCardConfig;

  public setConfig(config: M3EStackCardConfig): void {
    if (!config) {
      throw new Error('m3e-stack-card: configurazione mancante');
    }
    this._config = {
      ...config,
      show_unit: Boolean(config.show_unit),
      items: Array.isArray(config.items) ? config.items : [],
    };
  }

  public getCardSize(): number {
    const count = this._config?.items?.length ?? 2;
    return Math.max(2, Math.ceil((count + 1) / 2));
  }

  public getGridOptions() {
    return {
      rows: 'auto' as const,
      columns: 12,
      min_columns: 6,
    };
  }

  public static getConfigElement(): HTMLElement {
    return document.createElement('m3e-stack-card-editor');
  }

  public static getStubConfig(hass?: HomeAssistant): M3EStackCardConfig {
    const states = hass?.states ?? {};
    const tempIds = Object.keys(states)
      .filter(
        (id) =>
          (id.startsWith('sensor.') && states[id]?.attributes.device_class === 'temperature') ||
          id.startsWith('climate.'),
      )
      .slice(0, 3);

    const items: M3EStackItemConfig[] =
      tempIds.length > 0
        ? tempIds.map((entity) => ({ entity }))
        : [{ entity: 'sensor.temperature' }];

    return {
      type: 'custom:m3e-stack-card',
      title: 'Indoor temperatures',
      show_unit: false,
      items,
    };
  }

  protected shouldUpdate(changedProps: Map<string, unknown>): boolean {
    if (!this._config) return false;
    if (changedProps.has('_config')) return true;
    if (changedProps.has('hass')) {
      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
      if (!oldHass || !this.hass) return true;
      for (const item of this._config.items) {
        if (!item.entity) continue;
        if (oldHass.states[item.entity] !== this.hass.states[item.entity]) {
          return true;
        }
      }
      return oldHass.themes?.darkMode !== this.hass.themes?.darkMode;
    }
    return true;
  }

  private _formatValue(item: M3EStackItemConfig, entity?: HassEntity): string {
    if (!entity) return '—';
    const domain = entity.entity_id.split('.')[0];
    let raw: unknown;

    if (item.attribute) {
      raw = entity.attributes[item.attribute];
    } else if (domain === 'climate' && entity.attributes.current_temperature !== undefined) {
      raw = entity.attributes.current_temperature;
    } else {
      raw = entity.state;
    }

    if (raw === undefined || raw === null || raw === '') return '—';
    const str = String(raw).trim();
    const low = str.toLowerCase();
    if (low === 'unavailable' || low === 'unknown') return 'Offline';

    let formatted = str;
    if (/^-?\d+\.\d+$/.test(str)) {
      const num = Number(str);
      if (!Number.isNaN(num)) {
        formatted = Number.isInteger(num) ? String(num) : String(Number(num.toFixed(1)));
      }
    }

    if (this._config?.show_unit && !item.attribute) {
      const uom = entity.attributes.unit_of_measurement;
      if (typeof uom === 'string' && uom.trim()) {
        const u = uom.trim();
        return u === '°' || u === '%' || u === '°C' || u === '°F'
          ? `${formatted}${u}`
          : `${formatted} ${u}`;
      }
    }

    return formatted;
  }

  private _renderHeaderIcon() {
    const customIcon = this._config?.icon?.trim();
    if (customIcon) {
      return html`<ha-icon .icon=${customIcon}></ha-icon>`;
    }

    // Standard Google Home outlined house icon matching screenshot
    return html`
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 5.69 17 10.19V18h-2v-6H9v6H7v-7.81l5-4.5M12 3 2 12h3v8h6v-6h2v6h6v-8h3L12 3Z"
        />
      </svg>
    `;
  }

  protected render() {
    if (!this._config) return nothing;
    const title = this._config.title?.trim() || 'Indoor temperatures';
    const items = this._config.items ?? [];

    return html`
      <ha-card class="stack-card">
        <header class="stack-header">
          <span class="stack-icon" aria-hidden="true">${this._renderHeaderIcon()}</span>
          <span class="stack-title">${title}</span>
        </header>

        ${items.length === 0
          ? html`<div class="empty-hint">Aggiungi due o più sensori dalla configurazione</div>`
          : html`
              <div class="stack-list">
                ${items.map((item) => {
                  const entity = item.entity ? this.hass?.states[item.entity] : undefined;
                  const label =
                    item.name ||
                    (entity?.attributes.friendly_name as string | undefined) ||
                    item.entity ||
                    'Sensore';
                  const value = this._formatValue(item, entity);

                  return html`
                    <div class="stack-row">
                      <span class="row-name">${label}</span>
                      <span class="row-value">${value}</span>
                    </div>
                  `;
                })}
              </div>
            `}
      </ha-card>
    `;
  }

  static styles = [
    m3eBaseStyles,
    css`
      :host {
        display: block;
        width: 100%;
      }

      .stack-card {
        padding: 20px 22px 22px;
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      .stack-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0;
        margin: 0;
      }

      .stack-icon {
        width: 24px;
        height: 24px;
        display: grid;
        place-items: center;
        flex-shrink: 0;
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
      }

      .stack-icon svg {
        width: 24px;
        height: 24px;
        display: block;
      }

      .stack-icon ha-icon {
        --mdc-icon-size: 22px;
        line-height: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .stack-title {
        font-size: 17px;
        font-weight: 500;
        line-height: 22px;
        letter-spacing: -0.005em;
        color: var(--md-sys-color-on-surface, var(--primary-text-color));
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .stack-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .stack-row {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 16px;
      }

      .row-name {
        font-size: 16px;
        font-weight: 400;
        line-height: 22px;
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
      }

      .row-value {
        font-size: 16.5px;
        font-weight: 600;
        line-height: 22px;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-surface, var(--primary-text-color));
        flex-shrink: 0;
      }

      .empty-hint {
        font-size: 13.5px;
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-stack-card': M3EStackCard;
  }
}
