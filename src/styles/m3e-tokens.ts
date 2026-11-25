import { css } from 'lit';

/**
 * Shared Material 3 Expressive design tokens.
 *
 * Every color, elevation, and card surface token defers directly to
 * Nerwyn/material-you-utilities (--md-sys-color-*, --ha-card-*, --md-sys-elevation-*)
 * so card_type, contrast (-1..+1), and color scheme stay 100% in sync.
 */
export const m3eBaseStyles = css`
  :host {
    display: block;
    height: 100%;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    font-family: var(
      --font-family,
      var(--ha-font-family-body, 'Roboto Flex', 'Google Sans', Roboto, system-ui, sans-serif)
    );

    /* M3 Expressive Motion Physics (falls back to CSS linear() spring approximations) */
    --m3e-spring-spatial-fast: var(
      --md-sys-motion-expressive-spatial-fast,
      350ms linear(
        0, 0.232 6.8%, 0.789 20.6%, 1.045 33.7%, 1.09 42.3%,
        1.023 58.6%, 0.992 73.1%, 1.002 88.2%, 1
      )
    );
    --m3e-spring-spatial-default: var(
      --md-sys-motion-expressive-spatial-default,
      500ms linear(
        0, 0.14 6.5%, 0.52 17.5%, 0.85 30.8%, 1.01 46.8%,
        1.03 56.5%, 1.005 74.2%, 1
      )
    );
    --m3e-spring-effects-fast: var(
      --md-sys-motion-expressive-effects-fast,
      150ms cubic-bezier(0.2, 0, 0, 1)
    );
    --m3e-spring-effects-default: var(
      --md-sys-motion-expressive-effects-default,
      250ms cubic-bezier(0.2, 0, 0, 1)
    );

    /* M3 Expressive Shape Scale */
    --m3e-corner-xs: var(--md-sys-shape-corner-extra-small, 4px);
    --m3e-corner-sm: var(--md-sys-shape-corner-small, 8px);
    --m3e-corner-md: var(--md-sys-shape-corner-medium, 12px);
    --m3e-corner-lg: var(--md-sys-shape-corner-large, 16px);
    --m3e-corner-xl: var(--md-sys-shape-corner-extra-large, 28px);
    --m3e-corner-full: var(--md-sys-shape-corner-full, 9999px);
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  ha-card {
    display: block;
    position: relative;
    height: 100%;
    overflow: hidden;
    background: var(--ha-card-background, var(--md-sys-color-surface-container-low, #f3f3fa));
    box-shadow: var(--ha-card-box-shadow, var(--md-sys-elevation-level1, none));
    border-style: solid;
    border-width: var(--ha-card-border-width, 0px);
    border-color: var(--ha-card-border-color, transparent);
    border-radius: var(--m3e-card-border-radius, var(--ha-card-border-radius, 28px));
    color: var(--md-sys-color-on-surface, #1b1b1f);
    transition:
      background-color var(--m3e-spring-effects-default),
      border-color var(--m3e-spring-effects-default),
      box-shadow var(--m3e-spring-effects-default);
  }

  /* =========================================================================
     SHARED MATERIAL 3 EXPRESSIVE TILE / PILL DESIGN VARIANTS
     All variants strictly inherit --ha-card-* & --md-sys-color-* from M3Y
     and keep --ha-card-border-radius in sync with border-radius.
     ========================================================================= */

  /* 1. Full Stadium Pill (Android QS / M3 Expressive Pill) */
  ha-card.style-pill {
    --ha-card-border-radius: var(--m3e-corner-full);
    border-radius: var(--m3e-corner-full);
  }

  /* 2. Google Home Morph (28px/HA standard inactive <-> full round pill active) */
  ha-card.style-morph {
    --ha-card-border-radius: var(--m3e-card-border-radius, 28px);
    border-radius: var(--m3e-card-border-radius, 28px);
    transition:
      border-radius 520ms linear(
        0, 0.168 7%, 0.618 18%, 0.962 31%, 1.072 43%,
        1.038 56%, 0.992 71%, 1.005 86%, 1
      ),
      transform var(--m3e-spring-spatial-fast),
      background-color var(--m3e-spring-effects-default),
      border-color var(--m3e-spring-effects-default),
      box-shadow var(--m3e-spring-effects-default);
  }

  ha-card.style-morph.is-on,
  ha-card.style-morph.is-active {
    --ha-card-border-radius: var(--m3e-corner-full);
    border-radius: var(--m3e-corner-full);
  }

  /* 3. M3 Expressive Dynamic Shape Morph (20px inactive <-> full pill active) */
  ha-card.style-expressive {
    --ha-card-border-radius: 20px;
    border-radius: 20px;
    transition:
      border-radius 520ms linear(
        0, 0.168 7%, 0.618 18%, 0.962 31%, 1.072 43%,
        1.038 56%, 0.992 71%, 1.005 86%, 1
      ),
      transform var(--m3e-spring-spatial-fast),
      background-color var(--m3e-spring-effects-default),
      border-color var(--m3e-spring-effects-default),
      box-shadow var(--m3e-spring-effects-default);
  }

  ha-card.style-expressive.is-on,
  ha-card.style-expressive.is-active {
    --ha-card-border-radius: var(--m3e-corner-full);
    border-radius: var(--m3e-corner-full);
  }

  ha-card.style-expressive.is-pressed {
    --ha-card-border-radius: 14px;
    border-radius: 14px;
  }

  /* 4. Compact M3 Tile (56px height / 18px corners for dense 1-row Sections) */
  ha-card.style-compact {
    min-height: 56px;
    --ha-card-border-radius: 18px;
    border-radius: 18px;
  }

  ha-card.style-compact .tile-content,
  ha-card.style-compact .tile-inner {
    min-height: 56px;
    padding: 10px 16px;
    gap: 12px;
  }

  /* =========================================================================
     SHARED GOOGLE HOME M3 OFFLINE STATE (unavailable / unknown)
     Opaque muted disabled surface + muted text/icons + trailing warning badge
     ========================================================================= */
  ha-card.is-unavailable {
    opacity: 1 !important;
    cursor: not-allowed;
    background: color-mix(
      in srgb,
      var(--md-sys-color-on-surface, #1b1b1f) 11%,
      var(--md-sys-color-surface, #faf8ff)
    ) !important;
    box-shadow: none !important;
  }

  ha-card.is-unavailable .title,
  ha-card.is-unavailable .subtitle,
  ha-card.is-unavailable .tile-title,
  ha-card.is-unavailable .tile-subtitle,
  ha-card.is-unavailable .bulb-icon,
  ha-card.is-unavailable .tile-icon,
  ha-card.is-unavailable .scene-icon,
  ha-card.is-unavailable .offline-badge {
    color: color-mix(
      in srgb,
      var(--md-sys-color-on-surface, #1b1b1f) 46%,
      transparent
    ) !important;
  }

  .offline-badge {
    flex: 0 0 auto;
    margin-inline-start: auto;
    width: 24px;
    height: 24px;
    display: grid;
    place-items: center;
  }

  .offline-badge svg {
    width: 22px;
    height: 22px;
  }
`;
