/**
 * Formats a Home Assistant ISO last_changed timestamp into a concise Italian relative string
 * (e.g. "10 secondi fa", "10 minuti fa", "1 ora fa", "2 giorni fa").
 */
export function formatLastChanged(iso?: string): string | null {
  if (!iso) return null;
  const ts = Date.parse(iso);
  if (Number.isNaN(ts)) return null;

  const diffSec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (diffSec < 5) return 'Adesso';
  if (diffSec < 60) {
    return diffSec === 1 ? '1 secondo fa' : `${diffSec} secondi fa`;
  }

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return diffMin === 1 ? '1 minuto fa' : `${diffMin} minuti fa`;
  }

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) {
    return diffHours === 1 ? '1 ora fa' : `${diffHours} ore fa`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return diffDays === 1 ? '1 giorno fa' : `${diffDays} giorni fa`;
}
