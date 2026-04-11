import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Ruler, AlignLeft } from "lucide-react";
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
    --accent: #0ea5a0;
    --accent-dim: rgba(14,165,160,0.08);
    --accent-border: rgba(14,165,160,0.22);
    --bg-surface: #ffffff;
    --bg-elevated: #eeeef4;
  }

  .article {
    background: var(--bg-surface);
    border-radius: 16px;
    padding: 28px;
    width: 580px;
  }

  .category {
    font-size: 11px; font-weight: 600; color: var(--accent);
    text-transform: uppercase; margin-bottom: 8px;
  }

  .title {
    font-size: 27px; font-weight: 800; line-height: 1.5;
    color: var(--text-primary); margin-bottom: 10px;
  }

  .intro {
    font-size: 14px; line-height: 1.3;
    color: var(--text-secondary); margin-bottom: 12px;
    max-width: 100%;
  }

  .author-row {
    display: flex; align-items: center; gap: 10px;
  }

  .author-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--accent-dim); border: 1px solid var(--accent-border);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 600; color: var(--accent); flex-shrink: 0;
  }

  .author-name { font-size: 16px; font-weight: 600; color: var(--text-primary); }
  .author-meta { font-size: 10px; color: var(--text-tertiary); }
</style>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body>
  <div class="article">
    <div class="category">Engineering</div>
    <div class="title">Wie wir unsere Build-Zeit um 60% reduziert haben</div>
    <div class="intro">
      In diesem Post beschreiben wir den vollständigen Prozess, wie unser Team die CI/CD-Pipeline
      schrittweise optimiert hat — von der Analyse der Bottlenecks über konkrete Maßnahmen bis hin
      zu den messbaren Ergebnissen nach drei Monaten intensiver Arbeit.
    </div>
    <div class="author-row">
      <div class="author-avatar">TK</div>
      <span class="author-name">Thomas Klein</span>
      <span class="author-meta">&middot; 12. März 2025 &middot; 8 min Lesezeit</span>
    </div>
  </div>
