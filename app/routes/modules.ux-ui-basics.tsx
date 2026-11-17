import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Bot, Check, Code2, KeyRound, Link2, LogIn, Mail, MousePointerClick, Plane, Umbrella, Zap } from "lucide-react";
import { getModuleBySlug, getModuleNeighbors, moduleGroups, modules } from "~/data/modules";
import { ModuleNav } from "~/routes/modules.$slug";
import { Badge } from "~/components/ui/Badge";
import { ModuleMeta } from "~/components/ui/ModuleMeta";
import { LearningGoals } from "~/components/ui/LearningGoals";
import { InsightRow } from "~/components/ui/InsightRow";
import { RuleBox } from "~/components/ui/RuleBox";
import { ReferenceBox } from "~/components/ui/ReferenceBox";
import { TheoryCard } from "~/components/ui/TheoryCard";
import { ConceptList, ConceptItem } from "~/components/ui/ConceptList";
import { ComparisonPanel } from "~/components/ui/ComparisonPanel";
import { ExplanationBox } from "~/components/ui/ExplanationBox";
import { CodeBlock } from "~/components/ui/CodeBlock";
import { ModuleRef } from "~/components/ui/ModuleRef";
import { UxUiSorter } from "~/components/demos/foundations/UxUiSorter";
import { CAPTION, CODE, EYEBROW, H1, H2, H3, HR, LEAD, MICRO, P, PAGE, PANEL, STAGE, STRONG } from "~/components/ui/moduleStyles";

const SLUG = "ux-ui-basics";
const MODULE = getModuleBySlug(SLUG)!;

export const meta: MetaFunction = () => [
  { title: `${MODULE.titleDe} — UX/UI Workshop` },
  { name: "description", content: MODULE.description },
];

export function loader() {
  return getModuleNeighbors(SLUG);
}

/* ── Daten ─────────────────────────────────────────────────────────────── */

const JOURNEY = [
  { icon: LogIn, label: "Loginseite aufrufen" },
  { icon: MousePointerClick, label: "„Passwort vergessen?“ anklicken" },
  {
    icon: Mail,
    label: "E-Mail-Adresse eingeben",
    friction: "„Mit welcher Adresse hatte ich mich angemeldet?“",
    fix: "Adresse aus dem Login-Feld übernehmen, statt sie erneut abzufragen.",
  },
  {
    icon: Link2,
    label: "E-Mail öffnen, Link anklicken",
    friction: "„Der Link ist abgelaufen.“",
    fix: "Gültigkeit in der E-Mail nennen. Bei abgelaufenem Link: neuen mit einem Klick anfordern.",
  },
  {
    icon: KeyRound,
    label: "Neues Passwort setzen",
    friction: "„Welche Regeln gelten denn?“",
    fix: "Anforderungen vor der Eingabe zeigen und beim Tippen abhaken — nicht erst als Fehler melden.",
  },
  { icon: Check, label: "Wieder angemeldet" },
];

const UX_VS_UI = [
  { label: "Fokus", ux: "Ablauf, Logik, Ziele der Nutzer", ui: "Darstellung, Layout, Interaktion" },
  { label: "Leitfrage", ux: "„Kommt jemand hier ans Ziel?“", ui: "„Sieht man, was zu tun ist?“" },
  { label: "Typische Arbeit", ux: "Flows, Zustände, Texte, Struktur", ui: "Typografie, Farbe, Abstand, Komponenten" },
  { label: "Im Code", ux: "Routing, Validierung, Fehlerbehandlung", ui: "CSS, Tokens, Komponenten-Varianten" },
];

