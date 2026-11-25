import { LitElement, css, html, nothing, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { m3eBaseStyles } from '../styles/m3e-tokens';
import type { HassEntity, HomeAssistant, M3ELightCardConfig } from '../types/home-assistant';

const DRAG_THRESHOLD_PX = 8;
const LONG_PRESS_MS = 420;

interface LightPreset {
  id: string;
  label: string;
  hex: string;
  rgb: [number, number, number];
  kelvin?: number;
}

const DEFAULT_PRESETS: LightPreset[] = [
  { id: 'warm-gold', label: 'Candle', hex: '#FFE066', rgb: [255, 224, 102], kelvin: 2200 },
  { id: 'warm-amber', label: 'Warm', hex: '#FFE68A', rgb: [255, 230, 138], kelvin: 2700 },
  { id: 'soft-white', label: 'Soft White', hex: '#FFF0B8', rgb: [255, 240, 184], kelvin: 3200 },
  { id: 'neutral', label: 'Neutral', hex: '#FFF7E0', rgb: [255, 247, 224], kelvin: 4000 },
  { id: 'daylight', label: 'Daylight', hex: '#FFFFFF', rgb: [255, 255, 255], kelvin: 5000 },
  { id: 'cool', label: 'Cool', hex: '#E3F2FD', rgb: [227, 242, 253], kelvin: 6500 },
  { id: 'coral', label: 'Coral', hex: '#FFAB91', rgb: [255, 171, 145] },
  { id: 'lavender', label: 'Lavender', hex: '#CE93D8', rgb: [206, 147, 216] },
];

const RECENT_STORAGE_PREFIX = 'm3e-light-recent-colors:';
const MAX_RECENT_COLORS = 6;

function loadRecentPresets(entityId: string): LightPreset[] {
  try {
    const raw = window.localStorage.getItem(`${RECENT_STORAGE_PREFIX}${entityId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p): p is LightPreset =>
        p && typeof p.id === 'string' && typeof p.hex === 'string' && Array.isArray(p.rgb),
    );
  } catch {
    return [];
  }
}

function saveRecentPreset(entityId: string, preset: LightPreset): void {
  try {
    const existing = loadRecentPresets(entityId).filter((p) => p.hex !== preset.hex);
    const next = [preset, ...existing].slice(0, MAX_RECENT_COLORS);
    window.localStorage.setItem(`${RECENT_STORAGE_PREFIX}${entityId}`, JSON.stringify(next));
  } catch {
    // Ignore storage quota / privacy mode errors
  }
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
      .join('')
  );
}

function kelvinToRgb(kelvin: number): [number, number, number] {
  const k = Math.max(2000, Math.min(6500, kelvin));
  if (k <= 2400) return [255, 224, 102];
  if (k <= 2900) return [255, 230, 138];
  if (k <= 3600) return [255, 240, 184];
  if (k <= 4500) return [255, 247, 224];
  if (k <= 5600) return [255, 255, 255];
  return [227, 242, 253];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

@customElement('m3e-light-card')
export class M3ELightCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3ELightCardConfig;

  public static getStubConfig(hass?: HomeAssistant): M3ELightCardConfig {
    const firstLight = hass
      ? Object.keys(hass.states).find((id) => id.startsWith('light.'))
      : undefined;
    return {
      type: 'custom:m3e-light-card',
      entity: firstLight ?? 'light.living_room',
      use_light_color: true,
      allow_drag_off: true,
    };
  }

  public static getConfigForm() {
    return {
      schema: [
        { name: 'entity', required: true, selector: { entity: { domain: 'light' } } },
        { name: 'name', selector: { text: {} } },
        { name: 'icon', selector: { icon: {} } },
        { name: 'use_light_color', selector: { boolean: {} } },
        { name: 'allow_drag_off', selector: { boolean: {} } },
      ],
      computeLabel: (schema: { name: string }) => {
        const labels: Record<string, string> = {
          entity: 'Entità luce',
          name: 'Nome personalizzato',
          icon: 'Icona personalizzata',
          use_light_color: 'Usa colore reale della luce',
          allow_drag_off: 'Spegni trascinando a 0%',
        };
        return labels[schema.name] ?? schema.name;
      },
    };
  }

  // Tile interaction state
  @state() private _dragging = false;
  @state() private _pressed = false;
  @state() private _dragPct: number | null = null;

  // Popup dialog state
  @state() private _popupOpen = false;
  @state() private _popupDragging = false;
  @state() private _popupDragPct: number | null = null;
  @state() private _selectedPresetId: string | null = null;

  @query('dialog.light-dialog') private _dialogEl?: HTMLDialogElement;
  @query('.tile-card') private _tileEl?: HTMLElement;
  @query('.dialog-surface') private _dialogSurfaceEl?: HTMLElement;

  private _pointerId: number | null = null;
  private _pointerStartX = 0;
  private _pointerStartY = 0;
  private _hasMoved = false;
  private _longPressTriggered = false;
  private _longPressTimer: number | null = null;
  private _prevEntityState?: HassEntity;

  public setConfig(config: M3ELightCardConfig): void {
    if (!config || !config.entity) {
      throw new Error('m3e-light-card: you must define an entity');
    }
    this._config = {
      use_light_color: true,
      allow_drag_off: true,
      ...config,
    };
  }

  public getCardSize(): number {
    return 1;
  }

  public getGridOptions() {
    return { rows: 1, columns: 6, min_rows: 1, min_columns: 3 };
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._clearLongPress();
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (
      changedProps.has('_config') ||
      changedProps.has('_dragging') ||
      changedProps.has('_pressed') ||
      changedProps.has('_dragPct') ||
      changedProps.has('_popupOpen') ||
      changedProps.has('_popupDragging') ||
      changedProps.has('_popupDragPct') ||
      changedProps.has('_selectedPresetId')
    ) {
      return true;
    }

    if (changedProps.has('hass') && this._config && this.hass) {
      const nextEntity = this.hass.states[this._config.entity];
      if (nextEntity !== this._prevEntityState) {
        this._prevEntityState = nextEntity;
        return true;
      }
      return false;
    }

    return false;
  }

  private get _entity(): HassEntity | undefined {
    if (!this.hass || !this._config) return undefined;
    return this.hass.states[this._config.entity];
  }

  private get _isOn(): boolean {
    if (this._popupDragging && this._popupDragPct !== null) {
      return this._popupDragPct > 0;
    }
    if (this._dragging && this._dragPct !== null) {
      return this._dragPct > 0;
    }
    return this._entity?.state === 'on';
  }

  private get _isUnavailable(): boolean {
    const s = this._entity?.state;
    return !s || s === 'unavailable' || s === 'unknown';
  }

  private get _supportsBrightness(): boolean {
    const entity = this._entity;
    if (!entity) return false;
    if (typeof entity.attributes.brightness === 'number') return true;
    const modes = entity.attributes.supported_color_modes;
    if (!Array.isArray(modes)) return true;
    return modes.some((m) => m !== 'onoff');
  }

  private get _brightnessPct(): number {
    if (this._popupDragging && this._popupDragPct !== null) {
      return this._popupDragPct;
    }
    if (this._dragging && this._dragPct !== null) {
      return this._dragPct;
    }
    if (!this._isOn) return 0;
    const b = this._entity?.attributes.brightness;
    if (typeof b !== 'number') return 100;
    return Math.max(1, Math.min(100, Math.round((b / 255) * 100)));
  }

  private get _activeRgb(): [number, number, number] | null {
    if (this._config?.use_light_color === false) return null;
    const attrs = this._entity?.attributes;
    if (!attrs) return null;
    if (Array.isArray(attrs.rgb_color) && attrs.rgb_color.length === 3) {
      return attrs.rgb_color as [number, number, number];
    }
    if (typeof attrs.color_temp_kelvin === 'number') {
      return kelvinToRgb(attrs.color_temp_kelvin);
    }
    return null;
  }

  private get _supportsColorTemp(): boolean {
    const modes = this._entity?.attributes.supported_color_modes;
    if (!Array.isArray(modes)) return false;
    return modes.includes('color_temp');
  }

  private get _supportsRgb(): boolean {
    const modes = this._entity?.attributes.supported_color_modes;
    if (!Array.isArray(modes)) return false;
    return modes.some((m) => ['rgb', 'rgbw', 'rgbww', 'hs', 'xy'].includes(m));
  }

  private get _presets(): LightPreset[] {
    if (!this._supportsRgb && !this._supportsColorTemp) return [];

    const entityId = this._config?.entity ?? '';
    const collected: LightPreset[] = [];
    const seen = new Set<string>();
    const minK = Number(this._entity?.attributes.min_color_temp_kelvin ?? 2000);
    const maxK = Number(this._entity?.attributes.max_color_temp_kelvin ?? 6500);

    const pushUnique = (p: LightPreset) => {
      // For color_temp-only bulbs, skip pure RGB presets that have no kelvin value
      if (!this._supportsRgb && !p.kelvin) return;
      const key = p.kelvin && !this._supportsRgb ? `k:${p.kelvin}` : p.hex.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      collected.push(p);
    };

    // 1. User-configured YAML favorite_colors
    if (Array.isArray(this._config?.favorite_colors)) {
      this._config.favorite_colors.forEach((fav, idx) => {
        const rgb =
          fav.rgb_color ?? (fav.color_temp_kelvin ? kelvinToRgb(fav.color_temp_kelvin) : null);
        if (!rgb) return;
        const hex = rgbToHex(rgb);
        pushUnique({
          id: `cfg-${idx}-${hex}`,
          label: fav.label || (fav.color_temp_kelvin ? `${fav.color_temp_kelvin}K` : hex),
          hex,
          rgb,
          kelvin: fav.color_temp_kelvin,
        });
      });
    }

    // 2. Home Assistant entity registry favorite_colors (when exposed by HA)
    const haFavs = this.hass?.entities?.[entityId]?.options?.light?.favorite_colors;
    if (Array.isArray(haFavs)) {
      haFavs.forEach((fav, idx) => {
        const rgb =
          fav.rgb_color ?? (fav.color_temp_kelvin ? kelvinToRgb(fav.color_temp_kelvin) : null);
        if (!rgb) return;
        const hex = rgbToHex(rgb);
        pushUnique({
          id: `ha-${idx}-${hex}`,
          label: fav.color_temp_kelvin ? `${fav.color_temp_kelvin}K` : hex,
          hex,
          rgb,
          kelvin: fav.color_temp_kelvin,
        });
      });
    }

    // 3. Recently used colors for this entity (stored locally)
    if (entityId) {
      for (const recent of loadRecentPresets(entityId)) {
        pushUnique(recent);
      }
    }

    // 4. Default presets filtered by bulb capabilities (and clamped to bulb kelvin range)
    for (const def of DEFAULT_PRESETS) {
      if (def.kelvin) {
        if (def.kelvin >= minK - 200 && def.kelvin <= maxK + 200) {
          const clampedK = Math.max(minK, Math.min(maxK, def.kelvin));
          pushUnique({ ...def, kelvin: clampedK });
        }
      } else if (this._supportsRgb) {
        pushUnique(def);
      }
    }

    return collected;
  }

  private get _matchedPresetId(): string | null {
    if (this._selectedPresetId) return this._selectedPresetId;
    const rgb = this._activeRgb;
    if (!rgb) return null;
    let bestId: string | null = null;
    let bestDist = Infinity;
    for (const p of this._presets) {
      const dist =
        Math.abs(p.rgb[0] - rgb[0]) +
        Math.abs(p.rgb[1] - rgb[1]) +
        Math.abs(p.rgb[2] - rgb[2]);
      if (dist < bestDist) {
        bestDist = dist;
        bestId = p.id;
      }
    }
    return bestDist <= 45 ? bestId : null;
  }

  private _computeColorVars(): string {
    const rgb = this._activeRgb;
    if (!rgb) {
      return `
        --m3e-light-accent: var(--md-sys-color-primary, #4c5c92);
        --m3e-light-on-accent: var(--md-sys-color-on-primary, #ffffff);
      `;
    }
    const hex = rgbToHex(rgb);
    const isBright = relativeLuminance(rgb) > 0.42;
    const onAccent = isBright ? '#3d2f00' : '#ffffff';
    return `
      --m3e-light-accent: ${hex};
      --m3e-light-on-accent: ${onAccent};
    `;
  }

  private _emitBrightness(pct: number): void {
    if (!this.hass || !this._config) return;

    if (pct <= 0) {
      this.hass.callService('light', 'turn_off', {
        entity_id: this._config.entity,
      });
    } else {
      this.hass.callService('light', 'turn_on', {
        entity_id: this._config.entity,
        brightness_pct: pct,
      });
    }
  }

  private _toggleLight(): void {
    if (!this.hass || !this._config || this._isUnavailable) return;
    this.hass.callService('light', 'toggle', {
      entity_id: this._config.entity,
    });
  }

  private _selectPreset(preset: LightPreset): void {
    if (!this.hass || !this._config || this._isUnavailable) return;
    this._selectedPresetId = preset.id;
    saveRecentPreset(this._config.entity, preset);
    const data: Record<string, unknown> = {
      entity_id: this._config.entity,
    };
    if (preset.kelvin && this._supportsColorTemp) {
      data.color_temp_kelvin = preset.kelvin;
    } else if (this._supportsRgb) {
      data.rgb_color = preset.rgb;
    }
    this.hass.callService('light', 'turn_on', data);
  }

  private _clearLongPress(): void {
    if (this._longPressTimer !== null) {
      window.clearTimeout(this._longPressTimer);
      this._longPressTimer = null;
    }
  }

  /* =========================================================================
     POPUP OPEN / CLOSE (Container Transform from Tile)
     ========================================================================= */
  public async openPopup(): Promise<void> {
    if (this._isUnavailable || this._popupOpen) return;
    const tileRect = this._tileEl?.getBoundingClientRect();
    this._popupOpen = true;
    await this.updateComplete;

    const dialog = this._dialogEl;
    const surface = this._dialogSurfaceEl;
    if (!dialog) return;

    if (!dialog.open) {
      dialog.showModal();
    }

    if (surface && tileRect) {
      const targetRect = surface.getBoundingClientRect();
      const dx = tileRect.left + tileRect.width / 2 - (targetRect.left + targetRect.width / 2);
      const dy = tileRect.top + tileRect.height / 2 - (targetRect.top + targetRect.height / 2);
      const sx = Math.max(0.25, tileRect.width / targetRect.width);
      const sy = Math.max(0.15, tileRect.height / targetRect.height);

      surface.animate(
        [
          {
            transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`,
            borderRadius: '28px',
            opacity: 0.7,
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
      return;
    }

    if (surface) {
      const anim = surface.animate(
        [
          { transform: 'scale(1)', opacity: 1 },
          { transform: 'scale(0.92)', opacity: 0 },
        ],
        {
          duration: 180,
          easing: 'cubic-bezier(0.4, 0, 1, 1)',
        },
      );
      anim.onfinish = () => {
        dialog.close();
        this._popupOpen = false;
      };
    } else {
      dialog.close();
      this._popupOpen = false;
    }
  }

  private _onDialogBackdropClick = (e: MouseEvent): void => {
    if (e.target === this._dialogEl) {
      this.closePopup();
    }
  };

  private _onDialogCancel = (e: Event): void => {
    e.preventDefault();
    this.closePopup();
  };

  /* =========================================================================
     HORIZONTAL TILE POINTER HANDLERS (Tap = Toggle, Drag = Dim, Hold = Popup)
     ========================================================================= */
  private _computeHorizontalPct(clientX: number, el: HTMLElement): number {
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    const pct = Math.round(Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) * 100);
    return pct === 0 && !this._config?.allow_drag_off ? 1 : pct;
  }

  private _onTilePointerDown = (e: PointerEvent): void => {
    if (this._isUnavailable || e.button !== 0) return;
    const el = e.currentTarget as HTMLElement;
    this._pointerId = e.pointerId;
    this._pointerStartX = e.clientX;
    this._pointerStartY = e.clientY;
    this._hasMoved = false;
    this._longPressTriggered = false;
    this._pressed = true;
    el.setPointerCapture(e.pointerId);

    this._clearLongPress();
    this._longPressTimer = window.setTimeout(() => {
      if (!this._hasMoved && this._pointerId !== null) {
        this._longPressTriggered = true;
        this._resetTilePointer(el);
        this.openPopup();
      }
    }, LONG_PRESS_MS);
  };

  private _onTilePointerMove = (e: PointerEvent): void => {
    if (this._pointerId !== e.pointerId || !this._supportsBrightness) return;
    const dx = Math.abs(e.clientX - this._pointerStartX);
    const dy = Math.abs(e.clientY - this._pointerStartY);

    if (!this._hasMoved) {
      if (dx < DRAG_THRESHOLD_PX && dy < DRAG_THRESHOLD_PX) return;
      this._clearLongPress();
      if (dy > dx) {
        this._resetTilePointer(e.currentTarget as HTMLElement);
        return;
      }
      this._hasMoved = true;
      this._dragging = true;
    }

    const pct = this._computeHorizontalPct(e.clientX, e.currentTarget as HTMLElement);
    if (pct !== this._dragPct) {
      this._dragPct = pct;
    }
  };

  private _onTilePointerUp = (e: PointerEvent): void => {
    if (this._pointerId !== e.pointerId) return;
    const el = e.currentTarget as HTMLElement;
    this._clearLongPress();
    if (!this._longPressTriggered) {
      if (this._hasMoved && this._dragPct !== null) {
        this._emitBrightness(this._dragPct);
      } else {
        this._toggleLight();
      }
    }
    this._resetTilePointer(el);
  };

  private _onTilePointerCancel = (e: PointerEvent): void => {
    if (this._pointerId !== e.pointerId) return;
    this._clearLongPress();
    this._resetTilePointer(e.currentTarget as HTMLElement);
  };

  private _resetTilePointer(el?: HTMLElement): void {
    if (el && this._pointerId !== null && el.hasPointerCapture(this._pointerId)) {
      el.releasePointerCapture(this._pointerId);
    }
    this._pointerId = null;
    this._dragging = false;
    this._pressed = false;
    this._hasMoved = false;
    this._dragPct = null;
  }

  private _onTileContextMenu = (e: MouseEvent): void => {
    e.preventDefault();
    this.openPopup();
  };

  private _onKeyDown = (e: KeyboardEvent): void => {
    if (this._isUnavailable) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this._toggleLight();
    } else if (e.key === 'o' || e.key === 'O') {
      e.preventDefault();
      this.openPopup();
    } else if (this._supportsBrightness) {
      const step = e.shiftKey ? 10 : 5;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        this._emitBrightness(Math.min(100, this._brightnessPct + step));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        this._emitBrightness(Math.max(0, this._brightnessPct - step));
      }
    }
  };

  /* =========================================================================
     VERTICAL CAPSULE SLIDER POINTER HANDLERS (Popup Dialog)
     ========================================================================= */
  private _computeVerticalPct(clientY: number, el: HTMLElement): number {
    const rect = el.getBoundingClientRect();
    if (rect.height <= 0) return 0;
    const raw = (rect.bottom - clientY) / rect.height;
    const pct = Math.round(Math.max(0, Math.min(1, raw)) * 100);
    return Math.max(1, pct);
  }

  private _onCapsulePointerDown = (e: PointerEvent): void => {
    if (this._isUnavailable || e.button !== 0 || !this._supportsBrightness) return;
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    this._popupDragging = true;
    const pct = this._computeVerticalPct(e.clientY, el);
    this._popupDragPct = pct;
  };

  private _onCapsulePointerMove = (e: PointerEvent): void => {
    if (!this._popupDragging) return;
    const pct = this._computeVerticalPct(e.clientY, e.currentTarget as HTMLElement);
    if (pct !== this._popupDragPct) {
      this._popupDragPct = pct;
    }
  };

  private _onCapsulePointerUp = (e: PointerEvent): void => {
    if (!this._popupDragging) return;
    const el = e.currentTarget as HTMLElement;
    if (el.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId);
    }
    if (this._popupDragPct !== null) {
      this._emitBrightness(this._popupDragPct);
    }
    this._popupDragging = false;
    this._popupDragPct = null;
  };

  /* =========================================================================
     ICONS
     ========================================================================= */
  private _renderBulbIcon(iconName: string, isOn: boolean) {
    if (typeof customElements !== 'undefined' && customElements.get('ha-icon')) {
      return html`<ha-icon .icon=${iconName}></ha-icon>`;
    }
    return isOn
      ? html`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2Zm-3 18a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z"
            />
          </svg>
        `
      : html`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2Zm2 11.7-.5.35V16h-3v-1.95l-.5-.35a5 5 0 1 1 4 0ZM9 20a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z"
            />
          </svg>
        `;
  }

  private _renderSunIcon() {
    return html`
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-1-5h2v3h-2V2Zm0 17h2v3h-2v-3ZM2 11h3v2H2v-2Zm17 0h3v2h-3v-2ZM4.93 6.34l1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12Zm10.61 10.61 1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12ZM17.66 4.93l1.41 1.41-2.12 2.12-1.41-1.41 2.12-2.12ZM6.34 19.07l-1.41-1.41 2.12-2.12 1.41 1.41-2.12 2.12Z"
        />
      </svg>
    `;
  }

  /* =========================================================================
     RENDER
     ========================================================================= */
  protected render() {
    if (!this._config) return nothing;
    const entity = this._entity;
    const name = this._config.name || entity?.attributes.friendly_name || this._config.entity;
    const icon = this._config.icon || entity?.attributes.icon || 'mdi:lightbulb';
    const isOn = this._isOn;
    const pct = this._brightnessPct;
    const subtitle = this._isUnavailable
      ? 'Unavailable'
      : isOn
        ? this._supportsBrightness
          ? `On • ${pct}%`
          : 'On'
        : 'Off';

    const colorVars = this._computeColorVars();
    const matchedPreset = this._matchedPresetId;

    return html`
      <ha-card
        class="tile-card ${isOn ? 'is-on' : 'is-off'} ${this._dragging ? 'is-dragging' : ''} ${this._pressed ? 'is-pressed' : ''} ${this._isUnavailable ? 'is-unavailable' : ''}"
        style="${colorVars} --fill-pct: ${isOn ? pct : 0}%;"
        role="slider"
        tabindex="0"
        aria-label=${name}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${pct}
        aria-valuetext=${subtitle}
        @pointerdown=${this._onTilePointerDown}
        @pointermove=${this._onTilePointerMove}
        @pointerup=${this._onTilePointerUp}
        @pointercancel=${this._onTilePointerCancel}
        @contextmenu=${this._onTileContextMenu}
        @keydown=${this._onKeyDown}
      >
        <div class="tile-track" aria-hidden="true">
          <div class="tile-fill"></div>
        </div>
        <div class="state-layer" aria-hidden="true"></div>

        <div class="tile-content">
          <span class="bulb-icon">${this._renderBulbIcon(icon, isOn)}</span>
          <div class="meta">
            <span class="title">${name}</span>
            <span class="subtitle">${subtitle}</span>
          </div>
        </div>
      </ha-card>

      <dialog
        class="light-dialog"
        style="${colorVars}"
        @click=${this._onDialogBackdropClick}
        @cancel=${this._onDialogCancel}
      >
        ${this._popupOpen
          ? html`
              <div class="dialog-surface ${isOn ? 'is-on' : 'is-off'}">
                <header class="dialog-header">
                  <button
                    type="button"
                    class="icon-btn"
                    @click=${() => this.closePopup()}
                    aria-label="Close"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"
                      />
                    </svg>
                  </button>
                  <span class="dialog-title">${name}</span>
                  <button
                    type="button"
                    class="power-btn ${isOn ? 'is-on' : ''}"
                    @click=${this._toggleLight}
                    aria-label="${isOn ? 'Turn off' : 'Turn on'} ${name}"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M13 3h-2v10h2V3Zm4.83 2.17-1.42 1.42A6.92 6.92 0 0 1 19 12a7 7 0 1 1-11.41-5.41L6.17 5.17A8.93 8.93 0 0 0 3 12a9 9 0 0 0 18 0c0-2.74-1.23-5.18-3.17-6.83Z"
                      />
                    </svg>
                  </button>
                </header>

                <div class="capsule-stage">
                  <div
                    class="capsule-wrapper ${isOn ? 'is-on' : 'is-off'} ${this._popupDragging ? 'is-dragging' : ''}"
                    style="--fill-pct: ${isOn ? pct : 0}%;"
                  >
                    <!-- Floating percentage tooltip on the left during drag -->
                    <div
                      class="drag-tooltip ${this._popupDragging ? 'visible' : ''}"
                      aria-hidden="true"
                    >
                      ${pct}%
                    </div>

                    <!-- Vertical clipped-fill capsule slider -->
                    <div
                      class="capsule-slider"
                      role="slider"
                      tabindex="0"
                      aria-label="${name} brightness"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-valuenow=${pct}
                      aria-valuetext=${isOn ? `${pct}%` : 'Off'}
                      @pointerdown=${this._onCapsulePointerDown}
                      @pointermove=${this._onCapsulePointerMove}
                      @pointerup=${this._onCapsulePointerUp}
                      @pointercancel=${this._onCapsulePointerUp}
                      @keydown=${this._onKeyDown}
                    >
                      <div class="capsule-fill"></div>

                      <!-- Base sun icon (light/muted on empty track) -->
                      <div class="sun-layer sun-base" aria-hidden="true">
                        ${this._renderSunIcon()}
                      </div>

                      <!-- Clipped sun icon (dark contrast on active fill, exact horizontal split) -->
                      ${isOn
                        ? html`
                            <div class="sun-layer sun-filled" aria-hidden="true">
                              ${this._renderSunIcon()}
                            </div>
                          `
                        : nothing}
                    </div>
                  </div>

                  <div class="readout">
                    <span class="readout-value">${isOn ? `${pct}%` : 'Off'}</span>
                    <span class="readout-label ${isOn ? '' : 'hidden'}">Brightness</span>
                  </div>
                </div>

                ${this._presets.length > 0
                  ? html`
                      <div class="swatch-bar" role="radiogroup" aria-label="Light color presets">
                        <button
                          type="button"
                          class="palette-btn"
                          title="Use Material You theme color"
                          @click=${() => {
                            this._selectedPresetId = null;
                            this._toggleLight();
                          }}
                          aria-label="Color presets"
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              fill="currentColor"
                              d="M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8Zm-5.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
                            />
                          </svg>
                        </button>

                        ${this._presets.map(
                          (preset) => html`
                            <button
                              type="button"
                              class="color-swatch ${isOn && matchedPreset === preset.id ? 'selected' : ''}"
                              style="background: ${preset.hex};"
                              role="radio"
                              aria-checked=${String(isOn && matchedPreset === preset.id)}
                              aria-label=${preset.label}
                              title=${preset.label}
                              @click=${() => this._selectPreset(preset)}
                            ></button>
                          `,
                        )}
                      </div>
                    `
                  : nothing}
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
        /* MediumBouncy, Low stiffness spring for M3 Expressive On <-> Off morphing */
        --m3e-spring-bouncy: 560ms linear(
          0, 0.168 7%, 0.618 18%, 0.962 31%, 1.072 43%,
          1.038 56%, 0.992 71%, 1.005 86%, 1
        );
      }

      /* =====================================================================
         1. COMPACT GOOGLE HOME HORIZONTAL TILE (Clipped Flat-Edge Slider)
         ===================================================================== */
      .tile-card {
        height: 100%;
        min-height: 56px;
        cursor: pointer;
        user-select: none;
        touch-action: pan-y;
        outline: none;
        transition:
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-default),
          border-color var(--m3e-spring-effects-default),
          box-shadow var(--m3e-spring-effects-default);
      }

      .tile-card.is-on {
        background: color-mix(
          in srgb,
          var(--m3e-light-accent) 14%,
          var(--ha-card-background, var(--md-sys-color-surface-container-low, #1f1f24))
        );
      }

      .tile-card.is-pressed:not(.is-dragging) {
        transform: scale(0.985);
      }

      .tile-card:focus-visible {
        outline: 2px solid var(--md-sys-color-primary, #4c5c92);
        outline-offset: 2px;
      }

      .tile-card.is-unavailable {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .tile-track {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      /* Clean flat vertical dividing edge clipped by ha-card border-radius (no handle, no dot) */
      .tile-fill {
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        width: var(--fill-pct, 0%);
        background: color-mix(
          in srgb,
          var(--m3e-light-accent) 30%,
          var(--ha-card-background, var(--md-sys-color-surface-container-low, #1f1f24))
        );
        transition:
          width var(--m3e-spring-spatial-default),
          background-color var(--m3e-spring-effects-default);
      }

      .tile-card.is-dragging .tile-fill {
        transition: background-color var(--m3e-spring-effects-default);
      }

      .state-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: currentColor;
        opacity: 0;
        transition: opacity var(--m3e-spring-effects-fast);
      }

      .tile-card:hover .state-layer {
        opacity: 0.05;
      }

      .tile-card.is-pressed .state-layer {
        opacity: 0.09;
      }

      .tile-content {
        position: relative;
        z-index: 1;
        height: 100%;
        min-height: 56px;
        padding: 10px 16px;
        display: flex;
        align-items: center;
        gap: 14px;
        pointer-events: none;
      }

      /* Bare lightbulb icon — no container box */
      .bulb-icon {
        flex: 0 0 auto;
        width: 28px;
        height: 28px;
        display: grid;
        place-items: center;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        transition:
          color var(--m3e-spring-effects-default),
          transform var(--m3e-spring-spatial-fast);
      }

      .tile-card.is-on .bulb-icon {
        color: color-mix(
          in srgb,
          var(--m3e-light-accent) 65%,
          var(--md-sys-color-on-surface, #ffffff)
        );
      }

      .bulb-icon ha-icon,
      .bulb-icon svg {
        width: 26px;
        height: 26px;
        --mdc-icon-size: 26px;
      }

      .meta {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .title {
        font-size: var(--md-sys-typescale-title-medium-size, 15px);
        font-weight: var(--md-sys-typescale-title-medium-weight, 600);
        line-height: 20px;
        letter-spacing: 0.1px;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color var(--m3e-spring-effects-default);
      }

      .subtitle {
        font-size: var(--md-sys-typescale-body-medium-size, 13px);
        font-weight: 500;
        line-height: 18px;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        transition: color var(--m3e-spring-effects-default);
      }

      .tile-card.is-on .title,
      .tile-card.is-on .subtitle {
        color: color-mix(
          in srgb,
          var(--m3e-light-accent) 55%,
          var(--md-sys-color-on-surface, #ffffff)
        );
      }

      /* =====================================================================
         2. FULL LIGHT CONTROL POPUP DIALOG (Google Home Vertical Capsule)
         ===================================================================== */
      dialog.light-dialog {
        margin: auto;
        padding: 0;
        border: 0;
        background: transparent;
        max-width: min(440px, calc(100vw - 24px));
        max-height: calc(100dvh - 24px);
        width: 100%;
        overflow: visible;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      dialog.light-dialog::backdrop {
        background: color-mix(in srgb, var(--md-sys-color-scrim, #000000) 56%, transparent);
      }

      .dialog-surface {
        background: var(--md-sys-color-surface, #131316);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        border-radius: 32px;
        max-height: calc(100dvh - 24px);
        overflow-y: auto;
        padding: 20px 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.36);
      }

      @media (max-width: 600px) {
        dialog.light-dialog {
          margin: auto 0 0 0;
          max-width: 100vw;
          max-height: 94dvh;
        }

        .dialog-surface {
          border-radius: 28px 28px 0 0;
          max-height: 94dvh;
          padding: 18px 16px calc(24px + env(safe-area-inset-bottom, 0px));
        }
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

      .icon-btn,
      .power-btn {
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
        transition:
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default);
      }

      .icon-btn:hover {
        background: color-mix(in srgb, currentColor 8%, transparent);
      }

      .power-btn {
        background: var(--md-sys-color-surface-container-highest, #35343a);
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      .power-btn.is-on {
        background: var(--md-sys-color-primary-container, #344479);
        color: var(--md-sys-color-on-primary-container, #dbe1ff);
      }

      .icon-btn:active,
      .power-btn:active {
        transform: scale(0.92);
      }

      .icon-btn svg,
      .power-btn svg {
        width: 22px;
        height: 22px;
      }

      /* Vertical Capsule Stage */
      .capsule-stage {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        padding-block: 4px;
      }

      .capsule-wrapper {
        position: relative;
        width: clamp(148px, 42vw, 176px);
        height: clamp(250px, 42dvh, 348px);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* Floating white/inverse pill tooltip tracking the fill edge on the left */
      .drag-tooltip {
        position: absolute;
        right: calc(100% + 14px);
        bottom: clamp(8px, calc(var(--fill-pct, 0%) - 19px), calc(100% - 44px));
        padding: 9px 16px;
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-inverse-surface, #f2f0f4);
        color: var(--md-sys-color-inverse-on-surface, #1b1b1f);
        font-size: 14px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        line-height: 1;
        pointer-events: none;
        opacity: 0;
        transform: scale(0.75) translateX(6px);
        transition:
          opacity var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
      }

      .drag-tooltip.visible {
        opacity: 1;
        transform: scale(1) translateX(0);
      }

      /* Vertical Clipped-Fill Capsule with M3 Expressive On <-> Off Shape Morph */
      .capsule-slider {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        cursor: ns-resize;
        user-select: none;
        touch-action: none;
        outline: none;

        /* ON state: full capsule pill (raggio = 50% della larghezza) */
        border-radius: 88px;
        transform: scale(1);
        background: color-mix(
          in srgb,
          var(--m3e-light-accent) 22%,
          var(--md-sys-color-surface-container-highest, #303036)
        );

        transition:
          border-radius var(--m3e-spring-bouncy),
          transform var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-default);
      }

      /* OFF state: morphs to RoundedCornerShape(28dp) + slight scale reduction + neutral gray */
      .capsule-wrapper.is-off .capsule-slider {
        border-radius: 28px;
        transform: scale(0.94, 0.96);
        background: var(--md-sys-color-surface-container-highest, #303036);
        cursor: pointer;
      }

      .capsule-slider:focus-visible {
        outline: 2px solid var(--md-sys-color-primary, #4c5c92);
        outline-offset: 4px;
      }

      .capsule-fill {
        position: absolute;
        inset-inline: 0;
        bottom: 0;
        height: var(--fill-pct, 0%);
        background: var(--m3e-light-accent);
        opacity: 1;
        transition:
          height var(--m3e-spring-spatial-default),
          opacity var(--m3e-spring-effects-fast),
          background-color var(--m3e-spring-effects-default);
      }

      .capsule-wrapper.is-off .capsule-fill {
        opacity: 0;
      }

      .capsule-wrapper.is-dragging .capsule-fill,
      .capsule-wrapper.is-dragging .sun-filled {
        transition: background-color var(--m3e-spring-effects-default);
      }

      /* Anchored sun icon at bottom center with pixel-accurate dual contrast clipping */
      .sun-layer {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding-bottom: 24px;
        pointer-events: none;
      }

      .sun-layer svg {
        width: 28px;
        height: 28px;
      }

      .sun-base {
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        opacity: 0.85;
      }

      .sun-filled {
        color: var(--m3e-light-on-accent, #3d2f00);
        clip-path: inset(calc(100% - var(--fill-pct, 0%)) 0 0 0);
        transition: clip-path var(--m3e-spring-spatial-default);
      }

      /* Readout below capsule */
      .readout {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        min-height: 48px;
      }

      .readout-value {
        font-size: 24px;
        font-weight: 500;
        line-height: 30px;
        font-variant-numeric: tabular-nums;
      }

      .readout-label {
        font-size: 13px;
        font-weight: 500;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        transition: opacity var(--m3e-spring-effects-fast);
      }

      .readout-label.hidden {
        opacity: 0;
      }

      /* =====================================================================
         3. MORPHING COLOR SWATCH STRIP (Circle -> Squircle on Selection)
         ===================================================================== */
      .swatch-bar {
        display: flex;
        align-items: center;
        gap: 12px;
        overflow-x: auto;
        padding: 4px 2px;
        scrollbar-width: none;
      }

      .swatch-bar::-webkit-scrollbar {
        display: none;
      }

      .palette-btn,
      .color-swatch {
        flex: 0 0 52px;
        width: 52px;
        height: 52px;
        border: 0;
        padding: 0;
        cursor: pointer;
        border-radius: 50%;
        transition:
          border-radius var(--m3e-spring-bouncy),
          transform var(--m3e-spring-spatial-fast);
      }

      .palette-btn {
        display: grid;
        place-items: center;
        background: var(--md-sys-color-surface-container-highest, #303036);
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      .palette-btn svg {
        width: 24px;
        height: 24px;
      }

      /* Selected swatch morphs from CircleShape -> RoundedCornerShape(16dp) squircle, no border */
      .color-swatch.selected {
        border-radius: 16px;
        transform: scale(1.04);
      }

      .color-swatch:active,
      .palette-btn:active {
        transform: scale(0.92);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-light-card': M3ELightCard;
  }
}
