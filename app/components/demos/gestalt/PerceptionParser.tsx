import { useState } from "react";
import { AlertTriangle, CheckCircle2, HelpCircle } from "lucide-react";
import { SegmentedControl } from "~/components/ui/SegmentedControl";

type Variant = "even" | "wrong" | "grouped";
type Tone = "neutral" | "warn" | "bad" | "good";

interface TreeNode {
  label: string;
  group?: boolean;
  note?: string;
  tone?: Tone;
  children?: TreeNode[];
}

const MARKUP = `<form>
  <label>E-Mail</label>
  <input type="email">
  <label>Passwort</label>
  <input type="password">
  <button>Anmelden</button>
</form>`;

const VARIANTS: Record<
  Variant,
  { css: string; label: string; input: string; tree: TreeNode[]; tone: Tone; summary: string }
> = {
  even: {
    css: "label, input { margin-bottom: 12px; }",
    label: "mb-3",
    input: "mb-3",
    tone: "warn",
    summary:
      "Fünf gleichwertige Teile. Das Auge findet keine Gruppen und muss lesen, um die Zuordnung zu erschließen. Bei zwei Feldern geht das noch, bei zwölf nicht mehr.",
    tree: [
      { label: "„E-Mail“" },
      { label: "Feld" },
      { label: "„Passwort“", tone: "warn", note: "zu welchem Feld?" },
      { label: "Feld" },
      { label: "Button „Anmelden“" },
    ],
  },
  wrong: {
    css: "label { margin-bottom: 20px; }\ninput { margin-bottom: 4px; }",
    label: "mb-5",
    input: "mb-1",
    tone: "bad",
    summary:
      "Schlimmer als keine Gruppen: falsche. „Passwort“ scheint zum E-Mail-Feld zu gehören, der Button klebt am Passwortfeld. Der Code ist korrekt, die Wahrnehmung liest etwas anderes.",
    tree: [
      { label: "„E-Mail“", tone: "bad", note: "steht allein" },
      {
        label: "Gruppe",
        group: true,
        tone: "bad",
        children: [{ label: "E-Mail-Feld" }, { label: "„Passwort“", tone: "bad", note: "falsch zugeordnet" }],
      },
      {
        label: "Gruppe",
        group: true,
        tone: "bad",
        children: [{ label: "Passwort-Feld" }, { label: "Button „Anmelden“" }],
      },
    ],
  },
  grouped: {
    css: "label { margin-bottom: 4px; }\ninput { margin-bottom: 20px; }",
    label: "mb-1",
    input: "mb-5",
    tone: "good",
    summary:
      "Drei Teile, eindeutig zugeordnet. Der Baum steht, bevor ein Wort gelesen ist, und er stimmt mit der Bedeutung überein. Am Markup hat sich nichts geändert.",
    tree: [
      { label: "Gruppe", group: true, tone: "good", children: [{ label: "„E-Mail“" }, { label: "Feld" }] },
      { label: "Gruppe", group: true, tone: "good", children: [{ label: "„Passwort“" }, { label: "Feld" }] },
      { label: "Button „Anmelden“" },
    ],
  },
};

/** Nur für Icons und Markierungen — Text bleibt in den Textfarben (Kontrast) */
const TONE_TEXT: Record<Tone, string> = {
  neutral: "text-(--text-secondary)",
  warn: "text-(--warning-color)",
  bad: "text-(--bad-color)",
  good: "text-(--success-color)",
};

const TONE_DOT: Record<Tone, string> = {
  neutral: "bg-(--text-ghost)",
  warn: "bg-(--warning-color)",
  bad: "bg-(--bad-color)",
  good: "bg-(--success-color)",
};

