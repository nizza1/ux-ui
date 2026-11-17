import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { ReactNode } from "react";
import {
  BarChart3,
  CheckSquare,
  Eye,
  FolderKanban,
  LayoutDashboard,
  Layers,
  ListOrdered,
  Mail,
  MapPin,
  Phone,
  Settings,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { modules } from "~/data/modules";
import { ModuleNav } from "~/routes/modules.$slug";
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
import { LiveEditor } from "~/components/live-editor/LiveEditor";
import { SquintTestDemo } from "~/components/demos/hierarchy/SquintTestDemo";
import { PriorityAssigner } from "~/components/demos/hierarchy/PriorityAssigner";
import { HierarchyLab } from "~/components/demos/hierarchy/HierarchyLab";

export const meta: MetaFunction = () => [
  { title: "Visuelle Hierarchie — UX/UI Workshop" },
  {
    name: "description",
    content:
      "Rangfolge festlegen, mit Größe, Gewicht, Kontrast, Abstand und Position ausdrücken und mit dem Blinzel-Test prüfen — visuelle Hierarchie als Handwerk für Entwickler",
  },
];

export function loader() {
  const moduleIndex = modules.findIndex((m) => m.slug === "visual-hierarchy");
  const prevModule = moduleIndex > 0 ? modules[moduleIndex - 1] : null;
  const nextModule = moduleIndex < modules.length - 1 ? modules[moduleIndex + 1] : null;
  return { prevModule, nextModule };
}

/* ── Wiederkehrende Text-Stile (wie in Modul 07 und 14) ── */
const EYEBROW = "font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block";
const H2 = "text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0";
const H3 = "text-[15px] font-bold leading-[1.4] text-(--text-primary) mt-8 mb-2";
const P = "text-[14px] leading-[1.7] text-(--text-secondary) mb-4 mt-0";
const STRONG = "font-semibold text-(--text-primary)";
const CAPTION = "text-[13px] leading-[1.6] text-(--text-tertiary) m-0";
const MICRO = "font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost)";
const HR = "border-0 border-t border-(--bg-elevated) my-10";
const PANEL = "bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl mb-6 shadow-(--shadow-sm)";
/** Bühne für Mini-Oberflächen in den Vergleichsbeispielen */
const STAGE = "rounded-lg bg-(--bg-base) border border-(--bg-elevated) p-4";

/* ── Die drei Arbeitsschritte: der rote Faden des Moduls ── */
const STEPS = [
  {
    step: "1",
    title: "Entscheiden",
    text: "Was ist die Hauptsache, was unterstützt, was darf zurücktreten? Eine inhaltliche Frage — noch ganz ohne CSS.",
  },
  {
    step: "2",
    title: "Ausdrücken",
    text: "Die Rangfolge mit fünf Werkzeugen sichtbar machen: Größe, Gewicht, Kontrast, Abstand, Position.",
  },
  {
    step: "3",
    title: "Prüfen",
    text: "Blinzeln, zurücklehnen, unscharf stellen: Erkennt man die Rangfolge noch, ohne ein Wort zu lesen?",
  },
];

/* ── Lesemuster: Welcher Anteil einer Zeile wird tatsächlich angesehen? ── */
interface ScanLine {
  /** Länge der Zeile in % */
  width: number;
  /** Davon angesehen in % */
  seen: number;
  heading?: boolean;
}

const F_PATTERN: ScanLine[] = [
  { width: 100, seen: 100 },
  { width: 94, seen: 88 },
  { width: 100, seen: 55 },
  { width: 90, seen: 24 },
  { width: 100, seen: 46 },
  { width: 96, seen: 18 },
  { width: 100, seen: 13 },
  { width: 88, seen: 12 },
  { width: 100, seen: 9 },
  { width: 72, seen: 9 },
];

const LAYER_CAKE: ScanLine[] = [
  { width: 42, seen: 100, heading: true },
  { width: 100, seen: 0 },
  { width: 92, seen: 0 },
  { width: 50, seen: 100, heading: true },
  { width: 100, seen: 100 },
  { width: 96, seen: 100 },
  { width: 70, seen: 100 },
  { width: 36, seen: 100, heading: true },
  { width: 100, seen: 0 },
  { width: 84, seen: 0 },
];

function ScanPattern({ lines }: { lines: ScanLine[] }) {
  return (
    <div className="flex flex-col gap-1.5" aria-hidden="true">
      {lines.map((line, i) => (
        <div
          key={i}
          className={`rounded-full bg-(--bg-elevated) overflow-hidden ${line.heading ? "h-3 mt-2 first:mt-0" : "h-2"}`}
          style={{ width: `${line.width}%` }}
        >
          <div className="h-full rounded-full bg-(--accent)" style={{ width: `${line.seen}%` }} />
        </div>
      ))}
    </div>
  );
}

/* ── Die fünf Werkzeuge: je ein Mini-Vergleich, in dem sich nur EINE Eigenschaft ändert ── */
const SPEC = "text-[14px] leading-[1.4] font-normal text-(--text-primary)";

function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-lg bg-(--bg-base) border border-(--bg-elevated) px-4 py-3 min-w-0">
      <div className={`${MICRO} mb-2`}>{label}</div>
      {children}
    </div>
  );
}

const TOOLS: { name: string; prop: string; text: string; before: ReactNode; after: ReactNode }[] = [
  {
    name: "Größe",
    prop: "font-size",
    text: "Das offensichtlichste Werkzeug — und das am schnellsten überstrapazierte. Zwei bis drei Stufen pro Ansicht reichen.",
    before: (
      <>
        <div className={SPEC}>Projektbericht Q3</div>
        <div className={SPEC}>Aktualisiert vor 2 Stunden</div>
      </>
    ),
    after: (
      <>
        <div className="text-[19px] leading-[1.3] font-normal text-(--text-primary)">Projektbericht Q3</div>
        <div className="text-[13px] leading-[1.4] font-normal text-(--text-primary)">Aktualisiert vor 2 Stunden</div>
      </>
    ),
  },
  {
    name: "Gewicht",
    prop: "font-weight",
    text: "Hebt hervor, ohne Platz zu kosten oder den Zeilenrhythmus zu stören. Zwei Stufen genügen: normal und fett.",
    before: (
      <>
        <div className={SPEC}>Projektbericht Q3</div>
        <div className={SPEC}>Aktualisiert vor 2 Stunden</div>
      </>
    ),
    after: (
      <>
        <div className="text-[14px] leading-[1.4] font-bold text-(--text-primary)">Projektbericht Q3</div>
        <div className={SPEC}>Aktualisiert vor 2 Stunden</div>
      </>
    ),
  },
  {
    name: "Kontrast",
    prop: "color",
    text: "Kontrastreicher Text tritt vor, blasserer zurück. Entscheidend ist der Helligkeitsunterschied zum Hintergrund, nicht der Farbton.",
    before: (
      <>
        <div className={SPEC}>Projektbericht Q3</div>
        <div className={SPEC}>Aktualisiert vor 2 Stunden</div>
      </>
    ),
    after: (
      <>
        <div className={SPEC}>Projektbericht Q3</div>
        <div className="text-[14px] leading-[1.4] font-normal text-(--text-ghost)">Aktualisiert vor 2 Stunden</div>
      </>
    ),
  },
  {
    name: "Abstand",
    prop: "margin · gap",
    text: "Freiraum isoliert und betont, Nähe verbindet (Modul 03). Mehr Abstand zwischen Gruppen als innerhalb einer Gruppe.",
    before: (
      <div className="flex flex-col gap-1.5">
        <div className={SPEC}>Projektbericht Q3</div>
        <div className={SPEC}>Aktualisiert vor 2 Stunden</div>
        <div className={SPEC}>Budgetplanung 2027</div>
        <div className={SPEC}>Aktualisiert gestern</div>
      </div>
    ),
    after: (
      <div className="flex flex-col gap-3.5">
        <div>
          <div className={SPEC}>Projektbericht Q3</div>
          <div className={SPEC}>Aktualisiert vor 2 Stunden</div>
        </div>
        <div>
          <div className={SPEC}>Budgetplanung 2027</div>
          <div className={SPEC}>Aktualisiert gestern</div>
        </div>
      </div>
    ),
  },
  {
    name: "Position",
    prop: "Reihenfolge im HTML",
    text: "Oben und links fängt das Auge an. Was dort steht, wird zuerst gesehen — ganz ohne Styling.",
    before: (
      <>
        <div className={SPEC}>Letzter Login: heute, 08:14</div>
        <div className={SPEC}>Tarif: Team</div>
        <div className={SPEC}>3 Rechnungen überfällig</div>
      </>
    ),
    after: (
      <>
        <div className={SPEC}>3 Rechnungen überfällig</div>
        <div className={SPEC}>Tarif: Team</div>
        <div className={SPEC}>Letzter Login: heute, 08:14</div>
      </>
    ),
  },
];

