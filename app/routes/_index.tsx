import type { MetaFunction } from "@remix-run/node";
import { Sparkles, BookOpen, Code2, Palette, Phone, TrendingUp, RefreshCw, Rocket } from "lucide-react";
import { ModuleCard } from "~/components/layout/ModuleCard";
import { modules } from "~/data/modules";
const CONTENT_SLUGS = new Set([
  // UX/UI Foundations (modules 00–08)
  "ux-ui-basics", "usability", "user-needs", "research-methods",
  "personas", "information-architecture", "sketching-prototypes",
  "wireframing", "gestalt-principles",
  // Visual/Technical Design (modules 09–20)
  "visual-hierarchy", "typography-selection", "typography-systems",
  "color-systems", "color-contrast", "color-hierarchy",
  "spacing-layout", "shadows-elevation",
  "images-icons", "responsive-design", "design-tokens",
]);

export const meta: MetaFunction = () => {
  return [
    { title: "UX/UI Workshop — Für Entwickler" },
    {
      name: "description",
      content:
        "Ein praxisnaher Workshop zu UX/UI-Design: visuelle Hierarchie, Typografie, Farbsysteme, Spacing und mehr — speziell für Entwickler.",
    },
  ];
};

const highlights = [
  {
    icon: Palette,
    label: "Design-Grundlagen",
    description: "Farbe, Typografie, Abstände & Layout",
  },
  {
    icon: Code2,
    label: "Für Entwickler gemacht",
    description: "Praxisnah, direkt im Code umsetzbar",
  },
  {
    icon: BookOpen,
    label: `${modules.length} Module`,
    description: "Von den Basics bis zu Design-Systemen",
  },
];

