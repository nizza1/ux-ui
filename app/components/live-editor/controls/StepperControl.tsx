import type { ControlChangeHandler } from "../types";

interface StepperControlProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: ControlChangeHandler;
}

export function StepperControl({
  id,
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: StepperControlProps) {
  const decrement = () => {
    const next = Math.max(min, value - step);
    onChange(id, Number.isInteger(step) ? next : parseFloat(next.toFixed(2)));
  };

  const increment = () => {
    const next = Math.min(max, value + step);
    onChange(id, Number.isInteger(step) ? next : parseFloat(next.toFixed(2)));
  };

  return (
    <div className="le-control">
      <div className="le-control-header">
        <span className="le-control-label">{label}</span>
      </div>
      <div className="le-stepper">
        <button
          type="button"
          className="le-stepper-btn"
          onClick={decrement}
          disabled={value <= min}
          aria-label="Decrease"
        >
          -
        </button>
        <span className="le-stepper-value">
          {Number.isInteger(step) ? value : value.toFixed(1)}
          {unit ?? ""}
        </span>
        <button
          type="button"
          className="le-stepper-btn"
          onClick={increment}
          disabled={value >= max}
          aria-label="Increase"
        >
          +
        </button>
      </div>
    </div>
  );
}
