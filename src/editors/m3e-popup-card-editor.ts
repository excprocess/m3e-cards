import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, M3EPopupCardConfig } from '../types/home-assistant';
import {
  registerPopupEditor,
  unregisterPopupEditor,
  type M3EPopupEditorHandle,
} from '../utils/popup-editor-bridge';
import {
  expandEditDialogPreviewPane,
  openOfficialHACardDialog,
} from '../utils/ha-native-card-dialog';

@customElement('m3e-popup-card-editor')
export class M3EPopupCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public lovelace?: unknown;
  @state() private _config?: M3EPopupCardConfig;

  private readonly _bridgeHandle: M3EPopupEditorHandle = {
    getConfig: () => this._config,
    updateCards: (cards) => {
      if (!this._config) return;
      this._emitConfig({ ...this._config, cards });
    },
    openAddCard: () => {
      if (!this.hass || !this._config) return;
      void openOfficialHACardDialog({
        hass: this.hass,
        popupConfig: this._config,
        mode: 'add',
        onCardsUpdated: (cards) => {
          if (this._config) this._emitConfig({ ...this._config, cards });
        },
      });
    },
    openEditCard: (index) => {
      if (!this.hass || !this._config) return;
      void openOfficialHACardDialog({
        hass: this.hass,
        popupConfig: this._config,
        mode: 'edit',
        index,
        onCardsUpdated: (cards) => {
          if (this._config) this._emitConfig({ ...this._config, cards });
        },
      });
    },
  };

  public setConfig(config: M3EPopupCardConfig): void {
    this._config = {
      show_header_button: true,
      show_state: true,
      ...config,
      hash: config.hash || '#popup',
    };
  }

  public connectedCallback(): void {
    super.connectedCallback();
    registerPopupEditor(this._bridgeHandle);
    requestAnimationFrame(() => expandEditDialogPreviewPane());
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    unregisterPopupEditor(this._bridgeHandle);
  }

  private _emitConfig(next: M3EPopupCardConfig): void {
    this._config = next;
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        bubbles: true,
        composed: true,
        detail: { config: next },
      }),
    );
  }

  private _onValueChanged = (e: CustomEvent<{ value: Partial<M3EPopupCardConfig> }>): void => {
    if (!this._config) return;
    this._emitConfig({ ...this._config, ...e.detail.value });
  };

  private _computeLabel = (schema: { name: string }): string => {
    const labels: Record<string, string> = {
      hash: 'Percorso / #hash del Pop-up',
      entity: 'Entità header (pulsante a destra e titolo automatico)',
      name: 'Titolo personalizzato (vuoto = nome entità)',
      icon: 'Icona personalizzata pulsante header',
      use_entity_icon: 'Usa icona nativa entità',
      show_header_button: 'Mostra pulsante azione a destra',
      show_state: 'Mostra stato sotto il titolo',
    };
    return labels[schema.name] ?? schema.name;
  };

  protected render() {
    if (!this.hass || !this._config) return nothing;

    const schema = [
      {
        name: 'hash',
        required: true,
        selector: { navigation: {} },
      },
      {
        name: 'entity',
        selector: { entity: {} },
      },
      {
        type: 'expandable',
        name: '',
        flatten: true,
        title: 'Header (Titolo e Pulsante)',
        schema: [
          {
            name: 'name',
            selector: { entity_name: {} },
            context: { entity: 'entity' },
          },
          {
            type: 'grid',
            name: '',
            schema: [
              { name: 'icon', selector: { icon: {} } },
              { name: 'use_entity_icon', selector: { boolean: {} } },
            ],
          },
          {
            type: 'grid',
            name: '',
            schema: [
              { name: 'show_header_button', selector: { boolean: {} } },
              { name: 'show_state', selector: { boolean: {} } },
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
          .schema=${schema}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._onValueChanged}
        ></ha-form>
      </div>
    `;
  }

  static styles = css`
    .editor-stack {
      display: flex;
      flex-direction: column;
      gap: 14px;
      min-height: min(480px, 58dvh);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-popup-card-editor': M3EPopupCardEditor;
  }
}
