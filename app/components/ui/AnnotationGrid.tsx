interface AnnotationItem {
  label: string;
  value: string;
}

interface AnnotationGridProps {
  items: AnnotationItem[];
  className?: string;
}

export function AnnotationGrid({ items, className = "" }: AnnotationGridProps) {
  return (
    <div
      className={`grid gap-2 mb-4 ${className}`}
      style={{ gridTemplateColumns: `repeat(${Math.min(items.length, 3)}, 1fr)` }}
    >
      {items.map((item, i) => (
        <div key={i} className="bg-(--bg-surface) border border-(--bg-elevated) rounded-sm p-2 px-4">
          <div className="font-mono text-[9px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-0.5">{item.label}</div>
          <div className="font-mono text-[13px] font-semibold text-(--accent)">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
