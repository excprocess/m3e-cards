import { LitElement, css, html, nothing, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { m3eBaseStyles } from '../styles/m3e-tokens';
import type { HassEntity, HomeAssistant, M3ELightControlCardConfig } from '../types/home-assistant';

@customElement('m3e-light-control-card')
export class M3ELightControlCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3ELightControlCardConfig;
  @state() private _pressedSide: 'on' | 'off' | null = null;
  @state() private _optimisticOn: boolean | null = null;

  private _optimisticTimer: number | null = null;
  private _lastAnyOn?: boolean;

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
    if (
      changedProps.has('_config') ||
      changedProps.has('_pressedSide') ||
      changedProps.has('_optimisticOn')
    ) {
      return true;
    }
    if (changedProps.has('hass')) {
      const nextAnyOn = this._computeAnyOn();
      if (nextAnyOn !== this._lastAnyOn) {
        this._lastAnyOn = nextAnyOn;
        return true;
      }
      return false;
    }
    return false;
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

    return html`
      <ha-card
        class="control-pill ${isOn ? 'state-on' : 'state-off'} ${useTheme ? 'use-theme' : ''} ${this._pressedSide ? `pressing-${this._pressedSide}` : ''}"
        role="group"
        aria-label="Light control"
      >
        <!-- Sliding shared-element active indicator with pill outer edge & straight center divider -->
        <div class="pill-indicator" aria-hidden="true"></div>

        <button
          type="button"
          class="seg-btn seg-left ${isOn ? 'is-selected' : ''}"
          aria-pressed=${String(isOn)}
          @pointerdown=${() => (this._pressedSide = 'on')}
          @pointerup=${() => (this._pressedSide = null)}
          @pointerleave=${() => (this._pressedSide = null)}
          @pointercancel=${() => (this._pressedSide = null)}
          @click=${() => this._trigger(true)}
        >
          <span>${labelOn}</span>
        </button>

        <button
          type="button"
          class="seg-btn seg-right ${!isOn ? 'is-selected' : ''}"
          aria-pressed=${String(!isOn)}
          @pointerdown=${() => (this._pressedSide = 'off')}
          @pointerup=${() => (this._pressedSide = null)}
          @pointerleave=${() => (this._pressedSide = null)}
          @pointercancel=${() => (this._pressedSide = null)}
          @click=${() => this._trigger(false)}
        >
          <span>${labelOff}</span>
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
        min-height: 68px;
        border-radius: var(--m3e-corner-full);
        display: grid;
        grid-template-columns: 1fr 1fr;
        overflow: hidden;
        background: var(--ha-card-background, var(--md-sys-color-surface-container-low, #efefef));
        --pill-active-bg: #fae08d;
        --pill-active-press: #dfd08d;
        --pill-active-fg: #1c1b18;
        --pill-active-border: #1c1b18;
      }

      .control-pill.use-theme {
        --pill-active-bg: var(--md-sys-color-primary-container, #dbe1ff);
        --pill-active-press: color-mix(
          in srgb,
          var(--md-sys-color-primary, #4c5c92) 22%,
          var(--md-sys-color-primary-container, #dbe1ff)
        );
        --pill-active-fg: var(--md-sys-color-on-primary-container, #1c1b18);
        --pill-active-border: var(--md-sys-color-on-primary-container, #1c1b18);
      }

      /* Sliding active indicator with M3 Spatial motion & shape morphing */
      .pill-indicator {
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        width: 50%;
        pointer-events: none;
        box-sizing: border-box;
        background: var(--pill-active-bg);
        border: 1.5px solid var(--pill-active-border);
        border-radius: 9999px 0 0 9999px;
        transform: translateX(0%);
        transition:
          transform 300ms cubic-bezier(0.2, 0, 0, 1),
          border-radius 300ms cubic-bezier(0.2, 0, 0, 1),
          background-color 180ms cubic-bezier(0.2, 0, 0, 1);
      }

      .control-pill.state-off .pill-indicator {
        transform: translateX(100%);
        border-radius: 0 9999px 9999px 0;
      }

      .control-pill.state-on.pressing-on .pill-indicator,
      .control-pill.state-off.pressing-off .pill-indicator {
        background: var(--pill-active-press);
      }

      .seg-btn {
        position: relative;
        z-index: 1;
        border: 0;
        margin: 0;
        padding: 0 16px;
        min-height: 68px;
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
        transition:
          color 200ms cubic-bezier(0.2, 0, 0, 1),
          transform 160ms cubic-bezier(0.2, 0, 0, 1);
      }

      .seg-btn.is-selected {
        color: var(--pill-active-fg);
      }

      .seg-btn:active {
        transform: scale(0.97);
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
