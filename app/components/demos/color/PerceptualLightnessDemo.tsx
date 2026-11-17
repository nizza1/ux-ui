import { useState } from "react";
import { SegmentedControl } from "~/components/ui/SegmentedControl";
import { hslToRgb, oklchToRgb, relativeLuminance, rgbToHex } from "~/utils/color";

const HUES = [
  { name: "Rot", hsl: 0, oklch: 29 },
  { name: "Orange", hsl: 30, oklch: 60 },
  { name: "Gelb", hsl: 60, oklch: 100 },
  { name: "Grün", hsl: 120, oklch: 145 },
  { name: "Cyan", hsl: 180, oklch: 195 },
  { name: "Blau", hsl: 240, oklch: 265 },
  { name: "Violett", hsl: 270, oklch: 300 },
  { name: "Magenta", hsl: 300, oklch: 330 },
];

interface RowProps {
  title: string;
  code: string;
  swatches: { name: string; hex: string; luminance: number }[];
  gray: boolean;
  verdict: string;
  good: boolean;
}

function Row({ title, code, swatches, gray, verdict, good }: RowProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 flex-wrap mb-2">
        <span className="text-[14px] font-bold text-(--text-primary)">{title}</span>
        <code className="font-mono text-[13px] text-(--text-tertiary)">{code}</code>
      </div>
      <div className={`flex gap-1 transition-[filter] duration-300 ${gray ? "grayscale" : ""}`}>
        {swatches.map((swatch) => (
          <div key={swatch.name} className="flex-1 h-14 rounded-md" style={{ background: swatch.hex }} />
        ))}
      </div>
      <div className="flex gap-1 mt-1">
        {swatches.map((swatch) => (
          <div key={swatch.name} className="flex-1 text-center">
            <div className="font-mono text-[11px] font-semibold text-(--text-secondary) tabular-nums">
              {Math.round(swatch.luminance * 100)}%
            </div>
            <div className="font-mono text-[10px] text-(--text-ghost) hidden sm:block">{swatch.name}</div>
          </div>
        ))}
      </div>
      <p className={`text-[13px] leading-[1.6] mt-2 mb-0 font-medium ${good ? "text-(--success-color)" : "text-(--bad-color)"}`}>
        {verdict}
      </p>
    </div>
  );
}

/**
 * Zeigt den blinden Fleck von HSL: gleiche "Lightness" heißt nicht gleich hell.
 * Die Prozentzahl unter jedem Feld ist die gemessene Luminanz (WCAG).
 */
export function PerceptualLightnessDemo() {
  const [view, setView] = useState<"color" | "gray">("color");

  const hslRow = HUES.map((hue) => {
    const rgb = hslToRgb(hue.hsl, 100, 50);
    return { name: hue.name, hex: rgbToHex(rgb), luminance: relativeLuminance(rgb) };
  });
  const oklchRow = HUES.map((hue) => {
    const { rgb } = oklchToRgb(0.75, 0.12, hue.oklch);
    return { name: hue.name, hex: rgbToHex(rgb), luminance: relativeLuminance(rgb) };
  });

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl p-6 mb-6 shadow-(--shadow-sm)">
      <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
        <div>
          <div className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-1">
            Experiment
          </div>
          <div className="text-[15px] font-bold text-(--text-primary)">
            Acht Farbtöne, jeweils „gleich hell" — stimmt das?
          </div>
        </div>
        <SegmentedControl
          ariaLabel="Darstellung"
          value={view}
          onChange={setView}
          options={[
            { value: "color", label: "In Farbe" },
            { value: "gray", label: "In Graustufen" },
          ]}
        />
      </div>

      <div className="flex flex-col gap-6">
        <Row
          title="HSL — Lightness überall 50 %"
          code="hsl(H 100% 50%)"
          swatches={hslRow}
          gray={view === "gray"}
          good={false}
          verdict="Gelb ist rund 13× heller als Blau — obwohl beide „50 % Lightness“ haben. Weißer Text funktioniert auf Blau, auf Gelb nie."
        />
        <Row
          title="OKLCH — Lightness überall 75 %"
          code="oklch(75% 0.12 H)"
          swatches={oklchRow}
          gray={view === "gray"}
          good
          verdict="Alle Felder sind messbar fast gleich hell. Eine Stufe verhält sich bei jedem Farbton gleich — Kontrast wird planbar."
        />
      </div>
    </div>
  );
}
