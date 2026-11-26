import { LitElement, css, html, nothing, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { m3eBaseStyles } from '../styles/m3e-tokens';
import type { HassEntity, HomeAssistant, M3ESceneCardConfig } from '../types/home-assistant';
import { resolveEntityName, resolveStateContent } from '../utils/entity-display';
import { t } from '../utils/i18n';

const ACTIVATED_DURATION_MS = 2200;

@customElement('m3e-scene-card')
export class M3ESceneCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3ESceneCardConfig;
  @state() private _pressed = false;
  @state() private _activated = false;

  private _resetTimer: number | null = null;
  private _prevEntityState?: HassEntity;

  public static getStubConfig(hass?: HomeAssistant): M3ESceneCardConfig {
    const firstScene = hass
      ? Object.keys(hass.states).find(
          (id) =>
            id.startsWith('scene.') ||
            id.startsWith('script.') ||
            id.startsWith('button.') ||
            id.startsWith('input_button.'),
        )
      : undefined;
    return {
      type: 'custom:m3e-scene-card',
      entity: firstScene ?? 'scene.home',
    };
  }

  public static getConfigForm() {
    return {
      schema: [
        {
          name: 'entity',
          required: true,
          selector: {
            entity: {
              domain: ['scene', 'script', 'button', 'input_button', 'automation'],
            },
          },
        },
        {
          type: 'expandable',
          name: '',
          flatten: true,
          icon: 'mdi:text-short',
          title: 'Content',
          schema: [
            {
              name: 'name',
              selector: { entity_name: {} },
              context: { entity: 'entity' },
            },
            { name: 'icon', selector: { icon: {} } },
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
              name: 'accent',
              selector: {
                select: {
                  mode: 'dropdown',
                  options: [
                    { value: 'primary', label: 'Primary (Tema M3Y)' },
                    { value: 'secondary', label: 'Secondary (Tema M3Y)' },
                    { value: 'tertiary', label: 'Tertiary (Tema M3Y)' },
                  ],
                },
              },
            },
            {
              type: 'grid',
              name: '',
              schema: [
                { name: 'use_entity_icon', selector: { boolean: {} } },
                { name: 'hide_state', selector: { boolean: {} } },
              ],
            },
            {
              name: 'state_content',
              selector: { ui_state_content: { allow_name: false } },
              context: { filter_entity: 'entity' },
            },
            { name: 'subtitle', selector: { text: {} } },
          ],
        },
      ],
      computeLabel: (schema: { name: string }) => {
        const labels: Record<string, string> = {
          entity: 'Scena, Script o Pulsante',
          name: 'Nome',
          use_entity_icon: 'Usa icona entità HA (al posto di Google Home)',
          hide_state: 'Nascondi stato',
          state_content: 'Contenuto stato (stato / attributi)',
          subtitle: 'Sottotitolo opzionale',
          icon: 'Icona personalizzata (vuoto = scintille Google Home)',
          accent: 'Colore di attivazione (M3Y)',
          card_style: 'Design della pillola (Material 3)',
        };
        return labels[schema.name] ?? schema.name;
      },
    };
  }

  public setConfig(config: M3ESceneCardConfig): void {
    if (!config || !config.entity) {
      throw new Error('m3e-scene-card: you must define an entity');
    }
    this._config = {
      accent: 'primary',
      card_style: 'default',
      ...config,
    };
  }

  public getCardSize(): number {
    return 2;
  }

  public getGridOptions() {
    return { rows: 'auto', columns: 6, min_columns: 3 };
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._resetTimer !== null) {
      window.clearTimeout(this._resetTimer);
      this._resetTimer = null;
    }
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (
      changedProps.has('_config') ||
      changedProps.has('_pressed') ||
      changedProps.has('_activated')
    ) {
      return true;
    }
    if (changedProps.has('hass') && this._config && this.hass) {
      const next = this.hass.states[this._config.entity];
      if (next !== this._prevEntityState) {
        this._prevEntityState = next;
        return true;
      }
      return false;
    }
    return false;
  }

  private get _entity(): HassEntity | undefined {
    if (!this.hass || !this._config) return undefined;
    return this.hass.states[this._config.entity];
  }

  private get _isUnavailable(): boolean {
    const s = this._entity?.state;
    return s === 'unavailable';
  }

  private _trigger(): void {
    if (!this.hass || !this._config || this._isUnavailable) return;

    const entityId = this._config.entity;
    const domain = entityId.split('.')[0];

    if (domain === 'button' || domain === 'input_button') {
      this.hass.callService(domain, 'press', { entity_id: entityId });
    } else if (domain === 'automation') {
      this.hass.callService('automation', 'trigger', { entity_id: entityId });
    } else if (domain === 'scene' || domain === 'script') {
      this.hass.callService(domain, 'turn_on', { entity_id: entityId });
    } else {
      this.hass.callService('homeassistant', 'turn_on', { entity_id: entityId });
    }

    this._activated = true;
    if (this._resetTimer !== null) {
      window.clearTimeout(this._resetTimer);
    }
    this._resetTimer = window.setTimeout(() => {
      this._activated = false;
      this._resetTimer = null;
    }, ACTIVATED_DURATION_MS);
  }

  private _renderIcon(customIcon: string | undefined, activated: boolean) {
    if (customIcon && typeof customElements !== 'undefined' && customElements.get('ha-icon')) {
      return html`<ha-icon .icon=${customIcon}></ha-icon>`;
    }
    if (this._config?.use_entity_icon && this._entity && typeof customElements !== 'undefined') {
      if (customElements.get('ha-state-icon')) {
        return html`<ha-state-icon .hass=${this.hass} .stateObj=${this._entity}></ha-state-icon>`;
      }
      const attrIcon = this._entity.attributes.icon;
      if (attrIcon && customElements.get('ha-icon')) {
        return html`<ha-icon .icon=${attrIcon}></ha-icon>`;
      }
    }

    // Google Home Scene Sparkles: outlined when idle -> filled when activated
    return activated
      ? html`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M9.5 3.5 11.4 9l5.6 1.9-5.6 1.9-1.9 5.7-1.9-5.7L2 10.9 7.6 9 9.5 3.5Zm9 1.5.9 2.6L22 8.5l-2.6.9-.9 2.6-.9-2.6L15 8.5l2.6-.9.9-2.6Zm0 10 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z"
            />
          </svg>
        `
      : html`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linejoin="round"
              d="M9.5 4.2 11.2 9.2 16.2 10.9 11.2 12.6 9.5 17.6 7.8 12.6 2.8 10.9 7.8 9.2 9.5 4.2Z"
            />
            <path
              fill="currentColor"
              d="M18.5 5l.8 2.2L21.5 8l-2.2.8-.8 2.2-.8-2.2L15.5 8l2.2-.8.8-2.2Zm0 10 .7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z"
            />
          </svg>
        `;
  }

  protected render() {
    if (!this._config) return nothing;
    const entity = this._entity;
    const name = resolveEntityName(this.hass, entity, this._config.name, this._config.entity);
    const customIcon = this._config.icon?.trim() || undefined;
    const accent = this._config.accent ?? 'primary';
    const styleClass = `style-${this._config.card_style ?? 'default'}`;
    const restSub = this._config.subtitle?.trim() || '';
    const baseSub = this._isUnavailable
      ? t(this.hass, 'offline')
      : this._activated
        ? t(this.hass, 'started')
        : restSub;
    const hideState = Boolean(this._config.hide_state);
    const stateContentVal =
      !hideState && !this._activated
        ? resolveStateContent(this.hass, entity, this._config.state_content, baseSub)
        : null;
    const subtitle = hideState ? '' : (stateContentVal ?? baseSub);

    return html`
      <ha-card
        class="scene-tile ${styleClass} accent-${accent} ${this._activated ? 'is-on is-activated' : ''} ${this._pressed ? 'is-pressed' : ''} ${this._isUnavailable ? 'is-unavailable' : ''}"
        role="button"
        tabindex="0"
        aria-label=${name}
        @pointerdown=${(e: PointerEvent) => {
          if (e.button === 0 && !this._isUnavailable) this._pressed = true;
        }}
        @pointerup=${() => {
          if (this._pressed) {
            this._pressed = false;
            this._trigger();
          }
        }}
        @pointerleave=${() => (this._pressed = false)}
        @pointercancel=${() => (this._pressed = false)}
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this._trigger();
          }
        }}
      >
        <div class="state-layer" aria-hidden="true"></div>
        <div class="tile-inner">
          <span class="scene-icon">${this._renderIcon(customIcon, this._activated)}</span>
          <div class="tile-meta">
            <span class="tile-title">${name}</span>
            ${subtitle ? html`<span class="tile-subtitle">${subtitle}</span>` : nothing}
          </div>
          ${this._isUnavailable
            ? html`
                <span class="offline-badge" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3ZM12 14a1 1 0 0 1-1-1v-2a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1Zm1 4h-2v-2h2v2Z"
                    />
                  </svg>
                </span>
              `
            : html`
                <span class="scene-check ${this._activated ? 'visible' : ''}" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      class="check-path"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4.5 4.5L19 7.5"
                    />
                  </svg>
                </span>
              `}
        </div>
      </ha-card>
    `;
  }

  static styles = [
    m3eBaseStyles,
    css`
      .scene-tile {
        height: 100%;
        min-height: 84px;
        cursor: pointer;
        outline: none;
        --m3e-scene-bg: var(--md-sys-color-primary-container, #dbe1ff);
        --m3e-scene-fg: var(--md-sys-color-on-primary-container, #16306b);
        transition:
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-default),
          border-color var(--m3e-spring-effects-default);
      }

      .scene-tile.accent-secondary {
        --m3e-scene-bg: var(--md-sys-color-secondary-container, #dde1f9);
        --m3e-scene-fg: var(--md-sys-color-on-secondary-container, #161b2c);
      }

      .scene-tile.accent-tertiary {
        --m3e-scene-bg: var(--md-sys-color-tertiary-container, #fdd7f4);
        --m3e-scene-fg: var(--md-sys-color-on-tertiary-container, #2b122a);
      }

      .scene-tile.is-activated {
        background: var(--m3e-scene-bg);
        color: var(--m3e-scene-fg);
      }

      .scene-tile.is-pressed {
        transform: scale(0.965);
      }

      .scene-tile:focus-visible {
        outline: 2px solid var(--md-sys-color-primary, #4c5c92);
        outline-offset: 2px;
      }

      .state-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: currentColor;
        opacity: 0;
        transition: opacity var(--m3e-spring-effects-fast);
      }

      .scene-tile:hover .state-layer {
        opacity: 0.06;
      }

      .scene-tile.is-pressed .state-layer {
        opacity: 0.11;
      }

      .tile-inner {
        position: relative;
        z-index: 1;
        height: 100%;
        min-height: 84px;
        padding: 12px 12px 12px 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        pointer-events: none;
      }

      .scene-icon {
        flex: 0 0 auto;
        width: 24px;
        height: 24px;
        display: grid;
        place-items: center;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        transform: scale(1);
        transition:
          color var(--m3e-spring-effects-default),
          transform var(--m3e-spring-spatial-fast);
      }

      .scene-tile.is-activated .scene-icon {
        color: var(--m3e-scene-fg);
        animation: m3e-sparkle-pop 420ms cubic-bezier(0.2, 0.9, 0.2, 1);
      }

      @keyframes m3e-sparkle-pop {
        0% {
          transform: scale(0.82) rotate(-8deg);
        }
        55% {
          transform: scale(1.14) rotate(4deg);
        }
        100% {
          transform: scale(1) rotate(0deg);
        }
      }

      .scene-icon ha-icon,
      .scene-icon svg {
        width: 24px;
        height: 24px;
        --mdc-icon-size: 24px;
      }

      .tile-meta {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .tile-title {
        font-size: 14.5px;
        font-weight: 600;
        line-height: 18px;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        word-break: break-word;
        transition: color var(--m3e-spring-effects-default);
      }

      .tile-subtitle {
        font-size: 13px;
        font-weight: 500;
        line-height: 17px;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color var(--m3e-spring-effects-default);
      }

      .scene-tile.is-activated .tile-title,
      .scene-tile.is-activated .tile-subtitle {
        color: var(--m3e-scene-fg);
      }

      /* Animated Checkmark on Activation */
      .scene-check {
        flex: 0 0 auto;
        width: 24px;
        height: 24px;
        display: grid;
        place-items: center;
        color: var(--m3e-scene-fg);
        opacity: 0;
        transform: scale(0.6);
        transition:
          opacity var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
      }

      .scene-check.visible {
        opacity: 1;
        transform: scale(1);
      }

      .scene-check svg {
        width: 22px;
        height: 22px;
      }

      .check-path {
        stroke-dasharray: 28;
        stroke-dashoffset: 28;
        transition: stroke-dashoffset 320ms cubic-bezier(0.2, 0.8, 0.2, 1) 60ms;
      }

      .scene-check.visible .check-path {
        stroke-dashoffset: 0;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-scene-card': M3ESceneCard;
  }
}
