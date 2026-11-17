import { useState } from "react";
import { AlertTriangle, CheckCircle2, Mail } from "lucide-react";

interface Step {
  label: string;
  text: string;
}

const STORY =
  "Als Kundin möchte ich nach dem Bezahlen sicher sein, dass meine Bestellung angekommen ist, damit ich nicht aus Unsicherheit ein zweites Mal bestelle.";

const STEPS: Step[] = [
  {
    label: "Akzeptanzkriterium → Zustand",
    text: "„Angenommen, die Zahlung war erfolgreich: Wenn die nächste Seite lädt, dann sehe ich eine eindeutige Bestätigung.“ Es braucht also einen eigenen Erfolgszustand.",
  },
  {
    label: "Gewicht",
    text: "Eine Einblendung, die nach drei Sekunden verschwindet, reicht nicht: Wer in dem Moment wegschaut, bleibt unsicher. Die Bestätigung bekommt eine eigene Seite.",
  },
  {
    label: "Inhalt",
    text: "Was beseitigt die Unsicherheit? Die Bestätigung in Worten, die Bestellnummer als Beleg, was bestellt wurde und wann es ankommt.",
  },
  {
    label: "Nächster Schritt",
    text: "Was passiert jetzt? Der Hinweis auf die E-Mail und ein Weg zur Bestellung — damit niemand auf „Zurück“ drückt, um nachzusehen.",
  },
  {
    label: "Gegenprobe",
    text: "„Angenommen, die Zahlung schlägt fehl …“ Das zweite Kriterium ergibt den Fehlerzustand: Was ist passiert, wurde etwas abgebucht, wie geht es weiter?",
  },
];

/**
 * Von der User Story zum Screen: Jeder Schritt der Ableitung fügt der Oberfläche
 * rechts ein Element hinzu. Zeigt, dass kein Element „einfach so“ dort steht —
 * jedes beantwortet eine Frage aus der Story.
 */
export function StoryToUi() {
  const [step, setStep] = useState(0);
  const last = step === STEPS.length;

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl shadow-(--shadow-sm) mb-6 overflow-hidden">
      <div className="grid lg:grid-cols-[minmax(0,11fr)_minmax(0,10fr)]">
        {/* Ableitung */}
        <div className="p-5 sm:p-6" aria-live="polite">
          <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-2">
            User Story
          </div>
          <p className="text-[14px] font-medium leading-[1.6] text-(--text-primary) mt-0 mb-4">{STORY}</p>

          <ol className="list-none p-0 m-0 flex flex-col gap-3">
            {STEPS.slice(0, step).map((item, index) => (
              <li key={item.label} className="flex gap-3">
                <span className="size-6 rounded-full bg-(--text-primary) text-(--bg-surface) font-mono text-[13px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <div className="text-[13px] leading-[1.6] text-(--text-secondary)">
                  <strong className="font-semibold text-(--text-primary)">{item.label}.</strong> {item.text}
                </div>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            {!last ? (
              <button
                type="button"
                onClick={() => setStep((value) => value + 1)}
                className="text-[13px] font-semibold px-4 py-2 rounded-lg cursor-pointer bg-(--text-primary) text-(--bg-surface) border border-(--text-primary) hover:opacity-90 transition-opacity duration-150"
              >
                {step === 0 ? "Ableitung starten" : "Nächster Schritt"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep(0)}
                className="text-[13px] font-semibold px-3 py-2 rounded-lg cursor-pointer bg-(--bg-elevated) border border-(--bg-hover) text-(--text-primary) hover:border-(--text-ghost) transition-colors duration-150"
              >
                Von vorn
              </button>
            )}
            <span className="font-mono text-[13px] text-(--text-ghost)">
              {step} / {STEPS.length}
            </span>
          </div>
        </div>

        {/* Screen — wächst mit jedem Schritt */}
        <div className="p-5 sm:p-8 bg-(--bg-base) border-t lg:border-t-0 lg:border-l border-(--bg-elevated) flex flex-col items-center justify-center gap-4">
          {step === 0 && (
            <p className="text-[14px] leading-[1.6] text-(--text-tertiary) m-0 max-w-70 text-center">
              Noch gibt es keinen Screen — nur einen Satz darüber, was ein Mensch braucht.
            </p>
          )}

          {step === 1 && (
            <div className="self-end max-w-65 bg-(--text-primary) text-(--bg-surface) rounded-lg px-4 py-2.5 text-[13px] font-medium shadow-(--shadow-md)">
              Bestellung erfolgreich
              <div className="text-[13px] font-normal opacity-70">Einblendung — verschwindet nach 3 s</div>
            </div>
          )}

          {step >= 2 && (
            <div className="w-full max-w-85 bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 shadow-(--shadow-sm) flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <CheckCircle2 size={28} className="text-(--success-color)" />
                <div className="text-[19px] font-extrabold leading-[1.25] tracking-[-0.2px] text-(--text-primary)">
                  Danke, deine Bestellung ist da.
                </div>
              </div>

              {step >= 3 && (
                <div className="flex flex-col gap-1">
                  <div className="text-[14px] font-semibold text-(--text-primary)">Ankunft am Donnerstag, 19. November</div>
                  <div className="text-[13px] text-(--text-secondary)">3 Artikel · 84,90 €</div>
                  <div className="text-[13px] text-(--text-tertiary)">Bestellung #48213-DE</div>
                </div>
              )}

              {step >= 4 && (
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2 text-[13px] leading-[1.5] text-(--text-secondary)">
                    <Mail size={15} className="shrink-0 mt-0.5 text-(--text-tertiary)" />
                    Die Bestätigung ist unterwegs an lena@beispiel.de.
                  </div>
                  <span className="self-start text-[14px] font-semibold px-4 py-2 rounded-lg bg-(--text-primary) text-(--bg-surface)">
                    Bestellung ansehen
                  </span>
                </div>
              )}
            </div>
          )}

          {step >= 5 && (
            <div className="w-full max-w-85 bg-(--bg-surface) border border-(--bad-border) rounded-xl p-5 flex flex-col gap-3">
              <div className="flex gap-2.5">
                <AlertTriangle size={18} className="shrink-0 mt-0.5 text-(--bad-color)" />
                <div>
                  <div className="text-[14px] font-bold text-(--text-primary)">Die Zahlung hat nicht geklappt.</div>
                  <div className="text-[13px] leading-[1.55] text-(--text-secondary)">
                    Es wurde nichts abgebucht. Dein Warenkorb ist gespeichert.
                  </div>
                </div>
              </div>
              <span className="self-start text-[13px] font-semibold px-4 py-2 rounded-lg border border-(--text-ghost) text-(--text-primary)">
                Erneut versuchen
              </span>
            </div>
          )}

          {step > 0 && (
            <p className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) m-0">
              {step === 1 && "Zustand vorhanden — aber leicht zu übersehen"}
              {step === 2 && "Eigene Seite statt Einblendung"}
              {step === 3 && "Beleg und Lieferdatum ergänzt"}
              {step === 4 && "Der nächste Schritt ist klar"}
              {step === 5 && "Beide Wege sind gestaltet"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
