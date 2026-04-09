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
  /** Controls shown in Controller mode. Grouped by `group` field. */
  controls: PropertyControl[];
  /** Initial editor mode */
  defaultMode?: "code" | "controller";
  /** Height of the preview iframe */
  previewHeight?: number;
  /** Title shown above the editor */
  title?: string;
}

export type ControlChangeHandler = (id: string, value: string | number) => void;
