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
import { AnnotationGrid } from "~/components/ui/AnnotationGrid";
import { CodeBlock } from "~/components/ui/CodeBlock";
import { ModuleNav } from "~/routes/modules.$slug";
import { LiveEditor } from "~/components/live-editor/LiveEditor";

export const meta: MetaFunction = () => [
  { title: "Farbe II: Kontrast, Accessibility & WCAG — UX/UI Workshop" },
  { name: "description", content: "Contrast Ratios verstehen und Farben zugänglich einsetzen" },
];

export function loader() {
  const moduleIndex = modules.findIndex((m) => m.slug === "color-contrast");
  const prevModule = moduleIndex > 0 ? modules[moduleIndex - 1] : null;
  const nextModule = moduleIndex < modules.length - 1 ? modules[moduleIndex + 1] : null;
  return { prevModule, nextModule };
}

export default function ColorContrastModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-(--bg-primary)">

      <div className="max-w-[1000px] mx-auto">
        {/* Title & Meta */}
        <div className=" px-4 py-12 sm:px-6">
          <Badge variant="module" dot>Modul 14</Badge>
          <h1 className="text-4xl font-bold text-(--text-primary) mt-6 mb-3">
            Farbe II: Kontrast, Accessibility & WCAG
          </h1>
          <p className="text-lg text-(--text-secondary) mb-8">
            Schöne Farben allein reichen nicht — wenn sie niemand lesen kann, sind sie wertlos. Lerne, wie du Farben zugänglich einsetzt und die WCAG-Richtlinien gezielt anwendest.
          </p>
          <ModuleMeta duration="45 Min." practiceTime="~15 Min." />
        </div>

        {/* Learning Goals */}
        <div className=" px-4 pb-8 sm:px-6">
          <LearningGoals
            goals={[
              "Das Contrast Ratio verstehen und selbst berechnen können",
              "WCAG-Stufen kennen: AA vs. AAA, Normal Text vs. Large Text",
              "Das Problem von weißem Text auf farbigem Hintergrund erkennen und lösen",
              "Farbblindheit berücksichtigen — warum Farbe nie der einzige Informationsträger sein darf",
              "Accessible Design umsetzen, ohne Kompromisse bei der Ästhetik zu machen",
            ]}
          />
        </div>

        {/* Core Concept */}
        <div className=" px-4 pb-12 sm:px-6">
          <RuleBox title="Kerngedanke">
            Accessibility ist kein Zusatzfeature, sondern Grundvoraussetzung. Wenn ~8% aller Männer eine Farbsehschwäche haben, betrifft es statistisch mindestens einen Teilnehmer in diesem Raum.
          </RuleBox>
        </div>

        {/* Theory: Contrast & WCAG */}
        <section className=" px-4 pb-12 sm:px-6">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Contrast Ratio und WCAG-Anforderungen</h2>
          <p className="text-(--text-secondary) mb-8">
            Das Contrast Ratio beschreibt das Helligkeitsverhältnis zwischen Vordergrund- und Hintergrundfarbe. Es reicht von <strong>1:1</strong> (kein Kontrast — identische Farben) bis <strong>21:1</strong> (maximaler Kontrast — Schwarz auf Weiß). Die WCAG (Web Content Accessibility Guidelines) definieren Mindestanforderungen für Lesbarkeit.
          </p>
          <TheoryCard label="WCAG 2.1 — Kontraststufen">
            <ConceptItem title="AA Normal Text — mindestens 4.5:1">
              Gilt für Text unter ~18px (oder unter 14px bold). Das ist die Mindestanforderung, die du für jeden Fließtext in deiner UI einhalten solltest — ohne Ausnahme.
            </ConceptItem>
            <ConceptItem title="AA Large Text — mindestens 3:1">
              Gilt für Text ab ~18px (oder ab 14px bold). Große Headlines dürfen etwas weniger Kontrast haben, weil sie durch ihre Größe bereits gut lesbar sind.
            </ConceptItem>
            <ConceptItem title="AAA — mindestens 7:1 (Normal) / 4.5:1 (Large)">
              Die strengste Stufe. Ideal für lange Lesetexte und medizinische/rechtliche Inhalte. Für UI-Elemente wie Buttons ist AA in der Regel ausreichend.
            </ConceptItem>
            <ConceptItem title="UI-Komponenten & Grafiken — mindestens 3:1">
              Icons, Borders, Formularfelder und andere nicht-textliche Elemente brauchen mindestens 3:1 Kontrast zum Hintergrund (WCAG 1.4.11). Oft vergessen, aber genauso wichtig.
            </ConceptItem>
          </TheoryCard>
        </section>

        {/* Interactive Contrast Checker */}
        <section className="px-4 pb-12 sm:px-6">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Contrast Checker — Live testen</h2>
          <p className="text-(--text-secondary) mb-8">
            Wähle Vordergrund- und Hintergrundfarbe und sieh sofort, ob die Kombination die WCAG-Anforderungen erfüllt. Experimentiere: Wie dunkel muss ein Teal-Hintergrund sein, damit weißer Text darauf AA besteht?
          </p>
          <LiveEditor
            title="Contrast Checker"
            html={`<div style="padding: 20px; background: var(--bg-elevated); border-radius: 12px;">
  <div style="background: #0ea5a0; padding: 24px; border-radius: 8px; margin-bottom: 16px;">
    <div style="font-size: 32px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">Aa</div>
    <div style="font-size: 13px; line-height: 1.6; color: #ffffff;">The quick brown fox jumps over the lazy dog.</div>
  </div>
  <div style="font-family: monospace; font-size: 24px; font-weight: 600; color: var(--accent); margin-bottom: 12px;">3.4:1</div>
  <div style="display: flex; gap: 8px; font-family: monospace; font-size: 11px; font-weight: 600; margin-bottom: 16px;">
    <div style="padding: 6px 10px; background: rgba(14, 165, 160, 0.15); color: var(--accent); border-radius: 4px;">AA Normal: ✗</div>
    <div style="padding: 6px 10px; background: rgba(14, 165, 160, 0.15); color: var(--accent); border-radius: 4px;">AA Large: ✓</div>
    <div style="padding: 6px 10px; background: rgba(14, 165, 160, 0.15); color: var(--accent); border-radius: 4px;">AAA: ✗</div>
  </div>
  <div style="border-top: 1px solid var(--bg-border); padding-top: 12px; font-size: 11px; line-height: 1.5; color: var(--text-tertiary);">
    <strong style="color: var(--text-secondary);">Tipp:</strong> Wenn weißer Text auf einem farbigen Hintergrund nicht genug Kontrast hat — dreh den Kontrast um! Verwende dunklen Text auf hellem Hintergrund.
  </div>
</div>`}
          />
        </section>

        {/* Example 1: Flip Contrast */}
        <section className="px-4 pb-12 sm:px-6">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Kontrast umdrehen statt verdunkeln</h2>
          <p className="text-(--text-secondary) mb-8">
            Weißer Text auf farbigem Hintergrund braucht oft einen <strong>überraschend dunklen</strong> Hintergrund, um 4.5:1 zu erreichen. Das kann zum Problem werden, wenn diese Elemente nicht das Hauptelement der Seite sein sollen — dunkle Flächen ziehen starke Aufmerksamkeit auf sich.
          </p>
          <ComparisonPanel
            bad={{
              label: "Vorher",
              children: (
                <div className="space-y-2">
                  <div className="text-xs font-mono text-(--text-tertiary) mb-3">Weißer Text auf farbigem Background</div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-[#0ea5a0] text-white font-semibold text-sm rounded flex items-center justify-center p-3 text-center">
                      Info<br /><span className="text-xs opacity-70">3.0:1 ✗</span>
                    </div>
                    <div className="flex-1 bg-[#d94f4f] text-white font-semibold text-sm rounded flex items-center justify-center p-3 text-center">
                      Fehler<br /><span className="text-xs opacity-70">3.9:1 ✗</span>
                    </div>
                    <div className="flex-1 bg-[#d97706] text-white font-semibold text-sm rounded flex items-center justify-center p-3 text-center">
                      Warnung<br /><span className="text-xs opacity-70">2.5:1 ✗</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-(--text-tertiary) italic">Keines erfüllt AA für normalen Text</div>
                </div>
              ),
            }}
            good={{
              label: "Nachher",
              children: (
                <div className="space-y-2">
                  <div className="text-xs font-mono text-(--text-tertiary) mb-3">Dunkler Text auf hellem Background</div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-[#ccfbf1] text-[#0a6e6a] font-semibold text-sm rounded flex items-center justify-center p-3 text-center border border-[rgba(14,165,160,0.2)]">
                      Info<br /><span className="text-xs opacity-70">5.2:1 ✓</span>
                    </div>
                    <div className="flex-1 bg-[#fecaca] text-[#7a2020] font-semibold text-sm rounded flex items-center justify-center p-3 text-center border border-[rgba(217,79,79,0.2)]">
                      Fehler<br /><span className="text-xs opacity-70">7.8:1 ✓</span>
                    </div>
                    <div className="flex-1 bg-[#fef3c7] text-[#92400e] font-semibold text-sm rounded flex items-center justify-center p-3 text-center border border-[rgba(217,119,6,0.2)]">
                      Warnung<br /><span className="text-xs opacity-70">6.3:1 ✓</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-(--text-tertiary) italic">Alle bestehen AA — und wirken dezenter</div>
                </div>
              ),
            }}
          />
          <div className="bg-(--bg-elevated) rounded-lg p-6 mb-6">
            <p className="text-(--text-secondary) mb-4">
              Der „Flip"-Trick: Statt den Hintergrund dunkler zu machen (was das Element visuell dominant macht), <strong>drehst du den Kontrast um</strong>. Dunkler Text auf hellem Hintergrund erreicht oft mühelos 5:1+ und wirkt gleichzeitig subtiler im Gesamtlayout. Die Farbe unterstützt den Text, ohne das Layout zu dominieren.
            </p>
          </div>
          <AnnotationGrid
            items={[
              { label: "Background", value: "Shade 50–100" },
              { label: "Text", value: "Shade 700–900" },
              { label: "Border", value: "Shade 200 (optional)" },
            ]}
          />
          <RuleBox>
            Wenn weißer Text auf farbigem Hintergrund nicht genug Kontrast hat, drehe den Kontrast um: dunkler Text (Shade 700–900) auf hellem Hintergrund (Shade 50–100).
          </RuleBox>
        </section>

        {/* Example 2: Gray on Colored Backgrounds */}
        <section className="px-4 pb-12 sm:px-6">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Kein Grau auf farbigen Hintergründen</h2>
          <p className="text-(--text-secondary) mb-8">
            De-Emphasis durch hellgrauen Text funktioniert hervorragend auf weißem Hintergrund. Auf farbigen Hintergründen sieht es aber <strong>ausgewaschen und unscharf</strong> aus. Der Grund: Du reduzierst nicht den Kontrast, sondern fügst eine fremde Farbe hinzu.
          </p>
          <ComparisonPanel
            bad={{
              label: "Vorher",
              children: (
                <>
                  <div style={{ background: "#1e3a5f", borderRadius: "8px", padding: "14px" }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>Dashboard</div>
                    <div style={{ fontSize: "11px", color: "#a0a0a0", lineHeight: "1.5" }}>Letzte Aktualisierung: vor 5 Minuten. Alle Systeme laufen normal.</div>
                  </div>
                  <div className="text-[10px] text-(--text-tertiary) mt-2">Grauer Text (#a0a0a0) auf Blau — matt, disconnected</div>
                </>
              ),
            }}
            good={{
              label: "Nachher",
              children: (
                <>
                  <div style={{ background: "#1e3a5f", borderRadius: "8px", padding: "14px" }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>Dashboard</div>
                    <div style={{ fontSize: "11px", color: "#8bb8d9", lineHeight: "1.5" }}>Letzte Aktualisierung: vor 5 Minuten. Alle Systeme laufen normal.</div>
                  </div>
                  <div className="text-[10px] text-(--text-tertiary) mt-2">Heller Blauton (#8bb8d9) — gleicher Hue, harmonisch</div>
                </>
              ),
            }}
          />
          <div className="bg-(--bg-elevated) rounded-lg p-6 mt-8">
            <p className="text-(--text-secondary)">
              Links wird grauer Text (#a0a0a0) auf blauem Hintergrund verwendet. Das Grau hat <strong>keinen Bezug zum Hintergrund</strong> — es wirkt wie ein Fremdkörper. Rechts wird ein heller Blauton gewählt, der <strong>den gleichen Hue wie der Hintergrund</strong> hat, nur mit höherer Lightness. Das Ergebnis: harmonisch, lesbar und visuell zusammengehörig.
            </p>
          </div>
          <RuleBox className="mt-8">
            Verwende auf farbigen Hintergründen nie Grautöne für sekundären Text. Wähle stattdessen eine hellere Variante der Hintergrundfarbe — gleicher Hue, höhere Lightness.
          </RuleBox>
        </section>

        {/* Practice Exercise */}
        <section className="px-4 pb-12 sm:px-6">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Accessibility-Audit einer Karte</h2>
          <p className="text-(--text-secondary) mb-8">
            Die folgende Profilkarte hat mehrere Accessibility-Probleme: mangelnder Kontrast, Farbe als einziger Informationsträger und grauen Text auf farbigem Hintergrund. Deine Aufgabe: <strong>Finde und behebe alle Probleme</strong>, ohne das grundlegende Design zu verändern.
          </p>
          <LiveEditor
            title="Aufgabenstellung"
            html={`<div style="max-width: 360px; border-radius: 12px; overflow: hidden; font-family: system-ui, sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  <div style="background: #4a90d9; padding: 24px; text-align: center;">
    <div style="font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 2px;">Maria Lehmann</div>
    <div style="font-size: 13px; color: #a0a0a0;">Senior Frontend Developer</div>
  </div>
  <div style="background: #f8f8f8; padding: 16px;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; color: #666;">
      <div style="display: flex; align-items: center; gap: 6px;">
        <span style="width: 8px; height: 8px; border-radius: 50%; background: #22c55e;"></span> Online
      </div>
      <div style="display: flex; align-items: center; gap: 6px;">
        <span style="width: 8px; height: 8px; border-radius: 50%; background: #ef4444;"></span> 3 Tasks überfällig
      </div>
    </div>
    <div style="display: flex; gap: 6px;">
      <span style="padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; background: #e0e7ff; color: #6366f1;">React</span>
      <span style="padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; background: #fce7f3; color: #ec4899;">TypeScript</span>
      <span style="padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; background: #d1fae5; color: #10b981;">CSS</span>
    </div>
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
