import { useState } from "react";
import { CloudOff, Inbox, RefreshCw, TriangleAlert } from "lucide-react";
import { SegmentedControl } from "~/components/ui/SegmentedControl";

type ViewState = "ideal" | "empty" | "loading" | "error" | "partial";

const OPTIONS: { value: ViewState; label: string }[] = [
  { value: "ideal", label: "Ideal" },
  { value: "empty", label: "Leer" },
  { value: "loading", label: "Lädt" },
  { value: "error", label: "Fehler" },
  { value: "partial", label: "Teilweise" },
];

const TASKS = [
  { title: "Angebot für Nordlicht GmbH prüfen", meta: "Fällig heute · Projekt Relaunch" },
  { title: "Rückfrage von Jonas beantworten", meta: "Fällig heute · Projekt App" },
  { title: "Testplan freigeben", meta: "Fällig heute · Projekt Relaunch" },
  { title: "Rechnung 2026-118 kontrollieren", meta: "Fällig heute · Intern" },
];

const INFO: Record<ViewState, { question: string; job: string; mistake: string }> = {
  ideal: {
    question: "„Was steht heute an?“",
    job: "Die Antwort zeigen, das Wichtigste zuerst. Das ist der Zustand, den jeder gestaltet.",
    mistake: "Nur diesen Zustand zu entwerfen. Die anderen vier entstehen dann nebenbei im Code — und sehen auch so aus.",
  },
  empty: {
    question: "„Ist das kaputt — oder gibt es einfach nichts?“",
    job: "Sagen, warum hier nichts steht und was als Nächstes möglich ist. „Noch nichts angelegt“, „nichts gefunden“ und „alles erledigt“ sind drei verschiedene Leerzustände.",
    mistake: "Eine weiße Fläche oder ein nacktes „Keine Daten“. Der erste Eindruck eines neuen Nutzers ist fast immer ein Leerzustand.",
  },
  loading: {
    question: "„Passiert da noch etwas?“",
    job: "Zeigen, dass gearbeitet wird — am besten mit Platzhaltern in der Form des Inhalts, damit nichts springt, wenn die Daten kommen.",
    mistake: "Ein Spinner mitten auf einer leeren Seite, der das Layout verschiebt. Oder gar keine Rückmeldung, wenn es länger als eine Sekunde dauert.",
  },
  error: {
    question: "„Was ist passiert, und was mache ich jetzt?“",
    job: "In Alltagssprache sagen, was nicht geklappt hat, ob etwas verloren ging — und einen Ausweg anbieten.",
    mistake: "Fehlercodes, Stacktraces, „Etwas ist schiefgelaufen“. Oder der schlimmste Fall: Die Liste bleibt einfach leer.",
  },
  partial: {
    question: "„Ist das alles? Ist das aktuell?“",
    job: "Mit wenig oder unvollständigem Inhalt ehrlich umgehen: Veraltete Daten als veraltet kennzeichnen, eine einzelne Zeile nicht verloren wirken lassen.",
    mistake: "Ein Layout, das nur mit zwanzig Einträgen gut aussieht. Oder zwischengespeicherte Daten, die als aktuell erscheinen.",
  },
};

function TaskRow({ title, meta }: { title: string; meta: string }) {
  return (
    <li className="flex items-start gap-3 px-4 py-3">
      <span className="size-4 rounded border-[1.5px] border-(--text-ghost) shrink-0 mt-0.5" />
      <div className="min-w-0">
        <div className="text-[14px] font-semibold leading-[1.4] text-(--text-primary)">{title}</div>
        <div className="text-[13px] leading-[1.4] text-(--text-tertiary)">{meta}</div>
      </div>
    </li>
  );
}

function SkeletonRow({ width }: { width: string }) {
  return (
    <li className="flex items-start gap-3 px-4 py-3" aria-hidden="true">
      <span className="size-4 rounded bg-(--bg-elevated) shrink-0 mt-0.5" />
      <div className="flex-1 flex flex-col gap-2 py-0.5">
        <span className="h-3 rounded bg-(--bg-elevated) animate-pulse" style={{ width }} />
        <span className="h-2.5 w-2/5 rounded bg-(--bg-elevated) animate-pulse" />
      </div>
    </li>
  );
}

const BTN_PRIMARY =
  "text-[13px] font-semibold px-4 py-2 rounded-lg bg-(--text-primary) text-(--bg-surface) border border-(--text-primary)";
const BTN_SECONDARY = "text-[13px] font-semibold px-4 py-2 rounded-lg border border-(--text-ghost) text-(--text-primary)";

