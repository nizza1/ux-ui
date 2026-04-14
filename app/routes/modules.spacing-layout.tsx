import { useLoaderData } from "@remix-run/react";
import { modules } from "~/data/modules";
import { ModuleNav } from "~/routes/modules.$slug";
import { RuleBox } from "~/components/ui/RuleBox";
import { TheoryCard } from "~/components/ui/TheoryCard";
import { ConceptList, ConceptItem } from "~/components/ui/ConceptList";
import { ComparisonPanel } from "~/components/ui/ComparisonPanel";
import { AnnotationGrid } from "~/components/ui/AnnotationGrid";
import { ExplanationBox } from "~/components/ui/ExplanationBox";
import { ExerciseBlock } from "~/components/ui/ExerciseBlock";
import { LearningGoals } from "~/components/ui/LearningGoals";
import { ModuleMeta } from "~/components/ui/ModuleMeta";
export async function loader() {
  const slug = "spacing-layout";
  const currentIndex = modules.findIndex((m) => m.slug === slug);
  return {
    prevModule: currentIndex > 0 ? modules[currentIndex - 1] : null,
    nextModule:
      currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null,
  };
}

const SPACING_SCALE = [
  { token: "--space-xs", px: "4px", width: 4 },
  { token: "--space-sm", px: "8px", width: 8 },
  { token: "--space-md", px: "16px", width: 16 },
  { token: "--space-lg", px: "24px", width: 24 },
  { token: "--space-xl", px: "32px", width: 32 },
  { token: "--space-2xl", px: "48px", width: 48 },
  { token: "--space-3xl", px: "64px", width: 64 },
];

