import { useState } from "react";
import type { ReactNode } from "react";

type Tool = "size" | "weight" | "contrast" | "spacing" | "position";
type Tools = Record<Tool, boolean>;

const TOOL_LIST: { id: Tool; name: string; prop: string }[] = [
  { id: "size", name: "Größe", prop: "font-size" },
  { id: "weight", name: "Gewicht", prop: "font-weight" },
  { id: "contrast", name: "Kontrast", prop: "color" },
  { id: "spacing", name: "Abstand", prop: "margin / gap" },
  { id: "position", name: "Position", prop: "Reihenfolge" },
];

const make = (...on: Tool[]): Tools => ({
  size: on.includes("size"),
  weight: on.includes("weight"),
  contrast: on.includes("contrast"),
  spacing: on.includes("spacing"),
  position: on.includes("position"),
});

const PRESETS: { label: string; tools: Tools }[] = [
  { label: "Flach", tools: make() },
  { label: "Nur Größe", tools: make("size") },
  { label: "Gewicht + Kontrast", tools: make("weight", "contrast") },
  { label: "Alle fünf", tools: make("size", "weight", "contrast", "spacing", "position") },
];

const sameTools = (a: Tools, b: Tools) => TOOL_LIST.every((tool) => a[tool.id] === b[tool.id]);

function insight(tools: Tools): string {
  const active = TOOL_LIST.filter((tool) => tools[tool.id]).length;
  if (active === 0) {
    return "Fünf Zeilen, alle gleich. Der Betrag — die eine Information, um die es geht — steht an vierter Stelle und sieht aus wie alles andere. Man muss lesen, um ihn zu finden.";
  }
  if (active === 5) {
    return "Alle fünf Werkzeuge ziehen in dieselbe Richtung: Der Betrag steht oben, ist groß, fett und kontrastreich, und der Rest tritt in zwei Stufen zurück. Schalte jetzt einzelne Werkzeuge wieder ab — auf welches kannst du am ehesten verzichten?";
  }
  if (active === 1 && tools.size) {
    return "Größe allein funktioniert — aber grob. Der Betrag fällt auf, doch die vier übrigen Zeilen bleiben eine gleich schwere Masse. Wer nur mit Größe arbeitet, braucht immer größere Unterschiede.";
  }
  if (active === 2 && tools.weight && tools.contrast) {
    return "Keine einzige Schriftgröße hat sich geändert — und trotzdem ist die Rangfolge klar. Gewicht und Kontrast sind die leisesten Werkzeuge und in dichten Oberflächen oft die besten.";
  }
  if (active === 1 && tools.position) {
    return "Der Betrag steht jetzt dort, wo das Auge anfängt: oben. Das hilft — aber ohne ein zweites Werkzeug sieht er weiterhin aus wie jede andere Zeile.";
  }
  if (active === 1 && tools.spacing) {
    return "Abstand trennt die Karte in zwei Gruppen. Noch ist keine Zeile wichtiger als die andere, aber das Auge erkennt bereits: Hier gehören Dinge zusammen.";
  }
  return `${active} von 5 Werkzeugen aktiv. Probier aus: Was ist die kleinste Kombination, bei der der Betrag sofort ins Auge fällt?`;
}

interface CodeLine {
  text: string;
  changed?: boolean;
  comment?: boolean;
}

function buildCss(t: Tools): CodeLine[] {
  const decl = (prop: string, value: string, changed: boolean): CodeLine => ({
    text: `  ${prop}: ${value};`,
    changed,
  });
  return [
    { text: "/* Primär — der Betrag */", comment: true },
    { text: ".amount {" },
    decl("font-size", t.size ? "28px" : "14px", t.size),
    decl("font-weight", t.weight ? "700" : "400", t.weight),
    decl("color", "var(--text-strong)", false),
    { text: "}" },
    { text: "" },
    { text: "/* Sekundär — Fälligkeit, Kunde */", comment: true },
    { text: ".detail {" },
    decl("font-size", "14px", false),
    decl("font-weight", t.weight ? "500" : "400", t.weight),
    decl("color", t.contrast ? "var(--text-muted)" : "var(--text-strong)", t.contrast),
    { text: "}" },
    { text: "" },
    { text: "/* Tertiär — Nummer, Erstelldatum */", comment: true },
    { text: ".meta {" },
    decl("font-size", t.size ? "13px" : "14px", t.size),
    decl("font-weight", "400", false),
    decl("color", t.contrast ? "var(--text-subtle)" : "var(--text-strong)", t.contrast),
    { text: "}" },
    { text: "" },
    { text: "/* Abstand zwischen den Gruppen */", comment: true },
    { text: `.group + .group { margin-top: ${t.spacing ? "16px" : "4px"}; }`, changed: t.spacing },
    { text: "" },
    {
      text: t.position ? "/* HTML: Betrag steht an 1. Stelle */" : "/* HTML: Betrag steht an 4. Stelle */",
      changed: t.position,
      comment: !t.position,
    },
  ];
}

