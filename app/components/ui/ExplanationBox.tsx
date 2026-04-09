import type { ReactNode } from "react";

interface ExplanationBoxProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function ExplanationBox({ title = "Analyse", children, className = "" }: ExplanationBoxProps) {
  return (
    <div className={`bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-4 px-6 mb-4 ${className}`}>
      <div className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2">{title}</div>
      <div className="text-[13px] leading-[1.7] text-(--text-secondary) [&>p]:m-0 [&>p+p]:mt-2 [&_strong]:font-semibold [&_strong]:text-(--text-primary)">
        {children}
      </div>
    </div>
  );
}
