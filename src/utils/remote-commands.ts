import type {
  HassEntity,
  HomeAssistant,
  M3ERemoteButtonsConfig,
  M3ERemoteCustomActionType,
} from '../types/home-assistant';

export type RemoteActionKey = keyof M3ERemoteButtonsConfig;

interface PlatformCommandMap {
  service?: string; // defaults to 'remote.send_command'
  paramKey?: string; // defaults to 'command'
  commands: Partial<Record<RemoteActionKey, string>>;
}

/**
 * Out-of-the-box platform command tables modeled after Home Assistant native
 * integrations & Nerwyn/universal-remote-card.
 */
const PLATFORM_MAPS: Record<string, PlatformCommandMap> = {
  androidtv_remote: {
    commands: {
      dpad_up: 'DPAD_UP',
      dpad_down: 'DPAD_DOWN',
      dpad_left: 'DPAD_LEFT',
      dpad_right: 'DPAD_RIGHT',
      dpad_center: 'DPAD_CENTER',
      back: 'BACK',
      home: 'HOME',
      assist: 'ASSIST',
      volume_up: 'VOLUME_UP',
      volume_down: 'VOLUME_DOWN',
      mute: 'MUTE',
      unmute: 'MUTE',
      power_on: 'POWER',
      power_off: 'POWER',
      play: 'MEDIA_PLAY',
      pause: 'MEDIA_PAUSE',
      prev: 'MEDIA_PREVIOUS',
      next: 'MEDIA_NEXT',
      ch_up: 'CHANNEL_UP',
      ch_down: 'CHANNEL_DOWN',
    },
  },
  androidtv: {
    commands: {
      dpad_up: 'UP',
      dpad_down: 'DOWN',
      dpad_left: 'LEFT',
      dpad_right: 'RIGHT',
      dpad_center: 'CENTER',
      back: 'BACK',
      home: 'HOME',
      assist: 'SEARCH',
      volume_up: 'VOLUME_UP',
      volume_down: 'VOLUME_DOWN',
      mute: 'MUTE',
      unmute: 'MUTE',
      power_on: 'POWER',
      power_off: 'POWER',
      play: 'MEDIA_PLAY',
      pause: 'MEDIA_PAUSE',
      prev: 'MEDIA_PREVIOUS',
      next: 'MEDIA_NEXT',
      ch_up: 'CHANNEL_UP',
      ch_down: 'CHANNEL_DOWN',
    },
  },
  firetv: {
    commands: {
      dpad_up: 'UP',
      dpad_down: 'DOWN',
      dpad_left: 'LEFT',
      dpad_right: 'RIGHT',
      dpad_center: 'CENTER',
      back: 'BACK',
      home: 'HOME',
      assist: 'SEARCH',
      volume_up: 'VOLUME_UP',
      volume_down: 'VOLUME_DOWN',
      mute: 'MUTE',
      unmute: 'MUTE',
      power_on: 'POWER',
      power_off: 'POWER',
      play: 'MEDIA_PLAY',
      pause: 'MEDIA_PAUSE',
      prev: 'MEDIA_PREVIOUS',
      next: 'MEDIA_NEXT',
    },
  },
  apple_tv: {
    commands: {
      dpad_up: 'up',
      dpad_down: 'down',
      dpad_left: 'left',
      dpad_right: 'right',
      dpad_center: 'select',
      back: 'menu',
      home: 'home',
      assist: 'top_menu',
      volume_up: 'volume_up',
      volume_down: 'volume_down',
      power_on: 'wakeup',
      power_off: 'suspend',
      play: 'play',
      pause: 'pause',
      prev: 'previous',
      next: 'next',
    },
  },
  webostv: {
    service: 'webostv.button',
    paramKey: 'button',
    commands: {
      dpad_up: 'UP',
      dpad_down: 'DOWN',
      dpad_left: 'LEFT',
      dpad_right: 'RIGHT',
      dpad_center: 'ENTER',
      back: 'BACK',
      home: 'HOME',
      assist: 'MENU',
      volume_up: 'VOLUMEUP',
      volume_down: 'VOLUMEDOWN',
      mute: 'MUTE',
      unmute: 'MUTE',
      play: 'PLAY',
      pause: 'PAUSE',
      prev: 'REWIND',
      next: 'FASTFORWARD',
      ch_up: 'CHANNELUP',
      ch_down: 'CHANNELDOWN',
    },
  },
  samsungtv: {
    commands: {
      dpad_up: 'KEY_UP',
      dpad_down: 'KEY_DOWN',
      dpad_left: 'KEY_LEFT',
      dpad_right: 'KEY_RIGHT',
      dpad_center: 'KEY_ENTER',
      back: 'KEY_RETURN',
      home: 'KEY_HOME',
      assist: 'KEY_MENU',
      volume_up: 'KEY_VOLUP',
      volume_down: 'KEY_VOLDOWN',
      mute: 'KEY_MUTE',
      unmute: 'KEY_MUTE',
      power_on: 'KEY_POWER',
      power_off: 'KEY_POWER',
      play: 'KEY_PLAY',
      pause: 'KEY_PAUSE',
      prev: 'KEY_REWIND',
      next: 'KEY_FF',
      ch_up: 'KEY_CHUP',
      ch_down: 'KEY_CHDOWN',
    },
  },
  samsungtv_smart: {
    commands: {
      dpad_up: 'KEY_UP',
      dpad_down: 'KEY_DOWN',
      dpad_left: 'KEY_LEFT',
      dpad_right: 'KEY_RIGHT',
      dpad_center: 'KEY_ENTER',
      back: 'KEY_RETURN',
      home: 'KEY_HOME',
      assist: 'KEY_MENU',
      volume_up: 'KEY_VOLUP',
      volume_down: 'KEY_VOLDOWN',
      mute: 'KEY_MUTE',
      unmute: 'KEY_MUTE',
      power_on: 'KEY_POWER',
      power_off: 'KEY_POWER',
      play: 'KEY_PLAY',
      pause: 'KEY_PAUSE',
      prev: 'KEY_REWIND',
      next: 'KEY_FF',
      ch_up: 'KEY_CHUP',
      ch_down: 'KEY_CHDOWN',
    },
  },
  samsungtv_tizen: {
    commands: {
      dpad_up: 'KEY_UP',
      dpad_down: 'KEY_DOWN',
      dpad_left: 'KEY_LEFT',
      dpad_right: 'KEY_RIGHT',
      dpad_center: 'KEY_ENTER',
      back: 'KEY_RETURN',
      home: 'KEY_HOME',
      assist: 'KEY_MENU',
      volume_up: 'KEY_VOLUP',
      volume_down: 'KEY_VOLDOWN',
      mute: 'KEY_MUTE',
      unmute: 'KEY_MUTE',
      power_on: 'KEY_POWER',
      power_off: 'KEY_POWER',
      play: 'KEY_PLAY',
      pause: 'KEY_PAUSE',
      prev: 'KEY_REWIND',
      next: 'KEY_FF',
      ch_up: 'KEY_CHUP',
      ch_down: 'KEY_CHDOWN',
    },
  },
  braviatv: {
    commands: {
      dpad_up: 'Up',
      dpad_down: 'Down',
      dpad_left: 'Left',
      dpad_right: 'Right',
      dpad_center: 'Confirm',
      back: 'Return',
      home: 'Home',
      assist: 'GoogleAssistant',
      volume_up: 'VolumeUp',
      volume_down: 'VolumeDown',
      mute: 'Mute',
      unmute: 'Mute',
      power_on: 'WakeUp',
      power_off: 'Sleep',
      play: 'Play',
      pause: 'Pause',
      prev: 'Prev',
      next: 'Next',
      ch_up: 'ChannelUp',
      ch_down: 'ChannelDown',
    },
  },
  roku: {
    commands: {
      dpad_up: 'up',
      dpad_down: 'down',
      dpad_left: 'left',
      dpad_right: 'right',
      dpad_center: 'select',
      back: 'back',
      home: 'home',
      assist: 'search',
      volume_up: 'volume_up',
      volume_down: 'volume_down',
      mute: 'volume_mute',
      unmute: 'volume_mute',
      power_on: 'power',
      power_off: 'power',
      play: 'play',
      pause: 'play',
      prev: 'rev',
      next: 'fwd',
      ch_up: 'channel_up',
      ch_down: 'channel_down',
    },
  },
  philips_js: {
    commands: {
      dpad_up: 'CursorUp',
      dpad_down: 'CursorDown',
      dpad_left: 'CursorLeft',
      dpad_right: 'CursorRight',
      dpad_center: 'Confirm',
      back: 'Back',
      home: 'Home',
      assist: 'Search',
      volume_up: 'VolumeUp',
      volume_down: 'VolumeDown',
      mute: 'Mute',
      unmute: 'Mute',
      power_on: 'Standby',
      power_off: 'Standby',
      play: 'Play',
      pause: 'Pause',
      prev: 'Previous',
      next: 'Next',
      ch_up: 'ChannelStepUp',
      ch_down: 'ChannelStepDown',
    },
  },
  panasonic_viera: {
    commands: {
      dpad_up: 'NRC_UP-ONOFF',
      dpad_down: 'NRC_DOWN-ONOFF',
      dpad_left: 'NRC_LEFT-ONOFF',
      dpad_right: 'NRC_RIGHT-ONOFF',
      dpad_center: 'NRC_ENTER-ONOFF',
      back: 'NRC_RETURN-ONOFF',
      home: 'NRC_HOME-ONOFF',
      assist: 'NRC_MENU-ONOFF',
      volume_up: 'NRC_VOLUP-ONOFF',
      volume_down: 'NRC_VOLDOWN-ONOFF',
      mute: 'NRC_MUTE-ONOFF',
      unmute: 'NRC_MUTE-ONOFF',
      power_on: 'NRC_POWER-ONOFF',
      power_off: 'NRC_POWER-ONOFF',
      play: 'NRC_PLAY-ONOFF',
      pause: 'NRC_PAUSE-ONOFF',
      prev: 'NRC_SKIP_PREV-ONOFF',
      next: 'NRC_SKIP_NEXT-ONOFF',
      ch_up: 'NRC_CH_UP-ONOFF',
      ch_down: 'NRC_CH_DOWN-ONOFF',
    },
  },
};

