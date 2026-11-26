import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type {
  HomeAssistant,
  M3EStatusCardConfig,
  M3EStatusPopupType,
} from '../types/home-assistant';
import {
  ensureCardFeaturesEditorLoaded,
  type LovelaceCardFeatureConfig,
  type M3EFeaturesPosition,
  type SubElementEditorConfig,
} from '../utils/ha-card-features';

@customElement('m3e-status-card-editor')
export class M3EStatusCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public lovelace?: unknown;
  @state() private _config?: M3EStatusCardConfig;
  @state() private _featuresEditorReady = false;
  @state() private _subElementEditorConfig?: SubElementEditorConfig;

  public connectedCallback(): void {
    super.connectedCallback();
    void ensureCardFeaturesEditorLoaded().then((ok) => {
      if (ok) this._featuresEditorReady = true;
    });
  }

  public setConfig(config: M3EStatusCardConfig): void {
    this._config = { ...config };
  }

  private _resolvedType(): Exclude<M3EStatusPopupType, 'auto'> {
    const cfg = this._config?.popup_type ?? 'auto';
    if (cfg !== 'auto') return cfg;
    const id = this._config?.entity ?? '';
    if (id.startsWith('input_select.') || id.startsWith('select.')) return 'selector';
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

  private _buildEntitySchema(): unknown[] {
    return [{ name: 'entity', required: true, selector: { entity: {} } }];
  }

  private _buildContentSchema(): unknown[] {
    const type = this._resolvedType();
    const attrEntityId =
      this._config?.subtitle_entity?.trim() || this._config?.entity || '';

    const schema: unknown[] = [
      {
        name: 'name',
        selector: { entity_name: {} },
        context: { entity: 'entity' },
      },
      {
        name: 'card_style',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'default', label: 'Google Home (Default 28px)' },
              { value: 'morph', label: 'Google Home Morph (28px ↔ Pillola)' },
              { value: 'pill', label: 'Pillola piena (M3 Stadium)' },
              { value: 'expressive', label: 'M3 Expressive Morph (20px ↔ Pillola)' },
              { value: 'compact', label: 'Compatta (56px / 18px)' },
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
          { name: 'use_entity_icon', selector: { boolean: {} } },
          { name: 'show_entity_picture', selector: { boolean: {} } },
        ],
      },
      { name: 'hide_state', selector: { boolean: {} } },
    ];

    if (!this._config?.hide_state) {
      schema.push({
        name: 'state_content',
        selector: { ui_state_content: { allow_name: false } },
        context: { filter_entity: 'entity' },
      });
    }

    const attributeSelector = {
      name: 'subtitle_attribute',
      selector: {
        attribute: {
          entity_id: attrEntityId,
        },
      },
    };

    const visibilitySelector = {
      name: 'subtitle_visibility',
      selector: {
        select: {
          mode: 'dropdown',
          options: [
            { value: 'both', label: 'Sempre (sia On che Off)' },
            { value: 'on', label: 'Solo quando acceso / attivo (On)' },
            { value: 'off', label: 'Solo quando spento / inattivo (Off)' },
          ],
        },
      },
    };

    const formatSelector = {
      name: 'subtitle_format',
      selector: {
        select: {
          mode: 'dropdown',
          options: [
            { value: 'auto', label: 'Automatico (HH:MM per orari ISO)' },
            { value: 'relative', label: 'Relativo (es. Tra 5h 40m / 10m fa)' },
            { value: 'time', label: 'Orario (HH:MM)' },
            { value: 'datetime', label: 'Giorno + Orario (es. Oggi 19:35)' },
            { value: 'raw', label: 'Testo originale (non formattato)' },
          ],
        },
      },
    };

    if (type === 'custom') {
      schema.push(
        {
          type: 'expandable',
          name: '',
          flatten: true,
          title: 'Sottotitolo avanzato (altra entità / orari relativi)',
          icon: 'mdi:clock-outline',
          schema: [
            { name: 'subtitle_entity', selector: { entity: {} } },
            attributeSelector,
            visibilitySelector,
            formatSelector,
            {
              type: 'grid',
              name: '',
              schema: [
                { name: 'subtitle_prefix', selector: { text: {} } },
                { name: 'subtitle_suffix', selector: { text: {} } },
              ],
            },
          ],
        },
        { name: 'active_state', selector: { text: {} } },
        {
          type: 'grid',
          name: '',
          schema: [
            { name: 'label_active', selector: { text: {} } },
            { name: 'label_inactive', selector: { text: {} } },
          ],
        },
        { name: 'status_entity', selector: { entity: {} } },
        { name: 'extra_entities', selector: { entity: { multiple: true } } },
      );
    } else if (type === 'sensor') {
      schema.push(
        {
          type: 'expandable',
          name: '',
          flatten: true,
          title: 'Sottotitolo avanzato (attributi / orari relativi)',
          icon: 'mdi:clock-outline',
          schema: [attributeSelector, visibilitySelector, formatSelector],
        },
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
        { name: 'extra_entities', selector: { entity: { multiple: true } } },
      );
    } else if (type === 'power_strip') {
      schema.push({ name: 'extra_entities', selector: { entity: { multiple: true } } });
    } else if (type === 'climate') {
      schema.push({
        name: 'outdoor_entity',
        selector: { entity: { domain: 'sensor' } },
      });
    } else if (type === 'media' || type === 'remote') {
      schema.push({ name: 'status_entity', selector: { entity: {} } });
    }

    return schema;
  }

  private _buildInteractionsSchema(): unknown[] {
    const type = this._resolvedType();
    const needsNav =
      this._config?.tap_action === 'navigate' || this._config?.hold_action === 'navigate';

    const schema: unknown[] = [
      {
        name: 'popup_type',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'auto', label: 'Automatico (in base al dispositivo)' },
              { value: 'power_strip', label: 'Power Strip (Multipresa a 2 colonne)' },
              { value: 'selector', label: 'Selettore (Scelta opzioni M3 Expressive)' },
              { value: 'custom', label: 'Personalizzata (stato/attributi liberi)' },
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

    if (type === 'media') {
      schema.push({
        name: 'media_controls_action',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'popup', label: 'Popup Now Playing M3E (predefinito)' },
              { value: 'more-info', label: 'Dettagli nativi Home Assistant (More-info)' },
            ],
          },
        },
      });
    } else if (type === 'remote') {
      schema.push(
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

  private _buildFeaturesPositionSchema(): unknown[] {
    return [
      {
        name: 'features_position',
        selector: {
          select: {
            mode: 'box',
            options: [
              {
                value: 'bottom',
                label: 'Bottom',
                description: 'Mostra tutte le feature impilate sotto la tile',
              },
              {
                value: 'inline',
                label: 'Inline',
                description: 'Mostra le feature affiancate a destra del titolo',
              },
            ],
          },
        },
      },
    ];
  }

  private _computeLabel = (schema: { name: string }): string => {
    const labels: Record<string, string> = {
      entity: 'Entità principale',
      status_entity: 'Entità stato dispositivo (opzionale)',
      name: 'Nome',
      card_style: 'Design della pillola (Material 3)',
      use_entity_icon: 'Usa icona entità HA (al posto di Google Home)',
      show_entity_picture: 'Mostra entity picture (1:1 sfumata)',
      hide_state: 'Nascondi stato',
      state_content: 'Contenuto stato (stato / attributi)',
      icon_active: 'Icona attivo (vuoto = standard Google Home)',
      icon_inactive: 'Icona inattivo (vuoto = standard Google Home)',
      active_state: 'Stati attivi personalizzati (es. on,home,detected)',
      label_active: 'Testo stato attivo',
      label_inactive: 'Testo stato inattivo',
      subtitle_entity: 'Entità per testo stato (opzionale)',
      subtitle_attribute: 'Attributo del dispositivo da mostrare come stato',
      subtitle_visibility: 'Quando mostrare lo stato/attributo scelto',
      subtitle_format: 'Formato testo / orario',
      subtitle_prefix: 'Prefisso testo stato (es. Sveglia: )',
      subtitle_suffix: 'Suffisso testo stato',
      popup_type: 'Tipo card / Schermata popup',
      tap_action: 'Azione al tocco (Tap)',
      hold_action: 'Azione pressione prolungata (Hold)',
      navigation_path: 'Percorso dashboard (/lovelace/...) · #hash Bubble Card · script/browser_mod',
      secondary_entity: 'Entità secondaria (auto-rilevata dal device se vuota)',
      extra_entities:
        this._resolvedType() === 'power_strip'
          ? 'Prese della multipresa (vuoto = auto-rileva dallo stesso dispositivo)'
          : 'Pillole entità aggiuntive nel popup (max 10)',
      outdoor_entity: 'Temperatura esterna',
      media_controls_action: 'Azione pulsante "Media & Controls"',
      features_position: 'Posizione Features',
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

  private _emitConfig(next: M3EStatusCardConfig): void {
    this._config = next;
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        bubbles: true,
        composed: true,
        detail: { config: next },
      }),
    );
  }

  private _onValueChanged = (e: CustomEvent<{ value: Partial<M3EStatusCardConfig> }>): void => {
    if (!this._config) return;
    const next: M3EStatusCardConfig = { ...this._config, ...e.detail.value };
    if (Array.isArray(next.extra_entities)) {
      next.extra_entities = next.extra_entities.slice(0, 10);
      if (next.extra_entities.length === 0) {
        delete next.extra_entities;
      }
    }
    this._emitConfig(next);
  };

  private _onFeaturesChanged = (
    e: CustomEvent<{ features: LovelaceCardFeatureConfig[] }>,
  ): void => {
    e.stopPropagation();
    if (!this._config) return;
    const features = e.detail.features ?? [];
    const next: M3EStatusCardConfig = { ...this._config };
    if (features.length > 0) {
      next.features = features;
      if (!next.features_position) {
        next.features_position = 'bottom';
      }
    } else {
      delete next.features;
      delete next.features_position;
    }
    this._emitConfig(next);
  };

  private _onFeaturesPositionChanged = (
    e: CustomEvent<{ value: { features_position?: M3EFeaturesPosition } }>,
  ): void => {
    e.stopPropagation();
    if (!this._config) return;
    this._emitConfig({
      ...this._config,
      features_position: e.detail.value.features_position ?? 'bottom',
    });
  };

  private _onEditDetailElement = (
    e: CustomEvent<{ subElementConfig: SubElementEditorConfig }>,
  ): void => {
    e.stopPropagation();
    this._subElementEditorConfig = e.detail.subElementConfig;
  };

  private _onSubElementConfigChanged = (
    e: CustomEvent<{ config?: LovelaceCardFeatureConfig }>,
  ): void => {
    e.stopPropagation();
    if (!this._config || !this._subElementEditorConfig) return;
    const idx = this._subElementEditorConfig.index;
    if (typeof idx !== 'number') return;

    const features = [...(this._config.features ?? [])];
    const updated = e.detail.config;
    if (!updated) {
      features.splice(idx, 1);
      this._subElementEditorConfig = undefined;
    } else {
      features[idx] = updated;
      this._subElementEditorConfig = {
        ...this._subElementEditorConfig,
        elementConfig: updated,
      };
    }

    const next: M3EStatusCardConfig = { ...this._config };
    if (features.length > 0) {
      next.features = features;
    } else {
      delete next.features;
      delete next.features_position;
    }
    this._emitConfig(next);
  };

  private _onGoBack = (): void => {
    this._subElementEditorConfig = undefined;
  };

  protected render() {
    if (!this.hass || !this._config) return nothing;

    const entityId = this._config.entity;
    const stateObj = entityId ? this.hass.states[entityId] : undefined;
    const featureContext = { entity_id: entityId };

    if (this._subElementEditorConfig) {
      return html`
        <hui-sub-element-editor
          .hass=${this.hass}
          .config=${this._subElementEditorConfig}
          .context=${featureContext}
          @go-back=${this._onGoBack}
          @config-changed=${this._onSubElementConfigChanged}
        ></hui-sub-element-editor>
      `;
    }

    const features = this._config.features ?? [];

    return html`
      <div class="editor-root">
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${this._buildEntitySchema()}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._onValueChanged}
        ></ha-form>

        <ha-expansion-panel outlined>
          <ha-icon slot="leading-icon" icon="mdi:text-short"></ha-icon>
          <span slot="header">Content</span>
          <div class="panel-body">
            <ha-form
              .hass=${this.hass}
              .data=${this._config}
              .schema=${this._buildContentSchema()}
              .computeLabel=${this._computeLabel}
              @value-changed=${this._onValueChanged}
            ></ha-form>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel outlined>
          <ha-icon slot="leading-icon" icon="mdi:gesture-tap"></ha-icon>
          <span slot="header">Interactions</span>
          <div class="panel-body">
            <ha-form
              .hass=${this.hass}
              .data=${this._config}
              .schema=${this._buildInteractionsSchema()}
              .computeLabel=${this._computeLabel}
              @value-changed=${this._onValueChanged}
            ></ha-form>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel outlined>
          <ha-icon slot="leading-icon" icon="mdi:list-box"></ha-icon>
          <span slot="header">Features</span>
          <div class="panel-body features-panel">
            ${this._featuresEditorReady
              ? html`
                  <hui-card-features-editor
                    .hass=${this.hass}
                    .lovelace=${this.lovelace}
                    .context=${featureContext}
                    .stateObj=${stateObj}
                    .features=${features}
                    @features-changed=${this._onFeaturesChanged}
                    @edit-detail-element=${this._onEditDetailElement}
                  ></hui-card-features-editor>
                  ${features.length > 0
                    ? html`
                        <div class="features-pos-wrap">
                          <ha-form
                            .hass=${this.hass}
                            .data=${{
                              features_position: this._config.features_position ?? 'bottom',
                            }}
                            .schema=${this._buildFeaturesPositionSchema()}
                            .computeLabel=${this._computeLabel}
                            @value-changed=${this._onFeaturesPositionChanged}
                          ></ha-form>
                        </div>
                      `
                    : nothing}
                `
              : html`<div class="loading-hint">Caricamento editor Features…</div>`}
          </div>
        </ha-expansion-panel>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .editor-root {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    ha-expansion-panel {
      display: block;
      --expansion-panel-content-padding: 0;
    }

    .panel-body {
      padding: 12px 16px 16px;
    }

    .features-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .features-pos-wrap {
      padding-top: 4px;
    }

    .loading-hint {
      font-size: 13px;
      color: var(--secondary-text-color);
      padding: 8px 0;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-status-card-editor': M3EStatusCardEditor;
  }
}
