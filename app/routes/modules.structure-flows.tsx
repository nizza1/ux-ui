import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Eye, Hammer, Network } from "lucide-react";
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
import { SitemapExplorer } from "~/components/demos/structure/SitemapExplorer";
import { ClickPrototype } from "~/components/demos/structure/ClickPrototype";
import { StateSwitcher } from "~/components/demos/structure/StateSwitcher";
import { FidelitySwitcher } from "~/components/demos/structure/FidelitySwitcher";
import { CAPTION, CODE, EYEBROW, H1, H2, H3, HR, LEAD, P, PAGE, STAGE, STRONG } from "~/components/ui/moduleStyles";

const SLUG = "structure-flows";
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
    title: "Ordnen",
    text: "Was gehört zusammen, wie heißt es, und wo findet man es? Die Struktur der Inhalte — und damit deiner Routen.",
  },
  {
    step: 2,
    title: "Ablauf planen",
    text: "Welche Schritte führen zum Ziel, und in welchen Zuständen kann jede Ansicht sein? Der Weg, nicht das Einzelbild.",
  },
  {
    step: 3,
    title: "Wireframe prüfen",
    text: "Die Struktur in Grau sichtbar machen und Rückmeldung holen, solange Ändern noch nichts kostet.",
  },
];

const STATES_CODE = `type Task = { id: string; title: string; due: string };

// Jeder Zustand ist ein eigener Fall — keiner kann vergessen werden
type TaskData =
  | { status: "loading" }
  | { status: "error"; message: string; retry: () => void }
  | { status: "empty"; nextDue?: Task }
  | { status: "ready"; items: Task[]; stale: boolean };

// Der feste Rückgabetyp sorgt dafür, dass TypeScript einen fehlenden Fall meldet
function TaskList({ data }: { data: TaskData }): React.ReactElement {
  switch (data.status) {
    case "loading":
      return <TaskSkeleton rows={4} />;
    case "error":
      return <ErrorState message={data.message} onRetry={data.retry} />;
    case "empty":
      return <EmptyState nextDue={data.nextDue} />;
    case "ready":
      return <Tasks items={data.items} stale={data.stale} />;
  }
}`;

const GREYBOX_PROMPT = `Bau die Seite „Projektübersicht“ als Grey-Box-Wireframe in HTML und CSS.

Regeln für das Wireframe:
- Nur Graustufen, eine Systemschrift. Keine Icons, keine Schatten, keine Bilder.
- Echte Beschriftungen und realistische Beispieldaten, kein Blindtext.
- Zeig vier Zustände untereinander, jeweils beschriftet: gefüllt, leer, lädt, Fehler.
- Markiere genau eine Hauptaktion der Seite, sonst nichts.
- Schreib unter jeden Zustand eine Anmerkung: Was sieht die Nutzerin, was kann sie tun?

Kontext:
- Nutzerin: Teamleiterin mit zwölf Projekten, schaut zwischen Terminen kurz hinein.
- Ziel der Seite: in zwei Minuten erkennen, welches Projekt Aufmerksamkeit braucht.
- Navigation: Übersicht, Projekte, Team, Auswertung, Einstellungen.

Gestaltung kommt später. Triff keine Entscheidungen über Farbe oder Stil.`;