</body>
</html>`;

const EXERCISE_CONTROLS: PropertyControl[] = [
  {
    id: "title-size",
    property: "fontSize",
    label: "Titel — Schriftgröße",
    type: "select",
    target: ".title",
    group: "typography",
    defaultValue: "27px",
    options: [
      { label: "24px (Section Title)", value: "24px" },
      { label: "27px (außerhalb Skala)", value: "27px" },
      { label: "32px (Page Title)", value: "32px" },
    ],
  },
  {
    id: "title-lh",
    property: "lineHeight",
    label: "Titel — Line Height",
    type: "select",
    target: ".title",
    group: "typography",
    defaultValue: "1.5",
    options: [
      { label: "1.15 (Titel-Standard)", value: "1.15" },
      { label: "1.25", value: "1.25" },
      { label: "1.5 (zu weit)", value: "1.5" },
    ],
  },
  {
    id: "intro-lh",
    property: "lineHeight",
    label: "Intro — Line Height",
    type: "select",
    target: ".intro",
    group: "typography",
    defaultValue: "1.3",
    options: [
      { label: "1.3 (zu eng)", value: "1.3" },
      { label: "1.5", value: "1.5" },
      { label: "1.6", value: "1.6" },
      { label: "1.7 (optimal)", value: "1.7" },
    ],
  },
  {
    id: "intro-size",
    property: "fontSize",
    label: "Intro — Schriftgröße",
    type: "select",
    target: ".intro",
    group: "typography",
    defaultValue: "14px",
    options: [
      { label: "13px (Body Text)", value: "13px" },
      { label: "14px (außerhalb Skala)", value: "14px" },
      { label: "15px (Subtitle)", value: "15px" },
    ],
  },
  {
    id: "intro-maxwidth",
    property: "maxWidth",
    label: "Intro — Max Width",
    type: "select",
    target: ".intro",
    group: "typography",
    defaultValue: "100%",
    options: [
      { label: "100% (zu breit)", value: "100%" },
      { label: "65ch (optimal)", value: "65ch" },
      { label: "50ch (zu schmal)", value: "50ch" },
    ],
  },
  {
    id: "author-name-size",
    property: "fontSize",
    label: "Autor-Name — Schriftgröße",
    type: "select",
    target: ".author-name",
    group: "typography",
    defaultValue: "16px",
    options: [
      { label: "13px (Body)", value: "13px" },
      { label: "15px (Subtitle)", value: "15px" },
      { label: "16px (außerhalb Skala)", value: "16px" },
    ],
  },
  {
    id: "author-align",
    property: "alignItems",
    label: "Autor-Zeile — Ausrichtung",
    type: "select",
    target: ".author-row",
    group: "typography",
    defaultValue: "center",
    options: [
      { label: "center (zentriert)", value: "center" },
      { label: "baseline (korrekt)", value: "baseline" },
    ],
  },
  {
    id: "category-spacing",
    property: "letterSpacing",
    label: "Kategorie — Letter Spacing",
    type: "select",
    target: ".category",
    group: "typography",
    defaultValue: "0px",
    options: [
      { label: "0px (kein Spacing)", value: "0px" },
      { label: "1.5px", value: "1.5px" },
      { label: "2px", value: "2px" },
    ],
  },
];

const COPY_CODE = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Typografie II — Aufgabe Modul 12</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
/* Type Scale (nur diese Größen verwenden!):
  32px — Page Title    (font-weight: 800)
  24px — Section Title (font-weight: 700)
  19px — Card Title    (font-weight: 700)
  15px — Subtitle/Lead (font-weight: 500)
  13px — Body Text     (font-weight: 400)
  11px — Small/Meta    (font-weight: 400)
  10px — Label/Badge   (font-mono, weight: 600)

  Zeilenhöhen:
  Titel:      line-height: 1.15 – 1.25
  Fließtext:  line-height: 1.6  – 1.7
  Paragraphen: max-width: 65ch
*/
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  background: #f4f4f8;
  display: flex; align-items: center;
  justify-content: center; min-height: 100vh; padding: 32px;
  --text-primary: #12121e; --text-secondary: #52526e;
  --text-tertiary: #9090aa; --accent: #0ea5a0;
  --bg-surface: #ffffff; --bg-elevated: #eeeef4;
  --accent-dim: rgba(14,165,160,0.08);
  --accent-border: rgba(14,165,160,0.22);
}
</style>
</head>
<body>

<div style="background:#fff; border-radius:16px; padding:28px; width:580px;">

  <!-- TODO: Skala-Größe? + letter-spacing testen -->
  <div style="font-size:11px; font-weight:600; color:var(--accent);
             text-transform:uppercase; margin-bottom:8px;">Engineering</div>

  <!-- TODO: Richtige Skala-Größe + line-height für Titel -->
  <div style="font-size:27px; font-weight:800; line-height:1.5;
             color:var(--text-primary); margin-bottom:10px;">
    Wie wir unsere Build-Zeit um 60% reduziert haben
  </div>

  <!-- TODO: line-height + max-width anpassen -->
  <div style="font-size:14px; line-height:1.3;
             color:var(--text-secondary); margin-bottom:12px;">
    In diesem Post beschreiben wir den vollständigen Prozess,
    wie unser Team die CI/CD-Pipeline schrittweise optimiert hat
    — von der Analyse der Bottlenecks bis zu den messbaren
    Ergebnissen nach drei Monaten intensiver Arbeit.
  </div>

  <!-- TODO: align-items: center → baseline -->
  <div style="display:flex; align-items:center; gap:10px;">
    <div style="width:28px; height:28px; border-radius:50%;
               background:var(--accent-dim); border:1px solid var(--accent-border);
               display:flex; align-items:center; justify-content:center;
               font-size:11px; font-weight:600; color:var(--accent);
               flex-shrink:0;">TK</div>
    <!-- TODO: Welche Skala-Größe passt für den Autor-Namen? -->
    <span style="font-size:16px; font-weight:600;
               color:var(--text-primary);">Thomas Klein</span>
    <span style="font-size:10px; color:var(--text-tertiary);">
      · 12. März 2025 · 8 min Lesezeit
    </span>
  </div>

</div>
</body>
</html>`;

