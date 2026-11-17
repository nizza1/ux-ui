import { useState } from "react";
import { RangeField } from "~/components/ui/RangeField";
import {
  describeHue,
  describeLightness,
  describeSaturation,
  hslToRgb,
  readableOn,
  rgbToHex,
  rgbToOklch,
} from "~/utils/color";

const LIGHTNESS_STRIP = [95, 85, 75, 65, 55, 45, 35, 25, 15];

/**
 * HSL Color Lab — drei Regler, eine Farbe.
 * Zeigt dieselbe Farbe gleichzeitig in HSL, HEX, RGB und OKLCH und übersetzt
 * die drei HSL-Werte in Alltagssprache ("Türkis · kräftig · dunkel").
 */
export function HslColorLab() {
  const [h, setH] = useState(178);
  const [s, setS] = useState(84);
  const [l, setL] = useState(35);

  const rgb = hslToRgb(h, s, l);
  const hex = rgbToHex(rgb);
  const text = readableOn(rgb);
  const [okL, okC, okH] = rgbToOklch(rgb);

  const formats = [
    { label: "HSL", value: `hsl(${h} ${s}% ${l}%)` },
    { label: "HEX", value: hex },
    { label: "RGB", value: `rgb(${rgb.join(" ")})` },
    { label: "OKLCH", value: `oklch(${(okL * 100).toFixed(1)}% ${okC.toFixed(3)} ${okH.toFixed(0)})` },
  ];

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl shadow-(--shadow-sm) mb-6 overflow-hidden">
      <div className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        {/* Farbfläche */}
        <div
          className="min-h-56 p-6 flex flex-col justify-between transition-colors duration-100"
          style={{ background: hex, color: text.color }}
        >
          <span className="font-mono text-[10px] font-semibold tracking-[2px] uppercase opacity-80">
            Aktuelle Farbe
          </span>
          <div>
            <div className="text-[44px] font-extrabold leading-none tracking-[-1px]">Aa</div>
            <div className="text-[15px] font-semibold mt-3">
              {describeHue(h)} · {describeSaturation(s)} · {describeLightness(l)}
            </div>
            <div className="text-[13px] mt-1 opacity-85">
              {text.isWhite ? "Weißer" : "Dunkler"} Text darauf: {text.ratio.toFixed(1)}:1
            </div>
          </div>
        </div>

        {/* Regler */}
        <div className="p-6 flex flex-col gap-5">
          <RangeField
            label="Hue — Farbton"
            value={h}
            min={0}
            max={360}
            display={`${h}°`}
            onChange={setH}
            track={`linear-gradient(to right, ${[0, 60, 120, 180, 240, 300, 360]
              .map((deg) => `hsl(${deg} ${s}% ${l}%)`)
              .join(", ")})`}
          />
          <RangeField
            label="Saturation — Sättigung"
            value={s}
            min={0}
            max={100}
            display={`${s}%`}
            onChange={setS}
            track={`linear-gradient(to right, hsl(${h} 0% ${l}%), hsl(${h} 100% ${l}%))`}
          />
          <RangeField
            label="Lightness — Helligkeit"
            value={l}
            min={0}
            max={100}
            display={`${l}%`}
            onChange={setL}
            track={`linear-gradient(to right, hsl(${h} ${s}% 0%), hsl(${h} ${s}% 50%), hsl(${h} ${s}% 100%))`}
          />

          <div>
            <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-2">
              Gleicher Farbton, gleiche Sättigung — nur Lightness
            </div>
            <div className="flex gap-1">
              {LIGHTNESS_STRIP.map((value) => {
                const active = Math.abs(value - l) <= 5;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setL(value)}
                    aria-label={`Lightness auf ${value}% setzen`}
                    className={`flex-1 h-9 rounded-md cursor-pointer border transition-transform duration-100 hover:-translate-y-0.5 ${
                      active ? "border-(--text-primary) ring-2 ring-(--text-primary)/20" : "border-black/10"
                    }`}
                    style={{ background: `hsl(${h} ${s}% ${value}%)` }}
                  />
                );
              })}
            </div>
            <p className="text-[13px] leading-[1.6] text-(--text-tertiary) mt-2 mb-0">
              Klick auf ein Feld: Das ist bereits eine Farbfamilie — die Rohform jeder Abstufungs-Skala.
            </p>
          </div>
        </div>
      </div>

      {/* Dieselbe Farbe in vier Schreibweisen */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-(--bg-elevated) border-t border-(--bg-elevated)">
        {formats.map((format) => (
          <div key={format.label} className="p-4 bg-(--bg-surface)">
            <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-1">
              {format.label}
            </div>
            <div className="font-mono text-[13px] font-semibold text-(--text-primary) wrap-break-word">{format.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