const USABILITY = [
  {
    name: "Erlernbarkeit",
    question: "Gelingt die Aufgabe beim ersten Versuch?",
    code: "Sichtbare Labels statt Platzhalter-Text, bekannte Muster statt eigener Erfindungen, ein Beispielwert im Hilfetext.",
  },
  {
    name: "Effizienz",
    question: "Wie schnell geht es beim hundertsten Mal?",
    code: "autocomplete-Attribute, sinnvolle Vorgabewerte, vollständige Tastaturbedienung, kein Schritt ohne Grund.",
  },
  {
    name: "Einprägsamkeit",
    question: "Findet man sich nach drei Wochen Pause wieder zurecht?",
    code: "Gleiche Dinge sehen gleich aus und stehen an derselben Stelle. Eine Komponente statt fünf ähnlicher.",
  },
  {
    name: "Fehler",
    question: "Wie leicht passieren Fehler — und wie kommt man wieder heraus?",
    code: "Prüfen beim Verlassen des Feldes, Meldung direkt am Feld, Rückgängig statt „Sind Sie sicher?“, Eingaben nie verwerfen.",
  },
  {
    name: "Zufriedenheit",
    question: "Fühlt sich die Nutzung gut an?",
    code: "Rückmeldung auf jede Aktion in unter 100 ms, ruhige Oberfläche, klare und freundliche Sprache.",
  },
];

const CONTEXT = [
  {
    icon: Plane,
    title: "Pilotin vor dem Start",
    items: [
      "Wolkenuntergrenze, Sicht, Wind in exakten Werten",
      "Standardisierte Kürzel (METAR, TAF) — sie liest sie täglich",
      "Vorhersage für die nächsten Stunden am Zielflughafen",
      "Ein Irrtum ist gefährlich: Genauigkeit vor Einfachheit",
    ],
  },
  {
    icon: Umbrella,
    title: "Jemand an der Haustür",
    items: [
      "Eine Antwort: Regnet es in der nächsten Stunde?",
      "Gefühlte Temperatur statt Messwert",
      "Ein Blick aufs Handy, drei Sekunden Zeit",
      "Ein Irrtum ist ärgerlich, mehr nicht: Einfachheit vor Genauigkeit",
    ],
  },
];

const AI_DOES = [
  "Markup und CSS für bekannte Muster — Formulare, Tabellen, Karten",
  "Zehn Varianten eines Entwurfs in einer Minute",
  "Fleißarbeit: Zustände ausformulieren, Texte kürzen, Code umbauen",
];

const YOU_DO = [
  "Entscheiden, welches Problem gelöst wird — und für wen",
  "Festlegen, was auf einem Screen die Hauptsache ist",
  "Erkennen, ob ein Entwurf gut ist, und begründen, warum nicht",
  "Verantworten, was live geht: Barrierefreiheit, Datenschutz, Verständlichkeit",
];

const LOGIN_CODE = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anmelden</title>
<style>
  :root {
    --text: #1a1d21;
    --border: #c5ccd3;
    --surface: #ffffff;
    --page: #f3f5f7;
    --focus: #1d4ed8;   /* 6,7:1 auf Weiß */
    --error: #b42318;   /* 6,6:1 auf Weiß */
  }
  * { box-sizing: border-box; margin: 0; }
  body {
    font-family: system-ui, sans-serif;
    background: var(--page);
    color: var(--text);
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px;
  }
  .login {
    width: 100%;
    max-width: 360px;
    background: var(--surface);
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 1px 3px rgba(0,0,0,.08), 0 8px 24px rgba(0,0,0,.06);
  }
  h1 { font-size: 20px; margin-bottom: 24px; }
  .field { margin-bottom: 16px; }
  .field-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 6px;
  }
  label { font-size: 14px; font-weight: 600; }
  a { font-size: 14px; color: var(--focus); }

  /* 16px verhindert, dass iOS beim Antippen in das Feld hineinzoomt */
  input {
    width: 100%;
    font: inherit;
    font-size: 16px;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
  }

  /* Effizienz: Tastaturbedienung braucht einen sichtbaren Fokus */
  input:focus-visible,
  button:focus-visible,
  a:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }

  input[aria-invalid="true"] { border-color: var(--error); }
  .error { font-size: 14px; color: var(--error); margin-top: 6px; }

  /* Genau eine gefüllte Hauptaktion */
  button {
    width: 100%;
    font: inherit;
    font-size: 15px;
    font-weight: 600;
    padding: 12px;
    margin-top: 8px;
    border: 0;
    border-radius: 8px;
    background: var(--text);
    color: #fff;
    cursor: pointer;
  }
