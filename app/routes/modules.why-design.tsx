import { useLoaderData } from "@remix-run/react";
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
  const slug = "why-design";
  const currentIndex = modules.findIndex((m) => m.slug === slug);
  return {
    prevModule: currentIndex > 0 ? modules[currentIndex - 1] : null,
    nextModule: currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null,
  };
}

// ── Cost of UX Error diagram ──────────────────────────────────────────────────
function CostDiagram() {
  const phases = [
    { label: "Wireframe-Phase", cost: 1, color: "var(--success-color)", bg: "var(--success-bg)", border: "var(--success-border)", desc: "Fehler sofort sichtbar, schnell korrigiert" },
    { label: "Entwicklungsphase", cost: 10, color: "var(--warning-color)", bg: "var(--warning-bg)", border: "var(--warning-border)", desc: "Refactoring nötig, bereits gebaut" },
    { label: "Nach dem Launch", cost: 100, color: "var(--bad-color)", bg: "var(--bad-bg)", border: "var(--bad-border)", desc: "Nutzer betroffen, Support, Reputationsschaden" },
  ];
  const maxCost = 100;

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 mb-6">
      <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-4">
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
            <div className="flex items-center gap-2">
              <div className="flex-1 h-5 bg-(--bg-elevated) rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(phase.cost / maxCost) * 100}%`,
                    background: phase.color,
                    opacity: 0.8,
                  }}
                />
              </div>
            </div>
            <p className="text-[12px] text-(--text-tertiary) mt-0.5">{phase.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Workshop overview component ───────────────────────────────────────────────
function WorkshopOverview() {
  const covered = [
    "Visuelle Hierarchie", "Typografie-Systeme", "Farbe & Kontrast",
    "Abstände & Layout", "UI-Komponenten", "Responsive Design",
    "Design-Systeme & Tokens", "Gestalt-Prinzipien",
  ];
  const notCovered = [
    "Markenidentität & Logo-Design", "Figma-Workflows", "Vertiefende UX-Research-Methoden",
    "Animationen & Motion Design",
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-(--success-bg) border border-(--success-border) rounded-xl p-4">
        <p className="font-mono text-[10px] font-semibold text-(--success-color) uppercase tracking-wider mb-3">
          Was wir abdecken
        </p>
        <ul className="space-y-1.5">
          {covered.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[13px] text-(--text-secondary)">
              <span className="text-(--success-color) shrink-0 mt-0.5">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-(--bg-elevated) border border-(--bg-hover) rounded-xl p-4">
        <p className="font-mono text-[10px] font-semibold text-(--text-ghost) uppercase tracking-wider mb-3">
          Was wir nicht abdecken
        </p>
        <ul className="space-y-1.5">
          {notCovered.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[13px] text-(--text-tertiary)">
              <span className="text-(--text-ghost) shrink-0 mt-0.5">—</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="text-[12px] text-(--text-ghost) mt-3">
          Für UX-Research-Methoden: Modul 03
        </p>
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
<title>Dashboard</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: system-ui, sans-serif;
    background: #f5f7fa;
    padding: 24px;
    min-height: 100vh;
  }
  h1 { font-size: 20px; font-weight: 700; color: #111; margin-bottom: 4px; }
  .subtitle { font-size: 13px; color: #666; margin-bottom: 20px; }
  .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
  /* TODO: Mache die KPI-Karten visuell prominent und hierarchisch */
  .kpi-card {
    background: white;
    border-radius: 8px;
    padding: 16px;
    border: 1px solid #e5e7eb;
  }
  .kpi-label {
    font-size: 12px;
    color: #888;
    margin-bottom: 6px;
    /* TODO: Verbessere das Label – es soll klar aber nicht dominierend sein */
  }
  .kpi-value {
    font-size: 24px;
    font-weight: 800;
    color: #111;
    /* TODO: Mache den Wert visuell prominent */
  }
  .kpi-change {
    font-size: 12px;
    margin-top: 4px;
  }
  .kpi-change.positive { color: #22c55e; }
  .kpi-change.negative { color: #ef4444; }
  /* TODO: Mache den primären CTA-Button klar erkennbar */
  .action-section {
    display: flex;
    gap: 10px;
  }
  .btn-primary {
    padding: 10px 20px;
    background: #eee;
    color: #888;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
  .btn-secondary {
    padding: 10px 20px;
    background: transparent;
    color: #666;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
  }
  /* BONUS: Füge einem KPI-Wert eine Akzentfarbe hinzu, um ihn hervorzuheben */
</style>
</head>
<body>
  <h1>Projekt-Dashboard</h1>
  <p class="subtitle">Übersicht für diese Woche — zuletzt aktualisiert vor 2 Minuten</p>
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-label">Offene Aufgaben</div>
      <div class="kpi-value">24</div>
      <div class="kpi-change negative">↑ +3 diese Woche</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Erledigte Aufgaben</div>
      <div class="kpi-value">87</div>
      <div class="kpi-change positive">↑ +12 diese Woche</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Team-Kapazität</div>
      <div class="kpi-value">76%</div>
      <div class="kpi-change positive">↑ Optimal</div>
    </div>
  </div>
  <div class="action-section">
    <button class="btn-primary">Neue Aufgabe erstellen</button>
    <button class="btn-secondary">Bericht exportieren</button>
  </div>
</body>
</html>`;

const EXERCISE_CONTROLS: PropertyControl[] = [
  {
    id: "kpi-shadow",
    property: "boxShadow",
    label: "KPI-Karten Schatten",
    type: "select",
    target: ".kpi-card",
    group: "shadows",
    defaultValue: "none",
    options: [
      { label: "Kein", value: "none" },
      { label: "Subtil", value: "0 1px 6px rgba(0,0,0,0.06)" },
      { label: "Mittel", value: "0 2px 12px rgba(0,0,0,0.1)" },
    ],
  },
  {
    id: "kpi-value-size",
    property: "fontSize",
    label: "KPI-Wert Schriftgröße",
    type: "slider",
    target: ".kpi-value",
    group: "typography",
    defaultValue: 24,
    min: 20,
    max: 36,
    step: 2,
    unit: "px",
  },
  {
    id: "kpi-value-color",
    property: "color",
    label: "KPI-Wert Farbe",
    type: "color",
    target: ".kpi-value",
    group: "colors",
    defaultValue: "#111111",
  },
  {
    id: "btn-primary-bg",
    property: "backgroundColor",
    label: "Primär-Button Farbe",
    type: "color",
    target: ".btn-primary",
    group: "colors",
    defaultValue: "#eeeeee",
  },
  {
    id: "btn-primary-color",
    property: "color",
    label: "Primär-Button Text",
    type: "color",
    target: ".btn-primary",
    group: "colors",
    defaultValue: "#888888",
  },
  {
    id: "btn-padding",
    property: "paddingTop",
    label: "Button Padding",
    type: "slider",
    target: ".btn-primary",
    group: "spacing",
    defaultValue: 10,
    min: 8,
    max: 18,
    step: 2,
    unit: "px",
  },
  {
    id: "btn-radius",
    property: "borderRadius",
    label: "Button Rundung",
    type: "slider",
    target: ".btn-primary",
    group: "borders",
    defaultValue: 8,
    min: 0,
    max: 24,
    step: 4,
    unit: "px",
  },
  {
    id: "kpi-card-padding",
    property: "padding",
    label: "KPI-Karten Padding",
    type: "slider",
    target: ".kpi-card",
    group: "spacing",
    defaultValue: 16,
    min: 12,
    max: 28,
    step: 4,
    unit: "px",
  },
  {
    id: "kpi-grid-gap",
    property: "gap",
    label: "KPI-Grid Abstand",
    type: "slider",
    target: ".kpi-grid",
    group: "spacing",
    defaultValue: 12,
    min: 4,
    max: 24,
    step: 4,
    unit: "px",
  },
  {
    id: "kpi-label-size",
    property: "fontSize",
    label: "KPI-Label Schriftgröße",
    type: "slider",
    target: ".kpi-label",
    group: "typography",
    defaultValue: 12,
    min: 11,
    max: 14,
    step: 1,
    unit: "px",
  },
];

export default function WhyDesignModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      <div className="max-w-[1000px] mx-auto w-full px-8 py-12 flex-1">

        {/* ── Title ── */}
        <div className="inline-flex items-center gap-2 bg-(--accent-dim) border border-(--accent-border) rounded-full py-1 px-3.5 font-mono text-[11px] font-semibold text-(--accent) tracking-[1.5px] uppercase mb-6 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-(--accent) before:shadow-[0_0_6px_var(--accent)] before:shrink-0">
          Modul 09
        </div>
        <h1 className="text-[clamp(28px,4vw,36px)] font-extrabold leading-[1.15] tracking-[-0.5px] text-(--text-primary) mb-2 mt-0">
          Warum UI-Design für Entwickler wichtig ist
        </h1>
        <p className="text-[15px] font-medium leading-normal text-(--text-secondary) mb-8 mt-0 max-w-130">
          UX/UI-Theorie mit der täglichen Arbeit als Entwickler verknüpfen und
          den geschäftlichen und menschlichen Einfluss von Designentscheidungen
          verstehen.
        </p>

        <ModuleMeta duration="30 Minuten" practiceTime="~15 Min." />

        <LearningGoals
          goals={[
            "Verstehen, dass Entwickler täglich Dutzende unbewusste Designentscheidungen treffen",
            "Die messbaren geschäftlichen Auswirkungen guten UI-Designs kennen",
            "Den Zusammenhang zwischen Fehler-Zeitpunkt und Korrekturkosten verstehen",
            "Ein einfaches Dashboard mit besserer visueller Hierarchie ausliefern",
          ]}
        />

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── Developer Design Problem ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Das Problem
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Das Design-Problem des Entwicklers
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Als Entwickler triffst du täglich Dutzende von Designentscheidungen –
          oft ohne es zu merken. Welche Textfarbe verwendest du für ein
          deaktiviertes Eingabefeld? Wie zeigst du einen Fehlerzustand an? Wie
          groß ist die Überschrift für ein Dialog-Fenster?
        </p>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-6">
          Ohne ein Design-Framework fallen diese Entscheidungen auf das zurück,
          was am schnellsten fertig ist, was okay aussieht oder was du irgendwo
          gesehen hast. Das Ergebnis sind Oberflächen, die technisch funktional,
          aber{" "}
          <strong>visuell inkonsistent, schwer zu bedienen und schwer zu
          warten</strong>{" "}
          sind.
        </p>

        <TheoryCard label="Typische unbewusste Design-Entscheidungen">
          <ConceptList>
            <ConceptItem title="Farbe eines deaktivierten Buttons">
              #bbb? opacity: 0.5? pointer-events: none? Drei verschiedene
              Entwickler, drei verschiedene Lösungen – kein Nutzer versteht,
              warum der Button „kaputt" aussieht.
            </ConceptItem>
            <ConceptItem title="Fehlerzustand eines Formulars">
              Roter Rand? Rote Schrift? Toast-Notification? Inline-Text? Die
              Entscheidung hat direkte Auswirkungen auf die Fehlerrate der
              Nutzer.
            </ConceptItem>
            <ConceptItem title="Padding einer Karte">
              12px weil es „genug" aussieht? 16px weil es eine runde Zahl ist?
              Ohne System: 17 verschiedene Padding-Werte im Codebase.
            </ConceptItem>
            <ConceptItem title="Schriftgröße einer Überschrift">
              h1 = browser default (32px)? Oder kleiner, weil das modal-size
              ist? Die Entscheidung beeinflusst visuelle Hierarchie massiv.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        {/* ── Business Case ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Das Geschäftsargument
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Warum gutes UI-Design messbar lohnt
        </h2>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            {
              icon: "📞",
              title: "Reduziert Support-Kosten",
              desc: "Klare, selbsterklärende Oberflächen erzeugen weniger Support-Anfragen.",
            },
            {
              icon: "📈",
              title: "Erhöht Konversionsraten",
              desc: "A/B-Tests zeigen regelmäßig 20–40% Verbesserung durch Layout- und Textänderungen.",
            },
            {
              icon: "🔄",
              title: "Reduziert Abwanderung",
              desc: "Nutzer, die sich kompetent und in Kontrolle fühlen, springen seltener ab.",
            },
            {
              icon: "🚀",
              title: "Beschleunigt Onboarding",
              desc: "Neue Nutzer, die das Interface ohne Training verstehen, brauchen weniger Support.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-(--bg-elevated) rounded-xl p-3.5">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xl">{item.icon}</span>
                <p className="text-[13px] font-bold text-(--text-primary)">{item.title}</p>
              </div>
              <p className="text-[13px] text-(--text-secondary) leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>

        <CostDiagram />

        <ImagePlaceholder
          aspectRatio="16/6"
          label="Kosten-Eskalation: Wireframe 1× → Entwicklung 10× → Launch 100×"
          caption="Je später ein UX-Problem entdeckt wird, desto exponentiell teurer wird die Korrektur"
        />

        {/* ── Workshop Scope ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Der Workshop
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Was dieser Workshop abdeckt
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Dieser Workshop ist <strong>für Entwickler gemacht</strong>. Jedes
          Konzept ist mit Code verknüpft – CSS-Properties,
          Komponentenstrukturen, Token-Systeme. Du wirst kein Figma benutzen
          (es sei denn, du möchtest). Du arbeitest direkt im Browser.
        </p>

        <WorkshopOverview />

        <RuleBox title="Kernregel">
          Entwickler bauen Interfaces – ob sie wollen oder nicht. Der Unterschied
          zwischen einem „es funktioniert"-Developer und einem, der tatsächlich
          gute Produkte baut, ist das Bewusstsein für die Designebene. Das ist
          kein Talent. Das ist ein Framework. Diesen Workshop lernst du das Framework.
        </RuleBox>

        {/* ── Practice ── */}
        <hr className="border-0 border-t border-(--bg-elevated) my-8" />
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Praxisaufgabe
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Dashboard: Bewusste Designentscheidungen treffen
        </h2>

        <ExerciseBlock
          title="KPI-Dashboard: Visuelle Hierarchie und primäre Aktion etablieren"
          tasks={[
            "Gib dem primären Button eine klare Hintergrundfarbe – er ist die wichtigste Aktion",
            "Erhöhe die KPI-Wert-Schriftgröße auf mindestens 28px – sie müssen auf Anhieb lesbar sein",
            "Füge den KPI-Karten einen subtilen Schatten hinzu, damit sie sich vom Hintergrund abheben",
            "Erhöhe das KPI-Karten-Padding auf mindestens 20px für mehr Luft",
            "BONUS: Gib dem Hauptwert eine Akzentfarbe, damit er die Aufmerksamkeit anzieht",
          ]}
        >
          Das Dashboard unten zeigt drei KPI-Karten und zwei Aktions-Buttons.
          Aber: Der primäre Button ist kaum erkennbar, die KPI-Werte zu klein,
          und die Karten verschmelzen mit dem Hintergrund. Triff drei bewusste
          Designentscheidungen, um die visuelle Hierarchie zu verbessern.
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
