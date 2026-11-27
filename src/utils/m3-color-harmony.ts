/**
 * Lightweight Material 3 Matte Tonal Color Harmonizer.
 *
 * Converts any Home Assistant `ui_color` name, RGB tuple, or HEX string into a
 * softly desaturated matte Material 3 Expressive tonal palette (`container`,
 * `well`, `progressFill`, `onContainer`, `accent`, `onAccent`) adapted to Dark
 * or Light mode, guaranteeing crisp contrast without harsh saturation.
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

const HA_UI_COLOR_MAP: Record<string, [number, number, number]> = {
  red: [244, 67, 54],
  pink: [233, 30, 99],
  purple: [156, 39, 176],
  'deep-purple': [103, 58, 183],
  indigo: [63, 81, 181],
  blue: [33, 150, 243],
  'light-blue': [3, 169, 244],
  cyan: [0, 188, 212],
  teal: [0, 150, 136],
  green: [76, 175, 80],
  'light-green': [139, 195, 74],
  lime: [205, 220, 57],
  yellow: [255, 235, 59],
  amber: [255, 193, 7],
  orange: [255, 152, 0],
  'deep-orange': [255, 87, 34],
  brown: [121, 85, 72],
  'light-grey': [189, 189, 189],
  grey: [158, 158, 158],
  'dark-grey': [97, 97, 97],
  'blue-grey': [96, 125, 139],
  black: [33, 33, 33],
  white: [245, 245, 245],
};

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
    const key = input.trim().toLowerCase();
    if (key in HA_UI_COLOR_MAP) {
      return HA_UI_COLOR_MAP[key];
    }

    const clean = key.replace(/^#/, '');
    if (/^[0-9a-f]{6}$/.test(clean)) {
      return [
        parseInt(clean.slice(0, 2), 16),
        parseInt(clean.slice(2, 4), 16),
        parseInt(clean.slice(4, 6), 16),
      ];
    }
    if (/^[0-9a-f]{3}$/.test(clean)) {
      return [
        parseInt(clean[0] + clean[0], 16),
        parseInt(clean[1] + clean[1], 16),
        parseInt(clean[2] + clean[2], 16),
      ];
    }
    const rgbMatch = key.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
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
  if (typeof input === 'string') {
    const key = input.trim().toLowerCase();
    if (!key || key === 'state' || key === 'none') {
      return null;
    }
    if (key === 'primary') {
      return {
        container: 'var(--md-sys-color-primary-container, #2e4379)',
        well: 'color-mix(in srgb, var(--md-sys-color-scrim, #000000) 22%, var(--md-sys-color-primary-container, #2e4379))',
        progressFill:
          'color-mix(in srgb, var(--md-sys-color-primary, #b1c5ff) 26%, var(--md-sys-color-primary-container, #2e4379))',
        onContainer: 'var(--md-sys-color-on-primary-container, #dae2ff)',
        accent: 'var(--md-sys-color-primary, #b1c5ff)',
        onAccent: 'var(--md-sys-color-on-primary, #142c60)',
      };
    }
    if (key === 'accent') {
      return {
        container: 'var(--md-sys-color-tertiary-container, #5a3d5a)',
        well: 'color-mix(in srgb, var(--md-sys-color-scrim, #000000) 22%, var(--md-sys-color-tertiary-container, #5a3d5a))',
        progressFill:
          'color-mix(in srgb, var(--md-sys-color-tertiary, #ebb5ea) 26%, var(--md-sys-color-tertiary-container, #5a3d5a))',
        onContainer: 'var(--md-sys-color-on-tertiary-container, #ffd7fc)',
        accent: 'var(--md-sys-color-tertiary, #ebb5ea)',
        onAccent: 'var(--md-sys-color-on-tertiary, #482948)',
      };
    }
  }

  const rgb = parseRgb(input);
  if (!rgb) return null;

  const [h, rawS] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
  const isNeutral = rawS < 10;

  if (isNeutral) {
    if (isDark) {
      return {
        container: 'hsl(220, 6%, 24%)',
        well: 'hsl(220, 7%, 16%)',
        progressFill: 'hsl(220, 6%, 34%)',
        onContainer: 'hsl(220, 10%, 89%)',
        accent: 'hsl(220, 10%, 74%)',
        onAccent: 'hsl(220, 10%, 14%)',
      };
    }
    return {
      container: 'hsl(220, 10%, 90%)',
      well: 'hsl(220, 10%, 83%)',
      progressFill: 'hsl(220, 10%, 79%)',
      onContainer: 'hsl(220, 12%, 20%)',
      accent: 'hsl(220, 12%, 43%)',
      onAccent: '#ffffff',
    };
  }

  // Soft matte Material 3 chroma clamping
  const satContainer = clamp(rawS * 0.54, 18, 44);
  const satWell = clamp(rawS * 0.58, 20, 48);
  const satProgress = clamp(rawS * 0.62, 24, 52);
  const satOn = clamp(rawS * 0.65, 22, 62);
  const satAccent = clamp(rawS * 0.70, 30, 66);

  if (isDark) {
    return {
      container: `hsl(${h}, ${satContainer.toFixed(0)}%, 24%)`,
      well: `hsl(${h}, ${satWell.toFixed(0)}%, 16%)`,
      progressFill: `hsl(${h}, ${satProgress.toFixed(0)}%, 35%)`,
      onContainer: `hsl(${h}, ${satOn.toFixed(0)}%, 89%)`,
      accent: `hsl(${h}, ${satAccent.toFixed(0)}%, 74%)`,
      onAccent: `hsl(${h}, ${satWell.toFixed(0)}%, 14%)`,
    };
  }

  return {
    container: `hsl(${h}, ${satContainer.toFixed(0)}%, 90%)`,
    well: `hsl(${h}, ${satWell.toFixed(0)}%, 83%)`,
    progressFill: `hsl(${h}, ${satProgress.toFixed(0)}%, 79%)`,
    onContainer: `hsl(${h}, ${satOn.toFixed(0)}%, 20%)`,
    accent: `hsl(${h}, ${satAccent.toFixed(0)}%, 43%)`,
    onAccent: '#ffffff',
  };
}