const MEDIA_PLAYER_SUPPORT: Partial<Record<RemoteActionKey, number>> = {
  pause: 1,
  volume_up: 1024,
  volume_down: 1024,
  mute: 8,
  unmute: 8,
  prev: 16,
  next: 32,
  power_on: 128,
  power_off: 256,
  play: 16384,
};

const MEDIA_PLAYER_SERVICES: Partial<
  Record<RemoteActionKey, { service: string; data?: Record<string, unknown> }>
> = {
  volume_up: { service: 'volume_up' },
  volume_down: { service: 'volume_down' },
  mute: { service: 'volume_mute', data: { is_volume_muted: true } },
  unmute: { service: 'volume_mute', data: { is_volume_muted: false } },
  power_on: { service: 'turn_on' },
  power_off: { service: 'turn_off' },
  play: { service: 'media_play' },
  pause: { service: 'media_pause' },
  prev: { service: 'media_previous_track' },
  next: { service: 'media_next_track' },
};

const GENERIC_REMOTE_FALLBACK: Record<RemoteActionKey, string> = {
  dpad_up: 'DPAD_UP',
  dpad_down: 'DPAD_DOWN',
  dpad_left: 'DPAD_LEFT',
  dpad_right: 'DPAD_RIGHT',
  dpad_center: 'DPAD_CENTER',
  back: 'BACK',
  home: 'HOME',
  assist: 'ASSIST',
  volume_up: 'VolumeUp',
  volume_down: 'VolumeDown',
  mute: 'Mute',
  unmute: 'Mute',
  power_on: 'PowerOn',
  power_off: 'PowerOff',
  play: 'Play',
  pause: 'Pause',
  prev: 'Previous',
  next: 'Next',
  ch_up: 'ChannelUp',
  ch_down: 'ChannelDown',
};

