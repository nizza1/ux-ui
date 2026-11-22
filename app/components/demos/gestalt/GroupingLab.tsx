import { useEffect, useState } from "react";
import { SegmentedControl } from "~/components/ui/SegmentedControl";

type Axis = "off" | "rows" | "cols";
type PrincipleId = "proximity" | "similarity" | "region" | "connected" | "fate";
type Settings = Record<PrincipleId, Axis>;

interface Principle {
  id: PrincipleId;
  name: string;
  /** Faustregel für die Stärke, abgeleitet aus Palmer (1992), Palmer & Rock (1994) u. a. — keine Messung */
  weight: number;
  css: string;
  offLabel: string;
  alone: (unit: string) => string;
}

const PRINCIPLES: Principle[] = [
  {
    id: "proximity",
    name: "Nähe",
    weight: 2,
    css: "gap",
    offLabel: "Gleich",
    alone: (unit) =>
      `Innerhalb einer ${unit} stehen die Punkte enger als zur nächsten. Mehr braucht es nicht: Nähe ist das einfachste Signal, und es kostet keinen einzigen Pixel Farbe.`,
  },
  {
    id: "similarity",
    name: "Ähnlichkeit",
    weight: 1,
    css: "Form, Farbe",
    offLabel: "Aus",
    alone: (unit) =>
      `Gefüllte und hohle Punkte wechseln sich ab, jede ${unit} ist einheitlich. Obwohl alle Abstände gleich sind, verbindet das gleiche Aussehen.`,
  },
  {
    id: "region",
    name: "Gemeinsame Region",
    weight: 4,
    css: "background",
    offLabel: "Aus",
    alone: (unit) => `Jede ${unit} liegt auf einer eigenen Fläche. Was in derselben Begrenzung liegt, gehört zusammen.`,
  },
  {
    id: "connected",
    name: "Verbundenheit",
    weight: 4,
    css: "Linie, border",
    offLabel: "Aus",
    alone: (unit) => `Eine Linie verbindet die Punkte jeder ${unit}. Was verbunden ist, wird als ein Ding gesehen.`,
  },
  {
    id: "fate",
    name: "Gemeinsames Schicksal",
    weight: 3,
    css: "transform",
    offLabel: "Aus",
    alone: (unit) =>
      `Die Punkte einer ${unit} bewegen sich gemeinsam, die Nachbarn gegenläufig. Ganz ohne anderes Signal fügt die gemeinsame Bewegung sie zusammen.`,
  },
];

const OFF: Settings = { proximity: "off", similarity: "off", region: "off", connected: "off", fate: "off" };

const PRESETS: { label: string; settings: Settings }[] = [
  { label: "Alles aus", settings: OFF },
  { label: "Nur Nähe", settings: { ...OFF, proximity: "rows" } },
  { label: "Nähe gegen Ähnlichkeit", settings: { ...OFF, proximity: "cols", similarity: "rows" } },
  { label: "Region schlägt Nähe", settings: { ...OFF, proximity: "cols", region: "rows" } },
];

const N = 5;
const INDEX = Array.from({ length: N }, (_, i) => i);
const COL_START = ["col-start-1", "col-start-2", "col-start-3", "col-start-4", "col-start-5"];
const ROW_START = ["row-start-1", "row-start-2", "row-start-3", "row-start-4", "row-start-5"];

const WORD = {
  rows: { plural: "Zeilen", singular: "Zeile" },
  cols: { plural: "Spalten", singular: "Spalte" },
};

const sameSettings = (a: Settings, b: Settings) => PRINCIPLES.every((p) => a[p.id] === b[p.id]);

