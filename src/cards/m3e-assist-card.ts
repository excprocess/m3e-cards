import { LitElement, css, html, nothing, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { m3eBaseStyles } from '../styles/m3e-tokens';
import { guardDialogTouchMove } from '../utils/scroll-lock';
import type { HassEntity, HomeAssistant, M3EAssistCardConfig } from '../types/home-assistant';

@customElement('m3e-assist-card')
export class M3EAssistCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3EAssistCardConfig;
  @state() private _pressed = false;
  @state() private _selectorOpen = false;

  @query('dialog.mode-dialog') private _dialogEl?: HTMLDialogElement;
  @query('.dialog-surface') private _dialogSurfaceEl?: HTMLElement;

  private _prevEntityState?: HassEntity;

  public static getStubConfig(hass?: HomeAssistant): M3EAssistCardConfig {
    const firstSelect = hass
      ? Object.keys(hass.states).find(
          (id) => id.startsWith('input_select.') || id.startsWith('select.'),
        )
      : undefined;
    return {
      type: 'custom:m3e-assist-card',
      entity: firstSelect,
      placeholder: 'Chiedi a Home Assistant',
      pipeline_id: 'preferred',
      start_listening: false,
    };
  }

  public static getConfigForm() {
    return {
      schema: [
        { name: 'placeholder', selector: { text: {} } },
        {
          name: 'entity',
          selector: { entity: { domain: ['input_select', 'select'] } },
        },
        { name: 'start_listening', selector: { boolean: {} } },
        { name: 'pipeline_id', selector: { text: {} } },
      ],
      computeLabel: (schema: { name: string }) => {
        const labels: Record<string, string> = {
          placeholder: 'Testo barra Assist (es. "Ask Corazza\'s" o "Chiedi a Casa")',
          entity:
            'Selettore modalità casa (input_select / select per sostituire Home/Away di Google Home)',
          start_listening: 'Avvia ascolto vocale subito (spento = apre chat testuale Assist)',
          pipeline_id: 'Pipeline Assist (opzionale, default: preferred)',
        };
        return labels[schema.name] ?? schema.name;
      },
      computeHelper: (schema: { name: string }) => {
        if (schema.name === 'entity') {
          return 'Collega un input_select (es. Casa / Fuori / Notte) al pulsante circolare a sinistra: al tap apre il selettore Material 3 Expressive come su Google Home.';
        }
        return undefined;
      },
    };
  }

  public setConfig(config: M3EAssistCardConfig): void {
    this._config = {
      placeholder: 'Chiedi a Home Assistant',
      pipeline_id: 'preferred',
      start_listening: false,
      ...config,
    };
  }

  public getCardSize(): number {
    return 1;
  }

  public getGridOptions() {
    return { rows: 'auto', columns: 12, min_columns: 6 };
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (
      changedProps.has('_config') ||
      changedProps.has('_pressed') ||
      changedProps.has('_selectorOpen')
    ) {
      return true;
    }
    if (changedProps.has('hass') && this._config?.entity && this.hass) {
      const next = this.hass.states[this._config.entity];
      if (next !== this._prevEntityState) {
        this._prevEntityState = next;
        return true;
      }
      return false;
    }
    return false;
  }

  private get _modeEntity(): HassEntity | undefined {
    if (!this.hass || !this._config?.entity) return undefined;
    return this.hass.states[this._config.entity];
  }

  private get _options(): string[] {
    const opts = this._modeEntity?.attributes.options;
    return Array.isArray(opts) ? opts.map(String) : [];
  }

  private _openAssist(): void {
    const actionConfig = {
      tap_action: {
        action: 'assist',
        pipeline_id: this._config?.pipeline_id || 'preferred',
        start_listening: Boolean(this._config?.start_listening),
      },
    };
    this.dispatchEvent(
      new CustomEvent('hass-action', {
        bubbles: true,
        composed: true,
        detail: {
          config: actionConfig,
          action: 'tap',
        },
      }),
    );
  }

  public async openModeSelector(e?: Event): Promise<void> {
    e?.stopPropagation();
    if (!this._modeEntity || this._options.length === 0 || this._selectorOpen) return;
    window.getSelection()?.removeAllRanges();
    this._selectorOpen = true;
    await this.updateComplete;

    const dialog = this._dialogEl;
    const surface = this._dialogSurfaceEl;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();

    if (surface) {
      const isMobile = window.matchMedia('(max-width: 600px)').matches;
      surface.animate(
        isMobile
          ? [
              { transform: 'translateY(36px)', opacity: 0 },
              { transform: 'translateY(0px)', opacity: 1 },
            ]
          : [
              { transform: 'scale(0.92)', opacity: 0 },
              { transform: 'scale(1)', opacity: 1 },
            ],
        { duration: 280, easing: 'cubic-bezier(0.2, 0.9, 0.2, 1)' },
      );
    }
  }

  public closeModeSelector(): void {
    const dialog = this._dialogEl;
    const surface = this._dialogSurfaceEl;
    if (!dialog || !dialog.open) {
      this._selectorOpen = false;
      return;
    }
    if (surface) {
      const isMobile = window.matchMedia('(max-width: 600px)').matches;
      const anim = surface.animate(
        isMobile
          ? [
              { transform: 'translateY(0px)', opacity: 1 },
              { transform: 'translateY(28px)', opacity: 0 },
            ]
          : [
              { transform: 'scale(1)', opacity: 1 },
              { transform: 'scale(0.94)', opacity: 0 },
            ],
        { duration: 160, easing: 'cubic-bezier(0.4, 0, 1, 1)' },
      );
      anim.onfinish = () => {
        dialog.close();
        this._selectorOpen = false;
      };
    } else {
      dialog.close();
      this._selectorOpen = false;
    }
  }

  private _selectOption(option: string): void {
    if (!this.hass || !this._config?.entity) return;
    const domain = this._config.entity.split('.')[0];
    this.hass.callService(domain, 'select_option', {
      entity_id: this._config.entity,
      option,
    });
    window.setTimeout(() => this.closeModeSelector(), 160);
  }

  private _renderOptionIcon(option: string, filled: boolean) {
    const lower = option.toLowerCase();

    // Away / Fuori / Assente -> person outside house (Google Home Away icon)
    if (
      lower.includes('away') ||
      lower.includes('fuori') ||
      lower.includes('assent') ||
      lower.includes('out') ||
      lower.includes('vacanz')
    ) {
      return html`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M10 3 2 9v12h7v-2H4v-9l6-4.5L15 9.25V11h2V8.25L10 3Zm7 10a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm0 6c-2.67 0-5 1.34-5 3v1h10v-1c0-1.66-2.33-3-5-3Z"
          />
        </svg>
      `;
    }

    // Night / Notte / Sleep -> moon icon
    if (lower.includes('night') || lower.includes('nott') || lower.includes('sleep')) {
      return html`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12.3 4.9a7 7 0 0 0 6.8 9.2A8 8 0 1 1 12.3 4.9Z"
          />
        </svg>
      `;
    }

    // Home / Casa / default -> person inside house (Google Home icon, filled when selected)
    return filled
      ? html`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 3 3 10v11h18V10l-9-7Zm0 5.5a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5Zm4.5 9.5h-9v-.75c0-1.5 3-2.25 4.5-2.25s4.5.75 4.5 2.25V18Z"
            />
          </svg>
        `
      : html`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 3 3 10v11h18V10l-9-7Zm7 16H5v-8l7-5.44L19 11v8Zm-7-9.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-4 7.5h8v-.5c0-1.33-2.67-2-4-2s-4 .67-4 2v.5Z"
            />
          </svg>
        `;
  }

  protected render() {
    if (!this._config) return nothing;
    const modeEntity = this._modeEntity;
    const currentMode = modeEntity?.state ?? '';
    const hasMode = Boolean(modeEntity && this._options.length > 0);
    const placeholder = this._config.placeholder?.trim() || 'Chiedi a Home Assistant';

    return html`
      <ha-card
        class="assist-bar ${this._pressed ? 'is-pressed' : ''}"
        role="button"
        tabindex="0"
        aria-label=${placeholder}
        @pointerdown=${(e: PointerEvent) => {
          if (e.button === 0) this._pressed = true;
        }}
        @pointerup=${() => (this._pressed = false)}
        @pointerleave=${() => (this._pressed = false)}
        @pointercancel=${() => (this._pressed = false)}
        @click=${() => this._openAssist()}
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this._openAssist();
          }
        }}
      >
        <div class="state-layer" aria-hidden="true"></div>

        <div class="bar-inner">
          ${hasMode
            ? html`
                <button
                  type="button"
                  class="mode-dot-btn"
                  title=${`${modeEntity!.attributes.friendly_name ?? 'Modalità'}: ${currentMode}`}
                  aria-label=${`Cambia modalità (${currentMode})`}
                  @pointerdown=${(e: Event) => e.stopPropagation()}
                  @click=${(e: Event) => this.openModeSelector(e)}
                >
                  ${this._renderOptionIcon(currentMode, true)}
                </button>
              `
            : html`
                <span class="mode-dot-static" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9Zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5Z"
                    />
                  </svg>
                </span>
              `}

          <span class="bar-placeholder">${placeholder}</span>
        </div>
      </ha-card>

      <dialog
        class="mode-dialog"
        @click=${(e: MouseEvent) => {
          if (e.target === this._dialogEl) this.closeModeSelector();
        }}
        @cancel=${(e: Event) => {
          e.preventDefault();
          this.closeModeSelector();
        }}
        @touchmove=${(e: TouchEvent) => guardDialogTouchMove(e, this._dialogEl)}
      >
        ${this._selectorOpen && hasMode
          ? html`
              <div class="dialog-surface">
                <div class="sheet-handle" aria-hidden="true"></div>
                <header class="dialog-header">
                  <span class="dialog-title">
                    ${modeEntity!.attributes.friendly_name || 'Modalità casa'}
                  </span>
                  <button
                    type="button"
                    class="close-btn"
                    @click=${() => this.closeModeSelector()}
                    aria-label="Chiudi"
                  >
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"
                      />
                    </svg>
                  </button>
                </header>

                <div class="mode-list" role="radiogroup" aria-label="Seleziona modalità">
                  ${this._options.map((opt) => {
                    const selected = opt === currentMode;
                    return html`
                      <button
                        type="button"
                        class="mode-row ${selected ? 'is-selected' : ''}"
                        role="radio"
                        aria-checked=${String(selected)}
                        @click=${() => this._selectOption(opt)}
                      >
                        <span class="mode-row-icon">
                          ${this._renderOptionIcon(opt, selected)}
                        </span>
                        <span class="mode-row-label">${opt}</span>
                        <span class="m3-radio ${selected ? 'checked' : ''}" aria-hidden="true">
                          <span class="m3-radio-dot"></span>
                        </span>
                      </button>
                    `;
                  })}
                </div>
              </div>
            `
          : nothing}
      </dialog>
    `;
  }

  static styles = [
    m3eBaseStyles,
    css`
      :host {
        --m3e-spring-bouncy: 500ms linear(
          0, 0.168 7%, 0.618 18%, 0.962 31%, 1.072 43%,
          1.038 56%, 0.992 71%, 1.005 86%, 1
        );
      }

      /* =====================================================================
         1. GOOGLE HOME ASK / ASSIST BAR
         ===================================================================== */
      .assist-bar {
        height: 100%;
        min-height: 56px;
        border-radius: var(--m3e-corner-full);
        cursor: pointer;
        outline: none;
        background: var(--ha-card-background, var(--md-sys-color-surface-container-high, #ececef));
        transition:
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-default);
      }

      .assist-bar.is-pressed {
        transform: scale(0.985);
      }

      .assist-bar:focus-visible {
        outline: 2px solid var(--md-sys-color-primary, #4c5c92);
        outline-offset: 2px;
      }

      .state-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: currentColor;
        opacity: 0;
        transition: opacity var(--m3e-spring-effects-fast);
      }

      .assist-bar:hover .state-layer {
        opacity: 0.05;
      }

      .bar-inner {
        position: relative;
        z-index: 1;
        min-height: 56px;
        padding: 8px 20px 8px 8px;
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .mode-dot-btn,
      .mode-dot-static {
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        border: 0;
        border-radius: var(--m3e-corner-full);
        display: grid;
        place-items: center;
        background: color-mix(
          in srgb,
          var(--md-sys-color-on-surface, #1b1b1f) 7%,
          transparent
        );
        color: var(--md-sys-color-on-surface, #1b1b1f);
      }

      .mode-dot-btn {
        cursor: pointer;
        transition:
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-fast);
      }

      .mode-dot-btn:hover {
        background: color-mix(
          in srgb,
          var(--md-sys-color-on-surface, #1b1b1f) 13%,
          transparent
        );
      }

      .mode-dot-btn:active {
        transform: scale(0.9);
      }

      .mode-dot-btn svg,
      .mode-dot-static svg {
        width: 22px;
        height: 22px;
      }

      .bar-placeholder {
        flex: 1 1 auto;
        min-width: 0;
        font-size: 16px;
        font-weight: 400;
        color: var(--md-sys-color-on-surface, #1b1b1f);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        pointer-events: none;
      }

      /* =====================================================================
         2. MATERIAL 3 EXPRESSIVE MODE SELECTOR (Bottom Sheet Mobile / Popup PC)
         ===================================================================== */
      dialog.mode-dialog {
        margin: auto;
        padding: 0;
        border: 0;
        background: transparent;
        max-width: min(410px, calc(100vw - 24px));
        max-height: calc(100dvh - 24px);
        width: 100%;
        overscroll-behavior: contain;
        touch-action: none;
        color: var(--md-sys-color-on-surface, #1b1b1f);
      }

      dialog.mode-dialog::backdrop {
        background: color-mix(in srgb, var(--md-sys-color-scrim, #000000) 52%, transparent);
      }

      .dialog-surface {
        background: var(--md-sys-color-surface, #faf8ff);
        color: var(--md-sys-color-on-surface, #1b1b1f);
        border-radius: 32px;
        padding: 18px 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        max-height: calc(100dvh - 24px);
        overflow-y: auto;
        overscroll-behavior: contain;
        touch-action: pan-y;
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.28);
        user-select: none;
        -webkit-user-select: none;
      }

      .sheet-handle {
        display: none;
        width: 36px;
        height: 4px;
        border-radius: 9999px;
        background: var(--md-sys-color-outline-variant, #c4c6d0);
        align-self: center;
        margin-bottom: 4px;
      }

      .dialog-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .dialog-title {
        font-size: 18px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .close-btn {
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--md-sys-color-on-surface-variant, #44464f);
        display: grid;
        place-items: center;
        cursor: pointer;
      }

      .close-btn:hover {
        background: color-mix(in srgb, currentColor 8%, transparent);
      }

      .close-btn svg {
        width: 20px;
        height: 20px;
      }

      @media (max-width: 600px) {
        dialog.mode-dialog {
          margin: auto 0 0 0;
          max-width: 100vw;
          max-height: 88dvh;
        }

        .dialog-surface {
          border-radius: 28px 28px 0 0;
          padding: 12px 16px calc(24px + env(safe-area-inset-bottom, 0px));
        }

        .sheet-handle {
          display: block;
        }

        .dialog-header {
          display: none;
        }
      }

      .mode-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      /* M3 Expressive Shape Coding: Selected = Full Pill (9999px) + Primary Container; Unselected = 22px Neutral */
      .mode-row {
        width: 100%;
        min-height: 74px;
        padding: 16px 22px;
        border: 0;
        border-radius: 22px;
        background: var(--md-sys-color-surface-container-high, #ededf0);
        color: var(--md-sys-color-on-surface, #1b1b1f);
        font: inherit;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 18px;
        text-align: left;
        transition:
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default),
          transform var(--m3e-spring-spatial-fast);
      }

      .mode-row.is-selected {
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-primary-container, #dfe2ed);
        color: var(--md-sys-color-on-primary-container, #2b3248);
      }

      .mode-row:active {
        transform: scale(0.98);
      }

      .mode-row-icon {
        flex: 0 0 24px;
        width: 24px;
        height: 24px;
        display: grid;
        place-items: center;
      }

      .mode-row-icon svg {
        width: 24px;
        height: 24px;
      }

      .mode-row-label {
        flex: 1 1 auto;
        font-size: 16px;
        font-weight: 500;
      }

      .mode-row.is-selected .mode-row-label {
        font-weight: 600;
      }

      /* Material 3 Radio Indicator */
      .m3-radio {
        flex: 0 0 22px;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 2px solid var(--md-sys-color-on-surface-variant, #44464f);
        display: grid;
        place-items: center;
        transition: border-color var(--m3e-spring-effects-fast);
      }

      .m3-radio.checked {
        border-color: var(--md-sys-color-on-primary-container, #2b3248);
      }

      .m3-radio-dot {
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: var(--md-sys-color-on-primary-container, #2b3248);
        transform: scale(0);
        transition: transform var(--m3e-spring-spatial-fast);
      }

      .m3-radio.checked .m3-radio-dot {
        transform: scale(1);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-assist-card': M3EAssistCard;
  }
}
