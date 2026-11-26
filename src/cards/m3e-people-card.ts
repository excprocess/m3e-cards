import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import type {
  HassEntity,
  HomeAssistant,
  M3EPeopleCardConfig,
  M3EPeopleItemConfig,
} from '../types/home-assistant';
import { m3eBaseStyles } from '../styles/m3e-tokens';
import { executeNavigationTarget } from '../utils/navigation';
import '../editors/m3e-people-card-editor';

@customElement('m3e-people-card')
export class M3EPeopleCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3EPeopleCardConfig;
  @query('.people-container') private _containerEl?: HTMLDivElement;

  private _isMouseDragging = false;
  private _dragMoved = false;
  private _dragStartX = 0;
  private _dragScrollLeft = 0;

  public setConfig(config: M3EPeopleCardConfig): void {
    if (!config) {
      throw new Error('m3e-people-card: configurazione mancante');
    }
    this._config = {
      ...config,
      layout: config.layout ?? 'scroll',
      size: config.size ?? 'default',
      transparent: config.transparent !== false,
      show_presence_indicator: config.show_presence_indicator !== false,
      items: Array.isArray(config.items) ? config.items : [],
    };
  }

  public getCardSize(): number {
    if (this._config?.layout === 'list') {
      return Math.max(1, Math.min(4, this._config.items?.length ?? 1));
    }
    return 1;
  }

  public getGridOptions() {
    return {
      rows: 'auto' as const,
      columns: 12,
      min_columns: 6,
    };
  }

  public static getConfigElement(): HTMLElement {
    return document.createElement('m3e-people-card-editor');
  }

  public static getStubConfig(hass?: HomeAssistant): M3EPeopleCardConfig {
    const states = hass?.states ?? {};
    const peopleIds = Object.keys(states)
      .filter((id) => id.startsWith('person.'))
      .slice(0, 6);

    const items: M3EPeopleItemConfig[] =
      peopleIds.length > 0
        ? peopleIds.map((entity) => ({ entity, tap_action: 'more-info' }))
        : [{ entity: 'person.home', tap_action: 'more-info' }];

    return {
      type: 'custom:m3e-people-card',
      layout: 'scroll',
      size: 'default',
      transparent: true,
      show_presence_indicator: true,
      items,
    };
  }

  protected shouldUpdate(changedProps: Map<string, unknown>): boolean {
    if (!this._config) return false;
    if (changedProps.has('_config')) return true;
    if (changedProps.has('hass')) {
      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
      if (!oldHass || !this.hass) return true;
      for (const item of this._config.items) {
        if (!item.entity) continue;
        if (oldHass.states[item.entity] !== this.hass.states[item.entity]) {
          return true;
        }
      }
      return oldHass.themes?.darkMode !== this.hass.themes?.darkMode;
    }
    return true;
  }

  private _formatLocation(entity?: HassEntity): string {
    if (!entity) return 'Offline';
    const raw = String(entity.state ?? '').trim();
    const low = raw.toLowerCase();

    if (!raw || low === 'unavailable' || low === 'unknown') return 'Offline';
    if (low === 'home') return 'Home';
    if (low === 'not_home') {
      const lang = (this.hass?.language ?? 'it').toLowerCase();
      return lang.startsWith('it') ? 'Fuori casa' : 'Away';
    }
    return raw;
  }

  private _onMouseDown(ev: MouseEvent): void {
    if (this._config?.layout !== 'scroll' || !this._containerEl || ev.button !== 0) return;
    this._isMouseDragging = true;
    this._dragMoved = false;
    this._dragStartX = ev.pageX - this._containerEl.offsetLeft;
    this._dragScrollLeft = this._containerEl.scrollLeft;
  }

  private _onMouseMove(ev: MouseEvent): void {
    if (!this._isMouseDragging || !this._containerEl) return;
    const x = ev.pageX - this._containerEl.offsetLeft;
    const walk = x - this._dragStartX;
    if (Math.abs(walk) > 6) {
      this._dragMoved = true;
      ev.preventDefault();
      this._containerEl.scrollLeft = this._dragScrollLeft - walk;
    }
  }

  private _onMouseUpOrLeave(): void {
    this._isMouseDragging = false;
  }

  private _onItemTap(item: M3EPeopleItemConfig): void {
    if (this._dragMoved) {
      this._dragMoved = false;
      return;
    }
    if (!this.hass || !item.entity) return;

    const action = item.tap_action ?? 'more-info';
    if (action === 'none') return;

    if (action === 'navigate' && item.navigation_path) {
      executeNavigationTarget(this, this.hass, item.navigation_path);
      return;
    }

    this.dispatchEvent(
      new CustomEvent('hass-more-info', {
        detail: { entityId: item.entity },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _renderAvatar(item: M3EPeopleItemConfig, entity?: HassEntity, isHome = false) {
    if (item.icon) {
      return html`<ha-icon .icon=${item.icon}></ha-icon>`;
    }

    const picture =
      item.image?.trim() || (entity?.attributes.entity_picture as string | undefined) || '';

    if (picture) {
      return html`<img class="avatar-img" src=${picture} alt="" loading="lazy" />`;
    }

    // Standard Material 3 Person SVG (filled when Home, outlined when away)
    return isHome
      ? html`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.33 0-8 1.67-8 5v1h16v-1c0-3.33-4.67-5-8-5Z"
            />
          </svg>
        `
      : html`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2Zm0-12a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z"
            />
          </svg>
        `;
  }

  protected render() {
    if (!this._config) return nothing;
    const items = this._config.items ?? [];
    const layout = this._config.layout ?? 'scroll';
    const size = this._config.size ?? 'default';
    const transparent = this._config.transparent !== false;
    const showPresence = this._config.show_presence_indicator !== false;

    const content = html`
      <div
        class="people-container layout-${layout} size-${size} ${transparent ? 'is-transparent' : 'is-card'}"
        @mousedown=${this._onMouseDown}
        @mousemove=${this._onMouseMove}
        @mouseup=${this._onMouseUpOrLeave}
        @mouseleave=${this._onMouseUpOrLeave}
      >
        ${items.length === 0
          ? html`<div class="empty-hint">Aggiungi persone dalla configurazione della card</div>`
          : items.map((item) => {
              const entity = item.entity ? this.hass?.states[item.entity] : undefined;
              const isUnavailable =
                !entity || entity.state === 'unavailable' || entity.state === 'unknown';
              const isHome = !isUnavailable && String(entity.state ?? '').toLowerCase() === 'home';
              const name =
                item.name ||
                (entity?.attributes.friendly_name as string | undefined) ||
                item.entity ||
                'Persona';
              const location = this._formatLocation(entity);
              const clickable = (item.tap_action ?? 'more-info') !== 'none' && Boolean(item.entity);
              const hasPicture =
                !item.icon &&
                Boolean(
                  item.image?.trim() ||
                    (entity?.attributes.entity_picture as string | undefined)?.trim(),
                );
              const isLight = this.hass?.themes?.darkMode === false;

              return html`
                <button
                  type="button"
                  class="person-item ${isUnavailable ? 'is-dimmed' : ''} ${clickable ? 'is-clickable' : ''}"
                  @click=${() => this._onItemTap(item)}
                >
                  <span class="avatar-wrap" aria-hidden="true">
                    <span
                      class="avatar-circle ${isHome ? 'is-home' : ''} ${hasPicture ? 'has-picture' : ''} ${isLight ? 'is-light' : 'is-dark'}"
                    >
                      ${this._renderAvatar(item, entity, isHome)}
                    </span>
                    ${showPresence && isHome
                      ? html`<span class="presence-dot"></span>`
                      : nothing}
                  </span>

                  <span class="text-col">
                    <span class="primary-name">${name}</span>
                    <span class="secondary-location">${location}</span>
                  </span>
                </button>
              `;
            })}
      </div>
    `;

    if (transparent) {
      return content;
    }

    return html`<ha-card>${content}</ha-card>`;
  }

  static styles = [
    m3eBaseStyles,
    css`
      :host {
        display: block;
        width: 100%;
      }

      ha-card {
        border-radius: var(--m3e-shape-card, 28px);
        overflow: hidden;
      }

      /* =====================================================================
         LAYOUT MODES: scroll | row | list
         ===================================================================== */
      .people-container.is-transparent {
        padding: 4px 2px;
      }

      .people-container.is-card {
        padding: 14px 18px;
      }

      /* 1. Horizontal Scrollable (At a Glance mirror) */
      .people-container.layout-scroll {
        display: flex;
        align-items: center;
        gap: 26px;
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: none;
        -ms-overflow-style: none;
        scroll-snap-type: x proximity;
        touch-action: pan-x;
        -webkit-overflow-scrolling: touch;
      }

      .people-container.layout-scroll::-webkit-scrollbar {
        display: none;
      }

      .people-container.layout-scroll.size-compact {
        gap: 18px;
      }

      .people-container.layout-scroll .person-item {
        flex: 0 0 auto;
        scroll-snap-align: start;
      }

      /* 2. Full-Row Adaptive Grid (no horizontal scroll, occupies full width) */
      .people-container.layout-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(132px, 1fr));
        gap: 14px 16px;
        align-items: center;
      }

      .people-container.layout-row.size-compact {
        grid-template-columns: repeat(auto-fit, minmax(108px, 1fr));
        gap: 10px 12px;
      }

      .people-container.layout-row .person-item {
        width: 100%;
        min-width: 0;
      }

      /* 3. Vertical Full-Width List */
      .people-container.layout-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .people-container.layout-list.size-compact {
        gap: 6px;
      }

      .people-container.layout-list .person-item {
        width: 100%;
        padding: 8px 12px;
        border-radius: 20px;
        background: var(--md-sys-color-surface-container-low, transparent);
      }

      .people-container.layout-list .person-item.is-clickable:hover {
        background: var(--md-sys-color-surface-container, rgba(128, 128, 128, 0.1));
      }

      /* =====================================================================
         PERSON ITEM (Image -> Name -> Location)
         ===================================================================== */
      .person-item {
        display: inline-flex;
        align-items: center;
        gap: 14px;
        border: none;
        background: transparent;
        padding: 4px 6px 4px 2px;
        margin: 0;
        border-radius: 9999px;
        text-align: left;
        font-family: inherit;
        color: inherit;
        transition:
          transform 200ms var(--m3e-spring-fast, cubic-bezier(0.2, 0, 0, 1)),
          background-color 180ms ease;
        -webkit-tap-highlight-color: transparent;
      }

      .size-compact .person-item {
        gap: 10px;
        padding: 2px 4px 2px 2px;
      }

      .person-item.is-clickable {
        cursor: pointer;
      }

      .person-item.is-clickable:active {
        transform: scale(0.96);
      }

      .person-item.is-dimmed {
        opacity: 0.6;
      }

      .avatar-wrap {
        position: relative;
        flex-shrink: 0;
        display: inline-flex;
      }

      .avatar-circle {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(
          --md-sys-color-surface-container-highest,
          var(--secondary-background-color, rgba(128, 128, 128, 0.16))
        );
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color, #444746));
        transition: background-color 180ms ease;
      }

      .size-compact .avatar-circle {
        width: 36px;
        height: 36px;
      }

      .avatar-circle.is-home {
        background: var(
          --md-sys-color-primary-container,
          var(--md-sys-color-surface-container-highest, rgba(128, 128, 128, 0.2))
        );
        color: var(--md-sys-color-on-primary-container, var(--primary-text-color));
      }

      /* Light mode: ensure transparent light-colored silhouette PNGs keep crisp contrast
         without affecting opaque user photos (which fully cover the circle background). */
      .avatar-circle.has-picture.is-light {
        background: color-mix(
          in srgb,
          var(--md-sys-color-on-surface-variant, #444746) 72%,
          var(--md-sys-color-surface, #ffffff)
        );
      }

      .avatar-circle.has-picture.is-light.is-home {
        background: var(--md-sys-color-primary, #4285f4);
      }

      .avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .avatar-circle svg {
        width: 24px;
        height: 24px;
        display: block;
      }

      .size-compact .avatar-circle svg {
        width: 20px;
        height: 20px;
      }

      .avatar-circle ha-icon {
        --mdc-icon-size: 23px;
        line-height: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .size-compact .avatar-circle ha-icon {
        --mdc-icon-size: 19px;
      }

      .presence-dot {
        position: absolute;
        right: -1px;
        bottom: -1px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--md-sys-color-primary, #4285f4);
        border: 2px solid var(--md-sys-color-surface, var(--lovelace-background, #141416));
        box-sizing: border-box;
      }

      .size-compact .presence-dot {
        width: 10px;
        height: 10px;
      }

      .text-col {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 2px;
        min-width: 0;
        flex: 1 1 auto;
      }

      .size-compact .text-col {
        gap: 1px;
      }

      .primary-name {
        font-size: 16px;
        font-weight: 500;
        line-height: 1.2;
        letter-spacing: -0.005em;
        color: var(--md-sys-color-on-surface, var(--primary-text-color));
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .size-compact .primary-name {
        font-size: 14px;
      }

      .secondary-location {
        font-size: 13.5px;
        font-weight: 400;
        line-height: 1.22;
        letter-spacing: 0.01em;
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .size-compact .secondary-location {
        font-size: 12px;
      }

      .empty-hint {
        font-size: 13px;
        color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color));
        padding: 10px 6px;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-people-card': M3EPeopleCard;
  }
}
