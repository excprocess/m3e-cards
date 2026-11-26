import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from '../types/home-assistant';
import type { LovelaceCardFeatureConfig, SubElementEditorConfig } from './ha-card-features';

/**
 * Reliable sub-editor host for editing a single native or HACS custom card feature.
 * Works even when Home Assistant hasn't lazy-loaded `<hui-sub-element-editor>` yet:
 * 1. Uses `<hui-sub-element-editor>` when defined.
 * 2. Falls back to `<hui-card-feature-editor>` inside a native Back header.
 * 3. Falls back to instantiating a `custom:*` feature's own `getConfigElement()` directly.
 */
@customElement('m3e-feature-sub-editor')
export class M3EFeatureSubEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public lovelace?: unknown;
  @property({ attribute: false }) public config?: SubElementEditorConfig;
  @property({ attribute: false }) public context?: { entity_id?: string };

  @state() private _customEditorEl?: HTMLElement;
  private _mountedType = '';

  protected updated(): void {
    const featureCfg = this.config?.elementConfig;
    const type = featureCfg?.type ?? '';
    const hasSubEditor =
      typeof customElements !== 'undefined' && Boolean(customElements.get('hui-sub-element-editor'));
    const hasFeatureEditor =
      typeof customElements !== 'undefined' && Boolean(customElements.get('hui-card-feature-editor'));

    if (!hasSubEditor && !hasFeatureEditor && type && type !== this._mountedType) {
      this._mountedType = type;
      void this._mountDirectCustomEditor(type, featureCfg!);
    }

    if (this._customEditorEl) {
      const el = this._customEditorEl as HTMLElement & {
        hass?: HomeAssistant;
        lovelace?: unknown;
        context?: { entity_id?: string };
        stateObj?: unknown;
      };
      el.hass = this.hass;
      el.lovelace = this.lovelace;
      el.context = this.context;
      if (this.context?.entity_id && this.hass?.states) {
        el.stateObj = this.hass.states[this.context.entity_id];
      }
    }
  }

  private async _mountDirectCustomEditor(
    type: string,
    featureCfg: LovelaceCardFeatureConfig,
  ): Promise<void> {
    if (!type.startsWith('custom:') || typeof customElements === 'undefined') return;
    const tag = type.slice('custom:'.length);
    const ctor = customElements.get(tag) as
      | { getConfigElement?: () => Promise<HTMLElement> | HTMLElement }
      | undefined;
    if (!ctor?.getConfigElement) return;
    try {
      const editorEl = await ctor.getConfigElement();
      const typed = editorEl as HTMLElement & {
        hass?: HomeAssistant;
        lovelace?: unknown;
        context?: { entity_id?: string };
        stateObj?: unknown;
        setConfig?: (cfg: LovelaceCardFeatureConfig) => void;
      };
      typed.hass = this.hass;
      typed.lovelace = this.lovelace;
      typed.context = this.context;
      if (this.context?.entity_id && this.hass?.states) {
        typed.stateObj = this.hass.states[this.context.entity_id];
      }
      typed.setConfig?.(featureCfg);
      typed.addEventListener('config-changed', (ev: Event) => {
        ev.stopPropagation();
        const detail = (ev as CustomEvent<{ config?: LovelaceCardFeatureConfig }>).detail;
        this._emitConfigChanged(detail?.config);
      });
      this._customEditorEl = typed;
    } catch {
      this._customEditorEl = undefined;
    }
  }

  private _goBack = (): void => {
    this.dispatchEvent(new CustomEvent('go-back', { bubbles: true, composed: true }));
  };

  private _emitConfigChanged(cfg?: LovelaceCardFeatureConfig): void {
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        bubbles: true,
        composed: true,
        detail: { config: cfg },
      }),
    );
  }

  protected render() {
    if (!this.hass || !this.config) return nothing;

    const hasSubEditor =
      typeof customElements !== 'undefined' && Boolean(customElements.get('hui-sub-element-editor'));

    if (hasSubEditor) {
      return html`
        <hui-sub-element-editor
          .hass=${this.hass}
          .lovelace=${this.lovelace}
          .config=${this.config}
          .context=${this.context}
          @go-back=${this._goBack}
          @config-changed=${(e: CustomEvent<{ config?: LovelaceCardFeatureConfig }>) => {
            e.stopPropagation();
            this._emitConfigChanged(e.detail?.config);
          }}
        ></hui-sub-element-editor>
      `;
    }

    const featureCfg = this.config.elementConfig;
    const hasFeatureEditor =
      typeof customElements !== 'undefined' && Boolean(customElements.get('hui-card-feature-editor'));
    const stateObj =
      this.context?.entity_id && this.hass.states
        ? this.hass.states[this.context.entity_id]
        : undefined;

    return html`
      <div class="sub-editor-shell">
        <div class="sub-header">
          <button type="button" class="back-btn" @click=${this._goBack} aria-label="Back">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z"
              />
            </svg>
          </button>
          <span class="sub-title">Feature</span>
        </div>

        <div class="sub-body">
          ${hasFeatureEditor && featureCfg
            ? html`
                <hui-card-feature-editor
                  .hass=${this.hass}
                  .lovelace=${this.lovelace}
                  .context=${this.context}
                  .stateObj=${stateObj}
                  .config=${featureCfg}
                  @config-changed=${(e: CustomEvent<{ config?: LovelaceCardFeatureConfig }>) => {
                    e.stopPropagation();
                    this._emitConfigChanged(e.detail?.config);
                  }}
                ></hui-card-feature-editor>
              `
            : this._customEditorEl
              ? html`${this._customEditorEl}`
              : html`
                  <div class="fallback-msg">
                    Editor visuale non disponibile per questa feature. Usa <strong>Show code editor</strong> per modificarla in YAML.
                  </div>
                `}
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .sub-editor-shell {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .sub-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--divider-color, rgba(128, 128, 128, 0.2));
    }

    .back-btn {
      width: 36px;
      height: 36px;
      border: 0;
      border-radius: 50%;
      background: transparent;
      color: var(--primary-text-color);
      display: grid;
      place-items: center;
      cursor: pointer;
      padding: 0;
    }

    .back-btn:hover {
      background: rgba(128, 128, 128, 0.14);
    }

    .back-btn svg {
      width: 22px;
      height: 22px;
    }

    .sub-title {
      font-size: 16px;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    .fallback-msg {
      font-size: 13px;
      color: var(--secondary-text-color);
      padding: 12px 4px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-feature-sub-editor': M3EFeatureSubEditor;
  }
}
