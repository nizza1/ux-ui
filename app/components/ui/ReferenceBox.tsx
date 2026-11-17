import type { ReactNode } from "react";
import { BookMarked } from "lucide-react";

interface ReferenceBoxProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Verweis auf ein echtes System aus der Praxis (z. B. Material UI).
 * Nutzt die Info-Farbe, damit Referenzen sich von Regeln (RuleBox, Akzentfarbe) abheben.
 */
export function ReferenceBox({ title = "Referenz aus der Praxis", children, className = "" }: ReferenceBoxProps) {
  return (
    <div className={`bg-(--info-bg) border border-(--info-border) rounded-xl p-4 px-6 mb-6 ${className}`}>
      <div className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--info-color) mb-1 flex items-center gap-2">
        <BookMarked size={13} />
        {title}
      </div>
      <div className="text-[13px] leading-[1.7] text-(--text-secondary) [&>p]:m-0 [&>p+p]:mt-2 [&_strong]:font-semibold [&_strong]:text-(--text-primary) [&_code]:font-mono [&_code]:text-[13px] [&_code]:bg-(--bg-elevated) [&_code]:px-1 [&_code]:rounded [&_a]:text-(--info-color) [&_a]:underline [&_a]:underline-offset-2">
        {children}
      </div>
    </div>
  );
}
