import { LitElement, css, html, svg, nothing, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import '../editors/m3e-status-card-editor';
import { m3eBaseStyles } from '../styles/m3e-tokens';
import type {
  HassEntity,
  HomeAssistant,
  M3ERemoteButtonsConfig,
  M3EStatusCardConfig,
  M3EStatusPopupType,
  M3ESubtitleFormat,
} from '../types/home-assistant';
import { renderM3EntityIcon } from '../utils/icons';
import { executeNavigationTarget } from '../utils/navigation';
import { formatLastChanged } from '../utils/time';

const ISO_TIMESTAMP_RE = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$/;

function formatDisplayValue(rawVal: string, format: M3ESubtitleFormat): string {
  if (format === 'raw') return rawVal;
  const trimmed = rawVal.trim();
  if (!ISO_TIMESTAMP_RE.test(trimmed)) return rawVal;

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return rawVal;

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

interface HistoryPoint {
  t: number; // timestamp ms
  v: number; // numeric value
}

const NUMERIC_HISTORY_CLASSES = new Set([
  'temperature',
  'humidity',
  'illuminance',
  'pressure',
  'atmospheric_pressure',
  'power',
  'energy',
  'battery',
  'co2',
  'pm25',
  'pm10',
  'aqi',
  'moisture',
  'voltage',
  'current',
]);

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
  @state() private _config?: M3EStatusCardConfig;
  @state() private _pressed = false;
  @state() private _popupOpen = false;

  // Climate dial interaction state
  @state() private _dialDragging = false;
  @state() private _dialTemp: number | null = null;
  @state() private _activeSheet: ClimateSheetKind = null;

  // Media volume slider interaction state
  @state() private _volDragging = false;
  @state() private _volPct: number | null = null;
  private _volPendingTimer: number | null = null;

  // Sensor 24h history chart state
  @state() private _historyPoints: HistoryPoint[] = [];
  @state() private _historyLoading = false;
  @state() private _historyEntityId: string | null = null;
  @state() private _historyHoverIdx: number | null = null;

  @query('dialog.status-dialog') private _dialogEl?: HTMLDialogElement;
  @query('.status-tile') private _tileEl?: HTMLElement;
  @query('.dialog-surface') private _dialogSurfaceEl?: HTMLElement;

  private _prevStates: Record<string, HassEntity | undefined> = {};
  private _longPressTimer: number | null = null;
  private _longPressTriggered = false;
  private _relativeTimer: number | null = null;
  @state() private _relativeTick = 0;

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
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this._syncRelativeTimer();
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._clearLongPress();
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
    return 2;
  }

  public getGridOptions() {
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
      changedProps.has('_volDragging') ||
      changedProps.has('_volPct') ||
      changedProps.has('_historyPoints') ||
      changedProps.has('_historyLoading') ||
      changedProps.has('_historyHoverIdx') ||
      changedProps.has('_relativeTick')
    ) {
      return true;
    }

    if (changedProps.has('hass') && this._config && this.hass) {
      const watched = [
        this._config.entity,
        this._config.status_entity,
        this._config.subtitle_entity,
        this._config.secondary_entity,
        this._config.outdoor_entity,
        ...(this._config.extra_entities ?? []).slice(0, 10),
        ...this._getSiblingEntityIds(),
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

  private get _isActive(): boolean {
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

  private _isNumericHistoryEntity(entity?: HassEntity): boolean {
    if (!entity || !entity.entity_id.startsWith('sensor.')) return false;
    const dc = String(entity.attributes.device_class ?? '');
    if (NUMERIC_HISTORY_CLASSES.has(dc)) return true;
    return Boolean(entity.attributes.unit_of_measurement) && !Number.isNaN(Number(entity.state));
  }

  private _resolveHistoryEntity(): HassEntity | undefined {
    if (this._isNumericHistoryEntity(this._entity)) return this._entity;
    return this._getSiblingSensors().find((s) => this._isNumericHistoryEntity(s));
  }

  private async _fetchHistory(): Promise<void> {
    if (!this.hass) return;
    const target = this._resolveHistoryEntity();
    if (!target) {
      this._historyPoints = [];
      this._historyEntityId = null;
      return;
    }

    this._historyEntityId = target.entity_id;
    this._historyLoading = true;
    this._historyHoverIdx = null;

    try {
      const end = new Date();
      const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
      let rawList: Array<{ s?: string; lu?: number; state?: string; last_updated?: string }> = [];

      if (typeof this.hass.callWS === 'function') {
        const res = await this.hass.callWS<Record<string, typeof rawList>>({
          type: 'history/history_during_period',
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          entity_ids: [target.entity_id],
          minimal_response: true,
          no_attributes: true,
          significant_changes_only: false,
        });
        rawList = res?.[target.entity_id] ?? [];
      } else if (typeof this.hass.callApi === 'function') {
        const res = await this.hass.callApi<Array<typeof rawList>>(
          'GET',
          `history/period/${start.toISOString()}?filter_entity_id=${encodeURIComponent(target.entity_id)}&minimal_response&no_attributes`,
        );
        rawList = res?.[0] ?? [];
      }

      const parsed: HistoryPoint[] = [];
      for (const item of rawList) {
        const val = Number(item.s ?? item.state);
        if (Number.isNaN(val)) continue;
        const ts =
          typeof item.lu === 'number'
            ? item.lu * 1000
            : item.last_updated
              ? Date.parse(item.last_updated)
              : NaN;
        if (!Number.isNaN(ts)) {
          parsed.push({ t: ts, v: val });
        }
      }

      // Downsample cleanly to at most 44 points for a smooth, lightweight SVG curve
      const maxPts = 44;
      if (parsed.length > maxPts) {
        const step = (parsed.length - 1) / (maxPts - 1);
        const sampled: HistoryPoint[] = [];
        for (let i = 0; i < maxPts; i++) {
          sampled.push(parsed[Math.round(i * step)]);
        }
        this._historyPoints = sampled;
      } else {
        this._historyPoints = parsed;
      }
    } catch {
      this._historyPoints = [];
    } finally {
      this._historyLoading = false;
    }
  }

  /* =========================================================================
     POPUP OPEN / CLOSE (Container Transform)
     ========================================================================= */
  public async openPopup(): Promise<void> {
    if (this._resolvedPopupType === 'none' || this._popupOpen) return;
    window.getSelection()?.removeAllRanges();
    const tileRect = this._tileEl?.getBoundingClientRect();
    this._activeSheet = null;
    this._popupOpen = true;
    if (this._resolvedPopupType === 'sensor' || this._resolvedPopupType === 'custom') {
      void this._fetchHistory();
    }
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
      this._activeSheet = null;
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
        this._activeSheet = null;
      };
    } else {
      dialog.close();
      this._popupOpen = false;
      this._activeSheet = null;
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

  /**
   * Executes a remote button binding:
   * - If configured as an entity_id (button.*, script.*, switch.*, scene.*), triggers that entity.
   * - If configured as a command string (e.g. "VolumeUp"), sends remote.send_command.
   * - Otherwise falls back to the default media_player service or remote command.
   */
  private _triggerRemoteButton(
    key: keyof M3ERemoteButtonsConfig,
    fallbackService: string,
    fallbackData: Record<string, unknown> = {},
    defaultCommand?: string,
  ): void {
    if (!this.hass || !this._config) return;
    const binding = this._config.remote_buttons?.[key]?.trim();

    if (binding) {
      if (binding.startsWith('button.')) {
        this.hass.callService('button', 'press', { entity_id: binding });
        return;
      }
      if (binding.startsWith('script.')) {
        this.hass.callService('script', 'turn_on', { entity_id: binding });
        return;
      }
      if (binding.startsWith('scene.')) {
        this.hass.callService('scene', 'turn_on', { entity_id: binding });
        return;
      }
      if (binding.startsWith('switch.')) {
        this.hass.callService('switch', 'toggle', { entity_id: binding });
        return;
      }
      // Treat as remote.send_command command name
      const payload: Record<string, unknown> = {
        entity_id: this._config.entity,
        command: binding,
      };
      if (this._config.remote_device?.trim()) {
        payload.device = this._config.remote_device.trim();
      }
      this.hass.callService('remote', 'send_command', payload);
      return;
    }

    if (this._config.entity.startsWith('remote.')) {
      const payload: Record<string, unknown> = {
        entity_id: this._config.entity,
        command: defaultCommand ?? key,
      };
      if (this._config.remote_device?.trim()) {
        payload.device = this._config.remote_device.trim();
      }
      this.hass.callService('remote', 'send_command', payload);
      return;
    }

    this._callEntityService(fallbackService, fallbackData);
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

  private _openMoreInfo(entityId: string): void {
    this.closePopup();
    this.dispatchEvent(
      new CustomEvent('hass-more-info', {
        bubbles: true,
        composed: true,
        detail: { entityId },
      }),
    );
  }

  private _callEntityService(service: string, extra: Record<string, unknown> = {}): void {
    if (!this.hass || !this._config) return;
    const domain = this._config.entity.split('.')[0];
    this.hass.callService(domain, service, {
      entity_id: this._config.entity,
      ...extra,
    });
  }

  /* =========================================================================
     ICONS (Native <ha-icon> in HA + clean SVG fallbacks in standalone preview)
     ========================================================================= */
  private _renderEntityIcon(iconName?: string) {
    if (iconName && typeof customElements !== 'undefined' && customElements.get('ha-icon')) {
      return html`<ha-icon .icon=${iconName}></ha-icon>`;
    }
    return renderM3EntityIcon(this._statusEntity ?? this._entity, this._isActive, this._resolvedPopupType);
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
      this._config?.name,
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
    const target = this._historyEntityId
      ? this.hass?.states[this._historyEntityId]
      : this._resolveHistoryEntity();
    if (!target) return nothing;

    const unit = String(target.attributes.unit_of_measurement ?? '');
    const title = this._historyEntityId === this._entity?.entity_id
      ? 'Last 24 hours'
      : `${this._cleanSiblingLabel(target)} • 24h`;

    if (this._historyLoading) {
      return html`
        <div class="history-card">
          <div class="history-header">
            <span class="history-title">${title}</span>
            <span class="history-range">Loading…</span>
          </div>
          <div class="history-skeleton"></div>
        </div>
      `;
    }

    const pts = this._historyPoints;
    if (pts.length < 2) return nothing;

    const minV = Math.min(...pts.map((p) => p.v));
    const maxV = Math.max(...pts.map((p) => p.v));
    const spanV = maxV - minV || 1;
    const minT = pts[0].t;
    const maxT = pts[pts.length - 1].t;
    const spanT = maxT - minT || 1;

    const W = 320;
    const H = 104;
    const padX = 6;
    const padY = 12;

    const coords = pts.map((p) => ({
      x: padX + ((p.t - minT) / spanT) * (W - padX * 2),
      y: H - padY - ((p.v - minV) / spanV) * (H - padY * 2),
      ...p,
    }));

    // Smooth cubic path
    let lineD = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const midX = ((prev.x + curr.x) / 2).toFixed(1);
      lineD += ` C ${midX} ${prev.y.toFixed(1)}, ${midX} ${curr.y.toFixed(1)}, ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
    }
    const areaD = `${lineD} L ${coords[coords.length - 1].x.toFixed(1)} ${H} L ${coords[0].x.toFixed(1)} ${H} Z`;

    const activeIdx = this._historyHoverIdx;
    const activePt = activeIdx !== null ? coords[activeIdx] : coords[coords.length - 1];
    const fmtTime = (ms: number) =>
      new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const onChartPointer = (e: PointerEvent) => {
      const svgEl = e.currentTarget as SVGSVGElement;
      const rect = svgEl.getBoundingClientRect();
      if (rect.width <= 0) return;
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      this._historyHoverIdx = Math.round(ratio * (coords.length - 1));
    };

    const gradId = `m3e-hist-${this._historyEntityId?.replace(/[^a-z0-9]/gi, '_') ?? 'g'}`;

    return html`
      <div class="history-card">
        <div class="history-header">
          <span class="history-title">${title}</span>
          <span class="history-range">
            ${activeIdx !== null
              ? `${activePt.v}${unit} · ${fmtTime(activePt.t)}`
              : `${minV}${unit} – ${maxV}${unit}`}
          </span>
        </div>

        <svg
          class="history-svg"
          viewBox="0 0 ${W} ${H}"
          preserveAspectRatio="none"
          @pointerdown=${onChartPointer}
          @pointermove=${(e: PointerEvent) => {
            if (e.buttons > 0 || e.pointerType === 'mouse') onChartPointer(e);
          }}
          @pointerleave=${() => (this._historyHoverIdx = null)}
        >
          ${svg`
            <defs>
              <linearGradient id=${gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--md-sys-color-primary, #bac3ff)" stop-opacity="0.28" />
                <stop offset="100%" stop-color="var(--md-sys-color-primary, #bac3ff)" stop-opacity="0.0" />
              </linearGradient>
            </defs>
            <line x1=${padX} y1=${padY} x2=${W - padX} y2=${padY} class="history-grid-line" />
            <line x1=${padX} y1=${H / 2} x2=${W - padX} y2=${H / 2} class="history-grid-line" />
            <line x1=${padX} y1=${H - padY} x2=${W - padX} y2=${H - padY} class="history-grid-line" />
            <path d=${areaD} fill="url(#${gradId})" />
            <path d=${lineD} class="history-line" />
            ${activeIdx !== null
              ? svg`<line x1=${activePt.x} y1=${padY} x2=${activePt.x} y2=${H - padY} class="history-cursor-line" />`
              : nothing}
            <circle cx=${activePt.x} cy=${activePt.y} r="4.5" class="history-dot" />
          `}
        </svg>

        <div class="history-axis">
          <span>${fmtTime(minT)}</span>
          <span>${fmtTime((minT + maxT) / 2)}</span>
          <span>${fmtTime(maxT)}</span>
        </div>
      </div>
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
    const dialog = this._dialogEl;
    if (dialog?.open) {
      dialog.close();
    }
    this._popupOpen = false;
    this._activeSheet = null;
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
                        <span>Outdoor temperature</span>
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

  private _renderRemotePopup() {
    const source = String(this._entity?.attributes.source ?? 'Source');
    return html`
      <div class="remote-hero">
        <div class="rocker-pill">
          <button
            type="button"
            class="rocker-half"
            aria-label="Volume up"
            @click=${() => this._triggerRemoteButton('volume_up', 'volume_up', {}, 'VolumeUp')}
          >
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02ZM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77Z"/></svg>
          </button>
          <span class="rocker-divider"></span>
          <button
            type="button"
            class="rocker-half"
            aria-label="Volume down"
            @click=${() => this._triggerRemoteButton('volume_down', 'volume_down', {}, 'VolumeDown')}
          >
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M18.5 12A4.5 4.5 0 0 0 16 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02ZM5 9v6h4l5 5V4L9 9H5Z"/></svg>
          </button>
        </div>
      </div>

      <div class="modular-stack">
        <div class="split-pill">
          <button
            type="button"
            class="split-half"
            @click=${() => this._triggerRemoteButton('unmute', 'volume_mute', { is_volume_muted: false }, 'Unmute')}
          >
            Unmute
          </button>
          <span class="split-vdivider"></span>
          <button
            type="button"
            class="split-half"
            @click=${() => this._triggerRemoteButton('mute', 'volume_mute', { is_volume_muted: true }, 'Mute')}
          >
            Mute
          </button>
        </div>

        <div class="split-pill">
          <button
            type="button"
            class="split-half"
            @click=${() => this._triggerRemoteButton('power_on', 'turn_on', {}, 'PowerOn')}
          >
            On
          </button>
          <span class="split-vdivider"></span>
          <button
            type="button"
            class="split-half"
            @click=${() => this._triggerRemoteButton('power_off', 'turn_off', {}, 'PowerOff')}
          >
            Off
          </button>
        </div>

        <div class="transport-row">
          <button
            type="button"
            class="transport-icon"
            aria-label="Previous"
            @click=${() => this._triggerRemoteButton('prev', 'media_previous_track', {}, 'Previous')}
          >
            ⏮
          </button>
          <button
            type="button"
            class="transport-circle"
            aria-label="Play"
            @click=${() => this._triggerRemoteButton('play', 'media_play', {}, 'Play')}
          >
            ▶
          </button>
          <button
            type="button"
            class="transport-circle"
            aria-label="Pause"
            @click=${() => this._triggerRemoteButton('pause', 'media_pause', {}, 'Pause')}
          >
            ⏸
          </button>
          <button
            type="button"
            class="transport-icon"
            aria-label="Next"
            @click=${() => this._triggerRemoteButton('next', 'media_next_track', {}, 'Next')}
          >
            ⏭
          </button>
        </div>

        <div class="channel-pill">
          <button
            type="button"
            class="channel-btn"
            aria-label="Channel down"
            @click=${() => this._triggerRemoteButton('ch_down', 'media_previous_track', {}, 'ChannelDown')}
          >
            ${CHEVRON_DOWN_SVG}
          </button>
          <span class="channel-label">CH</span>
          <button
            type="button"
            class="channel-btn"
            aria-label="Channel up"
            @click=${() => this._triggerRemoteButton('ch_up', 'media_next_track', {}, 'ChannelUp')}
          >
            ${CHEVRON_UP_SVG}
          </button>
        </div>

        <div class="secondary-action-card">
          <span>${source}</span>
          <span class="trait-chevron">${CHEVRON_DOWN_SVG}</span>
        </div>
      </div>
    `;
  }

  private _renderMediaPopup() {
    const entity = this._mediaEntity;
    const isPlaying = entity?.state === 'playing';
    const isIdle = !entity || entity.state === 'idle' || entity.state === 'off';
    const mediaTitle = String(entity?.attributes.media_title ?? (isIdle ? 'Nothing playing' : 'Paused'));
    const mediaArtist = String(entity?.attributes.media_artist ?? '');
    const appName = String(entity?.attributes.app_name ?? '');
    const artwork = String(entity?.attributes.entity_picture ?? '');
    const vol = this._mediaVolumePct;

    return html`
      <div
        class="media-hero-card ${artwork && !isIdle ? 'has-art' : ''}"
        style=${artwork && !isIdle ? `--media-art: url("${artwork}");` : ''}
      >
        <div class="media-hero-top">
          <span class="media-app-badge">${appName || '▶'}</span>
        </div>

        <div class="media-hero-mid">
          <div class="media-meta">
            <span class="media-title">${mediaTitle}</span>
            ${mediaArtist ? html`<span class="media-artist">${mediaArtist}</span>` : nothing}
          </div>
          ${!isIdle
            ? html`
                <button
                  type="button"
                  class="media-play-fab"
                  aria-label=${isPlaying ? 'Pause' : 'Play'}
                  @click=${() => this._callMediaService('media_play_pause')}
                >
                  ${isPlaying ? '⏸' : '▶'}
                </button>
              `
            : nothing}
        </div>

        <div class="media-scrubber-row">
          <button
            type="button"
            class="scrubber-btn"
            @click=${() => this._callMediaService('media_previous_track')}
          >
            ⏮
          </button>
          <div class="scrubber-track">
            <div class="scrubber-fill" style="width: ${isIdle ? 0 : 28}%"></div>
            ${!isIdle ? html`<span class="scrubber-dot" style="left: 28%"></span>` : nothing}
          </div>
          <button
            type="button"
            class="scrubber-btn"
            @click=${() => this._callMediaService('media_next_track')}
          >
            ⏭
          </button>
        </div>
      </div>

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
                Stop casting
              </button>
            `
          : entity?.state === 'off'
            ? html`
                <button
                  type="button"
                  class="primary-action-pill"
                  @click=${() => this._callMediaService('turn_on')}
                >
                  Turn on
                </button>
              `
            : nothing}

        <!-- Secondary action: opens native Home Assistant Media Browser / More Info -->
        ${entity
          ? html`
              <button
                type="button"
                class="secondary-action-card"
                @click=${() => this._openMoreInfo(entity.entity_id)}
              >
                <span>Media &amp; Controls</span>
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

  /* =========================================================================
     MAIN RENDER
     ========================================================================= */
  protected render() {
    if (!this._config) return nothing;
    const entity = this._entity;
    const name = this._config.name || entity?.attributes.friendly_name || this._config.entity;
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

    return html`
      <ha-card
        class="status-tile ${styleClass} ${isActive ? 'is-active' : 'is-inactive'} ${this._pressed ? 'is-pressed' : ''} ${this._isUnavailable ? 'is-unavailable' : ''}"
        role="button"
        tabindex="0"
        aria-label="${name}, ${this._stateLabel}"
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
        <div class="state-layer" aria-hidden="true"></div>
        <div class="tile-inner">
          <span class="tile-icon">${this._renderEntityIcon(icon)}</span>
          <div class="tile-meta">
            <span class="tile-title">${name}</span>
            <span class="tile-subtitle">${this._stateLabel}</span>
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
      </ha-card>

      <dialog
        class="status-dialog"
        @click=${(e: MouseEvent) => {
          if (e.target === this._dialogEl) this.closePopup();
        }}
        @cancel=${(e: Event) => {
          e.preventDefault();
          this.closePopup();
        }}
      >
        ${this._popupOpen
          ? (() => {
              const powerEnt =
                popupType === 'sensor' || popupType === 'custom'
                  ? this._toggleablePowerEntity
                  : undefined;
              const powerOn = powerEnt?.state === 'on';
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
                    ${powerEnt
                      ? html`
                          <button
                            type="button"
                            class="m3-header-switch ${powerOn ? 'is-on' : ''}"
                            role="switch"
                            aria-checked=${String(powerOn)}
                            aria-label=${powerOn ? 'Spegni' : 'Accendi'}
                            @click=${() => this._togglePowerEntity(powerEnt)}
                          >
                            <span class="m3-header-switch-thumb" aria-hidden="true"></span>
                          </button>
                        `
                      : nothing}
                  </header>

                  ${popupType === 'selector'
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
    `;
  }

  static styles = [
    m3eBaseStyles,
    css`
      :host {
        --m3e-spring-bouncy: 520ms linear(
          0, 0.168 7%, 0.618 18%, 0.962 31%, 1.072 43%,
          1.038 56%, 0.992 71%, 1.005 86%, 1
        );
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
        border-radius: var(--m3e-card-border-radius, 28px);
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
        padding: 16px 18px 16px 20px;
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .tile-icon {
        flex: 0 0 auto;
        width: 26px;
        height: 26px;
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
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      .status-tile.is-active .tile-title,
      .status-tile.is-active .tile-subtitle,
      .status-tile.is-active .tile-chevron {
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .tile-chevron {
        flex: 0 0 auto;
        width: 20px;
        height: 20px;
        display: grid;
        place-items: center;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        opacity: 0.78;
      }

      .tile-chevron svg {
        width: 20px;
        height: 20px;
      }

      /* =====================================================================
         2. MODULAR EXPANDED POPUP SHELL
         ===================================================================== */
      dialog.status-dialog {
        margin: auto;
        padding: 0;
        border: 0;
        background: transparent;
        max-width: min(440px, calc(100vw - 24px));
        max-height: calc(100dvh - 24px);
        width: 100%;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      dialog.status-dialog::backdrop {
        background: color-mix(in srgb, var(--md-sys-color-scrim, #000000) 58%, transparent);
      }

      .dialog-surface {
        position: relative;
        overflow-y: auto;
        overflow-x: hidden;
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
        }

        .dialog-surface {
          border-radius: 28px 28px 0 0;
          max-height: 94dvh;
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

      /* M3 Expressive 24h Sensor History Chart Card */
      .history-card {
        background: var(--md-sys-color-surface-container-high, #24252d);
        border-radius: 24px;
        padding: 16px 18px 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .history-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .history-title {
        font-size: 13px;
        font-weight: 600;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      .history-range {
        font-size: 13px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-primary, #bac3ff);
      }

      .history-svg {
        width: 100%;
        height: 104px;
        display: block;
        cursor: crosshair;
        touch-action: none;
      }

      .history-grid-line {
        stroke: var(--md-sys-color-outline-variant, #44464f);
        stroke-width: 1;
        stroke-dasharray: 3 4;
        opacity: 0.45;
      }

      .history-line {
        fill: none;
        stroke: var(--md-sys-color-primary, #bac3ff);
        stroke-width: 2.5;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .history-cursor-line {
        stroke: var(--md-sys-color-primary, #bac3ff);
        stroke-width: 1;
        opacity: 0.55;
      }

      .history-dot {
        fill: var(--md-sys-color-primary, #bac3ff);
        stroke: var(--md-sys-color-surface-container-high, #24252d);
        stroke-width: 2;
      }

      .history-axis {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        opacity: 0.75;
      }

      .history-skeleton {
        height: 104px;
        border-radius: 14px;
        background: var(--md-sys-color-surface-container-highest, #303036);
        opacity: 0.6;
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
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.42);
        display: flex;
        align-items: flex-end;
        z-index: 10;
      }

      .mode-sheet {
        width: 100%;
        max-height: 78%;
        background: var(--md-sys-color-surface-container, #1e1f26);
        border-radius: 28px 28px 0 0;
        padding: 16px 16px 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
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
         VARIANT 3: REMOTE / TV (Vertical Rocker Pill + Split Pills)
         ===================================================================== */
      .remote-hero {
        display: flex;
        justify-content: center;
        padding: 6px 0;
      }

      .rocker-pill {
        width: 132px;
        height: 236px;
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
        height: 56px;
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-surface-container-high, #282930);
        display: flex;
        overflow: hidden;
      }

      .split-half {
        flex: 1;
        border: 0;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font: inherit;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      }

      .split-half:hover {
        background: color-mix(in srgb, currentColor 7%, transparent);
      }

      .split-vdivider {
        width: 1px;
        background: var(--md-sys-color-outline-variant, #44464f);
      }

      .transport-row {
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 4px 0;
      }

      .transport-icon,
      .transport-circle {
        border: 0;
        cursor: pointer;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        font-size: 18px;
      }

      .transport-icon {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: transparent;
      }

      .transport-circle {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: var(--md-sys-color-surface-container-high, #282930);
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
      .media-hero-card {
        position: relative;
        overflow: hidden;
        min-height: 178px;
        border-radius: 28px;
        padding: 18px 20px;
        background: var(--md-sys-color-surface-container-high, #2b2b30);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 14px;
      }

      .media-hero-card.has-art::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: var(--media-art);
        background-size: cover;
        background-position: center;
        filter: brightness(0.45);
      }

      .media-hero-top,
      .media-hero-mid,
      .media-scrubber-row {
        position: relative;
        z-index: 1;
      }

      .media-app-badge {
        display: inline-flex;
        align-items: center;
        padding: 4px 10px;
        border-radius: var(--m3e-corner-full);
        background: color-mix(in srgb, var(--md-sys-color-surface, #131316) 55%, transparent);
        font-size: 12px;
        font-weight: 600;
      }

      .media-hero-mid {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .media-meta {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .media-title {
        font-size: 18px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .media-artist {
        font-size: 14px;
        opacity: 0.85;
      }

      .media-play-fab {
        flex: 0 0 48px;
        width: 48px;
        height: 48px;
        border: 0;
        border-radius: 50%;
        background: var(--md-sys-color-primary-container, #e8e2d5);
        color: var(--md-sys-color-on-primary-container, #1b1b1f);
        font-size: 18px;
        cursor: pointer;
        display: grid;
        place-items: center;
      }

      .media-scrubber-row {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .scrubber-btn {
        border: 0;
        background: transparent;
        color: inherit;
        font-size: 16px;
        cursor: pointer;
        padding: 4px;
      }

      .scrubber-track {
        position: relative;
        flex: 1;
        height: 3px;
        border-radius: 9999px;
        background: color-mix(in srgb, currentColor 28%, transparent);
      }

      .scrubber-fill {
        height: 100%;
        border-radius: 9999px;
        background: currentColor;
      }

      .scrubber-dot {
        position: absolute;
        top: 50%;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: currentColor;
        transform: translate(-50%, -50%);
      }

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
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-status-card': M3EStatusCard;
  }
}
