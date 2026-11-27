import type { HomeAssistant } from '../types/home-assistant';

declare global {
  interface Window {
    __m3ePopupRegistry?: Set<string>;
  }
}

export function normalizePopupTarget(raw?: string): string {
  const s = (raw || '').trim();
  if (!s) return '';
  if (s.startsWith('#') || s.startsWith('/')) return s.toLowerCase();
  return `#${s.toLowerCase()}`;
}

export function registerPopupTarget(raw?: string): string {
  const norm = normalizePopupTarget(raw);
  if (!norm) return '';
  window.__m3ePopupRegistry = window.__m3ePopupRegistry || new Set<string>();
  window.__m3ePopupRegistry.add(norm);
  return norm;
}

export function unregisterPopupTarget(norm?: string): void {
  if (!norm || !window.__m3ePopupRegistry) return;
  window.__m3ePopupRegistry.delete(norm);
}

/**
 * Executes a dashboard navigation, M3E Pop-Up / Bubble Card hash (#popup),
 * or Browser Mod / script action cleanly from a single target string.
 */
export function executeNavigationTarget(
  host: HTMLElement,
  hass: HomeAssistant | undefined,
  rawTarget?: string,
): void {
  const target = (rawTarget || '').trim();
  if (!target) return;

  // 0. Check if target matches an active M3E Pop-Up Card (hash OR path)
  const norm = normalizePopupTarget(target);
  if (norm && window.__m3ePopupRegistry?.has(norm)) {
    if (target.startsWith('#')) {
      const oldURL = window.location.href;
      window.history.pushState(null, '', target);
      window.dispatchEvent(new HashChangeEvent('hashchange', { oldURL, newURL: window.location.href }));
    }
    window.dispatchEvent(new CustomEvent('m3e-popup-open', { detail: { target: norm } }));
    return;
  }

  // 1. Hash popup (e.g. "#cucina" for M3E Pop-Up or Bubble Card)
  if (target.startsWith('#')) {
    const oldURL = window.location.href;
    window.history.pushState(null, '', target);
    window.dispatchEvent(new CustomEvent('location-changed', { bubbles: true, composed: true }));
    window.dispatchEvent(new HashChangeEvent('hashchange', { oldURL, newURL: window.location.href }));
    window.dispatchEvent(new CustomEvent('m3e-popup-open', { detail: { target: norm } }));
    return;
  }

  // 2. Script entity (e.g. "script.open_browser_mod_popup")
  if (target.startsWith('script.') && hass) {
    hass.callService('script', 'turn_on', { entity_id: target });
    return;
  }

  // 3. Direct service call (e.g. "browser_mod.popup" or "service:browser_mod.more_info")
  const cleaned = target.startsWith('service:') ? target.slice(8).trim() : target;
  if (/^[a-z0-9_]+\.[a-z0-9_]+$/i.test(cleaned) && !cleaned.startsWith('/') && hass) {
    const [domain, service] = cleaned.split('.');
    hass.callService(domain, service, {});
    return;
  }

  // 4. Home Assistant dashboard path (e.g. "/lovelace/cucina" or "/lovelace/home#popup")
  const oldURL = window.location.href;
  window.history.pushState(null, '', target);
  host.dispatchEvent(
    new CustomEvent('location-changed', {
      bubbles: true,
      composed: true,
      detail: { replace: false },
    }),
  );
  window.dispatchEvent(new CustomEvent('location-changed', { bubbles: true, composed: true }));
  if (target.includes('#')) {
    window.dispatchEvent(new HashChangeEvent('hashchange', { oldURL, newURL: window.location.href }));
  }
}
