import { Fragment, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AlignCenter, AlignLeft, AlignRight, Check, CheckCircle2, XCircle } from "lucide-react";

type Principle =
  | "Nähe"
  | "Ähnlichkeit"
  | "Gemeinsame Region"
  | "Verbundenheit"
  | "Gemeinsames Schicksal"
  | "Figur-Grund"
  | "Geschlossenheit"
  | "Gute Fortsetzung"
  | "Prägnanz";

interface QuizCase {
  id: string;
  question: string;
  answer: Principle;
  options: Principle[];
  explanation: string;
  render: (lifted: boolean) => ReactNode;
}

const FIELD = "h-7 rounded-md border border-(--text-ghost) bg-(--bg-surface)";
const TEXT = "text-[13px] leading-[1.4]";

const FILES = ["Bericht.pdf", "Notizen.txt", "Budget.xlsx", "Foto.jpg"];
const SELECTED = [0, 2];

const CASES: QuizCase[] = [
  {
    id: "form",
    question: "Woran erkennst du, welches Label zu welchem Feld gehört?",
    answer: "Nähe",
    options: ["Nähe", "Ähnlichkeit", "Geschlossenheit"],
    explanation:
      "Kein Rahmen, keine Linie, nur Abstand: 4 px zwischen Label und Feld, 16 px bis zur nächsten Gruppe. Das Auge ordnet jedes Label seinem Feld zu, bevor du liest.",
    render: () => (
      <div className="flex flex-col gap-4 w-full">
        {["Vorname", "Nachname"].map((label) => (
          <div key={label} className="flex flex-col gap-1">
            <span className={`${TEXT} font-semibold text-(--text-primary)`}>{label}</span>
            <span className={FIELD} />
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "toolbar",
    question: "Warum siehst du zwei Gruppen von Werkzeugen?",
    answer: "Gemeinsame Region",
    options: ["Gute Fortsetzung", "Gemeinsame Region", "Gemeinsames Schicksal"],
    explanation:
      "Jede Gruppe liegt auf einer eigenen Fläche: links Textauszeichnung, rechts Ausrichtung. Der etwas größere Abstand zwischen den Gruppen hilft mit, aber erst die Flächen machen die Grenze eindeutig.",
    render: () => (
      <div className="flex gap-2 justify-center w-full">
        <div className="flex gap-1 p-1 rounded-lg bg-(--bg-elevated)">
          {[
            { label: "B", cls: "font-bold" },
            { label: "I", cls: "italic font-serif" },
            { label: "U", cls: "underline" },
          ].map((item) => (
            <span
              key={item.label}
              className={`size-8 rounded-md bg-(--bg-surface) flex items-center justify-center text-[14px] text-(--text-primary) ${item.cls}`}
            >
              {item.label}
            </span>
          ))}
        </div>
        <div className="flex gap-1 p-1 rounded-lg bg-(--bg-elevated)">
          {[AlignLeft, AlignCenter, AlignRight].map((Icon, index) => (
            <span key={index} className="size-8 rounded-md bg-(--bg-surface) flex items-center justify-center text-(--text-primary)">
              <Icon size={15} />
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "carousel",
    question: "Woher weißt du, dass man hier weiterwischen kann?",
    answer: "Geschlossenheit",
    options: ["Nähe", "Verbundenheit", "Geschlossenheit"],
    explanation:
      "Die dritte Karte ist angeschnitten. Das Gehirn ergänzt sie zur ganzen Karte und schließt daraus: Da kommt noch mehr. Endet die Reihe genau am Rand, rechnet niemand mit weiteren Karten.",
    render: () => (
      <div className="w-full">
        <div className={`${TEXT} font-semibold text-(--text-primary) mb-2`}>Für dich empfohlen</div>
        <div className="flex gap-2 -mr-4">
          {[1, 2, 3, 4].map((card) => (
            <div key={card} className="w-[37%] shrink-0 rounded-md bg-(--bg-surface) border border-(--bg-elevated) p-2">
              <div className="h-10 rounded bg-(--bg-elevated) mb-1.5" />
              <div className="h-2 w-3/4 rounded bg-(--bg-elevated)" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "stepper",
    question: "Warum liest du vier Kreise als einen Weg?",
    answer: "Verbundenheit",
    options: ["Verbundenheit", "Ähnlichkeit", "Figur-Grund"],
    explanation:
      "Die Linie macht aus vier einzelnen Kreisen einen Pfad. Selbst ohne Zahlen würdest du eine Reihenfolge lesen, und die gefüllte Strecke zeigt, wie weit du schon bist.",
    render: () => (
      <div className="w-full">
        <div className="flex items-center">
          {[0, 1, 2, 3].map((step) => (
            <Fragment key={step}>
              <span
                className={`size-7 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 ${
                  step === 0
                    ? "bg-(--text-primary) text-(--bg-surface)"
                    : step === 1
                      ? "border-2 border-(--text-primary) text-(--text-primary) bg-(--bg-surface)"
                      : "border-2 border-(--text-ghost) text-(--text-tertiary) bg-(--bg-surface)"
                }`}
              >
                {step === 0 ? <Check size={14} strokeWidth={3} /> : step + 1}
              </span>
              {step < 3 && <span className={`flex-1 h-0.5 ${step === 0 ? "bg-(--text-primary)" : "bg-(--text-ghost)"}`} />}
            </Fragment>
          ))}
        </div>
        <div className={`${TEXT} text-(--text-secondary) mt-3`}>Schritt 2 von 4: Adresse</div>
      </div>
    ),
  },
  {
    id: "dialog",
    question: "Warum ist sofort klar, worum es jetzt geht?",
    answer: "Figur-Grund",
    options: ["Gemeinsame Region", "Figur-Grund", "Prägnanz"],
    explanation:
      "Die abgedunkelte Seite wird zum Grund, der Dialog zur Figur. Ohne Abdunklung und Schatten konkurriert er mit allem, was dahinter steht.",
    render: () => (
      <div className="relative w-full h-30 rounded-md overflow-hidden bg-(--bg-surface) border border-(--bg-elevated)">
        <div className="p-3 flex flex-col gap-2">
          {["w-4/5", "w-3/5", "w-11/12", "w-1/2", "w-3/4"].map((width) => (
            <span key={width} className={`h-2 rounded bg-(--bg-elevated) ${width}`} />
          ))}
        </div>
        <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
          <div className="rounded-lg bg-(--bg-surface) shadow-(--shadow-md) px-4 py-3 text-center">
            <div className={`${TEXT} font-bold text-(--text-primary) mb-2`}>Entwurf verwerfen?</div>
            <div className="flex gap-2 justify-center">
              <span className={`${TEXT} px-2.5 py-1 rounded-md border border-(--text-ghost) text-(--text-primary)`}>Nein</span>
              <span className={`${TEXT} px-2.5 py-1 rounded-md bg-(--text-primary) text-(--bg-surface) font-semibold`}>Ja</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "drag",
    question: "Woran erkennst du, welche Dateien gerade verschoben werden?",
    answer: "Gemeinsames Schicksal",
    options: ["Ähnlichkeit", "Nähe", "Gemeinsames Schicksal"],
    explanation:
      "Die markierten Dateien bewegen sich gemeinsam. Das Auge fasst sie sofort zusammen, obwohl sie nicht nebeneinanderstehen. Die Häkchen helfen zusätzlich, das ist Ähnlichkeit.",
    render: (lifted) => (
      <div className="w-full flex flex-col gap-1">
        {FILES.map((file, index) => {
          const selected = SELECTED.includes(index);
          return (
            <div
              key={file}
              className={`flex items-center gap-2 rounded-md px-2 py-0.5 border transition-transform duration-700 ease-in-out ${
                selected
                  ? `bg-(--bg-surface) border-(--text-ghost) shadow-(--shadow-sm) ${lifted ? "translate-x-4" : "translate-x-1"}`
                  : "border-transparent"
              }`}
            >
              <span
                className={`size-3.5 rounded-sm border-2 shrink-0 ${
                  selected ? "bg-(--text-primary) border-(--text-primary)" : "border-(--text-ghost)"
                }`}
              />
              <span className={`${TEXT} text-(--text-primary)`}>{file}</span>
            </div>
          );
        })}
      </div>
    ),
  },
  {
    id: "links",
    question: "Woher weißt du, dass alle Namen anklickbar sind?",
    answer: "Ähnlichkeit",
    options: ["Ähnlichkeit", "Gemeinsame Region", "Geschlossenheit"],
    explanation:
      "Alle Namen sehen gleich aus, also erwartet man, dass sie dasselbe tun. Wer einen angeklickt hat, kennt die anderen schon. Das Datum sieht anders aus und ist deshalb erkennbar keine Aktion.",
    render: () => (
      <div className="w-full flex flex-col divide-y divide-(--bg-elevated)">
        {[
          ["Rechnung 0142", "12.03."],
          ["Rechnung 0141", "28.02."],
          ["Gutschrift 0019", "14.02."],
        ].map(([name, date]) => (
          <div key={name} className="flex justify-between gap-3 py-1.5">
            <span className={`${TEXT} font-semibold text-(--text-primary) underline underline-offset-2`}>{name}</span>
            <span className={`${TEXT} text-(--text-tertiary) tabular-nums`}>{date}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "align",
    question: "Warum liest du die Werte als eine geordnete Spalte?",
    answer: "Gute Fortsetzung",
    options: ["Figur-Grund", "Gute Fortsetzung", "Gemeinsame Region"],
    explanation:
      "Alle Werte beginnen an derselben unsichtbaren Kante. Das Auge folgt ihr von oben nach unten und liest die Werte als eine Spalte, obwohl nirgends eine Linie gezeichnet ist.",
    render: () => (
      <dl className="w-full grid grid-cols-[56px_minmax(0,1fr)] gap-x-3 gap-y-1.5 m-0">
        {[
          ["Name", "Lena Berger"],
          ["E-Mail", "lena@beispiel.de"],
          ["Rolle", "Administratorin"],
          ["Seit", "März 2024"],
        ].map(([key, value]) => (
          <Fragment key={key}>
            <dt className={`${TEXT} text-(--text-tertiary)`}>{key}</dt>
            <dd className={`${TEXT} m-0 font-semibold text-(--text-primary) truncate`}>{value}</dd>
          </Fragment>
        ))}
      </dl>
    ),
  },
];

/**
 * „Welches Prinzip wirkt hier?“ — acht Mini-Oberflächen, je drei Antworten.
 * Die Erklärung erscheint nach der ersten Antwort und darf umentschieden werden.
 */
export function PrincipleQuiz() {
  const [answers, setAnswers] = useState<Record<string, Principle>>({});
  const [lifted, setLifted] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setLifted((value) => !value), 900);
    return () => window.clearInterval(id);
  }, []);

  const answered = CASES.filter((item) => answers[item.id]);
  const correct = answered.filter((item) => answers[item.id] === item.answer).length;
  const done = answered.length === CASES.length;

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl shadow-(--shadow-sm) mb-6 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 sm:px-6 py-4 border-b border-(--bg-elevated)">
        <span className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost)">
          Welches Prinzip wirkt hier?
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
            <li key={item.id} className="grid gap-4 px-5 sm:px-6 py-5 md:grid-cols-[260px_minmax(0,1fr)] md:items-start">
              <div
                className="rounded-lg bg-(--bg-base) border border-(--bg-elevated) p-4 min-h-40 flex items-center overflow-hidden"
                aria-hidden="true"
              >
                {item.render(lifted)}
              </div>

              <div>
                <p className="text-[14px] leading-[1.6] font-semibold text-(--text-primary) m-0 mb-3">
                  <span className="font-mono text-[13px] text-(--text-ghost) mr-2">{index + 1}</span>
                  {item.question}
                </p>
                <div role="group" aria-label={`Antworten zu Fall ${index + 1}`} className="flex flex-wrap gap-2">
                  {item.options.map((option) => {
                    const selected = given === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setAnswers((prev) => ({ ...prev, [item.id]: option }))}
                        className={`text-[13px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer border transition-colors duration-150 ${
                          selected
                            ? "bg-(--text-primary) text-(--bg-surface) border-(--text-primary)"
                            : "bg-transparent text-(--text-tertiary) border-(--bg-hover) hover:text-(--text-primary)"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
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
                        {isCorrect ? "Richtig" : "Nicht ganz"}: {item.answer}.
                      </strong>{" "}
                      {item.explanation}
                    </p>
                  </div>
                )}
              </div>
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
              Meist wirken mehrere Prinzipien gleichzeitig. Die Frage ist immer: Welches trägt die Bedeutung, und
              würde die Gruppe ohne es zerfallen?
            </>
          ) : (
            "Achte auf das, was die Gruppe zusammenhält. Würde sie ohne dieses Mittel zerfallen, hast du das Prinzip gefunden."
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
