/**
 * Farb-Mathematik für die interaktiven Demos der Farb- und Design-System-Module.
 * Keine Abhängigkeiten — HSL, sRGB, OKLCH, WCAG-Kontrast und Paletten-Rampen.
 */

export type RGB = [number, number, number]; // 0–255

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/* ── HSL ↔ RGB ─────────────────────────────────── */

export function hslToRgb(h: number, s: number, l: number): RGB {
  const sat = clamp(s, 0, 100) / 100;
  const lig = clamp(l, 0, 100) / 100;
  const k = (n: number) => (n + (((h % 360) + 360) % 360) / 30) % 12;
  const a = sat * Math.min(lig, 1 - lig);
  const f = (n: number) => lig - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

export function rgbToHex([r, g, b]: RGB): string {
  return "#" + [r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0")).join("");
}

/* ── WCAG-Kontrast ─────────────────────────────── */

const toLinear = (c: number) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};

const toGamma = (v: number) => {
  const c = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  return c * 255;
};

/** Relative Luminanz nach WCAG 2.x (0 = Schwarz, 1 = Weiß) */
export function relativeLuminance([r, g, b]: RGB): number {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/** Contrast Ratio nach WCAG 2.x (1–21) */
export function contrastRatio(a: RGB, b: RGB): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export const WHITE: RGB = [255, 255, 255];
export const BLACK: RGB = [0, 0, 0];

/** Liefert die besser lesbare Textfarbe (Weiß oder Fast-Schwarz) für einen Hintergrund */
export function readableOn(bg: RGB): { color: string; ratio: number; isWhite: boolean } {
  const onWhite = contrastRatio(bg, WHITE);
  const onBlack = contrastRatio(bg, BLACK);
  return onWhite >= onBlack
    ? { color: "#ffffff", ratio: onWhite, isWhite: true }
    : { color: "#0b0b12", ratio: onBlack, isWhite: false };
}

/* ── OKLCH ↔ RGB (nach Björn Ottosson) ─────────── */

function oklabToLinear(L: number, a: number, b: number): [number, number, number] {
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
  const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const inGamut = (lin: number[]) => lin.every((v) => v >= -0.0005 && v <= 1.0005);

/**
 * OKLCH → sRGB. Farben außerhalb des sRGB-Gamuts werden über Chroma-Reduktion
 * hereingeholt (Lightness und Hue bleiben erhalten) — so macht es auch der Browser.
 * Gibt die tatsächlich verwendete Chroma mit zurück.
 */
export function oklchToRgb(L: number, C: number, H: number): { rgb: RGB; chroma: number } {
  const hr = (H * Math.PI) / 180;
  const at = (c: number) => oklabToLinear(L, c * Math.cos(hr), c * Math.sin(hr));

  let chroma = Math.max(0, C);
  if (!inGamut(at(chroma))) {
    let lo = 0;
    let hi = chroma;
    for (let i = 0; i < 22; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(at(mid))) lo = mid;
      else hi = mid;
    }
    chroma = lo;
  }
  const [r, g, b] = at(chroma).map((v) => clamp(toGamma(clamp(v, 0, 1)), 0, 255));
  return { rgb: [Math.round(r), Math.round(g), Math.round(b)], chroma };
}

/** sRGB → OKLCH als [L (0–1), C, H (0–360)] */
export function rgbToOklch([r, g, b]: RGB): [number, number, number] {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.sqrt(A * A + B * B);
  const H = C < 0.0005 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  return [L, C, H];
}

/* ── Paletten-Rampen ───────────────────────────── */

export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type Step = (typeof STEPS)[number];

export interface Shade {
  step: Step;
  rgb: RGB;
  hex: string;
  /** CSS-Wert in der Notation des gewählten Farbraums */
  css: string;
}

export type RampMode = "hsl" | "oklch";

const HSL_LIGHTNESS = [97, 93, 86, 76, 64, 52, 44, 36, 28, 20, 13];
const OKLCH_LIGHTNESS = [0.975, 0.94, 0.885, 0.81, 0.715, 0.625, 0.54, 0.46, 0.385, 0.31, 0.235];
/** Chroma-Kurve: in der Mitte kräftig, an den Rändern zurückgenommen */
const OKLCH_CHROMA = [0.1, 0.22, 0.42, 0.66, 0.88, 1, 0.96, 0.84, 0.7, 0.56, 0.42];

const GRAY_HSL_LIGHTNESS = [98, 96, 91, 84, 65, 46, 34, 26, 17, 11, 6];
const GRAY_OKLCH_LIGHTNESS = [0.985, 0.967, 0.925, 0.87, 0.71, 0.555, 0.445, 0.37, 0.28, 0.21, 0.14];

const round = (v: number, digits: number) => {
  const f = Math.pow(10, digits);
  return Math.round(v * f) / f;
};

/**
 * Farbfamilie (50–950) aus einem Farbton und einer Sättigung.
 * - "hsl":   Lightness-Treppe, Sättigung zu den Rändern hin leicht angehoben
 * - "oklch": gleiche wahrgenommene Helligkeit pro Stufe, unabhängig vom Farbton
 */
export function buildRamp(hue: number, saturation: number, mode: RampMode): Shade[] {
  if (mode === "hsl") {
    return STEPS.map((step, i) => {
      const l = HSL_LIGHTNESS[i];
      // Je weiter von 50 % Lightness entfernt, desto schwächer wirkt Sättigung → ausgleichen
      const s = Math.round(clamp(saturation + Math.abs(l - 50) * 0.22, 0, 100));
      const rgb = hslToRgb(hue, s, l);
      return { step, rgb, hex: rgbToHex(rgb), css: `hsl(${Math.round(hue)} ${s}% ${l}%)` };
    });
  }
  // Basisfarbe in OKLCH übersetzen, damit beide Modi dieselbe Farbe meinen
  const [, baseC, baseH] = rgbToOklch(hslToRgb(hue, saturation, 50));
  const peak = Math.min(baseC, 0.26);
  return STEPS.map((step, i) => {
    const L = OKLCH_LIGHTNESS[i];
    const { rgb, chroma } = oklchToRgb(L, peak * OKLCH_CHROMA[i], baseH);
    return {
      step,
      rgb,
      hex: rgbToHex(rgb),
      css: `oklch(${round(L * 100, 1)}% ${round(chroma, 3)} ${round(baseH, 0)})`,
    };
  });
}

/** Neutrale Grautöne mit optionalem Farbstich (tint 0 = reines Grau) */
export function buildGrayRamp(hue: number, tint: number, mode: RampMode): Shade[] {
  if (mode === "hsl") {
    return STEPS.map((step, i) => {
      const l = GRAY_HSL_LIGHTNESS[i];
      const s = Math.round(tint);
      const rgb = hslToRgb(hue, s, l);
      return { step, rgb, hex: rgbToHex(rgb), css: `hsl(${Math.round(hue)} ${s}% ${l}%)` };
    });
  }
  const [, , baseH] = rgbToOklch(hslToRgb(hue, 80, 50));
  return STEPS.map((step, i) => {
    const L = GRAY_OKLCH_LIGHTNESS[i];
    const { rgb, chroma } = oklchToRgb(L, (tint / 100) * 0.16, baseH);
    return {
      step,
      rgb,
      hex: rgbToHex(rgb),
      css: `oklch(${round(L * 100, 1)}% ${round(chroma, 3)} ${round(baseH, 0)})`,
    };
  });
}

/** Erste Stufe, auf der weißer Text WCAG AA (4.5:1) besteht — oder null */
export function firstStepForWhiteText(ramp: Shade[]): Step | null {
  const hit = ramp.find((shade) => contrastRatio(shade.rgb, WHITE) >= 4.5);
  return hit ? hit.step : null;
}

/* ── Beschreibende Wörter für das HSL-Lab ──────── */

export function describeHue(h: number): string {
  const hue = ((h % 360) + 360) % 360;
  if (hue < 15 || hue >= 345) return "Rot";
  if (hue < 45) return "Orange";
  if (hue < 70) return "Gelb";
  if (hue < 100) return "Gelbgrün";
  if (hue < 160) return "Grün";
  if (hue < 200) return "Türkis";
  if (hue < 262) return "Blau";
  if (hue < 290) return "Violett";
  return "Magenta";
}

export function describeSaturation(s: number): string {
  if (s < 8) return "grau";
  if (s < 30) return "gedämpft";
  if (s < 65) return "mittel gesättigt";
  return "kräftig";
}

export function describeLightness(l: number): string {
  if (l < 15) return "fast schwarz";
  if (l < 40) return "dunkel";
  if (l < 62) return "mittel";
  if (l < 88) return "hell";
  return "fast weiß";
}
