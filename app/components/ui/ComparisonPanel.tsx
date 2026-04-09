import type { ReactNode } from "react";

interface PanelProps {
  label: string;
  variant: "good" | "bad";
  children: ReactNode;
}

function Panel({ label, variant, children }: PanelProps) {
  const isGood = variant === "good";
  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl overflow-hidden">
      <div
        className="h-0.75 w-full"
        style={{
          background: isGood
            ? "linear-gradient(to right, var(--success-color), transparent)"
            : "linear-gradient(to right, var(--bad-color), transparent)",
        }}
      />
      <div
        className={`inline-flex items-center gap-1.5 font-mono text-[9px] font-semibold tracking-[1.5px] uppercase px-2.5 py-0.75 rounded-full border m-4 mb-2 ${
          isGood
            ? "text-(--success-color) bg-(--success-bg) border-(--success-border)"
            : "text-(--bad-color) bg-(--bad-bg) border-(--bad-border)"
        }`}
      >
        <span
          className={`w-1.25 h-1.25 rounded-full ${
            isGood ? "bg-(--success-color)" : "bg-(--bad-color)"
          }`}
        />
        {label}
      </div>
      <div className="px-4 pb-4">
        {children}
      </div>
    </div>
  );
}

interface ComparisonPanelProps {
  bad: { label: string; children: ReactNode };
  good: { label: string; children: ReactNode };
  className?: string;
}

export function ComparisonPanel({ bad, good, className = "" }: ComparisonPanelProps) {
  return (
    <div className={`grid grid-cols-2 gap-4 mb-6 ${className}`}>
      <Panel variant="bad" label={bad.label}>{bad.children}</Panel>
      <Panel variant="good" label={good.label}>{good.children}</Panel>
    </div>
  );
}
