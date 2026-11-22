import { useState } from "react";
import type { ReactNode } from "react";

const f = (n: number) => n.toFixed(1);

/** Kreis mit ausgeschnittenem 60°-Keil, der zum Punkt (tx, ty) zeigt. */
function pacman(cx: number, cy: number, r: number, tx: number, ty: number) {
  const theta = Math.atan2(ty - cy, tx - cx);
  const a1 = theta + Math.PI / 6;
  const a2 = theta - Math.PI / 6;
  return `M ${cx} ${cy} L ${f(cx + r * Math.cos(a1))} ${f(cy + r * Math.sin(a1))} A ${r} ${r} 0 1 1 ${f(
    cx + r * Math.cos(a2),
  )} ${f(cy + r * Math.sin(a2))} Z`;
}

const CORNERS = [
  { x: 100, y: 28 },
  { x: 36, y: 138 },
  { x: 164, y: 138 },
];
const CENTER = { x: 100, y: (28 + 138 + 138) / 3 };
const DISC_R = 24;

/* Zwei Bézier-Kurven, die sich bei (100, 90) kreuzen — und dieselben Hälften anders zusammengesetzt */
const LINE_A = "M20,30 C70,40 130,140 180,150";
const LINE_B = "M20,150 C70,140 130,40 180,30";
const TOP_V = "M20,30 C45,35 72.5,62.5 100,90 C127.5,62.5 155,35 180,30";
const BOTTOM_V = "M20,150 C45,145 72.5,117.5 100,90 C127.5,117.5 155,145 180,150";

/* Das „Quadrat“ hat eine Kerbe — genau dort, wo der Kreis liegt */
const NOTCHED_SQUARE = "40,30 120,30 120,82 106,90 112,98 96,102 92,110 40,110";

interface FigureCardProps {
  name: string;
  english: string;
  toggle: string;
  active: boolean;
  onToggle: () => void;
  caption: string;
  children: ReactNode;
}

function FigureCard({ name, english, toggle, active, onToggle, caption, children }: FigureCardProps) {
  return (
    <div className="flex flex-col bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-4 shadow-(--shadow-sm)">
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <span className="text-[14px] font-bold text-(--text-primary)">{name}</span>
        <span className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost)">
          {english}
        </span>
      </div>
      <div className="rounded-lg bg-(--bg-base) border border-(--bg-elevated) p-2 mb-3">{children}</div>
      <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0 mb-3 flex-1" aria-live="polite">
        {caption}
      </p>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={active}
        className={`self-start text-[13px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer border transition-colors duration-150 ${
          active
            ? "bg-(--text-primary) text-(--bg-surface) border-(--text-primary)"
            : "bg-transparent text-(--text-tertiary) border-(--bg-hover) hover:text-(--text-primary)"
        }`}
      >
        {active ? "Zurück" : toggle}
      </button>
    </div>
  );
}

/**
 * Drei Figuren zur Frage „Welche Form hat das Ganze?“:
 * Kanizsa-Dreieck (Geschlossenheit), sich kreuzende Linien (gute Fortsetzung),
 * ein Quadrat hinter einem Kreis, das keines ist (Prägnanz).
 */
export function FormLab() {
  const [rotated, setRotated] = useState(false);
  const [split, setSplit] = useState(false);
  const [moved, setMoved] = useState(false);

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <FigureCard
        name="Geschlossenheit"
        english="Closure"
        toggle="Kreise drehen"
        active={rotated}
        onToggle={() => setRotated((value) => !value)}
        caption={
          rotated
            ? "Dieselben drei Formen, nur gedreht — und das Dreieck ist weg. Es steckt nicht in den Formen, sondern in ihrer Anordnung: Nur wenn die Kanten fluchten, ist eine verdeckende Fläche die einfachste Erklärung."
            : "Drei angeschnittene Kreise und ein Dreieck, das es nicht gibt. Viele sehen es sogar heller als den Hintergrund, obwohl es exakt dieselbe Farbe hat."
        }
      >
        <svg viewBox="0 0 200 170" className="w-full h-auto" role="img" aria-label="Kanizsa-Dreieck aus drei angeschnittenen Kreisen">
          {CORNERS.map((corner) => (
            <g
              key={`${corner.x}-${corner.y}`}
              className={`fill-(--text-primary) [transform-box:fill-box] origin-center transition-transform duration-700 ease-in-out ${
                rotated ? "rotate-180" : "rotate-0"
              }`}
            >
              <circle cx={corner.x} cy={corner.y} r={DISC_R} fill="none" />
              <path d={pacman(corner.x, corner.y, DISC_R, CENTER.x, CENTER.y)} />
            </g>
          ))}
        </svg>
      </FigureCard>

      <FigureCard
        name="Gute Fortsetzung"
        english="Continuity"
        toggle="Andere Deutung zeigen"
        active={split}
        onToggle={() => setSplit((value) => !value)}
        caption={
          split
            ? "Ebenso möglich: eine Spitze oben, eine unten, die sich in der Mitte berühren. Von selbst sieht das kaum jemand, weil das Gehirn Linien bevorzugt, die ohne Knick weiterlaufen."
            : "Zwei Linien, die sich kreuzen. So sieht es fast jeder, und niemand muss darüber nachdenken."
        }
      >
        <svg viewBox="0 0 200 180" className="w-full h-auto" role="img" aria-label="Zwei geschwungene Linien, die sich kreuzen">
          <g
            className={`fill-none stroke-(--text-primary) [stroke-width:5] [stroke-linecap:round] transition-opacity duration-300 ${
              split ? "opacity-0" : "opacity-100"
            }`}
          >
            <path d={LINE_A} />
            <path d={LINE_B} />
          </g>
          <path
            d={TOP_V}
            className={`fill-none stroke-(--text-primary) [stroke-width:5] [stroke-linecap:round] [stroke-linejoin:round] transition-[opacity,translate] duration-500 ${
              split ? "opacity-100 -translate-y-2.5" : "opacity-0 translate-y-0"
            }`}
          />
          <path
            d={BOTTOM_V}
            className={`fill-none stroke-(--text-ghost) [stroke-width:5] [stroke-linecap:round] [stroke-linejoin:round] [stroke-dasharray:10_7] transition-[opacity,translate] duration-500 ${
              split ? "opacity-100 translate-y-2.5" : "opacity-0 translate-y-0"
            }`}
          />
        </svg>
      </FigureCard>

      <FigureCard
        name="Prägnanz"
        english="Simplicity"
        toggle="Kreis wegschieben"
        active={moved}
        onToggle={() => setMoved((value) => !value)}
        caption={
          moved
            ? "Die einfachste Deutung war falsch. Prägnanz ist eine Wette, keine Garantie. Ein Interface muss dafür sorgen, dass die einfachste Deutung auch die richtige ist."
            : "Ein Quadrat hinter einem Kreis. Woher weißt du, dass das Quadrat vollständig ist? Du weißt es nicht. Dein Gehirn nimmt die einfachste Erklärung."
        }
      >
        <svg viewBox="0 0 240 170" className="w-full h-auto" role="img" aria-label="Eine graue Fläche, teilweise von einem Kreis verdeckt">
          <polygon points={NOTCHED_SQUARE} className="fill-(--text-ghost)" />
          <circle
            cx="120"
            cy="110"
            r="36"
            className={`fill-(--text-primary) transition-transform duration-700 ease-in-out ${
              moved ? "translate-x-17.5" : "translate-x-0"
            }`}
          />
        </svg>
      </FigureCard>
    </div>
  );
}
