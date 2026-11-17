import { useState } from "react";
import { Check, CheckCircle2, FileText, HelpCircle, TriangleAlert } from "lucide-react";

type BlockId = "user" | "content" | "rank" | "system" | "states" | "limits";

interface Block {
  id: BlockId;
  label: string;
  /** Zeile, die dem Auftrag hinzugefügt wird */
  prompt: string;
  /** Was die KI erraten muss, solange der Baustein fehlt */
  guess: string;
}

const BASE_PROMPT = "Bau eine Karte, mit der man eine Rechnung freigeben kann.";

const BLOCKS: Block[] = [
  {
    id: "user",
    label: "Nutzer & Aufgabe",
    prompt:
      "Für wen: eine Teamleiterin, die zwischen zwei Terminen aufs Handy schaut. Ihre Frage: Was muss ich heute freigeben?",
    guess: "Für wen ist das, in welcher Lage und auf welchem Gerät?",
  },
  {
    id: "content",
    label: "Echter Inhalt",
    prompt:
      "Inhalt: Rechnung 2026-118 der Nordlicht GmbH über 4.280,00 €, fällig am 21. November, eingegangen am 14. November. Aktionen: Freigeben, Zurückweisen, Details.",
    guess: "Welche Daten stehen auf der Karte, und wie heißen die Aktionen?",
  },
  {
    id: "rank",
    label: "Rangfolge",
    prompt:
      "Rangfolge: Betrag und Fälligkeit sind die Hauptsache. „Freigeben“ ist die einzige gefüllte Schaltfläche, „Zurückweisen“ bekommt einen Rahmen, „Details“ ist ein Textlink.",
    guess: "Was ist die Hauptsache, und welche Aktion ist die wichtigste?",
  },
  {
    id: "system",
    label: "System",
    prompt:
      "System: Nutze ausschließlich die Variablen aus tokens.css — Farben, Abstände (4, 8, 12, 16, 24) und Radius. Keine eigenen Farbwerte, keine Verläufe, keine Emojis; Icons aus der vorhandenen Bibliothek.",
    guess: "Welche Farben, Abstände, Rundungen und Icons gelten in diesem Produkt?",
  },
  {
    id: "states",
    label: "Zustände",
    prompt:
      "Zustände: zusätzlich „lädt“ (Platzhalter), „Freigabe fehlgeschlagen“ (Meldung an der Karte, nichts geht verloren) und „freigegeben“ (Bestätigung).",
    guess: "Was passiert beim Laden, bei einem Fehler und nach der Freigabe?",
  },
  {
    id: "limits",
    label: "Grenzen",
    prompt:
      "Grenzen: semantisches HTML (button, kein div mit onClick), sichtbarer Fokus, Kontrast nach WCAG AA, nutzbar ab 320 px Breite. Nicht bauen: Navigation, Kopfzeile, Dark Mode.",
    guess: "Welches Markup, welche Mindestanforderungen — und was gehört nicht dazu?",
  },
];

const NONE = Object.fromEntries(BLOCKS.map((block) => [block.id, false])) as Record<BlockId, boolean>;
const ALL = Object.fromEntries(BLOCKS.map((block) => [block.id, true])) as Record<BlockId, boolean>;

/* Fester „Standard-Look“ für alles, was die KI ohne Vorgaben erfindet.
   Bewusst feste Farbwerte: Die Karte soll in beiden Themes gleich beliebig aussehen. */
const GENERIC_GRADIENT = "bg-[linear-gradient(135deg,#7c3aed,#ec4899)]";