/**
 * Hierarchie-Labor: Eine Rechnungs-Karte, fünf Schalter. Jeder Schalter aktiviert
 * genau ein Werkzeug — so sieht man, was jedes einzeln beiträgt und welche
 * Kombination mit dem geringsten Aufwand auskommt.
 */
export function HierarchyLab() {
  const [tools, setTools] = useState<Tools>(make());
  const toggle = (id: Tool) => setTools((prev) => ({ ...prev, [id]: !prev[id] }));

  const base = "leading-[1.4] transition-all duration-200";
  const primary = `${base} ${tools.size ? "text-[28px] tracking-[-0.4px]" : "text-[14px]"} ${
    tools.weight ? "font-bold" : "font-normal"
  } text-(--text-primary) tabular-nums`;
  const secondary = `${base} text-[14px] ${tools.weight ? "font-medium" : "font-normal"} ${
    tools.contrast ? "text-(--text-tertiary)" : "text-(--text-primary)"
  }`;
  const tertiary = `${base} ${tools.size ? "text-[13px]" : "text-[14px]"} font-normal ${
    tools.contrast ? "text-(--text-ghost)" : "text-(--text-primary)"
  }`;

  const amount = <div key="amount" className={primary}>1.240,00 €</div>;
  const due = <div key="due" className={secondary}>Fällig am 30. November</div>;
  const customer = <div key="customer" className={secondary}>Müller &amp; Söhne GmbH</div>;
  const number = <div key="number" className={tertiary}>Rechnung 2026-118</div>;
  const created = <div key="created" className={tertiary}>Erstellt am 16. November</div>;

  const main: ReactNode[] = [amount, due];
  const context: ReactNode[] = tools.position ? [customer, number, created] : [number, customer, created];
  const groups = tools.position ? [main, context] : [context, main];

  const css = buildCss(tools);

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl shadow-(--shadow-sm) mb-6 overflow-hidden">
      {/* Schalter */}
      <div className="p-5 sm:p-6 border-b border-(--bg-elevated)">
        <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-3">
          Werkzeuge — einzeln zuschalten
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {TOOL_LIST.map((tool) => {
            const on = tools[tool.id];
            return (
              <button
                key={tool.id}
                type="button"
                role="switch"
                aria-checked={on}
                onClick={() => toggle(tool.id)}
                className={`flex items-center gap-3 text-left px-3 py-2.5 rounded-xl border cursor-pointer transition-colors duration-150 ${
                  on
                    ? "bg-(--accent-dim) border-(--accent-border)"
                    : "bg-(--bg-surface) border-(--bg-hover) hover:border-(--text-ghost)"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`relative shrink-0 w-8 h-4.5 rounded-full transition-colors duration-150 ${
                    on ? "bg-(--accent)" : "bg-(--text-ghost)/45"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 size-3.5 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-transform duration-150 ${
                      on ? "translate-x-3.5" : ""
                    }`}
                  />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold leading-[1.3] text-(--text-primary)">{tool.name}</span>
                  <span className="block font-mono text-[11px] leading-[1.4] text-(--text-ghost) truncate">{tool.prop}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-[13px] text-(--text-tertiary) mr-1">Schnellwahl:</span>
          {PRESETS.map((preset) => {
            const active = sameTools(preset.tools, tools);
            return (
              <button
                key={preset.label}
                type="button"
                aria-pressed={active}
                onClick={() => setTools(preset.tools)}
                className={`text-[13px] font-semibold px-3 py-1 rounded-full border cursor-pointer transition-colors duration-150 ${
                  active
                    ? "bg-(--text-primary) border-(--text-primary) text-(--bg-surface)"
                    : "bg-transparent border-(--bg-hover) text-(--text-tertiary) hover:text-(--text-primary) hover:border-(--text-ghost)"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Vorschau */}
        <div className="p-5 sm:p-8 bg-(--bg-base) flex items-center justify-center min-h-72">
          <div
            className={`w-full max-w-85 bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 shadow-(--shadow-sm) flex flex-col transition-all duration-200 ${
              tools.spacing ? "gap-4" : "gap-1"
            }`}
          >
            {groups.map((group, i) => (
              <div
                key={i}
                className={`flex flex-col transition-all duration-200 ${tools.spacing ? "gap-0.5" : "gap-1"}`}
              >
                {group}
              </div>
            ))}
          </div>
        </div>

        {/* CSS dazu */}
        <div className="bg-[#1a1a2e] p-5 overflow-x-auto border-t lg:border-t-0 lg:border-l border-white/8">
          <pre className="m-0 font-mono text-[13px] leading-[1.65] text-[#c8d3f5] whitespace-pre">
            {css.map((line, i) => (
              <span
                key={i}
                className={line.changed ? "text-[#5eead4] font-semibold" : line.comment ? "text-white/40" : ""}
              >
                {line.changed ? "● " : "  "}
                {line.text}
                {"\n"}
              </span>
            ))}
          </pre>
        </div>
      </div>

      <div
        aria-live="polite"
        className="px-5 sm:px-6 py-4 border-t border-(--bg-elevated) text-[13px] leading-[1.6] text-(--text-secondary)"
      >
        {insight(tools)}
      </div>
    </div>
  );
}
