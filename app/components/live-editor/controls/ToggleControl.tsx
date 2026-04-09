import type { ControlChangeHandler } from "../types";

interface ToggleControlProps {
  id: string;
  label: string;
  value: string | number;
  defaultValue: string | number;
  activeValue: string;
  onChange: ControlChangeHandler;
}

export function ToggleControl({
  id,
  label,
  value,
  defaultValue,
  activeValue,
  onChange,
}: ToggleControlProps) {
  const isOn = String(value) !== String(defaultValue);

  return (
    <div className="le-control le-control--toggle">
      <span className="le-control-label">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        className={`le-toggle ${isOn ? "le-toggle--on" : ""}`}
        onClick={() =>
          onChange(id, isOn ? defaultValue : activeValue)
        }
      >
        <span className="le-toggle-thumb" />
      </button>
    </div>
  );
}
