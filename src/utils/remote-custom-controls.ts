import { css, html, nothing, TemplateResult } from 'lit';
import type {
  HomeAssistant,
  M3ERemoteButtonsConfig,
  M3ERemoteCustomControl,
} from '../types/home-assistant';
import {
  executeCustomRemoteAction,
  isCustomRemoteItemActive,
} from './remote-commands';

export const remoteCustomControlStyles = css`
  .custom-controls-stack {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .custom-btn-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .custom-btn-grid.is-single {
    grid-template-columns: 1fr;
  }

  .custom-remote-btn {
    height: 52px;
    padding: 0 16px;
    border: 0;
    border-radius: 20px;
    background: var(--md-sys-color-surface-container-high, #282930);
    color: var(--md-sys-color-on-surface, #e3e2e6);
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    overflow: hidden;
    transition:
      transform var(--m3e-spring-spatial-fast, 200ms cubic-bezier(0.2, 0, 0, 1)),
      border-radius var(--m3e-spring-bouncy, 420ms cubic-bezier(0.34, 1.4, 0.64, 1)),
      background-color var(--m3e-spring-effects-fast, 160ms ease),
      color var(--m3e-spring-effects-fast, 160ms ease);
    -webkit-tap-highlight-color: transparent;
  }

  .custom-remote-btn.is-active {
    border-radius: var(--m3e-corner-full, 9999px);
    background: var(--md-sys-color-primary-container, #364067);
    color: var(--md-sys-color-on-primary-container, #dce2ff);
    font-weight: 600;
  }

  .custom-remote-btn:hover:not(.is-active) {
    background: color-mix(
      in srgb,
      var(--md-sys-color-on-surface, #e3e2e6) 7%,
      var(--md-sys-color-surface-container-high, #282930)
    );
  }

  .custom-remote-btn:active {
    transform: scale(0.96);
  }

  .custom-remote-btn ha-icon {
    --mdc-icon-size: 20px;
    flex: 0 0 auto;
    display: inline-flex;
  }

  .custom-remote-btn-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Custom Segmented M3 Pill (2 or 3 segments with sliding tonal indicator) */
  .custom-seg-pill {
    position: relative;
    height: 52px;
    border-radius: var(--m3e-corner-full, 9999px);
    background: var(--md-sys-color-surface-container-high, #282930);
    display: grid;
    grid-template-columns: repeat(var(--seg-count, 2), minmax(0, 1fr));
    overflow: hidden;
  }

  .custom-seg-pill.has-active {
    padding: 4px;
  }

  .custom-seg-indicator {
    position: absolute;
    top: 4px;
    bottom: 4px;
    left: 4px;
    width: calc((100% - 8px) / var(--seg-count, 2));
    border-radius: var(--m3e-corner-full, 9999px);
    background: var(--md-sys-color-primary-container, #364067);
    transform: translateX(calc(var(--seg-idx, 0) * 100%));
    transition: transform var(--m3e-spring-spatial-fast, 240ms cubic-bezier(0.2, 0, 0, 1));
    pointer-events: none;
    z-index: 0;
  }

  .custom-seg-btn {
    position: relative;
    z-index: 1;
    border: 0;
    padding: 0 10px;
    border-radius: var(--m3e-corner-full, 9999px);
    background: transparent;
    color: var(--md-sys-color-on-surface, #e3e2e6);
    font: inherit;
    font-size: 13.5px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    cursor: pointer;
    overflow: hidden;
    transition:
      color var(--m3e-spring-effects-fast, 160ms ease),
      background-color var(--m3e-spring-effects-fast, 160ms ease),
      transform var(--m3e-spring-spatial-fast, 180ms ease);
    -webkit-tap-highlight-color: transparent;
  }

  .custom-seg-pill:not(.has-active) .custom-seg-btn + .custom-seg-btn::before {
    content: '';
    position: absolute;
    left: 0;
    top: 12px;
    bottom: 12px;
    width: 1px;
    background: var(--md-sys-color-outline-variant, #44464f);
    pointer-events: none;
  }

  .custom-seg-btn.is-selected {
    color: var(--md-sys-color-on-primary-container, #dce2ff);
    font-weight: 600;
  }

  .custom-seg-btn:hover:not(.is-selected) {
    background: color-mix(in srgb, currentColor 7%, transparent);
  }

  .custom-seg-btn:active {
    transform: scale(0.96);
  }

  .custom-seg-btn ha-icon {
    --mdc-icon-size: 18px;
    flex: 0 0 auto;
    display: inline-flex;
  }

  .custom-seg-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export function renderRemoteCustomControls(
  hass: HomeAssistant | undefined,
  primaryEntityId: string,
  controls: M3ERemoteCustomControl[] | undefined,
  manualButtons?: M3ERemoteButtonsConfig,
  defaultRemoteDevice?: string,
): TemplateResult | typeof nothing {
  if (!hass || !controls || controls.length === 0) return nothing;

  // Group consecutive single buttons into 2-column rows; render segmented pills full-width
  const blocks: Array<
    | { kind: 'buttons'; items: M3ERemoteCustomControl[] }
    | { kind: 'segmented'; item: M3ERemoteCustomControl }
  > = [];

  for (const ctrl of controls) {
    if (ctrl.type === 'segmented') {
      blocks.push({ kind: 'segmented', item: ctrl });
    } else {
      const last = blocks[blocks.length - 1];
      if (last && last.kind === 'buttons') {
        last.items.push(ctrl);
      } else {
        blocks.push({ kind: 'buttons', items: [ctrl] });
      }
    }
  }

  return html`
    <div class="custom-controls-stack">
      ${blocks.map((block) => {
        if (block.kind === 'buttons') {
          return html`
            <div class="custom-btn-grid ${block.items.length === 1 ? 'is-single' : ''}">
              ${block.items.map((btn) => {
                const active = isCustomRemoteItemActive(hass, primaryEntityId, btn, btn.state_entity);
                const label = btn.label?.trim() || btn.command || btn.player_action || btn.value || 'Button';
                return html`
                  <button
                    type="button"
                    class="custom-remote-btn ${active ? 'is-active' : ''}"
                    aria-pressed=${String(active)}
                    @click=${() => {
                      navigator.vibrate?.(10);
                      executeCustomRemoteAction(
                        hass,
                        primaryEntityId,
                        btn,
                        manualButtons,
                        defaultRemoteDevice,
                      );
                    }}
                  >
                    ${btn.icon ? html`<ha-icon .icon=${btn.icon}></ha-icon>` : nothing}
                    <span class="custom-remote-btn-label">${label}</span>
                  </button>
                `;
              })}
            </div>
          `;
        }

        const segs = (block.item.segments ?? []).slice(0, 4);
        if (segs.length === 0) return nothing;
        const activeIdx = segs.findIndex((seg) =>
          isCustomRemoteItemActive(hass, primaryEntityId, seg, block.item.state_entity),
        );
        const hasActive = activeIdx >= 0;

        return html`
          <div
            class="custom-seg-pill ${hasActive ? 'has-active' : ''}"
            role="group"
            style="--seg-count: ${segs.length}; --seg-idx: ${Math.max(0, activeIdx)};"
          >
            ${hasActive ? html`<span class="custom-seg-indicator" aria-hidden="true"></span>` : nothing}
            ${segs.map((seg, idx) => {
              const selected = idx === activeIdx;
              const label = seg.label?.trim() || seg.value || seg.command || seg.player_action || `Option ${idx + 1}`;
              return html`
                <button
                  type="button"
                  class="custom-seg-btn ${selected ? 'is-selected' : ''}"
                  aria-pressed=${String(selected)}
                  @click=${() => {
                    navigator.vibrate?.(10);
                    executeCustomRemoteAction(
                      hass,
                      primaryEntityId,
                      seg,
                      manualButtons,
                      defaultRemoteDevice,
                    );
                  }}
                >
                  ${seg.icon ? html`<ha-icon .icon=${seg.icon}></ha-icon>` : nothing}
                  <span class="custom-seg-label">${label}</span>
                </button>
              `;
            })}
          </div>
        `;
      })}
    </div>
  `;
}
