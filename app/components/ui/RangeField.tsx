interface RangeFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  /** Anzeige rechts neben dem Label, z. B. "178°" */
  display?: string;
  /** Optionaler CSS-Gradient für die Spur (z. B. Hue-Spektrum) */
  track?: string;
  onChange: (value: number) => void;
  className?: string;
}

/**
 * Beschrifteter Slider. Die Spur kann einen Gradient zeigen, damit man sieht,
 * wohin der Regler führt (Farbton-Spektrum, Sättigungs- oder Helligkeitsverlauf).
 */
export function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  display,
  track,
  onChange,
  className = "",
}: RangeFieldProps) {
  return (
    <label className={`block ${className}`}>
      <span className="flex items-baseline justify-between mb-2">
        <span className="text-[13px] font-semibold text-(--text-primary)">{label}</span>
        <span className="font-mono text-[13px] font-semibold text-(--accent-text) tabular-nums">
          {display ?? value}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={track ? { background: track } : undefined}
        className={`block w-full h-3 rounded-full appearance-none cursor-pointer border border-(--bg-elevated) ${
          track ? "" : "bg-(--bg-elevated)"
        } [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#12121e] [&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(0,0,0,0.35)] [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#12121e] [&::-moz-range-thumb]:shadow-[0_1px_4px_rgba(0,0,0,0.35)] [&::-moz-range-track]:bg-transparent`}
      />
    </label>
  );
}