function Tree({ nodes }: { nodes: TreeNode[] }) {
  return (
    <ul className="list-none m-0 pl-4 border-l border-(--bg-hover) flex flex-col gap-1.5">
      {nodes.map((node, index) => (
        <li key={`${node.label}-${index}`} className="relative">
          <span className="absolute -left-4 top-2.5 w-3 border-t border-(--bg-hover)" aria-hidden="true" />
          <span className="inline-flex flex-wrap items-baseline gap-x-2">
            <span
              className={`font-mono text-[13px] ${
                node.group ? "font-semibold text-(--text-primary)" : "text-(--text-secondary)"
              }`}
            >
              {node.label}
            </span>
            {node.note && (
              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-(--text-primary)">
                <span className={`size-2 rounded-full shrink-0 ${TONE_DOT[node.tone ?? "neutral"]}`} aria-hidden="true" />
                {node.note}
              </span>
            )}
          </span>
          {node.children && (
            <div className="mt-1.5">
              <Tree nodes={node.children} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * Wahrnehmung als Parser: identisches Markup, drei Abstands-Varianten —
 * und der „Baum“, den das Auge jeweils daraus baut.
 */
export function PerceptionParser() {
  const [variant, setVariant] = useState<Variant>("even");
  const current = VARIANTS[variant];
  const Icon = current.tone === "good" ? CheckCircle2 : current.tone === "bad" ? AlertTriangle : HelpCircle;

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl shadow-(--shadow-sm) mb-6 overflow-hidden">
      <div className="flex flex-wrap items-end justify-between gap-3 px-5 sm:px-6 py-4 border-b border-(--bg-elevated)">
        <SegmentedControl
          label="Abstände"
          options={[
            { value: "even", label: "Gleichmäßig" },
            { value: "wrong", label: "Falsch gesetzt" },
            { value: "grouped", label: "Gruppiert" },
          ]}
          value={variant}
          onChange={setVariant}
        />
      </div>

      <div className="grid gap-px bg-(--bg-elevated) md:grid-cols-3">
        <div className="bg-(--bg-surface) p-5">
          <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-3">
            1 · Dein Markup, immer gleich
          </div>
          <pre className="m-0 p-3 rounded-lg bg-(--bg-base) border border-(--bg-elevated) overflow-x-auto">
            <code className="font-mono text-[13px] leading-[1.6] text-(--text-secondary) whitespace-pre block">{MARKUP}</code>
          </pre>
          <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mt-4 mb-2">
            Nur das CSS ändert sich
          </div>
          <pre className="m-0 p-3 rounded-lg bg-(--bg-base) border border-(--bg-elevated) overflow-x-auto">
            <code className="font-mono text-[13px] leading-[1.6] text-(--text-primary) whitespace-pre block">{current.css}</code>
          </pre>
        </div>

        <div className="bg-(--bg-surface) p-5">
          <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-3">
            2 · Was gerendert wird
          </div>
          <div className="rounded-lg bg-(--bg-base) border border-(--bg-elevated) p-4" aria-hidden="true">
            {["E-Mail", "Passwort"].map((label, index) => (
              <div key={label}>
                <div className={`text-[13px] font-semibold text-(--text-primary) transition-[margin] duration-300 ${current.label}`}>
                  {label}
                </div>
                <div
                  className={`h-9 rounded-md border border-(--text-ghost) bg-(--bg-surface) px-3 flex items-center text-[13px] text-(--text-tertiary) transition-[margin] duration-300 ${current.input}`}
                >
                  {index === 0 ? "lena@beispiel.de" : "••••••••"}
                </div>
              </div>
            ))}
            <div className="rounded-md bg-(--text-primary) text-(--bg-surface) text-[13px] font-semibold text-center py-2">
              Anmelden
            </div>
          </div>
        </div>

        <div className="bg-(--bg-surface) p-5">
          <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-3">
            3 · Was das Auge daraus parst
          </div>
          <div className="font-mono text-[13px] font-semibold text-(--text-primary) mb-1.5">Formular</div>
          <Tree nodes={current.tree} />
        </div>
      </div>

      <div className="flex gap-3 px-5 sm:px-6 py-4 border-t border-(--bg-elevated) bg-(--bg-base)" aria-live="polite">
        <Icon size={18} className={`shrink-0 mt-0.5 ${TONE_TEXT[current.tone]}`} />
        <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">{current.summary}</p>
      </div>
    </div>
  );
}
