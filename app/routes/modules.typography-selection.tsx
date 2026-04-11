import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Type,
  ShieldCheck,
  Building2,
  Zap,
  Smile,
  Feather,
} from "lucide-react";
import { modules } from "~/data/modules";
import { ModuleNav } from "~/routes/modules.$slug";
import { Badge } from "~/components/ui/Badge";
import { ModuleMeta } from "~/components/ui/ModuleMeta";
import { LearningGoals } from "~/components/ui/LearningGoals";
import { InsightRow } from "~/components/ui/InsightRow";
import { TheoryCard } from "~/components/ui/TheoryCard";
import { ConceptList, ConceptItem } from "~/components/ui/ConceptList";
import { RuleBox } from "~/components/ui/RuleBox";
import { ComparisonPanel } from "~/components/ui/ComparisonPanel";
import { AnnotationGrid } from "~/components/ui/AnnotationGrid";
import { ExplanationBox } from "~/components/ui/ExplanationBox";
import { ExerciseBlock } from "~/components/ui/ExerciseBlock";
import { CodeBlock } from "~/components/ui/CodeBlock";
import { LiveEditor } from "~/components/live-editor/LiveEditor";
import type { PropertyControl } from "~/components/live-editor/types";

const EXERCISE_HTML = `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    background: #f4f4f8;
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh; padding: 32px;
    --text-primary: #12121e;
    --text-secondary: #52526e;
    --text-tertiary: #9090aa;
    --text-ghost: #b8b8cc;
    --accent: #0ea5a0;
    --bg-surface: #ffffff;
    --bg-base: #f4f4f8;
    --bg-elevated: #eeeef4;
  }

  .card {
    background: var(--bg-surface);
    border: 1px solid var(--bg-elevated);
    border-radius: 12px;
    padding: 24px;
    width: 340px;
  }

  .header { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }

  .avatar {
    width: 48px; height: 48px; border-radius: 50%;
    background: var(--bg-elevated);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; font-weight: 400; color: var(--text-secondary); flex-shrink: 0;
  }

  .name     { font-size: 14px; font-weight: 400; color: var(--text-primary); margin-bottom: 2px; }
  .username { font-size: 12px; font-weight: 400; color: var(--text-primary); }

  .role     { font-size: 12px; font-weight: 400; color: var(--text-primary); margin-bottom: 8px; }
  .meta     { font-size: 12px; font-weight: 400; color: var(--text-primary); margin-bottom: 16px; }

  .tags { display: flex; gap: 8px; }
  .tag {
    font-size: 11px; font-weight: 400; color: var(--text-primary);
    padding: 3px 10px; border: 1px solid var(--bg-elevated);
    border-radius: 100px;
  }
</style>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="avatar">MK</div>
      <div>
        <div class="name">Maria Kowalski</div>
        <div class="username">@m.kowalski</div>
      </div>
    </div>
    <div class="role">Senior Frontend Developer</div>
    <div class="meta">Mitglied seit März 2021 &middot; 248 Beiträge</div>
    <div class="tags">
      <span class="tag">React</span>
      <span class="tag">TypeScript</span>
      <span class="tag">CSS</span>
    </div>
  </div>
</body>
</html>`;

