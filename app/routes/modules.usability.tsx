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
  const slug = "usability";
  const currentIndex = modules.findIndex((m) => m.slug === slug);
  return {
    prevModule: currentIndex > 0 ? modules[currentIndex - 1] : null,
    nextModule: currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null,
  };
}

// ── Usability Radar interactive component ────────────────────────────────────
const DIMENSIONS = [
  { id: "learnability", label: "Erlernbarkeit", description: "Wie leicht können neue Nutzer grundlegende Aufgaben erledigen?" },
  { id: "efficiency", label: "Effizienz", description: "Wie schnell erledigen erfahrene Nutzer ihre Aufgaben?" },
  { id: "memorability", label: "Einprägsamkeit", description: "Wie schnell finden Nutzer nach einer Pause zurück?" },
  { id: "errors", label: "Fehlerrate", description: "Wie wenige Fehler machen Nutzer – und erholen sie sich leicht?" },
  { id: "satisfaction", label: "Zufriedenheit", description: "Wie angenehm ist die Nutzung insgesamt?" },
];

function UsabilityRating() {
  const [ratings, setRatings] = useState<Record<string, number>>(
    Object.fromEntries(DIMENSIONS.map((d) => [d.id, 3]))
  );

  const avg = Object.values(ratings).reduce((a, b) => a + b, 0) / DIMENSIONS.length;

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 mb-6">
      <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-1">
        Interaktiv: Usability-Bewertung
      </p>
      <p className="text-[13px] text-(--text-secondary) mb-5">
        Bewerte ein dir bekanntes Interface auf diesen fünf Dimensionen (1 = schlecht, 5 = exzellent):
      </p>
      <div className="space-y-4">
        {DIMENSIONS.map((dim) => (
          <div key={dim.id}>
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <span className="text-[13px] font-semibold text-(--text-primary)">{dim.label}</span>
                <span className="text-[12px] text-(--text-tertiary) ml-2">{dim.description}</span>
              </div>
              <span className="font-mono text-[13px] font-bold text-(--accent) min-w-[20px] text-right">
                {ratings[dim.id]}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-(--text-ghost)">1</span>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={ratings[dim.id]}
                onChange={(e) =>
                  setRatings((prev) => ({ ...prev, [dim.id]: Number(e.target.value) }))
                }
                className="flex-1 accent-[var(--accent)] h-1.5 cursor-pointer"
              />
              <span className="font-mono text-[10px] text-(--text-ghost)">5</span>
            </div>
            <div className="flex justify-between mt-1">
              {[1, 2, 3, 4, 5].map((v) => (
                <div
                  key={v}
                  className={`h-1.5 w-1/5 rounded-full transition-all duration-200 ${
                    v <= ratings[dim.id] ? "bg-(--accent) opacity-80" : "bg-(--bg-elevated)"
                  }`}
                  style={{ maxWidth: "calc(20% - 2px)" }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-(--bg-elevated) flex items-center justify-between">
        <span className="text-[13px] font-semibold text-(--text-primary)">Gesamtbewertung</span>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((v) => (
              <div
                key={v}
                className={`w-5 h-5 rounded transition-all duration-200 ${
                  v <= Math.round(avg)
                    ? avg >= 4 ? "bg-(--success-color)" : avg >= 3 ? "bg-(--accent)" : "bg-(--bad-color)"
                    : "bg-(--bg-elevated)"
                }`}
              />
            ))}
          </div>
          <span
            className={`font-mono text-[15px] font-bold ${
              avg >= 4 ? "text-(--success-color)" : avg >= 3 ? "text-(--accent)" : "text-(--bad-color)"
            }`}
          >
            {avg.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── UCD Cycle component ───────────────────────────────────────────────────────
function UCDCycle() {
  const phases = [
    { label: "Verstehen", color: "var(--accent)", desc: "Wer sind meine Nutzer? Was brauchen sie?" },
    { label: "Spezifizieren", color: "var(--success-color)", desc: "Was müssen Nutzer erreichen können?" },
    { label: "Gestalten", color: "var(--warning-color)", desc: "Skizzen, Wireframes, Prototypen" },
    { label: "Evaluieren", color: "var(--bad-color)", desc: "Test mit echten Nutzern, iterieren" },
  ];

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 mb-6">
      <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-4">
        Der UCD-Kreislauf
      </p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {phases.map((phase, i) => (
          <div
            key={phase.label}
            className="bg-(--bg-elevated) rounded-lg p-3.5 relative"
            style={{ borderLeft: `3px solid ${phase.color}` }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                style={{ background: phase.color }}
              >
                {i + 1}
              </span>
              <span className="text-[13px] font-semibold text-(--text-primary)">{phase.label}</span>
            </div>
            <p className="text-[12px] text-(--text-secondary) leading-snug">{phase.desc}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 bg-(--accent-dim) border border-(--accent-border) rounded-lg px-3 py-2">
        <span className="text-(--accent) text-base">↻</span>
        <p className="text-[12px] text-(--text-secondary)">
          Der Prozess ist <strong>nicht linear</strong> – nach der Evaluation kehrt man zurück zum Verstehen und verfeinert bei jedem Durchlauf.
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
<title>Onboarding-Screen</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: system-ui, sans-serif;
    background: #f0f4f8;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 24px;
  }
  .card {
    background: white;
    border-radius: 12px;
    padding: 32px;
    max-width: 420px;
    width: 100%;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  }
  /* TODO: Mache die Schrittnummer visuell prominenter */
  .step-indicator {
    font-size: 12px;
    color: #aaa;
    margin-bottom: 16px;
  }
  h1 {
    font-size: 22px;
    font-weight: 700;
    color: #111;
    margin-bottom: 8px;
    /* TODO: Erhöhe den Zeilenabstand für bessere Lesbarkeit */
    line-height: 1.1;
  }
  p {
    font-size: 14px;
    color: #666;
    line-height: 1.5;
    margin-bottom: 24px;
  }
  .options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
  /* TODO: Mache die Options-Buttons erkennbar klickbar */
  .option-btn {
    padding: 10px 14px;
    border: 1px solid #ddd;
    border-radius: 8px;
    text-align: left;
    font-size: 14px;
    color: #333;
    background: white;
    cursor: pointer;
    transition: all 0.15s;
  }
  .option-btn:hover { background: #f5f5f5; }
  .option-btn.selected {
    border-color: #0ea5a0;
    background: rgba(14,165,160,0.05);
    color: #0ea5a0;
    font-weight: 600;
  }
  /* TODO: Mache den CTA-Button primär und sichtbar */
  .cta-btn {
    width: 100%;
    padding: 10px;
    background: #ddd;
    color: #888;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
  /* BONUS: Füge einen Fortschrittsbalken oben hinzu */
</style>
</head>
<body>
  <div class="card">
    <div class="step-indicator">Schritt 1 von 3</div>
    <h1>Was ist dein Hauptziel mit unserem Tool?</h1>
    <p>Wir personalisieren deine Erfahrung basierend auf deinen Antworten.</p>
    <div class="options">
      <button class="option-btn selected" onclick="this.classList.toggle('selected')">🎨 Designs erstellen</button>
      <button class="option-btn" onclick="this.classList.toggle('selected')">👥 Im Team zusammenarbeiten</button>
      <button class="option-btn" onclick="this.classList.toggle('selected')">📊 Präsentationen bauen</button>
      <button class="option-btn" onclick="this.classList.toggle('selected')">🚀 Prototypen entwickeln</button>
    </div>
    <button class="cta-btn">Weiter →</button>
  </div>
</body>
</html>`;

const EXERCISE_CONTROLS: PropertyControl[] = [
  {
    id: "cta-bg",
    property: "backgroundColor",
    label: "CTA-Button Farbe",
    type: "color",
    target: ".cta-btn",
    group: "colors",
    defaultValue: "#dddddd",
  },
  {
    id: "cta-color",
    property: "color",
    label: "CTA-Button Textfarbe",
    type: "color",
    target: ".cta-btn",
    group: "colors",
    defaultValue: "#888888",
  },
  {
    id: "cta-padding",
    property: "paddingTop",
    label: "CTA Padding (oben/unten)",
    type: "slider",
    target: ".cta-btn",
    group: "spacing",
    defaultValue: 10,
    min: 8,
    max: 20,
    step: 2,
    unit: "px",
  },
  {
    id: "h1-line-height",
    property: "lineHeight",
    label: "Überschrift Zeilenhöhe",
    type: "slider",
    target: "h1",
    group: "typography",
    defaultValue: 1.1,
    min: 1.0,
    max: 1.5,
    step: 0.05,
    unit: "",
  },
  {
    id: "step-font-size",
    property: "fontSize",
    label: "Schrittnummer Größe",
    type: "slider",
    target: ".step-indicator",
    group: "typography",
    defaultValue: 12,
    min: 11,
    max: 15,
    step: 1,
    unit: "px",
  },
  {
    id: "step-color",
    property: "color",
    label: "Schrittnummer Farbe",
    type: "color",
    target: ".step-indicator",
    group: "colors",
    defaultValue: "#aaaaaa",
  },
  {
    id: "option-border-radius",
    property: "borderRadius",
    label: "Options-Rundung",
    type: "slider",
    target: ".option-btn",
    group: "borders",
    defaultValue: 8,
    min: 0,
    max: 24,
    step: 2,
    unit: "px",
  },
  {
    id: "gap",
    property: "gap",
    label: "Abstand zwischen Optionen",
    type: "slider",
    target: ".options",
    group: "spacing",
    defaultValue: 8,
    min: 4,
    max: 16,
    step: 2,
    unit: "px",
  },
  {
    id: "card-radius",
    property: "borderRadius",
    label: "Karten-Rundung",
    type: "slider",
    target: ".card",
    group: "borders",
    defaultValue: 12,
    min: 0,
    max: 24,
    step: 4,
    unit: "px",
  },
];

export default function UsabilityModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      <div className="max-w-[1000px] mx-auto w-full px-8 py-12 flex-1">

        {/* ── Title ── */}
        <div className="inline-flex items-center gap-2 bg-(--accent-dim) border border-(--accent-border) rounded-full py-1 px-3.5 font-mono text-[11px] font-semibold text-(--accent) tracking-[1.5px] uppercase mb-6 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-(--accent) before:shadow-[0_0_6px_var(--accent)] before:shrink-0">
          Modul 01
        </div>
        <h1 className="text-[clamp(28px,4vw,36px)] font-extrabold leading-[1.15] tracking-[-0.5px] text-(--text-primary) mb-2 mt-0">
          Usability & Nutzerzentriertes Design
        </h1>
        <p className="text-[15px] font-medium leading-normal text-(--text-secondary) mb-8 mt-0 max-w-130">
          Was Usability wirklich bedeutet, wie der UCD-Prozess funktioniert und
          warum das Gestalten <em>mit</em> Nutzern – statt nur <em>für</em> sie –
          zu besseren Ergebnissen führt.
        </p>

        <ModuleMeta duration="45 Minuten" practiceTime="~20 Min." />

        <LearningGoals
          goals={[
            "Usability mit Nielsens fünf Komponenten definieren und messen können",
            "Den UCD-Prozess (Verstehen → Spezifizieren → Gestalten → Evaluieren) erklären",
            "Den Nutzungskontext als entscheidenden Designfaktor verstehen",
            "Usability-Probleme in einem Onboarding-Flow identifizieren und beheben",
          ]}
        />

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── Usability ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Kernkonzept
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Was ist Usability?
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Usability ist ein Qualitätsmerkmal eines Systems, das beschreibt, wie
          einfach es zu benutzen ist. Die klassische Definition stammt von{" "}
          <strong>Jakob Nielsen</strong>, der Usability in fünf Komponenten
          unterteilt. Ein System kann vollständig funktional sein und trotzdem
          schlechte Usability haben.{" "}
          <strong>„Es funktioniert" bedeutet nicht „Nutzer können es gut bedienen."</strong>
        </p>

        <TheoryCard label="Nielsens 5 Usability-Komponenten">
          <ConceptList>
            <ConceptItem title="Erlernbarkeit">
              Wie leicht können Nutzer grundlegende Aufgaben beim{" "}
              <strong>ersten Kontakt</strong> mit dem Design ausführen? Gutes UI
              erklärt sich selbst – kein Training nötig.
            </ConceptItem>
            <ConceptItem title="Effizienz">
              Sobald Nutzer das Design kennen: Wie{" "}
              <strong>schnell erledigen sie ihre Aufgaben</strong>? Jeder
              unnötige Klick kostet Zeit und Nerven.
            </ConceptItem>
            <ConceptItem title="Einprägsamkeit">
              Wenn Nutzer nach längerer Pause zurückkehren: Wie schnell finden
              sie wieder in die Bedienung? Gute Designs{" "}
              <strong>aktivieren mentale Modelle</strong> sofort.
            </ConceptItem>
            <ConceptItem title="Fehler">
              Wie viele Fehler machen Nutzer, wie schwerwiegend sind sie und wie
              leicht erholen sie sich? Gutes Design macht{" "}
              <strong>Fehler schwer und Erholung einfach</strong>.
            </ConceptItem>
            <ConceptItem title="Zufriedenheit">
              Wie <strong>angenehm</strong> ist die Nutzung? Ein System kann
              alle vier vorherigen Punkte erfüllen und trotzdem frustrierend
              wirken – Zufriedenheit ist das ganzheitliche Ergebnis.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        {/* Interactive Rating */}
        <UsabilityRating />

        {/* ── UCD ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Methode
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Nutzerzentriertes Design (UCD)
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Nutzerzentriertes Design ist eine Design-Philosophie und ein Prozess,
          der die Bedürfnisse, Wünsche und Grenzen der Endnutzer in den
          Mittelpunkt jeder Designentscheidung stellt. Es wurde von{" "}
          <strong>Donald Norman</strong> formalisiert.
        </p>

        <UCDCycle />

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-6">
          Deshalb passen <strong>agile Entwicklung und UCD</strong> so gut
          zusammen – beide behandeln Software als etwas, das sich durch Feedback
          weiterentwickelt. Kein Wasserfall, keine einmalige Lieferung.
        </p>

        {/* ── Context ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Schlüsselkonzept
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Nutzungskontext
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Eines der wichtigsten, aber oft übersehenen Konzepte im UX-Bereich ist
          der <strong>Nutzungskontext</strong> – die Gesamtheit der Bedingungen,
          unter denen ein Produkt verwendet wird. Ohne Kontext zu gestalten ist,
          als würde man eine Bedienungsanleitung für ein Publikum schreiben, das
          man noch nie getroffen hat.
        </p>

        <TheoryCard label="Der Kontext umfasst">
          <ConceptList>
            <ConceptItem title="Wer ist der Nutzer?">
              Kenntnisstand, Sprache, körperliche Fähigkeiten, Vertrautheit mit
              ähnlichen Werkzeugen. Ein Profi und ein Einsteiger brauchen
              völlig unterschiedliche Interfaces für dieselbe Aufgabe.
            </ConceptItem>
            <ConceptItem title="Was ist die Aufgabe?">
              Routineaufgabe oder komplex? Zeitkritisch oder entspannt?
              Fehlertolerierend (Notizapp) oder kritisch (Medizinsoftware)?
            </ConceptItem>
            <ConceptItem title="Wo wird das Produkt genutzt?">
              Büro, mobil, laute Umgebung, schlechte Beleuchtung, unterwegs.
              Ein Outdoor-Interface braucht andere Kontraste als ein
              Büroprodukt.
            </ConceptItem>
            <ConceptItem title="Mit welchen Geräten?">
              Desktop, Smartphone, nur Tastatur, Touch, schwaches Netz. Mobile
              first ist nicht nur eine Größenentscheidung – es ist eine
              Kontext-Entscheidung.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        {/* Weather App Context Example */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-3 block">
          Vergleichsbeispiel
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-3 mt-0">
          Gleiche Daten – völlig andere Designanforderungen
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Dieselbe Wetter-App – aber zwei völlig unterschiedliche Nutzungskontexte:
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            {
              title: "Pilot vor dem Flug",
              icon: "✈️",
              items: ["METAR/TAF Daten", "Wolkenuntergrenze exakt", "Windscherung, Böen", "4–6 Stunden Vorhersage", "Fehlertoleranz: niedrig"],
              accent: "var(--bad-color)",
              bg: "var(--bad-bg)",
              border: "var(--bad-border)",
            },
            {
              title: "Teenager, der fragt: Regenschirm?",
              icon: "🧑",
              items: ["Regen Ja/Nein", "Gefühlte Temperatur", "Heute und morgen reicht", "Emoji-basiert OK", "Fehlertoleranz: hoch"],
              accent: "var(--success-color)",
              bg: "var(--success-bg)",
              border: "var(--success-border)",
            },
          ].map((ctx) => (
            <div
              key={ctx.title}
              className="rounded-xl border p-4"
              style={{ background: ctx.bg, borderColor: ctx.border }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{ctx.icon}</span>
                <p className="text-[13px] font-bold text-(--text-primary)">{ctx.title}</p>
              </div>
              <ul className="space-y-1.5">
                {ctx.items.map((item) => (
                  <li key={item} className="flex items-start gap-1.5 text-[13px] text-(--text-secondary)">
                    <span className="mt-0.5 shrink-0" style={{ color: ctx.accent }}>▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <ImagePlaceholder
          aspectRatio="16/6"
          label="Pilot vs. Teenager: gleiche Daten, andere Designanforderungen"
          caption="Illustration: Gleiche Wetterdaten – völlig unterschiedliche Designentscheidungen je nach Kontext"
        />

        <RuleBox title="Kernregel">
          Ein System kann alle fünf Usability-Dimensionen technisch erfüllen und
          trotzdem scheitern – wenn der Kontext falsch verstanden wurde. Wer für
          wen, wo, wann und womit: Das ist die Grundlage jeder Designentscheidung.
        </RuleBox>

        {/* ── Practice ── */}
        <hr className="border-0 border-t border-(--bg-elevated) my-8" />
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Praxisaufgabe
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Onboarding-Flow: Usability verbessern
        </h2>

        <ExerciseBlock
          title="Onboarding-Schritt mit schlechter Usability reparieren"
          tasks={[
            "Gib dem CTA-Button eine klare Primärfarbe – er muss sofort als Handlungsaufforderung erkennbar sein",
            "Erhöhe die Zeilenhöhe der Überschrift auf mindestens 1.3 für bessere Lesbarkeit",
            "Mache die Schrittnummer visuell prominenter – dunklere Farbe, etwas größer",
            "Passe den Abstand zwischen den Optionen an, damit sie nicht zusammengequetscht wirken",
            "BONUS: Erhöhe das CTA-Padding auf 14px oben/unten für eine besser bedienbare Klickfläche",
          ]}
        >
          Unten siehst du einen Onboarding-Schritt mit mehreren Usability-Problemen:
          Der CTA-Button ist kaum erkennbar, die Schrittnummer kaum lesbar, und die
          Typografie der Überschrift ist zu eng. Analysiere die Probleme anhand der
          fünf Usability-Dimensionen und behebe sie.
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
