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
  { title: "Farbhierarchie & Aufmerksamkeitssteuerung — UX/UI Workshop" },
  { name: "description", content: "Mit Farbe gezielt den Blick lenken — Primary, Secondary, Tertiary" },
];

export function loader() {
  const moduleIndex = modules.findIndex((m) => m.slug === "color-hierarchy");
  const prevModule = moduleIndex > 0 ? modules[moduleIndex - 1] : null;
  const nextModule = moduleIndex < modules.length - 1 ? modules[moduleIndex + 1] : null;
  return { prevModule, nextModule };
}

export default function ColorHierarchyModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-(--bg-primary)">
      <div className="max-w-[1000px] mx-auto">
        {/* Title & Meta */}
        <div className=" px-4 py-12 sm:px-6">
          <Badge variant="module" dot>Modul 14</Badge>
          <h1 className="text-4xl font-bold text-(--text-primary) mt-6 mb-3">
            Farbhierarchie & Aufmerksamkeitssteuerung
          </h1>
          <p className="text-lg text-(--text-secondary) mb-8">
            Farbe ist nicht Dekoration — sie ist dein stärkstes Werkzeug, um den Blick des Nutzers zu lenken. Lerne, wie du mit Farbe eine klare visuelle Hierarchie schaffst.
          </p>
          <ModuleMeta duration="45 Min." practiceTime="~15 Min." />
        </div>

        {/* Learning Goals */}
        <div className="px-4 pb-8 sm:px-6">
          <LearningGoals
            goals={[
              "Verstehen, wie Farbe die Aufmerksamkeit des Nutzers lenkt — und wie du das gezielt einsetzt",
              "Die Hierarchie-Pyramide für Aktionen anwenden: Primary → Secondary → Tertiary",
              "Destruktive Aktionen richtig einordnen — nicht immer rot und fett",
              "Die \u201EGrauton-zuerst\u201C-Strategie kennen: Farbe sparsam und gezielt einsetzen",
              "Semantische Farbzuweisungen von dekorativen unterscheiden",
            ]}
          />
        </div>

        {/* Core Concept */}
        <div className="px-4 pb-12 sm:px-6">
          <RuleBox title="Kerngedanke">
            Wenn alles bunt ist, ist nichts wichtig. Farbe funktioniert als Aufmerksamkeitslenker nur, wenn sie sparsam und gezielt eingesetzt wird — auf einer neutralen Grundfläche.
          </RuleBox>
        </div>

        {/* Theory: Hierarchy */}
        <section className=" px-4 pb-12 sm:px-6">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Farbe als Hierarchie-Werkzeug</h2>
          <p className="text-(--text-secondary) mb-8">
            In Modul 02 hast du gelernt, dass visuelle Hierarchie über Größe, Gewicht und Kontrast funktioniert. Farbe ist dabei das <strong>mächtigste — und gefährlichste</strong> Werkzeug. Ein einziger farbiger Akzent auf einer neutralen Fläche zieht sofort den Blick an. Aber wenn alles farbig ist, verliert Farbe diese Kraft.
          </p>
          <TheoryCard label="Drei Strategien für Farbhierarchie">
            <ConceptItem title="Grauton-zuerst denken">
              Designe dein Interface zuerst komplett in Grautönen. Füge dann gezielt Farbe nur dort hinzu, wo du Aufmerksamkeit lenken willst — Primary Actions, aktive Zustände, kritische Meldungen. Was grau bleiben kann, bleibt grau.
            </ConceptItem>
            <ConceptItem title="Sättigung = Lautstärke">
              Stelle dir Sättigung wie Lautstärke vor: Ein voll gesättigter Button „schreit", ein entsättigter Border „flüstert". Nur die wichtigsten Elemente sollten „schreien" — alles andere darf leiser sein. Hintergründe, Borders und Labels bleiben entsättigt.
            </ConceptItem>
            <ConceptItem title="Fläche × Sättigung = Aufmerksamkeit">
              Ein kleiner, hochgesättigter Akzent (z.B. ein Badge) kann genauso viel Aufmerksamkeit erzeugen wie eine große, leicht getönte Fläche. Große Flächen + hohe Sättigung = visuelles Chaos. Halte große Flächen neutral und reserviere Sättigung für kleine, wichtige Elemente.
            </ConceptItem>
          </TheoryCard>
          <RuleBox className="mt-6">
            <strong>Faustregel:</strong> Je größer die Fläche, desto geringer die Sättigung. Hintergründe: 0–10% Sättigung. Borders und Labels: 20–40%. Aktive Elemente und Badges: 60–100%.
          </RuleBox>
        </section>

        {/* Example 1: Button Hierarchy */}
        <section className=" px-4 pb-12 sm:px-6">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Die Aktions-Pyramide: Primary, Secondary, Tertiary</h2>
          <p className="text-(--text-secondary) mb-8">
            Jede Aktion auf einer Seite hat einen Rang in der Wichtigkeitspyramide. Die meisten Seiten haben <strong>eine</strong> primäre Aktion, ein paar sekundäre und mehrere tertiäre. Dein Farbeinsatz muss diese Hierarchie widerspiegeln.
          </p>
          <ComparisonPanel
            bad={{
              label: "Vorher",
              children: (
                <div className="space-y-3">
                  <div className="text-xs font-mono text-(--text-tertiary) mb-2">Alle Buttons gleich gewichtet</div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-[#0ea5a0] text-white font-semibold text-sm rounded px-3 py-2">Speichern</button>
                    <button className="flex-1 bg-[#0ea5a0] text-white font-semibold text-sm rounded px-3 py-2">Vorschau</button>
                    <button className="flex-1 bg-[#0ea5a0] text-white font-semibold text-sm rounded px-3 py-2">Abbrechen</button>
                  </div>
                  <div className="text-[10px] text-(--text-tertiary) italic">Alles gleich → nichts ist wichtig</div>
                </div>
              ),
            }}
            good={{
              label: "Nachher",
              children: (
                <div className="space-y-3">
                  <div className="text-xs font-mono text-(--text-tertiary) mb-2">Klare Hierarchie durch Farbabstufung</div>
                  <div className="flex gap-2 items-center">
                    <button className="flex-1 bg-[#0ea5a0] text-white font-bold text-sm rounded px-3 py-2 shadow-md">Speichern</button>
                    <button className="flex-1 bg-transparent text-gray-600 font-semibold text-sm rounded px-3 py-2 border border-gray-300">Vorschau</button>
                    <button className="flex-1 bg-transparent text-gray-400 font-normal text-sm rounded px-3 py-2">Abbrechen</button>
                  </div>
                  <div className="text-[10px] text-(--text-tertiary) italic">Primary → Secondary → Tertiary</div>
                </div>
              ),
            }}
          />
          <div className="bg-(--bg-elevated) rounded-lg p-6 mb-6">
            <p className="text-(--text-secondary) mb-4">
              <strong>Primary:</strong> Gefüllter, farbiger Hintergrund mit hohem Kontrast — zieht sofort den Blick an. <strong>Secondary:</strong> Outline-Style oder reduzierter Hintergrund — sichtbar, aber nicht dominant. <strong>Tertiary:</strong> Reiner Text-Link-Style ohne Hintergrund oder Border — auffindbar, aber dezent.
            </p>
            <p className="text-(--text-secondary)">
              Dieses Prinzip gilt nicht nur für Buttons, sondern für <strong>alle Aktions-Elemente</strong>: Navigations-Items, Links, Icons, Tab-Selektionen.
            </p>
          </div>
          <AnnotationGrid
            items={[
              { label: "Primary", value: "Solid + Farbe" },
              { label: "Secondary", value: "Outline / Ghost" },
              { label: "Tertiary", value: "Text only" },
            ]}
          />
          <RuleBox>
            Pro Ansicht maximal eine Primary Action. Alles andere ist Secondary oder Tertiary. Wenn alles „Primary" ist, wird der Nutzer von konkurrierenden Handlungsaufforderungen überfordert.
          </RuleBox>
        </section>

        {/* Example 2: Destructive Actions */}
        <section className=" px-4 pb-12 sm:px-6">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Destruktive Aktionen richtig einordnen</h2>
          <p className="text-(--text-secondary) mb-8">
            „Löschen" = großer roter Button? Nicht unbedingt. Eine destruktive Aktion ist <strong>nicht automatisch die primäre Aktion</strong>. Die Hierarchie bestimmt den Style — nicht die Semantik allein.
          </p>
          <ComparisonPanel
            bad={{
              label: "Vorher",
              children: (
                <div className="space-y-3 bg-white rounded p-3 border border-gray-200">
                  <div className="text-sm font-bold">Projekteinstellungen</div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-[#0ea5a0] text-white font-semibold text-sm rounded px-3 py-2">Speichern</button>
                    <button className="flex-1 bg-[#dc2626] text-white font-semibold text-sm rounded px-3 py-2">Projekt löschen</button>
                  </div>
                  <div className="text-[10px] text-(--text-tertiary) italic">Zwei primäre Buttons konkurrieren</div>
                </div>
              ),
            }}
            good={{
              label: "Nachher",
              children: (
                <div className="space-y-3 bg-white rounded p-3 border border-gray-200">
                  <div className="text-sm font-bold">Projekteinstellungen</div>
                  <div className="flex justify-between items-center gap-2">
                    <button className="bg-[#0ea5a0] text-white font-semibold text-sm rounded px-3 py-2">Speichern</button>
                    <button className="text-[#dc2626] text-sm font-normal underline">Projekt löschen</button>
                  </div>
                  <div className="text-[10px] text-(--text-tertiary) italic">Löschen als Tertiary + Confirmation</div>
                </div>
              ),
            }}
          />
          <div className="bg-(--bg-elevated) rounded-lg p-6">
            <p className="text-(--text-secondary) mb-4">
              Links konkurrieren zwei visuell starke Buttons um Aufmerksamkeit — der Nutzer muss erst lesen, bevor er weiß, welchen er klicken soll. Rechts ist <strong>„Speichern" klar die primäre Aktion</strong>, und „Projekt löschen" erscheint als dezenter Text-Link. Die destruktive Semantik (rote Farbe) bleibt erhalten, aber die <strong>Hierarchie bestimmt den Stil</strong>.
            </p>
            <p className="text-(--text-secondary)">
              <strong>Tipp:</strong> Reserviere den großen roten Button für die Confirmation-Stufe — den Dialog, der erscheint, nachdem der Nutzer „Löschen" geklickt hat. Dort <em>ist</em> die destruktive Aktion die primäre Aktion.
            </p>
          </div>
          <RuleBox className="mt-6">
            Destruktive Aktionen auf einer Detailseite: Tertiary-Style. Den großen, roten, dominanten Style reservierst du für den Bestätigungsdialog, wo die destruktive Aktion tatsächlich die primäre Aktion ist.
          </RuleBox>
        </section>

        {/* Example 3: Semantic Colors */}
        <section className=" px-4 pb-12 sm:px-6">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Semantische Farbzuweisungen — weniger ist mehr</h2>
          <p className="text-(--text-secondary) mb-8">
            Semantische Farben (Rot für Fehler, Gelb für Warnung, Grün für Erfolg) sind extrem nützlich — aber nur, wenn sie <strong>konsistent und sparsam</strong> eingesetzt werden. Wenn jede zweite Komponente eine semantische Farbe trägt, verliert sie ihre Signalwirkung.
          </p>
          <ComparisonPanel
            bad={{
              label: "Vorher",
              children: (
                <div className="space-y-2">
                  <div className="text-xs font-mono text-(--text-tertiary) mb-2">Farbe überall = kein Signal</div>
                  <div className="bg-[#dcfce7] text-[#166534] rounded px-3 py-1 text-xs font-medium">✓ Profil gespeichert</div>
                  <div className="bg-[#dbeafe] text-[#1e40af] rounded px-3 py-1 text-xs font-medium">ℹ 3 neue Nachrichten</div>
                  <div className="bg-[#fef3c7] text-[#92400e] rounded px-3 py-1 text-xs font-medium">⚡ Speicher bei 75%</div>
                  <div className="bg-[#fce7f3] text-[#9d174d] rounded px-3 py-1 text-xs font-medium">♥ 2 neue Follower</div>
                  <div className="bg-[#fee2e2] text-[#991b1b] rounded px-3 py-1 text-xs font-medium">⚠ Session läuft ab</div>
                </div>
              ),
            }}
            good={{
              label: "Nachher",
              children: (
                <div className="space-y-2">
                  <div className="text-xs font-mono text-(--text-tertiary) mb-2">Nur kritische: Fehler & Warnung</div>
                  <div className="text-sm">✓ Profil gespeichert</div>
                  <div className="text-sm">ℹ 3 neue Nachrichten</div>
                  <div className="text-sm">💾 Speicher bei 75%</div>
                  <div className="text-sm">♥ 2 neue Follower</div>
                  <div className="bg-[#fee2e2] text-[#991b1b] rounded px-3 py-1 text-xs font-medium">⚠ Session läuft ab</div>
                </div>
              ),
            }}
          />
          <div className="bg-(--bg-elevated) rounded-lg p-6">
            <p className="text-(--text-secondary)">
              Links verliert semantische Farbe ihre Signalwirkung, weil zu viele Elemente eine haben. Rechts sind nur <strong>tatsächlich kritische</strong> Meldungen (Fehler, Warnung) farbig. Andere Meldungen nutzen Icons statt Farbe. Das Ergebnis: Die wenigen farbigen Elemente fallen auf und erhalten wieder ihre volle Aufmerksamkeitskraft.
            </p>
          </div>
        </section>

        {/* Practice Exercise */}
        <section className="px-4 pb-12 sm:px-6">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Farbhierarchie in einer Settings-Seite</h2>
          <p className="text-(--text-secondary) mb-8">
            Die folgende Settings-Seite behandelt alle Elemente gleich — alles ist bunt, nichts hat Vorrang. Deine Aufgabe: <strong>Schaffe eine klare Farbhierarchie</strong>, bei der der Nutzer sofort weiß, was die primäre Aktion ist.
          </p>
          <LiveEditor
            title="Aufgabenstellung"
            html={`<div style="display: flex; max-width: 600px; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; font-family: system-ui, sans-serif;">
  <div style="width: 160px; background: #1e293b; padding: 16px;">
    <div style="padding: 6px 10px; font-size: 13px; color: #0ea5a0; background: rgba(14,165,160,0.15); border-radius: 6px; margin-bottom: 4px; font-weight: 600;">Profil</div>
    <div style="padding: 6px 10px; font-size: 13px; color: #94a3b8; border-radius: 6px; margin-bottom: 4px;">Sicherheit</div>
    <div style="padding: 6px 10px; font-size: 13px; color: #94a3b8; border-radius: 6px; margin-bottom: 4px;">Benachrichtigungen</div>
    <div style="padding: 6px 10px; font-size: 13px; color: #94a3b8; border-radius: 6px;">Abrechnung</div>
  </div>
  <div style="flex: 1; background: #f8fafc; padding: 20px;">
    <h2 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700;">Profil-Einstellungen</h2>
    <div style="margin-bottom: 16px;">
      <span style="background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; display: inline-block; margin-right: 6px;">Verifiziert</span>
      <span style="background: #dbeafe; color: #1e40af; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; display: inline-block;">Pro Plan</span>
    </div>
    <div style="display: flex; gap: 8px; margin-bottom: 16px;">
      <button style="background: #0ea5a0; color: white; padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; border: none; cursor: default;">Speichern</button>
      <button style="background: #3b82f6; color: white; padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; border: none; cursor: default;">Bild ändern</button>
      <button style="background: #8b5cf6; color: white; padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; border: none; cursor: default;">Passwort</button>
    </div>
    <button style="background: #dc2626; color: white; padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; border: none; cursor: default;">Konto löschen</button>
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
