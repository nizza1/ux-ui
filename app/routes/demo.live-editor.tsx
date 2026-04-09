import { LiveEditor } from "~/components/live-editor/LiveEditor";
import type { PropertyControl } from "~/components/live-editor/types";

const sampleHtml = `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: system-ui, sans-serif; padding: 32px; background: #f8f9fa; }
  .card {
    max-width: 400px;
    background: #fff;
    border: 1px solid #e0e0e0;
    padding: 16px;
    border-radius: 4px;
  }
  .card h2 {
    font-size: 16px;
    font-weight: 400;
    color: #666;
    margin-bottom: 8px;
  }
  .card .subtitle {
    font-size: 12px;
    font-weight: 400;
    color: #666;
    margin-bottom: 12px;
  }
  .card p {
    font-size: 14px;
    color: #666;
    line-height: 1.4;
    margin-bottom: 16px;
  }
  .card .btn {
    display: inline-block;
    font-size: 14px;
    font-weight: 400;
    color: #666;
    background: #f0f0f0;
    border: 1px solid #ccc;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
</head>
<body>
  <div class="card">
    <h2>Project: Customer Portal Redesign</h2>
    <div class="subtitle">Status: In Progress</div>
    <p>This project focuses on improving the user experience of our customer-facing portal. Key areas include navigation, form design, and visual consistency.</p>
    <button class="btn">View Details</button>
  </div>
</body>
</html>`;

const sampleControls: PropertyControl[] = [
  // Typography
  {
    id: "h2-font-size",
    property: "fontSize",
    label: "Heading — Size",
    type: "slider",
    target: ".card h2",
    group: "typography",
    defaultValue: 16,
    min: 12, max: 32, step: 1, unit: "px",
  },
  {
    id: "h2-font-weight",
    property: "fontWeight",
    label: "Heading — Weight",
    type: "select",
    target: ".card h2",
    group: "typography",
    defaultValue: "400",
    options: [
      { label: "300 Light", value: "300" },
      { label: "400 Regular", value: "400" },
      { label: "500 Medium", value: "500" },
      { label: "600 Semibold", value: "600" },
      { label: "700 Bold", value: "700" },
      { label: "800 Extrabold", value: "800" },
    ],
  },
  {
    id: "p-line-height",
    property: "lineHeight",
    label: "Body — Line Height",
    type: "slider",
    target: ".card p",
    group: "typography",
    defaultValue: 1.4,
    min: 1.0, max: 2.2, step: 0.1,
  },
  {
    id: "p-font-size",
    property: "fontSize",
    label: "Body — Size",
    type: "slider",
    target: ".card p",
    group: "typography",
    defaultValue: 14,
    min: 12, max: 18, step: 1, unit: "px",
  },
  // Colors
  {
    id: "h2-color",
    property: "color",
    label: "Heading — Color",
    type: "color",
    target: ".card h2",
    group: "colors",
    defaultValue: "#666666",
  },
  {
    id: "subtitle-color",
    property: "color",
    label: "Subtitle — Color",
    type: "color",
    target: ".card .subtitle",
    group: "colors",
    defaultValue: "#666666",
  },
  {
    id: "p-color",
    property: "color",
    label: "Body Text — Color",
    type: "color",
    target: ".card p",
    group: "colors",
    defaultValue: "#666666",
  },
  {
    id: "btn-bg",
    property: "backgroundColor",
    label: "Button — Background",
    type: "color",
    target: ".card .btn",
    group: "colors",
    defaultValue: "#f0f0f0",
  },
  {
    id: "btn-color",
    property: "color",
    label: "Button — Text",
    type: "color",
    target: ".card .btn",
    group: "colors",
    defaultValue: "#666666",
  },
  // Spacing
  {
    id: "card-padding",
    property: "padding",
    label: "Card — Padding",
    type: "slider",
    target: ".card",
    group: "spacing",
    defaultValue: 16,
    min: 8, max: 48, step: 4, unit: "px",
  },
  {
    id: "h2-margin-bottom",
    property: "marginBottom",
    label: "Heading — Bottom Gap",
    type: "stepper",
    target: ".card h2",
    group: "spacing",
    defaultValue: 8,
    min: 0, max: 32, step: 4, unit: "px",
  },
  {
    id: "p-margin-bottom",
    property: "marginBottom",
    label: "Body — Bottom Gap",
    type: "stepper",
    target: ".card p",
    group: "spacing",
    defaultValue: 16,
    min: 0, max: 48, step: 4, unit: "px",
  },
  {
    id: "btn-padding-y",
    property: "paddingBlock",
    label: "Button — Vertical Padding",
    type: "slider",
    target: ".card .btn",
    group: "spacing",
    defaultValue: 8,
    min: 4, max: 20, step: 2, unit: "px",
  },
  {
    id: "btn-padding-x",
    property: "paddingInline",
    label: "Button — Horizontal Padding",
    type: "slider",
    target: ".card .btn",
    group: "spacing",
    defaultValue: 16,
    min: 8, max: 48, step: 4, unit: "px",
  },
  // Borders
  {
    id: "card-radius",
    property: "borderRadius",
    label: "Card — Border Radius",
    type: "slider",
    target: ".card",
    group: "borders",
    defaultValue: 4,
    min: 0, max: 24, step: 2, unit: "px",
  },
  {
    id: "btn-radius",
    property: "borderRadius",
    label: "Button — Border Radius",
    type: "slider",
    target: ".card .btn",
    group: "borders",
    defaultValue: 4,
    min: 0, max: 24, step: 2, unit: "px",
  },
  {
    id: "btn-border",
    property: "border",
    label: "Button — Border",
    type: "toggle",
    target: ".card .btn",
    group: "borders",
    defaultValue: "1px solid #ccc",
    options: [{ label: "None", value: "none" }],
  },
  // Shadows
  {
    id: "card-shadow",
    property: "boxShadow",
    label: "Card — Shadow",
    type: "select",
    target: ".card",
    group: "shadows",
    defaultValue: "none",
    options: [
      { label: "None", value: "none" },
      { label: "SM", value: "0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.1)" },
      { label: "MD", value: "0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)" },
      { label: "LG", value: "0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)" },
      { label: "XL", value: "0 20px 25px rgba(0,0,0,0.1), 0 8px 10px rgba(0,0,0,0.04)" },
    ],
  },
];

export default function LiveEditorDemo() {
  return (
    <div className="py-8 px-8 max-w-[1200px] mx-auto">
      <h1 className="text-[28px] font-extrabold text-(--text-primary) mb-2 mt-0 tracking-tight">
        LiveEditor Demo
      </h1>
      <p className="text-[15px] text-(--text-secondary) mb-8 mt-0">
        Try the Controls tab to adjust the card visually, or switch to Code to edit the HTML directly.
      </p>
      <LiveEditor
        html={sampleHtml}
        controls={sampleControls}
        defaultMode="controller"
        previewHeight={420}
        title="Exercise: Improve this project card's visual hierarchy"
      />
    </div>
  );
}