const EXERCISE_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Wireframe — Projektübersicht</title>
<style>
  /* Grey-Box: nur Graustufen, eine Schrift */
  :root {
    --ink: #1f2328;   /* Text, Hauptaktion */
    --mid: #5f6772;   /* Nebentext */
    --box: #d5d9de;   /* Platzhalter */
    --line: #b6bcc4;  /* Rahmen */
    --paper: #ffffff;
    --desk: #eef0f2;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: system-ui, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--ink);
    background: var(--desk);
    padding: 16px;
  }
  .frame {
    display: grid;
    grid-template-columns: 160px 1fr;
    gap: 12px;
    max-width: 760px;
    margin: 0 auto;
  }
  @media (max-width: 440px) { .frame { grid-template-columns: 1fr; } }

  /* ── Navigation ── */
  .nav {
    background: var(--paper);
    border: 1.5px solid var(--line);
    border-radius: 6px;
    padding: 10px;
  }
  .nav a {
    display: block;
    padding: 6px 8px;
    border-radius: 4px;
    color: var(--ink);
    text-decoration: none;
  }
  /* TODO 2: aktiven Eintrag kennzeichnen */
  .nav a.is-active { }

  /* ── Inhalt ── */
  .main {
    background: var(--paper);
    border: 1.5px solid var(--line);
    border-radius: 6px;
    padding: 16px;
  }
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }
  .actions { display: flex; gap: 8px; }
  h1 { font-size: 18px; }
  .btn {
    font: inherit;
    padding: 6px 12px;
    border: 1.5px solid var(--line);
    border-radius: 4px;
    background: var(--paper);
    color: var(--ink);
  }
  /* TODO 3: Hauptaktion, ohne Farbe */
  .btn-primary { }

  .row {
    display: grid;
    grid-template-columns: 1fr 70px 70px;
    gap: 12px;
    align-items: center;
    padding: 10px 0;
    border-top: 1.5px solid var(--box);
  }
  .bar { height: 10px; border-radius: 3px; background: var(--box); }

  /* ── Leerzustand ── */
  .empty {
    margin-top: 14px;
    border: 1.5px dashed var(--line);
    border-radius: 6px;
    padding: 20px;
    text-align: center;
    color: var(--mid);
  }

  /* ── Anmerkungen zum Wireframe ── */
  .note { margin-top: 12px; font-size: 13px; color: var(--mid); }
  .note b { color: var(--ink); }
</style>
</head>
<body>
  <div class="frame">

    <!-- TODO 1: Acht Einträge im Team-Jargon.
         Höchstens fünf — in Wörtern, die Nutzer verwenden würden -->
    <nav class="nav">
      <a href="#">Dashboard-Modul</a>
      <a href="#" class="is-active">Entitäten</a>
      <a href="#">Ressourcen-Mgmt</a>
      <a href="#">Zeit-Tracking</a>
      <a href="#">Reporting</a>
      <a href="#">Stammdaten</a>
      <a href="#">Konfiguration</a>
      <a href="#">Billing</a>
    </nav>

    <main class="main">
      <div class="head">
        <h1>Entitäten</h1>
        <div class="actions">
          <button class="btn">Exportieren</button>
          <button class="btn btn-primary">Neu</button>
        </div>
      </div>

      <div class="row"><span>Relaunch Website</span><span class="bar"></span><span class="bar"></span></div>
      <div class="row"><span>App für den Außendienst</span><span class="bar"></span><span class="bar"></span></div>
      <div class="row"><span>Preisliste 2027</span><span class="bar"></span><span class="bar"></span></div>

      <!-- TODO 4: Leerzustand. Was sieht jemand, der noch kein Projekt hat?
           Entferne das hidden-Attribut und schreib einen Text,
           der erklärt, was hier stehen wird, und den nächsten Schritt anbietet -->
      <div class="empty" hidden>Keine Daten</div>

      <!-- TODO 5: Anmerkung — was passiert beim Klick auf eine Zeile? -->
      <p class="note"><b>①</b> …</p>
    </main>

  </div>
</body>
</html>`;

const SOLUTION_CODE = `<!-- 1 · Fünf Einträge in Nutzersprache.
     Zeit-Tracking + Reporting → Auswertung
     Stammdaten + Konfiguration + Billing → Einstellungen -->
<nav class="nav">
  <a href="#">Übersicht</a>
  <a href="#" class="is-active" aria-current="page">Projekte</a>
  <a href="#">Team</a>
  <a href="#">Auswertung</a>
  <a href="#">Einstellungen</a>
</nav>

<!-- Überschrift und Hauptaktion sagen, worum es geht -->
<h1>Projekte</h1>
<button class="btn">Exportieren</button>
<button class="btn btn-primary">Neues Projekt</button>

<!-- 4 · Leerzustand: was hier stehen wird + nächster Schritt -->
<div class="empty">
  <strong>Noch keine Projekte</strong><br>
  Leg dein erstes Projekt an, um Aufgaben zu planen und dein Team einzuladen.<br>
  <button class="btn btn-primary" style="margin-top: 12px">Neues Projekt</button>
</div>

<!-- 5 · Anmerkung: Verhalten, das man dem Bild nicht ansieht -->
<p class="note"><b>①</b> Klick auf eine Zeile öffnet das Projekt (/projekte/:id).
   Die ganze Zeile ist klickbar, nicht nur der Name.</p>