export default function SpacingLayoutModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      <div className="max-w-[1000px] mx-auto w-full px-8 py-12 flex-1">

        {/* ── Title section ── */}
        <div className="inline-flex items-center gap-2 bg-(--accent-dim) border border-(--accent-border) rounded-full py-1 px-3.5 font-mono text-[11px] font-semibold text-(--accent) tracking-[1.5px] uppercase mb-6 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-(--accent) before:shadow-[0_0_6px_var(--accent)] before:shrink-0">Modul 15</div>
        <h1 className="text-[clamp(28px,4vw,36px)] font-extrabold leading-[1.15] tracking-[-0.5px] text-(--text-primary) mb-2 mt-0">Spacing &amp; Layout</h1>
        <p className="text-[15px] font-medium leading-normal text-(--text-secondary) mb-8 mt-0 max-w-130">
          Das 8px-Grid-System: Wie konsistente Abstände professionell wirkendes
          UI fast automatisch erzeugen — und warum Whitespace kein
          verschwendeter Platz ist.
        </p>

        <ModuleMeta duration="60 Minuten" practiceTime="~20 Min." />

        <LearningGoals
          goals={[
            "Das 8px-Grid-System verstehen und in CSS direkt anwenden können",
            "Den Unterschied zwischen Padding und Margin gezielt einsetzen",
            "Whitespace als aktives Gestaltungsmittel — nicht als Lücke — begreifen",
            "Mehrdeutiges Spacing erkennen und durch klare Gruppenabstände beheben",
            "Spacing Tokens als Teil eines Design Systems definieren und nutzen",
          ]}
        />

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Kerngedanke</p>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Spacing ist der unsichtbare Klebstoff jedes Interfaces. Entwickler
          denken oft: „Ich gebe dem Element einfach etwas{" "}
          <code>margin</code>." Aber ohne ein System entstehen dabei 37
          verschiedene Abstände, die nichts miteinander zu tun haben. Das
          Ergebnis fühlt sich chaotisch an — selbst wenn die einzelnen Werte
          für sich genommen gar nicht falsch wären.{" "}
          <strong>
            Konsistenz im Spacing ist wichtiger als der einzelne Wert.
          </strong>
        </p>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Das 8px-System schafft genau diese Konsistenz: Alle Abstände sind
          Vielfache von 8 (oder 4 für feinere Schritte). Das Gehirn nimmt
          diesen Rhythmus wahr, ohne ihn zu benennen — und empfindet das
          Interface als „aufgeräumt" und „professionell". Das ist kein Zufall,
          sondern angewandte Wahrnehmungspsychologie.
        </p>

        {/* ── Theory: Das 8px-Grid-System ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Theorie</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">Das 8px-Grid-System</h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Das 8px-System ist ein Spacing-Standard, der in fast allen
          professionellen Design Systems verwendet wird — von Material Design
          über Tailwind bis Ant Design. Die Idee ist simpel:{" "}
          <strong>
            alle Abstände, Größen und Positionen sind Vielfache von 8px
          </strong>{" "}
          (für feine Details auch von 4px). Statt frei gewählter Werte wie
          13px, 17px oder 22px greifst du immer aus einer vordefinierten Skala.
        </p>

        <TheoryCard label="Die Spacing-Skala">
          <ConceptList>
            <ConceptItem title="Warum ausgerechnet 8px?">
              8 lässt sich problemlos durch 2 und 4 teilen — das erzeugt halbe
              Schritte (4px) für feine Details und verhindert
              Subpixel-Rendering-Probleme. Außerdem entspricht 8px dem
              natürlichen Sehkomfort für minimale visuelle Trennung.
            </ConceptItem>
            <ConceptItem title="Exponentiell, nicht linear">
              Gute Spacing-Skalen sind nicht gleichmäßig (8, 16, 24, 32…). Sie
              wachsen mit zunehmendem Abstand schneller: 4, 8, 12, 16, 24, 32,
              48, 64. So ist der Unterschied zwischen kleinen Werten spürbar,
              ohne dass große Werte ins Unendliche driften.
            </ConceptItem>
            <ConceptItem title="Tokens statt Magic Numbers">
              In CSS werden diese Werte als Custom Properties definiert (z.B.{" "}
              <code>--space-md: 16px</code>). So gibt es keinen Grund mehr,
              einen Wert zweimal zu erfinden — und Änderungen propagieren
              automatisch überall hin.
            </ConceptItem>
            <ConceptItem title="Padding vs. Margin: die Faustregel">
              <strong>Padding</strong> gehört zum Element selbst und beeinflusst
              dessen Klickfläche und visuellen Raum. <strong>Margin</strong>{" "}
              definiert die Beziehung zwischen Elementen. Innerer Raum (Padding)
              zuerst denken, dann äußere Abstände (Margin).
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        {/* Spacing scale visual */}
        <TheoryCard label="Skala im Vergleich">
          {SPACING_SCALE.map(({ token, px, width }, i) => (
            <div
              key={token}
              className="flex items-center gap-2 mb-1.5"
              style={i === SPACING_SCALE.length - 1 ? { marginBottom: 0 } : undefined}
            >
              <div
                className="bg-(--accent) rounded-md h-3.5 shrink-0 opacity-85"
                style={{ width: `${width}px` }}
              />
              <span className="font-mono text-[10px] font-semibold text-(--accent) whitespace-nowrap min-w-22.5">{token}</span>
              <span className="font-mono text-[10px] text-(--text-ghost)">{px}</span>
            </div>
          ))}
        </TheoryCard>

        {/* ── Vergleich 1: Zu wenig Whitespace ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Vergleichsbeispiel 1 von 4</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">Zu wenig Whitespace in einer Card</h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Eines der häufigsten Muster bei Entwickler-UIs: Alles bekommt das{" "}
          <strong>minimale Padding</strong>, das nötig ist, damit es nicht
          komplett kaputt aussieht. Das Ergebnis wirkt gedrängt und klinisch.
          Dabei ist mehr Luft nicht mehr Verschwendung — es ist Struktur.
        </p>

        <ComparisonPanel
          bad={{
            label: "Vorher",
            children: (
              <div className="bg-(--bg-base) border border-(--bg-elevated) rounded-sm p-4 min-h-20 flex flex-col justify-center">
                <div
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--bg-elevated)",
                    borderRadius: "var(--radius-sm)",
                    padding: "6px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "2px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Monatlicher Umsatz
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        color: "var(--accent)",
                      }}
                    >
                      +12%
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: "2px",
                    }}
                  >
                    € 24.840
                  </div>
                  <div
                    style={{
                      height: "1px",
                      background: "var(--bg-elevated)",
                      margin: "3px 0",
                    }}
                  />
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[
                      { label: "Aufträge", value: "148", bad: false },
                      { label: "Ø Wert", value: "€ 167", bad: false },
                      { label: "Rückläufer", value: "3", bad: true },
                    ].map(({ label, value, bad }) => (
                      <div
                        key={label}
                        style={{
                          flex: 1,
                          background: "var(--bg-elevated)",
                          borderRadius: "3px",
                          padding: "4px 6px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "9px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {label}
                        </div>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: bad
                              ? "var(--bad-color)"
                              : "var(--text-primary)",
                          }}
                        >
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ),
          }}
          good={{
            label: "Nachher",
            children: (
              <div className="bg-(--bg-base) border border-(--bg-elevated) rounded-sm p-4 min-h-20 flex flex-col justify-center">
                <div
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--bg-elevated)",
                    borderRadius: "var(--radius-md)",
                    padding: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Monatlicher Umsatz
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        color: "var(--accent)",
                      }}
                    >
                      +12%
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: "12px",
                    }}
                  >
                    € 24.840
                  </div>
                  <div
                    style={{
                      height: "1px",
                      background: "var(--bg-elevated)",
                      margin: "0 0 12px 0",
                    }}
                  />
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[
                      { label: "Aufträge", value: "148", bad: false },
                      { label: "Ø Wert", value: "€ 167", bad: false },
                      { label: "Rückläufer", value: "3", bad: true },
                    ].map(({ label, value, bad }) => (
                      <div
                        key={label}
                        style={{
                          flex: 1,
                          background: "var(--bg-elevated)",
                          borderRadius: "6px",
                          padding: "8px 10px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "9px",
                            color: "var(--text-secondary)",
                            marginBottom: "3px",
                          }}
                        >
                          {label}
                        </div>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: bad
                              ? "var(--bad-color)"
                              : "var(--text-primary)",
                          }}
                        >
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ),
          }}
        />

        <AnnotationGrid
          items={[
            { label: "Card Padding", value: "6px → 16px" },
            { label: "Sub-Card Gap", value: "4px → 8px" },
            { label: "Divider Margin", value: "3px → 12px" },
          ]}
        />

        <ExplanationBox title="Analyse">
          <p>
            Im <strong>Vorher-Beispiel</strong> sind alle Abstände auf das
            absolute Minimum reduziert. Dadurch wirken die Elemente wie
            zusammengepresst — das Auge findet keine Ruhepunkte und muss sich
            orientieren, bevor es Inhalte lesen kann.
          </p>
          <p>
            Im <strong>Nachher-Beispiel</strong> folgen alle Abstände der
            Skala: 16px Card-Padding (--space-md), 8px Gap (--space-sm), 12px
            Divider-Margin. Dieser Rhythmus entsteht automatisch — der
            Entwickler muss keine Werte mehr erfinden.
          </p>
        </ExplanationBox>

        <RuleBox title="Regel">
          Starte immer mit zu viel Whitespace, dann entferne schrittweise. Es
          ist leichter, Luft zu reduzieren als nachträglich einzufügen.
        </RuleBox>

        {/* ── Vergleich 2: Mehrdeutiges Spacing ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Vergleichsbeispiel 2 von 4</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">Mehrdeutiges Spacing in Formularen</h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Wenn der Abstand zwischen einem Label und dem zugehörigen Feld
          genauso groß ist wie der Abstand zum nächsten Feld, entsteht
          Verwirrung: Gehört das Label zum Feld darüber oder darunter? Dieses
          Problem löst man nicht mit Linien oder Boxen, sondern mit Spacing.
        </p>

        <ComparisonPanel
          bad={{
            label: "Vorher — gleiche Abstände",
            children: (
              <div className="bg-(--bg-base) border border-(--bg-elevated) rounded-sm p-4 min-h-20 flex flex-col justify-center">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {[
                    { label: "Vorname", value: "Anna" },
                    { label: "Nachname", value: "Müller" },
                    { label: "E-Mail", value: "anna@example.com" },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 500,
                          color: "var(--text-secondary)",
                        }}
                      >
                        {label}
                      </span>
                      <div
                        style={{
                          background: "var(--bg-elevated)",
                          border: "1px solid var(--bg-hover)",
                          borderRadius: "var(--radius-sm)",
                          padding: "6px 10px",
                          fontSize: "12px",
                          color: "var(--text-primary)",
                        }}
                      >
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ),
          }}
          good={{
            label: "Nachher — klare Gruppen",
            children: (
              <div className="bg-(--bg-base) border border-(--bg-elevated) rounded-sm p-4 min-h-20 flex flex-col justify-center">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {[
                    { label: "Vorname", value: "Anna" },
                    { label: "Nachname", value: "Müller" },
                    { label: "E-Mail", value: "anna@example.com" },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 500,
                          color: "var(--text-secondary)",
                        }}
                      >
                        {label}
                      </span>
                      <div
                        style={{
                          background: "var(--bg-elevated)",
                          border: "1px solid var(--bg-hover)",
                          borderRadius: "var(--radius-sm)",
                          padding: "6px 10px",
                          fontSize: "12px",
                          color: "var(--text-primary)",
                        }}
                      >
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ),
          }}
        />

        <AnnotationGrid
          items={[
            { label: "Label → Feld", value: "gleich → 4px (eng)" },
            { label: "Feld → nächstes Label", value: "gleich → 16px (weit)" },
            { label: "Gestaltprinzip", value: "Gesetz der Nähe" },
          ]}
        />

        <ExplanationBox title="Analyse">
          <p>
            Im <strong>Vorher-Beispiel</strong> hat jedes Element den gleichen
            Abstand. Das Label „Passwort" ist genauso weit vom E-Mail-Feld
            entfernt wie vom Passwort-Feld — es ist unklar, wozu es gehört.
          </p>
          <p>
            Im <strong>Nachher-Beispiel</strong> ist der Abstand zwischen Label
            und zugehörigem Feld klein (4px), der Abstand zwischen Gruppen
            groß (16px). Dadurch bilden sich visuelle Einheiten — das
            Gestaltprinzip der Nähe macht die Zugehörigkeit sofort klar.
          </p>
        </ExplanationBox>

        <RuleBox title="Regel">
          Der Abstand zwischen Gruppen muss immer größer sein als der Abstand
          innerhalb einer Gruppe. Nur so entstehen klare visuelle Zusammenhänge.
        </RuleBox>

        {/* ── Praxisaufgabe ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Praxisaufgabe</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Spacing-Refactoring einer Settings-Page
        </h2>

        <ExerciseBlock
          title="Spacing-Refactoring einer Settings-Page"
          tasks={[
            "Ersetze alle willkürlichen Margin/Padding-Werte durch Token aus der Skala (--space-xs bis --space-3xl)",
            "Stelle sicher, dass Labels näher an ihrem Feld stehen als am vorherigen Element",
            "Verwende gap statt individuellem margin für Listen und Gruppen",
            "Prüfe, ob Padding innerhalb von Cards konsistent ist (z.B. immer --space-lg)",
            "Bonus: Definiere eigene Spacing-Token für wiederkehrende Patterns",
          ]}
        >
          Du bekommst eine Settings-Page mit inkonsistenten Abständen. Alle
          Werte sind willkürlich gewählt (13px, 17px, 22px…). Refactore alle
          Spacing-Werte auf die 8px-Skala.
        </ExerciseBlock>

      </div>

      <ModuleNav prevModule={prevModule} nextModule={nextModule} />
    </div>
  );
}
