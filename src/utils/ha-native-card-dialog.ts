import type { HomeAssistant, LovelaceCardConfig, M3EPopupCardConfig } from '../types/home-assistant';

interface DirtySlice {
  initial?: unknown;
  normalizedInitial?: unknown;
  current?: unknown;
}

interface HaDialogElement extends HTMLElement {
  _params?: Record<string, unknown>;
  _dirtySlices?: Map<string, DirtySlice>;
  _effectiveNormalize?: (cfg: unknown) => unknown;
  _publishContext?: () => void;
  showDialog?: (params: Record<string, unknown>) => unknown;
  closeDialog?: (...args: unknown[]) => boolean;
}

interface ProxyLovelace {
  config: {
    views: Array<{
      path: string;
      title: string;
      sections: Array<{ type: string; cards: LovelaceCardConfig[] }>;
    }>;
  };
  editMode: boolean;
  saveConfig: (newConfig: Record<string, unknown>) => Promise<void>;
}

interface HuiSectionProxy extends HTMLElement {
  hass?: HomeAssistant;
  index?: number;
  viewIndex?: number;
  config?: Record<string, unknown>;
  lovelace?: ProxyLovelace;
  _initializeConfig?: () => Promise<void>;
  updateComplete?: Promise<unknown>;
  _layoutElement?: HTMLElement;
}

interface HuiViewProxy extends HTMLElement {
  hass?: HomeAssistant;
  index?: number;
  lovelace?: ProxyLovelace;
}

function cloneJson<T>(val: T): T {
  return JSON.parse(JSON.stringify(val)) as T;
}

function getHomeAssistantHost(): HTMLElement | null {
  return document.querySelector('body > home-assistant');
}

function getActiveEditCardDialog(): HaDialogElement | null {
  return (
    (getHomeAssistantHost()?.shadowRoot?.querySelector('hui-dialog-edit-card') as HaDialogElement) ??
    null
  );
}

function captureOriginalBaseline(
  dialog: HaDialogElement | null,
  fallbackConfig: M3EPopupCardConfig,
): unknown {
  try {
    const sliceInit = dialog?._dirtySlices?.get('__default__')?.initial;
    if (sliceInit && typeof sliceInit === 'object') {
      return cloneJson(sliceInit);
    }
    if (dialog?._params?.cardConfig) {
      return cloneJson(dialog._params.cardConfig);
    }
  } catch {
    // ignore
  }
  return cloneJson(fallbackConfig);
}

function applyDialogDirtyBaseline(dialog: HaDialogElement | null, originalConfig: unknown): void {
  if (!dialog || !originalConfig) return;
  const apply = (attempt = 0) => {
    try {
      const slice = dialog._dirtySlices?.get('__default__');
      if (!slice) {
        if (attempt < 8) requestAnimationFrame(() => apply(attempt + 1));
        return;
      }
      slice.initial = cloneJson(originalConfig);
      const normFn = dialog._effectiveNormalize;
      slice.normalizedInitial =
        typeof normFn === 'function' ? normFn(cloneJson(originalConfig)) : cloneJson(originalConfig);
      dialog._publishContext?.();
    } catch {
      // ignore
    }
  };
  requestAnimationFrame(() => apply(0));
}

function extractCardsFromProxyConfig(cfg: Record<string, unknown>): LovelaceCardConfig[] {
  const views = cfg?.views as
    | Array<{ sections?: Array<{ cards?: LovelaceCardConfig[] }>; cards?: LovelaceCardConfig[] }>
    | undefined;
  const sectionCards = views?.[0]?.sections?.[0]?.cards;
  if (Array.isArray(sectionCards)) return sectionCards;
  return Array.isArray(views?.[0]?.cards) ? views![0].cards! : [];
}

