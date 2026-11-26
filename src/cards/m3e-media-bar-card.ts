import { LitElement, css, html, nothing, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { m3eBaseStyles } from '../styles/m3e-tokens';
import type {
  HassEntity,
  HomeAssistant,
  M3EMediaBarCardConfig,
} from '../types/home-assistant';
import type { M3EMediaPopup } from '../components/m3e-media-popup';
import '../components/m3e-media-popup';

const SUPPORT_SELECT_SOURCE = 2048;

@customElement('m3e-media-bar-card')
export class M3EMediaBarCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3EMediaBarCardConfig;
  @state() private _selectedEntityId?: string;
  @state() private _marqueeActive = false;
  @state() private _marqueeDuration = 12;
  @state() private _pressed = false;

  @query('.media-bar') private _barEl?: HTMLElement;
  @query('.marquee-viewport') private _marqueeViewport?: HTMLDivElement;
  @query('.marquee-measure') private _marqueeMeasure?: HTMLSpanElement;
  @query('m3e-media-popup') private _popupEl?: M3EMediaPopup;

  private _resizeObserver?: ResizeObserver;
  private _prevStates: Record<string, HassEntity | undefined> = {};

  public setConfig(config: M3EMediaBarCardConfig): void {
    if (!config || !config.entity) {
      throw new Error('m3e-media-bar-card: devi specificare un’entità media_player.*');
    }
    this._config = {
      ...config,
      show_cast: config.show_cast !== false,
      hide_when_inactive: Boolean(config.hide_when_inactive),
      tap_action: config.tap_action ?? 'popup',
    };
  }

  public getCardSize(): number {
    return 1;
  }

  public getGridOptions() {
    return {
      rows: 'auto' as const,
      columns: 12,
      min_columns: 6,
    };
  }

  public static getStubConfig(hass?: HomeAssistant): M3EMediaBarCardConfig {
    const mpId = Object.keys(hass?.states ?? {}).find((id) => id.startsWith('media_player.'));
    return {
      type: 'custom:m3e-media-bar-card',
      entity: mpId ?? 'media_player.salotto_speaker',
      show_cast: true,
      hide_when_inactive: false,
      tap_action: 'popup',
    };
  }

  public static getConfigForm() {
    return {
      schema: [
        {
          name: 'entity',
          required: true,
          selector: { entity: { domain: 'media_player' } },
        },
        {
          type: 'expandable',
          name: '',
          flatten: true,
          icon: 'mdi:text-short',
          title: 'Content',
          schema: [
            { name: 'name', selector: { text: {} } },
            {
              name: 'entities',
              selector: { entity: { domain: 'media_player', multiple: true } },
            },
            {
              type: 'grid',
              name: '',
              schema: [
                { name: 'show_cast', selector: { boolean: {} } },
                { name: 'hide_when_inactive', selector: { boolean: {} } },
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
                    { value: 'popup', label: 'Apri popup Now Playing M3E' },
                    { value: 'more-info', label: 'Apri dettagli nativi HA (More-info)' },
                    { value: 'none', label: 'Nessuna azione' },
                  ],
                },
              },
            },
          ],
        },
      ],
      computeLabel: (schema: { name: string }) => {
        const labels: Record<string, string> = {
          entity: 'Media player principale',
          entities: 'Media player aggiuntivi (switch automatico su quello in riproduzione)',
          name: 'Nome personalizzato (opzionale)',
          show_cast: 'Mostra pulsante Cast / Sorgenti',
          hide_when_inactive: 'Nascondi barra quando spento / inattivo',
          tap_action: 'Azione al tap sulla barra',
        };
        return labels[schema.name] ?? schema.name;
      },
    };
  }

  private get _allEntityIds(): string[] {
    if (!this._config) return [];
    const list = [this._config.entity, ...(this._config.entities ?? [])].filter(Boolean);
    return Array.from(new Set(list));
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this._config) return false;
    if (
      changedProps.has('_config') ||
      changedProps.has('_selectedEntityId') ||
      changedProps.has('_marqueeActive') ||
      changedProps.has('_marqueeDuration') ||
      changedProps.has('_pressed')
    ) {
      return true;
    }

    if (changedProps.has('hass') && this.hass) {
      let changed = false;
      for (const id of this._allEntityIds) {
        const next = this.hass.states[id];
        if (next !== this._prevStates[id]) {
          this._prevStates[id] = next;
          changed = true;
        }
      }
      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
      if (oldHass?.themes?.darkMode !== this.hass.themes?.darkMode) {
        changed = true;
      }
      return changed;
    }

    return false;
  }

  public connectedCallback(): void {
    super.connectedCallback();
    if (typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver(() => this._measureMarquee());
    }
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
  }

  protected updated(): void {
    if (this._marqueeViewport && this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver.observe(this._marqueeViewport);
    }
    this._measureMarquee();
  }

  private get _activeEntity(): HassEntity | undefined {
    if (!this.hass || !this._config) return undefined;
    const ids = this._allEntityIds;

    // 1. Respect manual selection from Cast picker if it's still valid
    if (this._selectedEntityId && ids.includes(this._selectedEntityId)) {
      const manual = this.hass.states[this._selectedEntityId];
      if (manual) return manual;
    }

    // 2. Auto-prefer any currently playing player, then paused
    for (const id of ids) {
      if (this.hass.states[id]?.state === 'playing') return this.hass.states[id];
    }
    for (const id of ids) {
      if (this.hass.states[id]?.state === 'paused') return this.hass.states[id];
    }

    return this.hass.states[this._config.entity];
  }

  private _getMetadataText(entity?: HassEntity): string {
    if (!entity) return 'Offline';
    const state = String(entity.state ?? '').toLowerCase();
    if (state === 'unavailable' || state === 'unknown') return 'Offline';
    if (state === 'off') return 'Off';
    if (state === 'idle' || state === 'standby') return 'Idle';

    const title = String(entity.attributes.media_title ?? '').trim();
    const artist = String(entity.attributes.media_artist ?? '').trim();
    const album = String(entity.attributes.media_album_name ?? '').trim();
    const app = String(entity.attributes.app_name ?? '').trim();

    if (title && artist) return `${title} · ${artist}`;
    if (title && album) return `${title} · ${album}`;
    if (title) return title;
    if (artist) return artist;
    if (app) return app;
    return state === 'paused' ? 'Paused' : state === 'playing' ? 'Playing' : state;
  }

  private _measureMarquee(): void {
    const vp = this._marqueeViewport;
    const meas = this._marqueeMeasure;
    if (!vp || !meas) {
      if (this._marqueeActive) this._marqueeActive = false;
      return;
    }

    const entity = this._activeEntity;
    const st = String(entity?.state ?? '').toLowerCase();
    const isActiveMedia = st === 'playing' || st === 'paused' || st === 'buffering';
    if (!isActiveMedia) {
      if (this._marqueeActive) this._marqueeActive = false;
      return;
    }

    const textW = meas.scrollWidth;
    const boxW = vp.clientWidth;
    const shouldScroll = boxW > 0 && textW > boxW + 4;

    if (shouldScroll !== this._marqueeActive) {
      this._marqueeActive = shouldScroll;
    }
    if (shouldScroll) {
      // Smooth reading speed (~36 px/sec), minimum 9s loop
      const dur = Math.max(9, Math.round((textW + 48) / 36));
      if (dur !== this._marqueeDuration) {
        this._marqueeDuration = dur;
      }
    }
  }

  private _togglePlayPause(e: Event): void {
    e.stopPropagation();
    const entity = this._activeEntity;
    if (!this.hass || !entity) return;
    const st = entity.state;
    if (st === 'unavailable' || st === 'unknown') return;
    this.hass.callService('media_player', 'media_play_pause', {
      entity_id: entity.entity_id,
    });
  }

  private _onBarClick(): void {
    const entity = this._activeEntity;
    if (!entity || this._config?.tap_action === 'none') return;
    if (this._config?.tap_action === 'more-info') {
      this.dispatchEvent(
        new CustomEvent('hass-more-info', {
          detail: { entityId: entity.entity_id },
          bubbles: true,
          composed: true,
        }),
      );
      return;
    }
    void this._popupEl?.open(this._barEl?.getBoundingClientRect(), false);
  }

  private _openCastDialog(e: Event): void {
    e.stopPropagation();
    void this._popupEl?.open(this._barEl?.getBoundingClientRect(), true);
  }

  protected render() {
    if (!this._config) return nothing;
    const entity = this._activeEntity;
    const stateStr = String(entity?.state ?? 'unavailable').toLowerCase();
    const isUnavailable = !entity || stateStr === 'unavailable' || stateStr === 'unknown';
    const isPlaying = stateStr === 'playing';
    const isInactive = isUnavailable || stateStr === 'off' || stateStr === 'idle' || stateStr === 'standby';

    if (this._config.hide_when_inactive && isInactive) {
      return nothing;
    }

    const title =
      this._config.name?.trim() ||
      (entity?.attributes.friendly_name as string | undefined) ||
      this._config.entity;
    const meta = this._getMetadataText(entity);
    const artwork = !isInactive
      ? String(entity?.attributes.entity_picture_local || entity?.attributes.entity_picture || '').trim()
      : '';

    const sourceList = Array.isArray(entity?.attributes.source_list)
      ? Array.from(
          new Set(
            (entity!.attributes.source_list as unknown[])
              .map((s) => String(s ?? '').trim())
              .filter(Boolean),
          ),
        )
      : [];
    const features = Number(entity?.attributes.supported_features ?? 0);
    const supportsSource = (features & SUPPORT_SELECT_SOURCE) !== 0 || sourceList.length > 0;
    const hasMultiplePlayers = this._allEntityIds.length > 1;
    const showCast =
      this._config.show_cast !== false &&
      !isUnavailable &&
      (supportsSource || hasMultiplePlayers);

    return html`
      <ha-card
        class="media-bar is-wide-card ${isPlaying ? 'is-playing' : ''} ${this._pressed ? 'is-pressed' : ''} ${isUnavailable ? 'is-unavailable' : ''}"
        role="button"
        tabindex="0"
        aria-label="${title}, ${meta}"
        @pointerdown=${(e: PointerEvent) => {
          if (isUnavailable || (e.pointerType === 'mouse' && e.button !== 0)) return;
          if ((e.target as HTMLElement | null)?.closest('button')) return;
          this._pressed = true;
        }}
        @pointerup=${() => (this._pressed = false)}
        @pointerleave=${() => (this._pressed = false)}
        @pointercancel=${() => (this._pressed = false)}
        @click=${() => this._onBarClick()}
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this._onBarClick();
          }
        }}
      >
        <div class="state-layer" aria-hidden="true"></div>

        <div class="bar-inner">
          <!-- Left Slot: Squircle Artwork or Tonal Media Icon -->
          <div class="artwork-box" aria-hidden="true">
            ${artwork
              ? html`<img class="artwork-img" src=${artwork} alt="" loading="lazy" />`
              : html`
                  <svg viewBox="0 0 24 24" class="artwork-fallback">
                    <path
                      fill="currentColor"
                      d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z"
                    />
                  </svg>
                `}
          </div>

          <!-- Center Slot: Player Name + Auto-Marquee Metadata -->
          <div class="text-col">
            <span class="player-title">${title}</span>
            <div class="marquee-viewport ${this._marqueeActive ? 'is-scrolling' : ''}">
              <span class="marquee-measure" aria-hidden="true">${meta}</span>
              ${this._marqueeActive
                ? html`
                    <div
                      class="marquee-track"
                      style="--marquee-dur: ${this._marqueeDuration}s;"
                    >
                      <span class="marquee-copy">${meta}</span>
                      <span class="marquee-copy" aria-hidden="true">${meta}</span>
                    </div>
                  `
                : html`<span class="meta-static">${meta}</span>`}
            </div>
          </div>

          <!-- Right Slot: Cast / Output + Squircle Play/Pause (or Offline Badge) -->
          <div class="actions-col">
            ${isUnavailable
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
                  ${showCast
                    ? html`
                        <button
                          type="button"
                          class="cast-btn"
                          aria-label="Sorgente o dispositivo"
                          title="Sorgente / Output"
                          @click=${(e: Event) => this._openCastDialog(e)}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              fill="currentColor"
                              d="M1 18v3h3a3 3 0 0 0-3-3Zm0-4v2a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7Zm0-4v2a9 9 0 0 1 9 9h2A11 11 0 0 0 1 10Zm20-7H3a2 2 0 0 0-2 2v3h2V5h18v14h-7v2h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"
                            />
                          </svg>
                        </button>
                      `
                    : nothing}

                  <button
                    type="button"
                    class="play-btn ${isPlaying ? 'is-playing' : ''}"
                    aria-label=${isPlaying ? 'Pausa' : 'Riproduci'}
                    @click=${(e: Event) => this._togglePlayPause(e)}
                  >
                    ${isPlaying
                      ? html`
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <rect x="6.5" y="5" width="3.8" height="14" rx="1.6" fill="currentColor" />
                            <rect x="13.7" y="5" width="3.8" height="14" rx="1.6" fill="currentColor" />
                          </svg>
                        `
                      : html`
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              fill="currentColor"
                              d="M8 5.8v12.4c0 .86.94 1.38 1.66.92l9.7-6.2a1.09 1.09 0 0 0 0-1.84l-9.7-6.2C8.94 4.42 8 4.94 8 5.8Z"
                            />
                          </svg>
                        `}
                  </button>
                `}
          </div>
        </div>
      </ha-card>

      <!-- Shared Material 3 Expressive Now Playing & Cast Popup -->
      <m3e-media-popup
        .hass=${this.hass}
        .entityId=${entity?.entity_id ?? this._config.entity}
        .playerIds=${this._allEntityIds}
        @m3e-player-selected=${(e: CustomEvent<{ entityId: string }>) => {
          this._selectedEntityId = e.detail.entityId;
        }}
      ></m3e-media-popup>
    `;
  }

  static styles = [
    m3eBaseStyles,
    css`
      :host {
        display: block;
        width: 100%;
        --m3e-spring-bouncy: 480ms linear(
          0, 0.168 7%, 0.618 18%, 0.962 31%, 1.072 43%,
          1.038 56%, 0.992 71%, 1.005 86%, 1
        );
      }

      /* =====================================================================
         1. FOOTER MEDIA BAR (Google Home Pill Bar)
         ===================================================================== */
      .media-bar {
        border-radius: 28px;
        --ha-card-border-radius: 28px;
        background: var(
          --ha-card-background,
          var(--md-sys-color-surface-container, #ececef)
        );
        box-shadow: var(--ha-card-box-shadow, var(--md-sys-elevation-level1, 0 1px 3px rgba(0, 0, 0, 0.08)));
        cursor: pointer;
        outline: none;
        transition:
          background-color var(--m3e-spring-effects-default),
          transform var(--m3e-spring-spatial-fast);
      }

      .media-bar:focus-visible {
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

      .media-bar:hover .state-layer {
        opacity: 0.04;
      }

      .media-bar.is-pressed .state-layer {
        opacity: 0.08;
      }

      .bar-inner {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 10px 12px;
      }

      /* Left Slot: Squircle Artwork */
      .artwork-box {
        flex: 0 0 52px;
        width: 52px;
        height: 52px;
        border-radius: 15px;
        overflow: hidden;
        background: var(--md-sys-color-surface-container-highest, rgba(128, 128, 128, 0.18));
        color: var(--md-sys-color-on-surface-variant, #444746);
        display: grid;
        place-items: center;
      }

      .artwork-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        animation: m3e-fade-in 240ms cubic-bezier(0.2, 0, 0, 1);
      }

      .artwork-fallback {
        width: 24px;
        height: 24px;
      }

      /* Center Slot: Title + Auto-Marquee Metadata */
      .text-col {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 2px;
      }

      .player-title {
        font-size: 15.5px;
        font-weight: 600;
        line-height: 20px;
        color: var(--md-sys-color-on-surface, var(--primary-text-color));
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .marquee-viewport {
        position: relative;
        overflow: hidden;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        font-weight: 400;
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
      }

      .marquee-viewport.is-scrolling {
        -webkit-mask-image: linear-gradient(
          90deg,
          transparent 0%,
          #000 8%,
          #000 92%,
          transparent 100%
        );
        mask-image: linear-gradient(
          90deg,
          transparent 0%,
          #000 8%,
          #000 92%,
          transparent 100%
        );
      }

      .marquee-measure {
        position: absolute;
        visibility: hidden;
        white-space: nowrap;
        pointer-events: none;
      }

      .meta-static {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .marquee-track {
        display: inline-flex;
        align-items: center;
        white-space: nowrap;
        will-change: transform;
        animation: m3e-marquee var(--marquee-dur, 12s) linear infinite;
      }

      .marquee-copy {
        padding-right: 48px;
      }

      @keyframes m3e-marquee {
        0%,
        12% {
          transform: translateX(0%);
        }
        100% {
          transform: translateX(-50%);
        }
      }

      /* Right Slot: Cast + Squircle Play/Pause */
      .actions-col {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .cast-btn {
        width: 42px;
        height: 42px;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--md-sys-color-on-surface-variant, #444746);
        display: grid;
        place-items: center;
        cursor: pointer;
        padding: 0;
        transition:
          background-color var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
        -webkit-tap-highlight-color: transparent;
      }

      .cast-btn:hover {
        background: color-mix(in srgb, currentColor 10%, transparent);
      }

      .cast-btn:active {
        transform: scale(0.92);
      }

      .cast-btn svg {
        width: 23px;
        height: 23px;
      }

      .play-btn {
        width: 52px;
        height: 52px;
        border: 0;
        border-radius: 17px;
        background: var(--md-sys-color-secondary-container, var(--md-sys-color-surface-container-highest, #ffffff));
        color: var(--md-sys-color-on-secondary-container, var(--md-sys-color-on-surface, #1b1b1f));
        display: grid;
        place-items: center;
        cursor: pointer;
        padding: 0;
        transition:
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
        -webkit-tap-highlight-color: transparent;
      }

      .play-btn:not(.is-playing) {
        border-radius: 50%;
      }

      .play-btn:hover:not(:disabled) {
        background: var(--md-sys-color-secondary-container, var(--md-sys-color-surface-container-lowest, #ffffff));
        color: var(--md-sys-color-on-secondary-container, var(--md-sys-color-on-surface, #1b1b1f));
      }

      .play-btn:active:not(:disabled) {
        transform: scale(0.93);
      }

      .play-btn:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }

      .play-btn svg {
        width: 24px;
        height: 24px;
        transition: transform 160ms cubic-bezier(0.2, 0, 0, 1);
      }

      /* =====================================================================
         2. CAST / SOURCE SELECTOR DIALOG (Consistent M3 Expressive Radio List)
         ===================================================================== */
      dialog.cast-dialog {
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

      dialog.cast-dialog::backdrop {
        background: color-mix(in srgb, var(--md-sys-color-scrim, #000000) 54%, transparent);
      }

      .dialog-surface {
        background: var(--md-sys-color-surface, #131316);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        border-radius: 32px;
        padding: 18px 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-height: calc(100dvh - 24px);
        overflow-y: auto;
        overscroll-behavior: contain;
        touch-action: pan-y;
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.32);
      }

      @media (max-width: 600px) {
        dialog.cast-dialog {
          margin: auto 0 0 0;
          max-width: 100vw;
          max-height: 88dvh;
        }

        .dialog-surface {
          border-radius: 28px 28px 0 0;
          padding: 16px 16px calc(24px + env(safe-area-inset-bottom, 0px));
        }
      }

      .dialog-header {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .dialog-title {
        font-size: 18px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .icon-btn {
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        cursor: pointer;
      }

      .icon-btn:hover {
        background: color-mix(in srgb, currentColor 8%, transparent);
      }

      .icon-btn svg {
        width: 22px;
        height: 22px;
      }

      .picker-section-label {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        padding: 4px 4px 0;
      }

      .picker-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .picker-row {
        width: 100%;
        min-height: 60px;
        padding: 12px 18px;
        border: 0;
        border-radius: 20px;
        background: var(--md-sys-color-surface-container-high, #24252d);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font: inherit;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        text-align: left;
        transition:
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-default),
          transform var(--m3e-spring-spatial-fast);
      }

      .picker-row.is-selected {
        border-radius: 9999px;
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .picker-row:active {
        transform: scale(0.98);
      }

      .picker-row-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }

      .picker-row-title {
        font-size: 15px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .picker-row.is-selected .picker-row-title {
        font-weight: 600;
      }

      .picker-row-sub {
        font-size: 12.5px;
        opacity: 0.78;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .m3-radio {
        flex: 0 0 22px;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 2px solid var(--md-sys-color-on-surface-variant, #8e9099);
        display: grid;
        place-items: center;
      }

      .m3-radio.checked {
        border-color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .m3-radio-dot {
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: var(--md-sys-color-on-primary-container, #dce2ff);
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
    'm3e-media-bar-card': M3EMediaBarCard;
  }
}