<style>
  /* 2 · Aktiver Eintrag: Fläche und Gewicht — zwei Signale, keine Farbe */
  .nav a.is-active { background: var(--box); font-weight: 700; }

  /* 3 · Hauptaktion: die einzige gefüllte Schaltfläche der Seite */
  .btn-primary {
    background: var(--ink);
    border-color: var(--ink);
    color: var(--paper);
    font-weight: 600;
  }
</style>`;

const WIREFRAME_KIT = `/* wireframe.css — Grey-Box-Bausteine für Wireframes direkt im Browser */
:root {
  --wf-ink: #1f2328;    /* Text und Hauptaktion */
  --wf-mid: #5f6772;    /* Nebentext, Anmerkungen */
  --wf-box: #d5d9de;    /* Platzhalter-Flächen */
  --wf-line: #b6bcc4;   /* Rahmen */
  --wf-paper: #ffffff;
  --wf-desk: #eef0f2;
}

.wf { font: 14px/1.5 system-ui, sans-serif; color: var(--wf-ink); background: var(--wf-desk); }
.wf * { box-sizing: border-box; }

/* Fläche: Karte, Bereich, Navigation */
.wf-box {
  background: var(--wf-paper);
  border: 1.5px solid var(--wf-line);
  border-radius: 6px;
  padding: 16px;
}

/* Bild-Platzhalter mit Diagonale */
.wf-img {
  aspect-ratio: 16 / 9;
  border-radius: 4px;
  background:
    linear-gradient(to top right,
      transparent calc(50% - 1px), var(--wf-line) calc(50% - 1px),
      var(--wf-line) calc(50% + 1px), transparent calc(50% + 1px)),
    var(--wf-box);
}

/* Textzeile, wenn der genaue Wortlaut noch egal ist */
.wf-line { height: 10px; border-radius: 3px; background: var(--wf-box); }
.wf-line + .wf-line { margin-top: 8px; }

/* Schaltflächen: genau eine gefüllte pro Ansicht */
.wf-btn {
  font: inherit;
  padding: 6px 12px;
  border: 1.5px solid var(--wf-line);
  border-radius: 4px;
  background: var(--wf-paper);
  color: var(--wf-ink);
}
.wf-btn--primary {
  background: var(--wf-ink);
  border-color: var(--wf-ink);
  color: var(--wf-paper);
  font-weight: 600;
}

/* Zustand: leer, lädt, Fehler — gestrichelt, damit er als Variante erkennbar ist */
.wf-state {
  border: 1.5px dashed var(--wf-line);
  border-radius: 6px;
  padding: 24px;
  text-align: center;
  color: var(--wf-mid);
}

/* Anmerkung: erklärt Verhalten, gehört nicht zur Oberfläche */
.wf-note { font-size: 13px; color: var(--wf-mid); }
.wf-note b { color: var(--wf-ink); }

/* Abstand zwischen gestapelten Bausteinen */
.wf-stack > * + * { margin-top: 12px; }`;

const WIREFRAME_USAGE = `<link rel="stylesheet" href="wireframe.css">

<body class="wf">
  <main class="wf-box wf-stack" style="max-width: 420px; margin: 24px auto">
    <h1>Benachrichtigungen</h1>

    <!-- Zustand: gefüllt -->
    <div class="wf-box wf-stack">
      <strong>Jonas hat deinen Entwurf kommentiert</strong>
      <div class="wf-line" style="width: 80%"></div>
      <div class="wf-line" style="width: 55%"></div>
      <button class="wf-btn wf-btn--primary">Kommentar ansehen</button>
    </div>
    <p class="wf-note"><b>①</b> Ungelesene stehen oben. Klick markiert als gelesen.</p>

    <!-- Zustand: leer -->
    <div class="wf-state">
      <strong>Alles gelesen</strong><br>
      Neue Benachrichtigungen erscheinen hier.
    </div>
  </main>
