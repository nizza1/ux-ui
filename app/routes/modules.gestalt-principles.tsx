import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Fragment } from "react";
import { ArrowUp, Brain, ChevronRight, Code2, Eye, ListTree, Lock, Music, Trash2, Zap } from "lucide-react";
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
import { ApparentMotionDemo } from "~/components/demos/gestalt/ApparentMotionDemo";
import { FigureGroundDemo } from "~/components/demos/gestalt/FigureGroundDemo";
import { GroupingLab } from "~/components/demos/gestalt/GroupingLab";
import { FormLab } from "~/components/demos/gestalt/FormLab";
import { PerceptionParser } from "~/components/demos/gestalt/PerceptionParser";
import { PrincipleQuiz } from "~/components/demos/gestalt/PrincipleQuiz";
import { CAPTION, CODE, EYEBROW, H1, H2, H3, HR, LEAD, MICRO, P, PAGE, PANEL, STAGE, STRONG } from "~/components/ui/moduleStyles";

const SLUG = "gestalt-principles";
const MODULE = getModuleBySlug(SLUG)!;

export const meta: MetaFunction = () => [
  { title: `${MODULE.titleDe} — UX/UI Workshop` },
  { name: "description", content: MODULE.description },
];

export function loader() {
  return getModuleNeighbors(SLUG);
}

/* ── Daten: Aufbau ─────────────────────────────────────────────────────── */

const PARTS = [
  { id: "herkunft", label: "Herkunft", text: "Wer die Gestaltpsychologie begründet hat — und wogegen" },
  { id: "psychologie", label: "Psychologie", text: "Warum das Gehirn gruppiert und es nicht lassen kann" },
  { id: "prinzipien", label: "Die Prinzipien", text: "Neun Prinzipien, geordnet nach drei Fragen" },
  { id: "interface", label: "Im Interface", text: "Jedes Prinzip als UI-Muster und CSS-Hebel" },
  { id: "weiterdenken", label: "Weiterdenken", text: "Konflikte, Abstandssystem, Barrierefreiheit, Manipulation, KI" },
  { id: "praxis", label: "Praxis", text: "Quiz, Aufgabe mit Musterlösung, Code zum Mitnehmen" },
];

/* ── Daten: Herkunft ───────────────────────────────────────────────────── */

const FOUNDERS = [
  {
    name: "Max Wertheimer",
    life: "1880–1943",
    places: "Prag · Frankfurt · Berlin · New York",
    text: "Der Begründer. Zeigte 1912, dass Bewegung im Kopf entstehen kann, und formulierte 1923 die Gesetze der Gruppierung — mit Punktmustern, die bis heute in jedem Lehrbuch stehen. Floh 1933 vor den Nationalsozialisten nach New York.",
  },
  {
    name: "Wolfgang Köhler",
    life: "1887–1967",
    places: "Reval · Teneriffa · Berlin · Swarthmore",
    text: "Der Theoretiker. Erforschte auf Teneriffa, wie Schimpansen Probleme durch Einsicht lösen, und leitete danach das Psychologische Institut in Berlin, das Zentrum der Schule. Protestierte 1933 öffentlich gegen die Entlassung jüdischer Kollegen und emigrierte 1935.",
  },
  {
    name: "Kurt Koffka",
    life: "1886–1941",
    places: "Berlin · Gießen · Northampton (USA)",
    text: "Der Vermittler. Lehrte ab 1927 in den USA und schrieb 1935 das Standardwerk auf Englisch. Mit ihm wanderten die deutschen Begriffe in die englische Fachsprache — und von dort ins Design.",
  },
];

const TIMELINE = [
  {
    year: "1890",
    who: "Christian von Ehrenfels",
    what: "„Über Gestaltqualitäten“: Eine Melodie bleibt dieselbe, auch wenn jeder Ton ein anderer ist. Das Ganze hat Eigenschaften, die in keinem Teil stecken.",
  },
  {
    year: "1912",
    who: "Max Wertheimer",
    what: "Experimente zur Scheinbewegung in Frankfurt, mit Köhler und Koffka als Versuchspersonen. Gilt als Gründung der Gestaltpsychologie.",
  },
  {
    year: "1915",
    who: "Edgar Rubin",
    what: "Figur und Grund, mit der Vase, die zu zwei Gesichtern kippt. Rubin forschte in Kopenhagen, die Gestaltpsychologen übernahmen seine Befunde.",
  },
  {
    year: "1923",
    who: "Max Wertheimer",
    what: "„Untersuchungen zur Lehre von der Gestalt II“: die Faktoren der Gruppierung — Nähe, Gleichheit, gemeinsames Schicksal, Geschlossenheit, gute Kurve, Erfahrung.",
  },
  {
    year: "1933–35",
    who: "Emigration",
    what: "Wertheimer flieht 1933, Köhler geht 1935 nach öffentlichem Protest, Koffka lehrt schon in den USA. Die Berliner Schule endet, ihre Ideen leben in Amerika weiter.",
  },
  {
    year: "1935",
    who: "Kurt Koffka",
    what: "„Principles of Gestalt Psychology“ — die Gestaltgesetze erreichen die englischsprachige Welt, samt deutscher Begriffe.",
  },
  {
    year: "1954",
    who: "Rudolf Arnheim",
    what: "„Art and Visual Perception“: Der Schüler von Wertheimer und Köhler überträgt die Gestaltpsychologie auf Kunst und Gestaltung. Die Brücke ins Design.",
  },
  {
    year: "1955",
    who: "Gaetano Kanizsa",
    what: "Das Dreieck, das es nicht gibt: Scheinkonturen als stärkster Beleg für Geschlossenheit.",
  },
  {
    year: "1992 / 94",
    who: "Stephen Palmer, Irvin Rock",
    what: "Zwei neue Prinzipien: gemeinsame Region und Verbundenheit — für Karten, Listen und Stepper die wichtigsten von allen.",
  },
  {
    year: "2012",
    who: "Johan Wagemans u. a.",
    what: "„A century of Gestalt psychology in visual perception“: Bilanz nach 100 Jahren. Die Prinzipien halten, die Erklärungen dahinter sind heute andere.",
  },
];

/* ── Daten: Prinzipien ─────────────────────────────────────────────────── */

const QUESTIONS = [
  {
    n: "1",
    question: "Was ist vorne?",
    principles: "Figur und Grund",
    text: "Ding oder Hintergrund? Erst wenn das feststeht, gibt es etwas zu gruppieren.",
  },
  {
    n: "2",
    question: "Was gehört zusammen?",
    principles: "Nähe · Ähnlichkeit · Gemeinsame Region · Verbundenheit · Gemeinsames Schicksal",
    text: "Fünf Signale, die Elemente zu Gruppen verbinden — und gegeneinander antreten können.",
  },
  {
    n: "3",
    question: "Welche Form hat das Ganze?",
    principles: "Geschlossenheit · Gute Fortsetzung · Prägnanz",
    text: "Lücken schließen, Linien weiterführen, die einfachste Deutung wählen.",
  },
];

type FigureKind = "proximity" | "similarity" | "region" | "connected" | "fate";

const GROUPING: {
  id: FigureKind;
  name: string;
  english: string;
  origin: string;
  what: string;
  why: string;
  everyday: string;
}[] = [
  {
    id: "proximity",
    name: "Nähe",
    english: "Proximity",
    origin: "Wertheimer, 1923",
    what: "Was nah beieinander liegt, wird als Gruppe gesehen. Entscheidend ist nicht der absolute Abstand, sondern das Verhältnis: Ein Element gehört zu dem Nachbarn, dem es näher ist.",
    why: "Teile desselben Dings hängen räumlich zusammen, die Beeren einer Traube, die Blätter eines Zweigs. Eine große Lücke heißt meistens: Hier fängt etwas anderes an.",
    everyday: "In einer Warteschlange erkennst du an den Abständen sofort, wer zusammen unterwegs ist.",
  },
  {
    id: "similarity",
    name: "Ähnlichkeit",
    english: "Similarity",
    origin: "Wertheimer, 1923",
    what: "Was gleich aussieht, gehört zusammen: gleiche Farbe, Form, Größe, Ausrichtung oder Textur. Unterschiede in Helligkeit und Farbe springen dabei schneller ins Auge als Unterschiede in der Form.",
    why: "Ein Ding besteht meist aus einem Material. Fell, Rinde oder Stoff sehen überall an ihm gleich aus. Gleiches Aussehen ist ein Hinweis auf gleiche Herkunft.",
    everyday: "Im Stadion erkennst du die Fans einer Mannschaft an den Trikots, egal wo sie sitzen.",
  },
  {
    id: "region",
    name: "Gemeinsame Region",
    english: "Common Region",
    origin: "Palmer, 1992",
    what: "Was innerhalb einer gemeinsamen Begrenzung liegt, gehört zusammen — selbst wenn es weiter auseinandersteht als zu Elementen außerhalb. Region schlägt Nähe.",
    why: "Begrenzungen sind in der Welt oft Behälter oder Oberflächen. Was auf demselben Tablett steht, wird zusammen getragen.",
    everyday: "Was in deinem Einkaufswagen liegt, gehört dir, auch wenn es ganz am Rand liegt.",
  },
  {
    id: "connected",
    name: "Verbundenheit",
    english: "Connectedness",
    origin: "Palmer & Rock, 1994",
    what: "Elemente, die durch eine Linie oder Fläche verbunden sind, werden als Einheit gesehen. Das ist das stärkste Gruppierungssignal: Es setzt sich gegen Nähe und Ähnlichkeit durch.",
    why: "Was physisch verbunden ist, ist in der Regel ein Gegenstand. Hebst du ein Ende an, kommt das andere mit.",
    everyday: "Zwei Ballons an einer Schnur gehören zusammen, auch wenn ein dritter näher daneben schwebt.",
  },
  {
    id: "fate",
    name: "Gemeinsames Schicksal",
    english: "Common Fate",
    origin: "Wertheimer, 1923",
    what: "Was sich gleichzeitig in dieselbe Richtung bewegt oder verändert, wird zur Gruppe — sofort, auch wenn es vorher nicht zusammengehörig aussah.",
    why: "Teile eines Körpers bewegen sich gemeinsam. Deshalb versagt Tarnung, sobald sich ein Tier bewegt: Die Flecken, die eben noch zum Laub gehörten, wandern zusammen.",
    everyday: "Ein Vogelschwarm wird erst zur Form, wenn er gemeinsam dreht.",
  },
];

/* ── Daten: Interface ──────────────────────────────────────────────────── */

const UI_MAP = [
  {
    principle: "Figur und Grund",
    ui: "Dialog, Dropdown, Toast, Karte auf einer Fläche, Text auf Bild",
    css: "::backdrop, box-shadow, eigene background",
    mistake: "Dialog ohne abgedunkelten Hintergrund; Text direkt auf einem unruhigen Foto",
  },
  {
    principle: "Nähe",
    ui: "Label + Feld, Überschrift + Text, Icon + Beschriftung, Preis + Einheit",
    css: "gap, margin, Abstands-Tokens",
    mistake: "Ein Abstand für alles; Überschrift so weit vom eigenen Text wie vom vorigen",
  },
  {
    principle: "Ähnlichkeit",
    ui: "Links, Buttons einer Rolle, Status-Badges, Tabellenspalten",
    css: "Komponenten-Varianten, Klassen, Tokens",
    mistake: "Link sieht aus wie Text; drei Button-Stile für dieselbe Rolle",
  },
  {
    principle: "Gemeinsame Region",
    ui: "Karten, Feldgruppen, Werkzeuggruppen, markierte Tabellenzeile",
    css: "background, border, padding, border-radius",
    mistake: "Karte um jedes einzelne Element; Rahmen trennt Label vom Wert",
  },
  {
    principle: "Verbundenheit",
    ui: "Stepper, Timeline, Baumansicht, aktiver Tab mit Unterstrich",
    css: "border, ::before / ::after",
    mistake: "Trennlinie zwischen Überschrift und Inhalt",
  },
  {
    principle: "Gemeinsames Schicksal",
    ui: "Hover auf der ganzen Zeile, Akkordeon, Mehrfachauswahl beim Ziehen",
    css: "transition, transform, :hover und :focus-within am Container",
    mistake: "Nur der Text reagiert, die Zeile nicht; Klickziel kleiner als die sichtbare Einheit",
  },
  {
    principle: "Geschlossenheit",
    ui: "Angeschnittene Karte im Karussell, Fortschrittsring, Skeleton, Icons aus Strichen",
    css: "overflow-x: auto, Breiten, die nicht aufgehen",
    mistake: "Karussell endet bündig am Rand — niemand ahnt, dass es weitergeht",
  },
  {
    principle: "Gute Fortsetzung",
    ui: "Ausrichtung an gemeinsamen Kanten, Lesepfad, Raster",
    css: "grid, gemeinsame Startkante, align-items: baseline",
    mistake: "Elemente springen um ein paar Pixel aus der Flucht",
  },
  {
    principle: "Prägnanz",
    ui: "Einfache Icons, wenige Formen, ruhige Kanten",
    css: "wenige Radien, Rahmenstärken und Achsen",
    mistake: "Fünf Radien, drei Rahmenstärken, keine gemeinsame Achse",
  },
];

const PROFILE_FIELDS = [
  { label: "Name", value: "Lena Berger" },
  { label: "E-Mail", value: "lena@beispiel.de" },
  { label: "Telefon", value: "030 1234567" },
  { label: "Newsletter", value: "An" },
  { label: "Push", value: "Aus" },
  { label: "Sprache", value: "Deutsch" },
];

const CAROUSEL = [
  { name: "Sneaker", price: "89 €" },
  { name: "Rucksack", price: "64 €" },
  { name: "Regenjacke", price: "129 €" },
  { name: "Mütze", price: "19 €" },
];

const DOCUMENTS = [
  { name: "Angebot Müller GmbH", meta: "vor 2 Std." },
  { name: "Rahmenvertrag 2026", meta: "gestern" },
  { name: "Projektplan Relaunch", meta: "12.11." },
];

const STEPS = ["Konto", "Adresse", "Zahlung", "Fertig"];

/* ── Daten: Weiterdenken ───────────────────────────────────────────────── */

type LadderKind = "space" | "similar" | "line" | "region";

const LADDER: { kind: LadderKind; name: string; cost: string }[] = [
  { kind: "space", name: "Abstand", cost: "Kostet nichts — kein einziges Pixel mehr" },
  { kind: "similar", name: "Ähnlichkeit", cost: "Kostet eine zweite Variante" },
  { kind: "line", name: "Linie", cost: "Kostet eine Kante mehr" },
  { kind: "region", name: "Fläche", cost: "Die lauteste Lösung — vier Kanten und eine Farbe" },
];

const SPACING_LEVELS = [
  { level: "Paar", example: "Label + Feld, Icon + Text, Wert + Einheit", value: "4–6 px", token: "--space-pair" },
  { level: "Element", example: "Felder einer Gruppe, Zeilen einer Liste", value: "12–16 px", token: "--space-item" },
  { level: "Gruppe", example: "Abschnitte einer Karte oder eines Formulars", value: "32–40 px", token: "--space-group" },
  { level: "Bereich", example: "Sektionen einer Seite", value: "64 px und mehr", token: "--space-section" },
];