function joinNames(items: Principle[]) {
  const names = items.map((p) => p.name);
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} und ${names[names.length - 1]}`;
}

function verdict(settings: Settings) {
  const active = PRINCIPLES.filter((p) => settings[p.id] !== "off");
  if (active.length === 0) {
    return {
      title: "Mehrdeutig",
      text: "Gleiche Abstände, gleiche Punkte: Nichts entscheidet. Du kannst dich bewusst auf Zeilen oder Spalten einstellen, aber keins von beiden drängt sich auf. Schalte rechts ein Prinzip ein.",
    };
  }

  const score = active.reduce((sum, p) => sum + p.weight * (settings[p.id] === "rows" ? 1 : -1), 0);
  if (score === 0) {
    return {
      title: "Unentschieden",
      text: "Die Signale heben sich auf, das Bild kippt hin und her. Im Interface wäre das eine Stelle, an der Menschen raten müssen, was zusammengehört.",
    };
  }

  const result: "rows" | "cols" = score > 0 ? "rows" : "cols";
  const other: "rows" | "cols" = result === "rows" ? "cols" : "rows";
  const pro = active.filter((p) => settings[p.id] === result).sort((a, b) => b.weight - a.weight);
  const contra = active.filter((p) => settings[p.id] === other);
  const title = `${WORD[result].plural}`;

  if (active.length === 1) {
    return { title, text: active[0].alone(WORD[result].singular) };
  }
  if (contra.length === 0) {
    return {
      title,
      text: `${joinNames(pro)} ziehen in dieselbe Richtung. Mehrere Signale für dieselbe Gruppe machen sie eindeutig und robust, falls eines nicht ankommt, etwa Farbe bei einer Farbsehschwäche.`,
    };
  }
  const proVerb = pro.length === 1 ? "sagt" : "sagen";
  const contraVerb = contra.length === 1 ? "sagt" : "sagen";
  return {
    title,
    text: `${joinNames(pro)} ${proVerb} ${WORD[result].plural}, ${joinNames(contra)} ${contraVerb} ${WORD[other].plural}. Das stärkere Signal gewinnt. Im Interface ist so ein Widerspruch fast immer ein Fehler: Zwei Gestaltungsmittel behaupten Verschiedenes.`,
  };
}

/**
 * Gruppierungs-Labor: ein 5×5-Punktraster, auf das fünf Prinzipien wirken können — für Zeilen oder für Spalten.
 * Zeigt, dass die Prinzipien zusammenarbeiten oder gegeneinander antreten, und welches sich meistens durchsetzt.
 */
export function GroupingLab() {
  const [settings, setSettings] = useState<Settings>({ ...OFF, proximity: "rows" });
  const [tick, setTick] = useState(false);

  const fate = settings.fate;
  useEffect(() => {
    if (fate === "off") return;
    const id = window.setInterval(() => setTick((value) => !value), 800);
    return () => window.clearInterval(id);
  }, [fate]);

  const set = (id: PrincipleId, axis: Axis) => setSettings((prev) => ({ ...prev, [id]: axis }));
  const { title, text } = verdict(settings);

  const gap =
    settings.proximity === "rows" ? "gap-x-2.5 gap-y-11" : settings.proximity === "cols" ? "gap-x-11 gap-y-2.5" : "gap-6";

  const hollow = (row: number, col: number) =>
    settings.similarity === "rows" ? row % 2 === 1 : settings.similarity === "cols" ? col % 2 === 1 : false;

  const motion = (row: number, col: number) => {
    if (fate === "off") return "";
    const even = (fate === "cols" ? col : row) % 2 === 0;
    const up = even === tick;
    if (fate === "cols") return up ? "-translate-y-1.5" : "translate-y-1.5";
    return up ? "-translate-x-1.5" : "translate-x-1.5";
  };

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl shadow-(--shadow-sm) mb-6 overflow-hidden">
      <div className="flex flex-col gap-3 px-5 sm:px-6 py-4 border-b border-(--bg-elevated)">
        <span className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost)">
          Gruppierungs-Labor: 25 Punkte, fünf Prinzipien
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => {
            const active = sameSettings(settings, preset.settings);
            return (
              <button
                key={preset.label}
                type="button"
                aria-pressed={active}
                onClick={() => setSettings(preset.settings)}
                className={`text-[13px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer border transition-colors duration-150 ${
                  active
                    ? "bg-(--text-primary) text-(--bg-surface) border-(--text-primary)"
                    : "bg-transparent text-(--text-tertiary) border-(--bg-hover) hover:text-(--text-primary)"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
        <div className="flex flex-col gap-4">
          <div
            className="h-72 rounded-xl bg-(--bg-base) border border-(--bg-elevated) flex items-center justify-center"
            aria-hidden="true"
          >
            <div
              className={`grid grid-cols-[repeat(5,14px)] grid-rows-[repeat(5,14px)] ${gap} transition-[gap] duration-300 ease-out`}
            >
              {settings.region !== "off" &&
                INDEX.map((i) => (
                  <span
                    key={`region-${i}`}
                    className={`${
                      settings.region === "cols"
                        ? `${COL_START[i]} row-start-1 row-span-5`
                        : `${ROW_START[i]} col-start-1 col-span-5`
                    } -m-0.75 rounded-lg bg-(--bg-elevated) border border-(--text-ghost)/50`}
                  />
                ))}
              {settings.connected !== "off" &&
                INDEX.map((i) => (
                  <span
                    key={`line-${i}`}
                    className={
                      settings.connected === "cols"
                        ? `${COL_START[i]} row-start-1 row-span-5 justify-self-center w-0.5 my-1.75 bg-(--text-tertiary)`
                        : `${ROW_START[i]} col-start-1 col-span-5 self-center h-0.5 mx-1.75 bg-(--text-tertiary)`
                    }
                  />
                ))}
              {INDEX.map((row) =>
                INDEX.map((col) => (
                  <span
                    key={`dot-${row}-${col}`}
                    className={`${ROW_START[row]} ${COL_START[col]} relative size-3.5 rounded-full transition-transform duration-700 ease-in-out ${motion(
                      row,
                      col,
                    )} ${
                      hollow(row, col)
                        ? "border-2 border-(--text-primary) bg-(--bg-base)"
                        : "bg-(--text-primary)"
                    }`}
                  />
                )),
              )}
            </div>
          </div>

          <div className="rounded-xl border border-(--bg-elevated) bg-(--bg-base) px-4 py-3" aria-live="polite">
            <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-1">
              Die meisten sehen
            </div>
            <div className="text-[17px] font-bold text-(--text-primary) mb-1">{title}</div>
            <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">{text}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {PRINCIPLES.map((principle) => (
            <div key={principle.id} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[13px] font-semibold text-(--text-primary)">{principle.name}</span>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-[13px] text-(--text-ghost)">{principle.css}</span>
                  <span className="flex gap-0.5" title={`Stärke ${principle.weight} von 4 (Faustregel)`}>
                    {[1, 2, 3, 4].map((step) => (
                      <span
                        key={step}
                        className={`w-1.5 h-3 rounded-sm ${
                          step <= principle.weight ? "bg-(--text-tertiary)" : "bg-(--bg-elevated)"
                        }`}
                      />
                    ))}
                  </span>
                </span>
              </div>
              <SegmentedControl
                ariaLabel={principle.name}
                options={[
                  { value: "off", label: principle.offLabel },
                  { value: "rows", label: "Zeilen" },
                  { value: "cols", label: "Spalten" },
                ]}
                value={settings[principle.id]}
                onChange={(axis) => set(principle.id, axis as Axis)}
              />
            </div>
          ))}
          <p className="text-[13px] leading-[1.6] text-(--text-tertiary) m-0">
            Die Balken zeigen eine Faustregel aus der Forschung, keine Messung. Wie stark ein Prinzip wirkt, hängt
            immer davon ab, wie deutlich es ausgeprägt ist.
          </p>
        </div>
      </div>
    </div>
  );
}
