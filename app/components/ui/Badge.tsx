import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "error" | "warning" | "module";
  size?: "sm" | "md";
  dot?: boolean;
}

const variantClasses: Record<string, string> = {
  default:
    "bg-(--bg-elevated) text-(--text-secondary) border border-(--text-ghost)",
  success:
    "bg-(--success-bg) text-(--success-color) border border-(--success-border)",
  error:
    "bg-(--bad-bg) text-(--bad-color) border border-(--bad-border)",
  warning:
    "bg-(--warning-bg) text-(--warning-color) border border-(--warning-border)",
  module:
    "bg-(--accent-dim) text-(--accent-text) border border-(--accent-border) font-mono uppercase tracking-[0.08em]",
};

const sizeClasses: Record<string, string> = {
  sm: "text-[11px] px-2 py-[2px] font-semibold",
  md: "text-xs px-[10px] py-[3px] font-semibold",
};

export function Badge({
  children,
  variant = "default",
  size = "sm",
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-[5px] rounded-full leading-[1.4] whitespace-nowrap ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {dot && (
        <span
          className="w-[6px] h-[6px] rounded-full bg-current shrink-0"
        />
      )}
      {children}
    </span>
  );
}
