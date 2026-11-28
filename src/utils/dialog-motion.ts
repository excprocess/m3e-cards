/**
 * Shared Material 3 Expressive dialog open / close Web Animations and universal
 * modal lifecycle manager.
 *
 * Prevents zombie `<dialog open>` overlays and stale card state across:
 * - Android / browser System Back (`popstate` capture + per-dialog history sentinel)
 * - Chromium CloseWatcher native `<dialog>` `'close'` events
 * - Home Assistant view navigation (`location-changed`) and element unmount (`disconnectedCallback`)
 */

const M3_EMPHASIZED_DECEL = 'cubic-bezier(0.05, 0.7, 0.1, 1.0)';
const M3_EMPHASIZED_ACCEL = 'cubic-bezier(0.3, 0.0, 0.8, 0.15)';
const HISTORY_KEY = '__m3eDialogId';

interface ActiveDialogEntry {
  id: number;
  dialog: HTMLDialogElement;
  surface: HTMLElement | null;
  originPath: string;
  pushedHistory: boolean;
  historyPopped: boolean;
  onRequestClose: () => void;
  onForceReset: () => void;
  closeListener: () => void;
}

const activeDialogs: ActiveDialogEntry[] = [];
let dialogSeq = 0;
let ignoreNextPopState = 0;
let ignorePopResetTimer: number | null = null;
let listenersInstalled = false;

function scheduleIgnorePopReset(): void {
  if (ignorePopResetTimer !== null) {
    window.clearTimeout(ignorePopResetTimer);
  }
  ignorePopResetTimer = window.setTimeout(() => {
    ignoreNextPopState = 0;
    ignorePopResetTimer = null;
  }, 500);
}

function getHistoryDialogId(): number | undefined {
  try {
    const st = window.history.state as Record<string, unknown> | null;
    const raw = st?.[HISTORY_KEY];
    return typeof raw === 'number' ? raw : undefined;
  } catch {
    return undefined;
  }
}

function stripHistorySentinel(dialogId: number): void {
  try {
    if (getHistoryDialogId() !== dialogId) return;
    const st = window.history.state;
    if (st && typeof st === 'object') {
      const rest = { ...(st as Record<string, unknown>) };
      delete rest[HISTORY_KEY];
      window.history.replaceState(
        Object.keys(rest).length > 0 ? rest : null,
        '',
        window.location.href,
      );
    } else {
      window.history.replaceState(null, '', window.location.href);
    }
  } catch {
    // ignore history errors
  }
}

function popEntryByDialog(dialog: HTMLDialogElement): ActiveDialogEntry | undefined {
  const idx = activeDialogs.findIndex((e) => e.dialog === dialog);
  if (idx === -1) return undefined;
  const [entry] = activeDialogs.splice(idx, 1);
  dialog.removeEventListener('close', entry.closeListener);
  return entry;
}

function isDialogTrulyModal(dialog: HTMLDialogElement): boolean {
  if (!dialog.open) return false;
  try {
    return dialog.matches(':modal');
  } catch {
    return dialog.open;
  }
}

function installGlobalDialogListeners(): void {
  if (listenersInstalled || typeof window === 'undefined') return;
  listenersInstalled = true;

  window.addEventListener(
    'popstate',
    (ev: PopStateEvent) => {
      if (ignoreNextPopState > 0) {
        ignoreNextPopState--;
        if (ignoreNextPopState <= 0 && ignorePopResetTimer !== null) {
          window.clearTimeout(ignorePopResetTimer);
          ignorePopResetTimer = null;
        }
        ev.stopImmediatePropagation();
        ev.stopPropagation();
        return;
      }

      const top = activeDialogs[activeDialogs.length - 1];
      if (!top) return;

      const curId = getHistoryDialogId();
      if (top.pushedHistory && curId !== top.id) {
        top.historyPopped = true;
        ev.stopImmediatePropagation();
        ev.stopPropagation();
        top.onRequestClose();
        return;
      }

      const curPath = window.location.pathname;
      const toClose = activeDialogs.filter((e) => e.originPath !== curPath);
      for (const entry of toClose) {
        forceCloseDialog(entry.dialog, entry.surface, entry.onForceReset);
      }
    },
    true,
  );

  window.addEventListener(
    'location-changed',
    () => {
      const curPath = window.location.pathname;
      const toClose = activeDialogs.filter((e) => e.originPath !== curPath);
      for (const entry of toClose) {
        forceCloseDialog(entry.dialog, entry.surface, entry.onForceReset);
      }
    },
    true,
  );
}

