import type { ReactNode } from "react";

interface ConceptItemProps {
  title: string;
  children: ReactNode;
}

export function ConceptItem({ title, children }: ConceptItemProps) {
  return (
    <div className="flex gap-4 [counter-increment:concept]">
      <div className="w-7 h-7 min-w-7 rounded-sm bg-(--accent-dim) border border-(--accent-border) flex items-center justify-center font-mono text-[11px] font-bold text-(--accent) shrink-0 mt-px before:content-[counter(concept)]" />
      <div className="flex-1">
        <h4 className="text-[14px] font-bold text-(--text-primary) mt-0 mb-1">{title}</h4>
        <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0 [&_code]:font-mono [&_code]:text-[13px] [&_code]:bg-(--bg-elevated) [&_code]:px-1 [&_code]:rounded">{children}</p>
      </div>
    </div>
  );
}

interface ConceptListProps {
  children: ReactNode;
  className?: string;
}

export function ConceptList({ children, className = "" }: ConceptListProps) {
  return (
    <div className={`[counter-reset:concept] flex flex-col gap-4 ${className}`}>
      {children}
    </div>
  );
}
