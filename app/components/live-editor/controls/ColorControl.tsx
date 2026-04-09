import type { ControlChangeHandler } from "../types";

interface ColorControlProps {
  id: string;
  label: string;
  value: string;
  onChange: ControlChangeHandler;
}

export function ColorControl({
  id,
  label,
  value,
  onChange,
}: ColorControlProps) {
  return (
    <div className="le-control">
      <div className="le-control-header">
        <span className="le-control-label">{label}</span>
        <span className="le-control-value le-control-value--mono">{value}</span>
      </div>
      <div className="le-color-row">
        <input
          type="color"
          className="le-color-input"
          value={value}
          onChange={(e) => onChange(id, e.target.value)}
        />
        <input
          type="text"
          className="le-color-text"
          value={value}
          onChange={(e) => onChange(id, e.target.value)}
          maxLength={7}
        />
      </div>
    </div>
  );
}
