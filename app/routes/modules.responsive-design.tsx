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
  { title: "Responsive Design — UX/UI Workshop" },
  { name: "description", content: "Responsive Design als Denkweise — Mobile-First, Breakpoints, Fluid vs. Fixed Layouts, Content-Priorisierung" },
];

export function loader() {
  const moduleIndex = modules.findIndex((m) => m.slug === "responsive-design");
  const prevModule = moduleIndex > 0 ? modules[moduleIndex - 1] : null;
  const nextModule = moduleIndex < modules.length - 1 ? modules[moduleIndex + 1] : null;
  return { prevModule, nextModule };
}

export default function ResponsiveDesignModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-(--bg-primary)">
      {/* Title & Meta */}
      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6">
        <Badge number="20" />
        <h1 className="text-4xl font-bold text-(--text-primary) mt-6 mb-3">
          Responsive Design
        </h1>
        <p className="text-lg text-(--text-secondary) mb-8">
          Responsive Design bedeutet nicht, das gleiche Layout einfach zu schrumpfen. Es bedeutet, jede Bildschirmgröße als eigenständigen Kontext zu behandeln — mit angepasster Hierarchie, Proportionen und Interaktion.
        </p>
        <ModuleMeta duration="75 Min." exerciseTime="~30 Min." />
      </div>

      {/* Learning Goals */}
      <div className="max-w-2xl mx-auto px-4 pb-8 sm:px-6">
        <LearningGoals>
          <li>Mobile-First als Designstrategie verstehen und anwenden</li>
          <li>Sinnvolle Breakpoints wählen — basierend auf Inhalten, nicht auf Geräten</li>
          <li>Fluid vs. Fixed Layouts unterscheiden und gezielt einsetzen</li>
          <li>Touch-Targets und Typografie für mobile Kontexte optimieren</li>
          <li>Content-Priorisierung: Was zeigst du wann und wo?</li>
        </LearningGoals>
      </div>

      {/* Core Concept */}
      <div className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <RuleBox title="Kerngedanke">
          Responsive Design ist eine Denkweise, nicht nur Media Queries. Nicht nur Breite ändert sich — auch Proportionen, Abstände, Schriftgrößen und Informationshierarchie müssen sich an den Kontext anpassen.
        </RuleBox>
      </div>

      {/* Theory: Responsive Design Mindset */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Responsive Design — Mehr als nur Media Queries</h2>
        <p className="text-(--text-secondary) mb-6">
          Responsive Design ist eine Denkweise, nicht nur Media Queries. Nicht nur Breite ändert sich — auch Proportionen, Abstände, Schriftgrößen, Informationshierarchie.
        </p>
        <TheoryCard title="Die 5 Säulen">
          <ConceptItem title="Mobile First">
            Beginne mit kleinster Viewport und erweitere. Mobile zwingt zu Priorisierung — was ist wirklich wichtig?
          </ConceptItem>
          <ConceptItem title="Content-basierte Breakpoints">
            Setze Breakpoints dort, wo Layout bricht — nicht bei Geräten (iPhone 6, Galaxy S10 …)
          </ConceptItem>
          <ConceptItem title="Fluid + Fixed kombinieren">
            Nicht alles muss sich proportional zur Breite verhalten. Sidebar kann fixed sein, Content fluid
          </ConceptItem>
          <ConceptItem title="Proportionen sind nicht skalierbar">
            48px zu 24px ist nicht korrekt — Verhältnisse ändern sich mit Kontext
          </ConceptItem>
          <ConceptItem title="Touch vs. Cursor">
            Touch-Targets müssen 44×44px oder 48×48dp sein (nicht 24px Buttons auf Mobile)
          </ConceptItem>
        </TheoryCard>
      </section>

      {/* Theory: Navigation */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Navigation: Desktop vs. Mobile</h2>
        <p className="text-(--text-secondary) mb-6">
          Desktop: Platz für horizontale Links. Mobile: Kompaktes Format mit wichtigsten Aktionen sichtbar.
        </p>
        <ComparisonPanel
          left={{
            title: "Desktop (Horizontal Links)",
            jsx: (
              <div className="h-48 bg-(--bg-surface) rounded-lg p-4">
                <div className="flex gap-4 items-center border-b border-(--bg-hover) pb-4 mb-4">
                  <div className="w-8 h-8 bg-(--color-primary) rounded" />
                  <div className="flex gap-3 flex-1">
                    <span className="text-sm text-(--text-secondary)">Home</span>
                    <span className="text-sm text-(--text-secondary)">Features</span>
                    <span className="text-sm text-(--text-secondary)">Docs</span>
                    <span className="text-sm text-(--text-secondary)">Blog</span>
                  </div>
                </div>
              </div>
            ),
          }}
          right={{
            title: "Mobile (Hamburger + Essential)",
            jsx: (
              <div className="h-48 bg-(--bg-surface) rounded-lg p-4">
                <div className="flex gap-4 items-center border-b border-(--bg-hover) pb-4 mb-4">
                  <div className="w-8 h-8 bg-(--color-primary) rounded" />
                  <span className="text-sm text-(--text-secondary) flex-1">Home</span>
                  <span className="text-sm text-(--text-secondary)">☰</span>
                </div>
              </div>
            ),
          }}
        />
      </section>

      {/* Theory: Touch Targets */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Touch Targets: Mobile-Größen sicherstellen</h2>
        <p className="text-(--text-secondary) mb-6">
          Desktop: 32px möglich. Mobile: Minimum 44×44px oder 48×48dp. Zu kleine Buttons führen zu Misclicks.
        </p>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-(--bg-surface) rounded-lg">
            <button className="px-4 py-2 border border-(--text-secondary) rounded text-sm">
              32px (Desktop)
            </button>
            <p className="text-sm text-(--text-secondary)">Okay für Desktop, zu klein für Touch</p>
          </div>
          <div className="flex items-center gap-4 p-4 bg-(--bg-surface) rounded-lg">
            <button className="px-6 py-3 border border-(--color-primary) rounded-lg text-(--color-primary) font-medium">
              48px (Mobile)
            </button>
            <p className="text-sm text-(--text-secondary)">Sicher für Touchscreen</p>
          </div>
        </div>
      </section>

      {/* Theory: Typography Scaling */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Typografie: Bewusste Anpassung statt Schrumpfen</h2>
        <p className="text-(--text-secondary) mb-6">
          Headlines schrumpfen nicht proportional. 48px Desktop → 24px Mobile ist falsch. Bewusste Anpassung an Kontext erforderlich.
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-(--bg-surface) rounded-lg">
            <h3 className="text-4xl font-bold text-(--text-primary) mb-2">28px Desktop</h3>
            <p className="text-sm text-(--text-secondary)">Genug Platz für große Headline</p>
          </div>
          <div className="p-4 bg-(--bg-surface) rounded-lg">
            <h3 className="text-2xl font-bold text-(--text-primary) mb-2">22px Tablet</h3>
            <p className="text-sm text-(--text-secondary)">Leicht reduziert, immer noch prominent</p>
          </div>
          <div className="p-4 bg-(--bg-surface) rounded-lg">
            <h3 className="text-xl font-bold text-(--text-primary) mb-2">18px Mobile</h3>
            <p className="text-sm text-(--text-secondary)">Bewusst angepasst, nicht willkürlich halbiert</p>
          </div>
        </div>
      </section>

      {/* Interactive: Responsive Editor */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-6">Dashboard-Karte responsiv</h2>
        <LiveEditor
          html={`<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; padding: 24px; background: #f5f5f5; border-radius: 8px; min-height: 250px;">
  <div style="background: white; padding: 16px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <div style="font-size: 12px; color: #666;">Users</div>
    <div style="font-size: 24px; font-weight: bold; color: #333; margin-top: 8px;">1,234</div>
  </div>
  <div style="background: white; padding: 16px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <div style="font-size: 12px; color: #666;">Revenue</div>
    <div style="font-size: 24px; font-weight: bold; color: #333; margin-top: 8px;">$45K</div>
  </div>
  <div style="background: white; padding: 16px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <div style="font-size: 12px; color: #666;">Growth</div>
    <div style="font-size: 24px; font-weight: bold; color: #333; margin-top: 8px;">12%</div>
  </div>
  <div style="background: white; padding: 16px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <div style="font-size: 12px; color: #666;">Traffic</div>
    <div style="font-size: 24px; font-weight: bold; color: #333; margin-top: 8px;">892K</div>
  </div>
</div>`}
        />
      </section>

      {/* Code Example */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-6">Responsive Grid mit clamp()</h2>
        <CodeBlock
          language="css"
          startCode={`/* Mobile-First Approach */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* Tablet: 2 Spalten */
@media (min-width: 640px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 4 Spalten */
@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Fluid Typography mit clamp() */
h1 {
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  /* Minimum 24px, Preferred 5% viewport width, Maximum 40px */
}

/* Responsive Padding mit clamp() */
.container {
  padding: clamp(1rem, 5%, 2rem);
}`}
        />
      </section>

      {/* Practice Task */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Praxisaufgabe: Dashboard-Karte responsiv gestalten</h2>
        <p className="text-(--text-secondary) mb-6">
          Dashboard-Karte nur für Desktop gestaltet — muss responsiv werden ohne HTML-Änderungen.
        </p>
        <div className="bg-(--bg-hover) border-l-4 border-(--accent-text) p-4 rounded">
          <ol className="text-(--text-secondary) space-y-2 list-decimal list-inside">
            <li>Erstelle mindestens zwei Breakpoints: ~768px (Tablet) und ~480px (Smartphone)</li>
            <li>Tablet: 4-spaltige Statistik → 2 Spalten</li>
            <li>Smartphone: Grid → 1 Spalte, Buttons full-width</li>
            <li>Headline-Größe anpassen: Desktop 28px → Tablet 22px → Mobile 18px</li>
            <li>Buttons mindestens 44px hoch auf Mobile</li>
            <li><strong>Bonus:</strong> clamp() für fluid Schriftgröße statt fester Breakpoints</li>
          </ol>
        </div>
      </section>

      {/* Navigation */}
      <ModuleNav prevModule={prevModule} nextModule={nextModule} />
    </div>
  );
}
