import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { modules } from "~/data/modules";
import { ModuleNav } from "~/routes/modules.$slug";
import { TheoryCard } from "~/components/ui/TheoryCard";
import { ConceptList, ConceptItem } from "~/components/ui/ConceptList";
import { RuleBox } from "~/components/ui/RuleBox";
import { LearningGoals } from "~/components/ui/LearningGoals";
import { ModuleMeta } from "~/components/ui/ModuleMeta";
import type { PropertyControl } from "~/components/live-editor/types";

export async function loader() {
  const slug = "user-needs";
  const currentIndex = modules.findIndex((m) => m.slug === slug);
  return {
    prevModule: currentIndex > 0 ? modules[currentIndex - 1] : null,
    nextModule: currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null,
  };
}

// ── Requirements Table component ─────────────────────────────────────────────
function RequirementsTable() {
  const rows = [
    {
      need: "Ich muss die richtige Aufgabe schnell finden, ohne alle zu durchsuchen",
      functional: "Nutzer können Aufgaben nach Status, Priorität und Fälligkeit filtern",
      nonFunctional: "Filterergebnisse erscheinen in unter 200ms",
    },
    {
      need: "Ich will sicher sein, dass meine Änderungen nicht verloren gehen",
      functional: "Änderungen werden automatisch gespeichert",
      nonFunctional: "Auto-Save erfolgt spätestens 3 Sekunden nach der letzten Eingabe",
    },
    {
      need: "Ich muss auf einen Blick sehen, was heute erledigt werden muss",
      functional: "Eine Tagesansicht gruppiert alle fälligen Aufgaben nach Priorität",
      nonFunctional: "Die Ansicht lädt vollständig in unter 1 Sekunde",
    },
  ];

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl overflow-hidden mb-6">
      <div className="px-4 py-3 border-b border-(--bg-elevated)">
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent)">
          Nutzerbedürfnis → Anforderungen (Aufgabenverwaltungs-App)
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-(--bg-elevated) bg-(--bg-elevated)">
              <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-(--text-secondary) uppercase tracking-wider w-1/3">
                Nutzerbedürfnis
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-(--text-secondary) uppercase tracking-wider w-1/3">
                Funktionale Anforderung
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-(--text-secondary) uppercase tracking-wider w-1/3">
                Nicht-funktionale Anforderung
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-(--bg-elevated) last:border-0">
                <td className="px-4 py-3 text-[13px] text-(--text-secondary) leading-snug">
                  <span className="text-(--accent) mr-1">"</span>
                  {row.need}
                  <span className="text-(--accent)">"</span>
                </td>
                <td className="px-4 py-3 text-[13px] text-(--text-secondary) leading-snug">
                  {row.functional}
                </td>
                <td className="px-4 py-3 text-[13px] text-(--text-secondary) leading-snug font-mono text-[11px]">
                  {row.nonFunctional}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Story → UI Step-through component ────────────────────────────────────────
