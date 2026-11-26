export interface ArtworkPalette {
  /** Deep tonal dark color derived from artwork hue for readable scrim/vignette */
  scrim: string;
  /** Vibrant light tonal accent for Play/Pause button & active wavy progress track */
  accent: string;
  /** High-contrast dark ink on top of accent */
  onAccent: string;
  /** M3 Expressive Dark-mode tonal container derived from artwork hue */
  containerDark: string;
  /** High-contrast foreground on containerDark */
  onContainerDark: string;
  /** M3 Expressive Light-mode tonal container derived from artwork hue */
  containerLight: string;
  /** High-contrast foreground on containerLight */
  onContainerLight: string;
}

const paletteCache = new Map<string, ArtworkPalette | null>();

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s * 100, l * 100];
}

/**
 * Extracts a Material 3 Expressive tonal palette (scrim, vibrant accent, on-accent)
 * from an artwork URL using a tiny 24x24 offscreen canvas.
 * Falls back gracefully to null if the image is monochromatic or blocked by CORS.
 */
export async function extractArtworkPalette(url: string): Promise<ArtworkPalette | null> {
  if (!url) return null;
  if (paletteCache.has(url)) {
    return paletteCache.get(url) ?? null;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';

    img.onload = () => {
      try {
        const size = 24;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          paletteCache.set(url, null);
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;

        // Quantize into 24 hue buckets weighted by saturation & mid-luminance
        const buckets = new Array<{ w: number; hSin: number; hCos: number; s: number }>(24);
        for (let i = 0; i < 24; i++) buckets[i] = { w: 0, hSin: 0, hCos: 0, s: 0 };

        let totalSat = 0;
        let pixelCount = 0;

        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 128) continue;
          const [h, s, l] = rgbToHsl(data[i], data[i + 1], data[i + 2]);
          pixelCount++;
          totalSat += s;

          // Ignore near-black, near-white, and grey pixels for vibrant accent selection
          if (s < 12 || l < 10 || l > 92) continue;

          const idx = Math.floor((h % 360) / 15) % 24;
          const lumWeight = 1 - Math.abs(l - 50) / 52;
          const weight = (s / 100) * (0.4 + 0.6 * lumWeight);
          const rad = (h * Math.PI) / 180;
          buckets[idx].w += weight;
          buckets[idx].hSin += Math.sin(rad) * weight;
          buckets[idx].hCos += Math.cos(rad) * weight;
          buckets[idx].s += s * weight;
        }

        let best = buckets[0];
        for (let i = 1; i < 24; i++) {
          if (buckets[i].w > best.w) best = buckets[i];
        }

        // Monochrome / B&W artwork -> return sleek warm-neutral M3 palette
        if (best.w < 0.7 || (pixelCount > 0 && totalSat / pixelCount < 5)) {
          const mono: ArtworkPalette = {
            scrim: 'hsl(240, 6%, 11%)',
            accent: 'hsl(28, 16%, 90%)',
            onAccent: 'hsl(240, 8%, 13%)',
            containerDark: 'hsl(30, 8%, 22%)',
            onContainerDark: 'hsl(30, 12%, 92%)',
            containerLight: 'hsl(30, 14%, 89%)',
            onContainerLight: 'hsl(30, 10%, 16%)',
          };
          paletteCache.set(url, mono);
          resolve(mono);
          return;
        }

        let hue = (Math.atan2(best.hSin, best.hCos) * 180) / Math.PI;
        if (hue < 0) hue += 360;
        const h = Math.round(hue);
        const avgSat = best.s / best.w;

        const scrimSat = Math.round(Math.max(18, Math.min(46, avgSat * 0.55)));
        const accentSat = Math.round(Math.max(42, Math.min(82, avgSat * 0.95)));
        const onAccentSat = Math.round(Math.max(28, Math.min(60, avgSat * 0.65)));
        const darkContSat = Math.round(Math.max(22, Math.min(48, avgSat * 0.62)));
        const darkOnSat = Math.round(Math.max(24, Math.min(72, avgSat * 0.78)));
        const lightContSat = Math.round(Math.max(30, Math.min(74, avgSat * 0.82)));
        const lightOnSat = Math.round(Math.max(28, Math.min(62, avgSat * 0.68)));

        const palette: ArtworkPalette = {
          scrim: `hsl(${h}, ${scrimSat}%, 12%)`,
          accent: `hsl(${h}, ${accentSat}%, 86%)`,
          onAccent: `hsl(${h}, ${onAccentSat}%, 14%)`,
          containerDark: `hsl(${h}, ${darkContSat}%, 22%)`,
          onContainerDark: `hsl(${h}, ${darkOnSat}%, 91%)`,
          containerLight: `hsl(${h}, ${lightContSat}%, 88%)`,
          onContainerLight: `hsl(${h}, ${lightOnSat}%, 16%)`,
        };

        paletteCache.set(url, palette);
        resolve(palette);
      } catch {
        // SecurityError from CORS-restricted image -> fallback to theme tokens
        paletteCache.set(url, null);
        resolve(null);
      }
    };

    img.onerror = () => {
      paletteCache.set(url, null);
      resolve(null);
    };

    img.src = url;
  });
}
