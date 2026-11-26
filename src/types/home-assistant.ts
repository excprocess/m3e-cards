import type {
  LovelaceCardFeatureConfig,
  M3EFeaturesPosition,
} from '../utils/ha-card-features';
import type { EntityNameConfig, StateContentConfig } from '../utils/entity-display';

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
  platform?: string;
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
  areas?: Record<string, { area_id: string; name: string; floor_id?: string | null }>;
  floors?: Record<string, { floor_id: string; name: string }>;
  formatEntityName?: (stateObj: HassEntity, type: EntityNameConfig) => string;
  formatEntityState?: (stateObj: HassEntity, state?: string) => string;
  formatEntityAttributeValue?: (stateObj: HassEntity, attribute: string, value?: unknown) => string;
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
  name?: EntityNameConfig;
  icon?: string;
  /** Hide the secondary state/brightness line on the tile (default: false) */
  hide_state?: boolean;
  /** Native Home Assistant state content selector (state, last_changed, or entity attributes) */
  state_content?: StateContentConfig;
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
  | 'power_strip'
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

export type M3EPeopleLayout = 'scroll' | 'row' | 'list';
export type M3EPeopleSize = 'default' | 'compact';

export interface M3EPeopleItemConfig {
  /** Home Assistant person.* or device_tracker.* entity ID */
  entity: string;
  /** Optional custom display name (defaults to entity friendly_name) */
  name?: string;
  /** Optional custom MDI icon override (used instead of entity_picture if set) */
  icon?: string;
  /** Optional custom image URL override (defaults to entity.attributes.entity_picture) */
  image?: string;
  /** Optional tap action: more-info (default), navigate, none */
  tap_action?: 'more-info' | 'navigate' | 'none';
  /** Target path / Bubble hash / script.* when tap_action is navigate */
  navigation_path?: string;
}

export interface M3EPeopleCardConfig extends LovelaceCardConfig {
  /** Ordered list of people to display */
  items: M3EPeopleItemConfig[];
  /** Layout mode: scroll (horizontal scrollable like At a Glance), row (no scroll, fills full row), list (vertical full-width list) */
  layout?: M3EPeopleLayout;
  /** Visual size: default (46px avatar) or compact (36px avatar) */
  size?: M3EPeopleSize;
  /** Transparent background blending with dashboard (default: true). Set false to wrap in ha-card surface. */
  transparent?: boolean;
  /** Show subtle M3 presence indicator ring/dot when person is Home (default: true) */
  show_presence_indicator?: boolean;
}

export interface M3EThermostatCardConfig extends LovelaceCardConfig {
  /** Home Assistant climate.* entity ID */
  entity: string;
  /** Optional custom name override */
  name?: string;
  /** Optional custom outdoor temperature sensor (forwarded to the Climate popup) */
  outdoor_entity?: string;
  /** Optional temperature step override (defaults to entity target_temp_step or 0.5) */
  step?: number;
}

export interface M3EStackItemConfig {
  /** Home Assistant entity ID (sensor.*, climate.*, etc.) */
  entity: string;
  /** Optional custom row label (defaults to entity friendly_name) */
  name?: string;
  /** Optional attribute to display instead of entity state (for climate.* defaults to current_temperature) */
  attribute?: string;
}

export interface M3EStackCardConfig extends LovelaceCardConfig {
  /** Header title on the top-left (e.g. "Indoor temperatures") */
  title?: string;
  /** Optional custom MDI icon on the top-left (empty = Google Home outlined house) */
  icon?: string;
  /** Show unit_of_measurement next to values (default: false to match Google Home clean numbers) */
  show_unit?: boolean;
  /** Ordered list of sensors/entities to compare */
  items: M3EStackItemConfig[];
}

