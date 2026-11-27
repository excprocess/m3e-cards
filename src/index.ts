import './cards/m3e-assist-card';
import './cards/m3e-glance-card';
import './cards/m3e-light-card';
import './cards/m3e-light-control-card';
import './cards/m3e-light-group-card';
import './cards/m3e-media-bar-card';
import './cards/m3e-media-player-card';
import './cards/m3e-people-card';
import './cards/m3e-popup-card';
import './cards/m3e-remote-card';
import './cards/m3e-scene-card';
import './cards/m3e-stack-card';
import './cards/m3e-status-badge';
import './cards/m3e-status-card';
import './cards/m3e-tabs-card';
import './cards/m3e-thermostat-card';
import './cards/m3e-toggle-card';
import { initM3ENavigationPickerBridge } from './utils/navigation-picker-bridge';

initM3ENavigationPickerBridge();

export { M3EAssistCard } from './cards/m3e-assist-card';
export { M3EGlanceCard } from './cards/m3e-glance-card';
export { M3ELightCard } from './cards/m3e-light-card';
export { M3ELightControlCard } from './cards/m3e-light-control-card';
export { M3ELightGroupCard } from './cards/m3e-light-group-card';
export { M3EMediaBarCard } from './cards/m3e-media-bar-card';
export { M3EMediaPlayerCard } from './cards/m3e-media-player-card';
export { M3EPeopleCard } from './cards/m3e-people-card';
export { M3EPopupCard } from './cards/m3e-popup-card';
export { M3ERemoteCard } from './cards/m3e-remote-card';
export { M3ESceneCard } from './cards/m3e-scene-card';
export { M3EStackCard } from './cards/m3e-stack-card';
export { M3EStatusBadge } from './cards/m3e-status-badge';
export { M3EStatusCard } from './cards/m3e-status-card';
export { M3ETabsCard } from './cards/m3e-tabs-card';
export { M3EThermostatCard } from './cards/m3e-thermostat-card';
export { M3EToggleCard } from './cards/m3e-toggle-card';
export type {
  HomeAssistant,
  HassEntity,
  M3EAssistCardConfig,
  M3EGlanceCardConfig,
  M3EGlanceItemConfig,
  M3ELightCardConfig,
  M3ELightControlCardConfig,
  M3ELightGroupCardConfig,
  M3EMediaBarCardConfig,
  M3EMediaPlayerCardConfig,
  M3EPeopleCardConfig,
  M3EPeopleItemConfig,
  M3EPopupCardConfig,
  M3ERemoteCardConfig,
  M3ERemoteCustomControl,
  M3ERemoteCustomSegment,
  M3ESceneCardConfig,
  M3EStackCardConfig,
  M3EStackItemConfig,
  M3EStatusCardConfig,
  M3EStatusPopupType,
  M3ETabItemConfig,
  M3ETabsCardConfig,
  M3EThermostatCardConfig,
  M3EToggleCardConfig,
} from './types/home-assistant';

import type { HomeAssistant, LovelaceCardConfig } from './types/home-assistant';

export interface CustomCardEntitySuggestion {
  config: LovelaceCardConfig;
  label?: string;
}

interface CustomCardEntry {
  type: string;
  name: string;
  description: string;
  preview?: boolean;
  documentationURL?: string;
  getEntitySuggestion?: (
    hass: HomeAssistant,
    entityId: string,
  ) => CustomCardEntitySuggestion | CustomCardEntitySuggestion[] | null;
}

declare global {
  interface Window {
    customCards?: CustomCardEntry[];
    customBadges?: CustomCardEntry[];
  }
}

function getDomain(entityId: string): string {
  return entityId.split('.')[0] ?? '';
}

function isLightGroupEntity(hass: HomeAssistant, entityId: string): boolean {
  if (getDomain(entityId) !== 'light') return false;
  const members = hass?.states?.[entityId]?.attributes?.entity_id;
  return Array.isArray(members) && members.length > 0;
}

function isNumericSensor(hass: HomeAssistant, entityId: string): boolean {
  if (getDomain(entityId) !== 'sensor') return false;
  const st = hass?.states?.[entityId];
  if (!st) return false;
  if (typeof st.attributes?.unit_of_measurement === 'string' && st.attributes.unit_of_measurement) {
    return true;
  }
  const n = Number(st.state);
  return st.state !== '' && !Number.isNaN(n) && Number.isFinite(n);
}

const TOGGLE_DOMAINS = new Set([
  'switch',
  'input_boolean',
  'fan',
  'humidifier',
  'lock',
  'valve',
  'siren',
]);

const SCENE_DOMAINS = new Set(['scene', 'script', 'button', 'input_button', 'automation']);