/* ── Vergleichsbeispiel 2: Navigation ── */
const NAV_ITEMS = [
  { label: "Übersicht", Icon: LayoutDashboard },
  { label: "Projekte", Icon: FolderKanban, active: true },
  { label: "Aufgaben", Icon: CheckSquare },
  { label: "Berichte", Icon: BarChart3 },
  { label: "Einstellungen", Icon: Settings },
];

/* ── Vergleichsbeispiel 4: Kennzahlen ── */
const KPIS = [
  { label: "Umsatz", value: "48.200 €", trend: "12 %", up: true },
  { label: "Bestellungen", value: "1.284", trend: "8 %", up: true },
  { label: "Neukunden", value: "392", trend: "3 %", up: false },
];

/* ── Fehlerbilder für Schritt 3 ── */
const DIAGNOSIS = [
  {
    symptom: "„Die Seite wirkt wie eine Textwand.“",
    cause: "Alle Elemente haben dieselbe Größe, dasselbe Gewicht und dieselbe Farbe.",
    fix: "Rangfolge festlegen, dann Nebensachen eine Stufe zurücknehmen.",
  },
  {
    symptom: "„Alles schreit mich an.“",
    cause: "Zu viel ist betont — fett, farbig und groß gleichzeitig.",
    fix: "Höchstens ein bis zwei primäre Elemente pro Ansicht. Der Rest wird leiser, nicht das Wichtige lauter.",
  },
  {
    symptom: "„Wo klicke ich hier?“",
    cause: "Mehrere gefüllte Buttons nebeneinander — oder gar keiner.",
    fix: "Genau eine Hauptaktion gefüllt, Alternativen mit Rahmen oder als Text.",
  },
  {
    symptom: "„Es wirkt unruhig, aber ich weiß nicht warum.“",
    cause: "Zu viele verschiedene Schriftgrößen, Gewichte und Grautöne ohne System.",
    fix: "Drei Größen, zwei Gewichte, drei Kontraststufen — und jede hat eine feste Aufgabe.",
  },
  {
    symptom: "„Die Icons springen mehr ins Auge als der Text.“",
    cause: "Icons sind kompakte, kräftige Flächen und wirken schwerer als die Schrift daneben.",
    fix: "Icons eine Kontraststufe blasser setzen als den Text, zu dem sie gehören.",
  },
  {
    symptom: "„Den grauen Text kann ich kaum lesen.“",
    cause: "Zu weit zurückgenommen: zu blass oder zu klein.",
    fix: "Auch die leiseste Stufe braucht 4,5:1 Kontrast (Modul 08) und mindestens 13 px.",
  },
];

/* ── Wohin es von hier weitergeht ── */
const NEXT_MODULES = [
  { tool: "Größe · Gewicht", modules: "Modul 05 und 06", text: "Schriftauswahl, Type Scale, Zeilenhöhe" },
  { tool: "Kontrast · Farbe", modules: "Modul 07 bis 09", text: "Farbsysteme, WCAG, Farbhierarchie" },
  { tool: "Abstand · Position", modules: "Modul 10", text: "Spacing-Skala und Layout" },
  { tool: "Tiefe", modules: "Modul 11", text: "Schatten und Elevation als weitere Ebene" },
];

const SEMANTICS_CODE = `<!-- So nicht: Das Tag wird nach Aussehen gewählt -->
<h4>Einstellungen</h4>             <!-- Seitentitel — "h1 war mir zu groß" -->
<h2>Benachrichtigungen</h2>        <!-- Abschnitt  — "h2 ist schön fett"  -->
<b>E-Mail bei neuen Kommentaren</b>

<!-- Besser: Das Tag beschreibt die Struktur, die Klasse das Aussehen -->
<h1 class="page-title">Einstellungen</h1>
<h2 class="section-title">Benachrichtigungen</h2>
<label class="field-label" for="mail">E-Mail bei neuen Kommentaren</label>

<style>
  /* Der Seitentitel einer App darf klein sein — er bleibt trotzdem die h1 */
  .page-title    { font-size: 20px; font-weight: 700; }

  /* Abschnittstitel wirken oft wie Labels: klein, ruhig, zurückgenommen */
  .section-title { font-size: 13px; font-weight: 600; letter-spacing: 0.06em;
                   text-transform: uppercase; color: var(--text-muted); }

  .field-label   { font-size: 14px; font-weight: 500; }
</style>`;

const SQUINT_SNIPPET = `// Blinzel-Test für jede Seite: in die DevTools-Konsole einfügen
document.body.style.filter = "blur(5px)";

// Zurück zum Normalzustand
document.body.style.filter = "";`;

/* ── Praxisaufgabe ── */
const CARD_MARKUP = `  <div class="card">
    <div class="header">
      <div class="avatar">LK</div>
      <div class="meta">
        <div class="name">Lena Kaufmann</div>
        <div class="action-text">hat deinen Kommentar zu <strong>&bdquo;Q3 Roadmap Review&ldquo;</strong> beantwortet.</div>
        <div class="timestamp">vor 5 Minuten &middot; Projekt: Design System</div>
      </div>
    </div>
    <div class="quote">&bdquo;Stimme dir zu &mdash; wir sollten das bis Ende Sprint 3 abschlie&szlig;en.&ldquo;</div>
    <div class="actions">
      <button class="btn btn-reply">Antworten</button>
      <button class="btn btn-read">Als gelesen markieren</button>
      <button class="btn btn-ignore">Ignorieren</button>
    </div>
  </div>`;

const CARD_TOKENS = `  /* Drei Textstufen, alle ≥ 4,5:1 auf Weiß */
  :root {
    --text-strong:   #14171f;  /* 17,9:1 */
    --text:          #3d4350;  /*  9,9:1 */
    --text-muted:    #5f6675;  /*  5,8:1 */
    --surface:       #ffffff;
    --surface-muted: #f3f4f7;
    --border:        #dfe2e8;
    --border-strong: #8b92a1;
  }`;

const CARD_BASE = `  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: system-ui, sans-serif; padding: 32px; background: var(--surface-muted); }

  .card {
    max-width: 440px; background: var(--surface);
    border: 1px solid var(--border); border-radius: 12px; padding: 16px;
  }
  .header { display: flex; align-items: flex-start; gap: 12px; }
  .avatar {
    width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: var(--surface-muted); font-size: 13px; color: var(--text-strong);
  }
  .actions { display: flex; gap: 8px; flex-wrap: wrap; }
  .btn {
    font-family: inherit; font-size: 14px; line-height: 1.3;
    padding: 7px 14px; border-radius: 8px; border: 1px solid; cursor: pointer;
  }`;

const EXERCISE_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<style>
${CARD_TOKENS}

${CARD_BASE}

  /* ── Ab hier arbeitest du ─────────────────────────────────── */

  /* TODO 1: Welche Zeile ist primär, welche sekundär, welche tertiär?
     Drücke das zuerst NUR mit font-weight und color aus.          */
  .name        { font-size: 14px; font-weight: 400; color: var(--text-strong); }
  .action-text { font-size: 14px; font-weight: 400; color: var(--text-strong); }
  .action-text strong { font-weight: 400; }
  .timestamp   { font-size: 14px; font-weight: 400; color: var(--text-strong); }
  .quote       { font-size: 14px; font-weight: 400; color: var(--text-strong);
                 line-height: 1.5; padding: 8px 12px; border-radius: 8px;
                 background: var(--surface-muted); }

  /* TODO 2: Erst jetzt die Größe — höchstens drei verschiedene. */

  /* TODO 3: Drei Gruppen (Kopf, Zitat, Aktionen) brauchen mehr Abstand
     zueinander als die Zeilen innerhalb des Kopfes.                   */
  .header { margin-bottom: 4px; }
  .name, .action-text { margin-bottom: 4px; }
  .quote  { margin-bottom: 4px; }

  /* TODO 4: Eine Hauptaktion gefüllt, eine mit Rahmen, eine nur als Text. */
  .btn-reply  { background: var(--surface-muted); border-color: var(--border); color: var(--text-strong); }
  .btn-read   { background: var(--surface-muted); border-color: var(--border); color: var(--text-strong); }
  .btn-ignore { background: var(--surface-muted); border-color: var(--border); color: var(--text-strong); }
