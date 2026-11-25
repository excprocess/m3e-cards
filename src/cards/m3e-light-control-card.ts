import { LitElement, css, html, nothing, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { m3eBaseStyles } from '../styles/m3e-tokens';
import type { HassEntity, HomeAssistant, M3ELightControlCardConfig } from '../types/home-assistant';

@customElement('m3e-light-control-card')
export class M3ELightControlCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3ELightControlCardConfig;
  @state() private _optimisticOn: boolean | null = null;

  private _optimisticTimer: number | null = null;
  private _lastAnyOn?: boolean;
  private _lastDarkMode?: boolean;

  public static getStubConfig(): M3ELightControlCardConfig {
    return {
      type: 'custom:m3e-light-control-card',
      label_on: 'All on',
      label_off: 'All off',
    };
  }

  public static getConfigForm() {
    return {
      schema: [
        {
          name: 'entities',
          selector: { entity: { domain: 'light', multiple: true } },
        },
        {
          type: 'grid',
          name: '',
          schema: [
            { name: 'label_on', selector: { text: {} } },
            { name: 'label_off', selector: { text: {} } },
          ],
        },
        { name: 'use_theme_color', selector: { boolean: {} } },
      ],
      computeLabel: (schema: { name: string }) => {
        const labels: Record<string, string> = {
          entities: 'Luci o gruppi da controllare (vuoto = tutte le luci di casa)',
          label_on: 'Testo sinistra (default: All on)',
          label_off: 'Testo destra (default: All off)',
          use_theme_color: 'Usa colore tema M3Y invece dell’ambra caldo',
        };
        return labels[schema.name] ?? schema.name;
      },
    };
  }

  public setConfig(config: M3ELightControlCardConfig): void {
    this._config = {
      label_on: 'All on',
      label_off: 'All off',
      use_theme_color: false,
      ...config,
    };
  }

  public getCardSize(): number {
    return 1;
  }

  public getGridOptions() {
    return { rows: 'auto', columns: 12, min_columns: 6 };
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._optimisticTimer !== null) {
      window.clearTimeout(this._optimisticTimer);
      this._optimisticTimer = null;
    }
  }

  private get _isDark(): boolean {
    if (typeof this.hass?.themes?.darkMode === 'boolean') {
      return this.hass.themes.darkMode;
    }
    return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  }

  private _targetLightEntities(): HassEntity[] {
    if (!this.hass) return [];
    const configured = this._config?.entities;
    if (Array.isArray(configured) && configured.length > 0) {
      return configured
        .map((id) => this.hass!.states[id])
        .filter((e): e is HassEntity => Boolean(e));
    }
    return Object.values(this.hass.states).filter((e) => e.entity_id.startsWith('light.'));
  }

  private _computeAnyOn(): boolean {
    return this._targetLightEntities().some((e) => e.state === 'on');
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (changedProps.has('_config') || changedProps.has('_optimisticOn')) {
      return true;
    }
    if (changedProps.has('hass')) {
      const nextAnyOn = this._computeAnyOn();
      const nextDark = this._isDark;
      if (nextAnyOn !== this._lastAnyOn || nextDark !== this._lastDarkMode) {
        this._lastAnyOn = nextAnyOn;
        this._lastDarkMode = nextDark;
        return true;
      }
      return false;
    }
    return false;
  }

  private _spawnRipple(e: PointerEvent): void {
    const btn = e.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.1;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const wave = document.createElement('span');
    wave.className = 'm3-ripple';
    wave.style.width = `${size}px`;
    wave.style.height = `${size}px`;
    wave.style.left = `${x}px`;
    wave.style.top = `${y}px`;
    btn.appendChild(wave);

    const anim = wave.animate(
      [
        { transform: 'scale(0.15)', opacity: 0.28 },
        { transform: 'scale(1)', opacity: 0.16, offset: 0.65 },
        { transform: 'scale(1.05)', opacity: 0 },
      ],
      {
        duration: 460,
        easing: 'cubic-bezier(0.2, 0, 0, 1)',
      },
    );
    anim.onfinish = () => wave.remove();
  }

  private _trigger(turnOn: boolean): void {
    if (!this.hass) return;
    const configured = this._config?.entities;
    const target =
      Array.isArray(configured) && configured.length > 0 ? configured : 'all';

    this._optimisticOn = turnOn;
    if (this._optimisticTimer !== null) {
      window.clearTimeout(this._optimisticTimer);
    }
    this._optimisticTimer = window.setTimeout(() => {
      this._optimisticOn = null;
      this._optimisticTimer = null;
    }, 1200);

    this.hass.callService('light', turnOn ? 'turn_on' : 'turn_off', {
      entity_id: target,
    });
  }

  protected render() {
    if (!this._config) return nothing;
    const isOn = this._optimisticOn !== null ? this._optimisticOn : this._computeAnyOn();
    const labelOn = this._config.label_on?.trim() || 'All on';
    const labelOff = this._config.label_off?.trim() || 'All off';
    const useTheme = Boolean(this._config.use_theme_color);
    const isDark = this._isDark;

    return html`
      <ha-card
        class="control-pill ${isOn ? 'state-on' : 'state-off'} ${useTheme ? 'use-theme' : ''} ${isDark ? 'is-dark' : 'is-light'}"
        role="group"
        aria-label="Light control"
      >
        <!-- Sliding shared-element active indicator with razor-sharp curved border & straight center edge -->
        <div class="pill-indicator" aria-hidden="true"></div>

        <button
          type="button"
          class="seg-btn seg-left ${isOn ? 'is-selected' : ''}"
          aria-pressed=${String(isOn)}
          @pointerdown=${(e: PointerEvent) => this._spawnRipple(e)}
          @click=${() => this._trigger(true)}
        >
          <span class="seg-label">${labelOn}</span>
        </button>

        <button
          type="button"
          class="seg-btn seg-right ${!isOn ? 'is-selected' : ''}"
          aria-pressed=${String(!isOn)}
          @pointerdown=${(e: PointerEvent) => this._spawnRipple(e)}
          @click=${() => this._trigger(false)}
        >
          <span class="seg-label">${labelOff}</span>
        </button>
      </ha-card>
    `;
  }

  static styles = [
    m3eBaseStyles,
    css`
      .control-pill {
        position: relative;
        height: 100%;
        min-height: 64px;
        border-radius: var(--m3e-corner-full);
        display: grid;
        grid-template-columns: 1fr 1fr;
        overflow: hidden;
        background: var(--ha-card-background, var(--md-sys-color-surface-container, #efefef));
        /* Google Home Light Mode warm amber palette */
        --pill-active-bg: #fae08d;
        --pill-active-fg: #5c4900;
        --pill-active-border: #6f5900;
        --pill-ripple: #6f5900;
      }

      /* Google Home Dark Mode warm amber container */
      .control-pill.is-dark:not(.use-theme) {
        --pill-active-bg: #4d411c;
        --pill-active-fg: #ffe082;
        --pill-active-border: #d9be6c;
        --pill-ripple: #ffe082;
      }

      /* Optional M3Y theme override */
      .control-pill.use-theme {
        --pill-active-bg: var(--md-sys-color-primary-container, #dbe1ff);
        --pill-active-fg: var(--md-sys-color-on-primary-container, #1c1b18);
        --pill-active-border: var(--md-sys-color-on-primary-container, #1c1b18);
        --pill-ripple: var(--md-sys-color-on-primary-container, #1c1b18);
      }

      /* Sliding active indicator: full pill outer edge + straight vertical center edge */
      .pill-indicator {
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        width: 50%;
        pointer-events: none;
        box-sizing: border-box;
        background: var(--pill-active-bg);
        box-shadow: inset 0 0 0 1.5px var(--pill-active-border);
        border-radius: 9999px 0 0 9999px;
        transform: translateX(0%);
        transition:
          transform 280ms cubic-bezier(0.2, 0, 0, 1),
          border-radius 280ms cubic-bezier(0.2, 0, 0, 1),
          background-color 200ms cubic-bezier(0.2, 0, 0, 1);
      }

      .control-pill.state-off .pill-indicator {
        transform: translateX(100%);
        border-radius: 0 9999px 9999px 0;
      }

      .seg-btn {
        position: relative;
        z-index: 1;
        overflow: hidden;
        border: 0;
        margin: 0;
        padding: 0 16px;
        min-height: 64px;
        background: transparent;
        cursor: pointer;
        font: inherit;
        font-size: 15px;
        font-weight: 500;
        letter-spacing: 0.1px;
        color: var(--md-sys-color-on-surface, #1c1b18);
        display: flex;
        align-items: center;
        justify-content: center;
        outline: none;
        transition: color 200ms cubic-bezier(0.2, 0, 0, 1);
      }

      .seg-left {
        border-radius: 9999px 0 0 9999px;
      }

      .seg-right {
        border-radius: 0 9999px 9999px 0;
      }

      .seg-btn.is-selected {
        color: var(--pill-active-fg);
      }

      .seg-label {
        position: relative;
        z-index: 1;
        pointer-events: none;
      }

      .m3-ripple {
        position: absolute;
        border-radius: 50%;
        background: var(--pill-ripple);
        pointer-events: none;
        transform-origin: center;
      }

      .seg-btn:focus-visible {
        outline: 2px solid var(--md-sys-color-primary, #4c5c92);
        outline-offset: -3px;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-light-control-card': M3ELightControlCard;
  }
}
