import { LitElement, css, html, nothing, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { m3eBaseStyles } from '../styles/m3e-tokens';
import type { HassEntity, HomeAssistant, M3ELightGroupCardConfig } from '../types/home-assistant';
import { guardDialogTouchMove } from '../utils/scroll-lock';
import { animateDialogClose, animateDialogOpen } from '../utils/dialog-motion';
import { resolveEntityName, resolveStateContent } from '../utils/entity-display';
import './m3e-light-card';

const DRAG_THRESHOLD_PX = 8;

@customElement('m3e-light-group-card')
export class M3ELightGroupCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: M3ELightGroupCardConfig;
  @state() private _expanded = false;
  @state() private _popupOpen = false;
  @state() private _dragging = false;
  @state() private _pressed = false;
  @state() private _dragPct: number | null = null;

  @query('dialog.group-dialog') private _dialogEl?: HTMLDialogElement;
  @query('.group-header') private _headerEl?: HTMLElement;

  private _pointerId: number | null = null;
  private _pointerStartX = 0;
  private _pointerStartY = 0;
  private _hasMoved = false;
  private _prevStates: Record<string, HassEntity | undefined> = {};

  public static getStubConfig(hass?: HomeAssistant): M3ELightGroupCardConfig {
    const firstGroup = hass
      ? Object.values(hass.states).find(
          (e) =>
            e.entity_id.startsWith('light.') &&
            Array.isArray(e.attributes.entity_id) &&
            (e.attributes.entity_id as string[]).length > 0,
        )?.entity_id
      : undefined;
    return {
      type: 'custom:m3e-light-group-card',
      entity: firstGroup ?? 'light.living_room_group',
      expanded: false,
      use_light_color: true,
    };
  }

  public static getConfigForm() {
    return {
      schema: [
        { name: 'entity', required: true, selector: { entity: { domain: 'light' } } },
        {
          type: 'expandable',
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
            { name: 'hide_state', selector: { boolean: {} } },
            {
              name: 'state_content',
              selector: { ui_state_content: { allow_name: false } },
              context: { filter_entity: 'entity' },
            },
            { name: 'use_light_color', selector: { boolean: {} } },
          ],
        },
        {
          type: 'expandable',
          icon: 'mdi:gesture-tap',
          title: 'Interactions',
          schema: [
            { name: 'compact', selector: { boolean: {} } },
            { name: 'expanded', selector: { boolean: {} } },
          ],
        },
      ],
      computeLabel: (schema: { name: string }) => {
        const labels: Record<string, string> = {
          entity: 'Gruppo luci (entità light con luci figlie)',
          name: 'Nome',
          icon: 'Icona personalizzata (vuoto = lampade Google Home)',
          hide_state: 'Nascondi stato',
          state_content: 'Contenuto stato (stato / attributi)',
          compact: 'Modalità compatta (mezza larghezza con popup)',
          expanded: 'Espanso di default (solo modalità estesa)',
          use_light_color: 'Usa colore reale delle luci',
          card_style: 'Design della pillola (Material 3)',
        };
        return labels[schema.name] ?? schema.name;
      },
    };
  }

  public setConfig(config: M3ELightGroupCardConfig): void {
    if (!config || !config.entity) {
      throw new Error('m3e-light-group-card: you must define a light group entity');
    }
    this._config = {
      compact: false,
      expanded: false,
      use_light_color: true,
      card_style: 'default',
      ...config,
    };
    this._expanded = !this._config.compact && Boolean(this._config.expanded);
  }

  public getCardSize(): number {
    if (this._config?.compact) return 2;
    return this._expanded ? 4 : 2;
  }

  public getGridOptions() {
    const isCompact = Boolean(this._config?.compact);
    return { rows: 'auto', columns: isCompact ? 6 : 12, min_columns: 6 };
  }

  private get _groupEntity(): HassEntity | undefined {
    if (!this.hass || !this._config) return undefined;
    return this.hass.states[this._config.entity];
  }

  private get _childEntityIds(): string[] {
    const raw = this._groupEntity?.attributes.entity_id;
    if (!Array.isArray(raw)) return [];
    return raw.filter((id): id is string => typeof id === 'string' && id.startsWith('light.'));
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (
      changedProps.has('_config') ||
      changedProps.has('_expanded') ||
      changedProps.has('_popupOpen') ||
      changedProps.has('_dragging') ||
      changedProps.has('_pressed') ||
      changedProps.has('_dragPct')
    ) {
      return true;
    }

    if (changedProps.has('hass') && this._config && this.hass) {
      const watched = [this._config.entity, ...this._childEntityIds];
      let changed = false;
      for (const id of watched) {
        const next = this.hass.states[id];
        if (next !== this._prevStates[id]) {
          this._prevStates[id] = next;
          changed = true;
        }
      }
      return changed;
    }
    return false;
  }

  private get _aggregateStats() {
    const group = this._groupEntity;
    const childIds = this._childEntityIds;
    const children = childIds
      .map((id) => this.hass?.states[id])
      .filter((e): e is HassEntity => Boolean(e));

    const onChildren = children.filter((e) => e.state === 'on');
    const onCount =
      children.length > 0 ? onChildren.length : group?.state === 'on' ? 1 : 0;

    let avgPct = 0;
    if (this._dragging && this._dragPct !== null) {
      avgPct = this._dragPct;
    } else if (onChildren.length > 0) {
      const pcts = onChildren.map((e) =>
        typeof e.attributes.brightness === 'number'
          ? Math.max(1, Math.round((e.attributes.brightness / 255) * 100))
          : 100,
      );
      avgPct = Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
    } else if (group?.state === 'on') {
      const b = group.attributes.brightness;
      avgPct = typeof b === 'number' ? Math.max(1, Math.round((b / 255) * 100)) : 100;
    }

    const isOn = this._dragging && this._dragPct !== null ? this._dragPct > 0 : onCount > 0;
    const isUnavailable =
      !group || group.state === 'unavailable' || group.state === 'unknown';

    return { onCount, totalCount: children.length, avgPct, isOn, isUnavailable };
  }

  private _computeAccentCss(): string {
    if (this._config?.use_light_color === false) {
      return '--m3e-group-accent: var(--md-sys-color-primary, #4c5c92);';
    }
    const rgb = this._groupEntity?.attributes.rgb_color;
    if (Array.isArray(rgb) && rgb.length === 3) {
      const hex =
        '#' +
        rgb
          .map((v) => Math.max(0, Math.min(255, Math.round(Number(v)))).toString(16).padStart(2, '0'))
          .join('');
      return `--m3e-group-accent: ${hex};`;
    }
    return '--m3e-group-accent: #ffe066;';
  }

  private _computeHorizontalPct(clientX: number, el: HTMLElement): number {
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    return Math.round(Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) * 100);
  }

  private _emitGroupBrightness(pct: number): void {
    if (!this.hass || !this._config) return;
    if (pct <= 0) {
      this.hass.callService('light', 'turn_off', { entity_id: this._config.entity });
    } else {
      this.hass.callService('light', 'turn_on', {
        entity_id: this._config.entity,
        brightness_pct: pct,
      });
    }
  }

  private _onHeaderPointerDown = (e: PointerEvent): void => {
    if (e.button !== 0 || this._aggregateStats.isUnavailable) return;
    const el = e.currentTarget as HTMLElement;
    this._pointerId = e.pointerId;
    this._pointerStartX = e.clientX;
    this._pointerStartY = e.clientY;
    this._hasMoved = false;
    this._pressed = true;
    el.setPointerCapture(e.pointerId);
  };

  private _onHeaderPointerMove = (e: PointerEvent): void => {
    if (this._pointerId !== e.pointerId) return;
    const dx = Math.abs(e.clientX - this._pointerStartX);
    const dy = Math.abs(e.clientY - this._pointerStartY);

    if (!this._hasMoved) {
      if (dx < DRAG_THRESHOLD_PX && dy < DRAG_THRESHOLD_PX) return;
      if (dy > dx) {
        this._resetPointer(e.currentTarget as HTMLElement);
        return;
      }
      this._hasMoved = true;
      this._dragging = true;
    }

    const pct = this._computeHorizontalPct(e.clientX, e.currentTarget as HTMLElement);
    if (pct !== this._dragPct) {
      this._dragPct = pct;
    }
  };

  private _onHeaderPointerUp = (e: PointerEvent): void => {
    if (this._pointerId !== e.pointerId) return;
    const el = e.currentTarget as HTMLElement;
    if (this._hasMoved && this._dragPct !== null) {
      this._emitGroupBrightness(this._dragPct);
    } else if (this.hass && this._config) {
      this.hass.callService('light', 'toggle', { entity_id: this._config.entity });
    }
    this._resetPointer(el);
  };

  private _resetPointer(el?: HTMLElement): void {
    if (el && this._pointerId !== null && el.hasPointerCapture(this._pointerId)) {
      el.releasePointerCapture(this._pointerId);
    }
    this._pointerId = null;
    this._dragging = false;
    this._pressed = false;
    this._hasMoved = false;
    this._dragPct = null;
  }

  private _toggleExpand = (e: Event): void => {
    e.stopPropagation();
    if (this._config?.compact) {
      void this._openPopup();
      return;
    }
    this._expanded = !this._expanded;
  };

  private async _openPopup(): Promise<void> {
    const tileRect = this._headerEl?.getBoundingClientRect() ?? null;
    this._popupOpen = true;
    await this.updateComplete;
    if (this._dialogEl && !this._dialogEl.open) {
      this._dialogEl.showModal();
    }
    const surface = this.shadowRoot?.querySelector('.dialog-surface') as HTMLElement | null;
    animateDialogOpen(surface, tileRect);
  }

  private _closePopup(): void {
    const surface = this.shadowRoot?.querySelector('.dialog-surface') as HTMLElement | null;
    animateDialogClose(this._dialogEl, surface, () => {
      this._popupOpen = false;
    });
  }

  private _toggleGroupMaster(turnOn: boolean): void {
    if (!this.hass || !this._config) return;
    this.hass.callService('light', turnOn ? 'turn_on' : 'turn_off', {
      entity_id: this._config.entity,
    });
  }

  private _renderGroupIcon(customIcon?: string) {
    if (customIcon && typeof customElements !== 'undefined' && customElements.get('ha-icon')) {
      return html`<ha-icon .icon=${customIcon}></ha-icon>`;
    }
    // Google Home multi-light group icon (floor lamp + pendant)
    return html`
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M5 11h4.5l-1.2-5H6.2L5 11Zm2.25 1v6H5v2h6.5v-2H9.25v-6h-2ZM15 4v3.2a3.5 3.5 0 0 0-2.5 3.3h7A3.5 3.5 0 0 0 17 7.2V4h-2Zm-1.2 8a2.2 2.2 0 0 0 4.4 0h-4.4Z"
        />
      </svg>
    `;
  }

  protected render() {
    if (!this._config) return nothing;
    const group = this._groupEntity;
    const name = resolveEntityName(this.hass, group, this._config.name, this._config.entity);
    const customIcon = this._config.icon?.trim() || undefined;
    const childIds = this._childEntityIds;
    const { onCount, totalCount, avgPct, isOn, isUnavailable } = this._aggregateStats;

    const baseSubtitle = isUnavailable
      ? 'Offline'
      : this._dragging
        ? `${avgPct}%`
        : isOn
          ? totalCount > 1
            ? `${onCount} on · ${avgPct}%`
            : `On · ${avgPct}%`
          : 'Off';
    const hideState = Boolean(this._config.hide_state);
    const stateContentVal =
      !hideState && !this._dragging
        ? resolveStateContent(this.hass, group, this._config.state_content, baseSubtitle)
        : null;
    const subtitle = hideState && !this._dragging ? '' : (stateContentVal ?? baseSubtitle);

    const styleClass = `style-${this._config.card_style ?? 'default'}`;
    const accentCss = this._computeAccentCss();
    const isCompact = Boolean(this._config.compact);

    return html`
      <div class="group-wrapper ${isCompact ? 'is-compact' : ''}">
        <ha-card
          class="group-header ${styleClass} ${isCompact ? 'is-compact' : ''} ${isOn ? 'is-on' : 'is-off'} ${this._dragging ? 'is-dragging' : ''} ${this._pressed ? 'is-pressed' : ''} ${isUnavailable ? 'is-unavailable' : ''}"
          style="${accentCss} --fill-pct: ${isOn ? avgPct : 0}%;"
          role="slider"
          tabindex="0"
          aria-label=${name}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${avgPct}
          aria-valuetext=${subtitle}
          @pointerdown=${this._onHeaderPointerDown}
          @pointermove=${this._onHeaderPointerMove}
          @pointerup=${this._onHeaderPointerUp}
          @pointercancel=${(e: PointerEvent) => this._resetPointer(e.currentTarget as HTMLElement)}
        >
          <div class="header-track" aria-hidden="true">
            <div class="header-fill"></div>
          </div>
          <div class="state-layer" aria-hidden="true"></div>

          <div class="header-content">
            <span class="group-icon">${this._renderGroupIcon(customIcon)}</span>
            <div class="meta">
              <span class="title">${name}</span>
              ${subtitle ? html`<span class="subtitle">${subtitle}</span>` : nothing}
            </div>

            ${isUnavailable
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
              : childIds.length > 0
                ? html`
                    <button
                      type="button"
                      class="expand-btn ${isCompact ? 'is-compact-chevron' : ''} ${!isCompact && this._expanded ? 'is-expanded' : ''}"
                      aria-expanded=${isCompact ? String(this._popupOpen) : String(this._expanded)}
                      aria-label=${isCompact
                        ? 'Apri luci del gruppo'
                        : this._expanded
                          ? 'Collapse lights'
                          : 'Expand lights'}
                      @pointerdown=${(e: Event) => e.stopPropagation()}
                      @pointermove=${(e: Event) => e.stopPropagation()}
                      @pointerup=${(e: Event) => e.stopPropagation()}
                      @click=${this._toggleExpand}
                    >
                      ${isCompact
                        ? html`
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path
                                fill="currentColor"
                                d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.41 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01Z"
                              />
                            </svg>
                          `
                        : html`
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path
                                fill="currentColor"
                                d="M7.41 8.59a1 1 0 0 1 1.41 0L12 11.77l3.18-3.18a1 1 0 1 1 1.41 1.41l-3.88 3.88a1 1 0 0 1-1.42 0L7.41 10a1 1 0 0 1 0-1.41Z"
                              />
                            </svg>
                          `}
                    </button>
                  `
                : nothing}
          </div>
        </ha-card>

        ${!isCompact && childIds.length > 0
          ? html`
              <div class="group-grid-collapse ${this._expanded ? 'is-open' : ''}">
                <div class="group-grid-inner">
                  <div class="child-grid">
                    ${childIds.map(
                      (childId) => html`
                        <m3e-light-card
                          .hass=${this.hass}
                          ${ref(this._attachChildConfig(childId))}
                        ></m3e-light-card>
                      `,
                    )}
                  </div>
                </div>
              </div>
            `
          : nothing}
      </div>

      ${isCompact
        ? html`
            <dialog
              class="group-dialog"
              @click=${(e: MouseEvent) => {
                if (e.target === this._dialogEl) this._closePopup();
              }}
              @cancel=${(e: Event) => {
                e.preventDefault();
                this._closePopup();
              }}
              @touchmove=${(e: TouchEvent) => guardDialogTouchMove(e, this._dialogEl)}
            >
              ${this._popupOpen
                ? html`
                    <div class="dialog-surface">
                      <header class="dialog-header">
                        <button
                          type="button"
                          class="icon-btn"
                          @click=${() => this._closePopup()}
                          aria-label="Chiudi"
                        >
                          <svg viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"
                            />
                          </svg>
                        </button>

                        <div class="dialog-title-wrap">
                          <span class="dialog-title">${name}</span>
                          <span class="dialog-sub">${subtitle}</span>
                        </div>

                        <button
                          type="button"
                          class="m3-header-switch ${isOn ? 'is-on' : ''}"
                          role="switch"
                          aria-checked=${String(isOn)}
                          aria-label=${isOn ? 'Spegni tutte le luci' : 'Accendi tutte le luci'}
                          @click=${() => this._toggleGroupMaster(!isOn)}
                        >
                          <span class="m3-header-switch-thumb" aria-hidden="true"></span>
                        </button>
                      </header>

                      <div class="popup-child-grid">
                        ${childIds.map(
                          (childId) => html`
                            <m3e-light-card
                              .hass=${this.hass}
                              ${ref(this._attachChildConfig(childId))}
                            ></m3e-light-card>
                          `,
                        )}
                      </div>
                    </div>
                  `
                : nothing}
            </dialog>
          `
        : nothing}
    `;
  }

  private _attachChildConfig(childId: string) {
    return (el: Element | undefined) => {
      if (!el || !(el instanceof HTMLElement)) return;
      const card = el as HTMLElement & {
        setConfig: (c: unknown) => void;
        _m3eBoundId?: string;
        _m3eBoundStyle?: string;
        _m3eBoundColor?: boolean;
      };
      const style = this._config?.card_style ?? 'default';
      const useColor = this._config?.use_light_color ?? true;
      if (
        card._m3eBoundId !== childId ||
        card._m3eBoundStyle !== style ||
        card._m3eBoundColor !== useColor
      ) {
        card._m3eBoundId = childId;
        card._m3eBoundStyle = style;
        card._m3eBoundColor = useColor;
        card.setConfig({
          type: 'custom:m3e-light-card',
          entity: childId,
          use_light_color: useColor,
          card_style: style,
        });
      }
    };
  }

  static styles = [
    m3eBaseStyles,
    css`
      .group-wrapper {
        display: flex;
        flex-direction: column;
      }

      .group-header {
        min-height: 76px;
        cursor: pointer;
        touch-action: pan-y;
        outline: none;
        border-radius: var(--m3e-card-border-radius, 28px);
        transition:
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-default),
          border-color var(--m3e-spring-effects-default);
      }

      .group-header.is-on {
        background: color-mix(
          in srgb,
          var(--m3e-group-accent) 16%,
          var(--ha-card-background, var(--md-sys-color-surface-container-low, #1f1f24))
        );
      }

      .group-header.is-pressed:not(.is-dragging) {
        transform: scale(var(--m3e-press-scale-card, 0.978));
      }

      .group-header.is-compact.is-pressed:not(.is-dragging) {
        transform: scale(var(--m3e-press-scale-tile, 0.965));
      }

      .header-track {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      .header-fill {
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        width: var(--fill-pct, 0%);
        background: color-mix(
          in srgb,
          var(--m3e-group-accent) 34%,
          var(--ha-card-background, var(--md-sys-color-surface-container-low, #1f1f24))
        );
        transition:
          width var(--m3e-spring-spatial-default),
          background-color var(--m3e-spring-effects-default);
      }

      .group-header.is-dragging .header-fill {
        transition: background-color var(--m3e-spring-effects-default);
      }

      .state-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: currentColor;
        opacity: 0;
        transition: opacity var(--m3e-spring-effects-fast);
      }

      .group-header:hover .state-layer {
        opacity: 0.05;
      }

      .header-content {
        position: relative;
        z-index: 1;
        min-height: 76px;
        padding: 12px 12px 12px 14px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .group-icon {
        flex: 0 0 auto;
        width: 24px;
        height: 24px;
        display: grid;
        place-items: center;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        pointer-events: none;
      }

      .group-header.is-on .group-icon {
        color: color-mix(
          in srgb,
          var(--m3e-group-accent) 65%,
          var(--md-sys-color-on-surface, #ffffff)
        );
      }

      .group-icon ha-icon,
      .group-icon svg {
        width: 24px;
        height: 24px;
        --mdc-icon-size: 24px;
      }

      .meta {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
        pointer-events: none;
      }

      .title {
        font-size: 15px;
        font-weight: 600;
        line-height: 20px;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .subtitle {
        font-size: 13px;
        font-weight: 500;
        line-height: 18px;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
      }

      .group-header.is-on .title,
      .group-header.is-on .subtitle {
        color: color-mix(
          in srgb,
          var(--m3e-group-accent) 55%,
          var(--md-sys-color-on-surface, #ffffff)
        );
      }

      .expand-btn {
        position: relative;
        flex: 0 0 36px;
        width: 36px;
        height: 36px;
        border: 0;
        border-radius: var(--m3e-corner-full);
        display: grid;
        place-items: center;
        cursor: pointer;
        background: color-mix(
          in srgb,
          var(--md-sys-color-surface-container-lowest, #ffffff) 78%,
          transparent
        );
        color: var(--md-sys-color-on-surface, #1c1b18);
        transition:
          transform var(--m3e-spring-spatial-fast),
          background-color var(--m3e-spring-effects-fast);
      }

      /* Generous invisible touch hit-zone so tapping near the arrow never toggles the light */
      .expand-btn::before {
        content: '';
        position: absolute;
        inset: -16px -12px -16px -10px;
      }

      .expand-btn svg {
        width: 22px;
        height: 22px;
        transition: transform 320ms cubic-bezier(0.2, 0, 0, 1);
      }

      .expand-btn.is-expanded svg {
        transform: rotate(180deg);
      }

      .expand-btn:active {
        transform: scale(0.9);
      }

      /* Compact half-width tile variant (matches Google Home tile spacing) */
      .group-wrapper.is-compact {
        height: 100%;
      }

      .group-header.is-compact {
        height: 100%;
        min-height: 84px;
      }

      .group-header.is-compact .header-content {
        height: 100%;
        min-height: 84px;
        padding: 12px 10px 12px 14px;
        gap: 8px;
      }

      .group-header.is-compact .title {
        white-space: normal;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height: 18px;
      }

      .expand-btn.is-compact-chevron {
        flex: 0 0 36px;
        width: 36px;
        height: 36px;
      }

      .expand-btn.is-compact-chevron::before {
        inset: -24px -10px -24px -10px;
      }

      .expand-btn.is-compact-chevron svg {
        width: 22px;
        height: 22px;
      }

      /* Smooth Expandable 2-Column Grid (with shadow breathing room at bottom & sides) */
      .group-grid-collapse {
        display: grid;
        grid-template-rows: 0fr;
        opacity: 0;
        transition:
          grid-template-rows 340ms cubic-bezier(0.2, 0, 0, 1),
          opacity 220ms cubic-bezier(0.2, 0, 0, 1);
      }

      .group-grid-collapse.is-open {
        grid-template-rows: 1fr;
        opacity: 1;
      }

      .group-grid-inner {
        overflow: hidden;
        margin-inline: -4px;
      }

      .child-grid {
        padding: 10px 4px 10px;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }

      /* =====================================================================
         COMPACT MODE POPUP DIALOG (Matches M3E Power Strip Popup)
         ===================================================================== */
      dialog.group-dialog {
        padding: 0;
        border: 0;
        background: transparent;
        max-width: 100vw;
        max-height: 100dvh;
        width: min(440px, calc(100vw - 24px));
        margin: auto;
        overflow: visible;
        color: var(--md-sys-color-on-surface, #e3e2e6);
      }

      dialog.group-dialog::backdrop {
        background: rgba(0, 0, 0, 0.48);
      }

      .dialog-surface {
        background: var(--md-sys-color-surface-container-low, #1b1b1f);
        border-radius: 32px;
        padding: 20px 20px 24px;
        box-shadow: var(--md-sys-elevation-level3, 0 12px 32px rgba(0, 0, 0, 0.35));
        max-height: 86dvh;
        overflow-y: auto;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
      }

      .dialog-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 18px;
      }

      .icon-btn {
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        border: 0;
        border-radius: 9999px;
        background: transparent;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        display: grid;
        place-items: center;
        cursor: pointer;
        padding: 0;
        transition:
          background-color var(--m3e-spring-effects-fast),
          transform var(--m3e-spring-spatial-fast);
      }

      .icon-btn:hover {
        background: color-mix(in srgb, currentColor 10%, transparent);
      }

      .icon-btn:active {
        transform: scale(0.92);
      }

      .icon-btn svg {
        width: 24px;
        height: 24px;
      }

      .dialog-title-wrap {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .dialog-title {
        font-size: 20px;
        font-weight: 500;
        line-height: 26px;
        color: var(--md-sys-color-on-surface, #e3e2e6);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .dialog-sub {
        font-size: 13px;
        font-weight: 400;
        line-height: 18px;
        color: var(--md-sys-color-on-surface-variant, #c4c6d0);
        font-variant-numeric: tabular-nums;
      }

      .m3-header-switch {
        position: relative;
        flex: 0 0 52px;
        width: 52px;
        height: 32px;
        padding: 0;
        border-radius: 9999px;
        border: 2px solid var(--md-sys-color-outline, #8e9099);
        background: var(--md-sys-color-surface-container-highest, #33353b);
        cursor: pointer;
        transition:
          background-color 220ms cubic-bezier(0.2, 0, 0, 1),
          border-color 220ms cubic-bezier(0.2, 0, 0, 1);
      }

      .m3-header-switch.is-on {
        border-color: var(--md-sys-color-primary, #bac3ff);
        background: var(--md-sys-color-primary, #bac3ff);
      }

      .m3-header-switch-thumb {
        position: absolute;
        top: 50%;
        left: 6px;
        width: 16px;
        height: 16px;
        border-radius: 9999px;
        background: var(--md-sys-color-outline, #8e9099);
        transform: translateY(-50%);
        transition:
          left 260ms var(--m3e-spring-spatial-fast),
          width 220ms cubic-bezier(0.2, 0, 0, 1),
          height 220ms cubic-bezier(0.2, 0, 0, 1),
          background-color 220ms cubic-bezier(0.2, 0, 0, 1);
      }

      .m3-header-switch.is-on .m3-header-switch-thumb {
        left: 22px;
        width: 24px;
        height: 24px;
        background: var(--md-sys-color-on-primary, #1f2b5a);
      }

      .popup-child-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }

      @media (max-width: 600px) {
        dialog.group-dialog {
          width: 100vw;
          margin: auto 0 0 0;
        }

        .dialog-surface {
          border-radius: 28px 28px 0 0;
          padding: 18px 16px calc(22px + env(safe-area-inset-bottom, 0px));
        }
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'm3e-light-group-card': M3ELightGroupCard;
  }
}
