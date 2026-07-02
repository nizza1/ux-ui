import { Link } from "@remix-run/react";
import { ArrowLeft } from "lucide-react";
import { getModuleByNumber } from "~/data/modules";

interface BuildsOnProps {
  /** Module number(s) this module builds on, e.g. "08" or ["12", "13"] */
  modules: string | string[];
  className?: string;
}

/**
 * Progression breadcrumb shown near the top of a module.
 * Makes the learning path explicit: "Baut auf: Modul 08 — Gestaltprinzipien".
 * Looks up titles from the central registry so they stay in sync.
 */
export function BuildsOn({ modules, className = "" }: BuildsOnProps) {
  const numbers = Array.isArray(modules) ? modules : [modules];
  const refs = numbers
    .map((n) => getModuleByNumber(n))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  if (refs.length === 0) return null;

  return (
    <div
      className={`inline-flex items-center gap-2 flex-wrap text-[13px] text-(--text-tertiary) mb-6 ${className}`}
    >
      <ArrowLeft size={13} className="shrink-0" />
      <span className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost)">
        Baut auf
      </span>
      {refs.map((m, i) => (
        <span key={m.number} className="inline-flex items-center gap-2">
          <Link
            to={`/modules/${m.slug}`}
            className="font-medium text-(--accent) hover:underline underline-offset-2"
          >
            Modul {m.number} — {m.titleDe}
          </Link>
          {i < refs.length - 1 && <span className="text-(--text-ghost)">·</span>}
        </span>
      ))}
    </div>
  );
}
