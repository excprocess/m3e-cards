import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import type {
  HassEntity,
  HomeAssistant,
  M3EGlanceCardConfig,
  M3EGlanceItemConfig,
} from '../types/home-assistant';
import { m3eBaseStyles } from '../styles/m3e-tokens';
import { renderM3EntityIcon } from '../utils/icons';
import { executeNavigationTarget } from '../utils/navigation';
import '../editors/m3e-glance-card-editor';

const ACTIVE_STATES = new Set([
  'on',
  'open',
  'opening',
  'unlocked',
  'detected',
  'home',
  'playing',
  'heat',
  'cool',
  'heat_cool',
  'auto',
  'dry',
  'fan_only',
  'active',
  'true',
]);

@customElement('m3e-glance-card')
export class M3EGlanceCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3EGlanceCardConfig;
  @query('.glance-strip') private _stripEl?: HTMLDivElement;

  private _isMouseDragging = false;
  private _dragMoved = false;
  private _dragStartX = 0;
  private _dragScrollLeft = 0;

  public setConfig(config: M3EGlanceCardConfig): void {
    if (!config) {
      throw new Error('m3e-glance-card: configurazione mancante');
    }
    this._config = {
      ...config,
      transparent: config.transparent !== false,
      items: Array.isArray(config.items) ? config.items : [],
    };
  }

  public getCardSize(): number {
    return 1;
  }

  public getGridOptions() {
    return {
      rows: 'auto' as const,
      columns: 12,
      min_columns: 6,
    };
  }

  public static getConfigElement(): HTMLElement {
    return document.createElement('m3e-glance-card-editor');
  }

  public static getStubConfig(hass?: HomeAssistant): M3EGlanceCardConfig {
    const states = hass?.states ?? {};
    const ids = Object.keys(states);
    const items: M3EGlanceItemConfig[] = [];

    const weather = ids.find((id) => id.startsWith('weather.'));
    if (weather) {
      items.push({ entity: weather, unit: '°', tap_action: 'more-info' });
    }

    const aqiOrTemp = ids.find(
      (id) =>
        id.startsWith('sensor.') &&
        (states[id]?.attributes.device_class === 'aqi' ||
          states[id]?.attributes.device_class === 'temperature' ||
          id.includes('aqi')),
    );
    if (aqiOrTemp) {
      items.push({ entity: aqiOrTemp, tap_action: 'more-info' });
    }

    const humidity = ids.find(
      (id) =>
        id.startsWith('sensor.') &&
        states[id]?.attributes.device_class === 'humidity' &&
        id !== aqiOrTemp,
    );
    if (humidity) {
      items.push({ entity: humidity, tap_action: 'more-info' });
    }

    if (items.length === 0) {
      const fallback = ids.find((id) => id.startsWith('sensor.') || id.startsWith('sun.'));
      items.push({ entity: fallback ?? 'sun.sun', tap_action: 'more-info' });
    }

    return {
      type: 'custom:m3e-glance-card',
      transparent: true,
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

  private _formatRawValue(raw: unknown): string {
    if (raw === undefined || raw === null || raw === '') return '—';
    const str = String(raw).trim();
    const low = str.toLowerCase();

    if (low === 'unavailable') return 'Offline';
    if (low === 'unknown' || low === 'none') return '—';
    if (low === 'on') return 'On';
    if (low === 'off') return 'Off';
    if (low === 'home') return 'In casa';
    if (low === 'not_home') return 'Fuori';

    // ISO timestamp -> clean HH:MM
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(str)) {
      const d = new Date(str);
      if (!Number.isNaN(d.getTime())) {
        return d.toLocaleTimeString(this.hass?.language ?? 'it-IT', {
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    }

    // Trim long decimal numbers nicely
    if (/^-?\d+\.\d{2,}$/.test(str)) {
      const num = Number(str);
      if (!Number.isNaN(num)) {
        return Number.isInteger(num) ? String(num) : num.toFixed(1);
      }
    }

    return str;
  }

  private _getPrimaryValue(item: M3EGlanceItemConfig, entity?: HassEntity): string {
    if (!entity) return '—';

    const domain = entity.entity_id.split('.')[0];
    let raw: unknown;
    let defaultUnit = '';

    if (item.attribute) {
      raw = entity.attributes[item.attribute];
      if (item.attribute === 'temperature' || item.attribute === 'current_temperature') {
        defaultUnit = '°';
      } else if (item.attribute === 'humidity' || item.attribute === 'battery_level') {
        defaultUnit = '%';
      }
    } else if (domain === 'weather' && entity.attributes.temperature !== undefined) {
      // Google Home At-a-Glance weather style: "18°"
      raw = entity.attributes.temperature;
      defaultUnit = '°';
    } else {
      raw = entity.state;
      const uom = entity.attributes.unit_of_measurement;
      if (typeof uom === 'string' && uom.trim()) {
        defaultUnit = uom.trim();
      }
    }

    const formatted = this._formatRawValue(raw);
    if (formatted === '—' || formatted === 'Offline') return formatted;

    const unit = item.unit !== undefined ? item.unit : defaultUnit;
    if (!unit) return formatted;
    if (unit === '°' || unit === '%' || unit === '°C' || unit === '°F') {
      return `${formatted}${unit}`;
    }
    return `${formatted} ${unit}`;
  }

  private _getSecondaryLabel(item: M3EGlanceItemConfig, entity?: HassEntity): string {
    const baseName =
      item.name ||
      (entity?.attributes.friendly_name as string | undefined) ||
      item.entity ||
      'Entità';

    if (item.secondary_attribute && entity) {
      const extraRaw = entity.attributes[item.secondary_attribute];
      if (extraRaw !== undefined && extraRaw !== null && String(extraRaw).trim() !== '') {
        const extra = this._formatRawValue(extraRaw);
        const cap = extra.charAt(0).toUpperCase() + extra.slice(1);
        return `${baseName} • ${cap}`;
      }
    }

    return baseName;
  }

  private _onMouseDown(ev: MouseEvent): void {
    if (!this._stripEl || ev.button !== 0) return;
    this._isMouseDragging = true;
    this._dragMoved = false;
    this._dragStartX = ev.pageX - this._stripEl.offsetLeft;
    this._dragScrollLeft = this._stripEl.scrollLeft;
  }

  private _onMouseMove(ev: MouseEvent): void {
    if (!this._isMouseDragging || !this._stripEl) return;
    const x = ev.pageX - this._stripEl.offsetLeft;
    const walk = x - this._dragStartX;
    if (Math.abs(walk) > 6) {
      this._dragMoved = true;
      ev.preventDefault();
      this._stripEl.scrollLeft = this._dragScrollLeft - walk;
    }
  }

  private _onMouseUpOrLeave(): void {
    this._isMouseDragging = false;
  }

  private _onItemTap(item: M3EGlanceItemConfig): void {
    if (this._dragMoved) {
      this._dragMoved = false;
      return;
    }
    if (!this.hass || !item.entity) return;

    const action = item.tap_action ?? 'more-info';
    if (action === 'none') return;

    if (action === 'navigate' && item.navigation_path) {
      executeNavigationTarget(this, this.hass, item.navigation_path);
      return;
    }

    if (action === 'toggle') {
      const domain = item.entity.split('.')[0];
      if (
        ['light', 'switch', 'fan', 'input_boolean', 'cover', 'lock', 'media_player'].includes(
          domain,
        )
      ) {
        this.hass.callService('homeassistant', 'toggle', { entity_id: item.entity });
        return;
      }
    }

    this.dispatchEvent(
      new CustomEvent('hass-more-info', {
        detail: { entityId: item.entity },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected render() {
    if (!this._config) return nothing;
    const items = this._config.items ?? [];
    const transparent = this._config.transparent !== false;

    const content = html`
      <div
        class="glance-strip ${transparent ? 'is-transparent' : 'is-card'}"
        @mousedown=${this._onMouseDown}
        @mousemove=${this._onMouseMove}
        @mouseup=${this._onMouseUpOrLeave}
        @mouseleave=${this._onMouseUpOrLeave}
      >
        ${items.length === 0
          ? html`<div class="empty-hint">Aggiungi entità dalla configurazione della card</div>`
          : items.map((item) => {
              const entity = item.entity ? this.hass?.states[item.entity] : undefined;
              const isUnavailable =
                !entity || entity.state === 'unavailable' || entity.state === 'unknown';
              const isActive =
                !isUnavailable && ACTIVE_STATES.has(String(entity.state ?? '').toLowerCase());
              const primary = this._getPrimaryValue(item, entity);
              const secondary = this._getSecondaryLabel(item, entity);
              const clickable = (item.tap_action ?? 'more-info') !== 'none' && Boolean(item.entity);

              return html`
                <button
                  type="button"
                  class="glance-item ${isUnavailable ? 'is-dimmed' : ''} ${clickable ? 'is-clickable' : ''}"
                  @click=${() => this._onItemTap(item)}
                >
                  <span class="icon-circle" aria-hidden="true">
                    ${item.icon
                      ? html`<ha-icon .icon=${item.icon}></ha-icon>`
                      : renderM3EntityIcon(entity, isActive)}
                  </span>
                  <span class="text-col">
                    <span class="primary-value">${primary}</span>
                    <span class="secondary-label">${secondary}</span>
                  </span>
                </button>
              `;
            })}
      </div>
    `;

    if (transparent) {
      return content;
    }

    return html`<ha-card>${content}</ha-card>`;
  }

  static styles = [
    m3eBaseStyles,
    css`
      :host {
        display: block;
        width: 100%;
      }

      ha-card {
        border-radius: var(--m3e-shape-card, 28px);
        overflow: hidden;
      }

      .glance-strip {
        display: flex;
        align-items: center;
        gap: 26px;
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: none;
        -ms-overflow-style: none;
        scroll-snap-type: x proximity;
        touch-action: pan-x;
        -webkit-overflow-scrolling: touch;
      }

      .glance-strip::-webkit-scrollbar {
        display: none;
      }

      .glance-strip.is-transparent {
        padding: 4px 2px;
      }

      .glance-strip.is-card {
        padding: 14px 18px;
      }

      .glance-item {
        display: inline-flex;
        align-items: center;
        gap: 14px;
        flex: 0 0 auto;
        scroll-snap-align: start;
        border: none;
        background: transparent;
        padding: 4px 6px 4px 2px;
        margin: 0;
        border-radius: 9999px;
        text-align: left;
        font-family: inherit;
        color: inherit;
        transition: transform 200ms var(--m3e-spring-fast, cubic-bezier(0.2, 0, 0, 1));
        -webkit-tap-highlight-color: transparent;
      }

      .glance-item.is-clickable {
        cursor: pointer;
      }

      .glance-item.is-clickable:active {
        transform: scale(0.96);
      }

      .glance-item.is-dimmed {
        opacity: 0.6;
      }

      .icon-circle {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(
          --md-sys-color-surface-container-highest,
          var(--secondary-background-color, rgba(128, 128, 128, 0.16))
        );
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color, #444746));
        transition: background-color 180ms ease;
      }

      .glance-item.is-clickable:hover .icon-circle {
        background: var(
          --md-sys-color-surface-container-high,
          var(--md-sys-color-surface-container-highest, rgba(128, 128, 128, 0.22))
        );
      }

      .icon-circle svg {
        width: 23px;
        height: 23px;
        display: block;
      }

      .icon-circle ha-icon {
        --mdc-icon-size: 23px;
        line-height: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .text-col {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 2px;
        min-width: 0;
      }

      .primary-value {
        font-size: 19px;
        font-weight: 400;
        line-height: 1.18;
        letter-spacing: -0.01em;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-surface, var(--primary-text-color));
        white-space: nowrap;
      }

      .secondary-label {
        font-size: 13.5px;
        font-weight: 400;
        line-height: 1.24;
        letter-spacing: 0.01em;
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
        white-space: nowrap;
      }

      .empty-hint {
        font-size: 13px;
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
        padding: 10px 6px;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-glance-card': M3EGlanceCard;
  }
}
