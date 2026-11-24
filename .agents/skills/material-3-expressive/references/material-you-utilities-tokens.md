# `Nerwyn/material-you-utilities` Token & Card Type Reference

Verified directly from `Nerwyn/material-you-utilities` (`v2.2.1`) source code.

## 1. How `material-you-utilities` Injects Colors

- Uses `@material/material-color-utilities` (`@poupe/material-color-utilities@^0.4.1`) with:
  - `base_color` (default `#4C5C92`, or comma-separated dual colors for `cmf`)
  - `scheme`: `tonalspot` (default), `expressive`, `vibrant`, `neutral`, `content`, `fidelity`, `fruitsalad`, `rainbow`, `monochrome`, `cmf`
  - `contrast`: `-1.0` to `1.0` (step `0.1`, default `0`)
  - `spec`: `'2021'` (Material You), `'2025'` (Material Expressive — default), `'2026'` (CMF)
  - `platform`: `'phone'` (default), `'watch'`
- Writes `--md-sys-color-<kebab-token>-light` and `--md-sys-color-<kebab-token>-dark` as **HEX strings** (e.g. `#4C5C92`).
- The active theme maps `--md-sys-color-<kebab-token>` to the current light/dark mode.

### All 52 `--md-sys-color-*` Tokens

**Primary:**
- `--md-sys-color-primary`, `--md-sys-color-on-primary`
- `--md-sys-color-primary-container`, `--md-sys-color-on-primary-container`
- `--md-sys-color-inverse-primary`, `--md-sys-color-primary-palette-key-color`
- `--md-sys-color-primary-fixed`, `--md-sys-color-primary-fixed-dim`, `--md-sys-color-on-primary-fixed`, `--md-sys-color-on-primary-fixed-variant`

**Secondary:**
- `--md-sys-color-secondary`, `--md-sys-color-on-secondary`
- `--md-sys-color-secondary-container`, `--md-sys-color-on-secondary-container`
- `--md-sys-color-secondary-palette-key-color`
- `--md-sys-color-secondary-fixed`, `--md-sys-color-secondary-fixed-dim`, `--md-sys-color-on-secondary-fixed`, `--md-sys-color-on-secondary-fixed-variant`

**Tertiary:**
- `--md-sys-color-tertiary`, `--md-sys-color-on-tertiary`
- `--md-sys-color-tertiary-container`, `--md-sys-color-on-tertiary-container`
- `--md-sys-color-tertiary-palette-key-color`
- `--md-sys-color-tertiary-fixed`, `--md-sys-color-tertiary-fixed-dim`, `--md-sys-color-on-tertiary-fixed`, `--md-sys-color-on-tertiary-fixed-variant`

**Error:**
- `--md-sys-color-error`, `--md-sys-color-on-error`
- `--md-sys-color-error-container`, `--md-sys-color-on-error-container`

**Surfaces & Outlines:**
- `--md-sys-color-surface`, `--md-sys-color-on-surface`
- `--md-sys-color-surface-variant`, `--md-sys-color-on-surface-variant`
- `--md-sys-color-surface-dim`, `--md-sys-color-surface-bright`
- `--md-sys-color-surface-container-lowest`
- `--md-sys-color-surface-container-low`
- `--md-sys-color-surface-container`
- `--md-sys-color-surface-container-high`
- `--md-sys-color-surface-container-highest`
- `--md-sys-color-inverse-surface`, `--md-sys-color-inverse-on-surface`
- `--md-sys-color-surface-tint`
- `--md-sys-color-outline`, `--md-sys-color-outline-variant`
- `--md-sys-color-shadow`, `--md-sys-color-scrim`
- `--md-sys-color-neutral-palette-key-color`, `--md-sys-color-neutral-variant-palette-key-color`

---

## 2. How `card_type` Works

`setCardType` injects a `<style id="material-you-card-type">` tag on `:host, body` that defines:

| `card_type` | `--ha-card-background` | `--ha-card-box-shadow` | `--ha-card-border-width` | `--ha-card-border-color` |
| :--- | :--- | :--- | :--- | :--- |
| `elevated` (default) | `var(--md-sys-color-surface-container-low)` | `var(--md-sys-elevation-level1)` | `0` | `transparent` |
| `filled` | `var(--md-sys-color-surface-container-highest)` | `var(--md-sys-elevation-level0)` | `0` | `transparent` |
| `outlined` | `var(--md-sys-color-surface)` | `var(--md-sys-elevation-level0)` | `1px` | `var(--md-sys-color-outline-variant)` |
| `transparent` | `transparent` | `var(--md-sys-elevation-level0)` | `0` | `transparent` |

`ha-card.css` also sets `--card-background-color: var(--ha-card-background)` and `--ha-slider-thumb-negative-color: var(--ha-card-background)` and supports explicit classes/attributes (`.elevated`, `.filled`, `.outlined`, `.transparent`).

---

## 3. Additional Tokens Used by `material-you-utilities`

- **Elevation:** `--md-sys-elevation-level0` through `--md-sys-elevation-level5`
- **Motion:** `--md-sys-motion-expressive-spatial-default`, `--md-sys-motion-expressive-spatial-fast`, `--md-sys-motion-expressive-effects-default`, etc.
- **Shape:** `--md-sys-shape-corner-small`, `--md-sys-shape-corner-medium`, `--md-sys-shape-corner-large`, `--md-sys-shape-corner-extra-large`, `--md-sys-shape-corner-full`
- **Typescale:** `--md-sys-typescale-label-large-{size,weight,line-height,tracking}`, `--md-sys-typescale-title-medium-*`, `--md-sys-typescale-body-medium-*`
