import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { modules } from "~/data/modules";
import { Badge } from "~/components/ui/Badge";
import { ModuleMeta } from "~/components/ui/ModuleMeta";
import { LearningGoals } from "~/components/ui/LearningGoals";
import { RuleBox } from "~/components/ui/RuleBox";
import { TheoryCard } from "~/components/ui/TheoryCard";
import { ConceptItem } from "~/components/ui/ConceptList";
import { ComparisonPanel } from "~/components/ui/ComparisonPanel";
import { CodeBlock } from "~/components/ui/CodeBlock";
import { ModuleNav } from "~/routes/modules.$slug";
import { LiveEditor } from "~/components/live-editor/LiveEditor";

export const meta: MetaFunction = () => [
  { title: "UI-Komponenten — UX/UI Workshop" },
  { name: "description", content: "Anatomie, Hierarchie und States von UI-Komponenten — Buttons, Cards und Forms als konsistentes System" },
];

export function loader() {
  const moduleIndex = modules.findIndex((m) => m.slug === "ui-components");
  const prevModule = moduleIndex > 0 ? modules[moduleIndex - 1] : null;
  const nextModule = moduleIndex < modules.length - 1 ? modules[moduleIndex + 1] : null;
  return { prevModule, nextModule };
}

export default function UIComponentsModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-(--bg-primary)">

      <div className="max-w-[1000px] mx-auto">

        {/* Title & Meta */}
        <div className=" px-4 py-12 sm:px-6">
          <Badge variant="module" dot>Modul 17</Badge>
          <h1 className="text-4xl font-bold text-(--text-primary) mt-6 mb-3">
            UI-Komponenten
          </h1>
          <p className="text-lg text-(--text-secondary) mb-8">
            Gute Komponenten entstehen nicht durch Zufall. Jeder Button, jede Card und jedes Formular-Feld folgt Regeln — zu Hierarchie, Proportionen und States. Wer diese Regeln kennt, baut konsistente UIs, ohne jede Entscheidung neu treffen zu müssen.
          </p>
          <ModuleMeta duration="70 Min." practiceTime="~30 Min." />
        </div>

        {/* Learning Goals */}
        <div className=" px-4 pb-8 sm:px-6">
          <LearningGoals
            goals={[
              "Die drei Hierarchie-Stufen von Buttons verstehen und visuell korrekt umsetzen (Primary, Secondary, Tertiary)",
              "Card-Anatomie kennen: Header, Body, Footer, Eyebrow — und wissen, wann welches Element zum Einsatz kommt",
              "Form-Felder mit klaren visuellen States gestalten (Default, Focus, Error, Disabled, Success)",
              "Konsistente Komponenten-Proportionen aufbauen: Padding, Border-Radius und Font-Size als System",
              "Interaktive States (Hover, Active, Focus) als integralen Teil des Designs begreifen, nicht als Nachgedanke",
            ]}
          />
        </div>

        {/* Core Concept */}
        <div className=" px-4 pb-12 sm:px-6">
          <RuleBox title="Kerngedanke">
            Gute Komponenten entstehen nicht durch Zufall. Jeder Button, jede Card und jedes Formular-Feld folgt Regeln — zu Hierarchie, Proportionen und States. Wer diese Regeln kennt, baut konsistente UIs.
          </RuleBox>
        </div>

        {/* Theory: Component Anatomy */}
        <section className=" px-4 pb-12 sm:px-6">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Die Anatomie guter Komponenten</h2>
          <p className="text-(--text-secondary) mb-6">
            Grundbausteine: Container (äußerer Rahmen), Content (Text, Icons, Bilder), States (Interaktion). Alle guten Komponenten folgen den gleichen Säulen.
          </p>
          <TheoryCard label="Die drei Säulen">
            <ConceptItem title="Hierarchie">
              Primary, Secondary, Tertiary Buttons. Nur eine Primary Action pro Bereich — damit weiß der Nutzer, was am wichtigsten ist.
            </ConceptItem>
            <ConceptItem title="Proportionen">
              Padding, Border-Radius, Font-Size bilden zusammenhängendes System. Nicht jeder Button bekommt eigene Maße — es gibt klare Regeln.
            </ConceptItem>
            <ConceptItem title="States">
              Hover, Focus, Active, Disabled, Error sind kein Nachgedanke — sie kommunizieren wichtiges. Jeder State sieht visuell unterschiedlich aus.
            </ConceptItem>
          </TheoryCard>
        </section>

        {/* Theory: Button Hierarchy */}
        <section className=" px-4 pb-12 sm:px-6">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Button-Hierarchie: Die drei Stufen</h2>
          <p className="text-(--text-secondary) mb-6">
            Primary, Secondary, Tertiary — drei Stufen für Klarheit. Wenn alle Buttons gleich aussehen, kann der Nutzer nicht erkennen, welche Aktion die wichtigste ist.
          </p>
          <div className="space-y-4">
            <div className="flex gap-4 items-center p-4 bg-(--bg-surface) rounded-lg">
              <button className="px-6 py-3 bg-(--color-primary) text-white rounded-lg font-medium">
                Primary
              </button>
              <p className="text-sm text-(--text-secondary)">Wichtigste Action — volle Farbe, volle Aufmerksamkeit</p>
            </div>
            <div className="flex gap-4 items-center p-4 bg-(--bg-surface) rounded-lg">
              <button className="px-6 py-3 border-2 border-(--text-secondary) text-(--text-secondary) rounded-lg font-medium">
                Secondary
              </button>
              <p className="text-sm text-(--text-secondary)">Wichtige, aber weniger prominente Action — Border statt Fill</p>
            </div>
            <div className="flex gap-4 items-center p-4 bg-(--bg-surface) rounded-lg">
              <button className="px-6 py-3 text-(--color-primary) rounded-lg font-medium">
                Tertiary
              </button>
              <p className="text-sm text-(--text-secondary)">Optionale Action — nur Text, minimale Aufmerksamkeit</p>
            </div>
          </div>
        </section>

        {/* Theory: Form States */}
        <section className=" px-4 pb-12 sm:px-6">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Formular-States: Mehr als nur ein Border</h2>
          <p className="text-(--text-secondary) mb-6">
            Default, Focus, Error, Disabled, Success — alle visuell unterscheidbar. States kommunizieren Status und Feedback dem Nutzer.
          </p>
          <TheoryCard label="Die fünf Form-Field-States">
            <ConceptItem title="Default">
              Normales Aussehen, keine Aktion vom Nutzer erwartet
            </ConceptItem>
            <ConceptItem title="Focus">
              Tastatur-Navigation oder Klick. Deutliches visuelles Feedback (border color oder outline)
            </ConceptItem>
            <ConceptItem title="Error">
              Eingabe ungültig. Rote Farbe, Error-Message darunter
            </ConceptItem>
            <ConceptItem title="Disabled">
              Feld nicht verfügbar. Reduzierte Opazität, grauer Text, Cursor: not-allowed
            </ConceptItem>
            <ConceptItem title="Success">
              Eingabe erfolgreich validiert. Grüne Farbe, optional Checkmark-Icon
            </ConceptItem>
          </TheoryCard>
        </section>

        {/* Theory: Card Anatomy */}
        <section className=" px-4 pb-12 sm:px-6">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Card-Anatomie: Struktur statt Chaos</h2>
          <p className="text-(--text-secondary) mb-6">
            Klare Leserichtung: Eyebrow → Titel → Beschreibung → Footer. Nicht jede Card braucht alle Teile, aber die Reihenfolge sollte konsistent sein.
          </p>
          <div className="bg-(--bg-surface) rounded-lg p-4 space-y-3 border border-(--bg-hover)">
            <div className="text-xs font-semibold text-(--accent-text) uppercase tracking-wide">Eyebrow</div>
            <h3 className="text-xl font-bold text-(--text-primary)">Card Titel</h3>
            <p className="text-(--text-secondary)">Beschreibung oder Content der Card — hier steht die wichtigste Info</p>
            <div className="pt-3 border-t border-(--bg-hover) flex justify-between items-center">
              <span className="text-xs text-(--text-ghost)">Footer Info</span>
              <button className="text-sm text-(--color-primary) font-medium">Action</button>
            </div>
          </div>
        </section>

        {/* Interactive: Button Builder */}
        <section className=" px-4 pb-12 sm:px-6">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-6">Button Builder</h2>
          <LiveEditor
            html={`<div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center; justify-content: center; min-height: 200px; background: #f5f5f5; border-radius: 8px; padding: 24px;">
  <button style="padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; font-size: 14px;">Primary</button>
  <button style="padding: 12px 24px; background: transparent; border: 2px solid #666; color: #666; border-radius: 8px; font-weight: 500; cursor: pointer; font-size: 14px;">Secondary</button>
  <button style="padding: 12px 24px; background: transparent; color: #3b82f6; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; font-size: 14px;">Tertiary</button>
  <button disabled style="padding: 12px 24px; background: #ccc; color: #999; border: none; border-radius: 8px; font-weight: 500; cursor: not-allowed; font-size: 14px;">Disabled</button>
</div>`}
          />
        </section>


      </div>
      {/* Navigation */}
      <ModuleNav prevModule={prevModule} nextModule={nextModule} />
    </div>
  );
}
