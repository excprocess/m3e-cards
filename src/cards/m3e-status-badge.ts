import { LitElement, css, html, nothing, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { m3eBaseStyles } from '../styles/m3e-tokens';
import type { HassEntity, HomeAssistant, M3EStatusBadgeConfig } from '../types/home-assistant';
import { renderM3EntityIcon } from '../utils/icons';
import { executeNavigationTarget } from '../utils/navigation';
import { resolveEntityName, resolveStateContent } from '../utils/entity-display';
import { t } from '../utils/i18n';

const DEFAULT_ACTIVE_STATES = new Set([
  'on',
  'open',
  'opening',
  'unlocked',
  'detected',
  'home',
  'playing',
  'heat',
  'heating',
  'cool',
  'cooling',
  'active',
  'problem',
  'alarm',
  'triggered',
  'true',
]);

@customElement('m3e-status-badge')
export class M3EStatusBadge extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3EStatusBadgeConfig;
  @state() private _pressed = false;

  private _prevEntity?: HassEntity;

  public setConfig(config: M3EStatusBadgeConfig): void {
    if (!config || !config.entity) {
      throw new Error('m3e-status-badge: entity is required');
    }
    this._config = {
      badge_style: 'glance',
      tap_action: 'more-info',
      alert_color: false,
      ...config,
    };
  }

  public getCardSize(): number {
    return 1;
  }

  public getGridOptions() {
    return {
      rows: 'auto' as const,
      columns: 4,
      min_columns: 2,
    };
  }

  public static getStubConfig(hass?: HomeAssistant): M3EStatusBadgeConfig {
    const first =
      Object.keys(hass?.states ?? {}).find(
        (id) =>
          id.startsWith('sensor.') ||
          id.startsWith('binary_sensor.') ||
          id.startsWith('person.') ||
          id.startsWith('light.'),
      ) ?? 'sun.sun';
    return {
      type: 'custom:m3e-status-badge',
      entity: first,
      badge_style: 'glance',
      tap_action: 'more-info',
    };
  }

  public static getConfigForm() {
    return {
      schema: [
        { name: 'entity', required: true, selector: { entity: {} } },
        {
          type: 'expandable',
          icon: 'mdi:text-short',
          title: 'Content',
          schema: [
            {
              name: 'badge_style',
              selector: {
                select: {
                  mode: 'dropdown',
                  options: [
                    { value: 'glance', label: 'Glance Mini (Cerchio 36px · At a Glance)' },
                    { value: 'split', label: 'Split Tonal Pill (Telemetria doppia zona)' },
                    { value: 'dot', label: 'Minimal Dot Badge (Ultra-compatto con pallino)' },
                    { value: 'alert', label: 'Squircle Morph Badge (Alert · Pillola ↔ Squircle)' },
                  ],
                },
              },
            },
            {
              name: 'name',
              selector: { entity_name: {} },
              context: { entity: 'entity' },
            },
            { name: 'icon', selector: { icon: {} } },
            {
              type: 'grid',
              name: '',
              schema: [
                { name: 'hide_state', selector: { boolean: {} } },
                { name: 'alert_color', selector: { boolean: {} } },
              ],
            },
            {
              name: 'state_content',
              selector: { ui_state_content: { allow_name: false } },
              context: { filter_entity: 'entity' },
            },
            { name: 'active_state', selector: { text: {} } },
          ],
        },
        {
          type: 'expandable',
          icon: 'mdi:gesture-tap',
          title: 'Interactions',
          schema: [
            {
              name: 'tap_action',
              selector: {
                select: {
                  mode: 'dropdown',
                  options: [
                    { value: 'more-info', label: 'Dettagli Home Assistant (More-info)' },
                    { value: 'toggle', label: 'Toggle stato' },
                    { value: 'navigate', label: 'Naviga / #hash Bubble / Browser Mod' },
                    { value: 'none', label: 'Nessuna azione' },
                  ],
                },
              },
            },
            { name: 'navigation_path', selector: { text: {} } },
          ],
        },
      ],
      computeLabel: (schema: { name: string }) => {
        const labels: Record<string, string> = {
          entity: 'Entità',
          badge_style: 'Stile Badge (Material 3 Expressive)',
          name: 'Nome',
          icon: 'Icona personalizzata (vuoto = automatica)',
          hide_state: 'Nascondi stato',
          alert_color: 'Usa colore di avviso/errore quando attivo',
          state_content: 'Contenuto stato (stato / attributi)',
          active_state: 'Stati attivi personalizzati (es. on,open,problem)',
          tap_action: 'Azione al tocco',
          navigation_path: 'Percorso / #popup Bubble Card / script',
        };
        return labels[schema.name] ?? schema.name;
      },
    };
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this._config) return false;
    if (changedProps.has('_config') || changedProps.has('_pressed')) return true;
    if (changedProps.has('hass') && this.hass) {
      const next = this.hass.states[this._config.entity];
      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
      if (next !== this._prevEntity || oldHass?.themes?.darkMode !== this.hass.themes?.darkMode) {
        this._prevEntity = next;
        return true;
      }
      return false;
    }
    return false;
  }

  private get _entity(): HassEntity | undefined {
    if (!this.hass || !this._config) return undefined;
    return this.hass.states[this._config.entity];
  }

  private get _isUnavailable(): boolean {
    const s = this._entity?.state;
    return !s || s === 'unavailable' || s === 'unknown';
  }

  private get _isActive(): boolean {
    if (this._isUnavailable || !this._entity) return false;
    const raw = String(this._entity.state ?? '').toLowerCase();
    if (this._config?.active_state?.trim()) {
      const custom = this._config.active_state
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      return custom.includes(raw);
    }
    return DEFAULT_ACTIVE_STATES.has(raw);
  }

  private _formatPrimaryState(): string {
    const entity = this._entity;
    if (!entity || this._isUnavailable) return t(this.hass, 'offline');

    const raw = String(entity.state ?? '').trim();
    const low = raw.toLowerCase();
    if (low === 'home') return t(this.hass, 'home');
    if (low === 'not_home') return t(this.hass, 'away');
    if (low === 'on') return t(this.hass, 'on');
    if (low === 'off') return t(this.hass, 'off');

    const unit = String(entity.attributes.unit_of_measurement ?? '');
    if (/^-?\d+\.\d+$/.test(raw)) {
      const num = parseFloat(raw);
      const clean = Number.isInteger(num) ? String(num) : num.toFixed(1).replace(/\.0$/, '');
      return unit ? `${clean}${unit}` : clean;
    }
    if (typeof this.hass?.formatEntityState === 'function') {
      try {
        return this.hass.formatEntityState(entity);
      } catch {
        // fallback below
      }
    }
    return unit ? `${raw}${unit}` : raw;
  }

  private _onTap(): void {
    if (!this.hass || !this._config) return;
    const action = this._config.tap_action ?? 'more-info';
    if (action === 'none') return;

    if (action === 'toggle') {
      const domain = this._config.entity.split('.')[0];
      this.hass.callService(domain, 'toggle', { entity_id: this._config.entity });
      return;
    }

    if (action === 'navigate' && this._config.navigation_path) {
      executeNavigationTarget(this, this.hass, this._config.navigation_path);
      return;
    }

    this.dispatchEvent(
      new CustomEvent('hass-more-info', {
        detail: { entityId: this._config.entity },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _renderIcon(entity?: HassEntity, isActive = false) {
    const customIcon = this._config?.icon?.trim();
    if (customIcon && typeof customElements !== 'undefined' && customElements.get('ha-icon')) {
      return html`<ha-icon .icon=${customIcon}></ha-icon>`;
    }
    return renderM3EntityIcon(entity, isActive);
  }

  protected render() {
    if (!this._config) return nothing;
    const entity = this._entity;
    const style = this._config.badge_style ?? 'glance';
    const isUnavailable = this._isUnavailable;
    const isActive = this._isActive;
    const isAlert = isActive && (Boolean(this._config.alert_color) || style === 'alert');
    const name = resolveEntityName(this.hass, entity, this._config.name, this._config.entity);

    const baseVal = this._formatPrimaryState();
    const hideState = Boolean(this._config.hide_state);
    const stateContentVal = !hideState
      ? resolveStateContent(this.hass, entity, this._config.state_content, baseVal)
      : null;
    const valueText = hideState ? '' : (stateContentVal ?? baseVal);

    const stateClass = isUnavailable
      ? 'is-unavailable'
      : isAlert
        ? 'is-alert'
        : isActive
          ? 'is-active'
          : 'is-inactive';
    const clickable = (this._config.tap_action ?? 'more-info') !== 'none';

    const commonHandlers = html`
      <button
        type="button"
        class="m3e-badge style-${style} ${stateClass} ${this._pressed ? 'is-pressed' : ''} ${clickable ? 'is-clickable' : ''}"
        aria-label="${name}${valueText ? `, ${valueText}` : ''}"
        @pointerdown=${(e: PointerEvent) => {
          if (!clickable || (e.pointerType === 'mouse' && e.button !== 0)) return;
          this._pressed = true;
        }}
        @pointerup=${() => (this._pressed = false)}
        @pointerleave=${() => (this._pressed = false)}
        @pointercancel=${() => (this._pressed = false)}
        @click=${() => this._onTap()}
      >
        ${style === 'glance'
          ? html`
              <span class="g-circle" aria-hidden="true">${this._renderIcon(entity, isActive)}</span>
              <span class="g-text">
                ${valueText ? html`<span class="g-val">${valueText}</span>` : nothing}
                <span class="g-lbl">${name}</span>
              </span>
            `
          : style === 'split'
            ? html`
                <span class="s-left" aria-hidden="true">${this._renderIcon(entity, isActive)}</span>
                <span class="s-right">
                  ${valueText ? html`<span class="s-val">${valueText}</span>` : nothing}
                  <span class="s-lbl">${name}</span>
                </span>
              `
            : style === 'dot'
              ? html`
                  <span class="d-wrap" aria-hidden="true">
                    ${this._renderIcon(entity, isActive)}
                    <span class="d-dot"></span>
                  </span>
                  <span class="d-txt">${valueText || name}</span>
                `
              : html`
                  <span class="m-ic" aria-hidden="true">${this._renderIcon(entity, isActive)}</span>
                  <span class="m-col">
                    ${valueText ? html`<span class="m-val">${valueText}</span>` : nothing}
                    <span class="m-lbl">${name}</span>
                  </span>
                `}
      </button>
    `;

    return commonHandlers;
  }

  static styles = [
    m3eBaseStyles,
    css`
      :host {
        display: inline-flex;
        width: auto;
        height: auto;
        --m3e-spring-morph: 480ms linear(
          0, 0.168 7%, 0.618 18%, 0.962 31%, 1.072 43%,
          1.038 56%, 0.992 71%, 1.005 86%, 1
        );
      }

      .m3e-badge {
        border: 0;
        margin: 0;
        font-family: inherit;
        text-align: left;
        display: inline-flex;
        align-items: center;
        max-width: 100%;
        color: var(--md-sys-color-on-surface, var(--primary-text-color));
        transition:
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default),
          border-radius var(--m3e-spring-morph);
        -webkit-tap-highlight-color: transparent;
      }

      .m3e-badge.is-clickable {
        cursor: pointer;
      }

      .m3e-badge.is-pressed {
        transform: scale(0.93);
      }

      .m3e-badge.is-unavailable {
        opacity: 1;
        color: color-mix(in srgb, var(--md-sys-color-on-surface, #e3e2e6) 46%, transparent);
      }

      .m3e-badge svg,
      .m3e-badge ha-icon {
        display: block;
        flex-shrink: 0;
      }

      /* =====================================================================
         1. GLANCE MINI (Compact At a Glance — 36px circle + value + label)
         ===================================================================== */
      .m3e-badge.style-glance {
        background: transparent;
        padding: 3px 6px 3px 2px;
        gap: 9px;
        border-radius: 9999px;
      }

      .g-circle {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        flex-shrink: 0;
        background: var(
          --md-sys-color-surface-container-highest,
          var(--secondary-background-color, rgba(128, 128, 128, 0.18))
        );
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
        transition:
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default);
      }

      .style-glance.is-active .g-circle {
        background: var(--md-sys-color-primary-container, #2e4379);
        color: var(--md-sys-color-on-primary-container, #dae2ff);
      }

      .style-glance.is-alert .g-circle {
        background: var(--md-sys-color-error-container, #93000a);
        color: var(--md-sys-color-on-error-container, #ffdad6);
      }

      .g-circle svg,
      .g-circle ha-icon {
        width: 19px;
        height: 19px;
        --mdc-icon-size: 19px;
      }

      .g-text {
        display: flex;
        flex-direction: column;
        gap: 1px;
        min-width: 0;
      }

      .g-val {
        font-size: 15px;
        font-weight: 600;
        line-height: 1.15;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .g-lbl {
        font-size: 11.5px;
        font-weight: 400;
        line-height: 1.15;
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* =====================================================================
         2. SPLIT TONAL PILL (Dual-Zone Telemetry Pill)
         ===================================================================== */
      .m3e-badge.style-split {
        height: 36px;
        padding: 0;
        border-radius: 9999px;
        overflow: hidden;
        background: var(--md-sys-color-surface-container-high, #292a32);
      }

      .s-left {
        height: 100%;
        padding: 0 10px 0 11px;
        display: inline-flex;
        align-items: center;
        background: var(--md-sys-color-surface-container-highest, #34353e);
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
      }

      .style-split.is-active .s-left {
        background: var(--md-sys-color-primary-container, #2e4379);
        color: var(--md-sys-color-on-primary-container, #dae2ff);
      }

      .style-split.is-alert .s-left {
        background: var(--md-sys-color-error-container, #93000a);
        color: var(--md-sys-color-on-error-container, #ffdad6);
      }

      .s-left svg,
      .s-left ha-icon {
        width: 17px;
        height: 17px;
        --mdc-icon-size: 17px;
      }

      .s-right {
        padding: 0 13px 0 10px;
        display: inline-flex;
        align-items: baseline;
        gap: 5px;
        min-width: 0;
      }

      .s-val {
        font-size: 13.5px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }

      .s-lbl {
        font-size: 11.5px;
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* =====================================================================
         3. MINIMAL DOT BADGE (Ultra-compact with semantic status dot)
         ===================================================================== */
      .m3e-badge.style-dot {
        height: 36px;
        padding: 4px 12px 4px 4px;
        gap: 8px;
        border-radius: 9999px;
        background: var(--md-sys-color-surface-container, #1f2027);
      }

      .d-wrap {
        position: relative;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        flex-shrink: 0;
        background: var(--md-sys-color-surface-container-highest, #34353e);
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
      }

      .style-dot.is-active .d-wrap {
        background: var(--md-sys-color-secondary-container, #3e4659);
        color: var(--md-sys-color-on-secondary-container, #dce2f9);
      }

      .style-dot.is-alert .d-wrap {
        background: var(--md-sys-color-error-container, #93000a);
        color: var(--md-sys-color-on-error-container, #ffdad6);
      }

      .d-wrap svg,
      .d-wrap ha-icon {
        width: 16px;
        height: 16px;
        --mdc-icon-size: 16px;
      }

      .d-dot {
        position: absolute;
        right: -1px;
        bottom: -1px;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: var(--md-sys-color-outline-variant, #74777f);
        border: 2px solid var(--md-sys-color-surface-container, #1f2027);
        box-sizing: border-box;
      }

      .style-dot.is-active .d-dot {
        background: var(--md-sys-color-primary, #b1c5ff);
      }

      .style-dot.is-alert .d-dot {
        background: var(--md-sys-color-error, #ffb4ab);
      }

      .d-txt {
        font-size: 13px;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* =====================================================================
         4. SQUIRCLE MORPH BADGE (Alert · Pill Inactive <-> 14px Squircle Active)
         ===================================================================== */
      .m3e-badge.style-alert {
        height: 44px;
        padding: 4px 14px 4px 5px;
        gap: 9px;
        border-radius: 9999px;
        background: var(--md-sys-color-surface-container-high, #292a32);
      }

      .style-alert.is-active {
        border-radius: 14px;
        background: var(--md-sys-color-primary-container, #2e4379);
        color: var(--md-sys-color-on-primary-container, #dae2ff);
      }

      .style-alert.is-alert {
        border-radius: 14px;
        background: var(--md-sys-color-error-container, #93000a);
        color: var(--md-sys-color-on-error-container, #ffdad6);
      }

      .m-ic {
        width: 34px;
        height: 34px;
        border-radius: 9999px;
        display: grid;
        place-items: center;
        flex-shrink: 0;
        background: var(--md-sys-color-surface-container-highest, #34353e);
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
        transition:
          border-radius var(--m3e-spring-morph),
          background-color var(--m3e-spring-effects-default);
      }

      .style-alert.is-active .m-ic {
        border-radius: 10px;
        background: var(--md-sys-color-primary, #b1c5ff);
        color: var(--md-sys-color-on-primary, #142c60);
      }

      .style-alert.is-alert .m-ic {
        border-radius: 10px;
        background: var(--md-sys-color-error, #ffb4ab);
        color: var(--md-sys-color-on-error, #690005);
      }

      .m-ic svg,
      .m-ic ha-icon {
        width: 18px;
        height: 18px;
        --mdc-icon-size: 18px;
      }

      .m-col {
        display: flex;
        flex-direction: column;
        gap: 1px;
        min-width: 0;
      }

      .m-val {
        font-size: 13.5px;
        font-weight: 600;
        line-height: 1.15;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }

      .m-lbl {
        font-size: 11px;
        line-height: 1.15;
        opacity: 0.8;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-status-badge': M3EStatusBadge;
  }
}