const EXERCISE_CONTROLS: PropertyControl[] = [
  {
    id: "name-weight",
    property: "fontWeight",
    label: "Name — Font Weight",
    type: "select",
    target: ".name",
    group: "typography",
    defaultValue: "400",
    options: [
      { label: "400 Regular", value: "400" },
      { label: "500 Medium", value: "500" },
      { label: "600 Semibold", value: "600" },
      { label: "700 Bold", value: "700" },
    ],
  },
  {
    id: "name-color",
    property: "color",
    label: "Name — Farbe",
    type: "color",
    target: ".name",
    group: "colors",
    defaultValue: "#12121e",
  },
  {
    id: "username-font",
    property: "fontFamily",
    label: "Username — Schriftfamilie",
    type: "select",
    target: ".username",
    group: "typography",
    defaultValue: "inherit",
    options: [
      { label: "Sans-Serif (inherit)", value: "inherit" },
      { label: "Monospace (JetBrains)", value: "'JetBrains Mono', monospace" },
    ],
  },
  {
    id: "username-color",
    property: "color",
    label: "Username — Farbe",
    type: "color",
    target: ".username",
    group: "colors",
    defaultValue: "#12121e",
  },
  {
    id: "role-weight",
    property: "fontWeight",
    label: "Rolle — Font Weight",
    type: "select",
    target: ".role",
    group: "typography",
    defaultValue: "400",
    options: [
      { label: "400 Regular", value: "400" },
      { label: "500 Medium", value: "500" },
      { label: "600 Semibold", value: "600" },
    ],
  },
  {
    id: "role-color",
    property: "color",
    label: "Rolle — Farbe",
    type: "color",
    target: ".role",
    group: "colors",
    defaultValue: "#12121e",
  },
  {
    id: "meta-color",
    property: "color",
    label: "Meta-Info — Farbe",
    type: "color",
    target: ".meta",
    group: "colors",
    defaultValue: "#12121e",
  },
  {
    id: "meta-size",
    property: "fontSize",
    label: "Meta-Info — Schriftgröße",
    type: "slider",
    target: ".meta",
    group: "typography",
    defaultValue: 12,
    min: 11, max: 14, step: 1, unit: "px",
  },
  {
    id: "tag-color",
    property: "color",
    label: "Tags — Textfarbe",
    type: "color",
    target: ".tag",
    group: "colors",
    defaultValue: "#12121e",
  },
  {
    id: "card-radius",
    property: "borderRadius",
    label: "Card — Border Radius",
    type: "slider",
    target: ".card",
    group: "borders",
    defaultValue: 12,
    min: 0, max: 24, step: 2, unit: "px",
  },
];

const COPY_CODE = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Typografie I — Aufgabe Modul 11</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
/* Verfügbare Farb-Variablen:
  --text-primary   (dunkel, starke Betonung)
  --text-secondary (mittel, standard Body-Text)
  --text-tertiary  (hell, unterstützende Info)
  --text-ghost     (sehr hell, Metadaten)
  --accent         (Teal, für Highlights)

  Verfügbare Font Weights:
  font-weight: 400 (Regular)
  font-weight: 500 (Medium)
  font-weight: 600 (Semibold)
  font-weight: 700 (Bold)
  font-family: 'JetBrains Mono', monospace (für Labels/Code)
*/
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  background: #f4f4f8;
  display: flex; align-items: center; justify-content: center;
  min-height: 100vh; padding: 32px;
  --text-primary:   #12121e;
  --text-secondary: #52526e;
  --text-tertiary:  #9090aa;
  --text-ghost:     #b8b8cc;
  --accent:         #0ea5a0;
  --bg-surface:     #ffffff;
  --bg-base:        #f4f4f8;
  --bg-elevated:    #eeeef4;
}
</style>
</head>
<body>

<div style="background: var(--bg-surface); border: 1px solid var(--bg-elevated);
           border-radius: 12px; padding: 24px; width: 340px;">

  <!-- Avatar + Name -->
  <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
    <div style="width: 48px; height: 48px; border-radius: 50%;
               background: var(--bg-elevated); display: flex;
               align-items: center; justify-content: center;
               font-size: 18px; font-weight: 400;
               color: var(--text-secondary);">MK</div>
    <div>
      <!-- TODO: font-weight und color anpassen -->
      <div style="font-size: 14px; font-weight: 400; color: var(--text-primary);">
        Maria Kowalski
      </div>
      <!-- TODO: Monospace + passende Farbe? -->
      <div style="font-size: 12px; font-weight: 400; color: var(--text-primary);">
        @m.kowalski
      </div>
    </div>
  </div>

  <!-- Rolle -->
  <div style="font-size: 12px; font-weight: 400;
             color: var(--text-primary); margin-bottom: 8px;">
    Senior Frontend Developer
  </div>

  <!-- Meta-Info -->
  <div style="font-size: 12px; font-weight: 400;
             color: var(--text-primary); margin-bottom: 16px;">
    Mitglied seit März 2021 · 248 Beiträge
  </div>

  <!-- Tags -->
  <div style="display: flex; gap: 8px;">
    <span style="font-size: 11px; font-weight: 400; color: var(--text-primary);
               padding: 3px 10px; border: 1px solid var(--bg-elevated);
               border-radius: 100px;">React</span>
    <span style="font-size: 11px; font-weight: 400; color: var(--text-primary);
               padding: 3px 10px; border: 1px solid var(--bg-elevated);
               border-radius: 100px;">TypeScript</span>
    <span style="font-size: 11px; font-weight: 400; color: var(--text-primary);
               padding: 3px 10px; border: 1px solid var(--bg-elevated);
               border-radius: 100px;">CSS</span>
  </div>

