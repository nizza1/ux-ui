import { useState } from "react";
import { ArrowDown, CheckCircle2, CircleDashed } from "lucide-react";
import { SegmentedControl } from "~/components/ui/SegmentedControl";

type ExampleId = "export" | "filter" | "dark";

interface Solution {
  title: string;
  note: string;
  /** Trifft das Bedürfnis — oder bedient nur den geäußerten Wunsch */
  fits: boolean;
}

interface Example {
  id: ExampleId;
  label: string;
  request: string;
  whys: string[];
  need: string;
  solutions: Solution[];
  insight: string;
}

const EXAMPLES: Example[] = [
  {
    id: "export",
    label: "Excel-Export",
    request: "Wir brauchen einen Excel-Export für die Auswertung.",
    whys: [
      "Ich muss die Zahlen jede Woche an meine Chefin schicken.",
      "Sie will montags wissen, ob wir im Plan liegen.",
      "Sie hat keinen Zugang zum Tool — und keine Zeit, sich einzuarbeiten.",
    ],
    need: "Meine Chefin soll jeden Montag den Stand kennen, ohne dass ich etwas dafür tun muss.",
    solutions: [
      { title: "Wöchentlicher Bericht per E-Mail", note: "Kein Handgriff mehr — genau das war das Bedürfnis.", fits: true },
      { title: "Teilbarer Link zu einer Nur-Lese-Ansicht", note: "Immer aktuell, kein Zugang nötig.", fits: true },
      { title: "Excel-Export", note: "Erfüllt den Wunsch. Der wöchentliche Handgriff bleibt.", fits: false },
    ],
    insight:
      "Der Export war die Lösung, die die Person schon kannte. Gebaut hättest du ein Feature, das die eigentliche Last — jede Woche daran denken — gar nicht abnimmt.",
  },
  {
    id: "filter",
    label: "Filter-Button",
    request: "Ich möchte einen Filter-Button auf der Ersatzteil-Seite.",
    whys: [
      "Ich finde das richtige Teil nicht.",
      "Ich weiß nur, für welches Gerät ich es brauche — nicht, wie das Teil heißt.",
      "Die Liste zeigt 400 Teile, sortiert nach Artikelnummer.",
    ],
    need: "Ich will vom Gerät zum passenden Teil kommen, ohne die Bezeichnung zu kennen.",
    solutions: [
      { title: "Einstieg über das Gerät: Modell wählen, passende Teile sehen", note: "Beginnt bei dem, was die Person weiß.", fits: true },
      { title: "Suche, die Gerätenamen und Alltagsbegriffe versteht", note: "„Dichtung Spülmaschine“ statt Artikelnummer.", fits: true },
      { title: "Filter nach Teile-Kategorie", note: "Hilft nur, wer die Kategorie schon kennt.", fits: false },
    ],
    insight:
      "Ein Filter setzt voraus, dass man weiß, wonach man filtert. Es fehlte keine Funktion — der Einstieg war falsch herum gebaut.",
  },
  {
    id: "dark",
    label: "Dark Mode",
    request: "Bitte baut einen Dark Mode ein.",
    whys: [
      "Abends blendet die App.",
      "Ich nutze sie in der Nachtschicht, die Halle ist nur schwach beleuchtet.",
      "Nach ein paar Minuten am Tablet sehe ich im Dunkeln schlechter.",
    ],
    need: "Ich will bei wenig Licht arbeiten können, ohne geblendet zu werden.",
    solutions: [
      { title: "Dunkles Theme, das der Systemeinstellung folgt", note: "Hier ist der Wunsch tatsächlich die passende Lösung.", fits: true },
      { title: "Im Dunkeln auf Lesbarkeit prüfen, nicht auf Eleganz", note: "Grauer Text auf Dunkelgrau löst das Problem nicht.", fits: true },
      { title: "Große weiße Flächen auch im hellen Theme vermeiden", note: "Hilft allen, die nicht umschalten.", fits: true },
    ],
    insight:
      "Manchmal ist der Wunsch die richtige Lösung. Das Nachfragen war trotzdem nicht umsonst: Du weißt jetzt, wofür der Dark Mode da ist — und dass er in einer dunklen Halle funktionieren muss.",
  },
];

