import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Dices, Gauge, ScanSearch } from "lucide-react";
import { getModuleBySlug, getModuleNeighbors } from "~/data/modules";
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
import { ExplanationBox } from "~/components/ui/ExplanationBox";
import { ExerciseBlock } from "~/components/ui/ExerciseBlock";
import { CodeBlock } from "~/components/ui/CodeBlock";
import { ModuleRef } from "~/components/ui/ModuleRef";
import { LiveEditor } from "~/components/live-editor/LiveEditor";
import { BriefBuilder } from "~/components/demos/ai/BriefBuilder";
import { ReviewHunt } from "~/components/demos/ai/ReviewHunt";
import { CAPTION, CODE, EYEBROW, H1, H2, H3, HR, LEAD, MICRO, P, PAGE, PANEL, STAGE, STRONG } from "~/components/ui/moduleStyles";

const SLUG = "ai-workflow";
const MODULE = getModuleBySlug(SLUG)!;

export const meta: MetaFunction = () => [
  { title: `${MODULE.titleDe} — UX/UI Workshop` },
  { name: "description", content: MODULE.description },
];

export function loader() {
  return getModuleNeighbors(SLUG);
}

/* ── Daten ─────────────────────────────────────────────────────────────── */

const STEPS = [
  {
    step: 1,
    title: "Briefen",
    text: "Die Entscheidungen treffen, bevor die KI sie für dich trifft: Nutzer, Inhalt, Rangfolge, System, Zustände, Grenzen.",
  },
  {
    step: 2,
    title: "Prüfen",
    text: "Das Ergebnis in fester Reihenfolge gegen die Regeln aus dem Workshop halten — nicht gegen ein Gefühl.",
  },
  {
    step: 3,
    title: "Nachschärfen",
    text: "Benennen, welche Regel verletzt ist, und den Wert vorgeben. Eine Sache pro Runde.",
  },
];

const REVIEW_ORDER = [
  {
    name: "Aufgabe",
    question: "Löst die Ansicht das richtige Problem?",
    how: "Lies die User Story daneben. Fehlt etwas, das dort steht? Steht etwas da, wonach niemand gefragt hat?",
  },
  {
    name: "Rangfolge",
    question: "Sieht man sofort, was die Hauptsache ist?",
    how: "Blinzel-Test: Seite unscharf stellen. Bleiben eine Hauptsache und eine Hauptaktion übrig?",
  },
  {
    name: "System",
    question: "Stammt jeder Wert aus dem System?",
    how: "Im CSS nach Farbwerten und Pixel-Abständen suchen, die nicht aus den Tokens kommen.",
  },
  {
    name: "Zustände",
    question: "Was passiert, wenn es nicht der Idealfall ist?",
    how: "Leere Daten, langsames Netz, Serverfehler, sehr langer Text — einzeln durchspielen.",
  },
  {
    name: "Zugang",
    question: "Kommt jeder ans Ziel?",
    how: "Maus weglegen: nur mit Tab, Enter und Leertaste bedienen. Kontrast messen. Auf 320 px Breite ziehen.",
  },
];

const SMELLS: { smell: string; sign: string; rule: string; ref: string }[] = [
  {
    smell: "Alles gleich wichtig",
    sign: "Unscharf gestellt bleibt eine gleichmäßige Fläche",
    rule: "Eine Hauptsache, eine gefüllte Aktion",
    ref: "visual-hierarchy",
  },
  {
    smell: "Schriftgrößen ohne System",
    sign: "13, 14, 15, 17 und 22 px auf einer Karte",
    rule: "Wenige Stufen aus einer festen Skala",
    ref: "typography-systems",
  },
  {
    smell: "Farbe ohne Aufgabe",
    sign: "Verläufe, mehrere Akzentfarben nebeneinander",
    rule: "Farbe markiert eine Aktion oder einen Status",
    ref: "color-hierarchy",
  },
  {
    smell: "Zu wenig Kontrast",
    sign: "Hellgrauer Text, Platzhalter als einziges Label",
    rule: "Mindestens 4,5:1 für Text",
    ref: "color-contrast",
  },
  {
    smell: "Abstände nach Gefühl",
    sign: "Werte wie 13 px, 22 px, 7 px",
    rule: "Nur Werte aus der Spacing-Skala",
    ref: "spacing-layout",
  },
  {
    smell: "Tiefe überall",
    sign: "Schatten auf jeder Karte, Karte in der Karte",
    rule: "Schatten nur für das, was wirklich darüber liegt",
    ref: "shadows-elevation",
  },
  {
    smell: "Emojis als Icons",
    sign: "Bunte Zeichen neben Linien-Icons",
    rule: "Eine Bibliothek, eine Strichstärke",
    ref: "images-icons",
  },
  {
    smell: "Nur der Idealzustand",
    sign: "Kein Leer-, Lade- oder Fehlerfall im Code",
    rule: "Fünf Zustände pro Ansicht",
    ref: "structure-flows",
  },
  {
    smell: "Feste Breiten",
    sign: "width: 400px — am Handy abgeschnitten",
    rule: "Fließend, nutzbar ab 320 px",
    ref: "responsive-design",
  },
  {
    smell: "Werte statt Tokens",
    sign: "#7c3aed mitten im Komponenten-CSS",
    rule: "Komponenten kennen nur Tokens",
    ref: "design-tokens",
  },
];

