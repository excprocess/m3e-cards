import { LitElement, css, html, svg, nothing, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import type { HassEntity, HomeAssistant } from '../types/home-assistant';
import { buildM3BadgeTonalPalette, type BadgeColorInput } from '../utils/m3-color-harmony';

export type HistoryRange = 'D' | 'W' | 'M' | '3M' | 'Y';
export type HistoryMetricKind = 'temperature' | 'humidity' | 'illuminance' | 'moisture';

interface BucketPoint {
  t: number;
  v: number | null;
  min: number | null;
  max: number | null;
}

interface SeriesData {
  entityId: string;
  label: string;
  color: string;
  buckets: BucketPoint[];
}

interface WindowSpec {
  start: number;
  end: number;
  bucketStarts: number[];
  bucketEnds: number[];
  periodLabel: string;
  xLabels: Array<{ index: number; text: string }>;
}

const RANGES: HistoryRange[] = ['D', 'W', 'M', '3M', 'Y'];

interface MetricPalette {
  accentDark: string;
  onAccentDark: string;
  accentLight: string;
  onAccentLight: string;
  lineDark: string;
  lineLight: string;
  cumulative: string[];
}

const METRIC_THEME: Record<HistoryMetricKind, MetricPalette> = {
  illuminance: {
    accentDark: '#FFD54F',
    onAccentDark: '#3E2700',
    accentLight: '#FFE082',
    onAccentLight: '#3E2700',
    lineDark: '#FFA726',
    lineLight: '#EF6C00',
    cumulative: ['#F57C00', '#FB8C00', '#FFB300', '#FFD54F', '#FF9800', '#FFE082'],
  },
  humidity: {
    accentDark: '#90CAF9',
    onAccentDark: '#002F54',
    accentLight: '#90CAF9',
    onAccentLight: '#002F54',
    lineDark: '#42A5F5',
    lineLight: '#1E88E5',
    cumulative: ['#1565C0', '#1E88E5', '#42A5F5', '#64B5F6', '#81D4FA', '#B3E5FC'],
  },
  moisture: {
    accentDark: '#A5D6A7',
    onAccentDark: '#0A3818',
    accentLight: '#A5D6A7',
    onAccentLight: '#0A3818',
    lineDark: '#4CAF50',
    lineLight: '#2E7D32',
    cumulative: ['#1B5E20', '#2E7D32', '#43A047', '#66BB6A', '#81C784', '#A5D6A7'],
  },
  temperature: {
    accentDark: '#FFAB91',
    onAccentDark: '#4A1108',
    accentLight: '#FFAB91',
    onAccentLight: '#4A1108',
    lineDark: '#E64A19',
    lineLight: '#C62828',
    cumulative: ['#9B1B30', '#C62828', '#E53935', '#E64A19', '#F57C00', '#FF9800'],
  },
};

function isItalian(hass?: HomeAssistant): boolean {
  return String(hass?.language ?? '').toLowerCase().startsWith('it');
}

function cleanSensorLabel(entity: HassEntity | undefined, fallbackId: string): string {
  const friendly = String(entity?.attributes.friendly_name ?? '').trim();
  return friendly || fallbackId;
}

function formatNum(val: number, kind: HistoryMetricKind, hass?: HomeAssistant): string {
  const decimals = kind === 'illuminance' ? 0 : kind === 'temperature' ? 1 : Number.isInteger(val) ? 0 : 1;
  const locale = isItalian(hass) ? 'it-IT' : undefined;
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

function formatWithUnit(
  val: number,
  kind: HistoryMetricKind,
  unit: string,
  hass?: HomeAssistant,
): string {
  const numStr = formatNum(val, kind, hass);
  const u = unit.trim();
  if (!u) return numStr;
  return u === '%' ? `${numStr} %` : `${numStr} ${u}`;
}

function buildWindowSpec(
  range: HistoryRange,
  offset: number,
  hass?: HomeAssistant,
): WindowSpec {
  const it = isItalian(hass);
  const locale = it ? 'it-IT' : 'en-US';
  const now = new Date();

  if (range === 'D') {
    const base = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    const start = base.getTime();
    const bucketStarts: number[] = [];
    const bucketEnds: number[] = [];
    for (let h = 0; h < 24; h++) {
      const bs = new Date(base.getFullYear(), base.getMonth(), base.getDate(), h).getTime();
      const be = new Date(base.getFullYear(), base.getMonth(), base.getDate(), h + 1).getTime();
      bucketStarts.push(bs);
      bucketEnds.push(be);
    }
    const end = bucketEnds[23];
    const periodLabel =
      offset === 0
        ? it
          ? 'Oggi'
          : 'Today'
        : offset === -1
          ? it
            ? 'Ieri'
            : 'Yesterday'
          : new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(base);

    const xLabels = [0, 6, 12, 18, 23].map((idx) => ({
      index: idx,
      text: `${String(idx).padStart(2, '0')}:00`,
    }));

    return { start, end, bucketStarts, bucketEnds, periodLabel, xLabels };
  }

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
    for (let d = 0; d < 7; d++) {
      const ds = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + d);
      const de = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + d + 1);
      bucketStarts.push(ds.getTime());
      bucketEnds.push(de.getTime());
      const shortDay = new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(ds);
      xLabels.push({
        index: d,
        text: shortDay.charAt(0).toUpperCase() + shortDay.slice(1, 3),
      });
    }
    const start = bucketStarts[0];
    const end = bucketEnds[6];
    let periodLabel: string;
    if (offset === 0) {
      periodLabel = it ? 'Questa settimana' : 'This week';
    } else if (offset === -1) {
      periodLabel = it ? 'Settimana scorsa' : 'Last week';
    } else {
      const sun = new Date(bucketStarts[6]);
      const fmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' });
      periodLabel = `${fmt.format(monday)} – ${fmt.format(sun)}`;
    }
    return { start, end, bucketStarts, bucketEnds, periodLabel, xLabels };
  }

  if (range === 'M') {
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
    const monthName = new Intl.DateTimeFormat(locale, { month: 'long' }).format(first);
    const periodLabel =
      offset === 0
        ? it
          ? 'Questo mese'
          : 'This month'
        : monthName.charAt(0).toUpperCase() + monthName.slice(1);

    const keyDays = [1, 5, 10, 15, 20, 25];
    if (!keyDays.includes(daysInMonth)) {
      keyDays.push(daysInMonth);
    }
    const xLabels = keyDays
      .filter((d) => d <= daysInMonth)
      .map((d) => ({ index: d - 1, text: String(d) }));

    return { start, end, bucketStarts, bucketEnds, periodLabel, xLabels };
  }

  if (range === '3M') {
    const endMonthStart = new Date(now.getFullYear(), now.getMonth() + offset * 3, 1);
    const startMonth = new Date(endMonthStart.getFullYear(), endMonthStart.getMonth() - 2, 1);
    const endMonthExclusive = new Date(
      endMonthStart.getFullYear(),
      endMonthStart.getMonth() + 1,
      1,
    );
    const start = startMonth.getTime();
    const end = endMonthExclusive.getTime();

    const weekCount = 13;
    const stepMs = (end - start) / weekCount;
    const bucketStarts: number[] = [];
    const bucketEnds: number[] = [];
    for (let i = 0; i < weekCount; i++) {
      bucketStarts.push(Math.round(start + i * stepMs));
      bucketEnds.push(Math.round(start + (i + 1) * stepMs));
    }

    const fmtM = new Intl.DateTimeFormat(locale, { month: 'short' });
    const fmtFullM = new Intl.DateTimeFormat(locale, { month: 'long' });
    const m0 = fmtM.format(startMonth).replace(/\.$/, '');
    const m2 = fmtM.format(endMonthStart).replace(/\.$/, '');
    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    const periodLabel = `${cap(m0)}–${cap(m2)}`;

    const xLabels: Array<{ index: number; text: string }> = [0, 1, 2].map((mi) => {
      const d = new Date(startMonth.getFullYear(), startMonth.getMonth() + mi, 1);
      const t = d.getTime();
      const idx = Math.max(0, Math.min(weekCount - 1, Math.round(((t - start) / (end - start)) * (weekCount - 1))));
      const lbl = fmtFullM.format(d);
      return { index: idx, text: cap(lbl) };
    });

    return { start, end, bucketStarts, bucketEnds, periodLabel, xLabels };
  }

  // Range 'Y': 12 monthly buckets
  const year = now.getFullYear() + offset;
  const bucketStarts: number[] = [];
  const bucketEnds: number[] = [];
  for (let m = 0; m < 12; m++) {
    bucketStarts.push(new Date(year, m, 1).getTime());
    bucketEnds.push(new Date(year, m + 1, 1).getTime());
  }
  const start = bucketStarts[0];
  const end = bucketEnds[11];
  const periodLabel = String(year);
  const fmtM = new Intl.DateTimeFormat(locale, { month: 'short' });
  const xLabels = [0, 3, 6, 9, 11].map((idx) => {
    const raw = fmtM.format(new Date(year, idx, 1)).replace(/\.$/, '');
    return { index: idx, text: raw.charAt(0).toUpperCase() + raw.slice(1) };
  });

  return { start, end, bucketStarts, bucketEnds, periodLabel, xLabels };
}

