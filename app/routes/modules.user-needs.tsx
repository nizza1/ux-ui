import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { modules } from "~/data/modules";
import { ModuleNav } from "~/routes/modules.$slug";
import { TheoryCard } from "~/components/ui/TheoryCard";
import { ConceptList, ConceptItem } from "~/components/ui/ConceptList";
import { RuleBox } from "~/components/ui/RuleBox";
import { LearningGoals } from "~/components/ui/LearningGoals";
import { BuildsOn } from "~/components/ui/BuildsOn";
import { ModuleMeta } from "~/components/ui/ModuleMeta";

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
          Nutzerbedürfnisse & User Stories
        </h1>
        <p className="text-[15px] font-medium leading-normal text-(--text-secondary) mb-8 mt-0 max-w-130">
          Was Nutzer wirklich brauchen, deckt sich selten mit dem, was sie verlangen.
          In diesem Modul lernst du, echte Nutzerbedürfnisse zu erkennen, sie in
          klare Anforderungen zu übersetzen und als User Stories zu formulieren —
          die direkte Brücke zwischen Research und UI-Entscheidung.
        </p>

        <ModuleMeta duration="45 Minuten" practiceTime="~20 Min." />

        <BuildsOn modules={"01"} />
        <LearningGoals
          goals={[
            "Den Unterschied zwischen einer Lösungs-Anfrage und einem echten Nutzerbedürfnis erklären können",
            "Nutzerbedürfnisse in funktionale und nicht-funktionale Anforderungen übersetzen",
            "User Stories im Standardformat formulieren, bewerten und vergleichen",
            "Den Weg von einer User Story zu einem konkreten UI-Element Schritt für Schritt nachvollziehen",
            "Verstehen, warum User Stories auf Ergebnisse zielen — nicht auf Implementierungen",
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
        {/*  <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Nutzererfordernisse sind das, was Nutzer von einem System{" "}
          <strong>tatsächlich brauchen</strong>, um ihre realen Ziele zu
          erreichen. Sie sind <em>nicht</em> dasselbe wie das, was Nutzer
          fordern.
        </p>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Nutzer beschreiben <strong>Lösungen</strong>, keine Bedürfnisse. Die
          Aufgabe eines UX-Praktikers ist es, hinter der geforderten Funktion
          das eigentliche Bedürfnis zu finden.
        </p> */}
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">Nutzerbedürfnisse sind das, was Menschen von einem System wirklich brauchen,
          um ihre Ziele zu erreichen — nicht das, was sie explizit verlangen.
          Nutzer beschreiben <strong>Lösungen</strong>. Deine Aufgabe ist es, dahinter das eigentliche
          Bedürfnis zu finden.</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-(--bad-bg) border border-(--bad-border) rounded-xl p-4">
            <p className="font-mono text-[10px] font-semibold text-(--bad-color) uppercase tracking-wider mb-2">
              Lösungs-Anfrage
            </p>
            <p className="text-[13px] text-(--text-secondary) italic leading-snug">
              „Ich möchte einen Filter-Button auf diesem Bildschirm."
            </p>
            <p className="text-[12px] text-(--text-tertiary) mt-2">
              ↳ Beschreibt eine Lösung, nicht ein Bedürfnis.
              Schränkt den Designraum unnötig ein.
            </p>
          </div>
          <div className="bg-(--success-bg) border border-(--success-border) rounded-xl p-4">
            <p className="font-mono text-[10px] font-semibold text-(--success-color) uppercase tracking-wider mb-2">
              Nutzerbedürfnis
            </p>
            <p className="text-[13px] text-(--text-secondary) italic leading-snug">
              „Ich muss das richtige Produkt schnell finden —
              auch wenn ich nur ungefähr weiß, was ich suche."
            </p>
            <p className="text-[12px] text-(--text-tertiary) mt-2">
              ↳ Offen für viele Lösungen: Suche, Filter,
              Verlauf, Shortcuts, Empfehlungen…
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
          Wenn du das Nutzerbedürfnis verstanden hast, übersetzt du es in Anforderungen —
          spezifische, messbare und testbare Aussagen darüber, was das System tun
          oder wie es sich verhalten soll.
        </p>

        <TheoryCard label="Zwei Typen">
          <ConceptList>
            <ConceptItem title="Funktionale Anforderungen">
              Beschreiben, <strong>was das System tut</strong>: „Nutzer können Suchergebnisse nach
              Kategorie, Preis und Bewertung filtern." Direkt testbar —
              entweder vorhanden oder nicht.
            </ConceptItem>
            <ConceptItem title="Nicht-funktionale Anforderungen">
              Beschreiben, <strong>wie sich das System verhält</strong>:
              Geschwindigkeit, Zuverlässigkeit,
              Barrierefreiheit (WCAG AA), Stabilität. Oft genauso entscheidend —
              aber häufig vergessen oder zu spät bedacht.
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
          User Stories sind ein Format aus der agilen Entwicklung, das Anforderungen
          aus der Perspektive des Nutzers formuliert. Sie sind die Standardbrücke
          zwischen User Research und Entwicklungsarbeit — und halten das Team
          fokussiert auf echte Nutzerziele statt auf technische Details.
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
          Gute User Stories zielen auf <strong>Ergebnisse</strong>,
          nicht auf Implementierungen. Sie beschreiben nicht „füge ein Dropdown hinzu"
          – sondern was der Nutzer
          tun können muss und warum. Die Lösung bleibt offen.
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
