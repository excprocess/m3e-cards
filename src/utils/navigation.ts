import type { HomeAssistant } from '../types/home-assistant';

/**
 * Executes a dashboard navigation, Bubble Card popup hash (#popup),
 * or Browser Mod / script action cleanly from a single target string.
 */
export function executeNavigationTarget(
  host: HTMLElement,
  hass: HomeAssistant | undefined,
  rawTarget?: string,
): void {
  const target = (rawTarget || '').trim();
  if (!target) return;

  // 1. Bubble Card popup hash (e.g. "#cucina")
  if (target.startsWith('#')) {
    const oldURL = window.location.href;
    window.history.pushState(null, '', target);
    window.dispatchEvent(new CustomEvent('location-changed', { bubbles: true, composed: true }));
    window.dispatchEvent(new HashChangeEvent('hashchange', { oldURL, newURL: window.location.href }));
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

  // 4. Home Assistant dashboard path (e.g. "/lovelace/cucina")
  window.history.pushState(null, '', target);
  host.dispatchEvent(
    new CustomEvent('location-changed', {
      bubbles: true,
      composed: true,
      detail: { replace: false },
    }),
  );
  window.dispatchEvent(new CustomEvent('location-changed', { bubbles: true, composed: true }));
}