</style>
</head>
<body>
${CARD_MARKUP}
</body>
</html>`;

const SOLUTION_RULES = `  /* Primär: der Name — gleiche Größe, aber fett und am dunkelsten */
  .name        { font-size: 15px; font-weight: 700; color: var(--text-strong); }

  /* Sekundär: was passiert ist. Nur der Titel im Satz wird leicht betont. */
  .action-text { font-size: 14px; font-weight: 400; color: var(--text); }
  .action-text strong { font-weight: 600; color: var(--text-strong); }

  /* Tertiär: wann und wo — kleiner und heller, aber noch gut lesbar */
  .timestamp   { font-size: 13px; font-weight: 400; color: var(--text-muted); }

  /* Das Zitat ist Inhalt, kein Kasten: Linie statt Fläche nimmt es zurück */
  .quote       { font-size: 14px; font-weight: 400; color: var(--text);
                 line-height: 1.5; padding: 2px 0 2px 12px;
                 border-left: 3px solid var(--border); }

  /* Abstand: wenig innerhalb des Kopfes, deutlich mehr zwischen den Gruppen */
  .name, .action-text { margin-bottom: 2px; }
  .header { margin-bottom: 14px; }
  .quote  { margin-bottom: 18px; }

  /* Buttons: gefüllt · Rahmen · nur Text */
  .btn-reply  { background: var(--text-strong); border-color: var(--text-strong);
                color: var(--surface); font-weight: 600; }
  .btn-read   { background: transparent; border-color: var(--border-strong);
                color: var(--text-strong); font-weight: 500; }
  .btn-ignore { background: transparent; border-color: transparent;
                color: var(--text-muted); padding-inline: 6px; }`;

const SOLUTION_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<style>
${CARD_TOKENS}

${CARD_BASE}

${SOLUTION_RULES}
</style>
</head>
<body>
${CARD_MARKUP}
</body>
</html>`;

const TAKEAWAY_CSS = `:root {
  /* Drei Kontraststufen für Text — alle bestehen 4,5:1 auf Weiß */
  --text-strong:   #14171f;
  --text:          #3d4350;
  --text-muted:    #5f6675;

  --surface:       #ffffff;
  --border:        #dfe2e8;
  --border-strong: #8b92a1;
}

/* ── Text: drei Ebenen, drei Größen, zwei Gewichte ── */
.text-primary   { font-size: 18px; font-weight: 700; color: var(--text-strong); }
.text-secondary { font-size: 14px; font-weight: 400; color: var(--text); }
.text-tertiary  { font-size: 13px; font-weight: 400; color: var(--text-muted); }

/* Label über einem Wert: beschreibt die Daten, ist nie die Daten */
.label { font-size: 13px; font-weight: 500; color: var(--text-muted); }
.value { font-size: 24px; font-weight: 700; color: var(--text-strong);
         font-variant-numeric: tabular-nums; }

/* ── Aktionen: gefüllt · Rahmen · Text ── */
.btn {
  font: inherit; font-size: 14px; padding: 8px 16px;
  border-radius: 8px; border: 1px solid transparent; cursor: pointer;
}
.btn-primary   { background: var(--text-strong); color: var(--surface); font-weight: 600; }
.btn-secondary { background: transparent; border-color: var(--border-strong);
                 color: var(--text-strong); font-weight: 500; }
.btn-tertiary  { background: transparent; color: var(--text-muted);
                 font-weight: 500; padding-inline: 6px; }

/* ── Abstand: Gruppen stehen weiter auseinander als ihre Zeilen ── */
.stack       { display: flex; flex-direction: column; gap: 2px; }
.stack-group { display: flex; flex-direction: column; gap: 16px; }`;

