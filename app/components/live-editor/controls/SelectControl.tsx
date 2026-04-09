import type { ControlChangeHandler } from "../types";

interface SelectControlProps {
  id: string;
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: ControlChangeHandler;
}

export function SelectControl({
  id,
  label,
  value,
  options,
  onChange,
}: SelectControlProps) {
  return (
    <div className="le-control">
      <div className="le-control-header">
        <span className="le-control-label">{label}</span>
      </div>
      <select
        className="le-select"
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
