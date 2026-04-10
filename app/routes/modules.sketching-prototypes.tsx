import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { modules } from "~/data/modules";
import { ModuleNav } from "~/routes/modules.$slug";
import { TheoryCard } from "~/components/ui/TheoryCard";
import { ConceptList, ConceptItem } from "~/components/ui/ConceptList";
import { RuleBox } from "~/components/ui/RuleBox";
import { ExerciseBlock } from "~/components/ui/ExerciseBlock";
import { LearningGoals } from "~/components/ui/LearningGoals";
import { ModuleMeta } from "~/components/ui/ModuleMeta";
import { ImagePlaceholder } from "~/components/ui/ImagePlaceholder";
import { LiveEditor } from "~/components/live-editor/LiveEditor";
import type { PropertyControl } from "~/components/live-editor/types";

export async function loader() {
  const slug = "sketching-prototypes";
  const currentIndex = modules.findIndex((m) => m.slug === slug);
  return {
    prevModule: currentIndex > 0 ? modules[currentIndex - 1] : null,
    nextModule: currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null,
  };
}

// ── Fidelity Comparison ───────────────────────────────────────────────────────
function FidelityComparison() {
  const levels = [
    {
      label: "Lo-Fi",
      color: "var(--text-ghost)",
      bg: "var(--bg-elevated)",
      border: "var(--bg-hover)",
      desc: "3 min · grobe Skizze",
      question: "Ist das die richtige Struktur?",
      content: (
        <div className="p-3 font-mono text-[11px] text-(--text-ghost) space-y-2">
          <div className="h-2 bg-(--text-ghost) opacity-30 rounded w-3/4" />
          <div className="h-1.5 bg-(--text-ghost) opacity-20 rounded w-1/2" />
          <div className="grid grid-cols-2 gap-1 mt-2">
            <div className="h-8 border border-(--text-ghost) border-opacity-20 rounded flex items-center justify-center text-[9px] opacity-40">IMG</div>
            <div className="h-8 border border-(--text-ghost) border-opacity-20 rounded flex items-center justify-center text-[9px] opacity-40">IMG</div>
          </div>
          <div className="h-1.5 bg-(--text-ghost) opacity-15 rounded w-full" />
          <div className="h-1.5 bg-(--text-ghost) opacity-15 rounded w-4/5" />
          <div className="h-5 bg-(--text-ghost) opacity-20 rounded mt-1" />
        </div>
      ),
    },
    {
      label: "Mid-Fi",
      color: "var(--accent)",
      bg: "var(--accent-dim)",
      border: "var(--accent-border)",
      desc: "30 min · klares Layout",
      question: "Funktioniert das Layout?",
      content: (
        <div className="p-3 space-y-2 font-sans text-[11px]">
          <div className="h-5 bg-(--bg-elevated) rounded w-3/4 flex items-center px-1.5">
            <div className="w-1 h-1 bg-(--text-ghost) rounded-full mr-1 opacity-50" />
            <div className="h-1.5 bg-(--text-ghost) opacity-30 rounded w-16" />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="h-10 bg-(--bg-elevated) rounded border border-(--bg-hover) flex items-center justify-center">
              <div className="w-4 h-4 bg-(--bg-hover) rounded opacity-50" />
            </div>
            <div className="h-10 bg-(--bg-elevated) rounded border border-(--bg-hover) flex items-center justify-center">
              <div className="w-4 h-4 bg-(--bg-hover) rounded opacity-50" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="h-1.5 bg-(--bg-elevated) rounded w-full" />
            <div className="h-1.5 bg-(--bg-elevated) rounded w-4/5" />
          </div>
          <div className="h-5 bg-(--bg-elevated) rounded border border-(--accent-border)" />
        </div>
      ),
    },
    {
      label: "Hi-Fi",
      color: "var(--success-color)",
      bg: "var(--success-bg)",
      border: "var(--success-border)",
      desc: "4 std · pixelgenau",
      question: "Fühlt sich das richtig an?",
      content: (
        <div className="p-3 space-y-2">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-3 h-3 rounded-full bg-(--accent) opacity-80" />
            <span className="font-bold text-[11px] text-(--text-primary)">Produktname</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="h-10 bg-(--bg-elevated) rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-(--accent-dim) to-(--bg-elevated)" />
              <div className="absolute bottom-1 left-1 right-1">
                <div className="h-1 bg-(--text-primary) opacity-60 rounded w-2/3" />
              </div>
            </div>
            <div className="h-10 bg-(--bg-elevated) rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-(--success-bg) to-(--bg-elevated)" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="h-1.5 bg-(--text-primary) opacity-50 rounded w-4/5" />
            <div className="h-1 bg-(--text-secondary) opacity-30 rounded w-3/5" />
          </div>
          <div className="h-5 bg-(--accent) rounded-md flex items-center justify-center">
            <div className="h-1 w-8 bg-white opacity-70 rounded" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 mb-6">
      <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-4">
        Vergleich: Lo-Fi / Mid-Fi / Hi-Fi
      </p>
      <div className="grid grid-cols-3 gap-3">
        {levels.map((level) => (
          <div
            key={level.label}
            className="rounded-xl overflow-hidden border"
            style={{ borderColor: level.border, background: level.bg }}
          >
            <div className="px-3 py-2 border-b" style={{ borderColor: level.border }}>
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: level.color }}>
                {level.label}
              </p>
              <p className="text-[11px] text-(--text-tertiary)">{level.desc}</p>
            </div>
            {level.content}
            <div className="px-3 pb-2.5">
              <p className="text-[11px] text-(--text-secondary) italic">{level.question}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Paper Prototype Simulator ─────────────────────────────────────────────────
type Screen = "list" | "add" | "detail";

function PaperPrototypeSimulator() {
  const [screen, setScreen] = useState<Screen>("list");
  const [added, setAdded] = useState(false);

  const screens: Record<Screen, React.ReactNode> = {
    list: (
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[14px] text-(--text-primary)">Meine Aufgaben</h3>
          <button
            onClick={() => setScreen("add")}
            className="px-2.5 py-1 bg-(--accent) text-white text-[12px] font-semibold rounded-lg cursor-pointer"
          >
            + Neu
          </button>
        </div>
        <div className="space-y-2">
          {["Design Review vorbereiten", "Wireframe fertigstellen", ...(added ? ["Neue Aufgabe (von dir!)"] : [])].map(
            (task, i) => (
              <button
                key={task}
                onClick={() => setScreen("detail")}
                className="w-full flex items-center gap-2.5 p-2.5 bg-(--bg-surface) rounded-lg border border-(--bg-elevated) text-left cursor-pointer hover:border-(--accent-border) transition-colors"
              >
                <div className="w-4 h-4 rounded border border-(--bg-elevated) shrink-0 flex items-center justify-center">
                  {i === 0 && <div className="w-2 h-2 rounded-sm bg-(--accent)" />}
                </div>
                <span className="text-[13px] text-(--text-primary)">{task}</span>
              </button>
            )
          )}
        </div>
        <p className="text-[11px] text-(--text-ghost) text-center pt-1">
          Tippe auf eine Aufgabe → Detail · „+" → Neu hinzufügen
        </p>
      </div>
    ),
    add: (
      <div className="p-4 space-y-3">
        <button onClick={() => setScreen("list")} className="text-[12px] text-(--accent) cursor-pointer">
          ← Zurück
        </button>
        <h3 className="font-bold text-[14px] text-(--text-primary)">Neue Aufgabe</h3>
        <div className="border border-(--bg-elevated) rounded-lg p-2.5 text-[13px] text-(--text-ghost)">
          Aufgabentitel eingeben…
        </div>
        <div className="border border-(--bg-elevated) rounded-lg p-2.5 text-[13px] text-(--text-ghost) h-16">
          Beschreibung (optional)…
        </div>
        <button
          onClick={() => { setAdded(true); setScreen("list"); }}
          className="w-full py-2 bg-(--accent) text-white text-[13px] font-semibold rounded-lg cursor-pointer"
        >
          Aufgabe hinzufügen
        </button>
        <p className="text-[11px] text-(--text-ghost) text-center">
          Klicke „Hinzufügen" → Aufgabe erscheint in der Liste
        </p>
      </div>
    ),
    detail: (
      <div className="p-4 space-y-3">
        <button onClick={() => setScreen("list")} className="text-[12px] text-(--accent) cursor-pointer">
          ← Aufgabenliste
        </button>
        <h3 className="font-bold text-[14px] text-(--text-primary)">Design Review vorbereiten</h3>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-(--accent-dim) border border-(--accent-border) text-(--accent) text-[11px] font-semibold rounded-full">In Bearbeitung</span>
          <span className="text-[12px] text-(--text-tertiary)">Fällig: Heute</span>
        </div>
        <p className="text-[13px] text-(--text-secondary) leading-snug">
          Alle Wireframes zusammenstellen und Feedback-Punkte dokumentieren.
        </p>
        <button
          onClick={() => setScreen("list")}
          className="w-full py-2 bg-(--success-bg) border border-(--success-border) text-(--success-color) text-[13px] font-semibold rounded-lg cursor-pointer"
        >
          Als erledigt markieren ✓
        </button>
        <p className="text-[11px] text-(--text-ghost) text-center">
          „Erledigt" → zurück zur Liste
        </p>
      </div>
    ),
  };

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 mb-6">
      <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-1">
        Paper-Prototyp-Simulator — To-do-Liste
      </p>
      <p className="text-[12px] text-(--text-tertiary) mb-4">
        3 Bildschirme, klickbar verbunden – ohne visuelles Design:
      </p>
      <div className="flex gap-3 mb-4">
        {(["list", "add", "detail"] as Screen[]).map((s) => (
          <button
            key={s}
            onClick={() => setScreen(s)}
            className={`px-3 py-1 text-[12px] font-medium rounded-lg border cursor-pointer transition-colors ${
              screen === s
                ? "bg-(--accent) border-(--accent) text-white"
                : "bg-(--bg-elevated) border-(--bg-hover) text-(--text-secondary) hover:border-(--accent-border)"
            }`}
          >
            {s === "list" ? "Liste" : s === "add" ? "Neu" : "Detail"}
          </button>
        ))}
      </div>
      <div className="max-w-[320px] bg-white dark:bg-(--bg-elevated) rounded-xl border border-(--bg-elevated) overflow-hidden min-h-[220px]">
        {screens[screen]}
      </div>
    </div>
  );
}

// ── Sketch exploration visual ─────────────────────────────────────────────────
function SketchExploration() {
  const layouts = [
    {
      name: "Liste",
      desc: "Klare Struktur, wenig Kontext",
      content: (
        <div className="space-y-1.5">
          {["Benachrichtigung 1", "Benachrichtigung 2", "Benachrichtigung 3"].map((item) => (
            <div key={item} className="flex items-center gap-2 p-1.5 rounded bg-(--bg-elevated)">
              <div className="w-2 h-2 rounded-full bg-(--accent) opacity-60 shrink-0" />
              <div className="h-1.5 bg-(--text-ghost) opacity-30 rounded flex-1" />
            </div>
          ))}
        </div>
      ),
    },
    {
      name: "Karten-Grid",
      desc: "Mehr Kontext, weniger Items",
      content: (
        <div className="grid grid-cols-2 gap-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-(--bg-elevated) rounded p-2 space-y-1">
              <div className="h-1.5 bg-(--text-ghost) opacity-30 rounded w-3/4" />
              <div className="h-1 bg-(--text-ghost) opacity-20 rounded w-1/2" />
            </div>
          ))}
        </div>
      ),
    },
    {
      name: "Zeitstrahl",
      desc: "Zeitlicher Kontext sichtbar",
      content: (
        <div className="space-y-2 relative">
          <div className="absolute left-1.5 top-2 bottom-0 w-px bg-(--bg-elevated)" />
          {["Heute", "Gestern", "Vorgestern"].map((label) => (
            <div key={label} className="flex gap-3 items-start">
              <div className="w-3.5 h-3.5 rounded-full bg-(--accent) opacity-50 shrink-0 mt-0.5 relative z-10" />
              <div className="flex-1">
                <div className="text-[10px] text-(--text-ghost) mb-0.5">{label}</div>
                <div className="h-1.5 bg-(--bg-elevated) rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 mb-6">
      <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-1">
        3 Skizzen-Ideen für denselben Inhalt
      </p>
      <p className="text-[12px] text-(--text-tertiary) mb-4">
        Benachrichtigungs-Posteingang — drei verschiedene Layouts erkundet:
      </p>
      <div className="grid grid-cols-3 gap-3">
        {layouts.map((l) => (
          <div key={l.name} className="bg-(--bg-elevated) rounded-xl p-3">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-(--accent) mb-0.5">
              {l.name}
            </p>
            <p className="text-[11px] text-(--text-tertiary) mb-3">{l.desc}</p>
            {l.content}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Practice HTML ─────────────────────────────────────────────────────────────
const EXERCISE_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Lo-Fi Prototype</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: system-ui, sans-serif;
    background: #f5f7fa;
    padding: 24px;
    min-height: 100vh;
  }
  /* TODO: Mache die App-Shell erkennbar: Header, Nav, Content */
  .app-header {
    background: white;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .app-title { font-size: 16px; font-weight: 700; color: #111; }
  /* TODO: Gib dem Screen-Label eine klare Positionierung */
  .screen-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #aaa;
    margin-bottom: 12px;
  }
  .screen {
    background: white;
    border-radius: 10px;
    padding: 20px;
    max-width: 380px;
  }
  .task-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    margin-bottom: 8px;
    cursor: pointer;
  }
  .task-checkbox {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 2px solid #ddd;
    flex-shrink: 0;
  }
  .task-text { font-size: 13px; color: #333; }
  /* TODO: Mache den Add-Button als primäre Aktion erkennbar */
  .add-btn {
    width: 100%;
    padding: 10px;
    background: #eee;
    color: #888;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 4px;
  }
  /* BONUS: Füge einen Fortschrittsindikator hinzu (z.B. "2 von 5 erledigt") */
</style>
</head>
<body>
  <div class="app-header">
    <span class="app-title">Aufgaben</span>
    <span style="font-size:13px;color:#aaa;">Heute</span>
  </div>
  <div class="screen-label">Bildschirm 1 von 3: Aufgabenliste</div>
  <div class="screen">
    <div class="task-item">
      <div class="task-checkbox" style="background:#0ea5a0;border-color:#0ea5a0;"></div>
      <span class="task-text">Design Review vorbereiten</span>
    </div>
    <div class="task-item">
      <div class="task-checkbox"></div>
      <span class="task-text">Wireframe fertigstellen</span>
    </div>
    <div class="task-item">
      <div class="task-checkbox"></div>
      <span class="task-text">Nutzertest planen</span>
    </div>
    <button class="add-btn">+ Neue Aufgabe hinzufügen</button>
  </div>
</body>
</html>`;

const EXERCISE_CONTROLS: PropertyControl[] = [
  {
    id: "add-btn-bg",
    property: "backgroundColor",
    label: "Add-Button Farbe",
    type: "color",
    target: ".add-btn",
    group: "colors",
    defaultValue: "#eeeeee",
  },
  {
    id: "add-btn-color",
    property: "color",
    label: "Add-Button Text",
    type: "color",
    target: ".add-btn",
    group: "colors",
    defaultValue: "#888888",
  },
  {
    id: "add-btn-padding",
    property: "paddingTop",
    label: "Add-Button Padding",
    type: "slider",
    target: ".add-btn",
    group: "spacing",
    defaultValue: 10,
    min: 8,
    max: 20,
    step: 2,
    unit: "px",
  },
  {
    id: "header-shadow",
    property: "boxShadow",
    label: "Header Schatten",
    type: "select",
    target: ".app-header",
    group: "shadows",
    defaultValue: "none",
    options: [
      { label: "Kein", value: "none" },
      { label: "Subtil", value: "0 1px 4px rgba(0,0,0,0.06)" },
      { label: "Mittel", value: "0 2px 10px rgba(0,0,0,0.1)" },
    ],
  },
  {
    id: "screen-label-color",
    property: "color",
    label: "Screen-Label Farbe",
    type: "color",
    target: ".screen-label",
    group: "colors",
    defaultValue: "#aaaaaa",
  },
  {
    id: "task-hover-bg",
    property: "backgroundColor",
    label: "Task-Item Hintergrund",
    type: "color",
    target: ".task-item",
    group: "colors",
    defaultValue: "#ffffff",
  },
  {
    id: "task-radius",
    property: "borderRadius",
    label: "Task-Item Rundung",
    type: "slider",
    target: ".task-item",
    group: "borders",
    defaultValue: 8,
    min: 0,
    max: 16,
    step: 2,
    unit: "px",
  },
  {
    id: "screen-padding",
    property: "padding",
    label: "Screen-Padding",
    type: "slider",
    target: ".screen",
    group: "spacing",
    defaultValue: 20,
    min: 12,
    max: 32,
    step: 4,
    unit: "px",
  },
  {
    id: "screen-shadow",
    property: "boxShadow",
    label: "Screen-Schatten",
    type: "select",
    target: ".screen",
    group: "shadows",
    defaultValue: "none",
    options: [
      { label: "Kein", value: "none" },
      { label: "Subtil", value: "0 2px 12px rgba(0,0,0,0.06)" },
      { label: "Mittel", value: "0 4px 20px rgba(0,0,0,0.1)" },
    ],
  },
];

export default function SketchingPrototypesModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      <div className="max-w-[1000px] mx-auto w-full px-8 py-12 flex-1">

        {/* ── Title ── */}
        <div className="inline-flex items-center gap-2 bg-(--accent-dim) border border-(--accent-border) rounded-full py-1 px-3.5 font-mono text-[11px] font-semibold text-(--accent) tracking-[1.5px] uppercase mb-6 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-(--accent) before:shadow-[0_0_6px_var(--accent)] before:shrink-0">
          Modul 06
        </div>
        <h1 className="text-[clamp(28px,4vw,36px)] font-extrabold leading-[1.15] tracking-[-0.5px] text-(--text-primary) mb-2 mt-0">
          Erste Ideenskizzen & Interaktive Prototypen
        </h1>
        <p className="text-[15px] font-medium leading-normal text-(--text-secondary) mb-8 mt-0 max-w-130">
          Den Wert frühen Skizzierens verstehen, den Unterschied zwischen Lo-Fi-,
          Mid-Fi- und Hi-Fi-Prototypen kennen und einen einfachen interaktiven
          Prototyp erleben.
        </p>

        <ModuleMeta duration="45 Minuten" practiceTime="~20 Min." />

        <LearningGoals
          goals={[
            "Erklären, warum frühes Skizzieren effizienter ist als direkt Code zu schreiben",
            "Die drei Fidelitätsstufen (Lo-Fi, Mid-Fi, Hi-Fi) und ihren Zweck kennen",
            "Verstehen, welche Fragen jede Fidelitätsstufe beantworten kann",
            "Einen einfachen klickbaren Prototyp selbst erkunden",
          ]}
        />

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── Why Sketch ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Warum überhaupt?
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Skizzieren bevor man baut
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Entwickler neigen dazu, direkt zum Code zu springen, weil Code sich
          produktiv anfühlt. Aber Code ist eine der{" "}
          <strong>teuersten Möglichkeiten</strong>, eine Idee zu erkunden.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Skizze auf Papier", time: "3 Minuten", cost: "1×", color: "var(--success-color)", bg: "var(--success-bg)", border: "var(--success-border)" },
            { label: "Digitaler Wireframe", time: "30 Minuten", cost: "10×", color: "var(--warning-color)", bg: "var(--warning-bg)", border: "var(--warning-border)" },
            { label: "Code-Prototyp", time: "Stunden", cost: "100×", color: "var(--bad-color)", bg: "var(--bad-bg)", border: "var(--bad-border)" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl p-3.5 text-center" style={{ background: item.bg, border: `1px solid ${item.border}` }}>
              <p className="font-mono text-[20px] font-black mb-1" style={{ color: item.color }}>{item.cost}</p>
              <p className="text-[13px] font-semibold text-(--text-primary) mb-0.5">{item.label}</p>
              <p className="text-[12px] text-(--text-tertiary)">{item.time}</p>
            </div>
          ))}
        </div>

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-6">
          Das Ziel des frühen Skizzierens ist nicht, schöne Arbeit zu
          produzieren. Es geht darum,{" "}
          <strong>Ideen schnell zu externalisieren, damit du sie beurteilen
          und verwerfen kannst</strong>. Wenn eine Idee nur in deinem Kopf
          existiert, neigst du dazu, sie zu verteidigen. Wenn sie auf Papier
          ist, kannst du sie kritisch betrachten.
        </p>

        {/* 3 Sketches exploration */}
        <SketchExploration />

        {/* ── Fidelity Levels ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Theorie
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Prototyp-Fidelitätsstufen
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Fidelität beschreibt, wie eng ein Prototyp dem fertigen Produkt
          ähnelt. Jede Stufe dient einem anderen Zweck:
        </p>

        <TheoryCard label="Drei Stufen">
          <ConceptList>
            <ConceptItem title="Lo-Fi — Struktur testen">
              Grobe Skizzen oder einfache digitale Wireframes ohne Styling.
              Schnell zu erstellen, schnell zu verwerfen. Die Frage:{" "}
              <em>„Ist das die richtige Struktur?"</em>
            </ConceptItem>
            <ConceptItem title="Mid-Fi — Layout validieren">
              Detailliertere Wireframes mit realen Beschriftungen und
              Proportionen, aber ohne Markenfarben. Ideal für Stakeholder-Reviews.
              Die Frage: <em>„Funktioniert das Layout?"</em>
            </ConceptItem>
            <ConceptItem title="Hi-Fi — Ästhetik und Interaktion testen">
              Dem fertigen Produkt sehr ähnlich – mit echten Schriften, Farben
              und Interaktionen. Die Frage:{" "}
              <em>„Fühlt sich das richtig an?"</em>
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <FidelityComparison />

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-6">
          Ein häufiger Fehler ist der zu frühe Sprung zum Hi-Fi. Nutzer und
          Stakeholder neigen dazu, Feedback zur Ästhetik zu geben (
          <em>„Ich mag dieses Blau nicht"</em>), statt zur Struktur – wenn der
          Prototyp fertig aussieht.
        </p>

        {/* ── Interactive Prototypes ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Interaktiv
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Paper-Prototyp-Simulator
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Ein interaktiver Prototyp simuliert, wie ein Produkt auf Nutzeraktionen
          reagiert – ohne echten Code im Hintergrund. Erkunde diese Lo-Fi
          To-do-App:
        </p>

        <PaperPrototypeSimulator />

        <ImagePlaceholder
          aspectRatio="16/7"
          label="Lo-Fi Skizzen: 3 Ansätze für denselben Bildschirm"
          caption="Frühes Skizzieren erlaubt es, viele Ideen schnell zu erkunden und zu verwerfen"
        />

        <RuleBox title="Kernregel">
          Fang mit der grobsten möglichen Darstellung an. Verfeinere nur,
          wenn die Struktur validiert ist. Code ist der teuerste Weg, eine
          Idee zu testen – und Papier ist der günstigste.
        </RuleBox>

        {/* ── Practice ── */}
        <hr className="border-0 border-t border-(--bg-elevated) my-8" />
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Praxisaufgabe
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Lo-Fi Prototyp: Primäre Aktion sichtbar machen
        </h2>

        <ExerciseBlock
          title="Aufgabenliste: Add-Button als primäre Aktion etablieren"
          tasks={[
            "Gib dem Add-Button eine klare Primärfarbe – er ist die wichtigste Aktion auf dem Screen",
            "Erhöhe das Button-Padding auf mindestens 14px oben/unten",
            "Füge dem Header einen subtilen Schatten hinzu, damit App-Shell und Inhalt getrennt wirken",
            "Passe die Task-Item-Hintergrundfarbe an – ein leicht gefärbter Hintergrund schafft Tiefe",
            "BONUS: Erhöhe das Screen-Padding auf 28px für mehr Luft",
          ]}
        >
          Auch Lo-Fi-Prototypen müssen Prioritäten kommunizieren. Der Screen
          unten zeigt eine Aufgabenliste, aber der Add-Button – die wichtigste
          Aktion – ist kaum erkennbar. Deine Aufgabe: Mache die Hierarchie klar,
          ohne das Lo-Fi-Niveau zu verlassen.
        </ExerciseBlock>

        <LiveEditor
          html={EXERCISE_HTML}
          controls={EXERCISE_CONTROLS}
          defaultMode="controller"
        />
      </div>

      <ModuleNav prevModule={prevModule} nextModule={nextModule} />
    </div>
  );
}
