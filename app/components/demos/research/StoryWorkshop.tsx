import { useId, useState } from "react";
import { AlertTriangle, CheckCircle2, CircleDashed } from "lucide-react";

interface Story {
  role: string;
  goal: string;
  benefit: string;
}

type Status = "ok" | "warn" | "open";

interface Check {
  status: Status;
  title: string;
  text: string;
}

const WEAK: Story = {
  role: "Nutzer",
  goal: "einen Filter-Button über der Aufgabenliste",
  benefit: "",
};

const STRONG: Story = {
  role: "Teamleiterin mit zwölf laufenden Projekten",
  goal: "auf einen Blick sehen, welche Aufgaben heute fällig sind",
  benefit: "ich morgens weiß, wo ich zuerst nachhaken muss",
};

/** Rollen, die auf jeden zutreffen — und deshalb nichts aussagen */
const GENERIC_ROLE = /^(ein(e|en)?\s+)?(nutzer(in)?|user|benutzer(in)?|anwender(in)?|kund(e|in)|person|mensch)$/i;

/** UI-Bausteine: Wer sie in der Story nennt, hat die Lösung schon festgelegt */
const UI_WORDS =
  /(?<!\p{L})(filter-button|buttons?|schaltflächen?|knopf|knöpfe|drop-?downs?|modal|pop-?ups?|dialogfenster|tabellen?|checkbox(?:en)?|menüs?|icons?|tabs?|slider|toggle|sidebar|karussell|eingabefeld|suchfeld)(?!\p{L})/iu;

const wordCount = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;

function checkRole(role: string): Check {
  const value = role.trim();
  if (!value) return { status: "open", title: "Wer?", text: "Für wen ist das? Rolle oder Situation eintragen." };
  if (GENERIC_ROLE.test(value)) {
    return {
      status: "warn",
      title: "Die Rolle sagt nichts aus.",
      text: `„${value}“ ist jeder. Was unterscheidet diese Person von anderen — ihre Aufgabe, ihre Erfahrung, ihre Lage?`,
    };
  }
  return { status: "ok", title: "Konkrete Rolle.", text: "Man kann sich die Person und ihre Lage vorstellen." };
}

function checkGoal(goal: string): Check {
  const value = goal.trim();
  if (!value) return { status: "open", title: "Was?", text: "Was will die Person tun können?" };
  const match = value.match(UI_WORDS);
  if (match) {
    return {
      status: "warn",
      title: "Das ist schon eine Lösung.",
      text: `„${match[0]}“ ist ein UI-Baustein. Was will die Person damit erreichen? Schreib das Ergebnis auf, nicht das Bauteil.`,
    };
  }
  if (wordCount(value) < 3) {
    return { status: "warn", title: "Zu knapp.", text: "Beschreib, was die Person tun oder wissen will — in einem halben Satz." };
  }
  return { status: "ok", title: "Ergebnis statt Bauteil.", text: "Die Story sagt, was möglich sein soll. Wie, bleibt offen." };
}

function checkBenefit(benefit: string): Check {
  const value = benefit.trim();
  if (!value) {
    return {
      status: "warn",
      title: "Der Grund fehlt.",
      text: "Ohne „damit“ weiß niemand, wozu das gut ist — und niemand kann zwei Lösungen gegeneinander abwägen.",
    };
  }
  if (wordCount(value) < 3) {
    return { status: "warn", title: "Zu knapp.", text: "Was hat die Person davon? Der Nutzen ist der Maßstab für jede Lösung." };
  }
  return { status: "ok", title: "Nutzen benannt.", text: "Daran lässt sich später jede Lösung messen." };
}

const STATUS_ICON = {
  ok: { Icon: CheckCircle2, className: "text-(--success-color)" },
  warn: { Icon: AlertTriangle, className: "text-(--warning-color)" },
  open: { Icon: CircleDashed, className: "text-(--text-ghost)" },
} as const;

const INPUT =
  "w-full text-[14px] leading-[1.5] px-3 py-2 rounded-lg bg-(--bg-base) border border-(--text-ghost) text-(--text-primary) placeholder:text-(--text-ghost) focus:border-(--accent)";

/**
 * User-Story-Werkstatt: drei Felder, drei Prüfungen.
 * Erkennt die häufigsten Schwächen — eine Rolle, die jeder ist, ein UI-Baustein
 * statt eines Ergebnisses und ein fehlendes „damit“.
 */
