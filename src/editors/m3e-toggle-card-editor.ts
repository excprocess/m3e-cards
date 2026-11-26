import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, M3EToggleCardConfig } from '../types/home-assistant';
import {
  ensureCardFeaturesEditorLoaded,
  type LovelaceCardFeatureConfig,
  type M3EFeaturesPosition,
  type SubElementEditorConfig,
} from '../utils/ha-card-features';

@customElement('m3e-toggle-card-editor')
export class M3EToggleCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public lovelace?: unknown;
  @state() private _config?: M3EToggleCardConfig;
  @state() private _featuresEditorReady = false;
  @state() private _subElementEditorConfig?: SubElementEditorConfig;

  public connectedCallback(): void {
    super.connectedCallback();
    void ensureCardFeaturesEditorLoaded().then((ok) => {
      if (ok) this._featuresEditorReady = true;
    });
  }

  public setConfig(config: M3EToggleCardConfig): void {
    this._config = { ...config };
  }

  private _buildEntitySchema(): unknown[] {
    return [
      {
        name: 'entity',
        required: true,
        selector: {
          entity: {
            domain: [
              'switch',
              'input_boolean',
              'fan',
              'light',
              'automation',
              'humidifier',
              'lock',
              'cover',
            ],
          },
        },
      },
    ];
  }

  private _buildContentSchema(): unknown[] {
    return [
      { name: 'name', selector: { text: {} } },
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
          { name: 'icon_on', selector: { icon: {} } },
          { name: 'icon_off', selector: { icon: {} } },
        ],
      },
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'label_on', selector: { text: {} } },
          { name: 'label_off', selector: { text: {} } },
        ],
      },
    ];
  }

  private _buildInteractionsSchema(): unknown[] {
    const schema: unknown[] = [
      {
        name: 'hold_action',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'popup', label: 'Apri popup Material 3 Expressive' },
              { value: 'more-info', label: 'Schermata nativa Home Assistant' },
              { value: 'navigate', label: 'Apri percorso / Bubble Card (#hash) / Browser Mod' },
              { value: 'none', label: 'Nessuna azione' },
            ],
          },
        },
      },
    ];

    if (this._config?.hold_action === 'navigate') {
      schema.push({ name: 'navigation_path', selector: { text: {} } });
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
      entity: 'Entità (switch, presa, input_boolean…)',
      name: 'Nome personalizzato',
      card_style: 'Design della pillola (Material 3)',
      icon_on: 'Icona acceso (vuoto = standard Google Home)',
      icon_off: 'Icona spento (vuoto = standard Google Home)',
      label_on: 'Testo acceso (default: On)',
      label_off: 'Testo spento (default: Off)',
      hold_action: 'Azione pressione prolungata (Hold)',
      navigation_path: 'Percorso / #popup Bubble Card / script o browser_mod',
      features_position: 'Posizione Features',
    };
    return labels[schema.name] ?? schema.name;
  };

  private _emitConfig(next: M3EToggleCardConfig): void {
    this._config = next;
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        bubbles: true,
        composed: true,
        detail: { config: next },
      }),
    );
  }

  private _onValueChanged = (e: CustomEvent<{ value: Partial<M3EToggleCardConfig> }>): void => {
    if (!this._config) return;
    this._emitConfig({ ...this._config, ...e.detail.value });
  };

  private _onFeaturesChanged = (
    e: CustomEvent<{ features: LovelaceCardFeatureConfig[] }>,
  ): void => {
    e.stopPropagation();
    if (!this._config) return;
    const features = e.detail.features ?? [];
    const next: M3EToggleCardConfig = { ...this._config };
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

    const next: M3EToggleCardConfig = { ...this._config };
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
    'm3e-toggle-card-editor': M3EToggleCardEditor;
  }
}
