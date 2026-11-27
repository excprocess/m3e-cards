import { LitElement, css, html, nothing, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import '../editors/m3e-popup-card-editor';
import { m3eBaseStyles } from '../styles/m3e-tokens';
import type {
  HassEntity,
  HomeAssistant,
  LovelaceCardConfig,
  M3EPopupCardConfig,
} from '../types/home-assistant';
import { renderM3EntityIcon } from '../utils/icons';
import { resolveEntityName } from '../utils/entity-display';
import { animateDialogClose, animateDialogOpen } from '../utils/dialog-motion';
import { guardDialogTouchMove } from '../utils/scroll-lock';
import {
  normalizePopupTarget,
  registerPopupTarget,
  unregisterPopupTarget,
} from '../utils/navigation';

interface HACardElement extends HTMLElement {
  hass?: HomeAssistant;
  setConfig?: (config: LovelaceCardConfig) => void;
}

interface HACardHelpers {
  createCardElement: (config: LovelaceCardConfig) => Promise<HACardElement> | HACardElement;
}

const ACTIVE_STATES = new Set([
  'on',
  'open',
  'opening',
  'unlocked',
  'playing',
  'heat',
  'heating',
  'cool',
  'cooling',
  'home',
  'active',
  'true',
]);

@customElement('m3e-popup-card')
export class M3EPopupCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3EPopupCardConfig;
  @state() private _isOpen = false;
  @state() private _isEditMode = false;

  @query('dialog.m3e-popup-dialog') private _dialogEl?: HTMLDialogElement;
  @query('.dialog-surface') private _surfaceEl?: HTMLElement;
  @query('.cards-host') private _cardsHostEl?: HTMLElement;
  @query('.stack-portal') private _stackPortalEl?: HTMLElement;

  private _registeredTarget = '';
  private _cardElements: HACardElement[] = [];
  private _lastCardsJson = '';
  private _adoptedSiblings: Array<{ el: HTMLElement; parent: Node; nextSibling: Node | null }> = [];
  private _hiddenStackSiblings: HTMLElement[] = [];

  public static getStubConfig(): M3EPopupCardConfig {
    return {
      type: 'custom:m3e-popup-card',
      hash: '#popup',
      name: 'Pop-up',
      show_header_button: true,
      show_state: true,
      cards: [],
    };
  }

  public static getConfigElement(): HTMLElement {
    return document.createElement('m3e-popup-card-editor');
  }

  public setConfig(config: M3EPopupCardConfig): void {
    if (!config) {
      throw new Error('m3e-popup-card: invalid configuration');
    }
    this._config = {
      show_header_button: true,
      show_state: true,
      ...config,
      hash: config.hash || '#popup',
    };
    this._syncRegistration();
  }

  public getCardSize(): number {
    return this._isEditMode ? 2 : 0;
  }

  public getGridOptions() {
    if (this._isEditMode) {
      return { columns: 12, min_columns: 6, rows: 1 };
    }
    return { columns: 12, rows: 0 };
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this._syncRegistration();
    this._checkEditMode();
    window.addEventListener('hashchange', this._onLocationChange);
    window.addEventListener('popstate', this._onLocationChange);
    window.addEventListener('location-changed', this._onLocationChange);
    window.addEventListener('m3e-popup-open', this._onPopupOpenEvent as EventListener);
    requestAnimationFrame(() => {
      this._checkEditMode();
      this._syncStackVisibility();
      this._checkTriggerMatch();
    });
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    unregisterPopupTarget(this._registeredTarget);
    this._registeredTarget = '';
    this._restoreAdoptedSiblings();
    this._unhideStackSiblings();
    window.removeEventListener('hashchange', this._onLocationChange);
    window.removeEventListener('popstate', this._onLocationChange);
    window.removeEventListener('location-changed', this._onLocationChange);
    window.removeEventListener('m3e-popup-open', this._onPopupOpenEvent as EventListener);
  }

  private _syncRegistration(): void {
    const next = normalizePopupTarget(this._config?.hash);
    if (next !== this._registeredTarget) {
      unregisterPopupTarget(this._registeredTarget);
      this._registeredTarget = registerPopupTarget(next);
    }
  }

  private _checkEditMode(): void {
    const urlEdit = window.location.search.includes('edit=1');
    let domEdit = false;
    let node: Node | null = this;
    while (node) {
      if (node instanceof HTMLElement) {
        const tag = node.tagName.toLowerCase();
        if (
          tag === 'hui-card-preview' ||
          tag === 'hui-dialog-edit-card' ||
          tag === 'hui-card-edit-mode' ||
          node.classList.contains('edit-mode')
        ) {
          domEdit = true;
          break;
        }
      }
      node = node.parentNode ?? (node instanceof ShadowRoot ? node.host : null);
    }
    const nextEdit = urlEdit || domEdit;
    if (nextEdit !== this._isEditMode) {
      this._isEditMode = nextEdit;
      if (nextEdit) {
        this._restoreAdoptedSiblings();
        this._unhideStackSiblings();
      } else {
        this._syncStackVisibility();
      }
    }
  }

  private _findVerticalStackRoot(): HTMLElement | null {
    // Bubble Card pattern: find enclosing hui-vertical-stack-card #root if we are its first card
    const hostCard = this.parentElement;
    if (!hostCard) return null;
    const stackRoot = hostCard.parentElement;
    if (!stackRoot) return null;
    const rootNode = stackRoot.getRootNode();
    if (
      rootNode instanceof ShadowRoot &&
      rootNode.host?.tagName.toLowerCase() === 'hui-vertical-stack-card'
    ) {
      if (stackRoot.firstElementChild === hostCard) {
        return stackRoot;
      }
    }
    return null;
  }

  private _syncStackVisibility(): void {
    if (this._isEditMode || this._isOpen) {
      this._unhideStackSiblings();
      return;
    }
    const stackRoot = this._findVerticalStackRoot();
    if (!stackRoot) return;
    const children = Array.from(stackRoot.children).slice(1) as HTMLElement[];
    this._hiddenStackSiblings = children;
    for (const el of children) {
      el.style.display = 'none';
    }
  }

  private _unhideStackSiblings(): void {
    for (const el of this._hiddenStackSiblings) {
      el.style.display = '';
    }
    this._hiddenStackSiblings = [];
  }

  private _adoptStackSiblings(): void {
    if (this._adoptedSiblings.length > 0 || !this._stackPortalEl) return;
    const stackRoot = this._findVerticalStackRoot();
    if (!stackRoot) return;
    const siblings = Array.from(stackRoot.children).slice(1) as HTMLElement[];
    for (const el of siblings) {
      this._adoptedSiblings.push({
        el,
        parent: stackRoot,
        nextSibling: el.nextSibling,
      });
      el.style.display = '';
      this._stackPortalEl.appendChild(el);
    }
  }

  private _restoreAdoptedSiblings(): void {
    if (this._adoptedSiblings.length === 0) return;
    for (const rec of this._adoptedSiblings) {
      if (rec.nextSibling && rec.nextSibling.parentNode === rec.parent) {
        rec.parent.insertBefore(rec.el, rec.nextSibling);
      } else {
        rec.parent.appendChild(rec.el);
      }
    }
    this._adoptedSiblings = [];
  }

  private _onLocationChange = (): void => {
    this._checkEditMode();
    this._checkTriggerMatch();
  };

  private _onPopupOpenEvent = (e: CustomEvent<{ target?: string }>): void => {
    const incoming = normalizePopupTarget(e.detail?.target);
    const mine = normalizePopupTarget(this._config?.hash);
    if (incoming && mine && incoming === mine) {
      void this.openPopup();
    }
  };

  private _checkTriggerMatch(): void {
    if (this._isEditMode) return;
    const mine = normalizePopupTarget(this._config?.hash);
    if (!mine) return;

    const currentHash = window.location.hash.trim().toLowerCase();
    const currentPath = window.location.pathname.trim().toLowerCase();
    const currentFull = `${currentPath}${currentHash}`;

    const matches =
      (mine.startsWith('#') && currentHash === mine) ||
      (mine.startsWith('/') && (currentPath === mine || currentFull === mine));

    if (matches && !this._isOpen) {
      void this.openPopup();
    } else if (!matches && this._isOpen && mine.startsWith('#')) {
      this.closePopup(false);
    }
  }

  public async openPopup(): Promise<void> {
    if (this._isOpen) return;
    this._isOpen = true;
    await this.updateComplete;
    await this._syncEmbeddedCards();
    this._adoptStackSiblings();

    const dlg = this._dialogEl;
    if (dlg && !dlg.open) {
      dlg.showModal();
    }
    if (this._surfaceEl) {
      animateDialogOpen(this._surfaceEl);
    }
  }

  public closePopup(clearUrlHash = true): void {
    if (!this._isOpen) return;
    const finish = () => {
      if (this._dialogEl?.open) this._dialogEl.close();
      this._restoreAdoptedSiblings();
      this._isOpen = false;
      this._syncStackVisibility();
      if (clearUrlHash) {
        const mine = normalizePopupTarget(this._config?.hash);
        if (mine.startsWith('#') && window.location.hash.trim().toLowerCase() === mine) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }
    };

    if (this._dialogEl && this._surfaceEl) {
      animateDialogClose(this._dialogEl, this._surfaceEl, finish);
    } else {
      finish();
    }
  }

  private async _syncEmbeddedCards(): Promise<void> {
    const cardsCfg = this._config?.cards ?? [];
    const json = JSON.stringify(cardsCfg);
    if (json !== this._lastCardsJson) {
      this._lastCardsJson = json;
      const helpers = await (
        window as unknown as { loadCardHelpers?: () => Promise<HACardHelpers> }
      ).loadCardHelpers?.();

      const nextEls: HACardElement[] = [];
      for (const cfg of cardsCfg) {
        try {
          let el: HACardElement | null = null;
          if (helpers?.createCardElement) {
            el = await helpers.createCardElement(cfg);
          } else if (cfg.type?.startsWith('custom:')) {
            const tag = cfg.type.slice(7);
            el = document.createElement(tag) as HACardElement;
            el.setConfig?.(cfg);
          }
          if (el) {
            if (this.hass) el.hass = this.hass;
            nextEls.push(el);
          }
        } catch {
          // ignore malformed child card config
        }
      }
      this._cardElements = nextEls;
    }

    if (this._cardsHostEl) {
      const existing = Array.from(this._cardsHostEl.children);
      const same =
        existing.length === this._cardElements.length &&
        existing.every((el, idx) => el === this._cardElements[idx]);
      if (!same) {
        this._cardsHostEl.replaceChildren(...this._cardElements);
      }
    }

    if (this.hass) {
      for (const el of this._cardElements) {
        el.hass = this.hass;
      }
    }
  }

  protected updated(changedProps: PropertyValues): void {
    if (this._isOpen && (changedProps.has('hass') || changedProps.has('_config') || changedProps.has('_isOpen'))) {
      void this._syncEmbeddedCards();
    }
  }

  private get _entity(): HassEntity | undefined {
    if (!this.hass || !this._config?.entity) return undefined;
    return this.hass.states[this._config.entity];
  }

  private get _isEntityActive(): boolean {
    const st = String(this._entity?.state ?? '').toLowerCase();
    return ACTIVE_STATES.has(st);
  }

  private _onHeaderActionClick(): void {
    if (!this.hass || !this._config?.entity) return;
    const eid = this._config.entity;
    const domain = eid.split('.')[0];
    navigator.vibrate?.(10);

    if (domain === 'button' || domain === 'input_button') {
      this.hass.callService(domain, 'press', { entity_id: eid });
      return;
    }
    if (domain === 'script' || domain === 'scene') {
      this.hass.callService(domain, 'turn_on', { entity_id: eid });
      return;
    }
    if (domain === 'lock') {
      const locked = this._entity?.state === 'locked';
      this.hass.callService('lock', locked ? 'unlock' : 'lock', { entity_id: eid });
      return;
    }
    if (
      [
        'light',
        'switch',
        'fan',
        'input_boolean',
        'cover',
        'media_player',
        'climate',
        'remote',
        'humidifier',
      ].includes(domain)
    ) {
      this.hass.callService(domain, 'toggle', { entity_id: eid });
      return;
    }

    this.dispatchEvent(
      new CustomEvent('hass-more-info', {
        bubbles: true,
        composed: true,
        detail: { entityId: eid },
      }),
    );
  }

  private _renderHeaderIcon() {
    const ent = this._entity;
    const customIcon = this._config?.icon?.trim();
    if (customIcon && typeof customElements !== 'undefined' && customElements.get('ha-icon')) {
      return html`<ha-icon .icon=${customIcon}></ha-icon>`;
    }
    if (this._config?.use_entity_icon && ent && typeof customElements !== 'undefined') {
      if (customElements.get('ha-state-icon')) {
        return html`<ha-state-icon .hass=${this.hass} .stateObj=${ent}></ha-state-icon>`;
      }
      if (ent.attributes.icon && customElements.get('ha-icon')) {
        return html`<ha-icon .icon=${ent.attributes.icon}></ha-icon>`;
      }
    }
    return renderM3EntityIcon(ent, this._isEntityActive);
  }

  protected render() {
    if (!this._config) return nothing;

    const ent = this._entity;
    const isActive = this._isEntityActive;
    const title =
      resolveEntityName(this.hass, ent, this._config.name) ||
      this._config.hash ||
      'Pop-up';
    const showHeaderBtn = Boolean(this._config.entity) && this._config.show_header_button !== false;
    const showState = Boolean(ent) && this._config.show_state !== false;
    const stateLabel =
      showState && ent
        ? this.hass && typeof this.hass.formatEntityState === 'function'
          ? this.hass.formatEntityState(ent)
          : String(ent.state ?? '')
        : '';
    const cardCount = this._config.cards?.length ?? 0;

    return html`
      ${this._isEditMode
        ? html`
            <ha-card class="edit-banner">
              <div class="edit-left">
                ${showHeaderBtn
                  ? html`
                      <span class="header-action-btn ${isActive ? 'is-active' : ''}">
                        ${this._renderHeaderIcon()}
                      </span>
                    `
                  : html`
                      <span class="header-action-btn">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            fill="currentColor"
                            d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 16H5V7h14v12Z"
                          />
                        </svg>
                      </span>
                    `}
                <div class="edit-meta">
                  <span class="edit-title">${title}</span>
                  <span class="edit-sub">
                    M3E Pop-up · <code>${this._config.hash || '#popup'}</code>
                    ${cardCount > 0 ? ` · ${cardCount} card` : ''}
                  </span>
                </div>
              </div>
              <button
                type="button"
                class="preview-btn"
                @click=${() => void this.openPopup()}
              >
                Anteprima
              </button>
            </ha-card>
          `
        : nothing}

      <dialog
        class="m3e-popup-dialog"
        @click=${(e: MouseEvent) => {
          if (e.target === this._dialogEl) this.closePopup(true);
        }}
        @cancel=${(e: Event) => {
          e.preventDefault();
          this.closePopup(true);
        }}
        @touchmove=${guardDialogTouchMove}
      >
        <div class="dialog-surface">
          <header class="dialog-header">
            ${showHeaderBtn
              ? html`
                  <button
                    type="button"
                    class="header-action-btn is-clickable ${isActive ? 'is-active' : ''}"
                    aria-label=${title}
                    aria-pressed=${String(isActive)}
                    @click=${() => this._onHeaderActionClick()}
                  >
                    ${this._renderHeaderIcon()}
                  </button>
                `
              : nothing}

            <div class="dialog-title-wrap">
              <span class="dialog-title">${title}</span>
              ${stateLabel ? html`<span class="dialog-sub">${stateLabel}</span>` : nothing}
            </div>

            <button
              type="button"
              class="close-btn"
              aria-label="Chiudi"
              @click=${() => this.closePopup(true)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"
                />
              </svg>
            </button>
          </header>

          <div class="popup-body">
            <div class="cards-host"></div>
            <div class="stack-portal"></div>
          </div>
        </div>
      </dialog>
    `;
  }

  static styles = [
    m3eBaseStyles,
    css`
      :host {
        display: block;
        height: auto;
      }

      /* Edit mode placeholder banner */
      ha-card.edit-banner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 14px;
        border-radius: 24px;
        background: var(--md-sys-color-surface-container-low, #1c1d22);
        border: 1px dashed var(--md-sys-color-outline-variant, #44464f);
        box-shadow: none;
      }

      .edit-left {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
      }

      .edit-meta {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .edit-title {
        font-size: 15px;
        font-weight: 600;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .edit-sub {
        font-size: 12px;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .edit-sub code {
        font-family: ui-monospace, monospace;
        padding: 1px 6px;
        border-radius: 6px;
        background: var(--md-sys-color-surface-container-high, #282930);
      }

      .preview-btn {
        flex: 0 0 auto;
        height: 36px;
        padding: 0 14px;
        border: 0;
        border-radius: var(--m3e-corner-full);
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
        font: inherit;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
      }

      /* Unified M3E Popup Dialog Shell (matches Status Card & Light Group compact popup) */
      dialog.m3e-popup-dialog {
        margin: auto;
        padding: 0;
        border: 0;
        background: transparent;
        overflow: visible;
        width: min(460px, calc(100vw - 24px));
        max-width: min(460px, calc(100vw - 24px));
        max-height: calc(100dvh - 24px);
        overscroll-behavior: contain;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      dialog.m3e-popup-dialog::backdrop {
        background: color-mix(in srgb, var(--md-sys-color-scrim, #000000) 58%, transparent);
        transition: opacity 220ms ease;
      }

      dialog.m3e-popup-dialog.is-closing::backdrop {
        opacity: 0;
      }

      .dialog-surface {
        position: relative;
        background: var(--md-sys-color-surface, #131316);
        color: var(--md-sys-color-on-surface, #e3e2e6);
        border-radius: 32px;
        padding: 20px 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        max-height: calc(100dvh - 24px);
        overflow-y: auto;
        overflow-x: hidden;
        overscroll-behavior: contain;
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.36);
      }

      @media (max-width: 600px) {
        dialog.m3e-popup-dialog {
          margin: auto 0 0 0;
          width: 100vw;
          max-width: 100vw;
          max-height: 92dvh;
          border-radius: 28px 28px 0 0;
          overflow: hidden;
        }

        .dialog-surface {
          border-radius: 28px 28px 0 0;
          max-height: 92dvh;
          box-shadow: none;
          padding: 18px 16px calc(24px + env(safe-area-inset-bottom, 0px));
        }
      }

      .dialog-header {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .header-action-btn {
        flex: 0 0 44px;
        width: 44px;
        height: 44px;
        border: 0;
        padding: 0;
        border-radius: 50%;
        background: var(--md-sys-color-surface-container-high, #282930);
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        display: grid;
        place-items: center;
        transition:
          transform var(--m3e-spring-spatial-fast),
          border-radius var(--m3e-spring-bouncy),
          background-color var(--m3e-spring-effects-default),
          color var(--m3e-spring-effects-default);
      }

      .header-action-btn.is-clickable {
        cursor: pointer;
      }

      .header-action-btn.is-active {
        border-radius: 14px;
        background: var(--md-sys-color-primary-container, #364067);
        color: var(--md-sys-color-on-primary-container, #dce2ff);
      }

      .header-action-btn.is-clickable:active {
        transform: scale(0.92);
      }

      .header-action-btn svg,
      .header-action-btn ha-icon,
      .header-action-btn ha-state-icon {
        width: 22px;
        height: 22px;
        --mdc-icon-size: 22px;
      }

      .dialog-title-wrap {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 1px;
      }

      .dialog-title {
        font-size: 20px;
        font-weight: 500;
        line-height: 24px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .dialog-sub {
        font-size: 12.5px;
        font-weight: 500;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .close-btn {
        flex: 0 0 44px;
        width: 44px;
        height: 44px;
        border: 0;
        padding: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        cursor: pointer;
        transition:
          background-color var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
      }

      .close-btn:hover {
        background: color-mix(in srgb, currentColor 8%, transparent);
      }

      .close-btn:active {
        transform: scale(0.92);
      }

      .close-btn svg {
        width: 22px;
        height: 22px;
      }

      /* Popup Body: unified elevated surface tokens for all child cards */
      .popup-body {
        display: flex;
        flex-direction: column;
        gap: 12px;
        --ha-card-background: var(--md-sys-color-surface-container-high, #24252d);
        --ha-card-box-shadow: none;
        --ha-card-border-width: 0px;
        --m3e-card-border-radius: 24px;
      }

      .cards-host,
      .stack-portal {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .cards-host:empty,
      .stack-portal:empty {
        display: none;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-popup-card': M3EPopupCard;
  }
}
