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
  { title: "Design Systems & Tokens — UX/UI Workshop" },
  { name: "description", content: "Design Tokens als Vokabeln einer gemeinsamen Sprache — Global, Alias und Component Tokens für konsistente, skalierbare Systeme" },
];

export function loader() {
  const moduleIndex = modules.findIndex((m) => m.slug === "design-tokens");
  const prevModule = moduleIndex > 0 ? modules[moduleIndex - 1] : null;
  const nextModule = moduleIndex < modules.length - 1 ? modules[moduleIndex + 1] : null;
  return { prevModule, nextModule };
}

export default function DesignTokensModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-(--bg-primary)">
      {/* Title & Meta */}
      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6">
        <Badge variant="module" dot>Modul 21</Badge>
        <h1 className="text-4xl font-bold text-(--text-primary) mt-6 mb-3">
          Design Systems & Tokens
        </h1>
        <p className="text-lg text-(--text-secondary) mb-8">
          Ein Design System ist kein starres Regelwerk — es ist eine gemeinsame Sprache zwischen Design und Entwicklung. Tokens sind die Vokabeln dieser Sprache: benannte, wiederverwendbare Werte, die Entscheidungen kodifizieren statt sie jedes Mal neu zu treffen.
        </p>
        <ModuleMeta duration="80 Min." practiceTime="~35 Min." />
      </div>

      {/* Learning Goals */}
      <div className="max-w-2xl mx-auto px-4 pb-8 sm:px-6">
        <LearningGoals
          goals={[
            "Verstehen, was ein Design System ist und warum es Konsistenz und Geschwindigkeit gleichzeitig verbessert",
            "Die drei Ebenen von Design Tokens unterscheiden: Global, Alias und Component Tokens",
            "Eine Farbpalette, Spacing-Skala und Typografie-Skala als Token-System definieren",
            "Erkennen, wann Ad-hoc-Werte ein Zeichen für ein fehlendes System sind",
            "Ein eigenes Mini-Design-System mit CSS Custom Properties aufbauen",
          ]}
        />
      </div>

      {/* Core Concept */}
      <div className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <RuleBox title="Kerngedanke">
          Ein Design System ist kein starres Regelwerk — es ist eine gemeinsame Sprache zwischen Design und Entwicklung. Tokens sind die Vokabeln: benannte, wiederverwendbare Werte, die Entscheidungen kodifizieren.
        </RuleBox>
      </div>

      {/* Theory: What is a Design System */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Was ist ein Design System?</h2>
        <p className="text-(--text-secondary) mb-6">
          Sammlung von wiederverwendbaren Komponenten, Gestaltungsregeln und dokumentierten Entscheidungen. Stellt sicher, dass Produkt konsistent aussieht — unabhängig wer daran arbeitet.
        </p>
        <TheoryCard label="Die drei Säulen eines Design Systems">
          <ConceptItem title="Design Tokens">
            Atomare Bausteine: Farben, Abstände, Schriftgrößen, Schatten, Border-Radien als benannte Variablen
          </ConceptItem>
          <ConceptItem title="Komponenten-Bibliothek">
            Fertige UI-Bausteine (Buttons, Cards, Inputs), die Tokens verwenden — spart Entwicklungszeit
          </ConceptItem>
          <ConceptItem title="Dokumentation & Richtlinien">
            Wann, wo, wie Komponenten eingesetzt werden — verhindert Missbrauch und Überformatierung
          </ConceptItem>
        </TheoryCard>
      </section>

      {/* Theory: Token Layers */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Die drei Ebenen von Design Tokens</h2>
        <p className="text-(--text-secondary) mb-6">
          Global Tokens (Was) → Alias Tokens (Wofür) → Component Tokens (Wo). Jede Ebene baut auf der vorherigen auf.
        </p>
        <TheoryCard label="Ebene 1 — Global Tokens">
          <ConceptItem title="Das WAS: Rohe Werte ohne Kontext">
            <code className="bg-(--bg-hover) px-2 py-1 rounded text-sm">--blue-500: #3b82f6</code> — Die pure Farbe
          </ConceptItem>
          <ConceptItem title="Vorteil">
            Single Source of Truth für Roharben
          </ConceptItem>
        </TheoryCard>
        <TheoryCard label="Ebene 2 — Alias Tokens">
          <ConceptItem title="Das WOFÜR: Semantische Bedeutung">
            <code className="bg-(--bg-hover) px-2 py-1 rounded text-sm">--color-primary: var(--blue-500)</code> — Was ist die Rolle dieser Farbe?
          </ConceptItem>
          <ConceptItem title="Vorteil">
            Bei Markenfarb-Wechsel nur ein Token ändern; Dark Mode funktioniert durch Umschaltung
          </ConceptItem>
        </TheoryCard>
        <TheoryCard label="Ebene 3 — Component Tokens">
          <ConceptItem title="Das WO: Komponentenspezifisch">
            <code className="bg-(--bg-hover) px-2 py-1 rounded text-sm">--btn-bg: var(--color-primary)</code> — Wo wird das Token verwendet?
          </ConceptItem>
          <ConceptItem title="Vorteil">
            Komponenten-Logik ist klar; Abhängigkeiten sind sichtbar
          </ConceptItem>
        </TheoryCard>
      </section>

      {/* Theory: Common Systems */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Token-Systeme: Die wichtigsten Kategorien</h2>
        <p className="text-(--text-secondary) mb-6">
          Nicht jedes Token braucht eine komplexe Definition — aber einige sollten immer systematisiert werden:
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-(--bg-surface) rounded-lg border border-(--bg-hover)">
            <h4 className="font-bold text-(--text-primary) mb-2">Farbsystem</h4>
            <p className="text-sm text-(--text-secondary) mb-2">Ein Farbsystem mit Stufen (100, 200, ..., 900) eliminiert „35 Shades of Blue"</p>
            <code className="text-xs bg-(--bg-hover) px-2 py-1 rounded block overflow-x-auto">--blue-100, --blue-200, ... --blue-900</code>
          </div>
          <div className="p-4 bg-(--bg-surface) rounded-lg border border-(--bg-hover)">
            <h4 className="font-bold text-(--text-primary) mb-2">Spacing-Skala</h4>
            <p className="text-sm text-(--text-secondary) mb-2">Systematische Abstände (4px, 8px, 16px, 24px, ...) statt ad-hoc Werte</p>
            <code className="text-xs bg-(--bg-hover) px-2 py-1 rounded block overflow-x-auto">--spacing-xs: 4px, --spacing-sm: 8px, --spacing-md: 16px</code>
          </div>
          <div className="p-4 bg-(--bg-surface) rounded-lg border border-(--bg-hover)">
            <h4 className="font-bold text-(--text-primary) mb-2">Typografie-Skala</h4>
            <p className="text-sm text-(--text-secondary) mb-2">Definierte Schriftgrößen (12px, 14px, 16px, 20px, ...) statt zufällige Größen</p>
            <code className="text-xs bg-(--bg-hover) px-2 py-1 rounded block overflow-x-auto">--font-size-sm: 12px, --font-size-base: 14px, --font-size-lg: 16px</code>
          </div>
          <div className="p-4 bg-(--bg-surface) rounded-lg border border-(--bg-hover)">
            <h4 className="font-bold text-(--text-primary) mb-2">Shadow System</h4>
            <p className="text-sm text-(--text-secondary) mb-2">Elevation-System (sm, md, lg, xl) für konsistente Tiefe</p>
            <code className="text-xs bg-(--bg-hover) px-2 py-1 rounded block overflow-x-auto">--shadow-md: 0 4px 6px rgba(0,0,0,0.1)</code>
          </div>
        </div>
      </section>

      {/* Theory: Dark Mode */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Theming: Dark Mode via Tokens</h2>
        <p className="text-(--text-secondary) mb-6">
          Token-basiertes Theming ermöglicht Dark Mode ohne Komponenten-CSS-Änderung. Nur Alias-Tokens müssen umgeschaltet werden.
        </p>
        <ComparisonPanel
          bad={{
            label: "Light Theme",
            children: (
              <div className="h-48 bg-white p-6 rounded-lg space-y-4">
                <div className="w-16 h-16 bg-blue-500 rounded" />
                <h3 className="text-xl font-bold text-gray-900">Light Theme</h3>
                <p className="text-sm text-gray-600">Background light, text dark</p>
              </div>
            ),
          }}
          good={{
            label: "Dark Theme (Gleiche Komponenten!)",
            children: (
              <div className="h-48 bg-gray-900 p-6 rounded-lg space-y-4">
                <div className="w-16 h-16 bg-blue-400 rounded" />
                <h3 className="text-xl font-bold text-white">Dark Theme</h3>
                <p className="text-sm text-gray-300">Background dark, text light</p>
              </div>
            ),
          }}
        />
      </section>

      {/* Interactive: Token Playground */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-6">Token Playground</h2>
        <LiveEditor
          html={`<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 24px; background: #f5f5f5; border-radius: 8px;">
  <div>
    <h3 style="font-weight: bold; margin-bottom: 12px; color: #333;">Light Theme</h3>
    <div style="background: white; padding: 16px; border-radius: 8px; color: #333;">
      <button style="background: #3b82f6; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 12px; width: 100%;">Primary Button</button>
      <div style="background: #f5f5f5; padding: 12px; border-radius: 6px; margin-bottom: 12px; color: #666;">Card content here</div>
    </div>
  </div>
  <div>
    <h3 style="font-weight: bold; margin-bottom: 12px; color: #333;">Dark Theme</h3>
    <div style="background: #1f2937; padding: 16px; border-radius: 8px; color: #f3f4f6;">
      <button style="background: #60a5fa; color: #1f2937; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 12px; width: 100%;">Primary Button</button>
      <div style="background: #374151; padding: 12px; border-radius: 6px; color: #d1d5db;">Card content here</div>
    </div>
  </div>
</div>`}
        />
      </section>

      {/* Code Example */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-6">Design Token System in CSS</h2>
        <CodeBlock
          language="css"
          code={`:root {
  /* LAYER 1: Global Tokens — Rohe Werte */
  --blue-50: #eff6ff;
  --blue-500: #3b82f6;
  --blue-900: #1e3a8a;

  /* LAYER 2: Alias Tokens — Semantisch */
  --color-primary: var(--blue-500);
  --color-primary-light: var(--blue-50);
  --color-surface: white;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;

  /* LAYER 3: Component Tokens */
  --btn-bg: var(--color-primary);
  --btn-text: white;
  --btn-padding: 12px 24px;
  --btn-border-radius: 6px;

  --card-bg: var(--color-surface);
  --card-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* Dark Mode: Nur Alias-Tokens ändern */
[data-theme="dark"] {
  --color-primary: #60a5fa;
  --color-surface: #1f2937;
  --text-primary: #f3f4f6;
  --text-secondary: #d1d5db;
}

/* Komponenten nutzen nur die höchste Ebene */
.button {
  background: var(--btn-bg);
  color: var(--btn-text);
  padding: var(--btn-padding);
  border-radius: var(--btn-border-radius);
}`}
        />
      </section>

      {/* Practice Task */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Praxisaufgabe: Token-System aufbauen</h2>
        <p className="text-(--text-secondary) mb-6">
          Kleine UI mit ausschließlich hardcoded Werten — refaktoriere zu dreistufigem Token-System.
        </p>
        <div className="bg-(--bg-hover) border-l-4 border-(--accent-text) p-4 rounded">
          <ol className="text-(--text-secondary) space-y-2 list-decimal list-inside">
            <li>Global Tokens definieren: Farbskala (3+ Stufen Primärfarbe), Spacing-Skala (4,8,16,24,32px), Schatten-Skala (sm,md,lg)</li>
            <li>Alias Tokens erstellen: --color-primary, --color-surface, --text-primary, --text-secondary, --spacing-md, --radius-md</li>
            <li>Component Tokens ableiten: Mindestens 3 für Button (--btn-bg, --btn-text, --btn-radius), 2 für Card (--card-bg, --card-shadow)</li>
            <li>Dark Mode hinzufügen: [data-theme="dark"] um Alias-Tokens umzuschalten — ohne Komponenten-CSS-Änderung</li>
            <li><strong>Reflexion:</strong> Wie viele Stellen müsstest du ändern, um Primärfarbe von Blau zu Grün zu wechseln?</li>
          </ol>
        </div>
      </section>

      {/* Navigation */}
      <ModuleNav prevModule={prevModule} nextModule={nextModule} />
    </div>
  );
}
