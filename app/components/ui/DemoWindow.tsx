import type { ReactNode } from "react";

interface DemoWindowProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function DemoWindow({ children, title, className = "" }: DemoWindowProps) {
  return (
    <div className={`bg-(--bg-surface) border border-(--bg-elevated) rounded-xl overflow-hidden shadow-(--shadow-sm) ${className}`}>
      <div className="bg-(--bg-elevated) py-2 px-4 flex items-center gap-2 border-b border-(--bg-hover)">
        <span className="w-2 h-2 rounded-full shrink-0 bg-[#ff5f57]" />
        <span className="w-2 h-2 rounded-full shrink-0 bg-[#febc2e]" />
        <span className="w-2 h-2 rounded-full shrink-0 bg-[#28c840]" />
        {title && (
          <span className="font-mono text-[10px] font-semibold text-(--text-ghost) tracking-[0.5px] mx-auto">
            {title}
          </span>
        )}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