const INVISIBLE = [
  { code: "<div onclick>", text: "statt button: mit der Tastatur nicht erreichbar, für Screenreader unsichtbar" },
  { code: "<input>", text: "ohne label: Der Platzhalter verschwindet beim Tippen, das Feld hat keinen Namen" },
  { code: "outline: none", text: "ohne Ersatz: Wer mit der Tastatur arbeitet, sieht nicht mehr, wo er ist" },
  { code: "<img>", text: "ohne alt-Text — oder mit einem, der „Bild“ lautet" },
  { code: "<h4>", text: "gewählt, weil es klein aussieht: Die Dokumentstruktur stimmt nicht mehr" },
];

const STYLELINT_CODE = `{
  "rules": {
    "color-no-hex": true,
    "color-named": "never",
    "function-disallowed-list": ["rgb", "rgba", "hsl", "hsla"],
    "declaration-property-value-disallowed-list": {
      "/^(margin|padding|gap|inset|top|right|bottom|left)/": ["/\\\\d+px/"],
      "/^border(-.+)?-radius$/": ["/\\\\d+px/"],
      "font-size": ["/\\\\d+(px|rem)/"]
    }
  }
}`;

const STYLELINT_RUN = `# Alles prüfen — außer der Datei, in der die Tokens definiert sind
npx stylelint "src/**/*.css" --ignore-pattern "src/styles/tokens.css"

# Ergebnis bei einem generierten Entwurf:
#   2:12  ✖  Disallowed value "13px 22px" for property "padding"
#   4:18  ✖  Disallowed value "24px" for property "border-radius"
#   6:10  ✖  Disallowed hex color "#c4c4cf"`;

const RULES_CODE = `# Design-Regeln für dieses Projekt

Diese Regeln gelten für jede Oberfläche — egal, wer sie schreibt.

## Bevor du etwas baust
- Für wen ist die Ansicht, und welche Frage beantwortet sie?
  Steht das nicht im Auftrag: nachfragen, nicht raten.
- Verwende die Inhalte aus dem Auftrag. Kein Blindtext, keine erfundenen Kennzahlen.

## Rangfolge
- Jede Ansicht hat eine Hauptsache und höchstens eine gefüllte Schaltfläche.
- Weitere Aktionen: Rahmen (sekundär) oder Textlink (tertiär).
- Betone durch Zurücknehmen: Nebensachen kleiner und blasser — nicht die Hauptsache lauter.

## System
- Farben, Abstände, Radien, Schatten und Schriftgrößen nur über die Variablen in \`tokens.css\`.
- Keine Hex-, RGB- oder HSL-Werte und keine px-Abstände im Komponenten-CSS.
- Fehlt ein Wert: melden und einen Token vorschlagen. Keinen Sonderwert einbauen.
- Keine Verläufe, keine Emojis. Icons nur aus der vorhandenen Bibliothek.
- Schatten nur für Flächen, die über anderen liegen (Menü, Dialog). Keine Karte in einer Karte.

## Zustände
- Jede Ansicht mit Daten braucht: gefüllt, leer, lädt, Fehler.
- Leer: sagt, was hier stehen wird, und bietet den nächsten Schritt an.
- Fehler: in Alltagssprache, mit Ausweg. Eingaben gehen nie verloren.

## Zugänglichkeit
- Semantisches HTML: \`button\` für Aktionen, \`a\` für Navigation, \`label\` für jedes Eingabefeld.
- Jedes bedienbare Element ist per Tastatur erreichbar und hat einen sichtbaren Fokus.
- Text mindestens 4,5:1 Kontrast, Bedienelemente mindestens 3:1. Schrift nicht kleiner als 13 px.
- Information nie allein über Farbe vermitteln.

## Layout
- Fließende Breiten, nutzbar ab 320 px. Keine festen Pixelbreiten für Container.

## Sprache
- Beschriftungen in der Sprache der Nutzer, nicht in der des Datenmodells.
- Schaltflächen nennen das Ergebnis: „Rechnung freigeben“, nicht „OK“.`;

const PROMPT_TEMPLATE = `# Auftrag: <Was soll entstehen?>

## Nutzer & Aufgabe
Wer nutzt das, in welcher Lage, mit welcher Frage?

## Inhalt
Echte Daten, echte Beschriftungen, Namen der Aktionen.

## Rangfolge
1. Hauptsache: …
2. Unterstützend: …
3. Nur auffindbar: …
Hauptaktion: … · Nebenaktionen: …

## System
Nutze nur die Variablen aus tokens.css. Halte dich an design-regeln.md.

## Zustände
gefüllt · leer · lädt · Fehler — jeweils: Was sieht man, was kann man tun?

## Grenzen
Stack: … · Markup: semantisch · Breite: ab 320 px
Nicht bauen: …

## Liefere zuerst
Ein Grey-Box-Wireframe mit allen Zuständen. Gestaltung erst nach meiner Freigabe.`;