export function findSiblingEntityId(
  hass: HomeAssistant,
  primaryEntityId: string,
  domain: string,
): string | undefined {
  if (primaryEntityId.startsWith(`${domain}.`)) return primaryEntityId;
  const deviceId = hass.entities?.[primaryEntityId]?.device_id;
  if (!deviceId || !hass.entities) return undefined;
  for (const [eid, entry] of Object.entries(hass.entities)) {
    if (entry.device_id === deviceId && eid.startsWith(`${domain}.`) && hass.states[eid]) {
      return eid;
    }
  }
  return undefined;
}

function findSiblingButtonId(
  hass: HomeAssistant,
  primaryEntityId: string,
  key: RemoteActionKey,
): string | undefined {
  const deviceId = hass.entities?.[primaryEntityId]?.device_id;
  if (!deviceId || !hass.entities) return undefined;

  const patterns: Record<RemoteActionKey, string[]> = {
    dpad_up: ['dpad_up', 'nav_up', '_up'],
    dpad_down: ['dpad_down', 'nav_down', '_down'],
    dpad_left: ['dpad_left', 'nav_left', '_left'],
    dpad_right: ['dpad_right', 'nav_right', '_right'],
    dpad_center: ['dpad_center', 'select', 'enter', '_ok'],
    back: ['back', 'return'],
    home: ['home'],
    assist: ['assist', 'voice', 'search', 'menu'],
    volume_up: ['volume_up', 'vol_up', 'vol+'],
    volume_down: ['volume_down', 'vol_down', 'vol-'],
    mute: ['mute'],
    unmute: ['unmute', 'mute'],
    power_on: ['power_on', 'turn_on', 'power'],
    power_off: ['power_off', 'turn_off', 'standby', 'power'],
    play: ['play'],
    pause: ['pause'],
    prev: ['previous', 'prev', 'rewind'],
    next: ['next', 'forward'],
    ch_up: ['channel_up', 'ch_up', 'prog_up'],
    ch_down: ['channel_down', 'ch_down', 'prog_down'],
  };

  const needles = patterns[key] ?? [];
  for (const [eid, entry] of Object.entries(hass.entities)) {
    if (entry.device_id !== deviceId || !eid.startsWith('button.')) continue;
    const low = eid.toLowerCase();
    if (needles.some((n) => low.includes(n))) return eid;
  }
  return undefined;
}