export function animateDialogOpen(
  surface: HTMLElement | undefined | null,
  originRect?: DOMRect | null,
): void {
  if (!surface) return;
  const dialog = surface.closest('dialog');
  dialog?.classList.remove('is-closing');
  surface.style.pointerEvents = '';
  for (const a of surface.getAnimations()) {
    a.cancel();
  }

  const isMobile = window.matchMedia('(max-width: 600px)').matches;

  if (originRect && !isMobile) {
    const targetRect = surface.getBoundingClientRect();
    if (targetRect.width > 0 && targetRect.height > 0) {
      const dx = originRect.left + originRect.width / 2 - (targetRect.left + targetRect.width / 2);
      const dy = originRect.top + originRect.height / 2 - (targetRect.top + targetRect.height / 2);
      const sx = Math.max(0.35, Math.min(1, originRect.width / targetRect.width));
      const sy = Math.max(0.22, Math.min(1, originRect.height / targetRect.height));

      surface.animate(
        [
          {
            transform: `translate3d(${dx}px, ${dy}px, 0) scale(${sx}, ${sy})`,
            borderRadius: '28px',
            opacity: 0.65,
          },
          {
            transform: 'translate3d(0, 0, 0) scale(1, 1)',
            borderRadius: '32px',
            opacity: 1,
          },
        ],
        {
          duration: 320,
          easing: M3_EMPHASIZED_DECEL,
        },
      );
      return;
    }
  }

  surface.animate(
    isMobile
      ? [
          { transform: 'translate3d(0, 100%, 0)' },
          { transform: 'translate3d(0, 0, 0)' },
        ]
      : [
          { transform: 'translate3d(0, 12px, 0) scale(0.94)', opacity: 0 },
          { transform: 'translate3d(0, 0, 0) scale(1)', opacity: 1 },
        ],
    {
      duration: isMobile ? 300 : 260,
      easing: M3_EMPHASIZED_DECEL,
    },
  );
}

export function animateDialogClose(
  dialog: HTMLDialogElement | undefined | null,
  surface: HTMLElement | undefined | null,
  onDone: () => void,
): void {
  if (!dialog || !dialog.open) {
    dialog?.removeAttribute('open');
    onDone();
    return;
  }

  if (dialog.classList.contains('is-closing')) {
    return;
  }

  if (!surface) {
    try {
      dialog.close();
    } catch {
      // ignore
    }
    dialog.removeAttribute('open');
    onDone();
    return;
  }

  dialog.classList.add('is-closing');
  surface.style.pointerEvents = 'none';
  for (const a of surface.getAnimations()) {
    a.cancel();
  }

  const isMobile = window.matchMedia('(max-width: 600px)').matches;
  const anim = surface.animate(
    isMobile
      ? [
          { transform: 'translate3d(0, 0, 0)', opacity: 1 },
          { transform: 'translate3d(0, 100%, 0)', opacity: 0.92 },
        ]
      : [
          { transform: 'translate3d(0, 0, 0) scale(1)', opacity: 1 },
          { transform: 'translate3d(0, 10px, 0) scale(0.94)', opacity: 0 },
        ],
    {
      duration: isMobile ? 220 : 190,
      easing: M3_EMPHASIZED_ACCEL,
      fill: 'forwards',
    },
  );

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    if (dialog.open) {
      try {
        dialog.close();
      } catch {
        // ignore
      }
    }
    dialog.removeAttribute('open');
    dialog.classList.remove('is-closing');
    surface.style.pointerEvents = '';
    anim.cancel();
    onDone();
  };

  anim.onfinish = finish;
  anim.oncancel = finish;
}

