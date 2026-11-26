import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import '../editors/m3e-remote-card-editor';
import { m3eBaseStyles } from '../styles/m3e-tokens';
import type {
  HassEntity,
  HomeAssistant,
  M3ERemoteCardConfig,
} from '../types/home-assistant';
import { renderM3EntityIcon } from '../utils/icons';
import { resolveEntityName } from '../utils/entity-display';
import { t } from '../utils/i18n';
import { animateDialogClose, animateDialogOpen } from '../utils/dialog-motion';
import { guardDialogTouchMove } from '../utils/scroll-lock';
import {
  executeRemoteCommand,
  findSiblingEntityId,
  type RemoteActionKey,
} from '../utils/remote-commands';
import {
  remoteCustomControlStyles,
  renderRemoteCustomControls,
} from '../utils/remote-custom-controls';

const CHEVRON_UP_SVG = html`
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41Z" />
  </svg>
`;

const CHEVRON_DOWN_SVG = html`
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41Z" />
  </svg>
`;

const CHEVRON_LEFT_SVG = html`
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59Z" />
  </svg>
`;

const CHEVRON_RIGHT_SVG = html`
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6Z" />
  </svg>
`;

@customElement('m3e-remote-card')
export class M3ERemoteCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3ERemoteCardConfig;

  @state() private _padOffsetX = 0;
  @state() private _padOffsetY = 0;
  @state() private _padActive = false;
  @state() private _padTapPulse = false;

  @query('dialog.source-dialog') private _sourceDialogEl?: HTMLDialogElement;
  @query('.source-dialog-surface') private _sourceSurfaceEl?: HTMLElement;

  private _padPointerId: number | null = null;
  private _padStartX = 0;
  private _padStartY = 0;
  private _padSwiped = false;
  private _padDir: 'dpad_up' | 'dpad_down' | 'dpad_left' | 'dpad_right' | null = null;
  private _padHoldTimer: number | null = null;
  private _padRepeatTimer: number | null = null;
  private _padPulseTimer: number | null = null;

  public static getStubConfig(hass?: HomeAssistant): M3ERemoteCardConfig {
    const entity = hass
      ? Object.keys(hass.states).find(
          (id) => id.startsWith('media_player.') || id.startsWith('remote.'),
        )
      : undefined;
    return {
      type: 'custom:m3e-remote-card',
      entity: entity ?? 'media_player.living_room_tv',
      pad_mode: 'touchpad',
      show_touchpad: true,
      show_volume: true,
      show_essentials: true,
      show_transport: true,
      show_channels: false,
      show_source: true,
      show_power: true,
    };
  }

  public static getConfigElement(): HTMLElement {
    return document.createElement('m3e-remote-card-editor');
  }

  public setConfig(config: M3ERemoteCardConfig): void {
    if (!config || !config.entity) {
      throw new Error('m3e-remote-card: you must define an entity');
    }
    this._config = {
      pad_mode: 'touchpad',
      show_touchpad: true,
      show_volume: true,
      show_essentials: true,
      show_transport: true,
      show_channels: false,
      show_source: true,
      show_power: true,
      ...config,
    };
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._clearPadTimers();
  }

  public getCardSize(): number {
    return 6;
  }

  public getGridOptions() {
    return {
      columns: 12,
      min_columns: 6,
      rows: 'auto' as const,
    };
  }

  private get _entity(): HassEntity | undefined {
    if (!this.hass || !this._config) return undefined;
    return this.hass.states[this._config.entity];
  }

  private get _mediaEntity(): HassEntity | undefined {
    if (!this.hass || !this._config) return undefined;
    const id = findSiblingEntityId(this.hass, this._config.entity, 'media_player');
    return id ? this.hass.states[id] : undefined;
  }

  private get _statusEntity(): HassEntity | undefined {
    if (!this.hass || !this._config) return undefined;
    if (this._config.status_entity && this.hass.states[this._config.status_entity]) {
      return this.hass.states[this._config.status_entity];
    }
    return this._mediaEntity ?? this._entity;
  }

  private _triggerKey(key: RemoteActionKey): void {
    if (!this.hass || !this._config) return;
    navigator.vibrate?.(10);
    executeRemoteCommand(
      this.hass,
      this._config.entity,
      key,
      this._config.remote_buttons,
      this._config.remote_device,
    );
  }

  private _openMoreInfo(entityId: string): void {
    this.dispatchEvent(
      new CustomEvent('hass-more-info', {
        bubbles: true,
        composed: true,
        detail: { entityId },
      }),
    );
  }

  private _openSourceDialog(): void {
    const dlg = this._sourceDialogEl;
    if (!dlg || dlg.open) return;
    dlg.showModal();
    if (this._sourceSurfaceEl) {
      animateDialogOpen(this._sourceSurfaceEl);
    }
  }

  private _closeSourceDialog(): void {
    const dlg = this._sourceDialogEl;
    if (!dlg || !dlg.open) return;
    animateDialogClose(dlg, this._sourceSurfaceEl ?? null, () => {
      if (dlg.open) dlg.close();
    });
  }

  private _clearPadTimers(): void {
    if (this._padHoldTimer !== null) {
      window.clearTimeout(this._padHoldTimer);
      this._padHoldTimer = null;
    }
    if (this._padRepeatTimer !== null) {
      window.clearInterval(this._padRepeatTimer);
      this._padRepeatTimer = null;
    }
    if (this._padPulseTimer !== null) {
      window.clearTimeout(this._padPulseTimer);
      this._padPulseTimer = null;
    }
  }

  private _startPadRepeat(dir: 'dpad_up' | 'dpad_down' | 'dpad_left' | 'dpad_right'): void {
    if (this._padHoldTimer !== null) window.clearTimeout(this._padHoldTimer);
    if (this._padRepeatTimer !== null) window.clearInterval(this._padRepeatTimer);
    this._padHoldTimer = window.setTimeout(() => {
      this._padHoldTimer = null;
      this._padRepeatTimer = window.setInterval(() => {
        if (this._padDir === dir) {
          this._triggerKey(dir);
        }
      }, 220);
    }, 420);
  }

  private _onPadPointerDown = (e: PointerEvent): void => {
    if (e.button !== 0) return;
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    this._padPointerId = e.pointerId;
    this._padStartX = e.clientX;
    this._padStartY = e.clientY;
    this._padSwiped = false;
    this._padDir = null;
    this._padActive = true;
    this._padOffsetX = 0;
    this._padOffsetY = 0;
  };

  private _onPadPointerMove = (e: PointerEvent): void => {
    if (this._padPointerId !== e.pointerId) return;
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - this._padStartX;
    const dy = e.clientY - this._padStartY;

    const maxX = Math.max(24, rect.width / 2 - 28);
    const maxY = Math.max(20, rect.height / 2 - 28);
    this._padOffsetX = Math.max(-maxX, Math.min(maxX, dx * 0.85));
    this._padOffsetY = Math.max(-maxY, Math.min(maxY, dy * 0.85));

    const dist = Math.hypot(dx, dy);
    if (dist >= 24) {
      const dir: 'dpad_up' | 'dpad_down' | 'dpad_left' | 'dpad_right' =
        Math.abs(dx) >= Math.abs(dy)
          ? dx > 0
            ? 'dpad_right'
            : 'dpad_left'
          : dy > 0
            ? 'dpad_down'
            : 'dpad_up';

      if (!this._padSwiped || this._padDir !== dir) {
        this._padSwiped = true;
        this._padDir = dir;
        this._triggerKey(dir);
        this._startPadRepeat(dir);
      }
    }
  };

  private _onPadPointerUp = (e: PointerEvent): void => {
    if (this._padPointerId !== e.pointerId) return;
    const el = e.currentTarget as HTMLElement;
    if (el.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId);
    }
    const wasSwiped = this._padSwiped;
    this._padPointerId = null;
    this._padActive = false;
    this._padDir = null;
    this._padOffsetX = 0;
    this._padOffsetY = 0;
    if (this._padHoldTimer !== null) {
      window.clearTimeout(this._padHoldTimer);
      this._padHoldTimer = null;
    }
    if (this._padRepeatTimer !== null) {
      window.clearInterval(this._padRepeatTimer);
      this._padRepeatTimer = null;
    }

    if (!wasSwiped && e.type === 'pointerup') {
      this._triggerKey('dpad_center');
      this._padTapPulse = true;
      if (this._padPulseTimer !== null) window.clearTimeout(this._padPulseTimer);
      this._padPulseTimer = window.setTimeout(() => {
        this._padTapPulse = false;
        this._padPulseTimer = null;
      }, 180);
    }
  };

  private _renderHeaderIcon() {
    const ent = this._statusEntity ?? this._entity;
    const customIcon = this._config?.icon;
    if (customIcon && typeof customElements !== 'undefined' && customElements.get('ha-icon')) {
      return html`<ha-icon .icon=${customIcon}></ha-icon>`;
    }
    if (this._config?.use_entity_icon && ent && typeof customElements !== 'undefined') {
      if (customElements.get('ha-state-icon')) {
        return html`<ha-state-icon .hass=${this.hass} .stateObj=${ent}></ha-state-icon>`;
      }
      if (ent.attributes.icon && customElements.get('ha-icon')) {
        return html`<ha-icon .icon=${ent.attributes.icon}></ha-icon>`;
      }
    }
    return renderM3EntityIcon(ent, true);
  }

  protected render() {
    if (!this._config) return nothing;
    const ent = this._entity;
    const media = this._mediaEntity;
    const targetEnt = media ?? ent;
    const statusEnt = this._statusEntity;

    const rawState = String(statusEnt?.state ?? '').toLowerCase();
    const isPowerOn =
      Boolean(rawState) &&
      rawState !== 'off' &&
      rawState !== 'standby' &&
      rawState !== 'unavailable' &&
      rawState !== 'unknown';

    const isMuted = targetEnt?.attributes.is_volume_muted === true;
    const mediaState = String(media?.state ?? '').toLowerCase();
    const isPlaying = mediaState === 'playing';
    const isPaused = mediaState === 'paused';

    const currentSource = String(targetEnt?.attributes.source ?? '').trim();
    const appName = String(media?.attributes.app_name ?? '').trim();
    const sourceList = Array.isArray(targetEnt?.attributes.source_list)
      ? Array.from(
          new Set(
            (targetEnt!.attributes.source_list as unknown[])
              .map((s) => String(s ?? '').trim())
              .filter(Boolean),
          ),
        )
      : [];

    const title = resolveEntityName(this.hass, ent, this._config.name) || this._config.entity;
    const stateLabel =
      this.hass && statusEnt?.state && typeof this.hass.formatEntityState === 'function'
        ? this.hass.formatEntityState(statusEnt)
        : rawState
          ? rawState.charAt(0).toUpperCase() + rawState.slice(1)
          : t(this.hass, 'off');
    const subtitle =
      isPowerOn && (appName || currentSource)
        ? `${stateLabel} · ${appName || currentSource}`
        : stateLabel;

    const showTouchpad = this._config.show_touchpad !== false;
    const showVolume = this._config.show_volume !== false;
    const showEssentials = this._config.show_essentials !== false;
    const showTransport = this._config.show_transport !== false;
    const showChannels = this._config.show_channels === true;
    const showSource = this._config.show_source !== false;
    const showPower = this._config.show_power !== false;

    return html`
      <ha-card class="remote-card">
        <!-- Header -->
        <div class="remote-header">
          <button
            type="button"
            class="header-id"
            @click=${() => targetEnt && this._openMoreInfo(targetEnt.entity_id)}
          >
            <span class="header-icon ${isPowerOn ? 'is-on' : ''}">${this._renderHeaderIcon()}</span>
            <span class="header-meta">
              <span class="header-title">${title}</span>
              <span class="header-sub">${subtitle}</span>
            </span>
          </button>

          <div class="header-actions">
            ${showSource
              ? html`
                  <button
                    type="button"
                    class="source-chip"
                    @click=${() => {
                      if (sourceList.length > 0 && media) {
                        this._openSourceDialog();
                      } else if (targetEnt) {
                        this._openMoreInfo(targetEnt.entity_id);
                      }
                    }}
                  >
                    <span class="source-chip-label">${currentSource || t(this.hass, 'sources')}</span>
                    <span class="source-chip-chevron">${CHEVRON_DOWN_SVG}</span>
                  </button>
                `
              : nothing}

            ${showPower
              ? html`
                  <button
                    type="button"
                    class="power-btn ${isPowerOn ? 'is-on' : ''}"
                    aria-label=${isPowerOn ? t(this.hass, 'off') : t(this.hass, 'on')}
                    aria-pressed=${String(isPowerOn)}
                    @click=${() => this._triggerKey(isPowerOn ? 'power_off' : 'power_on')}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M13 3h-2v10h2V3Zm4.83 2.17-1.42 1.42A6.92 6.92 0 0 1 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.16.98-4.09 2.58-5.41L6.17 5.17A8.932 8.932 0 0 0 3 12a9 9 0 0 0 18 0c0-2.74-1.23-5.18-3.17-6.83Z"
                      />
                    </svg>
                  </button>
                `
              : nothing}
          </div>
        </div>

        <!-- Hero Zone: Touchpad / D-Pad + Vertical Volume Rocker -->
        ${showTouchpad || showVolume
          ? html`
              <div class="hero-grid ${showTouchpad && showVolume ? '' : 'is-single'}">
                ${showTouchpad
                  ? this._config.pad_mode === 'dpad'
                    ? html`
                        <div class="dpad-surface" role="group" aria-label="Directional pad">
                          <button
                            type="button"
                            class="dpad-btn is-up"
                            aria-label="Up"
                            @click=${() => this._triggerKey('dpad_up')}
                          >
                            ${CHEVRON_UP_SVG}
                          </button>
                          <button
                            type="button"
                            class="dpad-btn is-left"
                            aria-label="Left"
                            @click=${() => this._triggerKey('dpad_left')}
                          >
                            ${CHEVRON_LEFT_SVG}
                          </button>
                          <button
                            type="button"
                            class="dpad-center"
                            aria-label="Select"
                            @click=${() => this._triggerKey('dpad_center')}
                          >
                            OK
                          </button>
                          <button
                            type="button"
                            class="dpad-btn is-right"
                            aria-label="Right"
                            @click=${() => this._triggerKey('dpad_right')}
                          >
                            ${CHEVRON_RIGHT_SVG}
                          </button>
                          <button
                            type="button"
                            class="dpad-btn is-down"
                            aria-label="Down"
                            @click=${() => this._triggerKey('dpad_down')}
                          >
                            ${CHEVRON_DOWN_SVG}
                          </button>
                        </div>
                      `
                    : html`
                        <div
                          class="remote-touchpad ${this._padActive ? 'is-dragging' : ''}"
                          role="application"
                          aria-label="Navigation touchpad"
                          @pointerdown=${this._onPadPointerDown}
                          @pointermove=${this._onPadPointerMove}
                          @pointerup=${this._onPadPointerUp}
                          @pointercancel=${this._onPadPointerUp}
                        >
                          <span
                            class="touchpad-dot ${this._padActive ? 'is-dragging' : ''} ${this._padTapPulse ? 'is-pulsing' : ''}"
                            style="transform: translate3d(${this._padOffsetX}px, ${this._padOffsetY}px, 0)"
                            aria-hidden="true"
                          ></span>
                        </div>
                      `
                  : nothing}

                ${showVolume
                  ? html`
                      <div class="volume-rocker" role="group" aria-label="Volume">
                        <button
                          type="button"
                          class="vol-btn"
                          aria-label="Volume up"
                          @click=${() => this._triggerKey('volume_up')}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2Z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          class="vol-btn is-mute ${isMuted ? 'is-muted' : ''}"
                          aria-label=${isMuted ? t(this.hass, 'unmute') : t(this.hass, 'mute')}
                          aria-pressed=${String(isMuted)}
                          @click=${() => this._triggerKey(isMuted ? 'unmute' : 'mute')}
                        >
                          ${isMuted
                            ? html`
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                  <path
                                    fill="currentColor"
                                    d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63Zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71ZM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3ZM12 4 9.91 6.09 12 8.18V4Z"
                                  />
                                </svg>
                              `
                            : html`
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                  <path
                                    fill="currentColor"
                                    d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02Z"
                                  />
                                </svg>
                              `}
                        </button>
                        <button
                          type="button"
                          class="vol-btn"
                          aria-label="Volume down"
                          @click=${() => this._triggerKey('volume_down')}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path fill="currentColor" d="M19 13H5v-2h14v2Z" />
                          </svg>
                        </button>
                      </div>
                    `
                  : nothing}
              </div>
            `
          : nothing}

        <!-- 3 Essential Navigation Buttons: Back | Home | Assist -->
        ${showEssentials
          ? html`
              <div class="essential-row">
                <button
                  type="button"
                  class="essential-btn"
                  aria-label="Back"
                  @click=${() => this._triggerKey('back')}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  class="essential-btn is-home"
                  aria-label="Home"
                  @click=${() => this._triggerKey('home')}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M12 5.69 17 10.19V18h-2v-6H9v6H7v-7.81l5-4.5M12 3 2 12h3v8h6v-6h2v6h6v-8h3L12 3Z"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  class="essential-btn is-assist"
                  aria-label="Assistant"
                  @click=${() => this._triggerKey('assist')}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="9.2" cy="10.2" r="3.4" fill="currentColor" />
                    <circle cx="16.4" cy="8.4" r="1.7" fill="currentColor" />
                    <circle cx="15.4" cy="13.4" r="2.1" fill="currentColor" />
                    <circle cx="19.5" cy="11.2" r="1" fill="currentColor" />
                  </svg>
                </button>
              </div>
            `
          : nothing}

        <!-- M3 Expressive Transport Row -->
        ${showTransport
          ? html`
              <div class="transport-row">
                <button
                  type="button"
                  class="transport-icon is-prev"
                  aria-label=${t(this.hass, 'previous')}
                  @click=${() => this._triggerKey('prev')}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M6 6h2v12H6V6Zm3.5 6 8.5 6V6l-8.5 6Z" />
                  </svg>
                </button>

                <button
                  type="button"
                  class="transport-circle ${isPlaying ? 'is-active' : ''}"
                  aria-label=${t(this.hass, 'play')}
                  aria-pressed=${String(isPlaying)}
                  @click=${() => this._triggerKey('play')}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M8 5.8v12.4c0 .86.94 1.38 1.66.92l9.7-6.2a1.09 1.09 0 0 0 0-1.84l-9.7-6.2C8.94 4.42 8 4.94 8 5.8Z"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  class="transport-circle ${isPaused ? 'is-active' : ''}"
                  aria-label=${t(this.hass, 'pause')}
                  aria-pressed=${String(isPaused)}
                  @click=${() => this._triggerKey('pause')}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="6.5" y="5" width="3.8" height="14" rx="1.6" fill="currentColor" />
                    <rect x="13.7" y="5" width="3.8" height="14" rx="1.6" fill="currentColor" />
                  </svg>
                </button>

                <button
                  type="button"
                  class="transport-icon is-next"
                  aria-label=${t(this.hass, 'next')}
                  @click=${() => this._triggerKey('next')}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M16 6h2v12h-2V6ZM6 18l8.5-6L6 6v12Z" />
                  </svg>
                </button>
              </div>
            `
          : nothing}

        <!-- Optional Channel Rocker -->
        ${showChannels
          ? html`
              <div class="channel-pill">
                <button
                  type="button"
                  class="channel-btn"
                  aria-label="Channel down"
                  @click=${() => this._triggerKey('ch_down')}
                >
                  ${CHEVRON_DOWN_SVG}
                </button>
                <span class="channel-label">CH</span>
                <button
                  type="button"
                  class="channel-btn"
                  aria-label="Channel up"
                  @click=${() => this._triggerKey('ch_up')}
                >
                  ${CHEVRON_UP_SVG}
                </button>
              </div>
            `
          : nothing}

        <!-- Custom Native Buttons & Segmented Pills -->
        ${renderRemoteCustomControls(
          this.hass,
          this._config.entity,
          this._config.remote_custom_controls,
          this._config.remote_buttons,
          this._config.remote_device,
        )}
      </ha-card>

      <!-- Source Picker Sheet Dialog -->
      <dialog
        class="source-dialog"
        @click=${(e: MouseEvent) => {
          if (e.target === this._sourceDialogEl) this._closeSourceDialog();
        }}
        @cancel=${(e: Event) => {
          e.preventDefault();
          this._closeSourceDialog();
        }}
        @touchmove=${guardDialogTouchMove}
      >
        <div class="source-dialog-surface">
          <div class="source-dialog-header">
            <button
              type="button"
              class="dialog-close-btn"
              aria-label="Close"
              @click=${() => this._closeSourceDialog()}
            >
              ${CHEVRON_DOWN_SVG}
            </button>
            <span>${t(this.hass, 'sources')}</span>
          </div>
          <div class="source-list">
            ${sourceList.map((src) => {
              const selected = src.toLowerCase() === currentSource.toLowerCase();
              return html`
                <button
                  type="button"
                  class="source-option ${selected ? 'is-selected' : ''}"
                  @click=${() => {
                    if (media) {
                      this.hass?.callService('media_player', 'select_source', {
                        entity_id: media.entity_id,
                        source: src,
                      });
                    }
                    this._closeSourceDialog();
                  }}
                >
                  <span>${src}</span>
                  ${selected ? html`<span class="check-mark">✓</span>` : nothing}
                </button>
              `;
            })}
          </div>
        </div>
      </dialog>
    `;
  }

  static styles = [
    m3eBaseStyles,
    remoteCustomControlStyles,
    css`
      :host {
        display: block;
      }

      ha-card.remote-card {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 16px;
        border-radius: var(--m3e-corner-card, 28px);
        background: var(--md-sys-color-surface-container-low, #1c1d22);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        box-shadow: none;
        border: 0;
        overflow: hidden;
      }

      /* Header */
      .remote-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .header-id {
        flex: 1 1 auto;
        min-width: 0;
        border: 0;
        padding: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: left;
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
      }

      .header-icon {
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        display: grid;
        place-items: center;
        transition:
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default);
      }

      .header-icon.is-on {
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .header-icon svg,
      .header-icon ha-icon,
      .header-icon ha-state-icon {
        width: 22px;
        height: 22px;
        --mdc-icon-size: 22px;
      }

      .header-meta {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 1px;
      }

      .header-title {
        font-size: 15.5px;
        font-weight: 600;
        line-height: 1.25;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .header-sub {
        font-size: 12.5px;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .header-actions {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .source-chip {
        height: 36px;
        max-width: 130px;
        padding: 0 10px 0 14px;
        border: 0;
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font: inherit;
        font-size: 12.5px;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        transition: transform var(--m3e-spring-spatial-fast);
      }

      .source-chip:active {
        transform: scale(0.95);
      }

      .source-chip-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .source-chip-chevron {
        display: inline-flex;
        width: 18px;
        height: 18px;
        flex: 0 0 18px;
      }

      .source-chip-chevron svg {
        width: 18px;
        height: 18px;
      }

      .power-btn {
        width: 40px;
        height: 40px;
        border: 0;
        padding: 0;
        border-radius: 50%;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        cursor: pointer;
        transition:
          transform var(--m3e-spring-spatial-fast),
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default);
      }

      .power-btn.is-on {
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
        border-radius: 14px;
      }

      .power-btn:active {
        transform: scale(0.92);
      }

      .power-btn svg {
        width: 21px;
        height: 21px;
      }

      /* Hero 2-Column Zone */
      .hero-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 68px;
        gap: 12px;
        align-items: stretch;
      }

      .hero-grid.is-single {
        grid-template-columns: 1fr;
      }

      /* Gesture Touchpad */
      .remote-touchpad {
        position: relative;
        width: 100%;
        height: 204px;
        min-height: 204px;
        border-radius: 26px;
        background: var(--md-sys-color-surface-container-high, #282930);
        display: grid;
        place-items: center;
        touch-action: none;
        user-select: none;
        cursor: grab;
        overflow: hidden;
        transition: background-color var(--m3e-spring-effects-fast);
        -webkit-tap-highlight-color: transparent;
      }

      .remote-touchpad.is-dragging {
        cursor: grabbing;
        background: color-mix(
          in srgb,
          var(--md-sys-color-on-surface, #e3e2e6) 5%,
          var(--md-sys-color-surface-container-high, #282930)
        );
      }

      .touchpad-dot {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--md-sys-color-on-surface, #e3e2e6);
        pointer-events: none;
        will-change: transform;
        transition:
          transform var(--m3e-spring-bouncy),
          width var(--m3e-spring-spatial-fast),
          height var(--m3e-spring-spatial-fast);
      }

      .touchpad-dot.is-dragging {
        transition:
          width var(--m3e-spring-spatial-fast),
          height var(--m3e-spring-spatial-fast);
      }

      .touchpad-dot.is-pulsing {
        width: 32px;
        height: 32px;
      }

      /* Alternative 4-Way D-Pad */
      .dpad-surface {
        height: 204px;
        border-radius: 26px;
        background: var(--md-sys-color-surface-container-high, #282930);
        display: grid;
        grid-template-columns: 1fr 56px 1fr;
        grid-template-rows: 1fr 56px 1fr;
        place-items: center;
        padding: 8px;
      }

      .dpad-btn {
        width: 100%;
        height: 100%;
        border: 0;
        border-radius: 18px;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        cursor: pointer;
        transition:
          background-color var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
      }

      .dpad-btn:hover {
        background: color-mix(in srgb, currentColor 8%, transparent);
      }

      .dpad-btn:active {
        transform: scale(0.92);
      }

      .dpad-btn svg {
        width: 26px;
        height: 26px;
      }

      .dpad-btn.is-up {
        grid-column: 2;
        grid-row: 1;
      }
      .dpad-btn.is-left {
        grid-column: 1;
        grid-row: 2;
      }
      .dpad-btn.is-right {
        grid-column: 3;
        grid-row: 2;
      }
      .dpad-btn.is-down {
        grid-column: 2;
        grid-row: 3;
      }

      .dpad-center {
        grid-column: 2;
        grid-row: 2;
        width: 54px;
        height: 54px;
        border: 0;
        border-radius: 50%;
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
        font: inherit;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition:
          transform var(--m3e-spring-spatial-fast),
          border-radius var(--m3e-spring-bouncy);
      }

      .dpad-center:active {
        transform: scale(0.9);
        border-radius: 16px;
      }

      /* Vertical Volume Rocker */
      .volume-rocker {
        height: 204px;
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-surface-container-high, #282930);
        display: flex;
        flex-direction: column;
        padding: 4px;
        gap: 2px;
      }

      .vol-btn {
        flex: 1;
        border: 0;
        border-radius: var(--m3e-corner-full);
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        cursor: pointer;
        transition:
          background-color var(--m3e-spring-effects-fast),
          color var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
      }

      .vol-btn:hover {
        background: color-mix(in srgb, currentColor 8%, transparent);
      }

      .vol-btn:active {
        transform: scale(0.92);
      }

      .vol-btn.is-muted {
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .vol-btn svg {
        width: 22px;
        height: 22px;
      }

      /* 3 Essential Navigation Buttons */
      .essential-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px;
      }

      .essential-btn {
        width: 52px;
        height: 52px;
        border: 0;
        padding: 0;
        border-radius: 50%;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        cursor: pointer;
        transition:
          transform var(--m3e-spring-spatial-fast),
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-fast);
        -webkit-tap-highlight-color: transparent;
      }

      .essential-btn.is-home {
        width: 62px;
        height: 62px;
      }

      .essential-btn.is-assist {
        background: var(--md-sys-color-on-surface, #e3e2e6);
        color: var(--md-sys-color-surface, #141418);
      }

      .essential-btn:hover {
        filter: brightness(1.06);
      }

      .essential-btn:active {
        transform: scale(0.92);
        border-radius: 16px;
      }

      .essential-btn svg {
        width: 22px;
        height: 22px;
      }

      .essential-btn.is-home svg {
        width: 24px;
        height: 24px;
      }

      /* Transport Row */
      .transport-row {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        gap: 8px;
        padding: 2px 0;
      }

      .transport-icon,
      .transport-circle {
        border: 0;
        padding: 0;
        cursor: pointer;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        transition:
          transform var(--m3e-spring-spatial-fast),
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default);
        -webkit-tap-highlight-color: transparent;
      }

      .transport-icon {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: transparent;
      }

      .transport-icon:hover {
        background: color-mix(in srgb, currentColor 10%, transparent);
      }

      .transport-icon.is-prev:active {
        transform: translateX(-3px) scale(0.92);
      }

      .transport-icon.is-next:active {
        transform: translateX(3px) scale(0.92);
      }

      .transport-icon svg {
        width: 22px;
        height: 22px;
      }

      .transport-circle {
        width: 54px;
        height: 54px;
        border-radius: 50%;
        background: var(--md-sys-color-surface-container-high, #282930);
      }

      .transport-circle.is-active {
        border-radius: 16px;
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .transport-circle:active {
        transform: scale(0.92);
      }

      .transport-circle svg {
        width: 25px;
        height: 25px;
      }

      /* Channel Pill */
      .channel-pill {
        height: 50px;
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-surface-container-high, #282930);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 8px;
      }

      .channel-btn {
        width: 42px;
        height: 42px;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        cursor: pointer;
      }

      .channel-btn:hover {
        background: color-mix(in srgb, currentColor 8%, transparent);
      }

      .channel-btn svg {
        width: 22px;
        height: 22px;
      }

      .channel-label {
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.04em;
      }

      /* Source Sheet Dialog */
      dialog.source-dialog {
        margin: auto;
        padding: 0;
        border: 0;
        background: transparent;
        max-width: min(400px, calc(100vw - 24px));
        width: 100%;
        overflow: visible;
      }

      dialog.source-dialog::backdrop {
        background: rgba(0, 0, 0, 0.52);
        transition: opacity 220ms ease;
      }

      dialog.source-dialog.is-closing::backdrop {
        opacity: 0;
      }

      .source-dialog-surface {
        border-radius: 28px;
        background: var(--md-sys-color-surface-container, #22232a);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-height: 70dvh;
      }

      .source-dialog-header {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 600;
      }

      .dialog-close-btn {
        width: 36px;
        height: 36px;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: inherit;
        display: grid;
        place-items: center;
        cursor: pointer;
      }

      .dialog-close-btn svg {
        width: 22px;
        height: 22px;
      }

      .source-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow-y: auto;
      }

      .source-option {
        min-height: 48px;
        padding: 0 18px;
        border: 0;
        border-radius: 16px;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: inherit;
        font: inherit;
        font-size: 14.5px;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
      }

      .source-option.is-selected {
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
        font-weight: 600;
      }

      .check-mark {
        font-weight: 700;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-remote-card': M3ERemoteCard;
  }
}
