/**
 * Prevents touchmove events inside an open <dialog> from leaking through and
 * scrolling the Home Assistant dashboard behind it on Android/iOS WebView,
 * while preserving scrolling inside genuinely overflowing containers
 * (e.g. color swatch strip, scenes sheet, selector list, or tall popups).
 */
export function guardDialogTouchMove(e: TouchEvent, dialogEl?: HTMLDialogElement | null): void {
  if (!dialogEl || !dialogEl.open) return;

  const path = e.composedPath();
  for (const node of path) {
    if (node === dialogEl) break;
    if (!(node instanceof HTMLElement)) continue;

    const style = window.getComputedStyle(node);
    const canScrollY =
      (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
      node.scrollHeight > node.clientHeight + 1;
    const canScrollX =
      (style.overflowX === 'auto' || style.overflowX === 'scroll') &&
      node.scrollWidth > node.clientWidth + 1;

    if (canScrollY || canScrollX) {
      return;
    }
  }

  if (e.cancelable) {
    e.preventDefault();
  }
}
