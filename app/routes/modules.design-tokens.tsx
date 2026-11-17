import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ArrowDown, ArrowRight, Languages, MapPin } from "lucide-react";
import { modules } from "~/data/modules";
import { Badge } from "~/components/ui/Badge";
import { ModuleMeta } from "~/components/ui/ModuleMeta";
import { LearningGoals } from "~/components/ui/LearningGoals";
import { BuildsOn } from "~/components/ui/BuildsOn";
import { InsightRow } from "~/components/ui/InsightRow";
import { RuleBox } from "~/components/ui/RuleBox";
import { ReferenceBox } from "~/components/ui/ReferenceBox";
import { TheoryCard } from "~/components/ui/TheoryCard";
import { ConceptList, ConceptItem } from "~/components/ui/ConceptList";
import { ComparisonPanel } from "~/components/ui/ComparisonPanel";
import { AnnotationGrid } from "~/components/ui/AnnotationGrid";
import { ExplanationBox } from "~/components/ui/ExplanationBox";
import { ExerciseBlock } from "~/components/ui/ExerciseBlock";
import { CodeBlock } from "~/components/ui/CodeBlock";
import { ModuleRef } from "~/components/ui/ModuleRef";
import { ModuleNav } from "~/routes/modules.$slug";
import { LiveEditor } from "~/components/live-editor/LiveEditor";
import { TokenPlayground } from "~/components/demos/design-system/TokenPlayground";
import { ElevationLab, ElevationStates } from "~/components/demos/design-system/ElevationLab";
import { buildGrayRamp, buildRamp, type Shade } from "~/utils/color";
import { darkSurfaceColor, ELEVATION_LEVELS, elevationShadow, overlayAlpha } from "~/utils/elevation";

export const meta: MetaFunction = () => [
  { title: "Design Systems & Tokens — UX/UI Workshop" },
  {
    name: "description",
    content:
      "Design Tokens als gemeinsame Sprache — Global, Alias und Component Tokens, Elevation als System nach dem Vorbild von Material UI, Theming und Dark Mode",
  },
];

export function loader() {
  const moduleIndex = modules.findIndex((m) => m.slug === "design-tokens");
  const prevModule = moduleIndex > 0 ? modules[moduleIndex - 1] : null;
  const nextModule = moduleIndex < modules.length - 1 ? modules[moduleIndex + 1] : null;
  return { prevModule, nextModule };
}

/* ── Wiederkehrende Text-Stile (wie in Modul 04 und 07) ── */
const EYEBROW = "font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block";
const H2 = "text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0";
const H3 = "text-[15px] font-bold leading-[1.4] text-(--text-primary) mt-8 mb-2";
const P = "text-[14px] leading-[1.7] text-(--text-secondary) mb-4 mt-0";
const STRONG = "font-semibold text-(--text-primary)";
const CODE = "font-mono text-[13px] bg-(--bg-elevated) px-1 rounded";
const CAPTION = "text-[13px] leading-[1.6] text-(--text-tertiary) m-0";
const MICRO = "font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost)";
const HR = "border-0 border-t border-(--bg-elevated) my-10";
const CARD = "bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl shadow-(--shadow-sm)";
const SNIPPET = "m-0 font-mono text-[13px] leading-[1.7] text-(--text-primary) whitespace-pre overflow-x-auto";

/* ── Daten für die Abbildungen ── */
const BRAND = buildRamp(245, 85, "oklch");
const GRAY = buildGrayRamp(245, 6, "oklch");
const hexOf = (ramp: Shade[], step: number) => ramp.find((s) => s.step === step)!.hex;

const LAYERS = [
  {
    level: "Ebene 1 · Global",
    question: "Was gibt es?",
    token: "--indigo-600",
    value: hexOf(BRAND, 600),
    text: "Ein roher Wert ohne Bedeutung. Die komplette Palette, alle Abstände, alle Radien — der Vorrat, aus dem du schöpfst.",
  },
  {
    level: "Ebene 2 · Alias",
    question: "Wofür ist es da?",
    token: "--color-action",
    value: "var(--indigo-600)",
    text: "Eine Rolle. Der Name sagt, wozu der Wert dient — nicht, wie er aussieht. Hier fallen Marken- und Theme-Entscheidungen.",
  },
  {
    level: "Ebene 3 · Component",
    question: "Wo wird es benutzt?",
    token: "--button-bg",
    value: "var(--color-action)",
    text: "Eine konkrete Stelle in einer Komponente. Erlaubt Varianten, ohne das Komponenten-CSS anzufassen.",
  },
];

const MUI_THEME = [
  { key: "palette", what: "Farben mit Rollen: primary, secondary, error, warning, info, success — je main, light, dark, contrastText", sample: "primary.main → #1976d2" },
  { key: "typography", what: "Schriftfamilie und feste Stile: h1–h6, body1, body2, button, caption, overline", sample: "body1 → 1rem (16px)" },
  { key: "spacing", what: "Ein Raster statt freier Pixelwerte", sample: "theme.spacing(2) → 16px" },
  { key: "shape", what: "Eckenradius für alle Komponenten", sample: "borderRadius → 4px" },
  { key: "shadows", what: "25 Elevation-Stufen (0–24)", sample: "shadows[8] → Menu" },
  { key: "zIndex", what: "Feste Reihenfolge der Ebenen", sample: "modal → 1300" },
  { key: "transitions", what: "Dauer und Beschleunigungskurven", sample: "duration.standard → 300ms" },
  { key: "breakpoints", what: "Umbruchpunkte für Responsive Design", sample: "md → 900px" },
];

const Z_INDEX = [
  { name: "tooltip", value: 1500 },
  { name: "snackbar", value: 1400 },
  { name: "modal", value: 1300 },
  { name: "drawer", value: 1200 },
  { name: "appBar", value: 1100 },
  { name: "fab", value: 1050 },
];

const USAGE_GROUPS = [
  { levels: "0–1", title: "Ruhender Inhalt", text: "Seitenfläche, Cards, Listen. Liegt auf oder knapp über dem Hintergrund und bleibt dort." },
  { levels: "2–4", title: "Bedienelemente & Leisten", text: "Buttons (2) und App Bar (4). Dauerhaft sichtbar, aber klar über dem Inhalt, der darunter durchscrollt." },
  { levels: "6–8", title: "Schwebendes & Kurzlebiges", text: "Floating Action Button und Snackbar (6), Menüs und Popover (8). Erscheint über allem Inhalt und verschwindet wieder." },
  { levels: "16–24", title: "Ebenen, die alles andere verdrängen", text: "Drawer (16) und Dialog (24). Brauchen volle Aufmerksamkeit — nichts darf darüber liegen." },
];

const THEME_ROWS = [
  { token: "--color-bg", light: ["gray-100", hexOf(GRAY, 100)], dark: ["gray-950", hexOf(GRAY, 950)] },
  { token: "--color-surface", light: ["white", "#ffffff"], dark: ["gray-900", hexOf(GRAY, 900)] },
  { token: "--color-border", light: ["gray-200", hexOf(GRAY, 200)], dark: ["gray-700", hexOf(GRAY, 700)] },
  { token: "--color-text", light: ["gray-900", hexOf(GRAY, 900)], dark: ["gray-50", hexOf(GRAY, 50)] },
  { token: "--color-text-muted", light: ["gray-600", hexOf(GRAY, 600)], dark: ["gray-400", hexOf(GRAY, 400)] },
  { token: "--color-action", light: ["indigo-600", hexOf(BRAND, 600)], dark: ["indigo-400", hexOf(BRAND, 400)] },
  { token: "--color-on-action", light: ["white", "#ffffff"], dark: ["gray-950", hexOf(GRAY, 950)] },
];