const STATUS_CARD_DOMAINS = new Set([
  'sensor',
  'binary_sensor',
  'climate',
  'media_player',
  'remote',
  'select',
  'input_select',
  'switch',
  'cover',
  'lock',
  'fan',
  'vacuum',
  'weather',
  'alarm_control_panel',
  'timer',
  'counter',
  'number',
  'input_number',
  'calendar',
  'water_heater',
  'humidifier',
  'device_tracker',
  'person',
]);

const GLANCE_DOMAINS = new Set([
  'sensor',
  'binary_sensor',
  'weather',
  'climate',
  'lock',
  'cover',
  'alarm_control_panel',
  'person',
]);

const BADGE_DOMAINS = new Set([
  'sensor',
  'binary_sensor',
  'person',
  'device_tracker',
  'climate',
  'weather',
  'lock',
  'cover',
  'alarm_control_panel',
  'timer',
  'counter',
  'number',
  'input_number',
  'switch',
  'light',
  'fan',
  'media_player',
  'vacuum',
]);

function registerCard(entry: CustomCardEntry): void {
  window.customCards = window.customCards || [];
  if (!window.customCards.some((c) => c.type === entry.type)) {
    window.customCards.push(entry);
  }
}

function registerBadge(entry: CustomCardEntry): void {
  window.customBadges = window.customBadges || [];
  if (!window.customBadges.some((c) => c.type === entry.type)) {
    window.customBadges.push(entry);
  }
}

registerCard({
  type: 'm3e-light-card',
  name: 'Light Card',
  description:
    'Google Home–style horizontal light slider tile with vertical capsule popup, shape morphing, and Material You integration.',
  preview: true,
  getEntitySuggestion: (_hass, entityId) => {
    if (getDomain(entityId) !== 'light') return null;
    return { config: { type: 'custom:m3e-light-card', entity: entityId } };
  },
});

registerCard({
  type: 'm3e-status-card',
  name: 'Status Card',
  description:
    'Google Home–style status tile with dual state icons, device sibling auto-discovery, and modular popups (Sensor, Selector, Climate, Remote, Media).',
  preview: true,
  getEntitySuggestion: (_hass, entityId) => {
    const domain = getDomain(entityId);
    if (!STATUS_CARD_DOMAINS.has(domain)) return null;
    const popup_type =
      domain === 'sensor' || domain === 'binary_sensor'
        ? 'sensor'
        : domain === 'climate'
          ? 'climate'
          : domain === 'media_player'
            ? 'media'
            : domain === 'remote'
              ? 'remote'
              : domain === 'select' || domain === 'input_select'
                ? 'selector'
                : 'custom';
    return {
      config: { type: 'custom:m3e-status-card', entity: entityId, popup_type },
    };
  },
});

registerCard({
  type: 'm3e-toggle-card',
  name: 'Toggle Card',
  description:
    'Google Home–style switch/outlet toggle tile with morphing vertical switch popup.',
  preview: true,
  getEntitySuggestion: (_hass, entityId) => {
    if (!TOGGLE_DOMAINS.has(getDomain(entityId))) return null;
    return { config: { type: 'custom:m3e-toggle-card', entity: entityId } };
  },
});

registerCard({
  type: 'm3e-scene-card',
  name: 'Scene / Button Card',
  description:
    'Google Home–style one-tap scene, script, or button tile with animated activation feedback.',
  preview: true,
  getEntitySuggestion: (_hass, entityId) => {
    if (!SCENE_DOMAINS.has(getDomain(entityId))) return null;
    return { config: { type: 'custom:m3e-scene-card', entity: entityId } };
  },
});

registerCard({
  type: 'm3e-light-control-card',
  name: 'Light Control (All on / All off)',
  description:
    'Google Home–style dual-choice pill switch with sliding indicator to turn on/off lights or all home lights.',
  preview: true,
  getEntitySuggestion: (hass, entityId) => {
    if (!isLightGroupEntity(hass, entityId)) return null;
    return {
      config: { type: 'custom:m3e-light-control-card', entities: [entityId] },
    };
  },
});

registerCard({
  type: 'm3e-light-group-card',
  name: 'Light Group Card',
  description:
    'Google Home–style expandable light group bar with aggregate brightness slider and 2-column child light grid.',
  preview: true,
  getEntitySuggestion: (hass, entityId) => {
    if (!isLightGroupEntity(hass, entityId)) return null;
    return { config: { type: 'custom:m3e-light-group-card', entity: entityId } };
  },
});

const assistCardEntry: CustomCardEntry = {
  type: 'm3e-assist-card',
  name: 'Assist & Mode Bar',
  description:
    'Google Home–style "Ask Home" Assist bar with a left Home/Away input_select mode selector.',
  preview: true,
  getEntitySuggestion: (_hass, entityId) => {
    const domain = getDomain(entityId);
    if (domain !== 'input_select' && domain !== 'select') return null;
    return { config: { type: 'custom:m3e-assist-card', entity: entityId } };
  },
};
registerCard(assistCardEntry);
registerBadge(assistCardEntry);

