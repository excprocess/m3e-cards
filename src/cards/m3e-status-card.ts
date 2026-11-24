import { LitElement, css, html, svg, nothing, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { m3eBaseStyles } from '../styles/m3e-tokens';
import type {
  HassEntity,
  HomeAssistant,
  M3ERemoteButtonsConfig,
  M3EStatusCardConfig,
  M3EStatusPopupType,
} from '../types/home-assistant';

type ClimateSheetKind = 'mode' | 'preset' | 'fan' | 'swing' | null;

const DEFAULT_ACTIVE_STATES = new Set([
  'on',
  'home',
  'detected',
  'open',
  'unlocked',
  'playing',
  'heat',
  'cool',
  'heat_cool',
  'auto',
  'dry',
  'fan_only',
  'heating',
  'cooling',
  'true',
]);

const DIAL_START_DEG = 135; // bottom-left
const DIAL_SWEEP_DEG = 270; // 270 deg clockwise to bottom-right

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
  const rad = degToRad(deg);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const start = polarToCartesian(cx, cy, r, startDeg);
  const end = polarToCartesian(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

@customElement('m3e-status-card')
export class M3EStatusCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3EStatusCardConfig;
  @state() private _pressed = false;
  @state() private _popupOpen = false;

  // Climate dial interaction state
  @state() private _dialDragging = false;
  @state() private _dialTemp: number | null = null;
  @state() private _activeSheet: ClimateSheetKind = null;

  // Media volume slider interaction state
  @state() private _volDragging = false;
  @state() private _volPct: number | null = null;

  @query('dialog.status-dialog') private _dialogEl?: HTMLDialogElement;
  @query('.status-tile') private _tileEl?: HTMLElement;
  @query('.dialog-surface') private _dialogSurfaceEl?: HTMLElement;

  private _prevStates: Record<string, HassEntity | undefined> = {};

  public static getStubConfig(hass?: HomeAssistant): M3EStatusCardConfig {
    const entity = hass
      ? Object.keys(hass.states).find(
          (id) =>
            id.startsWith('binary_sensor.') ||
            id.startsWith('climate.') ||
            id.startsWith('media_player.') ||
            id.startsWith('sensor.'),
        )
      : undefined;
    return {
      type: 'custom:m3e-status-card',
      entity: entity ?? 'binary_sensor.motion',
      popup_type: 'auto',
      tap_action: 'popup',
    };
  }

  public static getConfigForm() {
    return {
      schema: [
        { name: 'entity', required: true, selector: { entity: {} } },
        { name: 'name', selector: { text: {} } },
        {
          type: 'grid',
          name: '',
          schema: [
            { name: 'icon_active', selector: { icon: {} } },
            { name: 'icon_inactive', selector: { icon: {} } },
          ],
        },
        {
          name: 'active_state',
          selector: { text: {} },
        },
        {
          type: 'grid',
          name: '',
          schema: [
            { name: 'label_active', selector: { text: {} } },
            { name: 'label_inactive', selector: { text: {} } },
          ],
        },
        {
          name: 'popup_type',
          selector: {
            select: {
              mode: 'dropdown',
              options: [
                { value: 'auto', label: 'Automatico (in base al dispositivo)' },
                { value: 'sensor', label: 'Sensore (Anello di stato + Telemetria)' },
                { value: 'climate', label: 'Clima / Termostato (Dial circolare + Mode)' },
                { value: 'remote', label: 'Telecomando / TV (Rocker Volume + Controlli)' },
                { value: 'media', label: 'Media / Speaker (Player + Volume Pill)' },
                { value: 'none', label: 'Nessun popup' },
              ],
            },
          },
        },
        {
          name: 'tap_action',
          selector: {
            select: {
              mode: 'dropdown',
              options: [
                { value: 'popup', label: 'Apri schermata espansa' },
                { value: 'toggle', label: 'Toggle stato (hold per popup)' },
              ],
            },
          },
        },
        { name: 'secondary_entity', selector: { entity: {} } },
        { name: 'outdoor_entity', selector: { entity: { domain: 'sensor' } } },
        {
          type: 'expandable',
          title: 'Pulsanti Telecomando (Entità button/script o comandi remote)',
          name: 'remote_buttons',
          schema: [
            { name: 'volume_up', selector: { text: {} } },
            { name: 'volume_down', selector: { text: {} } },
            { name: 'mute', selector: { text: {} } },
            { name: 'unmute', selector: { text: {} } },
            { name: 'power_on', selector: { text: {} } },
            { name: 'power_off', selector: { text: {} } },
            { name: 'play', selector: { text: {} } },
            { name: 'pause', selector: { text: {} } },
            { name: 'prev', selector: { text: {} } },
            { name: 'next', selector: { text: {} } },
            { name: 'ch_up', selector: { text: {} } },
            { name: 'ch_down', selector: { text: {} } },
          ],
        },
      ],
      computeLabel: (schema: { name: string }) => {
        const labels: Record<string, string> = {
          entity: 'Entità principale',
          name: 'Nome personalizzato',
          icon_active: 'Icona stato attivo',
          icon_inactive: 'Icona stato inattivo',
          active_state: 'Stati attivi (es. on,home,detected)',
          label_active: 'Testo stato attivo',
          label_inactive: 'Testo stato inattivo',
          popup_type: 'Tipo card / Schermata popup',
          tap_action: 'Azione al tocco',
          secondary_entity: 'Entità secondaria (auto-rilevata dal device se vuota)',
          outdoor_entity: 'Temperatura esterna (per Clima)',
          volume_up: 'Volume + (es. button.tv_vol_up o VolumeUp)',
          volume_down: 'Volume − (es. button.tv_vol_down o VolumeDown)',
          mute: 'Mute',
          unmute: 'Unmute',
          power_on: 'Accensione (On)',
          power_off: 'Spegnimento (Off)',
          play: 'Play',
          pause: 'Pause',
          prev: 'Precedente',
          next: 'Successivo',
          ch_up: 'Canale +',
          ch_down: 'Canale −',
        };
        return labels[schema.name] ?? schema.name;
      },
    };
  }

  public setConfig(config: M3EStatusCardConfig): void {
    if (!config || !config.entity) {
      throw new Error('m3e-status-card: you must define an entity');
    }
    this._config = {
      popup_type: 'auto',
      tap_action: 'popup',
      ...config,
    };
  }

  public getCardSize(): number {
    return 1;
  }

  public getGridOptions() {
    return { rows: 1, columns: 6, min_rows: 1, min_columns: 3 };
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (
      changedProps.has('_config') ||
      changedProps.has('_pressed') ||
      changedProps.has('_popupOpen') ||
      changedProps.has('_dialDragging') ||
      changedProps.has('_dialTemp') ||
      changedProps.has('_activeSheet') ||
      changedProps.has('_volDragging') ||
      changedProps.has('_volPct')
    ) {
      return true;
    }

    if (changedProps.has('hass') && this._config && this.hass) {
      const watched = [
        this._config.entity,
        this._config.secondary_entity,
        this._config.outdoor_entity,
        ...this._getSiblingEntityIds(),
      ].filter(Boolean) as string[];

      let changed = false;
      for (const id of watched) {
        const next = this.hass.states[id];
        if (next !== this._prevStates[id]) {
          this._prevStates[id] = next;
          changed = true;
        }
      }
      return changed;
    }

    return false;
  }

  private get _entity(): HassEntity | undefined {
    if (!this.hass || !this._config) return undefined;
    return this.hass.states[this._config.entity];
  }

  /**
   * Auto-discovers sibling sensor entities belonging to the exact same Home Assistant device_id
   * (e.g. humidity on a thermometer device, or temperature on a motion sensor device).
   */
  private _getSiblingEntityIds(): string[] {
    if (!this.hass?.entities || !this._config) return [];
    const primaryId = this._config.entity;
    const deviceId = this.hass.entities[primaryId]?.device_id;
    if (!deviceId) return [];

    const siblings: string[] = [];
    for (const [id, entry] of Object.entries(this.hass.entities)) {
      if (id !== primaryId && entry.device_id === deviceId && id.startsWith('sensor.')) {
        siblings.push(id);
      }
    }
    return siblings;
  }

  private _getSiblingSensors(): HassEntity[] {
    if (!this.hass) return [];
    const results: HassEntity[] = [];
    const seen = new Set<string>();

    if (this._config?.secondary_entity) {
      const manual = this.hass.states[this._config.secondary_entity];
      if (manual) {
        results.push(manual);
        seen.add(manual.entity_id);
      }
    }

    const preferredClasses = ['temperature', 'humidity', 'illuminance', 'battery'];
    const siblings = this._getSiblingEntityIds()
      .map((id) => this.hass!.states[id])
      .filter((e): e is HassEntity => Boolean(e) && !seen.has(e.entity_id));

    siblings.sort((a, b) => {
      const ia = preferredClasses.indexOf(String(a.attributes.device_class ?? ''));
      const ib = preferredClasses.indexOf(String(b.attributes.device_class ?? ''));
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });

    for (const sib of siblings) {
      const dc = String(sib.attributes.device_class ?? '');
      if (preferredClasses.includes(dc)) {
        results.push(sib);
      }
    }
    return results;
  }

  private get _secondaryEntity(): HassEntity | undefined {
    return this._getSiblingSensors()[0];
  }

  private get _outdoorEntity(): HassEntity | undefined {
    if (!this.hass || !this._config?.outdoor_entity) return undefined;
    return this.hass.states[this._config.outdoor_entity];
  }

  private get _resolvedPopupType(): Exclude<M3EStatusPopupType, 'auto'> {
    const cfg = this._config?.popup_type ?? 'auto';
    if (cfg !== 'auto') return cfg;
    const id = this._config?.entity ?? '';
    if (id.startsWith('climate.')) return 'climate';
    if (id.startsWith('remote.')) return 'remote';
    if (id.startsWith('media_player.')) {
      const dc = String(this._entity?.attributes.device_class ?? '');
      return dc === 'tv' ? 'remote' : 'media';
    }
    return 'sensor';
  }

  private get _isActive(): boolean {
    const stateStr = String(this._entity?.state ?? '').toLowerCase();
    if (!stateStr || stateStr === 'unavailable' || stateStr === 'unknown') return false;

    if (this._config?.active_state?.trim()) {
      const allowed = this._config.active_state
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      return allowed.includes(stateStr);
    }

    // Numeric sensors (e.g. temperature) are highlighted when valid if popup is sensor
    if (this._config?.entity.startsWith('sensor.') && !Number.isNaN(Number(stateStr))) {
      return true;
    }

    return DEFAULT_ACTIVE_STATES.has(stateStr);
  }

  private get _stateLabel(): string {
    const entity = this._entity;
    if (!entity) return 'Unavailable';
    const raw = entity.state;
    if (raw === 'unavailable' || raw === 'unknown') return 'Unavailable';

    if (this._isActive && this._config?.label_active) return this._config.label_active;
    if (!this._isActive && this._config?.label_inactive) return this._config.label_inactive;

    const domain = entity.entity_id.split('.')[0];
    if (domain === 'climate') {
      const mode = raw.charAt(0).toUpperCase() + raw.slice(1);
      const t = entity.attributes.temperature;
      return raw !== 'off' && typeof t === 'number' ? `${mode} ${t}` : mode;
    }

    if (domain === 'sensor') {
      const unit = entity.attributes.unit_of_measurement;
      const primaryText = unit ? `${raw}${unit}` : raw;
      // If this is a thermometer and the same device has a humidity sensor, show it neatly!
      const isTemp =
        entity.attributes.device_class === 'temperature' ||
        unit === '°C' ||
        unit === '°F';
      if (isTemp) {
        const hum = this._getSiblingSensors().find(
          (s) => s.attributes.device_class === 'humidity' || s.attributes.unit_of_measurement === '%',
        );
        if (hum && hum.state !== 'unavailable' && hum.state !== 'unknown') {
          return `${primaryText} • ${hum.state}${hum.attributes.unit_of_measurement ?? '%'}`;
        }
      }
      return primaryText;
    }

    if (domain === 'media_player') {
      return raw.charAt(0).toUpperCase() + raw.slice(1);
    }

    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }

  /* =========================================================================
     POPUP OPEN / CLOSE (Container Transform)
     ========================================================================= */
  public async openPopup(): Promise<void> {
    if (this._resolvedPopupType === 'none' || this._popupOpen) return;
    const tileRect = this._tileEl?.getBoundingClientRect();
    this._activeSheet = null;
    this._popupOpen = true;
    await this.updateComplete;

    const dialog = this._dialogEl;
    const surface = this._dialogSurfaceEl;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();

    if (surface && tileRect) {
      const targetRect = surface.getBoundingClientRect();
      const dx = tileRect.left + tileRect.width / 2 - (targetRect.left + targetRect.width / 2);
      const dy = tileRect.top + tileRect.height / 2 - (targetRect.top + targetRect.height / 2);
      const sx = Math.max(0.28, tileRect.width / targetRect.width);
      const sy = Math.max(0.16, tileRect.height / targetRect.height);

      surface.animate(
        [
          {
            transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`,
            borderRadius: '28px',
            opacity: 0.72,
          },
          {
            transform: 'translate(0px, 0px) scale(1, 1)',
            borderRadius: '32px',
            opacity: 1,
          },
        ],
        {
          duration: 380,
          easing: 'cubic-bezier(0.2, 0.9, 0.2, 1)',
        },
      );
    }
  }

  public closePopup(): void {
    const dialog = this._dialogEl;
    const surface = this._dialogSurfaceEl;
    if (!dialog || !dialog.open) {
      this._popupOpen = false;
      this._activeSheet = null;
      return;
    }

    if (surface) {
      const anim = surface.animate(
        [
          { transform: 'scale(1)', opacity: 1 },
          { transform: 'scale(0.92)', opacity: 0 },
        ],
        { duration: 180, easing: 'cubic-bezier(0.4, 0, 1, 1)' },
      );
      anim.onfinish = () => {
        dialog.close();
        this._popupOpen = false;
        this._activeSheet = null;
      };
    } else {
      dialog.close();
      this._popupOpen = false;
      this._activeSheet = null;
    }
  }

  private _onTileClick = (): void => {
    if (this._config?.tap_action === 'toggle' && this.hass && this._config) {
      const domain = this._config.entity.split('.')[0];
      this.hass.callService(domain, 'toggle', { entity_id: this._config.entity });
      return;
    }
    this.openPopup();
  };

  /* =========================================================================
     CLIMATE DIAL INTERACTION (Arc Drag with Morphing Radial Thumb)
     ========================================================================= */
  private get _climateMin(): number {
    return Number(this._entity?.attributes.min_temp ?? 7);
  }

  private get _climateMax(): number {
    return Number(this._entity?.attributes.max_temp ?? 30);
  }

  private get _climateTarget(): number {
    if (this._dialDragging && this._dialTemp !== null) return this._dialTemp;
    return Number(this._entity?.attributes.temperature ?? 20);
  }

  private get _climateCurrent(): number | null {
    const cur = this._entity?.attributes.current_temperature;
    if (typeof cur === 'number') return cur;
    const sec = this._secondaryEntity?.state;
    if (sec && !Number.isNaN(Number(sec))) return Number(sec);
    return null;
  }

  private _tempToDeg(temp: number): number {
    const ratio = Math.max(
      0,
      Math.min(1, (temp - this._climateMin) / (this._climateMax - this._climateMin)),
    );
    return DIAL_START_DEG + ratio * DIAL_SWEEP_DEG;
  }

  private _pointerToTemp(e: PointerEvent, svg: Element): number {
    const rect = svg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let angle = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
    if (angle < 0) angle += 360;

    // Normalize relative to DIAL_START_DEG (135 deg)
    let rel = (angle - DIAL_START_DEG + 360) % 360;
    if (rel > DIAL_SWEEP_DEG) {
      // Snap to nearest end in the dead bottom zone
      rel = rel > DIAL_SWEEP_DEG + (360 - DIAL_SWEEP_DEG) / 2 ? 0 : DIAL_SWEEP_DEG;
    }

    const ratio = rel / DIAL_SWEEP_DEG;
    const rawTemp = this._climateMin + ratio * (this._climateMax - this._climateMin);
    return Math.round(rawTemp * 2) / 2; // 0.5° steps
  }

  private _setClimateTemp(temp: number): void {
    if (!this.hass || !this._config) return;
    const clamped = Math.max(this._climateMin, Math.min(this._climateMax, Math.round(temp * 2) / 2));
    this.hass.callService('climate', 'set_temperature', {
      entity_id: this._config.entity,
      temperature: clamped,
    });
  }

  private _setClimateMode(mode: string): void {
    if (!this.hass || !this._config) return;
    this.hass.callService('climate', 'set_hvac_mode', {
      entity_id: this._config.entity,
      hvac_mode: mode,
    });
    this._activeSheet = null;
  }

  private _setClimatePreset(preset: string): void {
    if (!this.hass || !this._config) return;
    this.hass.callService('climate', 'set_preset_mode', {
      entity_id: this._config.entity,
      preset_mode: preset,
    });
    this._activeSheet = null;
  }

  private _setClimateFan(fan: string): void {
    if (!this.hass || !this._config) return;
    this.hass.callService('climate', 'set_fan_mode', {
      entity_id: this._config.entity,
      fan_mode: fan,
    });
    this._activeSheet = null;
  }

  private _setClimateSwing(swing: string): void {
    if (!this.hass || !this._config) return;
    this.hass.callService('climate', 'set_swing_mode', {
      entity_id: this._config.entity,
      swing_mode: swing,
    });
    this._activeSheet = null;
  }

  /**
   * Executes a remote button binding:
   * - If configured as an entity_id (button.*, script.*, switch.*, scene.*), triggers that entity.
   * - If configured as a command string (e.g. "VolumeUp"), sends remote.send_command.
   * - Otherwise falls back to the default media_player service or remote command.
   */
  private _triggerRemoteButton(
    key: keyof M3ERemoteButtonsConfig,
    fallbackService: string,
    fallbackData: Record<string, unknown> = {},
    defaultCommand?: string,
  ): void {
    if (!this.hass || !this._config) return;
    const binding = this._config.remote_buttons?.[key]?.trim();

    if (binding) {
      if (binding.startsWith('button.')) {
        this.hass.callService('button', 'press', { entity_id: binding });
        return;
      }
      if (binding.startsWith('script.')) {
        this.hass.callService('script', 'turn_on', { entity_id: binding });
        return;
      }
      if (binding.startsWith('scene.')) {
        this.hass.callService('scene', 'turn_on', { entity_id: binding });
        return;
      }
      if (binding.startsWith('switch.')) {
        this.hass.callService('switch', 'toggle', { entity_id: binding });
        return;
      }
      // Treat as remote.send_command command name
      this.hass.callService('remote', 'send_command', {
        entity_id: this._config.entity,
        command: binding,
      });
      return;
    }

    if (this._config.entity.startsWith('remote.')) {
      this.hass.callService('remote', 'send_command', {
        entity_id: this._config.entity,
        command: defaultCommand ?? key,
      });
      return;
    }

    this._callEntityService(fallbackService, fallbackData);
  }

  private _onDialPointerDown = (e: PointerEvent): void => {
    if (e.button !== 0) return;
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    this._dialDragging = true;
    const next = this._pointerToTemp(e, el);
    this._dialTemp = next;
  };

  private _onDialPointerMove = (e: PointerEvent): void => {
    if (!this._dialDragging) return;
    const next = this._pointerToTemp(e, e.currentTarget as HTMLElement);
    if (next !== this._dialTemp) {
      this._dialTemp = next;
    }
  };

  private _onDialPointerUp = (e: PointerEvent): void => {
    if (!this._dialDragging) return;
    const el = e.currentTarget as HTMLElement;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    if (this._dialTemp !== null) {
      this._setClimateTemp(this._dialTemp);
    }
    this._dialDragging = false;
    this._dialTemp = null;
  };

  /* =========================================================================
     MEDIA VOLUME PILL INTERACTION
     ========================================================================= */
  private get _mediaVolumePct(): number {
    if (this._volDragging && this._volPct !== null) return this._volPct;
    const v = this._entity?.attributes.volume_level;
    return typeof v === 'number' ? Math.round(v * 100) : 40;
  }

  private _onVolPointerDown = (e: PointerEvent): void => {
    if (e.button !== 0) return;
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    this._volDragging = true;
    this._updateVolFromPointer(e.clientX, el, false);
  };

  private _onVolPointerMove = (e: PointerEvent): void => {
    if (!this._volDragging) return;
    this._updateVolFromPointer(e.clientX, e.currentTarget as HTMLElement, false);
  };

  private _onVolPointerUp = (e: PointerEvent): void => {
    if (!this._volDragging) return;
    const el = e.currentTarget as HTMLElement;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    this._updateVolFromPointer(e.clientX, el, true);
    this._volDragging = false;
    this._volPct = null;
  };

  private _updateVolFromPointer(clientX: number, el: HTMLElement, commit: boolean): void {
    const rect = el.getBoundingClientRect();
    const pct = Math.round(Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) * 100);
    this._volPct = pct;
    if (commit && this.hass && this._config) {
      this.hass.callService('media_player', 'volume_set', {
        entity_id: this._config.entity,
        volume_level: pct / 100,
      });
    }
  }

  private _callEntityService(service: string, extra: Record<string, unknown> = {}): void {
    if (!this.hass || !this._config) return;
    const domain = this._config.entity.split('.')[0];
    this.hass.callService(domain, service, {
      entity_id: this._config.entity,
      ...extra,
    });
  }

  /* =========================================================================
     ICONS (Native <ha-icon> in HA + clean SVG fallbacks in standalone preview)
     ========================================================================= */
  private _renderEntityIcon(iconName?: string) {
    if (iconName && typeof customElements !== 'undefined' && customElements.get('ha-icon')) {
      return html`<ha-icon .icon=${iconName}></ha-icon>`;
    }

    const type = this._resolvedPopupType;
    if (iconName?.includes('thermometer') || this._config?.entity.includes('temp')) {
      return html`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0Zm-3-9a1 1 0 0 1 1 1v4h-2V5a1 1 0 0 1 1-1Z"/></svg>`;
    }
    if (type === 'climate') {
      return html`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm0-12a4 4 0 1 0 4 4 4 4 0 0 0-4-4Z"/></svg>`;
    }
    if (type === 'remote') {
      return html`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M21 3H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 14H3V5h18v12Z"/></svg>`;
    }
    if (type === 'media') {
      return html`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M1 18v3h3a3 3 0 0 0-3-3Zm0-4v2a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7Zm0-4v2a9 9 0 0 1 9 9h2A11 11 0 0 0 1 10Zm20-7H3a2 2 0 0 0-2 2v3h2V5h18v14h-7v2h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"/></svg>`;
    }
    // Motion / presence sensor icon matching Google Home ( (●) )
    return html`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M5.5 7.5a7 7 0 0 0 0 9M18.5 7.5a7 7 0 0 1 0 9"/></svg>`;
  }

  /* =========================================================================
     POPUP VARIANT RENDERERS (Hero Top + Modular Trait Stack Bottom)
     ========================================================================= */
  private _renderSensorPopup(icon?: string) {
    const siblings = this._getSiblingSensors();

    return html`
      <div class="sensor-hero">
        <div class="sensor-ring ${this._isActive ? 'is-active' : ''}">
          <span class="sensor-ring-icon">${this._renderEntityIcon(icon)}</span>
          <span class="sensor-ring-state">${this._stateLabel}</span>
          <span class="sensor-ring-sub">
            ${this._entity?.attributes.device_class
              ? String(this._entity.attributes.device_class).replace(/^./, (c) => c.toUpperCase())
              : 'Status'}
          </span>
        </div>
      </div>

      ${siblings.length > 0
        ? html`
            <div class="modular-stack">
              ${siblings.map((sec) => {
                const dc = String(sec.attributes.device_class ?? '');
                const label = sec.attributes.friendly_name || (dc ? dc.replace(/^./, (c) => c.toUpperCase()) : 'Sensor');
                const val = `${sec.state}${sec.attributes.unit_of_measurement ?? ''}`;
                return html`
                  <div class="info-pill">
                    <span class="info-pill-left">
                      ${dc === 'humidity'
                        ? html`<svg viewBox="0 0 24 24" class="mini-svg"><path fill="currentColor" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69Z"/></svg>`
                        : html`<svg viewBox="0 0 24 24" class="mini-svg"><path fill="currentColor" d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0Zm-3-9a1 1 0 0 1 1 1v4h-2V5a1 1 0 0 1 1-1Z"/></svg>`}
                      <span>${label}</span>
                    </span>
                    <span class="info-pill-val">${val}</span>
                  </div>
                `;
              })}
            </div>
          `
        : nothing}
    `;
  }

  private _renderClimatePopup() {
    const entity = this._entity;
    const mode = String(entity?.state ?? 'off').toLowerCase();
    const isOff = mode === 'off';
    const target = this._climateTarget;
    const current = this._climateCurrent;
    const outdoor = this._outdoorEntity;

    const whole = Math.floor(target);
    const hasHalf = Math.abs(target - whole - 0.5) < 0.05;

    const targetDeg = this._tempToDeg(target);
    const currentDeg = current !== null ? this._tempToDeg(current) : null;
    const cx = 140;
    const cy = 140;
    const r = 114;

    const trackPath = describeArc(cx, cy, r, DIAL_START_DEG, DIAL_START_DEG + DIAL_SWEEP_DEG);
    const thumbPt = polarToCartesian(cx, cy, r, targetDeg);
    const currentPt = currentDeg !== null ? polarToCartesian(cx, cy, r, currentDeg) : null;
    const currentLabelPt = currentDeg !== null ? polarToCartesian(cx, cy, r - 22, currentDeg) : null;

    const hvacModes = Array.isArray(entity?.attributes.hvac_modes)
      ? (entity.attributes.hvac_modes as string[])
      : ['heat', 'cool', 'off'];
    const presetModes = Array.isArray(entity?.attributes.preset_modes)
      ? (entity.attributes.preset_modes as string[])
      : [];
    const fanModes = Array.isArray(entity?.attributes.fan_modes)
      ? (entity.attributes.fan_modes as string[])
      : [];
    const swingModes = Array.isArray(entity?.attributes.swing_modes)
      ? (entity.attributes.swing_modes as string[])
      : [];

    const currentPreset = String(entity?.attributes.preset_mode ?? 'none');
    const currentFan = String(entity?.attributes.fan_mode ?? 'auto');
    const currentSwing = String(entity?.attributes.swing_mode ?? 'off');
    const currentHumidity =
      typeof entity?.attributes.current_humidity === 'number'
        ? `${entity.attributes.current_humidity}%`
        : this._getSiblingSensors().find((s) => s.attributes.device_class === 'humidity')
          ? `${this._getSiblingSensors().find((s) => s.attributes.device_class === 'humidity')!.state}%`
          : null;

    const hasPreset = presetModes.length > 0;
    const hasFan = fanModes.length > 0;
    const hasSwing = swingModes.length > 0;

    const modeTone =
      mode === 'heat' || mode === 'heating'
        ? 'mode-heat'
        : mode === 'cool' || mode === 'cooling'
          ? 'mode-cool'
          : 'mode-off';

    const formatCap = (s: string) =>
      s.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());

    const sheetConfig =
      this._activeSheet === 'mode'
        ? { title: 'Select a mode', options: hvacModes, current: mode, onSelect: (v: string) => this._setClimateMode(v) }
        : this._activeSheet === 'preset'
          ? { title: 'Select preset', options: presetModes, current: currentPreset, onSelect: (v: string) => this._setClimatePreset(v) }
          : this._activeSheet === 'fan'
            ? { title: 'Fan speed', options: fanModes, current: currentFan, onSelect: (v: string) => this._setClimateFan(v) }
            : this._activeSheet === 'swing'
              ? { title: 'Swing mode', options: swingModes, current: currentSwing, onSelect: (v: string) => this._setClimateSwing(v) }
              : null;

    return html`
      <div class="climate-hero ${modeTone} ${this._dialDragging ? 'is-dragging' : ''}">
        <div
          class="dial-container"
          @pointerdown=${this._onDialPointerDown}
          @pointermove=${this._onDialPointerMove}
          @pointerup=${this._onDialPointerUp}
          @pointercancel=${this._onDialPointerUp}
        >
          <svg class="dial-svg" viewBox="0 0 280 280" aria-hidden="true">
            <circle cx=${cx} cy=${cy} r="132" class="dial-bg-circle" />
            <path d=${trackPath} class="dial-arc-track" />

            ${currentPt && currentLabelPt
              ? svg`
                  <circle cx=${currentPt.x} cy=${currentPt.y} r="3.5" class="dial-ambient-dot" />
                  <text
                    x=${currentLabelPt.x}
                    y=${currentLabelPt.y + 4}
                    text-anchor="middle"
                    class="dial-ambient-label"
                  >
                    ${Math.round(current!)}
                  </text>
                `
              : nothing}

            <!-- Interactive Target Thumb: morphs from dot -> elongated radial pill on drag -->
            <g transform="translate(${thumbPt.x.toFixed(2)}, ${thumbPt.y.toFixed(2)}) rotate(${targetDeg.toFixed(1)})">
              <rect
                class="dial-thumb-pill"
                x=${this._dialDragging ? -14 : -5}
                y=${this._dialDragging ? -3.5 : -5}
                width=${this._dialDragging ? 28 : 10}
                height=${this._dialDragging ? 7 : 10}
                rx="5"
              />
            </g>
          </svg>

          <div class="dial-center">
            ${isOff && !this._dialDragging
              ? html`<span class="dial-readout-off">Off</span>`
              : html`
                  <span class="dial-readout-num">
                    ${whole}${hasHalf ? html`<sup>5</sup>` : nothing}
                  </span>
                `}

            <div class="dial-steppers" @pointerdown=${(e: Event) => e.stopPropagation()}>
              <button
                type="button"
                class="dial-step-btn"
                aria-label="Decrease temperature"
                @click=${() => this._setClimateTemp(target - 0.5)}
              >
                −
              </button>
              <button
                type="button"
                class="dial-step-btn"
                aria-label="Increase temperature"
                @click=${() => this._setClimateTemp(target + 0.5)}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="modular-stack">
        <!-- Adaptive Row 1: Mode (full pill if alone, or 2-col with Preset like Daikin) -->
        <div class="${hasPreset ? 'climate-grid-2' : ''}">
          <button
            type="button"
            class="mode-pill ${hasPreset ? 'compact-trait' : ''} ${modeTone}"
            @click=${() => (this._activeSheet = 'mode')}
          >
            <span class="mode-pill-icon">
              ${mode === 'heat'
                ? html`<svg viewBox="0 0 24 24"><path d="M7 19c1.5-2 1.5-4 0-6s-1.5-4 0-6M12 19c1.5-2 1.5-4 0-6s-1.5-4 0-6M17 19c1.5-2 1.5-4 0-6s-1.5-4 0-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>`
                : mode === 'cool'
                  ? html`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M11 2h2v4.17l2.59-2.58L17 5l-4 4v2h2l4-4 1.41 1.41L17.83 11H22v2h-4.17l2.58 2.59L19 17l-4-4h-2v2l4 4-1.41 1.41L13 17.83V22h-2v-4.17l-2.59 2.58L7 19l4-4v-2H9l-4 4-1.41-1.41L6.17 13H2v-2h4.17L3.59 8.41 5 7l4 4h2V9L7 5l1.41-1.41L11 6.17V2Z"/></svg>`
                  : html`<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13 3h-2v10h2V3Zm4.83 2.17-1.42 1.42A6.92 6.92 0 0 1 19 12a7 7 0 1 1-11.41-5.41L6.17 5.17A8.93 8.93 0 0 0 3 12a9 9 0 0 0 18 0c0-2.74-1.23-5.18-3.17-6.83Z"/></svg>`}
            </span>
            <span class="mode-pill-text">
              <span class="mode-pill-title">Mode</span>
              <span class="mode-pill-val">${formatCap(mode)}</span>
            </span>
          </button>

          ${hasPreset
            ? html`
                <button
                  type="button"
                  class="trait-card"
                  @click=${() => (this._activeSheet = 'preset')}
                >
                  <span class="mode-pill-text">
                    <span class="mode-pill-title">Preset</span>
                    <span class="mode-pill-val">${formatCap(currentPreset)}</span>
                  </span>
                  <span class="trait-chevron">⌄</span>
                </button>
              `
            : nothing}
        </div>

        <!-- Adaptive Row 2: Fan speed & Swing (only rendered if entity exposes them) -->
        ${hasFan || hasSwing
          ? html`
              <div class="${hasFan && hasSwing ? 'climate-grid-2' : ''}">
                ${hasFan
                  ? html`
                      <button
                        type="button"
                        class="trait-card"
                        @click=${() => (this._activeSheet = 'fan')}
                      >
                        <span class="trait-left">
                          <svg viewBox="0 0 24 24" class="mini-svg">
                            <path
                              fill="currentColor"
                              d="M12 11a1 1 0 1 0 1 1 1 1 0 0 0-1-1Zm.5-9C17 2 17.1 5.57 14.73 6.75a3.36 3.36 0 0 0-1.62 2.47 3.17 3.17 0 0 1 1.23.91C18 8.13 22 8.92 22 12.5c0 4.5-3.58 4.6-4.75 2.23a3.44 3.44 0 0 0-2.5-1.62 3.24 3.24 0 0 1-.91 1.23c2 3.69 1.2 7.66-2.38 7.66C7 22 6.89 18.42 9.26 17.24a3.46 3.46 0 0 0 1.62-2.45 3.17 3.17 0 0 1-1.25-.92C5.94 15.85 2 15.07 2 11.5 2 7 5.54 6.89 6.72 9.26a3.39 3.39 0 0 0 2.48 1.61 3.24 3.24 0 0 1 .92-1.22C8.16 5.95 8.92 2 12.5 2Z"
                            />
                          </svg>
                          <span class="mode-pill-text">
                            <span class="mode-pill-title">Fan speed</span>
                            <span class="mode-pill-val">${formatCap(currentFan)}</span>
                          </span>
                        </span>
                        <span class="trait-chevron">⌄</span>
                      </button>
                    `
                  : nothing}

                ${hasSwing
                  ? html`
                      <button
                        type="button"
                        class="trait-card"
                        @click=${() => (this._activeSheet = 'swing')}
                      >
                        <span class="mode-pill-text">
                          <span class="mode-pill-title">Swing</span>
                          <span class="mode-pill-val">${formatCap(currentSwing)}</span>
                        </span>
                        <span class="trait-chevron">⌄</span>
                      </button>
                    `
                  : nothing}
              </div>
            `
          : nothing}

        ${current !== null || outdoor || currentHumidity
          ? html`
              <div class="telemetry-card">
                ${current !== null
                  ? html`
                      <div class="telemetry-row">
                        <span>Indoor temperature</span>
                        <strong>${current}°</strong>
                      </div>
                    `
                  : nothing}
                ${currentHumidity
                  ? html`
                      <div class="telemetry-row">
                        <span>Humidity</span>
                        <strong>${currentHumidity}</strong>
                      </div>
                    `
                  : nothing}
                ${outdoor
                  ? html`
                      <div class="telemetry-row">
                        <span>Outdoor temperature</span>
                        <strong>${outdoor.state}${outdoor.attributes.unit_of_measurement ?? '°'}</strong>
                      </div>
                    `
                  : nothing}
              </div>
            `
          : nothing}
      </div>

      <!-- Unified Inline Bottom Sheet for Mode / Preset / Fan / Swing -->
      ${sheetConfig
        ? html`
            <div class="mode-sheet-backdrop" @click=${() => (this._activeSheet = null)}>
              <div class="mode-sheet" @click=${(e: Event) => e.stopPropagation()}>
                <div class="mode-sheet-header">
                  <button
                    type="button"
                    class="icon-btn"
                    @click=${() => (this._activeSheet = null)}
                    aria-label="Close selector"
                  >
                    ⌄
                  </button>
                  <span>${sheetConfig.title}</span>
                </div>
                <div class="mode-sheet-list">
                  ${sheetConfig.options.map((opt) => {
                    const selected = opt.toLowerCase() === sheetConfig.current.toLowerCase();
                    const cls =
                      this._activeSheet === 'mode'
                        ? opt === 'heat'
                          ? 'mode-heat'
                          : opt === 'cool'
                            ? 'mode-cool'
                            : 'mode-off'
                        : 'mode-off';
                    return html`
                      <button
                        type="button"
                        class="mode-option ${selected ? `selected ${cls}` : ''}"
                        @click=${() => sheetConfig.onSelect(opt)}
                      >
                        <span>${formatCap(opt)}</span>
                        ${selected ? html`<span class="check-mark">✓</span>` : nothing}
                      </button>
                    `;
                  })}
                </div>
              </div>
            </div>
          `
        : nothing}
    `;
  }

  private _renderRemotePopup() {
    const source = String(this._entity?.attributes.source ?? 'Source');
    return html`
      <div class="remote-hero">
        <div class="rocker-pill">
          <button
            type="button"
            class="rocker-half"
            aria-label="Volume up"
            @click=${() => this._triggerRemoteButton('volume_up', 'volume_up', {}, 'VolumeUp')}
          >
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02ZM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77Z"/></svg>
          </button>
          <span class="rocker-divider"></span>
          <button
            type="button"
            class="rocker-half"
            aria-label="Volume down"
            @click=${() => this._triggerRemoteButton('volume_down', 'volume_down', {}, 'VolumeDown')}
          >
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M18.5 12A4.5 4.5 0 0 0 16 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02ZM5 9v6h4l5 5V4L9 9H5Z"/></svg>
          </button>
        </div>
      </div>

      <div class="modular-stack">
        <div class="split-pill">
          <button
            type="button"
            class="split-half"
            @click=${() => this._triggerRemoteButton('unmute', 'volume_mute', { is_volume_muted: false }, 'Unmute')}
          >
            Unmute
          </button>
          <span class="split-vdivider"></span>
          <button
            type="button"
            class="split-half"
            @click=${() => this._triggerRemoteButton('mute', 'volume_mute', { is_volume_muted: true }, 'Mute')}
          >
            Mute
          </button>
        </div>

        <div class="split-pill">
          <button
            type="button"
            class="split-half"
            @click=${() => this._triggerRemoteButton('power_on', 'turn_on', {}, 'PowerOn')}
          >
            On
          </button>
          <span class="split-vdivider"></span>
          <button
            type="button"
            class="split-half"
            @click=${() => this._triggerRemoteButton('power_off', 'turn_off', {}, 'PowerOff')}
          >
            Off
          </button>
        </div>

        <div class="transport-row">
          <button
            type="button"
            class="transport-icon"
            aria-label="Previous"
            @click=${() => this._triggerRemoteButton('prev', 'media_previous_track', {}, 'Previous')}
          >
            ⏮
          </button>
          <button
            type="button"
            class="transport-circle"
            aria-label="Play"
            @click=${() => this._triggerRemoteButton('play', 'media_play', {}, 'Play')}
          >
            ▶
          </button>
          <button
            type="button"
            class="transport-circle"
            aria-label="Pause"
            @click=${() => this._triggerRemoteButton('pause', 'media_pause', {}, 'Pause')}
          >
            ⏸
          </button>
          <button
            type="button"
            class="transport-icon"
            aria-label="Next"
            @click=${() => this._triggerRemoteButton('next', 'media_next_track', {}, 'Next')}
          >
            ⏭
          </button>
        </div>

        <div class="channel-pill">
          <button
            type="button"
            class="channel-btn"
            aria-label="Channel down"
            @click=${() => this._triggerRemoteButton('ch_down', 'media_previous_track', {}, 'ChannelDown')}
          >
            ⌄
          </button>
          <span class="channel-label">CH</span>
          <button
            type="button"
            class="channel-btn"
            aria-label="Channel up"
            @click=${() => this._triggerRemoteButton('ch_up', 'media_next_track', {}, 'ChannelUp')}
          >
            ⌃
          </button>
        </div>

        <div class="secondary-action-card">
          <span>${source}</span>
          <span>⌄</span>
        </div>
      </div>
    `;
  }

  private _renderMediaPopup() {
    const entity = this._entity;
    const isPlaying = entity?.state === 'playing';
    const isIdle = !entity || entity.state === 'idle' || entity.state === 'off';
    const mediaTitle = String(entity?.attributes.media_title ?? (isIdle ? 'Nothing playing' : 'Paused'));
    const mediaArtist = String(entity?.attributes.media_artist ?? '');
    const appName = String(entity?.attributes.app_name ?? '');
    const artwork = String(entity?.attributes.entity_picture ?? '');
    const vol = this._mediaVolumePct;

    return html`
      <div
        class="media-hero-card ${artwork && !isIdle ? 'has-art' : ''}"
        style=${artwork && !isIdle ? `--media-art: url("${artwork}");` : ''}
      >
        <div class="media-hero-top">
          <span class="media-app-badge">${appName || '▶'}</span>
        </div>

        <div class="media-hero-mid">
          <div class="media-meta">
            <span class="media-title">${mediaTitle}</span>
            ${mediaArtist ? html`<span class="media-artist">${mediaArtist}</span>` : nothing}
          </div>
          ${!isIdle
            ? html`
                <button
                  type="button"
                  class="media-play-fab"
                  aria-label=${isPlaying ? 'Pause' : 'Play'}
                  @click=${() => this._callEntityService('media_play_pause')}
                >
                  ${isPlaying ? '⏸' : '▶'}
                </button>
              `
            : nothing}
        </div>

        <div class="media-scrubber-row">
          <button
            type="button"
            class="scrubber-btn"
            @click=${() => this._callEntityService('media_previous_track')}
          >
            ⏮
          </button>
          <div class="scrubber-track">
            <div class="scrubber-fill" style="width: ${isIdle ? 50 : 28}%"></div>
            <span class="scrubber-dot" style="left: ${isIdle ? 50 : 28}%"></span>
          </div>
          <button
            type="button"
            class="scrubber-btn"
            @click=${() => this._callEntityService('media_next_track')}
          >
            ⏭
          </button>
        </div>
      </div>

      <div class="modular-stack">
        <!-- Shape Coding: Full Pill (9999px) for Active Primary Volume Slider -->
        <div
          class="volume-pill ${this._volDragging ? 'is-dragging' : ''}"
          style="--vol-pct: ${vol}%;"
          role="slider"
          tabindex="0"
          aria-label="Volume"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${vol}
          @pointerdown=${this._onVolPointerDown}
          @pointermove=${this._onVolPointerMove}
          @pointerup=${this._onVolPointerUp}
          @pointercancel=${this._onVolPointerUp}
        >
          <div class="volume-pill-fill"></div>
          <div class="volume-pill-content">
            <svg viewBox="0 0 24 24" class="mini-svg">
              <path
                fill="currentColor"
                d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02Z"
              />
            </svg>
            <span>${vol}%</span>
          </div>
        </div>

        <!-- Shape Coding: Full Pill (9999px) Tonal Primary for Active Stop Casting -->
        ${!isIdle
          ? html`
              <button
                type="button"
                class="primary-action-pill"
                @click=${() => this._callEntityService('turn_off')}
              >
                Stop casting
              </button>
            `
          : nothing}

        <!-- Shape Coding: 20px Rounded Rectangle Neutral for Secondary Actions -->
        <button
          type="button"
          class="secondary-action-card"
          @click=${() => this._callEntityService('media_play_pause')}
        >
          <span>${isIdle ? 'Cast my audio' : appName ? `Open ${appName}` : 'Open remote'}</span>
          <span>↗</span>
        </button>
      </div>
    `;
  }

  /* =========================================================================
     MAIN RENDER
     ========================================================================= */
  protected render() {
    if (!this._config) return nothing;
    const entity = this._entity;
    const name = this._config.name || entity?.attributes.friendly_name || this._config.entity;
    const isActive = this._isActive;
    const icon = isActive
      ? this._config.icon_active || entity?.attributes.icon
      : this._config.icon_inactive || this._config.icon_active || entity?.attributes.icon;
    const popupType = this._resolvedPopupType;
    const hasPopup = popupType !== 'none';

    return html`
      <ha-card
        class="status-tile ${isActive ? 'is-active' : 'is-inactive'} ${this._pressed ? 'is-pressed' : ''}"
        role="button"
        tabindex="0"
        aria-label="${name}, ${this._stateLabel}"
        @pointerdown=${() => (this._pressed = true)}
        @pointerup=${() => (this._pressed = false)}
        @pointerleave=${() => (this._pressed = false)}
        @pointercancel=${() => (this._pressed = false)}
        @click=${this._onTileClick}
        @contextmenu=${(e: MouseEvent) => {
          e.preventDefault();
          this.openPopup();
        }}
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this._onTileClick();
          }
        }}
      >
        <div class="state-layer" aria-hidden="true"></div>
        <div class="tile-inner">
          <span class="tile-icon">${this._renderEntityIcon(icon)}</span>
          <div class="tile-meta">
            <span class="tile-title">${name}</span>
            <span class="tile-subtitle">${this._stateLabel}</span>
          </div>
          ${hasPopup
            ? html`
                <span class="tile-chevron" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.41 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01Z"
                    />
                  </svg>
                </span>
              `
            : nothing}
        </div>
      </ha-card>

      <dialog
        class="status-dialog"
        @click=${(e: MouseEvent) => {
          if (e.target === this._dialogEl) this.closePopup();
        }}
        @cancel=${(e: Event) => {
          e.preventDefault();
          this.closePopup();
        }}
      >
        ${this._popupOpen
          ? html`
              <div class="dialog-surface">
                <header class="dialog-header">
                  <button
                    type="button"
                    class="icon-btn"
                    @click=${() => this.closePopup()}
                    aria-label="Close"
                  >
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"
                      />
                    </svg>
                  </button>
                  <span class="dialog-title">${name}</span>
                </header>

                ${popupType === 'sensor'
                  ? this._renderSensorPopup(icon)
                  : popupType === 'climate'
                    ? this._renderClimatePopup()
                    : popupType === 'remote'
                      ? this._renderRemotePopup()
                      : this._renderMediaPopup()}
              </div>
            `
          : nothing}
      </dialog>
    `;
  }

  static styles = [
    m3eBaseStyles,
    css`
      :host {
        --m3e-spring-bouncy: 520ms linear(
          0, 0.168 7%, 0.618 18%, 0.962 31%, 1.072 43%,
          1.038 56%, 0.992 71%, 1.005 86%, 1
        );
      }

      /* =====================================================================
         1. COMPACT DASHBOARD TILE (Shape Coding: Pill = Active, 28px = Off)
         ===================================================================== */
      .status-tile {
        min-height: 84px;
        cursor: pointer;
        user-select: none;
        outline: none;
        border-radius: var(--ha-card-border-radius, 28px);
        transition:
          border-radius var(--m3e-spring-bouncy),
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-default),
          border-color var(--m3e-spring-effects-default);
      }

      /* Uniform 28px form factor matching m3e-light-card (tonal primary fill indicates active) */
      .status-tile.is-active {
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .status-tile.is-pressed {
        transform: scale(0.965);
      }

      .status-tile:focus-visible {
        outline: 2px solid var(--md-sys-color-primary, #4c5c92);
        outline-offset: 2px;
      }

      .state-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: currentColor;
        opacity: 0;
        transition: opacity var(--m3e-spring-effects-fast);
      }

      .status-tile:hover .state-layer {
        opacity: 0.06;
      }

      .status-tile.is-pressed .state-layer {
        opacity: 0.11;
      }

      .tile-inner {
        position: relative;
        z-index: 1;
        min-height: 84px;
        padding: 16px 18px 16px 20px;
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .tile-icon {
        flex: 0 0 auto;
        width: 26px;
        height: 26px;
        display: grid;
        place-items: center;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        transition: color var(--m3e-spring-effects-default);
      }

      .status-tile.is-active .tile-icon {
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .tile-icon ha-icon,
      .tile-icon svg {
        width: 24px;
        height: 24px;
        --mdc-icon-size: 24px;
      }

      .tile-meta {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .tile-title {
        font-size: 15px;
        font-weight: 600;
        line-height: 20px;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .tile-subtitle {
        font-size: 13px;
        font-weight: 500;
        line-height: 18px;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      .status-tile.is-active .tile-title,
      .status-tile.is-active .tile-subtitle,
      .status-tile.is-active .tile-chevron {
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .tile-chevron {
        flex: 0 0 auto;
        width: 20px;
        height: 20px;
        display: grid;
        place-items: center;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        opacity: 0.78;
      }

      .tile-chevron svg {
        width: 20px;
        height: 20px;
      }

      /* =====================================================================
         2. MODULAR EXPANDED POPUP SHELL
         ===================================================================== */
      dialog.status-dialog {
        margin: auto;
        padding: 0;
        border: 0;
        background: transparent;
        max-width: min(410px, calc(100vw - 24px));
        width: 100%;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      dialog.status-dialog::backdrop {
        background: color-mix(in srgb, var(--md-sys-color-scrim, #000000) 58%, transparent);
      }

      .dialog-surface {
        position: relative;
        overflow: hidden;
        background: var(--md-sys-color-surface, #131316);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        border-radius: 32px;
        padding: 20px 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 18px;
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.36);
      }

      .dialog-header {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .dialog-title {
        flex: 1 1 auto;
        min-width: 0;
        font-size: 20px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .icon-btn {
        flex: 0 0 auto;
        width: 44px;
        height: 44px;
        border: 0;
        border-radius: var(--m3e-corner-full);
        display: grid;
        place-items: center;
        cursor: pointer;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font-size: 20px;
      }

      .icon-btn:hover {
        background: color-mix(in srgb, currentColor 8%, transparent);
      }

      .icon-btn svg {
        width: 22px;
        height: 22px;
      }

      .modular-stack {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .mini-svg {
        width: 20px;
        height: 20px;
        flex: 0 0 auto;
      }

      /* =====================================================================
         VARIANT 1: SENSOR HERO + TELEMETRY PILL
         ===================================================================== */
      .sensor-hero {
        display: flex;
        justify-content: center;
        padding: 12px 0;
      }

      .sensor-ring {
        width: 236px;
        height: 236px;
        border-radius: 50%;
        border: 22px solid var(--md-sys-color-surface-container-high, #24252d);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: border-color var(--m3e-spring-effects-default);
      }

      .sensor-ring.is-active {
        border-color: var(--md-sys-color-primary-container, #364067);
      }

      .sensor-ring-icon {
        width: 28px;
        height: 28px;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      .sensor-ring-icon svg,
      .sensor-ring-icon ha-icon {
        width: 28px;
        height: 28px;
      }

      .sensor-ring-state {
        font-size: 22px;
        font-weight: 500;
      }

      .sensor-ring-sub {
        font-size: 13px;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      .info-pill {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 20px;
        border-radius: 24px;
        background: var(--md-sys-color-surface-container-high, #24252d);
        font-size: 15px;
      }

      .info-pill-left {
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      .info-pill-val {
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }

      /* =====================================================================
         VARIANT 2: CLIMATE DIAL + RADIAL THUMB MORPH + MODE SHEET
         ===================================================================== */
      .climate-hero {
        display: flex;
        justify-content: center;
        --climate-accent: var(--md-sys-color-primary, #bac3ff);
      }

      .climate-hero.mode-heat {
        --climate-accent: #f3b59b;
      }

      .climate-hero.mode-cool {
        --climate-accent: #9ecaff;
      }

      .dial-container {
        position: relative;
        width: 264px;
        height: 264px;
        touch-action: none;
        user-select: none;
        cursor: grab;
      }

      .dial-container:active {
        cursor: grabbing;
      }

      .dial-svg {
        width: 100%;
        height: 100%;
      }

      .dial-bg-circle {
        fill: var(--md-sys-color-surface-container-high, #2b2b30);
      }

      .dial-arc-track {
        fill: none;
        stroke: var(--md-sys-color-outline-variant, #4a4a52);
        stroke-width: 8;
        stroke-linecap: round;
        transition: stroke-width var(--m3e-spring-spatial-fast);
      }

      .climate-hero.is-dragging .dial-arc-track {
        stroke-width: 18;
      }

      .dial-ambient-dot {
        fill: var(--md-sys-color-on-surface, #e3e2e6);
        opacity: 0.75;
      }

      .dial-ambient-label {
        fill: var(--md-sys-color-on-surface, #e3e2e6);
        font-size: 13px;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
      }

      .dial-thumb-pill {
        fill: var(--climate-accent);
        transition:
          x var(--m3e-spring-spatial-fast),
          y var(--m3e-spring-spatial-fast),
          width var(--m3e-spring-spatial-fast),
          height var(--m3e-spring-spatial-fast);
      }

      .dial-center {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        pointer-events: none;
      }

      .dial-readout-off {
        font-size: 46px;
        font-weight: 500;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      .dial-readout-num {
        font-size: 58px;
        font-weight: 500;
        line-height: 1;
        font-variant-numeric: tabular-nums;
      }

      .dial-readout-num sup {
        font-size: 28px;
        vertical-align: super;
        margin-left: 2px;
      }

      .dial-steppers {
        position: absolute;
        bottom: 24px;
        display: flex;
        gap: 36px;
        pointer-events: auto;
      }

      .dial-step-btn {
        width: 36px;
        height: 36px;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font-size: 24px;
        line-height: 1;
        cursor: pointer;
        display: grid;
        place-items: center;
      }

      .dial-step-btn:hover {
        background: color-mix(in srgb, currentColor 10%, transparent);
      }

      .mode-pill {
        width: 100%;
        border: 0;
        padding: 16px 20px;
        border-radius: var(--m3e-corner-full);
        display: flex;
        align-items: center;
        gap: 14px;
        text-align: left;
        cursor: pointer;
        font: inherit;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        transition:
          background-color var(--m3e-spring-effects-default),
          transform var(--m3e-spring-spatial-fast);
      }

      .mode-pill:active {
        transform: scale(0.98);
      }

      .mode-pill.mode-heat {
        background: #5e3d2e;
        color: #ffdbcc;
      }

      .mode-pill.mode-cool {
        background: #2f455c;
        color: #d2e4ff;
      }

      .mode-pill-icon svg {
        width: 22px;
        height: 22px;
        display: block;
      }

      .mode-pill-text {
        display: flex;
        flex-direction: column;
      }

      .mode-pill-title {
        font-size: 14px;
        font-weight: 600;
      }

      .mode-pill-val {
        font-size: 13px;
        opacity: 0.85;
      }

      .climate-grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .mode-pill.compact-trait {
        border-radius: 20px;
      }

      .trait-card {
        width: 100%;
        border: 0;
        padding: 16px 18px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        text-align: left;
        cursor: pointer;
        font: inherit;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        transition:
          background-color var(--m3e-spring-effects-default),
          transform var(--m3e-spring-spatial-fast);
      }

      .trait-card:active {
        transform: scale(0.98);
      }

      .trait-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .trait-chevron {
        font-size: 18px;
        opacity: 0.75;
      }

      .telemetry-card {
        background: var(--md-sys-color-surface-container-high, #22232a);
        border-radius: 24px;
        padding: 14px 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .telemetry-row {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        font-variant-numeric: tabular-nums;
      }

      /* Inline Mode Selector Bottom Sheet */
      .mode-sheet-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.42);
        display: flex;
        align-items: flex-end;
        z-index: 10;
      }

      .mode-sheet {
        width: 100%;
        background: var(--md-sys-color-surface-container, #1e1f26);
        border-radius: 28px 28px 0 0;
        padding: 16px 16px 24px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .mode-sheet-header {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 18px;
        font-weight: 500;
      }

      .mode-sheet-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .mode-option {
        width: 100%;
        border: 0;
        padding: 16px 20px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font: inherit;
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        transition: border-radius var(--m3e-spring-spatial-fast);
      }

      .mode-option.selected {
        border-radius: var(--m3e-corner-full);
      }

      .mode-option.selected.mode-heat {
        background: #5e3d2e;
        color: #ffdbcc;
      }

      .mode-option.selected.mode-cool {
        background: #2f455c;
        color: #d2e4ff;
      }

      .mode-option.selected.mode-off {
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      /* =====================================================================
         VARIANT 3: REMOTE / TV (Vertical Rocker Pill + Split Pills)
         ===================================================================== */
      .remote-hero {
        display: flex;
        justify-content: center;
        padding: 6px 0;
      }

      .rocker-pill {
        width: 132px;
        height: 236px;
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-surface-container-high, #282930);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .rocker-half {
        flex: 1;
        border: 0;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        cursor: pointer;
      }

      .rocker-half:hover {
        background: color-mix(in srgb, currentColor 7%, transparent);
      }

      .rocker-half svg {
        width: 24px;
        height: 24px;
      }

      .rocker-divider {
        height: 1px;
        background: var(--md-sys-color-outline-variant, #44464f);
      }

      .split-pill {
        height: 56px;
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-surface-container-high, #282930);
        display: flex;
        overflow: hidden;
      }

      .split-half {
        flex: 1;
        border: 0;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font: inherit;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      }

      .split-half:hover {
        background: color-mix(in srgb, currentColor 7%, transparent);
      }

      .split-vdivider {
        width: 1px;
        background: var(--md-sys-color-outline-variant, #44464f);
      }

      .transport-row {
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 4px 0;
      }

      .transport-icon,
      .transport-circle {
        border: 0;
        cursor: pointer;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        font-size: 18px;
      }

      .transport-icon {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: transparent;
      }

      .transport-circle {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: var(--md-sys-color-surface-container-high, #282930);
      }

      .channel-pill {
        height: 56px;
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-surface-container-high, #282930);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px;
      }

      .channel-btn {
        width: 44px;
        height: 44px;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font-size: 20px;
        cursor: pointer;
      }

      .channel-label {
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.04em;
      }

      /* =====================================================================
         VARIANT 4: MEDIA / SPEAKER (Media Card + Shape-Coded Volume & Actions)
         ===================================================================== */
      .media-hero-card {
        position: relative;
        overflow: hidden;
        min-height: 178px;
        border-radius: 28px;
        padding: 18px 20px;
        background: var(--md-sys-color-surface-container-high, #2b2b30);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 14px;
      }

      .media-hero-card.has-art::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: var(--media-art);
        background-size: cover;
        background-position: center;
        filter: brightness(0.45);
      }

      .media-hero-top,
      .media-hero-mid,
      .media-scrubber-row {
        position: relative;
        z-index: 1;
      }

      .media-app-badge {
        display: inline-flex;
        align-items: center;
        padding: 4px 10px;
        border-radius: var(--m3e-corner-full);
        background: color-mix(in srgb, var(--md-sys-color-surface, #131316) 55%, transparent);
        font-size: 12px;
        font-weight: 600;
      }

      .media-hero-mid {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .media-meta {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .media-title {
        font-size: 18px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .media-artist {
        font-size: 14px;
        opacity: 0.85;
      }

      .media-play-fab {
        flex: 0 0 48px;
        width: 48px;
        height: 48px;
        border: 0;
        border-radius: 50%;
        background: var(--md-sys-color-primary-container, #e8e2d5);
        color: var(--md-sys-color-on-primary-container, #1b1b1f);
        font-size: 18px;
        cursor: pointer;
        display: grid;
        place-items: center;
      }

      .media-scrubber-row {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .scrubber-btn {
        border: 0;
        background: transparent;
        color: inherit;
        font-size: 16px;
        cursor: pointer;
        padding: 4px;
      }

      .scrubber-track {
        position: relative;
        flex: 1;
        height: 3px;
        border-radius: 9999px;
        background: color-mix(in srgb, currentColor 28%, transparent);
      }

      .scrubber-fill {
        height: 100%;
        border-radius: 9999px;
        background: currentColor;
      }

      .scrubber-dot {
        position: absolute;
        top: 50%;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: currentColor;
        transform: translate(-50%, -50%);
      }

      /* Full Pill Volume Slider */
      .volume-pill {
        position: relative;
        height: 64px;
        border-radius: var(--m3e-corner-full);
        overflow: hidden;
        cursor: ew-resize;
        user-select: none;
        touch-action: pan-y;
        background: color-mix(
          in srgb,
          var(--md-sys-color-primary-container, #364067) 48%,
          var(--md-sys-color-surface-container-high, #24252d)
        );
      }

      .volume-pill-fill {
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        width: var(--vol-pct, 40%);
        background: var(--md-sys-color-primary-container, #364067);
        transition: width var(--m3e-spring-spatial-default);
      }

      .volume-pill.is-dragging .volume-pill-fill {
        transition: none;
      }

      .volume-pill-content {
        position: relative;
        z-index: 1;
        height: 100%;
        padding: 0 22px;
        display: flex;
        align-items: center;
        gap: 14px;
        font-size: 15px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-primary-container, #dce2ff);
        pointer-events: none;
      }

      /* Full Pill Active Primary Action */
      .primary-action-pill {
        height: 60px;
        border: 0;
        border-radius: var(--m3e-corner-full);
        padding: 0 22px;
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
        font: inherit;
        font-size: 15px;
        font-weight: 500;
        text-align: left;
        cursor: pointer;
      }

      /* 20px Rounded Rectangle Neutral Secondary Action */
      .secondary-action-card {
        height: 60px;
        border: 0;
        border-radius: 20px;
        padding: 0 20px;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        font: inherit;
        font-size: 15px;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-status-card': M3EStatusCard;
  }
}
