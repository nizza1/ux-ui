import { Link } from "@remix-run/react";
import { ArrowRight } from "lucide-react";

interface ModuleCardProps {
  number: string;
  title: string;
  description?: string;
  href: string;
  hasContent?: boolean;
}

export function ModuleCard({
  number,
  title,
  description,
  href,
  hasContent = false,
}: ModuleCardProps) {
  return (
    <Link
      to={href}
      className="block no-underline bg-(--bg-surface) border border-(--bg-hover) rounded-xl p-6 shadow-(--shadow-sm) relative overflow-hidden transition-all duration-150 hover:shadow-(--shadow-md) hover:border-(--accent-border) hover:-translate-y-px"
    >
      {/* Module number */}
      <div className="font-mono text-[11px] font-semibold text-(--accent-text) bg-(--accent-dim) border border-(--accent-border) rounded-full py-0.5 px-2 inline-flex items-center gap-1.25 mb-4 tracking-[0.08em] uppercase">
        <span className="w-1.25 h-1.25 rounded-full bg-(--accent)" />
        Module {number}
      </div>

      {/* Title */}
      <h3 className="m-0 mb-2 text-[15px] font-bold text-(--text-primary) tracking-tight leading-[1.35]">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="m-0 mb-4 text-[13px] text-(--text-secondary) leading-[1.55]">
          {description}
        </p>
      )}

      {/* Arrow link */}
      <div className="flex items-center gap-1.25 text-[13px] font-semibold text-(--accent-text) mt-auto">
        {hasContent ? "Zum Modul" : "Demnächst verfügbar"}
        <ArrowRight size={12} />
      </div>
    </Link>
  );
}
