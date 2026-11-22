import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { RangeField } from "~/components/ui/RangeField";
import { SegmentedControl } from "~/components/ui/SegmentedControl";

const PRESETS = [
  { value: 600, label: "Langsam" },
  { value: 110, label: "Mittel" },
  { value: 25, label: "Sehr schnell" },
];

function reading(ms: number) {
  if (ms >= 300) {
    return {
      title: "Zwei Lichter, die sich abwechseln",
      text: "Mit so viel Zeit dazwischen siehst du, was technisch passiert: links an, links aus, rechts an. Nichts bewegt sich.",
    };
  }
  if (ms >= 50) {
    return {
      title: "Ein Licht, das hin- und herspringt",
      text: "Jetzt siehst du einen Punkt, der durch die Lücke wandert. Zwischen den beiden Kreisen leuchtet aber kein einziger Pixel. Die Bewegung entsteht in deinem Kopf.",
    };
  }
  return {
    title: "Zwei Lichter, die gleichzeitig flackern",
    text: "Zu schnell: Das Sehsystem kann die Reihenfolge nicht mehr auflösen und fasst beide zu einem flackernden Paar zusammen.",
  };
}

/**
 * Scheinbewegung nach Wertheimer (1912): Zwei Punkte leuchten abwechselnd auf.
 * Je nach Takt sieht man zwei Lichter, ein wanderndes Licht oder ein flackerndes Paar.
 * Startet bewusst pausiert: Die Bewegung beginnt erst auf Knopfdruck.
 */
export function ApparentMotionDemo() {
  const [ms, setMs] = useState(110);
  const [playing, setPlaying] = useState(false);
  const [leftOn, setLeftOn] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setLeftOn((value) => !value), ms);
    return () => window.clearInterval(id);
  }, [playing, ms]);

  const state = reading(ms);
  const dot = (on: boolean) =>
    `size-8 rounded-full shrink-0 ${
      on ? "bg-(--text-primary)" : "bg-transparent border border-dashed border-(--text-ghost) opacity-40"
    }`;

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl shadow-(--shadow-sm) mb-6 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-(--bg-elevated)">
        <span className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost)">
          Wertheimers Experiment, 1912
        </span>
        <button
          type="button"
          onClick={() => setPlaying((value) => !value)}
          aria-pressed={playing}
          className="inline-flex items-center gap-2 text-[13px] font-semibold px-3.5 py-1.5 rounded-lg cursor-pointer bg-(--text-primary) text-(--bg-surface) border border-(--text-primary)"
        >
          {playing ? <Pause size={14} /> : <Play size={14} />}
          {playing ? "Anhalten" : "Abspielen"}
        </button>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_260px] md:items-start">
        <div>
          <div
            className="relative h-40 rounded-xl bg-(--bg-base) border border-(--bg-elevated) flex items-center justify-center gap-28"
            aria-hidden="true"
          >
            <span className={dot(playing ? leftOn : true)} />
            <span className={dot(playing ? !leftOn : true)} />
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[1.5px] uppercase text-(--text-ghost) whitespace-nowrap">
              hier leuchtet nie etwas
            </span>
          </div>

          <div className="mt-4" aria-live="polite">
            {playing ? (
              <>
                <div className="text-[14px] font-bold text-(--text-primary) mb-1">Die meisten sehen: {state.title}</div>
                <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">{state.text}</p>
              </>
            ) : (
              <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">
                Zwei Kreise, die abwechselnd aufleuchten. Mehr passiert auf dem Bildschirm nicht. Drück auf
                „Abspielen“ und probier die drei Geschwindigkeiten aus.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <SegmentedControl label="Takt" options={PRESETS} value={ms} onChange={setMs} />
          <RangeField
            label="Zeit pro Licht"
            min={20}
            max={800}
            step={5}
            value={ms}
            display={`${ms} ms`}
            onChange={setMs}
          />
          <p className="text-[13px] leading-[1.6] text-(--text-tertiary) m-0">
            Wo die Grenzen liegen, hängt von Abstand, Bildschirm und Person ab. Such deine eigenen: Ab wann wird aus
            zwei Lichtern eines?
          </p>
        </div>
      </div>
    </div>
  );
}