/** Mini-Karte für das Button-Beispiel */
function SaveDialog({ children }: { children: ReactNode }) {
  return (
    <div className={STAGE}>
      <div className="text-[14px] font-bold text-(--text-primary) mb-0.5">Profil bearbeiten</div>
      <div className="text-[13px] leading-[1.5] text-(--text-tertiary) mb-4">Du hast ungespeicherte Änderungen.</div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

export default function VisualHierarchyModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      <div className="max-w-[1000px] mx-auto w-full px-4 sm:px-8 py-12 flex-1">
        {/* ── TITEL ── */}
        <div className="mb-2">
          <Badge variant="module" dot>Modul 04</Badge>
        </div>
        <h1 className="text-[clamp(28px,4vw,36px)] font-extrabold leading-[1.15] tracking-[-0.5px] text-(--text-primary) mb-2 mt-0">
          Visuelle Hierarchie
        </h1>
        <p className="text-[15px] font-medium leading-normal text-(--text-secondary) mb-8 mt-0 max-w-140">
          Das wirkungsvollste Werkzeug im UI-Design: Warum ein Interface ohne Rangfolge wie eine Textwand wirkt, egal
          wie sauber der Code dahinter ist — und wie du mit drei Schritten und fünf CSS-Eigenschaften Ordnung
          hineinbringst.
        </p>

        <ModuleMeta duration="90 Min." practiceTime="~25 Min." />

        <BuildsOn modules={"gestalt-principles"} />
        <LearningGoals
          goals={[
            "Erklären, was visuelle Hierarchie ist — und warum sie darüber entscheidet, ob ein Interface gescannt oder mühsam gelesen wird",
            "Für jede Ansicht eine Rangfolge festlegen: primär, sekundär, tertiär — bevor die erste Zeile CSS entsteht",
            "Die fünf Werkzeuge Größe, Gewicht, Kontrast, Abstand und Position einzeln und kombiniert einsetzen",
            "Betonen durch Zurücknehmen: Nebensachen leiser machen, statt die Hauptsache lauter",
            "Labels, Kennzahlen und Buttons (gefüllt · Rahmen · Text) in eine klare Rangfolge bringen",
            "Semantische und visuelle Hierarchie trennen: Das HTML-Tag beschreibt die Struktur, die Klasse das Aussehen",
            "Mit dem Blinzel-Test prüfen, ob die Rangfolge auch ohne Lesen funktioniert",
          ]}
        />

        <hr className={HR} />

        {/* ── KERNGEDANKE ── */}
        <p className={EYEBROW}>Kerngedanke</p>
        <InsightRow icon={Layers} title="Hierarchie ist keine Dekoration — sie ist Kommunikation">
          Wer dein Interface öffnet, fragt unbewusst sofort: „Was ist hier das Wichtigste? Was soll ich tun?“ Visuelle
          Hierarchie beantwortet das, bevor ein Wort gelesen wurde. Fehlt sie, muss der Nutzer die Antwort selbst
          suchen — und das kostet Zeit und Vertrauen.
        </InsightRow>
        <InsightRow icon={Eye} title="Das Auge folgt Unterschieden, nicht Inhalten">
          Ein großes, fettes, kontrastreiches Element zieht den Blick an — egal, was darin steht. Deshalb ist Hierarchie kein
          Talent, sondern Handwerk: Sie beruht auf messbaren Eigenschaften, die du in CSS direkt in der Hand hast.
        </InsightRow>
        <InsightRow icon={ListOrdered} title="Erst entscheiden, dann gestalten">
          Die meisten flachen Oberflächen entstehen nicht durch falsches CSS, sondern durch eine fehlende Entscheidung:
          Niemand hat festgelegt, was wichtig ist. Hierarchie beginnt mit einer Rangfolge — das Styling ist nur ihre
          Übersetzung.
        </InsightRow>

        <div className="grid gap-4 md:grid-cols-3 mt-6">
          {STEPS.map((item) => (
            <div key={item.step} className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 shadow-(--shadow-sm)">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="size-6 rounded-full bg-(--text-primary) text-(--bg-surface) font-mono text-[13px] font-bold flex items-center justify-center shrink-0">
                  {item.step}
                </span>
                <span className="text-[15px] font-bold text-(--text-primary)">{item.title}</span>
              </div>
              <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">{item.text}</p>
            </div>
          ))}
        </div>

        <hr className={HR} />

        {/* ── EXPERIMENT ── */}
        <p className={EYEBROW}>Experiment zum Einstieg</p>
        <h2 className={H2}>Der Blinzel-Test: Was bleibt, wenn niemand liest?</h2>
        <p className={P}>
          Beide Flächen unten enthalten exakt dieselben Informationen. Links ist jede Zeile gleich behandelt — so, wie
          eine Oberfläche oft aus der Entwicklung kommt. Rechts wurde nur die Rangfolge sichtbar gemacht.{" "}
          <strong className={STRONG}>Zieh den Regler und sieh dir an, was jeweils übrig bleibt.</strong>
        </p>

        <SquintTestDemo />

        <ExplanationBox title="Was du gerade gesehen hast">
          <p>
            Unscharf gestellt bleibt von einem Interface nur noch übrig, was sich in Größe, Gewicht, Helligkeit und
            Abstand vom Rest unterscheidet. <strong>Genau das ist visuelle Hierarchie.</strong> Designer nennen das den
            Squint Test: Augen zusammenkneifen und schauen, ob die wichtigsten Dinge noch als Formen erkennbar sind.
          </p>
          <p>
            Die rechte Seite verwendet dafür weder Farbe noch Icons noch Bilder — nur Schrift und Abstand. Das gesamte
            Modul bleibt bewusst bei Grautönen: <strong>Eine Hierarchie, die in Schwarz-Weiß funktioniert, funktioniert
            immer.</strong> Farbe kommt in Modul 07 bis 09 als Verstärker dazu.
          </p>
        </ExplanationBox>

        <hr className={HR} />

        {/* ── THEORIE: LESEMUSTER ── */}
        <p className={EYEBROW}>Theorie — Warum das wichtig ist</p>
        <h2 className={H2}>Niemand liest dein Interface — man scannt es</h2>
        <p className={P}>
          Blickverfolgungs-Studien zeigen seit Jahren dasselbe Bild: Menschen lesen Bildschirmseiten nicht Wort für
          Wort. Sie überfliegen und suchen nach Ankerpunkten.{" "}
          <strong className={STRONG}>Wie gut das gelingt, hängt fast vollständig von der visuellen Hierarchie ab.</strong>{" "}
          Zwei Muster solltest du kennen:
        </p>

        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5">
            <div className={`${MICRO} mb-4`}>Ohne Hierarchie — F-Muster</div>
            <ScanPattern lines={F_PATTERN} />
            <div className="text-[14px] font-bold text-(--text-primary) mt-5 mb-1">Der Blick rutscht am linken Rand ab</div>
            <p className={CAPTION}>
              Die ersten Zeilen werden gelesen, danach nur noch Zeilenanfänge. Was rechts oder weiter unten steht, wird
              übersehen — egal, wie wichtig es ist. Dieses Muster entsteht, wenn Zwischenüberschriften und
              Hervorhebungen fehlen.
            </p>
          </div>
          <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 shadow-(--shadow-md)">
            <div className={`${MICRO} mb-4`}>Mit Hierarchie — Layer-Cake-Muster</div>
            <ScanPattern lines={LAYER_CAKE} />
            <div className="text-[14px] font-bold text-(--text-primary) mt-5 mb-1">Der Blick springt von Überschrift zu Überschrift</div>
            <p className={CAPTION}>
              Deutlich abgesetzte Überschriften werden zu Trittsteinen. Der Nutzer findet den passenden Abschnitt und
              liest nur dort. Die übrigen Zeilen bleiben ungelesen — und das ist in Ordnung.
            </p>
          </div>
        </div>
        <p className={`${CAPTION} mb-6`}>
          Schematische Darstellung: Die türkisen Anteile zeigen, welcher Teil einer Zeile angesehen wird.
        </p>

        <ReferenceBox>
          <p>
            Die Nielsen Norman Group beschreibt vier Scan-Muster aus ihren Eyetracking-Studien. Das{" "}
            <strong>F-Muster</strong> gilt dort als das am wenigsten wirksame und tritt auf, wenn Zwischenüberschriften
            und Aufzählungen fehlen. Das <strong>Layer-Cake-Muster</strong> nennt sie die mit Abstand wirksamste Art,
            eine Seite zu überfliegen (Kara Pernice, „Text Scanning Patterns: Eyetracking Evidence“, 2019).
          </p>
        </ReferenceBox>

        <RuleBox>
          Du kannst nicht bestimmen, ob jemand scannt — nur, was er dabei findet. Jede Ansicht braucht Ankerpunkte, an
          denen der Blick hängen bleibt. Ohne sie entscheidet der Zufall, welche Information ankommt.
        </RuleBox>

        <hr className={HR} />

        {/* ── SCHRITT 1 ── */}
        <p className={EYEBROW}>Schritt 1 — Entscheiden</p>
        <h2 className={H2}>Die drei Ebenen: primär, sekundär, tertiär</h2>
        <p className={P}>
          Jedes Element einer Ansicht gehört auf eine von drei Ebenen. Das ist kein starres Gesetz, sondern ein
          Denkmodell — aber eines, das dich zwingt, eine Entscheidung zu treffen:{" "}
          <strong className={STRONG}>Was muss zuerst gesehen werden? Was unterstützt? Was darf zurücktreten?</strong>
        </p>

        <TheoryCard label="Die drei Ebenen im Detail">
          <ConceptList>
            <ConceptItem title="Primär — die eine Hauptsache">
              Die Antwort auf die Frage, mit der jemand diese Ansicht öffnet. Auf einer Profilseite der Name, auf einem
              Dashboard die Kernzahl, in einem Dialog die Hauptaktion. Ein bis zwei Elemente — mehr hält keine Ansicht
              aus.
            </ConceptItem>
            <ConceptItem title="Sekundär — was die Hauptsache einordnet">
              Beschreibungen, Zwischenwerte, alternative Aktionen. Relevant, aber optisch zurückgenommen: normal statt
              fett, etwas blasser. Hier landet der Blick, nachdem das Primäre verarbeitet ist.
            </ConceptItem>
            <ConceptItem title="Tertiär — was nur auffindbar sein muss">
              Zeitstempel, IDs, Metadaten, selten gebrauchte Links. Niemand sucht sie zuerst, aber wer sie braucht, muss
              sie finden: kleiner und blasser, aber weiterhin gut lesbar.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <h3 className={H3}>Probier es aus — du entscheidest, die Karte folgt</h3>
        <p className={P}>
          Eine Versandbestätigung mit sechs Elementen. Im Ausgangszustand ist alles primär — so, als hätte niemand eine
          Entscheidung getroffen. Ordne jedem Element eine Ebene zu.{" "}
          <strong className={STRONG}>Du schreibst dabei kein CSS: Das Aussehen jeder Ebene steht fest, du legst nur die
          Rangfolge fest.</strong>
        </p>

        <PriorityAssigner />

        <ExplanationBox title="Was die Übung zeigt">
          <p>
            Die Rangfolge ergibt sich nicht aus dem Datenmodell, sondern aus der <strong>Frage des Nutzers</strong>. In
            der Datenbank steht die Bestellnummer ganz oben, sie ist der Primärschlüssel. Für den Menschen, der auf sein
            Paket wartet, ist sie fast egal.
          </p>
          <p>
            Dieselben sechs Elemente können auf einer anderen Seite anders gewichtet sein: In der Bestellübersicht des
            Kundendienstes ist die Bestellnummer primär. <strong>Hierarchie gehört zur Ansicht, nicht zu den Daten.</strong>
          </p>
        </ExplanationBox>

        <RuleBox>
          Bevor du eine Ansicht gestaltest, schreib einen Satz auf: „Wer das hier öffnet, will vor allem wissen …“ Was
          diesen Satz beantwortet, ist primär. Alles andere ist sekundär oder tertiär — auch wenn es dir beim Bauen
          wichtig vorkam.
        </RuleBox>

        <hr className={HR} />

        {/* ── SCHRITT 2 ── */}
        <p className={EYEBROW}>Schritt 2 — Ausdrücken</p>
        <h2 className={H2}>Die fünf Werkzeuge der Hierarchie</h2>
        <p className={P}>
          Steht die Rangfolge, wird sie mit konkreten CSS-Eigenschaften sichtbar gemacht. Es gibt genau fünf Hebel. In
          jedem Mini-Beispiel unten ändert sich <strong className={STRONG}>nur eine einzige Eigenschaft</strong> — so
          siehst du, was jedes Werkzeug allein leistet.
        </p>

        <div className={`${PANEL} overflow-hidden divide-y divide-(--bg-elevated)`}>
          {TOOLS.map((tool, i) => (
            <div key={tool.name} className="grid gap-4 p-5 md:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_minmax(0,4fr)] md:items-start">
              <div>
                <div className="flex items-baseline gap-2.5 mb-1">
                  <span className="font-mono text-[13px] font-bold text-(--accent-text)">{i + 1}</span>
                  <span className="text-[15px] font-bold text-(--text-primary)">{tool.name}</span>
                </div>
                <code className="inline-block font-mono text-[13px] text-(--text-tertiary) bg-(--bg-elevated) px-1.5 rounded mb-2">
                  {tool.prop}
                </code>
                <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">{tool.text}</p>
              </div>
              <Specimen label="Ohne">{tool.before}</Specimen>
              <Specimen label="Mit">{tool.after}</Specimen>
            </div>
          ))}
        </div>

        <h3 className={H3}>Hierarchie-Labor — Werkzeuge kombinieren</h3>
        <p className={P}>
          Eine Rechnungs-Karte, in der die Rangfolge feststeht: Der Betrag ist primär, Fälligkeit und Kunde sind
          sekundär, Nummer und Erstelldatum tertiär. Schalte die Werkzeuge einzeln zu und lies rechts mit, welche
          CSS-Zeilen sich ändern. <strong className={STRONG}>Vergleiche vor allem „Nur Größe“ mit „Gewicht +
          Kontrast“.</strong>
        </p>

        <HierarchyLab />

        <ReferenceBox title="Faustregeln aus der Praxis">
          <p>
            Die Nielsen Norman Group empfiehlt bewusst enge Grenzen: <strong>höchstens drei Schriftgrößen</strong>{" "}
            (klein, mittel, groß), <strong>höchstens drei Kontraststufen</strong> und{" "}
            <strong>höchstens zwei große Elemente</strong> pro Ansicht. Entscheidend sei außerdem nicht der Farbton
            eines Elements, sondern sein Kontrast in Helligkeit und Sättigung zur Umgebung (Kelley Gordon, „Visual
            Hierarchy in UX: Definition“, 2021).
          </p>
        </ReferenceBox>

        <RuleBox>
          Nimm immer das leiseste Werkzeug, das reicht. Wenn Gewicht allein den Unterschied macht, brauchst du keine
          zweite Schriftgröße. Jede zusätzliche Größe, jedes zusätzliche Gewicht ist eine weitere Stimme im Raum.
        </RuleBox>

        <hr className={HR} />

        {/* ── VERGLEICH 1 ── */}
        <p className={EYEBROW}>Vergleichsbeispiel 1 von 5</p>
        <h2 className={H2}>Größe ist nicht alles</h2>
        <p className={P}>
          Der häufigste Reflex: Was wichtig ist, wird größer gemacht — und was unwichtig ist, kleiner. Das führt zu
          riesigen Überschriften und winzigem Nebentext. In dichten Oberflächen wie Dashboards, Tabellen oder
          Einstellungsseiten ist für große Schrift ohnehin kein Platz.{" "}
          <strong className={STRONG}>Gewicht und Kontrast leisten dieselbe Arbeit auf engerem Raum.</strong>
        </p>

        <ComparisonPanel
          bad={{
            label: "Vorher — nur Größe",
            children: (
              <div className="flex flex-col gap-3">
                <div className={STAGE}>
                  <div className="text-[26px] font-normal leading-[1.2] text-(--text-primary) mb-2">Release 4.2 ist live</div>
                  <div className="text-[14px] leading-[1.5] text-(--text-primary) mb-2">
                    Neue Exportfunktion, schnellere Suche und 14 behobene Fehler.
                  </div>
                  <div className="text-[13px] text-(--text-primary)">Gestern · Jonas Weber</div>
                </div>
                <p className={CAPTION}>
                  26 / 14 / 13 px, alles normal, alles in voller Textfarbe. Der Titel dominiert die Karte — Text und Meta-Zeile
                  verschwimmen trotzdem.
                </p>
              </div>
            ),
          }}
          good={{
            label: "Nachher — Gewicht und Kontrast",
            children: (
              <div className="flex flex-col gap-3">
                <div className={STAGE}>
                  <div className="text-[16px] font-bold leading-[1.3] text-(--text-primary) mb-1">Release 4.2 ist live</div>
                  <div className="text-[14px] leading-[1.5] text-(--text-tertiary) mb-2">
                    Neue Exportfunktion, schnellere Suche und 14 behobene Fehler.
                  </div>
                  <div className="text-[13px] text-(--text-ghost)">Gestern · Jonas Weber</div>
                </div>
                <p className={CAPTION}>
                  16 / 14 / 13 px. Der Titel ist zehn Pixel kleiner und trotzdem eindeutig die Hauptsache — die Karte
                  spart dabei Platz.
                </p>
              </div>
            ),
          }}
        />

        <AnnotationGrid
          items={[
            { label: "Größen", value: "26–13 → 16–13 px" },
            { label: "Gewicht", value: "400 → 700 / 400" },
            { label: "Kontrast", value: "1 → 3 Stufen" },
          ]}
        />

        <RuleBox>
          Lege dich auf zwei Gewichte fest: normal (400–500) für fast alles, fett (600–700) für das, was hervortreten
          soll. Gewichte unter 400 sind in kleinen Größen schwer lesbar — nimm zum Zurücknehmen lieber eine blassere
          Farbe als eine dünnere Schrift.
        </RuleBox>

        <hr className={HR} />

        {/* ── VERGLEICH 2 ── */}
        <p className={EYEBROW}>Vergleichsbeispiel 2 von 5</p>
        <h2 className={H2}>Betonen durch Zurücknehmen</h2>
        <p className={P}>
          Wenn ein Element nicht genug auffällt, greift man instinktiv zu mehr: größer, fetter, farbiger. Oft liegt das
          Problem aber gar nicht am Element selbst — sondern daran, dass alles drumherum genauso laut ist.{" "}
          <strong className={STRONG}>Mach die Konkurrenz leiser, statt den Gewinner lauter.</strong>
        </p>

        <ComparisonPanel
          bad={{
            label: "Vorher — aktiver Eintrag lauter",
            children: (
              <div className="flex flex-col gap-3">
                <div className={`${STAGE} flex flex-col gap-1`}>
                  {NAV_ITEMS.map(({ label, Icon, active }) => (
                    <div
                      key={label}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[14px] ${
                        active
                          ? "bg-(--text-primary) text-(--bg-surface) font-extrabold"
                          : "text-(--text-primary) font-semibold"
                      }`}
                    >
                      <Icon size={16} strokeWidth={2.25} />
                      {label}
                    </div>
                  ))}
                </div>
                <p className={CAPTION}>
                  Alle Einträge sind kräftig und halbfett. Damit „Projekte“ noch auffällt, braucht es einen vollflächigen
                  Balken — die Navigation wird zum lautesten Teil der Seite.
                </p>
              </div>
            ),
          }}
          good={{
            label: "Nachher — die anderen leiser",
            children: (
              <div className="flex flex-col gap-3">
                <div className={`${STAGE} flex flex-col gap-1`}>
                  {NAV_ITEMS.map(({ label, Icon, active }) => (
                    <div
                      key={label}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[14px] ${
                        active
                          ? "bg-(--bg-elevated) text-(--text-primary) font-semibold"
                          : "text-(--text-ghost) font-normal"
                      }`}
                    >
                      <Icon size={16} strokeWidth={active ? 2 : 1.75} />
                      {label}
                    </div>
                  ))}
                </div>
                <p className={CAPTION}>
                  Inaktive Einträge sind blasser und normal gesetzt. Der aktive Eintrag braucht nur noch kräftigen Text und
                  eine zarte Fläche — er hebt sich ab, ohne zu schreien.
                </p>
              </div>
            ),
          }}
        />

        <ExplanationBox title="Analyse">
          <p>
            Betonung ist immer relativ. Ein Element wirkt nur so stark wie sein <strong>Abstand zum Rest</strong>. Hebst
            du etwas hervor, ohne etwas anderes zurückzunehmen, steigt bloß der Lärmpegel — und beim nächsten wichtigen
            Element musst du noch lauter werden.
          </p>
          <p>
            Das gilt genauso für Icons: Sie sind kompakte, kräftige Flächen und wirken schwerer als der Text daneben. Im
            Nachher-Beispiel sind sie deshalb mit den inaktiven Einträgen blasser geworden.
          </p>
        </ExplanationBox>

        <RuleBox>
          Frag bei jedem „Das fällt nicht genug auf“ zuerst: Was konkurriert damit — und kann das leiser werden? Erst
          wenn die Antwort nein lautet, darf das Element selbst lauter werden.
        </RuleBox>

        <hr className={HR} />

        {/* ── VERGLEICH 3 ── */}
        <p className={EYEBROW}>Vergleichsbeispiel 3 von 5</p>
        <h2 className={H2}>Labels sind die letzte Wahl</h2>
        <p className={P}>
          Daten kommen als Schlüssel-Wert-Paare aus der API — und landen oft genau so auf dem Bildschirm:{" "}
          <code className="font-mono text-[13px] bg-(--bg-elevated) px-1 rounded">Name: …</code>,{" "}
          <code className="font-mono text-[13px] bg-(--bg-elevated) px-1 rounded">E-Mail: …</code>. Das Problem: In
          diesem Format bekommt jede Zeile dasselbe Gewicht, und die Hälfte des Textes besteht aus Wörtern, die niemand
          braucht. <strong className={STRONG}>Viele Daten erklären sich durch ihr Format oder ihren Platz selbst.</strong>
        </p>

        <ComparisonPanel
          bad={{
            label: "Vorher — Label: Wert",
            children: (
              <div className="flex flex-col gap-3">
                <div className={`${STAGE} flex flex-col gap-1 text-[14px] leading-[1.5] text-(--text-primary)`}>
                  <div>Name: Lena Kaufmann</div>
                  <div>Rolle: Produktdesignerin</div>
                  <div>Standort: Berlin</div>
                  <div>E-Mail: lena.kaufmann@beispiel.de</div>
                  <div>Telefon: 030 1234 5678</div>
                  <div>Projekte: 12</div>
                </div>
                <p className={CAPTION}>Sechs gleich schwere Zeilen. Um die Person zu finden, muss man die erste lesen.</p>
              </div>
            ),
          }}
          good={{
            label: "Nachher — Daten ohne Label",
            children: (
              <div className="flex flex-col gap-3">
                <div className={STAGE}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="size-10 rounded-full bg-(--bg-elevated) flex items-center justify-center text-[13px] font-bold text-(--text-tertiary) shrink-0">
                      LK
                    </div>
                    <div className="min-w-0">
                      <div className="text-[16px] font-bold leading-[1.3] text-(--text-primary)">Lena Kaufmann</div>
                      <div className="text-[13px] leading-[1.5] text-(--text-tertiary)">Produktdesignerin · 12 Projekte</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 text-[13px] leading-[1.5] text-(--text-tertiary)">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail size={14} className="text-(--text-ghost) shrink-0" />
                      <span className="truncate">lena.kaufmann@beispiel.de</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-(--text-ghost) shrink-0" />
                      030 1234 5678
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-(--text-ghost) shrink-0" />
                      Berlin
                    </div>
                  </div>
                </div>
                <p className={CAPTION}>
                  Kein einziges Label — und nichts fehlt. Eine E-Mail-Adresse erkennt man als E-Mail-Adresse.
                </p>
              </div>
            ),
          }}
        />

        <TheoryCard label="Drei Wege, ein Label loszuwerden">
          <ConceptList>
            <ConceptItem title="Das Format spricht für sich">
              E-Mail-Adressen, Telefonnummern, Preise und Datumsangaben erkennt jeder ohne Beschriftung. Ein kleines
              Icon kann helfen, ist aber oft schon nicht mehr nötig.
            </ConceptItem>
            <ConceptItem title="Der Platz spricht für sich">
              Die fette Zeile ganz oben in einer Profil-Karte ist der Name. Die Zeile direkt darunter ist die Rolle.
              Niemand braucht dafür ein „Name:“ davor.
            </ConceptItem>
            <ConceptItem title="Label und Wert verschmelzen">
              Aus <code>Projekte: 12</code> wird „12 Projekte“, aus <code>Auf Lager: 3</code> wird „Noch 3 auf Lager“.
              Die Information bleibt vollständig, liest sich wie Sprache und lässt sich als Einheit gestalten.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <ReferenceBox>
          <p>
            Dieses Prinzip stammt aus <strong>Refactoring UI</strong> von Adam Wathan und Steve Schoger („Labels are a
            last resort“). Die Autoren nennen auch die Ausnahme: Wenn Nutzer gezielt <em>nach dem Label</em> suchen —
            etwa in einer technischen Spezifikation nach „WLAN“ oder „Akku“ —, wird das Label betont und der Wert
            leicht zurückgenommen.
          </p>
        </ReferenceBox>

        <hr className={HR} />

        {/* ── VERGLEICH 4 ── */}
        <p className={EYEBROW}>Vergleichsbeispiel 4 von 5</p>
        <h2 className={H2}>Wenn Labels nötig sind: Kennzahlen</h2>
        <p className={P}>
          Auf einem Dashboard stehen mehrere gleichartige Zahlen nebeneinander. „48.200“ erklärt sich nicht selbst —
          hier braucht es Labels. Dann gilt:{" "}
          <strong className={STRONG}>Das Label beschreibt die Daten, es ist nie die Daten.</strong> Es tritt zurück,
          damit die Zahl führen kann.
        </p>

        <ComparisonPanel
          bad={{
            label: "Vorher",
            children: (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-3 gap-2">
                  {KPIS.map((kpi) => (
                    <div key={kpi.label} className="rounded-lg bg-(--bg-base) border border-(--bg-elevated) p-3 min-w-0 text-[13px] leading-[1.5] text-(--text-primary)">
                      <div className="truncate">{kpi.label}</div>
                      <div>{kpi.value}</div>
                      <div>{kpi.up ? "+" : "−"}{kpi.trend}</div>
                    </div>
                  ))}
                </div>
                <p className={CAPTION}>Label, Zahl und Trend sehen gleich aus. Neun Textstücke, kein Einstiegspunkt.</p>
              </div>
            ),
          }}
          good={{
            label: "Nachher",
            children: (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-3 gap-2">
                  {KPIS.map((kpi) => {
                    const TrendIcon = kpi.up ? TrendingUp : TrendingDown;
                    return (
                      <div key={kpi.label} className="rounded-lg bg-(--bg-base) border border-(--bg-elevated) p-3 min-w-0">
                        <div className="text-[13px] leading-[1.4] text-(--text-ghost) truncate">{kpi.label}</div>
                        <div className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) tabular-nums whitespace-nowrap">
                          {kpi.value}
                        </div>
                        <div className="flex items-center gap-1 text-[13px] font-medium leading-[1.5] text-(--text-tertiary) tabular-nums">
                          <TrendIcon size={14} className="shrink-0" />
                          {kpi.trend}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className={CAPTION}>
                  Drei Zahlen fallen sofort auf. Label und Trend ordnen sich unter — drei Ebenen, ohne das Layout zu
                  verändern.
                </p>
              </div>
            ),
          }}
        />

        <AnnotationGrid
          items={[
            { label: "Label", value: "tertiär · blass" },
            { label: "Zahl", value: "primär · 19 px / 700" },
            { label: "Trend", value: "sekundär · mit Icon" },
          ]}
        />

        <ExplanationBox title="Analyse">
          <p>
            Im Vorher-Beispiel konkurrieren Label, Zahl und Trend gleichwertig. Im Nachher-Beispiel ist{" "}
            <strong>die Zahl primär</strong> (größer, fett, voller Kontrast), der Trend sekundär und das Label tertiär. Die
            Richtung des Trends zeigt ein Pfeil-Icon statt eines Vorzeichens — sie ist damit auch ohne Farbe lesbar.
          </p>
          <p>
            Rot und Grün für den Trend kämen als zusätzliche Ebene obendrauf. Wie du Farbe gezielt als Signal einsetzt,
            ohne dich allein auf sie zu verlassen, ist Thema von Modul 09.
          </p>
        </ExplanationBox>

        <hr className={HR} />

        {/* ── VERGLEICH 5 ── */}
        <p className={EYEBROW}>Vergleichsbeispiel 5 von 5</p>
        <h2 className={H2}>Aktionen haben eine Rangfolge: gefüllt, Rahmen, Text</h2>
        <p className={P}>
          Buttons sind die deutlichsten Hierarchie-Träger eines Interfaces: Sie stehen für Aktionen, und Aktionen sind
          nie gleich wichtig. Sehen alle Buttons gleich aus, sagt das Interface: „Such dir etwas aus.“{" "}
          <strong className={STRONG}>Drei Stufen reichen für fast jede Ansicht.</strong>
        </p>

        <ComparisonPanel
          bad={{
            label: "Vorher — alle Buttons gleich",
            children: (
              <div className="flex flex-col gap-3">
                <SaveDialog>
                  {["Speichern", "Abbrechen", "Verlauf anzeigen"].map((label) => (
                    <span
                      key={label}
                      className="text-[13px] font-normal px-3.5 py-1.5 rounded-md bg-(--bg-elevated) border border-(--bg-hover) text-(--text-primary)"
                    >
                      {label}
                    </span>
                  ))}
                </SaveDialog>
                <p className={CAPTION}>Man muss alle drei Beschriftungen lesen, um die richtige Aktion zu finden.</p>
              </div>
            ),
          }}
          good={{
            label: "Nachher — drei Stufen",
            children: (
              <div className="flex flex-col gap-3">
                <SaveDialog>
                  <span className="text-[13px] font-semibold px-3.5 py-1.5 rounded-md bg-(--text-primary) border border-(--text-primary) text-(--bg-surface)">
                    Speichern
                  </span>
                  <span className="text-[13px] font-medium px-3.5 py-1.5 rounded-md bg-transparent border border-(--text-ghost) text-(--text-primary)">
                    Abbrechen
                  </span>
                  <span className="text-[13px] font-medium px-1.5 py-1.5 text-(--text-tertiary) underline underline-offset-2">
                    Verlauf anzeigen
                  </span>
                </SaveDialog>
                <p className={CAPTION}>
                  Die Hauptaktion erkennt man, ohne zu lesen. Die Alternativen sind da, drängen sich aber nicht auf.
                </p>
              </div>
            ),
          }}
        />

        <div className={`${PANEL} overflow-hidden divide-y divide-(--bg-elevated)`}>
          {[
            {
              level: "Primär",
              form: "Gefüllte Fläche",
              text: "Höchster Kontrast der Ansicht. Für die eine Aktion, wegen der die Ansicht existiert: Speichern, Senden, Kaufen.",
            },
            {
              level: "Sekundär",
              form: "Rahmen oder zarte Fläche",
              text: "Klar als Button erkennbar, aber ohne Füllung. Für die naheliegende Alternative: Abbrechen, Zurück, Vorschau.",
            },
            {
              level: "Tertiär",
              form: "Nur Text",
              text: "Sieht aus wie ein Link. Für alles, was man selten braucht: Verlauf, Mehr erfahren, Exportieren.",
            },
          ].map((row) => (
            <div key={row.level} className="grid gap-x-4 gap-y-1 px-5 py-4 sm:grid-cols-[110px_190px_1fr] sm:items-baseline">
              <span className="text-[14px] font-bold text-(--text-primary)">{row.level}</span>
              <span className="font-mono text-[13px] font-semibold text-(--accent-text)">{row.form}</span>
              <span className="text-[13px] leading-[1.6] text-(--text-secondary)">{row.text}</span>
            </div>
          ))}
        </div>

        <ReferenceBox>
          <p>
            <strong>Material Design</strong> ordnet seine Button-Typen nach genau diesem Prinzip in Betonungsstufen:
            Der gefüllte Button (Filled) ist für die Hauptaktion mit hoher Betonung gedacht, der Button mit Rahmen
            (Outlined) für wichtige, aber nicht primäre Aktionen, der Text-Button für die niedrigste Stufe.
          </p>
        </ReferenceBox>

        <RuleBox>
          Eine gefüllte Hauptaktion pro Ansicht. Steht ein zweiter gefüllter Button daneben, hast du die Entscheidung
          aus Schritt 1 nicht getroffen. Und: Die Rangfolge bestimmt die Form, nicht die Bedeutung — ein
          „Löschen“-Button ist nicht automatisch primär und rot. Wie das mit Farbe zusammenspielt, zeigt Modul 09.
        </RuleBox>

        <hr className={HR} />

        {/* ── FÜR ENTWICKLER ── */}
        <p className={EYEBROW}>Für Entwickler</p>
        <h2 className={H2}>Semantische Hierarchie ist nicht visuelle Hierarchie</h2>
        <p className={P}>
          HTML bringt mit <code className="font-mono text-[13px] bg-(--bg-elevated) px-1 rounded">h1</code> bis{" "}
          <code className="font-mono text-[13px] bg-(--bg-elevated) px-1 rounded">h6</code> eine eigene Hierarchie mit —
          und die Browser-Standards machen daraus große, fette Überschriften. Das verleitet zu zwei Fehlern: Tags werden
          nach ihrem Aussehen ausgewählt, oder Überschriften werden groß gestaltet, nur weil sie Überschriften sind.{" "}
          <strong className={STRONG}>Beides sind getrennte Entscheidungen.</strong>
        </p>

        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 shadow-(--shadow-sm)">
            <div className={`${MICRO} mb-2`}>Das Tag beantwortet</div>
            <div className="text-[15px] font-bold text-(--text-primary) mb-1">Welche Rolle hat das Element im Dokument?</div>
            <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">
              Für Screenreader, Suchmaschinen und Tastatur-Navigation. Eine <code className="font-mono text-[13px] bg-(--bg-elevated) px-1 rounded">h1</code>{" "}
              pro Seite, keine Ebene überspringen — unabhängig davon, wie es aussieht.
            </p>
          </div>
          <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 shadow-(--shadow-sm)">
            <div className={`${MICRO} mb-2`}>Die Klasse beantwortet</div>
            <div className="text-[15px] font-bold text-(--text-primary) mb-1">Wie wichtig ist es für das Auge?</div>
            <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">
              Ein Abschnittstitel wie „Benachrichtigungen“ ist semantisch eine Überschrift, optisch aber oft nur ein
              Label: klein, ruhig, zurückgenommen. Der Inhalt darunter ist die Hauptsache.
            </p>
          </div>
        </div>

        <CodeBlock language="HTML + CSS — Struktur und Aussehen trennen" code={SEMANTICS_CODE} />

        <RuleBox>
          Wähle das Tag nach der Struktur und gestalte es mit einer Klasse. Wenn du ein h3 nimmst, weil h2 „zu groß
          aussieht“, reparierst du ein CSS-Problem im HTML — und machst die Seite für Screenreader unverständlich.
        </RuleBox>

        <hr className={HR} />

        {/* ── SCHRITT 3 ── */}
        <p className={EYEBROW}>Schritt 3 — Prüfen</p>
        <h2 className={H2}>Woran du fehlende Hierarchie erkennst</h2>
        <p className={P}>
          Nach ein paar Stunden an einer Ansicht siehst du sie nicht mehr mit frischen Augen. Der Blinzel-Test vom
          Anfang holt den ersten Eindruck zurück — und er funktioniert auf jeder echten Seite mit einer Zeile in der
          Browser-Konsole:
        </p>

        <CodeBlock language="JavaScript — Blinzel-Test in den DevTools" code={SQUINT_SNIPPET} />

        <p className={P}>
          Frag dich bei der unscharfen Seite drei Dinge: <strong className={STRONG}>Wo fängt mein Blick an?</strong>{" "}
          Ist das die Hauptsache aus Schritt 1? <strong className={STRONG}>Erkenne ich die Hauptaktion?</strong> Und:{" "}
          <strong className={STRONG}>Sehe ich Gruppen</strong> oder eine gleichmäßige Fläche? Wenn etwas nicht stimmt,
          hilft diese Übersicht bei der Diagnose.
        </p>

        <div className={`${PANEL} overflow-hidden`}>
          <div className="hidden md:grid grid-cols-[minmax(0,4fr)_minmax(0,5fr)_minmax(0,5fr)] gap-4 px-5 py-3 border-b border-(--bg-elevated) bg-(--bg-base)">
            <span className={MICRO}>Symptom</span>
            <span className={MICRO}>Ursache</span>
            <span className={MICRO}>Mittel</span>
          </div>
          <div className="divide-y divide-(--bg-elevated)">
            {DIAGNOSIS.map((row) => (
              <div key={row.symptom} className="grid gap-x-4 gap-y-1.5 px-5 py-4 md:grid-cols-[minmax(0,4fr)_minmax(0,5fr)_minmax(0,5fr)]">
                <div className="text-[14px] font-bold leading-[1.5] text-(--text-primary)">{row.symptom}</div>
                <div className="text-[13px] leading-[1.6] text-(--text-tertiary)">{row.cause}</div>
                <div className="text-[13px] leading-[1.6] text-(--text-secondary)">{row.fix}</div>
              </div>
            ))}
          </div>
        </div>

        <RuleBox title="Die Grenze nach unten">
          Zurücknehmen heißt nicht verstecken. Auch tertiärer Text muss lesbar bleiben: mindestens 4,5:1 Kontrast zum
          Hintergrund und nicht kleiner als 13 px. Und Hierarchie darf nie allein an der Farbe hängen — wer Farben
          schlecht unterscheidet, braucht zusätzlich Gewicht, Größe oder Position.
        </RuleBox>

        <hr className={HR} />

        {/* ── PRAXISAUFGABE ── */}
        <p className={EYEBROW}>Praxisaufgabe</p>
        <h2 className={H2}>Hierarchie in eine Benachrichtigungs-Karte bringen</h2>

        <ExerciseBlock
          title="Aufgabenstellung"
          tasks={[
            "Schritt 1 — entscheide: Welche der vier Textzeilen (Name, Aktion, Zeitstempel, Zitat) ist primär, welche sekundär, welche tertiär?",
            "Schritt 2 — drücke die Rangfolge zuerst nur mit font-weight und color aus. Die Variablen --text-strong, --text und --text-muted stehen bereit",
            "Verändere erst danach die Schriftgröße — höchstens drei verschiedene Größen in der ganzen Karte",
            "Trenne Kopf, Zitat und Aktionen durch Abstand in drei Gruppen: wenig Abstand innerhalb, deutlich mehr dazwischen",
            "Bring die drei Buttons in eine Rangfolge: eine gefüllte Hauptaktion, eine mit Rahmen, eine nur als Text",
            "Schritt 3 — prüfe: Füge vorübergehend body { filter: blur(4px); } ein. Erkennst du Name und Hauptaktion noch?",
          ]}
        >
          Die Karte unten ist vollständig flach: Jede Zeile hat dieselbe Größe, dasselbe Gewicht und dieselbe Farbe,
          alle drei Buttons sehen gleich aus. Die Information ist da — aber das Interface sagt nicht, was wichtig ist.
          Bring eine klare Drei-Ebenen-Hierarchie hinein, ohne das HTML zu verändern. Im Tab „Inspector“ kannst du
          Elemente auch anklicken und ihre Eigenschaften direkt verstellen.
        </ExerciseBlock>

        <LiveEditor title="Benachrichtigungs-Karte" html={EXERCISE_HTML} previewHeight={520} />

        <details className="group bg-(--bg-surface) border border-(--bg-elevated) rounded-xl mt-6 mb-6 shadow-(--shadow-sm)">
          <summary className="cursor-pointer select-none px-6 py-4 text-[14px] font-semibold text-(--text-primary) marker:text-(--accent)">
            Musterlösung anzeigen
            <span className="font-normal text-(--text-tertiary)"> — erst selbst probieren</span>
          </summary>
          <div className="px-6 pb-2">
            <p className={P}>
              Eine mögliche Lösung. Der Name führt, weil man zuerst wissen will, <em>wer</em> etwas getan hat. Achte
              darauf, wie wenig sich die Schriftgrößen unterscheiden (15 / 14 / 13 px) — die Rangfolge entsteht fast
              nur aus Gewicht, Kontrast und Abstand.
            </p>
            <CodeBlock language="CSS — Musterlösung" code={SOLUTION_RULES} />
          </div>
        </details>

        <hr className={HR} />

        {/* ── ZUM MITNEHMEN ── */}
        <p className={EYEBROW}>Zum Mitnehmen</p>
        <h2 className={H2}>Ein Hierarchie-System für dein Projekt</h2>
        <p className={P}>
          Das Grundgerüst als CSS: drei Textebenen, das Label-Wert-Muster, drei Button-Stufen und zwei
          Abstands-Helfer. Die Werte sind ein Startpunkt — wichtig ist, dass du dich auf wenige Stufen festlegst und
          jede eine Aufgabe hat.
        </p>
        <CodeBlock language="CSS — Hierarchie-System" code={TAKEAWAY_CSS} />

        <h3 className={H3}>Die fertige Karte als eigenständige Datei</h3>
        <p className={P}>
          Die gelöste Benachrichtigungs-Karte mit HTML und CSS in einem Stück — als <code className="font-mono text-[13px] bg-(--bg-elevated) px-1 rounded">.html</code>{" "}
          speichern und im Browser öffnen.
        </p>
        <CodeBlock language="HTML + CSS — Benachrichtigungs-Karte" code={SOLUTION_HTML} />

        <TheoryCard label="Merkliste">
          <ConceptList>
            <ConceptItem title="Entscheiden, ausdrücken, prüfen">
              Erst die Rangfolge festlegen, dann mit CSS sichtbar machen, dann unscharf stellen und kontrollieren.
            </ConceptItem>
            <ConceptItem title="Drei Ebenen, wenige Stufen">
              Primär, sekundär, tertiär — mit höchstens drei Größen, zwei Gewichten und drei Kontraststufen.
            </ConceptItem>
            <ConceptItem title="Gewicht und Kontrast vor Größe">
              Die leisen Werkzeuge reichen öfter, als man denkt, und sparen Platz.
            </ConceptItem>
            <ConceptItem title="Zurücknehmen statt aufdrehen">
              Wenn etwas nicht auffällt, mach zuerst die Konkurrenz leiser.
            </ConceptItem>
            <ConceptItem title="Labels treten zurück, Daten führen">
              Wo möglich ganz ohne Label, sonst klein und blass über dem Wert.
            </ConceptItem>
            <ConceptItem title="Eine gefüllte Hauptaktion pro Ansicht">
              Gefüllt, Rahmen, Text — die Form folgt der Rangfolge.
            </ConceptItem>
            <ConceptItem title="Tag für die Struktur, Klasse für das Aussehen">
              Semantische und visuelle Hierarchie sind zwei getrennte Entscheidungen.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <p className={EYEBROW}>Ausblick</p>
        <h3 className="text-[15px] font-bold leading-[1.4] text-(--text-primary) mt-0 mb-2">Jedes Werkzeug bekommt sein eigenes Modul</h3>
        <p className={P}>
          Du kennst jetzt die fünf Hebel. Die folgenden Module machen aus jedem ein System mit festen Stufen — damit du
          nicht bei jeder Karte neu entscheiden musst.
        </p>
        <div className={`${PANEL} overflow-hidden divide-y divide-(--bg-elevated)`}>
          {NEXT_MODULES.map((row) => (
            <div key={row.tool} className="grid gap-x-4 gap-y-0.5 px-5 py-3 sm:grid-cols-[170px_150px_1fr] sm:items-baseline">
              <span className="text-[14px] font-bold text-(--text-primary)">{row.tool}</span>
              <span className="font-mono text-[13px] font-semibold text-(--accent-text)">{row.modules}</span>
              <span className="text-[13px] leading-[1.6] text-(--text-secondary)">{row.text}</span>
            </div>
          ))}
        </div>
      </div>

      <ModuleNav prevModule={prevModule} nextModule={nextModule} />
    </div>
  );
}
