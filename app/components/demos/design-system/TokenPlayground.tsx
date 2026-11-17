import { useState } from "react";
import type { CSSProperties } from "react";
import { SegmentedControl } from "~/components/ui/SegmentedControl";
import { buildGrayRamp, buildRamp, type Shade } from "~/utils/color";
import { elevationShadow } from "~/utils/elevation";

/* ── Ebene 1: Global Tokens (rohe Werte, ändern sich nie) ── */

type Brand = "indigo" | "teal" | "rose" | "green";
type Radius = "sharp" | "soft" | "round";
type Density = "compact" | "comfortable";
type Theme = "light" | "dark";

const BRANDS: Record<Brand, { label: string; ramp: Shade[] }> = {
  indigo: { label: "Indigo", ramp: buildRamp(245, 85, "oklch") },
  teal: { label: "Türkis", ramp: buildRamp(178, 90, "oklch") },
  rose: { label: "Rose", ramp: buildRamp(345, 85, "oklch") },
  green: { label: "Grün", ramp: buildRamp(150, 75, "oklch") },
};
const GRAY = buildGrayRamp(245, 6, "oklch");

const SPACE: Record<string, string> = { "3": "12px", "4": "16px", "5": "20px", "6": "24px", "2": "8px" };
const RADIUS: Record<string, string> = { xs: "2px", sm: "4px", md: "8px", lg: "12px", xl: "20px", full: "999px" };

const hexOf = (ramp: Shade[], step: number) => ramp.find((s) => s.step === step)!.hex;

/* ── Ebene 2: Alias Tokens (hier fallen die Entscheidungen) ── */

interface Alias {
  name: string;
  /** So steht es im Code: Verweis auf ein Global Token */
  ref: string;
  /** Aufgelöster Wert für die Vorschau */
  value: string;
}

interface Settings {
  brand: Brand;
  radius: Radius;
  density: Density;
  theme: Theme;
}

const DEFAULTS: Settings = { brand: "indigo", radius: "soft", density: "comfortable", theme: "light" };

function resolveAliases({ brand, radius, density, theme }: Settings): Alias[] {
  const ramp = BRANDS[brand].ramp;
  const dark = theme === "dark";
  const color = (name: string, family: string, step: number): Alias => ({
    name,
    ref: `var(--${family}-${step})`,
    value: hexOf(family === "gray" ? GRAY : ramp, step),
  });
  const white = (name: string): Alias => ({ name, ref: "var(--white)", value: "#ffffff" });

  const radii = { sharp: ["xs", "sm"], soft: ["md", "lg"], round: ["full", "xl"] }[radius];
  const space = { compact: ["2", "3", "4", "3"], comfortable: ["3", "5", "6", "4"] }[density];

  return [
    color("color-action", brand, dark ? 400 : 600),
    color("color-action-hover", brand, dark ? 300 : 700),
    color("color-action-subtle", brand, dark ? 950 : 100),
    color("color-action-text", brand, dark ? 300 : 700),
    dark ? color("color-on-action", "gray", 950) : white("color-on-action"),
    color("color-bg", "gray", dark ? 950 : 100),
    dark ? color("color-surface", "gray", 900) : white("color-surface"),
    color("color-border", "gray", dark ? 700 : 200),
    color("color-text", "gray", dark ? 50 : 900),
    color("color-text-muted", "gray", dark ? 400 : 600),
    { name: "radius-control", ref: `var(--radius-${radii[0]})`, value: RADIUS[radii[0]] },
    { name: "radius-surface", ref: `var(--radius-${radii[1]})`, value: RADIUS[radii[1]] },
    {
      name: "space-control",
      ref: `var(--space-${space[0]}) var(--space-${space[1]})`,
      value: `${SPACE[space[0]]} ${SPACE[space[1]]}`,
    },
    { name: "space-card", ref: `var(--space-${space[2]})`, value: SPACE[space[2]] },
    { name: "space-stack", ref: `var(--space-${space[3]})`, value: SPACE[space[3]] },
  ];
}

/* ── Ebene 3: Component Tokens (bleiben immer gleich) ── */
const COMPONENT_LINES = [
  "--button-bg:      var(--color-action);",
  "--button-text:    var(--color-on-action);",
  "--button-radius:  var(--radius-control);",
  "--button-padding: var(--space-control);",
  "--card-bg:        var(--color-surface);",
  "--card-padding:   var(--space-card);",
];

/**
 * Token Playground — vier Schalter, die jeweils nur Alias-Tokens umhängen.
 * Die Vorschau und das Komponenten-CSS bleiben unverändert; rechts sieht man,
 * welche Zeilen sich wirklich geändert haben.
 */
