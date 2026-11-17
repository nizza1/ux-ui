interface SegmentedOption<T extends string | number> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string | number> {
  /** Sichtbares Label links/über der Gruppe */
  label?: string;
  /** Für Screenreader, falls kein sichtbares Label gesetzt ist */
  ariaLabel?: string;
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/** Kompakte Umschalt-Gruppe für die interaktiven Demos (eine Option aktiv). */
export function SegmentedControl<T extends string | number>({
  label,
  ariaLabel,
  options,
  value,
  onChange,
  className = "",
}: SegmentedControlProps<T>) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <span className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost)">
          {label}
        </span>
      )}
      <div
        role="group"
        aria-label={ariaLabel ?? label}
        className="inline-flex flex-wrap gap-1 p-1 rounded-lg bg-(--bg-elevated) border border-(--bg-hover) self-start"
      >
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={String(option.value)}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={`px-3 py-1.5 rounded-md text-[13px] font-semibold cursor-pointer transition-colors duration-150 ${
                active
                  ? "bg-(--bg-surface) text-(--text-primary) shadow-(--shadow-sm)"
                  : "bg-transparent text-(--text-tertiary) hover:text-(--text-primary)"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