const A11Y_ROWS = [
  { visual: "Feldgruppe mit Titel", principle: "Nähe, Region", markup: "<fieldset> + <legend>" },
  { visual: "Label und Feld", principle: "Nähe", markup: "<label for> — Hinweise über aria-describedby" },
  { visual: "Gleichartige Einträge", principle: "Ähnlichkeit", markup: "<ul> / <ol> — der Screenreader sagt „Liste, 5 Einträge“" },
  { visual: "Karte mit Überschrift", principle: "Region", markup: "<section aria-labelledby> oder <article>" },
  { visual: "Werkzeuggruppen", principle: "Region", markup: 'role="group" + aria-label' },
  { visual: "Stepper", principle: "Verbundenheit", markup: '<ol> + aria-current="step"' },
  { visual: "Dialog vor abgedunkelter Seite", principle: "Figur und Grund", markup: "<dialog> + showModal()" },
];

const GESTALT_CHECK = [
  { q: "Blinzeln", text: "Wie viele Gruppen siehst du — und sind es die richtigen?" },
  { q: "Abstände", text: "Gibt es mindestens drei Stufen? Ist innen überall kleiner als außen?" },
  { q: "Ähnlichkeit", text: "Sieht jede Rolle überall gleich aus — und jede andere Rolle sichtbar anders?" },
  { q: "Flächen und Linien", text: "Hält die Gruppe auch ohne diese Karte oder Linie? Dann streichen." },
  { q: "Markup", text: "Ist jede sichtbare Gruppe auch eine Gruppe im DOM — und umgekehrt?" },
];

const NEXT = [
  {
    slug: "visual-hierarchy",
    topic: "Rangfolge",
    text: "Gestalt sagt, was zusammengehört. Hierarchie sagt, was davon zuerst zählt — mit Größe, Gewicht, Kontrast, Abstand und Position.",
  },
  {
    slug: "spacing-layout",
    topic: "Abstandssystem",
    text: "Die Stufen aus diesem Modul als vollständige Skala mit Tokens und Raster.",
  },
  {
    slug: "shadows-elevation",
    topic: "Figur in Ebenen",
    text: "Wie Schatten und Flächen mehrere Ebenen ordnen, ohne dass alles gleichzeitig nach vorn drängt.",
  },
  {
    slug: "color-systems",
    topic: "Ähnlichkeit mit Farbe",
    text: "Farbe ist das stärkste Ähnlichkeitssignal — und braucht deshalb ein System.",
  },
];

const SOURCES = [
  "Ehrenfels, C. von (1890): Über „Gestaltqualitäten“. Vierteljahrsschrift für wissenschaftliche Philosophie 14.",
  "Helmholtz, H. von (1867): Handbuch der physiologischen Optik. Leipzig: Voss.",
  "Wertheimer, M. (1912): Experimentelle Studien über das Sehen von Bewegung. Zeitschrift für Psychologie 61.",
  "Rubin, E. (1915): Synsoplevede Figurer. Kopenhagen. Deutsch 1921: Visuell wahrgenommene Figuren.",
  "Wertheimer, M. (1923): Untersuchungen zur Lehre von der Gestalt II. Psychologische Forschung 4.",
  "Restorff, H. von (1933): Über die Wirkung von Bereichsbildungen im Spurenfeld. Psychologische Forschung 18.",
  "Koffka, K. (1935): Principles of Gestalt Psychology. New York: Harcourt, Brace.",
  "Arnheim, R. (1954): Art and Visual Perception. Berkeley: University of California Press.",
  "Kanizsa, G. (1955): Margini quasi-percettivi in campi con stimolazione omogenea. Rivista di Psicologia 49.",
  "Heydt, R. von der, Peterhans, E. & Baumgartner, G. (1984): Illusory contours and cortical neuron responses. Science 224.",
  "Palmer, S. E. (1992): Common region: A new principle of perceptual grouping. Cognitive Psychology 24.",
  "Palmer, S. E. & Rock, I. (1994): Rethinking perceptual organization: The role of uniform connectedness. Psychonomic Bulletin & Review 1.",
  "Steinman, R. M., Pizlo, Z. & Pizlo, F. J. (2000): Phi is not beta. Vision Research 40.",
  "Zhou, H., Friedman, H. S. & Heydt, R. von der (2000): Coding of border ownership in monkey visual cortex. Journal of Neuroscience 20.",
  "Geisler, W. S., Perry, J. S., Super, B. J. & Gallogly, D. P. (2001): Edge co-occurrence in natural images predicts contour grouping performance. Vision Research 41.",
  "Cowan, N. (2001): The magical number 4 in short-term memory. Behavioral and Brain Sciences 24.",
  "Lindgaard, G. u. a. (2006): Attention web designers: You have 50 milliseconds to make a good first impression! Behaviour & Information Technology 25.",
  "Wagemans, J. u. a. (2012): A century of Gestalt psychology in visual perception, Teil I und II. Psychological Bulletin 138.",
  "Johnson, J. (2020): Designing with the Mind in Mind, 3. Auflage. Morgan Kaufmann.",
  "W3C (2023): WCAG 2.2 — 1.3.1 Info and Relationships, 1.3.2 Meaningful Sequence, 1.4.1 Use of Color.",
];

/* ── Code ──────────────────────────────────────────────────────────────── */

const HEADING_CSS = `/* Browser-Standard: h2 { margin-block: 0.83em; }
   Oben und unten gleich viel — die Überschrift schwebt
   zwischen zwei Abschnitten und gehört zu keinem. */

h2 {
  margin-block: 2em 0.5em;  /* weit weg vom Vorigen, nah am Eigenen */
}

/* Oder ohne Margins an der Überschrift: über Gruppen */
.section          { display: flex; flex-direction: column; gap: 8px; }
.section + .section { margin-top: 40px; }`;

const IBAN_JS = `// Anzeige in Vierergruppen (wie in DIN 5008), gespeichert wird ohne Leerzeichen
const groupIban = (value) =>
  value.replace(/\\s+/g, "").toUpperCase().replace(/(.{4})(?=.)/g, "$1 ");

groupIban("de89370400440532013000"); // "DE89 3704 0044 0532 0130 00"

// Beim Absenden wieder entfernen
const rawIban = (value) => value.replace(/\\s+/g, "");`;

const DIALOG_CODE = `<button type="button" id="open">Entwurf verwerfen</button>

<dialog id="confirm" aria-labelledby="confirm-title">
  <h2 id="confirm-title">Entwurf verwerfen?</h2>
  <p>Deine Änderungen gehen verloren.</p>
  <form method="dialog">
    <button value="cancel">Abbrechen</button>
    <button value="discard">Verwerfen</button>
  </form>
</dialog>

<style>
  /* Grund: abgedunkelt — Figur: eigene Fläche, deutlicher Schatten */
  dialog::backdrop { background: rgb(0 0 0 / 0.45); }
  dialog {
    border: 0;
    border-radius: 12px;
    padding: 24px;
    max-width: 360px;
    box-shadow: 0 12px 32px rgb(0 0 0 / 0.25);
  }
</style>

<script>
  const dialog = document.getElementById("confirm");
  document.getElementById("open").addEventListener("click", () => dialog.showModal());
  // showModal() statt show(): Der Rest der Seite wird inert —
  // nicht klickbar, nicht per Tab erreichbar, für Screenreader ausgeblendet.
  // Escape schließt. Figur und Grund gelten damit für alle Sinne.
  dialog.addEventListener("close", () => console.log(dialog.returnValue));
</script>`;

const STEPPER_CODE = `<ol class="steps">
  <li class="done"><span class="dot" aria-hidden="true">✓</span>Konto<span class="sr-only"> (erledigt)</span></li>
  <li aria-current="step"><span class="dot" aria-hidden="true">2</span>Adresse</li>
  <li><span class="dot" aria-hidden="true">3</span>Zahlung</li>
  <li><span class="dot" aria-hidden="true">4</span>Fertig</li>
</ol>

<style>
  .steps {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    font: 14px/1.4 system-ui, sans-serif;
    color: #1d2125;
  }
  .steps li {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;                       /* Nähe: Kreis und Beschriftung gehören zusammen */
  }
  /* Verbundenheit: eine Linie von Kreis zu Kreis */
  .steps li + li::before {
    content: "";
    position: absolute;
    top: 13px;
    left: calc(-50% + 18px);
    right: calc(50% + 18px);
    height: 2px;
    background: #8a939d;            /* 3,1:1 auf Weiß */
  }
  .steps li.done + li::before { background: #1d2125; }   /* erledigte Strecke */
  .dot {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid #8a939d;
    font-weight: 700;
  }
  .done .dot { background: #1d2125; border-color: #1d2125; color: #fff; }
  [aria-current="step"] { font-weight: 600; }
  [aria-current="step"] .dot { border-color: #1d2125; }
  .sr-only {
    position: absolute; width: 1px; height: 1px; overflow: hidden;
    clip-path: inset(50%); white-space: nowrap;
  }
</style>`;

const A11Y_CODE = `<!-- Nähe + Region: Feldgruppe mit Titel -->
<fieldset>
  <legend>Lieferadresse</legend>
  <label for="street">Straße und Hausnummer</label>
  <input id="street" autocomplete="street-address" aria-describedby="street-hint">
  <p id="street-hint">Packstation? Dann „Packstation“ und die Nummer.</p>
</fieldset>

<!-- Ähnlichkeit: Gleichartiges als Liste -->
<ul aria-label="Letzte Rechnungen">
  <li><a href="/rechnungen/0142">Rechnung 0142</a></li>
  <li><a href="/rechnungen/0141">Rechnung 0141</a></li>
</ul>

<!-- Region: Werkzeuggruppen mit Namen.
     role="toolbar" verspricht Pfeiltasten-Navigation (ARIA APG) —
     nur verwenden, wenn du sie auch baust. Sonst reicht role="group". -->
<div role="group" aria-label="Auszeichnung">
  <button type="button" aria-pressed="false">Fett</button>
  <button type="button" aria-pressed="false">Kursiv</button>
</div>

<!-- Region: Karte als benannter Abschnitt -->
<section class="region" aria-labelledby="notify-title">
  <h2 id="notify-title">Benachrichtigungen</h2>
  …
</section>

<style>
  /* Im Kontrastmodus (forced-colors) werden Hintergründe und
     Schatten durch Systemfarben ersetzt — die Fläche verschwindet.
     Ein transparenter Rahmen wird dort sichtbar und hält die Region. */
  .region {
    background: #f1f3f5;
    border: 1px solid transparent;
    border-radius: 12px;
  }
</style>`;

const PROMPT_SNIPPET = `Gruppierung — bitte genau so umsetzen:

Gruppen in dieser Reihenfolge: Lieferadresse · Versand · Übersicht · Aktionen.

Abstände in drei Stufen, keine einheitliche gap-Klasse:
- 6px zwischen Label und Feld
- 16px zwischen Feldern einer Gruppe
- 40px zwischen den Gruppen

Flächen und Linien sparsam:
- Eine Fläche nur für die Übersicht. Keine Karte um einzelne Felder.
- Eine Trennlinie nur über der Gesamtsumme.

Gleiche Rolle, gleiches Aussehen:
- Genau ein gefüllter Button („Jetzt kaufen“). Nebenaktionen als Textlink.
- Alle Gruppentitel im selben Stil, sichtbar anders als die Feld-Labels.

Jede sichtbare Gruppe ist auch im Markup eine:
fieldset + legend für Feldgruppen, section + h2 für die Übersicht.`;

