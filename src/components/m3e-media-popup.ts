import { LitElement, css, html, nothing, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { m3eBaseStyles } from '../styles/m3e-tokens';
import type { HassEntity, HomeAssistant } from '../types/home-assistant';
import { animateDialogClose, animateDialogOpen } from '../utils/dialog-motion';
import { guardDialogTouchMove } from '../utils/scroll-lock';
import { renderMediaBrandBadge } from '../utils/media-brand';
import { ArtworkPalette, extractArtworkPalette } from '../utils/artwork-color';

const SUPPORT_VOLUME_SET = 4;

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

@customElement('m3e-media-popup')
export class M3EMediaPopup extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ type: String }) public entityId = '';
  @property({ attribute: false }) public playerIds: string[] = [];

  @state() private _open = false;
  @state() private _castSheetOpen = false;
  @state() private _nowTick = Date.now();
  @state() private _scrubbing = false;
  @state() private _scrubPct: number | null = null;
  @state() private _volDragging = false;
  @state() private _volPct: number | null = null;
  @state() private _palette: ArtworkPalette | null = null;

  @query('dialog.media-dialog') private _dialogEl?: HTMLDialogElement;
  @query('.dialog-surface') private _dialogSurfaceEl?: HTMLDivElement;
  @query('.artwork-frame') private _artworkFrameEl?: HTMLDivElement;
  @query('.meta-block') private _metaBlockEl?: HTMLDivElement;

  private _tickTimer: number | null = null;
  private _volPendingTimer: number | null = null;
  private _lastVolSentAt = 0;
  private _lastArtworkUrl = '';
  private _lastTrackKey = '';
  private _pendingTrackDir: 'next' | 'prev' = 'next';

  public async open(originRect?: DOMRect, openCastSheet = false): Promise<void> {
    if (this._open) {
      if (openCastSheet) this._castSheetOpen = true;
      return;
    }
    window.getSelection()?.removeAllRanges();
    this._castSheetOpen = openCastSheet;
    this._open = true;
    this._nowTick = Date.now();
    await this.updateComplete;

    const dialog = this._dialogEl;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    animateDialogOpen(this._dialogSurfaceEl, originRect);
  }

  public close(): void {
    this._stopTicker();
    animateDialogClose(this._dialogEl, this._dialogSurfaceEl, () => {
      this._open = false;
      this._castSheetOpen = false;
    });
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopTicker();
    if (this._volPendingTimer !== null) {
      window.clearTimeout(this._volPendingTimer);
      this._volPendingTimer = null;
    }
  }

  protected updated(_changedProps: PropertyValues): void {
    const entity = this._entity;
    const isPlaying = this._open && entity?.state === 'playing';
    if (isPlaying && this._duration > 0 && !this._scrubbing) {
      this._startTicker();
    } else {
      this._stopTicker();
    }

    if (this._open && entity) {
      const trackKey = `${entity.entity_id}|${String(entity.attributes.media_title ?? '')}|${String(entity.attributes.entity_picture ?? '')}`;
      if (this._lastTrackKey && trackKey !== this._lastTrackKey) {
        this._animateTrackTransition(this._pendingTrackDir);
      }
      this._lastTrackKey = trackKey;

      const artUrl = String(entity.attributes.entity_picture ?? '').trim();
      if (artUrl !== this._lastArtworkUrl) {
        this._lastArtworkUrl = artUrl;
        if (artUrl) {
          void extractArtworkPalette(artUrl).then((pal) => {
            if (this._lastArtworkUrl === artUrl) this._palette = pal;
          });
        } else {
          this._palette = null;
        }
      }
    } else {
      this._lastTrackKey = '';
    }
  }

  private _animateTrackTransition(dir: 'next' | 'prev'): void {
    const offset = dir === 'next' ? 28 : -28;
    const easing = 'cubic-bezier(0.05, 0.7, 0.1, 1.0)';
    this._artworkFrameEl?.animate(
      [
        { transform: `translateX(${offset}px) scale(0.92)`, opacity: 0.35 },
        { transform: 'translateX(0px) scale(1)', opacity: 1 },
      ],
      { duration: 340, easing },
    );
    this._metaBlockEl?.animate(
      [
        { transform: `translateX(${offset * 0.65}px)`, opacity: 0.25 },
        { transform: 'translateX(0px)', opacity: 1 },
      ],
      { duration: 300, easing },
    );
  }

  private _skipTrack(dir: 'next' | 'prev'): void {
    this._pendingTrackDir = dir;
    this._call(dir === 'next' ? 'media_next_track' : 'media_previous_track');
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

  private get _entity(): HassEntity | undefined {
    if (!this.hass || !this.entityId) return undefined;
    return this.hass.states[this.entityId];
  }

  private get _duration(): number {
    const d = this._entity?.attributes.media_duration;
    return typeof d === 'number' && d > 0 ? d : 0;
  }

  private get _currentPosition(): number {
    const entity = this._entity;
    const dur = this._duration;
    if (!entity || dur <= 0) return 0;
    const base =
      typeof entity.attributes.media_position === 'number' ? entity.attributes.media_position : 0;
    if (entity.state !== 'playing') return Math.max(0, Math.min(dur, base));
    const updatedAt = entity.attributes.media_position_updated_at;
    if (typeof updatedAt === 'string') {
      const ts = Date.parse(updatedAt);
      if (!Number.isNaN(ts)) {
        return Math.max(0, Math.min(dur, base + Math.max(0, (this._nowTick - ts) / 1000)));
      }
    }
    return Math.max(0, Math.min(dur, base));
  }

  private get _progressPct(): number {
    if (this._scrubPct !== null) return this._scrubPct;
    if (this._duration <= 0) return 0;
    return Math.max(0, Math.min(100, (this._currentPosition / this._duration) * 100));
  }

  private get _volumePct(): number {
    if (this._volPct !== null) return this._volPct;
    const v = this._entity?.attributes.volume_level;
    return typeof v === 'number' ? Math.round(v * 100) : 0;
  }

  private _call(service: string, data: Record<string, unknown> = {}, targetId?: string): void {
    const eid = targetId || this.entityId;
    if (!this.hass || !eid) return;
    this.hass.callService('media_player', service, { entity_id: eid, ...data });
  }

  private _openMoreInfo(): void {
    const eid = this.entityId;
    if (!eid) return;
    if (this._dialogEl?.open) this._dialogEl.close();
    this._open = false;
    this._castSheetOpen = false;
    this.dispatchEvent(
      new CustomEvent('hass-more-info', {
        detail: { entityId: eid },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _cycleRepeat(): void {
    const cur = String(this._entity?.attributes.repeat ?? 'off').toLowerCase();
    const next = cur === 'off' ? 'all' : cur === 'all' ? 'one' : 'off';
    this._call('repeat_set', { repeat: next });
  }

  private _toggleShuffle(): void {
    const cur = Boolean(this._entity?.attributes.shuffle);
    this._call('shuffle_set', { shuffle: !cur });
  }

  /* Seek slider pointer handlers */
  private _pctFromX(clientX: number, el: HTMLElement): number {
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
  }

  private _onSeekDown = (e: PointerEvent): void => {
    if (this._duration <= 0 || (e.pointerType === 'mouse' && e.button !== 0)) return;
    e.preventDefault();
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    this._scrubbing = true;
    this._scrubPct = this._pctFromX(e.clientX, el);
  };

  private _onSeekMove = (e: PointerEvent): void => {
    if (!this._scrubbing) return;
    e.preventDefault();
    this._scrubPct = this._pctFromX(e.clientX, e.currentTarget as HTMLElement);
  };

  private _onSeekUp = (e: PointerEvent): void => {
    if (!this._scrubbing) return;
    const el = e.currentTarget as HTMLElement;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    const pct = this._scrubPct;
    this._scrubbing = false;
    this._scrubPct = null;
    if (pct !== null && this._duration > 0) {
      this._call('media_seek', { seek_position: Math.round((pct / 100) * this._duration) });
    }
  };

  /* Volume pill slider pointer handlers */
  private _onVolDown = (e: PointerEvent): void => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    if (this._volPendingTimer !== null) {
      window.clearTimeout(this._volPendingTimer);
      this._volPendingTimer = null;
    }
    this._volDragging = true;
    this._volPct = Math.round(this._pctFromX(e.clientX, el));
  };

  private _onVolMove = (e: PointerEvent): void => {
    if (!this._volDragging) return;
    e.preventDefault();
    const nextPct = Math.round(this._pctFromX(e.clientX, e.currentTarget as HTMLElement));
    this._volPct = nextPct;
    const now = Date.now();
    if (now - this._lastVolSentAt >= 120) {
      this._lastVolSentAt = now;
      this._call('volume_set', { volume_level: Number((nextPct / 100).toFixed(2)) });
    }
  };

  private _onVolUp = (e: PointerEvent): void => {
    if (!this._volDragging) return;
    const el = e.currentTarget as HTMLElement;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    const pct = this._volPct ?? this._volumePct;
    this._volDragging = false;
    this._call('volume_set', { volume_level: Number((pct / 100).toFixed(2)) });
    this._volPendingTimer = window.setTimeout(() => {
      this._volPct = null;
      this._volPendingTimer = null;
    }, 800);
  };

  private _selectPlayer(id: string): void {
    this.entityId = id;
    this.dispatchEvent(
      new CustomEvent('m3e-player-selected', {
        detail: { entityId: id },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _selectSource(source: string): void {
    this._call('select_source', { source });
  }

  private _renderAppBadge(entity?: HassEntity) {
    return renderMediaBrandBadge(this.hass, entity);
  }

  protected render() {
    const entity = this._entity;
    const stateStr = String(entity?.state ?? 'off').toLowerCase();
    const isPlaying = stateStr === 'playing';
    const isMuted = Boolean(entity?.attributes.is_volume_muted);
    const deviceName =
      (entity?.attributes.friendly_name as string | undefined) || this.entityId || 'Media';
    const mediaTitle = String(entity?.attributes.media_title ?? '').trim() || deviceName;
    const mediaArtist =
      String(entity?.attributes.media_artist ?? '').trim() ||
      String(entity?.attributes.media_album_name ?? '').trim() ||
      (isPlaying ? 'In riproduzione' : stateStr.charAt(0).toUpperCase() + stateStr.slice(1));
    const artwork = String(entity?.attributes.entity_picture ?? '').trim();

    const duration = this._duration;
    const pct = this._progressPct;
    const displaySec = this._scrubPct !== null ? (this._scrubPct / 100) * duration : this._currentPosition;
    const isWavy = isPlaying && !this._scrubbing && duration > 0;
    const vol = this._volumePct;
    const shuffleOn = Boolean(entity?.attributes.shuffle);
    const repeatMode = String(entity?.attributes.repeat ?? 'off').toLowerCase();

    const allPlayers = Array.from(
      new Set([this.entityId, ...(this.playerIds ?? [])].filter(Boolean)),
    );
    const sourceList = Array.isArray(entity?.attributes.source_list)
      ? (entity!.attributes.source_list as string[])
      : [];
    const currentSource = String(entity?.attributes.source ?? '');
    const isUnavailable = !entity || stateStr === 'unavailable' || stateStr === 'unknown';
    const features = Number(entity?.attributes.supported_features ?? 0);
    const supportsVolume =
      !isUnavailable &&
      (features === 0 ||
        (features & SUPPORT_VOLUME_SET) !== 0 ||
        typeof entity?.attributes.volume_level === 'number');
    const hasCastOptions = sourceList.length > 0 || allPlayers.length > 1;
    const displayVol = isMuted ? 0 : vol;
    const paletteVars = this._palette
      ? `--mp-accent: ${this._palette.accent}; --mp-on-accent: ${this._palette.onAccent};`
      : '';

    return html`
      <dialog
        class="media-dialog"
        style=${paletteVars}
        @click=${(e: MouseEvent) => {
          if (e.target === this._dialogEl) this.close();
        }}
        @cancel=${(e: Event) => {
          e.preventDefault();
          this.close();
        }}
        @touchmove=${(e: TouchEvent) => guardDialogTouchMove(e, this._dialogEl)}
      >
        ${this._open
          ? html`
              <div class="dialog-surface">
                <!-- Header: X Left, Now playing Center, App Badge + More Right -->
                <header class="dialog-header">
                  <button
                    type="button"
                    class="icon-btn"
                    @click=${() => this.close()}
                    aria-label="Chiudi"
                  >
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"
                      />
                    </svg>
                  </button>

                  <span class="dialog-title">Now playing</span>

                  <div class="header-right">
                    ${this._renderAppBadge(entity)}
                    <button
                      type="button"
                      class="icon-btn"
                      @click=${() => this._openMoreInfo()}
                      aria-label="Altre opzioni"
                      title="Dettagli Home Assistant"
                    >
                      <svg viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
                        />
                      </svg>
                    </button>
                  </div>
                </header>

                <!-- Centered Squircle Artwork -->
                <div class="artwork-stage">
                  <div class="artwork-frame">
                    ${artwork
                      ? html`<img class="artwork-img" src=${artwork} alt="" />`
                      : html`
                          <svg viewBox="0 0 24 24" class="artwork-fallback" aria-hidden="true">
                            <path fill="currentColor" d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z" />
                          </svg>
                        `}
                  </div>
                </div>

                <!-- Centered Track Title & Artist -->
                <div class="meta-block">
                  <div class="meta-title">${mediaTitle}</div>
                  <div class="meta-artist">${mediaArtist}</div>
                </div>

                <!-- M3 Expressive Wavy Progress Slider + Clocks -->
                <div class="progress-block">
                  <div
                    class="wavy-slider ${isWavy ? 'is-wavy' : 'is-flat'} ${this._scrubbing ? 'is-scrubbing' : ''} ${duration > 0 ? 'is-seekable' : ''}"
                    role="slider"
                    aria-label="Avanzamento"
                    aria-valuemin="0"
                    aria-valuemax=${duration}
                    aria-valuenow=${Math.round(displaySec)}
                    @pointerdown=${this._onSeekDown}
                    @pointermove=${this._onSeekMove}
                    @pointerup=${this._onSeekUp}
                    @pointercancel=${this._onSeekUp}
                  >
                    <div class="wavy-active-wrap" style="width: calc(${pct}% - 7px);">
                      <div class="wavy-svg-scroller">
                        <svg class="wavy-svg" viewBox="0 0 360 14" preserveAspectRatio="none" aria-hidden="true">
                          <path
                            class="wavy-path"
                            d="M 0 7 Q 7 2, 14 7 T 28 7 T 42 7 T 56 7 T 70 7 T 84 7 T 98 7 T 112 7 T 126 7 T 140 7 T 154 7 T 168 7 T 182 7 T 196 7 T 210 7 T 224 7 T 238 7 T 252 7 T 266 7 T 280 7 T 294 7 T 308 7 T 322 7 T 336 7 T 350 7 T 364 7"
                          />
                        </svg>
                      </div>
                      <div class="flat-active-line"></div>
                    </div>
                    <div class="wavy-thumb" style="left: ${pct}%;"></div>
                    <div class="wavy-inactive-line" style="left: calc(${pct}% + 7px);"></div>
                  </div>

                  <div class="time-row">
                    <span>${formatClock(displaySec)}</span>
                    <span>${formatClock(duration)}</span>
                  </div>
                </div>

                <!-- 5-Button Expressive Transport Row -->
                <div class="transport-row">
                  <button
                    type="button"
                    class="ctrl-btn toggle-ctrl ${shuffleOn ? 'is-active' : ''}"
                    aria-label="Casuale"
                    aria-pressed=${String(shuffleOn)}
                    title=${shuffleOn ? 'Casuale attivo' : 'Attiva casuale'}
                    @click=${() => this._toggleShuffle()}
                  >
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41ZM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5Zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13Z"
                      />
                    </svg>
                    <span class="active-dot" aria-hidden="true"></span>
                  </button>

                  <button
                    type="button"
                    class="ctrl-btn is-prev"
                    aria-label="Precedente"
                    @click=${() => this._skipTrack('prev')}
                  >
                    <svg viewBox="0 0 24 24">
                      <path fill="currentColor" d="M6 6h2v12H6V6Zm3.5 6 8.5 6V6l-8.5 6Z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    class="play-hero ${isPlaying ? 'is-playing' : 'is-paused'}"
                    aria-label=${isPlaying ? 'Pausa' : 'Riproduci'}
                    @click=${() => this._call('media_play_pause')}
                  >
                    ${isPlaying
                      ? html`
                          <svg viewBox="0 0 24 24">
                            <rect x="6.5" y="5" width="3.8" height="14" rx="1.6" fill="currentColor" />
                            <rect x="13.7" y="5" width="3.8" height="14" rx="1.6" fill="currentColor" />
                          </svg>
                        `
                      : html`
                          <svg viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M8 5.8v12.4c0 .86.94 1.38 1.66.92l9.7-6.2a1.09 1.09 0 0 0 0-1.84l-9.7-6.2C8.94 4.42 8 4.94 8 5.8Z"
                            />
                          </svg>
                        `}
                  </button>

                  <button
                    type="button"
                    class="ctrl-btn is-next"
                    aria-label="Successivo"
                    @click=${() => this._skipTrack('next')}
                  >
                    <svg viewBox="0 0 24 24">
                      <path fill="currentColor" d="M16 6h2v12h-2V6ZM6 18l8.5-6L6 6v12Z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    class="ctrl-btn toggle-ctrl ${repeatMode !== 'off' ? 'is-active' : ''}"
                    aria-label="Ripeti"
                    aria-pressed=${String(repeatMode !== 'off')}
                    title=${repeatMode === 'one'
                      ? 'Ripeti brano'
                      : repeatMode === 'all'
                        ? 'Ripeti tutto'
                        : 'Ripetizione spenta'}
                    @click=${() => this._cycleRepeat()}
                  >
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d=${repeatMode === 'one'
                          ? 'M7 7h10v3l4-4-4-4v3H5v6h2V7Zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4Zm-4-2V9h-1l-2 1v1h1.5v4H13Z'
                          : 'M7 7h10v3l4-4-4-4v3H5v6h2V7Zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4Z'}
                      />
                    </svg>
                    <span class="active-dot" aria-hidden="true"></span>
                  </button>
                </div>

                <!-- Authentic M3 Expressive Volume Slider (50px Pill Track + Gap + Vertical Handle + Stop Dot) -->
                ${supportsVolume
                  ? html`
                      <div class="m3-vol-row">
                        <button
                          type="button"
                          class="m3-mute-btn ${isMuted ? 'is-muted' : ''}"
                          aria-label=${isMuted ? 'Riattiva audio' : 'Muto'}
                          @click=${() =>
                            this._call('volume_mute', { is_volume_muted: !isMuted })}
                        >
                          <svg viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d=${isMuted || vol === 0
                                ? 'M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63Zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71ZM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3ZM12 4 9.91 6.09 12 8.18V4Z'
                                : vol < 50
                                  ? 'M5 9v6h4l5 5V4L9 9H5Zm11.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02Z'
                                  : 'M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02ZM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77Z'}
                            />
                          </svg>
                        </button>

                        <div
                          class="m3-vol-track ${this._volDragging ? 'is-dragging' : ''}"
                          role="slider"
                          aria-label="Volume"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-valuenow=${displayVol}
                          @pointerdown=${this._onVolDown}
                          @pointermove=${this._onVolMove}
                          @pointerup=${this._onVolUp}
                          @pointercancel=${this._onVolUp}
                        >
                          ${this._volDragging
                            ? html`<span class="m3-vol-tooltip" style="left: ${displayVol}%;">${displayVol}%</span>`
                            : nothing}
                          <div
                            class="m3-vol-active"
                            style="width: max(0px, calc(${displayVol}% - 6px));"
                          ></div>
                          <div class="m3-vol-handle" style="left: ${displayVol}%;"></div>
                          <div
                            class="m3-vol-inactive"
                            style="left: calc(${displayVol}% + 6px);"
                          >
                            ${displayVol < 96
                              ? html`<span class="m3-vol-stop" aria-hidden="true"></span>`
                              : nothing}
                          </div>
                        </div>

                        <span class="m3-vol-readout">${isMuted ? 'Muto' : `${vol}%`}</span>
                      </div>
                    `
                  : nothing}

                <!-- M3 Expressive Compact Pill Source / Output Selector -->
                <button
                  type="button"
                  class="cast-pill-btn ${isUnavailable ? 'is-disabled' : ''}"
                  ?disabled=${isUnavailable}
                  @click=${() => {
                    if (hasCastOptions) {
                      this._castSheetOpen = true;
                    } else {
                      this._openMoreInfo();
                    }
                  }}
                >
                  <span class="cast-pill-left">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M1 18v3h3a3 3 0 0 0-3-3Zm0-4v2a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7Zm0-4v2a9 9 0 0 1 9 9h2A11 11 0 0 0 1 10Zm20-7H3a2 2 0 0 0-2 2v3h2V5h18v14h-7v2h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"
                      />
                    </svg>
                    <span class="cast-pill-label">
                      ${currentSource ? `${deviceName} · ${currentSource}` : deviceName}
                    </span>
                  </span>
                  ${hasCastOptions
                    ? html`
                        <svg viewBox="0 0 24 24" class="cast-pill-chevron" aria-hidden="true">
                          <path
                            fill="currentColor"
                            d="M7.41 8.59a1 1 0 0 1 1.41 0L12 11.77l3.18-3.18a1 1 0 1 1 1.41 1.41l-3.88 3.88a1 1 0 0 1-1.42 0L7.41 10a1 1 0 0 1 0-1.41Z"
                          />
                        </svg>
                      `
                    : nothing}
                </button>

                <!-- Inline Cast / Source Bottom Sheet (Screen 2) -->
                ${this._castSheetOpen
                  ? html`
                      <div
                        class="cast-sheet-backdrop"
                        @click=${() => (this._castSheetOpen = false)}
                      >
                        <div class="cast-sheet" @click=${(e: Event) => e.stopPropagation()}>
                          <div class="sheet-handle" aria-hidden="true"></div>

                          <div class="cast-sheet-header">
                            <button
                              type="button"
                              class="icon-btn"
                              @click=${() => (this._castSheetOpen = false)}
                              aria-label="Chiudi Cast"
                            >
                              <svg viewBox="0 0 24 24">
                                <path
                                  fill="currentColor"
                                  d="M7.41 8.59a1 1 0 0 1 1.41 0L12 11.77l3.18-3.18a1 1 0 1 1 1.41 1.41l-3.88 3.88a1 1 0 0 1-1.42 0L7.41 10a1 1 0 0 1 0-1.41Z"
                                />
                              </svg>
                            </button>
                            <span class="cast-sheet-title">Cast</span>
                          </div>

                          <!-- Mini Now Playing Preview -->
                          <div class="cast-now-preview">
                            <div class="cast-mini-art">
                              ${artwork
                                ? html`<img src=${artwork} alt="" />`
                                : html`
                                    <svg viewBox="0 0 24 24">
                                      <path
                                        fill="currentColor"
                                        d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z"
                                      />
                                    </svg>
                                  `}
                            </div>
                            <div class="cast-mini-meta">
                              <div class="cast-mini-top">${this._renderAppBadge(entity)}</div>
                              <div class="cast-mini-title">${mediaTitle}</div>
                              <div class="cast-mini-artist">${mediaArtist}</div>
                            </div>
                          </div>

                          <!-- Output Devices (M3 Expressive Pill = Selected, 20px = Unselected) -->
                          <div class="cast-list" role="radiogroup" aria-label="Dispositivi Cast">
                            ${allPlayers.map((pid) => {
                              const st = this.hass?.states[pid];
                              const selected = pid === this.entityId;
                              const name =
                                (st?.attributes.friendly_name as string | undefined) || pid;
                              const pVol =
                                typeof st?.attributes.volume_level === 'number'
                                  ? Math.round(st.attributes.volume_level * 100)
                                  : null;
                              const isTv =
                                st?.attributes.device_class === 'tv' ||
                                pid.toLowerCase().includes('tv') ||
                                pid.toLowerCase().includes('chromecast');

                              return html`
                                <button
                                  type="button"
                                  class="cast-row ${selected ? 'is-selected' : ''}"
                                  role="radio"
                                  aria-checked=${String(selected)}
                                  @click=${() => this._selectPlayer(pid)}
                                >
                                  ${selected && pVol !== null
                                    ? html`<span class="cast-row-fill" style="width: ${pVol}%;"></span>`
                                    : nothing}
                                  <span class="cast-row-inner">
                                    <span class="cast-row-left">
                                      <svg viewBox="0 0 24 24" class="cast-dev-icon" aria-hidden="true">
                                        <path
                                          fill="currentColor"
                                          d=${isTv
                                            ? 'M21 3H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 14H3V5h18v12Z'
                                            : 'M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02Z'}
                                        />
                                      </svg>
                                      <span class="cast-row-text">
                                        <span class="cast-row-name">${name}</span>
                                        ${selected && pVol !== null
                                          ? html`<span class="cast-row-sub">${pVol}%</span>`
                                          : nothing}
                                      </span>
                                    </span>
                                    <span class="cast-check ${selected ? 'checked' : ''}" aria-hidden="true">
                                      ${selected
                                        ? html`
                                            <svg viewBox="0 0 24 24">
                                              <path
                                                fill="currentColor"
                                                d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z"
                                              />
                                            </svg>
                                          `
                                        : nothing}
                                    </span>
                                  </span>
                                </button>
                              `;
                            })}
                          </div>

                          <!-- Sources (M3 Expressive Filter Chips with Checkmark & Shape Morph) -->
                          ${sourceList.length > 0
                            ? html`
                                <div class="cast-section-label">Sorgenti</div>
                                <div class="source-chips" role="radiogroup" aria-label="Sorgenti">
                                  ${sourceList.map((src) => {
                                    const active = src === currentSource;
                                    return html`
                                      <button
                                        type="button"
                                        class="source-chip ${active ? 'is-selected' : ''}"
                                        role="radio"
                                        aria-checked=${String(active)}
                                        @click=${() => this._selectSource(src)}
                                      >
                                        ${active
                                          ? html`
                                              <svg viewBox="0 0 24 24" class="chip-check" aria-hidden="true">
                                                <path
                                                  fill="currentColor"
                                                  d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z"
                                                />
                                              </svg>
                                            `
                                          : nothing}
                                        <span>${src}</span>
                                      </button>
                                    `;
                                  })}
                                </div>
                              `
                            : nothing}

                          <!-- Bottom Actions: Stop casting + Done -->
                          <div class="cast-sheet-footer">
                            <button
                              type="button"
                              class="stop-cast-btn"
                              @click=${() => {
                                this._call('media_stop');
                                this._castSheetOpen = false;
                              }}
                            >
                              Stop casting
                            </button>
                            <button
                              type="button"
                              class="done-cast-btn"
                              @click=${() => (this._castSheetOpen = false)}
                            >
                              Done
                            </button>
                          </div>
                        </div>
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
        display: contents;
        --m3e-spring-bouncy: 520ms linear(
          0, 0.168 7%, 0.618 18%, 0.962 31%, 1.072 43%,
          1.038 56%, 0.992 71%, 1.005 86%, 1
        );
      }

      dialog.media-dialog {
        margin: auto;
        padding: 0;
        border: 0;
        background: transparent;
        max-width: min(440px, calc(100vw - 24px));
        max-height: calc(100dvh - 24px);
        width: 100%;
        overscroll-behavior: contain;
        touch-action: none;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      dialog.media-dialog::backdrop {
        background: color-mix(in srgb, var(--md-sys-color-scrim, #000000) 58%, transparent);
      }

      .dialog-surface {
        position: relative;
        overflow-y: auto;
        overflow-x: hidden;
        overscroll-behavior: contain;
        touch-action: pan-y;
        max-height: calc(100dvh - 24px);
        background: var(--md-sys-color-surface, #131316);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        border-radius: 32px;
        padding: 18px 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 18px;
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.36);
      }

      @media (max-width: 600px) {
        dialog.media-dialog {
          margin: auto 0 0 0;
          max-width: 100vw;
          max-height: 95dvh;
        }

        .dialog-surface {
          border-radius: 28px 28px 0 0;
          max-height: 95dvh;
          padding: 16px 18px calc(24px + env(safe-area-inset-bottom, 0px));
        }
      }

      /* Header */
      .dialog-header {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .dialog-title {
        flex: 1 1 auto;
        font-size: 19px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
      }

      .icon-btn {
        flex: 0 0 42px;
        width: 42px;
        height: 42px;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        cursor: pointer;
        padding: 0;
      }

      .icon-btn:hover {
        background: color-mix(in srgb, currentColor 8%, transparent);
      }

      .icon-btn svg {
        width: 22px;
        height: 22px;
      }

      .app-badge {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        flex-shrink: 0;
        overflow: hidden;
      }

      .app-badge .brand-icon-img {
        width: 24px;
        height: 24px;
        object-fit: contain;
        display: block;
        border-radius: 6px;
      }

      .app-badge .brand-fallback-svg {
        width: 16px;
        height: 16px;
      }

      .app-badge svg {
        width: 24px;
        height: 24px;
      }

      .app-badge.is-tonal {
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .app-badge.is-tonal svg {
        width: 16px;
        height: 16px;
      }

      /* Centered Squircle Artwork */
      .artwork-stage {
        display: flex;
        justify-content: center;
        padding: 4px 0;
      }

      .artwork-frame {
        width: clamp(168px, 48vw, 204px);
        height: clamp(168px, 48vw, 204px);
        border-radius: 36px;
        overflow: hidden;
        background: var(--md-sys-color-surface-container-highest, #2a2b34);
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        display: grid;
        place-items: center;
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.22);
      }

      .artwork-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .artwork-fallback {
        width: 64px;
        height: 64px;
      }

      /* Meta */
      .meta-block {
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 0 8px;
      }

      .meta-title {
        font-size: 24px;
        font-weight: 600;
        line-height: 1.2;
        letter-spacing: -0.02em;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      .meta-artist {
        font-size: 15px;
        font-weight: 400;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      /* Wavy Progress Slider */
      .progress-block {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .wavy-slider {
        position: relative;
        height: 28px;
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
        overflow: hidden;
        pointer-events: none;
      }

      .wavy-svg-scroller {
        position: absolute;
        inset: 0;
        opacity: 0;
        transform: scaleY(0.15);
        transition:
          opacity 220ms ease,
          transform 360ms var(--m3e-spring-spatial-default);
      }

      .wavy-slider.is-wavy .wavy-svg-scroller {
        opacity: 1;
        transform: scaleY(1);
      }

      .wavy-svg {
        width: 360px;
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
        stroke: var(--md-sys-color-primary, #4285f4);
        stroke-width: 3.2;
        stroke-linecap: round;
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
        background: var(--md-sys-color-primary, #4285f4);
        opacity: 1;
        transition: opacity 200ms ease;
      }

      .wavy-slider.is-wavy .flat-active-line {
        opacity: 0;
      }

      .wavy-thumb {
        position: absolute;
        top: 50%;
        width: 4px;
        height: 18px;
        border-radius: 9999px;
        transform: translate(-50%, -50%);
        background: var(--md-sys-color-primary, #4285f4);
        pointer-events: none;
        transition: height var(--m3e-spring-spatial-fast);
      }

      .wavy-slider.is-scrubbing .wavy-thumb {
        height: 24px;
      }

      .wavy-inactive-line {
        position: absolute;
        right: 0;
        top: 50%;
        height: 4px;
        border-radius: 9999px;
        transform: translateY(-50%);
        background: var(--md-sys-color-surface-container-highest, rgba(128, 128, 128, 0.28));
        pointer-events: none;
      }

      .time-row {
        display: flex;
        justify-content: space-between;
        font-size: 12.5px;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      /* 5-Button Transport Row */
      .transport-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 4px 6px;
      }

      .ctrl-btn {
        position: relative;
        width: 48px;
        height: 48px;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        display: grid;
        place-items: center;
        cursor: pointer;
        padding: 0;
        transition:
          transform var(--m3e-spring-spatial-fast),
          color var(--m3e-spring-effects-fast),
          background-color var(--m3e-spring-effects-fast);
        -webkit-tap-highlight-color: transparent;
      }

      .ctrl-btn:hover {
        background: color-mix(in srgb, currentColor 10%, transparent);
      }

      /* M3 Expressive Center-Bounce Tonal Fill for Shuffle & Repeat */
      .ctrl-btn.toggle-ctrl::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: var(--md-sys-color-primary-container, #364067);
        transform: scale(0);
        opacity: 0;
        transition:
          transform var(--m3e-spring-bouncy),
          opacity 180ms cubic-bezier(0.2, 0, 0, 1);
      }

      .ctrl-btn.toggle-ctrl.is-active::before {
        transform: scale(1);
        opacity: 1;
      }

      .ctrl-btn.toggle-ctrl svg {
        position: relative;
        z-index: 1;
        transition: transform var(--m3e-spring-bouncy);
      }

      .ctrl-btn.toggle-ctrl.is-active {
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .ctrl-btn.toggle-ctrl.is-active svg {
        transform: scale(1.08);
      }

      .ctrl-btn.toggle-ctrl:active {
        transform: scale(0.88);
      }

      .active-dot {
        position: absolute;
        bottom: 5px;
        left: 50%;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: var(--md-sys-color-primary, #bac3ff);
        transform: translateX(-50%) scale(0);
        transition: transform var(--m3e-spring-bouncy);
        z-index: 1;
      }

      .ctrl-btn.toggle-ctrl.is-active .active-dot {
        transform: translateX(-50%) scale(1);
      }

      .ctrl-btn.is-prev:active {
        transform: translateX(-5px) scale(0.9);
      }

      .ctrl-btn.is-next:active {
        transform: translateX(5px) scale(0.9);
      }

      .ctrl-btn svg {
        width: 24px;
        height: 24px;
      }

      .play-hero {
        width: 74px;
        height: 74px;
        border: 0;
        border-radius: 50%;
        background: var(--md-sys-color-primary-container, #dfe2ed);
        color: var(--md-sys-color-on-primary-container, #1b1b1f);
        display: grid;
        place-items: center;
        cursor: pointer;
        transition:
          border-radius var(--m3e-spring-bouncy),
          transform var(--m3e-spring-spatial-fast);
      }

      .play-hero.is-playing {
        border-radius: 24px;
      }

      .play-hero:active {
        transform: scale(0.9);
      }

      .play-hero svg {
        width: 30px;
        height: 30px;
      }

      /* =====================================================================
         M3 EXPRESSIVE VOLUME SLIDER (50px Pill Track + Gap + Vertical Handle + Stop Dot)
         ===================================================================== */
      .m3-vol-row {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .m3-mute-btn {
        flex: 0 0 44px;
        width: 44px;
        height: 44px;
        border: 0;
        border-radius: 50%;
        background: var(--md-sys-color-surface-container-high, #24252d);
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        display: grid;
        place-items: center;
        cursor: pointer;
        padding: 0;
        transition:
          background-color var(--m3e-spring-effects-fast),
          color var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
      }

      .m3-mute-btn:hover {
        background: color-mix(in srgb, currentColor 10%, var(--md-sys-color-surface-container-high, #24252d));
      }

      .m3-mute-btn.is-muted {
        background: var(--md-sys-color-error-container, #93000a);
        color: var(--md-sys-color-on-error-container, #ffdad6);
      }

      .m3-mute-btn:active {
        transform: scale(0.92);
      }

      .m3-mute-btn svg {
        width: 22px;
        height: 22px;
      }

      .m3-vol-track {
        position: relative;
        flex: 1 1 auto;
        height: 50px;
        display: flex;
        align-items: center;
        cursor: ew-resize;
        touch-action: none;
        user-select: none;
      }

      .m3-vol-active {
        position: absolute;
        left: 0;
        top: 50%;
        height: 24px;
        transform: translateY(-50%);
        border-radius: 9999px 6px 6px 9999px;
        background: var(--mp-accent, var(--md-sys-color-primary, #bac3ff));
        pointer-events: none;
        transition: width 140ms cubic-bezier(0.2, 0, 0, 1);
      }

      .m3-vol-track.is-dragging .m3-vol-active {
        transition: none;
      }

      .m3-vol-handle {
        position: absolute;
        top: 50%;
        width: 5px;
        height: 36px;
        border-radius: 9999px;
        transform: translate(-50%, -50%);
        background: var(--mp-accent, var(--md-sys-color-primary, #bac3ff));
        pointer-events: none;
        transition:
          left 140ms cubic-bezier(0.2, 0, 0, 1),
          width var(--m3e-spring-spatial-fast),
          height var(--m3e-spring-spatial-fast);
      }

      .m3-vol-track.is-dragging .m3-vol-handle {
        transition:
          width var(--m3e-spring-spatial-fast),
          height var(--m3e-spring-spatial-fast);
        width: 4px;
        height: 44px;
      }

      .m3-vol-inactive {
        position: absolute;
        right: 0;
        top: 50%;
        height: 24px;
        transform: translateY(-50%);
        border-radius: 6px 9999px 9999px 6px;
        background: var(--md-sys-color-surface-container-high, #282932);
        pointer-events: none;
        transition: left 140ms cubic-bezier(0.2, 0, 0, 1);
      }

      .m3-vol-track.is-dragging .m3-vol-inactive {
        transition: none;
      }

      .m3-vol-stop {
        position: absolute;
        right: 9px;
        top: 50%;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        transform: translateY(-50%);
        background: var(--mp-accent, var(--md-sys-color-primary, #bac3ff));
        opacity: 0.75;
      }

      .m3-vol-tooltip {
        position: absolute;
        bottom: calc(100% + 4px);
        transform: translateX(-50%);
        padding: 5px 12px;
        border-radius: 9999px;
        background: var(--md-sys-color-inverse-surface, #e3e2e6);
        color: var(--md-sys-color-inverse-on-surface, #1b1b1f);
        font-size: 13px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        pointer-events: none;
        animation: m3e-fade-in 120ms ease;
      }

      .m3-vol-readout {
        flex: 0 0 42px;
        text-align: right;
        font-size: 14px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      /* M3 Expressive Compact Pill Source / Output Selector */
      .cast-pill-btn {
        width: 100%;
        height: 50px;
        padding: 0 18px 0 20px;
        border: 1px solid color-mix(in srgb, var(--md-sys-color-outline-variant, #44464f) 55%, transparent);
        border-radius: 9999px;
        background: var(--md-sys-color-surface-container-high, #24252d);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font: inherit;
        font-size: 14.5px;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        cursor: pointer;
        transition:
          background-color 180ms cubic-bezier(0.2, 0, 0, 1),
          transform 180ms cubic-bezier(0.2, 0, 0, 1);
      }

      .cast-pill-btn:hover:not(:disabled) {
        background: color-mix(in srgb, currentColor 8%, var(--md-sys-color-surface-container-high, #24252d));
      }

      .cast-pill-btn:active:not(:disabled) {
        transform: scale(0.98);
      }

      .cast-pill-btn.is-disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }

      .cast-pill-left {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
      }

      .cast-pill-left svg {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      .cast-pill-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .cast-pill-chevron {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      /* =====================================================================
         INLINE CAST / OUTPUT BOTTOM SHEET (Screen 2)
         ===================================================================== */
      .cast-sheet-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.48);
        display: flex;
        align-items: flex-end;
        z-index: 15;
        animation: m3e-fade-in 180ms cubic-bezier(0.2, 0, 0, 1);
      }

      .cast-sheet {
        width: 100%;
        max-height: 84%;
        overflow-y: auto;
        overscroll-behavior: contain;
        background: var(--md-sys-color-surface-container-low, #1b1c22);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        border-radius: 28px 28px 0 0;
        padding: 10px 18px 22px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        animation: m3e-sheet-up 260ms cubic-bezier(0.05, 0.7, 0.1, 1);
      }

      .sheet-handle {
        width: 36px;
        height: 4px;
        border-radius: 9999px;
        background: var(--md-sys-color-outline-variant, #44464f);
        align-self: center;
      }

      .cast-sheet-header {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .cast-sheet-title {
        font-size: 20px;
        font-weight: 500;
      }

      .cast-now-preview {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .cast-mini-art {
        width: 56px;
        height: 56px;
        border-radius: 16px;
        overflow: hidden;
        flex-shrink: 0;
        background: var(--md-sys-color-surface-container-highest, #2d2e38);
        display: grid;
        place-items: center;
      }

      .cast-mini-art img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .cast-mini-art svg {
        width: 24px;
        height: 24px;
      }

      .cast-mini-meta {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .cast-mini-top .app-badge {
        width: 18px;
        height: 18px;
      }

      .cast-mini-top .app-badge .brand-icon-img,
      .cast-mini-top .app-badge svg {
        width: 18px;
        height: 18px;
      }

      .cast-mini-title {
        font-size: 15.5px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .cast-mini-artist {
        font-size: 13.5px;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .cast-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .cast-row {
        position: relative;
        width: 100%;
        min-height: 66px;
        padding: 0;
        border: 0;
        border-radius: 20px;
        overflow: hidden;
        background: var(--md-sys-color-surface-container-high, #25262e);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font: inherit;
        cursor: pointer;
        text-align: left;
        transition:
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-default),
          transform var(--m3e-spring-spatial-fast);
      }

      .cast-row.is-selected {
        border-radius: 9999px;
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .cast-row:active {
        transform: scale(0.98);
      }

      .cast-row-fill {
        position: absolute;
        inset-block: 0;
        left: 0;
        background: color-mix(in srgb, currentColor 12%, transparent);
        pointer-events: none;
      }

      .cast-row-inner {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 14px 18px;
      }

      .cast-row-left {
        display: flex;
        align-items: center;
        gap: 14px;
        min-width: 0;
      }

      .cast-dev-icon {
        width: 22px;
        height: 22px;
        flex-shrink: 0;
      }

      .cast-row-text {
        display: flex;
        flex-direction: column;
        gap: 1px;
        min-width: 0;
      }

      .cast-row-name {
        font-size: 15px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .cast-row.is-selected .cast-row-name {
        font-weight: 600;
      }

      .cast-row-sub {
        font-size: 13px;
        opacity: 0.8;
        font-variant-numeric: tabular-nums;
      }

      .cast-check {
        flex: 0 0 24px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid var(--md-sys-color-on-surface-variant, #8e9099);
        display: grid;
        place-items: center;
      }

      .cast-check.checked {
        border-color: transparent;
        background: var(--md-sys-color-on-primary-container, #1b1b1f);
        color: var(--md-sys-color-primary-container, #dce2ff);
      }

      .cast-check svg {
        width: 15px;
        height: 15px;
      }

      .cast-section-label {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      .source-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .source-chip {
        height: 38px;
        padding: 0 14px;
        border-radius: 12px;
        border: 1px solid var(--md-sys-color-outline-variant, #44464f);
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font: inherit;
        font-size: 13.5px;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        transition:
          border-radius var(--m3e-spring-bouncy),
          background-color 180ms cubic-bezier(0.2, 0, 0, 1),
          border-color 180ms cubic-bezier(0.2, 0, 0, 1),
          transform var(--m3e-spring-spatial-fast);
      }

      .source-chip.is-selected {
        border-radius: 9999px;
        border-color: transparent;
        background: var(--md-sys-color-secondary-container, #364067);
        color: var(--md-sys-color-on-secondary-container, #dce2ff);
      }

      .source-chip:active {
        transform: scale(0.95);
      }

      .chip-check {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }

      .cast-sheet-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 6px;
      }

      .stop-cast-btn {
        border: 0;
        background: transparent;
        color: var(--md-sys-color-primary, #8ab4f8);
        font: inherit;
        font-size: 14.5px;
        font-weight: 600;
        padding: 10px 14px;
        border-radius: 9999px;
        cursor: pointer;
      }

      .stop-cast-btn:hover {
        background: color-mix(in srgb, currentColor 10%, transparent);
      }

      .done-cast-btn {
        border: 0;
        background: var(--md-sys-color-primary, #4285f4);
        color: var(--md-sys-color-on-primary, #ffffff);
        font: inherit;
        font-size: 14.5px;
        font-weight: 600;
        padding: 11px 26px;
        border-radius: 9999px;
        cursor: pointer;
        transition: transform var(--m3e-spring-spatial-fast);
      }

      .done-cast-btn:active {
        transform: scale(0.95);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-media-popup': M3EMediaPopup;
  }
}