/**
 * Executes a Remote popup command with 4-tier out-of-the-box resolution:
 * 1. Explicit manual override in `config.remote_buttons[key]`
 * 2. Linked `media_player.*` native service (when supported; channel keys prefer remote)
 * 3. Platform-aware `remote.send_command` / `webostv.button` using HA entity registry platform
 * 4. Sibling `button.*` auto-discovery or generic `remote.send_command` fallback
 */
export function executeRemoteCommand(
  hass: HomeAssistant,
  primaryEntityId: string,
  key: RemoteActionKey,
  manualButtons?: M3ERemoteButtonsConfig,
  remoteDevice?: string,
): void {
  const remoteId = findSiblingEntityId(hass, primaryEntityId, 'remote');
  const mediaId = findSiblingEntityId(hass, primaryEntityId, 'media_player');
  const mediaEntity: HassEntity | undefined = mediaId ? hass.states[mediaId] : undefined;

  // 1. Explicit manual override
  const manual = manualButtons?.[key]?.trim();
  if (manual) {
    if (manual.startsWith('button.') || manual.startsWith('input_button.')) {
      hass.callService(manual.split('.')[0], 'press', { entity_id: manual });
      return;
    }
    if (manual.startsWith('script.')) {
      hass.callService('script', 'turn_on', { entity_id: manual });
      return;
    }
    if (manual.startsWith('switch.')) {
      hass.callService('switch', key === 'power_off' ? 'turn_off' : 'turn_on', {
        entity_id: manual,
      });
      return;
    }
    const targetRemote = remoteId || primaryEntityId;
    if (targetRemote.startsWith('remote.')) {
      const payload: Record<string, unknown> = { entity_id: targetRemote, command: manual };
      if (remoteDevice?.trim()) payload.device = remoteDevice.trim();
      hass.callService('remote', 'send_command', payload);
      return;
    }
  }

  // 2. Direct media_player service (for non-channel actions when media_player supports it)
  const mpSvc = MEDIA_PLAYER_SERVICES[key];
  if (mediaEntity && mpSvc) {
    const features = Number(mediaEntity.attributes.supported_features ?? 0);
    const reqBit = MEDIA_PLAYER_SUPPORT[key] ?? 0;
    const supported = features === 0 || reqBit === 0 || (features & reqBit) !== 0;
    if (supported) {
      hass.callService('media_player', mpSvc.service, {
        entity_id: mediaEntity.entity_id,
        ...(mpSvc.data ?? {}),
      });
      return;
    }
  }

  // 3. Platform-aware out-of-the-box remote command (from entity registry platform)
  const platform = (
    (remoteId ? hass.entities?.[remoteId]?.platform : undefined) ||
    (mediaId ? hass.entities?.[mediaId]?.platform : undefined) ||
    hass.entities?.[primaryEntityId]?.platform ||
    ''
  ).toLowerCase();

  const platformMap = PLATFORM_MAPS[platform];
  if (platformMap) {
    // Handle webostv.button directly on the media_player entity
    if (platformMap.service === 'webostv.button' && mediaId && platformMap.commands[key]) {
      hass.callService('webostv', 'button', {
        entity_id: mediaId,
        [platformMap.paramKey ?? 'button']: platformMap.commands[key],
      });
      return;
    }
    if (remoteId && (key === 'power_on' || key === 'power_off') && platform === 'apple_tv') {
      hass.callService('remote', key === 'power_on' ? 'turn_on' : 'turn_off', {
        entity_id: remoteId,
      });
      return;
    }
    const cmd = platformMap.commands[key];
    if (remoteId && cmd) {
      const payload: Record<string, unknown> = { entity_id: remoteId, command: cmd };
      if (remoteDevice?.trim()) payload.device = remoteDevice.trim();
      hass.callService('remote', 'send_command', payload);
      return;
    }
  }

  // 4. Fallback: sibling button.* entity, channel->media skip, or generic remote command
  const siblingBtn = findSiblingButtonId(hass, primaryEntityId, key);
  if (siblingBtn) {
    hass.callService('button', 'press', { entity_id: siblingBtn });
    return;
  }

  if (mediaEntity && (key === 'ch_up' || key === 'ch_down')) {
    hass.callService(
      'media_player',
      key === 'ch_up' ? 'media_next_track' : 'media_previous_track',
      { entity_id: mediaEntity.entity_id },
    );
    return;
  }

  if (remoteId) {
    if (key === 'power_on' || key === 'power_off') {
      hass.callService('remote', key === 'power_on' ? 'turn_on' : 'turn_off', {
        entity_id: remoteId,
      });
      return;
    }
    const payload: Record<string, unknown> = {
      entity_id: remoteId,
      command: GENERIC_REMOTE_FALLBACK[key],
    };
    if (remoteDevice?.trim()) payload.device = remoteDevice.trim();
    hass.callService('remote', 'send_command', payload);
  }
}

