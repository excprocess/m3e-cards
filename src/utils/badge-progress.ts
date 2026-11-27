import type {
  HassEntity,
  HomeAssistant,
  M3EStatusBadgeConfig,
} from '../types/home-assistant';

export interface BadgeProgressResult {
  /** Clamped 0..100 percentage, or null if not computable */
  percent: number | null;
  /** Whether the progress depends on live wall-clock time (needs periodic ticking) */
  isTimeBased: boolean;
  /** Optional formatted live remaining text (e.g. for active HA timer.* entities) */
  liveRemainingText?: string;
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;
const TIME_HMS_RE = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;
const TIME_UNITS = new Set(['s', 'sec', 'secs', 'second', 'seconds', 'min', 'mins', 'minute', 'minutes', 'm', 'h', 'hr', 'hrs', 'hour', 'hours', 'd', 'day', 'days']);

function clampPct(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, v));
}

/**
 * Parses a duration string ("01:30:00", "45:00", "1h 20m", "35 min") into milliseconds.
 */
export function parseDurationMs(raw: unknown): number | null {
  if (raw === null || raw === undefined) return null;
  const s = String(raw).trim();
  if (!s) return null;

  // HH:MM:SS or HH:MM
  const hms = s.match(/^(\d+):(\d{2}):(\d{2})$/);
  if (hms) {
    return (Number(hms[1]) * 3600 + Number(hms[2]) * 60 + Number(hms[3])) * 1000;
  }

  // Human text like "1h 25m", "45 min", "2 ore 10 min"
  let totalMs = 0;
  let matched = false;
  const rx = /(\d+(?:\.\d+)?)\s*(d|days?|giorn[io]|h|hrs?|hours?|or[ae]|m|mins?|minutes?|minut[io]|s|secs?|seconds?|second[io])\b/gi;
  let m: RegExpExecArray | null;
  while ((m = rx.exec(s)) !== null) {
    matched = true;
    const val = parseFloat(m[1]);
    const u = m[2].toLowerCase();
    if (u.startsWith('d') || u.startsWith('giorn')) totalMs += val * 86400000;
    else if (u.startsWith('h') || u.startsWith('or')) totalMs += val * 3600000;
    else if (u.startsWith('m')) totalMs += val * 60000;
    else if (u.startsWith('s')) totalMs += val * 1000;
  }
  return matched ? totalMs : null;
}

/**
 * Converts a numeric value + unit_of_measurement into milliseconds if it is a time unit.
 */
function numericTimeUnitToMs(val: number, unit?: string): number | null {
  if (!unit) return null;
  const u = unit.trim().toLowerCase();
  if (!TIME_UNITS.has(u)) return null;
  if (u === 's' || u.startsWith('sec')) return val * 1000;
  if (u === 'm' || u.startsWith('min')) return val * 60000;
  if (u === 'h' || u.startsWith('hr') || u.startsWith('hour')) return val * 3600000;
  if (u === 'd' || u.startsWith('day')) return val * 86400000;
  return null;
}

/**
 * Parses a timestamp from a string, number, or HassEntity into epoch ms.
 */
function parseTimestampMs(raw: unknown, entity?: HassEntity): number | null {
  if (entity) {
    if (typeof entity.attributes.timestamp === 'number' && Number.isFinite(entity.attributes.timestamp)) {
      const ts = entity.attributes.timestamp;
      // input_datetime with only time stores seconds since midnight (< 86400)
      if (ts >= 0 && ts <= 86400 && entity.attributes.has_date === false) {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d.getTime() + ts * 1000;
      }
      return ts > 1e12 ? ts : ts * 1000;
    }
    if (typeof entity.attributes.finishes_at === 'string') {
      const parsed = Date.parse(entity.attributes.finishes_at);
      if (Number.isFinite(parsed)) return parsed;
    }
  }

  if (raw === null || raw === undefined) return null;
  const s = String(raw).trim();
  if (!s || s === 'unavailable' || s === 'unknown' || s === 'none') return null;

  if (s.toLowerCase() === 'now') return Date.now();

  const hms = s.match(TIME_HMS_RE);
  if (hms) {
    const d = new Date();
    d.setHours(Number(hms[1]), Number(hms[2]), Number(hms[3] ?? 0), 0);
    return d.getTime();
  }

  if (ISO_DATE_RE.test(s) || entity?.attributes.device_class === 'timestamp') {
    const parsed = Date.parse(s);
    if (Number.isFinite(parsed)) return parsed;
  }

  return null;
}

