---
name: material-3-expressive
description: >-
  Authoritative design and engineering guide for building faithful Google Material 3 Expressive
  (2025/2026) and Google Home–native Home Assistant Lovelace custom cards in TypeScript + Lit,
  fully integrated with Nerwyn/material-you-utilities (card_type, contrast, color scheme).
  Use this skill whenever designing, creating, styling, or reviewing any M3 Expressive card,
  control, token, or animation in this repository.
---

# Material 3 Expressive for Home Assistant (Lovelace + Lit)

This skill enforces strict visual, behavioral, and architectural fidelity to **Google Material 3 Expressive** (m3.material.io, 2025 spec) and **Google Home Android**, while delegating all dynamic color generation, contrast scaling, and card surface variants to **`Nerwyn/material-you-utilities`**.

For the complete list of CSS tokens exposed by `material-you-utilities` and Material You Theme, read [material-you-utilities-tokens.md](./references/material-you-utilities-tokens.md).

---

## 1. Non-Negotiable Visual Principles

1. **Zero Gloss / Zero Liquid Glass / Zero Fake Effects:**
   - NEVER use `backdrop-filter: blur(...)`, glassmorphism, translucent gradients, specular highlights, neon glows, or fake 3D bevels.
   - Surfaces are strictly **opaque tonal layers** (`--md-sys-color-surface-container-*`, `--md-sys-color-primary-container`, etc.).
2. **Respect `card_type` from `material-you-utilities`:**
   - Every card root MUST use `<ha-card>` and inherit `--ha-card-background`, `--ha-card-box-shadow`, `--ha-card-border-width`, and `--ha-card-border-color`.
   - NEVER hardcode a `1px solid` border or a custom `box-shadow` on a card container; let `material-you-utilities` control whether cards are `elevated`, `filled`, `outlined`, or `transparent`.
3. **Domain-Specific Cards (No One-Size-Fits-All):**
   - Each Home Assistant domain gets bespoke ergonomics inspired by Google Home Android (e.g., full-tile drag-to-dim slider for lights, artwork + wavy/expressive progress for media players, tactile dial/steppers for climate).
4. **Guaranteed Accessibility Across All Contrast Levels (`-1.0` to `+1.0`):**
   - Always pair background and foreground roles strictly:
     - `surface*` ↔ `on-surface` / `on-surface-variant`
     - `primary` ↔ `on-primary`
     - `primary-container` ↔ `on-primary-container`
     - `secondary-container` ↔ `on-secondary-container`
     - `tertiary-container` ↔ `on-tertiary-container`
   - Never hardcode hex colors or opacity-hacked text colors that break under Medium/High contrast (`contrast > 0`).
