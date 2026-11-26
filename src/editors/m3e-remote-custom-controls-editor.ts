import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type {
  HomeAssistant,
  M3ERemoteCustomControl,
  M3ERemoteCustomSegment,
} from '../types/home-assistant';

const ACTION_TYPE_OPTIONS = [
  { value: 'player', label: 'Azione Player / Remote' },
  { value: 'entity', label: 'Entità / Script / Switch' },
  { value: 'remote_command', label: 'Comando Remote custom' },
  { value: 'source', label: 'Sorgente / App (Source)' },
];

const PLAYER_ACTION_OPTIONS = [
  { value: 'mute', label: 'Mute' },
  { value: 'unmute', label: 'Unmute' },
  { value: 'power_on', label: 'Accendi (Power On)' },
  { value: 'power_off', label: 'Spegni (Power Off)' },
  { value: 'play', label: 'Play' },
  { value: 'pause', label: 'Pause' },
  { value: 'prev', label: 'Precedente' },
  { value: 'next', label: 'Successivo' },
  { value: 'volume_up', label: 'Volume +' },
  { value: 'volume_down', label: 'Volume −' },
  { value: 'ch_up', label: 'Canale +' },
  { value: 'ch_down', label: 'Canale −' },
  { value: 'back', label: 'Indietro (Back)' },
  { value: 'home', label: 'Home' },
  { value: 'assist', label: 'Assist / Ricerca' },
  { value: 'dpad_center', label: 'OK / Seleziona' },
];

const ENTITY_ACTION_OPTIONS = [
  { value: 'auto', label: 'Automatico (toggle / press / script)' },
  { value: 'toggle', label: 'Toggle' },
  { value: 'turn_on', label: 'Turn On' },
  { value: 'turn_off', label: 'Turn Off' },
  { value: 'select_option', label: 'Select Option (input_select)' },
];

function buildActionFieldsSchema(item: {
  action_type?: string;
}): unknown[] {
  const mode = item.action_type || 'entity';
  const fields: unknown[] = [
    {
      type: 'grid',
      name: '',
      schema: [
        { name: 'label', selector: { text: {} } },
        { name: 'icon', selector: { icon: {} } },
      ],
    },
    {
      name: 'action_type',
      selector: {
        select: { mode: 'dropdown', options: ACTION_TYPE_OPTIONS },
      },
    },
  ];

  if (mode === 'player') {
    fields.push({
      name: 'player_action',
      selector: {
        select: { mode: 'dropdown', options: PLAYER_ACTION_OPTIONS },
      },
    });
  } else if (mode === 'entity') {
    fields.push(
      { name: 'entity', selector: { entity: {} } },
      {
        type: 'grid',
        name: '',
        schema: [
          {
            name: 'entity_action',
            selector: {
              select: { mode: 'dropdown', options: ENTITY_ACTION_OPTIONS },
            },
          },
          { name: 'value', selector: { text: {} } },
        ],
      },
    );
  } else if (mode === 'remote_command') {
    fields.push({
      type: 'grid',
      name: '',
      schema: [
        { name: 'command', selector: { text: {} } },
        { name: 'device', selector: { text: {} } },
      ],
    });
  } else if (mode === 'source') {
    fields.push({ name: 'value', selector: { text: {} } });
  }

  return fields;
}