const SMELL_BAD = `.card {
  padding: 22px;
  border-radius: 9px;
  border: 1px solid #e3e5e8;
  box-shadow: 0 3px 9px rgba(0,0,0,.13);
}
.plan {
  padding: 11px 14px;
  border-radius: 7px;
  border: 1px solid #dfe2e6;
}
.button {
  background: #3b83f7;
  border-radius: 6px;
}
.price { color: #3a81f5; }`;

const SMELL_GOOD = `.card {
  padding: var(--space-6);
  border-radius: var(--radius-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--elevation-1);
}
.plan {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-control);
  border: 1px solid var(--color-border);
}
.button {
  background: var(--color-action);
  border-radius: var(--radius-control);
}
.price { color: var(--color-action-text); }`;

const ELEVATION_CSS = `:root {
  /* Elevation-Stufen — Werte nach Material Design (1, 4, 8, 16, 24 dp).
     Jede Stufe: Umbra, Penumbra, Ambient. */
  --elevation-0: none;
  --elevation-1: ${elevationShadow(1)};
  --elevation-2: ${elevationShadow(4)};
  --elevation-3: ${elevationShadow(8)};
  --elevation-4: ${elevationShadow(16)};
  --elevation-5: ${elevationShadow(24)};

  /* Flächen: im Light Theme sind alle Ebenen weiß — der Schatten trägt die Höhe */
  --surface-0: #f4f5f7;
  --surface-1: #ffffff;
  --surface-2: #ffffff;
  --surface-3: #ffffff;
  --surface-4: #ffffff;
  --surface-5: #ffffff;

  /* Ebenen-Reihenfolge gehört dazu: höher = weiter vorne */
  --z-sticky: 1100;
  --z-drawer: 1200;
  --z-overlay: 1300;   /* Menüs, Popover, Dialoge */
  --z-toast: 1400;
  --z-tooltip: 1500;
}

[data-theme="dark"] {
  /* Dark: Die Fläche wird mit jeder Stufe heller — der Schatten bleibt, trägt aber kaum */
  --surface-0: #121212;
  --surface-1: color-mix(in srgb, white ${(overlayAlpha(1) * 100).toFixed(1)}%, #121212);
  --surface-2: color-mix(in srgb, white ${(overlayAlpha(4) * 100).toFixed(1)}%, #121212);
  --surface-3: color-mix(in srgb, white ${(overlayAlpha(8) * 100).toFixed(1)}%, #121212);
  --surface-4: color-mix(in srgb, white ${(overlayAlpha(16) * 100).toFixed(1)}%, #121212);
  --surface-5: color-mix(in srgb, white ${(overlayAlpha(24) * 100).toFixed(1)}%, #121212);
}

/* Komponenten verweisen auf die Stufe — nie auf Schatten-Werte */
.card   { background: var(--surface-1); box-shadow: var(--elevation-1); }
.menu   { background: var(--surface-3); box-shadow: var(--elevation-3); z-index: var(--z-overlay); }
.dialog { background: var(--surface-5); box-shadow: var(--elevation-5); z-index: var(--z-overlay); }

/* Zustände heben an */
.card.clickable { transition: box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1); }
.card.clickable:hover { box-shadow: var(--elevation-3); }`;

