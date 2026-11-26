import type { HomeAssistant } from '../types/home-assistant';

export type M3ELocale = 'en' | 'it';

const STRINGS = {
  en: {
    close: 'Close',
    done: 'Done',
    offline: 'Offline',
    unavailable: 'Unavailable',
    on: 'On',
    off: 'Off',
    turn_on: 'Turn on',
    turn_off: 'Turn off',
    started: 'Started',
    history: 'Activity history',
    history_tooltip: 'Home Assistant activity history',
    more_options: 'More options',
    ha_details: 'Home Assistant details',
    now_playing: 'Now playing',
    playing: 'Playing',
    nothing_playing: 'Nothing playing',
    sources: 'Sources',
    stop_casting: 'Stop casting',
    cast: 'Cast',
    close_cast: 'Close Cast',
    mute: 'Mute',
    unmute: 'Unmute',
    muted: 'Muted',
    shuffle: 'Shuffle',
    repeat: 'Repeat',
    previous: 'Previous',
    next: 'Next',
    play: 'Play',
    pause: 'Pause',
    indoor: 'Indoor',
    outdoor_temperature: 'Outdoor temperature',
    humidity: 'Humidity',
    media_controls: 'Media & Controls',
    loading_features: 'Loading Features editor…',
    features_unavailable: 'Features editor requires Home Assistant 2025.2+.',
    home: 'Home',
    away: 'Away',
  },
  it: {
    close: 'Chiudi',
    done: 'Fatto',
    offline: 'Offline',
    unavailable: 'Non disponibile',
    on: 'On',
    off: 'Off',
    turn_on: 'Accendi',
    turn_off: 'Spegni',
    started: 'Avviata',
    history: 'Cronologia attività',
    history_tooltip: 'Cronologia attività Home Assistant',
    more_options: 'Altre opzioni',
    ha_details: 'Dettagli Home Assistant',
    now_playing: 'In riproduzione',
    playing: 'In riproduzione',
    nothing_playing: 'Nessuna riproduzione',
    sources: 'Sorgenti',
    stop_casting: 'Interrompi cast',
    cast: 'Cast',
    close_cast: 'Chiudi Cast',
    mute: 'Muto',
    unmute: 'Riattiva audio',
    muted: 'Muto',
    shuffle: 'Casuale',
    repeat: 'Ripeti',
    previous: 'Precedente',
    next: 'Successivo',
    play: 'Riproduci',
    pause: 'Pausa',
    indoor: 'Interno',
    outdoor_temperature: 'Temperatura esterna',
    humidity: 'Umidità',
    media_controls: 'Media & Controlli',
    loading_features: 'Caricamento editor Features…',
    features_unavailable: 'L’editor Features richiede Home Assistant 2025.2+.',
    home: 'Casa',
    away: 'Fuori casa',
  },
} as const;

export type M3ETranslationKey = keyof (typeof STRINGS)['en'];

export function getLocale(hass?: HomeAssistant): M3ELocale {
  const lang = (hass?.language ?? 'en').toLowerCase();
  return lang.startsWith('it') ? 'it' : 'en';
}

export function t(hass: HomeAssistant | undefined, key: M3ETranslationKey): string {
  return STRINGS[getLocale(hass)][key];
}
