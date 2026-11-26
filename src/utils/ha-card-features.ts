/**
 * Shared loader & helpers for Home Assistant's native Card Features
 * (`<hui-card-features>`, `<hui-card-features-editor>`, `<hui-sub-element-editor>`).
 *
 * Targets Home Assistant 2025.2+ where card features accept `.context = { entity_id }`
 * and `features_position: 'bottom' | 'inline'`, while also forwarding `.stateObj`
 * for maximum compatibility with community custom card features (e.g. custom-card-features).
 */

export interface LovelaceCardFeatureConfig {
  type: string;
  [key: string]: unknown;
}

export type M3EFeaturesPosition = 'bottom' | 'inline';

export interface SubElementEditorConfig {
  index?: number;
  elementConfig?: LovelaceCardFeatureConfig;
  type: 'feature' | string;
}

interface CardHelpers {
  createCardElement(config: Record<string, unknown>): Promise<HTMLElement> | HTMLElement;
}

declare global {
  interface Window {
    loadCardHelpers?: () => Promise<CardHelpers>;
  }
}

let _featuresLoadPromise: Promise<boolean> | null = null;
let _featuresEditorLoadPromise: Promise<boolean> | null = null;

/**
 * Ensures `<hui-card-features>` is registered in `customElements` by triggering
 * Home Assistant's lazy-loaded Tile card chunk if needed.
 */
export async function ensureCardFeaturesLoaded(): Promise<boolean> {
  if (typeof customElements === 'undefined') return false;
  if (customElements.get('hui-card-features')) return true;

  if (!_featuresLoadPromise) {
    _featuresLoadPromise = (async () => {
      try {
        if (window.loadCardHelpers) {
          const helpers = await window.loadCardHelpers();
          await helpers.createCardElement({ type: 'tile', entity: '' });
        }
        return Boolean(customElements.get('hui-card-features'));
      } catch {
        return false;
      }
    })();
  }

  return _featuresLoadPromise;
}

/**
 * Ensures `<hui-card-features-editor>` and `<hui-sub-element-editor>` are registered
 * in `customElements` by loading the Tile card's native config editor chunk.
 */
export async function ensureCardFeaturesEditorLoaded(): Promise<boolean> {
  if (typeof customElements === 'undefined') return false;
  if (
    customElements.get('hui-card-features-editor') &&
    customElements.get('hui-sub-element-editor')
  ) {
    return true;
  }

  if (!_featuresEditorLoadPromise) {
    _featuresEditorLoadPromise = (async () => {
      try {
        if (window.loadCardHelpers) {
          const helpers = await window.loadCardHelpers();
          const tileEl = await helpers.createCardElement({ type: 'tile', entity: '' });
          const ctor = tileEl?.constructor as
            | { getConfigElement?: () => Promise<HTMLElement> | HTMLElement }
            | undefined;
          if (ctor?.getConfigElement) {
            await ctor.getConfigElement();
          }
        }
        return Boolean(customElements.get('hui-card-features-editor'));
      } catch {
        return false;
      }
    })();
  }

  return _featuresEditorLoadPromise;
}

/**
 * Stops pointer/click events originating inside `<hui-card-features>` from bubbling
 * up to the parent card's tap/toggle/hold handlers.
 */
export function stopFeatureEventPropagation(e: Event): void {
  e.stopPropagation();
}
