export interface PropertyControl {
  id: string;
  property: string;
  label: string;
  type: "slider" | "color" | "select" | "toggle" | "stepper";
  target: string;
  group: "typography" | "colors" | "spacing" | "borders" | "shadows" | "layout";
  defaultValue: string | number;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: string }[];
}

export interface LiveEditorProps {
  /** Complete, self-contained HTML string. Must include inline <style>. */
  html: string;
  /** Legacy controls (optional — inspector auto-discovers properties). */
  controls?: PropertyControl[];
  /** Initial editor mode */
  defaultMode?: "code" | "controller";
  /** Height of the preview iframe */
  previewHeight?: number;
  /** Title shown above the editor */
  title?: string;
}

export type ControlChangeHandler = (id: string, value: string | number) => void;

/* ── Inspector types ───────────────────────────── */

export interface SelectedElementInfo {
  /** Unique CSS selector that can re-find this element */
  selector: string;
  /** Human-readable breadcrumb path */
  displayPath: string;
  /** Short selector for CSS output (e.g. ".name") */
  displaySelector: string;
  tag: string;
  classes: string[];
  /** Computed styles snapshot at selection time */
  styles: Record<string, string>;
}

export interface PreviewPaneHandle {
  applyStyle: (property: string, value: string) => void;
  reapplyAllStyles: (changes: Record<string, Record<string, string>>) => void;
  clearSelection: () => void;
}

/** All tracked style changes: uniqueSelector → { cssProperty → value } */
export type StyleChangesMap = Record<string, Record<string, string>>;