/**
 * Derselbe Screen in fünf Zuständen (nach Scott Hurffs „UI Stack“).
 * Zeigt, dass eine Ansicht nicht ein Bild ist, sondern fünf —
 * und welche Frage des Nutzers jeder Zustand beantworten muss.
 */
export function StateSwitcher() {
  const [state, setState] = useState<ViewState>("ideal");
  const info = INFO[state];

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl shadow-(--shadow-sm) mb-6 overflow-hidden">
      <div className="px-5 sm:px-6 py-4 border-b border-(--bg-elevated)">
        <SegmentedControl label="Zustand der Ansicht" options={OPTIONS} value={state} onChange={setState} />
      </div>

      <div className="grid lg:grid-cols-[minmax(0,10fr)_minmax(0,11fr)]">
        {/* Screen */}
        <div className="p-5 sm:p-8 bg-(--bg-base) flex items-start justify-center">
          <div className="w-full max-w-90 bg-(--bg-surface) border border-(--bg-elevated) rounded-xl shadow-(--shadow-sm) overflow-hidden">
            <div className="flex items-baseline justify-between px-4 py-3 border-b border-(--bg-elevated)">
              <span className="text-[15px] font-bold text-(--text-primary)">Heute fällig</span>
              <span className="text-[13px] text-(--text-tertiary)">
                {state === "ideal" && "4 Aufgaben"}
                {state === "partial" && "1 Aufgabe"}
                {state === "empty" && "0 Aufgaben"}
              </span>
            </div>

            <div className="min-h-64 flex flex-col" aria-live="polite">
              {state === "ideal" && (
                <ul className="list-none m-0 p-0 divide-y divide-(--bg-elevated)">
                  {TASKS.map((task) => (
                    <TaskRow key={task.title} {...task} />
                  ))}
                </ul>
              )}

              {state === "empty" && (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 px-6 py-8">
                  <Inbox size={26} className="text-(--text-ghost)" />
                  <div className="text-[15px] font-bold text-(--text-primary)">Heute ist nichts fällig</div>
                  <p className="text-[13px] leading-[1.55] text-(--text-secondary) m-0">
                    Als Nächstes steht am Freitag „Testplan freigeben“ an.
                  </p>
                  <span className={`${BTN_SECONDARY} mt-2`}>Alle Aufgaben ansehen</span>
                </div>
              )}

              {state === "loading" && (
                <ul className="list-none m-0 p-0 divide-y divide-(--bg-elevated)">
                  <SkeletonRow width="78%" />
                  <SkeletonRow width="62%" />
                  <SkeletonRow width="70%" />
                  <SkeletonRow width="55%" />
                  <li className="sr-only" role="status">
                    Aufgaben werden geladen
                  </li>
                </ul>
              )}

              {state === "error" && (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 px-6 py-8">
                  <TriangleAlert size={26} className="text-(--bad-color)" />
                  <div className="text-[15px] font-bold text-(--text-primary)">Die Aufgaben konnten nicht geladen werden</div>
                  <p className="text-[13px] leading-[1.55] text-(--text-secondary) m-0">
                    Der Server antwortet gerade nicht. Deine Daten sind sicher.
                  </p>
                  <span className={`${BTN_PRIMARY} mt-2 inline-flex items-center gap-2`}>
                    <RefreshCw size={14} />
                    Erneut versuchen
                  </span>
                </div>
              )}

              {state === "partial" && (
                <>
                  <div className="flex items-start gap-2.5 px-4 py-2.5 bg-(--warning-bg) border-b border-(--warning-border) text-[13px] leading-[1.5] text-(--text-secondary)">
                    <CloudOff size={15} className="shrink-0 mt-0.5 text-(--warning-color)" />
                    <span>
                      <strong className="font-semibold text-(--text-primary)">Offline.</strong> Stand von 09:12 Uhr —
                      neuere Aufgaben fehlen möglicherweise.
                    </span>
                  </div>
                  <ul className="list-none m-0 p-0">
                    <TaskRow {...TASKS[0]} />
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Erklärung */}
        <div className="p-5 sm:p-6 border-t lg:border-t-0 lg:border-l border-(--bg-elevated) flex flex-col gap-4" aria-live="polite">
          <div>
            <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-1">
              Was der Mensch wissen will
            </div>
            <div className="text-[15px] font-bold leading-[1.4] text-(--text-primary)">{info.question}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-1">
              Aufgabe der Oberfläche
            </div>
            <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">{info.job}</p>
          </div>
          <div>
            <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-1">
              Typischer Fehler
            </div>
            <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">{info.mistake}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
