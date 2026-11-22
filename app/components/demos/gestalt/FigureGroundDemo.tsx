import { useState } from "react";
import { Repeat } from "lucide-react";
import { SegmentedControl } from "~/components/ui/SegmentedControl";

type Pt = [number, number];
type Cue = "none" | "faces" | "vase";

/** Rechte Kontur der Vase von oben nach unten — zugleich das Profil des rechten Gesichts (Blick nach links). */
const PROFILE: Pt[] = [
  [156, 8],
  [150, 16],
  [138, 26],
  [130, 44],
  [126, 58],
  [124, 64],
  [130, 72],
  [126, 80],
  [108, 92],
  [122, 99],
  [116, 108],
  [122, 113],
  [117, 119],
  [127, 130],
  [115, 142],
  [122, 152],
  [134, 160],
  [140, 175],
  [146, 186],
  [160, 192],
];

const f = (n: number) => n.toFixed(1);

/** Catmull-Rom-Spline durch die Punkte als kubische Bézier-Segmente (ohne Startpunkt). */
function smooth(points: Pt[]): string {
  let d = "";
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

const MIRROR: Pt[] = PROFILE.map(([x, y]) => [200 - x, y] as Pt).reverse();
const VASE = `M ${f(MIRROR[MIRROR.length - 1][0])} ${f(PROFILE[0][1])} L ${f(PROFILE[0][0])} ${f(PROFILE[0][1])}${smooth(
  PROFILE,
)} L ${f(MIRROR[0][0])} ${f(MIRROR[0][1])}${smooth(MIRROR)} Z`;

const CAPTION: Record<Cue, string> = {
  none: "Eine Vase oder zwei Gesichter im Profil? Beides geht, aber nie gleichzeitig. Achte darauf, wie das Bild kippt: Die Kante gehört immer nur einer Seite. Wem sie gerade gehört, der ist Figur, der Rest wird formloser Hintergrund.",
  faces:
    "Zwei kleine Augen genügen. Jetzt gehört die Kante den Gesichtern, und die Vase wird zur Lücke zwischen ihnen. Ein einziges Detail hat entschieden, was Figur ist.",
  vase: "Drei Streifen machen die Mitte zum Gegenstand. Die Vase ist Figur, die Gesichter werden zur Fläche dahinter. Im Interface übernehmen Schatten, Rahmen und eigene Flächen diese Rolle.",
};

/**
 * Rubins Vase (1915): Figur und Grund teilen sich eine Kontur.
 * Hinweise (Augen oder Streifen) entscheiden, welche Seite die Kante „bekommt“.
 */
export function FigureGroundDemo() {
  const [cue, setCue] = useState<Cue>("none");
  const [swapped, setSwapped] = useState(false);

  const vaseFill = swapped ? "fill-(--text-primary)" : "fill-(--bg-surface)";
  const faceFill = swapped ? "fill-(--bg-surface)" : "fill-(--text-primary)";

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl shadow-(--shadow-sm) mb-6 overflow-hidden">
      <div className="px-5 sm:px-6 py-4 border-b border-(--bg-elevated)">
        <span className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost)">
          Rubins Vase, 1915
        </span>
      </div>
      <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-[260px_minmax(0,1fr)] md:items-center">
        <svg
          viewBox="0 0 200 200"
          className="w-full max-w-65 mx-auto rounded-xl border border-(--bg-elevated)"
          role="img"
          aria-label="Rubins Vase: eine helle Vase zwischen zwei dunklen Gesichtern im Profil"
        >
          <defs>
            <clipPath id="rubin-vase-clip">
              <path d={VASE} />
            </clipPath>
          </defs>
          <rect width="200" height="200" className={faceFill} />
          <path d={VASE} className={vaseFill} />
          {cue === "faces" && (
            <g className={vaseFill}>
              <ellipse cx="142" cy="70" rx="4.5" ry="2.4" />
              <ellipse cx="58" cy="70" rx="4.5" ry="2.4" />
            </g>
          )}
          {cue === "vase" && (
            <g clipPath="url(#rubin-vase-clip)" className={faceFill}>
              <rect x="0" y="33" width="200" height="3" />
              <rect x="0" y="40" width="200" height="3" />
              <rect x="0" y="176" width="200" height="3" />
            </g>
          )}
        </svg>

        <div className="flex flex-col gap-4">
          <SegmentedControl
            label="Hinweis hinzufügen"
            options={[
              { value: "none", label: "Keiner" },
              { value: "faces", label: "Augen" },
              { value: "vase", label: "Streifen" },
            ]}
            value={cue}
            onChange={setCue}
          />
          <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0 min-h-20" aria-live="polite">
            {CAPTION[cue]}
          </p>
          <button
            type="button"
            onClick={() => setSwapped((value) => !value)}
            aria-pressed={swapped}
            className="self-start inline-flex items-center gap-2 text-[13px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer bg-transparent border border-(--bg-hover) text-(--text-tertiary) hover:text-(--text-primary) transition-colors duration-150"
          >
            <Repeat size={14} />
            Hell und dunkel tauschen
          </button>
        </div>
      </div>
    </div>
  );
}