registerCard({
  type: 'm3e-glance-card',
  name: 'At a Glance Strip',
  description:
    'Google Home–style horizontally scrollable At a Glance bar with circular tonal icon badges and per-entity state/attribute customization.',
  preview: true,
  getEntitySuggestion: (_hass, entityId) => {
    if (!GLANCE_DOMAINS.has(getDomain(entityId))) return null;
    return {
      config: { type: 'custom:m3e-glance-card', items: [{ entity: entityId }] },
    };
  },
});

registerCard({
  type: 'm3e-people-card',
  name: 'People Glance',
  description:
    'At a Glance card dedicated to people (avatar, name, location) with scrollable, full-row, vertical list, and compact layout modes.',
  preview: true,
  getEntitySuggestion: (_hass, entityId) => {
    const domain = getDomain(entityId);
    if (domain !== 'person' && domain !== 'device_tracker') return null;
    return {
      config: { type: 'custom:m3e-people-card', items: [{ entity: entityId }] },
    };
  },
});

registerCard({
  type: 'm3e-thermostat-card',
  name: 'Thermostat Card',
  description:
    'Full-width Google Home–style thermostat card with +/- pill steppers, heat/cool semantic colors, offline state, and full climate dial popup.',
  preview: true,
  getEntitySuggestion: (_hass, entityId) => {
    if (getDomain(entityId) !== 'climate') return null;
    return { config: { type: 'custom:m3e-thermostat-card', entity: entityId } };
  },
});

registerCard({
  type: 'm3e-stack-card',
  name: 'Stack',
  description:
    'Google Home–style comparison card to list and compare multiple sensors side-by-side with customizable header icon and title.',
  preview: true,
  getEntitySuggestion: (hass, entityId) => {
    if (!isNumericSensor(hass, entityId)) return null;
    const friendly = String(hass?.states?.[entityId]?.attributes?.friendly_name ?? '').trim();
    return {
      config: {
        type: 'custom:m3e-stack-card',
        ...(friendly ? { title: friendly } : {}),
        items: [{ entity: entityId }],
      },
    };
  },
});

registerCard({
  type: 'm3e-media-bar-card',
  name: 'Media Bar',
  description:
    'Footer-ready Google Home–style media player bar with squircle artwork, auto-scrolling marquee metadata, Cast/Source selector, and Play/Pause button.',
  preview: true,
  getEntitySuggestion: (_hass, entityId) => {
    if (getDomain(entityId) !== 'media_player') return null;
    return { config: { type: 'custom:m3e-media-bar-card', entity: entityId } };
  },
});

registerCard({
  type: 'm3e-media-player-card',
  name: 'Media Player',
  description:
    'Full-bleed Material 3 Expressive media player card with dynamic artwork color extraction, shape-morphing Play/Pause, and animated wavy progress slider.',
  preview: true,
  getEntitySuggestion: (_hass, entityId) => {
    if (getDomain(entityId) !== 'media_player') return null;
    return { config: { type: 'custom:m3e-media-player-card', entity: entityId } };
  },
});

registerCard({
  type: 'm3e-popup-card',
  name: 'Pop-up Card',
  description:
    'Customizable Material 3 Expressive pop-up container with entity header button, native HA Add card picker / vertical-stack support, and hash/path navigation trigger.',
  preview: true,
});

registerCard({
  type: 'm3e-tabs-card',
  name: 'Tabs Card',
  description:
    'Flat Material 3 Expressive animated tab pills (up to 4 tabs) with morphing active indicator, 12-column card grid per tab, and native HA drag-and-drop / Add card editor.',
  preview: true,
});

registerCard({
  type: 'm3e-remote-card',
  name: 'Remote Card',
  description:
    'Google Home–style Material 3 Expressive TV & Media remote card with gesture touchpad / D-Pad, volume rocker, out-of-the-box multi-platform commands, and custom native buttons & segmented pills.',
  preview: true,
  getEntitySuggestion: (_hass, entityId) => {
    const domain = getDomain(entityId);
    if (domain !== 'remote' && domain !== 'media_player') return null;
    return { config: { type: 'custom:m3e-remote-card', entity: entityId } };
  },
});

const statusBadgeEntry: CustomCardEntry = {
  type: 'm3e-status-badge',
  name: 'Status Badge',
  description:
    'Compact Material 3 Expressive status badge (Glance Mini, Split Tonal Pill, Minimal Dot, Squircle Alert) for dashboard headers or compact grids.',
  preview: true,
  getEntitySuggestion: (_hass, entityId) => {
    if (!BADGE_DOMAINS.has(getDomain(entityId))) return null;
    return { config: { type: 'custom:m3e-status-badge', entity: entityId } };
  },
};
registerBadge(statusBadgeEntry);
registerCard(statusBadgeEntry);