export interface M3EMediaBarCardConfig extends LovelaceCardConfig {
  /** Primary media_player.* entity ID */
  entity: string;
  /** Optional additional media_player.* entities (auto-switches to active playing player & selectable via Cast button) */
  entities?: string[];
  /** Optional custom title override (defaults to active player's friendly_name) */
  name?: string;
  /** Show Cast / Output selector button (default: true when sources or multiple players are available) */
  show_cast?: boolean;
  /** Hide the footer bar when player is off/idle/unavailable (default: false) */
  hide_when_inactive?: boolean;
  /** Tap action on the bar body: popup (default M3E Now Playing), more-info, or none */
  tap_action?: 'popup' | 'more-info' | 'none';
}

export interface M3EMediaPlayerCardConfig extends LovelaceCardConfig {
  /** Home Assistant media_player.* entity ID */
  entity: string;
  /** Optional additional media_player.* entities selectable from the Cast sheet */
  entities?: string[];
  /** Optional custom name override */
  name?: string;
  /** Extract dynamic Material 3 Expressive colors from entity_picture artwork (default: true) */
  dynamic_color?: boolean;
  /** Show the device/output chip in the top-right corner (default: true) */
  show_device_chip?: boolean;
  /** Tap action on the card background: popup (default M3E Now Playing), more-info, or none */
  tap_action?: 'popup' | 'more-info' | 'none';
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
  name?: EntityNameConfig;
  icon?: string;
  /** Hide the secondary state line on the tile (default: false) */
  hide_state?: boolean;
  /** Native Home Assistant state content selector */
  state_content?: StateContentConfig;
  /** Start expanded by default (default: false) */
  expanded?: boolean;
  /** Compact half-width tile (6 cols) where the chevron opens a 2-column popup instead of expanding inline (default: false) */
  compact?: boolean;
  /** Use the group/light real color when ON (default: true) */
  use_light_color?: boolean;
  /** Card shape style for the group header & child tiles */
  card_style?: M3ECardStyle;
}

export interface M3ESceneCardConfig extends LovelaceCardConfig {
  entity: string;
  name?: EntityNameConfig;
  /** Hide the secondary state/subtitle line on the tile (default: false) */
  hide_state?: boolean;
  /** Native Home Assistant state content selector */
  state_content?: StateContentConfig;
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
  name?: EntityNameConfig;
  icon_on?: string;
  icon_off?: string;
  label_on?: string;
  label_off?: string;
  /** Hide the secondary state line on the tile (default: false) */
  hide_state?: boolean;
  /** Native Home Assistant state content selector */
  state_content?: StateContentConfig;
  /** Action on long-press: open M3E popup (default), native HA more-info, navigate/Bubble/Browser Mod, or none */
  hold_action?: M3EHoldAction;
  /** Dashboard path (/lovelace/...), Bubble Card hash (#popup), or script.* / browser_mod.* service */
  navigation_path?: string;
  /** Material 3 Expressive tile shape style */
  card_style?: M3ECardStyle;
  /** Native Home Assistant & HACS Card Features rendered in a sub-row */
  features?: LovelaceCardFeatureConfig[];
  /** Position of Card Features: bottom (stacked sub-row) or inline */
  features_position?: M3EFeaturesPosition;
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
  name?: EntityNameConfig;
  /** Show the entity's artwork/entity_picture on the left side (1:1 max, dissolving smoothly into the card) instead of the icon */
  show_entity_picture?: boolean;
  /** Hide the secondary state/subtitle line on the tile (default: false) */
  hide_state?: boolean;
  /** Native Home Assistant state content selector (state, last_changed, or entity attributes) */
  state_content?: StateContentConfig;
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
  /** Action for "Media & Controls" button in Media popup: popup (default M3E Now Playing) or more-info (native HA) */
  media_controls_action?: 'popup' | 'more-info';
  /** Native Home Assistant & HACS Card Features rendered in a sub-row */
  features?: LovelaceCardFeatureConfig[];
  /** Position of Card Features: bottom (stacked sub-row) or inline */
  features_position?: M3EFeaturesPosition;
}
