import type { ReactNode } from "react";

interface RuleBoxProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function RuleBox({ title = "Regel", children, className = "" }: RuleBoxProps) {
  return (
    <div className={`bg-(--accent-dim) border border-(--accent-border) rounded-xl p-4 px-6 mb-6 ${className}`}>
      <div className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-1">{title}</div>
      <p className="text-[13px] leading-[1.6] m-0 font-medium text-[#0a6e6a] dark:text-(--accent-text)">{children}</p>
    </div>
  );
}
