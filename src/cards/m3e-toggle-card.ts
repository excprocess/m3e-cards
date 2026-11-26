import { LitElement, css, html, nothing, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { m3eBaseStyles } from '../styles/m3e-tokens';
import type { HassEntity, HomeAssistant, M3EToggleCardConfig } from '../types/home-assistant';
import { renderM3EntityIcon } from '../utils/icons';
import { executeNavigationTarget } from '../utils/navigation';
import { formatLastChanged } from '../utils/time';
import { guardDialogTouchMove } from '../utils/scroll-lock';
import { animateDialogClose, animateDialogOpen } from '../utils/dialog-motion';
import {
  ensureCardFeaturesLoaded,
  stopFeatureEventPropagation,
} from '../utils/ha-card-features';
import { resolveEntityName, resolveStateContent } from '../utils/entity-display';
import { t } from '../utils/i18n';
import '../editors/m3e-toggle-card-editor';

const LONG_PRESS_MS = 420;

@customElement('m3e-toggle-card')
export class M3EToggleCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3EToggleCardConfig;
  @state() private _pressed = false;
  @state() private _popupOpen = false;
  @state() private _featuresLoaded = false;

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

  public static getConfigElement(): HTMLElement {
    return document.createElement('m3e-toggle-card-editor');
  }

  public setConfig(config: M3EToggleCardConfig): void {
    if (!config || !config.entity) {
      throw new Error('m3e-toggle-card: you must define an entity');
    }
    this._config = {
      hold_action: 'popup',
      ...config,
    };
    this._ensureFeatures();
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this._ensureFeatures();
  }

  private _ensureFeatures(): void {
    if ((this._config?.features?.length ?? 0) > 0 && !this._featuresLoaded) {
      void ensureCardFeaturesLoaded().then((ok) => {
        if (ok) this._featuresLoaded = true;
      });
    }
  }

  public getCardSize(): number {
    const featuresCount = this._config?.features?.length ?? 0;
    const isInline = this._config?.features_position === 'inline';
    return featuresCount > 0 && !isInline ? 2 + featuresCount : 2;
  }

  public getGridOptions() {
    const featuresCount = this._config?.features?.length ?? 0;
    const isInline = this._config?.features_position === 'inline';
    if (featuresCount > 0) {
      if (isInline) {
        return { rows: 'auto', columns: 12, min_columns: 6 };
      }
      return { rows: 1 + featuresCount, columns: 6, min_columns: 3 };
    }
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
      changedProps.has('_popupOpen') ||
      changedProps.has('_featuresLoaded')
    ) {
      return true;
    }

    if (changedProps.has('hass') && this._config && this.hass) {
      if ((this._config.features?.length ?? 0) > 0) {
        return true;
      }
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
    const s = this._entity?.state;
    return s === 'on' || s === 'open' || s === 'unlocked';
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
    const entityId = this._config.entity;
    const domain = entityId.split('.')[0];

    if (domain === 'lock') {
      this.hass.callService('lock', this._isOn ? 'lock' : 'unlock', { entity_id: entityId });
      return;
    }
    if (domain === 'cover') {
      this.hass.callService('cover', this._isOn ? 'close_cover' : 'open_cover', {
        entity_id: entityId,
      });
      return;
    }
    if (['switch', 'light', 'input_boolean', 'fan', 'automation'].includes(domain)) {
      this.hass.callService(domain, this._isOn ? 'turn_off' : 'turn_on', {
        entity_id: entityId,
      });
      return;
    }
    this.hass.callService('homeassistant', 'toggle', { entity_id: entityId });
  }

  private _setState(turnOn: boolean): void {
    if (!this.hass || !this._config || this._isUnavailable) return;
    if (turnOn === this._isOn) return;
    const entityId = this._config.entity;
    const domain = entityId.split('.')[0];
    if (domain === 'lock') {
      this.hass.callService('lock', turnOn ? 'unlock' : 'lock', { entity_id: entityId });
      return;
    }
    if (domain === 'cover') {
      this.hass.callService('cover', turnOn ? 'open_cover' : 'close_cover', {
        entity_id: entityId,
      });
      return;
    }
    this.hass.callService(domain, turnOn ? 'turn_on' : 'turn_off', {
      entity_id: entityId,
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

    animateDialogOpen(surface, tileRect);
  }

  public closePopup(): void {
    animateDialogClose(this._dialogEl, this._dialogSurfaceEl, () => {
      this._popupOpen = false;
    });
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

  private _downX = 0;
  private _downY = 0;

  private _onTilePointerDown = (e: PointerEvent): void => {
    if (this._isUnavailable || (e.pointerType === 'mouse' && e.button !== 0)) return;
    this._pressed = true;
    this._longPressTriggered = false;
    this._downX = e.clientX;
    this._downY = e.clientY;
    this._clearLongPress();
    this._longPressTimer = window.setTimeout(() => {
      this._longPressTriggered = true;
      this._pressed = false;
      this._handleHoldAction();
    }, LONG_PRESS_MS);
  };

  private _onTilePointerMove = (e: PointerEvent): void => {
    if (!this._pressed) return;
    if (Math.hypot(e.clientX - this._downX, e.clientY - this._downY) > 10) {
      this._clearLongPress();
      this._pressed = false;
    }
  };

  private _onTilePointerUp = (): void => {
    this._clearLongPress();
    this._pressed = false;
  };

  private _onTilePointerCancel = (): void => {
    this._clearLongPress();
    this._pressed = false;
  };

  private _onTileClick = (): void => {
    this._clearLongPress();
    this._pressed = false;
    if (this._longPressTriggered) {
      this._longPressTriggered = false;
      return;
    }
    this._toggle();
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
    return renderM3EntityIcon(this._entity, this._isOn);
  }

  private _getPowerSiblings(): HassEntity[] {
    if (!this.hass?.entities || !this._config) return [];
    const primaryId = this._config.entity;
    const deviceId = this.hass.entities[primaryId]?.device_id;
    if (!deviceId) return [];

    const powerClasses = ['power', 'energy', 'current', 'voltage'];
    const found: HassEntity[] = [];
    for (const [id, entry] of Object.entries(this.hass.entities)) {
      if (id === primaryId || entry.device_id !== deviceId || !id.startsWith('sensor.')) continue;
      const st = this.hass.states[id];
      if (!st || st.state === 'unavailable' || st.state === 'unknown') continue;
      const dc = String(st.attributes.device_class ?? '');
      if (powerClasses.includes(dc)) found.push(st);
    }
    found.sort(
      (a, b) =>
        powerClasses.indexOf(String(a.attributes.device_class ?? '')) -
        powerClasses.indexOf(String(b.attributes.device_class ?? '')),
    );
    return found;
  }

  private _cleanSiblingLabel(sec: HassEntity): string {
    const raw = (sec.attributes.friendly_name || '').trim();
    const deviceId = this.hass?.entities?.[sec.entity_id]?.device_id;
    const dev = deviceId ? this.hass?.devices?.[deviceId] : undefined;
    for (const prefix of [
      dev?.name_by_user,
      dev?.name,
      typeof this._config?.name === 'string' ? this._config.name : undefined,
      this._entity?.attributes.friendly_name,
    ]) {
      const p = prefix?.trim();
      if (p && raw.length > p.length && raw.toLowerCase().startsWith(p.toLowerCase())) {
        const rest = raw.slice(p.length).replace(/^[\s\-–—:]+/, '').trim();
        if (rest) return rest.charAt(0).toUpperCase() + rest.slice(1);
      }
    }
    return raw || String(sec.attributes.device_class ?? 'Sensor');
  }

  protected render() {
    if (!this._config) return nothing;
    const entity = this._entity;
    const name = resolveEntityName(this.hass, entity, this._config.name, this._config.entity);
    const isOn = this._isOn;
    // Only use custom icon if explicitly configured in card settings; otherwise standard Google Home SVG
    const icon = isOn
      ? this._config.icon_on?.trim() || undefined
      : this._config.icon_off?.trim() || this._config.icon_on?.trim() || undefined;
    const baseLabel = this._isUnavailable
      ? 'Offline'
      : isOn
        ? this._config.label_on || 'On'
        : this._config.label_off || 'Off';
    const hideState = Boolean(this._config.hide_state);
    const stateContentVal = !hideState
      ? resolveStateContent(this.hass, entity, this._config.state_content, baseLabel)
      : null;
    const label = hideState ? '' : (stateContentVal ?? baseLabel);

    const styleClass = `style-${this._config.card_style ?? 'default'}`;
    const lastChanged = this._popupOpen ? formatLastChanged(entity?.last_changed) : null;
    const powerSiblings = this._popupOpen ? this._getPowerSiblings() : [];
    const features = this._config.features ?? [];
    const hasFeatures = features.length > 0;
    const featuresPos = this._config.features_position ?? 'bottom';

    return html`
      <ha-card
        class="toggle-tile ${styleClass} ${isOn ? 'is-on' : 'is-off'} ${this._pressed ? 'is-pressed' : ''} ${this._isUnavailable ? 'is-unavailable' : ''} ${hasFeatures ? `has-features features-${featuresPos}` : ''}"
        role="switch"
        tabindex="0"
        aria-checked=${String(isOn)}
        aria-label="${name}, ${label}"
        @pointerdown=${this._onTilePointerDown}
        @pointermove=${this._onTilePointerMove}
        @pointerup=${this._onTilePointerUp}
        @pointerleave=${this._onTilePointerCancel}
        @pointercancel=${this._onTilePointerCancel}
        @click=${this._onTileClick}
        @contextmenu=${(e: MouseEvent) => {
          e.preventDefault();
          this._clearLongPress();
          this._longPressTriggered = true;
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
            ${label ? html`<span class="tile-subtitle">${label}</span>` : nothing}
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
        ${hasFeatures
          ? html`
              <div
                class="features-wrap"
                @click=${stopFeatureEventPropagation}
                @pointerdown=${stopFeatureEventPropagation}
                @pointermove=${stopFeatureEventPropagation}
                @pointerup=${stopFeatureEventPropagation}
                @contextmenu=${stopFeatureEventPropagation}
              >
                <hui-card-features
                  .hass=${this.hass}
                  .context=${{ entity_id: this._config.entity }}
                  .stateObj=${entity}
                  .features=${features}
                  .position=${featuresPos}
                ></hui-card-features>
              </div>
            `
          : nothing}
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
        @touchmove=${(e: TouchEvent) => guardDialogTouchMove(e, this._dialogEl)}
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
                  <button
                    type="button"
                    class="icon-btn"
                    aria-label=${t(this.hass, 'history')}
                    title=${t(this.hass, 'history_tooltip')}
                    @click=${() => {
                      const eid = this._config?.entity;
                      if (!eid) return;
                      this.closePopup();
                      this.dispatchEvent(
                        new CustomEvent('hass-more-info', {
                          bubbles: true,
                          composed: true,
                          detail: { entityId: eid, view: 'history' },
                        }),
                      );
                    }}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18Zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12Z"
                      />
                    </svg>
                  </button>
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

                ${powerSiblings.length > 0
                  ? html`
                      <div class="telemetry-stack">
                        ${powerSiblings.map(
                          (sec) => html`
                            <div class="info-pill">
                              <span class="info-pill-left">
                                ${typeof customElements !== 'undefined' &&
                                customElements.get('ha-state-icon')
                                  ? html`<ha-state-icon
                                      class="mini-ha-icon"
                                      .hass=${this.hass}
                                      .stateObj=${sec}
                                    ></ha-state-icon>`
                                  : nothing}
                                <span>${this._cleanSiblingLabel(sec)}</span>
                              </span>
                              <span class="info-pill-val">
                                ${sec.state}${sec.attributes.unit_of_measurement ?? ''}
                              </span>
                            </div>
                          `,
                        )}
                      </div>
                    `
                  : nothing}
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
        padding: 12px 12px 12px 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        pointer-events: none;
      }

      /* Native HA Card Features Sub-Row */
      .toggle-tile.has-features.features-bottom {
        display: flex;
        flex-direction: column;
      }

      .toggle-tile.has-features.features-bottom .tile-inner {
        height: auto;
        min-height: 68px;
      }

      .toggle-tile.has-features.features-inline {
        display: flex;
        align-items: center;
      }

      .toggle-tile.has-features.features-inline .tile-inner {
        flex: 1 1 50%;
        min-width: 0;
      }

      .features-wrap {
        position: relative;
        z-index: 2;
        --feature-border-radius: 18px;
        --feature-color: var(--md-sys-color-primary, #4c5c92);
      }

      .toggle-tile.features-bottom .features-wrap {
        padding: 0 12px 12px;
      }

      .toggle-tile.features-inline .features-wrap {
        flex: 1 1 50%;
        min-width: 0;
        padding: 8px 12px 8px 0;
      }

      .tile-icon {
        flex: 0 0 auto;
        width: 24px;
        height: 24px;
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
        width: 24px;
        height: 24px;
        --mdc-icon-size: 24px;
      }

      .tile-meta {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .tile-title {
        font-size: 14.5px;
        font-weight: 600;
        line-height: 18px;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        word-break: break-word;
      }

      .tile-subtitle {
        font-size: 13px;
        font-weight: 500;
        line-height: 17px;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
        overscroll-behavior: contain;
        touch-action: none;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      dialog.toggle-dialog::backdrop {
        background: color-mix(in srgb, var(--md-sys-color-scrim, #000000) 58%, transparent);
      }

      .dialog-surface {
        background: var(--md-sys-color-surface, #131316);
        overscroll-behavior: contain;
        touch-action: pan-y;
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

      .telemetry-stack {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .info-pill {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 18px;
        border-radius: 22px;
        background: var(--md-sys-color-surface-container-high, #24252d);
        font-size: 14px;
      }

      .info-pill-left {
        display: flex;
        align-items: center;
        gap: 12px;
        line-height: 20px;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      .mini-ha-icon {
        --mdc-icon-size: 20px;
        width: 20px;
        height: 20px;
        line-height: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
      }

      .info-pill-val {
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-toggle-card': M3EToggleCard;
  }
}
