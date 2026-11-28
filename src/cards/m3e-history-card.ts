import { LitElement, css, html, svg, nothing, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { m3eBaseStyles } from '../styles/m3e-tokens';
import type { HassEntity, HomeAssistant, M3EHistoryCardConfig } from '../types/home-assistant';
import { buildM3BadgeTonalPalette } from '../utils/m3-color-harmony';
import { resolveEntityName } from '../utils/entity-display';
import type { HistoryMetricKind } from '../components/m3e-history-chart';
import '../components/m3e-history-chart';

export type BarHistoryRange = 'W' | 'M';
type EffectiveAggregation = 'sum' | 'max' | 'avg';

interface BarWindowSpec {
  range: BarHistoryRange;
  offset: number;
  start: number;
  end: number;
  bucketStarts: number[];
  bucketEnds: number[];
  periodLabel: string;
  xLabels: Array<{ index: number; text: string }>;
}

interface SlideSnapshot {
  spec: BarWindowSpec;
  values: Array<number | null>;
  isDuration: boolean;
  isAdditive: boolean;
  unit: string;
}

interface StatRow {
  start: number | string;
  mean?: number | null;
  max?: number | null;
  sum?: number | null;
  state?: number | null;
  change?: number | null;
}

interface RawHistoryRow {
  s?: string;
  lu?: number;
  state?: string;
  last_updated?: string;
}

const DURATION_UNITS = new Set(['ms', 's', 'sec', 'secs', 'm', 'min', 'mins', 'h', 'hr', 'hrs']);

function isItalian(hass?: HomeAssistant): boolean {
  return String(hass?.language ?? '').toLowerCase().startsWith('it');
}

function isDurationSensor(entity: HassEntity | undefined, unit: string): boolean {
  const dc = String(entity?.attributes.device_class ?? '').toLowerCase();
  if (dc === 'duration') return true;
  return DURATION_UNITS.has(unit.trim().toLowerCase());
}

function normalizeDurationToMinutes(value: number, unit: string): number {
  const u = unit.trim().toLowerCase();
  if (u === 'ms') return value / 60000;
  if (u === 's' || u === 'sec' || u === 'secs') return value / 60;
  if (u === 'h' || u === 'hr' || u === 'hrs') return value * 60;
  return value;
}

function formatHeroDuration(minutes: number): string {
  const rounded = Math.max(0, Math.round(minutes));
  if (rounded < 60) return `${rounded}min`;
  const h = Math.floor(rounded / 60);
  const m = rounded % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function formatSubtitleDuration(minutes: number, it: boolean): string {
  const rounded = Math.max(0, Math.round(minutes));
  const h = Math.floor(rounded / 60);
  const m = rounded % 60;
  if (h === 0) {
    return it
      ? `${m} ${m === 1 ? 'minuto' : 'minuti'}`
      : `${m} ${m === 1 ? 'minute' : 'minutes'}`;
  }
  const hPart = it ? `${h} ${h === 1 ? 'ora' : 'ore'}` : `${h} ${h === 1 ? 'hour' : 'hours'}`;
  if (m === 0) return hPart;
  const mPart = it
    ? `${m} ${m === 1 ? 'minuto' : 'minuti'}`
    : `${m} ${m === 1 ? 'minute' : 'minutes'}`;
  return it ? `${hPart} e ${mPart}` : `${hPart} ${mPart}`;
}

function formatSmartNumber(val: number, hass?: HomeAssistant): string {
  const abs = Math.abs(val);
  const decimals = Number.isInteger(val) || abs >= 100 ? 0 : abs >= 10 ? 1 : 2;
  const locale = isItalian(hass) ? 'it-IT' : undefined;
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(Number(val.toFixed(decimals)));
}

function formatNumericWithUnit(val: number, unit: string, hass?: HomeAssistant): string {
  const numStr = formatSmartNumber(val, hass);
  const u = unit.trim();
  if (!u) return numStr;
  return u === '%' ? `${numStr}%` : `${numStr} ${u}`;
}

function formatYTick(val: number, isDuration: boolean, unit: string, hass?: HomeAssistant): string {
  if (isDuration) {
    if (val >= 180) {
      const hrs = val / 60;
      return `${Number.isInteger(hrs) ? hrs : hrs.toFixed(1).replace(/\.0$/, '')}h`;
    }
    return `${Math.round(val)}m`;
  }
  const numStr = formatSmartNumber(val, hass);
  const u = unit.trim();
  if (u && u.length <= 3) {
    return u === '%' || u === '°C' || u === '°F' ? `${numStr}${u}` : `${numStr}${u}`;
  }
  return numStr;
}

function buildBarWindowSpec(
  range: BarHistoryRange,
  offset: number,
  hass?: HomeAssistant,
): BarWindowSpec {
  const it = isItalian(hass);
  const locale = it ? 'it-IT' : 'en-US';
  const now = new Date();
  const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

  if (range === 'W') {
    const dayOfWeek = (now.getDay() + 6) % 7; // Monday = 0
    const monday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - dayOfWeek + offset * 7,
    );
    const bucketStarts: number[] = [];
    const bucketEnds: number[] = [];
    const xLabels: Array<{ index: number; text: string }> = [];
    const weekdayFmt = new Intl.DateTimeFormat(locale, { weekday: 'narrow' });

    for (let d = 0; d < 7; d++) {
      const ds = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + d);
      const de = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + d + 1);
      bucketStarts.push(ds.getTime());
      bucketEnds.push(de.getTime());
      xLabels.push({ index: d, text: weekdayFmt.format(ds).toUpperCase() });
    }

    const start = bucketStarts[0];
    const end = bucketEnds[6];
    let periodLabel: string;
    if (offset === 0) {
      periodLabel = it ? 'Questa settimana' : 'This week';
    } else {
      const sun = new Date(bucketStarts[6]);
      if (monday.getMonth() === sun.getMonth()) {
        const mShort = cap(
          new Intl.DateTimeFormat(locale, { month: 'short' }).format(monday).replace(/\.$/, ''),
        );
        periodLabel = it
          ? `${monday.getDate()}–${sun.getDate()} ${mShort}`
          : `${mShort} ${monday.getDate()}–${sun.getDate()}`;
      } else {
        const fmt = new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' });
        periodLabel = `${fmt.format(monday)}–${fmt.format(sun)}`;
      }
    }

    return { range, offset, start, end, bucketStarts, bucketEnds, periodLabel, xLabels };
  }

  // Range 'M': Full calendar month
  const first = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const bucketStarts: number[] = [];
  const bucketEnds: number[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    bucketStarts.push(new Date(first.getFullYear(), first.getMonth(), d).getTime());
    bucketEnds.push(new Date(first.getFullYear(), first.getMonth(), d + 1).getTime());
  }

  const start = bucketStarts[0];
  const end = bucketEnds[daysInMonth - 1];
  let periodLabel: string;
  if (offset === 0) {
    periodLabel = it ? 'Questo mese' : 'This month';
  } else if (first.getFullYear() === now.getFullYear()) {
    periodLabel = cap(new Intl.DateTimeFormat(locale, { month: 'long' }).format(first));
  } else {
    periodLabel = cap(
      new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(first),
    );
  }

  const keyDays = [1, 5, 10, 15, 20, 25];
  if (!keyDays.includes(daysInMonth)) {
    keyDays.push(daysInMonth);
  }
  const xLabels = keyDays
    .filter((d) => d <= daysInMonth)
    .map((d) => ({ index: d - 1, text: String(d) }));

  return { range, offset, start, end, bucketStarts, bucketEnds, periodLabel, xLabels };
}

