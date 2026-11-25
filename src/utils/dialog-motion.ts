/**
 * Shared Material 3 Expressive dialog open / close Web Animations.
 * Uses GPU-composited transform & opacity with M3 Emphasized easing curves
 * for crisp, lightweight motion across desktop popups and mobile bottom sheets.
 */

const M3_EMPHASIZED_DECEL = 'cubic-bezier(0.05, 0.7, 0.1, 1.0)';
const M3_EMPHASIZED_ACCEL = 'cubic-bezier(0.3, 0.0, 0.8, 0.15)';

export function animateDialogOpen(
  surface: HTMLElement | undefined | null,
  originRect?: DOMRect | null,
): void {
  if (!surface) return;
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
            transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`,
            borderRadius: '28px',
            opacity: 0.65,
          },
          {
            transform: 'translate(0px, 0px) scale(1, 1)',
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
          { transform: 'translateY(48px)', opacity: 0 },
          { transform: 'translateY(0px)', opacity: 1 },
        ]
      : [
          { transform: 'scale(0.92)', opacity: 0 },
          { transform: 'scale(1)', opacity: 1 },
        ],
    {
      duration: isMobile ? 280 : 250,
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
    onDone();
    return;
  }

  if (!surface) {
    dialog.close();
    onDone();
    return;
  }

  const isMobile = window.matchMedia('(max-width: 600px)').matches;
  const anim = surface.animate(
    isMobile
      ? [
          { transform: 'translateY(0px)', opacity: 1 },
          { transform: 'translateY(36px)', opacity: 0 },
        ]
      : [
          { transform: 'scale(1)', opacity: 1 },
          { transform: 'scale(0.93)', opacity: 0 },
        ],
    {
      duration: 170,
      easing: M3_EMPHASIZED_ACCEL,
    },
  );

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    if (dialog.open) dialog.close();
    onDone();
  };

  anim.onfinish = finish;
  anim.oncancel = finish;
}