function reopenParentPopupDialog(
  parentParams: Record<string, unknown>,
  updatedPopupConfig: M3EPopupCardConfig,
  originalBaseline: unknown,
): void {
  const homeAssistant = getHomeAssistantHost();
  if (!homeAssistant) return;

  const nextParams: Record<string, unknown> = {
    ...parentParams,
    cardConfig: updatedPopupConfig,
  };

  setTimeout(() => {
    homeAssistant.dispatchEvent(
      new CustomEvent('show-dialog', {
        bubbles: true,
        composed: true,
        detail: {
          dialogTag: 'hui-dialog-edit-card',
          dialogImport: () => Promise.resolve(),
          dialogParams: nextParams,
        },
      }),
    );

    requestAnimationFrame(() => {
      const dialog = getActiveEditCardDialog();
      if (dialog && dialog._params !== nextParams && typeof dialog.showDialog === 'function') {
        dialog.showDialog(nextParams);
      }
      applyDialogDirtyBaseline(getActiveEditCardDialog(), originalBaseline);
    });
  }, 30);
}

function openChildInOfficialEditDialog(
  childDialogParams: Record<string, unknown>,
  parentParams: Record<string, unknown>,
  originalBaseline: unknown,
  getUpdatedPopupConfig: () => M3EPopupCardConfig,
  cleanupProxy: () => void,
): boolean {
  const activeDialog = getActiveEditCardDialog();
  if (!activeDialog || typeof activeDialog.showDialog !== 'function') {
    cleanupProxy();
    return false;
  }

  let handled = false;
  let fallbackTimer: number | undefined;
  const hadOwnClose = Object.prototype.hasOwnProperty.call(activeDialog, 'closeDialog');
  const origClose = activeDialog.closeDialog;

  const restoreClose = () => {
    if (activeDialog.closeDialog !== wrappedClose) return;
    if (hadOwnClose) {
      activeDialog.closeDialog = origClose;
    } else {
      delete activeDialog.closeDialog;
    }
  };

  const finishAndReopen = () => {
    if (handled) return;
    handled = true;
    if (fallbackTimer !== undefined) {
      window.clearTimeout(fallbackTimer);
      fallbackTimer = undefined;
    }
    restoreClose();
    activeDialog.removeEventListener('dialog-closed', onDialogClosed);
    window.removeEventListener('dialog-closed', onDialogClosed, true);
    cleanupProxy();
    reopenParentPopupDialog(parentParams, getUpdatedPopupConfig(), originalBaseline);
  };

  function wrappedClose(this: HaDialogElement, ...args: unknown[]): boolean {
    restoreClose();
    const closed = typeof origClose === 'function' ? origClose.apply(this, args) : true;
    if (closed === false) {
      activeDialog!.closeDialog = wrappedClose;
      return false;
    }
    // Wait for <ha-dialog> close animation & _dialogClosed() to fire `dialog-closed`.
    // Keep a safety fallback in case an older HA build closes without emitting `dialog-closed`.
    if (fallbackTimer === undefined) {
      fallbackTimer = window.setTimeout(() => {
        if (!handled && !activeDialog?._params) {
          finishAndReopen();
        }
      }, 450);
    }
    return true;
  }

  const onDialogClosed = (ev: Event) => {
    const detail = (ev as CustomEvent<{ dialog?: string }>).detail;
    const isTargetDialog =
      detail?.dialog === 'hui-dialog-edit-card' ||
      ev.target === activeDialog ||
      (typeof ev.composedPath === 'function' && ev.composedPath().includes(activeDialog));
    if (!isTargetDialog) return;
    finishAndReopen();
  };

  activeDialog.showDialog(childDialogParams);
  activeDialog.closeDialog = wrappedClose;
  activeDialog.addEventListener('dialog-closed', onDialogClosed);
  window.addEventListener('dialog-closed', onDialogClosed, true);
  return true;
}

/**
 * Dispatches `ll-create-card` or `ll-edit-card` for both:
 * - Home Assistant 2026.11+ (handlers on `hui-view` with `['views', 0, 'sections', 0, 'cards', ...]`)
 * - Home Assistant 2025.2–2026.10 (handlers on `hui-section` with `[0, 0, index]`)
 */
