export type TokenCategory = "color" | "space" | "radius" | "font-size" | "font-weight" | "line-height" | "font-family";

export interface DesignToken {
  id: string;
  name: string;      // e.g. "space-3", "color-primary"
  category: TokenCategory;
  value: string;     // raw value e.g. "16px", "#0ea5a0"
}

export interface SelectedElementInfo {
  selector: string;         // unique path-based selector for state keying
  displaySelector: string;  // human-friendly, e.g. ".d-kpi-value"
  tag: string;
  classes: string[];
  role: string | null;      // data-pp-role
  text: string;             // trimmed text content preview
}

/** For each CSS property: either a raw value (e.g. "16px") or a token reference. */
export interface StyleOverride {
  value: string;
  tokenId?: string; // when set, value is `var(--tok-<name>)`
}

/** Map: selector → { property → StyleOverride } */
export type StyleChangesMap = Record<string, Record<string, StyleOverride>>;

/* ── Icon overrides ───────────────────────────────────── */

export type IconVariant = "stroke" | "fill";

export interface IconOverride {
    name: string;
    size: number;
    strokeWidth: number;
    variant: IconVariant;
}

export type IconOverrideMap = Record<string, Partial<IconOverride>>;

export interface SelectedIconInfo {
    id: string;            // data-pp-icon-id
    defaults: IconOverride; // what the dashboard renders by default
}

export const EDITABLE_PROPERTIES = [
  { key: "color", label: "Color", category: "color" as TokenCategory },
  { key: "background-color", label: "Background", category: "color" as TokenCategory },
  { key: "border-color", label: "Border color", category: "color" as TokenCategory },
  { key: "font-size", label: "Font size", category: "font-size" as TokenCategory },
  { key: "font-weight", label: "Weight", category: "font-weight" as TokenCategory },
  { key: "line-height", label: "Line height", category: "line-height" as TokenCategory },
  { key: "font-family", label: "Font", category: "font-family" as TokenCategory },
  { key: "letter-spacing", label: "Letter spacing", category: "space" as TokenCategory },
  { key: "text-transform", label: "Case", category: "font-family" as TokenCategory },
  { key: "padding", label: "Padding", category: "space" as TokenCategory },
  { key: "margin", label: "Margin", category: "space" as TokenCategory },
  { key: "gap", label: "Gap", category: "space" as TokenCategory },
  { key: "border-width", label: "Border width", category: "space" as TokenCategory },
  { key: "border-radius", label: "Radius", category: "radius" as TokenCategory },
] as const;
