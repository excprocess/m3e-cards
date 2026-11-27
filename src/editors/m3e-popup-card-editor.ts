import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type {
  HomeAssistant,
  LovelaceCardConfig,
  M3EPopupCardConfig,
} from '../types/home-assistant';

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
      const ctor = dummy.constructor as { getConfigElement?: () => Promise<HTMLElement> | HTMLElement };
      if (typeof ctor?.getConfigElement === 'function') {
        await ctor.getConfigElement();
      }
    }
  } catch {
    // fallback silently
  }
}

@customElement('m3e-popup-card-editor')
export class M3EPopupCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public lovelace?: unknown;
  @state() private _config?: M3EPopupCardConfig;
  @state() private _editingCardIdx: number | null = null;
  @state() private _pickingNewCard = false;

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
    void ensureStackEditorElementsLoaded();
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

  private _moveCard(idx: number, delta: -1 | 1): void {
    if (!this._config) return;
    const cards = [...(this._config.cards ?? [])];
    const target = idx + delta;
    if (target < 0 || target >= cards.length) return;
    const [item] = cards.splice(idx, 1);
    cards.splice(target, 0, item);
    this._emitConfig({ ...this._config, cards });
  }

  private _removeCard(idx: number): void {
    if (!this._config) return;
    const cards = (this._config.cards ?? []).filter((_, i) => i !== idx);
    this._emitConfig({ ...this._config, cards });
  }

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

    // Sub-view 1: Native HA Card Picker
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

    // Sub-view 2: Native HA Child Card Editor
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

    const cards = this._config.cards ?? [];

    return html`
      <div class="editor-stack">
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${schema}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._onValueChanged}
        ></ha-form>

        <div class="cards-section">
          <div class="cards-section-title">Card nel Pop-up (${cards.length})</div>

          ${cards.length > 0
            ? html`
                <div class="cards-list">
                  ${cards.map((c, idx) => {
                    const label =
                      (typeof c.name === 'string' && c.name) ||
                      (typeof c.title === 'string' && c.title) ||
                      (typeof c.entity === 'string' && c.entity) ||
                      c.type;
                    return html`
                      <div class="card-row">
                        <button
                          type="button"
                          class="card-row-main"
                          @click=${async () => {
                            await ensureStackEditorElementsLoaded();
                            this._editingCardIdx = idx;
                          }}
                        >
                          <span class="card-row-name">${label}</span>
                          <span class="card-row-type">${c.type}</span>
                        </button>
                        <div class="card-row-actions">
                          <button
                            type="button"
                            class="mini-btn"
                            title="Sposta su"
                            ?disabled=${idx === 0}
                            @click=${() => this._moveCard(idx, -1)}
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            class="mini-btn"
                            title="Sposta giù"
                            ?disabled=${idx === cards.length - 1}
                            @click=${() => this._moveCard(idx, 1)}
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            class="mini-btn danger"
                            title="Rimuovi"
                            @click=${() => this._removeCard(idx)}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    `;
                  })}
                </div>
              `
            : html`
                <div class="cards-hint">
                  Consigliato: inserisci questa card come prima card di una <strong>Sezione</strong>
                  di Home Assistant (o di un Vertical Stack) per aggiungere, spostare e ridimensionare
                  le card nativamente dalla dashboard, oppure aggiungile direttamente qui sotto.
                </div>
              `}

          <button
            type="button"
            class="add-card-pill"
            @click=${async () => {
              await ensureStackEditorElementsLoaded();
              this._pickingNewCard = true;
            }}
          >
            <span class="add-plus">+</span>
            <span>Add card</span>
          </button>
        </div>
      </div>
    `;
  }

  static styles = css`
    .editor-stack {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .cards-section {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .cards-section-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color, #e3e2e6);
    }

    .cards-hint {
      font-size: 12.5px;
      line-height: 1.45;
      color: var(--secondary-text-color, #9aa0a6);
    }

    .cards-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .card-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-radius: 14px;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.04));
    }

    .card-row-main {
      flex: 1 1 auto;
      min-width: 0;
      border: 0;
      padding: 2px 4px;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 2px;
      cursor: pointer;
    }

    .card-row-name {
      font-size: 13.5px;
      font-weight: 500;
      color: var(--primary-text-color, #e3e2e6);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-row-type {
      font-size: 11.5px;
      color: var(--secondary-text-color, #9aa0a6);
    }

    .card-row-actions {
      display: flex;
      gap: 4px;
      flex-shrink: 0;
    }

    .mini-btn {
      width: 28px;
      height: 28px;
      border: 0;
      border-radius: 8px;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.08));
      color: var(--primary-text-color, #e3e2e6);
      font: inherit;
      font-size: 14px;
      cursor: pointer;
      display: grid;
      place-items: center;
    }

    .mini-btn:disabled {
      opacity: 0.35;
      cursor: default;
    }

    .mini-btn.danger {
      color: var(--error-color, #f2b8b5);
    }

    /* Native HA-inspired dashed pill "+ Add card" button */
    .add-card-pill {
      width: 100%;
      height: 52px;
      border-radius: 9999px;
      border: 2px dashed var(--divider-color, rgba(255, 255, 255, 0.28));
      background: color-mix(in srgb, var(--primary-color, #a8c7fa) 6%, transparent);
      color: var(--primary-text-color, #e3e2e6);
      font: inherit;
      font-size: 14.5px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      transition:
        border-color 180ms ease,
        background-color 180ms ease;
    }

    .add-card-pill:hover {
      border-color: var(--primary-color, #a8c7fa);
      background: color-mix(in srgb, var(--primary-color, #a8c7fa) 12%, transparent);
    }

    .add-plus {
      font-size: 20px;
      line-height: 1;
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
