import { Link } from "@remix-run/react";
import { getModuleBySlug } from "~/data/modules";

interface ModuleRefProps {
  /** Slug aus dem Register (`data/modules.ts`) — die Nummer wird daraus abgeleitet */
  slug: string;
  /** Titel hinter der Nummer anzeigen: „Modul 04 — Visuelle Hierarchie“ */
  withTitle?: boolean;
}

/**
 * Verweis auf ein anderes Modul im Fließtext.
 * Nummer und Titel kommen aus dem Register, damit Verweise eine Umsortierung überstehen.
 */
export function ModuleRef({ slug, withTitle = false }: ModuleRefProps) {
  const module = getModuleBySlug(slug);
  if (!module) return null;
  const label = module.number === "PX" ? "Praxis-Projekt" : `Modul ${module.number}`;
  return (
    <Link
      to={`/modules/${module.slug}`}
      className="font-semibold text-(--accent-text) underline decoration-(--accent-border) underline-offset-2 hover:decoration-(--accent)"
    >
      {withTitle && module.number !== "PX" ? `${label} — ${module.titleDe}` : label}
    </Link>
  );
}
