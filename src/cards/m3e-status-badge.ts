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
import { buildM3BadgeTonalPalette } from '../utils/m3-color-harmony';
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
  @state() private _alertPulse = false;

  private _prevEntity?: HassEntity;
  private _prevProgressEntity?: HassEntity;
  private _prevStartEntity?: HassEntity;
  private _prevEndEntity?: HassEntity;
  private _prevAlertRaw: string | undefined;
  private _tickTimer: number | null = null;
  private _tickIntervalMs = 0;
  private _alertPulseTimer: number | null = null;

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._tickTimer !== null) {
      window.clearInterval(this._tickTimer);
      this._tickTimer = null;
      this._tickIntervalMs = 0;
    }
    if (this._alertPulseTimer !== null) {
      window.clearTimeout(this._alertPulseTimer);
      this._alertPulseTimer = null;
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
    const prev = this._config;
    if (
      prev &&
      (prev.entity !== config.entity ||
        prev.alert_attribute !== config.alert_attribute ||
        prev.alert_operator !== config.alert_operator ||
        prev.alert_value !== config.alert_value)
    ) {
      this._prevAlertRaw = undefined;
      this._alertPulse = false;
      if (this._alertPulseTimer !== null) {
        window.clearTimeout(this._alertPulseTimer);
        this._alertPulseTimer = null;
      }
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
                    { value: 'glance', label: 'Glance Mini (Cerchio · At a Glance)' },
                    { value: 'glance_icon', label: 'Glance Mini Solo Icona (Cerchio compatto)' },
                    { value: 'split', label: 'Split Tonal Pill (Fitbit Squircle · Telemetria)' },
                    { value: 'dot', label: 'Minimal Dot Badge (Ultra-compatto con pallino)' },
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
          icon: 'mdi:palette',
          title: 'Colori & Modalità Alert',
          schema: [
            {
              name: 'base_color',
              selector: { ui_color: { default_color: 'state', include_state: true } },
            },
            { name: 'alert_color', selector: { boolean: {} } },
            {
              name: 'alert_custom_color',
              selector: { ui_color: { default_color: 'red', include_none: true } },
            },
            {
              name: 'alert_attribute',
              selector: { attribute: {} },
              context: { filter_entity: 'entity' },
            },
            {
              type: 'grid',
              name: '',
              schema: [
                {
                  name: 'alert_operator',
                  selector: {
                    select: {
                      mode: 'dropdown',
                      options: [
                        { value: 'equals', label: 'Uguale a (stato/valore)' },
                        { value: 'not_equals', label: 'Diverso da' },
                        { value: 'above', label: 'Maggiore di (>)' },
                        { value: 'below', label: 'Minore di (<)' },
                        { value: 'changed', label: 'Quando cambia (o diverso da)' },
                      ],
                    },
                  },
                },
                { name: 'alert_value', selector: { text: {} } },
              ],
            },
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
            { name: 'progress_entity', selector: { entity: {} } },
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
            { name: 'progress_show_entity_state', selector: { boolean: {} } },
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
                    { value: 'navigate', label: 'Naviga / Apri Pop-up (#hash)' },
                    { value: 'none', label: 'Nessuna azione' },
                  ],
                },
              },
            },
            { name: 'navigation_path', selector: { navigation: {} } },
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
          alert_color: 'Attiva modalità Alert quando l’entità è attiva',
          base_color: 'Colore base badge (armonizzato Material 3)',
          alert_custom_color: 'Colore modalità Alert (vuoto = Errore M3)',
          alert_attribute: 'Attributo da monitorare per Alert (vuoto = stato principale)',
          alert_operator: 'Condizione Alert',
          alert_value: 'Valore / soglia Alert (opzionale per "Quando cambia")',
          state_content: 'Contenuto stato (stato / attributi)',
          active_state: 'Stati attivi personalizzati (es. on,open,problem)',
          tap_action: 'Azione al tocco',
          navigation_path: 'Percorso dashboard o #hash Pop-up',
          progress_enabled: 'Abilita Entity Progress Badge',
          progress_start_now: 'Partenza da ora (sveglie / remaining time)',
          progress_entity: 'Entità progresso (vuoto = entità principale, es. history_stats)',
          progress_start_entity: 'Entità valore iniziale (numero, counter, data/ora)',
          progress_start_value: 'Valore iniziale fisso (es. 0, 07:30, now)',
          progress_end_entity: 'Entità valore finale (numero, counter, data/ora, timer)',
          progress_end_value: 'Valore finale fisso (es. 100, 22:00, minuti max)',
          progress_invert: 'Inverti barra (100% → 0%)',
          progress_show_percent: 'Mostra percentuale (%)',
          progress_show_entity_state: 'Mostra stato entità progresso nella barra',
        };
        return labels[schema.name] ?? schema.name;
      },
    };
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this._config) return false;
    if (
      changedProps.has('_config') ||
      changedProps.has('_pressed') ||
      changedProps.has('_tick') ||
      changedProps.has('_alertPulse')
    ) {
      return true;
    }
    if (changedProps.has('hass') && this.hass) {
      const next = this.hass.states[this._config.entity];
      const nextProgress = this._config.progress_entity
        ? this.hass.states[this._config.progress_entity]
        : undefined;
      const nextStart = this._config.progress_start_entity
        ? this.hass.states[this._config.progress_start_entity]
        : undefined;
      const nextEnd = this._config.progress_end_entity
        ? this.hass.states[this._config.progress_end_entity]
        : undefined;
      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
      if (
        next !== this._prevEntity ||
        nextProgress !== this._prevProgressEntity ||
        nextStart !== this._prevStartEntity ||
        nextEnd !== this._prevEndEntity ||
        oldHass?.themes?.darkMode !== this.hass.themes?.darkMode
      ) {
        this._prevEntity = next;
        this._prevProgressEntity = nextProgress;
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

  private _getAlertSourceValue(entity?: HassEntity): string {
    if (!entity) return '';
    const attr = this._config?.alert_attribute?.trim();
    const raw = attr ? entity.attributes?.[attr] : entity.state;
    if (raw === undefined || raw === null) return '';
    return typeof raw === 'object' ? JSON.stringify(raw) : String(raw).trim();
  }

  private _isAlertTriggered(isActive: boolean, style: string): boolean {
    const cfg = this._config;
    if (!cfg) return false;
    const hasCustomCondition = Boolean(
      cfg.alert_attribute?.trim() || cfg.alert_operator || cfg.alert_value?.trim(),
    );
    if (!hasCustomCondition) {
      return isActive && (Boolean(cfg.alert_color) || style === 'alert');
    }
    const entity = this._entity;
    if (!entity || this._isUnavailable) return false;

    const rawVal = this._getAlertSourceValue(entity);
    const targetRaw = cfg.alert_value?.trim() ?? '';
    const op = cfg.alert_operator ?? (targetRaw ? 'equals' : 'changed');

    if (op === 'changed') {
      if (targetRaw) {
        return rawVal.toLowerCase() !== targetRaw.toLowerCase();
      }
      return this._alertPulse;
    }

    if (!targetRaw) return false;

    if (op === 'above' || op === 'below') {
      const numVal = Number(rawVal);
      const numTarget = Number(targetRaw);
      if (!Number.isFinite(numVal) || !Number.isFinite(numTarget)) return false;
      return op === 'above' ? numVal > numTarget : numVal < numTarget;
    }

    const targets = targetRaw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    const low = rawVal.toLowerCase();
    if (op === 'equals') return targets.includes(low);
    if (op === 'not_equals') return rawVal !== '' && !targets.includes(low);
    return false;
  }

  protected willUpdate(changedProps: PropertyValues): void {
    if (!this._config || (!changedProps.has('hass') && !changedProps.has('_config'))) {
      return;
    }
    const hasCustomCondition = Boolean(
      this._config.alert_attribute?.trim() ||
        this._config.alert_operator ||
        this._config.alert_value?.trim(),
    );
    const op = this._config.alert_operator ?? (this._config.alert_value?.trim() ? 'equals' : 'changed');
    if (!hasCustomCondition || op !== 'changed' || this._config.alert_value?.trim()) {
      return;
    }
    const curVal = this._getAlertSourceValue(this._entity);
    if (this._prevAlertRaw === undefined) {
      this._prevAlertRaw = curVal;
    } else if (curVal !== this._prevAlertRaw) {
      this._prevAlertRaw = curVal;
      this._alertPulse = true;
      if (this._alertPulseTimer !== null) {
        window.clearTimeout(this._alertPulseTimer);
      }
      this._alertPulseTimer = window.setTimeout(() => {
        this._alertPulse = false;
        this._alertPulseTimer = null;
      }, 12000);
    }
  }

  private _formatEntityValue(entity?: HassEntity): string {
    if (!entity || !entity.state || entity.state === 'unavailable' || entity.state === 'unknown') {
      return t(this.hass, 'offline');
    }

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
      return unit ? `${clean} ${unit}` : clean;
    }
    if (typeof this.hass?.formatEntityState === 'function') {
      try {
        return this.hass.formatEntityState(entity);
      } catch {
        // fallback below
      }
    }
    return unit ? `${raw} ${unit}` : raw;
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
    const rawStyle = this._config.badge_style ?? 'glance';
    const style = rawStyle === 'alert' ? 'split' : rawStyle;
    const isUnavailable = this._isUnavailable;
    const isActive = this._isActive;
    const isAlert = !isUnavailable && this._isAlertTriggered(isActive, rawStyle);
    const name = resolveEntityName(this.hass, entity, this._config.name, this._config.entity);

    const isDark = this.hass?.themes?.darkMode !== false;
    const palette = isUnavailable
      ? null
      : isAlert && this._config.alert_custom_color
        ? buildM3BadgeTonalPalette(this._config.alert_custom_color, isDark)
        : !isAlert && this._config.base_color
          ? buildM3BadgeTonalPalette(this._config.base_color, isDark)
          : null;

    const progress = computeBadgeProgress(this.hass, this._config);
    const hasProgress = progress.percent !== null;
    const progressPct = progress.percent ?? 0;

    const progressEnt =
      this._config.progress_enabled &&
      this._config.progress_show_entity_state &&
      this._config.progress_entity
        ? this.hass?.states[this._config.progress_entity]
        : undefined;
    const valueSourceEnt = progressEnt ?? entity;
    const baseVal = progress.liveRemainingText || this._formatEntityValue(valueSourceEnt);
    const hideState = Boolean(this._config.hide_state);
    const stateContentVal =
      !hideState && !progressEnt
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
    const ringCircumference = 119.38;
    const ringOffset = ringCircumference * (1 - progressPct / 100);

    const inlineStyles: string[] = [];
    if (hasProgress) inlineStyles.push(`--badge-pct: ${progressPct.toFixed(1)}%`);
    if (palette) {
      inlineStyles.push(
        `--m3e-badge-container: ${palette.container}`,
        `--m3e-badge-well: ${palette.well}`,
        `--m3e-badge-progress: ${palette.progressFill}`,
        `--m3e-badge-on-container: ${palette.onContainer}`,
        `--m3e-badge-accent: ${palette.accent}`,
        `--m3e-badge-on-accent: ${palette.onAccent}`,
      );
    }

    const commonHandlers = html`
      <button
        type="button"
        class="m3e-badge style-${style} ${stateClass} ${palette ? 'has-custom-color' : ''} ${hasProgress ? 'has-progress' : ''} ${this._pressed ? 'is-pressed' : ''} ${clickable ? 'is-clickable' : ''}"
        style=${inlineStyles.length > 0 ? inlineStyles.join('; ') : ''}
        title="${name}${valueText ? ` · ${valueText}` : ''}"
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
        ${hasProgress && (style === 'dot' || style === 'split')
          ? html`<span class="badge-progress-fill" aria-hidden="true"></span>`
          : nothing}

        ${style === 'glance' || style === 'glance_icon'
          ? html`
              <span class="g-circle ${hasProgress ? 'has-ring' : ''}" aria-hidden="true">
                ${hasProgress
                  ? html`
                      <svg class="g-ring" viewBox="0 0 44 44" aria-hidden="true">
                        <circle class="g-ring-track" cx="22" cy="22" r="19" />
                        <circle
                          class="g-ring-fill"
                          cx="22"
                          cy="22"
                          r="19"
                          stroke-dasharray=${ringCircumference}
                          stroke-dashoffset=${ringOffset}
                        />
                      </svg>
                    `
                  : nothing}
                <span class="g-circle-inner">${this._renderIcon(entity, isActive)}</span>
              </span>
              ${style === 'glance'
                ? html`
                    <span class="g-text">
                      ${valueText ? html`<span class="g-val">${valueText}</span>` : nothing}
                      <span class="g-lbl">${name}</span>
                    </span>
                  `
                : nothing}
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
                <span class="s-content">
                  <span class="s-left" aria-hidden="true">${this._renderIcon(entity, isActive)}</span>
                  <span class="s-right">
                    <span class="s-lbl">${name}</span>
                    ${valueText ? html`<span class="s-val">${valueText}</span>` : nothing}
                  </span>
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
          border-radius var(--m3e-spring-bouncy);
        -webkit-tap-highlight-color: transparent;
      }

      .badge-progress-fill {
        position: absolute;
        inset: 0 auto 0 0;
        height: 100%;
        border-radius: 0;
        width: var(--badge-pct, 0%);
        background: color-mix(
          in srgb,
          var(--md-sys-color-primary-container, #2e4379) 82%,
          transparent
        );
        transition: width 0.4s cubic-bezier(0.2, 0, 0, 1);
        pointer-events: none;
        z-index: 0;
      }

      .m3e-badge.is-alert .badge-progress-fill {
        background: color-mix(
          in srgb,
          var(--md-sys-color-error, #ffb4ab) 32%,
          var(--md-sys-color-error-container, #93000a)
        );
      }

      .style-dot.is-alert .badge-progress-fill {
        background: color-mix(
          in srgb,
          var(--md-sys-color-error-container, #93000a) 76%,
          transparent
        );
      }

      .m3e-badge.is-active:not(.is-alert) .badge-progress-fill {
        background: color-mix(
          in srgb,
          var(--md-sys-color-primary, #b1c5ff) 35%,
          var(--md-sys-color-primary-container, #2e4379)
        );
      }

      .m3e-badge.style-dot.is-active:not(.is-alert) .badge-progress-fill {
        background: color-mix(
          in srgb,
          var(--md-sys-color-primary-container, #2e4379) 76%,
          transparent
        );
      }

      .m3e-badge.has-custom-color .badge-progress-fill {
        background: var(--m3e-badge-progress);
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
         1. GLANCE MINI (Compact At a Glance — 40px/44px circle + thick progress ring)
         ===================================================================== */
      .m3e-badge.style-glance {
        background: transparent;
        padding: 2px 6px 2px 2px;
        gap: 9px;
        border-radius: 9999px;
      }

      .m3e-badge.style-glance_icon {
        background: transparent;
        padding: 0;
        border-radius: 9999px;
      }

      .g-circle {
        position: relative;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        flex-shrink: 0;
      }

      .style-glance_icon .g-circle {
        width: 44px;
        height: 44px;
      }

      .g-circle-inner {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: var(
          --md-sys-color-surface-container-highest,
          var(--secondary-background-color, rgba(128, 128, 128, 0.18))
        );
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
        transition:
          width var(--m3e-spring-spatial-fast),
          height var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default);
      }

      .g-circle.has-ring .g-circle-inner {
        width: calc(100% - 11px);
        height: calc(100% - 11px);
      }

      .g-ring {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
        pointer-events: none;
      }

      .g-ring-track {
        fill: none;
        stroke: color-mix(in srgb, var(--md-sys-color-outline-variant, #74777f) 34%, transparent);
        stroke-width: 4.2;
      }

      .g-ring-fill {
        fill: none;
        stroke: var(--md-sys-color-primary, #b1c5ff);
        stroke-width: 4.4;
        stroke-linecap: round;
        transition: stroke-dashoffset var(--m3e-spring-spatial-default);
      }

      .style-glance.is-active .g-circle-inner,
      .style-glance_icon.is-active .g-circle-inner {
        background: var(--md-sys-color-primary-container, #2e4379);
        color: var(--md-sys-color-on-primary-container, #dae2ff);
      }

      .style-glance.is-alert .g-circle-inner,
      .style-glance_icon.is-alert .g-circle-inner {
        background: var(--md-sys-color-error-container, #93000a);
        color: var(--md-sys-color-on-error-container, #ffdad6);
      }

      .style-glance.is-alert .g-ring-fill,
      .style-glance_icon.is-alert .g-ring-fill {
        stroke: var(--md-sys-color-error, #ffb4ab);
      }

      .style-glance.has-custom-color .g-circle-inner,
      .style-glance_icon.has-custom-color .g-circle-inner {
        background: var(--m3e-badge-container);
        color: var(--m3e-badge-on-container);
      }

      .style-glance.has-custom-color .g-ring-fill,
      .style-glance_icon.has-custom-color .g-ring-fill {
        stroke: var(--m3e-badge-accent);
      }

      .g-circle-inner svg,
      .g-circle-inner ha-icon {
        width: 19px;
        height: 19px;
        --mdc-icon-size: 19px;
      }

      .style-glance_icon .g-circle-inner svg,
      .style-glance_icon .g-circle-inner ha-icon {
        width: 21px;
        height: 21px;
        --mdc-icon-size: 21px;
      }

      .g-circle.has-ring .g-circle-inner svg,
      .g-circle.has-ring .g-circle-inner ha-icon {
        width: 16px;
        height: 16px;
        --mdc-icon-size: 16px;
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
         2. SPLIT TONAL PILL (4-Layer Fitbit Stadium-Well Pill — 44px height)
         ===================================================================== */
      .m3e-badge.style-split {
        position: relative;
        height: 44px;
        padding: 5px 14px 5px 5px;
        border-radius: 14px;
        overflow: hidden;
        background: var(--md-sys-color-surface-container-low, #1f2027);
      }

      .m3e-badge.style-split.is-active {
        background: color-mix(
          in srgb,
          var(--md-sys-color-scrim, #000000) 28%,
          var(--md-sys-color-primary-container, #2e4379)
        );
        color: var(--md-sys-color-on-primary-container, #dae2ff);
      }

      .m3e-badge.style-split.is-alert {
        background: color-mix(
          in srgb,
          var(--md-sys-color-scrim, #000000) 28%,
          var(--md-sys-color-error-container, #93000a)
        );
        color: var(--md-sys-color-on-error-container, #ffdad6);
      }

      .m3e-badge.style-split.has-custom-color {
        background: var(--m3e-badge-container);
        color: var(--m3e-badge-on-container);
      }

      .s-content {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 9px;
        height: 100%;
        min-width: 0;
        flex: 1;
      }

      .s-left {
        width: 24px;
        height: 34px;
        border-radius: 9999px;
        display: grid;
        place-items: center;
        flex-shrink: 0;
        background: color-mix(
          in srgb,
          var(--md-sys-color-scrim, #000000) 28%,
          var(--md-sys-color-surface-container-low, #1f2027)
        );
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
        transition:
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default);
      }

      .style-split.is-active .s-left {
        background: color-mix(
          in srgb,
          var(--md-sys-color-scrim, #000000) 44%,
          var(--md-sys-color-primary-container, #2e4379)
        );
        color: var(--md-sys-color-on-primary-container, #dae2ff);
      }

      .style-split.is-alert .s-left {
        background: color-mix(
          in srgb,
          var(--md-sys-color-scrim, #000000) 44%,
          var(--md-sys-color-error-container, #93000a)
        );
        color: var(--md-sys-color-on-error-container, #ffdad6);
      }

      .style-split.has-custom-color .s-left {
        background: var(--m3e-badge-well);
        color: var(--m3e-badge-on-container);
      }

      .s-left svg,
      .s-left ha-icon {
        width: 15px;
        height: 15px;
        --mdc-icon-size: 15px;
      }

      .s-right {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1px;
        min-width: 0;
      }

      .s-lbl {
        font-size: 10.5px;
        font-weight: 500;
        line-height: 1.1;
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .style-split.is-active .s-lbl,
      .style-split.is-alert .s-lbl,
      .style-split.has-custom-color .s-lbl {
        color: inherit;
        opacity: 0.9;
      }

      .s-val {
        font-size: 14px;
        font-weight: 700;
        line-height: 1.1;
        font-variant-numeric: tabular-nums;
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

      .m3e-badge.style-dot.has-custom-color {
        background: var(--m3e-badge-container);
        color: var(--m3e-badge-on-container);
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

      .style-dot.has-custom-color .d-wrap {
        background: var(--m3e-badge-well);
        color: var(--m3e-badge-on-container);
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

      .style-dot.has-custom-color .d-dot {
        background: var(--m3e-badge-accent);
        border-color: var(--m3e-badge-container);
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
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-status-badge': M3EStatusBadge;
  }
}