export interface CustomRemoteActionSpec {
  action_type?: M3ERemoteCustomActionType;
  player_action?: RemoteActionKey;
  entity?: string;
  entity_action?: 'auto' | 'toggle' | 'turn_on' | 'turn_off' | 'select_option';
  value?: string;
  command?: string;
  device?: string;
  active_state?: string;
}

/**
 * Executes a custom Remote button or segment action:
 * - 'player': delegates to executeRemoteCommand (player/remote action)
 * - 'source': calls media_player.select_source with `value`
 * - 'entity': controls any HA entity (script, scene, button, switch, light, input_boolean, input_select, media_player)
 * - 'remote_command': sends raw remote.send_command (or webostv.button on WebOS)
 */
export function executeCustomRemoteAction(
  hass: HomeAssistant,
  primaryEntityId: string,
  spec: CustomRemoteActionSpec,
  manualButtons?: M3ERemoteButtonsConfig,
  defaultRemoteDevice?: string,
): void {
  const mode: M3ERemoteCustomActionType =
    spec.action_type ||
    (spec.command?.trim()
      ? 'remote_command'
      : spec.entity?.trim()
        ? 'entity'
        : spec.value?.trim() && !spec.player_action
          ? 'source'
          : 'player');

  if (mode === 'player' && spec.player_action) {
    executeRemoteCommand(
      hass,
      primaryEntityId,
      spec.player_action,
      manualButtons,
      spec.device || defaultRemoteDevice,
    );
    return;
  }

  if (mode === 'source' && spec.value?.trim()) {
    const mediaId = spec.entity?.trim() || findSiblingEntityId(hass, primaryEntityId, 'media_player');
    if (mediaId) {
      hass.callService('media_player', 'select_source', {
        entity_id: mediaId,
        source: spec.value.trim(),
      });
    }
    return;
  }

  if (mode === 'remote_command' && spec.command?.trim()) {
    const remoteId =
      (spec.entity?.trim().startsWith('remote.') ? spec.entity.trim() : undefined) ||
      findSiblingEntityId(hass, primaryEntityId, 'remote');
    const mediaId = findSiblingEntityId(hass, primaryEntityId, 'media_player');
    const platform = (
      (remoteId ? hass.entities?.[remoteId]?.platform : undefined) ||
      (mediaId ? hass.entities?.[mediaId]?.platform : undefined) ||
      hass.entities?.[primaryEntityId]?.platform ||
      ''
    ).toLowerCase();

    if (platform === 'webostv' && mediaId) {
      hass.callService('webostv', 'button', {
        entity_id: mediaId,
        button: spec.command.trim(),
      });
      return;
    }

    if (remoteId) {
      const payload: Record<string, unknown> = {
        entity_id: remoteId,
        command: spec.command.trim(),
      };
      const dev = (spec.device || defaultRemoteDevice)?.trim();
      if (dev) payload.device = dev;
      hass.callService('remote', 'send_command', payload);
    }
    return;
  }

  if (mode === 'entity' && spec.entity?.trim()) {
    const target = spec.entity.trim();
    const domain = target.split('.')[0];
    const act = spec.entity_action || 'auto';

    if (domain === 'button' || domain === 'input_button') {
      hass.callService(domain, 'press', { entity_id: target });
      return;
    }
    if (domain === 'script' || domain === 'scene') {
      hass.callService(domain, 'turn_on', { entity_id: target });
      return;
    }
    if (
      (domain === 'input_select' || domain === 'select') &&
      (act === 'select_option' || spec.value?.trim())
    ) {
      if (spec.value?.trim()) {
        hass.callService(domain, 'select_option', {
          entity_id: target,
          option: spec.value.trim(),
        });
      }
      return;
    }
    if (domain === 'media_player' && spec.value?.trim() && act === 'auto') {
      hass.callService('media_player', 'select_source', {
        entity_id: target,
        source: spec.value.trim(),
      });
      return;
    }
    if (act === 'turn_on' || act === 'turn_off' || act === 'toggle') {
      hass.callService(domain, act, { entity_id: target });
      return;
    }
    // Smart default for switch / light / input_boolean / fan / media_player / remote
    hass.callService(domain, 'toggle', { entity_id: target });
  }
}