export function TokenPlayground() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const set = <K extends keyof Settings>(key: K) => (value: Settings[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const aliases = resolveAliases(settings);
  const baseline = resolveAliases(DEFAULTS);
  const changed = new Set(aliases.filter((alias, i) => alias.ref !== baseline[i].ref).map((alias) => alias.name));

  const vars: Record<string, string> = { "--ds-elevation-card": elevationShadow(settings.theme === "dark" ? 0 : 1) };
  for (const alias of aliases) vars[`--ds-${alias.name}`] = alias.value;

  const ramp = BRANDS[settings.brand].ramp;

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl shadow-(--shadow-sm) mb-6 overflow-hidden">
      {/* Schalter */}
      <div className="p-6 flex flex-wrap gap-x-8 gap-y-5 border-b border-(--bg-elevated)">
        <SegmentedControl
          label="Markenfarbe"
          value={settings.brand}
          onChange={set("brand")}
          options={(Object.keys(BRANDS) as Brand[]).map((key) => ({ value: key, label: BRANDS[key].label }))}
        />
        <SegmentedControl
          label="Ecken"
          value={settings.radius}
          onChange={set("radius")}
          options={[
            { value: "sharp", label: "Eckig" },
            { value: "soft", label: "Weich" },
            { value: "round", label: "Rund" },
          ]}
        />
        <SegmentedControl
          label="Dichte"
          value={settings.density}
          onChange={set("density")}
          options={[
            { value: "compact", label: "Kompakt" },
            { value: "comfortable", label: "Luftig" },
          ]}
        />
        <SegmentedControl
          label="Theme"
          value={settings.theme}
          onChange={set("theme")}
          options={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
          ]}
        />
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Vorschau — nutzt ausschließlich Alias-Tokens */}
        <div
          style={vars as CSSProperties}
          className="p-6 sm:p-8 bg-(--ds-color-bg) transition-colors duration-200 flex items-center justify-center"
        >
          <div className="w-full max-w-90 bg-(--ds-color-surface) border border-(--ds-color-border) rounded-(--ds-radius-surface) p-(--ds-space-card) shadow-(--ds-elevation-card) flex flex-col gap-(--ds-space-stack) transition-all duration-200">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[16px] font-bold text-(--ds-color-text)">Team einladen</span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-(--ds-radius-control) bg-(--ds-color-action-subtle) text-(--ds-color-action-text)">
                Neu
              </span>
            </div>
            <p className="text-[13px] leading-[1.6] text-(--ds-color-text-muted) m-0">
              Lade Kolleginnen und Kollegen per E-Mail ein. Sie erhalten sofort Zugriff auf das Projekt.
            </p>
            <div>
              <div className="text-[13px] font-semibold text-(--ds-color-text) mb-1.5">E-Mail-Adresse</div>
              <div className="text-[13px] text-(--ds-color-text) border-2 border-(--ds-color-action) rounded-(--ds-radius-control) p-(--ds-space-control) bg-(--ds-color-surface)">
                anna@beispiel.de
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[13px] text-(--ds-color-text-muted) mb-1.5">
                <span>Plätze belegt</span>
                <span className="tabular-nums">7 / 10</span>
              </div>
              <div className="h-2 rounded-(--ds-radius-control) bg-(--ds-color-border) overflow-hidden">
                <div className="h-full w-[70%] bg-(--ds-color-action) rounded-(--ds-radius-control)" />
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                className="text-[13px] font-semibold cursor-pointer rounded-(--ds-radius-control) p-(--ds-space-control) bg-(--ds-color-action) text-(--ds-color-on-action) hover:bg-(--ds-color-action-hover) transition-colors duration-150"
              >
                Einladen
              </button>
              <button
                type="button"
                className="text-[13px] font-semibold cursor-pointer rounded-(--ds-radius-control) p-(--ds-space-control) bg-transparent text-(--ds-color-text) border border-(--ds-color-border)"
              >
                Abbrechen
              </button>
            </div>
            <span className="text-[13px] font-semibold text-(--ds-color-action-text) underline underline-offset-2">
              Einladungslink kopieren
            </span>
          </div>
        </div>

        {/* Token-Ebenen als Code */}
        <div className="bg-[#1a1a2e] p-5 overflow-x-auto border-t lg:border-t-0 lg:border-l border-white/8">
          <pre className="m-0 font-mono text-[13px] leading-[1.75] text-[#c8d3f5] whitespace-pre">
            <span className="text-white/40">{"/* 1 · Global — rohe Werte, bleiben unangetastet */\n"}</span>
            {`--${settings.brand}-600: ${hexOf(ramp, 600)};  --${settings.brand}-400: ${hexOf(ramp, 400)};  …\n`}
            {`--gray-50: ${hexOf(GRAY, 50)};  …  --gray-950: ${hexOf(GRAY, 950)};\n`}
            {"--space-2: 8px;  --space-3: 12px;  …  --radius-md: 8px;\n\n"}
            <span className="text-white/40">{"/* 2 · Alias — hier fällt die Entscheidung */\n"}</span>
            {aliases.map((alias) => {
              const isChanged = changed.has(alias.name);
              return (
                <span key={alias.name} className={isChanged ? "text-[#5eead4] font-semibold" : ""}>
                  {`${isChanged ? "●" : " "} --${alias.name}:`.padEnd(26)}
                  {alias.ref};{"\n"}
                </span>
              );
            })}
            {"\n"}
            <span className="text-white/40">{"/* 3 · Component — kein einziges Zeichen ändert sich */\n"}</span>
            {COMPONENT_LINES.map((line) => `  ${line}\n`).join("")}
          </pre>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-(--bg-elevated) text-[13px] leading-[1.6] text-(--text-secondary)">
        {changed.size === 0 ? (
          <>Ausgangszustand. Stell einen Schalter um und beobachte die markierten Zeilen rechts.</>
        ) : (
          <>
            <strong className="font-semibold text-(--text-primary)">
              {changed.size} Alias-{changed.size === 1 ? "Zeile" : "Zeilen"} umgehängt
            </strong>{" "}
            (mit ● markiert) — Global Tokens: 0 Änderungen, Komponenten-CSS: 0 Änderungen. Das gesamte Interface
            folgt trotzdem.
          </>
        )}
      </div>
    </div>
  );
}
