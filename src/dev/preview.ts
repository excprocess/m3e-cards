import {
  argbFromHex,
  DynamicColor,
  Hct,
  hexFromArgb,
  MaterialDynamicColors,
  SchemeContent,
  SchemeExpressive,
  SchemeFidelity,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeTonalSpot,
  SchemeVibrant,
} from '@material/material-color-utilities';
import '../index';
import type { M3ELightCard } from '../cards/m3e-light-card';
import type { M3EStatusCard } from '../cards/m3e-status-card';
import type { M3EToggleCard } from '../cards/m3e-toggle-card';
import type {
  HassEntity,
  HomeAssistant,
  M3ELightCardConfig,
  M3EStatusCardConfig,
  M3EToggleCardConfig,
} from '../types/home-assistant';

const MATERIAL_COLORS: (keyof typeof MaterialDynamicColors)[] = [
  'primary',
  'onPrimary',
  'primaryContainer',
  'onPrimaryContainer',
  'inversePrimary',
  'secondary',
  'onSecondary',
  'secondaryContainer',
  'onSecondaryContainer',
  'tertiary',
  'onTertiary',
  'tertiaryContainer',
  'onTertiaryContainer',
  'error',
  'onError',
  'errorContainer',
  'onErrorContainer',
  'surface',
  'onSurface',
  'surfaceVariant',
  'onSurfaceVariant',
  'surfaceDim',
  'surfaceBright',
  'surfaceContainerLowest',
  'surfaceContainerLow',
  'surfaceContainer',
  'surfaceContainerHigh',
  'surfaceContainerHighest',
  'inverseSurface',
  'inverseOnSurface',
  'surfaceTint',
  'outline',
  'outlineVariant',
  'shadow',
  'scrim',
];

const SCHEMES = {
  expressive: { cls: SchemeExpressive, spec: '2025' as const },
  tonalspot: { cls: SchemeTonalSpot, spec: '2025' as const },
  vibrant: { cls: SchemeVibrant, spec: '2025' as const },
  neutral: { cls: SchemeNeutral, spec: '2025' as const },
  fidelity: { cls: SchemeFidelity, spec: '2021' as const },
  content: { cls: SchemeContent, spec: '2021' as const },
  monochrome: { cls: SchemeMonochrome, spec: '2021' as const },
};

const CARD_TYPES = {
  elevated: {
    '--ha-card-background': 'var(--md-sys-color-surface-container-low)',
    '--ha-card-box-shadow': 'var(--md-sys-elevation-level1)',
    '--ha-card-border-width': '0px',
    '--ha-card-border-color': 'transparent',
  },
  filled: {
    '--ha-card-background': 'var(--md-sys-color-surface-container-highest)',
    '--ha-card-box-shadow': 'var(--md-sys-elevation-level0)',
    '--ha-card-border-width': '0px',
    '--ha-card-border-color': 'transparent',
  },
  outlined: {
    '--ha-card-background': 'var(--md-sys-color-surface)',
    '--ha-card-box-shadow': 'var(--md-sys-elevation-level0)',
    '--ha-card-border-width': '1px',
    '--ha-card-border-color': 'var(--md-sys-color-outline-variant)',
  },
  transparent: {
    '--ha-card-background': 'transparent',
    '--ha-card-box-shadow': 'var(--md-sys-elevation-level0)',
    '--ha-card-border-width': '0px',
    '--ha-card-border-color': 'transparent',
  },
};

const SWATCHES = ['#4C5C92', '#386A20', '#9C4146', '#825500', '#006874', '#7C4E7E'];

