import './cards/m3e-assist-card';
import './cards/m3e-glance-card';
import './cards/m3e-light-card';
import './cards/m3e-light-control-card';
import './cards/m3e-light-group-card';
import './cards/m3e-media-bar-card';
import './cards/m3e-media-player-card';
import './cards/m3e-people-card';
import './cards/m3e-remote-card';
import './cards/m3e-scene-card';
import './cards/m3e-stack-card';
import './cards/m3e-status-badge';
import './cards/m3e-status-card';
import './cards/m3e-thermostat-card';
import './cards/m3e-toggle-card';

export { M3EAssistCard } from './cards/m3e-assist-card';
export { M3EGlanceCard } from './cards/m3e-glance-card';
export { M3ELightCard } from './cards/m3e-light-card';
export { M3ELightControlCard } from './cards/m3e-light-control-card';
export { M3ELightGroupCard } from './cards/m3e-light-group-card';
export { M3EMediaBarCard } from './cards/m3e-media-bar-card';
export { M3EMediaPlayerCard } from './cards/m3e-media-player-card';
export { M3EPeopleCard } from './cards/m3e-people-card';
export { M3ERemoteCard } from './cards/m3e-remote-card';
export { M3ESceneCard } from './cards/m3e-scene-card';
export { M3EStackCard } from './cards/m3e-stack-card';
export { M3EStatusBadge } from './cards/m3e-status-badge';
export { M3EStatusCard } from './cards/m3e-status-card';
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
  M3ERemoteCardConfig,
  M3ERemoteCustomControl,
  M3ERemoteCustomSegment,
  M3ESceneCardConfig,
  M3EStackCardConfig,
  M3EStackItemConfig,
  M3EStatusCardConfig,
  M3EStatusPopupType,
  M3EThermostatCardConfig,
  M3EToggleCardConfig,
} from './types/home-assistant';

interface CustomCardEntry {
  type: string;
  name: string;
  description: string;
  preview?: boolean;
}

declare global {
  interface Window {
    customCards?: CustomCardEntry[];
    customBadges?: CustomCardEntry[];
  }
}

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
});

registerCard({
  type: 'm3e-status-card',
  name: 'Status Card',
  description:
    'Google Home–style status tile with dual state icons, device sibling auto-discovery, and modular popups (Sensor, Selector, Climate, Remote, Media).',
  preview: true,
});

registerCard({
  type: 'm3e-toggle-card',
  name: 'Toggle Card',
  description:
    'Google Home–style switch/outlet toggle tile with morphing vertical switch popup.',
  preview: true,
});

registerCard({
  type: 'm3e-scene-card',
  name: 'Scene / Button Card',
  description:
    'Google Home–style one-tap scene, script, or button tile with animated activation feedback.',
  preview: true,
});

registerCard({
  type: 'm3e-light-control-card',
  name: 'Light Control (All on / All off)',
  description:
    'Google Home–style dual-choice pill switch with sliding indicator to turn on/off lights or all home lights.',
  preview: true,
});

registerCard({
  type: 'm3e-light-group-card',
  name: 'Light Group Card',
  description:
    'Google Home–style expandable light group bar with aggregate brightness slider and 2-column child light grid.',
  preview: true,
});

const assistCardEntry: CustomCardEntry = {
  type: 'm3e-assist-card',
  name: 'Assist & Mode Bar',
  description:
    'Google Home–style "Ask Home" Assist bar with a left Home/Away input_select mode selector.',
  preview: true,
};
registerCard(assistCardEntry);
registerBadge(assistCardEntry);

registerCard({
  type: 'm3e-glance-card',
  name: 'At a Glance Strip',
  description:
    'Google Home–style horizontally scrollable At a Glance bar with circular tonal icon badges and per-entity state/attribute customization.',
  preview: true,
});

registerCard({
  type: 'm3e-people-card',
  name: 'People Glance',
  description:
    'At a Glance card dedicated to people (avatar, name, location) with scrollable, full-row, vertical list, and compact layout modes.',
  preview: true,
});

registerCard({
  type: 'm3e-thermostat-card',
  name: 'Thermostat Card',
  description:
    'Full-width Google Home–style thermostat card with +/- pill steppers, heat/cool semantic colors, offline state, and full climate dial popup.',
  preview: true,
});

registerCard({
  type: 'm3e-stack-card',
  name: 'Stack',
  description:
    'Google Home–style comparison card to list and compare multiple sensors side-by-side with customizable header icon and title.',
  preview: true,
});

registerCard({
  type: 'm3e-media-bar-card',
  name: 'Media Bar',
  description:
    'Footer-ready Google Home–style media player bar with squircle artwork, auto-scrolling marquee metadata, Cast/Source selector, and Play/Pause button.',
  preview: true,
});

registerCard({
  type: 'm3e-media-player-card',
  name: 'Media Player',
  description:
    'Full-bleed Material 3 Expressive media player card with dynamic artwork color extraction, shape-morphing Play/Pause, and animated wavy progress slider.',
  preview: true,
});

registerCard({
  type: 'm3e-remote-card',
  name: 'Remote Card',
  description:
    'Google Home–style Material 3 Expressive TV & Media remote card with gesture touchpad / D-Pad, volume rocker, out-of-the-box multi-platform commands, and custom native buttons & segmented pills.',
  preview: true,
});

const statusBadgeEntry: CustomCardEntry = {
  type: 'm3e-status-badge',
  name: 'Status Badge',
  description:
    'Compact Material 3 Expressive status badge (Glance Mini, Split Tonal Pill, Minimal Dot, Squircle Alert) for dashboard headers or compact grids.',
  preview: true,
};
registerBadge(statusBadgeEntry);
registerCard(statusBadgeEntry);