export interface OpenModalDialogOptions {
  originRect?: DOMRect | null;
  pushHistory?: boolean;
  onRequestClose: () => void;
  onForceReset: () => void;
}

/**
 * Opens `<dialog>` modally, self-healing any non-modal zombie `open` attribute,
 * registers a LIFO history sentinel so System Back closes the dialog instead of
 * leaving the view, and attaches a native `'close'` safety listener.
 */
export function openModalDialog(
  dialog: HTMLDialogElement | undefined | null,
  surface: HTMLElement | undefined | null,
  options: OpenModalDialogOptions,
): void {
  if (!dialog) return;
  installGlobalDialogListeners();

  // Clean up any prior registration on this element
  popEntryByDialog(dialog);

  // Self-heal non-modal zombie `<dialog open>` state
  if (dialog.hasAttribute('open') && !isDialogTrulyModal(dialog)) {
    try {
      dialog.close();
    } catch {
      // ignore
    }
    dialog.removeAttribute('open');
  }

  if (!dialog.open) {
    dialog.showModal();
  }

  const id = ++dialogSeq;
  const shouldPush = options.pushHistory !== false;
  let pushedHistory = false;

  if (shouldPush) {
    try {
      const base =
        window.history.state && typeof window.history.state === 'object'
          ? (window.history.state as Record<string, unknown>)
          : {};
      window.history.pushState({ ...base, [HISTORY_KEY]: id }, '', window.location.href);
      pushedHistory = true;
    } catch {
      pushedHistory = false;
    }
  }

  const closeListener = () => {
    forceCloseDialog(dialog, surface, options.onForceReset);
  };

  const entry: ActiveDialogEntry = {
    id,
    dialog,
    surface: surface ?? null,
    originPath: window.location.pathname,
    pushedHistory,
    historyPopped: false,
    onRequestClose: options.onRequestClose,
    onForceReset: options.onForceReset,
    closeListener,
  };

  activeDialogs.push(entry);
  dialog.addEventListener('close', closeListener);
  animateDialogOpen(surface, options.originRect);
}

/**
 * Closes a modal `<dialog>` with M3 exit motion and cleans up its history sentinel.
 */
export function closeModalDialog(
  dialog: HTMLDialogElement | undefined | null,
  surface: HTMLElement | undefined | null,
  onDone: () => void,
): void {
  const entry = dialog ? popEntryByDialog(dialog) : undefined;

  if (entry?.pushedHistory && !entry.historyPopped && getHistoryDialogId() === entry.id) {
    ignoreNextPopState++;
    scheduleIgnorePopReset();
    try {
      window.history.back();
    } catch {
      // fallback to synchronous replace if back fails
      stripHistorySentinel(entry.id);
    }
  }

  animateDialogClose(dialog, surface, onDone);
}

/**
 * Immediately & synchronously tears down a `<dialog>` and clears card state without
 * animation or async `history.back()`. Safe for `disconnectedCallback`, route changes,
 * and transitions into native HA `hass-more-info`.
 */
export function forceCloseDialog(
  dialog: HTMLDialogElement | undefined | null,
  surface: HTMLElement | undefined | null,
  onReset?: () => void,
): void {
  const entry = dialog ? popEntryByDialog(dialog) : undefined;

  if (entry?.pushedHistory && !entry.historyPopped) {
    stripHistorySentinel(entry.id);
  }

  if (surface) {
    for (const a of surface.getAnimations()) {
      a.cancel();
    }
    surface.style.pointerEvents = '';
  }

  if (dialog) {
    dialog.classList.remove('is-closing');
    if (dialog.open) {
      try {
        dialog.close();
      } catch {
        // ignore
      }
    }
    dialog.removeAttribute('open');
  }

  onReset?.();
}
