import { useState } from "react";
import type { CSSProperties } from "react";
import { SegmentedControl } from "~/components/ui/SegmentedControl";
import {
  darkSurfaceColor,
  ELEVATION_LEVELS,
  ELEVATION_USAGE,
  elevationShadow,
  overlayAlpha,
  SHADOW_LAYERS,
  shadowLayers,
  type ElevationLevel,
  type ShadowLayer,
} from "~/utils/elevation";

const LAYER_DOT: Record<ShadowLayer, string> = {
  umbra: "bg-[#f97066]",
  penumbra: "bg-[#fdb022]",
  ambient: "bg-[#53b1fd]",
};
const LAYER_TEXT: Record<ShadowLayer, string> = {
  umbra: "text-[#fda29b]",
  penumbra: "text-[#fec84b]",
  ambient: "text-[#84caff]",
};

/**
 * Elevation Lab — das Elevation-System von Material UI zum Anfassen.
 * Stufe wählen, Schatten-Ebenen einzeln abschalten, Light/Dark vergleichen.
 * Die Bühne hat bewusst feste Farben (Material-Standard), unabhängig vom Workshop-Theme.
 */
export function ElevationLab() {
  const [level, setLevel] = useState<ElevationLevel>(4);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [enabled, setEnabled] = useState<Record<ShadowLayer, boolean>>({
    umbra: true,
    penumbra: true,
    ambient: true,
  });

  const dark = theme === "dark";
  const layers = shadowLayers(level);
  const alpha = overlayAlpha(level);
  const overlay = `rgb(255 255 255 / ${alpha})`;

  const lastActive = [...SHADOW_LAYERS].reverse().find((layer) => enabled[layer.key])?.key;

  const paperStyle: CSSProperties = {
    boxShadow: elevationShadow(level, enabled),
    backgroundColor: dark ? "#121212" : "#ffffff",
    backgroundImage: dark && level > 0 ? `linear-gradient(${overlay}, ${overlay})` : "none",
    color: dark ? "#ffffff" : "rgba(0,0,0,0.87)",
  };

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl shadow-(--shadow-sm) mb-6 overflow-hidden">
      {/* Steuerung */}
      <div className="p-6 flex flex-wrap items-end justify-between gap-5 border-b border-(--bg-elevated)">
        <SegmentedControl
          label="Elevation-Stufe"
          value={level}
          onChange={setLevel}
          options={ELEVATION_LEVELS.map((value) => ({ value, label: String(value) }))}
        />
        <SegmentedControl
          label="Bühne"
          value={theme}
          onChange={setTheme}
          options={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
          ]}
        />
      </div>

      <div className="grid lg:grid-cols-2">
        {/* Bühne */}
        <div
          className={`min-h-80 flex items-center justify-center p-10 transition-colors duration-300 ${
            dark ? "bg-[#121212]" : "bg-[#eef0f3]"
          }`}
        >
          <div
            className="w-full max-w-64 min-h-40 rounded-lg p-5 flex flex-col justify-between transition-[box-shadow,background-image] duration-300"
            style={paperStyle}
          >
            <code className="font-mono text-[13px] opacity-70">elevation={`{${level}}`}</code>
            <div>
              <div className="text-[34px] font-extrabold leading-none tracking-[-1px]">
                {level}
                <span className="text-[15px] font-semibold opacity-60 ml-1">dp</span>
              </div>
              <div className="text-[13px] leading-[1.5] mt-2 opacity-80">{ELEVATION_USAGE[level]}</div>
            </div>
          </div>
        </div>

        {/* Zerlegung */}
        <div className="p-6 flex flex-col gap-5 border-t lg:border-t-0 lg:border-l border-(--bg-elevated)">
          <div>
            <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-3">
              Ein Schatten = drei Ebenen
            </div>
            <div className="flex flex-col gap-3">
              {SHADOW_LAYERS.map((layer) => (
                <label key={layer.key} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled[layer.key]}
                    onChange={(e) => setEnabled((prev) => ({ ...prev, [layer.key]: e.target.checked }))}
                    className="mt-1 size-4 accent-(--accent) cursor-pointer shrink-0"
                  />
                  <span className="flex-1">
                    <span className="flex items-center gap-2 text-[14px] font-bold text-(--text-primary)">
                      <span className={`size-2 rounded-full ${LAYER_DOT[layer.key]}`} />
                      {layer.name}
                      <span className="font-mono text-[13px] font-medium text-(--text-tertiary)">
                        {Math.round(layer.opacity * 100)} % Schwarz
                      </span>
                    </span>
                    <span className="block text-[13px] leading-[1.5] text-(--text-secondary)">{layer.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-(--bg-elevated) bg-(--bg-base) p-4">
            <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-1">
              {dark ? "Dark Mode — Fläche wird heller" : "Light Mode — Schatten trägt die Höhe"}
            </div>
            <div className="text-[13px] leading-[1.6] text-(--text-secondary)">
              {dark ? (
                level === 0 ? (
                  <>Stufe 0 liegt auf dem Hintergrund (#121212) — keine Aufhellung.</>
                ) : (
                  <>
                    Weiße Überlagerung mit{" "}
                    <strong className="font-semibold text-(--text-primary)">{(alpha * 100).toFixed(1)} %</strong> Deckkraft
                    → aus #121212 wird{" "}
                    <strong className="font-semibold text-(--text-primary)">{darkSurfaceColor(level)}</strong>. Der
                    Schatten ist auf Schwarz kaum zu sehen; die Helligkeit zeigt die Höhe.
                  </>
                )
              ) : (
                <>
                  Die Fläche bleibt weiß. Je höher die Stufe, desto größer Versatz und Unschärfe — der Schatten wird
                  weicher und breiter, nicht einfach dunkler.
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ergebnis als CSS */}
      <div className="bg-[#1a1a2e] p-5 overflow-x-auto border-t border-white/8">
        <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-white/45 mb-3">
          CSS für elevation={`{${level}}`} · {dark ? "Dark" : "Light"}
        </div>
        <pre className="m-0 font-mono text-[13px] leading-[1.8] text-[#c8d3f5] whitespace-pre">
          {layers ? (
            <>
              <span>box-shadow:{"\n"}</span>
              {SHADOW_LAYERS.map((layer) => (
                <span
                  key={layer.key}
                  className={enabled[layer.key] ? LAYER_TEXT[layer.key] : "text-white/25 line-through"}
                >
                  {"  "}
                  {layers[layer.key]}
                  {layer.key === lastActive ? ";" : ","}
                  <span className="text-white/35 no-underline">{`  /* ${layer.name} */`}</span>
                  {"\n"}
                </span>
              ))}
            </>
          ) : (
            <span>box-shadow: none;{"\n"}</span>
          )}
          {dark && level > 0 && (
            <span>
              background-color: #121212;{"\n"}
              background-image: linear-gradient({overlay}, {overlay});
            </span>
          )}
          {dark && level === 0 && <span>background-color: #121212;</span>}
          {!dark && <span>background-color: #ffffff;</span>}
        </pre>
      </div>
    </div>
  );
}

/**
 * Elevation reagiert auf Zustände: Hover hebt an, Drücken hebt weiter an.
 * Werte wie in Material UI: Button 2 → 4 → 8, anklickbare Card 1 → 8.
 */
export function ElevationStates() {
  const vars = {
    "--e1": elevationShadow(1),
    "--e2": elevationShadow(2),
    "--e4": elevationShadow(4),
    "--e8": elevationShadow(8),
  } as CSSProperties;

  return (
    <div
      style={vars}
      className="rounded-2xl border border-(--bg-elevated) bg-[#eef0f3] p-8 mb-6 grid gap-8 sm:grid-cols-2 items-center"
    >
      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          className="px-5 py-2.5 rounded-md bg-[#1976d2] text-white text-[14px] font-semibold tracking-[0.3px] uppercase cursor-pointer shadow-(--e2) hover:shadow-(--e4) hover:bg-[#1565c0] active:shadow-(--e8) transition-[box-shadow,background-color] duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]"
        >
          Speichern
        </button>
        <div className="text-center">
          <div className="font-mono text-[13px] font-semibold text-[#1c2530]">Ruhe 2 → Hover 4 → Gedrückt 8</div>
          <div className="text-[13px] text-[#4a5565]">Fahr mit der Maus drüber und halte gedrückt.</div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4">
        <div
          tabIndex={0}
          className="w-full max-w-60 rounded-lg bg-white p-4 cursor-pointer shadow-(--e1) hover:shadow-(--e8) focus-visible:shadow-(--e8) transition-shadow duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]"
        >
          <div className="text-[14px] font-bold text-[#1c2530]">Projekt Aurora</div>
          <div className="text-[13px] leading-[1.5] text-[#4a5565]">Anklickbare Karte — hebt sich bei Hover an.</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-[13px] font-semibold text-[#1c2530]">Ruhe 1 → Hover 8</div>
          <div className="text-[13px] text-[#4a5565]">Die Bewegung dauert 250 ms — auch das ist ein Token.</div>
        </div>
      </div>
    </div>
  );
}
