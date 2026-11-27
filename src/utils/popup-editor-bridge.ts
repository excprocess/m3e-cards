import type {
  LovelaceCardConfig,
  M3EPopupCardConfig,
  M3ETabsCardConfig,
} from '../types/home-assistant';
import { normalizePopupTarget } from './navigation';

export interface M3EPopupEditorHandle {
  getConfig(): M3EPopupCardConfig | undefined;
  updateCards(cards: LovelaceCardConfig[]): void;
  openAddCard(): void;
  openEditCard(index: number): void;
}

export interface M3ETabsEditorHandle {
  getConfig(): M3ETabsCardConfig | undefined;
  getActiveTab(): number;
  setActiveTab(tabIndex: number): void;
  updateTabCards(tabIndex: number, cards: LovelaceCardConfig[]): void;
  openAddCard(tabIndex: number): void;
  openEditCard(tabIndex: number, cardIndex: number): void;
}

const activeEditors = new Set<M3EPopupEditorHandle>();
const activeTabsEditors = new Set<M3ETabsEditorHandle>();

export function registerTabsEditor(handle: M3ETabsEditorHandle): void {
  activeTabsEditors.add(handle);
}

export function unregisterTabsEditor(handle: M3ETabsEditorHandle): void {
  activeTabsEditors.delete(handle);
}

export function findMatchingTabsEditor(): M3ETabsEditorHandle | null {
  if (activeTabsEditors.size === 0) return null;
  return Array.from(activeTabsEditors)[activeTabsEditors.size - 1] ?? null;
}

export function registerPopupEditor(handle: M3EPopupEditorHandle): void {
  activeEditors.add(handle);
}

export function unregisterPopupEditor(handle: M3EPopupEditorHandle): void {
  activeEditors.delete(handle);
}

export function findMatchingPopupEditor(
  popupConfig?: M3EPopupCardConfig,
): M3EPopupEditorHandle | null {
  if (activeEditors.size === 0) return null;
  const targetHash = normalizePopupTarget(popupConfig?.hash);

  for (const editor of activeEditors) {
    const cfg = editor.getConfig();
    if (cfg && normalizePopupTarget(cfg.hash) === targetHash) {
      return editor;
    }
  }
  // Fallback to most recently registered connected editor
  return Array.from(activeEditors)[activeEditors.size - 1] ?? null;
}

const DASHBOARD_CLIPBOARD_KEY = 'dashboardCardClipboard';

export function writeDashboardCardClipboard(card: LovelaceCardConfig): void {
  try {
    sessionStorage.setItem(DASHBOARD_CLIPBOARD_KEY, JSON.stringify(card));
  } catch {
    // ignore storage errors
  }
}

export function readDashboardCardClipboard(): LovelaceCardConfig | null {
  try {
    const raw = sessionStorage.getItem(DASHBOARD_CLIPBOARD_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as LovelaceCardConfig)
      : null;
  } catch {
    return null;
  }
}
