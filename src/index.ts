import './cards/m3e-assist-card';
import './cards/m3e-glance-card';
import './cards/m3e-light-card';
import './cards/m3e-light-control-card';
import './cards/m3e-light-group-card';
import './cards/m3e-scene-card';
import './cards/m3e-status-card';
import './cards/m3e-toggle-card';

export { M3EAssistCard } from './cards/m3e-assist-card';
export { M3EGlanceCard } from './cards/m3e-glance-card';
export { M3ELightCard } from './cards/m3e-light-card';
export { M3ELightControlCard } from './cards/m3e-light-control-card';
export { M3ELightGroupCard } from './cards/m3e-light-group-card';
export { M3ESceneCard } from './cards/m3e-scene-card';
export { M3EStatusCard } from './cards/m3e-status-card';
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
  M3ESceneCardConfig,
  M3EStatusCardConfig,
  M3EStatusPopupType,
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
  }
}

function registerCard(entry: CustomCardEntry): void {
  window.customCards = window.customCards || [];
  if (!window.customCards.some((c) => c.type === entry.type)) {
    window.customCards.push(entry);
  }
}

registerCard({
  type: 'm3e-light-card',
  name: 'M3 Expressive Light Card',
  description:
    'Google Home–style horizontal light slider tile with vertical capsule popup, shape morphing, and Material You Utilities integration.',
  preview: true,
});

registerCard({
  type: 'm3e-status-card',
  name: 'M3 Expressive Status Card',
  description:
    'Google Home–style status tile with dual state icons, device sibling auto-discovery, and modular expanded popups (Sensor, Climate, Remote, Media).',
  preview: true,
});

registerCard({
  type: 'm3e-toggle-card',
  name: 'M3 Expressive Toggle Card',
  description:
    'Google Home–style switch/outlet toggle tile with morphing vertical switch popup.',
  preview: true,
});

registerCard({
  type: 'm3e-scene-card',
  name: 'M3 Expressive Scene / Button Card',
  description:
    'Google Home–style one-tap scene, script, or button tile with animated activation feedback.',
  preview: true,
});

registerCard({
  type: 'm3e-light-control-card',
  name: 'M3 Expressive Light Control (All on / All off)',
  description:
    'Google Home–style dual-choice pill switch with sliding indicator to turn on/off lights or all home lights.',
  preview: true,
});

registerCard({
  type: 'm3e-light-group-card',
  name: 'M3 Expressive Light Group Card',
  description:
    'Google Home–style expandable light group bar with aggregate brightness slider and 2-column child light grid.',
  preview: true,
});

registerCard({
  type: 'm3e-assist-card',
  name: 'M3 Expressive Assist & Mode Bar',
  description:
    'Google Home–style "Ask Home" Assist bar with a left Home/Away input_select mode selector in Material 3 Expressive.',
  preview: true,
});

registerCard({
  type: 'm3e-glance-card',
  name: 'M3 Expressive At a Glance Strip',
  description:
    'Google Home–style horizontally scrollable At a Glance bar with circular tonal icon badges and per-entity state/attribute customization.',
  preview: true,
});
