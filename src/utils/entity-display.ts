import type { HassEntity, HomeAssistant } from '../types/home-assistant';
import { formatLastChanged } from './time';
import { getLocale } from './i18n';

const ISO_TS_RE = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$/;

/**
 * Formats an ISO timestamp string into a compact relative label:
 * - EN: "In 38m", "In 2h 15m", "In 1d 4h", "12m ago", "Now"
 * - IT: "Tra 38m", "Tra 2h 15m", "Tra 1g 4h", "12m fa", "Ora"
 */
export function formatRelativeTimestamp(
  raw: string,
  hass?: HomeAssistant,
): string | null {
  const trimmed = raw.trim();
  if (!ISO_TS_RE.test(trimmed)) return null;
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return null;

  const isIt = getLocale(hass) === 'it';
  const diffSec = Math.round((date.getTime() - Date.now()) / 1000);
  const absMin = Math.round(Math.abs(diffSec) / 60);

  if (diffSec >= 0) {
    if (absMin < 1) return isIt ? 'Tra <1m' : 'In <1m';
    if (absMin < 60) return isIt ? `Tra ${absMin}m` : `In ${absMin}m`;
    const h = Math.floor(absMin / 60);
    const m = absMin % 60;
    if (h < 24) {
      const hm = m > 0 ? `${h}h ${m}m` : `${h}h`;
      return isIt ? `Tra ${hm}` : `In ${hm}`;
    }
    const d = Math.floor(h / 24);
    const remH = h % 24;
    const dUnit = isIt ? 'g' : 'd';
    const dh = remH > 0 ? `${d}${dUnit} ${remH}h` : `${d}${dUnit}`;
    return isIt ? `Tra ${dh}` : `In ${dh}`;
  }

  if (absMin < 1) return isIt ? 'Ora' : 'Now';
  if (absMin < 60) return isIt ? `${absMin}m fa` : `${absMin}m ago`;
  const h = Math.floor(absMin / 60);
  const m = absMin % 60;
  if (h < 24) {
    const hm = m > 0 ? `${h}h ${m}m` : `${h}h`;
    return isIt ? `${hm} fa` : `${hm} ago`;
  }
  const d = Math.floor(h / 24);
  return isIt ? `${d}g fa` : `${d}d ago`;
}

export type EntityNamePart =
  | { type: 'entity' | 'device' | 'area' | 'floor' }
  | { type: 'text'; text: string };

export type EntityNameConfig = string | EntityNamePart | EntityNamePart[];
export type StateContentConfig = string | string[];

/**
 * Resolves a card's configured `name` (plain string, composed EntityNameItem/array,
 * or undefined) using Home Assistant's native `hass.formatEntityName()` API when available,
 * with a clean fallback for mock/preview environments.
 */
export function resolveEntityName(
  hass: HomeAssistant | undefined,
  entity: HassEntity | undefined,
  nameConfig: EntityNameConfig | undefined,
  fallbackId?: string,
): string {
  if (typeof nameConfig === 'string') {
    const trimmed = nameConfig.trim();
    if (trimmed) return trimmed;
  }

  if (entity && nameConfig !== undefined && nameConfig !== null && typeof nameConfig !== 'string') {
    if (typeof hass?.formatEntityName === 'function') {
      try {
        const formatted = hass.formatEntityName(entity, nameConfig);
        if (formatted && formatted.trim()) return formatted.trim();
      } catch {
        // Fall through to manual resolution
      }
    }

    const parts = Array.isArray(nameConfig) ? nameConfig : [nameConfig];
    const resolved: string[] = [];
    const regEntry = hass?.entities?.[entity.entity_id];
    const device = regEntry?.device_id ? hass?.devices?.[regEntry.device_id] : undefined;

    for (const part of parts) {
      if (!part || typeof part !== 'object') continue;
      if (part.type === 'text' && 'text' in part && part.text) {
        resolved.push(part.text);
      } else if (part.type === 'device') {
        const dn = device?.name_by_user || device?.name;
        if (dn) resolved.push(dn);
      } else if (part.type === 'entity') {
        const fn = entity.attributes.friendly_name;
        if (fn) resolved.push(fn);
      } else if (part.type === 'area') {
        const areaId = regEntry?.area_id || device?.area_id;
        const areaName = areaId ? hass?.areas?.[areaId]?.name : undefined;
        if (areaName) resolved.push(areaName);
      } else if (part.type === 'floor') {
        const areaId = regEntry?.area_id || device?.area_id;
        const floorId = areaId ? hass?.areas?.[areaId]?.floor_id : undefined;
        const floorName = floorId ? hass?.floors?.[floorId]?.name : undefined;
        if (floorName) resolved.push(floorName);
      }
    }
    if (resolved.length > 0) return resolved.join(' ');
  }

  if (entity?.attributes.friendly_name) {
    return entity.attributes.friendly_name;
  }
  return fallbackId || entity?.entity_id || '';
}

/**
 * Resolves Home Assistant's native `state_content` (`string | string[]`, e.g.
 * `['media_album_name', 'state']` or `'last_changed'`) into a clean display string.
 * Returns `null` if `state_content` is empty/unset or yields no values.
 */
export function resolveStateContent(
  hass: HomeAssistant | undefined,
  entity: HassEntity | undefined,
  stateContent: StateContentConfig | undefined,
  defaultStateFallback?: string,
): string | null {
  if (!entity || !stateContent) return null;
  const items = (Array.isArray(stateContent) ? stateContent : [stateContent])
    .map((s) => String(s ?? '').trim())
    .filter(Boolean);

  if (items.length === 0) return null;

  const parts: string[] = [];
  for (const key of items) {
    if (key === 'state') {
      const relTs = formatRelativeTimestamp(String(entity.state ?? ''), hass);
      const val =
        relTs ??
        (typeof hass?.formatEntityState === 'function'
          ? hass.formatEntityState(entity)
          : defaultStateFallback ?? entity.state);
      if (val && String(val).trim()) parts.push(String(val).trim());
    } else if (key === 'last_changed' || key === 'last-changed') {
      const rel = formatLastChanged(entity.last_changed);
      if (rel) parts.push(rel);
    } else if (key === 'last_updated' || key === 'last-updated') {
      const rel = formatLastChanged(entity.last_updated);
      if (rel) parts.push(rel);
    } else {
      const rawAttr = entity.attributes[key];
      if (rawAttr === undefined || rawAttr === null || rawAttr === '') continue;
      let formatted: string | undefined;
      if (typeof hass?.formatEntityAttributeValue === 'function') {
        try {
          formatted = hass.formatEntityAttributeValue(entity, key);
        } catch {
          formatted = undefined;
        }
      }
      const text = (formatted ?? String(rawAttr)).trim();
      if (text) parts.push(text);
    }
  }

  return parts.length > 0 ? parts.join(' · ') : null;
}
