import { LitElement, css, html, svg, nothing, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import '../editors/m3e-status-card-editor';
import { m3eBaseStyles } from '../styles/m3e-tokens';
import type {
  HassEntity,
  HomeAssistant,
  M3EStatusCardConfig,
  M3EStatusPopupType,
  M3ESubtitleFormat,
} from '../types/home-assistant';
import { renderM3EntityIcon } from '../utils/icons';
import { executeNavigationTarget } from '../utils/navigation';
import { formatLastChanged } from '../utils/time';
import { guardDialogTouchMove } from '../utils/scroll-lock';
import { closeModalDialog, forceCloseDialog, openModalDialog } from '../utils/dialog-motion';
import {
  ensureCardFeaturesLoaded,
  stopFeatureEventPropagation,
} from '../utils/ha-card-features';
import { resolveEntityName, resolveStateContent } from '../utils/entity-display';
import { ArtworkPalette, extractArtworkPalette } from '../utils/artwork-color';
import { t } from '../utils/i18n';
import { executeRemoteCommand, type RemoteActionKey } from '../utils/remote-commands';
import {
  remoteCustomControlStyles,
  renderRemoteCustomControls,
  type RemoteSelectorRequest,
} from '../utils/remote-custom-controls';
import './m3e-media-player-card';
import type { M3EMediaPopup } from '../components/m3e-media-popup';
import '../components/m3e-media-popup';
import type { HistoryMetricKind } from '../components/m3e-history-chart';
import '../components/m3e-history-chart';

const ISO_TIMESTAMP_RE = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$/;
const TIME_ONLY_RE = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;

function formatDisplayValue(rawVal: string, format: M3ESubtitleFormat): string {
  if (format === 'raw') return rawVal;
  const trimmed = rawVal.trim();

  let date: Date | null = null;
  const timeMatch = TIME_ONLY_RE.exec(trimmed);
  if (timeMatch) {
    const h = Number(timeMatch[1]);
    const m = Number(timeMatch[2]);
    const s = Number(timeMatch[3] ?? '0');
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
      const now = new Date();
      date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, s);
      if (date.getTime() <= now.getTime()) {
        date.setDate(date.getDate() + 1);
      }
    }
  } else if (ISO_TIMESTAMP_RE.test(trimmed)) {
    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) {
      date = parsed;
    }
  }

  if (!date) return rawVal;

  const hhmm = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (format === 'time' || format === 'auto') {
    return hhmm;
  }

  if (format === 'datetime') {
    const now = new Date();
    const sameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

    if (sameDay(date, now)) return `Oggi ${hhmm}`;
    if (sameDay(date, tomorrow)) return `Domani ${hhmm}`;
    if (sameDay(date, yesterday)) return `Ieri ${hhmm}`;
    const dayStr = date.toLocaleDateString([], { day: 'numeric', month: 'short' });
    return `${dayStr} ${hhmm}`;
  }

  // format === 'relative'
  const diffMs = date.getTime() - Date.now();
  const future = diffMs >= 0;
  const totalMin = Math.round(Math.abs(diffMs) / 60000);
  if (totalMin < 1) return 'Ora';

  const days = Math.floor(totalMin / 1440);
  const hours = Math.floor((totalMin % 1440) / 60);
  const mins = totalMin % 60;

  let parts: string;
  if (days > 0) {
    parts = hours > 0 ? `${days}g ${hours}h` : `${days}g`;
  } else if (hours > 0) {
    parts = mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  } else {
    parts = `${mins}m`;
  }

  return future ? `Tra ${parts}` : `${parts} fa`;
}

type ClimateSheetKind = 'mode' | 'preset' | 'fan' | 'swing' | null;

const NUMERIC_HISTORY_CLASSES = new Set(['moisture', 'temperature', 'humidity', 'illuminance']);

const DEFAULT_ACTIVE_STATES = new Set([
  'on',
  'home',
  'detected',
  'open',
  'unlocked',
  'playing',
  'heat',
  'cool',
  'heat_cool',
  'auto',
  'dry',
  'fan_only',
  'heating',
  'cooling',
  'true',
]);

const CHEVRON_DOWN_SVG = html`<svg viewBox="0 0 24 24" class="m3-chevron" aria-hidden="true"><path fill="currentColor" d="M7.41 8.59a1 1 0 0 1 1.41 0L12 11.77l3.18-3.18a1 1 0 1 1 1.41 1.41l-3.88 3.88a1 1 0 0 1-1.42 0L7.41 10a1 1 0 0 1 0-1.41Z"/></svg>`;
const CHEVRON_UP_SVG = html`<svg viewBox="0 0 24 24" class="m3-chevron" aria-hidden="true"><path fill="currentColor" d="M7.41 15.41a1 1 0 0 1 0-1.41l3.88-3.88a1 1 0 0 1 1.42 0L16.59 14a1 1 0 1 1-1.41 1.41L12 12.23l-3.18 3.18a1 1 0 0 1-1.41 0Z"/></svg>`;

