import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type {
  HomeAssistant,
  LovelaceCardConfig,
  M3EPopupCardConfig,
} from '../types/home-assistant';
import {
  registerPopupEditor,
  unregisterPopupEditor,
  type M3EPopupEditorHandle,
} from '../utils/popup-editor-bridge';

async function ensureStackEditorElementsLoaded(): Promise<void> {
  if (
    customElements.get('hui-card-picker') &&
    customElements.get('hui-card-element-editor')
  ) {
    return;
  }
  try {
    const helpers = await (
      window as unknown as {
        loadCardHelpers?: () => Promise<{
          createCardElement: (cfg: Record<string, unknown>) => Promise<HTMLElement>;
        }>;
      }
    ).loadCardHelpers?.();
    if (helpers) {
      const dummy = await helpers.createCardElement({ type: 'vertical-stack', cards: [] });
      const ctor = dummy.constructor as {
        getConfigElement?: () => Promise<HTMLElement> | HTMLElement;
      };
      if (typeof ctor?.getConfigElement === 'function') {
        await ctor.getConfigElement();
      }
    }
  } catch {
    // ignore
  }
}

@customElement('m3e-popup-card-editor')
export class M3EPopupCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public lovelace?: unknown;
  @state() private _config?: M3EPopupCardConfig;
  @state() private _editingCardIdx: number | null = null;
  @state() private _pickingNewCard = false;

  private readonly _bridgeHandle: M3EPopupEditorHandle = {
    getConfig: () => this._config,
    updateCards: (cards) => {
      if (!this._config) return;
      this._emitConfig({ ...this._config, cards });
    },
    openAddCard: () => {
      void ensureStackEditorElementsLoaded().then(() => {
        this._editingCardIdx = null;
        this._pickingNewCard = true;
      });
    },
    openEditCard: (index) => {
      void ensureStackEditorElementsLoaded().then(() => {
        this._pickingNewCard = false;
        this._editingCardIdx = index;
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
    void ensureStackEditorElementsLoaded();
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

  private _onCardPicked = (e: CustomEvent<{ config?: LovelaceCardConfig }>): void => {
    e.stopPropagation();
    const picked = e.detail?.config;
    if (!this._config || !picked) return;
    const cards = [...(this._config.cards ?? []), picked];
    this._pickingNewCard = false;
    this._editingCardIdx = cards.length - 1;
    this._emitConfig({ ...this._config, cards });
  };

  private _onChildCardChanged = (e: CustomEvent<{ config?: LovelaceCardConfig }>): void => {
    e.stopPropagation();
    if (!this._config || this._editingCardIdx === null || !e.detail?.config) return;
    const cards = [...(this._config.cards ?? [])];
    cards[this._editingCardIdx] = e.detail.config;
    this._emitConfig({ ...this._config, cards });
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

    // Sub-view 1: Native HA Card Picker (opened by clicking "+ Add card" on the live preview)
    if (this._pickingNewCard) {
      return html`
        <div class="sub-editor">
          <div class="sub-header">
            <button
              type="button"
              class="back-btn"
              @click=${() => (this._pickingNewCard = false)}
            >
              ← Indietro
            </button>
            <span>Aggiungi card al Pop-up</span>
          </div>
          <hui-card-picker
            .hass=${this.hass}
            .lovelace=${this.lovelace}
            @config-changed=${this._onCardPicked}
          ></hui-card-picker>
        </div>
      `;
    }

    // Sub-view 2: Native HA Child Card Editor (opened by clicking the edit pencil on any preview card)
    if (this._editingCardIdx !== null) {
      const childCfg = this._config.cards?.[this._editingCardIdx];
      if (childCfg) {
        return html`
          <div class="sub-editor">
            <div class="sub-header">
              <button
                type="button"
                class="back-btn"
                @click=${() => (this._editingCardIdx = null)}
              >
                ← Indietro
              </button>
              <span>Modifica card (${childCfg.type})</span>
            </div>
            <hui-card-element-editor
              .hass=${this.hass}
              .lovelace=${this.lovelace}
              .value=${childCfg}
              @config-changed=${this._onChildCardChanged}
            ></hui-card-element-editor>
          </div>
        `;
      }
      this._editingCardIdx = null;
    }

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
    }

    .sub-editor {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .sub-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      font-size: 14.5px;
      font-weight: 600;
    }

    .back-btn {
      height: 34px;
      padding: 0 12px;
      border: 0;
      border-radius: 9999px;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.08));
      color: var(--primary-text-color, #e3e2e6);
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-popup-card-editor': M3EPopupCardEditor;
  }
}