function StoryToUI() {
  const [step, setStep] = useState(0);
  const steps = [
    {
      label: "User Story",
      content: '„Als Nutzer möchte ich wissen, wann meine Bestellung bestätigt wurde, damit ich sicher bin, dass ich nicht erneut bestellen muss."',
      type: "story",
    },
    {
      label: "Benötigter Zustand",
      content: "Es muss einen Bestätigungszustand geben – etwas, das Erfolg klar kommuniziert.",
      type: "implication",
    },
    {
      label: "Komponententyp",
      content: "Kein Toast (zu flüchtig), kein Banner (zu klein) – ein vollständiger Erfolgs-Screen ist nötig.",
      type: "implication",
    },
    {
      label: "Platzierung",
      content: "Der Zustand muss unmittelbar nach der Bestellaktion erscheinen – kein Umweg, kein Scroll.",
      type: "implication",
    },
    {
      label: "Inhalt",
      content: "Klare Überschrift \"Bestellung bestätigt\" + Bestellnummer + Zusammenfassung + nächste Schritte.",
      type: "implication",
    },
    {
      label: "Ergebnis",
      content: "→ Vollbild-Erfolgsscreen mit Überschrift, Bestellzusammenfassung und Link zum Bestellverlauf.",
      type: "result",
    },
  ];

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 mb-6">
      <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-4">
        Von der User Story zum UI-Element
      </p>
      <div className="space-y-2 mb-4">
        {steps.slice(0, step + 1).map((s, i) => (
          <div
            key={i}
            className={`rounded-lg p-3 text-[13px] leading-snug transition-all duration-300 ${s.type === "story"
              ? "bg-(--accent-dim) border border-(--accent-border) text-(--text-primary) font-medium italic"
              : s.type === "result"
                ? "bg-(--success-bg) border border-(--success-border) text-(--success-color) font-semibold"
                : "bg-(--bg-elevated) text-(--text-secondary)"
              }`}
          >
            <span
              className={`font-mono text-[10px] uppercase tracking-wider font-bold block mb-0.5 ${s.type === "story" ? "text-(--accent)" : s.type === "result" ? "text-(--success-color)" : "text-(--text-ghost)"
                }`}
            >
              {s.label}
            </span>
            {s.content}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        {step < steps.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="px-4 py-2 bg-(--accent) text-white text-[13px] font-semibold rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          >
            Nächste Schlussfolgerung →
          </button>
        ) : (
          <button
            onClick={() => setStep(0)}
            className="px-4 py-2 bg-(--bg-elevated) text-(--text-secondary) text-[13px] font-semibold rounded-lg cursor-pointer hover:bg-(--bg-hover) transition-colors"
          >
            Zurücksetzen
          </button>
        )}
        <span className="font-mono text-[11px] text-(--text-ghost)">
          {step + 1} / {steps.length}
        </span>
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
<title>Bestellung bestätigt</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: system-ui, sans-serif;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 24px;
  }
  .card {
    background: white;
    border-radius: 12px;
    padding: 40px 32px;
    max-width: 440px;
    width: 100%;
    text-align: center;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  }
  /* TODO: Mache das Icon visuell prominent – es soll Erfolg kommunizieren */
  .icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    font-size: 24px;
  }
  h1 {
    font-size: 22px;
    font-weight: 700;
    color: #111;
    margin-bottom: 8px;
  }
  .subtitle {
    font-size: 14px;
    color: #666;
    margin-bottom: 24px;
    line-height: 1.5;
  }
  .order-details {
    background: #f8f8f8;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
    text-align: left;
  }
  .detail-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    padding: 4px 0;
    color: #555;
  }
  .detail-row strong { color: #111; }
  /* TODO: Mache den primären Button klar und auffällig */
  .btn-primary {
    width: 100%;
    padding: 10px;
    background: #eee;
    color: #999;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 10px;
  }
  .btn-secondary {
    width: 100%;
    padding: 8px;
    background: transparent;
    color: #666;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 13px;
    cursor: pointer;
  }
  /* BONUS: Füge eine Animation für das Icon hinzu */
</style>
</head>
<body>
  <div class="card">
    <div class="icon">✓</div>
    <h1>Bestellung bestätigt!</h1>
    <p class="subtitle">Deine Bestellung wurde erfolgreich aufgenommen.<br>Du erhältst in Kürze eine Bestätigungs-E-Mail.</p>
    <div class="order-details">
      <div class="detail-row"><span>Bestellnummer</span><strong>#2024-7821</strong></div>
      <div class="detail-row"><span>Lieferdatum</span><strong>14.–16. April</strong></div>
      <div class="detail-row"><span>Gesamtbetrag</span><strong>€ 84,90</strong></div>
    </div>
    <button class="btn-primary">Bestellung verfolgen →</button>
    <button class="btn-secondary">Weiter einkaufen</button>
  </div>
</body>
</html>`;

const EXERCISE_CONTROLS: PropertyControl[] = [
  {
    id: "icon-bg",
    property: "backgroundColor",
    label: "Icon Hintergrundfarbe",
    type: "color",
    target: ".icon",
    group: "colors",
    defaultValue: "#eeeeee",
  },
  {
    id: "icon-color",
    property: "color",
    label: "Icon Farbe",
    type: "color",
    target: ".icon",
    group: "colors",
    defaultValue: "#111111",
  },
  {
    id: "icon-size",
    property: "width",
    label: "Icon Größe",
    type: "slider",
    target: ".icon",
    group: "layout",
    defaultValue: 56,
    min: 40,
    max: 80,
    step: 4,
    unit: "px",
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
    defaultValue: "#999999",
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
    max: 20,
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
    max: 28,
    step: 4,
    unit: "px",
  },
  {
    id: "card-padding",
    property: "padding",
    label: "Karten-Padding",
    type: "slider",
    target: ".card",
    group: "spacing",
    defaultValue: 40,
    min: 24,
    max: 56,
    step: 4,
    unit: "px",
  },
  {
    id: "details-bg",
    property: "backgroundColor",
    label: "Details-Hintergrund",
    type: "color",
    target: ".order-details",
    group: "colors",
    defaultValue: "#f8f8f8",
  },
];

export default function UserNeedsModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      <div className="max-w-[1000px] mx-auto w-full px-8 py-12 flex-1">

        {/* ── Title ── */}
        <div className="inline-flex items-center gap-2 bg-(--accent-dim) border border-(--accent-border) rounded-full py-1 px-3.5 font-mono text-[11px] font-semibold text-(--accent) tracking-[1.5px] uppercase mb-6 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-(--accent) before:shadow-[0_0_6px_var(--accent)] before:shrink-0">
          Modul 02
        </div>
        <h1 className="text-[clamp(28px,4vw,36px)] font-extrabold leading-[1.15] tracking-[-0.5px] text-(--text-primary) mb-2 mt-0">
          Nutzererfordernisse, Anforderungen & User Stories
        </h1>
        <p className="text-[15px] font-medium leading-normal text-(--text-secondary) mb-8 mt-0 max-w-130">
          Nutzerbedürfnisse identifizieren, in strukturierte Anforderungen
          übersetzen und als User Stories formulieren, die echte Nutzerziele mit
          UI-Entscheidungen verbinden.
        </p>

        <ModuleMeta duration="45 Minuten" practiceTime="~20 Min." />

        <LearningGoals
          goals={[
            "Den Unterschied zwischen Nutzerwunsch und echtem Nutzerbedürfnis erklären",
            "Nutzerbedürfnisse in funktionale und nicht-funktionale Anforderungen übersetzen",
            "User Stories im Standardformat schreiben und bewerten",
            "Den Weg von einer User Story zu einem konkreten UI-Element nachvollziehen",
          ]}
        />

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── Needs ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Kernkonzept
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Nutzererfordernisse
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Nutzererfordernisse sind das, was Nutzer von einem System{" "}
          <strong>tatsächlich brauchen</strong>, um ihre realen Ziele zu
          erreichen. Sie sind <em>nicht</em> dasselbe wie das, was Nutzer
          fordern.
        </p>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Nutzer beschreiben <strong>Lösungen</strong>, keine Bedürfnisse. Die
          Aufgabe eines UX-Praktikers ist es, hinter der geforderten Funktion
          das eigentliche Bedürfnis zu finden.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-(--bad-bg) border border-(--bad-border) rounded-xl p-4">
            <p className="font-mono text-[10px] font-semibold text-(--bad-color) uppercase tracking-wider mb-2">
              Lösungs-Anfrage
            </p>
            <p className="text-[13px] text-(--text-secondary) italic leading-snug">
              „Ich möchte einen Filter-Button auf diesem Bildschirm."
            </p>
            <p className="text-[12px] text-(--text-tertiary) mt-2">
              ↳ Beschreibt eine Lösung, nicht ein Bedürfnis. Schränkt
              Designmöglichkeiten ein.
            </p>
          </div>
          <div className="bg-(--success-bg) border border-(--success-border) rounded-xl p-4">
            <p className="font-mono text-[10px] font-semibold text-(--success-color) uppercase tracking-wider mb-2">
              Nutzerbedürfnis
            </p>
            <p className="text-[13px] text-(--text-secondary) italic leading-snug">
              „Ich muss das richtige Produkt schnell finden, wenn ich schon
              ungefähr weiß, was ich suche."
            </p>
            <p className="text-[12px] text-(--text-tertiary) mt-2">
              ↳ Offen für viele Lösungen: Filter, Suche, Shortcuts, Verlauf…
            </p>
          </div>
        </div>

        {/* ── Requirements ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Methode
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Anforderungen
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Sobald du die Nutzerbedürfnisse verstehst, übersetzt du sie in
          Anforderungen – spezifische, messbare, testbare Aussagen darüber, was
          das System tun oder wie es sein muss.
        </p>

        <TheoryCard label="Zwei Typen">
          <ConceptList>
            <ConceptItem title="Funktionale Anforderungen">
              Beschreiben, <strong>was das System tut</strong>: „Nutzer können
              Suchergebnisse nach Kategorie, Preisbereich und Bewertung
              filtern." Direkt testbar: entweder vorhanden oder nicht.
            </ConceptItem>
            <ConceptItem title="Nicht-funktionale Anforderungen">
              Beschreiben, <strong>wie sich das System verhält</strong>:
              Geschwindigkeit, Zuverlässigkeit, Zugänglichkeit (WCAG AA),
              Verfügbarkeit. Oft ebenso wichtig, aber häufig vergessen.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <RequirementsTable />

        {/* ── User Stories ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Format
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          User Stories
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          User Stories sind ein Format, um Anforderungen aus der Perspektive des
          Nutzers auszudrücken. Sie stammen aus der agilen Entwicklung und sind
          die Standardbrücke zwischen User Research und Entwicklungsarbeit.
        </p>

        <div className="bg-(--bg-elevated) rounded-xl p-4 mb-4 font-mono text-[13px] text-(--text-primary)">
          <span className="text-(--text-ghost)">Als </span>
          <span className="text-(--accent) font-bold">[Nutzertyp]</span>
          <span className="text-(--text-ghost)"> möchte ich </span>
          <span className="text-(--accent) font-bold">[etwas tun]</span>
          <span className="text-(--text-ghost)">, damit </span>
          <span className="text-(--accent) font-bold">[ich ein Ziel erreiche]</span>
          <span className="text-(--text-ghost)">.</span>
        </div>

        <TheoryCard label="Gute User Stories">
          <ConceptList>
            <ConceptItem title="Als Erstbesucher…">
              …möchte ich eine klare Erklärung sehen, was dieser Dienst
              bietet, damit ich entscheiden kann, ob er für mich relevant ist.
            </ConceptItem>
            <ConceptItem title="Als wiederkehrender Nutzer…">
              …möchte ich, dass meine letzte Suche gespeichert wird, damit
              ich sie nicht jedes Mal erneut eingeben muss.
            </ConceptItem>
            <ConceptItem title="Als Administrator…">
              …möchte ich auf einen Blick eine Zusammenfassung der
              Team-Aktivitäten sehen, damit ich schnell erkennen kann, wer
              Unterstützung braucht.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-6">
          Gute User Stories konzentrieren sich auf <strong>Ergebnisse</strong>,
          nicht auf Implementierungen. Sie sagen nicht „füge ein Dropdown hinzu"
          – sie sagen, was der Nutzer <em>tun können</em> muss.
        </p>

        {/* ── Story → UI ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Schritt für Schritt
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Von der User Story zum UI-Element
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Klicke dich durch die Ableitung – von der User Story zu einem
          konkreten UI-Baustein:
        </p>

        <StoryToUI />

        <RuleBox title="Kernregel">
          Nutzer beschreiben Lösungen – deine Aufgabe ist es, das echte Bedürfnis
          dahinter zu finden. Erst das Bedürfnis verstehen, dann die Anforderung
          formulieren, dann die Story schreiben, dann das UI bauen. In dieser
          Reihenfolge – nie umgekehrt.
        </RuleBox>


      </div>

      <ModuleNav prevModule={prevModule} nextModule={nextModule} />
    </div>
  );
}
