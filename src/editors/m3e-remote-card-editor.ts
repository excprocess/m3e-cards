import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type {
  HomeAssistant,
  M3ERemoteCardConfig,
  M3ERemoteCustomControl,
} from '../types/home-assistant';
import './m3e-remote-custom-controls-editor';

@customElement('m3e-remote-card-editor')
export class M3ERemoteCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3ERemoteCardConfig;

  public setConfig(config: M3ERemoteCardConfig): void {
    this._config = {
      pad_mode: 'touchpad',
      show_touchpad: true,
      show_volume: true,
      show_essentials: true,
      show_transport: true,
      show_channels: false,
      show_source: true,
      show_power: true,
      ...config,
    };
  }

  private _emitConfig(next: M3ERemoteCardConfig): void {
    this._config = next;
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        bubbles: true,
        composed: true,
        detail: { config: next },
      }),
    );
  }

  private _onValueChanged = (e: CustomEvent<{ value: Partial<M3ERemoteCardConfig> }>): void => {
    if (!this._config) return;
    const next: M3ERemoteCardConfig = { ...this._config, ...e.detail.value };
    this._emitConfig(next);
  };

  private _onCustomControlsChanged = (
    e: CustomEvent<{ controls: M3ERemoteCustomControl[] }>,
  ): void => {
    if (!this._config) return;
    const next: M3ERemoteCardConfig = {
      ...this._config,
      remote_custom_controls: e.detail.controls,
    };
    this._emitConfig(next);
  };

  private _computeLabel = (schema: { name: string }): string => {
    const labels: Record<string, string> = {
      entity: 'Entità TV / Media Player / Remote',
      status_entity: 'Entità stato dispositivo (opzionale)',
      name: 'Nome',
      icon: 'Icona personalizzata',
      use_entity_icon: 'Usa icona nativa entità',
      pad_mode: 'Modalità Pad direzionale',
      show_touchpad: 'Mostra Touchpad / D-Pad',
      show_volume: 'Mostra bilanciere Volume + Mute',
      show_essentials: 'Mostra 3 tasti essenziali (Back · Home · Assist)',
      show_transport: 'Mostra controlli riproduzione (Play / Pause)',
      show_channels: 'Mostra selettore Canali (CH −/+)',
      show_source: 'Mostra pulsante Sorgenti (Source)',
      show_power: 'Mostra pulsante Accensione (Power)',
      remote_device: 'Device ID trasmettitore (multi-dispositivo)',
      dpad_up: 'Pad Su',
      dpad_down: 'Pad Giù',
      dpad_left: 'Pad Sinistra',
      dpad_right: 'Pad Destra',
      dpad_center: 'Pad Selezione / OK',
      back: 'Indietro (Back)',
      home: 'Home',
      assist: 'Assistente / Ricerca',
      volume_up: 'Volume +',
      volume_down: 'Volume −',
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

  protected render() {
    if (!this.hass || !this._config) return nothing;

    const topSchema = [
      {
        name: 'entity',
        required: true,
        selector: { entity: { domain: ['media_player', 'remote'] } },
      },
      {
        name: 'pad_mode',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'touchpad', label: 'Touchpad gestuale (stile Google Home)' },
              { value: 'dpad', label: 'D-Pad a 4 frecce + OK (ideale per mouse)' },
            ],
          },
        },
      },
      {
        type: 'expandable',
        name: '',
        flatten: true,
        title: 'Contenuto e Aspetto',
        schema: [
          { name: 'name', selector: { text: {} } },
          {
            type: 'grid',
            name: '',
            schema: [
              { name: 'icon', selector: { icon: {} } },
              { name: 'use_entity_icon', selector: { boolean: {} } },
            ],
          },
          { name: 'status_entity', selector: { entity: {} } },
        ],
      },
      {
        type: 'expandable',
        name: '',
        flatten: true,
        title: 'Sezioni Telecomando',
        schema: [
          {
            type: 'grid',
            name: '',
            schema: [
              { name: 'show_touchpad', selector: { boolean: {} } },
              { name: 'show_volume', selector: { boolean: {} } },
              { name: 'show_essentials', selector: { boolean: {} } },
              { name: 'show_transport', selector: { boolean: {} } },
              { name: 'show_channels', selector: { boolean: {} } },
              { name: 'show_source', selector: { boolean: {} } },
              { name: 'show_power', selector: { boolean: {} } },
            ],
          },
        ],
      },
      {
        type: 'expandable',
        name: '',
        flatten: true,
        title: 'Override Comandi Remote (opzionale)',
        schema: [
          { name: 'remote_device', selector: { text: {} } },
          {
            type: 'expandable',
            title: 'Mappatura manuale tasti',
            name: 'remote_buttons',
            schema: [
              { name: 'dpad_up', selector: { text: {} } },
              { name: 'dpad_down', selector: { text: {} } },
              { name: 'dpad_left', selector: { text: {} } },
              { name: 'dpad_right', selector: { text: {} } },
              { name: 'dpad_center', selector: { text: {} } },
              { name: 'back', selector: { text: {} } },
              { name: 'home', selector: { text: {} } },
              { name: 'assist', selector: { text: {} } },
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
      },
    ];

    return html`
      <div class="editor-stack">
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${topSchema}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._onValueChanged}
        ></ha-form>

        <ha-expansion-panel outlined>
          <span slot="header" class="panel-header">
            Pulsanti e Pillole Personalizzate (${this._config.remote_custom_controls?.length ?? 0})
          </span>
          <div class="panel-content">
            <m3e-remote-custom-controls-editor
              .hass=${this.hass}
              .controls=${this._config.remote_custom_controls ?? []}
              @controls-changed=${this._onCustomControlsChanged}
            ></m3e-remote-custom-controls-editor>
          </div>
        </ha-expansion-panel>
      </div>
    `;
  }

  static styles = css`
    .editor-stack {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .panel-header {
      font-weight: 500;
      font-size: 14px;
    }

    .panel-content {
      padding: 8px 0 4px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-remote-card-editor': M3ERemoteCardEditor;
  }
}
