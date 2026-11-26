import { LitElement, css, html, nothing, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { m3eBaseStyles } from '../styles/m3e-tokens';
import type {
  HassEntity,
  HomeAssistant,
  M3EStatusCardConfig,
  M3EThermostatCardConfig,
} from '../types/home-assistant';
import type { M3EStatusCard } from './m3e-status-card';
import './m3e-status-card';
import { t } from '../utils/i18n';

@customElement('m3e-thermostat-card')
export class M3EThermostatCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3EThermostatCardConfig;
  @state() private _optimisticTemp: number | null = null;
  @state() private _pressed = false;
  @query('.thermostat-card') private _cardEl?: HTMLElement;

  private _optimisticTimer: number | null = null;
  private _popupHost?: M3EStatusCard;
  private _boundPopupKey = '';
  private _prevEntity?: HassEntity;
  private _prevOutdoor?: HassEntity;

  public setConfig(config: M3EThermostatCardConfig): void {
    if (!config || !config.entity) {
      throw new Error('m3e-thermostat-card: devi specificare un’entità climate.*');
    }
    this._config = { ...config };
  }

  public getCardSize(): number {
    return 2;
  }

  public getGridOptions() {
    return {
      rows: 'auto' as const,
      columns: 12,
      min_columns: 6,
    };
  }

  public static getStubConfig(hass?: HomeAssistant): M3EThermostatCardConfig {
    const climateId = Object.keys(hass?.states ?? {}).find((id) => id.startsWith('climate.'));
    return {
      type: 'custom:m3e-thermostat-card',
      entity: climateId ?? 'climate.termostato',
    };
  }

  public static getConfigForm() {
    return {
      schema: [
        {
          name: 'entity',
          required: true,
          selector: { entity: { domain: 'climate' } },
        },
        {
          type: 'expandable',
          name: '',
          flatten: true,
          icon: 'mdi:text-short',
          title: 'Content',
          schema: [
            { name: 'name', selector: { text: {} } },
            { name: 'outdoor_entity', selector: { entity: { domain: 'sensor' } } },
          ],
        },
        {
          type: 'expandable',
          name: '',
          flatten: true,
          icon: 'mdi:gesture-tap',
          title: 'Interactions',
          schema: [
            {
              name: 'step',
              selector: { number: { min: 0.1, max: 2, step: 0.1, mode: 'box' } },
            },
          ],
        },
      ],
      computeLabel: (schema: { name: string }) => {
        const labels: Record<string, string> = {
          entity: 'Entità termostato / clima',
          name: 'Nome personalizzato',
          outdoor_entity: 'Sensore temperatura esterna (opzionale, per popup)',
          step: 'Passo temperatura (− / +, default automatico)',
        };
        return labels[schema.name] ?? schema.name;
      },
    };
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this._config) return false;
    if (changedProps.has('_config') || changedProps.has('_optimisticTemp')) return true;
    if (changedProps.has('hass') && this.hass) {
      const next = this.hass.states[this._config.entity];
      const nextOut = this._config.outdoor_entity
        ? this.hass.states[this._config.outdoor_entity]
        : undefined;
      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
      const darkChanged = oldHass?.themes?.darkMode !== this.hass.themes?.darkMode;

      if (next !== this._prevEntity || nextOut !== this._prevOutdoor || darkChanged) {
        this._prevEntity = next;
        this._prevOutdoor = nextOut;
        return true;
      }
      return false;
    }
    return true;
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._optimisticTimer !== null) {
      window.clearTimeout(this._optimisticTimer);
      this._optimisticTimer = null;
    }
  }

  private get _entity(): HassEntity | undefined {
    if (!this.hass || !this._config) return undefined;
    return this.hass.states[this._config.entity];
  }

  private get _isUnavailable(): boolean {
    const s = this._entity?.state;
    return !s || s === 'unavailable' || s === 'unknown';
  }

  private get _step(): number {
    if (typeof this._config?.step === 'number' && this._config.step > 0) {
      return this._config.step;
    }
    const attrStep = this._entity?.attributes.target_temp_step;
    return typeof attrStep === 'number' && attrStep > 0 ? attrStep : 0.5;
  }

  private get _minTemp(): number {
    const v = this._entity?.attributes.min_temp;
    return typeof v === 'number' ? v : 7;
  }

  private get _maxTemp(): number {
    const v = this._entity?.attributes.max_temp;
    return typeof v === 'number' ? v : 32;
  }

  private get _targetTemp(): number | null {
    if (this._optimisticTemp !== null) return this._optimisticTemp;
    const t = this._entity?.attributes.temperature;
    return typeof t === 'number' ? t : null;
  }

  private get _currentTemp(): number | null {
    const t = this._entity?.attributes.current_temperature;
    return typeof t === 'number' ? t : null;
  }

  private get _climateTone(): 'heat' | 'cool' | 'auto' | 'neutral' {
    if (this._isUnavailable) return 'neutral';
    const state = String(this._entity?.state ?? 'off').toLowerCase();
    const action = String(this._entity?.attributes.hvac_action ?? '').toLowerCase();

    if (action === 'heating' || state === 'heat' || state === 'heating') {
      return 'heat';
    }
    if (action === 'cooling' || state === 'cool' || state === 'cooling') {
      return 'cool';
    }
    if (state === 'off' || state === 'idle') {
      return 'neutral';
    }
    return 'auto';
  }

  private _nudgeTemp(delta: number, e: Event): void {
    e.stopPropagation();
    if (!this.hass || !this._config || this._isUnavailable) return;

    const base = this._targetTemp ?? this._currentTemp ?? 20;
    const step = this._step;
    const raw = base + delta * step;
    const clamped = Math.max(this._minTemp, Math.min(this._maxTemp, raw));
    const rounded = Math.round(clamped / step) * step;
    const finalTemp = Number(rounded.toFixed(1));

    this._optimisticTemp = finalTemp;
    if (this._optimisticTimer !== null) {
      window.clearTimeout(this._optimisticTimer);
    }
    this._optimisticTimer = window.setTimeout(() => {
      this._optimisticTemp = null;
      this._optimisticTimer = null;
    }, 1500);

    this.hass.callService('climate', 'set_temperature', {
      entity_id: this._config.entity,
      temperature: finalTemp,
    });
  }

  private _openPopup(): void {
    if (this._isUnavailable) return;
    this._popupHost?.openPopup(this._cardEl?.getBoundingClientRect());
  }

  private _attachPopupHost = (el: Element | undefined): void => {
    if (!el || !(el instanceof HTMLElement) || !this._config) return;
    const host = el as M3EStatusCard;
    this._popupHost = host;

    const key = `${this._config.entity}|${this._config.name ?? ''}|${this._config.outdoor_entity ?? ''}`;
    if (this._boundPopupKey !== key) {
      this._boundPopupKey = key;
      const cfg: M3EStatusCardConfig = {
        type: 'custom:m3e-status-card',
        entity: this._config.entity,
        name: this._config.name,
        outdoor_entity: this._config.outdoor_entity,
        popup_type: 'climate',
      };
      host.setConfig(cfg);
    }
  };

  private _renderHeaderIcon(tone: 'heat' | 'cool' | 'auto' | 'neutral', unavailable: boolean) {
    const mode = String(this._entity?.state ?? 'off').toLowerCase();

    if (unavailable || tone === 'neutral') {
      // Outlined thermometer icon for Offline / Off / Idle
      return html`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0Zm-3 7a3 3 0 0 1-1.6-5.54l.6-.38V5a1 1 0 0 1 2 0v9.08l.6.38A3 3 0 0 1 12 20Z"
          />
        </svg>
      `;
    }

    if (tone === 'heat') {
      // 3 wavy heat lines matching Google Home heating plan
      return html`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M7 19c1.4-2 1.4-4 0-6s-1.4-4 0-6M12 19c1.4-2 1.4-4 0-6s-1.4-4 0-6M17 19c1.4-2 1.4-4 0-6s-1.4-4 0-6"
            stroke="currentColor"
            stroke-width="2.1"
            stroke-linecap="round"
            fill="none"
          />
        </svg>
      `;
    }

    if (tone === 'cool') {
      // Snowflake icon for cooling plan
      return html`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M11 2h2v4.17l2.59-2.58L17 5l-4 4v2h2l4-4 1.41 1.41L17.83 11H22v2h-4.17l2.58 2.59L19 17l-4-4h-2v2l4 4-1.41 1.41L13 17.83V22h-2v-4.17l-2.59 2.58L7 19l4-4v-2H9l-4 4-1.41-1.41L6.17 13H2v-2h4.17L3.59 8.41 5 7l4 4h2V9L7 5l1.41-1.41L11 6.17V2Z"
          />
        </svg>
      `;
    }

    if (mode === 'dry') {
      return html`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69Z" />
        </svg>
      `;
    }

    if (mode === 'fan_only') {
      return html`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 11a1 1 0 1 0 1 1 1 1 0 0 0-1-1Zm.5-9C17 2 17.1 5.57 14.73 6.75a3.36 3.36 0 0 0-1.62 2.47 3.17 3.17 0 0 1 1.23.91C18 8.13 22 8.92 22 12.5c0 4.5-3.58 4.6-4.75 2.23a3.44 3.44 0 0 0-2.5-1.62 3.24 3.24 0 0 1-.91 1.23c2 3.69 1.2 7.66-2.38 7.66C7 22 6.89 18.42 9.26 17.24a3.46 3.46 0 0 0 1.62-2.45 3.17 3.17 0 0 1-1.25-.92C5.94 15.85 2 15.07 2 11.5 2 7 5.54 6.89 6.72 9.26a3.39 3.39 0 0 0 2.48 1.61 3.24 3.24 0 0 1 .92-1.22C8.16 5.95 8.92 2 12.5 2Z"
          />
        </svg>
      `;
    }

    // Auto / heat_cool -> thermostat dial ring icon
    return html`
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm0-12a4 4 0 1 0 4 4 4 4 0 0 0-4-4Z"
        />
      </svg>
    `;
  }

  private _formatTempNumber(val: number): string {
    return Number.isInteger(val) ? String(val) : val.toFixed(1);
  }

  protected render() {
    if (!this._config) return nothing;
    const entity = this._entity;
    const name = this._config.name || entity?.attributes.friendly_name || this._config.entity;
    const unavailable = this._isUnavailable;
    const tone = this._climateTone;
    const isDark = Boolean(this.hass?.themes?.darkMode);
    const target = this._targetTemp;
    const current = this._currentTemp;
    const hvacState = String(entity?.state ?? 'off').toLowerCase();

    const indoorLbl = t(this.hass, 'indoor');
    const indoorText =
      current !== null
        ? hvacState === 'off'
          ? `${t(this.hass, 'off')} · ${indoorLbl} ${this._formatTempNumber(current)}`
          : `${indoorLbl} ${this._formatTempNumber(current)}`
        : hvacState === 'off'
          ? t(this.hass, 'off')
          : hvacState.charAt(0).toUpperCase() + hvacState.slice(1);

    return html`
      <ha-card
        class="thermostat-card is-wide-card tone-${tone} ${isDark ? 'is-dark' : 'is-light'} ${this._pressed ? 'is-pressed' : ''} ${unavailable ? 'is-unavailable' : ''}"
        role="button"
        tabindex="0"
        aria-label="${name}, ${unavailable ? 'Offline' : target !== null ? `${target}°` : hvacState}"
        @pointerdown=${(e: PointerEvent) => {
          if (unavailable || (e.pointerType === 'mouse' && e.button !== 0)) return;
          if ((e.target as HTMLElement | null)?.closest('button')) return;
          this._pressed = true;
        }}
        @pointerup=${() => (this._pressed = false)}
        @pointerleave=${() => (this._pressed = false)}
        @pointercancel=${() => (this._pressed = false)}
        @click=${() => this._openPopup()}
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this._openPopup();
          }
        }}
      >
        <header class="thermo-header">
          <span class="header-left">
            <span class="header-icon">${this._renderHeaderIcon(tone, unavailable)}</span>
            <span class="header-title">${name}</span>
          </span>

          ${unavailable
            ? html`
                <span class="offline-badge" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3ZM12 14a1 1 0 0 1-1-1v-2a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1Zm1 4h-2v-2h2v2Z"
                    />
                  </svg>
                </span>
              `
            : html`
                <span class="header-chevron" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.41 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01Z"
                    />
                  </svg>
                </span>
              `}
        </header>

        ${unavailable
          ? html`<div class="offline-hero">Offline</div>`
          : html`
              <div class="controls-row">
                <button
                  type="button"
                  class="step-btn"
                  aria-label="Riduci temperatura"
                  @click=${(e: Event) => this._nudgeTemp(-1, e)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.4"
                      stroke-linecap="round"
                      d="M6 12h12"
                    />
                  </svg>
                </button>

                <div class="temp-readout">
                  ${target !== null ? this._formatTempNumber(target) : '—'}
                </div>

                <button
                  type="button"
                  class="step-btn"
                  aria-label="Aumenta temperatura"
                  @click=${(e: Event) => this._nudgeTemp(1, e)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.4"
                      stroke-linecap="round"
                      d="M12 6v12M6 12h12"
                    />
                  </svg>
                </button>
              </div>

              <div class="indoor-label">${indoorText}</div>
            `}
      </ha-card>

      <!-- Reuses the exact Climate popup from m3e-status-card without rendering a tile -->
      <m3e-status-card
        .popupOnly=${true}
        .hass=${this.hass}
        ${ref(this._attachPopupHost)}
      ></m3e-status-card>
    `;
  }

  static styles = [
    m3eBaseStyles,
    css`
      :host {
        display: block;
        width: 100%;
      }

      .thermostat-card {
        padding: 18px 20px 20px;
        cursor: pointer;
        outline: none;
        display: flex;
        flex-direction: column;
        transition:
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default),
          transform var(--m3e-spring-spatial-fast);
      }

      .thermostat-card:focus-visible {
        outline: 2px solid var(--md-sys-color-primary, #4c5c92);
        outline-offset: 2px;
      }

      /* =====================================================================
         CLIMATE SEMANTIC TONES (Heat = Warm Red, Cool = Blue, Off = Neutral)
         ===================================================================== */
      .thermostat-card.tone-neutral {
        background: var(
          --ha-card-background,
          var(--md-sys-color-surface-container-high, #e3e3e6)
        );
        color: var(--md-sys-color-on-surface, #1f1f24);
        --m3e-thermo-btn-bg: color-mix(in srgb, currentColor 11%, transparent);
      }

      .thermostat-card.tone-heat.is-light {
        background: #ffd8cc;
        color: #5c1900;
        --m3e-thermo-btn-bg: rgba(92, 25, 0, 0.11);
      }

      .thermostat-card.tone-heat.is-dark {
        background: #592416;
        color: #ffdad0;
        --m3e-thermo-btn-bg: rgba(255, 218, 208, 0.15);
      }

      .thermostat-card.tone-cool.is-light {
        background: #d3e4ff;
        color: #001c38;
        --m3e-thermo-btn-bg: rgba(0, 28, 56, 0.1);
      }

      .thermostat-card.tone-cool.is-dark {
        background: #19385b;
        color: #d3e4ff;
        --m3e-thermo-btn-bg: rgba(211, 228, 255, 0.15);
      }

      .thermostat-card.tone-auto {
        background: var(--md-sys-color-primary-container, #dbe1ff);
        color: var(--md-sys-color-on-primary-container, #16306b);
        --m3e-thermo-btn-bg: color-mix(in srgb, currentColor 12%, transparent);
      }

      /* =====================================================================
         HEADER ROW (avoid HA reserved .card-header class)
         ===================================================================== */
      .thermo-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 0;
        margin: 0;
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
      }

      .header-icon {
        width: 22px;
        height: 22px;
        display: grid;
        place-items: center;
        flex-shrink: 0;
      }

      .header-icon svg {
        width: 22px;
        height: 22px;
      }

      .header-title {
        font-size: 16px;
        font-weight: 500;
        line-height: 22px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .header-chevron {
        width: 22px;
        height: 22px;
        display: grid;
        place-items: center;
        flex-shrink: 0;
        opacity: 0.85;
      }

      .header-chevron svg {
        width: 20px;
        height: 20px;
      }

      /* =====================================================================
         ONLINE CONTROLS ROW (-   7   +) + INDOOR LABEL
         ===================================================================== */
      .controls-row {
        display: grid;
        grid-template-columns: 78px 1fr 78px;
        align-items: center;
        gap: 12px;
        margin: 22px 0 16px;
      }

      .step-btn {
        width: 78px;
        height: 54px;
        border: 0;
        border-radius: 9999px;
        background: var(--m3e-thermo-btn-bg, color-mix(in srgb, currentColor 11%, transparent));
        color: inherit;
        display: grid;
        place-items: center;
        cursor: pointer;
        padding: 0;
        transition:
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-fast);
        -webkit-tap-highlight-color: transparent;
      }

      .step-btn:hover {
        background: color-mix(in srgb, currentColor 17%, transparent);
      }

      .step-btn:active {
        transform: scale(0.92);
      }

      .step-btn svg {
        width: 22px;
        height: 22px;
      }

      .temp-readout {
        text-align: center;
        font-size: 62px;
        font-weight: 400;
        line-height: 1;
        letter-spacing: -0.025em;
        font-variant-numeric: tabular-nums;
      }

      .indoor-label {
        text-align: center;
        font-size: 15px;
        font-weight: 500;
        line-height: 20px;
        opacity: 0.88;
      }

      /* =====================================================================
         OFFLINE STATE (matches Google Home screenshot)
         ===================================================================== */
      .offline-hero {
        text-align: center;
        font-size: 56px;
        font-weight: 400;
        line-height: 1.1;
        letter-spacing: -0.015em;
        padding: 28px 0 26px;
        color: color-mix(in srgb, var(--md-sys-color-on-surface, #1b1b1f) 46%, transparent);
      }

      .thermostat-card.is-unavailable .header-icon,
      .thermostat-card.is-unavailable .header-title {
        color: color-mix(in srgb, var(--md-sys-color-on-surface, #1b1b1f) 46%, transparent);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-thermostat-card': M3EThermostatCard;
  }
}