const EXERCISE_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tarif-Karte — Entwurf der KI</title>
<style>
  /* ── Tokens: Das ist dein System. Der Entwurf unten ignoriert es. ── */
  :root {
    --text-strong: #16191d;
    --text: #414a55;
    --text-muted: #5f6975;   /* 5,6:1 auf Weiß */
    --line: #dfe3e8;
    --surface: #ffffff;
    --page: #f3f5f7;
    --focus: #1d4ed8;

    --space-1: 4px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-6: 24px;

    --radius: 8px;
    --radius-lg: 12px;

    --text-sm: 13px;
    --text-base: 15px;
    --text-xl: 26px;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: system-ui, sans-serif;
    background: var(--page);
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: var(--space-6);
  }

  /* ── Ab hier: der Entwurf der KI ── */
  .card {
    width: 380px;
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 18px 40px rgba(124, 58, 237, 0.35);
    overflow: hidden;
  }
  .card-head {
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    color: #fff;
    padding: 15px 22px 11px;
    font-size: 17px;
    font-weight: 700;
  }
  .card-body { padding: 13px 22px 19px; }
  .plan  { font-size: 14px; color: #2b2540; }
  .price { font-size: 14px; color: #2b2540; margin-top: 7px; }
  .seats { font-size: 14px; color: #2b2540; margin-top: 3px; }
  .renew { font-size: 12px; color: #c4c4cf; margin-top: 11px; }
  .actions { display: flex; gap: 7px; margin-top: 19px; }
  .btn {
    padding: 9px 17px;
    border-radius: 999px;
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }
</style>
</head>
<body>
  <div class="card">
    <div class="card-head">✨ Your Plan</div>
    <div class="card-body">
      <div class="plan">Team-Tarif</div>
      <div class="price">29 € pro Monat</div>
      <div class="seats">8 von 10 Plätzen belegt</div>
      <div class="renew">Verlängert sich am 1. Dezember</div>
      <div class="actions">
        <div class="btn" onclick="">Tarif wechseln</div>
        <div class="btn" onclick="">Rechnungen</div>
        <div class="btn" onclick="">Kündigen</div>
      </div>
    </div>
  </div>
</body>
</html>`;

const SOLUTION_RULES = `/* 5 · Jeder Wert kommt aus den Tokens. 6 · Fließende Breite */
.card {
  width: 100%;
  max-width: 380px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

/* 1 · Kopf: ein ruhiges Label statt Verlauf und Emoji */
.card-head {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: var(--space-2);
}

/* 2 · Rangfolge. Die Frage an die Karte: Welchen Tarif habe ich? */
.plan  { font-size: var(--text-xl); font-weight: 800; line-height: 1.2; color: var(--text-strong); }
.price { font-size: var(--text-base); font-weight: 600; color: var(--text-strong); margin-top: var(--space-1); }
.seats { font-size: var(--text-base); color: var(--text); }

/* 3 · Zurückgenommen, aber lesbar: 13 px und 5,6:1 */
.renew { font-size: var(--text-sm); color: var(--text-muted); margin-top: var(--space-3); }

/* 4 · Drei Aktionen, drei Stufen */
.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-6);
}
.btn {
  font: inherit;
  font-size: var(--text-sm);
  font-weight: 600;
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--text-strong);
  border-radius: var(--radius);
  background: var(--text-strong);
  color: var(--surface);
  cursor: pointer;
}
.btn-secondary { background: transparent; border-color: var(--text-muted); color: var(--text-strong); }
.btn-quiet {
  background: none;
  border-color: transparent;
  padding-inline: var(--space-1);
  color: var(--text-muted);
  text-decoration: underline;
}

/* 6 · Sichtbarer Fokus für die Tastatur */
.btn:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }`;

const SOLUTION_MARKUP = `<div class="card">
  <!-- Eine Überschrift ist eine Überschrift — und sie spricht die Sprache der Nutzer -->
  <h2 class="card-head">Dein Tarif</h2>

  <div class="plan">Team-Tarif</div>
  <div class="price">29 € pro Monat</div>
  <div class="seats">8 von 10 Plätzen belegt</div>
  <div class="renew">Verlängert sich am 1. Dezember</div>

  <!-- Echte Schaltflächen: per Tab erreichbar, mit Enter und Leertaste auslösbar -->
  <div class="actions">
    <button type="button" class="btn">Tarif wechseln</button>
    <button type="button" class="btn btn-secondary">Rechnungen</button>
    <button type="button" class="btn btn-quiet">Kündigen</button>
  </div>
</div>`;

/* ── Bausteine ─────────────────────────────────────────────────────────── */

function FeedbackMock({ lines, note }: { lines: string[]; note: string }) {
  return (
    <div className={`${STAGE} flex flex-col gap-2.5`}>
      {lines.map((line) => (
        <div key={line} className="text-[14px] font-medium leading-[1.5] text-(--text-primary)">
          {line}
        </div>
      ))}
      <p className={`${CAPTION} pt-1`}>{note}</p>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-none p-0 m-0 flex flex-col gap-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-[13px] leading-[1.6] text-(--text-secondary)">
          <span className="size-1.5 rounded-full bg-(--text-ghost) shrink-0 mt-2" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ── Seite ─────────────────────────────────────────────────────────────── */

export default function AiWorkflowModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      <div className={PAGE}>
        {/* ── TITEL ── */}
        <div className="mb-2">
          <Badge variant="module" dot>Modul {MODULE.number}</Badge>
        </div>
        <h1 className={H1}>UI mit KI bauen: Briefen, Prüfen, Nachschärfen</h1>
        <p className={LEAD}>
          Ein KI-Assistent schreibt eine Oberfläche in Sekunden. Ob sie gut wird, entscheidet sich davor und danach:
          im Auftrag, den du gibst, und im Urteil, das du fällst. Dieses Modul macht aus allem, was du bisher gelernt
          hast, einen Arbeitsablauf.
        </p>

        <ModuleMeta duration="75 Min." practiceTime="~25 Min." />

        <BuildsOn modules={["visual-hierarchy", "design-tokens"]} />
        <LearningGoals
          goals={[
            "Einordnen, warum Oberflächen ohne Vorgaben austauschbar aussehen — und was dagegen hilft",
            "Einen UI-Auftrag schreiben, der Nutzer, Inhalt, Rangfolge, System, Zustände und Grenzen festlegt",
            "Einen generierten Entwurf in fester Reihenfolge prüfen statt nach Gefühl",
            "Typische Schwächen erkennen und der Regel zuordnen, gegen die sie verstoßen",
            "Rückmeldung so formulieren, dass sie umsetzbar ist: Regel benennen, Wert vorgeben",
            "Design Tokens, eine Regeldatei und einen Linter als dauerhafte Leitplanken einrichten",
          ]}
        />

        <hr className={HR} />

        {/* ── KERNGEDANKE ── */}
        <p className={EYEBROW}>Kerngedanke</p>
        <InsightRow icon={Gauge} title="Erzeugen ist billig geworden — Beurteilen ist die Arbeit">
          Zehn Varianten einer Seite kosten heute eine Minute. Der Engpass hat sich verschoben: Nicht mehr das Bauen
          bremst, sondern die Frage, welche Variante taugt — und warum die anderen nicht.
        </InsightRow>
        <InsightRow icon={Dices} title="Ohne Vorgaben bekommst du den Durchschnitt">
          Ein Sprachmodell füllt jede Lücke im Auftrag mit dem Wahrscheinlichsten. Deshalb sehen so viele generierte
          Oberflächen gleich aus: derselbe Verlauf, dieselben runden Karten, dieselben Emojis. Das ist kein Fehler des
          Modells. Es ist die ehrliche Antwort auf eine Frage ohne Inhalt.
        </InsightRow>
        <InsightRow icon={ScanSearch} title="Du bist nicht mehr nur Autor — du bist Auftraggeber und Prüfer">
          Beides braucht dasselbe Wissen. Wer Rangfolge, Kontrast und Abstände benennen kann, schreibt bessere Aufträge
          und findet Schwächen in Sekunden. Wer es nicht kann, sagt „irgendwie stimmt das nicht“ — und bekommt beim
          nächsten Versuch einen anderen Zufall.
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

        <ExplanationBox title="Zur Einordnung" className="mt-6">
          <p>
            Dieses Modul nennt bewusst keine einzelnen Werkzeuge. Sie wechseln im Halbjahrestakt — die Arbeitsweise
            bleibt. Was hier steht, gilt für einen Chat im Browser genauso wie für einen Assistenten im Editor oder
            einen Agenten, der selbstständig Dateien ändert.
          </p>
        </ExplanationBox>

        <hr className={HR} />

        {/* ── SCHRITT 1 ── */}
        <p className={EYEBROW}>Schritt 1 — Briefen</p>
        <h2 className={H2}>Der Auftrag: Entscheide, bevor die KI es tut</h2>
        <p className={P}>
          „Bau eine Karte für die Rechnungsfreigabe“ ist kein Auftrag, sondern eine Einladung zum Raten. Jede
          Entscheidung, die du nicht triffst, trifft das Modell — nach Wahrscheinlichkeit, nicht nach deinem Produkt.{" "}
          <strong className={STRONG}>Ein guter Auftrag besteht aus sechs Bausteinen. Schalte sie einzeln zu und sieh,
          was jeder verändert.</strong>
        </p>

        <BriefBuilder />

        <ExplanationBox title="Was der Baukasten zeigt">
          <p>
            Jeder Baustein behebt genau eine Art von Schwäche — und keiner ersetzt einen anderen. Die Rangfolge macht
            die Karte lesbar, aber ohne System bleibt sie lila. Das System macht sie ruhig, aber ohne Inhalt steht
            weiter Blindtext darin.
          </p>
          <p>
            <strong>Und kein Baustein ist neu:</strong> Nutzer und Inhalt stammen aus dem Feature-Brief
            (<ModuleRef slug="understanding-users" />), Zustände aus <ModuleRef slug="structure-flows" />, die
            Rangfolge aus <ModuleRef slug="visual-hierarchy" />, das System aus <ModuleRef slug="design-tokens" />.
            Der Auftrag ist die Zusammenfassung des Workshops in sechs Absätzen.
          </p>
        </ExplanationBox>

        <TheoryCard label="Vier Regeln für den Auftrag">
          <ConceptList>
            <ConceptItem title="Gib Inhalt mit, nicht nur Form">
              Echte Daten, echte Beschriftungen, echte Namen der Aktionen. Mit Blindtext lässt sich keine Rangfolge
              bilden — weder vom Modell noch von dir.
            </ConceptItem>
            <ConceptItem title="Leg die Rangfolge fest, nicht das Aussehen">
              „Betrag und Fälligkeit sind die Hauptsache“ ist eine Entscheidung. „Mach den Betrag 26 px groß und fett“
              ist Mikromanagement — das Wie ergibt sich aus deinem System.
            </ConceptItem>
            <ConceptItem title="Sag, was nicht entstehen soll">
              Ohne Grenzen baut ein Assistent gern mehr als bestellt: eine Navigation, einen Dark Mode, drei zusätzliche
              Kennzahlen. Nicht-Ziele sparen die meiste Aufräumarbeit.
            </ConceptItem>
            <ConceptItem title="Bestell zuerst die Struktur">
              Lass dir ein Grey-Box-Wireframe mit allen Zuständen geben, bevor gestaltet wird. So prüfst du den Aufbau,
              solange er nichts kostet — wie in <ModuleRef slug="structure-flows" /> gezeigt.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <RuleBox>
          Ein Auftrag ist gut, wenn ein neuer Kollege damit dasselbe bauen würde wie du. Fehlt ihm etwas, um
          loszulegen, fehlt es dem Modell auch — nur fragt das Modell selten nach.
        </RuleBox>

        <hr className={HR} />

        {/* ── SCHRITT 2 ── */}
        <p className={EYEBROW}>Schritt 2 — Prüfen</p>
        <h2 className={H2}>Die Prüfung: fünf Fragen in fester Reihenfolge</h2>
        <p className={P}>
          Ein generierter Entwurf sieht fast immer fertig aus. Genau das macht die Prüfung schwer: Nichts ist
          offensichtlich kaputt. Geh deshalb nicht nach Gefühl vor, sondern in einer festen Reihenfolge — vom Großen
          zum Kleinen. <strong className={STRONG}>Stimmt die Aufgabe nicht, lohnt sich der Blick auf die Abstände noch
          nicht.</strong>
        </p>

        <div className={`${PANEL} overflow-hidden`}>
          <div className="hidden md:grid grid-cols-[minmax(0,3fr)_minmax(0,5fr)_minmax(0,8fr)] gap-4 px-5 py-3 border-b border-(--bg-elevated) bg-(--bg-base)">
            <span className={MICRO}>Prüfschritt</span>
            <span className={MICRO}>Die Frage</span>
            <span className={MICRO}>So prüfst du</span>
          </div>
          <ol className="list-none m-0 p-0 divide-y divide-(--bg-elevated)">
            {REVIEW_ORDER.map((row, index) => (
              <li key={row.name} className="grid gap-x-4 gap-y-1 px-5 py-4 md:grid-cols-[minmax(0,3fr)_minmax(0,5fr)_minmax(0,8fr)]">
                <div className="text-[14px] font-bold leading-[1.5] text-(--text-primary)">
                  <span className="font-mono text-[13px] text-(--text-ghost) mr-2">{index + 1}</span>
                  {row.name}
                </div>
                <div className="text-[13px] leading-[1.6] text-(--text-tertiary)">{row.question}</div>
                <div className="text-[13px] leading-[1.6] text-(--text-secondary)">{row.how}</div>
              </li>
            ))}
          </ol>
        </div>

        <h3 className={H3}>Probier es aus — finde die sieben Schwächen</h3>
        <p className={P}>
          Die Karte unten ist ein typisches Ergebnis für den Auftrag „Bau eine Abo-Übersicht“. Sie funktioniert, und
          sie sieht auf den ersten Blick ordentlich aus. Klick auf jede Stelle, die gegen eine Regel aus dem Workshop
          verstößt.
        </p>

        <ReviewHunt />

        <h3 className={H3}>Die häufigsten Schwächen — und wo die Regel dazu steht</h3>
        <p className={P}>
          Was in der Übung auffällt, folgt einem Muster. Die Liste taugt als Prüfzettel für jeden generierten Entwurf.
          Jede Zeile verweist auf das Modul, das die Regel begründet.
        </p>

        <div className={`${PANEL} overflow-hidden`}>
          <div className="hidden md:grid grid-cols-[minmax(0,4fr)_minmax(0,6fr)_minmax(0,6fr)_minmax(0,2fr)] gap-4 px-5 py-3 border-b border-(--bg-elevated) bg-(--bg-base)">
            <span className={MICRO}>Schwäche</span>
            <span className={MICRO}>Woran du sie erkennst</span>
            <span className={MICRO}>Regel</span>
            <span className={MICRO}>Modul</span>
          </div>
          <div className="divide-y divide-(--bg-elevated)">
            {SMELLS.map((row) => (
              <div key={row.smell} className="grid gap-x-4 gap-y-1 px-5 py-3.5 md:grid-cols-[minmax(0,4fr)_minmax(0,6fr)_minmax(0,6fr)_minmax(0,2fr)] md:items-baseline">
                <div className="text-[14px] font-bold leading-[1.5] text-(--text-primary)">{row.smell}</div>
                <div className="text-[13px] leading-[1.6] text-(--text-tertiary)">{row.sign}</div>
                <div className="text-[13px] leading-[1.6] text-(--text-secondary)">{row.rule}</div>
                <div className="text-[13px] leading-[1.6]">
                  <ModuleRef slug={row.ref} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <h3 className={H3}>Was man dem Bild nicht ansieht: das Markup</h3>
        <p className={P}>
          Ein Screenshot zeigt nicht, ob eine Oberfläche bedienbar ist. Generierter Code sieht oft richtig aus und ist
          es nicht. Diese fünf Stellen findest du nur im Quelltext — oder indem du die Maus weglegst:
        </p>

        <div className={`${PANEL} overflow-hidden divide-y divide-(--bg-elevated)`}>
          {INVISIBLE.map((row) => (
            <div key={row.code} className="grid gap-x-4 gap-y-1 px-5 py-3 sm:grid-cols-[150px_1fr] sm:items-baseline">
              <code className="font-mono text-[13px] font-semibold text-(--text-primary)">{row.code}</code>
              <span className="text-[13px] leading-[1.6] text-(--text-secondary)">{row.text}</span>
            </div>
          ))}
        </div>

        <RuleBox title="Der Tab-Test">
          Leg die Maus weg und bediene die Oberfläche nur mit Tab, Enter und Leertaste. Erreichst du jede Aktion? Siehst
          du jederzeit, wo du bist? Das dauert eine Minute und findet mehr als jedes Werkzeug.
        </RuleBox>

        <hr className={HR} />

        {/* ── SCHRITT 3 ── */}
        <p className={EYEBROW}>Schritt 3 — Nachschärfen</p>
        <h2 className={H2}>Rückmeldung, die etwas ändert</h2>
        <p className={P}>
          Auf „mach es schöner“ kann ein Modell nur mit einem neuen Zufall antworten. Es weiß nicht, was dich stört —
          und rät wieder. Gute Rückmeldung sieht aus wie ein guter Code-Review-Kommentar:{" "}
          <strong className={STRONG}>Sie benennt die Stelle, die Regel und den gewünschten Wert.</strong>
        </p>

        <ComparisonPanel
          bad={{
            label: "Ein Gefühl",
            children: (
              <FeedbackMock
                lines={["„Mach es moderner und irgendwie cleaner.“", "„Das wirkt noch nicht richtig. Versuch es nochmal.“"]}
                note="Das Modell ändert irgendetwas. Ob es besser wird, ist Glück — und was vorher gut war, ist danach vielleicht weg."
              />
            ),
          }}
          good={{
            label: "Eine Regel und ein Wert",
            children: (
              <FeedbackMock
                lines={[
                  "„Die Karte hat drei gefüllte Schaltflächen. ‚Freigeben‘ bleibt gefüllt, ‚Zurückweisen‘ bekommt einen Rahmen, ‚Details‘ wird ein Textlink.“",
                  "„Ersetze alle Abstände durch Tokens: innen --space-4, zwischen den Gruppen --space-6.“",
                ]}
                note="Eindeutig, überprüfbar — und alles andere bleibt, wie es ist."
              />
            ),
          }}
        />

        <TheoryCard label="Vier Gewohnheiten beim Nachschärfen">
          <ConceptList>
            <ConceptItem title="Eine Sache pro Runde">
              Wer fünf Dinge auf einmal bestellt, kann danach nicht mehr sagen, welche Änderung was bewirkt hat — und
              prüft fünf Stellen statt einer.
            </ConceptItem>
            <ConceptItem title="Sag dazu, was bleiben soll">
              „Ändere nur die Schaltflächen, alles andere bleibt unverändert.“ Ohne diesen Satz wird gern nebenbei
              umgebaut, was schon gut war.
            </ConceptItem>
            <ConceptItem title="Lass gegen deine Regeln prüfen — und schau selbst hin">
              Viele Assistenten können Screenshots lesen oder die Seite im Browser öffnen. Lass sie das Ergebnis mit
              deiner Regeldatei abgleichen. Das findet einiges, aber nicht alles: Die Entscheidung bleibt bei dir.
            </ConceptItem>
            <ConceptItem title="Kleinigkeiten selbst ändern">
              Einen Abstand von 12 auf 16 zu stellen, ist schneller getippt als beschrieben. Das Werkzeug ist für die
              Fleißarbeit da, nicht für jeden Handgriff.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <hr className={HR} />

        {/* ── LEITPLANKEN ── */}
        <p className={EYEBROW}>Dauerhaft besser</p>
        <h2 className={H2}>Leitplanken: Regeln, die nicht in jedem Auftrag stehen müssen</h2>
        <p className={P}>
          Wer dieselben Vorgaben in jeden Auftrag schreibt, vergisst sie irgendwann. Besser ist, sie einmal im Projekt
          zu verankern — auf drei Ebenen, von weich nach hart:
        </p>

        <TheoryCard label="Drei Ebenen">
          <ConceptList>
            <ConceptItem title="Tokens — das Vokabular">
              Eine Datei mit allen erlaubten Farben, Abständen, Radien und Schriftgrößen. Sie ist die wirksamste
              einzelne Vorgabe: Ein Modell, das nur aus zwölf Abständen wählen darf, erfindet keinen dreizehnten.
              Aufbau und Benennung zeigt <ModuleRef slug="design-tokens" />.
            </ConceptItem>
            <ConceptItem title="Regeldatei — die Grammatik">
              Die meisten Coding-Assistenten lesen beim Start eine Datei mit Projektregeln. Wie sie heißt, hängt vom
              Werkzeug ab — verbreitet sind etwa AGENTS.md oder CLAUDE.md. Dort steht, was Tokens nicht ausdrücken
              können: eine Hauptaktion pro Ansicht, Zustände, Sprache.
            </ConceptItem>
            <ConceptItem title="Linter — die Kontrolle">
              Was eine Maschine prüfen kann, sollte kein Mensch prüfen müssen. Ein Linter, der feste Farbwerte und
              Pixel-Abstände ablehnt, läuft bei jedem Commit — und gilt für Menschen wie für Modelle.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <h3 className={H3}>Die Kontrolle: Stylelint lehnt Werte außerhalb des Systems ab</h3>
        <p className={P}>
          Vier Regeln aus dem Standardumfang von Stylelint genügen: keine Hex-Werte, keine Farbnamen, keine
          Farbfunktionen — und keine Pixelwerte für Abstände, Radien und Schriftgrößen. Erlaubt bleibt nur{" "}
          <code className={CODE}>var(--…)</code>.
        </p>
        <CodeBlock language="JSON — .stylelintrc.json" code={STYLELINT_CODE} />
        <CodeBlock language="Shell — prüfen" code={STYLELINT_RUN} />

        <ReferenceBox title="Geprüft">
          <p>
            Die Konfiguration verwendet ausschließlich Regeln aus dem Kern von Stylelint (<code>color-no-hex</code>,{" "}
            <code>color-named</code>, <code>function-disallowed-list</code>,{" "}
            <code>declaration-property-value-disallowed-list</code>) und wurde mit Stylelint 18 gegen einen generierten
            Entwurf getestet. Die Ausgabe oben stammt aus diesem Lauf.
          </p>
        </ReferenceBox>

        <hr className={HR} />

        {/* ── GRENZEN ── */}
        <p className={EYEBROW}>Grenzen</p>
        <h2 className={H2}>Was die KI dir nicht abnimmt</h2>
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 shadow-(--shadow-sm)">
            <div className={`${MICRO} mb-3`}>Bleibt bei dir</div>
            <BulletList
              items={[
                "Mit Nutzern sprechen und ihnen zusehen — ein Modell kennt deine Kunden nicht",
                "Entscheiden, was gebaut wird und was nicht",
                "Mit Tastatur und Screenreader testen, auf echten Geräten",
                "Verantworten, was live geht",
              ]}
            />
          </div>
          <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 shadow-(--shadow-sm)">
            <div className={`${MICRO} mb-3`}>Worauf du achten musst</div>
            <BulletList
              items={[
                "Ein Entwurf, der fertig aussieht, ist nicht geprüft",
                "Erfundene Inhalte: Kennzahlen, Zitate, Funktionen, die es nicht gibt",
                "Schleichende Abweichung: Jede Runde ohne Leitplanken entfernt sich weiter vom System",
                "Kundendaten gehören nur in Werkzeuge, die dafür freigegeben sind",
              ]}
            />
          </div>
        </div>

        <ReferenceBox title="Rechtlicher Rahmen">
          <p>
            Seit dem <strong>28. Juni 2025</strong> gilt in Deutschland das Barrierefreiheitsstärkungsgesetz (BFSG),
            das den European Accessibility Act umsetzt. Viele digitale Angebote für Verbraucher — etwa Online-Shops
            und Bankdienste — müssen seitdem barrierefrei sein. Wer den Code geschrieben hat, spielt dafür keine
            Rolle.
          </p>
        </ReferenceBox>

        <RuleBox>
          Die KI ist ein schneller, belesener Kollege ohne Kenntnis deines Produkts und ohne Verantwortung dafür. Gib
          ihr, was ihr fehlt — Kontext und Regeln — und behalte, was sie nicht tragen kann: das Urteil.
        </RuleBox>

        <hr className={HR} />

        {/* ── PRAXISAUFGABE ── */}
        <p className={EYEBROW}>Praxisaufgabe</p>
        <h2 className={H2}>Einen generierten Entwurf ins System holen</h2>

        <ExerciseBlock
          title="Aufgabenstellung"
          tasks={[
            "Kopf: Entferne Verlauf und Emoji und gib der Karte einen Titel in der Sprache der Nutzer",
            "Rangfolge: Entscheide, welche der vier Zeilen die Hauptsache ist, und drücke es mit --text-xl, --text-base und --text-sm sowie den drei Textfarben aus",
            "Kontrast: Bring den Hinweis zur Verlängerung auf mindestens 4,5:1 und mindestens 13 px",
            "Aktionen: eine gefüllte Hauptaktion, eine mit Rahmen, „Kündigen“ als Textlink — und mach aus den div-Elementen echte button-Elemente",
            "System: Ersetze jeden festen Wert im Entwurf — Farben, Abstände, Radien, Schatten — durch ein Token aus :root",
            "Zugang: Ergänze einen sichtbaren Fokus (:focus-visible) und ersetze width: 380px durch eine fließende Breite",
            "Prüfe: Such im CSS unterhalb der Tokens nach „#“. Es darf kein Farbwert mehr übrig sein",
          ]}
        >
          Die Karte unten hat eine KI zum Auftrag „Bau eine Tarif-Übersicht“ geliefert. Oben im Stylesheet stehen die
          Tokens deines Projekts — der Entwurf darunter benutzt keinen einzigen davon. Geh in der Reihenfolge der
          Prüfung vor und hol die Karte ins System. Das HTML darfst du diesmal ändern. Im Tab „Inspector“ kannst du
          Elemente anklicken und ihre Werte nachsehen.
        </ExerciseBlock>

        <LiveEditor title="Tarif-Karte — Entwurf der KI" html={EXERCISE_HTML} previewHeight={540} />

        <details className="group bg-(--bg-surface) border border-(--bg-elevated) rounded-xl mt-6 mb-6 shadow-(--shadow-sm)">
          <summary className="cursor-pointer select-none px-6 py-4 text-[14px] font-semibold text-(--text-primary) marker:text-(--accent)">
            Musterlösung anzeigen
            <span className="font-normal text-(--text-tertiary)"> — erst selbst probieren</span>
          </summary>
          <div className="px-6 pb-2">
            <p className={P}>
              Eine mögliche Lösung. Die Frage an diese Karte lautet „Welchen Tarif habe ich?“ — deshalb führt der
              Tarifname, der Preis ordnet ihn ein. Achte darauf, dass im CSS unterhalb der Tokens kein einziger
              Farbwert und kein Abstand in Pixeln mehr steht. Der Kopf verliert seine eigene Fläche und wird zu einem
              Label; damit entfällt auch <code className={CODE}>.card-body</code>.
            </p>
            <CodeBlock language="CSS — Musterlösung (ersetzt den Entwurf der KI)" code={SOLUTION_RULES} />
            <CodeBlock language="HTML — Musterlösung" code={SOLUTION_MARKUP} />
          </div>
        </details>

        <hr className={HR} />

        {/* ── ZUM MITNEHMEN ── */}
        <p className={EYEBROW}>Zum Mitnehmen</p>
        <h2 className={H2}>Zwei Dateien für dein Projekt</h2>
        <p className={P}>
          Die Regeldatei fasst den Workshop auf einer Seite zusammen — in der Form, in der ein Assistent sie lesen
          kann. Leg sie ins Repository und verweise aus der Regeldatei deines Werkzeugs darauf. Sie nützt auch
          Menschen: als Checkliste im Code-Review.
        </p>
        <CodeBlock language="Markdown — design-regeln.md" code={RULES_CODE} />

        <h3 className={H3}>Vorlage für den Auftrag</h3>
        <p className={P}>
          Die sechs Bausteine als Gerüst. Füll sie aus dem Feature-Brief aus <ModuleRef slug="understanding-users" />{" "}
          — die ersten beiden Abschnitte kannst du fast wörtlich übernehmen.
        </p>
        <CodeBlock language="Markdown — Auftrag an den Assistenten" code={PROMPT_TEMPLATE} />

        <TheoryCard label="Merkliste">
          <ConceptList>
            <ConceptItem title="Briefen, prüfen, nachschärfen">
              Die Arbeit liegt vor und nach dem Erzeugen — nicht im Erzeugen.
            </ConceptItem>
            <ConceptItem title="Sechs Bausteine">
              Nutzer, Inhalt, Rangfolge, System, Zustände, Grenzen. Was fehlt, wird geraten.
            </ConceptItem>
            <ConceptItem title="Vom Großen zum Kleinen prüfen">
              Aufgabe, Rangfolge, System, Zustände, Zugang — in dieser Reihenfolge.
            </ConceptItem>
            <ConceptItem title="Regel und Wert statt Gefühl">
              „Drei gefüllte Schaltflächen, eine reicht“ lässt sich umsetzen. „Schöner“ nicht.
            </ConceptItem>
            <ConceptItem title="Tokens, Regeldatei, Linter">
              Leitplanken wirken dauerhaft — für Modelle und für Menschen.
            </ConceptItem>
            <ConceptItem title="Das Urteil bleibt bei dir">
              Was live geht, verantwortest du. Fertig aussehen ist kein Prüfergebnis.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <p className={EYEBROW}>Ausblick</p>
        <p className={P}>
          Damit hast du alles beisammen: verstehen, strukturieren, gestalten, systematisieren — und einen Ablauf, mit
          dem sich das auch dann durchhalten lässt, wenn eine KI mitschreibt. Im <ModuleRef slug="praxis-project" />{" "}
          baust du aus einem flachen Dashboard ein eigenes Design-System und wendest es Element für Element an.
        </p>
      </div>

      <ModuleNav prevModule={prevModule} nextModule={nextModule} />
    </div>
  );
}
