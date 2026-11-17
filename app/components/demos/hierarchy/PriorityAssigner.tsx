import { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { SegmentedControl } from "~/components/ui/SegmentedControl";

type Level = 1 | 2 | 3;
type ItemId = "status" | "arrival" | "items" | "number" | "ordered" | "track";

interface Item {
  id: ItemId;
  /** Bezeichnung in der Steuerung */
  label: string;
  /** Text in der Karte */
  text: string;
  kind: "text" | "action";
  suggested: Level;
}

const ITEMS: Item[] = [
  { id: "status", label: "Statusmeldung", text: "Deine Bestellung ist unterwegs", kind: "text", suggested: 2 },
  { id: "arrival", label: "Lieferdatum", text: "Ankunft am Donnerstag, 19. November", kind: "text", suggested: 1 },
  { id: "items", label: "Inhalt und Preis", text: "3 Artikel · 84,90 €", kind: "text", suggested: 2 },
  { id: "number", label: "Bestellnummer", text: "Bestellung #48213-DE", kind: "text", suggested: 3 },
  { id: "ordered", label: "Bestelldatum", text: "Bestellt am 16. November", kind: "text", suggested: 3 },
  { id: "track", label: "Aktion", text: "Sendung verfolgen", kind: "action", suggested: 1 },
];

const LEVEL_OPTIONS: { value: Level; label: string }[] = [
  { value: 1, label: "Primär" },
  { value: 2, label: "Sekundär" },
  { value: 3, label: "Tertiär" },
];

/* So sieht jede Ebene aus — fest verdrahtet. Entschieden wird nur noch die Zuordnung. */
const TEXT_STYLE: Record<Level, string> = {
  1: "text-[20px] font-extrabold leading-[1.25] tracking-[-0.2px] text-(--text-primary)",
  2: "text-[14px] font-medium leading-[1.5] text-(--text-tertiary)",
  3: "text-[13px] font-normal leading-[1.5] text-(--text-ghost)",
};

const ACTION_STYLE: Record<Level, string> = {
  1: "self-start text-[14px] font-semibold px-4 py-2 rounded-lg bg-(--text-primary) text-(--bg-surface) border border-(--text-primary)",
  2: "self-start text-[13px] font-medium px-4 py-2 rounded-lg bg-transparent text-(--text-primary) border border-(--text-ghost)",
  3: "self-start text-[13px] font-medium text-(--text-tertiary) underline underline-offset-2",
};

const ALL_PRIMARY = Object.fromEntries(ITEMS.map((item) => [item.id, 1])) as Record<ItemId, Level>;
const SUGGESTION = Object.fromEntries(ITEMS.map((item) => [item.id, item.suggested])) as Record<ItemId, Level>;

interface Feedback {
  good: boolean;
  title: string;
  text: string;
}

function evaluate(levels: Record<ItemId, Level>): Feedback {
  const primary = ITEMS.filter((item) => levels[item.id] === 1);
  const count = primary.length;

  if (count === ITEMS.length) {
    return {
      good: false,
      title: "Alles ist primär — also nichts.",
      text: "So entsteht die typische Entwickler-Oberfläche: Jede Information ist korrekt und gleich laut. Stuf zurück, was nicht die Hauptsache ist.",
    };
  }
  if (count === 0) {
    return {
      good: false,
      title: "Kein Einstiegspunkt.",
      text: "Wenn nichts primär ist, wirkt alles gleich leise. Das Auge braucht ein Element, bei dem es anfangen kann.",
    };
  }
  if (count > 2) {
    return {
      good: false,
      title: `${count} Elemente konkurrieren um den ersten Blick.`,
      text: "Mehr als zwei primäre Elemente heben sich gegenseitig auf. Welches davon beantwortet die Frage, mit der jemand diese Karte öffnet?",
    };
  }
  if (levels.number === 1 || levels.ordered === 1) {
    return {
      good: false,
      title: "Klare Rangfolge — aber die falsche Hauptsache.",
      text: "Bestellnummer und Bestelldatum braucht man fast nur im Supportfall. Sie müssen auffindbar sein, nicht auffallen.",
    };
  }
  if (levels.arrival !== 1) {
    return {
      good: false,
      title: "Fast. Was will jemand wissen, der diese Karte öffnet?",
      text: "In den meisten Fällen: „Wann kommt es an?“ Die Antwort darauf sollte der Einstiegspunkt sein.",
    };
  }
  if (!ITEMS.some((item) => levels[item.id] === 3)) {
    return {
      good: true,
      title: "Gute Rangfolge — eine Stufe fehlt noch.",
      text: "Nichts ist tertiär. Bestellnummer und Bestelldatum dürfen noch weiter zurücktreten, dann wird die Karte ruhiger.",
    };
  }
  return {
    good: true,
    title: "Passt: Ein Blick beantwortet „Wann kommt es an?“",
    text: "Das Lieferdatum führt, der Rest ordnet sich unter. Du hast dafür keine einzige CSS-Eigenschaft angefasst — nur entschieden, was wichtig ist.",
  };
}

/**
 * Rangfolge festlegen: Der Nutzer ordnet jedem Element eine Ebene zu,
 * die Karte übernimmt das Styling. Zeigt, dass Hierarchie zuerst eine
 * inhaltliche Entscheidung ist — das CSS folgt erst danach.
 */
export function PriorityAssigner() {
  const [levels, setLevels] = useState<Record<ItemId, Level>>(ALL_PRIMARY);
  const feedback = evaluate(levels);
  const FeedbackIcon = feedback.good ? CheckCircle2 : AlertTriangle;

  const setLevel = (id: ItemId) => (level: Level) => setLevels((prev) => ({ ...prev, [id]: level }));
  const byId = (id: ItemId) => ITEMS.find((item) => item.id === id)!;
  const renderText = (id: ItemId) => (
    <div key={id} className={`${TEXT_STYLE[levels[id]]} transition-all duration-150`}>
      {byId(id).text}
    </div>
  );

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl shadow-(--shadow-sm) mb-6 overflow-hidden">
      <div className="grid lg:grid-cols-[minmax(0,11fr)_minmax(0,10fr)]">
        {/* Zuordnung */}
        <div className="p-5 sm:p-6">
          <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-4">
            Wie wichtig ist jedes Element?
          </div>
          <div className="flex flex-col gap-3">
            {ITEMS.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
                <span className="text-[13px] font-semibold text-(--text-primary)">{item.label}</span>
                <SegmentedControl
                  ariaLabel={`Ebene für ${item.label}`}
                  options={LEVEL_OPTIONS}
                  value={levels[item.id]}
                  onChange={setLevel(item.id)}
                />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-5">
            <button
              type="button"
              onClick={() => setLevels(SUGGESTION)}
              className="text-[13px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer bg-(--bg-elevated) border border-(--bg-hover) text-(--text-primary) hover:border-(--text-ghost) transition-colors duration-150"
            >
              Vorschlag anzeigen
            </button>
            <button
              type="button"
              onClick={() => setLevels(ALL_PRIMARY)}
              className="text-[13px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer bg-transparent border border-transparent text-(--text-tertiary) hover:text-(--text-primary) transition-colors duration-150"
            >
              Zurücksetzen
            </button>
          </div>
        </div>

        {/* Karte — folgt der Zuordnung */}
        <div className="p-5 sm:p-8 bg-(--bg-base) border-t lg:border-t-0 lg:border-l border-(--bg-elevated) flex items-center justify-center">
          <div className="w-full max-w-90 bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 shadow-(--shadow-sm) flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              {renderText("status")}
              {renderText("arrival")}
            </div>
            <div className="flex flex-col gap-1">
              {renderText("items")}
              {renderText("number")}
              {renderText("ordered")}
            </div>
            <span className={`${ACTION_STYLE[levels.track]} transition-all duration-150`}>{byId("track").text}</span>
          </div>
        </div>
      </div>

      {/* Rückmeldung */}
      <div aria-live="polite" className="flex gap-3 px-5 sm:px-6 py-4 border-t border-(--bg-elevated)">
        <FeedbackIcon
          size={18}
          className={`shrink-0 mt-0.5 ${feedback.good ? "text-(--success-color)" : "text-(--warning-color)"}`}
        />
        <div className="text-[13px] leading-[1.6] text-(--text-secondary)">
          <strong className="font-semibold text-(--text-primary)">{feedback.title}</strong> {feedback.text}
        </div>
      </div>
    </div>
  );
}
