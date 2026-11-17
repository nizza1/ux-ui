import { useState } from "react";
import { CircleDashed } from "lucide-react";
import { ModuleRef } from "~/components/ui/ModuleRef";

type DefectId = "gradient" | "lorem" | "emoji" | "contrast" | "nested" | "metric" | "buttons";

interface Defect {
  id: DefectId;
  /** Neutrale Bezeichnung des Bereichs — verrät die Schwäche nicht */
  area: string;
  title: string;
  text: string;
  /** Modul, das die passende Regel lehrt */
  ref?: string;
}

const DEFECTS: Defect[] = [
  {
    id: "gradient",
    area: "Kopfbereich",
    title: "Verlauf und Glitzer ohne Aufgabe",
    text: "Lila-Pink-Verlauf und Emoji sagen nichts über das Produkt — sie sind der Durchschnitt aus tausend Vorlagen. Farbe braucht eine Aufgabe: eine Aktion markieren, einen Status zeigen.",
    ref: "color-hierarchy",
  },
  {
    id: "lorem",
    area: "Untertitel",
    title: "Blindtext statt Inhalt",
    text: "Ohne echten Inhalt lässt sich nichts beurteilen: Platzbedarf, Umbruch und Rangfolge hängen am Text. Blindtext zeigt, dass im Auftrag der Inhalt fehlte.",
    ref: "understanding-users",
  },
  {
    id: "emoji",
    area: "Kennzahlen",
    title: "Emojis als Icons",
    text: "Emojis sehen auf jedem System anders aus, lassen sich nicht einfärben und passen in keine Linienstärke. Icons kommen aus einer Bibliothek — oder fallen weg.",
    ref: "images-icons",
  },
  {
    id: "contrast",
    area: "Hinweistext",
    title: "Hellgrau auf Weiß",
    text: "Der Text hat ein Kontrastverhältnis von rund 1,7:1. Verlangt sind 4,5:1. Blasser Text gilt als elegant — lesen kann man ihn bei Sonnenlicht oder mit schwächeren Augen nicht.",
    ref: "color-contrast",
  },
  {
    id: "nested",
    area: "Innere Karte",
    title: "Karte in der Karte, Schatten auf jeder Ebene",
    text: "Zwei Rahmen, zwei Schatten, zwei Rundungen — ohne dass die innere Fläche etwas hervorhebt. Tiefe ist ein Signal für Wichtigkeit. Wer sie überall einsetzt, sagt nichts mehr.",
    ref: "shadows-elevation",
  },
  {
    id: "metric",
    area: "Fortschrittsbalken",
    title: "Erfundene Zahl ohne Bezug",
    text: "78 % wovon? Generierte Oberflächen füllen sich gern mit Kennzahlen, die gut aussehen und nichts bedeuten. Frag bei jeder Zahl: Woher kommt sie, und welche Entscheidung hängt daran?",
  },
  {
    id: "buttons",
    area: "Schaltflächen",
    title: "Drei gleich laute Aktionen",
    text: "„Upgrade“, „Verwalten“ und „Kündigen“ sehen identisch aus — auch die Aktion, die man nicht versehentlich auslösen darf. Eine gefüllte Hauptaktion, der Rest tritt zurück.",
    ref: "visual-hierarchy",
  },
];

const ORDER = DEFECTS.map((defect) => defect.id);
const FOUND_RING = "outline-2 outline-offset-2 outline-(--info-color)";

/**
 * „Finde die Schwächen“: Eine typische generierte Karte mit sieben anklickbaren Auffälligkeiten.
 * Jede gefundene Stelle wird der Regel zugeordnet, gegen die sie verstößt.
 * Die Karte nutzt bewusst feste Farbwerte — sie soll in beiden Themes gleich beliebig aussehen.
 */
