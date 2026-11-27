import { normalizePopupTarget } from './navigation';

const M3E_POPUP_SECTION_ID = 'm3e_popups';
const M3E_POPUP_SECTION_LABEL = 'M3E Pop-ups';

interface PopupRegistration {
  ref: WeakRef<HTMLElement>;
  hash: string;
  path: string;
  name?: string;
  icon?: string;
}

interface NavPickerItem {
  id: string;
  primary: string;
  secondary?: string;
  icon?: string;
  sorting_label?: string;
}

interface HaGenericPicker extends HTMLElement {
  sections?: Array<{ id: string; label: string }>;
}

interface HaNavigationPicker extends HTMLElement {
  _navigationGroups?: Record<string, NavPickerItem[]>;
  _navigationItems?: NavPickerItem[];
  _getItems?: (searchString?: string, section?: string) => unknown[];
  _loadNavigationItems?: (...args: unknown[]) => Promise<void>;
  _sortBySortingLabel?: (a: NavPickerItem, b: NavPickerItem) => number;
  updated?: (changedProps: Map<string, unknown>) => void;
  requestUpdate?: () => void;
  renderRoot?: ShadowRoot | HTMLElement;
  __m3ePopUpItems?: NavPickerItem[];
  __m3eGetItemsPatched?: boolean;
}

declare global {
  interface Window {
    __m3eNavPickerBridgeInit?: boolean;
  }
}

const registrations: PopupRegistration[] = [];

function getCurrentPath(): string {
  try {
    return window.location.pathname || '/';
  } catch {
    return '/';
  }
}

function cleanupDead(): void {
  for (let i = registrations.length - 1; i >= 0; i--) {
    if (!registrations[i].ref.deref()?.isConnected) {
      registrations.splice(i, 1);
    }
  }
}

/**
 * Registers a live M3E Pop-up Card element so its hash/path, title, and icon
 * appear immediately in Home Assistant's native `<ha-navigation-picker>`.
 */
export function registerM3EPopupForPicker(
  element: HTMLElement,
  rawHash: string | undefined,
  meta: { name?: string; icon?: string } = {},
): void {
  cleanupDead();
  const hash = normalizePopupTarget(rawHash);
  const idx = registrations.findIndex((r) => r.ref.deref() === element);
  if (!hash || !element.isConnected) {
    if (idx !== -1) registrations.splice(idx, 1);
    return;
  }

  const entry: PopupRegistration = {
    ref: new WeakRef(element),
    hash,
    path: getCurrentPath(),
    name: meta.name?.trim() || undefined,
    icon: meta.icon?.trim() || undefined,
  };
  if (idx !== -1) {
    registrations[idx] = entry;
  } else {
    registrations.push(entry);
  }
}

export function unregisterM3EPopupForPicker(element: HTMLElement): void {
  const idx = registrations.findIndex((r) => r.ref.deref() === element);
  if (idx !== -1) registrations.splice(idx, 1);
}

/**
 * Recursively collects `custom:m3e-popup-card` configs from a Lovelace view tree
 * so even unrendered / off-screen pop-ups on the current view are listed.
 */
function collectPopupConfigsFromTree(
  node: unknown,
  out: Array<{ hash: string; name?: string; icon?: string }>,
): void {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const item of node) collectPopupConfigsFromTree(item, out);
    return;
  }
  const obj = node as Record<string, unknown>;
  if (obj.type === 'custom:m3e-popup-card' && typeof obj.hash === 'string') {
    const hash = normalizePopupTarget(obj.hash);
    if (hash) {
      out.push({
        hash,
        name: typeof obj.name === 'string' ? obj.name.trim() : undefined,
        icon: typeof obj.icon === 'string' ? obj.icon.trim() : undefined,
      });
    }
  }
  if (Array.isArray(obj.cards)) collectPopupConfigsFromTree(obj.cards, out);
  if (Array.isArray(obj.sections)) collectPopupConfigsFromTree(obj.sections, out);
}

function getCurrentViewPopupConfigs(): Array<{ hash: string; name?: string; icon?: string }> {
  const out: Array<{ hash: string; name?: string; icon?: string }> = [];
  try {
    const ha = document.querySelector('home-assistant');
    const main = ha?.shadowRoot?.querySelector('home-assistant-main');
    const drawer = main?.shadowRoot?.querySelector('ha-drawer');
    const panel = drawer?.querySelector('ha-panel-lovelace');
    const root = panel?.shadowRoot?.querySelector('hui-root') as
      | (HTMLElement & { lovelace?: { config?: { views?: Array<Record<string, unknown>> } } })
      | null;
    const views = root?.lovelace?.config?.views;
    if (!Array.isArray(views) || views.length === 0) return out;

    const segments = getCurrentPath().split('/').filter(Boolean);
    const viewKey = segments[segments.length - 1] ?? '';
    const view =
      views.find((v, idx) => String(v.path ?? idx) === viewKey) ??
      views[Number(viewKey)] ??
      views[0];
    if (view) collectPopupConfigsFromTree(view, out);
  } catch {
    // ignore DOM lookup errors
  }
  return out;
}