</div>
</body>
</html>`;

export const meta: MetaFunction = () => [
  { title: "Typografie — Schriftauswahl — UX/UI Workshop" },
];

export async function loader({ params: _ }: LoaderFunctionArgs) {
  const slug = "typography-selection";
  const currentIndex = modules.findIndex((m) => m.slug === slug);
  const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule =
    currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;
  return { prevModule, nextModule };
}

export default function TypographySelectionModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      <div className="max-w-[1000px] mx-auto w-full px-8 py-12 flex-1">

        {/* ── TITELSEITE ── */}
        <div className="mb-2">
          <Badge variant="module" dot>Modul 11</Badge>
        </div>

        <h1 className="text-[clamp(28px,4vw,36px)] font-extrabold leading-[1.15] tracking-[-0.5px] text-(--text-primary) mb-2 mt-0">
          Typografie I<br />Schriftauswahl
        </h1>
        <p className="text-[15px] font-medium leading-normal text-(--text-secondary) mb-8 mt-0 max-w-130">
          Warum die Wahl der richtigen Schrift mehr Wirkung hat als jede Farbe — und wie du als Entwickler sichere Entscheidungen triffst.
        </p>

        <ModuleMeta duration="60 Minuten" practiceTime="~20 Min." />

        <LearningGoals
          goals={[
            "Den Unterschied zwischen Serif, Sans-Serif und Monospace erklären und wissen, wann welche Kategorie passt",
            "Die fünf wichtigsten Font Weights kennen und gezielt für visuelle Hierarchie einsetzen",
            "Mit Google Fonts systematisch eine passende Schrift für ein Projekt auswählen",
            "Die Persönlichkeit einer Schrift erkennen und zum Kontext des Projekts abstimmen",
            "Häufige Schriftfehler in bestehenden UIs identifizieren und konkret benennen",
          ]}
        />

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Kerngedanke</p>

        <InsightRow icon={Type} title="Typografie ist das Erste, was Nutzer wahrnehmen">
          Noch bevor ein Nutzer einen einzigen Button geklickt hat, hat die Schrift bereits eine Aussage gemacht — über Professionalität, über Ton, über Vertrauen. Keine andere Design-Entscheidung wirkt so unmittelbar und unbewusst wie die Wahl der Typeface.
        </InsightRow>

        <InsightRow icon={ShieldCheck} title="Entwickler brauchen ein System, keine Intuition">
          Designer verbringen Jahre damit, ein Gespür für Schriften zu entwickeln. Für Entwickler gibt es einen besseren Weg: klare Auswahlregeln und eine handvoll bewährter Schriften, die in fast jedem Kontext funktionieren.
        </InsightRow>

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── THEORIE: SCHRIFTKLASSEN ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Theorie</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">Die drei Schriftklassen im UI-Design</h2>

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Die meisten Schriften lassen sich in drei Kategorien einteilen, die jeweils andere Stärken haben. Das Wichtigste zuerst: Im UI-Design ist{" "}
          <strong className="font-semibold text-(--text-primary)">Sans-Serif die sichere Standardwahl</strong> — sie ist auf Bildschirmen am lesbarsten. Serif und Monospace erfüllen spezifische Rollen.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-4">
            <div className="flex items-center gap-2 text-[13px] font-bold text-(--text-primary) mb-2">
              <Type size={14} className="text-(--accent)" />
              Sans-Serif
            </div>
            <p className="text-[12px] leading-[1.6] text-(--text-secondary) m-0">
              Ohne Serifen — die kleinen Querstriche an Buchstabenenden. Auf Bildschirmen klar und modern. Für alle UI-Texte, Buttons, Labels und Fließtext die erste Wahl.
            </p>
            <div className="mt-3 p-2 bg-(--bg-base) rounded-lg text-[17px] text-(--text-primary)" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Aa Bb Cc 123
            </div>
          </div>
          <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-4">
            <div className="flex items-center gap-2 text-[13px] font-bold text-(--text-primary) mb-2">
              <Feather size={14} className="text-(--accent)" />
              Serif
            </div>
            <p className="text-[12px] leading-[1.6] text-(--text-secondary) m-0">
              Mit Serifen. Wirkt klassisch, vertrauenswürdig, redaktionell. Gut für Überschriften in Editorials, Magazinen, Landingpages — seltener für lange Fließtexte in Apps.
            </p>
            <div className="mt-3 p-2 bg-(--bg-base) rounded-lg text-[17px] text-(--text-primary)" style={{ fontFamily: "Georgia, serif" }}>
              Aa Bb Cc 123
            </div>
          </div>
        </div>

        <TheoryCard label="Font Weights — die fünf relevanten Stufen">
          <ConceptList>
            <ConceptItem title="400 — Regular">
              Standard-Fließtext. Gut lesbar, neutral. Für Beschreibungen, Labels, Hilfstexte.
            </ConceptItem>
            <ConceptItem title="500 — Medium">
              Leicht betont. Für sekundäre Titel, aktive Navigation, wichtige Body-Texte.
            </ConceptItem>
            <ConceptItem title="600 — Semibold">
              Deutlich betont, ohne zu schreien. Für Überschriften, Buttons, Card-Titel.
            </ConceptItem>
            <ConceptItem title="700 — Bold">
              Starke Betonung. Für primäre Überschriften, wichtige Zahlen, Hero-Text.
            </ConceptItem>
            <ConceptItem title="800 — Extrabold">
              Maximale Wirkung. Nur für Seitentitel, Splash-Screens oder Marketingtext.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <RuleBox>
          Verwende maximal 2 Font-Weight-Stufen pro Seite: eine für normalen Text (400–500) und eine für Betonungen (600–700). Mehr Gewichtsstufen erzeugen Unruhe statt Hierarchie.
        </RuleBox>

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── THEORIE: PERSÖNLICHKEIT & KONTEXT ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Theorie — Fortsetzung</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">Schrift und Persönlichkeit</h2>

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Schriften kommunizieren Charakter — lange bevor ein Nutzer den Inhalt liest. Ein Banking-Dashboard und ein Startup-Produkt-Tool können technisch identisch sein, aber durch unterschiedliche Schriften völlig verschiedene Gefühle auslösen. Das ist keine Magie, sondern eine erlernbare Einschätzung.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { Icon: Building2, title: "Professionell / Seriös", desc: "Neutrale Sans-Serif, moderater Border Radius, reduzierte Farbigkeit. z.B. Inter, IBM Plex Sans" },
            { Icon: Zap, title: "Modern / Tech", desc: "Geometrische Sans-Serif mit klaren Proportionen. z.B. Plus Jakarta Sans, DM Sans" },
            { Icon: Smile, title: "Freundlich / Zugänglich", desc: "Gerundete Sans-Serif, weiche Formen. z.B. Nunito, Poppins, Quicksand" },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-4 text-center">
              <div className="w-8 h-8 mx-auto mb-3 rounded-lg bg-(--accent-dim) border border-(--accent-border) flex items-center justify-content-center justify-center">
                <Icon size={16} className="text-(--accent)" />
              </div>
              <h4 className="text-[12px] font-bold text-(--text-primary) m-0 mb-1">{title}</h4>
              <p className="text-[11px] leading-[1.5] text-(--text-secondary) m-0">{desc}</p>
            </div>
          ))}
        </div>

        <TheoryCard label="Schriftauswahl mit Google Fonts — Schritt für Schritt">
          <ConceptList>
            <ConceptItem title="Filter: mindestens 10 Schriftschnitte (Styles)">
              Schriften mit vielen Gewichten wurden sorgfältiger designed. Auf Google Fonts unter „Number of styles" auf 10+ filtern — das eliminiert sofort ~85% der Optionen.
            </ConceptItem>
            <ConceptItem title="Nach Beliebtheit sortieren">
              Populäre Schriften sind beliebt, weil sie funktionieren. Sortierung nach „Popularity" auf Google Fonts zeigt bewährte Optionen zuerst — kein schlechter Ausgangspunkt.
            </ConceptItem>
            <ConceptItem title="Vorschau mit eigenem Text testen">
              Klicke auf eine Schrift und ändere den Vorschautext auf echten Inhalt aus deinem Projekt. Generischer Beispieltext verdeckt Schwächen bei bestimmten Buchstabenkombinationen.
            </ConceptItem>
            <ConceptItem title="Weniger laden ist mehr">
              Lade nur die Gewichte, die du tatsächlich verwendest (z.B. 400, 600, 700). Jeder zusätzliche Schnitt kostet Ladezeit. Vier Gewichte sind fast immer genug.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <div className="flex items-center gap-2 bg-(--warning-bg) border border-(--warning-border) rounded-lg px-4 py-2 mb-4">
          <span className="text-[11px] leading-[1.5] text-(--text-secondary)">
            <strong className="font-semibold text-(--text-primary)">Tipp für den Einstieg:</strong> Sans-Serif + mindestens 10 Styles + sortiert nach Popularität → Du hast unter 50 Optionen. Das ist handhabbar.
          </span>
        </div>

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── VERGLEICH 1: FONT WEIGHT HIERARCHIE ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Vergleichsbeispiel 1 von 4</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">Font Weight als Hierarchie-Werkzeug</h2>

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Eine der häufigsten Schwächen in Entwickler-UIs: alle Texte haben das gleiche Gewicht. Das Auge findet keinen Einstiegspunkt — alles konkurriert gleichzeitig um Aufmerksamkeit.{" "}
          <strong className="font-semibold text-(--text-primary)">Font Weight ist eine der einfachsten und wirkungsvollsten Methoden, um visuelle Hierarchie zu erzeugen</strong>, ohne Farbe oder Größe zu verändern.
        </p>

        <ComparisonPanel
          bad={{
            label: "Vorher",
            children: (
              <div className="flex flex-col gap-1.5">
                <div style={{ fontSize: 16, fontWeight: 400, color: "var(--text-primary)" }}>Neues Dashboard verfügbar</div>
                <div style={{ fontSize: 13, fontWeight: 400, color: "var(--text-primary)" }}>Dein Team hat gestern 3 neue Berichte erstellt.</div>
                <div style={{ fontSize: 12, fontWeight: 400, color: "var(--text-primary)" }}>Zuletzt aktualisiert: vor 2 Stunden</div>
              </div>
            ),
          }}
          good={{
            label: "Nachher",
            children: (
              <div className="flex flex-col gap-1.5">
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Neues Dashboard verfügbar</div>
                <div style={{ fontSize: 13, fontWeight: 400, color: "var(--text-secondary)" }}>Dein Team hat gestern 3 neue Berichte erstellt.</div>
                <div style={{ fontSize: 12, fontWeight: 400, color: "var(--text-tertiary)" }}>Zuletzt aktualisiert: vor 2 Stunden</div>
              </div>
            ),
          }}
        />

        <AnnotationGrid
          items={[
            { label: "Titel-Gewicht", value: "400 → 700" },
            { label: "Body-Farbe", value: "primary → secondary" },
            { label: "Meta-Farbe", value: "primary → tertiary" },
          ]}
        />

        <ExplanationBox title="Analyse">
          <p>
            Im Vorher-Beispiel tragen alle drei Textzeilen gleich viel Gewicht — das Auge weiß nicht, wo es anfangen soll. Im Nachher-Beispiel wurde{" "}
            <strong className="font-semibold text-(--text-primary)">nur Font Weight und Textfarbe verändert</strong>, keine Größe, kein Layout. Der Titel zieht jetzt sofort die Aufmerksamkeit auf sich, der Body-Text liefert die Information, und das Datum tritt visuell zurück.
          </p>
          <p>Das ist der Kern von visueller Hierarchie: nicht alles gleichzeitig betonen, sondern entscheiden, was zuerst gesehen wird.</p>
        </ExplanationBox>

        <RuleBox>
          Font Weight und Textfarbe sind verwandte Werkzeuge: Bold + primäre Farbe = maximale Betonung. Regular + tertiäre Farbe = visuelles Zurücktreten. Kombiniere beide gezielt statt nur auf Schriftgröße zu setzen.
        </RuleBox>

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── VERGLEICH 2: SCHRIFTPERSÖNLICHKEIT ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Vergleichsbeispiel 2 von 4</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">Schriftpersönlichkeit und Kontext</h2>

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Die gleiche UI mit zwei verschiedenen Schriften sendet völlig unterschiedliche Signale. Das ist kein Detail — es ist die erste unbewusste Bewertung, die ein Nutzer trifft. Die{" "}
          <strong className="font-semibold text-(--text-primary)">Schriftwahl muss zur Funktion und zum Vertrauen passen</strong>, das die Anwendung aufbauen soll.
        </p>

        <ComparisonPanel
          bad={{
            label: "Vorher",
            children: (
              <div className="flex flex-col gap-2 items-start">
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-ghost)", letterSpacing: 1, textTransform: "uppercase", fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive" }}>Kontoverwaltung</div>
                <div style={{ fontSize: 19, fontWeight: 700, color: "var(--text-primary)", fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive" }}>Dein Guthaben</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "var(--accent)", fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive" }}>€ 12.480,00</div>
                <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive" }}>Letzte Transaktion: heute, 09:41</div>
              </div>
            ),
          }}
          good={{
            label: "Nachher",
            children: (
              <div className="flex flex-col gap-2 items-start">
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-ghost)", letterSpacing: 1, textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>Kontoverwaltung</div>
                <div style={{ fontSize: 19, fontWeight: 700, color: "var(--text-primary)" }}>Dein Guthaben</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "var(--accent)" }}>€ 12.480,00</div>
                <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Letzte Transaktion: heute, 09:41</div>
              </div>
            ),
          }}
        />

        <AnnotationGrid
          items={[
            { label: "Schriftart", value: "verspielt → neutral" },
            { label: "Vertrauen", value: "niedrig → hoch" },
            { label: "Kontext-Fit", value: "Konflikt → Harmonie" },
          ]}
        />

        <ExplanationBox title="Analyse">
          <p>
            Das Vorher-Beispiel zeigt eine absichtlich extreme Fehlanpassung — eine verspielt wirkende Schrift in einer Banking-UI. Das ist natürlich überzeichnet, aber das Prinzip gilt auch subtiler:{" "}
            <strong className="font-semibold text-(--text-primary)">Eine zu runde, zu dekorative oder zu ungewöhnliche Schrift erzeugt Dissonanz</strong>, wenn der Kontext Seriosität verlangt.
          </p>
          <p>
            Im Nachher-Beispiel signalisiert die neutrale, klare Sans-Serif: Diese Anwendung ist verlässlich. Das Monospace-Label für die Kategorie passt außerdem zum technischen Kontext und verstärkt das Präzisionsgefühl.
          </p>
        </ExplanationBox>

        <RuleBox>
          Frage bei jeder Schriftwahl: „Passt diese Schrift dazu, was Nutzer beim ersten Öffnen fühlen sollen?" Sicherheit, Spaß, Kompetenz und Effizienz verlangen unterschiedliche typografische Signale.
        </RuleBox>

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── VERGLEICHE 3 + 4 ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Vergleichsbeispiele 3 + 4 von 4</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">System-Schriften vs. zu viele Schriften</h2>

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Zwei häufige Extremfehler: zu viele Schriften gleichzeitig — und die Wahl einer unlesbaren Display-Schrift für Fließtext.
        </p>

        <ComparisonPanel
          bad={{
            label: "Vorher — zu viele Schriften",
            children: (
              <div className="flex flex-col gap-1.5 items-start">
                <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "Georgia, serif", color: "var(--text-primary)" }}>Projektübersicht</div>
                <div style={{ fontSize: 12, fontFamily: "'Courier New', monospace", color: "var(--text-secondary)" }}>Aktive Aufgaben: 12</div>
                <div style={{ fontSize: 11, fontFamily: "Impact, sans-serif", color: "var(--text-tertiary)" }}>Zuletzt bearbeitet von Anna</div>
              </div>
            ),
          }}
          good={{
            label: "Nachher — eine Schriftfamilie",
            children: (
              <div className="flex flex-col gap-1.5 items-start">
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>Projektübersicht</div>
                <div style={{ fontSize: 12, fontWeight: 400, color: "var(--text-secondary)" }}>Aktive Aufgaben: 12</div>
                <div style={{ fontSize: 11, fontWeight: 400, color: "var(--text-tertiary)" }}>Zuletzt bearbeitet von Anna</div>
              </div>
            ),
          }}
        />

        <AnnotationGrid
          items={[
            { label: "Schriften im Vorher", value: "3 verschiedene" },
            { label: "Schriften im Nachher", value: "1 Familie" },
          ]}
        />

        <ComparisonPanel
          bad={{
            label: "Vorher — Display-Schrift als Fließtext",
            children: (
              <p style={{ fontSize: 12, lineHeight: 1.7, fontFamily: "'Palatino Linotype', Palatino, serif", fontStyle: "italic", color: "var(--text-primary)", margin: 0 }}>
                Dieser Bericht enthält alle relevanten Kennzahlen der letzten Woche. Bitte überprüfe die Einträge sorgfältig und bestätige die Daten bis Freitag.
              </p>
            ),
          }}
          good={{
            label: "Nachher — Schrift für Lesbarkeit optimiert",
            children: (
              <p style={{ fontSize: 12, lineHeight: 1.7, color: "var(--text-secondary)", margin: 0 }}>
                Dieser Bericht enthält alle relevanten Kennzahlen der letzten Woche. Bitte überprüfe die Einträge sorgfältig und bestätige die Daten bis Freitag.
              </p>
            ),
          }}
        />

        <ExplanationBox title="Analyse">
          <p>
            <strong className="font-semibold text-(--text-primary)">Zu viele Schriften:</strong> Drei verschiedene Familien in einer Karte erzeugen visuelles Chaos — keine einheitliche Stimme. Eine gut ausgewählte Familie mit verschiedenen Gewichten erledigt dieselbe Aufgabe eleganter.
          </p>
          <p>
            <strong className="font-semibold text-(--text-primary)">Falsche Schrift für den Zweck:</strong> Kursive Schreibschriften und dekorative Serifs sind für Überschriften gemacht — nicht für dichte Informationstexte. Für Fließtext gilt: x-Höhe, Laufweite und Lesbarkeit bei kleinen Größen sind entscheidend.
          </p>
        </ExplanationBox>

        <RuleBox>
          Verwende maximal 2 Schriftfamilien pro Projekt: eine für UI-Text und optional eine für Überschriften oder Code. Mehr als zwei Familien brauchen triftigen Grund — und sehr gutes Auge.
        </RuleBox>

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── PRAXISAUFGABE ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Praxisaufgabe</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">Typografie einer Profil-Card verbessern</h2>

        <ExerciseBlock
          title="Aufgabenstellung"
          tasks={[
            "Identifiziere die primäre, sekundäre und tertiäre Information in der Card",
            "Setze Font Weight gezielt ein, um diese drei Ebenen zu unterscheiden",
            "Passe Textfarben an: primary / secondary / tertiary / ghost",
            "Überlege, ob eine Monospace-Schrift für ein Element (z.B. Username oder Rolle) passt",
            "Teste dein Ergebnis im Dark Mode — funktioniert die Hierarchie dort genauso?",
          ]}
        >
          Du bekommst eine Profil-Card mit mehreren typografischen Schwächen: alle Texte haben das gleiche Gewicht, keine visuelle Hierarchie, Farben unterscheiden Ebenen nicht. Verbessere die Card durch gezielte Änderungen an Font Weight, Textfarbe und ggf. Schriftgröße — ohne das Layout zu ändern.
        </ExerciseBlock>

        <LiveEditor
          html={EXERCISE_HTML}
          controls={EXERCISE_CONTROLS}
        />

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── CODE BLOCK ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Startcode — Zum Kopieren und Verbessern</p>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Kopiere diesen Code, öffne ihn in deinem Browser und verbessere die typografische Hierarchie der Profil-Card. Alle relevanten CSS-Variablen für Textfarben und Schriftgewichte sind bereits einsatzbereit.
        </p>

        <CodeBlock language="HTML + CSS — Aufgabe Modul 11" code={COPY_CODE} />

      </div>

      <ModuleNav prevModule={prevModule} nextModule={nextModule} />
    </div>
  );
}