/**
 * „Warum?“-Kette: Vom geäußerten Feature-Wunsch zum Bedürfnis dahinter.
 * Jeder Klick stellt eine weitere Rückfrage; am Ende stehen das Bedürfnis
 * und mehrere Lösungen, von denen der ursprüngliche Wunsch nur eine ist.
 */
export function NeedFinder() {
  const [exampleId, setExampleId] = useState<ExampleId>("export");
  const [depth, setDepth] = useState(0);

  const example = EXAMPLES.find((item) => item.id === exampleId)!;
  const done = depth > example.whys.length;

  const selectExample = (id: ExampleId) => {
    setExampleId(id);
    setDepth(0);
  };

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl shadow-(--shadow-sm) mb-6 overflow-hidden">
      <div className="px-5 sm:px-6 py-4 border-b border-(--bg-elevated)">
        <SegmentedControl
          label="Feature-Wunsch"
          options={EXAMPLES.map((item) => ({ value: item.id, label: item.label }))}
          value={exampleId}
          onChange={selectExample}
        />
      </div>

      <div className="grid lg:grid-cols-2">
        {/* Kette */}
        <div className="p-5 sm:p-6" aria-live="polite">
          <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-2">
            Was die Person sagt
          </div>
          <p className="text-[15px] font-semibold leading-[1.5] text-(--text-primary) m-0">„{example.request}“</p>

          {example.whys.slice(0, depth).map((why) => (
            <div key={why}>
              <div className="flex items-center gap-2 my-2.5 text-(--text-ghost)">
                <ArrowDown size={14} />
                <span className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase">Warum?</span>
              </div>
              <p className="text-[14px] leading-[1.6] text-(--text-secondary) m-0">„{why}“</p>
            </div>
          ))}

          <div className="flex flex-wrap gap-2 mt-5">
            {!done && (
              <button
                type="button"
                onClick={() => setDepth((value) => value + 1)}
                className="text-[13px] font-semibold px-4 py-2 rounded-lg cursor-pointer bg-(--text-primary) text-(--bg-surface) border border-(--text-primary) hover:opacity-90 transition-opacity duration-150"
              >
                {depth < example.whys.length ? "Nachfragen: Warum?" : "Bedürfnis zeigen"}
              </button>
            )}
            {depth > 0 && (
              <button
                type="button"
                onClick={() => setDepth(0)}
                className="text-[13px] font-semibold px-3 py-2 rounded-lg cursor-pointer bg-transparent border border-(--bg-hover) text-(--text-tertiary) hover:text-(--text-primary) transition-colors duration-150"
              >
                Von vorn
              </button>
            )}
          </div>
        </div>

        {/* Ergebnis */}
        <div className="p-5 sm:p-6 bg-(--bg-base) border-t lg:border-t-0 lg:border-l border-(--bg-elevated)" aria-live="polite">
          {done ? (
            <>
              <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--accent) mb-2">
                Das Bedürfnis dahinter
              </div>
              <p className="text-[15px] font-semibold leading-[1.5] text-(--text-primary) mt-0 mb-5">{example.need}</p>

              <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-2.5">
                Mögliche Lösungen
              </div>
              <ul className="list-none p-0 m-0 flex flex-col gap-3">
                {example.solutions.map((solution) => (
                  <li key={solution.title} className="flex gap-2.5">
                    {solution.fits ? (
                      <CheckCircle2 size={17} className="shrink-0 mt-0.5 text-(--success-color)" />
                    ) : (
                      <CircleDashed size={17} className="shrink-0 mt-0.5 text-(--text-ghost)" />
                    )}
                    <div className="text-[13px] leading-[1.55]">
                      <div className="font-semibold text-(--text-primary)">{solution.title}</div>
                      <div className="text-(--text-secondary)">{solution.note}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="text-[13px] leading-[1.6] text-(--text-secondary) mt-5 mb-0 pt-4 border-t border-(--bg-elevated)">
                {example.insight}
              </p>
            </>
          ) : (
            <div className="h-full min-h-40 flex flex-col justify-center">
              <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-2">
                Noch unbekannt
              </div>
              <p className="text-[14px] leading-[1.6] text-(--text-tertiary) m-0">
                {depth === 0
                  ? "Bisher kennst du nur eine Lösung, die sich jemand ausgedacht hat. Frag nach, wozu sie gebraucht wird."
                  : `${depth} von ${example.whys.length} Rückfragen. Mit jeder Antwort wird der Wunsch weniger wichtig — und der Grund deutlicher.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
