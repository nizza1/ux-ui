import { useLoaderData } from "@remix-run/react";
import { modules } from "~/data/modules";
import { ModuleNav } from "~/routes/modules.$slug";
import { TheoryCard } from "~/components/ui/TheoryCard";
import { ConceptList, ConceptItem } from "~/components/ui/ConceptList";
import { ComparisonPanel } from "~/components/ui/ComparisonPanel";
import { RuleBox } from "~/components/ui/RuleBox";
import { ExerciseBlock } from "~/components/ui/ExerciseBlock";
import { LearningGoals } from "~/components/ui/LearningGoals";
import { ModuleMeta } from "~/components/ui/ModuleMeta";
import { ImagePlaceholder } from "~/components/ui/ImagePlaceholder";
import { LiveEditor } from "~/components/live-editor/LiveEditor";
import type { PropertyControl } from "~/components/live-editor/types";

export async function loader() {
  const slug = "research-methods";
  const currentIndex = modules.findIndex((m) => m.slug === slug);
  return {
    prevModule: currentIndex > 0 ? modules[currentIndex - 1] : null,
    nextModule: currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null,
  };
}

// ── 2×2 Research Matrix component ────────────────────────────────────────────
function ResearchMatrix() {
  const methods = [
    { label: "Nutzerinterviews", x: "generativ", y: "qualitativ", q: 1 },
    { label: "Tagebuchstudien", x: "generativ", y: "qualitativ", q: 1 },
    { label: "Kontextbeobachtung", x: "generativ", y: "qualitativ", q: 1 },
    { label: "Umfragen", x: "generativ", y: "quantitativ", q: 2 },
    { label: "Desk Research", x: "generativ", y: "quantitativ", q: 2 },
    { label: "Usability-Tests", x: "evaluativ", y: "qualitativ", q: 3 },
    { label: "Card Sorting", x: "evaluativ", y: "qualitativ", q: 3 },
    { label: "A/B-Tests", x: "evaluativ", y: "quantitativ", q: 4 },
    { label: "Analytics", x: "evaluativ", y: "quantitativ", q: 4 },
    { label: "Klick-Tracking", x: "evaluativ", y: "quantitativ", q: 4 },
  ];

  const quadrants = [
    { q: 1, label: "Generativ · Qualitativ", accent: "var(--accent)", bg: "var(--accent-dim)", border: "var(--accent-border)", desc: "Verstehen warum & wie" },
    { q: 2, label: "Generativ · Quantitativ", accent: "var(--success-color)", bg: "var(--success-bg)", border: "var(--success-border)", desc: "Verstehen wie viele" },
    { q: 3, label: "Evaluativ · Qualitativ", accent: "var(--warning-color)", bg: "var(--warning-bg)", border: "var(--warning-border)", desc: "Testen & beobachten" },
    { q: 4, label: "Evaluativ · Quantitativ", accent: "var(--bad-color)", bg: "var(--bad-bg)", border: "var(--bad-border)", desc: "Messen & vergleichen" },
  ];

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 mb-6">
      <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-4">
        Forschungsmethoden-Matrix
      </p>
      <div className="grid grid-cols-2 gap-3">
        {quadrants.map((quad) => (
          <div
            key={quad.q}
            className="rounded-xl p-3.5"
            style={{ background: quad.bg, border: `1px solid ${quad.border}` }}
          >
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: quad.accent }}>
              {quad.label}
            </p>
            <p className="text-[12px] text-(--text-tertiary) mb-2">{quad.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {methods.filter((m) => m.q === quad.q).map((m) => (
                <span
                  key={m.label}
                  className="px-2 py-0.5 rounded-full text-[11px] font-medium text-white"
                  style={{ background: quad.accent }}
                >
                  {m.label}
                </span>
              ))}
            </div>
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
<title>Forschungs-Dashboard</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: system-ui, sans-serif;
    background: #f5f7fa;
    padding: 24px;
    min-height: 100vh;
  }
  h1 {
    font-size: 20px;
    font-weight: 700;
    color: #111;
    margin-bottom: 4px;
  }
  .subtitle { font-size: 13px; color: #666; margin-bottom: 20px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  /* TODO: Mache die Karten visuell unterscheidbar je nach Methodentyp */
  .method-card {
    background: white;
    border-radius: 8px;
    padding: 16px;
    border: 1px solid #e5e7eb;
  }
  .method-type {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #aaa;
    margin-bottom: 6px;
  }
  .method-name {
    font-size: 15px;
    font-weight: 700;
    color: #111;
    margin-bottom: 6px;
  }
  .method-desc {
    font-size: 13px;
    color: #666;
    line-height: 1.5;
    margin-bottom: 10px;
  }
  /* TODO: Gib dem Tag einen Farb-Akzent passend zum Typ */
  .method-tag {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    background: #eee;
    color: #777;
  }
  /* BONUS: Füge einen hover-Effekt auf die Karten hinzu */
</style>
</head>
<body>
  <h1>Nutzerforschung-Methoden</h1>
  <p class="subtitle">Wähle die richtige Methode für deine Forschungsfrage</p>
  <div class="grid">
    <div class="method-card">
      <div class="method-type">Qualitativ · Generativ</div>
      <div class="method-name">Nutzerinterviews</div>
      <div class="method-desc">Einzelgespräche, um Motivationen und mentale Modelle zu verstehen.</div>
      <span class="method-tag">Warum & Wie</span>
    </div>
    <div class="method-card">
      <div class="method-type">Qualitativ · Evaluativ</div>
      <div class="method-name">Usability-Tests</div>
      <div class="method-desc">Nutzer erledigen Aufgaben mit dem Produkt — du beobachtest.</div>
      <span class="method-tag">Wo bricht ab</span>
    </div>
    <div class="method-card">
      <div class="method-type">Quantitativ · Generativ</div>
      <div class="method-name">Umfragen</div>
      <div class="method-desc">Viele Nutzer schnell erreichen für messbare Antworten.</div>
      <span class="method-tag">Wie viele</span>
    </div>
    <div class="method-card">
      <div class="method-type">Quantitativ · Evaluativ</div>
      <div class="method-name">Analytics & Heatmaps</div>
      <div class="method-desc">Was Nutzer tatsächlich tun — nicht was sie sagen.</div>
      <span class="method-tag">Was & Wo</span>
    </div>
  </div>
</body>
</html>`;

const EXERCISE_CONTROLS: PropertyControl[] = [
  {
    id: "card-border-color",
    property: "borderColor",
    label: "Karten-Rahmenfarbe",
    type: "color",
    target: ".method-card",
    group: "colors",
    defaultValue: "#e5e7eb",
  },
  {
    id: "card-shadow",
    property: "boxShadow",
    label: "Karten-Schatten",
    type: "select",
    target: ".method-card",
    group: "shadows",
    defaultValue: "none",
    options: [
      { label: "Kein", value: "none" },
      { label: "Subtil", value: "0 1px 6px rgba(0,0,0,0.06)" },
      { label: "Mittel", value: "0 2px 12px rgba(0,0,0,0.1)" },
    ],
  },
  {
    id: "card-radius",
    property: "borderRadius",
    label: "Karten-Rundung",
    type: "slider",
    target: ".method-card",
    group: "borders",
    defaultValue: 8,
    min: 0,
    max: 20,
    step: 2,
    unit: "px",
  },
  {
    id: "card-padding",
    property: "padding",
    label: "Karten-Padding",
    type: "slider",
    target: ".method-card",
    group: "spacing",
    defaultValue: 16,
    min: 12,
    max: 28,
    step: 2,
    unit: "px",
  },
  {
    id: "tag-bg",
    property: "backgroundColor",
    label: "Tag Hintergrundfarbe",
    type: "color",
    target: ".method-tag",
    group: "colors",
    defaultValue: "#eeeeee",
  },
  {
    id: "tag-color",
    property: "color",
    label: "Tag Textfarbe",
    type: "color",
    target: ".method-tag",
    group: "colors",
    defaultValue: "#777777",
  },
  {
    id: "tag-radius",
    property: "borderRadius",
    label: "Tag Rundung",
    type: "slider",
    target: ".method-tag",
    group: "borders",
    defaultValue: 20,
    min: 2,
    max: 20,
    step: 2,
    unit: "px",
  },
  {
    id: "gap",
    property: "gap",
    label: "Grid-Abstand",
    type: "slider",
    target: ".grid",
    group: "spacing",
    defaultValue: 12,
    min: 4,
    max: 24,
    step: 4,
    unit: "px",
  },
  {
    id: "method-type-color",
    property: "color",
    label: "Typ-Label Farbe",
    type: "color",
    target: ".method-type",
    group: "colors",
    defaultValue: "#aaaaaa",
  },
];

export default function ResearchMethodsModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      <div className="max-w-[1000px] mx-auto w-full px-8 py-12 flex-1">

        {/* ── Title ── */}
        <div className="inline-flex items-center gap-2 bg-(--accent-dim) border border-(--accent-border) rounded-full py-1 px-3.5 font-mono text-[11px] font-semibold text-(--accent) tracking-[1.5px] uppercase mb-6 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-(--accent) before:shadow-[0_0_6px_var(--accent)] before:shrink-0">
          Modul 03
        </div>
        <h1 className="text-[clamp(28px,4vw,36px)] font-extrabold leading-[1.15] tracking-[-0.5px] text-(--text-primary) mb-2 mt-0">
          Methoden der Nutzerforschung
        </h1>
        <p className="text-[15px] font-medium leading-normal text-(--text-secondary) mb-8 mt-0 max-w-130">
          Die wichtigsten Forschungsmethoden kennenlernen, die richtige Methode
          für eine gegebene Frage wählen und den Unterschied zwischen qualitativen
          und quantitativen Erkenntnissen verstehen.
        </p>

        <ModuleMeta duration="45 Minuten" practiceTime="~20 Min." />

        <LearningGoals
          goals={[
            "Den Unterschied zwischen qualitativer und quantitativer Forschung erklären",
            "Die vier wichtigsten Forschungsmethoden und ihren Einsatzbereich kennen",
            "Die 2×2-Matrix (generativ/evaluativ × qualitativ/quantitativ) anwenden",
            "Für eine konkrete Forschungsfrage die passende Methode wählen",
          ]}
        />

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── Why Research ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Warum überhaupt?
        </p>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          <strong>Design ohne Forschung ist Dekoration.</strong> Du kannst
          etwas visuell Schönes schaffen, das kein echtes Problem löst – oder
          schlimmer noch, neue Probleme schafft. Nutzerforschung ist der Weg,
          Annahmen durch Belege zu ersetzen.
        </p>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-6">
          Die gute Nachricht: Du brauchst kein dediziertes Forschungslabor oder
          monatelange Zeit. Schon <strong>5 Nutzer in einem Usability-Test</strong>{" "}
          können die kritischsten Probleme aufdecken.
        </p>

        {/* ── Qual vs Quant ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Theorie
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Qualitativ vs. Quantitativ
        </h2>

        <ComparisonPanel
          bad={{
            label: "Nur auf Analytics verlassen",
            children: (
              <div className="space-y-2 p-1">
                <p className="text-[13px] text-(--text-secondary)">
                  Analytics sagt dir: <strong>60% brechen bei Schritt 3 ab.</strong>
                </p>
                <p className="text-[13px] text-(--text-secondary)">
                  Aber <em>warum</em>? Das sagen Zahlen nicht.
                </p>
                <p className="text-[12px] text-(--text-ghost) mt-2">
                  ↳ Du weißt, dass etwas kaputt ist – aber nicht, was du reparieren sollst.
                </p>
              </div>
            ),
          }}
          good={{
            label: "Qual + Quant kombinieren",
            children: (
              <div className="space-y-2 p-1">
                <p className="text-[13px] text-(--text-secondary)">
                  Analytics: 60% brechen ab. Interview: „Das Formular fragt Dinge, die ich nicht verstehe."
                </p>
                <p className="text-[13px] text-(--text-secondary)">
                  <strong>Beides zusammen</strong> zeigt: was kaputt ist <em>und</em> wie du es fixst.
                </p>
              </div>
            ),
          }}
        />

        <TheoryCard label="Wann welche Methode?">
          <ConceptList>
            <ConceptItem title="Qualitative Forschung → Warum & Wie">
              Interviews, Beobachtungen, Usability-Tests. Liefert tiefe
              Einblicke in Motivationen und mentale Modelle. Kleine Stichproben,
              reiche Erkenntnisse.
            </ConceptItem>
            <ConceptItem title="Quantitative Forschung → Was & Wie viele">
              Umfragen, Analytics, A/B-Tests. Zeigt Verhaltensmuster bei
              vielen Nutzern. Große Stichproben, messbare Daten.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        {/* ── 2×2 Matrix ── */}
        <ResearchMatrix />

        <ImagePlaceholder
          aspectRatio="16/7"
          label="2×2 Matrix: generativ/evaluativ × qualitativ/quantitativ"
          caption="Jede Forschungsmethode beantwortet andere Fragen – die Matrix hilft, die richtige zu wählen"
        />

        {/* ── Methods ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Die wichtigsten Methoden
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Methoden im Überblick
        </h2>

        <TheoryCard label="5 Kernmethoden">
          <ConceptList>
            <ConceptItem title="Nutzerinterviews">
              Einzelgespräche zur Erkundung von Motivationen und vergangenen
              Verhaltensweisen. Wichtigste Fähigkeit: offene Fragen stellen.{" "}
              <strong>Gut:</strong> „Erzähl mir vom letzten Mal, als du…" —{" "}
              <strong>Schlecht:</strong> „Nutzt du normalerweise…?"
            </ConceptItem>
            <ConceptItem title="Kontextbeobachtung (Contextual Inquiry)">
              Du beobachtest Nutzer in ihrer natürlichen Umgebung. Enthüllt
              Workarounds, Unterbrechungen und physische
              Umgebungseinschränkungen, die Interviews verpassen.
            </ConceptItem>
            <ConceptItem title="Usability-Tests">
              Konkreter Prototyp oder Live-Produkt vor echten Nutzern. Nutzer
              erledigen Aufgaben, du beobachtest. Schon{" "}
              <strong>5 Nutzer</strong> decken die kritischsten Probleme auf.
            </ConceptItem>
            <ConceptItem title="Umfragen">
              Viele Nutzer schnell erreichen. Funktionieren am besten für
              aufzählbare Antworten. Schwieriger zu gestalten als es aussieht –
              immer mit einer kleinen Gruppe vorher testen.
            </ConceptItem>
            <ConceptItem title="Analytics & Heatmaps">
              Zeigen, was Nutzer <em>tatsächlich</em> tun – nicht was sie
              sagen. Heatmaps: Klick- und Scrollmuster. Trichter: wo Nutzer
              abbrechen. Ideal, um zu identifizieren, <em>wo</em> man
              qualitativ nachforschen sollte.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <RuleBox title="Kernregel">
          Keine einzelne Methode reicht. Analytics sagt dir wo – Interviews
          sagen dir warum. Ein Usability-Test zeigt dir, was gebrochen ist –
          eine Umfrage sagt dir, wie weit verbreitet das Problem ist. Gute
          Forschung kombiniert Methoden.
        </RuleBox>

        {/* ── Practice ── */}
        <hr className="border-0 border-t border-(--bg-elevated) my-8" />
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Praxisaufgabe
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Forschungs-Dashboard: Methoden visuell unterscheidbar machen
        </h2>

        <ExerciseBlock
          title="Methoden-Karten: Typ durch Farbe kommunizieren"
          tasks={[
            "Gib den Tags eine Farbe, die den Methodentyp kommuniziert – qualitative Methoden anders als quantitative",
            "Füge den Karten einen leichten Schatten hinzu, damit sie sich vom Hintergrund abheben",
            "Erhöhe das Karten-Padding auf mindestens 20px für mehr Lesbarkeit",
            "Mache den Typ-Label farblich deutlicher – er soll den Kontext sofort setzen",
            "BONUS: Erhöhe den Grid-Abstand auf 20px für mehr Luft zwischen den Karten",
          ]}
        >
          Ein Forschungs-Dashboard listet vier Methoden – aber optisch sind sie
          alle identisch. Nutzer können qualitative und quantitative Methoden
          nicht unterscheiden. Deine Aufgabe: Mache den Typ durch gezielten
          Farbeinsatz sofort erkennbar.
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
