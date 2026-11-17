import { useState } from "react";
import type { CSSProperties } from "react";
import { CodeBlock } from "~/components/ui/CodeBlock";
import { RangeField } from "~/components/ui/RangeField";
import { SegmentedControl } from "~/components/ui/SegmentedControl";
import {
  buildGrayRamp,
  buildRamp,
  contrastRatio,
  describeHue,
  firstStepForWhiteText,
  readableOn,
  WHITE,
  type RampMode,
  type Shade,
} from "~/utils/color";

function SwatchRow({ name, ramp }: { name: string; ramp: Shade[] }) {
  return (
    <div>
      <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-2">
        {name}
      </div>
      <div className="grid grid-cols-11 gap-1">
        {ramp.map((shade) => {
          const text = readableOn(shade.rgb);
          return (
            <div key={shade.step} className="min-w-0">
              <div
                className="h-14 rounded-md flex flex-col items-center justify-center border border-black/5"
                style={{ background: shade.hex, color: text.color }}
                title={`${name}-${shade.step} · ${shade.hex} · ${shade.css}`}
              >
                <span className="text-[13px] font-bold leading-none">Aa</span>
                <span className="font-mono text-[10px] font-semibold mt-1 opacity-85 tabular-nums hidden sm:block">
                  {text.ratio.toFixed(1)}
                </span>
              </div>
              <div className="font-mono text-[11px] font-semibold text-(--text-secondary) text-center mt-1 tabular-nums">
                {shade.step}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function toCss(brand: Shade[], gray: Shade[], mode: RampMode): string {
  const line = (name: string, shade: Shade) =>
    `  --${name}-${shade.step}: ${shade.css};`.padEnd(42) + `/* ${shade.hex} */`;
  return `:root {
  /* Primärfarbe — ${mode === "oklch" ? "OKLCH: jede Stufe ist bei jedem Farbton gleich hell" : "HSL: Lightness-Treppe, Sättigung an den Rändern angehoben"} */
${brand.map((shade) => line("brand", shade)).join("\n")}

  /* Neutrale Grautöne — mit dem Farbton der Primärfarbe getönt */
${gray.map((shade) => line("gray", shade)).join("\n")}
}`;
}

/**
 * Paletten-Generator: Farbton + Sättigung → vollständige Farbfamilie (50–950)
 * plus passende Grautöne. Der CSS-Code darunter aktualisiert sich live.
 */
export function PaletteGenerator() {
  const [mode, setMode] = useState<RampMode>("oklch");
  const [hue, setHue] = useState(250);
  const [saturation, setSaturation] = useState(85);
  const [tint, setTint] = useState(8);

  const brand = buildRamp(hue, saturation, mode);
  const gray = buildGrayRamp(hue, tint, mode);
  const whiteStep = firstStepForWhiteText(brand);
  const shade = (ramp: Shade[], step: number) => ramp.find((s) => s.step === step)!;

  // Die Vorschau benutzt die Palette über CSS-Variablen — genau wie später im Projekt.
  const vars: Record<string, string> = {};
  for (const s of brand) vars[`--pg-brand-${s.step}`] = s.hex;
  for (const s of gray) vars[`--pg-gray-${s.step}`] = s.hex;

  const buttonStep = whiteStep && whiteStep <= 700 ? Math.max(whiteStep, 600) : 700;
  const buttonText = readableOn(shade(brand, buttonStep).rgb);
  const badgeRatio = contrastRatio(shade(brand, 800).rgb, shade(brand, 100).rgb);

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl shadow-(--shadow-sm) mb-6 overflow-hidden">
      {/* Steuerung */}
      <div className="p-6 grid gap-6 md:grid-cols-2 border-b border-(--bg-elevated)">
        <div className="flex flex-col gap-5">
          <RangeField
            label={`Farbton — ${describeHue(hue)}`}
            value={hue}
            min={0}
            max={360}
            display={`${hue}°`}
            onChange={setHue}
            track={`linear-gradient(to right, ${[0, 60, 120, 180, 240, 300, 360]
              .map((deg) => `hsl(${deg} 85% 52%)`)
              .join(", ")})`}
          />
          <RangeField
            label="Sättigung der Primärfarbe"
            value={saturation}
            min={20}
            max={100}
            display={`${saturation}%`}
            onChange={setSaturation}
            track={`linear-gradient(to right, hsl(${hue} 20% 52%), hsl(${hue} 100% 52%))`}
          />
        </div>
        <div className="flex flex-col gap-5">
          <RangeField
            label="Farbstich der Grautöne"
            value={tint}
            min={0}
            max={20}
            display={tint === 0 ? "rein grau" : `${tint}%`}
            onChange={setTint}
            track={`linear-gradient(to right, hsl(${hue} 0% 60%), hsl(${hue} 20% 60%))`}
          />
          <SegmentedControl
            label="Farbraum der Skala"
            value={mode}
            onChange={setMode}
            options={[
              { value: "oklch", label: "OKLCH" },
              { value: "hsl", label: "HSL" },
            ]}
          />
        </div>
      </div>

      {/* Palette */}
      <div className="p-6 flex flex-col gap-5 border-b border-(--bg-elevated)">
        <SwatchRow name="brand" ramp={brand} />
        <SwatchRow name="gray" ramp={gray} />
        <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">
          Die Zahl im Feld ist das Kontrastverhältnis des „Aa" zum Hintergrund.{" "}
          <strong className="font-semibold text-(--text-primary)">
            {whiteStep
              ? `Weißer Text besteht WCAG AA (4.5:1) ab brand-${whiteStep}.`
              : "Weißer Text besteht WCAG AA auf keiner Stufe dieser Skala."}
          </strong>{" "}
          {mode === "oklch"
            ? "Dreh am Farbton: In OKLCH bleibt diese Grenze stabil."
            : "Dreh am Farbton: In HSL springt diese Grenze — bei Gelb, Grün und Türkis weit nach hinten."}
        </p>
      </div>

      {/* Palette in Aktion */}
      <div className="p-6 border-b border-(--bg-elevated)">
        <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-3">
          Deine Palette in Aktion
        </div>
        <div
          style={vars as CSSProperties}
          className="rounded-xl p-5 bg-(--pg-gray-100) border border-(--pg-gray-200) grid gap-4 md:grid-cols-2"
        >
          <div className="rounded-lg p-4 bg-(--pg-gray-50) border border-(--pg-gray-200)">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[15px] font-bold text-(--pg-gray-900)">Projekt Aurora</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-(--pg-brand-100) text-(--pg-brand-800)">
                Aktiv
              </span>
            </div>
            <p className="text-[13px] leading-[1.6] text-(--pg-gray-600) mt-0 mb-4">
              Überschrift in gray-900, Fließtext in gray-600, Rahmen in gray-200.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="text-[13px] font-semibold px-3.5 py-2 rounded-md"
                style={{ background: shade(brand, buttonStep).hex, color: buttonText.color }}
              >
                Öffnen
              </span>
              <span className="text-[13px] font-semibold px-3.5 py-2 rounded-md border border-(--pg-gray-300) text-(--pg-gray-700)">
                Teilen
              </span>
              <span className="text-[13px] font-semibold text-(--pg-brand-700) underline underline-offset-2">Details</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="rounded-lg p-4 bg-(--pg-brand-50) border border-(--pg-brand-200)">
              <div className="text-[13px] font-bold text-(--pg-brand-900) mb-0.5">Hinweis</div>
              <div className="text-[13px] leading-[1.6] text-(--pg-brand-800)">
                Hintergrund brand-50, Rahmen brand-200, Text brand-800.
              </div>
            </div>
            <div className="rounded-lg p-4 bg-(--pg-gray-900)">
              <div className="text-[13px] font-bold text-(--pg-gray-50) mb-0.5">Dunkle Fläche</div>
              <div className="text-[13px] leading-[1.6] text-(--pg-gray-400)">
                gray-900 als Fläche, gray-400 für Nebentext, <span className="text-(--pg-brand-300) font-semibold">brand-300</span> als Akzent.
              </div>
            </div>
          </div>
        </div>
        <p className="text-[13px] leading-[1.6] text-(--text-tertiary) mt-3 mb-0">
          Button: brand-{buttonStep} mit {buttonText.isWhite ? "weißem" : "dunklem"} Text ({buttonText.ratio.toFixed(1)}:1) ·
          Badge: brand-800 auf brand-100 ({badgeRatio.toFixed(1)}:1) ·
          Weiß auf brand-500: {contrastRatio(shade(brand, 500).rgb, WHITE).toFixed(1)}:1
        </p>
      </div>

      {/* Code */}
      <div className="p-6 pb-0">
        <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-3">
          Dein Farbsystem als CSS — live aus den Reglern
        </div>
        <CodeBlock language={`CSS — ${mode === "oklch" ? "OKLCH" : "HSL"}`} code={toCss(brand, gray, mode)} />
      </div>
    </div>
  );
}