export default function Index() {
  return (
    <div className="py-12 px-8 max-w-275 mx-auto">
      {/* Hero section */}
      <div className="mb-16">
        {/* Workshop badge */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-widest uppercase text-(--accent-text) bg-(--accent-dim) border border-(--accent-border) rounded-full py-1 px-3">
            <Sparkles size={11} />
            UX/UI Workshop
          </span>
        </div>

        <h1
          className="text-[clamp(28px,4vw,42px)] font-extrabold leading-[1.15] tracking-[-0.8px] text-(--text-primary) mb-4 max-w-150"
        >
          UX &amp; UI Design{" "}
          <span className="text-(--accent-text)">für Entwickler</span>
        </h1>

        <p className="text-base text-(--text-secondary) leading-[1.65] mb-8 max-w-130">
          Lerne, wie gutes UX/UI-Design funktioniert — von visueller Hierarchie
          über Typografie und Farbsysteme bis hin zu Spacing und
          Nutzerführung. Praxisnah erklärt, direkt im Code anwendbar.
        </p>

        {/* Highlights */}
        <div className="flex gap-4 flex-wrap">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2.5 bg-(--bg-surface) border border-(--bg-hover) rounded-xl py-2.5 px-3.5 shadow-(--shadow-sm)"
            >
              <div className="w-8 h-8 rounded-lg bg-(--accent-dim) border border-(--accent-border) flex items-center justify-center text-(--accent-text) shrink-0">
                <item.icon size={15} />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-(--text-primary)">
                  {item.label}
                </div>
                <div className="text-[13px] text-(--text-tertiary)">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Why UI Design Matters ── */}
      <div className="mb-16">
        <div className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent-text) mb-2">
          Warum das wichtig ist
        </div>
        <h2 className="text-[22px] font-extrabold leading-[1.2] tracking-[-0.3px] text-(--text-primary) mb-3 mt-0">
          Gutes Design ist kein Zufall — es ist eine Entscheidung
        </h2>
        <p className="text-[14px] leading-[1.7] text-(--text-secondary) mb-6 max-w-160">
          Welche Farbe bekommt ein deaktivierter Button? Wie viel Abstand
          braucht eine Fehlermeldung? Wie führst du den Nutzer durch ein
          komplexes Formular? All das sind Designentscheidungen, die
          Entwickler jeden Tag treffen — oft ohne es zu merken. Ohne klare
          Grundlagen entstehen Oberflächen, die zwar funktionieren, aber{" "}
          <strong>unübersichtlich, inkonsistent und schwer wartbar</strong> sind.
        </p>

        {/* Business case cards */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { icon: Phone, title: "Weniger Support", desc: "Klare Oberflächen erzeugen weniger Support-Anfragen" },
            { icon: TrendingUp, title: "Mehr Konversion", desc: "20–40 % Verbesserung durch bessere Layouts und Texte" },
            { icon: RefreshCw, title: "Weniger Abwanderung", desc: "Nutzer, die sich kompetent fühlen, bleiben länger" },
            { icon: Rocket, title: "Schnelleres Onboarding", desc: "Neue Nutzer verstehen das Interface ohne Training" },
          ].map((item) => (
            <div key={item.title} className="bg-(--bg-surface) border border-(--bg-hover) rounded-xl p-3.5">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-(--accent-dim) border border-(--accent-border) flex items-center justify-center text-(--accent-text) shrink-0">
                  <item.icon size={14} />
                </div>
                <p className="text-[13px] font-bold text-(--text-primary) m-0">{item.title}</p>
              </div>
              <p className="text-[13px] text-(--text-secondary) leading-snug m-0">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Cost of UX error diagram */}
        <CostDiagram />

        {/* Workshop scope */}
        <WorkshopScope />
      </div>

      {/* Modules section */}
      <div>
        {/* Section header */}
        <div className="flex items-center gap-4 mb-8">
          <div>
            <div className="font-mono text-[10px] font-semibold tracking-[0.12em] uppercase text-(--accent-text) mb-1">
              Workshop-Inhalte
            </div>
            <h2 className="text-[19px] font-bold text-(--text-primary) m-0 tracking-tight">
              Alle Module
            </h2>
          </div>
          <div className="flex-1" />
          <span className="font-mono text-xs text-(--text-tertiary) bg-(--bg-elevated) border border-(--bg-hover) rounded-lg py-1 px-2.5">
            {modules.length} Module
          </span>
        </div>

        {/* Module grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              number={module.number}
              title={module.title}
              description={module.description}
              href={`/modules/${module.slug}`}
              hasContent={CONTENT_SLUGS.has(module.slug)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Cost of UX Error diagram ──────────────────────────────────────────────────
function CostDiagram() {
  const phases = [
    { label: "Wireframe-Phase", cost: 1, color: "var(--success-color)", desc: "Fehler sofort sichtbar, schnell korrigiert" },
    { label: "Entwicklungsphase", cost: 10, color: "var(--warning-color)", desc: "Refactoring nötig, bereits gebaut" },
    { label: "Nach dem Launch", cost: 100, color: "var(--bad-color)", desc: "Nutzer betroffen, Support, Reputationsschaden" },
  ];

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 mb-6">
      <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent-text) mb-4 m-0">
        Kosten eines UX-Fehlers: Je später, desto teurer
      </p>
      <div className="space-y-3">
        {phases.map((phase) => (
          <div key={phase.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[13px] font-semibold text-(--text-primary)">{phase.label}</span>
              <span className="font-mono text-[13px] font-bold" style={{ color: phase.color }}>
                {phase.cost}× teurer
              </span>
            </div>
            <div className="h-5 bg-(--bg-elevated) rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${phase.cost}%`, background: phase.color, opacity: 0.8 }}
              />
            </div>
            <p className="text-[12px] text-(--text-tertiary) mt-0.5 mb-0">{phase.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Workshop scope overview ───────────────────────────────────────────────────
function WorkshopScope() {
  const covered = [
    "Visuelle Hierarchie", "Typografie-Systeme", "Farbe & Kontrast",
    "Abstände & Layout", "UI-Komponenten", "Responsive Design",
    "Design-Systeme & Tokens", "Gestalt-Prinzipien",
  ];
  const notCovered = [
    "Markenidentität & Logo-Design", "Figma-Workflows",
    "Vertiefende UX-Research-Methoden", "Animationen & Motion Design",
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-(--success-bg) border border-(--success-border) rounded-xl p-4">
        <p className="font-mono text-[10px] font-semibold text-(--success-color) uppercase tracking-wider mb-3 m-0">
          Was wir abdecken
        </p>
        <ul className="space-y-1.5 list-none m-0 p-0">
          {covered.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[13px] text-(--text-secondary)">
              <span className="text-(--success-color) shrink-0 mt-0.5">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-(--bg-elevated) border border-(--bg-hover) rounded-xl p-4">
        <p className="font-mono text-[10px] font-semibold text-(--text-ghost) uppercase tracking-wider mb-3 m-0">
          Was wir nicht abdecken
        </p>
        <ul className="space-y-1.5 list-none m-0 p-0">
          {notCovered.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[13px] text-(--text-tertiary)">
              <span className="text-(--text-ghost) shrink-0 mt-0.5">—</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