const EXERCISE_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<style>
  /* TODO 1 — Global Tokens: rohe Werte.
     Farben (gray-…, blue-…), Spacing (4/8/12/16/24), Radius, Elevation 1–3. */
  /* TODO 2 — Alias Tokens: Rollen, die auf Global Tokens verweisen.
     --color-bg, --color-surface, --color-border, --color-text,
     --color-text-muted, --color-action, --color-on-action, --radius-control … */
  :root {

  }

  /* TODO 5 — Dark Theme: hier NUR Alias-Tokens überschreiben. */
  [data-theme="dark"] {

  }

  * { box-sizing: border-box; margin: 0; }
  body { font-family: system-ui, sans-serif; background: #f3f4f6; padding: 28px; }

  /* TODO 3 — Ersetze unten jeden festen Wert durch ein Token.
     TODO 4 — Elevation: Card = Stufe 1, Menü = Stufe 3, Button-Hover = Stufe 2. */
  .card { max-width: 380px; background: #ffffff; border: 1px solid #e3e5e8;
          border-radius: 9px; padding: 22px; box-shadow: 0 3px 9px rgba(0,0,0,0.13); }
  .card-title { font-size: 17px; font-weight: 700; color: #1a1d23; margin-bottom: 5px; }
  .card-text  { font-size: 14px; line-height: 1.5; color: #6a7080; margin-bottom: 18px; }

  .plan { display: flex; justify-content: space-between; align-items: center;
          padding: 11px 14px; border: 1px solid #dfe2e6; border-radius: 7px;
          margin-bottom: 9px; font-size: 14px; color: #1b1e24; }
  .plan.active { border-color: #3b82f6; background: #eef4ff; }
  .plan-price  { font-weight: 700; color: #3a81f5; }

  .actions { display: flex; gap: 10px; margin-top: 19px; }
  .button { font: inherit; font-size: 14px; font-weight: 600; padding: 9px 17px;
            border-radius: 6px; border: none; background: #3b83f7; color: #ffffff;
            box-shadow: 0 1px 2px rgba(0,0,0,0.2); cursor: pointer; }
  .button:hover { background: #2f6fe0; box-shadow: 0 3px 7px rgba(0,0,0,0.25); }
  .button.ghost { background: transparent; color: #50586a;
                  border: 1px solid #dde0e5; box-shadow: none; }

  .menu { margin-top: 16px; width: 210px; background: #ffffff; border-radius: 8px;
          padding: 6px; box-shadow: 0 6px 20px rgba(0,0,0,0.18); font-size: 14px; }
  .menu div { padding: 8px 10px; border-radius: 5px; color: #22262e; }
  .menu div:first-child { background: #f0f2f5; }
</style>
</head>
<!-- Zum Testen von TODO 5: <body data-theme="dark"> -->
<body>
  <div class="card">
    <div class="card-title">Tarif wählen</div>
    <div class="card-text">Du kannst jederzeit wechseln oder kündigen.</div>
    <div class="plan"><span>Starter</span><span class="plan-price">0 €</span></div>
    <div class="plan active"><span>Team</span><span class="plan-price">12 €</span></div>
    <div class="actions">
      <button class="button">Weiter</button>
      <button class="button ghost">Abbrechen</button>
    </div>
  </div>
  <div class="menu">
    <div>Monatlich zahlen</div>
    <div>Jährlich zahlen</div>
  </div>
</body>
</html>`;

const SOLUTION_CSS = `:root {
  /* 1 · Global — rohe Werte */
  --white: #ffffff;
  --gray-50: #f8f9fb;   --gray-100: #f1f3f6;  --gray-200: #e2e5ea;
  --gray-400: #9aa1ad;  --gray-600: #535b69;  --gray-700: #3c424d;
  --gray-900: #171a20;  --gray-950: #0c0e12;
  --blue-50: #eef4ff;   --blue-300: #93b8fd;  --blue-400: #6a9cfb;
  --blue-600: #2563eb;  --blue-700: #1d4fd0;

  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-6: 24px;
  --radius-md: 8px; --radius-lg: 12px;

  --elevation-1: ${elevationShadow(1)};
  --elevation-2: ${elevationShadow(4)};
  --elevation-3: ${elevationShadow(8)};

  /* 2 · Alias — Rollen */
  --color-bg: var(--gray-100);
  --color-surface: var(--white);
  --color-surface-raised: var(--white);
  --color-hover: var(--gray-100);
  --color-border: var(--gray-200);
  --color-text: var(--gray-900);
  --color-text-muted: var(--gray-600);
  --color-action: var(--blue-600);
  --color-action-hover: var(--blue-700);
  --color-action-subtle: var(--blue-50);
  --color-action-text: var(--blue-700);
  --color-on-action: var(--white);
  --radius-control: var(--radius-md);
  --radius-surface: var(--radius-lg);
}

[data-theme="dark"] {
  /* Nur Rollen neu zuordnen — kein Komponenten-CSS */
  --color-bg: var(--gray-950);
  --color-surface: var(--gray-900);
  --color-surface-raised: var(--gray-700);  /* höher = heller */
  --color-hover: var(--gray-700);
  --color-border: var(--gray-700);
  --color-text: var(--gray-50);
  --color-text-muted: var(--gray-400);
  --color-action: var(--blue-400);
  --color-action-hover: var(--blue-300);
  --color-action-subtle: color-mix(in srgb, var(--blue-400) 16%, transparent);
  --color-action-text: var(--blue-300);
  --color-on-action: var(--gray-950);
}

body { background: var(--color-bg); padding: var(--space-6); }

.card { background: var(--color-surface); border: 1px solid var(--color-border);
        border-radius: var(--radius-surface); padding: var(--space-6);
        box-shadow: var(--elevation-1); }
.card-title { color: var(--color-text); margin-bottom: var(--space-1); }
.card-text  { color: var(--color-text-muted); margin-bottom: var(--space-4); }

.plan { padding: var(--space-3) var(--space-4); border: 1px solid var(--color-border);
        border-radius: var(--radius-control); margin-bottom: var(--space-2);
        color: var(--color-text); }
.plan.active { border-color: var(--color-action); background: var(--color-action-subtle); }
.plan-price  { color: var(--color-action-text); }

.actions { gap: var(--space-2); margin-top: var(--space-4); }
.button { padding: var(--space-2) var(--space-4); border-radius: var(--radius-control);
          background: var(--color-action); color: var(--color-on-action);
          box-shadow: var(--elevation-1); transition: box-shadow 200ms; }
.button:hover { background: var(--color-action-hover); box-shadow: var(--elevation-2); }
.button.ghost { background: transparent; color: var(--color-text-muted);
                border: 1px solid var(--color-border); box-shadow: none; }

.menu { background: var(--color-surface-raised); border-radius: var(--radius-control);
        padding: var(--space-1); box-shadow: var(--elevation-3); }
.menu div { padding: var(--space-2) var(--space-3); border-radius: var(--radius-control);
            color: var(--color-text); }
.menu div:first-child { background: var(--color-hover); }`;

const STARTER_CSS = `/* tokens.css — Mini Design System als Startpunkt */

:root {
  /* ── 1 · GLOBAL: rohe Werte ohne Bedeutung ───────────── */
  --white: #ffffff;
${GRAY.map((s) => `  --gray-${s.step}: ${s.hex};`).join("\n")}
${BRAND.filter((s) => [50, 100, 300, 400, 600, 700].includes(s.step)).map((s) => `  --brand-${s.step}: ${s.hex};`).join("\n")}
  --red-600: #d92d20;
  --green-600: #0b8a4b;

  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;
  --space-4: 16px;  --space-6: 24px;  --space-8: 32px;

  --font-size-sm: 13px;  --font-size-md: 15px;
  --font-size-lg: 19px;  --font-size-xl: 24px;

  --radius-sm: 4px;  --radius-md: 8px;  --radius-lg: 12px;  --radius-full: 999px;

  --duration-fast: 150ms;  --duration-base: 250ms;
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);

  --elevation-1: ${elevationShadow(1)};
  --elevation-2: ${elevationShadow(4)};
  --elevation-3: ${elevationShadow(8)};

  /* ── 2 · ALIAS: Rollen — der Name sagt, wofür ───────── */
  --color-bg: var(--gray-100);
  --color-surface: var(--white);
  --color-border: var(--gray-200);
  --color-text: var(--gray-900);
  --color-text-muted: var(--gray-600);
  --color-action: var(--brand-600);
  --color-action-hover: var(--brand-700);
  --color-action-subtle: var(--brand-100);
  --color-on-action: var(--white);
  --color-danger: var(--red-600);
  --color-success: var(--green-600);

  --radius-control: var(--radius-md);
  --radius-surface: var(--radius-lg);
  --space-inset: var(--space-4);
}

/* ── THEME: nur die Rollen werden neu zugeordnet ─────── */
[data-theme="dark"] {
  --color-bg: var(--gray-950);
  --color-surface: var(--gray-900);
  --color-border: var(--gray-700);
  --color-text: var(--gray-50);
  --color-text-muted: var(--gray-400);
  --color-action: var(--brand-400);
  --color-action-hover: var(--brand-300);
  --color-action-subtle: color-mix(in srgb, var(--brand-400) 16%, transparent);
  --color-on-action: var(--gray-950);
}

/* ── 3 · COMPONENT: konkrete Stellen ─────────────────── */
.button {
  --button-bg: var(--color-action);
  --button-bg-hover: var(--color-action-hover);
  --button-text: var(--color-on-action);

  background: var(--button-bg);
  color: var(--button-text);
  padding: var(--space-2) var(--space-inset);
  border-radius: var(--radius-control);
  box-shadow: var(--elevation-1);
  transition: background var(--duration-fast) var(--ease-standard),
              box-shadow var(--duration-base) var(--ease-standard);
}
.button:hover { background: var(--button-bg-hover); box-shadow: var(--elevation-2); }

/* Variante: nur Component Tokens überschreiben — kein neues CSS */
.button.danger { --button-bg: var(--color-danger); --button-bg-hover: var(--color-danger); }

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-surface);
  padding: var(--space-6);
  box-shadow: var(--elevation-1);
}`;

function TokenChip({ token, value }: { token: string; value: string }) {
  return (
    <div className="font-mono text-[13px] leading-[1.6] bg-(--bg-base) border border-(--bg-elevated) rounded-lg px-3 py-2 flex flex-wrap gap-x-2">
      <span className="font-semibold text-(--accent-text)">{token}:</span>
      <span className="text-(--text-primary)">{value}</span>
    </div>
  );
}

export default function DesignTokensModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      <div className="max-w-[1000px] mx-auto w-full px-4 sm:px-8 py-12 flex-1">
        {/* ── TITEL ── */}
        <div className="mb-2">
          <Badge variant="module" dot>Modul 14</Badge>
        </div>
        <h1 className="text-[clamp(28px,4vw,36px)] font-extrabold leading-[1.15] tracking-[-0.5px] text-(--text-primary) mb-2 mt-0">
          Design Systems &amp; Tokens
        </h1>
        <p className="text-[15px] font-medium leading-normal text-(--text-secondary) mb-8 mt-0 max-w-140">
          In den letzten Modulen hast du Skalen für Schrift, Farbe, Abstände und Schatten gebaut. Jetzt verbindest du
          sie zu einem System: benannte Werte, die jede Design-Entscheidung genau einmal festhalten — und sie überall
          verfügbar machen.
        </p>

        <ModuleMeta duration="90 Min." practiceTime="~35 Min." />

        <BuildsOn modules={["typography-systems", "color-systems", "spacing-layout", "shadows-elevation"]} />
        <LearningGoals
          goals={[
            "Erklären, was ein Design System ist — und warum es Konsistenz und Geschwindigkeit zugleich bringt",
            "Die drei Token-Ebenen unterscheiden und anwenden: Global, Alias, Component",
            "Tokens nach ihrer Aufgabe benennen statt nach ihrem Aussehen",
            "Elevation als System aufbauen: Stufen, Komponenten-Zuordnung, Zustände und Dark Mode — nach dem Vorbild von Material UI",
            "Ein Dark Theme umsetzen, indem nur Alias-Tokens neu zugeordnet werden",
            "Fehlende Systeme an Ad-hoc-Werten erkennen und in ein Token-System überführen",
          ]}
        />

        <hr className={HR} />

        {/* ── KERNGEDANKE ── */}
        <p className={EYEBROW}>Kerngedanke</p>
        <InsightRow icon={MapPin} title="Jede Entscheidung hat genau einen Ort">
          Die Markenfarbe steht an einer Stelle, nicht in 140 Dateien. Wer sie ändert, ändert eine Zeile — und jede
          Komponente folgt. Alles, was im Code doppelt vorkommt, läuft früher oder später auseinander.
        </InsightRow>
        <InsightRow icon={Languages} title="Tokens sind Vokabeln — der Name trägt die Bedeutung">
          <code className={CODE}>{hexOf(BRAND, 600)}</code> sagt nichts. <code className={CODE}>--color-action</code> sagt:
          „Darauf kann man klicken." Ein Design System ist eine gemeinsame Sprache zwischen Design und Entwicklung —
          und Tokens sind ihr Wortschatz.
        </InsightRow>

        <hr className={HR} />

        {/* ── WAS IST EIN DESIGN SYSTEM ── */}
        <p className={EYEBROW}>Theorie — Grundlagen</p>
        <h2 className={H2}>Was ist ein Design System?</h2>
        <p className={P}>
          Ein Design System ist die Sammlung aller wiederverwendbaren Gestaltungsentscheidungen eines Produkts — so
          festgehalten, dass Menschen und Code sie benutzen können.{" "}
          <strong className={STRONG}>Es sorgt dafür, dass ein Produkt gleich aussieht und sich gleich verhält, egal
          wer daran arbeitet.</strong> Es besteht aus drei Teilen, die aufeinander aufbauen:
        </p>
        <TheoryCard label="Die drei Bausteine">
          <ConceptList>
            <ConceptItem title="Design Tokens — die Werte">
              Die kleinsten Bausteine: Farben, Abstände, Schriftgrößen, Radien, Schatten, Animationsdauern — jeweils
              als benannte Variable. Tokens sind das Fundament; alles andere bezieht sich auf sie.
            </ConceptItem>
            <ConceptItem title="Komponenten — die Bauteile">
              Buttons, Eingabefelder, Cards, Dialoge. Jede Komponente verwendet ausschließlich Tokens und bringt ihre
              Zustände (Hover, Fokus, Deaktiviert) gleich mit. Wer sie einsetzt, muss nichts neu gestalten.
            </ConceptItem>
            <ConceptItem title="Richtlinien — die Regeln">
              Wann nimmt man welche Komponente? Wie viele Primär-Buttons pro Ansicht? Ohne dokumentierte Regeln wird
              auch die beste Bibliothek falsch benutzt.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <ReferenceBox title="Referenz — Material UI">
          <p>
            <strong>Material UI (MUI)</strong> ist die meistgenutzte React-Umsetzung von Googles Material Design und
            ein gutes Anschauungsobjekt: Das gesamte System steckt in einem einzigen <code>theme</code>-Objekt. Jede
            Komponente liest ihre Werte von dort — nirgends steht ein fester Pixel- oder Farbwert.
          </p>
        </ReferenceBox>

        <div className={`${CARD} mb-6 overflow-hidden`}>
          <div className="px-5 py-3 border-b border-(--bg-elevated)">
            <span className={MICRO}>Was im MUI-Theme steckt — eine Checkliste für dein eigenes System</span>
          </div>
          <div className="divide-y divide-(--bg-elevated)">
            {MUI_THEME.map((row) => (
              <div key={row.key} className="grid sm:grid-cols-[130px_1fr_210px] gap-x-4 gap-y-1 px-5 py-3 items-baseline">
                <code className="font-mono text-[13px] font-semibold text-(--accent-text)">theme.{row.key}</code>
                <span className="text-[13px] leading-[1.5] text-(--text-secondary)">{row.what}</span>
                <code className="font-mono text-[13px] text-(--text-tertiary)">{row.sample}</code>
              </div>
            ))}
          </div>
        </div>

        <hr className={HR} />

        {/* ── TOKEN-EBENEN ── */}
        <p className={EYEBROW}>Theorie — Aufbau</p>
        <h2 className={H2}>Die drei Ebenen von Design Tokens</h2>
        <p className={P}>
          Ein Token-System hat drei Schichten. Jede beantwortet eine andere Frage und verweist auf die Schicht
          darunter. <strong className={STRONG}>Komponenten greifen nie direkt auf rohe Werte zu</strong> — genau das
          macht das System veränderbar.
        </p>

        <div className="grid md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-3 items-stretch mb-6">
          {LAYERS.map((layer, i) => (
            <div key={layer.level} className="contents">
              <div className={`${CARD} p-5 flex flex-col gap-3`}>
                <div>
                  <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--accent)">
                    {layer.level}
                  </div>
                  <div className="text-[15px] font-bold text-(--text-primary) mt-1">{layer.question}</div>
                </div>
                <TokenChip token={layer.token} value={layer.value} />
                <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">{layer.text}</p>
              </div>
              {i < LAYERS.length - 1 && (
                <div className="flex items-center justify-center text-(--text-ghost)">
                  <ArrowRight size={18} className="hidden md:block" />
                  <ArrowDown size={18} className="md:hidden" />
                </div>
              )}
            </div>
          ))}
        </div>

        <AnnotationGrid
          items={[
            { label: "Global", value: "Vorrat · viele Werte" },
            { label: "Alias", value: "Rollen · Theme-Ebene" },
            { label: "Component", value: "Stellen · Varianten" },
          ]}
        />

        <ExplanationBox title="Warum nicht einfach eine Ebene?">
          <p>
            Mit nur Global Tokens steht in 80 Komponenten <code className={CODE}>var(--indigo-600)</code>. Wird die
            Marke grün, heißt die Variable weiterhin „indigo" — oder du ersetzt 80 Stellen. Dark Mode ist so gar nicht
            möglich, denn Indigo-600 ist auf dunklem Grund die falsche Stufe.
          </p>
          <p>
            <strong>Die Alias-Ebene ist die Schaltzentrale:</strong> Hier wird einer Rolle ein Wert zugewiesen — und
            genau hier kann man ihn pro Marke oder Theme austauschen. Für kleine Projekte reichen Global und Alias;
            Component Tokens lohnen sich, sobald Komponenten Varianten bekommen.
          </p>
        </ExplanationBox>

        <h3 className={H3}>Token Playground — vier Schalter, null Zeilen Komponenten-CSS</h3>
        <p className={P}>
          Jeder Schalter hängt nur Alias-Tokens um. Die Karte links ist immer dasselbe HTML mit demselben CSS.
          Beobachte rechts, welche Zeilen sich ändern — und welche nie.
        </p>

        <TokenPlayground />

        <RuleBox>
          Komponenten verwenden Alias- oder Component-Tokens — nie Global Tokens und nie feste Werte. Wenn eine
          Marken- oder Theme-Änderung mehr als die Alias-Ebene berührt, fehlt irgendwo ein Token.
        </RuleBox>

        <hr className={HR} />

        {/* ── BENENNUNG ── */}
        <p className={EYEBROW}>Vergleichsbeispiel 1 von 3</p>
        <h2 className={H2}>Tokens benennen: Aufgabe statt Aussehen</h2>
        <p className={P}>
          Ein guter Token-Name bleibt richtig, wenn sich der Wert ändert. Namen, die das Aussehen beschreiben, werden
          beim ersten Redesign zur Lüge.
        </p>

        <ComparisonPanel
          bad={{
            label: "Vorher — beschreibt das Aussehen",
            children: (
              <div className="flex flex-col gap-3">
                <pre className={SNIPPET}>{`--blue-button: #3b82f6;
--light-gray-2: #e5e7eb;
--big-padding: 22px;
--card-shadow-new: 0 3px 9px …;
--text-dark: #1a1d23;`}</pre>
                <p className={CAPTION}>
                  Was passiert mit --blue-button, wenn die Marke grün wird? Und wofür war light-gray-2 noch mal?
                </p>
              </div>
            ),
          }}
          good={{
            label: "Nachher — beschreibt die Aufgabe",
            children: (
              <div className="flex flex-col gap-3">
                <pre className={SNIPPET}>{`--color-action: var(--blue-600);
--color-border: var(--gray-200);
--space-card: var(--space-6);
--elevation-1: …;
--color-text: var(--gray-900);`}</pre>
                <p className={CAPTION}>
                  Der Name sagt, wo das Token hingehört. Der Wert dahinter darf sich jederzeit ändern.
                </p>
              </div>
            ),
          }}
        />

        <div className={`${CARD} p-6 mb-6`}>
          <div className={`${MICRO} mb-3`}>Namensmuster</div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[14px] font-semibold mb-4">
            <span className="px-3 py-1.5 rounded-md bg-(--accent-dim) border border-(--accent-border) text-(--accent-text)">Kategorie</span>
            <span className="text-(--text-ghost)">–</span>
            <span className="px-3 py-1.5 rounded-md bg-(--info-bg) border border-(--info-border) text-(--info-color)">Rolle</span>
            <span className="text-(--text-ghost)">–</span>
            <span className="px-3 py-1.5 rounded-md bg-(--warning-bg) border border-(--warning-border) text-(--warning-color)">Variante / Zustand</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-2">
            <TokenChip token="--color-text" value="Standardtext" />
            <TokenChip token="--color-text-muted" value="Nebentext" />
            <TokenChip token="--color-action-hover" value="Zustand" />
            <TokenChip token="--space-card" value="Innenabstand" />
            <TokenChip token="--radius-control" value="Buttons, Inputs" />
            <TokenChip token="--elevation-3" value="Menüs" />
          </div>
          <p className={`${CAPTION} mt-4`}>
            Global Tokens dürfen beschreibend sein (--gray-200, --space-4) — sie sind der Vorrat. Erst ab der
            Alias-Ebene muss der Name die Aufgabe nennen.
          </p>
        </div>

        <hr className={HR} />

        {/* ── KATEGORIEN ── */}
        <p className={EYEBROW}>Theorie — Umfang</p>
        <h2 className={H2}>Welche Werte gehören in ein Token-System?</h2>
        <p className={P}>
          Alles, was an mehr als einer Stelle vorkommt und zusammenpassen muss. Die ersten vier Kategorien kennst du
          bereits aus den vorherigen Modulen — hier bekommen sie ihren Platz im System.
        </p>

        <div className={`${CARD} mb-6 overflow-hidden divide-y divide-(--bg-elevated)`}>
          {/* Farbe */}
          <div className="grid sm:grid-cols-[150px_1fr_240px] gap-4 px-5 py-4 items-center">
            <div>
              <div className="text-[14px] font-bold text-(--text-primary)">Farbe</div>
              <div className="text-[13px] text-(--text-tertiary)">Modul 07–09</div>
            </div>
            <div className="text-[13px] leading-[1.5] text-(--text-secondary)">
              Farbfamilien als Vorrat, Rollen wie <code className={CODE}>--color-action</code> als Alias.
            </div>
            <div className="flex gap-1">
              {[100, 300, 500, 600, 800].map((step) => (
                <div key={step} className="flex-1 h-8 rounded-md" style={{ background: hexOf(BRAND, step) }} />
              ))}
            </div>
          </div>
          {/* Spacing */}
          <div className="grid sm:grid-cols-[150px_1fr_240px] gap-4 px-5 py-4 items-center">
            <div>
              <div className="text-[14px] font-bold text-(--text-primary)">Spacing</div>
              <div className="text-[13px] text-(--text-tertiary)">Modul 10</div>
            </div>
            <div className="text-[13px] leading-[1.5] text-(--text-secondary)">
              Eine Skala auf 4/8-px-Basis für Innen- und Außenabstände: <code className={CODE}>--space-1</code> bis{" "}
              <code className={CODE}>--space-8</code>.
            </div>
            <div className="flex items-end gap-1.5">
              {[4, 8, 12, 16, 24, 32].map((size) => (
                <div key={size} className="bg-(--accent) rounded-sm opacity-80" style={{ width: size, height: size }} />
              ))}
            </div>
          </div>
          {/* Typografie */}
          <div className="grid sm:grid-cols-[150px_1fr_240px] gap-4 px-5 py-4 items-center">
            <div>
              <div className="text-[14px] font-bold text-(--text-primary)">Typografie</div>
              <div className="text-[13px] text-(--text-tertiary)">Modul 05–06</div>
            </div>
            <div className="text-[13px] leading-[1.5] text-(--text-secondary)">
              Schriftgrößen, Gewichte und Zeilenhöhen der Type Scale — am besten als fertige Textstile gebündelt.
            </div>
            <div className="flex items-baseline gap-3 text-(--text-primary) font-bold">
              <span className="text-[13px]">Aa</span>
              <span className="text-[15px]">Aa</span>
              <span className="text-[19px]">Aa</span>
              <span className="text-[24px]">Aa</span>
            </div>
          </div>
          {/* Radius */}
          <div className="grid sm:grid-cols-[150px_1fr_240px] gap-4 px-5 py-4 items-center">
            <div>
              <div className="text-[14px] font-bold text-(--text-primary)">Radius</div>
              <div className="text-[13px] text-(--text-tertiary)">Form</div>
            </div>
            <div className="text-[13px] leading-[1.5] text-(--text-secondary)">
              Wenige Stufen. Eckenradien prägen den Charakter einer Marke stärker als fast alles andere.
            </div>
            <div className="flex items-center gap-2">
              {["4px", "8px", "12px", "999px"].map((radius) => (
                <div key={radius} className="size-9 border-2 border-(--accent) bg-(--accent-dim)" style={{ borderRadius: radius }} />
              ))}
            </div>
          </div>
          {/* Elevation */}
          <div className="grid sm:grid-cols-[150px_1fr_240px] gap-4 px-5 py-4 items-center">
            <div>
              <div className="text-[14px] font-bold text-(--text-primary)">Elevation</div>
              <div className="text-[13px] text-(--text-tertiary)">Modul 11</div>
            </div>
            <div className="text-[13px] leading-[1.5] text-(--text-secondary)">
              Höhenstufen statt einzelner Schatten — dazu gleich ein eigener Abschnitt.
            </div>
            <div className="flex items-center gap-3 bg-[#eef0f3] rounded-md px-3 py-2.5">
              {([1, 4, 8, 16] as const).map((level) => (
                <div key={level} className="flex-1 h-8 rounded-sm bg-white" style={{ boxShadow: elevationShadow(level) }} />
              ))}
            </div>
          </div>
          {/* Motion */}
          <div className="grid sm:grid-cols-[150px_1fr_240px] gap-4 px-5 py-4 items-center">
            <div>
              <div className="text-[14px] font-bold text-(--text-primary)">Motion</div>
              <div className="text-[13px] text-(--text-tertiary)">Bewegung</div>
            </div>
            <div className="text-[13px] leading-[1.5] text-(--text-secondary)">
              Dauer und Beschleunigungskurve. Zwei bis drei Dauern genügen: schnell für Hover, langsamer für große
              Flächen.
            </div>
            <div className="flex flex-col gap-1.5">
              {[
                { label: "150ms", width: "40%" },
                { label: "250ms", width: "66%" },
                { label: "375ms", width: "100%" },
              ].map((bar) => (
                <div key={bar.label} className="flex items-center gap-2">
                  <div className="h-1.5 rounded-full bg-(--accent) opacity-80" style={{ width: bar.width }} />
                  <span className="font-mono text-[11px] text-(--text-tertiary) shrink-0">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Z-Index + Breakpoints */}
          <div className="grid sm:grid-cols-[150px_1fr_240px] gap-4 px-5 py-4 items-center">
            <div>
              <div className="text-[14px] font-bold text-(--text-primary)">Z-Index &amp; Breakpoints</div>
              <div className="text-[13px] text-(--text-tertiary)">Struktur</div>
            </div>
            <div className="text-[13px] leading-[1.5] text-(--text-secondary)">
              Benannte Ebenen statt <code className={CODE}>z-index: 9999</code>, feste Umbruchpunkte statt geratener
              Pixelwerte. Achtung: In <code className={CODE}>@media</code>-Bedingungen funktionieren CSS-Variablen
              nicht — Breakpoints dokumentierst du als Konstanten.
            </div>
            <code className="font-mono text-[13px] text-(--text-tertiary)">--z-modal: 1300</code>
          </div>
        </div>

        <hr className={HR} />

        {/* ── ELEVATION ── */}
        <p className={EYEBROW}>Schwerpunkt — Elevation als System</p>
        <h2 className={H2}>Elevation: Höhe ist das Token, der Schatten nur die Folge</h2>
        <p className={P}>
          In Modul 11 hast du gelernt, wie ein glaubwürdiger Schatten entsteht. Für ein System reicht das nicht: Wenn
          jede Komponente ihren eigenen Schatten mitbringt, hast du nach drei Monaten zwanzig verschiedene.{" "}
          <strong className={STRONG}>Ein Elevation-System dreht die Frage um:</strong> Nicht „welcher Schatten sieht
          gut aus?", sondern „wie hoch liegt diese Fläche über der Seite?".
        </p>
        <p className={P}>
          Material Design denkt jede Oberfläche als Blatt Papier, das in einer bestimmten Höhe über dem Hintergrund
          schwebt — gemessen in <strong className={STRONG}>dp</strong> (density-independent pixels). Aus der Höhe
          ergibt sich alles Weitere: wie der Schatten aussieht, wer wen überdeckt und wie die Fläche im Dark Mode
          eingefärbt wird.
        </p>

        <ReferenceBox title="Referenz — Material UI">
          <p>
            In MUI hat jede Fläche die Eigenschaft <code>elevation</code> mit einem Wert von <code>0</code> bis{" "}
            <code>24</code>; der Standard ist <code>1</code>. Dahinter liegt ein Array mit 25 fertigen Schatten
            (<code>theme.shadows</code>). Keine Komponente definiert einen eigenen Schatten — sie nennt nur ihre Stufe.
          </p>
        </ReferenceBox>

        <h3 className={H3}>Elevation Lab — nimm einen Material-Schatten auseinander</h3>
        <p className={P}>
          Wähle eine Stufe und schalte die drei Schatten-Ebenen einzeln ab. Wechsle dann die Bühne auf Dark und
          beobachte, was die Höhe dort sichtbar macht. Die Werte sind die Originalwerte aus dem MUI-Quellcode.
        </p>

        <ElevationLab />

        <ExplanationBox title="Analyse — was du im Lab siehst">
          <p>
            <strong>Drei Ebenen statt zwei.</strong> Modul 11 hat die Zwei-Schatten-Technik gezeigt. Material geht
            einen Schritt weiter und teilt das Hauptlicht in Umbra (harter Kern) und Penumbra (weicher Rand); dazu
            kommt das Umgebungslicht. Alle drei sind reines Schwarz mit fester Deckkraft: 20 %, 14 % und 12 %.
          </p>
          <p>
            <strong>Höher heißt weicher, nicht dunkler.</strong> Die Deckkraft bleibt auf jeder Stufe gleich. Was
            wächst, sind Versatz und Unschärfe — genau wie bei einem echten Gegenstand, den du von der Tischplatte
            anhebst.
          </p>
          <p>
            <strong>Im Dark Mode trägt die Helligkeit.</strong> Ein schwarzer Schatten auf fast schwarzem Grund ist
            unsichtbar. Deshalb legt MUI eine halbtransparente weiße Schicht über die Fläche — je höher, desto
            heller. Stufe 1 bekommt rund 5 %, Stufe 24 gut 16 %.
          </p>
        </ExplanationBox>

        <h3 className={H3}>Die ganze Leiter auf einen Blick</h3>
        <div className="grid gap-4 mb-6">
          {(["light", "dark"] as const).map((mode) => (
            <div
              key={mode}
              className={`rounded-2xl border border-(--bg-elevated) p-5 ${mode === "dark" ? "bg-[#121212]" : "bg-[#eef0f3]"}`}
            >
              <div className={`font-mono text-[10px] font-semibold tracking-[1.5px] uppercase mb-4 ${mode === "dark" ? "text-white/50" : "text-black/50"}`}>
                {mode === "dark" ? "Dark — Fläche wird heller" : "Light — Schatten wird größer"}
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 sm:gap-4">
                {ELEVATION_LEVELS.map((level) => (
                  <div
                    key={level}
                    className={`h-16 rounded-md flex items-center justify-center font-mono text-[13px] font-semibold ${mode === "dark" ? "text-white/85" : "text-black/70"}`}
                    style={{
                      boxShadow: elevationShadow(level),
                      background: mode === "dark" ? darkSurfaceColor(level) : "#ffffff",
                    }}
                  >
                    {level}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <h3 className={H3}>Jede Komponente hat ihre Stufe</h3>
        <p className={P}>
          Der eigentliche Wert des Systems: Niemand entscheidet beim Bauen einer Komponente über Schatten. Die Stufe
          ergibt sich aus der Art der Fläche. <strong className={STRONG}>Je kurzlebiger und je wichtiger eine
          Fläche, desto höher liegt sie.</strong>
        </p>

        <div className={`${CARD} mb-6 overflow-hidden divide-y divide-(--bg-elevated)`}>
          {USAGE_GROUPS.map((group) => (
            <div key={group.levels} className="grid sm:grid-cols-[90px_1fr] gap-x-5 gap-y-1 px-5 py-4 items-baseline">
              <div className="font-mono text-[15px] font-bold text-(--accent-text) tabular-nums">{group.levels}</div>
              <div>
                <div className="text-[14px] font-bold text-(--text-primary)">{group.title}</div>
                <div className="text-[13px] leading-[1.6] text-(--text-secondary)">{group.text}</div>
              </div>
            </div>
          ))}
        </div>

        <h3 className={H3}>Elevation reagiert auf Zustände</h3>
        <p className={P}>
          Höhe ist nicht statisch. Ein Element, das auf den Finger oder die Maus reagiert, kommt dem Nutzer entgegen
          — es hebt sich an. Auch diese Sprünge sind im System festgelegt, nicht pro Komponente erfunden.
        </p>

        <ElevationStates />

        <h3 className={H3}>Elevation ist nicht z-index — aber beide gehören zusammen</h3>
        <p className={P}>
          Elevation bestimmt, wie hoch eine Fläche <em>aussieht</em>. Der z-index bestimmt, welche Fläche technisch
          oben liegt. Ein System legt beides gemeinsam fest, sonst liegt irgendwann ein Tooltip unter einem Dialog.
          MUI vergibt dafür feste, benannte Werte mit Abstand dazwischen:
        </p>

        <div className={`${CARD} p-6 mb-6`}>
          <div className="flex flex-col gap-1.5">
            {Z_INDEX.map((layer, i) => (
              <div
                key={layer.name}
                className="flex items-center justify-between gap-4 rounded-md border border-(--accent-border) bg-(--accent-dim) px-4 py-2"
                style={{ marginLeft: `${i * 4}%`, marginRight: `${(Z_INDEX.length - 1 - i) * 4}%` }}
              >
                <code className="font-mono text-[13px] font-semibold text-(--text-primary)">zIndex.{layer.name}</code>
                <code className="font-mono text-[13px] font-semibold text-(--accent-text) tabular-nums">{layer.value}</code>
              </div>
            ))}
          </div>
          <p className={`${CAPTION} mt-4`}>
            Von vorne nach hinten. Die Abstände von 100 lassen Platz für eigene Ebenen — und niemand schreibt je
            wieder z-index: 9999.
          </p>
        </div>

        <TheoryCard label="Fünf Regeln für dein eigenes Elevation-System">
          <ConceptList>
            <ConceptItem title="Wenige Stufen, feste Bedeutung">
              Fünf bis sechs Stufen genügen. Jede Stufe hat eine Aufgabe — wer eine neue Komponente baut, wählt eine
              Stufe aus und erfindet keinen Schatten.
            </ConceptItem>
            <ConceptItem title="Eine Lichtquelle für alles">
              Alle Schatten fallen in dieselbe Richtung und nutzen dieselbe Farbe und Deckkraft. Nur Versatz und
              Unschärfe ändern sich mit der Höhe.
            </ConceptItem>
            <ConceptItem title="Höhe folgt der Wichtigkeit im Moment">
              Dauerhafter Inhalt liegt flach, Kurzlebiges schwebt, Modales liegt ganz oben. Eine Card ist nie höher
              als ein Dialog.
            </ConceptItem>
            <ConceptItem title="Zustände verändern die Höhe">
              Hover und Drücken heben an, Deaktivieren legt flach. Die Animation dazwischen nutzt deine
              Motion-Tokens.
            </ConceptItem>
            <ConceptItem title="Im Dark Mode: heller statt schattiger">
              Jede Stufe bekommt eine eigene, hellere Flächenfarbe. Den Schatten kannst du behalten — er trennt
              überlappende Flächen noch immer leicht voneinander.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <ReferenceBox title="Referenz — Material Design 3">
          <p>
            Die aktuelle Fassung von Material Design vereinfacht das Modell weiter: statt 25 nur noch{" "}
            <strong>sechs Stufen</strong> (Level 0–5, entsprechend 0, 1, 3, 6, 8 und 12 dp). Außerdem wird Höhe dort
            in beiden Themes vor allem über die <strong>Flächenfarbe</strong> gezeigt, Schatten kommen nur noch
            hinzu, wenn eine Fläche sich wirklich vom Untergrund lösen muss. Für ein eigenes System ist das der
            bessere Startpunkt: Das Code-Beispiel unten kommt mit sechs Stufen aus und gibt jeder eine eigene
            Flächenfarbe.
          </p>
        </ReferenceBox>

        <CodeBlock language="CSS — Elevation-System" code={ELEVATION_CSS} />

        <hr className={HR} />

        {/* ── THEMING ── */}
        <p className={EYEBROW}>Vergleichsbeispiel 2 von 3</p>
        <h2 className={H2}>Theming: Dark Mode ist eine neue Zuordnung, keine Umkehrung</h2>
        <p className={P}>
          Im Playground hast du es schon gesehen: Für ein Dark Theme wird kein Komponenten-CSS angefasst. Es werden
          nur die Alias-Tokens neu belegt. <strong className={STRONG}>Die Rollen bleiben, die Werte dahinter
          wechseln.</strong>
        </p>

        <div className={`${CARD} mb-6 overflow-hidden`}>
          <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-4 px-5 py-3 border-b border-(--bg-elevated)">
            <span className={MICRO}>Alias-Token</span>
            <span className={MICRO}>Light</span>
            <span className={MICRO}>Dark</span>
          </div>
          <div className="divide-y divide-(--bg-elevated)">
            {THEME_ROWS.map((row) => (
              <div key={row.token} className="grid grid-cols-[1.2fr_1fr_1fr] gap-4 px-5 py-2.5 items-center">
                <code className="font-mono text-[13px] font-semibold text-(--text-primary) break-all">{row.token}</code>
                {[row.light, row.dark].map(([name, hex], i) => (
                  <div key={i} className="flex items-center gap-2 min-w-0">
                    <span className="size-5 rounded-md border border-(--text-ghost)/40 shrink-0" style={{ background: hex }} />
                    <code className="font-mono text-[13px] text-(--text-secondary) truncate">{name}</code>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <TheoryCard label="Vier Regeln für Dark Themes">
          <ConceptList>
            <ConceptItem title="Nicht invertieren — neu zuordnen">
              Wer einfach alle Farben umdreht, bekommt grelle Akzente und flache Flächen. Jede Rolle wird einzeln
              neu belegt.
            </ConceptItem>
            <ConceptItem title="Kein reines Schwarz als Hintergrund">
              Material nimmt #121212 statt #000000. Auf Dunkelgrau bleiben Schatten und hellere Flächen
              unterscheidbar, und der Kontrast zu weißem Text wird nicht unangenehm hart.
            </ConceptItem>
            <ConceptItem title="Akzentfarben eine Stufe heller">
              Auf dunklem Grund nimmst du Stufe 300–400 statt 600 — und dunklen statt weißen Text darauf. MUI macht
              es genauso: Die Primärfarbe wechselt im Dark Theme auf einen hellen Blauton.
            </ConceptItem>
            <ConceptItem title="Höhe über Helligkeit">
              Höher liegende Flächen werden heller. Das ist die Dark-Mode-Hälfte deines Elevation-Systems.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <hr className={HR} />

        {/* ── AD-HOC ── */}
        <p className={EYEBROW}>Vergleichsbeispiel 3 von 3</p>
        <h2 className={H2}>Woran du ein fehlendes System erkennst</h2>
        <p className={P}>
          Ad-hoc-Werte sind das Symptom. Du findest sie in fast jedem gewachsenen Projekt — und nach diesem Modul
          wirst du sie nicht mehr übersehen.
        </p>

        <ComparisonPanel
          bad={{
            label: "Vorher — Ad-hoc-Werte",
            children: <pre className={SNIPPET}>{SMELL_BAD}</pre>,
          }}
          good={{
            label: "Nachher — Tokens",
            children: <pre className={SNIPPET}>{SMELL_GOOD}</pre>,
          }}
        />

        <ExplanationBox title="Die vier häufigsten Symptome">
          <p>
            <strong>Fast gleiche Werte.</strong> #3b83f7 und #3a81f5, 6px, 7px und 9px Radius — niemand hat das so
            entschieden, es ist passiert. Jede Abweichung ist für sich unsichtbar, zusammen wirkt das Interface
            unruhig.
          </p>
          <p>
            <strong>Krumme Zahlen.</strong> 11px, 14px, 22px Padding: Werte, die in keiner Skala vorkommen, wurden
            nach Gefühl gesetzt.
          </p>
          <p>
            <strong>Farbwerte im Komponenten-CSS.</strong> Jedes # in einer Komponente ist eine Entscheidung, die
            dort nicht hingehört — und ein Theme unmöglich macht.
          </p>
          <p>
            <strong>Namen mit „new", „2" oder „final".</strong> --card-shadow-new verrät, dass es einen alten gibt,
            den niemand zu löschen wagt.
          </p>
        </ExplanationBox>

        <hr className={HR} />

        {/* ── PRAXISAUFGABE ── */}
        <p className={EYEBROW}>Praxisaufgabe</p>
        <h2 className={H2}>Eine Tarif-Karte auf ein Token-System umstellen</h2>

        <ExerciseBlock
          title="Aufgabenstellung"
          tasks={[
            "Lege in :root Global Tokens an: Grau- und Blautöne, eine Spacing-Skala (4/8/12/16/24), zwei Radien und drei Elevation-Stufen",
            "Definiere darauf Alias-Tokens mit Rollen-Namen: --color-surface, --color-border, --color-text, --color-action, --radius-control …",
            "Ersetze im Komponenten-CSS jeden festen Wert durch ein Token — am Ende stehen dort weder # noch px-Abstände",
            "Ordne Elevation zu: Card auf Stufe 1, Menü auf Stufe 3, Button bei Hover von Stufe 1 auf 2",
            "Baue ein Dark Theme, indem du in [data-theme=\"dark\"] nur Alias-Tokens überschreibst, und teste es am body-Tag",
            "Bonus: Gib dem Button eigene Component Tokens und baue eine .danger-Variante, die nur diese überschreibt",
          ]}
        >
          Die Karte unten sieht auf den ersten Blick ordentlich aus. Im CSS stecken aber drei fast gleiche Blautöne,
          drei verschiedene Rahmengrau, vier Radien, vier frei erfundene Schatten und lauter krumme Abstände. Stell
          sie auf ein Token-System mit drei Ebenen um — ohne das HTML zu verändern.
        </ExerciseBlock>

        <LiveEditor title="Tarif-Karte" html={EXERCISE_HTML} previewHeight={560} />

        <details className={`${CARD} mt-6 mb-6`}>
          <summary className="cursor-pointer select-none px-6 py-4 text-[14px] font-semibold text-(--text-primary) marker:text-(--accent)">
            Musterlösung anzeigen
            <span className="font-normal text-(--text-tertiary)"> — erst selbst probieren</span>
          </summary>
          <div className="px-6 pb-2">
            <p className={P}>
              Eine mögliche Lösung. Achte auf das Dark Theme: Dort steht kein einziger Selektor einer Komponente — und
              das Menü bekommt eine hellere Fläche als die Card, weil es höher liegt.
            </p>
            <CodeBlock language="CSS — Musterlösung" code={SOLUTION_CSS} />
          </div>
        </details>

        <hr className={HR} />

        {/* ── ZUM MITNEHMEN ── */}
        <p className={EYEBROW}>Zum Mitnehmen</p>
        <h2 className={H2}>tokens.css — ein Mini Design System als Startpunkt</h2>
        <p className={P}>
          Alle drei Ebenen, ein Dark Theme und zwei Komponenten in einer Datei. Kopiere sie in dein Projekt, ersetze
          die Global Tokens durch deine eigenen Skalen aus den vorherigen Modulen — die Alias-Ebene und die
          Komponenten kannst du fast unverändert übernehmen.
        </p>
        <CodeBlock language="CSS — tokens.css" code={STARTER_CSS} />

        <ReferenceBox title="Wenn das System wächst">
          <p>
            Sobald Tokens nicht nur im Web, sondern auch in Figma, iOS oder Android gebraucht werden, pflegt man sie
            als JSON und erzeugt daraus CSS, Swift und Kotlin. Dafür gibt es seit Oktober 2025 ein stabiles,
            herstellerübergreifendes Dateiformat der <strong>Design Tokens Community Group</strong> (
            <a href="https://www.designtokens.org/" target="_blank" rel="noreferrer">designtokens.org</a>); Werkzeuge
            wie <strong>Style Dictionary</strong> übersetzen es in alle Plattformen. Zum Nachschlagen:{" "}
            <a href="https://mui.com/material-ui/customization/default-theme/" target="_blank" rel="noreferrer">
              das Standard-Theme von MUI
            </a>{" "}
            und die{" "}
            <a href="https://m3.material.io/styles/elevation/overview" target="_blank" rel="noreferrer">
              Elevation-Richtlinien von Material Design 3
            </a>
            .
          </p>
        </ReferenceBox>

        <TheoryCard label="Merkliste">
          <ConceptList>
            <ConceptItem title="Drei Ebenen">
              Global ist der Vorrat, Alias die Rolle, Component die Stelle. Komponenten greifen nie auf rohe Werte zu.
            </ConceptItem>
            <ConceptItem title="Namen nach Aufgabe">
              --color-action statt --blue-button. Ein guter Name überlebt jedes Redesign.
            </ConceptItem>
            <ConceptItem title="Elevation ist eine Stufe, kein Schatten">
              Wenige Stufen mit fester Bedeutung; Schatten, Flächenfarbe und z-index leiten sich daraus ab.
            </ConceptItem>
            <ConceptItem title="Themes tauschen nur Alias-Tokens">
              Wenn ein Theme Komponenten-CSS braucht, fehlt ein Token. Im Praxis-Projekt baust du genau so dein
              eigenes System für ein ganzes Dashboard.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <p className={EYEBROW}>Ausblick</p>
        <p className={P}>
          Tokens haben einen zweiten Nutzen, der mit KI-Assistenten wichtig geworden ist: Sie sind die wirksamste
          Vorgabe, die du einem Modell machen kannst. Wer nur aus zwölf Abständen und acht Farben wählen darf, erfindet
          keinen dreizehnten Wert. Wie du Tokens, Regeln und einen Linter als Leitplanken einsetzt, zeigt{" "}
          <ModuleRef slug="ai-workflow" withTitle />.
        </p>
      </div>

      <ModuleNav prevModule={prevModule} nextModule={nextModule} />
    </div>
  );
}
