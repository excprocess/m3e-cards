import { LitElement, css, html, nothing, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { m3eBaseStyles } from '../styles/m3e-tokens';
import type { HassEntity, HomeAssistant, M3EToggleCardConfig } from '../types/home-assistant';
import { executeNavigationTarget } from '../utils/navigation';
import { formatLastChanged } from '../utils/time';

const LONG_PRESS_MS = 420;

@customElement('m3e-toggle-card')
export class M3EToggleCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3EToggleCardConfig;
  @state() private _pressed = false;
  @state() private _popupOpen = false;

  @query('dialog.toggle-dialog') private _dialogEl?: HTMLDialogElement;
  @query('.toggle-tile') private _tileEl?: HTMLElement;
  @query('.dialog-surface') private _dialogSurfaceEl?: HTMLElement;

  private _longPressTimer: number | null = null;
  private _longPressTriggered = false;
  private _prevEntityState?: HassEntity;
  private _dragStartY: number | null = null;

  public static getStubConfig(hass?: HomeAssistant): M3EToggleCardConfig {
    const firstSwitch = hass
      ? Object.keys(hass.states).find(
          (id) => id.startsWith('switch.') || id.startsWith('input_boolean.'),
        )
      : undefined;
    return {
      type: 'custom:m3e-toggle-card',
      entity: firstSwitch ?? 'switch.outlet',
    };
  }

  public static getConfigForm() {
    return {
      schema: [
        {
          name: 'entity',
          required: true,
          selector: {
            entity: {
              domain: ['switch', 'input_boolean', 'fan', 'light', 'automation', 'humidifier'],
            },
          },
        },
        { name: 'name', selector: { text: {} } },
        {
          name: 'card_style',
          selector: {
            select: {
              mode: 'dropdown',
              options: [
                { value: 'default', label: 'Google Home (Default 28px)' },
                { value: 'morph', label: 'Google Home Morph (28px ↔ Pillola)' },
                { value: 'pill', label: 'Pillola piena (M3 Stadium)' },
                { value: 'expressive', label: 'M3 Expressive Morph (20px ↔ Pillola)' },
                { value: 'compact', label: 'Compatta (56px / 18px)' },
              ],
            },
          },
        },
        {
          type: 'grid',
          name: '',
          schema: [
            { name: 'icon_on', selector: { icon: {} } },
            { name: 'icon_off', selector: { icon: {} } },
          ],
        },
        {
          type: 'grid',
          name: '',
          schema: [
            { name: 'label_on', selector: { text: {} } },
            { name: 'label_off', selector: { text: {} } },
          ],
        },
        {
          name: 'hold_action',
          selector: {
            select: {
              mode: 'dropdown',
              options: [
                { value: 'popup', label: 'Apri popup Material 3 Expressive' },
                { value: 'more-info', label: 'Schermata nativa Home Assistant' },
                { value: 'navigate', label: 'Apri percorso / Bubble Card (#hash) / Browser Mod' },
                { value: 'none', label: 'Nessuna azione' },
              ],
            },
          },
        },
        { name: 'navigation_path', selector: { text: {} } },
      ],
      computeLabel: (schema: { name: string }) => {
        const labels: Record<string, string> = {
          entity: 'Entità (switch, presa, input_boolean…)',
          name: 'Nome personalizzato',
          card_style: 'Design della pillola (Material 3)',
          icon_on: 'Icona acceso (vuoto = standard Google Home)',
          icon_off: 'Icona spento (vuoto = standard Google Home)',
          label_on: 'Testo acceso (default: On)',
          label_off: 'Testo spento (default: Off)',
          hold_action: 'Azione pressione prolungata (Hold)',
          navigation_path: 'Percorso / #popup Bubble Card / script o browser_mod',
        };
        return labels[schema.name] ?? schema.name;
      },
    };
  }

  public setConfig(config: M3EToggleCardConfig): void {
    if (!config || !config.entity) {
      throw new Error('m3e-toggle-card: you must define an entity');
    }
    this._config = {
      hold_action: 'popup',
      ...config,
    };
  }

  public getCardSize(): number {
    return 2;
  }

  public getGridOptions() {
    return { rows: 'auto', columns: 6, min_columns: 3 };
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._clearLongPress();
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (
      changedProps.has('_config') ||
      changedProps.has('_pressed') ||
      changedProps.has('_popupOpen')
    ) {
      return true;
    }

    if (changedProps.has('hass') && this._config && this.hass) {
      const next = this.hass.states[this._config.entity];
      if (next !== this._prevEntityState) {
        this._prevEntityState = next;
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

  private get _isOn(): boolean {
    return this._entity?.state === 'on';
  }

  private get _isUnavailable(): boolean {
    const s = this._entity?.state;
    return !s || s === 'unavailable' || s === 'unknown';
  }

  private _clearLongPress(): void {
    if (this._longPressTimer !== null) {
      window.clearTimeout(this._longPressTimer);
      this._longPressTimer = null;
    }
  }

  private _toggle(): void {
    if (!this.hass || !this._config || this._isUnavailable) return;
    const domain = this._config.entity.split('.')[0];
    this.hass.callService(domain, 'toggle', { entity_id: this._config.entity });
  }

  private _setState(turnOn: boolean): void {
    if (!this.hass || !this._config || this._isUnavailable) return;
    if (turnOn === this._isOn) return;
    const domain = this._config.entity.split('.')[0];
    this.hass.callService(domain, turnOn ? 'turn_on' : 'turn_off', {
      entity_id: this._config.entity,
    });
  }

  public async openPopup(): Promise<void> {
    if (this._isUnavailable || this._popupOpen) return;
    window.getSelection()?.removeAllRanges();
    const tileRect = this._tileEl?.getBoundingClientRect();
    this._popupOpen = true;
    await this.updateComplete;

    const dialog = this._dialogEl;
    const surface = this._dialogSurfaceEl;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();

    if (surface && tileRect) {
      const targetRect = surface.getBoundingClientRect();
      const dx = tileRect.left + tileRect.width / 2 - (targetRect.left + targetRect.width / 2);
      const dy = tileRect.top + tileRect.height / 2 - (targetRect.top + targetRect.height / 2);
      const sx = Math.max(0.28, tileRect.width / targetRect.width);
      const sy = Math.max(0.16, tileRect.height / targetRect.height);

      surface.animate(
        [
          {
            transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`,
            borderRadius: '28px',
            opacity: 0.72,
          },
          {
            transform: 'translate(0px, 0px) scale(1, 1)',
            borderRadius: '32px',
            opacity: 1,
          },
        ],
        {
          duration: 380,
          easing: 'cubic-bezier(0.2, 0.9, 0.2, 1)',
        },
      );
    }
  }

  public closePopup(): void {
    const dialog = this._dialogEl;
    const surface = this._dialogSurfaceEl;
    if (!dialog || !dialog.open) {
      this._popupOpen = false;
      return;
    }

    if (surface) {
      const anim = surface.animate(
        [
          { transform: 'scale(1)', opacity: 1 },
          { transform: 'scale(0.92)', opacity: 0 },
        ],
        { duration: 180, easing: 'cubic-bezier(0.4, 0, 1, 1)' },
      );
      anim.onfinish = () => {
        dialog.close();
        this._popupOpen = false;
      };
    } else {
      dialog.close();
      this._popupOpen = false;
    }
  }

  private _handleHoldAction(): void {
    if (!this._config) return;
    const action = this._config.hold_action ?? 'popup';
    if (action === 'none') return;
    window.getSelection()?.removeAllRanges();
    if (action === 'navigate') {
      executeNavigationTarget(this, this.hass, this._config.navigation_path);
      return;
    }
    if (action === 'more-info') {
      this.dispatchEvent(
        new CustomEvent('hass-more-info', {
          bubbles: true,
          composed: true,
          detail: { entityId: this._config.entity },
        }),
      );
      return;
    }
    this.openPopup();
  }

  private _onTilePointerDown = (e: PointerEvent): void => {
    if (this._isUnavailable || e.button !== 0) return;
    this._pressed = true;
    this._longPressTriggered = false;
    this._clearLongPress();
    this._longPressTimer = window.setTimeout(() => {
      this._longPressTriggered = true;
      this._pressed = false;
      this._handleHoldAction();
    }, LONG_PRESS_MS);
  };

  private _onTilePointerUp = (): void => {
    this._clearLongPress();
    if (!this._longPressTriggered && this._pressed) {
      this._toggle();
    }
    this._pressed = false;
  };

  private _onTilePointerCancel = (): void => {
    this._clearLongPress();
    this._pressed = false;
  };

  private _onSwitchPointerDown = (e: PointerEvent): void => {
    if (e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this._dragStartY = e.clientY;
  };

  private _onSwitchPointerUp = (e: PointerEvent): void => {
    const el = e.currentTarget as HTMLElement;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    if (this._dragStartY === null) return;
    const dy = e.clientY - this._dragStartY;
    this._dragStartY = null;

    if (Math.abs(dy) >= 24) {
      // Flick up -> On, flick down -> Off
      this._setState(dy < 0);
    } else {
      this._toggle();
    }
  };

  private _renderIcon(iconName?: string) {
    if (iconName && typeof customElements !== 'undefined' && customElements.get('ha-icon')) {
      return html`<ha-icon .icon=${iconName}></ha-icon>`;
    }
    if (iconName?.includes('power-socket') || this._config?.entity.includes('caricatore')) {
      return html`
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-3 9H7.5V7.5H9V11Zm7.5 0H15V7.5h1.5V11ZM12 16.5a1.5 1.5 0 0 1-1.5-1.5h3a1.5 1.5 0 0 1-1.5 1.5Z"
          />
        </svg>
      `;
    }
    return html`
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 16H5V5h14v14ZM9 7h6v10H9V7Zm2 2v3h2V9h-2Z"
        />
      </svg>
    `;
  }

  protected render() {
    if (!this._config) return nothing;
    const entity = this._entity;
    const name = this._config.name || entity?.attributes.friendly_name || this._config.entity;
    const isOn = this._isOn;
    // Only use custom icon if explicitly configured in card settings; otherwise standard Google Home SVG
    const icon = isOn
      ? this._config.icon_on?.trim() || undefined
      : this._config.icon_off?.trim() || this._config.icon_on?.trim() || undefined;
    const label = this._isUnavailable
      ? 'Offline'
      : isOn
        ? this._config.label_on || 'On'
        : this._config.label_off || 'Off';

    const styleClass = `style-${this._config.card_style ?? 'default'}`;
    const lastChanged = this._popupOpen ? formatLastChanged(entity?.last_changed) : null;

    return html`
      <ha-card
        class="toggle-tile ${styleClass} ${isOn ? 'is-on' : 'is-off'} ${this._pressed ? 'is-pressed' : ''} ${this._isUnavailable ? 'is-unavailable' : ''}"
        role="switch"
        tabindex="0"
        aria-checked=${String(isOn)}
        aria-label="${name}, ${label}"
        @pointerdown=${this._onTilePointerDown}
        @pointerup=${this._onTilePointerUp}
        @pointerleave=${this._onTilePointerCancel}
        @pointercancel=${this._onTilePointerCancel}
        @contextmenu=${(e: MouseEvent) => {
          e.preventDefault();
          this._handleHoldAction();
        }}
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this._toggle();
          } else if (e.key === 'o' || e.key === 'O') {
            e.preventDefault();
            this.openPopup();
          }
        }}
      >
        <div class="state-layer" aria-hidden="true"></div>
        <div class="tile-inner">
          <span class="tile-icon">${this._renderIcon(icon)}</span>
          <div class="tile-meta">
            <span class="tile-title">${name}</span>
            <span class="tile-subtitle">${label}</span>
          </div>
          ${this._isUnavailable
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
            : nothing}
        </div>
      </ha-card>

      <dialog
        class="toggle-dialog"
        @click=${(e: MouseEvent) => {
          if (e.target === this._dialogEl) this.closePopup();
        }}
        @cancel=${(e: Event) => {
          e.preventDefault();
          this.closePopup();
        }}
      >
        ${this._popupOpen
          ? html`
              <div class="dialog-surface">
                <header class="dialog-header">
                  <button
                    type="button"
                    class="icon-btn"
                    @click=${() => this.closePopup()}
                    aria-label="Close"
                  >
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"
                      />
                    </svg>
                  </button>
                  <div class="dialog-title-wrap">
                    <span class="dialog-title">${name}</span>
                    ${lastChanged
                      ? html`<span class="dialog-last-changed">${lastChanged}</span>`
                      : nothing}
                  </div>
                </header>

                <div class="switch-stage">
                  <div
                    class="vertical-switch ${isOn ? 'is-on' : 'is-off'}"
                    role="switch"
                    tabindex="0"
                    aria-checked=${String(isOn)}
                    aria-label="${name} switch"
                    @pointerdown=${this._onSwitchPointerDown}
                    @pointerup=${this._onSwitchPointerUp}
                    @pointercancel=${() => (this._dragStartY = null)}
                    @keydown=${(e: KeyboardEvent) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        this._toggle();
                      }
                    }}
                  >
                    <div class="switch-thumb">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M13 3h-2v10h2V3Zm4.83 2.17-1.42 1.42A6.92 6.92 0 0 1 19 12a7 7 0 1 1-11.41-5.41L6.17 5.17A8.93 8.93 0 0 0 3 12a9 9 0 0 0 18 0c0-2.74-1.23-5.18-3.17-6.83Z"
                        />
                      </svg>
                    </div>
                  </div>

                  <span class="switch-readout">${label}</span>
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
        --m3e-spring-bouncy: 540ms linear(
          0, 0.168 7%, 0.618 18%, 0.962 31%, 1.072 43%,
          1.038 56%, 0.992 71%, 1.005 86%, 1
        );
      }

      /* =====================================================================
         1. DASHBOARD TOGGLE TILE (Uniform 28px form factor)
         ===================================================================== */
      .toggle-tile {
        height: 100%;
        min-height: 84px;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        outline: none;
        border-radius: var(--m3e-card-border-radius, 28px);
        transition:
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-default),
          border-color var(--m3e-spring-effects-default);
      }

      .toggle-tile.is-on {
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .toggle-tile.is-pressed {
        transform: scale(0.965);
      }

      .toggle-tile.is-unavailable {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .toggle-tile:focus-visible {
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

      .toggle-tile:hover .state-layer {
        opacity: 0.06;
      }

      .toggle-tile.is-pressed .state-layer {
        opacity: 0.11;
      }

      .tile-inner {
        position: relative;
        z-index: 1;
        height: 100%;
        min-height: 84px;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 16px;
        pointer-events: none;
      }

      .tile-icon {
        flex: 0 0 auto;
        width: 28px;
        height: 28px;
        display: grid;
        place-items: center;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        transition: color var(--m3e-spring-effects-default);
      }

      .toggle-tile.is-on .tile-icon {
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .tile-icon ha-icon,
      .tile-icon svg {
        width: 26px;
        height: 26px;
        --mdc-icon-size: 26px;
      }

      .tile-meta {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .tile-title {
        font-size: 15px;
        font-weight: 600;
        line-height: 20px;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .tile-subtitle {
        font-size: 13px;
        font-weight: 500;
        line-height: 18px;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      .toggle-tile.is-on .tile-title,
      .toggle-tile.is-on .tile-subtitle {
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      /* =====================================================================
         2. VERTICAL MORPHING TOGGLE SWITCH POPUP (Google Home On <-> Off)
         ===================================================================== */
      dialog.toggle-dialog {
        margin: auto;
        padding: 0;
        border: 0;
        background: transparent;
        max-width: min(420px, calc(100vw - 24px));
        max-height: calc(100dvh - 24px);
        width: 100%;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      dialog.toggle-dialog::backdrop {
        background: color-mix(in srgb, var(--md-sys-color-scrim, #000000) 58%, transparent);
      }

      .dialog-surface {
        background: var(--md-sys-color-surface, #131316);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        border-radius: 32px;
        max-height: calc(100dvh - 24px);
        overflow-y: auto;
        padding: 20px 20px 32px;
        display: flex;
        flex-direction: column;
        gap: 24px;
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.36);
      }

      @media (max-width: 600px) {
        dialog.toggle-dialog {
          margin: auto 0 0 0;
          max-width: 100vw;
          max-height: 94dvh;
        }

        .dialog-surface {
          border-radius: 28px 28px 0 0;
          max-height: 94dvh;
          padding: 18px 16px calc(28px + env(safe-area-inset-bottom, 0px));
        }
      }

      .dialog-header {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .dialog-title-wrap {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 1px;
      }

      .dialog-title {
        font-size: 20px;
        font-weight: 500;
        line-height: 24px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .dialog-last-changed {
        font-size: 12px;
        font-weight: 500;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        opacity: 0.85;
      }

      .icon-btn {
        flex: 0 0 auto;
        width: 44px;
        height: 44px;
        border: 0;
        border-radius: var(--m3e-corner-full);
        display: grid;
        place-items: center;
        cursor: pointer;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      .icon-btn:hover {
        background: color-mix(in srgb, currentColor 8%, transparent);
      }

      .icon-btn svg {
        width: 22px;
        height: 22px;
      }

      .switch-stage {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
        padding: 8px 0;
      }

      /* Vertical Morphing Track: 28px rounded rect (Off) <-> 88px full pill (On) */
      .vertical-switch {
        position: relative;
        width: 176px;
        height: 316px;
        padding: 12px;
        cursor: pointer;
        user-select: none;
        touch-action: none;
        outline: none;
        border-radius: 28px;
        background: var(--md-sys-color-surface-container-highest, #323236);
        transition:
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-default);
      }

      .vertical-switch.is-on {
        border-radius: 88px;
        background: var(--md-sys-color-primary-container, #2c3554);
      }

      .vertical-switch:focus-visible {
        outline: 2px solid var(--md-sys-color-primary, #4c5c92);
        outline-offset: 4px;
      }

      /* Sliding Morphing Thumb: 22px squircle at bottom (Off) <-> 50% circle at top (On) */
      .switch-thumb {
        width: 152px;
        height: 152px;
        display: grid;
        place-items: center;
        border-radius: 22px;
        background: var(--md-sys-color-surface-container, #1d1d20);
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        transform: translateY(140px);
        transition:
          transform var(--m3e-spring-bouncy),
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default);
      }

      .vertical-switch.is-on .switch-thumb {
        border-radius: 50%;
        transform: translateY(0px);
        background: color-mix(
          in srgb,
          var(--md-sys-color-on-primary-container, #dce2ff) 14%,
          var(--md-sys-color-primary-container, #2c3554)
        );
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .switch-thumb svg {
        width: 34px;
        height: 34px;
      }

      .switch-readout {
        font-size: 24px;
        font-weight: 500;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-toggle-card': M3EToggleCard;
  }
}
