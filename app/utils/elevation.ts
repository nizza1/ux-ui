/**
 * Elevation nach Material UI (MUI).
 * Die Zahlen stammen 1:1 aus dem MUI-Quellcode (styles/shadows.js und
 * styles/getOverlayAlpha.ts) — so lässt sich das System im Workshop am Original zeigen.
 */

/** Die in der Praxis genutzten Stufen (MUI kennt 0–24, diese zehn decken alle Komponenten ab) */
export const ELEVATION_LEVELS = [0, 1, 2, 3, 4, 6, 8, 12, 16, 24] as const;
export type ElevationLevel = (typeof ELEVATION_LEVELS)[number];

export type ShadowLayer = "umbra" | "penumbra" | "ambient";

export const SHADOW_LAYERS: { key: ShadowLayer; name: string; opacity: number; description: string }[] = [
  {
    key: "umbra",
    name: "Umbra",
    opacity: 0.2,
    description: "Kernschatten des Hauptlichts — dunkel, eng, direkt unter der Fläche",
  },
  {
    key: "penumbra",
    name: "Penumbra",
    opacity: 0.14,
    description: "Halbschatten — weicher Übergang, wächst mit der Höhe am stärksten",
  },
  {
    key: "ambient",
    name: "Ambient",
    opacity: 0.12,
    description: "Umgebungslicht — sehr weicher Hof rund um die Fläche",
  },
];

/** [x, y, blur, spread] je Ebene: Umbra, Penumbra, Ambient */
const SHADOW_ARGS: Record<ElevationLevel, number[]> = {
  0: [],
  1: [0, 2, 1, -1, 0, 1, 1, 0, 0, 1, 3, 0],
  2: [0, 3, 1, -2, 0, 2, 2, 0, 0, 1, 5, 0],
  3: [0, 3, 3, -2, 0, 3, 4, 0, 0, 1, 8, 0],
  4: [0, 2, 4, -1, 0, 4, 5, 0, 0, 1, 10, 0],
  6: [0, 3, 5, -1, 0, 6, 10, 0, 0, 1, 18, 0],
  8: [0, 5, 5, -3, 0, 8, 10, 1, 0, 3, 14, 2],
  12: [0, 7, 8, -4, 0, 12, 17, 2, 0, 5, 22, 4],
  16: [0, 8, 10, -5, 0, 16, 24, 2, 0, 6, 30, 5],
  24: [0, 11, 15, -7, 0, 24, 38, 3, 0, 9, 46, 8],
};

const px = (n: number) => (n === 0 ? "0" : `${n}px`);

/** Die drei Schatten-Ebenen einer Stufe als einzelne CSS-Werte (leer bei Stufe 0) */
export function shadowLayers(level: ElevationLevel): Record<ShadowLayer, string> | null {
  const args = SHADOW_ARGS[level];
  if (args.length === 0) return null;
  const part = (i: number, opacity: number) =>
    `${px(args[i])} ${px(args[i + 1])} ${px(args[i + 2])} ${px(args[i + 3])} rgb(0 0 0 / ${opacity})`;
  return { umbra: part(0, 0.2), penumbra: part(4, 0.14), ambient: part(8, 0.12) };
}

/** Kompletter box-shadow-Wert einer Stufe; einzelne Ebenen lassen sich abschalten */
export function elevationShadow(
  level: ElevationLevel,
  enabled: Record<ShadowLayer, boolean> = { umbra: true, penumbra: true, ambient: true }
): string {
  const layers = shadowLayers(level);
  if (!layers) return "none";
  const active = SHADOW_LAYERS.filter((layer) => enabled[layer.key]).map((layer) => layers[layer.key]);
  return active.length ? active.join(", ") : "none";
}

/**
 * Dark Mode: Statt eines stärkeren Schattens wird die Fläche aufgehellt.
 * Formel aus MUI — liefert den Alpha-Wert einer weißen Überlagerung (0–1).
 */
export function overlayAlpha(level: number): number {
  const alpha = level < 1 ? 5.11916 * level ** 2 : 4.5 * Math.log(level + 1) + 2;
  return Math.round(alpha * 10) / 1000;
}

/** Ergebnisfarbe einer Fläche im Dark Mode: Basis #121212 plus weiße Überlagerung */
export function darkSurfaceColor(level: number): string {
  const base = 18;
  const value = Math.round(base + (255 - base) * overlayAlpha(level));
  const hex = value.toString(16).padStart(2, "0");
  return `#${hex}${hex}${hex}`;
}

/** Wo Material UI die Stufe standardmäßig einsetzt */
export const ELEVATION_USAGE: Record<ElevationLevel, string> = {
  0: "Seitenhintergrund und flache Bereiche",
  1: "Card · Paper (Standardwert)",
  2: "Button (gefüllt) im Ruhezustand",
  3: "Zwischenstufe für eigene Komponenten",
  4: "App Bar · Button bei Hover",
  6: "Floating Action Button · Snackbar",
  8: "Menu · Popover · Button gedrückt",
  12: "Floating Action Button gedrückt",
  16: "Drawer, der über den Inhalt fährt",
  24: "Dialog (Modal)",
};
