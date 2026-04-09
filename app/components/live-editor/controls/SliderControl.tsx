import type { ControlChangeHandler } from "../types";

interface SliderControlProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: ControlChangeHandler;
}

export function SliderControl({
  id,
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: SliderControlProps) {
  return (
    <div className="le-control">
      <div className="le-control-header">
        <span className="le-control-label">{label}</span>
        <span className="le-control-value">
          {Number.isInteger(step) ? value : value.toFixed(1)}
          {unit ?? ""}
        </span>
      </div>
      <input
        type="range"
        className="le-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(id, parseFloat(e.target.value))}
      />
    </div>
  );
}
