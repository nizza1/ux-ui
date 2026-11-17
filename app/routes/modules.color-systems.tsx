import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Layers, Sprout } from "lucide-react";
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
import { ModuleNav } from "~/routes/modules.$slug";
import { LiveEditor } from "~/components/live-editor/LiveEditor";
import { HslColorLab } from "~/components/demos/color/HslColorLab";
import { PerceptualLightnessDemo } from "~/components/demos/color/PerceptualLightnessDemo";
import { PaletteGenerator } from "~/components/demos/color/PaletteGenerator";
import { buildGrayRamp, buildRamp, type Shade } from "~/utils/color";

export const meta: MetaFunction = () => [
  { title: "Farbe I: Farbsysteme aufbauen — UX/UI Workshop" },
  {
    name: "description",
    content:
      "Warum fünf Farben nicht reichen — Farbfamilien mit Abstufungen aufbauen, HSL lesen, OKLCH verstehen und das System als CSS-Variablen mitnehmen",
  },
];

export function loader() {
  const moduleIndex = modules.findIndex((m) => m.slug === "color-systems");
  const prevModule = moduleIndex > 0 ? modules[moduleIndex - 1] : null;
  const nextModule = moduleIndex < modules.length - 1 ? modules[moduleIndex + 1] : null;
  return { prevModule, nextModule };
}

/* ── Wiederkehrende Text-Stile (wie in Modul 04–06) ── */
const EYEBROW = "font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block";
const H2 = "text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0";
const H3 = "text-[15px] font-bold leading-[1.4] text-(--text-primary) mt-8 mb-2";
const P = "text-[14px] leading-[1.7] text-(--text-secondary) mb-4 mt-0";
const STRONG = "font-semibold text-(--text-primary)";
const CAPTION = "text-[13px] leading-[1.6] text-(--text-tertiary) m-0";
const MICRO = "font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost)";
const HR = "border-0 border-t border-(--bg-elevated) my-10";

/* ── Vorberechnete Paletten für die Abbildungen ── */
const SYSTEM = [
  { name: "gray", role: "Neutral", ramp: buildGrayRamp(250, 6, "oklch") },
  { name: "brand", role: "Primärfarbe", ramp: buildRamp(250, 85, "oklch") },
  { name: "red", role: "Fehler · Löschen", ramp: buildRamp(5, 85, "oklch") },
  { name: "amber", role: "Warnung", ramp: buildRamp(40, 95, "oklch") },
  { name: "green", role: "Erfolg", ramp: buildRamp(150, 75, "oklch") },
];
const BRAND = SYSTEM[1].ramp;
const shade = (ramp: Shade[], step: number) => ramp.find((s) => s.step === step)!;

const ROLE_BANDS = [
  {
    band: "Flächen",
    steps: [50, 100],
    text: "Getönte Hintergründe: Alert-Flächen, Hover-Zustände, Badge-Hintergrund, ausgewählte Tabellenzeile.",
  },
  {
    band: "Linien",
    steps: [200, 300],
    text: "Rahmen und Trennlinien. 300 auch für deaktivierte Elemente und als Akzent auf dunklen Flächen.",
  },
  {
    band: "Farbe",
    steps: [400, 500, 600],
    text: "Hier sitzt die „eigentliche“ Farbe: Icons, Diagramme, Fokus-Ringe (400–500) und gefüllte Buttons mit weißem Text (600).",
  },
  {
    band: "Text",
    steps: [700, 800, 900, 950],
    text: "Farbiger Text und Hover für Buttons (700), Text auf getönter Fläche (800–900), dunkle Flächen und Dark-Mode-Hintergrund (950).",
  },
];

const BUILD_STEPS = [
  {
    title: "1 · Basis wählen",
    text: "Starte in der Mitte: eine Farbe, die als Button-Hintergrund mit weißem Text funktioniert. Das wird deine 600.",
    visible: [600],
  },
  {
    title: "2 · Ränder festlegen",
    text: "Die dunkelste Stufe ist für Text gedacht (900), die hellste für getönte Flächen (50). Beide leitest du vom Einsatzzweck ab.",
    visible: [50, 600, 900],
  },
  {
    title: "3 · Lücken füllen",
    text: "Erst 300 und 800 als Kompromiss zwischen den Nachbarn, dann den Rest. Vertrau am Ende deinem Auge, nicht der Formel.",
    visible: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
  },
];

const YELLOW_L = [92, 80, 66, 52, 40, 30, 21];
const YELLOW_NAIVE = YELLOW_L.map((l) => `hsl(48 95% ${l}%)`);
const YELLOW_SHIFTED = [
  "hsl(55 100% 92%)",
  "hsl(52 98% 80%)",
  "hsl(48 96% 66%)",
  "hsl(43 96% 52%)",
  "hsl(36 94% 42%)",
  "hsl(29 90% 33%)",
  "hsl(24 84% 24%)",
];