export function StoryWorkshop() {
  const [story, setStory] = useState<Story>(WEAK);
  const id = useId();

  const update = (field: keyof Story) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setStory((prev) => ({ ...prev, [field]: event.target.value }));

  const checks: { label: string; check: Check }[] = [
    { label: "Als …", check: checkRole(story.role) },
    { label: "möchte ich …", check: checkGoal(story.goal) },
    { label: "damit …", check: checkBenefit(story.benefit) },
  ];
  const passed = checks.filter((item) => item.check.status === "ok").length;

  const part = (value: string, placeholder: string) =>
    value.trim() ? (
      <span className="text-(--text-primary)">{value.trim()}</span>
    ) : (
      <span className="text-(--text-ghost)">[{placeholder}]</span>
    );

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl shadow-(--shadow-sm) mb-6 overflow-hidden">
      <div className="grid lg:grid-cols-2">
        {/* Eingabe */}
        <div className="p-5 sm:p-6 flex flex-col gap-4">
          <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost)">
            Deine Story
          </div>
          <div>
            <label htmlFor={`${id}-role`} className="block text-[13px] font-semibold text-(--text-primary) mb-1.5">
              Als …
            </label>
            <input id={`${id}-role`} className={INPUT} value={story.role} onChange={update("role")} placeholder="Rolle oder Situation" />
          </div>
          <div>
            <label htmlFor={`${id}-goal`} className="block text-[13px] font-semibold text-(--text-primary) mb-1.5">
              möchte ich …
            </label>
            <input id={`${id}-goal`} className={INPUT} value={story.goal} onChange={update("goal")} placeholder="was tun oder wissen können" />
          </div>
          <div>
            <label htmlFor={`${id}-benefit`} className="block text-[13px] font-semibold text-(--text-primary) mb-1.5">
              damit …
            </label>
            <input id={`${id}-benefit`} className={INPUT} value={story.benefit} onChange={update("benefit")} placeholder="welcher Nutzen entsteht" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStory(STRONG)}
              className="text-[13px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer bg-(--bg-elevated) border border-(--bg-hover) text-(--text-primary) hover:border-(--text-ghost) transition-colors duration-150"
            >
              Starkes Beispiel
            </button>
            <button
              type="button"
              onClick={() => setStory(WEAK)}
              className="text-[13px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer bg-transparent border border-(--bg-hover) text-(--text-tertiary) hover:text-(--text-primary) transition-colors duration-150"
            >
              Schwaches Beispiel
            </button>
            <button
              type="button"
              onClick={() => setStory({ role: "", goal: "", benefit: "" })}
              className="text-[13px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer bg-transparent border border-transparent text-(--text-tertiary) hover:text-(--text-primary) transition-colors duration-150"
            >
              Leeren
            </button>
          </div>
        </div>

        {/* Prüfung */}
        <div className="p-5 sm:p-6 bg-(--bg-base) border-t lg:border-t-0 lg:border-l border-(--bg-elevated)">
          <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-2">
            So liest sich die Story
          </div>
          <p className="text-[15px] font-medium leading-[1.6] text-(--text-tertiary) mt-0 mb-5">
            Als {part(story.role, "wer")} möchte ich {part(story.goal, "was")}, damit {part(story.benefit, "wozu")}.
          </p>

          <ul className="list-none p-0 m-0 flex flex-col gap-3" aria-live="polite">
            {checks.map(({ label, check }) => {
              const { Icon, className } = STATUS_ICON[check.status];
              return (
                <li key={label} className="flex gap-2.5">
                  <Icon size={17} className={`shrink-0 mt-0.5 ${className}`} />
                  <div className="text-[13px] leading-[1.55] text-(--text-secondary)">
                    <span className="font-mono text-[13px] text-(--text-ghost)">{label}</span>{" "}
                    <strong className="font-semibold text-(--text-primary)">{check.title}</strong> {check.text}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="px-5 sm:px-6 py-4 border-t border-(--bg-elevated) text-[13px] leading-[1.6] text-(--text-secondary)" aria-live="polite">
        <strong className="font-semibold text-(--text-primary)">{passed} von 3 Prüfungen bestanden.</strong>{" "}
        {passed === 3
          ? "Die Story trägt: Sie nennt eine Person, ein Ergebnis und einen Grund — und lässt offen, wie die Oberfläche aussieht."
          : "Die Prüfung erkennt nur die drei häufigsten Schwächen. Ob die Story stimmt, zeigt erst das Gespräch mit echten Nutzern."}
      </div>
    </div>
  );
}
