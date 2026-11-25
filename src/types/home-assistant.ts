export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: {
    friendly_name?: string;
    icon?: string;
    brightness?: number;
    color_temp_kelvin?: number;
    min_color_temp_kelvin?: number;
    max_color_temp_kelvin?: number;
    rgb_color?: [number, number, number];
    supported_color_modes?: string[];
    [key: string]: unknown;
  };
  last_changed?: string;
  last_updated?: string;
}

export interface HassEntityRegistryEntry {
  entity_id: string;
  device_id?: string | null;
  area_id?: string | null;
  options?: {
    light?: {
      favorite_colors?: Array<{
        rgb_color?: [number, number, number];
        color_temp_kelvin?: number;
      }>;
    };
  };
}

export interface HassDeviceRegistryEntry {
  id: string;
  name?: string | null;
  name_by_user?: string | null;
  area_id?: string | null;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities?: Record<string, HassEntityRegistryEntry>;
  devices?: Record<string, HassDeviceRegistryEntry>;
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
  ): Promise<void> | void;
  callWS?<T = unknown>(msg: Record<string, unknown>): Promise<T>;
  callApi?<T = unknown>(method: string, path: string): Promise<T>;
  themes?: {
    darkMode?: boolean;
    theme?: string;
  };
  language?: string;
}

export interface LovelaceCardConfig {
  type: string;
  [key: string]: unknown;
}

export interface M3ELightColorPreset {
  label?: string;
  rgb_color?: [number, number, number];
  color_temp_kelvin?: number;
}

export interface M3ELightCardConfig extends LovelaceCardConfig {
  entity: string;
  name?: string;
  icon?: string;
  /** Use the light's actual rgb_color / color_temp_kelvin when ON (default: true). Set false to always use Material You theme primary. */
  use_light_color?: boolean;
  /** Allow dragging all the way to 0% to turn the light off (default: true) */
  allow_drag_off?: boolean;
  /** Optional custom color/temperature presets (falls back to HA favorite_colors + recent colors + defaults) */
  favorite_colors?: M3ELightColorPreset[];
  /** Optional scene entities linked to this light (in addition to auto-discovered Hue/device/area scenes) */
  scenes?: string[];
  /** Material 3 Expressive tile shape style: default (28px), pill (full stadium), expressive (morphs 20px <-> pill), compact (56px / 18px) */
  card_style?: M3ECardStyle;
}

export type M3EStatusPopupType =
  | 'auto'
  | 'selector'
  | 'sensor'
  | 'climate'
  | 'remote'
  | 'media'
  | 'custom'
  | 'none';

export type M3EHoldAction = 'popup' | 'more-info' | 'navigate' | 'none';
export type M3ETapAction = 'popup' | 'toggle' | 'navigate' | 'more-info' | 'none';
export type M3ECardStyle = 'default' | 'pill' | 'morph' | 'expressive' | 'compact';
export type M3ESubtitleFormat = 'auto' | 'relative' | 'time' | 'datetime' | 'raw';
export type M3ESubtitleVisibility = 'both' | 'on' | 'off';

export interface M3EAssistCardConfig extends LovelaceCardConfig {
  /** Optional input_select / select entity for Home/Away mode (replaces Google Home's presence dot on the left) */
  entity?: string;
  /** Placeholder text inside the Assist bar (e.g. "Ask Corazza's" or "Chiedi a Casa") */
  placeholder?: string;
  /** Assist pipeline ID ('preferred', 'last_used', or specific pipeline ID) */
  pipeline_id?: string;
  /** Start voice listening immediately when opening Assist (default: false = opens chat) */
  start_listening?: boolean;
}

export type M3EGlanceTapAction = 'more-info' | 'toggle' | 'navigate' | 'none';

export interface M3EGlanceItemConfig {
  /** Home Assistant entity ID */
  entity: string;
  /** Custom bottom label (defaults to entity friendly_name) */
  name?: string;
  /** Optional attribute to display as the primary top value (defaults to entity state) */
  attribute?: string;
  /** Optional secondary attribute appended after " • " on the bottom label (e.g. AQI • Moderate) */
  secondary_attribute?: string;
  /** Optional custom MDI icon override (empty = auto M3 / Google Home SVG) */
  icon?: string;
  /** Optional unit/suffix override (e.g. "°" instead of "°C") */
  unit?: string;
  /** Action on tap: more-info (default), toggle, navigate, none */
  tap_action?: M3EGlanceTapAction;
  /** Target path / Bubble hash / script.* when tap_action is navigate */
  navigation_path?: string;
}

export interface M3EGlanceCardConfig extends LovelaceCardConfig {
  /** Ordered list of glance items displayed in the horizontal strip */
  items: M3EGlanceItemConfig[];
  /** Transparent background blending with dashboard (default: true). Set false to wrap in ha-card surface. */
  transparent?: boolean;
}