const NEUTRALS = [
  { name: "Rein grau", note: "Sättigung 0 % — korrekt, aber leblos", hue: 0, sat: 0 },
  { name: "Kühl getönt", note: "Hue 220°, 20 % — sachlich, technisch", hue: 220, sat: 20 },
  { name: "Warm getönt", note: "Hue 35°, 20 % — freundlich, wohnlich", hue: 35, sat: 20 },
];

const EXERCISE_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<style>
  /* TODO 1: Definiere hier dein Farbsystem als Custom Properties.
     Mindestens: Grautöne (leicht getönt) + je eine Familie für
     Rot, Amber und Grün mit den Stufen 50, 200, 600 und 800.   */
  :root {

  }

  * { box-sizing: border-box; margin: 0; }
  body { font-family: system-ui, sans-serif; background: #ffffff; padding: 24px; }

  /* TODO 2: Ersetze jeden HEX-Wert durch eine Variable aus deinem System. */
  .card   { max-width: 480px; background: #f8f8f8; border-radius: 12px; padding: 20px; }
  .title  { font-size: 18px; font-weight: 700; color: #333333; margin-bottom: 16px; }
  .badges { display: flex; gap: 8px; margin-bottom: 16px; }
  .badge  { padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 600; color: white; }
  .alert  { padding: 10px 14px; border-radius: 8px; font-size: 14px; margin-bottom: 8px; color: white; }

  .badge.critical { background: #ff0000; }
  .badge.warning  { background: #ffaa00; }
  .badge.ok       { background: #00cc00; }

  /* TODO 3: Alerts brauchen drei Stufen derselben Familie:
     Hintergrund (50), Rahmen (200) und Text (800).            */
  .alert.critical { background: #ff0000; }
  .alert.warning  { background: #ffaa00; }
  .alert.info     { background: #eeeeee; color: #666666; }
</style>
</head>
<body>
  <div class="card">
    <div class="title">Projekt-Status</div>
    <div class="badges">
      <span class="badge critical">3 Kritisch</span>
      <span class="badge warning">5 Warnung</span>
      <span class="badge ok">12 OK</span>
    </div>
    <div class="alert critical">Server-Latenz über 500 ms seit 2 h</div>
    <div class="alert warning">API Rate Limit bei 80 %</div>
    <div class="alert info">Nächstes Deployment: morgen 06:00</div>
  </div>
</body>
</html>`;

const SOLUTION_CSS = `:root {
  /* Grautöne mit kühlem Farbstich (Hue 220) */
  --gray-50:  hsl(220 14% 97%);
  --gray-200: hsl(220 13% 90%);
  --gray-600: hsl(220 10% 38%);
  --gray-900: hsl(220 16% 14%);

  --red-50:   hsl(4 100% 97%);
  --red-200:  hsl(4 96% 88%);
  --red-600:  hsl(4 78% 46%);
  --red-800:  hsl(4 74% 30%);

  --amber-50:  hsl(46 100% 95%);
  --amber-200: hsl(44 96% 77%);
  --amber-600: hsl(32 92% 40%);
  --amber-800: hsl(26 84% 27%);

  --green-50:  hsl(140 76% 96%);
  --green-200: hsl(141 70% 82%);
  --green-600: hsl(142 72% 30%);
  --green-800: hsl(143 64% 20%);
}

.card  { background: var(--gray-50); border: 1px solid var(--gray-200); }
.title { color: var(--gray-900); }

/* Badges: kleine Fläche → darf gesättigt sein (Stufe 600, weißer Text) */
.badge.critical { background: var(--red-600); }
.badge.ok       { background: var(--green-600); }
/* Ausnahme Amber: leuchtet nur hell → helle Stufe mit dunklem Text */
.badge.warning  { background: var(--amber-200); color: var(--amber-800); }

/* Alerts: große Fläche → hell getönt, dunkler Text derselben Familie */
.alert { border: 1px solid; }
.alert.critical { background: var(--red-50);   border-color: var(--red-200);   color: var(--red-800); }
.alert.warning  { background: var(--amber-50); border-color: var(--amber-200); color: var(--amber-800); }
.alert.info     { background: var(--gray-50);  border-color: var(--gray-200);  color: var(--gray-600); }`;

const TAKEAWAY_BRAND = buildRamp(222, 88, "oklch");
const TAKEAWAY_GRAY = buildGrayRamp(222, 6, "oklch");
const cssLine = (name: string, s: Shade) => `  --${name}-${s.step}: ${s.css};`.padEnd(42) + `/* ${s.hex} */`;

const TAKEAWAY_CSS = `:root {
  /* ── Neutral: Grautöne mit leichtem Farbstich der Primärfarbe ── */
${TAKEAWAY_GRAY.map((s) => cssLine("gray", s)).join("\n")}

  /* ── Primärfarbe: gleicher Hue, Lightness-Treppe ── */
${TAKEAWAY_BRAND.map((s) => cssLine("brand", s)).join("\n")}

  /* Weitere Familien nach demselben Muster — nur der Hue ändert sich:
     --red-* (Hue 27)   --amber-* (Hue 75)   --green-* (Hue 150)      */
}

/* Fallback für sehr alte Browser: HEX zuerst, die Variable überschreibt */
.button {
  background: ${shade(TAKEAWAY_BRAND, 600).hex};
  background: var(--brand-600);
  color: white;
}
.button:hover { background: var(--brand-700); }

.alert {
  background: var(--brand-50);
  border: 1px solid var(--brand-200);
  color: var(--brand-800);
}`;

function Swatch({ color, className = "" }: { color: string; className?: string }) {
  return <div className={`rounded-md border border-black/5 ${className}`} style={{ background: color }} />;
}

export default function ColorSystemsModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      <div className="max-w-[1000px] mx-auto w-full px-4 sm:px-8 py-12 flex-1">
        {/* ── TITEL ── */}
        <div className="mb-2">
          <Badge variant="module" dot>Modul 07</Badge>
        </div>
        <h1 className="text-[clamp(28px,4vw,36px)] font-extrabold leading-[1.15] tracking-[-0.5px] text-(--text-primary) mb-2 mt-0">
          Farbe I<br />Farbsysteme aufbauen
        </h1>
        <p className="text-[15px] font-medium leading-normal text-(--text-secondary) mb-8 mt-0 max-w-140">
          Warum fünf „perfekte" Farben aus dem Generator nicht reichen — und wie du aus einem einzigen Farbton ein
          vollständiges, planbares Farbsystem ableitest, das du als CSS-Variablen in jedes Projekt mitnimmst.
        </p>

        <ModuleMeta duration="75 Min." practiceTime="~25 Min." />

        <BuildsOn modules={"visual-hierarchy"} />
        <LearningGoals
          goals={[
            "Farbformate einordnen: HEX, RGB, HSL und OKLCH — und wissen, wofür jedes taugt",
            "HSL lesen und gezielt verändern: Farbton, Sättigung und Helligkeit getrennt steuern",
            "Verstehen, warum „gleiche Lightness“ in HSL nicht gleich hell bedeutet — und was OKLCH daran löst",
            "Ein Farbsystem aus drei Gruppen aufbauen: Grautöne, Primärfarbe, Statusfarben — je 8–11 Stufen",
            "Jeder Stufe eine Aufgabe geben: Fläche, Linie, Farbe, Text",
            "Das fertige System als CSS Custom Properties definieren und auf eine Komponente anwenden",
          ]}
        />

        <hr className={HR} />

        {/* ── KERNGEDANKE ── */}
        <p className={EYEBROW}>Kerngedanke</p>
        <InsightRow icon={Layers} title="Fünf Hex-Codes sind keine Palette">
          Eine echte Oberfläche braucht Farben für Text, Nebentext, Rahmen, Flächen, Hover, Disabled, Fehler, Warnung
          und Erfolg. Dafür reichen keine fünf Einzelfarben — du brauchst Farbfamilien mit 8–11 Abstufungen.
        </InsightRow>
        <InsightRow icon={Sprout} title="Farben wählt man nicht einzeln — man leitet sie ab">
          Du entscheidest dich einmal für einen Farbton. Alle Abstufungen entstehen daraus nach festen Regeln. So
          passt jede neue Farbe automatisch zum Rest, und niemand im Team muss „noch schnell ein Blau" erfinden.
        </InsightRow>

        <hr className={HR} />

        {/* ── THEORIE: FARBFORMATE ── */}
        <p className={EYEBROW}>Theorie — Farbformate</p>
        <h2 className={H2}>Eine Farbe, vier Schreibweisen</h2>
        <p className={P}>
          Im Code begegnet dir dieselbe Farbe in mehreren Formaten. Für den Browser sind sie gleichwertig — für dich
          nicht. <strong className={STRONG}>Entscheidend ist, wie gut du einem Wert ansiehst, was er bedeutet</strong>,
          und wie leicht du daraus eine hellere oder dunklere Variante ableiten kannst.
        </p>

        <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl mb-6 shadow-(--shadow-sm) overflow-hidden">
          <div className="grid sm:grid-cols-[140px_1fr]">
            <div className="min-h-20 bg-[#0ea49f]" />
            <div className="divide-y divide-(--bg-elevated)">
              {[
                { format: "HEX", value: "#0ea49f", verdict: "Kompakt, aber nicht lesbar: hell oder dunkel? Keine Ahnung." },
                { format: "RGB", value: "rgb(14 164 159)", verdict: "Drei Lichtkanäle — beschreibt den Bildschirm, nicht die Farbe." },
                { format: "HSL", value: "hsl(178 84% 35%)", verdict: "Türkis, kräftig, eher dunkel — auf einen Blick lesbar." },
                { format: "OKLCH", value: "oklch(65% 0.11 191)", verdict: "Wie HSL lesbar, aber die Helligkeit stimmt mit dem Auge überein." },
              ].map((row) => (
                <div key={row.format} className="grid sm:grid-cols-[70px_190px_1fr] gap-x-4 gap-y-1 px-5 py-3 items-baseline">
                  <span className={MICRO}>{row.format}</span>
                  <code className="font-mono text-[13px] font-semibold text-(--text-primary)">{row.value}</code>
                  <span className="text-[13px] leading-[1.5] text-(--text-secondary)">{row.verdict}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <TheoryCard label="Was du über jedes Format wissen musst">
          <ConceptList>
            <ConceptItem title="HEX und RGB — Formate für Maschinen">
              Beide beschreiben, wie stark Rot, Grün und Blau leuchten. HEX ist nur die kompaktere Schreibweise von
              RGB. Gut zum Kopieren und als Export-Format, schlecht zum Arbeiten: Aus <code>#0ea49f</code> eine
              „etwas hellere" Variante zu machen, ist Raten.
            </ConceptItem>
            <ConceptItem title="HSL — das Format zum Denken">
              <strong className={STRONG}>Hue</strong> (Farbton, 0–360° auf dem Farbkreis),{" "}
              <strong className={STRONG}>Saturation</strong> (Sättigung, 0 % = grau) und{" "}
              <strong className={STRONG}>Lightness</strong> (Helligkeit, 0 % = schwarz, 100 % = weiß). Drei Regler, die
              du unabhängig voneinander verstehen und verändern kannst.
            </ConceptItem>
            <ConceptItem title="HSB / HSV — Vorsicht, anderes Modell">
              So arbeiten die Farbwähler in Figma und Photoshop. Brightness ist nicht Lightness: 100 % Brightness ist
              die volle Farbe, 100 % Lightness ist Weiß. CSS kennt HSB nicht — Werte nie blind übertragen.
            </ConceptItem>
            <ConceptItem title="OKLCH — das Format zum Systeme-Bauen">
              Lightness, Chroma (Farbigkeit) und Hue — aufgebaut wie HSL, aber an der menschlichen Wahrnehmung
              ausgerichtet. Seit 2023 in allen aktuellen Browsern verfügbar und die Grundlage moderner Paletten.
              Warum das einen Unterschied macht, siehst du gleich im Experiment.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <hr className={HR} />

        {/* ── HSL LESEN ── */}
        <p className={EYEBROW}>Vergleichsbeispiel 1 von 4</p>
        <h2 className={H2}>HSL macht Verwandtschaft sichtbar</h2>
        <p className={P}>
          Drei Blautöne, die zusammengehören. In HEX sieht man davon nichts — die Werte haben keine erkennbare
          Gemeinsamkeit. In HSL steht die Verwandtschaft direkt im Code.
        </p>

        <ComparisonPanel
          bad={{
            label: "Vorher — HEX",
            children: (
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  {["#1d4ed8", "#3b82f6", "#93c5fd"].map((hex) => (
                    <div key={hex} className="flex-1 min-w-0">
                      <Swatch color={hex} className="h-12" />
                      <code className="block font-mono text-[13px] text-(--text-secondary) mt-1.5 truncate">{hex}</code>
                    </div>
                  ))}
                </div>
                <p className={CAPTION}>Welcher ist der dunkelste? Gehören sie zusammen? Nicht zu erkennen.</p>
              </div>
            ),
          }}
          good={{
            label: "Nachher — HSL",
            children: (
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  {[
                    { css: "hsl(217 91% 40%)", label: "217 91% 40%" },
                    { css: "hsl(217 91% 60%)", label: "217 91% 60%" },
                    { css: "hsl(217 91% 78%)", label: "217 91% 78%" },
                  ].map((color) => (
                    <div key={color.label} className="flex-1 min-w-0">
                      <Swatch color={color.css} className="h-12" />
                      <code className="block font-mono text-[13px] text-(--text-secondary) mt-1.5 truncate">{color.label}</code>
                    </div>
                  ))}
                </div>
                <p className={CAPTION}>Gleicher Hue, gleiche Sättigung — nur die Lightness steigt: 40, 60, 78.</p>
              </div>
            ),
          }}
        />

        <AnnotationGrid
          items={[
            { label: "Hue", value: "0–360° · welche Farbe" },
            { label: "Saturation", value: "0–100 % · wie kräftig" },
            { label: "Lightness", value: "0–100 % · wie hell" },
          ]}
        />

        <h3 className={H3}>HSL Color Lab — probier es aus</h3>
        <p className={P}>
          Bewege die Regler und lies mit, wie sich die Beschreibung der Farbe ändert. Achte darauf, was passiert,
          wenn du <strong className={STRONG}>nur die Lightness</strong> veränderst — genau so entsteht eine Farbfamilie.
        </p>
        <HslColorLab />

        <RuleBox>
          HSL ist dein Format zum Denken und Ausprobieren: Farbton festlegen, Sättigung einstellen, Helligkeit
          abstufen. Die Schreibweise ohne Kommas — hsl(217 91% 60%) — ist der aktuelle Standard; Transparenz hängst
          du mit Schrägstrich an: hsl(217 91% 60% / 0.5).
        </RuleBox>

        <hr className={HR} />

        {/* ── HSL vs. OKLCH ── */}
        <p className={EYEBROW}>Vergleichsbeispiel 2 von 4</p>
        <h2 className={H2}>Der blinde Fleck von HSL: Lightness ist nicht Helligkeit</h2>
        <p className={P}>
          HSL hat eine Schwäche, die beim Bauen von Systemen weh tut: Die Lightness ist rein rechnerisch. Ein Gelb
          und ein Blau mit jeweils 50 % Lightness sind für das Auge <strong className={STRONG}>völlig unterschiedlich
          hell</strong>. Schalte auf Graustufen um und sieh es dir an.
        </p>

        <PerceptualLightnessDemo />

        <ExplanationBox title="Analyse">
          <p>
            Das menschliche Auge ist für Grün und Gelb viel empfindlicher als für Blau. HSL ignoriert das — es
            verteilt die Werte gleichmäßig über die drei Lichtkanäle. <strong>OKLCH ist so konstruiert, dass gleiche
            Lightness-Werte gleich hell aussehen.</strong>
          </p>
          <p>
            Für ein Farbsystem ist das der entscheidende Vorteil: Wenn „Stufe 600" bei Blau genug Kontrast für
            weißen Text hat, dann gilt das in OKLCH auch für Grün, Rot und Violett. In HSL musst du jede Familie
            einzeln nachmessen.
          </p>
          <p>
            Eine Ausnahme bleibt: <strong>Gelb und Amber leuchten nur bei hoher Helligkeit.</strong> Bei mittlerer
            Lightness werden sie zu Oliv oder Braun. Für Warnfarben nimmst du deshalb hellere Stufen mit dunklem Text.
          </p>
        </ExplanationBox>

        <ReferenceBox>
          <p>
            <strong>Tailwind CSS</strong> definiert seit Version 4 seine gesamte Standardpalette in OKLCH — die
            Stufen 50 bis 950, die du gleich kennenlernst, stammen aus genau dieser Konvention.{" "}
            <code>oklch()</code> funktioniert in Chrome, Edge, Firefox und Safari; für sehr alte Browser gibst du
            zusätzlich einen HEX-Wert als Fallback an.
          </p>
        </ReferenceBox>

        <RuleBox title="Praxis-Empfehlung">
          Denke in HSL, baue Skalen in OKLCH, exportiere HEX nur dort, wo ein Werkzeug es verlangt. Alle drei
          beschreiben am Ende dieselbe Farbe — der Unterschied liegt darin, wie gut du damit arbeiten kannst.
        </RuleBox>

        <hr className={HR} />

        {/* ── WIE VIELE FARBEN ── */}
        <p className={EYEBROW}>Vergleichsbeispiel 3 von 4</p>
        <h2 className={H2}>Du brauchst mehr Farben, als du denkst</h2>
        <p className={P}>
          Paletten-Generatoren liefern fünf hübsche Farben. Das reicht für ein Moodboard — aber nicht für eine
          Oberfläche. Sobald du die erste Karte baust, fehlen dir die Farben für Nebentext, Rahmen, Hover und
          deaktivierte Zustände.
        </p>

        <ComparisonPanel
          bad={{
            label: "Vorher — 5 Farben",
            children: (
              <div className="flex flex-col gap-3">
                <div className="flex gap-1">
                  {["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"].map((hex) => (
                    <Swatch key={hex} color={hex} className="flex-1 h-16" />
                  ))}
                </div>
                <p className={CAPTION}>
                  Welche Farbe für Fließtext? Für Rahmen? Für den Hover-Zustand? Für „deaktiviert"? Hier fängt das
                  Improvisieren an.
                </p>
              </div>
            ),
          }}
          good={{
            label: "Nachher — Farbfamilien",
            children: (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  {SYSTEM.slice(0, 3).map((family) => (
                    <div key={family.name} className="flex gap-0.5">
                      {family.ramp.map((s) => (
                        <div key={s.step} className="flex-1 h-5 first:rounded-l-md last:rounded-r-md" style={{ background: s.hex }} />
                      ))}
                    </div>
                  ))}
                </div>
                <p className={CAPTION}>
                  Jede Familie hat 11 Stufen. Für jede Aufgabe gibt es eine fertige Antwort — niemand muss mehr eine
                  Farbe erfinden.
                </p>
              </div>
            ),
          }}
        />

        <TheoryCard label="Die drei Gruppen eines Farbsystems">
          <ConceptList>
            <ConceptItem title="Grautöne — die meistgenutzte Gruppe">
              Text, Hintergründe, Rahmen, Panels: Der größte Teil jeder Oberfläche ist grau. Du brauchst 8–10 Stufen
              — von fast weiß bis fast schwarz. Reines Schwarz (#000) wirkt hart; ein sehr dunkles Grau ist
              angenehmer.
            </ConceptItem>
            <ConceptItem title="Primärfarbe — die Farbe deiner Marke">
              Eine, höchstens zwei Farben für Aktionen, aktive Navigation und Links. 5–10 Stufen: helle für getönte
              Flächen, mittlere für Buttons, dunkle für Text.
            </ConceptItem>
            <ConceptItem title="Statusfarben — Farben mit fester Bedeutung">
              Rot für Fehler und Löschen, Amber für Warnungen, Grün für Erfolg, bei Bedarf Blau für neutrale
              Hinweise. Auch sie brauchen jeweils mehrere Stufen — ein Alert besteht aus Fläche, Rahmen und Text.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl p-6 mb-6 shadow-(--shadow-sm)">
          <div className={`${EYEBROW} mb-4`}>Ein vollständiges System — 5 Familien × 11 Stufen</div>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[92px_1fr] sm:grid-cols-[150px_1fr] gap-3 items-end">
              <span />
              <div className="grid grid-cols-11 gap-1">
                {BRAND.map((s) => (
                  <span key={s.step} className="font-mono text-[10px] font-semibold text-(--text-ghost) text-center tabular-nums">
                    {s.step}
                  </span>
                ))}
              </div>
            </div>
            {SYSTEM.map((family) => (
              <div key={family.name} className="grid grid-cols-[92px_1fr] sm:grid-cols-[150px_1fr] gap-3 items-center">
                <div className="min-w-0">
                  <div className="font-mono text-[13px] font-semibold text-(--text-primary)">{family.name}</div>
                  <div className="text-[13px] text-(--text-tertiary) truncate hidden sm:block">{family.role}</div>
                </div>
                <div className="grid grid-cols-11 gap-1">
                  {family.ramp.map((s) => (
                    <div key={s.step} className="h-9 rounded-md border border-black/5" style={{ background: s.hex }} title={`${family.name}-${s.step} · ${s.hex}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className={`${CAPTION} mt-4`}>
            55 Farben — aber nur fünf Entscheidungen: ein Farbton pro Familie. Der Rest ist abgeleitet. Jede Spalte
            ist über alle Familien hinweg gleich hell.
          </p>
        </div>

        <hr className={HR} />

        {/* ── ROLLEN ── */}
        <p className={EYEBROW}>Theorie — Stufen und ihre Aufgaben</p>
        <h2 className={H2}>Jede Stufe hat einen Job</h2>
        <p className={P}>
          Eine Skala von 50 bis 950 ist nur dann nützlich, wenn klar ist, wofür jede Stufe gedacht ist. Die Zahlen
          sind eine Konvention — kleine Zahl gleich hell, große Zahl gleich dunkel. Merk dir vier Bänder:
        </p>

        <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl mb-6 shadow-(--shadow-sm) overflow-hidden divide-y divide-(--bg-elevated)">
          {ROLE_BANDS.map((band) => (
            <div key={band.band} className="grid sm:grid-cols-[200px_1fr] gap-4 p-5 items-center">
              <div>
                <div className="flex gap-1 mb-2">
                  {band.steps.map((step) => (
                    <Swatch key={step} color={shade(BRAND, step).hex} className="h-9 flex-1" />
                  ))}
                </div>
                <div className="font-mono text-[11px] font-semibold text-(--text-ghost) tabular-nums">
                  {band.steps[0]}–{band.steps[band.steps.length - 1]}
                </div>
              </div>
              <div>
                <div className="text-[14px] font-bold text-(--text-primary) mb-0.5">{band.band}</div>
                <div className="text-[13px] leading-[1.6] text-(--text-secondary)">{band.text}</div>
              </div>
            </div>
          ))}
        </div>

        <RuleBox>
          Benenne Farben nach ihrer Position, nicht nach ihrem Aussehen: --brand-600 statt --dunkelblau. Die Zahl
          sagt, wie hell die Farbe ist und wofür sie taugt — und bleibt richtig, wenn die Marke morgen grün wird.
        </RuleBox>

        <hr className={HR} />

        {/* ── SKALA BAUEN ── */}
        <p className={EYEBROW}>Theorie — Vorgehen</p>
        <h2 className={H2}>Eine Farbfamilie in drei Schritten bauen</h2>
        <p className={P}>
          Fang nicht bei 50 an und arbeite dich stur nach unten. Leg zuerst die Stufen fest, deren Aufgabe du
          kennst — und füll dann die Lücken.
        </p>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          {BUILD_STEPS.map((buildStep) => (
            <div key={buildStep.title} className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 shadow-(--shadow-sm)">
              <div className="flex gap-0.5 mb-4">
                {BRAND.map((s) =>
                  buildStep.visible.includes(s.step) ? (
                    <div key={s.step} className="flex-1 h-10 rounded-sm" style={{ background: s.hex }} />
                  ) : (
                    <div key={s.step} className="flex-1 h-10 rounded-sm border border-dashed border-(--text-ghost)/50" />
                  )
                )}
              </div>
              <div className="text-[14px] font-bold text-(--text-primary) mb-1">{buildStep.title}</div>
              <div className="text-[13px] leading-[1.6] text-(--text-secondary)">{buildStep.text}</div>
            </div>
          ))}
        </div>

        <p className={EYEBROW}>Vergleichsbeispiel 4 von 4</p>
        <h3 className="text-[15px] font-bold leading-[1.4] text-(--text-primary) mt-0 mb-2">Die Falle: „Ich ändere einfach nur die Lightness"</h3>
        <p className={P}>
          Als erste Näherung funktioniert das. Aber wer nur die Lightness dreht, bekommt an den Rändern matte,
          schmutzige Farben. Am deutlichsten sieht man es bei Gelb:
        </p>

        <ComparisonPanel
          bad={{
            label: "Vorher — nur Lightness",
            children: (
              <div className="flex flex-col gap-3">
                <div className="flex gap-0.5">
                  {YELLOW_NAIVE.map((css) => (
                    <div key={css} className="flex-1 h-14 first:rounded-l-md last:rounded-r-md" style={{ background: css }} />
                  ))}
                </div>
                <code className="font-mono text-[13px] text-(--text-secondary)">hsl(48 95% 92% → 21%)</code>
                <p className={CAPTION}>Die dunklen Stufen kippen in ein schlammiges Oliv.</p>
              </div>
            ),
          }}
          good={{
            label: "Nachher — Hue wandert mit",
            children: (
              <div className="flex flex-col gap-3">
                <div className="flex gap-0.5">
                  {YELLOW_SHIFTED.map((css) => (
                    <div key={css} className="flex-1 h-14 first:rounded-l-md last:rounded-r-md" style={{ background: css }} />
                  ))}
                </div>
                <code className="font-mono text-[13px] text-(--text-secondary)">Hue 55° → 24°, gleiche Lightness</code>
                <p className={CAPTION}>Dunkle Stufen wandern Richtung Orange — warm und satt statt schmutzig.</p>
              </div>
            ),
          }}
        />

        <ExplanationBox title="Zwei Korrekturen, die jede Skala besser machen">
          <p>
            <strong>Sättigung an den Rändern anheben.</strong> Je weiter eine Farbe von 50 % Lightness entfernt ist,
            desto schwächer wirkt ihre Sättigung. Sehr helle und sehr dunkle Stufen brauchen deshalb etwas mehr
            Sättigung, sonst wirken sie ausgewaschen.
          </p>
          <p>
            <strong>Den Farbton leicht mitdrehen.</strong> Dunkler wird eine Farbe natürlicher, wenn ihr Hue in
            Richtung der nächsten dunklen Grundfarbe wandert (Rot, Blau), heller in Richtung der nächsten hellen
            (Gelb, Cyan). 10–30° über die gesamte Skala reichen — mehr, und es wird eine andere Farbe.
          </p>
        </ExplanationBox>

        <hr className={HR} />

        {/* ── GRAUTÖNE ── */}
        <p className={EYEBROW}>Theorie — Neutrale Farben</p>
        <h2 className={H2}>Grau ist selten wirklich grau</h2>
        <p className={P}>
          Grautöne machen den größten Teil deiner Oberfläche aus — und bestimmen deshalb ihre Stimmung. Ein winziger
          Farbstich (5–20 % Sättigung) reicht, damit ein Interface kühl-sachlich oder warm-freundlich wirkt. Der
          einfachste Weg: Nimm den Hue deiner Primärfarbe.
        </p>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          {NEUTRALS.map((neutral) => {
            const g = (l: number) => `hsl(${neutral.hue} ${neutral.sat}% ${l}%)`;
            return (
              <div key={neutral.name} className="rounded-xl overflow-hidden border border-(--bg-elevated) shadow-(--shadow-sm)">
                <div className="p-5" style={{ background: g(96) }}>
                  <div className="rounded-lg p-4 border" style={{ background: g(99), borderColor: g(88) }}>
                    <div className="text-[14px] font-bold mb-1" style={{ color: g(14) }}>Monatsbericht</div>
                    <div className="text-[13px] leading-[1.5] mb-3" style={{ color: g(40) }}>Alle Systeme laufen normal.</div>
                    <span className="inline-block text-[13px] font-semibold px-3 py-1.5 rounded-md text-white" style={{ background: g(22) }}>
                      Ansehen
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-(--bg-surface) border-t border-(--bg-elevated)">
                  <div className="text-[14px] font-bold text-(--text-primary)">{neutral.name}</div>
                  <div className="text-[13px] text-(--text-tertiary)">{neutral.note}</div>
                </div>
              </div>
            );
          })}
        </div>

        <RuleBox>
          Entscheide dich einmal für eine Temperatur und bleib dabei. Kühle und warme Grautöne im selben Interface
          wirken wie ein Fehler — auch wenn niemand benennen kann, warum.
        </RuleBox>

        <hr className={HR} />

        {/* ── GENERATOR ── */}
        <p className={EYEBROW}>Werkzeug</p>
        <h2 className={H2}>Paletten-Generator — bau dein eigenes System</h2>
        <p className={P}>
          Wähle einen Farbton und beobachte, wie daraus eine komplette Familie samt passenden Grautönen entsteht.
          Schalte zwischen OKLCH und HSL um und dreh dabei am Farbton:{" "}
          <strong className={STRONG}>Achte auf die Stufe, ab der weißer Text lesbar ist.</strong> Den CSS-Code unten
          kannst du direkt kopieren.
        </p>

        <PaletteGenerator />

        <hr className={HR} />

        {/* ── PRAXISAUFGABE ── */}
        <p className={EYEBROW}>Praxisaufgabe</p>
        <h2 className={H2}>Eine Status-Karte auf ein Farbsystem umstellen</h2>

        <ExerciseBlock
          title="Aufgabenstellung"
          tasks={[
            "Definiere in :root ein Farbsystem: getönte Grautöne plus je eine Familie für Rot, Amber und Grün (Stufen 50, 200, 600, 800)",
            "Ersetze alle festen HEX-Werte in den Regeln durch deine Variablen — im CSS darf am Ende kein # mehr stehen",
            "Baue die Alerts um: heller Hintergrund (50), Rahmen (200) und dunkler Text (800) aus derselben Familie",
            "Gib der Karte und dem Titel Grautöne mit leichtem Farbstich statt #f8f8f8 und #333333",
            "Bonus: Schreibe eine Familie in OKLCH statt HSL und vergleiche, wie gleichmäßig die Stufen wirken",
          ]}
        >
          Die Karte unten benutzt zufällige Signalfarben: reines Rot, grelles Orange, Neon-Grün — jeweils mit weißem
          Text, der kaum lesbar ist. Es gibt keine Abstufungen und kein System. Stell sie auf ein Farbsystem um, ohne
          das HTML zu verändern. Tipp: Der Generator oben liefert dir die Werte.
        </ExerciseBlock>

        <LiveEditor title="Status-Karte" html={EXERCISE_HTML} previewHeight={520} />

        <details className="group bg-(--bg-surface) border border-(--bg-elevated) rounded-xl mt-6 mb-6 shadow-(--shadow-sm)">
          <summary className="cursor-pointer select-none px-6 py-4 text-[14px] font-semibold text-(--text-primary) marker:text-(--accent)">
            Musterlösung anzeigen
            <span className="font-normal text-(--text-tertiary)"> — erst selbst probieren</span>
          </summary>
          <div className="px-6 pb-2">
            <p className={P}>
              Eine mögliche Lösung in HSL. Beachte den Unterschied zwischen Badges und Alerts: Kleine Flächen dürfen
              kräftig sein, große Flächen bleiben hell getönt.
            </p>
            <CodeBlock language="CSS — Musterlösung" code={SOLUTION_CSS} />
          </div>
        </details>

        <hr className={HR} />

        {/* ── ZUM MITNEHMEN ── */}
        <p className={EYEBROW}>Zum Mitnehmen</p>
        <h2 className={H2}>Farbsystem als CSS-Variablen</h2>
        <p className={P}>
          Ein Grundgerüst für dein eigenes Projekt: Grautöne und eine Primärfarbe in OKLCH, dazu ein Beispiel, wie
          Komponenten die Stufen verwenden. Für einen anderen Farbton erzeugst du dir die Werte mit dem Generator oben.
        </p>
        <CodeBlock language="CSS — Farbsystem" code={TAKEAWAY_CSS} />

        <TheoryCard label="Merkliste">
          <ConceptList>
            <ConceptItem title="Drei Gruppen, je 8–11 Stufen">
              Grautöne, Primärfarbe, Statusfarben. Fünf Einzelfarben sind ein Moodboard, kein System.
            </ConceptItem>
            <ConceptItem title="Ableiten statt auswählen">
              Ein Farbton pro Familie ist die einzige freie Entscheidung. Alles andere folgt aus der Skala.
            </ConceptItem>
            <ConceptItem title="Vier Bänder">
              50–100 Flächen · 200–300 Linien · 400–600 Farbe · 700–950 Text.
            </ConceptItem>
            <ConceptItem title="HSL zum Denken, OKLCH zum Bauen">
              In OKLCH ist eine Stufe bei jedem Farbton gleich hell — Kontrast wird planbar. Genau darum geht es in
              Modul 08.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>
      </div>

      <ModuleNav prevModule={prevModule} nextModule={nextModule} />
    </div>
  );
}
