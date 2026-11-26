import { LitElement, css, html, nothing, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { m3eBaseStyles } from '../styles/m3e-tokens';
import type {
  HassEntity,
  HomeAssistant,
  M3EMediaPlayerCardConfig,
} from '../types/home-assistant';
import { ArtworkPalette, extractArtworkPalette } from '../utils/artwork-color';
import { renderMediaBrandBadge } from '../utils/media-brand';
import type { M3EMediaPopup } from '../components/m3e-media-popup';
import '../components/m3e-media-popup';

const SUPPORT_SEEK = 2;
const SUPPORT_PREVIOUS = 16;
const SUPPORT_NEXT = 32;

function formatClock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const ss = s < 10 ? `0${s}` : String(s);
  if (h > 0) {
    const mm = m < 10 ? `0${m}` : String(m);
    return `${h}:${mm}:${ss}`;
  }
  return `${m}:${ss}`;
}

@customElement('m3e-media-player-card')
export class M3EMediaPlayerCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3EMediaPlayerCardConfig;
  @state() private _palette: ArtworkPalette | null = null;
  @state() private _nowTick = Date.now();
  @state() private _scrubbing = false;
  @state() private _scrubPct: number | null = null;
  @state() private _activeEntityId?: string;
  @state() private _pressed = false;

  @query('.media-player-card') private _cardEl?: HTMLElement;
  @query('m3e-media-popup') private _popupEl?: M3EMediaPopup;

  private _lastArtworkUrl = '';
  private _tickTimer: number | null = null;
  private _prevEntity?: HassEntity;

  @property({ attribute: false })
  public set config(cfg: M3EMediaPlayerCardConfig | undefined) {
    if (!cfg || !cfg.entity) return;
    if (
      this._config &&
      this._config.entity === cfg.entity &&
      this._config.name === cfg.name &&
      this._config.dynamic_color === (cfg.dynamic_color !== false) &&
      this._config.show_device_chip === (cfg.show_device_chip !== false) &&
      this._config.tap_action === (cfg.tap_action ?? 'popup')
    ) {
      return;
    }
    this.setConfig(cfg);
  }

  public get config(): M3EMediaPlayerCardConfig | undefined {
    return this._config;
  }

  public setConfig(config: M3EMediaPlayerCardConfig): void {
    if (!config || !config.entity) {
      throw new Error('m3e-media-player-card: devi specificare un’entità media_player.*');
    }
    this._config = {
      ...config,
      dynamic_color: config.dynamic_color !== false,
      show_device_chip: config.show_device_chip !== false,
      tap_action: config.tap_action ?? 'popup',
    };
  }

  public getCardSize(): number {
    return 3;
  }

  public getGridOptions() {
    return {
      rows: 'auto' as const,
      columns: 12,
      min_columns: 6,
    };
  }

  public static getStubConfig(hass?: HomeAssistant): M3EMediaPlayerCardConfig {
    const mpId = Object.keys(hass?.states ?? {}).find((id) => id.startsWith('media_player.'));
    return {
      type: 'custom:m3e-media-player-card',
      entity: mpId ?? 'media_player.salotto_speaker',
      dynamic_color: true,
      show_device_chip: true,
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
                { name: 'dynamic_color', selector: { boolean: {} } },
                { name: 'show_device_chip', selector: { boolean: {} } },
              ],
            },
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
          entity: 'Entità media player',
          entities: 'Altri media player (selezionabili dal foglio Cast)',
          name: 'Nome dispositivo personalizzato (opzionale)',
          dynamic_color: 'Colori dinamici estratti dalla copertina (M3 Expressive)',
          show_device_chip: 'Mostra chip dispositivo in alto a destra',
          tap_action: 'Azione al tap sulla card',
        };
        return labels[schema.name] ?? schema.name;
      },
    };
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this._config) return false;
    if (
      changedProps.has('_config') ||
      changedProps.has('_palette') ||
      changedProps.has('_nowTick') ||
      changedProps.has('_scrubbing') ||
      changedProps.has('_scrubPct') ||
      changedProps.has('_activeEntityId') ||
      changedProps.has('_pressed')
    ) {
      return true;
    }

    if (changedProps.has('hass') && this.hass) {
      const next = this.hass.states[this._currentEntityId];
      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
      if (next !== this._prevEntity || oldHass?.themes?.darkMode !== this.hass.themes?.darkMode) {
        this._prevEntity = next;
        return true;
      }
      return false;
    }
    return false;
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopTicker();
  }

  protected updated(): void {
    const entity = this._entity;
    const isPlaying = entity?.state === 'playing';
    const hasDuration = typeof entity?.attributes.media_duration === 'number' &&
      (entity.attributes.media_duration as number) > 0;

    if (isPlaying && hasDuration && !this._scrubbing) {
      this._startTicker();
    } else {
      this._stopTicker();
    }

    const artwork = this._artworkUrl;
    if (artwork !== this._lastArtworkUrl) {
      this._lastArtworkUrl = artwork;
      if (artwork && this._config?.dynamic_color !== false) {
        void extractArtworkPalette(artwork).then((pal) => {
          if (this._lastArtworkUrl === artwork) {
            this._palette = pal;
          }
        });
      } else {
        this._palette = null;
      }
    }
  }

  private _startTicker(): void {
    if (this._tickTimer !== null) return;
    this._tickTimer = window.setInterval(() => {
      this._nowTick = Date.now();
    }, 1000);
  }

  private _stopTicker(): void {
    if (this._tickTimer !== null) {
      window.clearInterval(this._tickTimer);
      this._tickTimer = null;
    }
  }

  private get _currentEntityId(): string {
    return this._activeEntityId || this._config?.entity || '';
  }

  private get _entity(): HassEntity | undefined {
    if (!this.hass || !this._currentEntityId) return undefined;
    return this.hass.states[this._currentEntityId];
  }

  private get _artworkUrl(): string {
    const entity = this._entity;
    const st = String(entity?.state ?? '').toLowerCase();
    if (!entity || st === 'off' || st === 'idle' || st === 'unavailable' || st === 'unknown') {
      return '';
    }
    return String(
      entity.attributes.entity_picture_local || entity.attributes.entity_picture || '',
    ).trim();
  }

  private get _duration(): number {
    const d = this._entity?.attributes.media_duration;
    return typeof d === 'number' && d > 0 ? d : 0;
  }

  private get _currentPosition(): number {
    const entity = this._entity;
    const duration = this._duration;
    if (!entity || duration <= 0) return 0;

    const basePos =
      typeof entity.attributes.media_position === 'number' ? entity.attributes.media_position : 0;
    if (entity.state !== 'playing') {
      return Math.max(0, Math.min(duration, basePos));
    }

    const updatedAt = entity.attributes.media_position_updated_at;
    if (typeof updatedAt === 'string') {
      const ts = Date.parse(updatedAt);
      if (!Number.isNaN(ts)) {
        const elapsed = Math.max(0, (this._nowTick - ts) / 1000);
        return Math.max(0, Math.min(duration, basePos + elapsed));
      }
    }
    return Math.max(0, Math.min(duration, basePos));
  }

  private get _progressPct(): number {
    if (this._scrubPct !== null) return this._scrubPct;
    const dur = this._duration;
    if (dur <= 0) return 0;
    return Math.max(0, Math.min(100, (this._currentPosition / dur) * 100));
  }

  private _callService(service: string, data: Record<string, unknown> = {}, e?: Event): void {
    e?.stopPropagation();
    if (!this.hass || !this._currentEntityId) return;
    this.hass.callService('media_player', service, {
      entity_id: this._currentEntityId,
      ...data,
    });
  }

  private _onCardClick(): void {
    if (!this._config || this._config.tap_action === 'none') return;
    if (this._config.tap_action === 'more-info') {
      this.dispatchEvent(
        new CustomEvent('hass-more-info', {
          detail: { entityId: this._currentEntityId },
          bubbles: true,
          composed: true,
        }),
      );
      return;
    }
    void this._popupEl?.open(this._cardEl?.getBoundingClientRect(), false);
  }

  private _onDeviceChipClick(e: Event): void {
    e.stopPropagation();
    void this._popupEl?.open(this._cardEl?.getBoundingClientRect(), true);
  }

  private _pointerToPct(clientX: number, el: HTMLElement): number {
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
  }

  private _onSliderPointerDown = (e: PointerEvent): void => {
    e.stopPropagation();
    if (this._duration <= 0) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    this._scrubbing = true;
    this._scrubPct = this._pointerToPct(e.clientX, el);
  };

  private _onSliderPointerMove = (e: PointerEvent): void => {
    if (!this._scrubbing) return;
    e.stopPropagation();
    e.preventDefault();
    this._scrubPct = this._pointerToPct(e.clientX, e.currentTarget as HTMLElement);
  };

  private _onSliderPointerUp = (e: PointerEvent): void => {
    if (!this._scrubbing) return;
    e.stopPropagation();
    const el = e.currentTarget as HTMLElement;
    if (el.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId);
    }
    const pct = this._scrubPct;
    this._scrubbing = false;
    this._scrubPct = null;

    if (pct !== null && this._duration > 0) {
      const targetSec = Math.round((pct / 100) * this._duration);
      this._callService('media_seek', { seek_position: targetSec });
    }
  };

  private _renderAppBadge(entity?: HassEntity) {
    return renderMediaBrandBadge(this.hass, entity);
  }

  protected render() {
    if (!this._config) return nothing;
    const entity = this._entity;
    const stateStr = String(entity?.state ?? 'unavailable').toLowerCase();
    const isUnavailable = !entity || stateStr === 'unavailable' || stateStr === 'unknown';
    const isPlaying = stateStr === 'playing';
    const isInactive = isUnavailable || stateStr === 'off' || stateStr === 'idle';

    const deviceName =
      this._config.name?.trim() ||
      (entity?.attributes.friendly_name as string | undefined) ||
      this._config.entity;
    const activeSource = String(entity?.attributes.source ?? '').trim();
    const chipLabel = activeSource || deviceName;
    const mediaTitle =
      String(entity?.attributes.media_title ?? '').trim() ||
      (isUnavailable ? 'Offline' : isInactive ? deviceName : 'In riproduzione');
    const mediaArtist =
      String(entity?.attributes.media_artist ?? '').trim() ||
      String(entity?.attributes.media_album_name ?? '').trim() ||
      (isUnavailable ? 'Non disponibile' : isInactive ? 'Nessuna riproduzione' : deviceName);

    const artwork = this._artworkUrl;
    const pct = this._progressPct;
    const duration = this._duration;
    const features = Number(entity?.attributes.supported_features ?? 0);
    const canPrev = !isUnavailable && (features === 0 || (features & SUPPORT_PREVIOUS) !== 0);
    const canNext = !isUnavailable && (features === 0 || (features & SUPPORT_NEXT) !== 0);
    const canSeek = !isUnavailable && duration > 0 && (features === 0 || (features & SUPPORT_SEEK) !== 0);

    // Wavy active indicator flows only during playing and flattens smoothly when paused or scrubbing
    const isWavy = isPlaying && !this._scrubbing && duration > 0;
    const displaySec =
      this._scrubPct !== null ? (this._scrubPct / 100) * duration : this._currentPosition;

    const paletteStyle = this._palette
      ? `--mp-scrim: ${this._palette.scrim}; --mp-accent: ${this._palette.accent}; --mp-on-accent: ${this._palette.onAccent};`
      : '';

    return html`
      <ha-card
        class="media-player-card is-wide-card ${isPlaying ? 'is-playing' : 'is-paused'} ${artwork ? 'has-artwork' : 'no-artwork'} ${this._pressed ? 'is-pressed' : ''} ${isUnavailable ? 'is-unavailable' : ''}"
        style=${paletteStyle}
        role="button"
        tabindex="0"
        aria-label="${mediaTitle}, ${mediaArtist}"
        @pointerdown=${(e: PointerEvent) => {
          if (isUnavailable || (e.pointerType === 'mouse' && e.button !== 0)) return;
          if ((e.target as HTMLElement | null)?.closest('button, [role="slider"]')) return;
          this._pressed = true;
        }}
        @pointerup=${() => (this._pressed = false)}
        @pointerleave=${() => (this._pressed = false)}
        @pointercancel=${() => (this._pressed = false)}
        @click=${() => this._onCardClick()}
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this._onCardClick();
          }
        }}
      >
        <!-- Full-bleed Artwork + Tonal Scrim/Vignette -->
        ${artwork
          ? html`<img class="bg-artwork" src=${artwork} alt="" loading="lazy" />`
          : nothing}
        <div class="bg-scrim" aria-hidden="true"></div>

        <div class="card-content">
          <!-- Top Row: App Badge + Output Device Chip -->
          <div class="top-row">
            ${this._renderAppBadge(entity)}
            ${this._config.show_device_chip !== false
              ? html`
                  <button
                    type="button"
                    class="device-chip"
                    @click=${(e: Event) => this._onDeviceChipClick(e)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M1 18v3h3a3 3 0 0 0-3-3Zm0-4v2a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7Zm0-4v2a9 9 0 0 1 9 9h2A11 11 0 0 0 1 10Zm20-7H3a2 2 0 0 0-2 2v3h2V5h18v14h-7v2h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"
                      />
                    </svg>
                    <span>${chipLabel}</span>
                  </button>
                `
              : nothing}
          </div>

          <!-- Middle Row: Bold Typography + Shape-Morphing Play/Pause -->
          <div class="mid-row">
            <div class="track-meta">
              <div class="track-title">${mediaTitle}</div>
              <div class="track-artist">${mediaArtist}</div>
            </div>

            <button
              type="button"
              class="play-fab ${isPlaying ? 'is-playing' : 'is-paused'}"
              aria-label=${isPlaying ? 'Pausa' : 'Riproduci'}
              ?disabled=${isUnavailable}
              @click=${(e: Event) => this._callService('media_play_pause', {}, e)}
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
          </div>

          <!-- Bottom Row: Prev + M3 Expressive Wavy/Squiggly Progress + Next -->
          <div class="bottom-row">
            <button
              type="button"
              class="transport-btn is-prev"
              aria-label="Traccia precedente"
              ?disabled=${!canPrev}
              @click=${(e: Event) => this._callService('media_previous_track', {}, e)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M6 6h2v12H6V6Zm3.5 6 8.5 6V6l-8.5 6Z" />
              </svg>
            </button>

            <div
              class="wavy-slider ${isWavy ? 'is-wavy' : 'is-flat'} ${this._scrubbing ? 'is-scrubbing' : ''} ${canSeek ? 'is-seekable' : ''}"
              role="slider"
              aria-label="Avanzamento riproduzione"
              aria-valuemin="0"
              aria-valuemax=${duration}
              aria-valuenow=${Math.round(displaySec)}
              @click=${(e: Event) => e.stopPropagation()}
              @pointerdown=${this._onSliderPointerDown}
              @pointermove=${this._onSliderPointerMove}
              @pointerup=${this._onSliderPointerUp}
              @pointercancel=${this._onSliderPointerUp}
            >
              ${this._scrubbing && duration > 0
                ? html`
                    <span class="scrub-badge" style="left: ${pct}%;">
                      ${formatClock(displaySec)} / ${formatClock(duration)}
                    </span>
                  `
                : nothing}

              <!-- Active Wavy / Flat Segment -->
              <div class="wavy-active-wrap" style="width: calc(${pct}% - 7px);">
                <div class="wavy-svg-scroller">
                  <svg class="wavy-svg" viewBox="0 0 280 14" preserveAspectRatio="none" aria-hidden="true">
                    <path
                      class="wavy-path"
                      d="M 0 7 Q 7 2, 14 7 T 28 7 T 42 7 T 56 7 T 70 7 T 84 7 T 98 7 T 112 7 T 126 7 T 140 7 T 154 7 T 168 7 T 182 7 T 196 7 T 210 7 T 224 7 T 238 7 T 252 7 T 266 7 T 280 7"
                    />
                  </svg>
                </div>
                <div class="flat-active-line"></div>
              </div>

              <!-- M3 Expressive Vertical Pill Thumb -->
              <div class="wavy-thumb" style="left: ${pct}%;"></div>

              <!-- Inactive Remaining Track -->
              <div class="wavy-inactive-line" style="left: calc(${pct}% + 7px);"></div>
            </div>

            <button
              type="button"
              class="transport-btn is-next"
              aria-label="Traccia successiva"
              ?disabled=${!canNext}
              @click=${(e: Event) => this._callService('media_next_track', {}, e)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M16 6h2v12h-2V6ZM6 18l8.5-6L6 6v12Z" />
              </svg>
            </button>
          </div>
        </div>
      </ha-card>

      <m3e-media-popup
        .hass=${this.hass}
        .entityId=${this._currentEntityId}
        .playerIds=${[this._config.entity, ...(this._config.entities ?? [])].filter(Boolean)}
        @m3e-player-selected=${(e: CustomEvent<{ entityId: string }>) => {
          this._activeEntityId = e.detail.entityId;
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
        --m3e-spring-bouncy: 520ms linear(
          0, 0.168 7%, 0.618 18%, 0.962 31%, 1.072 43%,
          1.038 56%, 0.992 71%, 1.005 86%, 1
        );
      }

      /* =====================================================================
         1. FULL-BLEED EXPRESSIVE MEDIA CARD
         ===================================================================== */
      .media-player-card {
        --mp-scrim: #181920;
        --mp-accent: var(--md-sys-color-primary-container, #e4e0de);
        --mp-on-accent: var(--md-sys-color-on-primary-container, #1b1b1f);
        --mp-fg: #ffffff;
        --mp-fg-muted: rgba(255, 255, 255, 0.84);
        --mp-track-active: var(--mp-accent, #ffffff);
        --mp-track-inactive: rgba(255, 255, 255, 0.28);

        position: relative;
        min-height: 196px;
        border-radius: 28px;
        --ha-card-border-radius: 28px;
        overflow: hidden;
        cursor: pointer;
        outline: none;
        background: var(--mp-scrim);
        color: var(--mp-fg);
        transition:
          background-color 420ms cubic-bezier(0.2, 0, 0, 1),
          transform var(--m3e-spring-spatial-fast);
      }

      /* No-artwork / Standby / Idle: follow M3 theme surface & on-surface tokens
         so Light Mode and Dark Mode both maintain high WCAG contrast. */
      .media-player-card.no-artwork {
        --mp-fg: var(--md-sys-color-on-surface, #1b1b1f);
        --mp-fg-muted: var(--md-sys-color-on-surface-variant, #444746);
        --mp-track-active: var(--md-sys-color-primary, #4285f4);
        --mp-track-inactive: color-mix(
          in srgb,
          var(--md-sys-color-on-surface, #1b1b1f) 18%,
          transparent
        );
        background: var(
          --ha-card-background,
          var(--md-sys-color-surface-container-low, #f3f3fa)
        );
      }

      .media-player-card.no-artwork.is-unavailable {
        --mp-fg: color-mix(in srgb, var(--md-sys-color-on-surface, #1b1b1f) 62%, transparent);
        --mp-fg-muted: color-mix(
          in srgb,
          var(--md-sys-color-on-surface, #1b1b1f) 48%,
          transparent
        );
        --mp-track-active: color-mix(
          in srgb,
          var(--md-sys-color-on-surface, #1b1b1f) 28%,
          transparent
        );
        --mp-track-inactive: color-mix(
          in srgb,
          var(--md-sys-color-on-surface, #1b1b1f) 14%,
          transparent
        );
      }

      .media-player-card:focus-visible {
        outline: 2px solid var(--md-sys-color-primary, #bac3ff);
        outline-offset: 2px;
      }

      .bg-artwork {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        pointer-events: none;
        animation: m3e-fade-in 380ms cubic-bezier(0.2, 0, 0, 1);
      }

      /* Deep tonal vignette + bottom gradient derived from artwork palette */
      .bg-scrim {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background:
          radial-gradient(
            ellipse 78% 72% at 50% 42%,
            color-mix(in srgb, var(--mp-scrim) 22%, transparent) 0%,
            color-mix(in srgb, var(--mp-scrim) 78%, transparent) 100%
          ),
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--mp-scrim) 46%, transparent) 0%,
            color-mix(in srgb, var(--mp-scrim) 28%, transparent) 44%,
            color-mix(in srgb, var(--mp-scrim) 88%, transparent) 100%
          );
        transition: background 450ms cubic-bezier(0.2, 0, 0, 1);
      }

      .media-player-card.no-artwork .bg-scrim {
        background: linear-gradient(
          135deg,
          color-mix(in srgb, var(--md-sys-color-primary-container, transparent) 26%, transparent) 0%,
          transparent 100%
        );
      }

      .media-player-card.no-artwork.is-unavailable .bg-scrim {
        display: none;
      }

      .card-content {
        position: relative;
        z-index: 1;
        min-height: 196px;
        padding: 16px 20px 18px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 16px;
      }

      /* =====================================================================
         2. TOP ROW (App Badge + Output Device Chip)
         ===================================================================== */
      .top-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .app-badge {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        flex-shrink: 0;
        overflow: hidden;
      }

      .app-badge .brand-icon-img {
        width: 26px;
        height: 26px;
        object-fit: contain;
        display: block;
        border-radius: 6px;
      }

      .app-badge .brand-fallback-svg {
        width: 17px;
        height: 17px;
      }

      .app-badge svg {
        width: 26px;
        height: 26px;
        display: block;
      }

      .app-badge.is-tonal {
        background: color-mix(in srgb, var(--mp-accent) 92%, transparent);
        color: var(--mp-on-accent);
      }

      .app-badge.is-tonal svg {
        width: 17px;
        height: 17px;
      }

      .device-chip {
        border: 0;
        font: inherit;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        max-width: 68%;
        padding: 5px 12px;
        border-radius: 9999px;
        background: color-mix(in srgb, var(--mp-scrim) 72%, rgba(0, 0, 0, 0.38));
        color: rgba(255, 255, 255, 0.94);
        font-size: 12.5px;
        font-weight: 500;
        line-height: 16px;
        transition: transform var(--m3e-spring-spatial-fast);
      }

      .media-player-card.no-artwork .device-chip {
        background: color-mix(
          in srgb,
          var(--md-sys-color-on-surface, #1b1b1f) 10%,
          transparent
        );
        color: var(--mp-fg);
      }

      .device-chip:active {
        transform: scale(0.95);
      }

      .device-chip svg {
        width: 14px;
        height: 14px;
        flex-shrink: 0;
      }

      .device-chip span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* =====================================================================
         3. MIDDLE ROW (Expressive Typography + Morphing Play/Pause FAB)
         ===================================================================== */
      .mid-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-top: 6px;
      }

      .track-meta {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .track-title {
        font-size: 21px;
        font-weight: 600;
        line-height: 1.2;
        letter-spacing: -0.02em;
        color: var(--mp-fg);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .track-artist {
        font-size: 14.5px;
        font-weight: 400;
        line-height: 1.28;
        color: var(--mp-fg-muted);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* M3 Expressive Shape Morphing: Playing = Squircle (18px), Paused = Full Circle (50%) */
      .play-fab {
        flex: 0 0 58px;
        width: 58px;
        height: 58px;
        border: 0;
        border-radius: 50%;
        background: var(--mp-accent);
        color: var(--mp-on-accent);
        display: grid;
        place-items: center;
        cursor: pointer;
        padding: 0;
        transition:
          border-radius var(--m3e-spring-bouncy),
          background-color 360ms cubic-bezier(0.2, 0, 0, 1),
          color 360ms cubic-bezier(0.2, 0, 0, 1),
          transform var(--m3e-spring-spatial-fast);
        -webkit-tap-highlight-color: transparent;
      }

      .play-fab.is-playing {
        border-radius: 18px;
      }

      .play-fab:active:not(:disabled) {
        transform: scale(0.9);
      }

      .play-fab:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }

      .media-player-card.no-artwork.is-unavailable .play-fab:disabled {
        opacity: 1;
        background: color-mix(in srgb, var(--md-sys-color-on-surface, #1b1b1f) 12%, transparent);
        color: color-mix(in srgb, var(--md-sys-color-on-surface, #1b1b1f) 38%, transparent);
      }

      .play-fab svg {
        width: 26px;
        height: 26px;
      }

      /* =====================================================================
         4. BOTTOM ROW (Prev + M3 Expressive Wavy Slider + Next)
         ===================================================================== */
      .bottom-row {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .transport-btn {
        flex: 0 0 38px;
        width: 38px;
        height: 38px;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--mp-fg);
        display: grid;
        place-items: center;
        cursor: pointer;
        padding: 0;
        transition:
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-fast);
        -webkit-tap-highlight-color: transparent;
      }

      .transport-btn:hover:not(:disabled) {
        background: color-mix(in srgb, var(--mp-fg) 12%, transparent);
      }

      .transport-btn.is-prev:active:not(:disabled) {
        transform: translateX(-3px) scale(0.92);
      }

      .transport-btn.is-next:active:not(:disabled) {
        transform: translateX(3px) scale(0.92);
      }

      .transport-btn:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }

      .transport-btn svg {
        width: 24px;
        height: 24px;
      }

      /* Squiggly / Wavy Slider */
      .wavy-slider {
        position: relative;
        flex: 1 1 auto;
        height: 32px;
        display: flex;
        align-items: center;
        touch-action: none;
        user-select: none;
      }

      .wavy-slider.is-seekable {
        cursor: pointer;
      }

      .wavy-active-wrap {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        height: 14px;
        min-width: 0;
        overflow: hidden;
        pointer-events: none;
      }

      .wavy-svg-scroller {
        position: absolute;
        inset: 0;
        opacity: 0;
        transform: scaleY(0.15);
        transition:
          opacity 240ms cubic-bezier(0.2, 0, 0, 1),
          transform 380ms var(--m3e-spring-spatial-default);
      }

      .wavy-slider.is-wavy .wavy-svg-scroller {
        opacity: 1;
        transform: scaleY(1);
      }

      .wavy-svg {
        width: 280px;
        height: 14px;
        display: block;
        will-change: transform;
        animation: m3e-wave-flow 1.4s linear infinite;
      }

      .wavy-slider.is-flat .wavy-svg {
        animation-play-state: paused;
      }

      .wavy-path {
        fill: none;
        stroke: var(--mp-track-active);
        stroke-width: 3.2;
        stroke-linecap: round;
        transition: stroke 360ms cubic-bezier(0.2, 0, 0, 1);
      }

      @keyframes m3e-wave-flow {
        from {
          transform: translateX(0px);
        }
        to {
          transform: translateX(-28px);
        }
      }

      .flat-active-line {
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        height: 4px;
        border-radius: 9999px;
        transform: translateY(-50%);
        background: var(--mp-track-active);
        opacity: 1;
        transition:
          opacity 200ms cubic-bezier(0.2, 0, 0, 1),
          background-color 360ms cubic-bezier(0.2, 0, 0, 1);
      }

      .wavy-slider.is-wavy .flat-active-line {
        opacity: 0;
      }

      /* Vertical Pill Thumb (M3 Expressive Media Handle) */
      .wavy-thumb {
        position: absolute;
        top: 50%;
        width: 4px;
        height: 18px;
        border-radius: 9999px;
        transform: translate(-50%, -50%);
        background: var(--mp-track-active);
        pointer-events: none;
        transition:
          height var(--m3e-spring-spatial-fast),
          width var(--m3e-spring-spatial-fast),
          background-color 360ms cubic-bezier(0.2, 0, 0, 1);
      }

      .wavy-slider.is-scrubbing .wavy-thumb {
        width: 5px;
        height: 24px;
      }

      .wavy-inactive-line {
        position: absolute;
        right: 0;
        top: 50%;
        height: 4px;
        border-radius: 9999px;
        transform: translateY(-50%);
        background: var(--mp-track-inactive);
        pointer-events: none;
      }

      .scrub-badge {
        position: absolute;
        bottom: 100%;
        margin-bottom: 6px;
        transform: translateX(-50%);
        padding: 4px 10px;
        border-radius: 9999px;
        background: var(--mp-accent, #ffffff);
        color: var(--mp-on-accent, #1b1b1f);
        font-size: 11.5px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
        pointer-events: none;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-media-player-card': M3EMediaPlayerCard;
  }
}