export const meta: MetaFunction = () => [
  { title: "Typografie — Systeme — UX/UI Workshop" },
];

export async function loader({ params: _ }: LoaderFunctionArgs) {
  const slug = "typography-systems";
  const currentIndex = modules.findIndex((m) => m.slug === slug);
  const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule =
    currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;
  return { prevModule, nextModule };
}

export default function TypographySystemsModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      <div className="max-w-[1000px] mx-auto w-full px-8 py-12 flex-1">

        {/* ── TITELSEITE ── */}
        <div className="mb-2">
          <Badge variant="module" dot>Modul 12</Badge>
        </div>

        <h1 className="text-[clamp(28px,4vw,36px)] font-extrabold leading-[1.15] tracking-[-0.5px] text-(--text-primary) mb-2 mt-0">
          Typografie II<br />Größen, Gewichte, Zeilenhöhe
        </h1>
        <p className="text-[15px] font-medium leading-normal text-(--text-secondary) mb-8 mt-0 max-w-130">
          Vom Bauchgefühl zum System: Wie du mit einer festen Type Scale, durchdachter Zeilenhöhe und kontrollierten Zeilenlängen Texte erstellst, die tatsächlich angenehm zu lesen sind.
        </p>

        <ModuleMeta duration="60 Minuten" practiceTime="~20 Min." />

        <LearningGoals
          goals={[
            "Eine Type Scale definieren und erklären, warum lineare Skalen nicht funktionieren",
            "Zeilenhöhe (line-height) proportional zur Schriftgröße und Zeilenlänge einsetzen",
            "Die optimale Zeilenlänge (45–75 Zeichen) kennen und im Code umsetzen",
            "Schriftgröße und Font Weight gemeinsam als Hierarchie-System verstehen",
            "Häufige typografische Fehler in bestehenden UIs erkennen und benennen",
          ]}
        />

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Kerngedanke</p>

        <InsightRow icon={Ruler} title="Typografie braucht ein System, keine Einzelentscheidungen">
          Jedes Mal neu zu entscheiden, ob ein Text 13px oder 14px groß sein soll, kostet Zeit und führt zu inkonsistenten Ergebnissen. Eine vordefinierte Type Scale mit 6–8 Stufen macht jede Entscheidung schneller und das Ergebnis konsistenter.
        </InsightRow>

        <InsightRow icon={AlignLeft} title="Lesbarkeit ist messbar — keine reine Frage des Geschmacks">
          Optimale Zeilenlänge, passende Zeilenhöhe und richtige Schriftgrößen folgen nachvollziehbaren Regeln. Diese Regeln kann man lernen und direkt im Code umsetzen — ohne jahrelange Designerfahrung.
        </InsightRow>

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── THEORIE: TYPE SCALE ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Theorie — Type Scale</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">Eine Schriftgrößen-Skala definieren</h2>

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Die meisten UIs ohne festes System verwenden bis zu 15 verschiedene Schriftgrößen — jede aus dem Moment heraus entschieden. Das Ergebnis ist visuelle Inkonsistenz, die man nicht sofort benennen kann, aber deutlich spürt.{" "}
          <strong className="font-semibold text-(--text-primary)">Eine Type Scale begrenzt die Auswahl auf 6–8 sinnvolle Stufen</strong>. Statt jedes Mal zu überlegen nimmst du einfach die nächste passende Stufe aus deiner Skala.
        </p>

        {/* Type Scale Visualisierung */}
        <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl px-6 py-4 mb-4 flex flex-col gap-1.5">
          {[
            { px: "32px", role: "Page Title", style: { fontSize: 32, fontWeight: 800, letterSpacing: -0.5 } },
            { px: "24px", role: "Section Title", style: { fontSize: 24, fontWeight: 700 } },
            { px: "19px", role: "Card Title", style: { fontSize: 19, fontWeight: 700 } },
            { px: "15px", role: "Subtitle / Lead", style: { fontSize: 15, fontWeight: 500, color: "var(--text-secondary)" } },
            { px: "13px", role: "Body Text", style: { fontSize: 13, fontWeight: 400, color: "var(--text-secondary)" } },
            { px: "11px", role: "Small / Meta", style: { fontSize: 11, fontWeight: 400, color: "var(--text-tertiary)" } },
            { px: "10px mono", role: "Tag / Badge", style: { fontSize: 10, fontWeight: 600, fontFamily: "var(--font-mono)", letterSpacing: 2, textTransform: "uppercase" as const, color: "var(--accent)" } },
          ].map(({ px, role, style }, i, arr) => (
            <div
              key={px}
              className="flex items-baseline gap-4 py-1"
              style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--bg-elevated)" : "none" }}
            >
              <div className="flex flex-col gap-0 min-w-[90px]">
                <span className="font-mono text-[11px] font-bold text-(--accent)">{px}</span>
                <span className="font-mono text-[9px] font-medium text-(--text-ghost) tracking-[1px] uppercase">{role}</span>
              </div>
              <div style={{ color: "var(--text-primary)", lineHeight: 1.2, ...style }}>
                {px === "10px mono" ? "KATEGORIE · BADGE" : px === "11px" ? "Labels, Metadaten, Timestamps" : px === "13px" ? "Standard Fließtext für Inhalte" : px === "15px" ? "Einleitungstext oder Untertitel" : px === "19px" ? "Kartentitel" : px === "24px" ? "Abschnittstitel" : "Überschrift"}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-4">
            <div className="font-mono text-[9px] font-semibold text-(--text-ghost) tracking-[1.5px] uppercase mb-1">Warum keine lineare Skala?</div>
            <p className="text-[12px] leading-[1.6] text-(--text-secondary) m-0">
              Der Unterschied zwischen 12px und 16px (33%) ist enorm. Der Unterschied zwischen 48px und 52px (8%) kaum sichtbar. Eine gute Skala hat <strong className="font-semibold text-(--text-primary)">relative Abstände</strong> — klein eng, groß weit.
            </p>
          </div>
          <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-4">
            <div className="font-mono text-[9px] font-semibold text-(--text-ghost) tracking-[1.5px] uppercase mb-1">px oder rem?</div>
            <p className="text-[12px] leading-[1.6] text-(--text-secondary) m-0">
              Für UI-Arbeit sind <strong className="font-semibold text-(--text-primary)">px-Werte</strong> einfacher zu kommunizieren und zu debuggen. rem ist für Accessibility sinnvoll (Browser-Zoom). Definiere dein System in px, konvertiere bei Bedarf.
            </p>
          </div>
        </div>

        <RuleBox>
          Definiere deine Type Scale am Anfang eines Projekts. Wenn du eine neue Schriftgröße brauchst, die nicht in der Skala ist, ist das ein Signal — entweder passt die Skala noch nicht, oder die Entscheidung lässt sich mit einer vorhandenen Größe lösen.
        </RuleBox>

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── THEORIE: LINE-HEIGHT & LINE-LENGTH ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Theorie — Zeilenhöhe & Zeilenlänge</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">Lesbarkeit durch Proportionen</h2>

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Zwei Parameter haben mehr Einfluss auf die Lesbarkeit von Fließtext als die Schriftgröße selbst: die{" "}
          <strong className="font-semibold text-(--text-primary)">Zeilenhöhe (line-height)</strong> und die{" "}
          <strong className="font-semibold text-(--text-primary)">Zeilenlänge</strong>. Beide lassen sich mit einfachen Regeln steuern.
        </p>

        {/* Line-height Demo Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            {
              label: "Kleine Schrift",
              value: "1.6 – 1.8",
              text: "Kleiner Text braucht mehr Zeilenabstand — das Auge findet sonst die nächste Zeile nicht leicht.",
              style: { fontSize: 11, lineHeight: 1.7 },
            },
            {
              label: "Body Text",
              value: "1.5 – 1.7",
              text: "Standard-Fließtext. 1.5 ist das absolute Minimum für angenehme Lesbarkeit.",
              style: { fontSize: 13, lineHeight: 1.6 },
            },
            {
              label: "Große Titel",
              value: "1.0 – 1.25",
              text: "Titel brauchen engen Abstand — sonst wirken sie fragmentiert.",
              style: { fontSize: 15, lineHeight: 1.2, fontWeight: 700, color: "var(--text-primary)" },
            },
          ].map(({ label, value, text, style }) => (
            <div key={label} className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-4">
              <div className="font-mono text-[9px] font-semibold text-(--text-ghost) tracking-[1.5px] uppercase mb-2">{label}</div>
              <div className="font-mono text-[13px] font-bold text-(--accent) mb-2">{value}</div>
              <p style={{ color: "var(--text-secondary)", margin: 0, ...style }}>{text}</p>
            </div>
          ))}
        </div>

        <TheoryCard label="Zeilenlänge — die 45–75-Zeichen-Regel">
          <ConceptList>
            <ConceptItem title="Warum ist Zeilenlänge so wichtig?">
              Zu lange Zeilen zwingen das Auge zu einer langen horizontalen Bewegung zurück zum Zeilenanfang. Dabei verliert man leicht die Zeile. Zu kurze Zeilen unterbrechen den Lesefluss durch ständige Umbrüche.
            </ConceptItem>
            <ConceptItem title="Optimale Breite: 45–75 Zeichen pro Zeile">
              Das entspricht je nach Schrift ca. 20–35em oder 480–680px bei 14–16px. Die einfachste Lösung:{" "}
              <code className="font-mono text-[11px] bg-(--bg-elevated) px-1 rounded">max-width: 65ch</code> auf dem Text-Container setzen — ch ist die Breite des Zeichens „0".
            </ConceptItem>
            <ConceptItem title="Zeilenlänge und line-height sind proportional">
              Breite Spalten brauchen mehr Zeilenabstand (bis 2.0) damit das Auge die nächste Zeile findet. Schmale Spalten (Seitenleisten, Karten) können mit 1.4–1.5 auskommen.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <RuleBox>
          Setze <code className="font-mono text-[12px] bg-[rgba(14,165,160,0.12)] px-1.5 rounded text-[#0a6e6a]">max-width: 65ch</code> auf alle Paragraphen, die mehr als zwei Zeilen haben. Das ist die schnellste Einzelmaßnahme für bessere Lesbarkeit.
        </RuleBox>

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── VERGLEICH 1: TYPE SCALE CHAOS VS. SYSTEM ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Vergleichsbeispiel 1 von 4</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">Willkürliche Größen vs. Type Scale</h2>

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Ohne feste Skala entstehen Layouts mit vielen ähnlichen, aber nie identischen Schriftgrößen. Das Ergebnis fühlt sich inkonsistent an — ohne dass man genau sagen kann warum.{" "}
          <strong className="font-semibold text-(--text-primary)">Eine Type Scale erzeugt eine spürbare Ruhe und Konsistenz</strong>, selbst wenn Außenstehende das System nicht kennen.
        </p>

        <ComparisonPanel
          bad={{
            label: "Vorher — keine Skala",
            children: (
              <div className="flex flex-col gap-1 items-start">
                <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>Mein Profil</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Kontoeinstellungen</div>
                <div style={{ fontSize: 13, fontWeight: 400, color: "var(--text-secondary)" }}>Passe deine persönlichen Daten an.</div>
                <div style={{ fontSize: 11, fontWeight: 500, color: "var(--text-secondary)", marginTop: 4 }}>E-Mail-Adresse</div>
                <div style={{ fontSize: 12, fontWeight: 400, color: "var(--text-primary)" }}>maria@example.com</div>
                <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginTop: 2 }}>Zuletzt geändert vor 3 Tagen</div>
              </div>
            ),
          }}
          good={{
            label: "Nachher — mit Type Scale",
            children: (
              <div className="flex flex-col gap-1 items-start">
                <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.3, color: "var(--text-primary)" }}>Mein Profil</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Passe deine persönlichen Daten an.</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--text-ghost)" }}>E-Mail-Adresse</div>
                <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text-primary)" }}>maria@example.com</div>
                <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Zuletzt geändert vor 3 Tagen</div>
              </div>
            ),
          }}
        />

        <AnnotationGrid
          items={[
            { label: "Größen im Vorher", value: "6 verschiedene" },
            { label: "Größen im Nachher", value: "4 aus der Skala" },
            { label: "Skalen-Stufen", value: "24 / 15 / 13 / 11" },
          ]}
        />

        <ExplanationBox title="Analyse">
          <p>
            Im Vorher-Beispiel gibt es sechs verschiedene Schriftgrößen — 22, 14, 13, 12, 11 und 10px. Die Abstände zwischen benachbarten Größen (13→12→11→10) sind so klein, dass sie kaum hierarchische Wirkung haben. Das Auge findet keinen klaren Einstiegspunkt.
          </p>
          <p>
            Im Nachher-Beispiel wurden{" "}
            <strong className="font-semibold text-(--text-primary)">bewusst weniger Größen mit größeren Abständen</strong> gewählt. Die Hierarchie ist sofort spürbar: 24px Titel, 13px Beschreibung, 10px-Mono-Label, 15px-Wert, 11px-Meta. Jede Stufe hat eine klar andere optische Wirkung.
          </p>
        </ExplanationBox>

        <RuleBox>
          Benachbarte Stufen in einer Type Scale sollten mindestens 25% Größenunterschied haben, damit sie klar unterschiedlich wahrgenommen werden. 13px und 14px sind für das Auge praktisch identisch — verwende sie nicht beide.
        </RuleBox>

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── VERGLEICHE 2 + 3: LINE-HEIGHT & LINE-LENGTH ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Vergleichsbeispiele 2 + 3 von 4</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">Zeilenhöhe und Zeilenlänge in der Praxis</h2>

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Zwei häufige Lesbarkeitsprobleme, die sich mit je einer CSS-Zeile lösen lassen.
        </p>

        <ComparisonPanel
          bad={{
            label: "Vorher — line-height: 1.2",
            children: (
              <p style={{ fontSize: 13, lineHeight: 1.2, color: "var(--text-secondary)", margin: 0 }}>
                Bei zu engem Zeilenabstand verliert das Auge schnell den Faden. Die Zeilen fließen optisch ineinander und man liest dieselbe Zeile aus Versehen zweimal — oder springt eine über.
              </p>
            ),
          }}
          good={{
            label: "Nachher — line-height: 1.7",
            children: (
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)", margin: 0 }}>
                Mit ausreichend Zeilenabstand findet das Auge mühelos die nächste Zeile. Der Text wirkt luftiger, bleibt aber trotzdem als zusammengehöriger Block lesbar.
              </p>
            ),
          }}
        />

        <AnnotationGrid
          items={[
            { label: "Vorher", value: "line-height: 1.2" },
            { label: "Nachher", value: "line-height: 1.7" },
            { label: "Änderung", value: "1 CSS-Zeile" },
          ]}
        />

        <ComparisonPanel
          bad={{
            label: "Vorher — volle Breite",
            children: (
              <p style={{ fontSize: 12, lineHeight: 1.7, color: "var(--text-secondary)", margin: 0, maxWidth: "100%" }}>
                Wenn ein Paragraph die volle Container-Breite ausfüllt, werden die Zeilen zu lang. Das Auge muss nach jeder Zeile einen langen Weg zurück zum Zeilenanfang machen und verliert dabei leicht den Anschluss an die nächste Zeile.
              </p>
            ),
          }}
          good={{
            label: "Nachher — max-width: 60ch",
            children: (
              <p style={{ fontSize: 12, lineHeight: 1.7, color: "var(--text-secondary)", margin: 0, maxWidth: "60ch" }}>
                Mit begrenzter Zeilenlänge liegt die optimale Zeichen-Anzahl im Bereich von 45–75. Der Rücksprung zum Zeilenanfang ist kurz genug, um die nächste Zeile sicher zu finden.
              </p>
            ),
          }}
        />

        <ExplanationBox title="Analyse">
          <p>
            <strong className="font-semibold text-(--text-primary)">Zeilenhöhe:</strong> 1.2 ist der Browser-Default für viele Elemente — gut für Überschriften, aber zu eng für Fließtext. 1.5–1.7 ist für Body Text der richtige Bereich. Die Änderung ist minimal im Code, aber massiv in der Wahrnehmung.
          </p>
          <p>
            <strong className="font-semibold text-(--text-primary)">Zeilenlänge:</strong> Die <code className="font-mono text-[11px] bg-(--bg-elevated) px-1 rounded">ch</code>-Einheit in CSS bezieht sich auf die Breite des „0"-Zeichens der aktuellen Schrift — damit skaliert <code className="font-mono text-[11px] bg-(--bg-elevated) px-1 rounded">max-width: 65ch</code> automatisch mit der Schriftgröße mit.
          </p>
        </ExplanationBox>

        <RuleBox>
          Drei Defaultwerte, die du in jedem Projekt setzen solltest: Fließtext bekommt <code className="font-mono text-[12px] bg-[rgba(14,165,160,0.12)] px-1.5 rounded text-[#0a6e6a]">line-height: 1.6</code>, Titel bekommen <code className="font-mono text-[12px] bg-[rgba(14,165,160,0.12)] px-1.5 rounded text-[#0a6e6a]">line-height: 1.2</code>, und Paragraphen bekommen <code className="font-mono text-[12px] bg-[rgba(14,165,160,0.12)] px-1.5 rounded text-[#0a6e6a]">max-width: 65ch</code>.
        </RuleBox>

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── VERGLEICH 4: BASELINE ALIGNMENT ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Vergleichsbeispiel 4 von 4</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">Baseline-Ausrichtung und Letter-Spacing</h2>

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Zwei weniger bekannte Details, die polierte UIs von durchschnittlichen unterscheiden: die Ausrichtung gemischter Schriftgrößen an der Baseline, und gezieltes Letter-Spacing für Monospace-Labels.
        </p>

        <ComparisonPanel
          bad={{
            label: "Vorher — zentriert ausgerichtet",
            children: (
              <div className="flex flex-col gap-2 items-start w-full">
                {[
                  { num: "€ 1.240", label: "diesen Monat", color: "var(--text-primary)" },
                  { num: "47", label: "neue Benutzer", color: "var(--accent)" },
                ].map(({ num, label, color }) => (
                  <div key={num} style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--bg-surface)", border: "1px solid var(--bg-elevated)", borderRadius: 8, padding: "10px 14px", width: "100%" }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color }}>{num}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>{label}</span>
                  </div>
                ))}
              </div>
            ),
          }}
          good={{
            label: "Nachher — Baseline-Ausrichtung",
            children: (
              <div className="flex flex-col gap-2 items-start w-full">
                {[
                  { num: "€ 1.240", label: "diesen Monat", color: "var(--text-primary)" },
                  { num: "47", label: "neue Benutzer", color: "var(--accent)" },
                ].map(({ num, label, color }) => (
                  <div key={num} style={{ display: "flex", alignItems: "baseline", gap: 12, background: "var(--bg-surface)", border: "1px solid var(--bg-elevated)", borderRadius: 8, padding: "10px 14px", width: "100%" }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color }}>{num}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>{label}</span>
                  </div>
                ))}
              </div>
            ),
          }}
        />

        <AnnotationGrid
          items={[
            { label: "Ausrichtung", value: "center → baseline" },
            { label: "CSS-Änderung", value: "align-items" },
            { label: "Wirkung", value: "stabiler, klarer" },
          ]}
        />

        <ExplanationBox title="Analyse">
          <p>
            Bei vertikaler Zentrierung gemischter Schriftgrößen wirken die Texte optisch „schwebend" und instabil — besonders wenn die Größendifferenz groß ist.{" "}
            <strong className="font-semibold text-(--text-primary)">Baseline-Ausrichtung verbindet die Texte auf der unsichtbaren Grundlinie</strong>, auf der Buchstaben natürlich ruhen. Das Ergebnis wirkt ruhiger und zusammengehöriger.
          </p>
          <p>
            Eine Zeile CSS: <code className="font-mono text-[11px] bg-(--bg-elevated) px-1 rounded">align-items: baseline</code> statt <code className="font-mono text-[11px] bg-(--bg-elevated) px-1 rounded">align-items: center</code>. Einer der seltenen Fälle wo weniger wirklich mehr ist.
          </p>
        </ExplanationBox>

        <RuleBox>
          Wenn du in einer Zeile zwei Texte mit unterschiedlichen Schriftgrößen nebeneinander hast (z.B. Zahl + Einheit, Titel + Datum), nutze{" "}
          <code className="font-mono text-[12px] bg-[rgba(14,165,160,0.12)] px-1.5 rounded text-[#0a6e6a]">align-items: baseline</code>. Das ist fast immer besser als{" "}
          <code className="font-mono text-[12px] bg-[rgba(14,165,160,0.12)] px-1.5 rounded text-[#0a6e6a]">center</code>.
        </RuleBox>

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── PRAXISAUFGABE ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Praxisaufgabe</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">Typografisches System für einen Artikel-Header</h2>

        <ExerciseBlock
          title="Aufgabenstellung"
          tasks={[
            "Bringe alle Schriftgrößen auf Werte aus der gelernten Type Scale (11 / 13 / 15 / 19 / 24 / 32px)",
            "Setze die Zeilenhöhe des Fließtexts auf einen lesbaren Wert (1.6–1.7)",
            "Begrenze die Textbreite des Intro-Absatzes mit max-width: 65ch",
            "Richte Autor-Name und Datum mit align-items: baseline aus",
            "Bonus: Füge dem Kategorie-Label letter-spacing: 1.5px hinzu und vergleiche die Wirkung",
          ]}
        >
          Du bekommst einen Artikel-Header mit mehreren typografischen Problemen: willkürliche Schriftgrößen außerhalb einer Skala, zu enge Zeilenhöhe im Fließtext, zu breite Textblöcke und falsch ausgerichtete gemischte Schriftgrößen. Verbessere den Header durch gezielte Änderungen — ohne das HTML-Markup zu verändern.
        </ExerciseBlock>

        <LiveEditor
          html={EXERCISE_HTML}
          controls={EXERCISE_CONTROLS}
        />

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── CODE BLOCK ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Startcode — Zum Kopieren und Verbessern</p>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Öffne diesen Code im Browser und wende die Type Scale, korrekte Zeilenhöhen und Zeilenlängen-Begrenzung an. Die TODO-Kommentare zeigen dir genau, wo Anpassungsbedarf besteht.
        </p>

        <CodeBlock language="HTML + CSS — Aufgabe Modul 12" code={COPY_CODE} />

      </div>

      <ModuleNav prevModule={prevModule} nextModule={nextModule} />
    </div>
  );
}
