import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
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
import {
  expandEditDialogPreviewPane,
  openOfficialHACardDialog,
} from '../utils/ha-native-card-dialog';

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
  @state() private _modalMode: 'none' | 'pick' | 'edit' = 'none';
  @state() private _editingCardIdx: number | null = null;

  @query('dialog.nested-ha-dialog') private _modalEl?: HTMLDialogElement;

  private readonly _bridgeHandle: M3EPopupEditorHandle = {
    getConfig: () => this._config,
    updateCards: (cards) => {
      if (!this._config) return;
      this._emitConfig({ ...this._config, cards });
    },
    openAddCard: () => {
      void this._handleAddCard();
    },
    openEditCard: (index) => {
      void this._handleEditCard(index);
    },
  };

  private async _handleAddCard(): Promise<void> {
    if (this.hass && this._config) {
      const opened = await openOfficialHACardDialog({
        hass: this.hass,
        popupConfig: this._config,
        mode: 'add',
        onCardsUpdated: (cards) => {
          if (this._config) this._emitConfig({ ...this._config, cards });
        },
      });
      if (opened) return;
    }
    await this._openModal('pick');
  }

  private async _handleEditCard(index: number): Promise<void> {
    if (this.hass && this._config) {
      const opened = await openOfficialHACardDialog({
        hass: this.hass,
        popupConfig: this._config,
        mode: 'edit',
        index,
        onCardsUpdated: (cards) => {
          if (this._config) this._emitConfig({ ...this._config, cards });
        },
      });
      if (opened) return;
    }
    await this._openModal('edit', index);
  }

  private async _openModal(mode: 'pick' | 'edit', index?: number): Promise<void> {
    await ensureStackEditorElementsLoaded();
    this._modalMode = mode;
    this._editingCardIdx = mode === 'edit' ? (index ?? null) : null;
    await this.updateComplete;
    if (this._modalEl && !this._modalEl.open) {
      this._modalEl.showModal();
    }
  }

  private _closeModal(): void {
    if (this._modalEl?.open) {
      this._modalEl.close();
    }
    this._modalMode = 'none';
    this._editingCardIdx = null;
  }

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

  private _onCardPicked = (e: CustomEvent<{ config?: LovelaceCardConfig }>): void => {
    e.stopPropagation();
    const picked = e.detail?.config;
    if (!this._config || !picked) return;
    const cards = [...(this._config.cards ?? []), picked];
    this._emitConfig({ ...this._config, cards });
    this._editingCardIdx = cards.length - 1;
    this._modalMode = 'edit';
  };

  private _onChildCardChanged = (e: CustomEvent<{ config?: LovelaceCardConfig }>): void => {
    e.stopPropagation();
    if (!this._config || this._editingCardIdx === null || !e.detail?.config) return;
    const cards = [...(this._config.cards ?? [])];
    cards[this._editingCardIdx] = e.detail.config;
    this._emitConfig({ ...this._config, cards });
  };

  private _updateChildGridOption(key: 'columns' | 'rows', value: number | 'auto'): void {
    if (!this._config || this._editingCardIdx === null) return;
    const cards = [...(this._config.cards ?? [])];
    const current = cards[this._editingCardIdx];
    if (!current) return;
    const nextGrid: Record<string, unknown> = {
      ...((current.grid_options as Record<string, unknown>) ?? {}),
    };
    if (value === 'auto') {
      delete nextGrid[key];
    } else {
      nextGrid[key] = value;
    }
    const updated: LovelaceCardConfig = { ...current };
    if (Object.keys(nextGrid).length > 0) {
      updated.grid_options = nextGrid;
    } else {
      delete updated.grid_options;
    }
    cards[this._editingCardIdx] = updated;
    this._emitConfig({ ...this._config, cards });
  }

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

    const editingCfg =
      this._modalMode === 'edit' && this._editingCardIdx !== null
        ? this._config.cards?.[this._editingCardIdx]
        : undefined;

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

      <!-- Full-size native-style modal dialog for Add Card / Edit Card (keeps Pop-up editor intact!) -->
      <dialog
        class="nested-ha-dialog"
        @click=${(e: MouseEvent) => {
          if (e.target === this._modalEl) this._closeModal();
        }}
        @cancel=${(e: Event) => {
          e.preventDefault();
          this._closeModal();
        }}
      >
        <div class="nested-surface">
          <div class="nested-header">
            <button
              type="button"
              class="nested-close"
              aria-label="Chiudi"
              @click=${() => this._closeModal()}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"
                />
              </svg>
            </button>
            <span class="nested-title">
              ${this._modalMode === 'pick'
                ? 'Aggiungi card al Pop-up'
                : `Modifica card${editingCfg?.type ? ` · ${editingCfg.type}` : ''}`}
            </span>
            <button type="button" class="nested-done" @click=${() => this._closeModal()}>
              Fatto
            </button>
          </div>

          <div class="nested-body">
            ${this._modalMode === 'pick'
              ? html`
                  <hui-card-picker
                    .hass=${this.hass}
                    .lovelace=${this.lovelace}
                    @config-changed=${this._onCardPicked}
                  ></hui-card-picker>
                `
              : editingCfg
                ? html`
                    <div class="size-bar">
                      <div class="size-group">
                        <span class="size-label">Larghezza</span>
                        <div class="size-pills">
                          ${(
                            [
                              { label: 'Auto', val: 'auto' },
                              { label: '1/3', val: 4 },
                              { label: 'Metà', val: 6 },
                              { label: '2/3', val: 8 },
                              { label: 'Intera', val: 12 },
                            ] as const
                          ).map((opt) => {
                            const cur =
                              (editingCfg.grid_options as { columns?: number } | undefined)
                                ?.columns ?? 'auto';
                            const active = cur === opt.val;
                            return html`
                              <button
                                type="button"
                                class="size-pill ${active ? 'is-active' : ''}"
                                @click=${() => this._updateChildGridOption('columns', opt.val)}
                              >
                                ${opt.label}
                              </button>
                            `;
                          })}
                        </div>
                      </div>

                      <div class="size-group">
                        <span class="size-label">Altezza</span>
                        <div class="size-pills">
                          ${(
                            [
                              { label: 'Auto', val: 'auto' },
                              { label: '1', val: 1 },
                              { label: '2', val: 2 },
                              { label: '3', val: 3 },
                              { label: '4', val: 4 },
                            ] as const
                          ).map((opt) => {
                            const cur =
                              (editingCfg.grid_options as { rows?: number } | undefined)?.rows ??
                              'auto';
                            const active = cur === opt.val;
                            return html`
                              <button
                                type="button"
                                class="size-pill ${active ? 'is-active' : ''}"
                                @click=${() => this._updateChildGridOption('rows', opt.val)}
                              >
                                ${opt.label}
                              </button>
                            `;
                          })}
                        </div>
                      </div>
                    </div>

                    <hui-card-element-editor
                      .hass=${this.hass}
                      .lovelace=${this.lovelace}
                      .value=${editingCfg}
                      @config-changed=${this._onChildCardChanged}
                    ></hui-card-element-editor>
                  `
                : nothing}
          </div>
        </div>
      </dialog>
    `;
  }

  static styles = css`
    .editor-stack {
      display: flex;
      flex-direction: column;
      gap: 14px;
      min-height: min(480px, 58dvh);
    }

    .size-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      padding: 12px 14px;
      margin-bottom: 16px;
      border-radius: 18px;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.05));
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.1));
    }

    .size-group {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .size-label {
      font-size: 12.5px;
      font-weight: 600;
      color: var(--secondary-text-color, #9aa0a6);
    }

    .size-pills {
      display: inline-flex;
      gap: 4px;
      padding: 3px;
      border-radius: 9999px;
      background: var(--card-background-color, rgba(0, 0, 0, 0.22));
    }

    .size-pill {
      height: 30px;
      padding: 0 11px;
      border: 0;
      border-radius: 9999px;
      background: transparent;
      color: var(--primary-text-color, #e3e2e6);
      font: inherit;
      font-size: 12.5px;
      font-weight: 500;
      cursor: pointer;
    }

    .size-pill.is-active {
      background: var(--md-sys-color-primary-container, var(--primary-color, #364067));
      color: var(--md-sys-color-on-primary-container, #ffffff);
      font-weight: 600;
    }

    dialog.nested-ha-dialog {
      margin: auto;
      padding: 0;
      border: 0;
      background: transparent;
      width: min(900px, calc(100vw - 32px));
      max-width: min(900px, calc(100vw - 32px));
      max-height: calc(100dvh - 32px);
      overflow: hidden;
      border-radius: 28px;
      color: var(--primary-text-color, var(--md-sys-color-on-surface, #e3e2e6));
    }

    dialog.nested-ha-dialog::backdrop {
      background: rgba(0, 0, 0, 0.62);
    }

    .nested-surface {
      background: var(--ha-dialog-surface-background, var(--md-sys-color-surface, #1c1d22));
      color: inherit;
      border-radius: 28px;
      display: flex;
      flex-direction: column;
      max-height: calc(100dvh - 32px);
      overflow: hidden;
    }

    .nested-header {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
    }

    .nested-close {
      width: 40px;
      height: 40px;
      border: 0;
      border-radius: 50%;
      background: transparent;
      color: inherit;
      display: grid;
      place-items: center;
      cursor: pointer;
    }

    .nested-close:hover {
      background: color-mix(in srgb, currentColor 10%, transparent);
    }

    .nested-close svg {
      width: 22px;
      height: 22px;
    }

    .nested-title {
      flex: 1 1 auto;
      font-size: 18px;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .nested-done {
      height: 38px;
      padding: 0 18px;
      border: 0;
      border-radius: 9999px;
      background: var(--md-sys-color-primary-container, var(--primary-color, #364067));
      color: var(--md-sys-color-on-primary-container, #ffffff);
      font: inherit;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }

    .nested-body {
      flex: 1 1 auto;
      overflow-y: auto;
      padding: 18px 20px 24px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-popup-card-editor': M3EPopupCardEditor;
  }
}
