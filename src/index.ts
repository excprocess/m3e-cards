import './cards/m3e-light-card';
import './cards/m3e-status-card';
import './cards/m3e-toggle-card';

export { M3ELightCard } from './cards/m3e-light-card';
export { M3EStatusCard } from './cards/m3e-status-card';
export { M3EToggleCard } from './cards/m3e-toggle-card';
export type {
  HomeAssistant,
  HassEntity,
  M3ELightCardConfig,
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
