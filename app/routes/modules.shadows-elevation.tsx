import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
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
  { title: "Schatten, Tiefe & Elevation — UX/UI Workshop" },
  { name: "description", content: "Schatten als Kommunikationswerkzeug — Elevation-Systeme, Zwei-Schatten-Technik und Depth ohne Schatten" },
];

export function loader() {
  const moduleIndex = modules.findIndex((m) => m.slug === "shadows-elevation");
  const prevModule = moduleIndex > 0 ? modules[moduleIndex - 1] : null;
  const nextModule = moduleIndex < modules.length - 1 ? modules[moduleIndex + 1] : null;
  return { prevModule, nextModule };
}

export default function ShadowsElevationModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-(--bg-primary)">
      {/* Title & Meta */}
      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6">
        <Badge number="17" />
        <h1 className="text-4xl font-bold text-(--text-primary) mt-6 mb-3">
          Schatten, Tiefe & Elevation
        </h1>
        <p className="text-lg text-(--text-secondary) mb-8">
          Schatten sind keine Dekoration — sie sind ein Kommunikationswerkzeug. Ein gut gewählter Schatten sagt dem Nutzer: „Dieses Element ist interaktiv", „Diese Karte schwebt über dem Hintergrund" oder „Dieser Dialog braucht deine volle Aufmerksamkeit."
        </p>
        <ModuleMeta duration="50 Min." exerciseTime="~25 Min." />
      </div>

      {/* Learning Goals */}
      <div className="max-w-2xl mx-auto px-4 pb-8 sm:px-6">
        <LearningGoals>
          <li>Verstehen, warum Schatten mehr als Dekoration sind — sie kommunizieren Elevation und Hierarchie</li>
          <li>Die Lichtquellen-Metapher als Grundprinzip für glaubwürdige Schatten verinnerlichen</li>
          <li>Ein Elevation-System mit 5 Stufen aufbauen und gezielt einsetzen</li>
          <li>Zwei-Schatten-Technik (Ambient + Direct Light) anwenden</li>
          <li>Tiefe auch ohne Schatten erzeugen — mit Farbe, Overlap und Solid Shadows</li>
        </LearningGoals>
      </div>

      {/* Core Concept */}
      <div className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <RuleBox title="Kerngedanke">
          Schatten sind keine Dekoration — sie sind ein Kommunikationswerkzeug. Ein gut gewählter Schatten sagt dem Nutzer: „Dieses Element ist interaktiv", „Diese Karte schwebt über dem Hintergrund" oder „Dieser Dialog braucht deine volle Aufmerksamkeit."
        </RuleBox>
      </div>

      {/* Theory: Light Source */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Licht kommt von oben — die Grundregel</h2>
        <p className="text-(--text-secondary) mb-6">
          Im echten Leben erzeugen Objekte Schatten, weil eine Lichtquelle von oben scheint. Erhabene Elemente haben helle Oberkanten und werfen Schatten nach unten. Ein vertikaler Offset nach unten wirkt natürlicher als symmetrischer Schatten.
        </p>
        <TheoryCard title="Die Elevation-Pyramide (5-Level System)">
          <ConceptItem title="Level 1: Subtle Raise">
            Sehr kleiner Schatten für Buttons und Karten im Ruhezustand (1–2px Offset)
          </ConceptItem>
          <ConceptItem title="Level 2: Card Elevation">
            Standard für Karten und schwebende Panels
          </ConceptItem>
          <ConceptItem title="Level 3: Dropdown/Popover">
            Für Elemente die temporär über dem UI schweben
          </ConceptItem>
          <ConceptItem title="Level 4: Dialog/Drawer">
            Für modale Dialoge und Seitenschubladen
          </ConceptItem>
          <ConceptItem title="Level 5: Maximum Elevation">
            Sehr großer Blur-Radius für absolute Aufmerksamkeit
          </ConceptItem>
        </TheoryCard>
      </section>

      {/* Theory: Ein vs. Zwei Schatten */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Ein Schatten vs. Zwei-Schatten-Technik</h2>
        <p className="text-(--text-secondary) mb-6">
          Professionelle Schatten bestehen aus zwei Layern: großer weicher Schatten (direktes Licht) + kleiner scharferer Schatten (Ambient Occlusion). Die Zwei-Schatten-Variante erzeugt realistischeren Eindruck.
        </p>
        <ComparisonPanel
          left={{
            title: "Ein Schatten (unrealistisch)",
            jsx: (
              <div className="flex items-center justify-center h-48 bg-(--bg-surface)">
                <div className="w-32 h-32 bg-(--color-primary) rounded-lg shadow-lg"></div>
              </div>
            ),
          }}
          right={{
            title: "Zwei-Schatten-Technik (professionell)",
            jsx: (
              <div className="flex items-center justify-center h-48 bg-(--bg-surface)">
                <div
                  className="w-32 h-32 bg-(--color-primary) rounded-lg"
                  style={{
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.2)",
                  }}
                ></div>
              </div>
            ),
          }}
        />
      </section>

      {/* Theory: Colored Shadows */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Schwarze Schatten vs. farbige Schatten</h2>
        <p className="text-(--text-secondary) mb-6">
          Standard-Schatten mit rgba(0,0,0,...) sind universell, wirken aber manchmal stumpf. Farbige Schatten basierend auf Hintergrund- oder Akzentfarbe erzeugen lebendigeres, harmonischeres Gesamtbild.
        </p>
        <ComparisonPanel
          left={{
            title: "Schwarzer Schatten (Standard)",
            jsx: (
              <div className="flex items-center justify-center h-48 bg-(--bg-surface)">
                <button className="px-6 py-3 bg-(--color-primary) text-white rounded-lg shadow-md">
                  Click Me
                </button>
              </div>
            ),
          }}
          right={{
            title: "Farbiger Schatten (Harmonisch)",
            jsx: (
              <div className="flex items-center justify-center h-48 bg-(--bg-surface)">
                <button
                  className="px-6 py-3 bg-(--color-primary) text-white rounded-lg"
                  style={{
                    boxShadow: "0 10px 20px rgba(59, 130, 246, 0.3)",
                  }}
                >
                  Click Me
                </button>
              </div>
            ),
          }}
        />
      </section>

      {/* Theory: Depth without Shadow */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Tiefe auch ohne Schatten — Flat Depth</h2>
        <p className="text-(--text-secondary) mb-6">
          Flat Design bedeutet nicht „keine Tiefe". Du kannst Tiefe mit Farbe, Solid Shadows und Overlap erzeugen. Regel: Heller als Hintergrund = erhaben. Dunkler als Hintergrund = eingelassen.
        </p>
        <TheoryCard title="Techniken für Tiefe ohne Weichschatten">
          <ConceptItem title="Farbe (Heller = Erhaben)">
            Heller als BG erhabene Elemente, dunkler = eingelassen
          </ConceptItem>
          <ConceptItem title="Solid Shadows (Harte Kante)">
            Scharfer Schatten ohne Blur erzeugt technisches, subtiles Gefühl
          </ConceptItem>
          <ConceptItem title="Overlap">
            Überlagernde Elemente ohne Schatten wirken tiefenhaft durch Sichtbarkeit
          </ConceptItem>
        </TheoryCard>
      </section>

      {/* Interactive: LiveEditor */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-6">Shadow Playground</h2>
        <LiveEditor
          html={`<div style="display: flex; gap: 24px; align-items: center; justify-content: center; min-height: 300px; background: #f5f5f5; border-radius: 8px; padding: 24px;">
  <div style="width: 120px; height: 120px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);"></div>
  <div style="width: 120px; height: 120px; background: white; border-radius: 8px; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.2);"></div>
  <div style="width: 120px; height: 120px; background: white; border-radius: 8px; box-shadow: 0 20px 30px rgba(0, 0, 0, 0.15);"></div>
</div>`}
        />
      </section>

      {/* Code Example */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-6">CSS Elevation System</h2>
        <CodeBlock
          language="css"
          startCode={`:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.card {
  box-shadow: var(--shadow-md);
  border-radius: 8px;
  background: white;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transition: box-shadow 200ms ease-out;
}`}
        />
      </section>

      {/* Practice Task */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Praxisaufgabe: Elevation-System anwenden</h2>
        <p className="text-(--text-secondary) mb-6">
          Ein flaches Interface ohne Schatten erhält ein konsistentes Elevation-System.
        </p>
        <div className="bg-(--bg-hover) border-l-4 border-(--accent-text) p-4 rounded">
          <ol className="text-(--text-secondary) space-y-2 list-decimal list-inside">
            <li>Erstelle 5-stufiges Shadow-System als CSS Custom Properties</li>
            <li>Weise jeder Karte einen angemessenen Schatten zu (Level 1 oder 2)</li>
            <li>Gib dem Button einen farbigen Schatten basierend auf seiner Hintergrundfarbe</li>
            <li>Füge dem Dropdown-Menü einen Level-3-Schatten hinzu</li>
            <li>Nutze Zwei-Schatten-Technik für mindestens ein Element</li>
            <li><strong>Bonus:</strong> Hover-Transition, die den Schatten beim Hovern verstärkt</li>
          </ol>
        </div>
      </section>

      {/* Navigation */}
      <ModuleNav prevModule={prevModule} nextModule={nextModule} />
    </div>
  );
}
