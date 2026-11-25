import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, M3EStatusCardConfig, M3EStatusPopupType } from '../types/home-assistant';

@customElement('m3e-status-card-editor')
export class M3EStatusCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3EStatusCardConfig;

  public setConfig(config: M3EStatusCardConfig): void {
    this._config = { ...config };
  }

  private _resolvedType(): Exclude<M3EStatusPopupType, 'auto'> {
    const cfg = this._config?.popup_type ?? 'auto';
    if (cfg !== 'auto') return cfg;
    const id = this._config?.entity ?? '';
    if (id.startsWith('climate.')) return 'climate';
    if (id.startsWith('media_player.')) return 'media';
    if (id.startsWith('remote.')) {
      const deviceId = this.hass?.entities?.[id]?.device_id;
      if (deviceId && this.hass?.entities) {
        for (const [eid, entry] of Object.entries(this.hass.entities)) {
          if (entry.device_id === deviceId && eid.startsWith('media_player.')) {
            return 'media';
          }
        }
      }
      return 'remote';
    }
    return 'sensor';
  }

  private _buildSchema(): unknown[] {
    const type = this._resolvedType();
    const needsNav =
      this._config?.tap_action === 'navigate' || this._config?.hold_action === 'navigate';

    const schema: unknown[] = [
      { name: 'entity', required: true, selector: { entity: {} } },
      { name: 'name', selector: { text: {} } },
      {
        name: 'card_style',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'default', label: 'Google Home (Default 28px)' },
              { value: 'pill', label: 'Pillola piena (M3 Stadium)' },
              { value: 'expressive', label: 'M3 Expressive Morph (20px ↔ Pillola)' },
              { value: 'compact', label: 'Compatta (56px / 18px)' },
            ],
          },
        },
      },
      {
        name: 'popup_type',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'auto', label: 'Automatico (in base al dispositivo)' },
              { value: 'sensor', label: 'Sensore (Anello di stato + Storico)' },
              { value: 'climate', label: 'Clima / Termostato (Dial + Mode)' },
              { value: 'remote', label: 'Telecomando / TV (Rocker + Pulsanti)' },
              { value: 'media', label: 'Media / Speaker (Player + Volume)' },
              { value: 'none', label: 'Nessun popup' },
            ],
          },
        },
      },
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'icon_active', selector: { icon: {} } },
          { name: 'icon_inactive', selector: { icon: {} } },
        ],
      },
      {
        type: 'grid',
        name: '',
        schema: [
          {
            name: 'tap_action',
            selector: {
              select: {
                mode: 'dropdown',
                options: [
                  { value: 'popup', label: 'Apri popup M3E' },
                  { value: 'toggle', label: 'Toggle stato' },
                  { value: 'navigate', label: 'Percorso / Bubble / Browser Mod' },
                  { value: 'more-info', label: 'Schermata nativa HA' },
                  { value: 'none', label: 'Nessuna' },
                ],
              },
            },
          },
          {
            name: 'hold_action',
            selector: {
              select: {
                mode: 'dropdown',
                options: [
                  { value: 'popup', label: 'Apri popup M3E' },
                  { value: 'more-info', label: 'Schermata nativa HA' },
                  { value: 'navigate', label: 'Percorso / Bubble / Browser Mod' },
                  { value: 'none', label: 'Nessuna' },
                ],
              },
            },
          },
        ],
      },
    ];

    if (needsNav) {
      schema.push({ name: 'navigation_path', selector: { text: {} } });
    }

    if (type === 'sensor') {
      schema.push(
        { name: 'active_state', selector: { text: {} } },
        {
          type: 'grid',
          name: '',
          schema: [
            { name: 'label_active', selector: { text: {} } },
            { name: 'label_inactive', selector: { text: {} } },
          ],
        },
        { name: 'secondary_entity', selector: { entity: {} } },
      );
    } else if (type === 'climate') {
      schema.push({
        name: 'outdoor_entity',
        selector: { entity: { domain: 'sensor' } },
      });
    } else if (type === 'media') {
      schema.push({ name: 'status_entity', selector: { entity: {} } });
    } else if (type === 'remote') {
      schema.push(
        { name: 'status_entity', selector: { entity: {} } },
        { name: 'remote_device', selector: { text: {} } },
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
      );
    }

    return schema;
  }

  private _computeLabel = (schema: { name: string }): string => {
    const labels: Record<string, string> = {
      entity: 'Entità principale',
      status_entity: 'Entità stato dispositivo (opzionale)',
      name: 'Nome personalizzato',
      card_style: 'Design della pillola (Material 3)',
      icon_active: 'Icona attivo (vuoto = standard Google Home)',
      icon_inactive: 'Icona inattivo (vuoto = standard Google Home)',
      active_state: 'Stati attivi personalizzati (es. on,home,detected)',
      label_active: 'Testo stato attivo',
      label_inactive: 'Testo stato inattivo',
      popup_type: 'Tipo card / Schermata popup',
      tap_action: 'Azione al tocco (Tap)',
      hold_action: 'Azione pressione prolungata (Hold)',
      navigation_path: 'Percorso dashboard (/lovelace/...) · #hash Bubble Card · script/browser_mod',
      secondary_entity: 'Entità secondaria (auto-rilevata dal device se vuota)',
      outdoor_entity: 'Temperatura esterna',
      remote_device: 'Device ID trasmettitore (multi-dispositivo)',
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
  };

  private _onValueChanged = (e: CustomEvent<{ value: M3EStatusCardConfig }>): void => {
    const next = { ...this._config, ...e.detail.value };
    this._config = next;
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        bubbles: true,
        composed: true,
        detail: { config: next },
      }),
    );
  };

  protected render() {
    if (!this.hass || !this._config) return nothing;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._buildSchema()}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._onValueChanged}
      ></ha-form>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-status-card-editor': M3EStatusCardEditor;
  }
}
