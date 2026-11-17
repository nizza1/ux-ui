import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

type Answer = "ux" | "ui" | "both";

interface Case {
  id: string;
  text: string;
  answer: Answer;
  explanation: string;
}

const CASES: Case[] = [
  {
    id: "button",
    text: "Der Button „Speichern“ ist hellgrau auf weißem Grund. Viele übersehen ihn.",
    answer: "ui",
    explanation:
      "Der Ablauf stimmt, aber die Darstellung versteckt ihn: zu wenig Kontrast, keine erkennbare Schaltfläche. Das löst du mit Farbe und Hierarchie.",
  },
  {
    id: "address",
    text: "Um die Lieferadresse zu ändern, muss man die Bestellung stornieren und neu aufgeben.",
    answer: "ux",
    explanation:
      "Kein Styling rettet das. Der Weg zum Ziel ist falsch gebaut — eine Entscheidung über den Ablauf, nicht über das Aussehen.",
  },
  {
    id: "consistency",
    text: "Auf einer einzigen Karte stehen vier Schriftgrößen und drei verschiedene Blautöne.",
    answer: "ui",
    explanation:
      "Die Funktion ist unberührt, aber die Oberfläche wirkt unruhig und dadurch weniger vertrauenswürdig. Das ist fehlende Konsistenz in der Darstellung.",
  },
  {
    id: "back",
    text: "Wer im Formular auf „Zurück“ geht, verliert alle Eingaben.",
    answer: "ux",
    explanation:
      "Das System verhält sich anders, als Menschen es erwarten. Das Problem liegt im Verhalten — und wird im Code gelöst, nicht im Stylesheet.",
  },
  {
    id: "error",
    text: "Die Fehlermeldung lautet: „Error 422: Unprocessable Entity“.",
    answer: "ux",
    explanation:
      "Die Meldung spricht die Sprache des Servers. Was ist passiert, und was soll ich jetzt tun? Texte gehören zur Nutzererfahrung, auch wenn sie perfekt gesetzt sind.",
  },
  {
    id: "delete",
    text: "„Konto löschen“ steht direkt neben „Speichern“, sieht genauso aus und fragt nicht nach.",
    answer: "both",
    explanation:
      "Darstellung: Zwei Aktionen mit völlig verschiedenen Folgen sehen gleich aus. Ablauf: Eine unumkehrbare Aktion hat keinen Rückweg. So hängen UX und UI meistens zusammen.",
  },
];

const OPTIONS: { value: Answer; label: string }[] = [
  { value: "ux", label: "UX" },
  { value: "ui", label: "UI" },
  { value: "both", label: "Beides" },
];

const ANSWER_LABEL: Record<Answer, string> = {
  ux: "UX — der Ablauf",
  ui: "UI — die Darstellung",
  both: "Beides",
};

/**
 * Sortier-Übung: Sechs Alltagsprobleme, je eine Einschätzung.
 * Macht den Unterschied zwischen „Ablauf“ (UX) und „Darstellung“ (UI) greifbar —
 * und zeigt am letzten Fall, dass die Grenze nicht immer scharf ist.
 */
export function UxUiSorter() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  const answered = CASES.filter((item) => answers[item.id]);
  const correct = answered.filter((item) => answers[item.id] === item.answer).length;
  const done = answered.length === CASES.length;

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl shadow-(--shadow-sm) mb-6 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 sm:px-6 py-4 border-b border-(--bg-elevated)">
        <span className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost)">
          Wo liegt das Problem?
        </span>
        <span className="font-mono text-[13px] font-semibold text-(--text-secondary)" aria-live="polite">
          {answered.length} von {CASES.length} beantwortet
          {answered.length > 0 && ` · ${correct} richtig`}
        </span>
      </div>

      <ol className="list-none m-0 p-0 divide-y divide-(--bg-elevated)">
        {CASES.map((item, index) => {
          const given = answers[item.id];
          const isCorrect = given === item.answer;
          return (
            <li key={item.id} className="px-5 sm:px-6 py-4">
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                <p className="text-[14px] leading-[1.6] text-(--text-primary) m-0 flex-1 min-w-55">
                  <span className="font-mono text-[13px] font-semibold text-(--text-ghost) mr-2">{index + 1}</span>
                  {item.text}
                </p>
                <div
                  role="group"
                  aria-label={`Einschätzung für Fall ${index + 1}`}
                  className="inline-flex gap-1 p-1 rounded-lg bg-(--bg-elevated) border border-(--bg-hover) shrink-0"
                >
                  {OPTIONS.map((option) => {
                    const selected = given === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setAnswers((prev) => ({ ...prev, [item.id]: option.value }))}
                        className={`px-3 py-1.5 rounded-md text-[13px] font-semibold cursor-pointer transition-colors duration-150 ${
                          selected
                            ? "bg-(--bg-surface) text-(--text-primary) shadow-(--shadow-sm)"
                            : "bg-transparent text-(--text-tertiary) hover:text-(--text-primary)"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {given && (
                <div className="flex gap-3 mt-3" aria-live="polite">
                  {isCorrect ? (
                    <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-(--success-color)" />
                  ) : (
                    <XCircle size={18} className="shrink-0 mt-0.5 text-(--bad-color)" />
                  )}
                  <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">
                    <strong className="font-semibold text-(--text-primary)">
                      {isCorrect ? "Richtig" : "Nicht ganz"} — {ANSWER_LABEL[item.answer]}.
                    </strong>{" "}
                    {item.explanation}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between px-5 sm:px-6 py-4 border-t border-(--bg-elevated) bg-(--bg-base)">
        <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0 flex-1">
          {done ? (
            <>
              <strong className="font-semibold text-(--text-primary)">
                {correct} von {CASES.length}.
              </strong>{" "}
              Die Grenze ist nicht immer scharf — entscheidend ist die Frage dahinter: Liegt es am Ablauf oder an der
              Darstellung? Davon hängt ab, wo du reparierst.
            </>
          ) : (
            "Entscheide für jeden Fall: Stimmt der Ablauf nicht (UX), die Darstellung (UI) — oder beides?"
          )}
        </p>
        {answered.length > 0 && (
          <button
            type="button"
            onClick={() => setAnswers({})}
            className="shrink-0 text-[13px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer bg-transparent border border-(--bg-hover) text-(--text-tertiary) hover:text-(--text-primary) transition-colors duration-150"
          >
            Zurücksetzen
          </button>
        )}
      </div>
    </div>
  );
}