async function dispatchOfficialCardEvent(
  hass: HomeAssistant,
  cards: LovelaceCardConfig[],
  eventName: 'll-create-card' | 'll-edit-card',
  cardIndex: number | undefined,
  onSaveConfig: (newLovelaceConfig: Record<string, unknown>) => Promise<void>,
): Promise<(() => void) | null> {
  const homeAssistant = getHomeAssistantHost();
  if (!homeAssistant) return null;

  const sectionConfig = {
    type: 'grid',
    cards: cloneJson(cards),
  };

  const lovelaceProxy: ProxyLovelace = {
    config: {
      views: [
        {
          path: 'm3e-popup-editor',
          title: 'M3E Pop-up',
          sections: [sectionConfig],
        },
      ],
    },
    editMode: true,
    saveConfig: onSaveConfig,
  };

  const testSection = customElements.get('hui-section')
    ? (document.createElement('hui-section') as HuiSectionProxy)
    : null;
  const usesViewHandlers = Boolean(testSection && 'path' in testSection) || Boolean(customElements.get('hui-view') && !testSection);

  // Path A: Home Assistant 2026.11+ (`hui-view` handles card creation/editing dialogs)
  if (usesViewHandlers && customElements.get('hui-view')) {
    const proxyView = document.createElement('hui-view') as HuiViewProxy;
    proxyView.style.display = 'none';
    proxyView.hass = hass;
    proxyView.index = 0;
    proxyView.lovelace = lovelaceProxy;

    const basePath: Array<string | number> = ['views', 0, 'sections', 0, 'cards'];
    const path =
      eventName === 'll-edit-card' && typeof cardIndex === 'number'
        ? [...basePath, cardIndex]
        : basePath;

    homeAssistant.appendChild(proxyView);
    try {
      proxyView.dispatchEvent(
        new CustomEvent(eventName, {
          bubbles: true,
          composed: true,
          detail: { path },
        }),
      );
      return () => {
        if (proxyView.isConnected) proxyView.remove();
      };
    } catch {
      proxyView.remove();
      return null;
    } finally {
      proxyView.remove();
    }
  }

  // Path B: Home Assistant 2025.2–2026.10 (`hui-section` handles card creation/editing dialogs)
  if (!testSection) return null;
  testSection.style.display = 'none';
  testSection.hass = hass;
  testSection.index = 0;
  testSection.viewIndex = 0;
  testSection.config = sectionConfig;
  testSection.lovelace = lovelaceProxy;

  homeAssistant.appendChild(testSection);
  const cleanup = () => {
    if (testSection.isConnected) testSection.remove();
  };

  try {
    if (typeof testSection._initializeConfig === 'function') {
      await testSection._initializeConfig();
    }
    if (testSection.updateComplete) {
      await testSection.updateComplete;
    }
    const layoutEl = testSection._layoutElement;
    if (!layoutEl) {
      cleanup();
      return null;
    }
    const detail =
      eventName === 'll-edit-card' && typeof cardIndex === 'number'
        ? { path: [0, 0, cardIndex] }
        : undefined;
    layoutEl.dispatchEvent(
      new CustomEvent(eventName, {
        bubbles: true,
        composed: true,
        detail,
      }),
    );
    return cleanup;
  } catch {
    cleanup();
    return null;
  }
}

/**
 * Opens Home Assistant's official "Add to dashboard" dialog (`hui-dialog-create-card`)
 * or official "Edit card" dialog (`hui-dialog-edit-card` with Config/Visibility/Layout tabs)
 * for a child card inside `m3e-popup-card`, then returns cleanly to the Pop-up editor.
 */
