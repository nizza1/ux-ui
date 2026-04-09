import type { ReactNode } from "react";

interface TheoryCardProps {
  label?: string;
  children: ReactNode;
  className?: string;
}

export function TheoryCard({ label, children, className = "" }: TheoryCardProps) {
  return (
    <div className={`bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl p-6 mb-6 ${className}`}>
      {label && (
        <div className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          {label}
        </div>
      )}
      {children}
    </div>
  );
}
