import type { HomeAssistant, LovelaceCardConfig, M3EPopupCardConfig } from '../types/home-assistant';

interface HaDialogElement extends HTMLElement {
  _params?: Record<string, unknown>;
  showDialog?: (params: Record<string, unknown>) => void;
}

interface HuiSectionProxy extends HTMLElement {
  hass?: HomeAssistant;
  index?: number;
  viewIndex?: number;
  config?: Record<string, unknown>;
  lovelace?: {
    config: {
      views: Array<{
        path: string;
        title: string;
        sections: Array<{ type: string; cards: LovelaceCardConfig[] }>;
      }>;
    };
    editMode: boolean;
    saveConfig: (newConfig: Record<string, unknown>) => Promise<void>;
  };
  _initializeConfig?: () => Promise<void>;
  updateComplete?: Promise<unknown>;
  _layoutElement?: HTMLElement;
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

function extractCardsFromProxyConfig(cfg: Record<string, unknown>): LovelaceCardConfig[] {
  const views = cfg?.views as Array<{ sections?: Array<{ cards?: LovelaceCardConfig[] }> }> | undefined;
  const cards = views?.[0]?.sections?.[0]?.cards;
  return Array.isArray(cards) ? cards : [];
}

function reopenParentPopupDialog(
  parentParams: Record<string, unknown>,
  updatedPopupConfig: M3EPopupCardConfig,
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
  }, 30);
}

function openChildInOfficialEditDialog(
  childDialogParams: Record<string, unknown>,
  parentParams: Record<string, unknown>,
  getUpdatedPopupConfig: () => M3EPopupCardConfig,
): boolean {
  const activeDialog = getActiveEditCardDialog();
  if (!activeDialog || typeof activeDialog.showDialog !== 'function') return false;

  const handleClosed = (ev: Event) => {
    const detail = (ev as CustomEvent<{ dialog?: string }>).detail;
    if (detail?.dialog !== 'hui-dialog-edit-card') return;

    const hostRoot = getHomeAssistantHost()?.shadowRoot;
    if (hostRoot?.contains(activeDialog)) return;

    window.removeEventListener('dialog-closed', handleClosed, true);
    reopenParentPopupDialog(parentParams, getUpdatedPopupConfig());
  };

  window.addEventListener('dialog-closed', handleClosed, true);
  activeDialog.showDialog(childDialogParams);
  return true;
}

async function dispatchOnProxySection(
  hass: HomeAssistant,
  cards: LovelaceCardConfig[],
  eventName: 'll-create-card' | 'll-edit-card',
  detail: Record<string, unknown> | undefined,
  onSaveConfig: (newLovelaceConfig: Record<string, unknown>) => Promise<void>,
): Promise<boolean> {
  const homeAssistant = getHomeAssistantHost();
  if (!homeAssistant || !customElements.get('hui-section')) return false;

  const sectionConfig = {
    type: 'grid',
    cards: cards.map((c) => JSON.parse(JSON.stringify(c))),
  };

  const proxy = document.createElement('hui-section') as HuiSectionProxy;
  proxy.style.display = 'none';
  proxy.hass = hass;
  proxy.index = 0;
  proxy.viewIndex = 0;
  proxy.config = sectionConfig;
  proxy.lovelace = {
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

  homeAssistant.appendChild(proxy);

  try {
    if (typeof proxy._initializeConfig === 'function') {
      await proxy._initializeConfig();
    }
    if (proxy.updateComplete) {
      await proxy.updateComplete;
    }
    const layoutEl = proxy._layoutElement;
    if (!layoutEl) {
      proxy.remove();
      return false;
    }
    layoutEl.dispatchEvent(
      new CustomEvent(eventName, {
        bubbles: true,
        composed: true,
        detail,
      }),
    );
    // Keep proxy alive briefly while dialog reads its lovelace reference
    setTimeout(() => proxy.remove(), 120000);
    return true;
  } catch {
    proxy.remove();
    return false;
  }
}

/**
 * Opens Home Assistant's official "Add to dashboard" dialog (`hui-dialog-create-card`)
 * or official "Edit card" dialog (`hui-dialog-edit-card` with Config/Visibility/Layout tabs)
 * for a child card inside `m3e-popup-card`, then returns cleanly to the Pop-up editor!
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

  let nextPopupConfig: M3EPopupCardConfig = {
    ...options.popupConfig,
    cards: [...(options.popupConfig.cards ?? [])],
  };

  const handleSaveConfig = async (lovelaceCfg: Record<string, unknown>) => {
    const updatedCards = extractCardsFromProxyConfig(lovelaceCfg);
    nextPopupConfig = { ...nextPopupConfig, cards: updatedCards };
    options.onCardsUpdated(updatedCards);
  };

  if (options.mode === 'add') {
    let pendingEditParams: Record<string, unknown> | null = null;

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
          openChildInOfficialEditDialog(params, parentParams, () => nextPopupConfig);
        }, 0);
      }
    };

    homeAssistant.addEventListener('show-dialog', onShowDialog, true);
    window.addEventListener('dialog-closed', onCreateClosed, true);

    const ok = await dispatchOnProxySection(
      options.hass,
      nextPopupConfig.cards ?? [],
      'll-create-card',
      undefined,
      handleSaveConfig,
    );

    if (!ok) {
      homeAssistant.removeEventListener('show-dialog', onShowDialog, true);
      window.removeEventListener('dialog-closed', onCreateClosed, true);
    }
    return ok;
  }

  // Edit existing card at `options.index`
  if (typeof options.index !== 'number') return false;

  const onShowDialog = (ev: Event) => {
    const detail = (
      ev as CustomEvent<{ dialogTag?: string; dialogParams?: Record<string, unknown> }>
    ).detail;
    if (detail?.dialogTag !== 'hui-dialog-edit-card') return;

    homeAssistant.removeEventListener('show-dialog', onShowDialog, true);
    ev.stopImmediatePropagation?.();
    ev.stopPropagation();
    if (detail.dialogParams) {
      openChildInOfficialEditDialog(detail.dialogParams, parentParams, () => nextPopupConfig);
    }
  };

  homeAssistant.addEventListener('show-dialog', onShowDialog, true);

  const ok = await dispatchOnProxySection(
    options.hass,
    nextPopupConfig.cards ?? [],
    'll-edit-card',
    { path: [0, 0, options.index] },
    handleSaveConfig,
  );

  if (!ok) {
    homeAssistant.removeEventListener('show-dialog', onShowDialog, true);
  }
  return ok;
}

/**
 * Expands the right-hand preview pane inside HA's `hui-dialog-edit-card`
 * so multi-row Pop-up previews never clip or force tiny scrollboxes.
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
