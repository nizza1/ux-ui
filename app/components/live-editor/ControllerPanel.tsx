import { useState } from "react";
import type { PropertyControl, ControlChangeHandler } from "./types";
import { SliderControl } from "./controls/SliderControl";
import { ColorControl } from "./controls/ColorControl";
import { SelectControl } from "./controls/SelectControl";
import { ToggleControl } from "./controls/ToggleControl";
import { StepperControl } from "./controls/StepperControl";
import { CssOutputPanel } from "./CssOutputPanel";

const GROUP_LABELS: Record<string, string> = {
  typography: "Typography",
  colors: "Colors",
  spacing: "Spacing",
  borders: "Borders",
  shadows: "Shadows",
  layout: "Layout",
};

const GROUP_ORDER = ["typography", "colors", "spacing", "borders", "shadows", "layout"];

interface ControllerPanelProps {
  controls: PropertyControl[];
  controlValues: Record<string, string | number>;
  onChange: ControlChangeHandler;
}

export function ControllerPanel({
  controls,
  controlValues,
  onChange,
}: ControllerPanelProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const grouped = new Map<string, PropertyControl[]>();
  for (const c of controls) {
    const list = grouped.get(c.group) ?? [];
    list.push(c);
    grouped.set(c.group, list);
  }

  const toggleGroup = (group: string) => {
    setCollapsed((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <div className="le-controller-panel">
      <div className="le-controller-scroll">
        {GROUP_ORDER.filter((g) => grouped.has(g)).map((group) => {
          const items = grouped.get(group)!;
          const isCollapsed = collapsed[group] ?? false;

          return (
            <div key={group} className="le-control-group">
              <button
                type="button"
                className="le-group-header"
                onClick={() => toggleGroup(group)}
                aria-expanded={!isCollapsed}
              >
                <span>{GROUP_LABELS[group] ?? group}</span>
                <span className={`le-group-chevron ${isCollapsed ? "le-group-chevron--closed" : ""}`}>
                  &#9662;
                </span>
              </button>

              {!isCollapsed && (
                <div className="le-group-body">
                  {items.map((control) => renderControl(control, controlValues, onChange))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <CssOutputPanel controls={controls} controlValues={controlValues} />
    </div>
  );
}

function renderControl(
  control: PropertyControl,
  controlValues: Record<string, string | number>,
  onChange: ControlChangeHandler
) {
  const value = controlValues[control.id] ?? control.defaultValue;

  switch (control.type) {
    case "slider":
      return (
        <SliderControl
          key={control.id}
          id={control.id}
          label={control.label}
          value={value as number}
          min={control.min ?? 0}
          max={control.max ?? 100}
          step={control.step ?? 1}
          unit={control.unit}
          onChange={onChange}
        />
      );
    case "color":
      return (
        <ColorControl
          key={control.id}
          id={control.id}
          label={control.label}
          value={String(value)}
          onChange={onChange}
        />
      );
    case "select":
      return (
        <SelectControl
          key={control.id}
          id={control.id}
          label={control.label}
          value={String(value)}
          options={control.options ?? []}
          onChange={onChange}
        />
      );
    case "toggle":
      return (
        <ToggleControl
          key={control.id}
          id={control.id}
          label={control.label}
          value={value}
          defaultValue={control.defaultValue}
          activeValue={control.options?.[0]?.value ?? ""}
          onChange={onChange}
        />
      );
    case "stepper":
      return (
        <StepperControl
          key={control.id}
          id={control.id}
          label={control.label}
          value={value as number}
          min={control.min ?? 0}
          max={control.max ?? 100}
          step={control.step ?? 1}
          unit={control.unit}
          onChange={onChange}
        />
      );
  }
}
