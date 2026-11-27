import { LitElement, css, html, nothing, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { m3eBaseStyles } from '../styles/m3e-tokens';
import type { HassEntity, HomeAssistant, M3EStatusBadgeConfig } from '../types/home-assistant';
import { renderM3EntityIcon } from '../utils/icons';
import { executeNavigationTarget } from '../utils/navigation';
import {
  formatRelativeTimestamp,
  resolveEntityName,
  resolveStateContent,
} from '../utils/entity-display';
import { computeBadgeProgress } from '../utils/badge-progress';
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
  @state() private _tick = 0;

  private _prevEntity?: HassEntity;
  private _prevStartEntity?: HassEntity;
  private _prevEndEntity?: HassEntity;
  private _tickTimer: number | null = null;
  private _tickIntervalMs = 0;

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._tickTimer !== null) {
      window.clearInterval(this._tickTimer);
      this._tickTimer = null;
      this._tickIntervalMs = 0;
    }
  }

  protected updated(): void {
    const isTimerActive =
      this._entity?.entity_id.startsWith('timer.') && this._entity.state === 'active';
    const progress = this._config ? computeBadgeProgress(this.hass, this._config) : null;
    const isTs = Boolean(
      this._entity &&
        (this._entity.attributes.device_class === 'timestamp' ||
          formatRelativeTimestamp(String(this._entity.state ?? ''), this.hass) !== null),
    );

    const desiredMs = isTimerActive
      ? 1000
      : progress?.isTimeBased
        ? 5000
        : isTs
          ? 30000
          : 0;

    if (desiredMs !== this._tickIntervalMs) {
      if (this._tickTimer !== null) {
        window.clearInterval(this._tickTimer);
        this._tickTimer = null;
      }
      this._tickIntervalMs = desiredMs;
      if (desiredMs > 0) {
        this._tickTimer = window.setInterval(() => {
          this._tick++;
        }, desiredMs);
      }
    }
  }

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
          name: '',
          flatten: true,
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
                { name: 'use_entity_icon', selector: { boolean: {} } },
                { name: 'hide_state', selector: { boolean: {} } },
              ],
            },
            { name: 'alert_color', selector: { boolean: {} } },
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
          name: '',
          flatten: true,
          icon: 'mdi:progress-clock',
          title: 'Progress (Entity Progress Badge)',
          schema: [
            {
              type: 'grid',
              name: '',
              schema: [
                { name: 'progress_enabled', selector: { boolean: {} } },
                { name: 'progress_start_now', selector: { boolean: {} } },
              ],
            },
            { name: 'progress_start_entity', selector: { entity: {} } },
            { name: 'progress_start_value', selector: { text: {} } },
            { name: 'progress_end_entity', selector: { entity: {} } },
            { name: 'progress_end_value', selector: { text: {} } },
            {
              type: 'grid',
              name: '',
              schema: [
                { name: 'progress_invert', selector: { boolean: {} } },
                { name: 'progress_show_percent', selector: { boolean: {} } },
              ],
            },
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
          use_entity_icon: 'Usa icona entità HA (al posto di Google Home)',
          hide_state: 'Nascondi stato',
          alert_color: 'Usa colore di avviso/errore quando attivo',
          state_content: 'Contenuto stato (stato / attributi)',
          active_state: 'Stati attivi personalizzati (es. on,open,problem)',
          tap_action: 'Azione al tocco',
          navigation_path: 'Percorso / #popup Bubble Card / script',
          progress_enabled: 'Abilita Entity Progress Badge',
          progress_start_now: 'Partenza da ora (sveglie / remaining time)',
          progress_start_entity: 'Entità valore iniziale (numero, counter, data/ora)',
          progress_start_value: 'Valore iniziale fisso (es. 0, 07:30, now)',
          progress_end_entity: 'Entità valore finale (numero, counter, data/ora, timer)',
          progress_end_value: 'Valore finale fisso (es. 100, 22:00, minuti max)',
          progress_invert: 'Inverti barra (100% → 0%)',
          progress_show_percent: 'Mostra percentuale (%)',
        };
        return labels[schema.name] ?? schema.name;
      },
    };
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this._config) return false;
    if (changedProps.has('_config') || changedProps.has('_pressed') || changedProps.has('_tick')) {
      return true;
    }
    if (changedProps.has('hass') && this.hass) {
      const next = this.hass.states[this._config.entity];
      const nextStart = this._config.progress_start_entity
        ? this.hass.states[this._config.progress_start_entity]
        : undefined;
      const nextEnd = this._config.progress_end_entity
        ? this.hass.states[this._config.progress_end_entity]
        : undefined;
      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
      if (
        next !== this._prevEntity ||
        nextStart !== this._prevStartEntity ||
        nextEnd !== this._prevEndEntity ||
        oldHass?.themes?.darkMode !== this.hass.themes?.darkMode
      ) {
        this._prevEntity = next;
        this._prevStartEntity = nextStart;
        this._prevEndEntity = nextEnd;
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
    const relTs = formatRelativeTimestamp(raw, this.hass);
    if (relTs) return relTs;

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
    if (this._config?.use_entity_icon && entity && typeof customElements !== 'undefined') {
      if (customElements.get('ha-state-icon')) {
        return html`<ha-state-icon .hass=${this.hass} .stateObj=${entity}></ha-state-icon>`;
      }
      const attrIcon = entity.attributes.icon;
      if (attrIcon && customElements.get('ha-icon')) {
        return html`<ha-icon .icon=${attrIcon}></ha-icon>`;
      }
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

    const progress = computeBadgeProgress(this.hass, this._config);
    const hasProgress = progress.percent !== null;
    const progressPct = progress.percent ?? 0;

    const baseVal = progress.liveRemainingText || this._formatPrimaryState();
    const hideState = Boolean(this._config.hide_state);
    const stateContentVal = !hideState
      ? resolveStateContent(this.hass, entity, this._config.state_content, baseVal)
      : null;
    let valueText = hideState ? '' : (stateContentVal ?? baseVal);
    if (!hideState && this._config.progress_show_percent && hasProgress) {
      const pctLabel = `${Math.round(progressPct)}%`;
      valueText = valueText && !valueText.includes('%') ? `${valueText} · ${pctLabel}` : pctLabel;
    }

    const stateClass = isUnavailable
      ? 'is-unavailable'
      : isAlert
        ? 'is-alert'
        : isActive
          ? 'is-active'
          : 'is-inactive';
    const clickable = (this._config.tap_action ?? 'more-info') !== 'none';
    const ringCircumference = 100.53;
    const ringOffset = ringCircumference * (1 - progressPct / 100);

    const commonHandlers = html`
      <button
        type="button"
        class="m3e-badge style-${style} ${stateClass} ${hasProgress ? 'has-progress' : ''} ${this._pressed ? 'is-pressed' : ''} ${clickable ? 'is-clickable' : ''}"
        style=${hasProgress ? `--badge-pct: ${progressPct.toFixed(1)}%;` : ''}
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
        ${hasProgress && (style === 'alert' || style === 'dot')
          ? html`<span class="badge-progress-fill" aria-hidden="true"></span>`
          : nothing}

        ${style === 'glance'
          ? html`
              <span class="g-circle" aria-hidden="true">
                ${hasProgress
                  ? html`
                      <svg class="g-ring" viewBox="0 0 36 36" aria-hidden="true">
                        <circle class="g-ring-track" cx="18" cy="18" r="16" />
                        <circle
                          class="g-ring-fill"
                          cx="18"
                          cy="18"
                          r="16"
                          stroke-dasharray=${ringCircumference}
                          stroke-dashoffset=${ringOffset}
                        />
                      </svg>
                    `
                  : nothing}
                ${this._renderIcon(entity, isActive)}
              </span>
              <span class="g-text">
                ${valueText ? html`<span class="g-val">${valueText}</span>` : nothing}
                <span class="g-lbl">${name}</span>
              </span>
            `
          : style === 'split'
            ? html`
                <span class="s-left" aria-hidden="true">${this._renderIcon(entity, isActive)}</span>
                <span class="s-right">
                  ${hasProgress
                    ? html`<span class="s-progress-fill" aria-hidden="true"></span>`
                    : nothing}
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
        position: relative;
        overflow: hidden;
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

      .badge-progress-fill {
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        width: var(--badge-pct, 0%);
        background: color-mix(
          in srgb,
          var(--md-sys-color-primary-container, #2e4379) 76%,
          transparent
        );
        transition: width var(--m3e-spring-spatial-default);
        pointer-events: none;
        z-index: 0;
      }

      .m3e-badge.is-alert .badge-progress-fill {
        background: color-mix(
          in srgb,
          var(--md-sys-color-error-container, #93000a) 76%,
          transparent
        );
      }

      .style-alert.has-progress.is-active .badge-progress-fill,
      .style-alert.has-progress.is-alert .badge-progress-fill {
        background: color-mix(in srgb, currentColor 14%, transparent);
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
        position: relative;
        width: 38px;
        height: 38px;
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

      .g-ring {
        position: absolute;
        inset: -1px;
        width: calc(100% + 2px);
        height: calc(100% + 2px);
        transform: rotate(-90deg);
        pointer-events: none;
      }

      .g-ring-track {
        fill: none;
        stroke: color-mix(in srgb, var(--md-sys-color-outline-variant, #74777f) 38%, transparent);
        stroke-width: 2.6;
      }

      .g-ring-fill {
        fill: none;
        stroke: var(--md-sys-color-primary, #b1c5ff);
        stroke-width: 2.8;
        stroke-linecap: round;
        transition: stroke-dashoffset var(--m3e-spring-spatial-default);
      }

      .style-glance.is-alert .g-ring-fill {
        stroke: var(--md-sys-color-error, #ffb4ab);
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
         2. SPLIT TONAL PILL (Dual-Zone Telemetry Pill — 44px height)
         ===================================================================== */
      .m3e-badge.style-split {
        height: 44px;
        padding: 0;
        border-radius: 9999px;
        overflow: hidden;
        background: var(--md-sys-color-surface-container-high, #292a32);
      }

      .s-left {
        position: relative;
        z-index: 1;
        height: 100%;
        padding: 0 12px 0 14px;
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
        width: 19px;
        height: 19px;
        --mdc-icon-size: 19px;
      }

      .s-right {
        position: relative;
        height: 100%;
        padding: 0 15px 0 12px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
        overflow: hidden;
      }

      .s-progress-fill {
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        width: var(--badge-pct, 0%);
        background: color-mix(
          in srgb,
          var(--md-sys-color-primary-container, #2e4379) 76%,
          transparent
        );
        transition: width var(--m3e-spring-spatial-default);
        pointer-events: none;
        z-index: 0;
      }

      .style-split.is-alert .s-progress-fill {
        background: color-mix(
          in srgb,
          var(--md-sys-color-error-container, #93000a) 76%,
          transparent
        );
      }

      .s-val {
        position: relative;
        z-index: 1;
        font-size: 14px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }

      .s-lbl {
        position: relative;
        z-index: 1;
        font-size: 12px;
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* =====================================================================
         3. MINIMAL DOT BADGE (Compact with semantic status dot — 40px)
         ===================================================================== */
      .m3e-badge.style-dot {
        height: 40px;
        padding: 4px 14px 4px 4px;
        gap: 9px;
        border-radius: 9999px;
        background: var(--md-sys-color-surface-container, #1f2027);
      }

      .d-wrap {
        position: relative;
        z-index: 1;
        width: 32px;
        height: 32px;
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
        position: relative;
        z-index: 1;
        font-size: 13.5px;
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
        position: relative;
        z-index: 1;
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
        position: relative;
        z-index: 1;
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