function filterItems(items: NavPickerItem[], search?: string): NavPickerItem[] {
  const q = typeof search === 'string' ? search.trim().toLowerCase() : '';
  if (!q) return items;
  return items.filter((item) =>
    [item.id, item.primary, item.secondary].some((f) => (f || '').toLowerCase().includes(q)),
  );
}

function buildM3EPopupItems(): NavPickerItem[] {
  cleanupDead();
  const currentPath = getCurrentPath();
  const liveByHash = new Map<string, PopupRegistration>();
  for (const reg of registrations) {
    if (reg.path === currentPath && reg.ref.deref()?.isConnected && !liveByHash.has(reg.hash)) {
      liveByHash.set(reg.hash, reg);
    }
  }

  const items: NavPickerItem[] = [];
  const seen = new Set<string>();
  const add = (hash: string, meta?: { name?: string; icon?: string }) => {
    if (!hash || seen.has(hash)) return;
    seen.add(hash);
    const name = meta?.name?.trim();
    items.push({
      id: hash,
      primary: name || hash,
      secondary: name ? hash : 'M3E Pop-up',
      icon: meta?.icon || 'mdi:pound',
      sorting_label: `zzz_m3e_popup_${hash}`,
    });
  };

  for (const cfg of getCurrentViewPopupConfigs()) {
    add(cfg.hash, liveByHash.get(cfg.hash) ?? cfg);
  }
  for (const [hash, reg] of liveByHash.entries()) {
    add(hash, reg);
  }

  return items;
}

function injectM3EPopupItems(picker: HaNavigationPicker): void {
  if (!picker?._navigationItems) return;

  const m3eItems = buildM3EPopupItems();
  if (typeof picker._sortBySortingLabel === 'function') {
    m3eItems.sort((a, b) => picker._sortBySortingLabel!(a, b));
  }

  const prevIds = new Set((picker.__m3ePopUpItems ?? []).map((i) => i.id));
  const baseItems = picker._navigationItems.filter((item) => !prevIds.has(item?.id));
  const existingIds = new Set(baseItems.map((item) => item?.id));
  const uniqueM3E = m3eItems.filter((item) => !existingIds.has(item.id));

  picker.__m3ePopUpItems = uniqueM3E;
  picker._navigationItems = [...baseItems, ...uniqueM3E];
}

function updatePickerSections(picker: HaNavigationPicker): void {
  const genericPicker = picker.renderRoot?.querySelector('ha-generic-picker') as HaGenericPicker | null;
  if (!genericPicker) return;

  const hasItems = (picker.__m3ePopUpItems?.length ?? 0) > 0;
  const sections = Array.isArray(genericPicker.sections) ? genericPicker.sections : [];
  const filtered = sections.filter((s) => s?.id !== M3E_POPUP_SECTION_ID);

  if (hasItems) {
    genericPicker.sections = [
      ...filtered,
      { id: M3E_POPUP_SECTION_ID, label: M3E_POPUP_SECTION_LABEL },
    ];
  } else if (filtered.length !== sections.length) {
    genericPicker.sections = filtered;
  }
}

function patchInstanceGetItems(instance: HaNavigationPicker): void {
  if (instance.__m3eGetItemsPatched) return;
  const originalGetItems = instance._getItems;
  if (typeof originalGetItems !== 'function') return;

  instance._getItems = function (searchString?: string, section?: string) {
    injectM3EPopupItems(instance);
    const m3eItems = filterItems(instance.__m3ePopUpItems ?? [], searchString);

    if (section === M3E_POPUP_SECTION_ID) return m3eItems;

    const items = originalGetItems.call(instance, searchString, section);
    if (section || m3eItems.length === 0) return items;
    return [...items, M3E_POPUP_SECTION_LABEL, ...m3eItems];
  };
  instance.__m3eGetItemsPatched = true;
}

function patchNavigationPicker(): boolean {
  const Ctor = customElements.get('ha-navigation-picker') as
    | { prototype?: HaNavigationPicker }
    | undefined;
  const proto = Ctor?.prototype;
  if (!proto || typeof proto._loadNavigationItems !== 'function') return false;
  if ((proto as unknown as { __m3ePatched?: boolean }).__m3ePatched) return true;

  const originalLoad = proto._loadNavigationItems;
  const originalUpdated = proto.updated;

  proto._loadNavigationItems = async function (this: HaNavigationPicker, ...args: unknown[]) {
    await originalLoad.apply(this, args);
    patchInstanceGetItems(this);
    injectM3EPopupItems(this);
  };

  proto.updated = function (this: HaNavigationPicker, changedProps: Map<string, unknown>) {
    originalUpdated?.call(this, changedProps);
    try {
      patchInstanceGetItems(this);
      injectM3EPopupItems(this);
      updatePickerSections(this);
    } catch {
      // ignore
    }
  };

  (proto as unknown as { __m3ePatched?: boolean }).__m3ePatched = true;
  return true;
}

export function initM3ENavigationPickerBridge(): void {
  if (typeof window === 'undefined' || window.__m3eNavPickerBridgeInit) return;
  window.__m3eNavPickerBridgeInit = true;

  if (!patchNavigationPicker()) {
    customElements
      .whenDefined('ha-navigation-picker')
      .then(() => {
        patchNavigationPicker();
      })
      .catch(() => {
        // ignore
      });
  }
}
