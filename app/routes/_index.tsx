import type { MetaFunction } from "@remix-run/node";
import { Sparkles, BookOpen, Code2, Palette } from "lucide-react";
import { ModuleCard } from "~/components/layout/ModuleCard";
import { modules } from "~/data/modules";
const CONTENT_SLUGS = new Set(["visual-hierarchy", "typography-selection", "spacing-layout", "color-systems"]);

export const meta: MetaFunction = () => {
  return [
    { title: "UX/UI Workshop — For Developers" },
    {
      name: "description",
      content:
        "A comprehensive design workshop covering visual hierarchy, typography, color, spacing, and more.",
    },
  ];
};

const highlights = [
  {
    icon: Palette,
    label: "Design Foundations",
    description: "Color, typography, spacing",
  },
  {
    icon: Code2,
    label: "Developer-Focused",
    description: "Practical, code-centric approach",
  },
  {
    icon: BookOpen,
    label: "15 Modules",
    description: "From basics to advanced topics",
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
          Design Fundamentals{" "}
          <span className="text-(--accent-text)">for Developers</span>
        </h1>

        <p className="text-base text-(--text-secondary) leading-[1.65] mb-8 max-w-130">
          A hands-on workshop covering visual hierarchy, typography, color
          systems, spacing, and everything in between — taught from a
          developer&apos;s perspective.
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

      {/* Modules section */}
      <div>
        {/* Section header */}
        <div className="flex items-center gap-4 mb-8">
          <div>
            <div className="font-mono text-[10px] font-semibold tracking-[0.12em] uppercase text-(--accent-text) mb-1">
              Workshop Content
            </div>
            <h2 className="text-[19px] font-bold text-(--text-primary) m-0 tracking-tight">
              All Modules
            </h2>
          </div>
          <div className="flex-1" />
          <span className="font-mono text-xs text-(--text-tertiary) bg-(--bg-elevated) border border-(--bg-hover) rounded-lg py-1 px-2.5">
            {modules.length} modules
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