const EXERCISE_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kasse</title>
<style>
  :root {
    --text: #1d2125;
    --text-muted: #5b6470;    /* 6,0:1 auf Weiß */
    --field-border: #8a939d;  /* 3,1:1 — Feldrahmen brauchen 3:1 */
    --line: #d5dae0;
    --surface: #ffffff;
    --page: #f3f5f7;
    --soft: #eef1f4;
  }
  * { box-sizing: border-box; margin: 0; }
  body {
    font-family: system-ui, sans-serif;
    font-size: 15px;
    line-height: 1.5;
    color: var(--text);
    background: var(--page);
    padding: 24px;
  }

  /* ── Überall derselbe Abstand: Hier beginnt die Aufgabe ── */
  .checkout, .group, .field, .row, .options, .summary, .actions {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .checkout {
    max-width: 440px;
    margin: 0 auto;
    padding: 28px;
    background: var(--surface);
    border-radius: 12px;
  }
  h1 { font-size: 24px; line-height: 1.2; }

  /* Gruppentitel und Feld-Labels sehen gleich aus */
  legend, h2, label { font-size: 15px; font-weight: 600; padding: 0; }
  /* legend steht außerhalb des Flex-Layouts und braucht einen eigenen Abstand */
  legend { margin-bottom: 14px; }
  fieldset { border: 0; padding: 0; min-width: 0; }

  input[type="text"] {
    font: inherit;
    color: var(--text);
    padding: 10px 12px;
    border: 1px solid var(--field-border);
    border-radius: 8px;
    width: 100%;
  }
  .row { flex-direction: row; }
  .row .field { flex: 1; }
  .row .zip { flex: 0 0 110px; }

  .option { display: flex; align-items: baseline; gap: 10px; font-weight: 400; }
  .option-meta { color: var(--text-muted); }

  .line { display: flex; justify-content: space-between; }

  /* Haupt- und Nebenaktion sehen gleich aus */
  .btn {
    font: inherit;
    font-weight: 600;
    text-align: center;
    padding: 12px;
    border: 0;
    border-radius: 8px;
    background: var(--text);
    color: #fff;
    text-decoration: none;
    cursor: pointer;
  }
</style>
</head>
<body>
  <form class="checkout">
    <h1>Kasse</h1>

    <fieldset class="group">
      <legend>Lieferadresse</legend>
      <div class="field">
        <label for="name">Vollständiger Name</label>
        <input type="text" id="name" value="Lena Berger" autocomplete="name">
      </div>
      <div class="field">
        <label for="street">Straße und Hausnummer</label>
        <input type="text" id="street" value="Gartenstraße 12" autocomplete="street-address">
      </div>
      <div class="row">
        <div class="field zip">
          <label for="zip">PLZ</label>
          <input type="text" id="zip" value="10115" inputmode="numeric" autocomplete="postal-code">
        </div>
        <div class="field">
          <label for="city">Ort</label>
          <input type="text" id="city" value="Berlin" autocomplete="address-level2">
        </div>
      </div>
    </fieldset>

    <fieldset class="group">
      <legend>Versand</legend>
      <div class="options">
        <label class="option">
          <input type="radio" name="shipping" checked>
          <span class="option-title">Standard</span>
          <span class="option-meta">3–5 Werktage · kostenlos</span>
        </label>
        <label class="option">
          <input type="radio" name="shipping">
          <span class="option-title">Express</span>
          <span class="option-meta">morgen · 6,90 €</span>
        </label>
      </div>
    </fieldset>

    <section class="group summary" aria-labelledby="summary-title">
      <h2 id="summary-title">Übersicht</h2>
      <div class="line"><span>Zwischensumme</span><span>89,00 €</span></div>
      <div class="line"><span>Versand</span><span>0,00 €</span></div>
      <div class="line total"><span>Gesamt</span><span>89,00 €</span></div>
    </section>

    <div class="actions">
      <button type="submit" class="btn btn-primary">Jetzt kaufen</button>
      <a href="#" class="btn btn-secondary">Zurück zum Warenkorb</a>
    </div>
  </form>
</body>
</html>`;

const SOLUTION_RULES = `/* Ans Ende des <style>-Blocks setzen — die Regeln überschreiben die flachen Werte */

:root {
  --space-pair: 6px;    /* Label → Feld */
  --space-item: 16px;   /* Feld → Feld */
  --space-group: 40px;  /* Gruppe → Gruppe */
}

/* 1 · Nähe: drei Stufen statt eines Abstands */
.checkout { gap: var(--space-group); }
.group    { gap: var(--space-item); }
.field    { gap: var(--space-pair); }
.row      { gap: 12px; }
legend    { margin-bottom: var(--space-item); }

/* 2 · Ähnlichkeit: Gruppentitel untereinander gleich, Labels leiser */
legend, h2 { font-size: 17px; font-weight: 700; }
label      { font-size: 14px; font-weight: 500; color: var(--text-muted); }

/* 3 · Andere Rolle, anderes Aussehen */
.btn-secondary {
  align-self: center;
  padding: 4px;
  background: none;
  color: var(--text);
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* 4 · Gemeinsame Region: Optionen als Flächen, die gewählte ist Figur */
.options { gap: 8px; }
.option {
  padding: 14px 16px;
  border: 1px solid var(--line);
  border-radius: 10px;
  font-size: 15px;
  color: var(--text);
  cursor: pointer;
}
.option:has(input:checked) {
  border: 2px solid var(--text);
  padding: 13px 15px;   /* gleicht den dickeren Rahmen aus */
}
.option-title { font-weight: 600; }
.option-meta  { margin-left: auto; }

.summary {
  gap: 8px;
  padding: 16px 20px;
  background: var(--soft);
  border: 1px solid transparent;   /* Bonus: bleibt im Kontrastmodus als Rahmen sichtbar */
  border-radius: 12px;
}

/* 5 · Verbundenheit sparsam: eine Linie, genau an der einen Grenze */
.line.total {
  margin-top: 4px;
  padding-top: 12px;
  border-top: 1px solid var(--line);
  font-weight: 700;
}`;

const TAKEAWAY_CSS = `/* ══ Gestalt-Grundgerüst ════════════════════════════════════════
   Die Werte sind ein Startpunkt. Wichtig ist das Verhältnis:
   Jede Abstandsstufe ist etwa doppelt so groß wie die vorige. */

:root {
  --space-pair: 4px;       /* untrennbar: Label + Feld, Icon + Text, Wert + Einheit */
  --space-item: 12px;      /* Elemente einer Gruppe */
  --space-group: 32px;     /* Gruppen innerhalb einer Ansicht */
  --space-section: 64px;   /* Bereiche einer Seite */

  --text: #1d2125;
  --region-bg: #f1f3f5;
  --divider: #d5dae0;
}

/* ── Nähe ────────────────────────────────────────────────────── */
.stack-pair, .stack-item, .stack-group, .stack-section {
  display: flex;
  flex-direction: column;
}
.stack-pair    { gap: var(--space-pair); }
.stack-item    { gap: var(--space-item); }
.stack-group   { gap: var(--space-group); }
.stack-section { gap: var(--space-section); }

/* Überschriften gehören zum Folgenden, nicht zum Vorigen */
h2, h3 { margin-block: 1.6em 0.4em; }

/* ── Gemeinsame Region: nur, wo Abstand nicht reicht ─────────── */
.region {
  padding: 16px 20px;              /* größer als der Abstand der Kinder untereinander */
  background: var(--region-bg);
  border: 1px solid transparent;   /* wird im Kontrastmodus sichtbar */
  border-radius: 12px;
}

/* ── Ähnlichkeit: eine Rolle, ein Aussehen ───────────────────── */
.action-link {
  font: inherit;
  font-weight: 500;
  color: inherit;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* ── Verbundenheit: Linien nur zwischen Gruppen ──────────────── */
.divided > * + * {
  border-top: 1px solid var(--divider);
  padding-top: var(--space-item);
}

/* ── Gemeinsames Schicksal: die ganze Zeile reagiert ─────────── */
.row-link {
  position: relative;
  transition: background-color 0.15s;
}
.row-link:hover,
.row-link:focus-within { background: var(--region-bg); }
/* Der Link spannt sich über die Zeile: sichtbare Einheit = Klickziel.
   Weitere Buttons in der Zeile brauchen position: relative; z-index: 1 */
.row-link a::after { content: ""; position: absolute; inset: 0; }
.row-link a:focus-visible { outline: none; }
.row-link a:focus-visible::after { outline: 2px solid var(--text); outline-offset: -2px; }

/* ── Figur und Grund: der native Dialog bringt beides mit ────── */
dialog::backdrop { background: rgb(0 0 0 / 0.45); }
dialog {
  border: 0;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 12px 32px rgb(0 0 0 / 0.25);
}`;

const SOLUTION_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kasse</title>
<style>
  :root {
    --text: #1d2125;
    --text-muted: #5b6470;    /* 6,0:1 auf Weiß */
    --field-border: #8a939d;  /* 3,1:1 — Feldrahmen brauchen 3:1 */
    --line: #d5dae0;
    --surface: #ffffff;
    --page: #f3f5f7;
    --soft: #eef1f4;

    /* Nähe: drei Stufen, jede deutlich größer als die vorige */
    --space-pair: 6px;    /* Label → Feld */
    --space-item: 16px;   /* Feld → Feld */
    --space-group: 40px;  /* Gruppe → Gruppe */
  }
  * { box-sizing: border-box; margin: 0; }
  body {
    font-family: system-ui, sans-serif;
    font-size: 15px;
    line-height: 1.5;
    color: var(--text);
    background: var(--page);
    padding: 24px;
  }

  .checkout {
    max-width: 440px;
    margin: 0 auto;
    padding: 28px;
    background: var(--surface);
    border: 1px solid transparent;  /* Kontrastmodus: bleibt als Rahmen sichtbar */
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: var(--space-group);
  }
  h1 { font-size: 24px; line-height: 1.2; }

  fieldset { border: 0; padding: 0; min-width: 0; }
  .group { display: flex; flex-direction: column; gap: var(--space-item); }
  .field { display: flex; flex-direction: column; gap: var(--space-pair); }
  .row   { display: flex; gap: 12px; }
  .row .field { flex: 1; }
  .row .zip   { flex: 0 0 110px; }

  /* Ähnlichkeit: Alle Gruppentitel sehen gleich aus — und anders als Labels */
  legend, h2 { font-size: 17px; font-weight: 700; padding: 0; }
  legend { margin-bottom: var(--space-item); }  /* steht außerhalb des Flex-Layouts */
  label  { font-size: 14px; font-weight: 500; color: var(--text-muted); }

  input[type="text"] {
    font: inherit;
    color: var(--text);
    padding: 10px 12px;
    border: 1px solid var(--field-border);
    border-radius: 8px;
    width: 100%;
  }

  /* Gemeinsame Region: jede Option eine Fläche, die gewählte ist Figur */
  .options { display: flex; flex-direction: column; gap: 8px; }
  .option {
    display: flex;
    align-items: baseline;
    gap: 10px;
    padding: 14px 16px;
    border: 1px solid var(--line);
    border-radius: 10px;
    font-size: 15px;
    font-weight: 400;
    color: var(--text);
    cursor: pointer;
  }
  .option:has(input:checked) {
    border: 2px solid var(--text);
    padding: 13px 15px;   /* gleicht den dickeren Rahmen aus */
  }
  .option-title { font-weight: 600; }
  .option-meta  { margin-left: auto; color: var(--text-muted); }

  .summary {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px 20px;
    background: var(--soft);
    border: 1px solid transparent;
    border-radius: 12px;
  }
  .line { display: flex; justify-content: space-between; }

  /* Verbundenheit sparsam: eine Linie, genau an der einen Grenze */
  .line.total {
    margin-top: 4px;
    padding-top: 12px;
    border-top: 1px solid var(--line);
    font-weight: 700;
  }

  /* Andere Rolle, anderes Aussehen */
  .actions { display: flex; flex-direction: column; gap: var(--space-item); }
  .btn { font: inherit; font-weight: 600; text-align: center; border-radius: 8px; }
  .btn-primary {
    padding: 13px;
    border: 0;
    background: var(--text);
    color: #fff;
    cursor: pointer;
  }
  .btn-secondary {
    align-self: center;
    padding: 4px;
    font-weight: 500;
    color: var(--text);
    text-underline-offset: 3px;
  }
  .btn:focus-visible,
  .option:has(input:focus-visible) {
    outline: 2px solid var(--text);
    outline-offset: 2px;
  }
</style>
</head>
<body>
  <form class="checkout">
    <h1>Kasse</h1>

    <fieldset class="group">
      <legend>Lieferadresse</legend>
      <div class="field">
        <label for="name">Vollständiger Name</label>
        <input type="text" id="name" value="Lena Berger" autocomplete="name">
      </div>
      <div class="field">
        <label for="street">Straße und Hausnummer</label>
        <input type="text" id="street" value="Gartenstraße 12" autocomplete="street-address">
      </div>
      <div class="row">
        <div class="field zip">
          <label for="zip">PLZ</label>
          <input type="text" id="zip" value="10115" inputmode="numeric" autocomplete="postal-code">
        </div>
        <div class="field">
          <label for="city">Ort</label>
          <input type="text" id="city" value="Berlin" autocomplete="address-level2">
        </div>
      </div>
    </fieldset>

    <fieldset class="group">
      <legend>Versand</legend>
      <div class="options">
        <label class="option">
          <input type="radio" name="shipping" checked>
          <span class="option-title">Standard</span>
          <span class="option-meta">3–5 Werktage · kostenlos</span>
        </label>
        <label class="option">
          <input type="radio" name="shipping">
          <span class="option-title">Express</span>
          <span class="option-meta">morgen · 6,90 €</span>
        </label>
      </div>
    </fieldset>

    <section class="summary" aria-labelledby="summary-title">
      <h2 id="summary-title">Übersicht</h2>
      <div class="line"><span>Zwischensumme</span><span>89,00 €</span></div>
      <div class="line"><span>Versand</span><span>0,00 €</span></div>
      <div class="line total"><span>Gesamt</span><span>89,00 €</span></div>
    </section>

    <div class="actions">
      <button type="submit" class="btn btn-primary">Jetzt kaufen</button>
      <a href="/warenkorb" class="btn btn-secondary">Zurück zum Warenkorb</a>
    </div>
  </form>
</body>
</html>`;

/* ── Bausteine ─────────────────────────────────────────────────────────── */

const DOT = "size-3 rounded-full bg-(--text-primary)";
const RING = "size-3 rounded-full border-2 border-(--text-primary)";

/** Kleine Punktfiguren für die fünf Gruppierungsprinzipien — wie in Wertheimers Abbildungen von 1923. */
function GroupingFigure({ kind }: { kind: FigureKind }) {
  if (kind === "proximity") {
    return (
      <div className="flex gap-5">
        {[0, 1, 2].map((group) => (
          <div key={group} className="flex gap-1">
            <span className={DOT} />
            <span className={DOT} />
          </div>
        ))}
      </div>
    );
  }
  if (kind === "similarity") {
    return (
      <div className="flex flex-col gap-2.5">
        {[0, 1, 2].map((row) => (
          <div key={row} className="flex gap-2.5">
            {[0, 1, 2, 3].map((col) => (
              <span key={col} className={row % 2 ? RING : DOT} />
            ))}
          </div>
        ))}
      </div>
    );
  }
  if (kind === "region") {
    return (
      <div className="flex gap-0.5">
        {[0, 1, 2].map((group) => (
          <div key={group} className="flex gap-3.5 p-1.5 rounded-full bg-(--bg-elevated) border border-(--text-ghost)/50">
            <span className={DOT} />
            <span className={DOT} />
          </div>
        ))}
      </div>
    );
  }
  if (kind === "connected") {
    return (
      <div className="flex gap-3.5">
        {[0, 1, 2].map((group) => (
          <div key={group} className="relative flex gap-3.5">
            <span className="absolute left-1.5 right-1.5 top-1/2 -translate-y-1/2 h-0.5 bg-(--text-tertiary)" />
            <span className={`${DOT} relative`} />
            <span className={`${DOT} relative`} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex gap-3.5 items-end">
      {[0, 1, 2, 3, 4, 5].map((index) => {
        const moving = index === 1 || index === 2 || index === 4;
        return (
          <div key={index} className="flex flex-col items-center gap-1">
            <ArrowUp size={12} className={moving ? "text-(--text-primary)" : "invisible"} />
            <span className={`${DOT} ${moving ? "-translate-y-1" : ""}`} />
          </div>
        );
      })}
    </div>
  );
}

function PrincipleCard({ item }: { item: (typeof GROUPING)[number] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-[150px_minmax(0,1fr)] bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 shadow-(--shadow-sm)">
      <div className="h-24 rounded-lg bg-(--bg-base) border border-(--bg-elevated) flex items-center justify-center" aria-hidden="true">
        <GroupingFigure kind={item.id} />
      </div>
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-2">
          <h4 className="text-[15px] font-bold text-(--text-primary) m-0">
            {item.name} <span className="font-medium text-(--text-tertiary)">· {item.english}</span>
          </h4>
          <span className={MICRO}>{item.origin}</span>
        </div>
        <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0 mb-2">{item.what}</p>
        <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0 mb-2">
          <strong className={STRONG}>Die Wette dahinter:</strong> {item.why}
        </p>
        <p className={CAPTION}>Im Alltag: {item.everyday}</p>
      </div>
    </div>
  );
}

function LadderFigure({ kind }: { kind: LadderKind }) {
  return (
    <div className="flex items-center justify-center gap-6 h-16" aria-hidden="true">
      {[0, 1].map((group) => (
        <Fragment key={group}>
          {kind === "line" && group === 1 && <span className="w-px h-10 bg-(--text-ghost) -mx-3" />}
          <div className={`flex gap-1.5 ${kind === "region" ? "p-2 rounded-lg bg-(--bg-elevated) border border-(--text-ghost)/50" : ""}`}>
            {[0, 1, 2].map((dot) => (
              <span key={dot} className={kind === "similar" && group === 1 ? RING : DOT} />
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  );
}

/** Spaltenname vor dem Wert — nur auf schmalen Bildschirmen, wo die Tabellenköpfe fehlen */
function MobileLabel({ children }: { children: string }) {
  return <span className="md:hidden font-semibold text-(--text-tertiary)">{children}: </span>;
}

/* ── Seite ─────────────────────────────────────────────────────────────── */

export default function GestaltPrinciplesModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      <div className={PAGE}>
        {/* ── TITEL ── */}
        <div className="mb-2">
          <Badge variant="module" dot>Modul {MODULE.number}</Badge>
        </div>
        <h1 className={H1}>Gestaltprinzipien: Wie das Auge Ordnung macht</h1>
        <p className={LEAD}>
          Bevor jemand ein Wort auf deiner Oberfläche liest, hat sein Gehirn sie schon sortiert: in Dinge und
          Hintergrund, in Gruppen und Wege. Woher dieses Wissen stammt, warum das Gehirn so arbeitet — und wie du es in
          CSS und Markup übersetzt.
        </p>

        <ModuleMeta duration="90 Min." practiceTime="~25 Min." />

        <BuildsOn modules={"structure-flows"} />
        <LearningGoals
          goals={[
            "Erklären, woher die Gestaltpsychologie stammt, wer sie begründet hat und welche Frage sie beantworten wollte",
            "Verstehen, warum das Gehirn gruppiert: Wahrnehmung als schnelle Wette über die Welt, die sich nicht abschalten lässt",
            "Neun Prinzipien nach drei Fragen ordnen: Was ist vorne? Was gehört zusammen? Welche Form hat das Ganze?",
            "Jedes Prinzip in ein UI-Muster und eine konkrete CSS-Eigenschaft übersetzen",
            "Erkennen, wann Prinzipien gegeneinander arbeiten, und das leiseste Mittel wählen, das eine Gruppe eindeutig macht",
            "Visuelle Gruppen auch im Markup abbilden, damit Screenreader, Tastatur und Kontrastmodus sie verstehen",
            "Gruppierungsfehler in KI-Entwürfen und manipulative Muster erkennen",
          ]}
        />

        <hr className={HR} />

        {/* ── KERNGEDANKE ── */}
        <p className={EYEBROW}>Kerngedanke</p>
        <InsightRow icon={Eye} title="Das Auge liefert Pixel — das Gehirn liefert Dinge">
          Niemand sieht deine Boxen und Margins. Man sieht Gruppen, Figuren und Wege. Diese Ordnung entsteht in
          Bruchteilen einer Sekunde, bevor ein Wort gelesen ist, und sie folgt Regeln, die seit über hundert Jahren
          erforscht werden.
        </InsightRow>
        <InsightRow icon={ListTree} title="Wahrnehmung ist ein Parser — dein Layout ist sein Quelltext">
          Aus Abständen, Flächen und Ähnlichkeiten baut das Gehirn einen Baum: was zusammengehört, was vorne liegt, was
          als Nächstes kommt. Die Gestaltprinzipien sind seine Grammatik. Parst das Auge etwas anderes, als du gemeint
          hast, hilft kein Label.
        </InsightRow>
        <InsightRow icon={Code2} title="Jedes Prinzip hat eine CSS-Eigenschaft">
          gap, margin, background, border, color, transform, transition: Du triffst Gestalt-Entscheidungen den ganzen
          Tag. Dieses Modul gibt dir die Theorie dazu — damit du sie bewusst triffst und begründen kannst.
        </InsightRow>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          {PARTS.map((part, index) => (
            <a
              key={part.id}
              href={`#${part.id}`}
              className="group flex gap-3 bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-4 no-underline hover:border-(--text-ghost) transition-colors duration-150"
            >
              <span className="size-6 rounded-full bg-(--text-primary) text-(--bg-surface) font-mono text-[13px] font-bold flex items-center justify-center shrink-0">
                {index + 1}
              </span>
              <span>
                <span className="block text-[14px] font-bold text-(--text-primary) group-hover:underline underline-offset-2">
                  {part.label}
                </span>
                <span className="block text-[13px] leading-[1.5] text-(--text-tertiary)">{part.text}</span>
              </span>
            </a>
          ))}
        </div>

        <hr className={HR} />

        {/* ══ TEIL 1 — HERKUNFT ══ */}
        <p className={EYEBROW}>Teil 1 — Herkunft</p>
        <h2 id="herkunft" className={`${H2} scroll-mt-16`}>1912: eine Bewegung, die es nicht gibt</h2>
        <p className={P}>
          Die Geschichte beginnt, so wird sie jedenfalls erzählt, im Sommer 1910 in einem Zug. Der Prager Psychologe{" "}
          <strong className={STRONG}>Max Wertheimer</strong> ist auf dem Weg in den Urlaub, als ihn eine Frage nicht
          loslässt: Warum sehen wir Bewegung, wo keine ist? Er steigt in Frankfurt aus, kauft in einem Spielwarenladen
          ein Stroboskop und probiert es im Hotelzimmer aus. Danach untersucht er die Frage am Psychologischen Institut
          in Frankfurt. Seine Versuchspersonen sind zwei junge Kollegen:{" "}
          <strong className={STRONG}>Wolfgang Köhler</strong> und <strong className={STRONG}>Kurt Koffka</strong>.
        </p>
        <p className={P}>
          Das Experiment ist simpel: Zwei Lichter leuchten abwechselnd auf. Stimmt der Takt, sieht man nicht zwei
          Lichter, sondern eines, das hin- und herspringt. 1912 veröffentlicht Wertheimer seine Ergebnisse — das Jahr
          gilt als Geburtsstunde der Gestaltpsychologie. Probier es selbst:
        </p>

        <ApparentMotionDemo />

        <ExplanationBox title="Was du gerade gesehen hast">
          <p>
            Wäre Wahrnehmung die Summe der Sinneseindrücke, müsstest du immer zwei Lichter sehen. Du siehst aber{" "}
            <strong>etwas, das in keinem der beiden Teile steckt</strong>: Bewegung. Das Ganze hat eine Eigenschaft,
            die keinem Teil gehört. Diese Beobachtung ist der Kern der Gestaltpsychologie.
          </p>
          <p>
            Sie ist auch der Grund, warum es Filme, Animationen und flüssiges Scrollen gibt. Ein Bildschirm zeigt nur
            Einzelbilder. Die Bewegung baut dein Gehirn.
          </p>
          <p>
            Genau genommen unterschied Wertheimer mehrere Stufen. Was du hier siehst, ein Punkt, der wandert, heißt heute
            meist Beta-Bewegung. Sein „Phi-Phänomen“ war noch seltsamer: reine Bewegung ohne sichtbares Objekt
            (Steinman, Pizlo &amp; Pizlo, 2000).
          </p>
        </ExplanationBox>

        <h3 className={H3}>Wogegen die Gestaltpsychologie antrat</h3>
        <p className={P}>
          Um 1900 herrschte eine Vorstellung, die vor allem auf die Schule von Wilhelm Wundt in Leipzig zurückging:
          Wahrnehmung setzt sich aus einzelnen Empfindungen zusammen wie ein Molekül aus Atomen. Wer die Bausteine
          kennt, versteht das Ganze. Die Gestaltpsychologen hielten das für falsch. Ihr stärkstes Gegenbeispiel hatte
          der Philosoph <strong className={STRONG}>Christian von Ehrenfels</strong> schon 1890 beschrieben:
        </p>

        <div className="grid gap-4 md:grid-cols-2 mb-4">
          {[
            {
              title: "Jeder Ton anders — dieselbe Melodie",
              text: "Spiel „Alle meine Entchen“ eine Quinte höher. Kein einziger Ton ist mehr derselbe, und trotzdem erkennt jedes Kind die Melodie sofort.",
            },
            {
              title: "Fast alle Töne gleich — eine andere Melodie",
              text: "Ändere einen einzigen Ton in der Mitte. Fast alle Bausteine sind unverändert, und doch klingt es nach einem anderen Lied.",
            },
          ].map((card) => (
            <div key={card.title} className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 shadow-(--shadow-sm)">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="size-8 rounded-lg bg-(--bg-base) border border-(--bg-elevated) flex items-center justify-center text-(--text-secondary) shrink-0">
                  <Music size={16} />
                </span>
                <span className="text-[14px] font-bold text-(--text-primary)">{card.title}</span>
              </div>
              <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">{card.text}</p>
            </div>
          ))}
        </div>

        <p className={P}>
          Die Melodie steckt also nicht in den Tönen, sondern in ihren Beziehungen zueinander. Ehrenfels nannte das eine{" "}
          <strong className={STRONG}>Gestaltqualität</strong>. Wertheimer, Köhler und Koffka machten daraus eine ganze
          Psychologie: Wir nehmen zuerst Ganzheiten wahr, nicht Teile. Koffka hat den Gedanken später in einen Satz
          gefasst, der fast immer falsch zitiert wird:
        </p>

        <figure className="m-0 mb-6 border-l-4 border-(--text-primary) pl-5 py-1">
          <blockquote className="m-0 text-[16px] leading-[1.6] font-medium text-(--text-primary)">
            „Es ist richtiger zu sagen, dass das Ganze etwas anderes ist als die Summe seiner Teile. Denn Summieren ist ein
            sinnloses Verfahren, die Beziehung zwischen Ganzem und Teil dagegen ist sinnvoll.“
          </blockquote>
          <figcaption className="mt-2 text-[13px] leading-[1.6] text-(--text-tertiary)">
            Kurt Koffka, „Principles of Gestalt Psychology“, 1935 — im Original „something else than the sum of its
            parts“. Die bekannte Fassung „mehr als die Summe“ ist genau die, der er widersprochen hat.
          </figcaption>
        </figure>

        <h3 className={H3}>Die drei Gründer</h3>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          {FOUNDERS.map((person) => (
            <div key={person.name} className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 shadow-(--shadow-sm)">
              <div className="text-[15px] font-bold text-(--text-primary)">{person.name}</div>
              <div className="font-mono text-[13px] text-(--text-tertiary) mb-1">{person.life}</div>
              <div className={`${MICRO} mb-3`}>{person.places}</div>
              <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">{person.text}</p>
            </div>
          ))}
        </div>

        <h3 className={H3}>Hundert Jahre in zehn Schritten</h3>
        <div className={`${PANEL} overflow-hidden`}>
          <ol className="list-none m-0 p-0 divide-y divide-(--bg-elevated)">
            {TIMELINE.map((entry) => (
              <li key={`${entry.year}-${entry.who}`} className="grid gap-x-4 gap-y-1 px-5 py-3.5 sm:grid-cols-[100px_minmax(0,1fr)]">
                <span className="font-mono text-[13px] font-bold text-(--text-primary) tabular-nums">{entry.year}</span>
                <span className="text-[13px] leading-[1.6] text-(--text-secondary)">
                  <strong className={STRONG}>
                    {entry.who}
                    {entry.who.endsWith(".") ? "" : "."}
                  </strong>{" "}
                  {entry.what}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <h3 className={H3}>Vom Labor ins Interface</h3>
        <p className={P}>
          Dass Designer heute über Gestalt reden, verdanken sie vor allem <strong className={STRONG}>Rudolf Arnheim</strong>.
          Der Schüler von Wertheimer und Köhler übertrug die Gestaltpsychologie 1954 in „Art and Visual Perception“ auf
          Kunst und Gestaltung, und das Buch wurde zum Standard der Designausbildung. Als in den 1980er-Jahren grafische
          Oberflächen entstanden, wanderten die Prinzipien weiter in die Mensch-Computer-Interaktion. Heute stehen sie in
          fast jedem Design-System, meist als kurze Liste: ohne die Geschichte und ohne die Erklärung, warum sie
          funktionieren. Die folgt jetzt.
        </p>

        <ExplanationBox title="Ein deutsches Wort im Design-Englisch">
          <p>
            „Gestalt“ heißt im Alltag Form oder Figur. Gemeint ist mehr: <strong>ein gegliedertes Ganzes, dessen
            Eigenschaften aus der Anordnung seiner Teile entstehen.</strong> Weil kein englisches Wort das trifft, sagt
            man auch dort „Gestalt principles“ und „law of Prägnanz“ — mit Umlaut.
          </p>
        </ExplanationBox>

        <hr className={HR} />

        {/* ══ TEIL 2 — PSYCHOLOGIE ══ */}
        <p className={EYEBROW}>Teil 2 — Psychologie</p>
        <h2 id="psychologie" className={`${H2} scroll-mt-16`}>Warum das Gehirn gruppiert — und es nicht lassen kann</h2>
        <p className={P}>
          Stell dir vor, du bekommst ein Bild als rohes Bitmap: Millionen Helligkeitswerte, keine Objekte, keine Ebenen,
          kein DOM. Genau das liefert dein Auge. Auf der Netzhaut sitzen rund 120 Millionen Stäbchen und 6 Millionen
          Zapfen, durch den Sehnerv laufen etwa eine Million Fasern. Nirgends steht darin: „Das ist ein Button.“
        </p>
        <p className={P}>
          Das Gehirn muss also selbst entscheiden, welche Lichtpunkte zum selben Ding gehören. Die Psychologie nennt das{" "}
          <strong className={STRONG}>perzeptuelle Organisation</strong>. Die Gestaltprinzipien sind ihre Regeln — oder,
          in der Sprache von Entwicklern: <strong className={STRONG}>der Parser, der aus einem Bitmap einen Baum macht.</strong>
        </p>

        <h3 className={H3}>Zwei Erklärungen, die sich am Ende treffen</h3>
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 shadow-(--shadow-sm)">
            <div className={`${MICRO} mb-2`}>Die Gestaltpsychologen, 1920er</div>
            <div className="text-[15px] font-bold text-(--text-primary) mb-2">Einfachheit</div>
            <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">
              Aus allen möglichen Deutungen gewinnt die einfachste, regelmäßigste. Koffka nannte das das Gesetz der
              Prägnanz: Die Organisation ist immer so „gut“, wie es die Bedingungen erlauben.
            </p>
          </div>
          <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 shadow-(--shadow-sm)">
            <div className={`${MICRO} mb-2`}>Hermann von Helmholtz, 1867</div>
            <div className="text-[15px] font-bold text-(--text-primary) mb-2">Wahrscheinlichkeit</div>
            <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">
              Wahrnehmung ist ein „unbewusster Schluss“: Das Gehirn wählt die Deutung, die nach aller bisherigen
              Erfahrung am wahrscheinlichsten stimmt.
            </p>
          </div>
        </div>
        <p className={P}>
          Lange galten die beiden als Gegensätze. Heute weiß man: Meistens sagen sie dasselbe.{" "}
          <strong className={STRONG}>Wilson Geisler</strong> und Kollegen haben 2001 Tausende Kantenstücke in Naturfotos
          vermessen. Kanten, die glatt ineinander übergehen, gehören dort mit hoher Wahrscheinlichkeit zum selben Objekt
          — und genau solche Kanten verbinden Menschen auch im Experiment. Die Gestaltgesetze sind keine Marotte des
          Gehirns. <strong className={STRONG}>Sie sind die Statistik der Welt, eingebaut in die Wahrnehmung.</strong>
        </p>
        <p className={P}>
          Jedes Gestaltprinzip lässt sich deshalb als <strong className={STRONG}>Wette</strong> lesen, die sich in der
          Natur meistens auszahlt: Was nah beieinander liegt, gehört wahrscheinlich zu einem Ding. Was sich gemeinsam
          bewegt, ist wahrscheinlich verbunden. Was hinter etwas verschwindet, geht wahrscheinlich dahinter weiter. In
          Teil 3 steht bei jedem Prinzip, auf welche Erfahrung es setzt.
        </p>

        <h3 className={H3}>Drei Eigenschaften, die für Interfaces entscheidend sind</h3>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 shadow-(--shadow-sm)">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="size-8 rounded-lg bg-(--bg-base) border border-(--bg-elevated) flex items-center justify-center text-(--text-secondary) shrink-0">
                <Zap size={16} />
              </span>
              <span className="text-[15px] font-bold text-(--text-primary)">Schneller als Lesen</span>
            </div>
            <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">
              Gruppen und Figuren stehen fest, bevor das erste Wort gelesen ist. In einer Studie bewerteten Menschen
              Webseiten nach 50 Millisekunden fast genauso wie nach einer halben Sekunde (Lindgaard u. a., 2006).
            </p>
          </div>
          <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 shadow-(--shadow-sm)">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="size-8 rounded-lg bg-(--bg-base) border border-(--bg-elevated) flex items-center justify-center text-(--text-secondary) shrink-0">
                <Lock size={16} />
              </span>
              <span className="text-[15px] font-bold text-(--text-primary)">Nicht abschaltbar</span>
            </div>
            <div className="flex flex-col gap-3.5 items-center py-2 mb-3" aria-hidden="true">
              {[0, 1, 2].map((row) => (
                <div key={row} className="flex gap-1.5">
                  {[0, 1, 2, 3, 4].map((col) => (
                    <span key={col} className="size-2.5 rounded-full bg-(--text-primary)" />
                  ))}
                </div>
              ))}
            </div>
            <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">
              Versuch, in diesem Muster Spalten zu sehen. Es gelingt kaum. Wahrnehmung ist keine Entscheidung, auch nicht
              für deine Nutzer: Sagt der Abstand „gehört zusammen“, glaubt das Auge ihm, egal was im Label steht.
            </p>
          </div>
          <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 shadow-(--shadow-sm)">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="size-8 rounded-lg bg-(--bg-base) border border-(--bg-elevated) flex items-center justify-center text-(--text-secondary) shrink-0">
                <Brain size={16} />
              </span>
              <span className="text-[15px] font-bold text-(--text-primary)">Entlastet das Gedächtnis</span>
            </div>
            <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">
              Das Arbeitsgedächtnis hält nur etwa vier Einheiten gleichzeitig (Cowan, 2001). Eine Gruppe zählt als eine
              Einheit. Aus zwölf losen Elementen werden drei Gruppen — und die passen hinein.
            </p>
          </div>
        </div>

        <h3 className={H3}>Ausprobieren: dieselben 22 Zeichen</h3>
        <ComparisonPanel
          bad={{
            label: "22 Zeichen am Stück",
            children: (
              <div className={`${STAGE} font-mono text-[17px] tracking-[0.5px] text-(--text-primary) break-all text-center`}>
                DE89370400440532013000
              </div>
            ),
          }}
          good={{
            label: "Sechs Häppchen",
            children: (
              <div className={`${STAGE} font-mono text-[17px] tracking-[0.5px] text-(--text-primary) text-center [word-spacing:0.35em]`}>
                DE89 3704 0044 0532 0130 00
              </div>
            ),
          }}
        />
        <ExplanationBox title="Was den Unterschied macht">
          <p>
            Lies jede Nummer einmal, schau weg und sag sie auf. Links musst du 22 Zeichen halten, rechts sechs Häppchen.
            Die Leerzeichen sind nichts anderes als <strong>Nähe</strong>: Sie verbinden vier Zeichen zu einer Einheit und
            trennen sie von der nächsten. Deshalb schreibt DIN 5008 die IBAN in Vierergruppen, und deshalb gliedert man
            Telefonnummern in Vorwahl und Rufnummer.
          </p>
        </ExplanationBox>

        <RuleBox>
          Nutzer lesen deine Oberfläche nicht, sie parsen sie. Und wie jeder Parser hält sich die Wahrnehmung an ihre
          Grammatik — nicht an deine Absicht.
        </RuleBox>

        <hr className={HR} />

        {/* ══ TEIL 3 — PRINZIPIEN ══ */}
        <p className={EYEBROW}>Teil 3 — Die Prinzipien</p>
        <h2 id="prinzipien" className={`${H2} scroll-mt-16`}>Neun Prinzipien, drei Fragen</h2>
        <p className={P}>
          Die meisten Listen zählen die Gestaltprinzipien einfach auf. Leichter zu merken und anzuwenden sind sie, wenn
          man sie nach der Frage ordnet, die das Gehirn bei jedem Blick beantwortet. Es sind drei, in dieser
          Reihenfolge:
        </p>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          {QUESTIONS.map((item) => (
            <div key={item.n} className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 shadow-(--shadow-sm)">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="size-6 rounded-full bg-(--text-primary) text-(--bg-surface) font-mono text-[13px] font-bold flex items-center justify-center shrink-0">
                  {item.n}
                </span>
                <span className="text-[15px] font-bold text-(--text-primary)">{item.question}</span>
              </div>
              <div className="text-[13px] leading-[1.5] font-semibold text-(--text-primary) mb-2">{item.principles}</div>
              <p className="text-[13px] leading-[1.6] text-(--text-tertiary) m-0">{item.text}</p>
            </div>
          ))}
        </div>

        {/* ── Frage 1 ── */}
        <h3 className={H3}>Frage 1: Was ist vorne? — Figur und Grund</h3>
        <p className={P}>
          Bevor das Gehirn gruppiert, trennt es: Was ist ein Ding, und was ist nur der Hintergrund, vor dem es steht?
          Der dänische Psychologe <strong className={STRONG}>Edgar Rubin</strong> hat das 1915 untersucht. Die{" "}
          <strong className={STRONG}>Figur</strong> wirkt dinghaft, hat eine Form, scheint vorn zu liegen und bleibt im
          Gedächtnis. Der <strong className={STRONG}>Grund</strong> ist formlos und scheint hinter der Figur
          weiterzulaufen.
        </p>

        <FigureGroundDemo />

        <ExplanationBox title="Was dabei im Kopf passiert">
          <p>
            Die gemeinsame Kante gehört immer nur einer Seite. Im Sehzentrum gibt es Nervenzellen, die genau das
            codieren: auf welcher Seite einer Kante das Objekt liegt (Zhou, Friedman &amp; von der Heydt, 2000). Deshalb
            siehst du Vase und Gesichter nie gleichzeitig, nur abwechselnd.
          </p>
          <p>
            Zur Figur wird bevorzugt, was <strong>kleiner, umschlossen, nach außen gewölbt, symmetrisch und
            kontrastreicher</strong> ist — und was anderes überdeckt. Fast jede dieser Eigenschaften steuerst du in CSS:
            mit Größe, Rahmen, Radius, Farbe und Schatten.
          </p>
        </ExplanationBox>

        {/* ── Frage 2 ── */}
        <h3 className={H3}>Frage 2: Was gehört zusammen?</h3>
        <p className={P}>
          Steht fest, was Figur ist, sucht das Gehirn nach Zusammenhängen. Fünf Signale verbinden Elemente zu Gruppen.
          Die Punktmuster bei jedem Prinzip sind dieselbe Art Abbildung, mit der Wertheimer 1923 gearbeitet hat: Nichts
          lenkt ab, nur das eine Prinzip wirkt.
        </p>

        <div className="flex flex-col gap-4 mb-8">
          {GROUPING.map((item) => (
            <PrincipleCard key={item.id} item={item} />
          ))}
        </div>

        <p className={P}>
          Im Alltag wirken diese Signale selten allein. Sie verstärken sich — oder sie widersprechen sich. Dann gewinnt
          das stärkere. <strong className={STRONG}>Stell im Labor zwei Prinzipien gegeneinander</strong> und beobachte,
          welches sich durchsetzt:
        </p>

        <GroupingLab />

        <ExplanationBox title="Was das Labor zeigt">
          <p>
            Die Prinzipien sind keine Regeln, die einzeln gelten, sondern <strong>Kräfte, die gegeneinander
            antreten</strong>. Als Faustregel gilt: Verbundenheit und gemeinsame Region schlagen meist die Nähe, Nähe
            schlägt meist die Ähnlichkeit. Palmer und Rock haben genau das in den 1990ern mit solchen Punktmustern
            gezeigt.
          </p>
          <p>
            Für Interfaces folgt daraus: <strong>Ein Widerspruch zwischen zwei Signalen ist fast immer ein
            Fehler.</strong> Was zusammengehört, sollte nah beieinander stehen, gleich aussehen und notfalls auf
            derselben Fläche liegen — alles in dieselbe Richtung.
          </p>
        </ExplanationBox>

        {/* ── Frage 3 ── */}
        <h3 className={H3}>Frage 3: Welche Form hat das Ganze?</h3>
        <p className={P}>
          Hat das Gehirn Dinge und Gruppen gefunden, ergänzt es, was fehlt, und glättet, was holpert. Drei Prinzipien
          beschreiben das. Der Knopf unter jeder Figur zeigt, was tatsächlich da ist:
        </p>

        <FormLab />

        <TheoryCard label="Woher sie kommen und worauf sie wetten">
          <ConceptList>
            <ConceptItem title="Geschlossenheit · Wertheimer 1923, Kanizsa 1955">
              Die Welt ist voller Verdeckungen, fast nichts siehst du vollständig. Ein Gehirn, das nur sichtbare Teile als
              Ding behandelt, würde in jedem Gebüsch zerfallen. Die Wette: Eine Lücke ist meistens Verdeckung.
              Nervenzellen im Sehzentrum reagieren auf solche Scheinkanten, als wären sie echt (von der Heydt, Peterhans
              &amp; Baumgartner, 1984).
            </ConceptItem>
            <ConceptItem title="Gute Fortsetzung · Wertheimer 1923">
              Wertheimer nannte es den „Faktor der guten Kurve“. Die Wette: Kanten laufen glatt weiter — ein Ast hinter
              einem Blatt kommt auf der anderen Seite wieder heraus. Der Blick folgt solchen Linien, auch gedachten, etwa
              einer gemeinsamen Kante, an der mehrere Elemente ausgerichtet sind.
            </ConceptItem>
            <ConceptItem title="Prägnanz · Wertheimer, Koffka 1935">
              Das Grundgesetz hinter allen anderen: Aus allen Deutungen gewinnt die einfachste und regelmäßigste —
              geschlossen, symmetrisch, glatt. Symmetrische Flächen werden deshalb bevorzugt als Figur gesehen. Die Wette
              zahlt sich meistens aus, aber nicht immer, wie das „Quadrat“ zeigt.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <TheoryCard label="Was in vielen Listen durcheinandergeht">
          <ConceptList>
            <ConceptItem title="„Das Ganze ist mehr als die Summe seiner Teile“">
              Koffka sagte ausdrücklich: etwas anderes. Es geht nicht um ein Mehr, sondern um die Beziehungen zwischen
              den Teilen — wie bei der Melodie.
            </ConceptItem>
            <ConceptItem title="Gemeinsame Region und Verbundenheit sind klassische Gestaltgesetze">
              Sie stammen von Stephen Palmer und Irvin Rock, 1992 und 1994 — fast siebzig Jahre nach Wertheimer. Für
              Interfaces sind sie trotzdem die wichtigsten: Karten, Listen und Stepper beruhen auf ihnen.
            </ConceptItem>
            <ConceptItem title="„Fokuspunkt“ ist ein Gestaltprinzip">
              In Wertheimers Liste steht er nicht. Verwandt ist der Isolationseffekt: Was sich abhebt, bleibt besser im
              Gedächtnis. Entdeckt hat ihn 1933 Hedwig von Restorff — am Berliner Institut der Gestaltpsychologen. Wie
              man ihn einsetzt, ist Thema der visuellen Hierarchie.
            </ConceptItem>
            <ConceptItem title="Gestaltprinzipien sind Designregeln">
              Sie beschreiben, was gesehen wird, nicht, was gut ist. Dieselben Mechanismen machen ein Formular
              verständlich und einen Cookie-Banner manipulativ.
            </ConceptItem>
            <ConceptItem title="Jedes Prinzip gilt immer">
              Es sind Tendenzen, die gegeneinander antreten. Ob Nähe oder Ähnlichkeit gewinnt, hängt davon ab, wie
              deutlich beide ausgeprägt sind. Genau das zeigt das Labor.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <hr className={HR} />

        {/* ══ TEIL 4 — INTERFACE ══ */}
        <p className={EYEBROW}>Teil 4 — Im Interface</p>
        <h2 id="interface" className={`${H2} scroll-mt-16`}>Dein Layout ist Quelltext, das Auge ist der Parser</h2>
        <p className={P}>
          Für das Gehirn ist eine Oberfläche nichts anderes als das Punktmuster aus dem Labor. Labels, Felder und Buttons
          sind die Punkte, <code className={CODE}>gap</code> und <code className={CODE}>margin</code> die Abstände,
          Karten die Regionen. Daraus baut es einen Baum: was zusammengehört, was vorne liegt, was als Nächstes kommt.{" "}
          <strong className={STRONG}>Dein Markup bestimmt diesen Baum nicht — dein Layout tut es.</strong> Gleiches
          HTML, drei Abstände:
        </p>

        <PerceptionParser />

        <ExplanationBox title="Zwei Bäume, die übereinstimmen müssen">
          <p>
            Jede Oberfläche hat zwei Strukturen: den <strong>DOM-Baum</strong>, den Browser und Screenreader lesen, und
            den <strong>Wahrnehmungsbaum</strong>, den das Auge aus Abständen, Flächen und Ähnlichkeiten baut. Eine gute
            Oberfläche sorgt dafür, dass beide mit der Bedeutung übereinstimmen — und miteinander.
          </p>
          <p>
            Viele UI-Fehler wohnen genau dazwischen. Der Code ist korrekt, die Tests sind grün, aber das Auge parst etwas
            anderes. Und umgekehrt: Was nur fürs Auge gruppiert ist, existiert für einen Screenreader nicht. Darum geht
            es in „Weiterdenken“.
          </p>
        </ExplanationBox>

        <h3 className={H3}>Neun Prinzipien, neun Hebel</h3>
        <p className={P}>
          Jedes Prinzip hat typische UI-Muster, eine CSS-Eigenschaft, mit der du es steuerst, und einen Fehler, der dir
          ständig begegnen wird. Die Tabelle ist zum Nachschlagen; die wichtigsten Fälle folgen darunter als Vergleich.
        </p>

        <div className={`${PANEL} overflow-hidden`}>
          <div className="hidden md:grid grid-cols-[minmax(0,3fr)_minmax(0,4fr)_minmax(0,4fr)_minmax(0,4fr)] gap-4 px-5 py-3 border-b border-(--bg-elevated) bg-(--bg-base)">
            <span className={MICRO}>Prinzip</span>
            <span className={MICRO}>Im Interface</span>
            <span className={MICRO}>CSS-Hebel</span>
            <span className={MICRO}>Typischer Fehler</span>
          </div>
          <div className="divide-y divide-(--bg-elevated)">
            {UI_MAP.map((row) => (
              <div
                key={row.principle}
                className="grid gap-x-4 gap-y-1.5 px-5 py-3.5 md:grid-cols-[minmax(0,3fr)_minmax(0,4fr)_minmax(0,4fr)_minmax(0,4fr)]"
              >
                <div className="text-[14px] font-bold text-(--text-primary)">{row.principle}</div>
                <div className="text-[13px] leading-[1.6] text-(--text-secondary)">
                  <MobileLabel>Im Interface</MobileLabel>
                  {row.ui}
                </div>
                <div className="font-mono text-[13px] leading-[1.6] text-(--text-primary)">
                  <MobileLabel>CSS</MobileLabel>
                  {row.css}
                </div>
                <div className="text-[13px] leading-[1.6] text-(--text-tertiary)">
                  <MobileLabel>Fehler</MobileLabel>
                  {row.mistake}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Nähe ── */}
        <h3 className={H3}>Nähe: Überschriften gehören nach unten</h3>
        <p className={P}>
          Der häufigste Nähe-Fehler steckt in den Voreinstellungen des Browsers: Überschriften haben oben und unten gleich
          viel Abstand. Damit schweben sie zwischen zwei Abschnitten und gehören zu keinem. Gleicher Text, nur zwei Werte
          geändert:
        </p>

        <ComparisonPanel
          bad={{
            label: "Gleicher Abstand oben und unten",
            children: (
              <div className={STAGE}>
                <div className="text-[14px] font-bold text-(--text-primary) mb-3">Lieferung</div>
                <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0 mb-3">
                  Wir liefern innerhalb von drei Werktagen, ab 30 € versandkostenfrei.
                </p>
                <div className="text-[14px] font-bold text-(--text-primary) mb-3">Rückgabe</div>
                <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">
                  Du kannst jede Bestellung 30 Tage lang kostenlos zurückschicken.
                </p>
              </div>
            ),
          }}
          good={{
            label: "Weit nach oben, nah nach unten",
            children: (
              <div className={STAGE}>
                <div className="text-[14px] font-bold text-(--text-primary) mb-1">Lieferung</div>
                <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0 mb-6">
                  Wir liefern innerhalb von drei Werktagen, ab 30 € versandkostenfrei.
                </p>
                <div className="text-[14px] font-bold text-(--text-primary) mb-1">Rückgabe</div>
                <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">
                  Du kannst jede Bestellung 30 Tage lang kostenlos zurückschicken.
                </p>
              </div>
            ),
          }}
        />

        <CodeBlock language="CSS — Überschriften an ihren Abschnitt binden" code={HEADING_CSS} />

        <p className={P}>
          Nähe wirkt auch innerhalb von Text, wie die IBAN gezeigt hat. Wenn du Nummern anzeigst, die Menschen abtippen
          oder vergleichen müssen — IBAN, Kartennummer, Bestellnummer —, gruppiere sie bei der Anzeige und entferne die
          Leerzeichen erst beim Speichern:
        </p>

        <CodeBlock language="JavaScript — Nummern für das Auge gruppieren" code={IBAN_JS} />

        <RuleBox>
          Der Abstand innerhalb einer Gruppe muss deutlich kleiner sein als der Abstand zur nächsten — als Faustregel
          mindestens halb so groß. Gleiche Abstände sind keine neutrale Wahl, sondern die Aussage „hier gehört nichts
          enger zusammen als anderes“.
        </RuleBox>

        {/* ── Ähnlichkeit ── */}
        <h3 className={H3}>Ähnlichkeit: gleiche Rolle, gleiches Aussehen</h3>
        <p className={P}>
          Ähnlichkeit ist ein Versprechen. Was gleich aussieht, soll sich gleich verhalten — und was anders aussieht,
          soll etwas anderes tun. Bricht eine Oberfläche dieses Versprechen, muss man jedes Element einzeln ausprobieren.
        </p>

        <ComparisonPanel
          bad={{
            label: "Alles sieht gleich aus",
            children: (
              <div className={STAGE}>
                <div className="text-[14px] font-bold text-(--text-primary) mb-1">Quartalsbericht Q3</div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-(--text-tertiary)">
                  {["Geändert vor 2 Std.", "3 Kommentare", "Umbenennen", "Teilen", "Löschen"].map((text) => (
                    <span key={text}>{text}</span>
                  ))}
                </div>
              </div>
            ),
          }}
          good={{
            label: "Rollen sind erkennbar",
            children: (
              <div className={STAGE}>
                <div className="text-[14px] font-bold text-(--text-primary) mb-0.5">Quartalsbericht Q3</div>
                <div className="text-[13px] text-(--text-tertiary) mb-3">Geändert vor 2 Std. · 3 Kommentare</div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="text-[13px] font-semibold text-(--text-primary) underline underline-offset-2">Umbenennen</span>
                  <span className="text-[13px] font-semibold text-(--text-primary) underline underline-offset-2">Teilen</span>
                  <span className="ml-auto inline-flex items-center gap-1.5 text-[13px] font-semibold text-(--text-primary) border border-(--text-ghost) rounded-md px-2 py-0.5">
                    <Trash2 size={13} />
                    Löschen
                  </span>
                </div>
              </div>
            ),
          }}
        />

        <ExplanationBox>
          <p>
            <strong>Links</strong> stehen Information und Aktionen in einer Zeile und sehen identisch aus. Ob „3
            Kommentare“ klickbar ist und ob „Löschen“ sofort löscht, erfährt man nur durch Ausprobieren.
          </p>
          <p>
            <strong>Rechts</strong> gibt es drei Rollen mit drei Aussehen: Informationen leise, Aktionen unterstrichen und
            kräftig, die eine zerstörerische Aktion abgesetzt — mit eigener Form, eigenem Icon und eigenem Platz. Das ist
            Ähnlichkeit in beide Richtungen, ganz ohne Farbe. Farbe wäre das stärkste Signal, braucht aber ein eigenes
            System: <ModuleRef slug="color-systems" withTitle />.
          </p>
        </ExplanationBox>

        {/* ── Gemeinsame Region ── */}
        <h3 className={H3}>Gemeinsame Region: Karten mit Maß</h3>
        <p className={P}>
          Karten sind das stärkste Gruppierungsmittel im Werkzeugkasten. Gerade deshalb werden sie überall eingesetzt —
          bis jede Angabe ihre eigene Karte hat und keine Gruppe mehr übrig bleibt.
        </p>

        <ComparisonPanel
          bad={{
            label: "Jede Angabe eine Karte",
            children: (
              <div className={`${STAGE} grid grid-cols-2 gap-2`}>
                {PROFILE_FIELDS.map((field) => (
                  <div key={field.label} className="rounded-lg bg-(--bg-surface) border border-(--bg-elevated) shadow-(--shadow-sm) p-2.5 min-w-0">
                    <div className="text-[13px] text-(--text-tertiary)">{field.label}</div>
                    <div className="text-[13px] font-semibold text-(--text-primary) truncate">{field.value}</div>
                  </div>
                ))}
              </div>
            ),
          }}
          good={{
            label: "Eine Karte pro Thema",
            children: (
              <div className={`${STAGE} flex flex-col gap-3`}>
                {[
                  { title: "Kontakt", fields: PROFILE_FIELDS.slice(0, 3) },
                  { title: "Einstellungen", fields: PROFILE_FIELDS.slice(3) },
                ].map((card) => (
                  <div key={card.title} className="rounded-lg bg-(--bg-surface) border border-(--bg-elevated) shadow-(--shadow-sm) px-3.5 py-3">
                    <div className="text-[13px] font-bold text-(--text-primary) mb-2">{card.title}</div>
                    <div className="flex flex-col gap-1">
                      {card.fields.map((field) => (
                        <div key={field.label} className="flex justify-between gap-3">
                          <span className="text-[13px] text-(--text-tertiary)">{field.label}</span>
                          <span className="text-[13px] font-semibold text-(--text-primary) truncate">{field.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ),
          }}
        />

        <ExplanationBox>
          <p>
            <strong>Links</strong> sind sechs Regionen gleich stark. Das Auge sieht sechs gleichrangige Dinge, aber keine
            Themen. Zwölf Kanten und sechs Schatten erzeugen dabei mehr Unruhe als Ordnung.
          </p>
          <p>
            <strong>Rechts</strong> gibt es zwei Regionen, eine pro Thema. Innerhalb der Karten übernimmt die Nähe. Das
            ist die Arbeitsteilung, die fast immer funktioniert: <strong>Regionen für die großen Gruppen, Abstand für die
            kleinen.</strong>
          </p>
        </ExplanationBox>

        {/* ── Figur und Grund ── */}
        <h3 className={H3}>Figur und Grund: Ein Dialog braucht einen Hintergrund</h3>
        <p className={P}>
          Ein Dialog sagt: „Das hier jetzt, der Rest wartet.“ Damit das ohne Lesen ankommt, muss er Figur sein und die
          Seite dahinter Grund — sichtbar zurückgenommen, nicht nur verdeckt.
        </p>

        <ComparisonPanel
          bad={{
            label: "Schwebt über allem",
            children: (
              <div className="relative h-40 rounded-lg overflow-hidden bg-(--bg-base) border border-(--bg-elevated)">
                <div className="p-3 flex flex-col gap-2">
                  {["w-4/5", "w-3/5", "w-11/12", "w-1/2", "w-3/4", "w-2/3"].map((width) => (
                    <span key={width} className={`h-2 rounded bg-(--text-ghost) opacity-50 ${width}`} />
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-xl bg-(--bg-surface) shadow-(--shadow-sm) px-4 py-3 text-center">
                    <div className="text-[13px] font-bold text-(--text-primary) mb-2">Änderungen speichern?</div>
                    <span className="inline-block text-[13px] font-semibold px-3 py-1 rounded-md bg-(--text-primary) text-(--bg-surface)">
                      Speichern
                    </span>
                  </div>
                </div>
              </div>
            ),
          }}
          good={{
            label: "Figur vor Grund",
            children: (
              <div className="relative h-40 rounded-lg overflow-hidden bg-(--bg-base) border border-(--bg-elevated)">
                <div className="p-3 flex flex-col gap-2">
                  {["w-4/5", "w-3/5", "w-11/12", "w-1/2", "w-3/4", "w-2/3"].map((width) => (
                    <span key={width} className={`h-2 rounded bg-(--text-ghost) opacity-50 ${width}`} />
                  ))}
                </div>
                <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                  <div className="rounded-xl bg-(--bg-surface) shadow-(--shadow-md) px-4 py-3 text-center">
                    <div className="text-[13px] font-bold text-(--text-primary) mb-2">Änderungen speichern?</div>
                    <span className="inline-block text-[13px] font-semibold px-3 py-1 rounded-md bg-(--text-primary) text-(--bg-surface)">
                      Speichern
                    </span>
                  </div>
                </div>
              </div>
            ),
          }}
        />

        <p className={P}>
          Für Entwickler gibt es dazu eine Abkürzung: das native <code className={CODE}>&lt;dialog&gt;</code>-Element. Mit{" "}
          <code className={CODE}>showModal()</code> bekommst du die abgedunkelte Fläche über{" "}
          <code className={CODE}>::backdrop</code> — und die Seite dahinter wird <strong className={STRONG}>inert</strong>:
          nicht klickbar, nicht per Tab erreichbar, für Screenreader ausgeblendet. Figur und Grund gelten damit nicht nur
          fürs Auge, sondern für alle Sinne.
        </p>

        <CodeBlock language="HTML + CSS + JS — Dialog mit Figur und Grund" code={DIALOG_CODE} />

        {/* ── Verbundenheit ── */}
        <h3 className={H3}>Verbundenheit und Fortsetzung: Aus Schritten wird ein Weg</h3>
        <p className={P}>
          Ein Stepper zeigt eine Reihenfolge und einen Stand. Isolierte Etiketten können beides nur über Text. Eine Linie
          verbindet die Schritte zu einem Pfad, den das Auge entlangläuft, und die gefüllte Strecke zeigt, wie weit man
          ist.
        </p>

        <ComparisonPanel
          bad={{
            label: "Vier lose Etiketten",
            children: (
              <div className={`${STAGE} flex flex-col gap-3`}>
                <div className="text-[13px] text-(--text-secondary)">Schritt 2 von 4</div>
                <div className="flex flex-wrap gap-1.5">
                  {STEPS.map((step, index) => (
                    <span
                      key={step}
                      className={`text-[13px] px-2.5 py-1 rounded-md bg-(--bg-elevated) ${
                        index === 1 ? "font-semibold text-(--text-primary)" : "text-(--text-tertiary)"
                      }`}
                    >
                      {index + 1}. {step}
                    </span>
                  ))}
                </div>
              </div>
            ),
          }}
          good={{
            label: "Ein verbundener Weg",
            children: (
              <div className={STAGE}>
                <ol className="list-none m-0 p-0 flex">
                  {STEPS.map((step, index) => (
                    <li
                      key={step}
                      className={`relative flex-1 flex flex-col items-center gap-1.5 ${
                        index > 0
                          ? `before:absolute before:top-3.25 before:h-0.5 before:left-[calc(-50%+18px)] before:right-[calc(50%+18px)] ${
                              index === 1 ? "before:bg-(--text-primary)" : "before:bg-(--text-ghost)"
                            }`
                          : ""
                      }`}
                    >
                      <span
                        className={`size-7 rounded-full flex items-center justify-center text-[13px] font-bold ${
                          index === 0
                            ? "bg-(--text-primary) text-(--bg-surface)"
                            : index === 1
                              ? "border-2 border-(--text-primary) text-(--text-primary) bg-(--bg-surface)"
                              : "border-2 border-(--text-ghost) text-(--text-tertiary) bg-(--bg-surface)"
                        }`}
                      >
                        {index === 0 ? "✓" : index + 1}
                      </span>
                      <span className={`text-[13px] ${index === 1 ? "font-semibold text-(--text-primary)" : "text-(--text-tertiary)"}`}>
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ),
          }}
        />

        <ExplanationBox>
          <p>
            Rechts arbeiten drei Prinzipien zusammen: <strong>Verbundenheit</strong> (die Linie macht aus vier Kreisen
            einen Gegenstand), <strong>gute Fortsetzung</strong> (das Auge folgt der Linie von links nach rechts) und{" "}
            <strong>Nähe</strong> (jede Beschriftung steht dicht unter ihrem Kreis). Im Markup ist der Stepper eine
            geordnete Liste — die Reihenfolge existiert damit auch für Screenreader.
          </p>
        </ExplanationBox>

        <CodeBlock language="HTML + CSS — Stepper als Liste mit Verbindungslinie" code={STEPPER_CODE} />

        {/* ── Geschlossenheit ── */}
        <h3 className={H3}>Geschlossenheit: Ein Karussell muss zeigen, dass es weitergeht</h3>
        <p className={P}>
          Ein horizontal scrollbarer Bereich hat ein Problem: Man sieht nicht, dass er scrollbar ist. Die Lösung ist eine
          angeschnittene Karte. Das Gehirn ergänzt sie zur ganzen Karte und schließt daraus: Da kommt noch mehr.
        </p>

        <ComparisonPanel
          bad={{
            label: "Geht genau auf",
            children: (
              <div className={`${STAGE} overflow-hidden`}>
                <div className="text-[13px] font-semibold text-(--text-primary) mb-2">Für dich empfohlen</div>
                <div className="grid grid-cols-3 gap-2">
                  {CAROUSEL.slice(0, 3).map((item) => (
                    <div key={item.name} className="rounded-md bg-(--bg-surface) border border-(--bg-elevated) p-2 min-w-0">
                      <div className="h-12 rounded bg-(--bg-elevated) mb-1.5" />
                      <div className="text-[13px] font-semibold text-(--text-primary) truncate">{item.name}</div>
                      <div className="text-[13px] text-(--text-tertiary)">{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            ),
          }}
          good={{
            label: "Angeschnitten",
            children: (
              <div className={`${STAGE} overflow-hidden`}>
                <div className="text-[13px] font-semibold text-(--text-primary) mb-2">Für dich empfohlen</div>
                <div className="flex gap-2 -mr-4">
                  {CAROUSEL.map((item) => (
                    <div key={item.name} className="w-[38%] shrink-0 rounded-md bg-(--bg-surface) border border-(--bg-elevated) p-2 min-w-0">
                      <div className="h-12 rounded bg-(--bg-elevated) mb-1.5" />
                      <div className="text-[13px] font-semibold text-(--text-primary) truncate">{item.name}</div>
                      <div className="text-[13px] text-(--text-tertiary)">{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            ),
          }}
        />

        <ExplanationBox>
          <p>
            Wähle die Kartenbreite so, dass sie <strong>nicht aufgeht</strong> — etwa{" "}
            <code className={CODE}>grid-auto-columns: 40%</code> oder <code className={CODE}>flex: 0 0 40%</code> mit{" "}
            <code className={CODE}>overflow-x: auto</code>. Zweieinhalb sichtbare Karten sagen „wisch weiter“ deutlicher
            als jeder Pfeil. Mit <code className={CODE}>scroll-snap-type: x mandatory</code> rastet die Reihe danach sauber
            ein.
          </p>
        </ExplanationBox>

        {/* ── Gemeinsames Schicksal ── */}
        <h3 className={H3}>Gemeinsames Schicksal: Was zusammen reagiert, gehört zusammen</h3>
        <p className={P}>
          Im Interface bedeutet „gemeinsames Schicksal“ meistens: gemeinsamer Zustand. Elemente, die sich gleichzeitig
          verändern, werden als Einheit gelesen. <strong className={STRONG}>Fahr mit der Maus über die Zeilen</strong>{" "}
          oder geh mit der Tab-Taste hindurch:
        </p>

        <ComparisonPanel
          bad={{
            label: "Nur der Text reagiert",
            children: (
              <div className="rounded-lg bg-(--bg-base) border border-(--bg-elevated) overflow-hidden divide-y divide-(--bg-elevated)">
                {DOCUMENTS.map((doc) => (
                  <div key={doc.name} className="flex items-center gap-3 px-3.5 py-2.5">
                    <a
                      href="#interface"
                      onClick={(event) => event.preventDefault()}
                      className="text-[13px] font-semibold text-(--text-primary) no-underline hover:underline underline-offset-2"
                    >
                      {doc.name}
                    </a>
                    <span className="ml-auto text-[13px] text-(--text-tertiary)">{doc.meta}</span>
                    <ChevronRight size={14} className="text-(--text-ghost) shrink-0" />
                  </div>
                ))}
              </div>
            ),
          }}
          good={{
            label: "Die ganze Zeile reagiert",
            children: (
              <div className="rounded-lg bg-(--bg-base) border border-(--bg-elevated) overflow-hidden divide-y divide-(--bg-elevated)">
                {DOCUMENTS.map((doc) => (
                  <div
                    key={doc.name}
                    className="group relative flex items-center gap-3 px-3.5 py-2.5 transition-colors duration-150 hover:bg-(--bg-elevated) focus-within:bg-(--bg-elevated)"
                  >
                    <a
                      href="#interface"
                      onClick={(event) => event.preventDefault()}
                      className="text-[13px] font-semibold text-(--text-primary) no-underline after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-(--text-primary) focus-visible:after:-outline-offset-2"
                    >
                      {doc.name}
                    </a>
                    <span className="ml-auto text-[13px] text-(--text-tertiary)">{doc.meta}</span>
                    <ChevronRight
                      size={14}
                      className="text-(--text-tertiary) shrink-0 transition-transform duration-150 group-hover:translate-x-1 group-focus-within:translate-x-1"
                    />
                  </div>
                ))}
              </div>
            ),
          }}
        />

        <ExplanationBox>
          <p>
            <strong>Links</strong> reagiert nur der Name. Datum und Pfeil sehen aus, als gehörten sie dazu, verhalten sich
            aber anders — und sind nicht klickbar, obwohl die Zeile als Einheit wirkt.
          </p>
          <p>
            <strong>Rechts</strong> verändern sich Fläche und Pfeil gemeinsam, und die ganze Zeile ist das Klickziel. Der
            Trick dafür heißt „Stretched Link“: Ein <code className={CODE}>::after</code> mit{" "}
            <code className={CODE}>inset: 0</code> spannt den Link über die Zeile. Mit{" "}
            <code className={CODE}>:focus-within</code> reagiert die Zeile auch auf die Tastatur. Und weil es auf
            Touch-Geräten kein Hover gibt, muss die Zeile auch ohne Reaktion als Einheit erkennbar sein — über Nähe und
            Ausrichtung.
          </p>
        </ExplanationBox>

        {/* ── Erfahrung ── */}
        <h3 className={H3}>Der zehnte Faktor: Erfahrung</h3>
        <p className={P}>
          Wertheimer nannte 1923 noch einen Faktor, den die Gestaltpsychologen eher kleinredeten:{" "}
          <strong className={STRONG}>Erfahrung</strong>. Was wir kennen, sehen wir schneller als Einheit — Buchstaben,
          Ziffern, vertraute Zeichen. Im Interface ist dieser Faktor riesig. Ein unterstrichenes Wort im Fließtext ist ein
          Link, ein × oben rechts schließt, drei Punkte heißen „mehr“. Diese Konventionen sind gelernte Gestalt. Jakob
          Nielsen hat das auf einen Satz gebracht: Menschen verbringen die meiste Zeit auf anderen Websites — und
          erwarten, dass deine genauso funktioniert. Wer Konventionen bricht, zwingt sie, eine Oberfläche zu lesen, die
          sie sonst einfach gesehen hätten.
        </p>

        <hr className={HR} />

        {/* ── QUIZ ── */}
        <p className={EYEBROW}>Prüf dich</p>
        <h2 className={H2}>Welches Prinzip wirkt hier?</h2>
        <p className={P}>
          Acht Ausschnitte aus Oberflächen, wie du sie täglich baust. In jedem wirken mehrere Prinzipien, aber eines trägt
          die Bedeutung: Ohne es würde die Gruppe zerfallen. Welches?
        </p>

        <PrincipleQuiz />

        <hr className={HR} />

        {/* ══ TEIL 5 — WEITERDENKEN ══ */}
        <p className={EYEBROW}>Weiterdenken 1 von 5</p>
        <h2 id="weiterdenken" className={`${H2} scroll-mt-16`}>Von leise nach laut: das richtige Mittel wählen</h2>
        <p className={P}>
          Fast jede Gruppe lässt sich auf vier Arten herstellen. Sie unterscheiden sich darin, was sie kosten — nicht an
          Code, sondern an Aufmerksamkeit. Jede Linie und jede Fläche ist eine zusätzliche Kante, die das Auge
          verarbeiten muss, auf jedem Screen und bei jedem Blick.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {LADDER.map((step, index) => (
            <div key={step.kind} className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-4 shadow-(--shadow-sm)">
              <div className="rounded-lg bg-(--bg-base) border border-(--bg-elevated) mb-3">
                <LadderFigure kind={step.kind} />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[13px] font-bold text-(--text-ghost)">{index + 1}</span>
                <span className="text-[14px] font-bold text-(--text-primary)">{step.name}</span>
              </div>
              <p className="text-[13px] leading-[1.5] text-(--text-tertiary) m-0">{step.cost}</p>
            </div>
          ))}
        </div>

        <RuleBox>
          Nimm das leiseste Mittel, das die Gruppe eindeutig macht: erst Abstand, dann Ähnlichkeit, dann Linie, dann
          Fläche. Wer mit Karten anfängt, hat keine Steigerung mehr übrig, wenn er eine braucht.
        </RuleBox>

        <h3 className={H3}>Wenn Prinzipien gegeneinander arbeiten</h3>
        <p className={P}>
          Im Labor hast du gesehen, dass stärkere Signale schwächere überstimmen. In echten Oberflächen passiert das
          unbemerkt — meistens, weil zwei Entscheidungen von verschiedenen Stellen im Code kommen. Vier Konflikte, die dir
          ständig begegnen werden:
        </p>

        <TheoryCard>
          <ConceptList>
            <ConceptItem title="Eine Linie trennt, was der Abstand verbindet">
              Eine Trennlinie direkt unter der Überschrift schneidet sie von ihrem Inhalt ab. Linien gehören zwischen
              Gruppen, nicht in sie hinein.
            </ConceptItem>
            <ConceptItem title="Ein Rahmen zerschneidet eine Gruppe">
              Steht das Label über der Karte und der Wert darin, gewinnt die Karte. Der Wert wirkt wie ein Fremdkörper, das
              Label wie die Überschrift von etwas anderem.
            </ConceptItem>
            <ConceptItem title="Gleiche Farbe verbindet Fremdes">
              Ein rotes „Neu“-Badge und ein roter Löschen-Button wirken verwandt. Wer Farbe für Bedeutung nutzt, darf sie
              nicht gleichzeitig als Dekoration verwenden.
            </ConceptItem>
            <ConceptItem title="Bewegung reißt Gruppen auseinander">
              Klappt in einer Liste nur der Titel auf und der zugehörige Text springt hinterher, zerfällt die Einheit für
              einen Moment. Was zusammengehört, bewegt sich zusammen — mit derselben Dauer und derselben Kurve.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <hr className={HR} />

        <p className={EYEBROW}>Weiterdenken 2 von 5</p>
        <h2 className={H2}>Innen kleiner als außen: Abstände als System</h2>
        <p className={P}>
          Nähe funktioniert über Verhältnisse, nicht über feste Werte. 16 px können trennen oder verbinden — je nachdem,
          was daneben steht. Damit das in einer ganzen Anwendung funktioniert, braucht es wenige Stufen, die sich deutlich
          unterscheiden. Eine bewährte Faustregel:{" "}
          <strong className={STRONG}>Jede Stufe ist etwa doppelt so groß wie die darunter.</strong>
        </p>

        <div className={`${PANEL} overflow-hidden`}>
          <div className="hidden md:grid grid-cols-[minmax(0,2fr)_minmax(0,5fr)_minmax(0,2fr)_minmax(0,3fr)] gap-4 px-5 py-3 border-b border-(--bg-elevated) bg-(--bg-base)">
            <span className={MICRO}>Ebene</span>
            <span className={MICRO}>Beispiel</span>
            <span className={MICRO}>Abstand</span>
            <span className={MICRO}>Token</span>
          </div>
          <div className="divide-y divide-(--bg-elevated)">
            {SPACING_LEVELS.map((row) => (
              <div
                key={row.level}
                className="grid gap-x-4 gap-y-1 px-5 py-3.5 md:grid-cols-[minmax(0,2fr)_minmax(0,5fr)_minmax(0,2fr)_minmax(0,3fr)] md:items-baseline"
              >
                <div className="text-[14px] font-bold text-(--text-primary)">{row.level}</div>
                <div className="text-[13px] leading-[1.6] text-(--text-secondary)">{row.example}</div>
                <div className="font-mono text-[13px] font-semibold text-(--text-primary) tabular-nums">{row.value}</div>
                <div className="font-mono text-[13px] text-(--text-tertiary)">{row.token}</div>
              </div>
            ))}
          </div>
        </div>

        <p className={P}>
          Daraus folgt die wichtigste Regel für Verschachtelung: <strong className={STRONG}>Innen kleiner als
          außen.</strong> Der Abstand innerhalb einer Gruppe ist kleiner als der Abstand um sie herum. Für Karten heißt
          das: Abstand der Kinder untereinander &lt; Innenabstand der Karte ≤ Abstand zwischen den Karten. Ist das Padding
          kleiner als der Abstand der Kinder, kleben sie am Rand statt aneinander. Ist der Abstand zwischen den Karten
          kleiner als ihr Padding, verschwimmen die Karten zu einer Fläche.
        </p>

        <RuleBox>
          Lege die Stufen einmal als Tokens fest und verwende nichts dazwischen. Ein Abstand, der in keine Stufe passt, ist
          fast immer eine Gruppe, über die niemand entschieden hat.
        </RuleBox>

        <p className={P}>
          Wie daraus eine vollständige Abstandsskala mit Raster wird, zeigt <ModuleRef slug="spacing-layout" withTitle />.
        </p>

        <hr className={HR} />

        <p className={EYEBROW}>Weiterdenken 3 von 5</p>
        <h2 className={H2}>Gestalt muss man auch hören können</h2>
        <p className={P}>
          Ein Screenreader sieht keine Abstände und keine Karten. Er liest den DOM-Baum. Was nur visuell gruppiert ist,
          existiert für ihn nicht — das Formular aus dem Parser oben ist für ihn in allen drei Varianten gleich flach. Die
          WCAG 2.2 sagen das in Kriterium <strong className={STRONG}>1.3.1 „Info and Relationships“</strong> ausdrücklich:
          Struktur und Beziehungen, die visuell vermittelt werden, müssen auch im Code erkennbar sein.{" "}
          <strong className={STRONG}>1.3.1 ist Gestalt im Markup.</strong>
        </p>

        <div className={`${PANEL} overflow-hidden`}>
          <div className="hidden md:grid grid-cols-[minmax(0,4fr)_minmax(0,3fr)_minmax(0,6fr)] gap-4 px-5 py-3 border-b border-(--bg-elevated) bg-(--bg-base)">
            <span className={MICRO}>Das Auge sieht</span>
            <span className={MICRO}>Prinzip</span>
            <span className={MICRO}>Im Markup</span>
          </div>
          <div className="divide-y divide-(--bg-elevated)">
            {A11Y_ROWS.map((row) => (
              <div key={row.visual} className="grid gap-x-4 gap-y-1 px-5 py-3.5 md:grid-cols-[minmax(0,4fr)_minmax(0,3fr)_minmax(0,6fr)] md:items-baseline">
                <div className="text-[14px] font-semibold text-(--text-primary)">{row.visual}</div>
                <div className="text-[13px] text-(--text-tertiary)">{row.principle}</div>
                <div className="font-mono text-[13px] leading-[1.6] text-(--text-secondary)">{row.markup}</div>
              </div>
            ))}
          </div>
        </div>

        <h3 className={H3}>Drei Fallen, die nur Entwickler stellen können</h3>
        <TheoryCard>
          <ConceptList>
            <ConceptItem title="Umsortieren mit CSS">
              <code>order</code>, <code>flex-direction: row-reverse</code> oder <code>grid-area</code> ändern die sichtbare
              Reihenfolge, nicht die im DOM. Tastatur und Screenreader folgen dem DOM. Fürs Auge stehen Label und Feld
              zusammen, für die Tab-Taste nicht (WCAG 1.3.2 und 2.4.3).
            </ConceptItem>
            <ConceptItem title="Regionen nur aus Hintergrundfarbe">
              Im Kontrastmodus von Windows (<code>forced-colors</code>) werden Hintergründe und Schatten durch Systemfarben
              ersetzt. Eine Karte, die nur über ihre Fläche erkennbar ist, verschwindet. Ein{" "}
              <code>border: 1px solid transparent</code> ist unsichtbar — bis der Kontrastmodus ihn einfärbt.
            </ConceptItem>
            <ConceptItem title="Ähnlichkeit nur über Farbe">
              Wer Gruppen nur farbig unterscheidet, gruppiert für einen Teil der Nutzer gar nicht: Etwa jeder zwölfte Mann
              hat eine Farbsehschwäche. Immer ein zweites Merkmal dazu — Form, Icon oder Text (WCAG 1.4.1). Mehr dazu in{" "}
              <ModuleRef slug="color-contrast" />.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <CodeBlock language="HTML + CSS — visuelle Gruppen im Markup" code={A11Y_CODE} />

        <RuleBox>
          Jede sichtbare Gruppe ist auch eine Gruppe im Markup — und jede Gruppe im Markup ist auch sichtbar. Prüfe beides:
          einmal mit den Augen, einmal nur mit der Tab-Taste.
        </RuleBox>

        <hr className={HR} />

        <p className={EYEBROW}>Weiterdenken 4 von 5</p>
        <h2 className={H2}>Dieselben Mittel, andere Absicht</h2>
        <p className={P}>
          Gestaltprinzipien beschreiben, was Menschen sehen — nicht, ob es gut für sie ist. Dieselben Mittel, die ein
          Formular verständlich machen, lassen sich gegen die Nutzer wenden. Das bekannteste Beispiel ist der
          Cookie-Banner:
        </p>

        <ComparisonPanel
          bad={{
            label: "Manipulativ",
            children: (
              <div className={STAGE}>
                <div className="text-[14px] font-bold text-(--text-primary) mb-1">Wir respektieren deine Privatsphäre</div>
                <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0 mb-3">
                  Wir nutzen Cookies, um dein Erlebnis zu verbessern.
                </p>
                <div className="rounded-lg bg-(--text-primary) text-(--bg-surface) text-[14px] font-semibold text-center py-2.5 mb-2">
                  Alle akzeptieren
                </div>
                <div className="text-[13px] text-(--text-ghost) text-center">Einstellungen</div>
              </div>
            ),
          }}
          good={{
            label: "Fair",
            children: (
              <div className={STAGE}>
                <div className="text-[14px] font-bold text-(--text-primary) mb-1">Cookies auf dieser Seite</div>
                <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0 mb-3">
                  Notwendige Cookies sind immer aktiv. Statistik und Werbung nur mit deiner Zustimmung.
                </p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {["Alle ablehnen", "Alle akzeptieren"].map((label) => (
                    <div
                      key={label}
                      className="rounded-lg border-2 border-(--text-primary) text-(--text-primary) text-[13px] font-semibold text-center py-2"
                    >
                      {label}
                    </div>
                  ))}
                </div>
                <div className="text-[13px] text-(--text-secondary) text-center underline underline-offset-2">Auswahl anpassen</div>
              </div>
            ),
          }}
        />

        <ExplanationBox>
          <p>
            <strong>Links</strong> ist „Alle akzeptieren“ die einzige Figur: gefüllt, groß, kontrastreich.
            „Einstellungen“ ist so blass gesetzt, dass es zum Grund gehört und wie Kleingedrucktes wirkt. Eine
            Ablehnen-Option gibt es auf der ersten Ebene gar nicht.
          </p>
          <p>
            <strong>Rechts</strong> sind beide Entscheidungen gleich gewichtet: gleiche Form, gleiche Größe, gleicher
            Kontrast. Dasselbe Muster findest du an anderen Stellen — Anzeigen, die aussehen wie Suchergebnisse
            (Ähnlichkeit), oder ein vorangekreuztes Häkchen, das in derselben Region steht wie die Pflichtangaben.
          </p>
        </ExplanationBox>

        <ReferenceBox title="Rechtlicher Rahmen">
          <p>
            Der <strong>Digital Services Act</strong> der EU (Art. 25, gilt seit Februar 2024) verbietet Online-Plattformen,
            ihre Oberfläche so zu gestalten, dass Nutzer getäuscht oder manipuliert werden. Die europäischen
            Datenschutzbehörden haben 2023 in ihrem Bericht zu Cookie-Bannern ausdrücklich irreführende Button-Farben und
            -Kontraste bemängelt. Wie du Figur und Grund verteilst, ist also nicht nur eine Frage des Geschmacks.
          </p>
        </ReferenceBox>

        <hr className={HR} />

        <p className={EYEBROW}>Weiterdenken 5 von 5</p>
        <h2 className={H2}>KI-Entwürfe auf Gestalt prüfen</h2>
        <p className={P}>
          Ein Coding-Assistent liefert in Sekunden eine Oberfläche, die auf den ersten Blick ordentlich aussieht. Auf den
          zweiten fehlt fast immer dasselbe: eine Entscheidung darüber, was zusammengehört. Ohne Vorgabe setzt ein Modell
          das Wahrscheinlichste ein — einen einheitlichen Abstand und eine Karte um alles.
        </p>

        <TheoryCard label="Fünf Gruppierungsfehler, die generierte Oberflächen oft haben">
          <ConceptList>
            <ConceptItem title="Ein Abstand für alles">
              <code>gap-4</code> oder <code>space-y-4</code> auf jeder Ebene. Nähe sagt dann nichts mehr — wie in der
              Variante „Gleichmäßig“ im Parser.
            </ConceptItem>
            <ConceptItem title="Karten-Suppe">
              Jeder Wert in einer eigenen Karte mit Rahmen und Schatten. Viele Regionen, keine Themen.
            </ConceptItem>
            <ConceptItem title="Farbe als Dekoration">
              Badges in fünf Farben für zwei Bedeutungen. Das Auge sucht eine Ordnung, die es nicht gibt.
            </ConceptItem>
            <ConceptItem title="Linien aus Reflex">
              Trennlinien zwischen allen Zeilen, auch innerhalb einer Gruppe — und damit gegen die Nähe.
            </ConceptItem>
            <ConceptItem title="Gruppiert fürs Auge, flach im Markup">
              <code>div</code> an <code>div</code>, kein <code>fieldset</code>, keine Liste. Für Screenreader gibt es keine
              Gruppen.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <h3 className={H3}>Der Gestalt-Check in einer Minute</h3>
        <p className={P}>Fünf Fragen an jeden Screen — generiert oder selbst gebaut:</p>
        <div className={`${PANEL} overflow-hidden`}>
          <ol className="list-none m-0 p-0 divide-y divide-(--bg-elevated)">
            {GESTALT_CHECK.map((item, index) => (
              <li key={item.q} className="grid gap-x-4 gap-y-0.5 px-5 py-3.5 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-baseline">
                <span className="text-[14px] font-bold text-(--text-primary)">
                  <span className="font-mono text-[13px] text-(--text-ghost) mr-2">{index + 1}</span>
                  {item.q}
                </span>
                <span className="text-[13px] leading-[1.6] text-(--text-secondary)">{item.text}</span>
              </li>
            ))}
          </ol>
        </div>

        <h3 className={H3}>Gruppierung vorgeben statt hoffen</h3>
        <p className={P}>
          Besser, als Fehler hinterher zu finden: Die Gruppen gleich in den Auftrag schreiben. Dieser Baustein lässt sich
          in jeden Prompt für eine Ansicht übernehmen — hier für die Kasse aus der Praxisaufgabe:
        </p>
        <CodeBlock language="Prompt — Gruppierung vorgeben" code={PROMPT_SNIPPET} />
        <p className={P}>
          Wie ein vollständiger Auftrag aussieht und wie du generierte Entwürfe Schritt für Schritt prüfst, zeigt{" "}
          <ModuleRef slug="ai-workflow" withTitle />.
        </p>

        <hr className={HR} />

        {/* ══ PRAXIS ══ */}
        <p className={EYEBROW}>Praxisaufgabe</p>
        <h2 id="praxis" className={`${H2} scroll-mt-16`}>Eine Kasse, die sich selbst erklärt</h2>

        <ExerciseBlock
          title="Aufgabenstellung"
          tasks={[
            "Nähe — ersetze den einen Abstand durch drei Stufen: eng zwischen Label und Feld, mittel zwischen den Feldern, weit zwischen den Gruppen (Lieferadresse, Versand, Übersicht, Aktionen). Alle gap-Werte stehen in einem Block",
            "Ähnlichkeit — die Gruppentitel (legend und h2) sollen untereinander gleich aussehen und sich sichtbar von den Feld-Labels unterscheiden",
            "Unterschied — „Zurück zum Warenkorb“ sieht aus wie die Hauptaktion. Mach daraus einen Textlink",
            "Gemeinsame Region — mach jede Versandoption zu einer Fläche mit Rahmen und hebe die gewählte hervor (:has(input:checked) hilft). Gib der Übersicht eine eigene Fläche",
            "Verbundenheit — setze in der Übersicht genau eine Linie: über der Gesamtsumme",
            "Prüfen — füge vorübergehend body { filter: blur(4px); } ein. Siehst du vier Gruppen?",
            "Bonus — gib jeder Fläche, die nur über ihre Hintergrundfarbe erkennbar ist, einen transparenten Rahmen für den Kontrastmodus",
          ]}
        >
          Die Kasse unten ist vollständig und korrekt ausgezeichnet — und flach: Zwischen allem liegen 14 px,
          Gruppentitel sehen aus wie Labels, die Nebenaktion sieht aus wie die Hauptaktion. Das Markup ist schon richtig
          gruppiert (fieldset, legend, section). Deine Aufgabe: Sorg dafür, dass das Auge dieselben Gruppen sieht, ohne
          das HTML zu verändern.
        </ExerciseBlock>

        <LiveEditor title="Kasse" html={EXERCISE_HTML} previewHeight={720} />

        <details className="group bg-(--bg-surface) border border-(--bg-elevated) rounded-xl mt-6 mb-6 shadow-(--shadow-sm)">
          <summary className="cursor-pointer select-none px-6 py-4 text-[14px] font-semibold text-(--text-primary) marker:text-(--accent)">
            Musterlösung anzeigen
            <span className="font-normal text-(--text-tertiary)"> — erst selbst probieren</span>
          </summary>
          <div className="px-6 pb-2">
            <p className={P}>
              Eine mögliche Lösung. Achte auf die Reihenfolge: Die drei Abstandsstufen schaffen schon den größten Teil der
              Ordnung. Flächen kommen nur dort dazu, wo es um eine Auswahl geht (Versand) oder um eine Einheit, die man als
              Ganzes prüft (Übersicht). Und es gibt genau eine Linie.
            </p>
            <CodeBlock language="CSS — Musterlösung" code={SOLUTION_RULES} />
          </div>
        </details>

        <hr className={HR} />

        {/* ── ZUM MITNEHMEN ── */}
        <p className={EYEBROW}>Zum Mitnehmen</p>
        <h2 className={H2}>Ein Gestalt-Grundgerüst für dein Projekt</h2>
        <p className={P}>
          Die Muster aus diesem Modul als CSS: vier Abstandsstufen, eine Region, die auch im Kontrastmodus hält, Aktionen
          mit einheitlichem Aussehen, Linien nur zwischen Gruppen, Zeilen, die als Ganzes reagieren, und ein Dialog mit
          Figur und Grund. Die Werte sind ein Startpunkt — wichtig ist das Verhältnis.
        </p>
        <CodeBlock language="CSS — Gestalt-Grundgerüst" code={TAKEAWAY_CSS} />

        <h3 className={H3}>Die fertige Kasse als eigenständige Datei</h3>
        <p className={P}>
          Die gelöste Aufgabe mit HTML und CSS in einem Stück. Als <code className={CODE}>.html</code> speichern, im
          Browser öffnen und einmal nur mit der Tab-Taste durchgehen: Die Reihenfolge, die du hörst und siehst, ist
          dieselbe.
        </p>
        <CodeBlock language="HTML + CSS — Kasse" code={SOLUTION_HTML} />

        <TheoryCard label="Merkliste">
          <ConceptList>
            <ConceptItem title="Wahrnehmung ist ein Parser">
              Aus Pixeln baut das Gehirn einen Baum. Dein Layout ist sein Quelltext, nicht dein Markup.
            </ConceptItem>
            <ConceptItem title="Drei Fragen, neun Prinzipien">
              Was ist vorne? Was gehört zusammen? Welche Form hat das Ganze?
            </ConceptItem>
            <ConceptItem title="Jedes Prinzip ist eine Wette">
              Das Gehirn setzt auf die wahrscheinlichste, einfachste Deutung. Sorg dafür, dass sie die richtige ist.
            </ConceptItem>
            <ConceptItem title="Nähe zuerst, in Stufen">
              Innen kleiner als außen, jede Stufe etwa doppelt so groß. Gleiche Abstände sind auch eine Aussage.
            </ConceptItem>
            <ConceptItem title="Gleiche Rolle, gleiches Aussehen">
              Und jede andere Rolle sichtbar anders — mit einem Merkmal neben der Farbe.
            </ConceptItem>
            <ConceptItem title="Von leise nach laut">
              Abstand, Ähnlichkeit, Linie, Fläche. Widersprechen sich zwei Signale, ist das ein Fehler.
            </ConceptItem>
            <ConceptItem title="Gestalt im Markup">
              Jede sichtbare Gruppe ist auch eine Gruppe im DOM: fieldset, Liste, Abschnitt, Dialog.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <ReferenceBox title="Quellen">
          <ul className="list-none m-0 p-0 flex flex-col gap-1">
            {SOURCES.map((source) => (
              <li key={source}>{source}</li>
            ))}
          </ul>
        </ReferenceBox>

        {/* ── AUSBLICK ── */}
        <p className={EYEBROW}>Ausblick</p>
        <h3 className="text-[15px] font-bold leading-[1.4] text-(--text-primary) mt-0 mb-2">
          Gestalt sagt, was zusammengehört — als Nächstes geht es darum, was davon zählt
        </h3>
        <p className={P}>
          Mit den Gestaltprinzipien entscheidest du, welche Gruppen das Auge sieht. Die folgenden Module bauen darauf auf:
          Sie bringen die Gruppen in eine Rangfolge und machen aus jedem Mittel ein System.
        </p>
        <div className={`${PANEL} overflow-hidden divide-y divide-(--bg-elevated)`}>
          {NEXT.map((row) => (
            <div key={row.slug} className="grid gap-x-4 gap-y-0.5 px-5 py-3 sm:grid-cols-[170px_110px_1fr] sm:items-baseline">
              <span className="text-[14px] font-bold text-(--text-primary)">{row.topic}</span>
              <span className="text-[13px]">
                <ModuleRef slug={row.slug} />
              </span>
              <span className="text-[13px] leading-[1.6] text-(--text-secondary)">{row.text}</span>
            </div>
          ))}
        </div>
      </div>

      <ModuleNav prevModule={prevModule} nextModule={nextModule} />
    </div>
  );
}