const DIAL_START_DEG = 135; // bottom-left
const DIAL_SWEEP_DEG = 270; // 270 deg clockwise to bottom-right

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
  const rad = degToRad(deg);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const start = polarToCartesian(cx, cy, r, startDeg);
  const end = polarToCartesian(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

@customElement('m3e-status-card')
export class M3EStatusCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ type: Boolean }) public popupOnly = false;
  @state() private _config?: M3EStatusCardConfig;
  @state() private _pressed = false;
  @state() private _popupOpen = false;

  // Climate dial interaction state
  @state() private _dialDragging = false;
  @state() private _dialTemp: number | null = null;
  @state() private _activeSheet: ClimateSheetKind = null;
  @state() private _remoteSelectorSheet: RemoteSelectorRequest | null = null;

  // Media volume slider interaction state
  @state() private _volDragging = false;
  @state() private _volPct: number | null = null;
  private _volPendingTimer: number | null = null;

  @state() private _featuresLoaded = false;
  @state() private _artPalette: ArtworkPalette | null = null;
  private _lastArtUrl = '';

  @query('dialog.status-dialog') private _dialogEl?: HTMLDialogElement;
  @query('.status-tile') private _tileEl?: HTMLElement;
  @query('m3e-media-popup') private _mediaPopupEl?: M3EMediaPopup;
  @query('.dialog-surface') private _dialogSurfaceEl?: HTMLElement;

  private _prevStates: Record<string, HassEntity | undefined> = {};
  private _longPressTimer: number | null = null;
  private _longPressTriggered = false;
  private _relativeTimer: number | null = null;
  @state() private _relativeTick = 0;

  // Google Home Remote Touchpad gesture state
  @state() private _padOffsetX = 0;
  @state() private _padOffsetY = 0;
  @state() private _padActive = false;
  @state() private _padTapPulse = false;
  private _padPointerId: number | null = null;
  private _padStartX = 0;
  private _padStartY = 0;
  private _padSwiped = false;
  private _padDir: 'dpad_up' | 'dpad_down' | 'dpad_left' | 'dpad_right' | null = null;
  private _padRepeatTimer: number | null = null;
  private _padHoldTimer: number | null = null;
  private _padPulseTimer: number | null = null;

  public static getStubConfig(hass?: HomeAssistant): M3EStatusCardConfig {
    const entity = hass
      ? Object.keys(hass.states).find(
          (id) =>
            id.startsWith('binary_sensor.') ||
            id.startsWith('climate.') ||
            id.startsWith('media_player.') ||
            id.startsWith('sensor.'),
        )
      : undefined;
    return {
      type: 'custom:m3e-status-card',
      entity: entity ?? 'binary_sensor.motion',
      popup_type: 'auto',
      tap_action: 'popup',
    };
  }

  public static getConfigElement(): HTMLElement {
    return document.createElement('m3e-status-card-editor');
  }

  public setConfig(config: M3EStatusCardConfig): void {
    if (!config || !config.entity) {
      throw new Error('m3e-status-card: you must define an entity');
    }
    this._config = {
      popup_type: 'auto',
      tap_action: 'popup',
      hold_action: 'popup',
      subtitle_format: 'auto',
      ...config,
    };
    this._syncRelativeTimer();
    this._ensureFeatures();
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this._syncRelativeTimer();
    this._ensureFeatures();
  }

  private _ensureFeatures(): void {
    if ((this._config?.features?.length ?? 0) > 0 && !this._featuresLoaded) {
      void ensureCardFeaturesLoaded().then((ok) => {
        if (ok) this._featuresLoaded = true;
      });
    }
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    forceCloseDialog(this._dialogEl, this._dialogSurfaceEl, () => {
      this._popupOpen = false;
      this._activeSheet = null;
      this._remoteSelectorSheet = null;
    });
    this._clearLongPress();
    this._clearPadTimers();
    if (this._relativeTimer !== null) {
      window.clearInterval(this._relativeTimer);
      this._relativeTimer = null;
    }
  }

  private _syncRelativeTimer(): void {
    const wantsRelative = this._config?.subtitle_format === 'relative';
    if (wantsRelative && this._relativeTimer === null) {
      this._relativeTimer = window.setInterval(() => {
        this._relativeTick++;
      }, 30000);
    } else if (!wantsRelative && this._relativeTimer !== null) {
      window.clearInterval(this._relativeTimer);
      this._relativeTimer = null;
    }
  }

  private _clearLongPress(): void {
    if (this._longPressTimer !== null) {
      window.clearTimeout(this._longPressTimer);
      this._longPressTimer = null;
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

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (
      changedProps.has('_config') ||
      changedProps.has('_pressed') ||
      changedProps.has('_popupOpen') ||
      changedProps.has('_dialDragging') ||
      changedProps.has('_dialTemp') ||
      changedProps.has('_activeSheet') ||
      changedProps.has('_remoteSelectorSheet') ||
      changedProps.has('_volDragging') ||
      changedProps.has('_volPct') ||
      changedProps.has('_relativeTick') ||
      changedProps.has('_featuresLoaded') ||
      changedProps.has('_artPalette') ||
      changedProps.has('_padOffsetX') ||
      changedProps.has('_padOffsetY') ||
      changedProps.has('_padActive') ||
      changedProps.has('_padTapPulse')
    ) {
      return true;
    }

    if (changedProps.has('hass') && this._config && this.hass) {
      if ((this._config.features?.length ?? 0) > 0) {
        return true;
      }
      const watched = [
        this._config.entity,
        this._config.status_entity,
        this._config.subtitle_entity,
        this._config.secondary_entity,
        this._config.outdoor_entity,
        ...(this._config.extra_entities ?? []).slice(0, 10),
        ...this._getSiblingEntityIds(),
        ...(this._resolvedPopupType === 'power_strip'
          ? this._getPowerStripEntities().map((e) => e.entity_id)
          : []),
      ].filter(Boolean) as string[];

      let changed = false;
      for (const id of watched) {
        const next = this.hass.states[id];
        if (next !== this._prevStates[id]) {
          this._prevStates[id] = next;
          changed = true;
        }
      }
      return changed;
    }

    return false;
  }

  private get _entity(): HassEntity | undefined {
    if (!this.hass || !this._config) return undefined;
    return this.hass.states[this._config.entity];
  }

  /** Entity used to compute active/inactive state & subtitle (defaults to primary entity). */
  private get _statusEntity(): HassEntity | undefined {
    if (!this.hass || !this._config) return undefined;
    if (this._config.status_entity) {
      return this.hass.states[this._config.status_entity] ?? this._entity;
    }
    return this._entity;
  }

  /**
   * Resolves the media_player entity for Media popups (auto-discovers sibling media_player.*
   * on the same device_id when the card is configured with an Android TV remote.* entity).
   */
  private get _mediaEntity(): HassEntity | undefined {
    if (!this.hass || !this._config) return undefined;
    if (this._config.entity.startsWith('media_player.')) return this._entity;
    const deviceId = this.hass.entities?.[this._config.entity]?.device_id;
    if (deviceId && this.hass.entities) {
      for (const [id, entry] of Object.entries(this.hass.entities)) {
        if (entry.device_id === deviceId && id.startsWith('media_player.')) {
          const st = this.hass.states[id];
          if (st) return st;
        }
      }
    }
    return this._entity;
  }

  /**
   * Auto-discovers sibling sensor entities belonging to the exact same Home Assistant device_id
   * (e.g. humidity on a thermometer device, or temperature/illuminance/battery on a motion sensor).
   */
  private _getSiblingEntityIds(): string[] {
    if (!this.hass?.entities || !this._config) return [];
    const primaryId = this._config.entity;
    const deviceId = this.hass.entities[primaryId]?.device_id;
    if (!deviceId) return [];

    const siblings: string[] = [];
    for (const [id, entry] of Object.entries(this.hass.entities)) {
      if (
        id !== primaryId &&
        entry.device_id === deviceId &&
        (id.startsWith('sensor.') || id.startsWith('media_player.'))
      ) {
        siblings.push(id);
      }
    }
    return siblings;
  }

  private _getSiblingSensors(): HassEntity[] {
    if (!this.hass) return [];
    const results: HassEntity[] = [];
    const seen = new Set<string>();

    if (this._config?.secondary_entity) {
      const manual = this.hass.states[this._config.secondary_entity];
      if (manual) {
        results.push(manual);
        seen.add(manual.entity_id);
      }
    }

    const preferredClasses = [
      'power',
      'energy',
      'current',
      'voltage',
      'temperature',
      'humidity',
      'illuminance',
      'pressure',
      'atmospheric_pressure',
      'co2',
      'pm25',
      'battery',
    ];
    const siblings = this._getSiblingEntityIds()
      .map((id) => this.hass!.states[id])
      .filter((e): e is HassEntity => Boolean(e) && !seen.has(e.entity_id));

    siblings.sort((a, b) => {
      const ia = preferredClasses.indexOf(String(a.attributes.device_class ?? ''));
      const ib = preferredClasses.indexOf(String(b.attributes.device_class ?? ''));
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });

    for (const sib of siblings) {
      const dc = String(sib.attributes.device_class ?? '');
      if (preferredClasses.includes(dc)) {
        results.push(sib);
        seen.add(sib.entity_id);
      }
    }

    if (Array.isArray(this._config?.extra_entities)) {
      for (const extraId of this._config.extra_entities.slice(0, 10)) {
        if (!extraId || seen.has(extraId)) continue;
        const extra = this.hass.states[extraId];
        if (extra) {
          results.push(extra);
          seen.add(extra.entity_id);
        }
      }
    }

    return results;
  }

  private get _secondaryEntity(): HassEntity | undefined {
    return this._getSiblingSensors()[0];
  }

  private get _outdoorEntity(): HassEntity | undefined {
    if (!this.hass || !this._config?.outdoor_entity) return undefined;
    return this.hass.states[this._config.outdoor_entity];
  }

  private get _resolvedPopupType(): Exclude<M3EStatusPopupType, 'auto'> {
    const cfg = this._config?.popup_type ?? 'auto';
    if (cfg !== 'auto') return cfg;
    const id = this._config?.entity ?? '';
    if (id.startsWith('input_select.') || id.startsWith('select.')) return 'selector';
    if (id.startsWith('climate.')) return 'climate';
    if (id.startsWith('media_player.')) return 'media';
    if (id.startsWith('remote.')) {
      // If the same device has a media_player (e.g. Android TV / Chromecast), prefer the Media popup
      const media = this._mediaEntity;
      if (media && media.entity_id.startsWith('media_player.')) return 'media';
      return 'remote';
    }
    return 'sensor';
  }

  /**
   * Resolves all toggleable outlets for the Power Strip popup:
   * - If `extra_entities` are explicitly configured, uses those (up to 10).
   * - Otherwise auto-discovers all switch.* / light.* / input_boolean.* entities on the same device_id.
   */
  private _getPowerStripEntities(): HassEntity[] {
    if (!this.hass || !this._config) return [];
    const results: HassEntity[] = [];
    const seen = new Set<string>();

    if (Array.isArray(this._config.extra_entities) && this._config.extra_entities.length > 0) {
      for (const id of this._config.extra_entities.slice(0, 10)) {
        if (!id || seen.has(id)) continue;
        const st = this.hass.states[id];
        if (st) {
          results.push(st);
          seen.add(id);
        }
      }
      return results;
    }

    const primaryId = this._config.entity;
    const primary = this.hass.states[primaryId];
    const isToggleDomain = (id: string) =>
      id.startsWith('switch.') || id.startsWith('light.') || id.startsWith('input_boolean.');

    if (primary && isToggleDomain(primaryId)) {
      results.push(primary);
      seen.add(primaryId);
    }

    const deviceId = this.hass.entities?.[primaryId]?.device_id;
    if (deviceId && this.hass.entities) {
      const siblings: HassEntity[] = [];
      for (const [id, entry] of Object.entries(this.hass.entities)) {
        if (entry.device_id === deviceId && !seen.has(id) && isToggleDomain(id)) {
          const st = this.hass.states[id];
          if (st) {
            siblings.push(st);
            seen.add(id);
          }
        }
      }
      siblings.sort((a, b) =>
        this._cleanSiblingLabel(a).localeCompare(this._cleanSiblingLabel(b), undefined, {
          numeric: true,
        }),
      );
      results.push(...siblings);
    }

    return results;
  }

  private get _isActive(): boolean {
    if (this._resolvedPopupType === 'power_strip') {
      const outlets = this._getPowerStripEntities();
      if (outlets.length > 0) {
        return outlets.some((o) => o.state === 'on');
      }
    }

    const entity = this._statusEntity;
    const stateStr = String(entity?.state ?? '').toLowerCase();
    if (!stateStr || stateStr === 'unavailable' || stateStr === 'unknown') return false;

    if (this._config?.active_state?.trim()) {
      const allowed = this._config.active_state
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      return allowed.includes(stateStr);
    }

    // Passive numeric sensors (temperature, humidity, illuminance, etc.) stay neutral per M3Y rules
    if (entity?.entity_id.startsWith('sensor.') && !Number.isNaN(Number(stateStr))) {
      return false;
    }

    return DEFAULT_ACTIVE_STATES.has(stateStr);
  }

  private get _isUnavailable(): boolean {
    const s = this._statusEntity?.state;
    return !s || s === 'unavailable' || s === 'unknown';
  }

  private get _stateLabel(): string {
    if (this._resolvedPopupType === 'power_strip') {
      const outlets = this._getPowerStripEntities();
      if (outlets.length > 0) {
        const allOffline = outlets.every(
          (o) => o.state === 'unavailable' || o.state === 'unknown',
        );
        if (allOffline) return 'Offline';
        const onCount = outlets.filter((o) => o.state === 'on').length;
        if (onCount > 0) {
          return this._config?.label_active || `${onCount} on`;
        }
        return this._config?.label_inactive || 'Off';
      }
    }

    const entity = this._statusEntity;
    if (!entity) return 'Offline';
    const raw = entity.state;
    if (raw === 'unavailable' || raw === 'unknown') return 'Offline';

    const fmt: M3ESubtitleFormat = this._config?.subtitle_format ?? 'auto';

    // Custom subtitle from another entity and/or specific attribute
    const hasCustomSource = Boolean(
      this._config?.subtitle_entity?.trim() || this._config?.subtitle_attribute?.trim(),
    );
    const vis =
      this._config?.subtitle_visibility ??
      (this._config?.subtitle_only_when_active ? 'on' : 'both');
    const shouldShowCustom =
      vis === 'both' || (vis === 'on' && this._isActive) || (vis === 'off' && !this._isActive);

    if (hasCustomSource && shouldShowCustom) {
      const source = this._config?.subtitle_entity?.trim()
        ? this.hass?.states[this._config.subtitle_entity.trim()]
        : entity;
      if (source) {
        const attrName = this._config?.subtitle_attribute?.trim();
        let val: unknown;
        if (attrName) {
          val = source.attributes[attrName];
        } else {
          const s = source.state;
          if (s !== 'unavailable' && s !== 'unknown') {
            const unit = source.attributes.unit_of_measurement;
            val = unit ? `${s}${unit}` : s;
          }
        }
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          const formatted = formatDisplayValue(String(val), fmt);
          const prefix = this._config?.subtitle_prefix ?? '';
          const suffix = this._config?.subtitle_suffix ?? '';
          return `${prefix}${formatted}${suffix}`;
        }
      }
    }

    if (this._isActive && this._config?.label_active) return this._config.label_active;
    if (!this._isActive && this._config?.label_inactive) return this._config.label_inactive;

    const domain = entity.entity_id.split('.')[0];
    if (domain === 'climate') {
      const mode = raw.charAt(0).toUpperCase() + raw.slice(1);
      const t = entity.attributes.temperature;
      return raw !== 'off' && typeof t === 'number' ? `${mode} ${t}` : mode;
    }

    if (domain === 'sensor') {
      if (ISO_TIMESTAMP_RE.test(raw.trim())) {
        return formatDisplayValue(raw, fmt);
      }
      const unit = entity.attributes.unit_of_measurement;
      const primaryText = unit ? `${raw}${unit}` : raw;
      const isTemp =
        entity.attributes.device_class === 'temperature' ||
        unit === '°C' ||
        unit === '°F';
      if (isTemp) {
        const hum = this._getSiblingSensors().find(
          (s) => s.attributes.device_class === 'humidity' || s.attributes.unit_of_measurement === '%',
        );
        if (hum && hum.state !== 'unavailable' && hum.state !== 'unknown') {
          return `${primaryText} • ${hum.state}${hum.attributes.unit_of_measurement ?? '%'}`;
        }
      }
      return primaryText;
    }

    if (domain === 'media_player') {
      return raw.charAt(0).toUpperCase() + raw.slice(1);
    }

    if (ISO_TIMESTAMP_RE.test(raw.trim())) {
      return formatDisplayValue(raw, fmt);
    }

    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }

  private _inferMetricKind(entity?: HassEntity): HistoryMetricKind | null {
    if (!entity || !entity.entity_id.startsWith('sensor.')) return null;
    const dc = String(entity.attributes.device_class ?? '').toLowerCase();
    const uom = String(entity.attributes.unit_of_measurement ?? '').trim().toLowerCase();
    const lowId = entity.entity_id.toLowerCase();
    const lowName = String(entity.attributes.friendly_name ?? '').toLowerCase();

    if (
      dc === 'moisture' ||
      ((lowId.includes('moisture') ||
        lowName.includes('moisture') ||
        lowName.includes('umidità terreno')) &&
        uom === '%')
    ) {
      return 'moisture';
    }
    if (dc === 'temperature' || uom === '°c' || uom === '°f') {
      return 'temperature';
    }
    if (dc === 'humidity') {
      return 'humidity';
    }
    if (dc === 'illuminance' || uom === 'lx' || uom === 'lux') {
      return 'illuminance';
    }
    return NUMERIC_HISTORY_CLASSES.has(dc) ? (dc as HistoryMetricKind) : null;
  }

  private _isNumericHistoryEntity(entity?: HassEntity): boolean {
    return this._inferMetricKind(entity) !== null;
  }

  private _resolveHistoryEntity(): HassEntity | undefined {
    if (this._isNumericHistoryEntity(this._entity)) return this._entity;
    const siblings = this._getSiblingSensors();
    for (const kind of ['moisture', 'temperature', 'humidity', 'illuminance'] as const) {
      const found = siblings.find((s) => this._inferMetricKind(s) === kind);
      if (found) return found;
    }
    return undefined;
  }

  private _resolveHistoryTarget(): {
    entityIds: string[];
    metricKind: HistoryMetricKind;
    unit: string;
  } | null {
    if (!this.hass) return null;
    const target = this._resolveHistoryEntity();
    if (!target) return null;
    const metricKind = this._inferMetricKind(target);
    if (!metricKind) return null;

    const unit = String(target.attributes.unit_of_measurement ?? '').trim();
    const rawGroupMembers = target.attributes.entity_id;
    if (Array.isArray(rawGroupMembers)) {
      const validMembers = rawGroupMembers.filter(
        (id): id is string =>
          typeof id === 'string' && id.startsWith('sensor.') && Boolean(this.hass?.states[id]),
      );
      if (validMembers.length >= 2) {
        const firstUnit = String(
          this.hass.states[validMembers[0]]?.attributes.unit_of_measurement ?? '',
        ).trim();
        return {
          entityIds: validMembers,
          metricKind,
          unit: unit || firstUnit,
        };
      }
    }

    const entityIds = [target.entity_id];
    for (const extraId of this._config?.extra_entities ?? []) {
      if (!extraId || entityIds.includes(extraId)) continue;
      const extraEnt = this.hass.states[extraId];
      if (this._inferMetricKind(extraEnt) === metricKind) {
        entityIds.push(extraId);
      }
    }

    return { entityIds, metricKind, unit };
  }

  /* =========================================================================
     POPUP OPEN / CLOSE (Material You Container Transform / Bottom Sheet)
     ========================================================================= */
  public async openPopup(originRect?: DOMRect): Promise<void> {
    if (this._resolvedPopupType === 'none') return;
    if (this._popupOpen && this._dialogEl?.open) {
      let isModal = true;
      try {
        isModal = this._dialogEl.matches(':modal');
      } catch {
        // ignore
      }
      if (isModal) return;
      this._popupOpen = false;
    }
    window.getSelection()?.removeAllRanges();
    const tileRect = originRect ?? this._tileEl?.getBoundingClientRect();
    this._activeSheet = null;
    this._remoteSelectorSheet = null;
    this._popupOpen = true;
    await this.updateComplete;

    const dialog = this._dialogEl;
    const surface = this._dialogSurfaceEl;
    if (!dialog) {
      this._popupOpen = false;
      return;
    }
    openModalDialog(dialog, surface, {
      originRect: tileRect,
      onRequestClose: () => this.closePopup(),
      onForceReset: () => {
        this._popupOpen = false;
        this._activeSheet = null;
        this._remoteSelectorSheet = null;
      },
    });
  }

  public closePopup(): void {
    closeModalDialog(this._dialogEl, this._dialogSurfaceEl, () => {
      this._popupOpen = false;
      this._activeSheet = null;
      this._remoteSelectorSheet = null;
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
      this._openMoreInfo(this._config.entity);
      return;
    }
    this.openPopup();
  }

  private _onTilePointerDown = (e: PointerEvent): void => {
    if (e.button !== 0) return;
    this._pressed = true;
    this._longPressTriggered = false;
    this._clearLongPress();
    this._longPressTimer = window.setTimeout(() => {
      this._longPressTriggered = true;
      this._pressed = false;
      this._handleHoldAction();
    }, 420);
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
    if (this._longPressTriggered) {
      this._longPressTriggered = false;
      return;
    }
    const action = this._config?.tap_action ?? 'popup';
    if (action === 'none') return;
    if (action === 'navigate') {
      executeNavigationTarget(this, this.hass, this._config?.navigation_path);
      return;
    }
    if (action === 'more-info' && this._config) {
      this._openMoreInfo(this._config.entity);
      return;
    }
    if (action === 'toggle' && this.hass && this._config) {
      const domain = this._config.entity.split('.')[0];
      this.hass.callService(domain, 'toggle', { entity_id: this._config.entity });
      return;
    }
    this.openPopup();
  };

  /* =========================================================================
     CLIMATE DIAL INTERACTION (Arc Drag with Morphing Radial Thumb)
     ========================================================================= */
  private get _climateMin(): number {
    return Number(this._entity?.attributes.min_temp ?? 7);
  }

  private get _climateMax(): number {
    return Number(this._entity?.attributes.max_temp ?? 30);
  }

  private get _climateTarget(): number {
    if (this._dialDragging && this._dialTemp !== null) return this._dialTemp;
    return Number(this._entity?.attributes.temperature ?? 20);
  }

  private get _climateCurrent(): number | null {
    const cur = this._entity?.attributes.current_temperature;
    if (typeof cur === 'number') return cur;
    const sec = this._secondaryEntity?.state;
    if (sec && !Number.isNaN(Number(sec))) return Number(sec);
    return null;
  }

  private _tempToDeg(temp: number): number {
    const ratio = Math.max(
      0,
      Math.min(1, (temp - this._climateMin) / (this._climateMax - this._climateMin)),
    );
    return DIAL_START_DEG + ratio * DIAL_SWEEP_DEG;
  }

  private _pointerToTemp(e: PointerEvent, svg: Element): number {
    const rect = svg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let angle = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
    if (angle < 0) angle += 360;

    // Normalize relative to DIAL_START_DEG (135 deg)
    let rel = (angle - DIAL_START_DEG + 360) % 360;
    if (rel > DIAL_SWEEP_DEG) {
      // Snap to nearest end in the dead bottom zone
      rel = rel > DIAL_SWEEP_DEG + (360 - DIAL_SWEEP_DEG) / 2 ? 0 : DIAL_SWEEP_DEG;
    }

    const ratio = rel / DIAL_SWEEP_DEG;
    const rawTemp = this._climateMin + ratio * (this._climateMax - this._climateMin);
    return Math.round(rawTemp * 2) / 2; // 0.5° steps
  }

  private _setClimateTemp(temp: number): void {
    if (!this.hass || !this._config) return;
    const clamped = Math.max(this._climateMin, Math.min(this._climateMax, Math.round(temp * 2) / 2));
    this.hass.callService('climate', 'set_temperature', {
      entity_id: this._config.entity,
      temperature: clamped,
    });
  }

  private _setClimateMode(mode: string): void {
    if (!this.hass || !this._config) return;
    this.hass.callService('climate', 'set_hvac_mode', {
      entity_id: this._config.entity,
      hvac_mode: mode,
    });
    this._activeSheet = null;
  }

  private _setClimatePreset(preset: string): void {
    if (!this.hass || !this._config) return;
    this.hass.callService('climate', 'set_preset_mode', {
      entity_id: this._config.entity,
      preset_mode: preset,
    });
    this._activeSheet = null;
  }

  private _setClimateFan(fan: string): void {
    if (!this.hass || !this._config) return;
    this.hass.callService('climate', 'set_fan_mode', {
      entity_id: this._config.entity,
      fan_mode: fan,
    });
    this._activeSheet = null;
  }

  private _setClimateSwing(swing: string): void {
    if (!this.hass || !this._config) return;
    this.hass.callService('climate', 'set_swing_mode', {
      entity_id: this._config.entity,
      swing_mode: swing,
    });
    this._activeSheet = null;
  }

  private _onDialPointerDown = (e: PointerEvent): void => {
    if (e.button !== 0) return;
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    this._dialDragging = true;
    const next = this._pointerToTemp(e, el);
    this._dialTemp = next;
  };

  private _onDialPointerMove = (e: PointerEvent): void => {
    if (!this._dialDragging) return;
    const next = this._pointerToTemp(e, e.currentTarget as HTMLElement);
    if (next !== this._dialTemp) {
      this._dialTemp = next;
    }
  };

  private _onDialPointerUp = (e: PointerEvent): void => {
    if (!this._dialDragging) return;
    const el = e.currentTarget as HTMLElement;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    if (this._dialTemp !== null) {
      this._setClimateTemp(this._dialTemp);
    }
    this._dialDragging = false;
    this._dialTemp = null;
  };

  /* =========================================================================
     MEDIA VOLUME PILL INTERACTION
     ========================================================================= */
  private get _mediaVolumePct(): number {
    if (this._volPct !== null) return this._volPct;
    const v = this._mediaEntity?.attributes.volume_level;
    return typeof v === 'number' ? Math.round(v * 100) : 0;
  }

  private _onVolPointerDown = (e: PointerEvent): void => {
    if (e.button !== 0) return;
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    if (this._volPendingTimer !== null) {
      window.clearTimeout(this._volPendingTimer);
      this._volPendingTimer = null;
    }
    this._volDragging = true;
    this._updateVolFromPointer(e.clientX, el, false);
  };

  private _onVolPointerMove = (e: PointerEvent): void => {
    if (!this._volDragging) return;
    this._updateVolFromPointer(e.clientX, e.currentTarget as HTMLElement, false);
  };

  private _onVolPointerUp = (e: PointerEvent): void => {
    if (!this._volDragging) return;
    const el = e.currentTarget as HTMLElement;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    this._updateVolFromPointer(e.clientX, el, true);
    this._volDragging = false;
    // Keep optimistic percentage briefly until HA pushes updated volume_level
    this._volPendingTimer = window.setTimeout(() => {
      this._volPct = null;
      this._volPendingTimer = null;
    }, 900);
  };

  private _updateVolFromPointer(clientX: number, el: HTMLElement, commit: boolean): void {
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const pct = Math.round(Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) * 100);
    this._volPct = pct;
    const media = this._mediaEntity;
    if (commit && this.hass && media) {
      this.hass.callService('media_player', 'volume_set', {
        entity_id: media.entity_id,
        volume_level: Number((pct / 100).toFixed(2)),
      });
    }
  }

  private _callMediaService(service: string, extra: Record<string, unknown> = {}): void {
    const media = this._mediaEntity;
    if (!this.hass || !media) return;
    this.hass.callService('media_player', service, {
      entity_id: media.entity_id,
      ...extra,
    });
  }

  private _openMoreInfo(entityId: string, view?: 'info' | 'history' | 'settings'): void {
    this.closePopup();
    this.dispatchEvent(
      new CustomEvent('hass-more-info', {
        bubbles: true,
        composed: true,
        detail: view ? { entityId, view } : { entityId },
      }),
    );
  }

  /* =========================================================================
     ICONS (Native <ha-icon> in HA + clean SVG fallbacks in standalone preview)
     ========================================================================= */
  private _renderEntityIcon(iconName?: string) {
    if (iconName && typeof customElements !== 'undefined' && customElements.get('ha-icon')) {
      return html`<ha-icon .icon=${iconName}></ha-icon>`;
    }
    const targetEnt = this._statusEntity ?? this._entity;
    if (this._config?.use_entity_icon && targetEnt && typeof customElements !== 'undefined') {
      if (customElements.get('ha-state-icon')) {
        return html`<ha-state-icon .hass=${this.hass} .stateObj=${targetEnt}></ha-state-icon>`;
      }
      const attrIcon = targetEnt.attributes.icon;
      if (attrIcon && customElements.get('ha-icon')) {
        return html`<ha-icon .icon=${attrIcon}></ha-icon>`;
      }
    }
    return renderM3EntityIcon(targetEnt, this._isActive, this._resolvedPopupType);
  }

  /* =========================================================================
     POPUP VARIANT RENDERERS (Hero Top + Modular Trait Stack Bottom)
     ========================================================================= */
  private _cleanSiblingLabel(sec: HassEntity): string {
    const dc = String(sec.attributes.device_class ?? '');
    const rawName = (sec.attributes.friendly_name || '').trim();
    if (!rawName) {
      return dc ? dc.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase()) : 'Sensor';
    }

    const stripPrefix = (text: string, prefix: string): string | null => {
      const p = prefix.trim();
      if (!p || text.length <= p.length) return null;
      if (text.toLowerCase().startsWith(p.toLowerCase())) {
        const rest = text.slice(p.length).replace(/^[\s\-–—:]+/, '').trim();
        if (rest) return rest.charAt(0).toUpperCase() + rest.slice(1);
      }
      return null;
    };

    // 1. Try exact HA Device Registry name (name_by_user or name)
    const deviceId = this.hass?.entities?.[sec.entity_id]?.device_id;
    const dev = deviceId ? this.hass?.devices?.[deviceId] : undefined;
    for (const candidate of [
      dev?.name_by_user,
      dev?.name,
      typeof this._config?.name === 'string' ? this._config.name : undefined,
      this._entity?.attributes.friendly_name,
    ]) {
      if (candidate) {
        const cleaned = stripPrefix(rawName, candidate);
        if (cleaned) return cleaned;
      }
    }

    // 2. Fallback: strip longest common word prefix with primary entity friendly_name
    const primaryName = (this._entity?.attributes.friendly_name || '').trim();
    if (primaryName) {
      const aWords = primaryName.split(/\s+/);
      const bWords = rawName.split(/\s+/);
      let i = 0;
      while (
        i < aWords.length &&
        i < bWords.length - 1 &&
        aWords[i].toLowerCase() === bWords[i].toLowerCase()
      ) {
        i++;
      }
      if (i > 0) {
        const rest = bWords.slice(i).join(' ').replace(/^[\s\-–—:]+/, '').trim();
        if (rest) return rest.charAt(0).toUpperCase() + rest.slice(1);
      }
    }

    return rawName;
  }

  private _renderSiblingIcon(sec: HassEntity) {
    if (typeof customElements !== 'undefined' && customElements.get('ha-state-icon')) {
      return html`<ha-state-icon class="mini-ha-icon" .hass=${this.hass} .stateObj=${sec}></ha-state-icon>`;
    }
    const dc = String(sec.attributes.device_class ?? '');
    if (dc === 'humidity') {
      return html`<svg viewBox="0 0 24 24" class="mini-svg"><path fill="currentColor" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69Z"/></svg>`;
    }
    if (dc === 'illuminance') {
      return html`<svg viewBox="0 0 24 24" class="mini-svg"><path fill="currentColor" d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-1-5h2v3h-2V2Zm0 17h2v3h-2v-3ZM2 11h3v2H2v-2Zm17 0h3v2h-3v-2ZM4.93 6.34l1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12Zm10.61 10.61 1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12ZM17.66 4.93l1.41 1.41-2.12 2.12-1.41-1.41 2.12-2.12ZM6.34 19.07l-1.41-1.41 2.12-2.12 1.41 1.41-2.12 2.12Z"/></svg>`;
    }
    if (dc === 'battery') {
      return html`<svg viewBox="0 0 24 24" class="mini-svg"><path fill="currentColor" d="M15.67 4H14V2h-4v2H8.33A1.33 1.33 0 0 0 7 5.33v15.33A1.34 1.34 0 0 0 8.33 22h7.33A1.34 1.34 0 0 0 17 20.67V5.33A1.33 1.33 0 0 0 15.67 4Z"/></svg>`;
    }
    return html`<svg viewBox="0 0 24 24" class="mini-svg"><path fill="currentColor" d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0Zm-3-9a1 1 0 0 1 1 1v4h-2V5a1 1 0 0 1 1-1Z"/></svg>`;
  }

  private _renderHistoryChart() {
    if (!this._popupOpen) return nothing;
    const resolved = this._resolveHistoryTarget();
    if (!resolved) return nothing;

    return html`
      <m3e-history-chart
        .hass=${this.hass}
        .entityIds=${resolved.entityIds}
        .metricKind=${resolved.metricKind}
        .unit=${resolved.unit}
      ></m3e-history-chart>
    `;
  }

  private get _toggleablePowerEntity(): HassEntity | undefined {
    const candidates = [this._entity, this._statusEntity].filter(Boolean) as HassEntity[];
    for (const ent of candidates) {
      const domain = ent.entity_id.split('.')[0];
      if (domain === 'light' || domain === 'switch' || domain === 'input_boolean') {
        return ent;
      }
    }
    return undefined;
  }

  private get _defaultRingStateLabel(): string {
    const entity = this._entity ?? this._statusEntity;
    if (!entity) return 'Offline';
    const raw = String(entity.state ?? '').trim();
    const low = raw.toLowerCase();
    if (!raw || low === 'unavailable' || low === 'unknown') return 'Offline';

    const domain = entity.entity_id.split('.')[0];
    const dc = String(entity.attributes.device_class ?? '').toLowerCase();

    if (domain === 'sensor') {
      if (ISO_TIMESTAMP_RE.test(raw)) {
        return formatDisplayValue(raw, 'auto');
      }
      const unit = entity.attributes.unit_of_measurement;
      return unit ? `${raw}${unit}` : raw;
    }

    if (domain === 'binary_sensor') {
      const isOn = low === 'on';
      if (dc === 'door' || dc === 'window' || dc === 'opening' || dc === 'garage_door') {
        return isOn ? 'Open' : 'Closed';
      }
      if (dc === 'motion' || dc === 'occupancy' || dc === 'presence') {
        return isOn ? 'Detected' : 'Clear';
      }
      if (dc === 'lock') {
        return isOn ? 'Unlocked' : 'Locked';
      }
      if (dc === 'connectivity' || dc === 'plug') {
        return isOn ? 'Connected' : 'Disconnected';
      }
      if (dc === 'moisture' || dc === 'smoke' || dc === 'gas') {
        return isOn ? 'Detected' : 'Clear';
      }
      return isOn ? 'On' : 'Off';
    }

    if (low === 'home') return 'Home';
    if (low === 'not_home') return 'Away';
    if (low === 'on') return 'On';
    if (low === 'off') return 'Off';
    return raw.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
  }

  private _togglePowerEntity(ent: HassEntity): void {
    if (!this.hass) return;
    const domain = ent.entity_id.split('.')[0];
    const isOn = ent.state === 'on';
    this.hass.callService(domain, isOn ? 'turn_off' : 'turn_on', {
      entity_id: ent.entity_id,
    });
  }

  private _openEntityMoreInfo(entityId: string): void {
    forceCloseDialog(this._dialogEl, this._dialogSurfaceEl, () => {
      this._popupOpen = false;
      this._activeSheet = null;
      this._remoteSelectorSheet = null;
    });
    this.dispatchEvent(
      new CustomEvent('hass-more-info', {
        detail: { entityId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _renderSensorPopup(icon?: string) {
    const siblings = this._getSiblingSensors();
    const hideRing = Boolean(this._toggleablePowerEntity);

    return html`
      ${hideRing
        ? nothing
        : html`
            <div class="sensor-hero">
              <div class="sensor-ring ${this._isActive ? 'is-active' : ''}">
                <span class="sensor-ring-icon">${this._renderEntityIcon(icon)}</span>
                <span class="sensor-ring-state">${this._defaultRingStateLabel}</span>
                <span class="sensor-ring-sub">
                  ${this._entity?.attributes.device_class
                    ? String(this._entity.attributes.device_class).replace(/^./, (c) =>
                        c.toUpperCase(),
                      )
                    : 'Status'}
                </span>
              </div>
            </div>
          `}

      ${siblings.length > 0
        ? html`
            <div class="modular-stack">
              ${siblings.map((sec) => {
                const label = this._cleanSiblingLabel(sec);
                const rawSt = String(sec.state ?? '');
                const val =
                  rawSt === 'unavailable' || rawSt === 'unknown'
                    ? 'Offline'
                    : ISO_TIMESTAMP_RE.test(rawSt.trim()) || TIME_ONLY_RE.test(rawSt.trim())
                      ? formatDisplayValue(rawSt, 'auto')
                      : `${rawSt}${sec.attributes.unit_of_measurement ?? ''}`;
                return html`
                  <button
                    type="button"
                    class="info-pill is-clickable"
                    @click=${() => this._openEntityMoreInfo(sec.entity_id)}
                  >
                    <span class="info-pill-left">
                      ${this._renderSiblingIcon(sec)}
                      <span class="info-pill-label">${label}</span>
                    </span>
                    <span class="info-pill-right">
                      <span class="info-pill-val">${val}</span>
                      <svg viewBox="0 0 24 24" class="info-pill-chevron" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.41 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01Z"
                        />
                      </svg>
                    </span>
                  </button>
                `;
              })}
            </div>
          `
        : nothing}

      ${this._renderHistoryChart()}
    `;
  }

  private _renderClimatePopup() {
    const entity = this._entity;
    const mode = String(entity?.state ?? 'off').toLowerCase();
    const isOff = mode === 'off';
    const target = this._climateTarget;
    const current = this._climateCurrent;
    const outdoor = this._outdoorEntity;

    const whole = Math.floor(target);
    const hasHalf = Math.abs(target - whole - 0.5) < 0.05;

    const targetDeg = this._tempToDeg(target);
    const currentDeg = current !== null ? this._tempToDeg(current) : null;
    const cx = 140;
    const cy = 140;
    const r = 114;

    const trackPath = describeArc(cx, cy, r, DIAL_START_DEG, DIAL_START_DEG + DIAL_SWEEP_DEG);
    const thumbPt = polarToCartesian(cx, cy, r, targetDeg);
    const currentPt = currentDeg !== null ? polarToCartesian(cx, cy, r, currentDeg) : null;
    const currentLabelPt = currentDeg !== null ? polarToCartesian(cx, cy, r - 22, currentDeg) : null;

    const hvacModes = Array.isArray(entity?.attributes.hvac_modes)
      ? (entity.attributes.hvac_modes as string[])
      : ['heat', 'cool', 'off'];
    const presetModes = Array.isArray(entity?.attributes.preset_modes)
      ? (entity.attributes.preset_modes as string[])
      : [];
    const fanModes = Array.isArray(entity?.attributes.fan_modes)
      ? (entity.attributes.fan_modes as string[])
      : [];
    const swingModes = Array.isArray(entity?.attributes.swing_modes)
      ? (entity.attributes.swing_modes as string[])
      : [];

    const currentPreset = String(entity?.attributes.preset_mode ?? 'none');
    const currentFan = String(entity?.attributes.fan_mode ?? 'auto');
    const currentSwing = String(entity?.attributes.swing_mode ?? 'off');
    const currentHumidity =
      typeof entity?.attributes.current_humidity === 'number'
        ? `${entity.attributes.current_humidity}%`
        : this._getSiblingSensors().find((s) => s.attributes.device_class === 'humidity')
          ? `${this._getSiblingSensors().find((s) => s.attributes.device_class === 'humidity')!.state}%`
          : null;

    const hasPreset = presetModes.length > 0;
    const hasFan = fanModes.length > 0;
    const hasSwing = swingModes.length > 0;

    const modeTone =
      mode === 'heat' || mode === 'heating'
        ? 'mode-heat'
        : mode === 'cool' || mode === 'cooling'
          ? 'mode-cool'
          : 'mode-off';

    const formatCap = (s: string) =>
      s.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());

    const sheetConfig =
      this._activeSheet === 'mode'
        ? { title: 'Select a mode', options: hvacModes, current: mode, onSelect: (v: string) => this._setClimateMode(v) }
        : this._activeSheet === 'preset'
          ? { title: 'Select preset', options: presetModes, current: currentPreset, onSelect: (v: string) => this._setClimatePreset(v) }
          : this._activeSheet === 'fan'
            ? { title: 'Fan speed', options: fanModes, current: currentFan, onSelect: (v: string) => this._setClimateFan(v) }
            : this._activeSheet === 'swing'
              ? { title: 'Swing mode', options: swingModes, current: currentSwing, onSelect: (v: string) => this._setClimateSwing(v) }
              : null;

    return html`
      <div class="climate-hero ${modeTone} ${this._dialDragging ? 'is-dragging' : ''}">
        <div
          class="dial-container"
          @pointerdown=${this._onDialPointerDown}
          @pointermove=${this._onDialPointerMove}
          @pointerup=${this._onDialPointerUp}
          @pointercancel=${this._onDialPointerUp}
        >
          <svg class="dial-svg" viewBox="0 0 280 280" aria-hidden="true">
            <circle cx=${cx} cy=${cy} r="132" class="dial-bg-circle" />
            <path d=${trackPath} class="dial-arc-track" />

            ${currentPt && currentLabelPt
              ? svg`
                  <circle cx=${currentPt.x} cy=${currentPt.y} r="3.5" class="dial-ambient-dot" />
                  <text
                    x=${currentLabelPt.x}
                    y=${currentLabelPt.y + 4}
                    text-anchor="middle"
                    class="dial-ambient-label"
                  >
                    ${Math.round(current!)}
                  </text>
                `
              : nothing}

            <!-- Interactive Target Thumb: morphs from dot -> elongated radial pill on drag -->
            <g transform="translate(${thumbPt.x.toFixed(2)}, ${thumbPt.y.toFixed(2)}) rotate(${targetDeg.toFixed(1)})">
              <rect
                class="dial-thumb-pill"
                x=${this._dialDragging ? -14 : -5}
                y=${this._dialDragging ? -3.5 : -5}
                width=${this._dialDragging ? 28 : 10}
                height=${this._dialDragging ? 7 : 10}
                rx="5"
              />
            </g>
          </svg>

          <div class="dial-center">
            ${isOff && !this._dialDragging
              ? html`<span class="dial-readout-off">Off</span>`
              : html`
                  <span class="dial-readout-num">
                    ${whole}${hasHalf ? html`<sup>5</sup>` : nothing}
                  </span>
                `}

            <div class="dial-steppers" @pointerdown=${(e: Event) => e.stopPropagation()}>
              <button
                type="button"
                class="dial-step-btn"
                aria-label="Decrease temperature"
                @click=${() => this._setClimateTemp(target - 0.5)}
              >
                −
              </button>
              <button
                type="button"
                class="dial-step-btn"
                aria-label="Increase temperature"
                @click=${() => this._setClimateTemp(target + 0.5)}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="modular-stack">
        <!-- Adaptive Row 1: Mode (full pill if alone, or 2-col with Preset like Daikin) -->
        <div class="${hasPreset ? 'climate-grid-2' : ''}">
          <button
            type="button"
            class="mode-pill ${hasPreset ? 'compact-trait' : ''} ${modeTone}"
            @click=${() => (this._activeSheet = 'mode')}
          >
            <span class="mode-pill-icon">
              ${mode === 'heat'
                ? html`<svg viewBox="0 0 24 24"><path d="M7 19c1.5-2 1.5-4 0-6s-1.5-4 0-6M12 19c1.5-2 1.5-4 0-6s-1.5-4 0-6M17 19c1.5-2 1.5-4 0-6s-1.5-4 0-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>`
                : mode === 'cool'
                  ? html`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M11 2h2v4.17l2.59-2.58L17 5l-4 4v2h2l4-4 1.41 1.41L17.83 11H22v2h-4.17l2.58 2.59L19 17l-4-4h-2v2l4 4-1.41 1.41L13 17.83V22h-2v-4.17l-2.59 2.58L7 19l4-4v-2H9l-4 4-1.41-1.41L6.17 13H2v-2h4.17L3.59 8.41 5 7l4 4h2V9L7 5l1.41-1.41L11 6.17V2Z"/></svg>`
                  : html`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13 3h-2v10h2V3Zm4.83 2.17-1.42 1.42A6.92 6.92 0 0 1 19 12a7 7 0 1 1-11.41-5.41L6.17 5.17A8.93 8.93 0 0 0 3 12a9 9 0 0 0 18 0c0-2.74-1.23-5.18-3.17-6.83Z"/></svg>`}
            </span>
            <span class="mode-pill-text">
              <span class="mode-pill-title">Mode</span>
              <span class="mode-pill-val">${formatCap(mode)}</span>
            </span>
          </button>

          ${hasPreset
            ? html`
                <button
                  type="button"
                  class="trait-card"
                  @click=${() => (this._activeSheet = 'preset')}
                >
                  <span class="mode-pill-text">
                    <span class="mode-pill-title">Preset</span>
                    <span class="mode-pill-val">${formatCap(currentPreset)}</span>
                  </span>
                  <span class="trait-chevron">${CHEVRON_DOWN_SVG}</span>
                </button>
              `
            : nothing}
        </div>

        <!-- Adaptive Row 2: Fan speed & Swing (only rendered if entity exposes them) -->
        ${hasFan || hasSwing
          ? html`
              <div class="${hasFan && hasSwing ? 'climate-grid-2' : ''}">
                ${hasFan
                  ? html`
                      <button
                        type="button"
                        class="trait-card"
                        @click=${() => (this._activeSheet = 'fan')}
                      >
                        <span class="trait-left">
                          <svg viewBox="0 0 24 24" class="mini-svg">
                            <path
                              fill="currentColor"
                              d="M12 11a1 1 0 1 0 1 1 1 1 0 0 0-1-1Zm.5-9C17 2 17.1 5.57 14.73 6.75a3.36 3.36 0 0 0-1.62 2.47 3.17 3.17 0 0 1 1.23.91C18 8.13 22 8.92 22 12.5c0 4.5-3.58 4.6-4.75 2.23a3.44 3.44 0 0 0-2.5-1.62 3.24 3.24 0 0 1-.91 1.23c2 3.69 1.2 7.66-2.38 7.66C7 22 6.89 18.42 9.26 17.24a3.46 3.46 0 0 0 1.62-2.45 3.17 3.17 0 0 1-1.25-.92C5.94 15.85 2 15.07 2 11.5 2 7 5.54 6.89 6.72 9.26a3.39 3.39 0 0 0 2.48 1.61 3.24 3.24 0 0 1 .92-1.22C8.16 5.95 8.92 2 12.5 2Z"
                            />
                          </svg>
                          <span class="mode-pill-text">
                            <span class="mode-pill-title">Fan speed</span>
                            <span class="mode-pill-val">${formatCap(currentFan)}</span>
                          </span>
                        </span>
                        <span class="trait-chevron">${CHEVRON_DOWN_SVG}</span>
                      </button>
                    `
                  : nothing}

                ${hasSwing
                  ? html`
                      <button
                        type="button"
                        class="trait-card"
                        @click=${() => (this._activeSheet = 'swing')}
                      >
                        <span class="mode-pill-text">
                          <span class="mode-pill-title">Swing</span>
                          <span class="mode-pill-val">${formatCap(currentSwing)}</span>
                        </span>
                        <span class="trait-chevron">${CHEVRON_DOWN_SVG}</span>
                      </button>
                    `
                  : nothing}
              </div>
            `
          : nothing}

        ${current !== null || outdoor || currentHumidity
          ? html`
              <div class="telemetry-card">
                ${current !== null
                  ? html`
                      <div class="telemetry-row">
                        <span>Indoor temperature</span>
                        <strong>${current}°</strong>
                      </div>
                    `
                  : nothing}
                ${currentHumidity
                  ? html`
                      <div class="telemetry-row">
                        <span>Humidity</span>
                        <strong>${currentHumidity}</strong>
                      </div>
                    `
                  : nothing}
                ${outdoor
                  ? html`
                      <div class="telemetry-row">
                        <span>${t(this.hass, 'outdoor_temperature')}</span>
                        <strong>${outdoor.state}${outdoor.attributes.unit_of_measurement ?? '°'}</strong>
                      </div>
                    `
                  : nothing}
              </div>
            `
          : nothing}
      </div>

      <!-- Unified Inline Bottom Sheet for Mode / Preset / Fan / Swing -->
      ${sheetConfig
        ? html`
            <div class="mode-sheet-backdrop" @click=${() => (this._activeSheet = null)}>
              <div class="mode-sheet" @click=${(e: Event) => e.stopPropagation()}>
                <div class="mode-sheet-header">
                  <button
                    type="button"
                    class="icon-btn"
                    @click=${() => (this._activeSheet = null)}
                    aria-label="Close selector"
                  >
                    ${CHEVRON_DOWN_SVG}
                  </button>
                  <span>${sheetConfig.title}</span>
                </div>
                <div class="mode-sheet-list">
                  ${sheetConfig.options.map((opt) => {
                    const selected = opt.toLowerCase() === sheetConfig.current.toLowerCase();
                    const cls =
                      this._activeSheet === 'mode'
                        ? opt === 'heat'
                          ? 'mode-heat'
                          : opt === 'cool'
                            ? 'mode-cool'
                            : 'mode-off'
                        : 'mode-off';
                    return html`
                      <button
                        type="button"
                        class="mode-option ${selected ? `selected ${cls}` : ''}"
                        @click=${() => sheetConfig.onSelect(opt)}
                      >
                        <span>${formatCap(opt)}</span>
                        ${selected ? html`<span class="check-mark">✓</span>` : nothing}
                      </button>
                    `;
                  })}
                </div>
              </div>
            </div>
          `
        : nothing}
    `;
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
          this._triggerRemoteKey(dir);
          navigator.vibrate?.(8);
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
        this._triggerRemoteKey(dir);
        navigator.vibrate?.(12);
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
      this._triggerRemoteKey('dpad_center');
      navigator.vibrate?.(10);
      this._padTapPulse = true;
      if (this._padPulseTimer !== null) window.clearTimeout(this._padPulseTimer);
      this._padPulseTimer = window.setTimeout(() => {
        this._padTapPulse = false;
        this._padPulseTimer = null;
      }, 180);
    }
  };

  private _triggerRemoteKey(key: RemoteActionKey): void {
    if (!this.hass || !this._config) return;
    executeRemoteCommand(
      this.hass,
      this._config.entity,
      key,
      this._config.remote_buttons,
      this._config.remote_device,
      this._config.remote_entity,
    );
  }

  private _renderRemotePopup() {
    const media = this._mediaEntity;
    const targetEnt = media ?? this._entity;
    const statusEnt = this._statusEntity ?? targetEnt;
    const rawState = String(statusEnt?.state ?? '').toLowerCase();
    const hasPowerState =
      Boolean(rawState) && rawState !== 'unavailable' && rawState !== 'unknown';
    const isPowerOn = hasPowerState && rawState !== 'off' && rawState !== 'standby';

    const rawMuted = targetEnt?.attributes.is_volume_muted;
    const hasMuteState = typeof rawMuted === 'boolean';
    const isMuted = rawMuted === true;

    const mediaState = String(media?.state ?? '').toLowerCase();
    const isPlaying = mediaState === 'playing';
    const isPaused = mediaState === 'paused';

    const currentSource = String(targetEnt?.attributes.source ?? '').trim();
    const sourceList = Array.isArray(targetEnt?.attributes.source_list)
      ? Array.from(
          new Set(
            (targetEnt!.attributes.source_list as unknown[])
              .map((s) => String(s ?? '').trim())
              .filter(Boolean),
          ),
        )
      : [];
    const sourceLabel = currentSource || t(this.hass, 'sources');

    const currentSoundMode = String(targetEnt?.attributes.sound_mode ?? '').trim();
    const soundModeList = Array.isArray(targetEnt?.attributes.sound_mode_list)
      ? Array.from(
          new Set(
            (targetEnt!.attributes.sound_mode_list as unknown[])
              .map((s) => String(s ?? '').trim())
              .filter(Boolean),
          ),
        )
      : [];

    const showNav = this._config?.remote_show_nav ?? Boolean(media);

    return html`
      ${showNav
        ? html`
            <!-- Compact Google Home Gesture Touchpad -->
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

            <!-- 3 Essential Navigation Buttons: Back | Home | Assist -->
            <div class="remote-essential-row">
              <button
                type="button"
                class="essential-btn"
                aria-label="Back"
                @click=${() => this._triggerRemoteKey('back')}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z" />
                </svg>
              </button>

              <button
                type="button"
                class="essential-btn is-home"
                aria-label="Home"
                @click=${() => this._triggerRemoteKey('home')}
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
                @click=${() => this._triggerRemoteKey('assist')}
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

      <div class="remote-hero">
        <div class="rocker-pill">
          <button
            type="button"
            class="rocker-half"
            aria-label="Volume up"
            @click=${() => this._triggerRemoteKey('volume_up')}
          >
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02ZM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77Z"/></svg>
          </button>
          <span class="rocker-divider"></span>
          <button
            type="button"
            class="rocker-half"
            aria-label="Volume down"
            @click=${() => this._triggerRemoteKey('volume_down')}
          >
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M18.5 12A4.5 4.5 0 0 0 16 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02ZM5 9v6h4l5 5V4L9 9H5Z"/></svg>
          </button>
        </div>
      </div>

      <div class="modular-stack">
        <!-- Segmented M3 Pill: Unmute | Mute (highlights active state when reported) -->
        <div class="split-pill ${hasMuteState ? 'has-state' : ''}" role="group" aria-label="Audio">
          ${hasMuteState
            ? html`<span class="split-indicator ${isMuted ? 'is-right' : 'is-left'}" aria-hidden="true"></span>`
            : nothing}
          <button
            type="button"
            class="split-half ${hasMuteState && !isMuted ? 'is-selected' : ''}"
            aria-pressed=${hasMuteState ? String(!isMuted) : 'false'}
            @click=${() => this._triggerRemoteKey('unmute')}
          >
            ${t(this.hass, 'unmute')}
          </button>
          ${!hasMuteState ? html`<span class="split-vdivider"></span>` : nothing}
          <button
            type="button"
            class="split-half ${hasMuteState && isMuted ? 'is-selected' : ''}"
            aria-pressed=${hasMuteState ? String(isMuted) : 'false'}
            @click=${() => this._triggerRemoteKey('mute')}
          >
            ${t(this.hass, 'mute')}
          </button>
        </div>

        <!-- Segmented M3 Pill: On | Off (highlights active entity state like Light Control) -->
        <div class="split-pill ${hasPowerState ? 'has-state' : ''}" role="group" aria-label="Power">
          ${hasPowerState
            ? html`<span class="split-indicator ${isPowerOn ? 'is-left' : 'is-right'}" aria-hidden="true"></span>`
            : nothing}
          <button
            type="button"
            class="split-half ${hasPowerState && isPowerOn ? 'is-selected' : ''}"
            aria-pressed=${hasPowerState ? String(isPowerOn) : 'false'}
            @click=${() => this._triggerRemoteKey('power_on')}
          >
            ${t(this.hass, 'on')}
          </button>
          ${!hasPowerState ? html`<span class="split-vdivider"></span>` : nothing}
          <button
            type="button"
            class="split-half ${hasPowerState && !isPowerOn ? 'is-selected' : ''}"
            aria-pressed=${hasPowerState ? String(!isPowerOn) : 'false'}
            @click=${() => this._triggerRemoteKey('power_off')}
          >
            ${t(this.hass, 'off')}
          </button>
        </div>

        <!-- M3 Expressive Transport Row (Crisp SVGs + Shape Morphing Play/Pause) -->
        <div class="transport-row">
          <button
            type="button"
            class="transport-icon is-prev"
            aria-label=${t(this.hass, 'previous')}
            @click=${() => this._triggerRemoteKey('prev')}
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
            @click=${() => this._triggerRemoteKey('play')}
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
            @click=${() => this._triggerRemoteKey('pause')}
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
            @click=${() => this._triggerRemoteKey('next')}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M16 6h2v12h-2V6ZM6 18l8.5-6L6 6v12Z" />
            </svg>
          </button>
        </div>

        <div class="channel-pill">
          <button
            type="button"
            class="channel-btn"
            aria-label="Channel down"
            @click=${() => this._triggerRemoteKey('ch_down')}
          >
            ${CHEVRON_DOWN_SVG}
          </button>
          <span class="channel-label">CH</span>
          <button
            type="button"
            class="channel-btn"
            aria-label="Channel up"
            @click=${() => this._triggerRemoteKey('ch_up')}
          >
            ${CHEVRON_UP_SVG}
          </button>
        </div>

        <button
          type="button"
          class="secondary-action-card"
          @click=${() => {
            if (sourceList.length > 0 && media) {
              this._remoteSelectorSheet = {
                title: t(this.hass, 'sources'),
                options: sourceList,
                current: currentSource,
                onSelect: (src: string) => {
                  this.hass?.callService('media_player', 'select_source', {
                    entity_id: media.entity_id,
                    source: src,
                  });
                },
              };
            } else if (targetEnt) {
              this._openMoreInfo(targetEnt.entity_id);
            }
          }}
        >
          <span>${sourceLabel}</span>
          <span class="trait-chevron">${CHEVRON_DOWN_SVG}</span>
        </button>

        ${soundModeList.length > 0 && media
          ? html`
              <button
                type="button"
                class="secondary-action-card"
                @click=${() => {
                  this._remoteSelectorSheet = {
                    title: 'Sound mode',
                    options: soundModeList,
                    current: currentSoundMode,
                    onSelect: (mode: string) => {
                      this.hass?.callService('media_player', 'select_sound_mode', {
                        entity_id: media.entity_id,
                        sound_mode: mode,
                      });
                    },
                  };
                }}
              >
                <span>${currentSoundMode || 'Sound mode'}</span>
                <span class="trait-chevron">${CHEVRON_DOWN_SVG}</span>
              </button>
            `
          : nothing}

        ${renderRemoteCustomControls(
          this.hass,
          this._config!.entity,
          this._config?.remote_custom_controls,
          this._config?.remote_buttons,
          this._config?.remote_device,
          (req) => {
            this._remoteSelectorSheet = req;
          },
          (eid) => this._openMoreInfo(eid),
          this._config?.remote_entity,
        )}
      </div>

      ${this._remoteSelectorSheet
        ? html`
            <div class="mode-sheet-backdrop" @click=${() => (this._remoteSelectorSheet = null)}>
              <div class="mode-sheet" @click=${(e: Event) => e.stopPropagation()}>
                <div class="mode-sheet-header">
                  <button
                    type="button"
                    class="icon-btn"
                    @click=${() => (this._remoteSelectorSheet = null)}
                    aria-label=${t(this.hass, 'close')}
                  >
                    ${CHEVRON_DOWN_SVG}
                  </button>
                  <span>${this._remoteSelectorSheet.title}</span>
                </div>
                <div class="mode-sheet-list">
                  ${this._remoteSelectorSheet.options.map((opt) => {
                    const selected =
                      opt.toLowerCase() === this._remoteSelectorSheet!.current.toLowerCase();
                    return html`
                      <button
                        type="button"
                        class="mode-option ${selected ? 'selected mode-off' : ''}"
                        @click=${() => {
                          this._remoteSelectorSheet?.onSelect(opt);
                          this._remoteSelectorSheet = null;
                        }}
                      >
                        <span>${opt}</span>
                        ${selected ? html`<span class="check-mark">✓</span>` : nothing}
                      </button>
                    `;
                  })}
                </div>
              </div>
            </div>
          `
        : nothing}
    `;
  }

  private _openMediaControls(entityId: string): void {
    if (this._config?.media_controls_action === 'more-info') {
      this._openMoreInfo(entityId);
      return;
    }
    this.closePopup();
    window.setTimeout(() => {
      void this._mediaPopupEl?.open(undefined, false);
    }, 220);
  }

  private _renderMediaPopup() {
    const entity = this._mediaEntity;
    const isIdle = !entity || entity.state === 'idle' || entity.state === 'off';
    const vol = this._mediaVolumePct;

    return html`
      ${entity
        ? html`
            <m3e-media-player-card
              class="embedded-media-player"
              .hass=${this.hass}
              .config=${{
                type: 'custom:m3e-media-player-card',
                entity: entity.entity_id,
                dynamic_color: true,
                show_device_chip: false,
                tap_action: 'none',
              }}
              @click=${() => this._openMediaControls(entity.entity_id)}
            ></m3e-media-player-card>
          `
        : nothing}

      <div class="modular-stack">
        <!-- Shape Coding: Full Pill (9999px) for Active Primary Volume Slider -->
        <div
          class="volume-pill ${this._volDragging ? 'is-dragging' : ''}"
          style="--vol-pct: ${vol}%;"
          role="slider"
          tabindex="0"
          aria-label="Volume"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${vol}
          @pointerdown=${this._onVolPointerDown}
          @pointermove=${this._onVolPointerMove}
          @pointerup=${this._onVolPointerUp}
          @pointercancel=${this._onVolPointerUp}
        >
          <div class="volume-pill-fill"></div>
          <div class="volume-pill-content">
            <svg viewBox="0 0 24 24" class="mini-svg">
              <path
                fill="currentColor"
                d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02Z"
              />
            </svg>
            <span>${vol}%</span>
          </div>
        </div>

        <!-- Primary action pill (Stop when active, Turn on when off) -->
        ${!isIdle
          ? html`
              <button
                type="button"
                class="primary-action-pill"
                @click=${() => this._callMediaService('media_stop')}
              >
                ${t(this.hass, 'stop_casting')}
              </button>
            `
          : entity?.state === 'off'
            ? html`
                <button
                  type="button"
                  class="primary-action-pill"
                  @click=${() => this._callMediaService('turn_on')}
                >
                  ${t(this.hass, 'turn_on')}
                </button>
              `
            : nothing}

        <!-- Secondary action: opens M3E Now Playing popup by default (or native HA More Info if configured) -->
        ${entity
          ? html`
              <button
                type="button"
                class="secondary-action-card"
                @click=${() => this._openMediaControls(entity.entity_id)}
              >
                <span>${t(this.hass, 'media_controls')}</span>
                <span>↗</span>
              </button>
            `
          : nothing}
      </div>
    `;
  }

  private _selectOption(option: string): void {
    if (!this.hass || !this._config?.entity) return;
    const domain = this._config.entity.split('.')[0];
    this.hass.callService(domain, 'select_option', {
      entity_id: this._config.entity,
      option,
    });
    window.setTimeout(() => this.closePopup(), 160);
  }

  private _renderSelectorOptionIcon(option: string, filled: boolean) {
    const lower = option.toLowerCase();

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

    if (lower.includes('home') || lower.includes('casa') || lower.includes('present')) {
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

    return filled
      ? html`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-1.2 14.2-3.5-3.5 1.4-1.4 2.1 2.1 4.5-4.5 1.4 1.4-5.9 5.9Z"
            />
          </svg>
        `
      : html`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h10v2H4v-2Z"
            />
          </svg>
        `;
  }

  private _togglePowerStripAll(turnOn: boolean): void {
    if (!this.hass) return;
    const outlets = this._getPowerStripEntities();
    for (const ent of outlets) {
      if (ent.state === 'unavailable' || ent.state === 'unknown') continue;
      if ((ent.state === 'on') === turnOn) continue;
      const domain = ent.entity_id.split('.')[0];
      this.hass.callService(domain, turnOn ? 'turn_on' : 'turn_off', {
        entity_id: ent.entity_id,
      });
    }
  }

  private _renderPowerStripPopup() {
    const outlets = this._getPowerStripEntities();
    const outletIds = new Set(outlets.map((o) => o.entity_id));
    const telemetry = this._getSiblingSensors().filter((s) => !outletIds.has(s.entity_id));

    return html`
      ${outlets.length === 0
        ? html`
            <div class="selector-empty">
              Nessuna presa rilevata. Seleziona le entità della multipresa nelle impostazioni della
              card.
            </div>
          `
        : html`
            <div class="power-strip-grid">
              ${outlets.map((ent) => {
                const isUnavailable = ent.state === 'unavailable' || ent.state === 'unknown';
                const isOn = ent.state === 'on';
                const label = this._cleanSiblingLabel(ent);
                const sub = isUnavailable ? 'Offline' : isOn ? 'On' : 'Off';

                return html`
                  <button
                    type="button"
                    class="ps-tile ${isOn ? 'is-on' : 'is-off'} ${isUnavailable ? 'is-unavailable' : ''}"
                    role="switch"
                    aria-checked=${String(isOn)}
                    ?disabled=${isUnavailable}
                    @click=${() => this._togglePowerEntity(ent)}
                    @contextmenu=${(e: MouseEvent) => {
                      e.preventDefault();
                      this._openEntityMoreInfo(ent.entity_id);
                    }}
                  >
                    <span class="ps-tile-icon" aria-hidden="true">
                      ${renderM3EntityIcon(ent, isOn)}
                    </span>
                    <span class="ps-tile-meta">
                      <span class="ps-tile-title">${label}</span>
                      <span class="ps-tile-sub">${sub}</span>
                    </span>
                  </button>
                `;
              })}
            </div>
          `}
      ${telemetry.length > 0
        ? html`
            <div class="modular-stack">
              ${telemetry.map((sec) => {
                const label = this._cleanSiblingLabel(sec);
                const val = `${sec.state}${sec.attributes.unit_of_measurement ?? ''}`;
                return html`
                  <button
                    type="button"
                    class="info-pill is-clickable"
                    @click=${() => this._openEntityMoreInfo(sec.entity_id)}
                  >
                    <span class="info-pill-left">
                      ${this._renderSiblingIcon(sec)}
                      <span class="info-pill-label">${label}</span>
                    </span>
                    <span class="info-pill-right">
                      <span class="info-pill-val">${val}</span>
                      <svg viewBox="0 0 24 24" class="info-pill-chevron" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.41 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01Z"
                        />
                      </svg>
                    </span>
                  </button>
                `;
              })}
            </div>
          `
        : nothing}
    `;
  }

  private _renderSelectorPopup() {
    const entity = this._entity;
    const rawOptions = entity?.attributes.options;
    const options = Array.isArray(rawOptions) ? rawOptions.map(String) : [];
    const current = entity?.state ?? '';

    if (options.length === 0) {
      return html`
        <div class="selector-empty">
          Nessuna opzione disponibile per questa entità. Collega un <code>input_select</code> o
          <code>select</code>.
        </div>
      `;
    }

    return html`
      <div class="selector-list" role="radiogroup" aria-label="Seleziona opzione">
        ${options.map((opt) => {
          const selected = opt === current;
          return html`
            <button
              type="button"
              class="selector-row ${selected ? 'is-selected' : ''}"
              role="radio"
              aria-checked=${String(selected)}
              @click=${() => this._selectOption(opt)}
            >
              <span class="selector-row-icon">
                ${this._renderSelectorOptionIcon(opt, selected)}
              </span>
              <span class="selector-row-label">${opt}</span>
              <span class="m3-radio ${selected ? 'checked' : ''}" aria-hidden="true">
                <span class="m3-radio-dot"></span>
              </span>
            </button>
          `;
        })}
      </div>
    `;
  }

  private get _entityPictureUrl(): string {
    if (!this._config?.show_entity_picture) return '';
    const ent = this._entity;
    if (!ent) return '';
    const st = String(ent.state ?? '').toLowerCase();
    if (st === 'unavailable' || st === 'unknown') return '';
    if (ent.entity_id.startsWith('media_player.') && (st === 'off' || st === 'idle')) {
      return '';
    }
    return String(
      ent.attributes.entity_picture_local || ent.attributes.entity_picture || '',
    ).trim();
  }

  protected updated(): void {
    const art = this._entityPictureUrl;
    if (art !== this._lastArtUrl) {
      this._lastArtUrl = art;
      if (art) {
        void extractArtworkPalette(art).then((pal) => {
          if (this._lastArtUrl === art) {
            this._artPalette = pal;
          }
        });
      } else {
        this._artPalette = null;
      }
    }
  }

  /* =========================================================================
     MAIN RENDER
     ========================================================================= */
  protected render() {
    if (!this._config) return nothing;
    const entity = this._entity;
    const name = resolveEntityName(this.hass, entity, this._config.name, this._config.entity);
    const isActive = this._isActive;
    // Only use custom icon if explicitly configured in settings; otherwise standard Google Home SVG
    const icon = isActive
      ? this._config.icon_active?.trim() || undefined
      : this._config.icon_inactive?.trim() || this._config.icon_active?.trim() || undefined;
    const popupType = this._resolvedPopupType;
    const hasAffordance =
      this._config.tap_action === 'navigate' ||
      this._config.tap_action === 'more-info' ||
      (this._config.tap_action !== 'toggle' &&
        this._config.tap_action !== 'none' &&
        popupType !== 'none');

    const styleClass = `style-${this._config.card_style ?? 'default'}`;
    const lastChanged = this._popupOpen
      ? formatLastChanged(this._statusEntity?.last_changed)
      : null;

    const features = this._config.features ?? [];
    const hasFeatures = features.length > 0;
    const featuresPos = this._config.features_position ?? 'bottom';
    const hideState = Boolean(this._config.hide_state);
    const stateContentVal = !hideState
      ? resolveStateContent(this.hass, entity, this._config.state_content, this._stateLabel)
      : null;
    const displaySubtitle = hideState ? '' : (stateContentVal ?? this._stateLabel);

    const artUrl = this._entityPictureUrl;
    const hasArt = Boolean(artUrl);
    const isDark = this.hass?.themes?.darkMode !== false;
    const artStyle =
      hasArt && this._artPalette
        ? `--art-bg: ${isDark ? this._artPalette.containerDark : this._artPalette.containerLight}; --art-fg: ${isDark ? this._artPalette.onContainerDark : this._artPalette.onContainerLight};`
        : '';

    return html`
      ${this.popupOnly
        ? nothing
        : html`
            <ha-card
              class="status-tile ${styleClass} ${isActive ? 'is-active' : 'is-inactive'} ${this._pressed ? 'is-pressed' : ''} ${this._isUnavailable ? 'is-unavailable' : ''} ${hasFeatures ? `has-features features-${featuresPos}` : ''} ${hasArt ? 'has-entity-picture' : ''}"
              style=${artStyle}
              role="button"
              tabindex="0"
              aria-label="${name}${displaySubtitle ? `, ${displaySubtitle}` : ''}"
              @pointerdown=${this._onTilePointerDown}
              @pointerup=${this._onTilePointerUp}
              @pointerleave=${this._onTilePointerCancel}
              @pointercancel=${this._onTilePointerCancel}
              @click=${this._onTileClick}
              @contextmenu=${(e: MouseEvent) => {
                e.preventDefault();
                this._handleHoldAction();
              }}
              @keydown=${(e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  this._onTileClick();
                }
              }}
            >
              ${hasArt
                ? html`
                    <div class="entity-picture-backdrop" aria-hidden="true">
                      <img class="entity-picture-img" src=${artUrl} alt="" loading="lazy" />
                    </div>
                  `
                : nothing}
              <div class="state-layer" aria-hidden="true"></div>
              <div class="tile-inner">
                ${hasArt ? nothing : html`<span class="tile-icon">${this._renderEntityIcon(icon)}</span>`}
                <div class="tile-meta">
                  <span class="tile-title">${name}</span>
                  ${displaySubtitle
                    ? html`<span class="tile-subtitle">${displaySubtitle}</span>`
                    : nothing}
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
                  : hasAffordance
                    ? html`
                        <span class="tile-chevron" aria-hidden="true">
                          <svg viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.41 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01Z"
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
                      @pointerup=${stopFeatureEventPropagation}
                      @contextmenu=${stopFeatureEventPropagation}
                    >
                      <hui-card-features
                        .hass=${this.hass}
                        .context=${{ entity_id: this._config.entity }}
                        .stateObj=${this._entity}
                        .features=${features}
                        .position=${featuresPos}
                      ></hui-card-features>
                    </div>
                  `
                : nothing}
            </ha-card>
          `}

      <dialog
        class="status-dialog"
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
          ? (() => {
              const isPowerStrip = popupType === 'power_strip';
              const powerEnt =
                popupType === 'sensor' || popupType === 'custom'
                  ? this._toggleablePowerEntity
                  : undefined;
              const powerStripOutlets = isPowerStrip ? this._getPowerStripEntities() : [];
              const hasHeaderSwitch = Boolean(powerEnt) || (isPowerStrip && powerStripOutlets.length > 0);
              const powerOn = isPowerStrip
                ? powerStripOutlets.some((o) => o.state === 'on')
                : powerEnt?.state === 'on';
              const closeBtn = html`
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
              `;

              return html`
                <div class="dialog-surface">
                  <header class="dialog-header">
                    ${closeBtn}
                    <div class="dialog-title-wrap">
                      <span class="dialog-title">${name}</span>
                      ${lastChanged
                        ? html`<span class="dialog-last-changed">${lastChanged}</span>`
                        : nothing}
                    </div>
                    ${hasHeaderSwitch
                      ? html`
                          <button
                            type="button"
                            class="m3-header-switch ${powerOn ? 'is-on' : ''}"
                            role="switch"
                            aria-checked=${String(powerOn)}
                            aria-label=${powerOn ? 'Spegni' : 'Accendi'}
                            @click=${() =>
                              isPowerStrip
                                ? this._togglePowerStripAll(!powerOn)
                                : powerEnt && this._togglePowerEntity(powerEnt)}
                          >
                            <span class="m3-header-switch-thumb" aria-hidden="true"></span>
                          </button>
                        `
                      : popupType === 'climate' || popupType === 'media'
                        ? html`
                            <button
                              type="button"
                              class="icon-btn"
                              aria-label=${t(this.hass, 'history')}
                              title=${t(this.hass, 'history_tooltip')}
                              @click=${() =>
                                this._openMoreInfo(
                                  popupType === 'media' && this._mediaEntity
                                    ? this._mediaEntity.entity_id
                                    : this._config!.entity,
                                  'history',
                                )}
                            >
                              <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                  fill="currentColor"
                                  d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18Zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12Z"
                                />
                              </svg>
                            </button>
                          `
                        : nothing}
                  </header>

                  ${popupType === 'power_strip'
                    ? this._renderPowerStripPopup()
                    : popupType === 'selector'
                      ? this._renderSelectorPopup()
                      : popupType === 'sensor' || popupType === 'custom'
                        ? this._renderSensorPopup(icon)
                        : popupType === 'climate'
                          ? this._renderClimatePopup()
                          : popupType === 'remote'
                            ? this._renderRemotePopup()
                            : this._renderMediaPopup()}
                </div>
              `;
            })()
          : nothing}
      </dialog>

      ${popupType === 'media' && this._mediaEntity
        ? html`
            <m3e-media-popup
              .hass=${this.hass}
              .entityId=${this._mediaEntity.entity_id}
            ></m3e-media-popup>
          `
        : nothing}
    `;
  }

  static styles = [
    m3eBaseStyles,
    remoteCustomControlStyles,
    css`

      .embedded-media-player {
        display: block;
        width: 100%;
        height: auto;
        margin-bottom: 14px;
      }

      /* Native HA Card Features Sub-Row */
      .status-tile.has-features.features-bottom {
        display: flex;
        flex-direction: column;
      }

      .status-tile.has-features.features-bottom .tile-inner {
        height: auto;
        min-height: 68px;
      }

      .status-tile.has-features.features-inline {
        display: flex;
        align-items: center;
      }

      .status-tile.has-features.features-inline .tile-inner {
        flex: 1 1 50%;
        min-width: 0;
      }

      .features-wrap {
        position: relative;
        z-index: 2;
        --feature-border-radius: 18px;
        --feature-color: var(--md-sys-color-primary, #4c5c92);
      }

      .status-tile.features-bottom .features-wrap {
        padding: 0 12px 12px;
      }

      .status-tile.features-inline .features-wrap {
        flex: 1 1 50%;
        min-width: 0;
        padding: 8px 12px 8px 0;
      }

      /* Left-side 1:1 radially dissolving Entity Picture with M3E artwork-derived tonal surface */
      ha-card.status-tile.has-entity-picture,
      ha-card.status-tile.has-entity-picture.is-active,
      ha-card.status-tile.has-entity-picture.is-inactive {
        background: var(
          --art-bg,
          var(--md-sys-color-primary-container, var(--ha-card-background, #24252d))
        );
        color: var(--art-fg, var(--md-sys-color-on-primary-container, #e3e2e6));
      }

      ha-card.status-tile.has-entity-picture .tile-title {
        color: var(--art-fg, var(--md-sys-color-on-primary-container, #e3e2e6));
        text-shadow: 0 1px 10px
          color-mix(
            in srgb,
            var(--art-bg, var(--md-sys-color-primary-container, #24252d)) 72%,
            transparent
          );
      }

      ha-card.status-tile.has-entity-picture .tile-subtitle,
      ha-card.status-tile.has-entity-picture .tile-chevron {
        color: color-mix(
          in srgb,
          var(--art-fg, var(--md-sys-color-on-primary-container, #e3e2e6)) 88%,
          transparent
        );
        text-shadow: 0 1px 8px
          color-mix(
            in srgb,
            var(--art-bg, var(--md-sys-color-primary-container, #24252d)) 68%,
            transparent
          );
      }

      ha-card.status-tile.has-entity-picture .tile-inner {
        padding-inline-start: 16px;
      }

      .entity-picture-backdrop {
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        height: 100%;
        width: 164px;
        max-width: 72%;
        pointer-events: none;
        overflow: hidden;
        z-index: 0;
        -webkit-mask-image: linear-gradient(
          to right,
          rgba(0, 0, 0, 1) 0%,
          rgba(0, 0, 0, 0.94) 28%,
          rgba(0, 0, 0, 0.74) 48%,
          rgba(0, 0, 0, 0.44) 66%,
          rgba(0, 0, 0, 0.18) 82%,
          rgba(0, 0, 0, 0.05) 92%,
          rgba(0, 0, 0, 0) 100%
        );
        mask-image: linear-gradient(
          to right,
          rgba(0, 0, 0, 1) 0%,
          rgba(0, 0, 0, 0.94) 28%,
          rgba(0, 0, 0, 0.74) 48%,
          rgba(0, 0, 0, 0.44) 66%,
          rgba(0, 0, 0, 0.18) 82%,
          rgba(0, 0, 0, 0.05) 92%,
          rgba(0, 0, 0, 0) 100%
        );
      }

      .entity-picture-backdrop::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to right,
          color-mix(
            in srgb,
            var(--art-bg, var(--md-sys-color-primary-container, #24252d)) 46%,
            transparent
          ) 0%,
          color-mix(
            in srgb,
            var(--art-bg, var(--md-sys-color-primary-container, #24252d)) 30%,
            transparent
          ) 58%,
          transparent 100%
        );
        pointer-events: none;
      }

      .status-tile.has-features.features-bottom .entity-picture-backdrop {
        height: 106px;
        bottom: auto;
        -webkit-mask-image:
          linear-gradient(
            to right,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.94) 28%,
            rgba(0, 0, 0, 0.74) 48%,
            rgba(0, 0, 0, 0.44) 66%,
            rgba(0, 0, 0, 0.18) 82%,
            rgba(0, 0, 0, 0.05) 92%,
            rgba(0, 0, 0, 0) 100%
          ),
          linear-gradient(
            to bottom,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.94) 36%,
            rgba(0, 0, 0, 0.7) 56%,
            rgba(0, 0, 0, 0.36) 74%,
            rgba(0, 0, 0, 0.12) 88%,
            rgba(0, 0, 0, 0) 100%
          ),
          radial-gradient(
            ellipse 108% 108% at 0% 0%,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.96) 44%,
            rgba(0, 0, 0, 0.62) 68%,
            rgba(0, 0, 0, 0.22) 86%,
            rgba(0, 0, 0, 0) 100%
          );
        -webkit-mask-composite: source-in, source-in;
        mask-image:
          linear-gradient(
            to right,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.94) 28%,
            rgba(0, 0, 0, 0.74) 48%,
            rgba(0, 0, 0, 0.44) 66%,
            rgba(0, 0, 0, 0.18) 82%,
            rgba(0, 0, 0, 0.05) 92%,
            rgba(0, 0, 0, 0) 100%
          ),
          linear-gradient(
            to bottom,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.94) 36%,
            rgba(0, 0, 0, 0.7) 56%,
            rgba(0, 0, 0, 0.36) 74%,
            rgba(0, 0, 0, 0.12) 88%,
            rgba(0, 0, 0, 0) 100%
          ),
          radial-gradient(
            ellipse 108% 108% at 0% 0%,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.96) 44%,
            rgba(0, 0, 0, 0.62) 68%,
            rgba(0, 0, 0, 0.22) 86%,
            rgba(0, 0, 0, 0) 100%
          );
        mask-composite: intersect;
      }

      .entity-picture-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        display: block;
      }

      /* =====================================================================
         1. COMPACT DASHBOARD TILE (Shape Coding: Pill = Active, 28px = Off)
         ===================================================================== */
      .status-tile {
        height: 100%;
        min-height: 84px;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        outline: none;
        transition:
          border-radius var(--m3e-spring-bouncy),
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-default),
          border-color var(--m3e-spring-effects-default);
      }

      /* Uniform 28px form factor matching m3e-light-card (tonal primary fill indicates active) */
      .status-tile.is-active {
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .status-tile.is-pressed {
        transform: scale(0.965);
      }

      .status-tile:focus-visible {
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

      .status-tile:hover .state-layer {
        opacity: 0.06;
      }

      .status-tile.is-pressed .state-layer {
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

      .status-tile.is-active .tile-icon {
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
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .status-tile.is-active .tile-title,
      .status-tile.is-active .tile-subtitle,
      .status-tile.is-active .tile-chevron {
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .tile-chevron {
        flex: 0 0 auto;
        width: 18px;
        height: 18px;
        margin-inline-start: -8px;
        display: grid;
        place-items: center;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        opacity: 0.78;
      }

      .tile-chevron svg {
        width: 18px;
        height: 18px;
      }

      /* =====================================================================
         2. MODULAR EXPANDED POPUP SHELL
         ===================================================================== */
      dialog.status-dialog {
        margin: auto;
        padding: 0;
        border: 0;
        background: transparent;
        overflow: visible;
        max-width: min(440px, calc(100vw - 24px));
        max-height: calc(100dvh - 24px);
        width: 100%;
        overscroll-behavior: contain;
        touch-action: none;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      dialog.status-dialog::backdrop {
        background: color-mix(in srgb, var(--md-sys-color-scrim, #000000) 58%, transparent);
      }

      .dialog-surface {
        position: relative;
        overflow-y: auto;
        overflow-x: hidden;
        overscroll-behavior: contain;
        touch-action: pan-y;
        max-height: calc(100dvh - 24px);
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        background: var(--md-sys-color-surface, #131316);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        border-radius: 32px;
        padding: 20px 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 18px;
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.36);
      }

      @media (max-width: 600px) {
        dialog.status-dialog {
          margin: auto 0 0 0;
          max-width: 100vw;
          max-height: 94dvh;
          border-radius: 28px 28px 0 0;
          overflow: hidden;
        }

        .dialog-surface {
          border-radius: 28px 28px 0 0;
          max-height: 94dvh;
          box-shadow: none;
          padding: 18px 16px calc(24px + env(safe-area-inset-bottom, 0px));
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
        font-size: 20px;
      }

      .icon-btn:hover {
        background: color-mix(in srgb, currentColor 8%, transparent);
      }

      .icon-btn svg {
        width: 22px;
        height: 22px;
      }

      /* Material 3 Expressive Header Toggle Switch (for outlet / light in sensor popup) */
      .m3-header-switch {
        position: relative;
        flex: 0 0 52px;
        width: 52px;
        height: 32px;
        padding: 0;
        border-radius: 9999px;
        border: 2px solid var(--md-sys-color-outline, #8e9099);
        background: var(--md-sys-color-surface-container-highest, #2f313a);
        cursor: pointer;
        display: flex;
        align-items: center;
        transition:
          background-color var(--m3e-spring-effects-fast),
          border-color var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
        -webkit-tap-highlight-color: transparent;
      }

      .m3-header-switch.is-on {
        background: var(--md-sys-color-primary, #bac3ff);
        border-color: var(--md-sys-color-primary, #bac3ff);
      }

      .m3-header-switch:active {
        transform: scale(0.95);
      }

      .m3-header-switch-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--md-sys-color-outline, #8e9099);
        transform: translateX(6px);
        transition:
          transform var(--m3e-spring-bouncy),
          width var(--m3e-spring-spatial-fast),
          height var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-fast);
      }

      .m3-header-switch.is-on .m3-header-switch-thumb {
        width: 24px;
        height: 24px;
        background: var(--md-sys-color-on-primary, #1f2a56);
        transform: translateX(22px);
      }

      .modular-stack {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .mini-svg {
        width: 20px;
        height: 20px;
        flex: 0 0 auto;
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

      /* =====================================================================
         VARIANT 1: SENSOR HERO + TELEMETRY PILL
         ===================================================================== */
      .sensor-hero {
        display: flex;
        justify-content: center;
        padding: 12px 0;
      }

      .sensor-ring {
        width: clamp(190px, 52vw, 236px);
        height: clamp(190px, 52vw, 236px);
        border-radius: 50%;
        border: 22px solid var(--md-sys-color-surface-container-high, #24252d);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: border-color var(--m3e-spring-effects-default);
      }

      .sensor-ring.is-active {
        border-color: var(--md-sys-color-primary-container, #364067);
      }

      .sensor-ring-icon {
        width: 28px;
        height: 28px;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      .sensor-ring-icon svg,
      .sensor-ring-icon ha-icon {
        width: 28px;
        height: 28px;
      }

      .sensor-ring-state {
        font-size: 22px;
        font-weight: 500;
      }

      .sensor-ring-sub {
        font-size: 13px;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      .info-pill {
        width: 100%;
        border: 0;
        font: inherit;
        text-align: left;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 18px 20px;
        border-radius: 24px;
        background: var(--md-sys-color-surface-container-high, #24252d);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font-size: 15px;
        transition:
          background-color var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
      }

      .info-pill.is-clickable {
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
      }

      .info-pill.is-clickable:hover {
        background: var(--md-sys-color-surface-container-highest, #2f313a);
      }

      .info-pill.is-clickable:active {
        transform: scale(0.98);
      }

      .info-pill-left {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
        line-height: 20px;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      .info-pill-label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .info-pill-right {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
      }

      .info-pill-val {
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }

      .info-pill-chevron {
        width: 18px;
        height: 18px;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        opacity: 0.7;
        flex-shrink: 0;
      }

      /* =====================================================================
         VARIANT 2: CLIMATE DIAL + RADIAL THUMB MORPH + MODE SHEET
         ===================================================================== */
      .climate-hero {
        display: flex;
        justify-content: center;
        --climate-accent: var(--md-sys-color-primary, #bac3ff);
      }

      .climate-hero.mode-heat {
        --climate-accent: #f3b59b;
      }

      .climate-hero.mode-cool {
        --climate-accent: #9ecaff;
      }

      .dial-container {
        position: relative;
        width: clamp(216px, 60vw, 264px);
        height: clamp(216px, 60vw, 264px);
        touch-action: none;
        user-select: none;
        cursor: grab;
      }

      .dial-container:active {
        cursor: grabbing;
      }

      .dial-svg {
        width: 100%;
        height: 100%;
      }

      .dial-bg-circle {
        fill: var(--md-sys-color-surface-container-high, #2b2b30);
      }

      .dial-arc-track {
        fill: none;
        stroke: var(--md-sys-color-outline-variant, #4a4a52);
        stroke-width: 8;
        stroke-linecap: round;
        transition: stroke-width var(--m3e-spring-spatial-fast);
      }

      .climate-hero.is-dragging .dial-arc-track {
        stroke-width: 18;
      }

      .dial-ambient-dot {
        fill: var(--md-sys-color-on-surface, #e3e2e6);
        opacity: 0.75;
      }

      .dial-ambient-label {
        fill: var(--md-sys-color-on-surface, #e3e2e6);
        font-size: 13px;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
      }

      .dial-thumb-pill {
        fill: var(--climate-accent);
        transition:
          x var(--m3e-spring-spatial-fast),
          y var(--m3e-spring-spatial-fast),
          width var(--m3e-spring-spatial-fast),
          height var(--m3e-spring-spatial-fast);
      }

      .dial-center {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        pointer-events: none;
      }

      .dial-readout-off {
        font-size: 46px;
        font-weight: 500;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      .dial-readout-num {
        font-size: 58px;
        font-weight: 500;
        line-height: 1;
        font-variant-numeric: tabular-nums;
      }

      .dial-readout-num sup {
        font-size: 28px;
        vertical-align: super;
        margin-left: 2px;
      }

      .dial-steppers {
        position: absolute;
        bottom: 24px;
        display: flex;
        gap: 36px;
        pointer-events: auto;
      }

      .dial-step-btn {
        width: 36px;
        height: 36px;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font-size: 24px;
        line-height: 1;
        cursor: pointer;
        display: grid;
        place-items: center;
      }

      .dial-step-btn:hover {
        background: color-mix(in srgb, currentColor 10%, transparent);
      }

      .mode-pill {
        width: 100%;
        border: 0;
        padding: 16px 20px;
        border-radius: var(--m3e-corner-full);
        display: flex;
        align-items: center;
        gap: 14px;
        text-align: left;
        cursor: pointer;
        font: inherit;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        transition:
          background-color var(--m3e-spring-effects-default),
          transform var(--m3e-spring-spatial-fast);
      }

      .mode-pill:active {
        transform: scale(0.98);
      }

      .mode-pill.mode-heat {
        background: #5e3d2e;
        color: #ffdbcc;
      }

      .mode-pill.mode-cool {
        background: #2f455c;
        color: #d2e4ff;
      }

      .mode-pill-icon svg {
        width: 22px;
        height: 22px;
        display: block;
      }

      .mode-pill-text {
        display: flex;
        flex-direction: column;
      }

      .mode-pill-title {
        font-size: 14px;
        font-weight: 600;
      }

      .mode-pill-val {
        font-size: 13px;
        opacity: 0.85;
      }

      .climate-grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .mode-pill.compact-trait {
        border-radius: 20px;
      }

      .trait-card {
        width: 100%;
        border: 0;
        padding: 16px 18px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        text-align: left;
        cursor: pointer;
        font: inherit;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        transition:
          background-color var(--m3e-spring-effects-default),
          transform var(--m3e-spring-spatial-fast);
      }

      .trait-card:active {
        transform: scale(0.98);
      }

      .trait-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .trait-chevron {
        display: grid;
        place-items: center;
        opacity: 0.78;
      }

      .m3-chevron {
        width: 22px;
        height: 22px;
        display: block;
      }

      .telemetry-card {
        background: var(--md-sys-color-surface-container-high, #22232a);
        border-radius: 24px;
        padding: 14px 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .telemetry-row {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        font-variant-numeric: tabular-nums;
      }

      /* Inline Mode Selector Bottom Sheet */
      .mode-sheet-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.48);
        display: flex;
        align-items: flex-end;
        justify-content: center;
        z-index: 40;
        animation: m3e-fade-in 180ms cubic-bezier(0.2, 0, 0, 1);
      }

      .mode-sheet {
        width: 100%;
        max-width: 440px;
        max-height: 76dvh;
        background: var(--md-sys-color-surface-container, #1e1f26);
        border-radius: 28px 28px 0 0;
        padding: 16px 16px calc(20px + env(safe-area-inset-bottom, 0px));
        display: flex;
        flex-direction: column;
        gap: 12px;
        animation: m3e-sheet-up 260ms cubic-bezier(0.05, 0.7, 0.1, 1);
      }

      .mode-sheet-header {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 18px;
        font-weight: 500;
      }

      .mode-sheet-list {
        flex: 1 1 auto;
        overflow-y: auto;
        overscroll-behavior: contain;
        max-height: 52vh;
        padding-bottom: 6px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .mode-option {
        width: 100%;
        border: 0;
        padding: 16px 20px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font: inherit;
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        transition: border-radius var(--m3e-spring-spatial-fast);
      }

      .mode-option.selected {
        border-radius: var(--m3e-corner-full);
      }

      .mode-option.selected.mode-heat {
        background: #5e3d2e;
        color: #ffdbcc;
      }

      .mode-option.selected.mode-cool {
        background: #2f455c;
        color: #d2e4ff;
      }

      .mode-option.selected.mode-off {
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      /* =====================================================================
         VARIANT 3: REMOTE / TV (Touchpad + Essentials + Vertical Rocker + Split Pills)
         ===================================================================== */
      .remote-touchpad {
        position: relative;
        flex: 0 0 auto;
        width: 100%;
        height: 216px;
        min-height: 216px;
        border-radius: 28px;
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

      .remote-essential-row {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 2px 12px;
      }

      .essential-btn {
        width: 56px;
        height: 56px;
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
        width: 68px;
        height: 68px;
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
        border-radius: 18px;
      }

      .essential-btn svg {
        width: 24px;
        height: 24px;
      }

      .essential-btn.is-home svg {
        width: 26px;
        height: 26px;
      }

      .remote-hero {
        display: flex;
        justify-content: center;
        padding: 4px 0;
      }

      .rocker-pill {
        width: 124px;
        height: 176px;
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-surface-container-high, #282930);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .rocker-half {
        flex: 1;
        border: 0;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        cursor: pointer;
      }

      .rocker-half:hover {
        background: color-mix(in srgb, currentColor 7%, transparent);
      }

      .rocker-half svg {
        width: 24px;
        height: 24px;
      }

      .rocker-divider {
        height: 1px;
        background: var(--md-sys-color-outline-variant, #44464f);
      }

      .split-pill {
        position: relative;
        height: 56px;
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-surface-container-high, #282930);
        display: flex;
        overflow: hidden;
      }

      .split-pill.has-state {
        padding: 4px;
      }

      .split-indicator {
        position: absolute;
        top: 4px;
        bottom: 4px;
        left: 4px;
        width: calc(50% - 4px);
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-primary-container, #364067);
        transition: transform var(--m3e-spring-spatial-fast);
        pointer-events: none;
        z-index: 0;
      }

      .split-indicator.is-right {
        transform: translateX(100%);
      }

      .split-half {
        position: relative;
        z-index: 1;
        flex: 1;
        border: 0;
        border-radius: var(--m3e-corner-full);
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font: inherit;
        font-size: 14.5px;
        font-weight: 500;
        cursor: pointer;
        transition:
          color var(--m3e-spring-effects-fast),
          background-color var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
      }

      .split-half.is-selected {
        color: var(--md-sys-color-on-primary-container, #dce2ff);
        font-weight: 600;
      }

      .split-half:hover:not(.is-selected) {
        background: color-mix(in srgb, currentColor 7%, transparent);
      }

      .split-half:active {
        transform: scale(0.96);
      }

      .split-vdivider {
        width: 1px;
        margin: 12px 0;
        background: var(--md-sys-color-outline-variant, #44464f);
      }

      .transport-row {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        gap: 10px;
        padding: 6px 0;
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
        width: 48px;
        height: 48px;
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
        width: 24px;
        height: 24px;
      }

      .transport-circle {
        width: 58px;
        height: 58px;
        border-radius: 50%;
        background: var(--md-sys-color-surface-container-high, #282930);
      }

      .transport-circle.is-active {
        border-radius: 18px;
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .transport-circle:active {
        transform: scale(0.91);
      }

      .transport-circle svg {
        width: 26px;
        height: 26px;
      }

      .channel-pill {
        height: 56px;
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-surface-container-high, #282930);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px;
      }

      .channel-btn {
        width: 44px;
        height: 44px;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font-size: 20px;
        cursor: pointer;
      }

      .channel-label {
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.04em;
      }

      /* =====================================================================
         VARIANT 4: MEDIA / SPEAKER (Media Card + Shape-Coded Volume & Actions)
         ===================================================================== */
      /* Full Pill Volume Slider */
      .volume-pill {
        position: relative;
        height: 64px;
        border-radius: var(--m3e-corner-full);
        overflow: hidden;
        cursor: ew-resize;
        user-select: none;
        touch-action: pan-y;
        background: color-mix(
          in srgb,
          var(--md-sys-color-primary-container, #364067) 48%,
          var(--md-sys-color-surface-container-high, #24252d)
        );
      }

      .volume-pill-fill {
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        width: var(--vol-pct, 40%);
        background: var(--md-sys-color-primary-container, #364067);
        transition: width var(--m3e-spring-spatial-default);
      }

      .volume-pill.is-dragging .volume-pill-fill {
        transition: none;
      }

      .volume-pill-content {
        position: relative;
        z-index: 1;
        height: 100%;
        padding: 0 22px;
        display: flex;
        align-items: center;
        gap: 14px;
        font-size: 15px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-primary-container, #dce2ff);
        pointer-events: none;
      }

      /* Full Pill Active Primary Action */
      .primary-action-pill {
        height: 60px;
        border: 0;
        border-radius: var(--m3e-corner-full);
        padding: 0 22px;
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
        font: inherit;
        font-size: 15px;
        font-weight: 500;
        text-align: left;
        cursor: pointer;
      }

      /* 20px Rounded Rectangle Neutral Secondary Action */
      .secondary-action-card {
        height: 60px;
        border: 0;
        border-radius: 20px;
        padding: 0 20px;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font: inherit;
        font-size: 15px;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
      }

      /* =====================================================================
         SELECTOR POPUP (M3 Expressive Radio Option List)
         ===================================================================== */
      .selector-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-height: 58dvh;
        overflow-y: auto;
        padding: 2px 0;
      }

      .selector-row {
        width: 100%;
        min-height: 70px;
        padding: 15px 22px;
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

      .selector-row.is-selected {
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-primary-container, #dfe2ed);
        color: var(--md-sys-color-on-primary-container, #2b3248);
      }

      .selector-row:active {
        transform: scale(0.98);
      }

      .selector-row-icon {
        flex: 0 0 24px;
        width: 24px;
        height: 24px;
        display: grid;
        place-items: center;
      }

      .selector-row-icon svg {
        width: 24px;
        height: 24px;
      }

      .selector-row-label {
        flex: 1 1 auto;
        font-size: 16px;
        font-weight: 500;
      }

      .selector-row.is-selected .selector-row-label {
        font-weight: 600;
      }

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

      .selector-empty {
        padding: 20px 16px;
        border-radius: 20px;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        font-size: 14px;
        line-height: 1.45;
        text-align: center;
      }

      /* =====================================================================
         POWER STRIP POPUP (2-Column M3 Expressive Toggle Grid)
         ===================================================================== */
      .power-strip-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }

      .ps-tile {
        min-height: 76px;
        padding: 14px 16px;
        border: 0;
        border-radius: 22px;
        background: var(--md-sys-color-surface-container-high, #24252d);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font: inherit;
        text-align: left;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
        -webkit-tap-highlight-color: transparent;
        transition:
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default),
          transform var(--m3e-spring-spatial-fast);
      }

      .ps-tile.is-on {
        border-radius: 28px;
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .ps-tile:active:not(:disabled) {
        transform: scale(0.96);
      }

      .ps-tile.is-unavailable {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .ps-tile-icon {
        flex: 0 0 24px;
        width: 24px;
        height: 24px;
        display: grid;
        place-items: center;
      }

      .ps-tile-icon svg {
        width: 24px;
        height: 24px;
      }

      .ps-tile-meta {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .ps-tile-title {
        font-size: 14.5px;
        font-weight: 600;
        line-height: 19px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .ps-tile-sub {
        font-size: 12.5px;
        font-weight: 500;
        line-height: 16px;
        opacity: 0.78;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-status-card': M3EStatusCard;
  }
}