function inferHistoryMetricKind(entity?: HassEntity): HistoryMetricKind {
  const dc = String(entity?.attributes.device_class ?? '').toLowerCase();
  const unit = String(entity?.attributes.unit_of_measurement ?? '').toLowerCase();
  if (dc === 'temperature' || unit === '°c' || unit === '°f') return 'temperature';
  if (dc === 'moisture') return 'moisture';
  if (dc === 'illuminance' || dc === 'energy' || dc === 'power' || unit === 'lx' || unit === 'lux') {
    return 'illuminance';
  }
  return 'humidity';
}

@customElement('m3e-history-card')
export class M3EHistoryCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3EHistoryCardConfig;
  @state() private _range: BarHistoryRange = 'M';
  @state() private _offset = 0;
  @state() private _loading = false;
  @state() private _values: Array<number | null> = [];
  @state() private _spec?: BarWindowSpec;
  @state() private _plotWidth = 320;
  @state() private _hoverIdx: number | null = null;
  @state() private _prevSlide?: SlideSnapshot;

  @query('.chart-stage') private _stageEl?: HTMLElement;
  @query('.chart-layer.outgoing') private _outgoingEl?: HTMLElement;
  @query('.chart-layer.incoming') private _incomingEl?: HTMLElement;

  private _prevEntity?: HassEntity;
  private _prevExtraSig = '';
  private _cache = new Map<string, Array<number | null>>();
  private _fetchSeq = 0;
  private _lastQueryKey = '';
  private _pendingAnimDir: -1 | 0 | 1 = 0;
  private _ro?: ResizeObserver;
  private _outgoingAnim?: Animation;
  private _incomingAnim?: Animation;
  private _animTimer: number | null = null;

  // Touch/pointer swipe state
  private _swipePointerId: number | null = null;
  private _swipeStartX = 0;
  private _swipeStartY = 0;
  private _swiping = false;
  private _dragOffsetPx = 0;

  public setConfig(config: M3EHistoryCardConfig): void {
    if (!config || !config.entity) {
      throw new Error('m3e-history-card: entity is required');
    }
    const prev = this._config;
    const nextRange: BarHistoryRange = config.default_range === 'W' ? 'W' : 'M';
    if (!prev || prev.entity !== config.entity || prev.aggregation !== config.aggregation) {
      this._cache.clear();
      this._lastQueryKey = '';
      this._values = [];
      this._prevSlide = undefined;
      this._hoverIdx = null;
    }
    if (!prev || prev.default_range !== config.default_range) {
      this._range = nextRange;
      this._offset = 0;
    }
    this._config = {
      chart_style: 'bar',
      default_range: 'M',
      aggregation: 'auto',
      ...config,
    };
  }

  public getCardSize(): number {
    return this._config?.compact ? 4 : 6;
  }

  public getGridOptions() {
    return {
      rows: 'auto' as const,
      columns: 12,
      min_columns: 6,
    };
  }

  public static getStubConfig(hass?: HomeAssistant): M3EHistoryCardConfig {
    const states = hass?.states ?? {};
    const numericSensors = Object.keys(states).filter((id) => {
      if (!id.startsWith('sensor.') && !id.startsWith('counter.')) return false;
      const st = states[id];
      if (!st) return false;
      if (typeof st.attributes?.unit_of_measurement === 'string' && st.attributes.unit_of_measurement) {
        return true;
      }
      const n = Number(st.state);
      return st.state !== '' && Number.isFinite(n);
    });

    const preferred =
      numericSensors.find((id) => {
        const dc = String(states[id]?.attributes.device_class ?? '').toLowerCase();
        return (
          dc === 'duration' ||
          dc === 'energy' ||
          dc === 'power' ||
          dc === 'temperature' ||
          dc === 'humidity'
        );
      }) ??
      numericSensors[0] ??
      'sensor.example';

    return {
      type: 'custom:m3e-history-card',
      entity: preferred,
      chart_style: 'bar',
      default_range: 'M',
    };
  }

  public static getConfigForm() {
    return {
      schema: [
        {
          name: 'entity',
          required: true,
          selector: { entity: { domain: ['sensor', 'counter'] } },
        },
        {
          name: 'chart_style',
          selector: {
            select: {
              mode: 'box',
              options: [
                { value: 'bar', label: 'Capsule Bars (Week / Month)' },
                { value: 'line', label: 'Line & Dots (D / W / M / 3M / Y)' },
              ],
            },
          },
        },
        {
          type: 'expandable',
          name: '',
          flatten: true,
          icon: 'mdi:chart-bar',
          title: 'Content & Data',
          schema: [
            {
              name: 'name',
              selector: { entity_name: {} },
              context: { entity: 'entity' },
            },
            {
              type: 'grid',
              name: '',
              schema: [
                {
                  name: 'default_range',
                  selector: {
                    select: {
                      mode: 'dropdown',
                      options: [
                        { value: 'M', label: 'Month / Mese' },
                        { value: 'W', label: 'Week / Settimana' },
                      ],
                    },
                  },
                },
                {
                  name: 'aggregation',
                  selector: {
                    select: {
                      mode: 'dropdown',
                      options: [
                        { value: 'auto', label: 'Auto (sensor type)' },
                        { value: 'sum', label: 'Daily Total / Delta (sum)' },
                        { value: 'avg', label: 'Daily Average (mean)' },
                        { value: 'max', label: 'Daily Peak (max)' },
                      ],
                    },
                  },
                },
              ],
            },
            { name: 'metric_label', selector: { text: {} } },
            {
              name: 'entities',
              selector: { entity: { multiple: true, domain: ['sensor', 'counter'] } },
            },
          ],
        },
        {
          type: 'expandable',
          name: '',
          flatten: true,
          icon: 'mdi:palette',
          title: 'Appearance',
          schema: [
            {
              name: 'accent_color',
              selector: { ui_color: { default_color: 'state', include_state: true } },
            },
            { name: 'transparent', selector: { boolean: {} } },
            { name: 'compact', selector: { boolean: {} } },
          ],
        },
      ],
      computeLabel: (schema: { name: string }, hass?: HomeAssistant) => {
        const it = isItalian(hass);
        const labels: Record<string, string> = it
          ? {
              entity: 'Entità sensore o contatore',
              chart_style: 'Stile grafico',
              name: 'Nome entità',
              default_range: 'Vista predefinita (Settimana / Mese)',
              aggregation: 'Aggregazione giornaliera',
              metric_label: 'Etichetta unità (es. al giorno (media))',
              entities: 'Sensori extra (per modalità Line & Dots multi-sensore)',
              accent_color: 'Colore tema (controlli e grafico)',
              transparent: 'Sfondo trasparente (ignora stile Material You)',
              compact: 'Modalità compatta (barre più basse)',
            }
          : {
              entity: 'Sensor or Counter Entity',
              chart_style: 'Chart Style',
              name: 'Entity Name',
              default_range: 'Default View (Week / Month)',
              aggregation: 'Daily Aggregation',
              metric_label: 'Metric Label (e.g. per day (avg))',
              entities: 'Extra Sensors (for multi-sensor Line & Dots mode)',
              accent_color: 'Theme Color (Controls & Chart)',
              transparent: 'Transparent background (bypass Material You card style)',
              compact: 'Compact mode (shorter bars)',
            };
        return labels[schema.name] ?? schema.name;
      },
    };
  }

  public connectedCallback(): void {
    super.connectedCallback();
    if (typeof ResizeObserver !== 'undefined') {
      this._ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = Math.round(entry.contentRect.width);
          if (w > 120 && Math.abs(w - this._plotWidth) > 2) {
            this._plotWidth = w;
          }
        }
      });
    }
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._ro?.disconnect();
    this._cancelSlideAnims();
  }

  protected firstUpdated(): void {
    if (this._stageEl && this._ro) {
      this._ro.observe(this._stageEl);
    }
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this._config) return false;
    if (
      changedProps.has('_config') ||
      changedProps.has('_range') ||
      changedProps.has('_offset') ||
      changedProps.has('_loading') ||
      changedProps.has('_values') ||
      changedProps.has('_spec') ||
      changedProps.has('_plotWidth') ||
      changedProps.has('_hoverIdx') ||
      changedProps.has('_prevSlide')
    ) {
      return true;
    }

    if (changedProps.has('hass') && this.hass) {
      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
      if (!oldHass) return true;
      const nextEnt = this.hass.states[this._config.entity];
      const extraSig = (this._config.entities ?? [])
        .map((id) => `${id}:${this.hass?.states[id]?.state ?? ''}`)
        .join('|');
      if (
        nextEnt !== this._prevEntity ||
        extraSig !== this._prevExtraSig ||
        oldHass.language !== this.hass.language ||
        oldHass.themes?.darkMode !== this.hass.themes?.darkMode
      ) {
        return true;
      }
      return false;
    }

    return true;
  }

  protected updated(changedProps: PropertyValues): void {
    if (this._config && this.hass) {
      this._prevEntity = this.hass.states[this._config.entity];
      this._prevExtraSig = (this._config.entities ?? [])
        .map((id) => `${id}:${this.hass?.states[id]?.state ?? ''}`)
        .join('|');
    }

    if (this._stageEl && this._ro) {
      this._ro.observe(this._stageEl);
    }

    if (this._config?.chart_style !== 'line' && this.hass && this._config?.entity) {
      const queryKey = `${this._config.entity}|${this._config.aggregation ?? 'auto'}|${this._range}|${this._offset}`;
      if (queryKey !== this._lastQueryKey) {
        this._lastQueryKey = queryKey;
        void this._loadBarWindow(this._range, this._offset);
      }
    }

    if (
      this._pendingAnimDir !== 0 &&
      this._incomingEl &&
      (changedProps.has('_values') || changedProps.has('_prevSlide') || changedProps.has('_spec'))
    ) {
      const dir = this._pendingAnimDir;
      this._pendingAnimDir = 0;
      this._runCarouselSlide(dir);
    }
  }

  private get _entity(): HassEntity | undefined {
    return this._config?.entity ? this.hass?.states[this._config.entity] : undefined;
  }

  private _getEffectiveMode(entity: HassEntity | undefined): {
    agg: EffectiveAggregation;
    isAdditive: boolean;
    isDuration: boolean;
    unit: string;
  } {
    const unit = String(entity?.attributes.unit_of_measurement ?? '').trim();
    const isDuration = isDurationSensor(entity, unit);
    const configured = this._config?.aggregation ?? 'auto';
    const domain = (this._config?.entity ?? '').split('.')[0];
    const stateClass = String(entity?.attributes.state_class ?? '').toLowerCase();
    const dc = String(entity?.attributes.device_class ?? '').toLowerCase();

    if (configured === 'sum') {
      return { agg: 'sum', isAdditive: true, isDuration, unit };
    }
    if (configured === 'max') {
      return { agg: 'max', isAdditive: isDuration, isDuration, unit };
    }
    if (configured === 'avg') {
      return { agg: 'avg', isAdditive: false, isDuration, unit };
    }

    // Auto-detect
    if (domain === 'counter' || stateClass === 'total_increasing' || stateClass === 'total') {
      return { agg: 'sum', isAdditive: true, isDuration, unit };
    }
    if (dc === 'duration' || isDuration) {
      return { agg: 'max', isAdditive: true, isDuration: true, unit };
    }
    return { agg: 'avg', isAdditive: false, isDuration: false, unit };
  }

  private _cacheKey(range: BarHistoryRange, offset: number): string {
    return `${this._config?.entity ?? ''}|${this._config?.aggregation ?? 'auto'}|${range}|${offset}`;
  }

  private _captureCurrentSlide(): SlideSnapshot | undefined {
    if (!this._spec) return undefined;
    const { isAdditive, isDuration, unit } = this._getEffectiveMode(this._entity);
    return {
      spec: this._spec,
      values: [...this._values],
      isDuration,
      isAdditive,
      unit,
    };
  }

  private _navigate(nextRange: BarHistoryRange, nextOffset: number, dir: -1 | 1): void {
    const clampedOffset = Math.min(0, nextOffset);
    if (nextRange === this._range && clampedOffset === this._offset) return;

    navigator.vibrate?.(6);
    this._hoverIdx = null;
    this._cancelSlideAnims();
    this._prevSlide = this._captureCurrentSlide();

    const nextKey = this._cacheKey(nextRange, clampedOffset);
    const cached = this._cache.get(nextKey);

    this._range = nextRange;
    this._offset = clampedOffset;

    if (cached) {
      // Instant synchronous swap for 0ms silky carousel transition
      this._spec = buildBarWindowSpec(nextRange, clampedOffset, this.hass);
      this._values = [...cached];
      this._loading = false;
      this._lastQueryKey = nextKey;
      this._pendingAnimDir = dir;
    } else {
      this._pendingAnimDir = dir;
    }
  }

  private _setRange(next: BarHistoryRange): void {
    if (this._range === next) return;
    const dir: -1 | 1 = next === 'M' ? 1 : -1;
    this._navigate(next, 0, dir);
  }

  private _stepOffset(delta: -1 | 1): void {
    const next = Math.min(0, this._offset + delta);
    if (next === this._offset) return;
    this._navigate(this._range, next, delta);
  }

  private _resetToPresent(): void {
    if (this._offset === 0) return;
    this._navigate(this._range, 0, 1);
  }

  private _cancelSlideAnims(): void {
    if (this._animTimer !== null) {
      window.clearTimeout(this._animTimer);
      this._animTimer = null;
    }
    this._outgoingAnim?.cancel();
    this._incomingAnim?.cancel();
    this._outgoingAnim = undefined;
    this._incomingAnim = undefined;
  }

  private _runCarouselSlide(dir: -1 | 1): void {
    this._cancelSlideAnims();
    const outEl = this._outgoingEl;
    const inEl = this._incomingEl;
    if (!inEl || typeof inEl.animate !== 'function') {
      this._prevSlide = undefined;
      return;
    }

    const easing = 'cubic-bezier(0.2, 0, 0, 1)';
    const duration = 280;
    const shift = 36;

    if (outEl && typeof outEl.animate === 'function') {
      this._outgoingAnim = outEl.animate(
        [
          { transform: 'translate3d(0, 0, 0)', opacity: 1 },
          { transform: `translate3d(${-dir * shift}%, 0, 0)`, opacity: 0 },
        ],
        { duration, easing, fill: 'forwards' },
      );
    }

    this._incomingAnim = inEl.animate(
      [
        { transform: `translate3d(${dir * shift}%, 0, 0)`, opacity: 0 },
        { transform: 'translate3d(0, 0, 0)', opacity: 1 },
      ],
      { duration, easing, fill: 'both' },
    );

    const finish = () => {
      this._prevSlide = undefined;
      this._outgoingAnim = undefined;
      this._incomingAnim = undefined;
      if (this._animTimer !== null) {
        window.clearTimeout(this._animTimer);
        this._animTimer = null;
      }
    };

    this._incomingAnim.onfinish = finish;
    this._animTimer = window.setTimeout(finish, duration + 40);
  }

  private async _fetchDailyBuckets(
    entityId: string,
    spec: BarWindowSpec,
    mode: EffectiveAggregation,
    isDuration: boolean,
    isAdditive: boolean,
    unit: string,
  ): Promise<Array<number | null>> {
    const nowMs = Date.now();
    const n = spec.bucketStarts.length;
    if (!this.hass || spec.start > nowMs) {
      return Array.from({ length: n }, () => null);
    }

    const startIso = new Date(spec.start).toISOString();
    const endIso = new Date(Math.min(spec.end, nowMs)).toISOString();
    let values: Array<number | null> | null = null;

    if (typeof this.hass.callWS === 'function') {
      try {
        const res = await this.hass.callWS<Record<string, StatRow[]>>({
          type: 'recorder/statistics_during_period',
          start_time: startIso,
          end_time: endIso,
          statistic_ids: [entityId],
          period: 'day',
          types: ['mean', 'max', 'sum', 'state', 'change'],
        });
        const rows = res?.[entityId];
        if (Array.isArray(rows) && rows.length > 0) {
          values = this._bucketStatRows(rows, spec, mode, isDuration, isAdditive, unit, nowMs);
        }
      } catch {
        // fallback below
      }
    }

    if (!values && (spec.offset === 0 || spec.range === 'W')) {
      const raw = await this._fetchRawHistory(entityId, startIso, endIso);
      if (raw.length > 0) {
        values = this._bucketRawRows(raw, spec, mode, isDuration, isAdditive, unit, nowMs);
      }
    }

    if (!values) {
      values = spec.bucketStarts.map((bs) => {
        if (bs > nowMs) return null;
        return isAdditive ? 0 : null;
      });
    }

    return values;
  }

  private async _fetchRawHistory(
    entityId: string,
    startIso: string,
    endIso: string,
  ): Promise<RawHistoryRow[]> {
    if (!this.hass) return [];
    if (typeof this.hass.callWS === 'function') {
      try {
        const res = await this.hass.callWS<Record<string, RawHistoryRow[]>>({
          type: 'history/history_during_period',
          start_time: startIso,
          end_time: endIso,
          entity_ids: [entityId],
          minimal_response: true,
          no_attributes: true,
          significant_changes_only: false,
        });
        const list = res?.[entityId];
        if (Array.isArray(list)) return list;
      } catch {
        // ignore
      }
    }
    if (typeof this.hass.callApi === 'function') {
      try {
        const res = await this.hass.callApi<RawHistoryRow[][]>(
          'GET',
          `history/period/${startIso}?end_time=${encodeURIComponent(endIso)}&filter_entity_id=${encodeURIComponent(entityId)}&minimal_response&no_attributes`,
        );
        if (Array.isArray(res) && Array.isArray(res[0])) return res[0];
      } catch {
        // ignore
      }
    }
    return [];
  }

  private _bucketStatRows(
    rows: StatRow[],
    spec: BarWindowSpec,
    mode: EffectiveAggregation,
    isDuration: boolean,
    isAdditive: boolean,
    unit: string,
    nowMs: number,
  ): Array<number | null> {
    const n = spec.bucketStarts.length;
    const perDay: Array<number | null> = Array.from({ length: n }, () => null);
    let prevSum: number | null = null;

    for (const row of rows) {
      const t = typeof row.start === 'number' ? row.start : Date.parse(String(row.start));
      if (!Number.isFinite(t)) continue;

      let chosen: number | null = null;
      if (mode === 'sum') {
        if (row.change !== null && row.change !== undefined && Number.isFinite(Number(row.change))) {
          chosen = Math.max(0, Number(row.change));
        } else if (row.sum !== null && row.sum !== undefined && Number.isFinite(Number(row.sum))) {
          const curSum = Number(row.sum);
          if (prevSum !== null) {
            chosen = Math.max(0, curSum - prevSum);
          }
          prevSum = curSum;
        } else {
          const fb = row.state ?? row.max ?? row.mean;
          if (fb !== null && fb !== undefined && Number.isFinite(Number(fb))) {
            chosen = Math.max(0, Number(fb));
          }
        }
      } else if (mode === 'max') {
        const v = row.max ?? row.state ?? row.mean;
        if (v !== null && v !== undefined && Number.isFinite(Number(v))) {
          chosen = Number(v);
        }
      } else {
        const v = row.mean ?? row.state ?? row.max;
        if (v !== null && v !== undefined && Number.isFinite(Number(v))) {
          chosen = Number(v);
        }
      }

      if (row.sum !== null && row.sum !== undefined && Number.isFinite(Number(row.sum))) {
        prevSum = Number(row.sum);
      }

      if (chosen === null || t < spec.start || t >= spec.end || t > nowMs) continue;

      const normalized = isDuration ? normalizeDurationToMinutes(chosen, unit) : chosen;
      for (let i = 0; i < n; i++) {
        if (t >= spec.bucketStarts[i] && t < spec.bucketEnds[i]) {
          perDay[i] = isAdditive
            ? (perDay[i] ?? 0) + Math.max(0, normalized)
            : normalized;
          break;
        }
      }
    }

    return spec.bucketStarts.map((bs, i) => {
      if (bs > nowMs) return null;
      if (perDay[i] !== null) return perDay[i];
      return isAdditive ? 0 : null;
    });
  }

  private _bucketRawRows(
    rows: RawHistoryRow[],
    spec: BarWindowSpec,
    mode: EffectiveAggregation,
    isDuration: boolean,
    isAdditive: boolean,
    unit: string,
    nowMs: number,
  ): Array<number | null> {
    const n = spec.bucketStarts.length;
    const perDayRaw: number[][] = Array.from({ length: n }, () => []);

    for (const item of rows) {
      const num = Number(item.s ?? item.state);
      if (!Number.isFinite(num)) continue;
      const t =
        typeof item.lu === 'number'
          ? item.lu * 1000
          : item.last_updated
            ? Date.parse(item.last_updated)
            : NaN;
      if (!Number.isFinite(t) || t < spec.start || t >= spec.end || t > nowMs) continue;

      const normalized = isDuration ? normalizeDurationToMinutes(num, unit) : num;
      for (let i = 0; i < n; i++) {
        if (t >= spec.bucketStarts[i] && t < spec.bucketEnds[i]) {
          perDayRaw[i].push(normalized);
          break;
        }
      }
    }

    return spec.bucketStarts.map((bs, i) => {
      if (bs > nowMs) return null;
      const arr = perDayRaw[i];
      if (arr.length === 0) return isAdditive ? 0 : null;
      if (mode === 'sum') {
        let delta = 0;
        for (let k = 1; k < arr.length; k++) {
          const d = arr[k] - arr[k - 1];
          delta += d >= 0 ? d : arr[k];
        }
        return Math.max(0, delta || arr[arr.length - 1]);
      }
      if (mode === 'max') {
        return Math.max(...arr);
      }
      return arr.reduce((a, b) => a + b, 0) / arr.length;
    });
  }

  private async _loadBarWindow(range: BarHistoryRange, offset: number): Promise<void> {
    if (!this.hass || !this._config?.entity) return;

    const key = this._cacheKey(range, offset);
    const seq = ++this._fetchSeq;
    const spec = buildBarWindowSpec(range, offset, this.hass);
    const { agg, isAdditive, isDuration, unit } = this._getEffectiveMode(this._entity);

    this._spec = spec;
    this._loading = true;

    try {
      const values = await this._fetchDailyBuckets(
        this._config.entity,
        spec,
        agg,
        isDuration,
        isAdditive,
        unit,
      );
      if (seq !== this._fetchSeq) return;
      this._cache.set(key, values);
      this._values = values;
      this._loading = false;

      // Silent prefetch of adjacent previous window for zero-latency swiping
      const prevKey = this._cacheKey(range, offset - 1);
      if (!this._cache.has(prevKey)) {
        const prevSpec = buildBarWindowSpec(range, offset - 1, this.hass);
        void this._fetchDailyBuckets(
          this._config.entity,
          prevSpec,
          agg,
          isDuration,
          isAdditive,
          unit,
        ).then((pv) => {
          this._cache.set(prevKey, pv);
        });
      }
    } catch {
      if (seq !== this._fetchSeq) return;
      this._values = spec.bucketStarts.map(() => null);
      this._loading = false;
    }
  }

  /* =========================================================================
     HORIZONTAL SWIPE GESTURE ON CHART STAGE (touch-action: pan-y)
     ========================================================================= */
  private _onStagePointerDown(e: PointerEvent): void {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    this._swipePointerId = e.pointerId;
    this._swipeStartX = e.clientX;
    this._swipeStartY = e.clientY;
    this._swiping = false;
    this._dragOffsetPx = 0;
  }

  private _onStagePointerMove(e: PointerEvent): void {
    if (this._swipePointerId !== e.pointerId) return;
    const dx = e.clientX - this._swipeStartX;
    const dy = e.clientY - this._swipeStartY;

    if (!this._swiping && Math.abs(dx) > 14 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      this._swiping = true;
      this._hoverIdx = null;
      this._stageEl?.setPointerCapture?.(e.pointerId);
    }

    if (this._swiping && this._incomingEl) {
      const factor = this._offset === 0 && dx < 0 ? 0.1 : 0.3;
      this._dragOffsetPx = Math.max(-44, Math.min(44, dx * factor));
      this._incomingEl.style.transform = `translate3d(${this._dragOffsetPx.toFixed(1)}px, 0, 0)`;
    }
  }

  private _onStagePointerEnd(e: PointerEvent): void {
    if (this._swipePointerId !== e.pointerId) return;
    const dx = e.clientX - this._swipeStartX;
    const wasSwiping = this._swiping;

    this._swipePointerId = null;
    this._swiping = false;
    this._dragOffsetPx = 0;

    if (this._incomingEl) {
      this._incomingEl.style.transform = '';
    }

    if (wasSwiping && Math.abs(dx) >= 42) {
      if (dx > 0) {
        this._stepOffset(-1);
      } else if (this._offset < 0) {
        this._stepOffset(1);
      }
    }
  }

  /* =========================================================================
     SUMMARY STATS & SVG LAYER RENDERING
     ========================================================================= */
  private _computeWindowSummary(
    spec: BarWindowSpec,
    values: Array<number | null>,
    isDuration: boolean,
    isAdditive: boolean,
    unit: string,
  ): {
    heroText: string;
    heroLabel: string;
    subtitleText: string;
    hasPositiveBars: boolean;
    maxBarVal: number;
  } {
    const it = isItalian(this.hass);
    const nowMs = Date.now();
    const customLabel = this._config?.metric_label?.trim();

    if (isAdditive) {
      let total = 0;
      let maxVal = 0;
      let elapsedDays = 0;

      for (let i = 0; i < spec.bucketStarts.length; i++) {
        if (spec.bucketStarts[i] <= nowMs) {
          elapsedDays++;
        }
        const v = values[i];
        if (v !== null && v > 0) {
          total += v;
          if (v > maxVal) maxVal = v;
        }
      }

      const denom = Math.max(1, elapsedDays);
      const avgPerDay = total / denom;
      const hasPositiveBars = maxVal > 0;

      const heroText = isDuration
        ? formatHeroDuration(avgPerDay)
        : formatNumericWithUnit(avgPerDay, unit, this.hass);
      const heroLabel = customLabel || (it ? 'al giorno (media)' : 'per day (avg)');

      let subtitleText: string;
      if (!hasPositiveBars) {
        subtitleText = it
          ? 'Nessun dato registrato in questo periodo'
          : 'No data tracked in this period';
      } else {
        const totalStr = isDuration
          ? formatSubtitleDuration(total, it)
          : formatNumericWithUnit(total, unit, this.hass);
        if (spec.offset === 0) {
          subtitleText = it
            ? `Totale di ${totalStr} finora ${spec.range === 'M' ? 'questo mese' : 'questa settimana'}`
            : `Total of ${totalStr} so far this ${spec.range === 'M' ? 'month' : 'week'}`;
        } else {
          subtitleText = it
            ? `Totale di ${totalStr} in questo periodo`
            : `Total of ${totalStr} in this period`;
        }
      }

      return { heroText, heroLabel, subtitleText, hasPositiveBars, maxBarVal: maxVal };
    }

    // Intensive measurement (mean / max)
    const valid = values.filter((v): v is number => v !== null && Number.isFinite(v));
    if (valid.length === 0) {
      return {
        heroText: it ? 'Nessun dato' : 'No data',
        heroLabel: customLabel || '',
        subtitleText: it
          ? 'Nessun dato registrato in questo periodo'
          : 'No data tracked in this period',
        hasPositiveBars: false,
        maxBarVal: 0,
      };
    }

    const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
    const minVal = Math.min(...valid);
    const maxVal = Math.max(...valid);
    const hasPositiveBars = maxVal > 0;

    const heroText = formatNumericWithUnit(avg, unit, this.hass);
    const heroLabel = customLabel || (it ? 'al giorno (media)' : 'per day (avg)');
    const minStr = formatNumericWithUnit(minVal, unit, this.hass);
    const maxStr = formatNumericWithUnit(maxVal, unit, this.hass);
    const subtitleText = it
      ? `Escursione da ${minStr} a ${maxStr} nel periodo`
      : `Range from ${minStr} to ${maxStr} in this period`;

    return { heroText, heroLabel, subtitleText, hasPositiveBars, maxBarVal: maxVal };
  }

  private _renderCapsuleSvg(slide: SlideSnapshot, interactive: boolean) {
    const { spec, values, isDuration, unit } = slide;
    const isCompact = Boolean(this._config?.compact);
    const n = Math.max(1, spec.bucketStarts.length);
    const W = Math.max(240, this._plotWidth);
    const H = isCompact ? 152 : 228;
    const padL = 6;
    const padR = 46;
    const padT = isCompact ? 14 : 18;
    const dotY = H - (isCompact ? 20 : 22);
    const xLabelY = H - 4;
    const barBottomY = dotY - (isCompact ? 6 : 7);
    const plotW = Math.max(120, W - padL - padR);
    const plotH = Math.max(48, barBottomY - padT);
    const slotW = plotW / n;

    const barW =
      spec.range === 'W'
        ? Math.max(18, Math.min(28, slotW * 0.54))
        : Math.max(5, Math.min(8, slotW * 0.62));
    const rx = barW / 2;

    const positiveVals = values.filter((v): v is number => v !== null && v > 0);
    const hasPositive = positiveVals.length > 0;
    const rawMax = hasPositive ? Math.max(...positiveVals) : 0;
    const yMax = rawMax > 0 ? Math.max(rawMax * 1.08, isDuration ? Math.ceil(rawMax) : rawMax) : 1;

    const yTicks = hasPositive
      ? [0, 1, 2, 3].map((i) => {
          const ratio = i / 3;
          const val = ratio * yMax;
          return {
            y: barBottomY - ratio * plotH,
            label: formatYTick(val, isDuration, unit, this.hass),
          };
        })
      : [];

    const xCenter = (i: number) => padL + (i + 0.5) * slotW;
    const it = isItalian(this.hass);
    const locale = it ? 'it-IT' : 'en-US';
    const hoverIdx = interactive ? this._hoverIdx : null;

    return svg`
      <svg class="chart-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label=${spec.periodLabel}>
        <!-- Minimal right-aligned Y-axis labels (completely hidden when no data) -->
        ${yTicks.map(
          (tick) => svg`
            <text
              x=${W - 2}
              y=${(tick.y + 4).toFixed(1)}
              text-anchor="end"
              class="y-tick-label"
            >${tick.label}</text>
          `,
        )}

        <!-- X-axis scan dots & day labels -->
        ${spec.bucketStarts.map((_, idx) => {
          const cx = xCenter(idx);
          return svg`<circle cx=${cx.toFixed(1)} cy=${dotY} r="1.35" class="x-scan-dot" />`;
        })}

        ${spec.xLabels.map((lbl) => {
          const tx = xCenter(lbl.index);
          return svg`
            <text
              x=${tx.toFixed(1)}
              y=${xLabelY}
              text-anchor="middle"
              class="x-tick-label"
            >${lbl.text}</text>
          `;
        })}

        <!-- Floating Vertical Capsule Bars (Stadium ends) -->
        ${values.map((val, idx) => {
          if (val === null || val <= 0) return nothing;
          const cx = xCenter(idx);
          const scaledH = (val / yMax) * plotH;
          const barH = Math.max(barW, Math.min(plotH, scaledH));
          const yTop = barBottomY - barH;
          const isHovered = hoverIdx === idx;
          const dimmed = hoverIdx !== null && hoverIdx !== idx;
          const dayLabel = new Intl.DateTimeFormat(locale, {
            day: 'numeric',
            month: 'short',
          }).format(new Date(spec.bucketStarts[idx]));
          const valLabel = isDuration
            ? formatHeroDuration(val)
            : formatNumericWithUnit(val, unit, this.hass);

          return svg`
            <g class="bar-group ${dimmed ? 'is-dimmed' : ''} ${isHovered ? 'is-hovered' : ''}">
              <rect
                class="capsule-bar"
                x=${(cx - barW / 2).toFixed(2)}
                y=${yTop.toFixed(2)}
                width=${barW.toFixed(2)}
                height=${barH.toFixed(2)}
                rx=${rx.toFixed(2)}
                ry=${rx.toFixed(2)}
                style="transform-origin: ${cx.toFixed(1)}px ${barBottomY}px;"
              />
              ${interactive
                ? svg`
                    <rect
                      x=${(padL + idx * slotW).toFixed(1)}
                      y=${padT}
                      width=${slotW.toFixed(1)}
                      height=${(dotY - padT).toFixed(1)}
                      fill="transparent"
                      class="bar-hit"
                      @pointerenter=${(ev: PointerEvent) => {
                        if (ev.pointerType !== 'touch') this._hoverIdx = idx;
                      }}
                      @pointerleave=${(ev: PointerEvent) => {
                        if (ev.pointerType !== 'touch' && this._hoverIdx === idx) {
                          this._hoverIdx = null;
                        }
                      }}
                      @click=${(ev: Event) => {
                        ev.stopPropagation();
                        this._hoverIdx = this._hoverIdx === idx ? null : idx;
                      }}
                    >
                      <title>${dayLabel}: ${valLabel}</title>
                    </rect>
                  `
                : nothing}
            </g>
          `;
        })}

        <!-- Floating Tooltip Pill on Bar Hover/Tap -->
        ${hoverIdx !== null && values[hoverIdx] !== null && (values[hoverIdx] ?? 0) > 0
          ? (() => {
              const v = values[hoverIdx] as number;
              const cx = xCenter(hoverIdx);
              const scaledH = (v / yMax) * plotH;
              const barH = Math.max(barW, Math.min(plotH, scaledH));
              const tipY = Math.max(12, barBottomY - barH - 8);
              const dLbl = new Intl.DateTimeFormat(locale, {
                day: 'numeric',
                month: 'short',
              }).format(new Date(spec.bucketStarts[hoverIdx]));
              const vLbl = isDuration
                ? formatHeroDuration(v)
                : formatNumericWithUnit(v, unit, this.hass);
              const txt = `${dLbl} · ${vLbl}`;
              const estW = Math.max(68, txt.length * 6.5 + 16);
              const tipX = Math.max(estW / 2 + 2, Math.min(W - padR - estW / 2, cx));
              return svg`
                <g class="bar-tooltip" pointer-events="none">
                  <rect
                    x=${(tipX - estW / 2).toFixed(1)}
                    y=${(tipY - 14).toFixed(1)}
                    width=${estW.toFixed(1)}
                    height="20"
                    rx="10"
                    class="tooltip-bg"
                  />
                  <text
                    x=${tipX.toFixed(1)}
                    y=${(tipY - 1).toFixed(1)}
                    text-anchor="middle"
                    class="tooltip-txt"
                  >${txt}</text>
                </g>
              `;
            })()
          : nothing}
      </svg>
    `;
  }

  private _renderBarMode() {
    const it = isItalian(this.hass);
    const entity = this._entity;
    const { isAdditive, isDuration, unit } = this._getEffectiveMode(entity);
    const spec = this._spec ?? buildBarWindowSpec(this._range, this._offset, this.hass);
    const summary = this._computeWindowSummary(spec, this._values, isDuration, isAdditive, unit);
    const isDark = this.hass?.themes?.darkMode !== false;

    const colorInput = this._config?.accent_color ?? this._config?.bar_color;
    const themePal = colorInput ? buildM3BadgeTonalPalette(colorInput, isDark) : null;

    const tabAccent = themePal?.accent ?? (isDark ? '#97D0F9' : '#BFE4FF');
    const tabOnAccent = themePal?.onAccent ?? '#003351';
    const barColor = themePal?.accent ?? (isDark ? '#2CE0D0' : '#00BFA5');

    const activeSlide: SlideSnapshot = {
      spec,
      values: this._values,
      isDuration,
      isAdditive,
      unit,
    };

    const weekLabel = it ? 'Settimana' : 'Week';
    const monthLabel = it ? 'Mese' : 'Month';
    const entityTitle = resolveEntityName(
      this.hass,
      entity,
      this._config?.name,
      this._config?.entity,
    );

    return html`
      <div
        class="history-root"
        style="--history-tab-accent: ${tabAccent}; --history-tab-on-accent: ${tabOnAccent}; --history-bar-color: ${barColor};"
        @click=${() => {
          if (this._hoverIdx !== null) this._hoverIdx = null;
        }}
      >
        <!-- 1. Top Dual Segmented Control (Week | Month) -->
        <div
          class="dual-tabs"
          role="tablist"
          aria-label=${it ? 'Intervallo temporale' : 'Time range'}
        >
          <button
            type="button"
            role="tab"
            class="dual-tab ${this._range === 'W' ? 'is-selected' : ''}"
            aria-selected=${String(this._range === 'W')}
            @click=${() => this._setRange('W')}
          >
            ${weekLabel}
          </button>
          <button
            type="button"
            role="tab"
            class="dual-tab ${this._range === 'M' ? 'is-selected' : ''}"
            aria-selected=${String(this._range === 'M')}
            @click=${() => this._setRange('M')}
          >
            ${monthLabel}
          </button>
        </div>

        <!-- 2. Contextual Header & Chronological Navigation -->
        <div class="header-block">
          <div class="period-row">
            <span class="period-title">
              ${this._offset === 0
                ? entityTitle
                : html`${entityTitle}<span class="period-suffix"> · ${spec.periodLabel}</span>`}
            </span>
            <div class="nav-controls">
              <button
                type="button"
                class="nav-circle"
                aria-label=${it ? 'Periodo precedente' : 'Previous period'}
                @click=${() => this._stepOffset(-1)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59Z" />
                </svg>
              </button>
              <button
                type="button"
                class="nav-circle"
                ?disabled=${this._offset === 0}
                aria-label=${it ? 'Periodo successivo' : 'Next period'}
                @click=${() => this._stepOffset(1)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6Z" />
                </svg>
              </button>
              <button
                type="button"
                class="nav-circle ${this._offset < 0 ? 'is-highlighted' : ''}"
                ?disabled=${this._offset === 0}
                aria-label=${it ? 'Torna al presente' : 'Jump to present'}
                @click=${() => this._resetToPresent()}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18Zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12Z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="hero-row">
            <span class="hero-val">${summary.heroText}</span>
            ${summary.heroLabel
              ? html`<span class="hero-lbl">${summary.heroLabel}</span>`
              : nothing}
          </div>

          <div class="hero-subtitle">${summary.subtitleText}</div>
        </div>

        <!-- 3. Dual-Layer Carousel Capsule Bar Chart -->
        <div
          class="chart-stage ${this._loading && !this._prevSlide ? 'is-loading' : ''}"
          @pointerdown=${this._onStagePointerDown}
          @pointermove=${this._onStagePointerMove}
          @pointerup=${this._onStagePointerEnd}
          @pointercancel=${this._onStagePointerEnd}
        >
          ${this._prevSlide
            ? html`<div class="chart-layer outgoing">${this._renderCapsuleSvg(this._prevSlide, false)}</div>`
            : nothing}
          <div class="chart-layer incoming">${this._renderCapsuleSvg(activeSlide, true)}</div>
        </div>
      </div>
    `;
  }

  private _renderLineMode() {
    const primary = this._config?.entity;
    if (!primary || !this.hass) return nothing;

    const ent = this.hass.states[primary];
    const ids: string[] = [];

    const rawGroup = ent?.attributes.entity_id;
    if (Array.isArray(rawGroup) && rawGroup.length > 0) {
      for (const m of rawGroup) {
        if (typeof m === 'string' && this.hass.states[m] && !ids.includes(m)) {
          ids.push(m);
        }
      }
    }
    if (ids.length === 0) ids.push(primary);

    for (const extra of this._config?.entities ?? []) {
      if (extra && !ids.includes(extra)) ids.push(extra);
    }

    const firstEnt = this.hass.states[ids[0]] ?? ent;
    const metricKind = inferHistoryMetricKind(firstEnt);
    const unit = String(firstEnt?.attributes.unit_of_measurement ?? '').trim();

    const colorInput = this._config?.accent_color ?? this._config?.bar_color;
    const entityTitle = resolveEntityName(this.hass, ent, this._config?.name, primary);

    return html`
      <m3e-history-chart
        .hass=${this.hass}
        .entityIds=${ids}
        .metricKind=${metricKind}
        .unit=${unit}
        .customColor=${colorInput}
        .headerTitle=${entityTitle}
        .compact=${Boolean(this._config?.compact)}
      ></m3e-history-chart>
    `;
  }

  protected render() {
    if (!this._config) return nothing;
    return html`
      <ha-card
        class="history-card ${this._config.transparent ? 'is-transparent' : ''} ${this._config.compact ? 'is-compact' : ''}"
      >
        ${this._config.chart_style === 'line' ? this._renderLineMode() : this._renderBarMode()}
      </ha-card>
    `;
  }

  static styles = [
    m3eBaseStyles,
    css`
      :host {
        display: block;
        width: 100%;
      }

      /* Strictly preserve M3Y --ha-card-* tokens unless user explicitly opts into transparent */
      .history-card {
        padding: 18px 18px 16px;
        display: flex;
        flex-direction: column;
      }

      ha-card.history-card.is-transparent {
        --ha-card-background: transparent;
        --ha-card-box-shadow: none;
        --ha-card-border-width: 0px;
        --ha-card-border-color: transparent;
        background: transparent;
        box-shadow: none;
        border-width: 0;
        border-color: transparent;
        padding: 6px 4px 4px;
      }

      .history-root {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      /* 1. Dual Segmented Control (Week | Month) */
      .dual-tabs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        width: 100%;
      }

      .dual-tab {
        height: 40px;
        border: 0;
        padding: 0 12px;
        border-radius: 12px;
        background: var(--md-sys-color-surface-container-high, #23262a);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font: inherit;
        font-size: 0.9375rem;
        font-weight: 500;
        display: grid;
        place-items: center;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        transition:
          border-radius 320ms cubic-bezier(0.2, 0, 0, 1),
          background-color 240ms cubic-bezier(0.2, 0, 0, 1),
          color 200ms cubic-bezier(0.2, 0, 0, 1),
          transform var(--m3e-spring-spatial-fast, 200ms cubic-bezier(0.2, 0, 0, 1));
      }

      .dual-tab:hover:not(.is-selected) {
        filter: brightness(1.08);
      }

      .dual-tab.is-selected {
        border-radius: 20px;
        background: var(--history-tab-accent);
        color: var(--history-tab-on-accent);
        font-weight: 600;
      }

      .dual-tab:active {
        transform: scale(0.96);
      }

      /* 2. Contextual Header */
      .header-block {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .period-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .period-title {
        font-size: 1.15rem;
        font-weight: 500;
        line-height: 1.25;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .period-suffix {
        font-weight: 400;
        color: var(--md-sys-color-on-surface-variant, #c4c7c5);
      }

      .nav-controls {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
      }

      .nav-circle {
        width: 36px;
        height: 36px;
        border: 0;
        padding: 0;
        border-radius: 50%;
        background: var(--md-sys-color-surface-container-high, #23262a);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        transition:
          opacity 180ms ease,
          background-color 180ms ease,
          color 180ms ease,
          transform var(--m3e-spring-spatial-fast, 200ms ease);
      }

      .nav-circle:disabled {
        opacity: 0.35;
        cursor: default;
      }

      .nav-circle.is-highlighted {
        background: color-mix(
          in srgb,
          var(--history-tab-accent) 22%,
          var(--md-sys-color-surface-container-high, #23262a)
        );
        color: var(--history-tab-accent);
      }

      .nav-circle:not(:disabled):active {
        transform: scale(0.9);
      }

      .nav-circle svg {
        width: 20px;
        height: 20px;
      }

      .hero-row {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 2px;
      }

      .hero-val {
        font-size: 2.4rem;
        font-weight: 600;
        line-height: 1.08;
        letter-spacing: -0.025em;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      .hero-lbl {
        font-size: 1rem;
        font-weight: 500;
        color: var(--md-sys-color-on-surface-variant, #c4c7c5);
      }

      .hero-subtitle {
        font-size: 0.875rem;
        line-height: 1.38;
        color: var(--md-sys-color-on-surface-variant, #c4c7c5);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      /* 3. Carousel Capsule Chart Stage */
      .chart-stage {
        position: relative;
        width: 100%;
        height: 228px;
        overflow: hidden;
        touch-action: pan-y;
        transition: opacity 180ms ease;
      }

      .chart-stage.is-loading {
        opacity: 0.45;
      }

      .chart-layer {
        width: 100%;
        height: 100%;
        will-change: transform, opacity;
      }

      .chart-layer.outgoing {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      .chart-layer.outgoing .capsule-bar {
        animation: none;
      }

      .chart-layer.incoming {
        position: relative;
      }

      .chart-svg {
        width: 100%;
        height: 100%;
        display: block;
        overflow: visible;
      }

      .y-tick-label {
        font-size: 0.75rem;
        font-weight: 500;
        fill: var(--md-sys-color-outline, #8e918f);
        font-variant-numeric: tabular-nums;
      }

      .x-scan-dot {
        fill: var(--md-sys-color-outline-variant, #5c5f5e);
      }

      .x-tick-label {
        font-size: 0.75rem;
        font-weight: 500;
        fill: var(--md-sys-color-outline, #8e918f);
        font-variant-numeric: tabular-nums;
      }

      @keyframes m3e-capsule-rise {
        from {
          transform: scaleY(0.18);
          opacity: 0.5;
        }
        to {
          transform: scaleY(1);
          opacity: 1;
        }
      }

      .bar-group {
        transition: opacity 160ms ease;
      }

      .bar-group.is-dimmed {
        opacity: 0.42;
      }

      .capsule-bar {
        fill: var(--history-bar-color);
        animation: m3e-capsule-rise 360ms var(--m3e-spring-spatial-default, cubic-bezier(0.2, 0, 0, 1)) both;
        transition: filter 160ms ease;
      }

      .bar-group.is-hovered .capsule-bar {
        filter: brightness(1.12);
      }

      .bar-hit {
        cursor: pointer;
      }

      .tooltip-bg {
        fill: var(--md-sys-color-inverse-surface, #e3e2e6);
      }

      .tooltip-txt {
        font-size: 11px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        fill: var(--md-sys-color-inverse-on-surface, #1b1b1f);
      }

      /* Compact Mode (shorter bars & tighter vertical rhythm) */
      .history-card.is-compact:not(.is-transparent) {
        padding: 14px 16px 12px;
      }

      .history-card.is-compact .history-root {
        gap: 10px;
      }

      .history-card.is-compact .dual-tab {
        height: 36px;
      }

      .history-card.is-compact .dual-tab.is-selected {
        border-radius: 18px;
      }

      .history-card.is-compact .hero-val {
        font-size: 2rem;
      }

      .history-card.is-compact .chart-stage {
        height: 152px;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-history-card': M3EHistoryCard;
  }
}
