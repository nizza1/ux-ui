import type { ComponentType, ReactNode } from "react";

interface InsightRowProps {
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  children: ReactNode;
  className?: string;
}

export function InsightRow({ icon: Icon, title, children, className = "" }: InsightRowProps) {
  return (
    <div className={`flex gap-4 mb-4 ${className}`}>
      <div className="w-9 h-9 rounded-sm bg-(--accent-dim) border border-(--accent-border) flex items-center justify-center shrink-0 text-(--accent)">
        <Icon size={18} strokeWidth={2} />
      </div>
      <div className="flex-1">
        <h4 className="text-[14px] font-bold text-(--text-primary) mt-0 mb-1">{title}</h4>
        <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">{children}</p>
      </div>
    </div>
  );
}