/** Schematisches Ergebnis: Jeder Baustein behebt genau eine Art von Schwäche. */
function Preview({ on }: { on: Record<BlockId, boolean> }) {
  const { user, content, rank, system, states, limits } = on;
  const german = user || content;

  const title = user ? "Heute freizugeben" : german ? "Rechnungsfreigabe" : "Invoice Approval";
  const vendor = content ? "Nordlicht GmbH · Rechnung 2026-118" : "Lorem ipsum dolor sit amet";
  const amount = content ? "4.280,00 €" : "€ 0.00";
  const due = content ? "Fällig am 21. November" : "Consectetur adipiscing elit";
  const meta = content ? "Eingegangen am 14. November" : "Last updated 2 min ago";
  const actions = german ? ["Freigeben", "Zurückweisen", "Details"] : ["Approve", "Reject", "View"];

  const main = system ? "text-(--text-primary)" : "text-[#2b2540]";
  const sub = system ? "text-(--text-secondary)" : "text-[#2b2540]";
  const faint = system ? "text-(--text-tertiary)" : "text-[#c4c4cf]";

  const filled = system
    ? "bg-(--text-primary) text-(--bg-surface) rounded-lg"
    : `${GENERIC_GRADIENT} text-white rounded-full`;
  const outline = system
    ? "border border-(--text-ghost) text-(--text-primary) rounded-lg"
    : "border-2 border-[#7c3aed] text-[#7c3aed] rounded-full";
  const plain = system ? "text-(--text-secondary) underline underline-offset-2" : "text-[#7c3aed] underline";
  const buttonStyle = rank ? [filled, outline, plain] : [filled, filled, filled];
  const buttonPad = (index: number) => (rank && index === 2 ? "py-2" : "px-4 py-2");

  return (
    <div className="flex flex-col gap-3">
      <div
        className={
          system
            ? "bg-(--bg-surface) border border-(--bg-elevated) rounded-xl shadow-(--shadow-sm) overflow-hidden"
            : "bg-white rounded-3xl shadow-[0_18px_40px_rgba(124,58,237,0.35)] overflow-hidden"
        }
      >
        {/* Kopf */}
        {system ? (
          <div className="flex items-center gap-2 px-4 pt-4 text-[13px] font-semibold text-(--text-tertiary)">
            <FileText size={14} />
            {title}
          </div>
        ) : (
          <div className={`${GENERIC_GRADIENT} px-[22px] pt-[13px] pb-[9px] text-[15px] font-bold text-white`}>✨ {title}</div>
        )}

        {/* Inhalt */}
        <div className={system ? "p-4 flex flex-col gap-4" : "pt-[13px] px-[22px] pb-[19px] flex flex-col"}>
          <div className={system ? "flex flex-col gap-1" : "flex flex-col"}>
            {rank ? (
              <>
                <div className={`text-[26px] font-extrabold leading-[1.15] tracking-[-0.3px] ${main}`}>
                  {!system && "💰 "}
                  {amount}
                </div>
                <div className={`text-[14px] font-semibold ${main} ${system ? "" : "mt-[7px]"}`}>
                  {!system && "📅 "}
                  {due}
                </div>
                <div className={`text-[13px] ${sub} ${system ? "" : "mt-[3px]"}`}>
                  {!system && "🏢 "}
                  {vendor}
                </div>
              </>
            ) : (
              <>
                <div className={`text-[14px] ${main}`}>
                  {!system && "🏢 "}
                  {vendor}
                </div>
                <div className={`text-[14px] ${main} ${system ? "" : "mt-[7px]"}`}>
                  {!system && "💰 "}
                  {amount}
                </div>
                <div className={`text-[14px] ${main} ${system ? "" : "mt-[3px]"}`}>
                  {!system && "📅 "}
                  {due}
                </div>
              </>
            )}
            <div className={`text-[13px] ${faint} ${system ? "" : "mt-[11px]"}`}>{meta}</div>
          </div>

          <div className={`flex flex-wrap items-center ${system ? "gap-2" : "gap-x-[7px] gap-y-2 mt-[19px]"}`}>
            {actions.map((label, index) => (
              <span
                key={label}
                className={`text-[13px] font-semibold ${buttonPad(index)} ${buttonStyle[index]} ${
                  limits && index === 0 ? "outline-2 outline-offset-2 outline-(--info-color)" : ""
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Zustände */}
      {states && (
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-lg p-2.5 flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-(--text-primary)">Lädt</span>
            <span className="h-2 w-4/5 rounded bg-(--bg-elevated) animate-pulse" />
            <span className="h-2 w-3/5 rounded bg-(--bg-elevated) animate-pulse" />
          </div>
          <div className="bg-(--bg-surface) border border-(--bad-border) rounded-lg p-2.5 flex flex-col gap-1">
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-(--text-primary)">
              <TriangleAlert size={13} className="text-(--bad-color)" />
              Fehler
            </span>
            <span className="text-[13px] leading-[1.35] text-(--text-secondary)">Erneut versuchen</span>
          </div>
          <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-lg p-2.5 flex flex-col gap-1">
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-(--text-primary)">
              <CheckCircle2 size={13} className="text-(--success-color)" />
              Erledigt
            </span>
            <span className="text-[13px] leading-[1.35] text-(--text-secondary)">um 10:42 Uhr</span>
          </div>
        </div>
      )}

      {/* Grenzen */}
      {limits && (
        <div className="flex flex-wrap gap-1.5">
          {["<button>", "Fokus sichtbar", "Kontrast AA", "ab 320 px"].map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 font-mono text-[13px] text-(--text-secondary) bg-(--bg-surface) border border-(--bg-elevated) rounded-md px-2 py-0.5"
            >
              <Check size={12} className="text-(--success-color)" />
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Auftrags-Baukasten: Sechs Bausteine eines UI-Auftrags lassen sich einzeln zuschalten.
 * Links wächst der Auftrag, rechts verändert sich ein schematisches Ergebnis —
 * und die Liste dessen, was die KI noch erraten muss, wird kürzer.
 * Es wird kein Modell aufgerufen; die Vorschau zeigt typische Effekte.
 */
export function BriefBuilder() {
  const [on, setOn] = useState<Record<BlockId, boolean>>(NONE);
  const missing = BLOCKS.filter((block) => !on[block.id]);

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl shadow-(--shadow-sm) mb-6 overflow-hidden">
      {/* Bausteine */}
      <div className="px-5 sm:px-6 py-4 border-b border-(--bg-elevated)">
        <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-2.5">
          Bausteine des Auftrags
        </div>
        <div className="flex flex-wrap gap-2">
          {BLOCKS.map((block) => {
            const active = on[block.id];
            return (
              <button
                key={block.id}
                type="button"
                aria-pressed={active}
                onClick={() => setOn((prev) => ({ ...prev, [block.id]: !prev[block.id] }))}
                className={`inline-flex items-center gap-1.5 text-[13px] font-semibold px-3 py-1.5 rounded-lg border cursor-pointer transition-colors duration-150 ${
                  active
                    ? "bg-(--text-primary) border-(--text-primary) text-(--bg-surface)"
                    : "bg-transparent border-(--text-ghost) text-(--text-secondary) hover:border-(--text-primary) hover:text-(--text-primary)"
                }`}
              >
                {active && <Check size={13} />}
                {block.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setOn(missing.length === 0 ? NONE : ALL)}
            className="text-[13px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer bg-transparent border border-transparent text-(--text-tertiary) hover:text-(--text-primary) transition-colors duration-150"
          >
            {missing.length === 0 ? "Alle entfernen" : "Alle hinzufügen"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2">
        {/* Auftrag */}
        <div className="p-5 sm:p-6">
          <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-2.5">
            Dein Auftrag
          </div>
          <div className="flex flex-col gap-2.5 text-[13px] leading-[1.6]">
            <p className="m-0 font-medium text-(--text-primary)">{BASE_PROMPT}</p>
            {BLOCKS.filter((block) => on[block.id]).map((block) => (
              <p key={block.id} className="m-0 text-(--text-secondary) bg-(--accent-dim) border-l-2 border-(--accent) pl-3 pr-2 py-1.5 rounded-r-md">
                {block.prompt}
              </p>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-(--bg-elevated)" aria-live="polite">
            <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-2">
              {missing.length === 0 ? "Nichts mehr zu raten" : `Die KI muss an ${missing.length} ${missing.length === 1 ? "Stelle" : "Stellen"} raten`}
            </div>
            {missing.length === 0 ? (
              <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">
                Jede Entscheidung, die das Ergebnis prägt, hast du getroffen. Die KI führt aus — und genau dafür ist
                sie gut.
              </p>
            ) : (
              <ul className="list-none m-0 p-0 flex flex-col gap-1.5">
                {missing.map((block) => (
                  <li key={block.id} className="flex gap-2 text-[13px] leading-[1.55] text-(--text-secondary)">
                    <HelpCircle size={15} className="shrink-0 mt-0.5 text-(--warning-color)" />
                    {block.guess}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Ergebnis */}
        <div className="p-5 sm:p-6 bg-(--bg-base) border-t lg:border-t-0 lg:border-l border-(--bg-elevated)">
          <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-2.5">
            Was typischerweise zurückkommt
          </div>
          <div className="max-w-85 mx-auto">
            <Preview on={on} />
          </div>
          <p className="text-[13px] leading-[1.55] text-(--text-tertiary) mt-4 mb-0">
            Schematische Darstellung: Die Vorschau zeigt typische Effekte, es wird kein Modell aufgerufen.
          </p>
        </div>
      </div>
    </div>
  );
}