export async function openOfficialHACardDialog(options: {
  hass: HomeAssistant;
  popupConfig: M3EPopupCardConfig;
  mode: 'add' | 'edit';
  index?: number;
  onCardsUpdated: (cards: LovelaceCardConfig[]) => void;
}): Promise<boolean> {
  const homeAssistant = getHomeAssistantHost();
  const activeDialog = getActiveEditCardDialog();
  const parentParams = activeDialog?._params ? { ...activeDialog._params } : null;
  if (!homeAssistant || !parentParams) return false;

  const originalBaseline = captureOriginalBaseline(activeDialog, options.popupConfig);

  let cardsMutatedDirectly = false;
  let nextPopupConfig: M3EPopupCardConfig = {
    ...options.popupConfig,
    cards: [...(options.popupConfig.cards ?? [])],
  };

  const handleSaveConfig = async (lovelaceCfg: Record<string, unknown>) => {
    const updatedCards = extractCardsFromProxyConfig(lovelaceCfg);
    cardsMutatedDirectly = true;
    nextPopupConfig = { ...nextPopupConfig, cards: updatedCards };
    options.onCardsUpdated(updatedCards);
  };

  if (options.mode === 'add') {
    let pendingEditParams: Record<string, unknown> | null = null;
    let cleanupProxy: (() => void) | null = null;

    const onShowDialog = (ev: Event) => {
      const detail = (
        ev as CustomEvent<{ dialogTag?: string; dialogParams?: Record<string, unknown> }>
      ).detail;
      if (detail?.dialogTag !== 'hui-dialog-edit-card') return;
      pendingEditParams = detail.dialogParams ?? null;
      ev.stopImmediatePropagation?.();
      ev.stopPropagation();
    };

    const onCreateClosed = (ev: Event) => {
      const detail = (ev as CustomEvent<{ dialog?: string }>).detail;
      if (detail?.dialog !== 'hui-dialog-create-card') return;

      homeAssistant.removeEventListener('show-dialog', onShowDialog, true);
      window.removeEventListener('dialog-closed', onCreateClosed, true);

      if (pendingEditParams) {
        const params = pendingEditParams;
        setTimeout(() => {
          openChildInOfficialEditDialog(
            params,
            parentParams,
            originalBaseline,
            () => nextPopupConfig,
            () => cleanupProxy?.(),
          );
        }, 0);
      } else {
        cleanupProxy?.();
        if (cardsMutatedDirectly) {
          reopenParentPopupDialog(parentParams, nextPopupConfig, originalBaseline);
        }
      }
    };

    homeAssistant.addEventListener('show-dialog', onShowDialog, true);
    window.addEventListener('dialog-closed', onCreateClosed, true);

    cleanupProxy = await dispatchOfficialCardEvent(
      options.hass,
      nextPopupConfig.cards ?? [],
      'll-create-card',
      undefined,
      handleSaveConfig,
    );

    if (!cleanupProxy) {
      homeAssistant.removeEventListener('show-dialog', onShowDialog, true);
      window.removeEventListener('dialog-closed', onCreateClosed, true);
      return false;
    }
    return true;
  }

  if (typeof options.index !== 'number') return false;
  let cleanupProxy: (() => void) | null = null;

  const onShowDialog = (ev: Event) => {
    const detail = (
      ev as CustomEvent<{ dialogTag?: string; dialogParams?: Record<string, unknown> }>
    ).detail;
    if (detail?.dialogTag !== 'hui-dialog-edit-card') return;

    homeAssistant.removeEventListener('show-dialog', onShowDialog, true);
    ev.stopImmediatePropagation?.();
    ev.stopPropagation();
    if (detail.dialogParams) {
      openChildInOfficialEditDialog(
        detail.dialogParams,
        parentParams,
        originalBaseline,
        () => nextPopupConfig,
        () => cleanupProxy?.(),
      );
    } else {
      cleanupProxy?.();
    }
  };

  homeAssistant.addEventListener('show-dialog', onShowDialog, true);

  cleanupProxy = await dispatchOfficialCardEvent(
    options.hass,
    nextPopupConfig.cards ?? [],
    'll-edit-card',
    options.index,
    handleSaveConfig,
  );

  if (!cleanupProxy) {
    homeAssistant.removeEventListener('show-dialog', onShowDialog, true);
    return false;
  }
  return true;
}

/**
 * Expands the right-hand preview pane inside HA's `hui-dialog-edit-card`
 * so multi-row Pop-up previews scroll cleanly at full viewport height.
 */
export function expandEditDialogPreviewPane(): void {
  try {
    const previewEl = getActiveEditCardDialog()?.shadowRoot?.querySelector(
      'ha-dialog > div.content > div.element-preview',
    ) as HTMLElement | null;
    if (previewEl && previewEl.style.overflowY !== 'auto') {
      previewEl.style.position = 'sticky';
      previewEl.style.top = '0';
      previewEl.style.maxHeight = 'calc(100vh - 210px)';
      previewEl.style.overflowY = 'auto';
    }
  } catch {
    // ignore
  }
}