function toKebab(token: string): string {
  return token.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

const state = {
  baseColor: '#4C5C92',
  scheme: 'expressive' as keyof typeof SCHEMES,
  cardType: 'elevated' as keyof typeof CARD_TYPES,
  contrast: 0,
  isDark: true,
};

function applyMaterialYouTheme(): void {
  const root = document.documentElement;
  const info = SCHEMES[state.scheme];
  const hct = Hct.fromInt(argbFromHex(state.baseColor));
  const scheme = new info.cls(hct, state.isDark, state.contrast, info.spec, 'phone');

  for (const key of MATERIAL_COLORS) {
    const dyn = MaterialDynamicColors[key] as DynamicColor | undefined;
    if (!dyn || typeof dyn.getArgb !== 'function') continue;
    root.style.setProperty(`--md-sys-color-${toKebab(key)}`, hexFromArgb(dyn.getArgb(scheme)));
  }

  const cardVars = CARD_TYPES[state.cardType];
  for (const [prop, val] of Object.entries(cardVars)) {
    root.style.setProperty(prop, val);
  }
}

const entities: Record<string, HassEntity> = {
  'light.cucina': {
    entity_id: 'light.cucina',
    state: 'on',
    attributes: {
      friendly_name: 'Lampada cucina',
      brightness: 138, // 54%
      rgb_color: [255, 224, 102],
      color_temp_kelvin: 2200,
      supported_color_modes: ['rgb', 'color_temp'],
    },
  },
  'light.soggiorno': {
    entity_id: 'light.soggiorno',
    state: 'on',
    attributes: {
      friendly_name: 'Soggiorno',
      brightness: 212, // 83%
      rgb_color: [255, 240, 184],
      color_temp_kelvin: 3200,
      supported_color_modes: ['color_temp'],
    },
  },
  'light.scrivania': {
    entity_id: 'light.scrivania',
    state: 'off',
    attributes: {
      friendly_name: 'Lampada scrivania',
      brightness: 0,
      rgb_color: [255, 230, 138],
      supported_color_modes: ['brightness'],
    },
  },
  'light.camera': {
    entity_id: 'light.camera',
    state: 'on',
    attributes: {
      friendly_name: 'Striscia LED Camera',
      brightness: 185, // 73%
      supported_color_modes: ['brightness'],
    },
  },
  // Status Card demo entities (all 4 popup variants)
  'binary_sensor.cucina_motion': {
    entity_id: 'binary_sensor.cucina_motion',
    state: 'on',
    attributes: {
      friendly_name: 'Cucina motion sensor',
      device_class: 'motion',
    },
  },
  'sensor.cucina_temperature': {
    entity_id: 'sensor.cucina_temperature',
    state: '21.5',
    attributes: {
      friendly_name: 'Temperature',
      device_class: 'temperature',
      unit_of_measurement: '°C',
    },
  },
  'sensor.salotto_temperature': {
    entity_id: 'sensor.salotto_temperature',
    state: '20.2',
    attributes: {
      friendly_name: 'Termometro salotto',
      device_class: 'temperature',
      unit_of_measurement: '°C',
    },
  },
  'sensor.salotto_humidity': {
    entity_id: 'sensor.salotto_humidity',
    state: '54',
    attributes: {
      friendly_name: 'Humidity',
      device_class: 'humidity',
      unit_of_measurement: '%',
    },
  },
  'sensor.outdoor_temperature': {
    entity_id: 'sensor.outdoor_temperature',
    state: '11',
    attributes: {
      friendly_name: 'Outdoor temperature',
      device_class: 'temperature',
      unit_of_measurement: '°',
    },
  },
  'climate.termostato': {
    entity_id: 'climate.termostato',
    state: 'heat',
    attributes: {
      friendly_name: 'Termostato',
      temperature: 9,
      current_temperature: 21,
      min_temp: 7,
      max_temp: 30,
      hvac_modes: ['heat', 'cool', 'off'],
    },
  },
  'climate.daikin_ap12560': {
    entity_id: 'climate.daikin_ap12560',
    state: 'cool',
    attributes: {
      friendly_name: 'DaikinAP12560',
      temperature: 22,
      current_temperature: 20,
      current_humidity: 48,
      min_temp: 16,
      max_temp: 30,
      hvac_modes: ['heat', 'cool', 'dry', 'fan_only', 'off'],
      preset_mode: 'none',
      preset_modes: ['none', 'eco', 'boost'],
      fan_mode: 'auto',
      fan_modes: ['auto', 'quiet', 'low', 'medium', 'high'],
      swing_mode: 'off',
      swing_modes: ['off', 'vertical', 'horizontal', 'both'],
    },
  },
  'media_player.televisione_sony': {
    entity_id: 'media_player.televisione_sony',
    state: 'off',
    attributes: {
      friendly_name: 'televisione sony',
      device_class: 'tv',
      source: 'HDMI 1',
      volume_level: 0.35,
    },
  },
  'media_player.chromecast': {
    entity_id: 'media_player.chromecast',
    state: 'playing',
    attributes: {
      friendly_name: 'Chromecast',
      media_title: 'Numb',
      media_artist: 'Elderbrook',
      app_name: 'Spotify',
      volume_level: 1.0,
    },
  },
  'media_player.salotto_speaker': {
    entity_id: 'media_player.salotto_speaker',
    state: 'idle',
    attributes: {
      friendly_name: 'Salotto speaker',
      volume_level: 0.4,
    },
  },
  // Toggle Card demo entities
  'switch.caricatore': {
    entity_id: 'switch.caricatore',
    state: 'on',
    attributes: {
      friendly_name: 'Caricatore',
      icon: 'mdi:power-socket-us',
    },
  },
  'switch.usb_ospiti': {
    entity_id: 'switch.usb_ospiti',
    state: 'off',
    attributes: {
      friendly_name: 'usb ospiti',
      icon: 'mdi:light-switch',
    },
  },
};

const entityRegistry = {
  'binary_sensor.cucina_motion': {
    entity_id: 'binary_sensor.cucina_motion',
    device_id: 'dev_cucina_motion',
  },
  'sensor.cucina_temperature': {
    entity_id: 'sensor.cucina_temperature',
    device_id: 'dev_cucina_motion',
  },
  'sensor.salotto_temperature': {
    entity_id: 'sensor.salotto_temperature',
    device_id: 'dev_salotto_env',
  },
  'sensor.salotto_humidity': {
    entity_id: 'sensor.salotto_humidity',
    device_id: 'dev_salotto_env',
  },
};

const cards: Array<M3ELightCard | M3EStatusCard | M3EToggleCard> = [];
const logEl = document.getElementById('service-log')!;

function createHass(): HomeAssistant {
  return {
    states: { ...entities },
    entities: entityRegistry,
    themes: { darkMode: state.isDark, theme: 'Material You' },
    callService(domain, service, data = {}) {
      const entityId = String(data.entity_id ?? '');
      const current = entities[entityId];

      let next: HassEntity | undefined = current;
      if (current && domain === 'light') {
        if (service === 'toggle') {
          const turningOn = current.state !== 'on';
          next = {
            ...current,
            state: turningOn ? 'on' : 'off',
            attributes: {
              ...current.attributes,
              brightness: turningOn ? current.attributes.brightness || 180 : 0,
            },
          };
        } else if (service === 'turn_off') {
          next = {
            ...current,
            state: 'off',
            attributes: { ...current.attributes, brightness: 0 },
          };
        } else if (service === 'turn_on') {
          const pct =
            typeof data.brightness_pct === 'number'
              ? data.brightness_pct
              : current.attributes.brightness
                ? Math.round((current.attributes.brightness / 255) * 100)
                : 100;
          next = {
            ...current,
            state: 'on',
            attributes: {
              ...current.attributes,
              brightness: Math.round((pct / 100) * 255),
              ...(Array.isArray(data.rgb_color)
                ? { rgb_color: data.rgb_color as [number, number, number] }
                : {}),
              ...(typeof data.color_temp_kelvin === 'number'
                ? { color_temp_kelvin: data.color_temp_kelvin }
                : {}),
            },
          };
        }
      } else if (current && domain === 'climate') {
        if (service === 'set_temperature' && typeof data.temperature === 'number') {
          next = {
            ...current,
            state: current.state === 'off' ? 'heat' : current.state,
            attributes: { ...current.attributes, temperature: data.temperature },
          };
        } else if (service === 'set_hvac_mode' && typeof data.hvac_mode === 'string') {
          next = { ...current, state: data.hvac_mode };
        } else if (service === 'set_preset_mode' && typeof data.preset_mode === 'string') {
          next = {
            ...current,
            attributes: { ...current.attributes, preset_mode: data.preset_mode },
          };
        } else if (service === 'set_fan_mode' && typeof data.fan_mode === 'string') {
          next = {
            ...current,
            attributes: { ...current.attributes, fan_mode: data.fan_mode },
          };
        } else if (service === 'set_swing_mode' && typeof data.swing_mode === 'string') {
          next = {
            ...current,
            attributes: { ...current.attributes, swing_mode: data.swing_mode },
          };
        }
      } else if (current && domain === 'media_player') {
        if (service === 'volume_set' && typeof data.volume_level === 'number') {
          next = {
            ...current,
            attributes: { ...current.attributes, volume_level: data.volume_level },
          };
        } else if (service === 'media_play_pause') {
          next = {
            ...current,
            state: current.state === 'playing' ? 'paused' : 'playing',
          };
        } else if (service === 'turn_off') {
          next = { ...current, state: 'idle' };
        } else if (service === 'turn_on') {
          next = { ...current, state: 'on' };
        }
      } else if (current && (domain === 'switch' || domain === 'input_boolean')) {
        if (service === 'toggle') {
          next = { ...current, state: current.state === 'on' ? 'off' : 'on' };
        } else if (service === 'turn_on') {
          next = { ...current, state: 'on' };
        } else if (service === 'turn_off') {
          next = { ...current, state: 'off' };
        }
      }

      if (next && entityId) {
        entities[entityId] = next;
      }
      logEl.textContent = `callService("${domain}", "${service}", ${JSON.stringify(data)})`;
      pushHassToCards();
    },
  };
}

function pushHassToCards(): void {
  const hass = createHass();
  for (const card of cards) {
    card.hass = hass;
  }
}

function mountCard(container: HTMLElement, config: M3ELightCardConfig): M3ELightCard {
  const el = document.createElement('m3e-light-card') as M3ELightCard;
  el.setConfig(config);
  container.appendChild(el);
  cards.push(el);
  return el;
}

function mountStatusCard(container: HTMLElement, config: M3EStatusCardConfig): M3EStatusCard {
  const el = document.createElement('m3e-status-card') as M3EStatusCard;
  el.setConfig(config);
  container.appendChild(el);
  cards.push(el);
  return el;
}

function mountToggleCard(container: HTMLElement, config: M3EToggleCardConfig): M3EToggleCard {
  const el = document.createElement('m3e-toggle-card') as M3EToggleCard;
  el.setConfig(config);
  container.appendChild(el);
  cards.push(el);
  return el;
}

const toggleGrid = document.getElementById('toggle-grid')!;
mountToggleCard(toggleGrid, {
  type: 'custom:m3e-toggle-card',
  entity: 'switch.caricatore',
});
mountToggleCard(toggleGrid, {
  type: 'custom:m3e-toggle-card',
  entity: 'switch.usb_ospiti',
});

const statusGrid = document.getElementById('status-grid')!;
mountStatusCard(statusGrid, {
  type: 'custom:m3e-status-card',
  entity: 'binary_sensor.cucina_motion',
  label_active: 'Motion',
  label_inactive: 'No motion',
  popup_type: 'auto', // auto-discovers sensor.cucina_temperature via device_id!
});
mountStatusCard(statusGrid, {
  type: 'custom:m3e-status-card',
  entity: 'climate.daikin_ap12560',
  popup_type: 'auto', // adaptive: shows Mode, Preset, Fan speed, Swing + Indoor/Humidity/Outdoor
  outdoor_entity: 'sensor.outdoor_temperature',
});
mountStatusCard(statusGrid, {
  type: 'custom:m3e-status-card',
  entity: 'climate.termostato',
  popup_type: 'auto', // simple thermostat: shows only Mode + Indoor/Outdoor
  outdoor_entity: 'sensor.outdoor_temperature',
});
mountStatusCard(statusGrid, {
  type: 'custom:m3e-status-card',
  entity: 'media_player.televisione_sony',
  popup_type: 'remote',
  remote_buttons: {
    volume_up: 'button.sony_vol_up',
    mute: 'KEY_MUTE',
  },
});
mountStatusCard(statusGrid, {
  type: 'custom:m3e-status-card',
  entity: 'media_player.chromecast',
  popup_type: 'auto',
});
mountStatusCard(statusGrid, {
  type: 'custom:m3e-status-card',
  entity: 'sensor.salotto_temperature',
  icon_active: 'mdi:thermometer',
  popup_type: 'auto', // auto-discovers sensor.salotto_humidity (54%) via device_id!
});

const tileGrid = document.getElementById('tile-grid')!;
const kitchenCard = mountCard(tileGrid, {
  type: 'custom:m3e-light-card',
  entity: 'light.cucina',
});
mountCard(tileGrid, { type: 'custom:m3e-light-card', entity: 'light.soggiorno' });
mountCard(tileGrid, { type: 'custom:m3e-light-card', entity: 'light.scrivania' });
mountCard(tileGrid, {
  type: 'custom:m3e-light-card',
  entity: 'light.camera',
  use_light_color: false,
});

document.getElementById('open-popup-btn')!.addEventListener('click', () => {
  kitchenCard.openPopup();
});

// Wire Material You Utilities simulator controls
const swatchesEl = document.getElementById('swatches')!;
SWATCHES.forEach((hex) => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `swatch ${hex === state.baseColor ? 'selected' : ''}`;
  btn.style.background = hex;
  btn.title = hex;
  btn.addEventListener('click', () => {
    state.baseColor = hex;
    swatchesEl.querySelectorAll('.swatch').forEach((s) => s.classList.remove('selected'));
    btn.classList.add('selected');
    applyMaterialYouTheme();
  });
  swatchesEl.appendChild(btn);
});

const schemeSelect = document.getElementById('scheme-select') as HTMLSelectElement;
schemeSelect.addEventListener('change', () => {
  state.scheme = schemeSelect.value as keyof typeof SCHEMES;
  applyMaterialYouTheme();
});

const cardTypeSelect = document.getElementById('card-type-select') as HTMLSelectElement;
cardTypeSelect.addEventListener('change', () => {
  state.cardType = cardTypeSelect.value as keyof typeof CARD_TYPES;
  applyMaterialYouTheme();
});

const contrastRange = document.getElementById('contrast-range') as HTMLInputElement;
const contrastVal = document.getElementById('contrast-val')!;
contrastRange.addEventListener('input', () => {
  state.contrast = parseFloat(contrastRange.value);
  contrastVal.textContent = state.contrast.toFixed(1);
  applyMaterialYouTheme();
});

const modeToggle = document.getElementById('mode-toggle') as HTMLButtonElement;
modeToggle.addEventListener('click', () => {
  state.isDark = !state.isDark;
  modeToggle.textContent = state.isDark ? 'Dark Mode' : 'Light Mode';
  modeToggle.classList.toggle('active', state.isDark);
  applyMaterialYouTheme();
});

applyMaterialYouTheme();
pushHassToCards();