export function ReviewHunt() {
  const [found, setFound] = useState<DefectId[]>([]);

  const mark = (id: DefectId) => setFound((prev) => (prev.includes(id) ? prev : [...prev, id]));
  const isFound = (id: DefectId) => found.includes(id);
  const number = (id: DefectId) => ORDER.indexOf(id) + 1;
  const area = (id: DefectId) => DEFECTS.find((defect) => defect.id === id)!.area;

  /** Gemeinsame Eigenschaften aller anklickbaren Bereiche */
  const spot = (id: DefectId) => ({
    type: "button" as const,
    "aria-label": `Bereich „${area(id)}“ als Schwäche markieren`,
    "aria-pressed": isFound(id),
    onClick: () => mark(id),
  });

  /** Nummern-Marke an einer gefundenen Stelle */
  const marker = (id: DefectId, side: "left" | "right" = "right") =>
    isFound(id) ? (
      <span
        className={`absolute -top-2.5 ${side === "right" ? "-right-2.5" : "-left-2.5"} z-20 size-5 rounded-full bg-(--info-color) text-(--bg-surface) font-mono text-[13px] font-bold flex items-center justify-center pointer-events-none`}
      >
        {number(id)}
      </span>
    ) : null;

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl shadow-(--shadow-sm) mb-6 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 sm:px-6 py-4 border-b border-(--bg-elevated)">
        <span className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost)">
          Klick auf alles, was dir auffällt
        </span>
        <span className="font-mono text-[13px] font-semibold text-(--text-secondary)" aria-live="polite">
          {found.length} von {DEFECTS.length} gefunden
        </span>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,10fr)_minmax(0,11fr)]">
        {/* Die generierte Karte */}
        <div className="p-5 sm:p-8 bg-(--bg-base) flex items-start justify-center">
          <div className="w-full max-w-92 bg-white rounded-3xl shadow-[0_18px_40px_rgba(124,58,237,0.3)] text-left">
            <button
              {...spot("gradient")}
              className={`relative block w-full text-left cursor-pointer rounded-t-3xl bg-[linear-gradient(135deg,#7c3aed,#ec4899)] px-[22px] pt-[15px] pb-[11px] text-[17px] font-bold text-white ${isFound("gradient") ? FOUND_RING : ""}`}
            >
              ✨ Dein Abo
              {marker("gradient")}
            </button>

            <div className="px-[22px] pt-[13px] pb-[19px] flex flex-col items-stretch">
              <button
                {...spot("lorem")}
                className={`relative self-start text-left cursor-pointer rounded text-[14px] text-[#2b2540] ${isFound("lorem") ? FOUND_RING : ""}`}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                {marker("lorem")}
              </button>

              {/* Innere Karte: der Rahmen selbst ist anklickbar, die Inhalte liegen darüber */}
              <div className="relative mt-[17px] rounded-xl bg-white border border-[#ece9f5] shadow-[0_8px_20px_rgba(0,0,0,0.12)] p-[14px]">
                <button
                  {...spot("nested")}
                  className={`absolute inset-0 rounded-xl cursor-pointer ${isFound("nested") ? FOUND_RING : ""}`}
                />
                {marker("nested", "left")}

                <button
                  {...spot("emoji")}
                  className={`relative z-10 w-full grid grid-cols-3 gap-2 text-center cursor-pointer rounded-lg ${isFound("emoji") ? FOUND_RING : ""}`}
                >
                  {[
                    ["📊", "Projekte"],
                    ["🚀", "Plätze"],
                    ["💎", "Speicher"],
                  ].map(([emoji, label]) => (
                    <span key={label} className="flex flex-col items-center">
                      <span className="text-[20px] leading-none">{emoji}</span>
                      <span className="text-[13px] text-[#2b2540] mt-1">{label}</span>
                    </span>
                  ))}
                  {marker("emoji")}
                </button>

                <button
                  {...spot("metric")}
                  className={`relative z-10 block w-full mt-[13px] text-left cursor-pointer rounded-lg ${isFound("metric") ? FOUND_RING : ""}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="flex-1 h-2 rounded-full bg-[#ece9f5] overflow-hidden">
                      <span className="block h-full w-[78%] bg-[linear-gradient(90deg,#7c3aed,#ec4899)]" />
                    </span>
                    <span className="text-[13px] font-bold text-[#7c3aed]">78 %</span>
                  </span>
                  {marker("metric")}
                </button>
              </div>

              <button
                {...spot("contrast")}
                className={`relative self-start mt-[11px] text-left cursor-pointer rounded text-[13px] text-[#c4c4cf] ${isFound("contrast") ? FOUND_RING : ""}`}
              >
                Verlängert sich automatisch am 1. Dezember
                {marker("contrast")}
              </button>

              <button
                {...spot("buttons")}
                className={`relative mt-[19px] flex flex-wrap gap-x-[7px] gap-y-2 cursor-pointer rounded-full ${isFound("buttons") ? FOUND_RING : ""}`}
              >
                {["Upgrade", "Verwalten", "Kündigen"].map((label) => (
                  <span
                    key={label}
                    className="text-[13px] font-semibold px-3.5 py-2 rounded-full text-white bg-[linear-gradient(135deg,#7c3aed,#ec4899)]"
                  >
                    {label}
                  </span>
                ))}
                {marker("buttons")}
              </button>
            </div>
          </div>
        </div>

        {/* Befunde */}
        <div className="p-5 sm:p-6 border-t lg:border-t-0 lg:border-l border-(--bg-elevated)">
          <ol className="list-none m-0 p-0 flex flex-col gap-3.5" aria-live="polite">
            {DEFECTS.map((defect) =>
              isFound(defect.id) ? (
                <li key={defect.id} className="flex gap-3">
                  <span className="size-5 rounded-full bg-(--info-color) text-(--bg-surface) font-mono text-[13px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {number(defect.id)}
                  </span>
                  <div className="text-[13px] leading-[1.55] text-(--text-secondary)">
                    <strong className="font-semibold text-(--text-primary)">{defect.title}.</strong> {defect.text}
                    {defect.ref && (
                      <>
                        {" "}
                        → <ModuleRef slug={defect.ref} />
                      </>
                    )}
                  </div>
                </li>
              ) : (
                <li key={defect.id} className="flex items-center gap-3 text-[13px] text-(--text-ghost)">
                  <CircleDashed size={20} className="shrink-0" />
                  Noch nicht gefunden
                </li>
              ),
            )}
          </ol>

          <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-(--bg-elevated)">
            {found.length < DEFECTS.length && (
              <button
                type="button"
                onClick={() => setFound(ORDER)}
                className="text-[13px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer bg-(--bg-elevated) border border-(--bg-hover) text-(--text-primary) hover:border-(--text-ghost) transition-colors duration-150"
              >
                Auflösen
              </button>
            )}
            {found.length > 0 && (
              <button
                type="button"
                onClick={() => setFound([])}
                className="text-[13px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer bg-transparent border border-(--bg-hover) text-(--text-tertiary) hover:text-(--text-primary) transition-colors duration-150"
              >
                Zurücksetzen
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-6 py-4 border-t border-(--bg-elevated) text-[13px] leading-[1.6] text-(--text-secondary)" aria-live="polite">
        {found.length === DEFECTS.length ? (
          <>
            <strong className="font-semibold text-(--text-primary)">Alle sieben.</strong> Keine davon ist ein
            Programmierfehler — die Karte funktioniert. Und für jede gibt es eine Regel, die du benennen kannst. Genau
            das unterscheidet eine Prüfung von einem Bauchgefühl.
          </>
        ) : (
          "Die Karte sieht auf den ersten Blick fertig aus. Such die sieben Stellen, an denen sie nur so aussieht."
        )}
      </div>
    </div>
  );
}