function parseNumeric(raw: unknown, entity?: HassEntity): number | null {
  if (raw !== null && raw !== undefined && raw !== '') {
    const n = Number(String(raw).trim().replace(',', '.'));
    if (Number.isFinite(n)) return n;
  }
  if (entity) {
    const n = Number(String(entity.state ?? '').trim().replace(',', '.'));
    if (Number.isFinite(n)) return n;
    if (typeof entity.attributes.percentage === 'number') return entity.attributes.percentage;
    if (typeof entity.attributes.battery_level === 'number') return entity.attributes.battery_level;
  }
  return null;
}

function formatCompactDuration(ms: number): string {
  const totalSec = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`;
  if (m > 0) return s > 0 && m < 10 ? `${m}m ${s}s` : `${m}m`;
  return `${s}s`;
}

interface StoredBaseline {
  sig: string;
  startMs: number;
  peakVal?: number;
}

function getOrStoreBaseline(key: string, sig: string, nowMs: number, currentVal?: number): StoredBaseline {
  const storageKey = `m3e_badge_prog_${key}`;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredBaseline;
      if (parsed && parsed.sig === sig && Number.isFinite(parsed.startMs)) {
        if (currentVal !== undefined && (parsed.peakVal === undefined || currentVal > parsed.peakVal)) {
          const updated: StoredBaseline = { sig, startMs: parsed.startMs, peakVal: currentVal };
          window.localStorage.setItem(storageKey, JSON.stringify(updated));
          return updated;
        }
        return parsed;
      }
    }
  } catch {
    // ignore storage quota / privacy errors
  }

  const fresh: StoredBaseline = { sig, startMs: nowMs, peakVal: currentVal };
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(fresh));
  } catch {
    // ignore
  }
  return fresh;
}

/**
 * Computes 0..100 progress for Status Badge across:
 * - HA `timer.*` entities (duration + remaining / finishes_at)
 * - Timestamps, dates, alarms (`next_alarm`, `charging_end`, `start_now`, `start_entity` -> `end_entity`)
 * - Companion app / appliance remaining-time sensors (duration strings or numeric time units)
 * - Numeric sensors, counters, input_number, battery levels (`start` -> `end`)
 */
export function computeBadgeProgress(
  hass: HomeAssistant | undefined,
  config: M3EStatusBadgeConfig,
  nowMs = Date.now(),
): BadgeProgressResult {
  if (!hass || !config.progress_enabled) {
    return { percent: null, isTimeBased: false };
  }

  const primary = hass.states[config.entity];
  const startEnt = config.progress_start_entity ? hass.states[config.progress_start_entity] : undefined;
  const endEnt = config.progress_end_entity ? hass.states[config.progress_end_entity] : undefined;

  const finalize = (
    pct: number | null,
    isTimeBased: boolean,
    liveRemainingText?: string,
  ): BadgeProgressResult => {
    if (pct === null) return { percent: null, isTimeBased, liveRemainingText };
    const clamped = clampPct(pct);
    return {
      percent: config.progress_invert ? clampPct(100 - clamped) : clamped,
      isTimeBased,
      liveRemainingText,
    };
  };

  // 1. Native Home Assistant timer.* entity (primary or end entity)
  const timerEnt = primary?.entity_id.startsWith('timer.')
    ? primary
    : endEnt?.entity_id.startsWith('timer.')
      ? endEnt
      : undefined;

  if (timerEnt) {
    const totalMs = parseDurationMs(timerEnt.attributes.duration);
    if (timerEnt.state === 'idle' || !totalMs || totalMs <= 0) {
      return finalize(0, false);
    }
    if (timerEnt.state === 'active' && typeof timerEnt.attributes.finishes_at === 'string') {
      const endMs = Date.parse(timerEnt.attributes.finishes_at);
      if (Number.isFinite(endMs)) {
        const remMs = Math.max(0, endMs - nowMs);
        const pct = ((totalMs - remMs) / totalMs) * 100;
        return finalize(pct, true, formatCompactDuration(remMs));
      }
    }
    if (timerEnt.state === 'paused') {
      const remMs = parseDurationMs(timerEnt.attributes.remaining);
      if (remMs !== null) {
        const pct = ((totalMs - remMs) / totalMs) * 100;
        return finalize(pct, false, formatCompactDuration(remMs));
      }
    }
    return finalize(0, false);
  }

  // 2. Timestamp / Date / Alarm window
  const primaryTs = parseTimestampMs(primary?.state, primary);
  const startIsNow =
    Boolean(config.progress_start_now) ||
    String(config.progress_start_value ?? '').trim().toLowerCase() === 'now';

  const explicitStartTs = startEnt
    ? parseTimestampMs(startEnt.state, startEnt)
    : !startIsNow
      ? parseTimestampMs(config.progress_start_value)
      : null;

  const explicitEndTs = endEnt
    ? parseTimestampMs(endEnt.state, endEnt)
    : parseTimestampMs(config.progress_end_value);

  // Determine target end timestamp (either explicit end or primary timestamp)
  let targetEndTs = explicitEndTs ?? primaryTs;
  if (targetEndTs !== null) {
    // If HH:MM already passed today and startIsNow, assume tomorrow's alarm
    if (startIsNow && targetEndTs < nowMs - 60000 && !ISO_DATE_RE.test(String(endEnt?.state ?? primary?.state ?? ''))) {
      targetEndTs += 86400000;
    }

    let startTs = explicitStartTs;
    if (startTs === null) {
      // If startIsNow (or no explicit start for a future alarm/charge timestamp):
      // check if end_value/start_value gave a numeric window in minutes, else snapshot "now"
      const windowMin =
        !startIsNow && config.progress_start_value !== undefined && config.progress_start_value !== ''
          ? Number(config.progress_start_value)
          : NaN;
      if (Number.isFinite(windowMin) && windowMin > 0) {
        startTs = targetEndTs - windowMin * 60000;
      } else {
        const baseline = getOrStoreBaseline(config.entity, `ts:${targetEndTs}`, nowMs);
        startTs = baseline.startMs;
      }
    }

    // Handle overnight time windows (e.g. 22:00 -> 07:00)
    if (targetEndTs <= startTs) {
      if (nowMs < targetEndTs) {
        startTs -= 86400000;
      } else {
        targetEndTs += 86400000;
      }
    }

    const span = targetEndTs - startTs;
    if (span <= 0) return finalize(100, true);
    const currentTs =
      explicitStartTs !== null && explicitEndTs !== null && primaryTs !== null && primaryTs !== targetEndTs
        ? primaryTs
        : nowMs;
    const pct = ((currentTs - startTs) / span) * 100;
    return finalize(pct, true);
  }

  // 3. Remaining-time duration string or numeric time-unit sensor (Companion App charging, appliances)
  const rawPrimary = String(primary?.state ?? '').trim();
  const unit = String(primary?.attributes.unit_of_measurement ?? '').trim();
  const numericVal = parseNumeric(primary?.state, primary);
  const remDurationMs =
    parseDurationMs(rawPrimary) ??
    (numericVal !== null ? numericTimeUnitToMs(numericVal, unit) : null);

  if (
    remDurationMs !== null &&
    (TIME_UNITS.has(unit.toLowerCase()) ||
      primary?.attributes.device_class === 'duration' ||
      parseDurationMs(rawPrimary) !== null)
  ) {
    if (remDurationMs <= 0) return finalize(100, false);

    // Explicit max duration from end_entity or end_value (or start_value)
    const maxFromEndEnt = endEnt
      ? parseDurationMs(endEnt.state) ??
        (parseNumeric(endEnt.state, endEnt) !== null
          ? numericTimeUnitToMs(
              parseNumeric(endEnt.state, endEnt)!,
              String(endEnt.attributes.unit_of_measurement ?? unit),
            )
          : null)
      : null;

    const maxFromConfig =
      parseDurationMs(config.progress_end_value) ??
      (config.progress_end_value !== undefined && config.progress_end_value !== ''
        ? numericTimeUnitToMs(Number(config.progress_end_value), unit || 'min')
        : null);

    let totalMs = maxFromEndEnt ?? maxFromConfig;
    if (!totalMs || totalMs <= 0) {
      // Auto-snapshot peak remaining time for this session
      const baseline = getOrStoreBaseline(config.entity, 'rem_session', nowMs, remDurationMs);
      totalMs = Math.max(remDurationMs, baseline.peakVal ?? remDurationMs);
    }

    const pct = totalMs > 0 ? ((totalMs - remDurationMs) / totalMs) * 100 : 0;
    return finalize(pct, false);
  }

  // 4. General numeric / counter / input_number / percentage entity
  if (numericVal !== null) {
    const minVal =
      (startEnt ? parseNumeric(startEnt.state, startEnt) : null) ??
      parseNumeric(config.progress_start_value) ??
      (typeof primary?.attributes.min === 'number' ? primary.attributes.min : null) ??
      (typeof primary?.attributes.minimum === 'number' ? primary.attributes.minimum : null) ??
      0;

    const maxVal =
      (endEnt ? parseNumeric(endEnt.state, endEnt) : null) ??
      parseNumeric(config.progress_end_value) ??
      (typeof primary?.attributes.max === 'number' ? primary.attributes.max : null) ??
      (typeof primary?.attributes.maximum === 'number' ? primary.attributes.maximum : null) ??
      100;

    const span = maxVal - minVal;
    if (span === 0) return finalize(0, false);
    const pct = ((numericVal - minVal) / span) * 100;
    return finalize(pct, false);
  }

  return finalize(null, false);
}