export interface M3ELightControlCardConfig extends LovelaceCardConfig {
  /** Optional list of light entities/groups. Leave empty to control ALL lights in Home Assistant. */
  entities?: string[];
  label_on?: string;
  label_off?: string;
  /** Use Material You theme primary-container instead of Google Home warm amber (default: false) */
  use_theme_color?: boolean;
}

export interface M3ELightGroupCardConfig extends LovelaceCardConfig {
  /** Home Assistant light group entity (exposing attributes.entity_id) */
  entity: string;
  name?: string;
  icon?: string;
  /** Start expanded by default (default: false) */
  expanded?: boolean;
  /** Use the group/light real color when ON (default: true) */
  use_light_color?: boolean;
  /** Card shape style for the group header & child tiles */
  card_style?: M3ECardStyle;
}

export interface M3ESceneCardConfig extends LovelaceCardConfig {
  entity: string;
  name?: string;
  /** Optional resting subtitle (leave empty for clean centered title) */
  subtitle?: string;
  /** Optional custom MDI icon (empty = standard Google Home outline -> filled sparkles) */
  icon?: string;
  /** Optional accent color role during activation (default: primary) */
  accent?: 'primary' | 'secondary' | 'tertiary';
  /** Material 3 Expressive tile shape style */
  card_style?: M3ECardStyle;
}

export interface M3EToggleCardConfig extends LovelaceCardConfig {
  entity: string;
  name?: string;
  icon_on?: string;
  icon_off?: string;
  label_on?: string;
  label_off?: string;
  /** Action on long-press: open M3E popup (default), native HA more-info, navigate/Bubble/Browser Mod, or none */
  hold_action?: M3EHoldAction;
  /** Dashboard path (/lovelace/...), Bubble Card hash (#popup), or script.* / browser_mod.* service */
  navigation_path?: string;
  /** Material 3 Expressive tile shape style */
  card_style?: M3ECardStyle;
}

export interface M3ERemoteButtonsConfig {
  volume_up?: string;
  volume_down?: string;
  mute?: string;
  unmute?: string;
  power_on?: string;
  power_off?: string;
  play?: string;
  pause?: string;
  prev?: string;
  next?: string;
  ch_up?: string;
  ch_down?: string;
}

export interface M3EStatusCardConfig extends LovelaceCardConfig {
  entity: string;
  name?: string;
  /** Optional linked entity used to determine active/inactive status (e.g. smart plug or ping sensor for a remote) */
  status_entity?: string;
  /** Icon shown when the entity is in an active state */
  icon_active?: string;
  /** Icon shown when the entity is in an inactive state */
  icon_inactive?: string;
  /** Comma-separated state values treated as active (e.g. "on,home,detected,playing,heat,cool") */
  active_state?: string;
  /** Optional custom label when active (e.g. "Motion", "In casa") */
  label_active?: string;
  /** Optional custom label when inactive (e.g. "No motion", "Fuori") */
  label_inactive?: string;
  /** Optional entity whose state/attribute is displayed as the card subtitle (e.g. next alarm sensor on Night Mode card) */
  subtitle_entity?: string;
  /** Optional attribute name to display as the card subtitle (reads from subtitle_entity if set, otherwise primary entity) */
  subtitle_attribute?: string;
  /** Optional text prefix before the custom subtitle value */
  subtitle_prefix?: string;
  /** Optional text suffix after the custom subtitle value */
  subtitle_suffix?: string;
  /** Timestamp / value display format: auto (HH:MM for ISO timestamps), relative (Tra 5h 40m), time (HH:MM), datetime (Oggi HH:MM), raw */
  subtitle_format?: M3ESubtitleFormat;
  /** When to show the custom subtitle/attribute: both (always), on (only when active), off (only when inactive) */
  subtitle_visibility?: M3ESubtitleVisibility;
  /** @deprecated Use subtitle_visibility: 'on' */
  subtitle_only_when_active?: boolean;
  /** Popup screen variant to open on tap/hold */
  popup_type?: M3EStatusPopupType;
  /** Optional secondary telemetry entity (auto-discovered from same device_id if omitted) */
  secondary_entity?: string;
  /** Optional list of additional entities (up to 10) displayed as clickable telemetry pills in the popup */
  extra_entities?: string[];
  /** Optional outdoor temperature entity (for climate popup telemetry) */
  outdoor_entity?: string;
  /** Primary tap behavior: open popup (default), toggle, navigate/Bubble/Browser Mod, more-info, or none */
  tap_action?: M3ETapAction;
  /** Action on long-press: open M3E popup (default), native HA more-info, navigate/Bubble/Browser Mod, or none */
  hold_action?: M3EHoldAction;
  /** Dashboard path (/lovelace/...), Bubble Card hash (#popup), or script.* / browser_mod.* service */
  navigation_path?: string;
  /** Optional target device ID for multi-device remote transmitters (remote.send_command device parameter) */
  remote_device?: string;
  /** Optional manual button entity IDs (button/script) or remote command names for Remote popup */
  remote_buttons?: M3ERemoteButtonsConfig;
}