5. **MAX PRIORITY — Strict Cross-Card Visual & Spatial Consistency:**
   - Every card and popup in this suite MUST share the exact same spatial grammar, geometry, typography, and control placement as existing sibling cards (check `m3e-light-card`, `m3e-status-card`, `m3e-toggle-card`, `m3e-glance-card`, `m3e-people-card` before designing or modifying any UI).
   - **Popup Header Order (MANDATORY):** Always place the **`×` Close button on the top-left**, the **Title + Last Changed in the middle**, and any **Power / On-Off toggle or primary header action on the top-right** (matching `m3e-light-card` and Google Home). Never invert left/right control placement between popups.
   - **Shared Design Language:** Mirror corner radii (`28px` default / `9999px` pill), spacing, icon badge dimensions (`46px` Glance/People circles, `22–24px` icons), and M3 Expressive motion curves across all cards.
   - **Standard Tile Internal Spacing (MANDATORY — Google Home Proportions):**
     - Standard 6-column tiles (`Light`, `Status`, `Toggle`, `Scene`, `Light Group` header): `padding: 12px 12px 12px 14px`, `gap: 10px` (compact variant: `padding: 8px 10px 8px 12px`, `gap: 8px`).
     - Leading icon: `24px × 24px` snug against the left edge (`14px` inset); trailing chevron: `18px × 18px` (`12px` right inset, `margin-inline-start: -8px` to reclaim the SVG's built-in left optical padding without shifting the chevron).
     - Tile title: `14.5px` / `line-height: 18px`, `font-weight: 600`, **2-line clamp** (`display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; word-break: break-word;`) so longer Italian names (`Temperatura`, `Illuminazione`, `Termometro cameretta`, `Growlight`) never truncate prematurely on 2-column mobile grids.
     - Tile subtitle: `13px` / `line-height: 17px`, single-line ellipsis, `tabular-nums`.
   - **Uniform Tactile Press-Rebound Physics (MANDATORY on ALL interactive cards, small and large):**
     - Every interactive `<ha-card>` (both 6-column tiles AND 12-column wide cards such as `Thermostat`, `Media Player`, `Media Bar`, `Light Group`, `Assist`) MUST implement spring press-rebound via `.is-pressed` (`@pointerdown` ignoring nested `button`/`[role="slider"]`/`hui-card-features`, cleared on `pointerup`/`pointerleave`/`pointercancel`).
     - Shared tokens in `m3eBaseStyles` (`src/styles/m3e-tokens.ts`):
       - Half-width tiles (`6 cols`): `transform: scale(var(--m3e-press-scale-tile, 0.965))` with `transition: transform var(--m3e-spring-spatial-fast)`.
       - Full-width / wide cards (`12 cols`, marked with `.is-wide-card`): `transform: scale(var(--m3e-press-scale-card, 0.978))` with `transition: transform var(--m3e-spring-spatial-fast)`.
     - Never leave a large interactive card static on press while smaller sibling tiles bounce.

---

## 2. Color System Integration (`material-you-utilities`)

`Nerwyn/material-you-utilities` runs `@material/material-color-utilities` (`spec: 2025` by default) and injects all 52 `--md-sys-color-*` tokens as **HEX strings** (NOT RGB triplets) onto the document/theme root.

- **Off / Inactive card surface:** Inherits `var(--ha-card-background, var(--md-sys-color-surface-container-low))`.
- **On / Active state (e.g., Light ON):**
  - Uses tonal container fill (`var(--md-sys-color-primary-container)` or light-color-harmonized container when `use_light_color` is enabled) with `var(--md-sys-color-on-primary-container)` for primary text/icon and `var(--md-sys-color-primary)` for the active slider track/accent.
  - When a card is **filled by an active slider track** (Google Home pill tile):
    - Inactive track surface = `var(--ha-card-background, var(--md-sys-color-surface-container-highest))` (or `var(--md-sys-color-surface-container-high)` when on).
    - Active fill track = `var(--md-sys-color-primary-container)` (soft, readable behind title/subtitle!) with `var(--md-sys-color-primary)` handle/indicator, OR for standard M3 Expressive separate track: `var(--md-sys-color-primary)` active track + `var(--md-sys-color-secondary-container)` inactive track.
- **State Layers (Hover / Focus / Press):**
  - Apply via a `::before` / overlay layer using `color-mix(in srgb, currentColor 8%, transparent)` on hover and `10%–12%` on focus/press. Never change the whole card's opacity.

---

## 3. M3 Expressive Motion Physics (Springs)

Material 3 Expressive separates motion into **Spatial** (position, size, scale, border-radius — allows playful overshoot) and **Effects** (color, background, opacity — critically damped, zero overshoot).

Always reference the theme's `--md-sys-motion-*` tokens first, with accurate CSS `linear()` spring fallbacks:

| Token | Physics (`damping`, `stiffness`) | CSS Fallback | Use For |
| :--- | :--- | :--- | :--- |
| `--md-sys-motion-expressive-spatial-fast` | `ζ=0.6`, `k=1400` | `350ms linear(0, 0.232 6.8%, 0.789 20.6%, 1.045 33.7%, 1.09 42.3%, 1.023 58.6%, 0.992 73.1%, 1.002 88.2%, 1)` | Toggle icon morph, handle width squeeze, press feedback |
| `--md-sys-motion-expressive-spatial-default` | `ζ=0.8`, `k=380` | `500ms linear(0, 0.14 6.5%, 0.52 17.5%, 0.85 30.8%, 1.01 46.8%, 1.03 56.5%, 1.005 74.2%, 1)` | Card shape morphing (off ↔ on), expanding sections, slider snap |
| `--md-sys-motion-expressive-effects-fast` | `ζ=1.0`, `k=3800` | `150ms cubic-bezier(0.2, 0, 0, 1)` | State layer opacity, color shift on press |
| `--md-sys-motion-expressive-effects-default` | `ζ=1.0`, `k=1600` | `250ms cubic-bezier(0.2, 0, 0, 1)` | Surface/text color transitions on state change |

**Rule:** During active pointer dragging (e.g., sliding brightness), **disable spatial transition** on the fill width (`transition: none`) so the slider tracks the finger at 1:1 60/120fps, then re-enable the expressive spatial spring on release or external state update.

---

## 4. Shape System & Shape Morphing

Use the official M3 Expressive corner scale (referencing `--md-sys-shape-corner-*` tokens with px fallbacks):

- `none`: `0px`
- `extra-small`: `4px`
- `small`: `8px`
- `medium`: `12px`
- `large`: `16px`
- `large-increased`: `20px`
- `extra-large`: `28px` (default resting card radius for Google Home–style expressive tiles)
- `full`: `9999px` (pills, circular icon containers, slider handles)

**Expressive Shape Morphing patterns:**
- **Google Home Light Tile (Compact Horizontal Pill):**
  - `min-height: 84px`, `border-radius: var(--ha-card-border-radius, 28px)`.
  - **NO handle bar, NO stop dot, NO icon box behind the lightbulb.** Just a clean bare lightbulb icon + title + `On • XX%` (or `Off`).
  - **Clipped Flat-Edge Fill:** A sharp vertical rectangle (`border-radius: 0`, clipped by the card's `28px` radius) splits the tile cleanly between active tonal fill (left) and muted inactive track (right). Text & icon remain high-contrast across both sides.
  - **Gestures:** Tap = toggle, horizontal drag (≥ `8px`) = dim brightness, long-press (`450ms`) = open Full Light Control Popup via Container Transform.
- **Google Home Light Control Popup (Vertical Clipped-Fill Capsule):**
  - **ON state:** Vertical full-pill capsule (`border-radius: 9999px` / `50%` of width), solid active fill rising from bottom with flat top edge, muted tinted track (`color-mix` ~20–25%), anchored sun icon at bottom center with pixel-exact dual-contrast clipping (`clip-path`) as fill crosses it.
  - **Dragging Tooltip:** Floating pill (`border-radius: 9999px`) on the left tracking the fill top edge (`84%`, `47%`), fading/scaling out on release.
  - **OFF state Shape Morph:** Capsule morphs via bouncy spring (`MediumBouncy`, low stiffness) from full pill (`9999px`) → rounded rectangle (`28px`) with subtle scale reduction and neutral `var(--md-sys-color-surface-container-highest)` fill; readout changes to `Off`.
  - **Morphing Color/Temp Swatches:** Unselected = perfect circles (`50%`); selected = squircle (`16px`) via spatial spring, with NO outer border ring.
- **Google Home Status Tile → Modular Expanded Control (`m3e-status-card`):**
  - **Shape Coding Golden Rule:**
    - Active / Primary Control = **Full Pill** (`border-radius: 9999px`) + tonal primary container fill (`var(--md-sys-color-primary-container)`).
    - Inactive / Secondary Action / Info = **Rounded Rectangle** (`border-radius: 20px–28px`) + neutral `var(--ha-card-background)` / `var(--md-sys-color-surface-container-high)`.
  - **Dashboard Tile:** Horizontal pill (`min-height: 84px`), 3-level hierarchy (status icon left, title + subtitle center, chevron `>` right when popup is enabled). Supports custom `icon_active` / `icon_inactive` and custom `active_states`. Press flattens (`scale(0.97)`) and springs back.
  - **Expanded Popup (Hero Top + Modular Trait Stack Bottom):**
    1. `sensor`: Passive thick-ring status circle (icon + state) + read-only `24px` telemetry pill(s).
    2. `climate`: Interactive 270° circular dial with ambient temp marker, target thumb that **morphs from dot → elongated radial pill and thickens the arc while dragging**, superscript `.5` readout (`11⁵`), inline `−`/`+` buttons, mode pill opening an inline **"Select a mode"** bottom sheet (Heat warm terracotta / Cool slate blue / Off neutral), and grouped telemetry card.
    3. `remote`: Vertical split rocker pill (Volume +/-) + horizontal split pills (`Unmute | Mute`, `On | Off`) + transport row + `CH` rocker + `Source` card.
    4. `media`: `28px` media card (artwork backdrop or neutral idle) + full-pill clipped horizontal volume slider + full-pill primary action (`Stop casting`) + `20px` secondary action cards.
- **Native Home Assistant GUI Editors:**
  - Every card MUST implement `static getStubConfig(hass)` and `static getConfigForm()` so users can add and configure it entirely via Home Assistant's visual Dashboard Editor with zero manual YAML.
- **Standard M3 Expressive Sliders (for non-light controls like volume/media/etc.):**
  - Segmented track with rounded outer corners (`12px`), `2px` inner corners facing a `4px × 44px` vertical capsule handle (narrowing on drag) and a `4px` stop indicator dot at the inactive end.

---

## 5. Typography & Layout Hierarchy

Use Material 3 Expressive typescale tokens (`--md-sys-typescale-*`) with `Roboto Flex` / `Google Sans` / system UI fallbacks:

- **Card Title:** `title-medium` (`16px`, weight `500`–`600`, line-height `24px`, tracking `0.15px`), `color: var(--md-sys-color-on-surface)` (or `on-primary-container` when active).
- **Card Subtitle / State (e.g., `74%` or `Off`):** `body-medium` / `label-large` (`13px`–`14px`, weight `500`, `font-variant-numeric: tabular-nums` so numbers never jitter while sliding!), `color: var(--md-sys-color-on-surface-variant)` (or `on-primary-container` at high legibility).
- **Minimum Touch Targets:** Interactive controls must be at least `48px × 48px` (or full-card `72px`–`88px` height for slider tiles) for comfortable Android thumb interaction.

---

## 6. Performance & Lightweight Architecture

1. **Stack:** TypeScript + Lit 3.x + Vite single-file ESM bundle for HACS. Zero React, zero `@material/web` full imports, zero runtime color-utilities in the production card bundle.
2. **Strict `shouldUpdate`:** Override `shouldUpdate(changedProps)` on every card to re-render **only** when the configured `entity_id` state/attributes, `config`, or local interaction state changes—ignoring unrelated `hass` ticks.
3. **Touch & Scroll Ergonomics:**
   - Use Pointer Events (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`) with `touch-action: pan-y` on horizontal sliders so vertical dashboard scrolling on mobile is never blocked.
   - Distinguish tap (toggle light) vs drag (dim brightness) using an `8px` horizontal movement threshold.
   - Throttle `hass.callService` during drag (e.g., every `120ms`) and always send the final value on `pointerup`.
4. **Icons:** Use native `<ha-icon>` inside Home Assistant, with a tiny inline SVG fallback only when running outside HA (standalone browser preview).