</style>
</head>
<body>
  <form class="login" action="/login" method="post">
    <h1>Anmelden</h1>

    <!-- Erlernbarkeit: sichtbares Label, kein Platzhalter als Ersatz -->
    <div class="field">
      <div class="field-head"><label for="email">E-Mail-Adresse</label></div>
      <!-- Effizienz: autocomplete lässt Browser und Passwort-Manager ausfüllen -->
      <input id="email" name="email" type="email" autocomplete="username" required>
    </div>

    <div class="field">
      <div class="field-head">
        <label for="password">Passwort</label>
        <!-- Fehler: der Ausweg steht dort, wo man ihn braucht -->
        <a href="/passwort-vergessen">Passwort vergessen?</a>
      </div>
      <input id="password" name="password" type="password"
             autocomplete="current-password" required
             aria-invalid="true" aria-describedby="password-error">
      <!-- Fehler: sagt, was passiert ist und was man tun kann.
           aria-describedby liest die Meldung auch dem Screenreader vor -->
      <p class="error" id="password-error">
        E-Mail-Adresse oder Passwort stimmen nicht. Prüfe die Eingabe oder setze das Passwort zurück.
      </p>
    </div>

    <button type="submit">Anmelden</button>
  </form>
</body>
</html>`;

/* ── Bausteine ─────────────────────────────────────────────────────────── */

/** Passwort zurücksetzen: sechs Schritte, drei davon mit Reibung — und was der Code dagegen tun kann. */
function FrictionJourney() {
  return (
    <div className={`${PANEL} overflow-hidden`}>
      <div className="px-5 sm:px-6 py-4 border-b border-(--bg-elevated)">
        <div className={MICRO}>Ein Ablauf, sechs Schritte: Passwort zurücksetzen</div>
      </div>
      <ol className="list-none m-0 p-0 divide-y divide-(--bg-elevated)">
        {JOURNEY.map((step, index) => {
          const Icon = step.icon;
          return (
            <li key={step.label} className="grid gap-x-4 gap-y-2 px-5 sm:px-6 py-3.5 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-start">
              <div className="flex items-center gap-3">
                <span
                  className={`size-8 rounded-full flex items-center justify-center shrink-0 border ${
                    step.friction
                      ? "bg-(--warning-bg) border-(--warning-border) text-(--warning-color)"
                      : "bg-(--bg-base) border-(--bg-elevated) text-(--text-tertiary)"
                  }`}
                >
                  <Icon size={15} />
                </span>
                <span className="text-[14px] font-semibold text-(--text-primary)">
                  <span className="font-mono text-[13px] text-(--text-ghost) mr-1.5">{index + 1}</span>
                  {step.label}
                </span>
              </div>
              {step.friction ? (
                <div className="pl-11 md:pl-0">
                  <div className="text-[13px] leading-[1.6] font-medium text-(--text-primary)">Reibung: {step.friction}</div>
                  <div className="text-[13px] leading-[1.6] text-(--text-secondary)">{step.fix}</div>
                </div>
              ) : (
                <div className="hidden md:block text-[13px] leading-[1.6] text-(--text-ghost) pt-1.5">läuft ohne Nachdenken</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function CheckList({ items }: { items: string[] }) {
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

export default function UxUiBasicsModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      <div className={PAGE}>
        {/* ── TITEL ── */}
        <div className="mb-2">
          <Badge variant="module" dot>Modul {MODULE.number}</Badge>
        </div>
        <h1 className={H1}>UX &amp; UI: Was Entwickler wissen müssen</h1>
        <p className={LEAD}>
          Zwei Begriffe, die ständig verwechselt werden — und eine Fähigkeit, die gerade wichtiger wird: beurteilen zu
          können, ob eine Oberfläche gut ist. Dieses Modul legt das Fundament für alles, was folgt.
        </p>

        <ModuleMeta duration="40 Min." practiceTime="~10 Min." />

        <LearningGoals
          goals={[
            "UX und UI unterscheiden — und an einem Problem erkennen, ob der Ablauf oder die Darstellung hakt",
            "Reibung in einem Ablauf benennen und eine Lösung im Code dazu finden",
            "Die fünf Usability-Komponenten nach Nielsen in konkrete Code-Entscheidungen übersetzen",
            "Den Nutzungskontext als Ausgangspunkt jeder Design-Entscheidung begreifen",
            "Einordnen, was KI beim Bau von Oberflächen übernimmt — und was deine Aufgabe bleibt",
          ]}
        />

        <hr className={HR} />

        {/* ── KERNGEDANKE ── */}
        <p className={EYEBROW}>Kerngedanke</p>
        <InsightRow icon={Zap} title="Nutzer spüren keine Architektur — sie spüren Reibung">
          Ein Formular, das Eingaben verliert. Ein Button, der nicht wie einer aussieht. Eine Funktion, die es gibt, die
          aber niemand findet. Dem Code dahinter kann nichts fehlen — und trotzdem scheitert jemand an der Oberfläche.
          Diese Reibung zu finden und abzubauen, ist die ganze Aufgabe von UX und UI.
        </InsightRow>
        <InsightRow icon={Code2} title="Du triffst längst Design-Entscheidungen">
          Welcher Wert steht vorausgefüllt im Feld? Was passiert, wenn die Liste leer ist? Wie lautet die Fehlermeldung?
          Kein Entwurf beantwortet jede dieser Fragen. Am Ende entscheidet, wer den Code schreibt — also du. Die Frage
          ist nur, ob bewusst oder nebenbei.
        </InsightRow>
        <InsightRow icon={Bot} title="KI schreibt den Code schneller — das Urteil nimmt sie dir nicht ab">
          Eine Oberfläche zu erzeugen kostet heute einen Satz. Zu erkennen, ob sie das richtige Problem löst und warum
          sie unruhig wirkt, kostet Wissen. Genau dieses Wissen vermittelt der Workshop.
        </InsightRow>

        <hr className={HR} />

        {/* ── UX UND UI ── */}
        <p className={EYEBROW}>Die Begriffe</p>
        <h2 className={H2}>UX ist der Ablauf, UI ist die Darstellung</h2>
        <p className={P}>
          <strong className={STRONG}>UX (User Experience)</strong> beschreibt die gesamte Erfahrung, die jemand mit
          einem Produkt macht: Kommt er ans Ziel? Wie viele Schritte braucht er? Versteht er, was passiert ist?{" "}
          <strong className={STRONG}>UI (User Interface)</strong> ist die Schicht, die man dabei sieht und anfasst:
          Schrift, Farbe, Abstände, Schaltflächen.
        </p>

        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 shadow-(--shadow-sm)">
            <div className={`${MICRO} mb-2`}>UX fragt</div>
            <div className="text-[15px] font-bold text-(--text-primary) mb-3">Funktioniert das für den Menschen?</div>
            <CheckList
              items={[
                "Was will die Person erreichen — unabhängig von unserem Feature?",
                "Welche Schritte braucht sie dafür, und welcher davon ist überflüssig?",
                "Wo verliert sie den Überblick oder bricht ab?",
                "Reagiert das System so, wie sie es erwartet?",
              ]}
            />
          </div>
          <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 shadow-(--shadow-sm)">
            <div className={`${MICRO} mb-2`}>UI fragt</div>
            <div className="text-[15px] font-bold text-(--text-primary) mb-3">Sieht man, was zu tun ist?</div>
            <CheckList
              items={[
                "Erkennt man auf einen Blick, was hier das Wichtigste ist?",
                "Sieht das Klickbare klickbar aus?",
                "Ist der Text mühelos lesbar — Größe, Kontrast, Zeilenlänge?",
                "Sehen gleiche Dinge überall gleich aus?",
              ]}
            />
          </div>
        </div>

        <p className={P}>
          Ein Bild, das hängen bleibt: UX ist der <strong className={STRONG}>Grundriss</strong> eines Gebäudes — wo die
          Türen sind, wie man von der Küche ins Bad kommt. UI ist die <strong className={STRONG}>Einrichtung</strong> —
          Licht, Material, Beschilderung. Ein brillanter Grundriss in einem dunklen Haus ohne Schilder ist so nutzlos
          wie ein schöner Raum, aus dem niemand hinausfindet.
        </p>

        <div className={`${PANEL} overflow-hidden`}>
          <div className="hidden sm:grid grid-cols-[minmax(0,3fr)_minmax(0,5fr)_minmax(0,5fr)] gap-4 px-5 py-3 border-b border-(--bg-elevated) bg-(--bg-base)">
            <span className={MICRO}>&nbsp;</span>
            <span className={MICRO}>UX</span>
            <span className={MICRO}>UI</span>
          </div>
          <div className="divide-y divide-(--bg-elevated)">
            {UX_VS_UI.map((row) => (
              <div key={row.label} className="grid gap-x-4 gap-y-1 px-5 py-3.5 sm:grid-cols-[minmax(0,3fr)_minmax(0,5fr)_minmax(0,5fr)]">
                <div className="text-[14px] font-bold text-(--text-primary)">{row.label}</div>
                <div className="text-[13px] leading-[1.6] text-(--text-secondary)">
                  <span className="sm:hidden font-semibold text-(--text-tertiary)">UX: </span>
                  {row.ux}
                </div>
                <div className="text-[13px] leading-[1.6] text-(--text-secondary)">
                  <span className="sm:hidden font-semibold text-(--text-tertiary)">UI: </span>
                  {row.ui}
                </div>
              </div>
            ))}
          </div>
        </div>

        <h3 className={H3}>Probier es aus — wo liegt das Problem?</h3>
        <p className={P}>
          Sechs Situationen aus dem Alltag. Die Einordnung ist keine Wortklauberei:{" "}
          <strong className={STRONG}>Sie entscheidet, wo du reparierst.</strong> Ein Problem im Ablauf löst kein
          Stylesheet, und ein Problem in der Darstellung keine neue Route.
        </p>

        <UxUiSorter />

        <hr className={HR} />

        {/* ── REIBUNG ── */}
        <p className={EYEBROW}>UX in der Praxis</p>
        <h2 className={H2}>Reibung finden: Wo muss jemand nachdenken?</h2>
        <p className={P}>
          Die einfachste UX-Methode braucht kein Werkzeug: Geh einen Ablauf Schritt für Schritt durch und markiere jede
          Stelle, an der jemand <strong className={STRONG}>überlegen, raten, warten oder etwas doppelt eingeben</strong>{" "}
          muss. Das ist Reibung. Am Beispiel „Passwort zurücksetzen“ sieht das so aus — niemand will ein Passwort
          zurücksetzen, man will wieder in sein Konto:
        </p>

        <FrictionJourney />

        <ExplanationBox title="Was das Beispiel zeigt">
          <p>
            Keine der drei Reibungsstellen ist ein Fehler im klassischen Sinn. Der Ablauf funktioniert, die Tests sind
            grün. Trotzdem brechen Menschen genau hier ab. <strong>Und alle drei Lösungen stehen im Code</strong>, nicht
            im Stylesheet: ein übernommener Wert, eine Angabe in der E-Mail, eine Prüfung beim Tippen.
          </p>
        </ExplanationBox>

        <RuleBox>
          Jeder Schritt, den du streichst, und jede Frage, die das System selbst beantworten kann, ist bessere UX — ganz
          ohne Gestaltung. Frag bei jedem Feld: Weiß das System das nicht längst?
        </RuleBox>

        <hr className={HR} />

        {/* ── UI: VERGLEICH ── */}
        <p className={EYEBROW}>UI in der Praxis</p>
        <h2 className={H2}>Gleicher Ablauf, andere Oberfläche</h2>
        <p className={P}>
          Beide Formulare haben denselben Ablauf: E-Mail eingeben, Passwort eingeben, anmelden. An der UX ändert sich
          nichts. Der Unterschied liegt allein in der Darstellung — und er entscheidet, ob man das Formular in zwei
          Sekunden versteht oder erst lesen muss.
        </p>

        <ComparisonPanel
          bad={{
            label: "Funktioniert, aber sagt nichts",
            children: (
              <div className={`${STAGE} flex flex-col gap-2`}>
                <div className="border border-(--bg-elevated) px-2 py-1.5 text-[13px] text-(--text-ghost)">email</div>
                <div className="border border-(--bg-elevated) px-2 py-1.5 text-[13px] text-(--text-ghost)">passwort</div>
                <div className="border border-(--bg-elevated) bg-(--bg-elevated) px-2 py-1.5 text-[13px] text-(--text-tertiary) text-center">
                  senden
                </div>
                <div className="text-[13px] text-(--text-ghost)">passwort vergessen</div>
              </div>
            ),
          }}
          good={{
            label: "Sagt, was zu tun ist",
            children: (
              <div className={`${STAGE} flex flex-col gap-3`}>
                <div>
                  <div className="text-[13px] font-semibold text-(--text-primary) mb-1">E-Mail-Adresse</div>
                  <div className="border-2 border-(--text-primary) rounded-lg px-3 py-2 text-[14px] text-(--text-primary) bg-(--bg-surface)">
                    lena@beispiel.de
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <div className="text-[13px] font-semibold text-(--text-primary)">Passwort</div>
                    <span className="text-[13px] text-(--text-secondary) underline underline-offset-2">Vergessen?</span>
                  </div>
                  <div className="border border-(--text-ghost) rounded-lg px-3 py-2 text-[14px] text-(--text-tertiary) bg-(--bg-surface)">
                    ••••••••
                  </div>
                </div>
                <div className="rounded-lg bg-(--text-primary) text-(--bg-surface) text-[14px] font-semibold text-center py-2.5">
                  Anmelden
                </div>
              </div>
            ),
          }}
        />

        <ExplanationBox>
          <p>
            <strong>Links</strong> verschwindet die Beschriftung, sobald man tippt — sie steht nur als Platzhalter im
            Feld. Der Button ist so grau wie die Felder, „senden“ sagt nicht, was passiert, und der Link ist nicht als
            Link erkennbar.
          </p>
          <p>
            <strong>Rechts</strong> bleibt jedes Label sichtbar, das aktive Feld ist markiert, es gibt genau eine
            gefüllte Hauptaktion mit einem Verb, das das Ergebnis nennt, und der Ausweg „Vergessen?“ steht dort, wo man
            ihn braucht. Kein einziges Element ist dazugekommen — nur Rangfolge. Wie man sie herstellt, zeigt{" "}
            <ModuleRef slug="visual-hierarchy" />.
          </p>
        </ExplanationBox>

        <hr className={HR} />

        {/* ── USABILITY ── */}
        <p className={EYEBROW}>Der Maßstab</p>
        <h2 className={H2}>Usability: Woran man „gut bedienbar“ misst</h2>
        <p className={P}>
          „Es funktioniert“ heißt nicht „man kann es gut bedienen“. Usability macht den Unterschied messbar. Jakob
          Nielsen zerlegt sie in fünf Komponenten — und jede lässt sich in Entscheidungen übersetzen, die du im Code
          triffst:
        </p>

        <div className={`${PANEL} overflow-hidden`}>
          <div className="hidden md:grid grid-cols-[minmax(0,3fr)_minmax(0,4fr)_minmax(0,6fr)] gap-4 px-5 py-3 border-b border-(--bg-elevated) bg-(--bg-base)">
            <span className={MICRO}>Komponente</span>
            <span className={MICRO}>Die Frage dahinter</span>
            <span className={MICRO}>Im Code heißt das</span>
          </div>
          <div className="divide-y divide-(--bg-elevated)">
            {USABILITY.map((row) => (
              <div key={row.name} className="grid gap-x-4 gap-y-1.5 px-5 py-4 md:grid-cols-[minmax(0,3fr)_minmax(0,4fr)_minmax(0,6fr)]">
                <div className="text-[14px] font-bold leading-[1.5] text-(--text-primary)">{row.name}</div>
                <div className="text-[13px] leading-[1.6] text-(--text-tertiary)">{row.question}</div>
                <div className="text-[13px] leading-[1.6] text-(--text-secondary)">{row.code}</div>
              </div>
            ))}
          </div>
        </div>

        <ReferenceBox>
          <p>
            Die fünf Komponenten stammen aus Jakob Nielsens „Usability 101: Introduction to Usability“ (Nielsen Norman
            Group, 2012). Die Norm <strong>ISO 9241-11</strong> fasst denselben Gedanken in einem Satz: Usability ist
            das Ausmaß, in dem bestimmte Nutzer in einem bestimmten <strong>Nutzungskontext</strong> ihre Ziele
            effektiv, effizient und zufriedenstellend erreichen. Der Kontext steht dort nicht zufällig in der
            Definition.
          </p>
        </ReferenceBox>

        <h3 className={H3}>Der Weg dorthin: bauen, prüfen, verbessern</h3>
        <p className={P}>
          Nutzerzentriertes Design klingt nach Methode, ist aber ein Kreislauf, den du aus der agilen Entwicklung
          kennst: <strong className={STRONG}>verstehen</strong>, für wen und wofür du baust —{" "}
          <strong className={STRONG}>gestalten</strong> — <strong className={STRONG}>prüfen</strong> mit echten Menschen
          — und von vorn. Der Unterschied zum gewohnten Ablauf: Geprüft wird nicht nur, ob der Code tut, was im Ticket
          steht, sondern ob ein Mensch damit ans Ziel kommt. Wie das mit wenig Aufwand geht, ist Thema von{" "}
          <ModuleRef slug="understanding-users" />.
        </p>

        <hr className={HR} />

        {/* ── KONTEXT ── */}
        <p className={EYEBROW}>Schlüsselbegriff</p>
        <h2 className={H2}>Nutzungskontext: Gut für wen, wo und womit?</h2>
        <p className={P}>
          Es gibt kein „gutes Interface“ an sich. Dieselben Daten brauchen eine völlig andere Oberfläche, je nachdem,{" "}
          <strong className={STRONG}>wer</strong> sie nutzt, <strong className={STRONG}>wofür</strong>,{" "}
          <strong className={STRONG}>wo</strong> und <strong className={STRONG}>womit</strong>. Eine Wetter-App für zwei
          Menschen:
        </p>

        <div className="grid gap-4 md:grid-cols-2 mb-6">
          {CONTEXT.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 shadow-(--shadow-sm)">
                <div className="flex items-center gap-3 mb-3">
                  <span className="size-9 rounded-lg bg-(--bg-base) border border-(--bg-elevated) flex items-center justify-center text-(--text-secondary) shrink-0">
                    <Icon size={18} />
                  </span>
                  <span className="text-[15px] font-bold text-(--text-primary)">{item.title}</span>
                </div>
                <CheckList items={item.items} />
              </div>
            );
          })}
        </div>

        <TheoryCard label="Vier Fragen, bevor du anfängst">
          <ConceptList>
            <ConceptItem title="Wer nutzt es?">
              Täglich oder einmal im Jahr? Mit Fachwissen oder ohne? Wer ein Werkzeug acht Stunden am Tag bedient,
              braucht Dichte und Tastaturkürzel. Wer es einmal nutzt, braucht Führung.
            </ConceptItem>
            <ConceptItem title="Wofür?">
              Routine oder Ausnahme, entspannt oder unter Zeitdruck? Und: Was kostet ein Fehler — ein Schulterzucken
              oder Geld?
            </ConceptItem>
            <ConceptItem title="Wo?">
              Am Schreibtisch, in der Bahn, in einer Lagerhalle mit Handschuhen, im Sonnenlicht. Der Ort bestimmt
              Kontraste, Zielgrößen und wie viel Aufmerksamkeit übrig ist.
            </ConceptItem>
            <ConceptItem title="Womit?">
              Maus, Finger, Tastatur, Screenreader, schwaches Netz. „Mobile first“ ist keine Frage der Bildschirmbreite,
              sondern des Kontexts: eine Hand, wenig Zeit, wackelige Verbindung.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <RuleBox>
          Wenn zwei Leute über ein Interface streiten, streiten sie meistens über verschiedene Nutzer. Klärt zuerst den
          Kontext — danach erledigen sich viele Geschmacksfragen von selbst.
        </RuleBox>

        <hr className={HR} />

        {/* ── KI ── */}
        <p className={EYEBROW}>Einordnung</p>
        <h2 className={H2}>Was sich mit KI geändert hat — und was nicht</h2>
        <p className={P}>
          Coding-Assistenten erzeugen in Sekunden eine komplette Oberfläche. Das verschiebt, wofür deine Zeit draufgeht:
          weniger fürs Tippen, mehr fürs Entscheiden und Beurteilen. Design-Wissen wird dadurch nicht überflüssig — es
          wird zur Voraussetzung, um gute Ergebnisse zu bekommen.
        </p>

        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5">
            <div className={`${MICRO} mb-3`}>Das übernimmt KI immer besser</div>
            <CheckList items={AI_DOES} />
          </div>
          <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 shadow-(--shadow-md)">
            <div className={`${MICRO} mb-3`}>Das bleibt deine Aufgabe</div>
            <CheckList items={YOU_DO} />
          </div>
        </div>

        <p className={P}>
          Ohne Vorgaben liefert ein Modell das Wahrscheinlichste: eine Oberfläche, die aussieht wie tausend andere und
          niemandem im Besonderen dient. Je genauer du Nutzer, Kontext und Rangfolge benennen kannst, desto besser wird
          das Ergebnis. Wie du einen Auftrag formulierst und einen Entwurf systematisch prüfst, zeigt{" "}
          <ModuleRef slug="ai-workflow" withTitle /> am Ende des Workshops — mit allem, was du bis dahin gelernt hast.
        </p>

        <RuleBox title="Die Regel für diesen Workshop">
          Was du nicht beurteilen kannst, kannst du auch nicht bestellen. Wer nur „mach es schöner“ sagen kann, bekommt
          Zufall. Wer sagen kann, was nicht stimmt und warum, bekommt ein gutes Interface — ob er es selbst schreibt
          oder schreiben lässt.
        </RuleBox>

        <hr className={HR} />

        {/* ── ZUM MITNEHMEN ── */}
        <p className={EYEBROW}>Zum Mitnehmen</p>
        <h2 className={H2}>Ein Login-Formular, das die fünf Komponenten erfüllt</h2>
        <p className={P}>
          Das Formular aus dem Vergleich als eigenständige Datei. Die Kommentare zeigen, welche Zeile zu welcher
          Usability-Komponente gehört — die meisten davon sind HTML-Attribute, kein Design. Als{" "}
          <code className={CODE}>.html</code> speichern und im Browser öffnen; danach einmal nur mit der Tab-Taste
          durchgehen.
        </p>
        <CodeBlock language="HTML + CSS — Login-Formular" code={LOGIN_CODE} />

        <TheoryCard label="Merkliste">
          <ConceptList>
            <ConceptItem title="UX ist der Ablauf, UI die Darstellung">
              Erst klären, wo das Problem liegt — davon hängt ab, ob du Logik oder Styles anfasst.
            </ConceptItem>
            <ConceptItem title="Reibung suchen">
              Jede Stelle, an der jemand überlegen, raten, warten oder doppelt eingeben muss, ist ein Kandidat.
            </ConceptItem>
            <ConceptItem title="Fünf Komponenten als Prüfliste">
              Erlernbarkeit, Effizienz, Einprägsamkeit, Fehler, Zufriedenheit — jede hat eine Entsprechung im Code.
            </ConceptItem>
            <ConceptItem title="Kontext vor Lösung">
              Wer, wofür, wo, womit. Ohne diese vier Antworten ist „gut“ nur eine Meinung.
            </ConceptItem>
            <ConceptItem title="Urteilen können">
              KI liefert Entwürfe. Ob einer davon taugt, entscheidest du — mit den Regeln aus den folgenden Modulen.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        {/* ── AUSBLICK ── */}
        <p className={EYEBROW}>Ausblick</p>
        <h3 className="text-[15px] font-bold leading-[1.4] text-(--text-primary) mt-0 mb-2">So ist der Workshop aufgebaut</h3>
        <p className={P}>
          Vier Teile, die aufeinander aufbauen: erst verstehen, was gebaut wird, dann das visuelle Handwerk, dann das
          System dahinter — und am Ende wendest du alles an einem Dashboard an.
        </p>
        <div className={`${PANEL} overflow-hidden divide-y divide-(--bg-elevated)`}>
          {moduleGroups.map((group, index) => (
            <div key={group.id} className="grid gap-x-4 gap-y-1 px-5 py-3.5 sm:grid-cols-[210px_1fr] sm:items-baseline">
              <div>
                <div className={MICRO}>Teil {index + 1}</div>
                <div className="text-[14px] font-bold text-(--text-primary)">{group.label}</div>
              </div>
              <div className="text-[13px] leading-[1.6] text-(--text-secondary)">
                {modules
                  .filter((module) => module.group === group.id)
                  .map((module) => module.titleDe)
                  .join(" · ")}
              </div>
            </div>
          ))}
        </div>
        <p className={CAPTION}>
          Weiter geht es mit der Frage, die vor jedem Interface steht: Was braucht der Mensch, der es benutzen soll?
        </p>
      </div>

      <ModuleNav prevModule={prevModule} nextModule={nextModule} />
    </div>
  );
}
