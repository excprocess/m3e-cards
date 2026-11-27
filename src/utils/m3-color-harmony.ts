/**
 * Lightweight Material 3 Tonal Color Harmonizer.
 *
 * Converts any user-selected RGB tuple or HEX string into a perceptually balanced
 * Material 3 Expressive tonal palette (`container`, `well`, `progressFill`,
 * `onContainer`, `accent`, `onAccent`) adapted to Dark or Light mode, guaranteeing
 * crisp contrast and Fitbit/Google Home tonal harmony without heavy dependencies.
 */

export type BadgeColorInput = [number, number, number] | string | undefined | null;

export interface M3BadgeTonalPalette {
  container: string;
  well: string;
  progressFill: string;
  onContainer: string;
  accent: string;
  onAccent: string;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function parseRgb(input: BadgeColorInput): [number, number, number] | null {
  if (!input) return null;

  if (Array.isArray(input) && input.length >= 3) {
    const r = Number(input[0]);
    const g = Number(input[1]);
    const b = Number(input[2]);
    if ([r, g, b].every((n) => Number.isFinite(n))) {
      return [
        clamp(Math.round(r), 0, 255),
        clamp(Math.round(g), 0, 255),
        clamp(Math.round(b), 0, 255),
      ];
    }
    return null;
  }

  if (typeof input === 'string') {
    const clean = input.trim().replace(/^#/, '');
    if (/^[0-9a-fA-F]{6}$/.test(clean)) {
      return [
        parseInt(clean.slice(0, 2), 16),
        parseInt(clean.slice(2, 4), 16),
        parseInt(clean.slice(4, 6), 16),
      ];
    }
    if (/^[0-9a-fA-F]{3}$/.test(clean)) {
      return [
        parseInt(clean[0] + clean[0], 16),
        parseInt(clean[1] + clean[1], 16),
        parseInt(clean[2] + clean[2], 16),
      ];
    }
    const rgbMatch = input.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (rgbMatch) {
      return [
        clamp(Number(rgbMatch[1]), 0, 255),
        clamp(Number(rgbMatch[2]), 0, 255),
        clamp(Number(rgbMatch[3]), 0, 255),
      ];
    }
  }

  return null;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  const l = (max + min) / 2;

  if (d === 0) return [0, 0, l * 100];

  const s = d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (max === rn) h = ((gn - bn) / d) % 6;
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  return [h, s * 100, l * 100];
}

export function buildM3BadgeTonalPalette(
  input: BadgeColorInput,
  isDark: boolean,
): M3BadgeTonalPalette | null {
  const rgb = parseRgb(input);
  if (!rgb) return null;

  const [h, rawS] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
  const isNeutral = rawS < 10;

  if (isNeutral) {
    if (isDark) {
      return {
        container: 'hsl(220, 6%, 24%)',
        well: 'hsl(220, 7%, 15%)',
        progressFill: 'hsl(220, 6%, 34%)',
        onContainer: 'hsl(220, 10%, 91%)',
        accent: 'hsl(220, 10%, 76%)',
        onAccent: 'hsl(220, 10%, 14%)',
      };
    }
    return {
      container: 'hsl(220, 10%, 90%)',
      well: 'hsl(220, 10%, 82%)',
      progressFill: 'hsl(220, 10%, 79%)',
      onContainer: 'hsl(220, 12%, 18%)',
      accent: 'hsl(220, 12%, 42%)',
      onAccent: '#ffffff',
    };
  }

  // Perceptual M3 chroma clamping: keeps vivid hues rich without harsh neon glare
  const satContainer = clamp(rawS * 0.72, 26, 62);
  const satWell = clamp(rawS * 0.78, 28, 66);
  const satProgress = clamp(rawS * 0.78, 32, 66);
  const satOn = clamp(rawS * 0.82, 28, 78);
  const satAccent = clamp(rawS * 0.85, 38, 82);

  if (isDark) {
    return {
      container: `hsl(${h}, ${satContainer.toFixed(0)}%, 27%)`,
      well: `hsl(${h}, ${satWell.toFixed(0)}%, 18%)`,
      progressFill: `hsl(${h}, ${satProgress.toFixed(0)}%, 41%)`,
      onContainer: `hsl(${h}, ${satOn.toFixed(0)}%, 90%)`,
      accent: `hsl(${h}, ${satAccent.toFixed(0)}%, 76%)`,
      onAccent: `hsl(${h}, ${satWell.toFixed(0)}%, 14%)`,
    };
  }

  return {
    container: `hsl(${h}, ${clamp(satContainer, 28, 64).toFixed(0)}%, 89%)`,
    well: `hsl(${h}, ${clamp(satWell, 30, 66).toFixed(0)}%, 81%)`,
    progressFill: `hsl(${h}, ${clamp(satProgress, 34, 68).toFixed(0)}%, 76%)`,
    onContainer: `hsl(${h}, ${clamp(satOn, 36, 72).toFixed(0)}%, 19%)`,
    accent: `hsl(${h}, ${clamp(satAccent, 42, 78).toFixed(0)}%, 42%)`,
    onAccent: '#ffffff',
  };
}