/**
 * Evaluates whether a custom remote button or segment is currently active.
 */
export function isCustomRemoteItemActive(
  hass: HomeAssistant,
  primaryEntityId: string,
  spec: CustomRemoteActionSpec,
  overrideStateEntity?: string,
): boolean {
  const mode: M3ERemoteCustomActionType =
    spec.action_type ||
    (spec.command?.trim()
      ? 'remote_command'
      : spec.entity?.trim()
        ? 'entity'
        : spec.value?.trim() && !spec.player_action
          ? 'source'
          : 'player');

  if (mode === 'source' && spec.value?.trim()) {
    const mediaId =
      overrideStateEntity?.trim() ||
      spec.entity?.trim() ||
      findSiblingEntityId(hass, primaryEntityId, 'media_player');
    const ent = mediaId ? hass.states[mediaId] : undefined;
    const currentSource = String(ent?.attributes.source ?? '').trim().toLowerCase();
    return currentSource !== '' && currentSource === spec.value.trim().toLowerCase();
  }

  if (mode === 'player' && spec.player_action && !overrideStateEntity) {
    const mediaId = findSiblingEntityId(hass, primaryEntityId, 'media_player');
    const ent = (mediaId ? hass.states[mediaId] : undefined) ?? hass.states[primaryEntityId];
    if (!ent) return false;
    const st = String(ent.state ?? '').toLowerCase();
    if (spec.player_action === 'mute') return ent.attributes.is_volume_muted === true;
    if (spec.player_action === 'unmute') return ent.attributes.is_volume_muted === false;
    if (spec.player_action === 'play') return st === 'playing';
    if (spec.player_action === 'pause') return st === 'paused';
    if (spec.player_action === 'power_on')
      return st !== '' && st !== 'off' && st !== 'standby' && st !== 'unavailable' && st !== 'unknown';
    if (spec.player_action === 'power_off') return st === 'off' || st === 'standby';
    return false;
  }

  const stateEntityId = overrideStateEntity?.trim() || spec.entity?.trim();
  if (!stateEntityId) return false;
  const ent = hass.states[stateEntityId];
  if (!ent) return false;
  const current = String(ent.state ?? '').toLowerCase();
  if (current === 'unavailable' || current === 'unknown') return false;

  if (spec.active_state?.trim()) {
    return current === spec.active_state.trim().toLowerCase();
  }
  if (spec.value?.trim() && (stateEntityId.startsWith('input_select.') || stateEntityId.startsWith('select.'))) {
    return current === spec.value.trim().toLowerCase();
  }
  if (spec.entity_action === 'turn_off') {
    return current === 'off' || current === 'standby';
  }
  return ['on', 'playing', 'home', 'open', 'active', 'true'].includes(current);
}
