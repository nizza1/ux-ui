import type { ReactNode } from "react";

interface LabelProps {
  children: ReactNode;
  className?: string;
}

export function Label({ children, className }: LabelProps) {
  return (
    <span
      className={`font-mono text-[10px] font-semibold tracking-[0.12em] uppercase text-(--accent-text) ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
