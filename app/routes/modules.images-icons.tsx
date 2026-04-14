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
  { title: "Bilder & Icons — UX/UI Workshop" },
  { name: "description", content: "Icons und Bilder als Kommunikationswerkzeuge — Vektor vs. Raster, Stroke vs. Fill, Text-Overlays" },
];

export function loader() {
  const moduleIndex = modules.findIndex((m) => m.slug === "images-icons");
  const prevModule = moduleIndex > 0 ? modules[moduleIndex - 1] : null;
  const nextModule = moduleIndex < modules.length - 1 ? modules[moduleIndex + 1] : null;
  return { prevModule, nextModule };
}

export default function ImagesIconsModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-(--bg-primary)">
      <div className="max-w-[1000px] mx-auto">
        {/* Title & Meta */}
        <div className="px-4 py-12 sm:px-6">
          <Badge variant="module" dot>Modul 18</Badge>
          <h1 className="text-4xl font-bold text-(--text-primary) mt-6 mb-3">
            Bilder & Icons
          </h1>
          <p className="text-lg text-(--text-secondary) mb-8">
            Icons und Bilder sind keine Dekoration — sie sind Kommunikationswerkzeuge. Ein konsistentes Icon-Set und richtig eingebundene Bilder machen den Unterschied zwischen „zusammengeklickt" und „durchdacht designed".
          </p>
          <ModuleMeta duration="60 Min." practiceTime="~25 Min." />
        </div>

        {/* Learning Goals */}
        <div className="px-4 pb-8 sm:px-6">
          <LearningGoals
            goals={[
              "Vektor (SVG) vs. Pixel (PNG/JPG/WebP) — wann du welches Format einsetzt",
              "Stroke- vs. Fill-Icons: Stil wählen, konsistent bleiben, Stroke-Width richtig skalieren",
              "Icons korrekt mit Text pairen: Größe, Farbe und Gewichtung ausbalancieren",
              "Bilder layoutsicher einbinden: object-fit, aspect-ratio, Background-Bleed-Schutz",
              "Text auf Bildern lesbar machen: Gradient-Overlays und alternative Techniken",
            ]}
          />
        </div>

        {/* Core Concept */}
        <div className=" px-4 pb-12 sm:px-6">
          <RuleBox title="Kerngedanke">
            Icons und Bilder sind keine Dekoration — sie sind Kommunikationswerkzeuge. Ein konsistentes Icon-Set und richtig eingebundene Bilder machen den Unterschied zwischen „zusammengeklickt" und „durchdacht designed".
          </RuleBox>
        </div>

        {/* Theory: Vector vs. Raster */}
        <section className="px-4 pb-12 sm:px-6">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Vektor vs. Pixel — Grundregeln</h2>
          <p className="text-(--text-secondary) mb-6">
            SVG für alles Gezeichnete: Icons, Logos, Illustrationen — skaliert verlustfrei. WebP/JPG für Fotos (beste Kompression), PNG nur bei Transparenz-Bedarf.
          </p>
          <TheoryCard label="Die 6 Grundregeln">
            <ConceptItem title="SVG für Icons & Logos">
              Skaliert verlustfrei auf jede Größe, kleinste Dateigrößen
            </ConceptItem>
            <ConceptItem title="WebP/JPG für Fotos">
              Beste Kompression für Bilder, modernes Format
            </ConceptItem>
            <ConceptItem title="PNG nur für Transparenz">
              Größere Dateigrößen, nutze nur wenn Transparenz nötig ist
            </ConceptItem>
            <ConceptItem title="Stroke-Icons">
              Leicht und modern, bestehen aus offenen Linien, ideal neben Text
            </ConceptItem>
            <ConceptItem title="Fill-Icons">
              Schwer und auffällig, ideal für aktive Zustände und alleinstehende Icons
            </ConceptItem>
            <ConceptItem title="object-fit ist dein bester Freund">
              User-Bilder haben unvorhersehbare Proportionen — feste Container + object-fit lösen das
            </ConceptItem>
          </TheoryCard>
        </section>

        {/* Theory: Stroke vs. Fill */}
        <section className=" px-4 pb-12 sm:px-6">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Stroke vs. Fill: Konsistenz bewahren</h2>
          <p className="text-(--text-secondary) mb-6">
            Im selben UI-Bereich einen Stil wählen und durchhalten. Der einzige akzeptable Mix: aktiv/inaktiv-Zustände.
          </p>
          <ComparisonPanel
            bad={{
              label: "Stroke Icons (Modern, Leicht)",
              children: (
                <div className="flex items-center justify-center h-48 bg-(--bg-surface) gap-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
              ),
            }}
            good={{
              label: "Fill Icons (Solid, Auffällig)",
              children: (
                <div className="flex items-center justify-center h-48 bg-(--bg-surface) gap-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                  </svg>
                </div>
              ),
            }}
          />
        </section>

        {/* Theory: Icon-Text Pairing */}
        <section className=" px-4 pb-12 sm:px-6">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Icon-Text Pairing</h2>
          <p className="text-(--text-secondary) mb-6">
            Icons korrekt mit Text pairen: Größe, Farbe und Gewichtung ausbalancieren. Icon-Größe und Font-Size sollten harmonieren.
          </p>
          <div className="space-y-4">
            <div className="flex gap-3 items-center p-4 bg-(--bg-surface) rounded-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-(--color-primary)">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="text-sm">Icon korrekt mit Text gepairt</span>
            </div>
            <div className="flex gap-3 items-center p-4 bg-(--bg-surface) rounded-lg">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-(--color-primary)">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="text-sm">Icon zu groß — wirkt unausgewogen</span>
            </div>
          </div>
        </section>

        {/* Theory: Images & object-fit */}
        <section className=" px-4 pb-12 sm:px-6">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Bilder: object-fit rettet dein Layout</h2>
          <p className="text-(--text-secondary) mb-6">
            Feste Container + object-fit: cover verhindert Layout-Brüche. aspect-ratio sichert Proportionen auch bei unterschiedlichen Bildformaten.
          </p>
          <ComparisonPanel
            bad={{
              label: "Ohne object-fit (Layout bricht)",
              children: (
                <div className="h-48 bg-(--bg-surface) flex items-center justify-center">
                  <div className="w-full h-32 bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white text-sm">
                    Bild verzerrtes Seitenverhältnis
                  </div>
                </div>
              ),
            }}
            good={{
              label: "Mit object-fit: cover (sicher)",
              children: (
                <div className="h-48 bg-(--bg-surface) flex items-center justify-center">
                  <div className="w-full h-32 bg-gradient-to-r from-blue-400 to-purple-400 object-cover flex items-center justify-center text-white text-sm">
                    Bild perfekt ausgefüllt
                  </div>
                </div>
              ),
            }}
          />
        </section>

        {/* Theory: Text on Images */}
        <section className=" px-4 pb-12 sm:px-6">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Text auf Bildern: Kontrast sicherstellen</h2>
          <p className="text-(--text-secondary) mb-6">
            Bilder sind dynamisch — weißer Text auf hellem Bereich verschwindet. Gradient-Overlays sichern konsistenten Kontrast.
          </p>
          <ComparisonPanel
            bad={{
              label: "Ohne Overlay (unleserlich)",
              children: (
                <div className="relative h-48 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-end justify-start p-4">
                  <h3 className="text-white font-bold">Headline über hellem Bild</h3>
                </div>
              ),
            }}
            good={{
              label: "Mit Gradient-Overlay (lesbar)",
              children: (
                <div
                  className="relative h-48 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-end justify-start p-4"
                  style={{
                    backgroundImage: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.5))",
                  }}
                >
                  <h3 className="text-white font-bold">Headline lesbar über Bild</h3>
                </div>
              ),
            }}
          />
        </section>

        {/* Interactive: Icon Playground */}
        <section className=" px-4 pb-12 sm:px-6">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-6">Icon Playground</h2>
          <LiveEditor
            html={`<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; align-items: center; justify-items: center; min-height: 200px; background: #f5f5f5; border-radius: 8px; padding: 24px;">
  <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
    </svg>
    <span style="font-size: 12px; color: #666;">24px Stroke</span>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
    </svg>
    <span style="font-size: 12px; color: #666;">32px Stroke</span>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10"></circle>
    </svg>
    <span style="font-size: 12px; color: #666;">48px Fill</span>
  </div>
</div>`}
          />
        </section>


      </div>

      {/* Navigation */}
      <ModuleNav prevModule={prevModule} nextModule={nextModule} />
    </div>
  );
}