@customElement('m3e-history-chart')
export class M3EHistoryChart extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public entityIds: string[] = [];
  @property({ type: String }) public metricKind: HistoryMetricKind = 'temperature';
  @property({ type: String }) public unit = '';
  @property({ attribute: false }) public customColor?: BadgeColorInput;
  @property({ type: String }) public headerTitle = '';
  @property({ type: Boolean }) public compact = false;

  @state() private _range: HistoryRange = 'D';
  @state() private _offset = 0;
  @state() private _loading = false;
  @state() private _series: SeriesData[] = [];
  @state() private _isolatedEntityId: string | null = null;
  @state() private _spec?: WindowSpec;
  @state() private _plotWidth = 340;

  @query('.chart-area') private _chartAreaEl?: HTMLElement;

  private _fetchSeq = 0;
  private _lastQueryKey = '';
  private _ro?: ResizeObserver;

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
  }

  protected firstUpdated(): void {
    if (this._chartAreaEl && this._ro) {
      this._ro.observe(this._chartAreaEl);
    }
  }

  protected updated(changedProps: PropertyValues): void {
    if (
      changedProps.has('entityIds') ||
      changedProps.has('_range') ||
      changedProps.has('_offset') ||
      changedProps.has('metricKind') ||
      (changedProps.has('hass') && !this._lastQueryKey && this.hass)
    ) {
      if (changedProps.has('entityIds')) {
        this._isolatedEntityId = null;
      }
      const nextKey = `${this.entityIds.join(',')}|${this._range}|${this._offset}`;
      if (nextKey !== this._lastQueryKey && this.hass && this.entityIds.length > 0) {
        this._lastQueryKey = nextKey;
        void this._fetchData();
      }
    }
  }

  private _setRange(next: HistoryRange): void {
    if (this._range === next) return;
    navigator.vibrate?.(6);
    this._range = next;
    this._offset = 0;
  }

  private _stepOffset(delta: -1 | 1): void {
    const next = Math.min(0, this._offset + delta);
    if (next === this._offset) return;
    navigator.vibrate?.(6);
    this._offset = next;
  }

  private _resetToPresent(): void {
    if (this._offset === 0) return;
    navigator.vibrate?.(6);
    this._offset = 0;
  }

  private async _fetchHistoryRaw(
    startIso: string,
    endIso: string,
    ids: string[],
  ): Promise<Record<string, Array<{ s?: string; lu?: number; state?: string; last_updated?: string }>>> {
    if (!this.hass) return {};
    if (typeof this.hass.callWS === 'function') {
      try {
        const res = await this.hass.callWS<
          Record<string, Array<{ s?: string; lu?: number }>>
        >({
          type: 'history/history_during_period',
          start_time: startIso,
          end_time: endIso,
          entity_ids: ids,
          minimal_response: true,
          no_attributes: true,
          significant_changes_only: false,
        });
        if (res && typeof res === 'object') return res;
      } catch {
        // fallback below
      }
    }
    if (typeof this.hass.callApi === 'function') {
      try {
        const res = await this.hass.callApi<
          Array<Array<{ entity_id?: string; state?: string; last_updated?: string }>>
        >(
          'GET',
          `history/period/${startIso}?end_time=${encodeURIComponent(endIso)}&filter_entity_id=${encodeURIComponent(ids.join(','))}&minimal_response&no_attributes`,
        );
        const mapped: Record<
          string,
          Array<{ s?: string; lu?: number; state?: string; last_updated?: string }>
        > = {};
        if (Array.isArray(res)) {
          for (let i = 0; i < res.length; i++) {
            const list = res[i];
            if (!Array.isArray(list) || list.length === 0) continue;
            const eid = list[0]?.entity_id || ids[i];
            if (eid) mapped[eid] = list;
          }
        }
        return mapped;
      } catch {
        return {};
      }
    }
    return {};
  }

  private async _fetchStatistics(
    startIso: string,
    endIso: string,
    ids: string[],
    period: 'hour' | 'day' | 'month',
  ): Promise<
    Record<
      string,
      Array<{
        start: number | string;
        mean?: number | null;
        min?: number | null;
        max?: number | null;
        state?: number | null;
      }>
    >
  > {
    if (!this.hass || typeof this.hass.callWS !== 'function') return {};
    try {
      const res = await this.hass.callWS<
        Record<
          string,
          Array<{
            start: number | string;
            mean?: number | null;
            min?: number | null;
            max?: number | null;
            state?: number | null;
          }>
        >
      >({
        type: 'recorder/statistics_during_period',
        start_time: startIso,
        end_time: endIso,
        statistic_ids: ids,
        period,
        types: ['mean', 'min', 'max', 'state'],
      });
      return res && typeof res === 'object' ? res : {};
    } catch {
      return {};
    }
  }

  private _bucketRawPoints(
    raw: Array<{ s?: string; lu?: number; state?: string; last_updated?: string }>,
    spec: WindowSpec,
    nowMs: number,
  ): BucketPoint[] {
    const n = spec.bucketStarts.length;
    const vals: number[][] = Array.from({ length: n }, () => []);

    for (const item of raw) {
      const v = Number(item.s ?? item.state);
      if (!Number.isFinite(v)) continue;
      const t =
        typeof item.lu === 'number'
          ? item.lu * 1000
          : item.last_updated
            ? Date.parse(item.last_updated)
            : NaN;
      if (!Number.isFinite(t) || t < spec.start || t >= spec.end || t > nowMs) continue;

      for (let i = 0; i < n; i++) {
        if (t >= spec.bucketStarts[i] && t < spec.bucketEnds[i]) {
          vals[i].push(v);
          break;
        }
      }
    }

    return spec.bucketStarts.map((bs, i) => {
      const arr = vals[i];
      if (arr.length === 0 || bs > nowMs) {
        return { t: bs, v: null, min: null, max: null };
      }
      const sum = arr.reduce((a, b) => a + b, 0);
      return {
        t: bs,
        v: sum / arr.length,
        min: Math.min(...arr),
        max: Math.max(...arr),
      };
    });
  }

  private _bucketStatPoints(
    stats: Array<{
      start: number | string;
      mean?: number | null;
      min?: number | null;
      max?: number | null;
      state?: number | null;
    }>,
    spec: WindowSpec,
    nowMs: number,
  ): BucketPoint[] {
    const n = spec.bucketStarts.length;
    const acc: Array<Array<{ v: number; min: number; max: number }>> = Array.from(
      { length: n },
      () => [],
    );

    for (const row of stats) {
      const rawVal = row.mean ?? row.state;
      if (rawVal === undefined || rawVal === null || !Number.isFinite(Number(rawVal))) continue;
      const v = Number(rawVal);
      const minV = row.min !== undefined && row.min !== null ? Number(row.min) : v;
      const maxV = row.max !== undefined && row.max !== null ? Number(row.max) : v;
      const t = typeof row.start === 'number' ? row.start : Date.parse(String(row.start));
      if (!Number.isFinite(t) || t < spec.start || t >= spec.end || t > nowMs) continue;

      for (let i = 0; i < n; i++) {
        if (t >= spec.bucketStarts[i] && t < spec.bucketEnds[i]) {
          acc[i].push({ v, min: minV, max: maxV });
          break;
        }
      }
    }

    return spec.bucketStarts.map((bs, i) => {
      const arr = acc[i];
      if (arr.length === 0 || bs > nowMs) {
        return { t: bs, v: null, min: null, max: null };
      }
      const sum = arr.reduce((a, b) => a + b.v, 0);
      return {
        t: bs,
        v: sum / arr.length,
        min: Math.min(...arr.map((r) => r.min)),
        max: Math.max(...arr.map((r) => r.max)),
      };
    });
  }

  private _resolveColors() {
    const isDark = this.hass?.themes?.darkMode !== false;
    const customPal = this.customColor
      ? buildM3BadgeTonalPalette(this.customColor, isDark)
      : null;
    const m = METRIC_THEME[this.metricKind];

    const accent = customPal?.accent ?? (isDark ? m.accentDark : m.accentLight);
    const onAccent = customPal?.onAccent ?? (isDark ? m.onAccentDark : m.onAccentLight);
    const singleLine = customPal?.accent ?? (isDark ? m.lineDark : m.lineLight);
    const cumulative = customPal
      ? [customPal.accent, ...m.cumulative.filter((c) => c !== customPal.accent)]
      : m.cumulative;

    return { accent, onAccent, singleLine, cumulative };
  }

  private async _fetchData(): Promise<void> {
    if (!this.hass || this.entityIds.length === 0) return;

    const seq = ++this._fetchSeq;
    const ids = [...this.entityIds];
    const spec = buildWindowSpec(this._range, this._offset, this.hass);
    this._spec = spec;
    this._loading = true;

    const nowMs = Date.now();
    const startIso = new Date(spec.start).toISOString();
    const endIso = new Date(Math.min(spec.end, nowMs)).toISOString();
    const isCumulative = ids.length > 1;
    const palette = this._resolveColors();

    try {
      const emptyWindow = spec.start > nowMs;
      const perEntityBuckets = new Map<string, BucketPoint[]>();

      if (!emptyWindow) {
        if (this._range === 'D' && this._offset >= -9) {
          const rawMap = await this._fetchHistoryRaw(startIso, endIso, ids);
          if (seq !== this._fetchSeq) return;
          let hasAnyRaw = false;
          for (const eid of ids) {
            const list = rawMap[eid] ?? [];
            if (list.length > 0) hasAnyRaw = true;
            perEntityBuckets.set(eid, this._bucketRawPoints(list, spec, nowMs));
          }
          if (!hasAnyRaw) {
            const statMap = await this._fetchStatistics(startIso, endIso, ids, 'hour');
            if (seq !== this._fetchSeq) return;
            for (const eid of ids) {
              perEntityBuckets.set(eid, this._bucketStatPoints(statMap[eid] ?? [], spec, nowMs));
            }
          }
        } else {
          const statPeriod = this._range === 'D' ? 'hour' : this._range === 'Y' ? 'month' : 'day';
          const statMap = await this._fetchStatistics(startIso, endIso, ids, statPeriod);
          if (seq !== this._fetchSeq) return;
          let hasAnyStat = false;
          for (const eid of ids) {
            const list = statMap[eid] ?? [];
            if (list.length > 0) hasAnyStat = true;
            perEntityBuckets.set(eid, this._bucketStatPoints(list, spec, nowMs));
          }
          if (!hasAnyStat && (this._range === 'W' || (this._range === 'M' && this._offset === 0))) {
            const rawMap = await this._fetchHistoryRaw(startIso, endIso, ids);
            if (seq !== this._fetchSeq) return;
            for (const eid of ids) {
              perEntityBuckets.set(eid, this._bucketRawPoints(rawMap[eid] ?? [], spec, nowMs));
            }
          }
        }
      }

      if (seq !== this._fetchSeq) return;

      this._series = ids.map((eid, idx) => {
        const ent = this.hass?.states[eid];
        const color = isCumulative
          ? palette.cumulative[idx % palette.cumulative.length]
          : palette.singleLine;
        const buckets =
          perEntityBuckets.get(eid) ??
          spec.bucketStarts.map((bs) => ({ t: bs, v: null, min: null, max: null }));
        return {
          entityId: eid,
          label: cleanSensorLabel(ent, eid),
          color,
          buckets,
        };
      });
    } catch {
      if (seq !== this._fetchSeq) return;
      this._series = ids.map((eid, idx) => ({
        entityId: eid,
        label: cleanSensorLabel(this.hass?.states[eid], eid),
        color: isCumulative
          ? palette.cumulative[idx % palette.cumulative.length]
          : palette.singleLine,
        buckets: spec.bucketStarts.map((bs) => ({ t: bs, v: null, min: null, max: null })),
      }));
    } finally {
      if (seq === this._fetchSeq) {
        this._loading = false;
      }
    }
  }

  private _computeStats() {
    const validVals: number[] = [];
    const sensorMeans: number[] = [];
    let minVal = Infinity;
    let maxVal = -Infinity;

    for (const s of this._series) {
      const sVals: number[] = [];
      for (const b of s.buckets) {
        if (b.v === null) continue;
        validVals.push(b.v);
        sVals.push(b.v);
        const lo = b.min ?? b.v;
        const hi = b.max ?? b.v;
        if (lo < minVal) minVal = lo;
        if (hi > maxVal) maxVal = hi;
      }
      if (sVals.length > 0) {
        sensorMeans.push(sVals.reduce((a, b) => a + b, 0) / sVals.length);
      }
    }

    if (validVals.length === 0) {
      return {
        hasData: false,
        avg: 0,
        min: 0,
        max: 0,
        activeSensors: 0,
        sensorMinAvg: 0,
        sensorMaxAvg: 0,
      };
    }

    const avg = validVals.reduce((a, b) => a + b, 0) / validVals.length;
    return {
      hasData: true,
      avg,
      min: minVal,
      max: maxVal,
      activeSensors: sensorMeans.length,
      sensorMinAvg: Math.min(...sensorMeans),
      sensorMaxAvg: Math.max(...sensorMeans),
    };
  }

  private _metricDescriptor(): { avgLabel: string; noun: string } {
    const it = isItalian(this.hass);
    switch (this.metricKind) {
      case 'humidity':
        return {
          avgLabel: it ? 'umidità media' : 'humidity (avg)',
          noun: it ? "L'umidità media è stata di" : 'Average humidity was',
        };
      case 'illuminance':
        return {
          avgLabel: it ? 'illuminazione media' : 'illuminance (avg)',
          noun: it ? "L'illuminazione media è stata di" : 'Average illuminance was',
        };
      case 'moisture':
        return {
          avgLabel: it ? 'moisture medio' : 'moisture (avg)',
          noun: it ? 'Il moisture medio è stato di' : 'Average moisture was',
        };
      default:
        return {
          avgLabel: it ? 'temperatura media' : 'temperature (avg)',
          noun: it ? 'La temperatura media è stata di' : 'Average temperature was',
        };
    }
  }

  private _formatTickY(val: number): string {
    const rounded = this.metricKind === 'illuminance'
      ? Math.round(val)
      : Math.abs(val) < 10 && !Number.isInteger(val)
        ? Number(val.toFixed(1))
        : Math.round(val);
    const u = this.unit.trim();
    if (!u) return String(rounded);
    if (u === '%' || u === '°C' || u === '°F') return `${rounded}${u}`;
    return `${rounded} ${u}`;
  }

  protected render() {
    if (!this.hass || this.entityIds.length === 0) return nothing;
    const spec = this._spec ?? buildWindowSpec(this._range, this._offset, this.hass);
    const it = isItalian(this.hass);
    const theme = this._resolveColors();
    const stats = this._computeStats();
    const { avgLabel, noun } = this._metricDescriptor();
    const isCumulative = this._series.length > 1;

    let subtitleText: string;
    if (!stats.hasData) {
      subtitleText = it ? 'Nessun dato raccolto' : 'No data collected';
    } else if (isCumulative) {
      const avgStr = formatWithUnit(stats.avg, this.metricKind, this.unit, this.hass);
      const loStr = formatWithUnit(stats.min, this.metricKind, this.unit, this.hass);
      const hiStr = formatWithUnit(stats.max, this.metricKind, this.unit, this.hass);
      subtitleText = it
        ? `Media complessiva di ${avgStr} tra ${this._series.length} sensori (da ${loStr} a ${hiStr}) nella finestra selezionata.`
        : `Overall average of ${avgStr} across ${this._series.length} sensors (from ${loStr} to ${hiStr}) in the selected window.`;
    } else {
      const avgStr = formatWithUnit(stats.avg, this.metricKind, this.unit, this.hass);
      const loStr = formatWithUnit(stats.min, this.metricKind, this.unit, this.hass);
      const hiStr = formatWithUnit(stats.max, this.metricKind, this.unit, this.hass);
      subtitleText = it
        ? `${noun} ${avgStr} (min ${loStr} – max ${hiStr}) nella finestra selezionata.`
        : `${noun} ${avgStr} (min ${loStr} – max ${hiStr}) in the selected window.`;
    }

    // SVG Geometry
    const W = Math.max(240, this._plotWidth);
    const H = this.compact ? 152 : 224;
    const padL = 8;
    const padR = 46;
    const padT = 12;
    const padB = 34;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;
    const nBuckets = Math.max(1, spec.bucketStarts.length);

    let yMin = 0;
    let yMax = this.metricKind === 'temperature' ? 30 : 100;
    if (stats.hasData) {
      let ptMin = Infinity;
      let ptMax = -Infinity;
      for (const s of this._series) {
        for (const b of s.buckets) {
          if (b.v === null) continue;
          if (b.v < ptMin) ptMin = b.v;
          if (b.v > ptMax) ptMax = b.v;
        }
      }
      const rawSpan = ptMax - ptMin;
      const pad = rawSpan > 0 ? rawSpan * 0.18 : Math.max(2, Math.abs(ptMax) * 0.15);
      yMin = this.metricKind === 'temperature' ? Math.floor(ptMin - pad) : Math.max(0, Math.floor(ptMin - pad));
      yMax = Math.ceil(ptMax + pad);
      if (yMax <= yMin) yMax = yMin + 4;
    }

    const ySpan = yMax - yMin || 1;
    const xAt = (idx: number): number =>
      nBuckets <= 1 ? padL + plotW / 2 : padL + (idx / (nBuckets - 1)) * plotW;
    const yAt = (v: number): number => padT + plotH - ((v - yMin) / ySpan) * plotH;

    const yTicks = [0, 1, 2, 3].map((i) => {
      const ratio = i / 3;
      const val = yMin + ratio * ySpan;
      return { y: padT + plotH - ratio * plotH, label: this._formatTickY(val) };
    });

    const axisY = H - 22;
    const axisLabelY = H - 5;

    return html`
      <div
        class="m3e-chart-root ${this.compact ? 'is-compact' : ''}"
        style="--chart-accent: ${theme.accent}; --chart-on-accent: ${theme.onAccent};"
      >
        <!-- 1. Top Segmented Time Selector -->
        <div class="range-bar" role="tablist" aria-label=${it ? 'Intervallo temporale' : 'Time range'}>
          ${RANGES.map((r) => {
            const active = r === this._range;
            return html`
              <button
                type="button"
                role="tab"
                class="range-btn ${active ? 'is-selected' : ''}"
                aria-selected=${String(active)}
                @click=${() => this._setRange(r)}
              >
                ${r}
              </button>
            `;
          })}
        </div>

        <!-- 2. Contextual Header & Chronological Navigation -->
        <div class="chart-header">
          <div class="period-row">
            <span class="period-label">
              ${this.headerTitle
                ? this._offset === 0
                  ? this.headerTitle
                  : html`${this.headerTitle}<span class="period-suffix"> · ${spec.periodLabel}</span>`
                : spec.periodLabel}
            </span>
            <div class="nav-group">
              <button
                type="button"
                class="nav-btn"
                aria-label=${it ? 'Periodo precedente' : 'Previous period'}
                @click=${() => this._stepOffset(-1)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59Z" />
                </svg>
              </button>
              <button
                type="button"
                class="nav-btn"
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
                class="nav-btn ${this._offset < 0 ? 'is-highlighted' : 'is-present'}"
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
            ${stats.hasData
              ? html`
                  <span class="hero-val">
                    ${formatWithUnit(stats.avg, this.metricKind, this.unit, this.hass)}
                  </span>
                  <span class="hero-lbl">${avgLabel}</span>
                `
              : html`<span class="hero-val">${it ? 'Nessun dato' : 'No data'}</span>`}
          </div>

          <div class="summary-sub">${subtitleText}</div>
        </div>

        <!-- 3. Clean Line + Dot SVG Chart -->
        <div class="chart-area ${this._loading ? 'is-loading' : ''}">
          <svg
            class="chart-svg"
            viewBox="0 0 ${W} ${H}"
            role="img"
            aria-label=${spec.periodLabel}
          >
            ${svg`
              <!-- Right-aligned minimal Y-axis labels (no gridlines) -->
              ${yTicks.map(
                (t) => svg`
                  <text
                    x=${W - 2}
                    y=${t.y + 4}
                    text-anchor="end"
                    class="y-tick-label"
                  >${t.label}</text>
                `,
              )}

              <!-- Bottom X-axis scan dots & key labels -->
              ${spec.bucketStarts.map((_, idx) => {
                const cx = xAt(idx);
                return svg`<circle cx=${cx} cy=${axisY} r="1.25" class="x-scan-dot" />`;
              })}
              ${spec.xLabels.map((lbl) => {
                const tx = xAt(lbl.index);
                const anchor =
                  lbl.index === 0
                    ? 'start'
                    : lbl.index === nBuckets - 1
                      ? 'end'
                      : 'middle';
                return svg`
                  <text
                    x=${tx}
                    y=${axisLabelY}
                    text-anchor=${anchor}
                    class="x-tick-label"
                  >${lbl.text}</text>
                `;
              })}

              <!-- Single or Cumulative Sensor Series -->
              ${this._series.map((s, sIdx) => {
                const sColor = isCumulative
                  ? theme.cumulative[sIdx % theme.cumulative.length]
                  : theme.singleLine;
                const dimmed =
                  isCumulative &&
                  this._isolatedEntityId !== null &&
                  this._isolatedEntityId !== s.entityId;
                const opacity = dimmed ? 0.16 : 1;

                // Build gap-preserving path segments
                let pathD = '';
                let openSeg = false;
                const dots: Array<{ cx: number; cy: number }> = [];

                s.buckets.forEach((b, idx) => {
                  if (b.v === null) {
                    openSeg = false;
                    return;
                  }
                  const cx = xAt(idx);
                  const cy = yAt(b.v);
                  dots.push({ cx, cy });
                  pathD += `${openSeg ? 'L' : 'M'} ${cx.toFixed(1)} ${cy.toFixed(1)} `;
                  openSeg = true;
                });

                return svg`
                  <g style="opacity: ${opacity}; transition: opacity 200ms ease;">
                    ${pathD
                      ? svg`<path d=${pathD.trim()} stroke=${sColor} class="series-line" />`
                      : nothing}
                    ${dots.map(
                      (pt) => svg`
                        <circle
                          cx=${pt.cx.toFixed(1)}
                          cy=${pt.cy.toFixed(1)}
                          r="3.5"
                          fill=${sColor}
                          class="series-dot"
                        />
                      `,
                    )}
                  </g>
                `;
              })}
            `}
          </svg>
        </div>

        <!-- 4. Interactive Legend Footer -->
        <div class="legend-row">
          ${this._series.map((s, sIdx) => {
            const sColor = isCumulative
              ? theme.cumulative[sIdx % theme.cumulative.length]
              : theme.singleLine;
            const dimmed =
              isCumulative &&
              this._isolatedEntityId !== null &&
              this._isolatedEntityId !== s.entityId;
            return html`
              <button
                type="button"
                class="legend-item ${isCumulative ? 'is-interactive' : ''} ${dimmed ? 'is-dimmed' : ''}"
                @click=${() => {
                  if (!isCumulative) return;
                  navigator.vibrate?.(5);
                  this._isolatedEntityId =
                    this._isolatedEntityId === s.entityId ? null : s.entityId;
                }}
              >
                <span class="legend-dot" style="background: ${sColor};"></span>
                <span class="legend-lbl">${s.label}</span>
              </button>
            `;
          })}
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .m3e-chart-root {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding-top: 4px;
    }

    /* 1. Segmented Control */
    .range-bar {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 6px;
      width: 100%;
    }

    .range-btn {
      height: 38px;
      border: 0;
      padding: 0;
      border-radius: 12px;
      background: var(--md-sys-color-surface-container-high, #23262a);
      color: var(--md-sys-color-on-surface, #e3e2e6);
      font: inherit;
      font-size: 13.5px;
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

    .range-btn:hover:not(.is-selected) {
      filter: brightness(1.08);
    }

    .range-btn.is-selected {
      border-radius: 19px;
      background: var(--chart-accent);
      color: var(--chart-on-accent);
      font-weight: 600;
    }

    .range-btn:active {
      transform: scale(0.95);
    }

    /* 2. Contextual Header */
    .chart-header {
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

    .period-label {
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

    .nav-group {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    .nav-btn {
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
      transition:
        opacity 180ms ease,
        background-color 180ms ease,
        color 180ms ease,
        transform var(--m3e-spring-spatial-fast, 200ms ease);
      -webkit-tap-highlight-color: transparent;
    }

    .nav-btn:disabled {
      opacity: 0.35;
      cursor: default;
    }

    .nav-btn.is-highlighted {
      background: color-mix(in srgb, var(--chart-accent) 22%, var(--md-sys-color-surface-container-high, #23262a));
      color: var(--chart-accent);
    }

    .nav-btn:not(:disabled):active {
      transform: scale(0.9);
    }

    .nav-btn svg {
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
      font-size: 2.25rem;
      font-weight: 600;
      line-height: 1.08;
      letter-spacing: -0.02em;
      font-variant-numeric: tabular-nums;
      color: var(--md-sys-color-on-surface, #e3e2e6);
    }

    .hero-lbl {
      font-size: 1rem;
      font-weight: 500;
      color: var(--md-sys-color-on-surface-variant, #c4c7c5);
    }

    .summary-sub {
      font-size: 0.875rem;
      line-height: 1.35;
      color: var(--md-sys-color-on-surface-variant, #c4c7c5);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* 3. Clean Chart Canvas */
    .chart-area {
      width: 100%;
      height: 224px;
      transition: opacity 180ms ease;
    }

    .chart-area.is-loading {
      opacity: 0.45;
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
      font-size: 0.72rem;
      font-weight: 500;
      fill: var(--md-sys-color-outline, #8e918f);
      font-variant-numeric: tabular-nums;
    }

    .series-line {
      fill: none;
      stroke-width: 2.5px;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .series-dot {
      stroke: var(--md-sys-color-surface, #111315);
      stroke-width: 1.5px;
    }

    /* 4. Interactive Legend Footer */
    .legend-row {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 8px 16px;
      padding: 2px 4px 0;
    }

    .legend-item {
      border: 0;
      padding: 4px 6px;
      border-radius: 9999px;
      background: transparent;
      color: var(--md-sys-color-on-surface, #e3e2e6);
      font: inherit;
      font-size: 0.85rem;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: default;
      transition: opacity 180ms ease, background-color 150ms ease;
      -webkit-tap-highlight-color: transparent;
    }

    .legend-item.is-interactive {
      cursor: pointer;
    }

    .legend-item.is-interactive:hover {
      background: color-mix(in srgb, currentColor 7%, transparent);
    }

    .legend-item.is-dimmed {
      opacity: 0.42;
    }

    .legend-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .legend-lbl {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 180px;
    }

    .m3e-chart-root.is-compact {
      gap: 10px;
    }

    .m3e-chart-root.is-compact .range-btn {
      height: 34px;
    }

    .m3e-chart-root.is-compact .range-btn.is-selected {
      border-radius: 17px;
    }

    .m3e-chart-root.is-compact .hero-val {
      font-size: 1.95rem;
    }

    .m3e-chart-root.is-compact .chart-area {
      height: 152px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-history-chart': M3EHistoryChart;
  }
}