</body>`;

/* ── Bausteine ─────────────────────────────────────────────────────────── */

function NavMock({ items, note }: { items: string[]; note: string }) {
  return (
    <div className={`${STAGE} flex flex-col gap-1.5`}>
      {items.map((item) => (
        <div key={item} className="px-3 py-1.5 rounded-md bg-(--bg-surface) border border-(--bg-elevated) text-[13px] font-medium text-(--text-primary)">
          {item}
        </div>
      ))}
      <p className={`${CAPTION} pt-1.5`}>{note}</p>
    </div>
  );
}

function FeedbackMock({ lines, note }: { lines: string[]; note: string }) {
  return (
    <div className={`${STAGE} flex flex-col gap-2`}>
      {lines.map((line) => (
        <div key={line} className="text-[14px] font-medium leading-[1.5] text-(--text-primary)">
          {line}
        </div>
      ))}
      <p className={`${CAPTION} pt-1`}>{note}</p>
    </div>
  );
}

/* ── Seite ─────────────────────────────────────────────────────────────── */

export default function StructureFlowsModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      <div className={PAGE}>
        {/* ── TITEL ── */}
        <div className="mb-2">
          <Badge variant="module" dot>Modul {MODULE.number}</Badge>
        </div>
        <h1 className={H1}>Struktur &amp; Flows: Vom Bedürfnis zum Wireframe</h1>
        <p className={LEAD}>
          Bevor eine Oberfläche gut aussehen kann, muss sie richtig aufgebaut sein. Dieses Modul zeigt, wie du Inhalte
          ordnest, Abläufe und Zustände planst und die Struktur prüfst — in Grau, bevor Farbe und Feinschliff von den
          eigentlichen Fragen ablenken.
        </p>

        <ModuleMeta duration="75 Min." practiceTime="~25 Min." />

        <BuildsOn modules="understanding-users" />
        <LearningGoals
          goals={[
            "Inhalte nach den Aufgaben der Nutzer ordnen und in ihrer Sprache benennen — nicht nach der internen Struktur",
            "Einen Ablauf als Folge von Screens und Aktionen planen und an einem klickbaren Entwurf prüfen",
            "Für jede Ansicht fünf Zustände einplanen: ideal, leer, lädt, Fehler, teilweise",
            "Die drei Fidelity-Stufen unterscheiden und wissen, welche Frage jede beantwortet",
            "Ein Grey-Box-Wireframe direkt in HTML und CSS bauen und mit Anmerkungen versehen",
            "KI-Entwürfe nutzen, ohne die Entscheidung über die Struktur zu überspringen",
          ]}
        />

        <hr className={HR} />

        {/* ── KERNGEDANKE ── */}
        <p className={EYEBROW}>Kerngedanke</p>
        <InsightRow icon={Network} title="Struktur-Fehler sind die teuersten">
          Eine Farbe zu ändern dauert Minuten. Eine Navigation umzubauen, nachdem zwanzig Seiten darauf aufsetzen,
          dauert Wochen — und bricht jede Gewohnheit, die Nutzer sich angeeignet haben. Was am Anfang entschieden wird,
          lässt sich am Ende am schwersten korrigieren.
        </InsightRow>
        <InsightRow icon={Eye} title="Fertig aussehen ist kein Beweis">
          Ein polierter Screen wirkt entschieden. Wer ihn sieht, redet über Farben und Rundungen — nicht darüber, ob
          die Seite an der richtigen Stelle steht oder ob ein Schritt fehlt. Je fertiger ein Entwurf aussieht, desto
          weniger wird seine Struktur hinterfragt.
        </InsightRow>
        <InsightRow icon={Hammer} title="Bauen ist billig geworden — Entscheiden nicht">
          Ein KI-Assistent liefert in einer Minute eine komplette, gestaltete Seite. Das macht dieses Modul wichtiger,
          nicht überflüssig: Wenn der erste Entwurf sofort fertig aussieht, musst du die Strukturfragen bewusst
          stellen. Von selbst kommen sie nicht mehr.
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

        {/* ── SCHRITT 1 ── */}
        <p className={EYEBROW}>Schritt 1 — Ordnen</p>
        <h2 className={H2}>Informationsarchitektur: Wo steht was, und wie heißt es?</h2>
        <p className={P}>
          Informationsarchitektur klingt nach Fachdisziplin, ist aber eine Frage, die du bei jedem Projekt beantwortest
          — spätestens, wenn du Routen anlegst:{" "}
          <strong className={STRONG}>Welche Seiten gibt es, wie hängen sie zusammen, und wie heißen sie im Menü?</strong>{" "}
          Gut gelöst ist sie, wenn niemand darüber nachdenkt. Schlecht gelöst, wenn Nutzer suchen, raten und
          zurückgehen.
        </p>

        <TheoryCard label="Drei Hebel">
          <ConceptList>
            <ConceptItem title="Gruppieren nach Aufgaben, nicht nach Abteilungen">
              Menschen kommen mit einem Vorhaben: etwas bestellen, etwas nachsehen, etwas ändern. Ordne Inhalte danach
              — nicht nach dem Organigramm, dem Datenmodell oder der Reihenfolge, in der die Features entstanden sind.
            </ConceptItem>
            <ConceptItem title="Benennen in der Sprache der Nutzer">
              „Entitäten“, „Stammdaten“ und „Billing“ sind Wörter aus dem Team. Ein Label ist gut, wenn jemand
              vorhersagen kann, was dahinter steht, ohne zu klicken.
            </ConceptItem>
            <ConceptItem title="Begrenzen und den Standort zeigen">
              Fünf bis sieben Einträge in der Hauptnavigation lassen sich überblicken, fünfzehn liest niemand mehr
              ganz. Mehr als drei Ebenen Tiefe überfordern. Und auf jeder Seite muss erkennbar sein, wo man gerade ist:
              aktiver Menüpunkt, Seitentitel, Breadcrumb.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <ComparisonPanel
          bad={{
            label: "Nach der Organisation sortiert",
            children: (
              <NavMock
                items={["Privatkunden", "Geschäftskunden", "Partnerprogramm", "Investor Relations"]}
                note="Spiegelt die Abteilungen der Firma. Wo ändere ich meine Lieferadresse?"
              />
            ),
          }}
          good={{
            label: "Nach Aufgaben sortiert",
            children: (
              <NavMock
                items={["Einkaufen", "Meine Bestellungen", "Rückgabe & Umtausch", "Hilfe"]}
                note="Jeder Eintrag beschreibt ein Vorhaben. Die Lieferadresse steht bei „Meine Bestellungen“."
              />
            ),
          }}
        />

        <h3 className={H3}>Für Entwickler: Deine Routen sind deine Informationsarchitektur</h3>
        <p className={P}>
          Eine Sitemap ist nichts anderes als ein Routen-Baum mit lesbaren Namen. Wenn die URL{" "}
          <code className={CODE}>/projekte/:id/aufgaben/:aufgabe</code> lautet, steht die Hierarchie bereits da. Wähl
          links einen Screen aus — und schalte dann die Beschriftung um.{" "}
          <strong className={STRONG}>Die Struktur bleibt dieselbe. Wie gut findet man sich jeweils zurecht?</strong>
        </p>

        <SitemapExplorer />

        <ExplanationBox title="Der Label-Test — fünf Minuten, kein Werkzeug">
          <p>
            Schreib deine Navigation als Liste auf, ohne Oberfläche drumherum. Bitte fünf Personen:{" "}
            <strong>„Wo würdest du deine letzte Rechnung suchen?“</strong> Tippen drei auf einen anderen Eintrag als
            gedacht, ist das Label falsch — nicht die Person. Das lässt sich klären, bevor eine einzige Route
            existiert.
          </p>
        </ExplanationBox>

        <RuleBox>
          Wenn ein Menüpunkt den Namen einer Datenbanktabelle trägt, hat niemand eine Entscheidung getroffen. Frag bei
          jedem Label: Welches Wort würde ein Nutzer in die Suche tippen, um genau das zu finden?
        </RuleBox>

        <hr className={HR} />

        {/* ── SCHRITT 2 ── */}
        <p className={EYEBROW}>Schritt 2 — Ablauf planen</p>
        <h2 className={H2}>User Flow: der Weg, nicht das Einzelbild</h2>
        <p className={P}>
          Niemand benutzt einen Screen. Menschen gehen einen Weg: von einem Auslöser über mehrere Ansichten zu einem
          Ergebnis. Ein <strong className={STRONG}>User Flow</strong> beschreibt diesen Weg als Folge von Screens und
          den Aktionen dazwischen — den direkten Weg genauso wie die Abzweigungen: zurück, abbrechen, Fehler.
        </p>
        <p className={P}>
          Der schnellste Weg, einen Flow zu prüfen, ist, ihn klickbar zu machen. Dafür braucht es kein Design. Vier
          graue Screens reichen. <strong className={STRONG}>Lös die Aufgabe rechts und zähl mit.</strong>
        </p>

        <ClickPrototype />

        <ExplanationBox title="Was der Prototyp zeigt">
          <p>
            Jeder einzelne Screen ist in Ordnung. Das Problem liegt dazwischen: Nach jedem Produkt landet man im
            Warenkorb und muss für das nächste zurück. <strong>Solche Probleme sieht man auf keinem Einzelbild.</strong>{" "}
            Sie zeigen sich erst, wenn jemand den Weg wirklich geht — am besten jemand, der ihn nicht entworfen hat.
          </p>
        </ExplanationBox>

        <h3 className={H3}>Jede Ansicht hat fünf Zustände</h3>
        <p className={P}>
          Der zweite blinde Fleck neben dem Weg: Ein Entwurf zeigt eine Ansicht fast immer so, wie sie im besten Fall
          aussieht — gefüllt mit schönen Daten. Im Betrieb ist sie mindestens genauso oft leer, lädt, zeigt einen
          Fehler oder nur einen Teil.{" "}
          <strong className={STRONG}>Schalte durch die fünf Zustände derselben Liste.</strong>
        </p>

        <StateSwitcher />

        <ReferenceBox>
          <p>
            Die fünf Zustände gehen auf Scott Hurff zurück, der sie den <strong>UI Stack</strong> nennt: ideal, leer,
            Fehler, teilweise, lädt („Designing Products People Love“, O’Reilly, 2015). Sein Punkt: Eine Ansicht ist
            nie ein einzelnes Bild — und die Übergänge zwischen den Zuständen gehören ebenfalls zum Entwurf.
          </p>
        </ReferenceBox>

        <h3 className={H3}>Für Entwickler: Zustände in den Typ schreiben</h3>
        <p className={P}>
          Die verlässlichste Methode, keinen Zustand zu vergessen, ist, ihn im Datentyp zu verankern. Statt drei
          unabhängiger Flags (<code className={CODE}>isLoading</code>, <code className={CODE}>error</code>,{" "}
          <code className={CODE}>data</code>), die unmögliche Kombinationen zulassen, beschreibt ein Typ genau die
          Fälle, die es gibt:
        </p>
        <CodeBlock language="TypeScript — ein Typ, vier Fälle" code={STATES_CODE} />

        <RuleBox>
          Wer die Akzeptanzkriterien aus <ModuleRef slug="understanding-users" /> ernst nimmt, bekommt die Zustände
          geschenkt: Jedes „Angenommen“ ist einer. Plane sie, bevor du den Idealfall gestaltest — sonst entstehen sie
          um halb fünf am Freitag.
        </RuleBox>

        <hr className={HR} />

        {/* ── SCHRITT 3 ── */}
        <p className={EYEBROW}>Schritt 3 — Wireframe prüfen</p>
        <h2 className={H2}>Wireframes: die Struktur sichtbar machen</h2>
        <p className={P}>
          Ein Wireframe ist der Grundriss eines Screens: Was steht darauf, in welcher Reihenfolge, wie viel Platz
          bekommt es — ohne Farbe, ohne Schriftwahl, ohne Bilder. Es beantwortet Strukturfragen und{" "}
          <strong className={STRONG}>nur</strong> Strukturfragen. Wie viel Detail ein Entwurf zeigt, nennt man seine{" "}
          <strong className={STRONG}>Fidelity</strong>. Dieselbe Seite in drei Stufen:
        </p>

        <FidelitySwitcher />

        <ExplanationBox title="Was die drei Stufen gemeinsam haben">
          <p>
            Suche oben, Filter links, Produkte im Raster: Die Struktur ist in allen drei Stufen dieselbe.{" "}
            <strong>Was sich ändert, ist das Gespräch, das der Entwurf auslöst.</strong> Deshalb ist die Stufe keine
            Frage des Aufwands, sondern eine der Absicht: Welche Rückmeldung brauchst du gerade?
          </p>
        </ExplanationBox>

        <TheoryCard label="Vier Regeln für brauchbare Wireframes">
          <ConceptList>
            <ConceptItem title="Echte Wörter, sobald es um Benennung geht">
              Graue Balken reichen für die Anordnung. Für Menüpunkte, Überschriften und Schaltflächen brauchst du den
              echten Text — er ist Teil der Struktur.
            </ConceptItem>
            <ConceptItem title="Anmerkungen dazuschreiben">
              Was passiert beim Klick? Was steht hier, wenn der Titel dreimal so lang ist? Verhalten sieht man einem
              Bild nicht an. Die Anmerkung ist oft wertvoller als die Zeichnung.
            </ConceptItem>
            <ConceptItem title="Zustände nebeneinander zeigen">
              Leer, lädt, Fehler — auch im Wireframe. Ein Entwurf ohne Zustände ist erst zu einem Fünftel fertig.
            </ConceptItem>
            <ConceptItem title="Den Ablauf zeigen, nicht den Screen">
              Leg die Ansichten eines Flows nebeneinander und verbinde sie. Ein einzelner Screen ohne Vorher und
              Nachher lässt sich nicht beurteilen.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <h3 className={H3}>Was KI an der Rechnung ändert</h3>
        <p className={P}>
          Früher gab es einen einfachen Grund, grau anzufangen: Ein gestalteter Entwurf kostete Stunden, eine Skizze
          Minuten. Dieser Grund ist weg — ein Assistent liefert die gestaltete Version heute schneller, als du die
          Skizze zeichnest. <strong className={STRONG}>Der zweite Grund ist geblieben, und er war immer der wichtigere:
          Aufmerksamkeit.</strong>
        </p>

        <ComparisonPanel
          bad={{
            label: "Rückmeldung auf den fertigen Entwurf",
            children: (
              <FeedbackMock
                lines={["„Das Blau ist mir zu kalt.“", "„Kann das Logo größer?“", "„Sieht gut aus, bauen wir so.“"]}
                note="Niemand fragt, ob die Seite die richtige Aufgabe löst. Sie sieht ja fertig aus."
              />
            ),
          }}
          good={{
            label: "Rückmeldung auf das Wireframe",
            children: (
              <FeedbackMock
                lines={[
                  "„Warum sehe ich zuerst alle Projekte und nicht meine?“",
                  "„Was steht hier, wenn noch nichts angelegt ist?“",
                  "„‚Auswertung‘ — ist das dasselbe wie Berichte?“",
                ]}
                note="Drei Fragen, die später jeweils einen Umbau gekostet hätten."
              />
            ),
          }}
        />

        <p className={P}>
          Die Folgerung für die Arbeit mit einem KI-Assistenten: Bestell zuerst das Wireframe, nicht das Design. Ein
          Auftrag dafür sieht so aus — er legt fest, was nicht entschieden werden soll:
        </p>
        <CodeBlock language="Prompt — Grey-Box-Wireframe bestellen" code={GREYBOX_PROMPT} />

        <RuleBox>
          Erst wenn die Struktur steht, lohnt sich die Gestaltung. Die Frage vor jedem Schritt Richtung Hi-Fi lautet:
          Wissen wir genug über den Aufbau, um ihn gut aussehen zu lassen? Wenn nicht, bleib bei Grau.
        </RuleBox>

        <hr className={HR} />

        {/* ── PRAXISAUFGABE ── */}
        <p className={EYEBROW}>Praxisaufgabe</p>
        <h2 className={H2}>Ein Wireframe überarbeiten — nur mit Grau</h2>

        <ExerciseBlock
          title="Aufgabenstellung"
          tasks={[
            "Navigation: Aus acht Einträgen im Team-Jargon werden höchstens fünf in Nutzersprache. Was lässt sich zusammenlegen?",
            "Standort: Gib dem aktiven Eintrag (.is-active) ein erkennbares Aussehen — mit Grauwert und Schriftgewicht, ohne Farbe",
            "Hauptaktion: Benenne Überschrift und Schaltfläche so, dass klar ist, was hier angelegt wird, und gestalte .btn-primary als einzige gefüllte Schaltfläche",
            "Leerzustand: Entferne das hidden-Attribut und schreib einen Text, der sagt, was hier stehen wird, und den nächsten Schritt anbietet",
            "Anmerkung: Ergänze bei ①, was beim Klick auf eine Projektzeile passiert",
            "Prüfe: Würde jemand, der die App nicht kennt, jeden Menüpunkt verstehen, ohne zu klicken?",
          ]}
        >
          Das Wireframe unten zeigt die Projektübersicht einer Team-App, so wie sie oft aus dem Datenmodell entsteht:
          Die Navigation trägt die Namen der Module, die Überschrift heißt wie die Tabelle, zwei Schaltflächen sehen
          gleich aus, und für den Fall ohne Daten steht „Keine Daten“ im Code. Bring Ordnung hinein. Im Wireframe
          dürfen Liste und Leerzustand untereinander stehen — so sieht man beide Zustände auf einen Blick.
        </ExerciseBlock>

        <LiveEditor title="Wireframe — Projektübersicht" html={EXERCISE_HTML} previewHeight={560} />

        <details className="group bg-(--bg-surface) border border-(--bg-elevated) rounded-xl mt-6 mb-6 shadow-(--shadow-sm)">
          <summary className="cursor-pointer select-none px-6 py-4 text-[14px] font-semibold text-(--text-primary) marker:text-(--accent)">
            Musterlösung anzeigen
            <span className="font-normal text-(--text-tertiary)"> — erst selbst probieren</span>
          </summary>
          <div className="px-6 pb-2">
            <p className={P}>
              Eine mögliche Lösung. Beim Zusammenlegen gilt: Was selten gebraucht wird und thematisch zusammengehört,
              teilt sich einen Eintrag. „Zeit-Tracking“ und „Reporting“ beantworten dieselbe Frage — wie läuft es? —
              und werden zu „Auswertung“. Alles, was man einmal einrichtet, wandert unter „Einstellungen“.
            </p>
            <CodeBlock language="HTML + CSS — Musterlösung (geänderte Stellen)" code={SOLUTION_CODE} />
          </div>
        </details>

        <hr className={HR} />

        {/* ── ZUM MITNEHMEN ── */}
        <p className={EYEBROW}>Zum Mitnehmen</p>
        <h2 className={H2}>Ein Wireframe-Baukasten für den Browser</h2>
        <p className={P}>
          Du brauchst kein Design-Werkzeug, um Wireframes zu bauen. Ein Dutzend CSS-Regeln genügt — und das Ergebnis
          ist sofort klickbar, responsiv und lässt sich im Pull Request besprechen. Die Datei verwendet bewusst nur
          Grau: Sie macht es schwer, zu früh über Gestaltung zu reden.
        </p>
        <CodeBlock language="CSS — wireframe.css" code={WIREFRAME_KIT} />

        <h3 className={H3}>So setzt du die Bausteine ein</h3>
        <p className={P}>Ein Screen mit zwei Zuständen und einer Anmerkung — als Vorlage für eigene Wireframes.</p>
        <CodeBlock language="HTML — Wireframe mit dem Baukasten" code={WIREFRAME_USAGE} />

        <TheoryCard label="Merkliste">
          <ConceptList>
            <ConceptItem title="Ordnen, Ablauf planen, Wireframe prüfen">
              Erst die Struktur, dann der Weg, dann die Rückmeldung — und erst danach die Gestaltung.
            </ConceptItem>
            <ConceptItem title="Aufgaben statt Abteilungen, Nutzerwörter statt Jargon">
              Ein Label ist gut, wenn man vorhersagen kann, was dahinter steht.
            </ConceptItem>
            <ConceptItem title="Deine Routen sind deine Struktur">
              Wer Routen anlegt, entscheidet über die Informationsarchitektur. Besser bewusst.
            </ConceptItem>
            <ConceptItem title="Den Weg gehen lassen">
              Probleme zwischen den Screens sieht man auf keinem Einzelbild. Vier graue Seiten zum Klicken reichen.
            </ConceptItem>
            <ConceptItem title="Fünf Zustände pro Ansicht">
              Ideal, leer, lädt, Fehler, teilweise — im Entwurf, im Typ und im Code.
            </ConceptItem>
            <ConceptItem title="Grau, solange die Struktur offen ist">
              Nicht wegen des Aufwands, sondern wegen der Aufmerksamkeit: Fertige Entwürfe bekommen Geschmacksurteile.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <p className={EYEBROW}>Ausblick</p>
        <p className={P}>
          Damit endet der erste Teil. Du weißt, was gebaut wird, für wen und wie es aufgebaut ist. Ab jetzt geht es um
          das, was aus dem grauen Gerüst eine gute Oberfläche macht — beginnend mit der Frage, wie das Auge Ordnung
          erkennt: <ModuleRef slug="gestalt-principles" withTitle />.
        </p>
      </div>

      <ModuleNav prevModule={prevModule} nextModule={nextModule} />
    </div>
  );
}