@customElement('m3e-remote-custom-controls-editor')
export class M3ERemoteCustomControlsEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public controls: M3ERemoteCustomControl[] = [];

  @state() private _expandedIdx: number | null = null;

  private _emit(next: M3ERemoteCustomControl[]): void {
    this.dispatchEvent(
      new CustomEvent('controls-changed', {
        bubbles: true,
        composed: true,
        detail: { controls: next },
      }),
    );
  }

  private _addButton(): void {
    const next: M3ERemoteCustomControl[] = [
      ...this.controls,
      {
        type: 'button',
        label: 'Nuovo pulsante',
        action_type: 'entity',
        entity_action: 'auto',
      },
    ];
    this._expandedIdx = next.length - 1;
    this._emit(next);
  }

  private _addSegmented(): void {
    const next: M3ERemoteCustomControl[] = [
      ...this.controls,
      {
        type: 'segmented',
        segments: [
          { label: 'Opzione 1', action_type: 'entity', entity_action: 'turn_on', active_state: 'on' },
          { label: 'Opzione 2', action_type: 'entity', entity_action: 'turn_off', active_state: 'off' },
        ],
      },
    ];
    this._expandedIdx = next.length - 1;
    this._emit(next);
  }

  private _removeControl(idx: number): void {
    const next = this.controls.filter((_, i) => i !== idx);
    if (this._expandedIdx === idx) this._expandedIdx = null;
    else if (this._expandedIdx !== null && this._expandedIdx > idx) this._expandedIdx--;
    this._emit(next);
  }

  private _moveControl(idx: number, delta: -1 | 1): void {
    const target = idx + delta;
    if (target < 0 || target >= this.controls.length) return;
    const next = [...this.controls];
    const [item] = next.splice(idx, 1);
    next.splice(target, 0, item);
    if (this._expandedIdx === idx) this._expandedIdx = target;
    this._emit(next);
  }

  private _updateControl(idx: number, patch: Partial<M3ERemoteCustomControl>): void {
    const next = this.controls.map((c, i) => (i === idx ? { ...c, ...patch } : c));
    this._emit(next);
  }

  private _updateSegment(
    ctrlIdx: number,
    segIdx: number,
    patch: Partial<M3ERemoteCustomSegment>,
  ): void {
    const ctrl = this.controls[ctrlIdx];
    const segs = [...(ctrl.segments ?? [])];
    segs[segIdx] = { ...segs[segIdx], ...patch };
    this._updateControl(ctrlIdx, { segments: segs });
  }

  private _addSegment(ctrlIdx: number): void {
    const ctrl = this.controls[ctrlIdx];
    const segs = [...(ctrl.segments ?? [])];
    if (segs.length >= 4) return;
    segs.push({
      label: `Opzione ${segs.length + 1}`,
      action_type: 'entity',
      entity_action: 'auto',
    });
    this._updateControl(ctrlIdx, { segments: segs });
  }

  private _removeSegment(ctrlIdx: number, segIdx: number): void {
    const ctrl = this.controls[ctrlIdx];
    const segs = (ctrl.segments ?? []).filter((_, i) => i !== segIdx);
    if (segs.length < 2) return;
    this._updateControl(ctrlIdx, { segments: segs });
  }

  private _computeLabel = (schema: { name: string }): string => {
    const labels: Record<string, string> = {
      label: 'Etichetta',
      icon: 'Icona (opzionale)',
      action_type: 'Tipo azione',
      player_action: 'Azione Player / Remote',
      entity: 'Entità / Script',
      entity_action: 'Servizio entità',
      value: 'Valore (Sorgente / Opzione)',
      command: 'Comando Remote (es. NETFLIX, KEY_HDMI)',
      device: 'Device ID (opzionale)',
      state_entity: 'Entità stato attivo (opzionale)',
      active_state: 'Stato attivo (es. on, off, Cinema)',
    };
    return labels[schema.name] ?? schema.name;
  };

  protected render() {
    if (!this.hass) return nothing;

    return html`
      <div class="custom-editor-root">
        <div class="toolbar">
          <button type="button" class="add-btn" @click=${() => this._addButton()}>
            + Pulsante
          </button>
          <button type="button" class="add-btn" @click=${() => this._addSegmented()}>
            + Pillola segmentata
          </button>
        </div>

        ${this.controls.length === 0
          ? html`
              <div class="empty-hint">
                Nessun controllo personalizzato. Aggiungi pulsanti nativi o pillole segmentate per
                azioni del player, script, entità o comandi remote.
              </div>
            `
          : this.controls.map((ctrl, idx) => {
              const isExpanded = this._expandedIdx === idx;
              const title =
                ctrl.type === 'segmented'
                  ? `Pillola: ${(ctrl.segments ?? []).map((s) => s.label || '…').join(' | ')}`
                  : `Pulsante: ${ctrl.label || ctrl.command || ctrl.player_action || 'Senza nome'}`;

              return html`
                <div class="ctrl-card">
                  <div class="ctrl-head" @click=${() => (this._expandedIdx = isExpanded ? null : idx)}>
                    <span class="ctrl-title">${title}</span>
                    <div class="ctrl-actions" @click=${(e: Event) => e.stopPropagation()}>
                      <button
                        type="button"
                        class="mini-btn"
                        title="Sposta su"
                        ?disabled=${idx === 0}
                        @click=${() => this._moveControl(idx, -1)}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        class="mini-btn"
                        title="Sposta giù"
                        ?disabled=${idx === this.controls.length - 1}
                        @click=${() => this._moveControl(idx, 1)}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        class="mini-btn danger"
                        title="Elimina"
                        @click=${() => this._removeControl(idx)}
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  ${isExpanded
                    ? ctrl.type === 'button'
                      ? html`
                          <div class="ctrl-body">
                            <ha-form
                              .hass=${this.hass}
                              .data=${ctrl}
                              .schema=${[
                                ...buildActionFieldsSchema(ctrl),
                                {
                                  type: 'grid',
                                  name: '',
                                  schema: [
                                    { name: 'state_entity', selector: { entity: {} } },
                                    { name: 'active_state', selector: { text: {} } },
                                  ],
                                },
                              ]}
                              .computeLabel=${this._computeLabel}
                              @value-changed=${(e: CustomEvent<{ value: Partial<M3ERemoteCustomControl> }>) => {
                                e.stopPropagation();
                                this._updateControl(idx, e.detail.value);
                              }}
                            ></ha-form>
                          </div>
                        `
                      : html`
                          <div class="ctrl-body">
                            <ha-form
                              .hass=${this.hass}
                              .data=${{ state_entity: ctrl.state_entity ?? '' }}
                              .schema=${[{ name: 'state_entity', selector: { entity: {} } }]}
                              .computeLabel=${this._computeLabel}
                              @value-changed=${(e: CustomEvent<{ value: { state_entity?: string } }>) => {
                                e.stopPropagation();
                                this._updateControl(idx, {
                                  state_entity: e.detail.value.state_entity || undefined,
                                });
                              }}
                            ></ha-form>

                            <div class="seg-list">
                              ${(ctrl.segments ?? []).map(
                                (seg, segIdx) => html`
                                  <div class="seg-card">
                                    <div class="seg-head">
                                      <span>Segmento ${segIdx + 1}</span>
                                      ${(ctrl.segments?.length ?? 0) > 2
                                        ? html`
                                            <button
                                              type="button"
                                              class="mini-btn danger"
                                              @click=${() => this._removeSegment(idx, segIdx)}
                                            >
                                              ×
                                            </button>
                                          `
                                        : nothing}
                                    </div>
                                    <ha-form
                                      .hass=${this.hass}
                                      .data=${seg}
                                      .schema=${[
                                        ...buildActionFieldsSchema(seg),
                                        { name: 'active_state', selector: { text: {} } },
                                      ]}
                                      .computeLabel=${this._computeLabel}
                                      @value-changed=${(
                                        e: CustomEvent<{ value: Partial<M3ERemoteCustomSegment> }>,
                                      ) => {
                                        e.stopPropagation();
                                        this._updateSegment(idx, segIdx, e.detail.value);
                                      }}
                                    ></ha-form>
                                  </div>
                                `,
                              )}
                            </div>

                            ${(ctrl.segments?.length ?? 0) < 4
                              ? html`
                                  <button
                                    type="button"
                                    class="add-btn seg-add"
                                    @click=${() => this._addSegment(idx)}
                                  >
                                    + Aggiungi segmento
                                  </button>
                                `
                              : nothing}
                          </div>
                        `
                    : nothing}
                </div>
              `;
            })}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .custom-editor-root {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .toolbar {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .add-btn {
      height: 36px;
      padding: 0 14px;
      border-radius: 999px;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.16));
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.06));
      color: var(--primary-text-color, #e3e2e6);
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
    }

    .add-btn:hover {
      border-color: var(--primary-color, #a8c7fa);
    }

    .empty-hint {
      font-size: 12.5px;
      color: var(--secondary-text-color, #9aa0a6);
      line-height: 1.4;
    }

    .ctrl-card {
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 14px;
      overflow: hidden;
      background: var(--card-background-color, transparent);
    }

    .ctrl-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 10px 12px;
      cursor: pointer;
      user-select: none;
    }

    .ctrl-title {
      font-size: 13.5px;
      font-weight: 500;
      color: var(--primary-text-color, #e3e2e6);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ctrl-actions {
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

    .ctrl-body {
      padding: 10px 12px 14px;
      border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.1));
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .seg-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .seg-card {
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.1));
      border-radius: 12px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .seg-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12.5px;
      font-weight: 600;
      color: var(--secondary-text-color, #9aa0a6);
    }

    .seg-add {
      align-self: flex-start;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-remote-custom-controls-editor': M3ERemoteCustomControlsEditor;
  }
}
