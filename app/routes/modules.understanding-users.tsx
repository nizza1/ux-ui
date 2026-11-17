import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Check, FlaskConical, MessageCircleQuestion, UserRound, X } from "lucide-react";
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
import { CodeBlock } from "~/components/ui/CodeBlock";
import { ModuleRef } from "~/components/ui/ModuleRef";
import { NeedFinder } from "~/components/demos/research/NeedFinder";
import { StoryWorkshop } from "~/components/demos/research/StoryWorkshop";
import { StoryToUi } from "~/components/demos/research/StoryToUi";
import { CAPTION, CODE, EYEBROW, H1, H2, H3, HR, LEAD, MICRO, P, PAGE, PANEL, STAGE, STRONG } from "~/components/ui/moduleStyles";

const SLUG = "understanding-users";
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
    title: "Freilegen",
    text: "Hinter dem Feature-Wunsch das Bedürfnis finden. Menschen nennen Lösungen — gebraucht wird der Grund.",
  },
  {
    step: 2,
    title: "Prüfen",
    text: "Mit der leichtesten Methode nachsehen, ob die Annahme stimmt. Fünf Gespräche schlagen fünfzig Vermutungen.",
  },
  {
    step: 3,
    title: "Festhalten",
    text: "Als User Story mit Akzeptanzkriterien aufschreiben — so, dass daraus Zustände der Oberfläche werden.",
  },
];

const METHODS = [
  {
    question: "Wo steigen Leute aus?",
    method: "Analytics, Funnel, Fehler-Logs",
    effort: "1–2 Stunden",
    result: "Das Wo und das Wie-oft. Nie das Warum.",
  },
  {
    question: "Warum steigen sie dort aus?",
    method: "Usability-Test mit fünf Personen",
    effort: "1 Tag",
    result: "Die größten Stolperstellen — selbst beobachtet, nicht vermutet.",
  },
  {
    question: "Was nervt im Alltag am meisten?",
    method: "Support-Tickets, Bewertungen, Vertriebsnotizen lesen",
    effort: "2–3 Stunden",
    result: "Wiederkehrende Probleme in den Worten der Nutzer.",
  },
  {
    question: "Was brauchen sie eigentlich?",
    method: "Fünf Interviews über das letzte konkrete Mal",
    effort: "1 Woche",
    result: "Bedürfnisse, Umwege und den Kontext, in dem dein Produkt benutzt wird.",
  },
  {
    question: "Welche von zwei Varianten ist besser?",
    method: "A/B-Test",
    effort: "Wochen — braucht viel Traffic",
    result: "Eine belastbare Zahl für eine eng gestellte Frage.",
  },
];

const AI_HELPS = [
  "Einen Interview-Leitfaden entwerfen — und ihn auf Suggestivfragen prüfen lassen",
  "Hunderte Support-Tickets oder Transkripte nach Themen ordnen",
  "Annahmen aufspüren: „Welche unbelegten Annahmen stecken in diesem Konzept?“",
  "Notizen aus fünf Gesprächen zu einer Übersicht verdichten",
];

const AI_CANNOT = [
  "Echte Nutzer ersetzen: „Synthetische Nutzer“ antworten plausibel — aus dem Durchschnitt des Internets, nicht aus dem Alltag deiner Kunden",
  "Beobachten, wo jemand tatsächlich hängen bleibt",
  "Überraschen: Das wertvollste Ergebnis von Research ist das, womit niemand gerechnet hat",
  "Für Zitate bürgen: Zusammenfassungen können Aussagen glätten oder erfinden — Stichproben gegen das Original prüfen",
];

const QUALITY = [
  {
    need: "Ich will das richtige Projekt sofort finden.",
    functional: "Projekte lassen sich nach Status und Fälligkeit filtern.",
    quality: "Das Ergebnis erscheint in unter 200 ms.",
  },
  {
    need: "Ich will sicher sein, dass nichts verloren geht.",
    functional: "Änderungen werden automatisch gespeichert.",
    quality: "Spätestens 3 s nach der letzten Eingabe — mit sichtbarer Bestätigung.",
  },
  {
    need: "Ich will das auch unterwegs erledigen.",
    functional: "Alle Kernfunktionen sind auf dem Handy verfügbar.",
    quality: "Mit einer Hand bedienbar, Kontrast nach WCAG AA.",
  },
];

const CRITERIA_CODE = `Angenommen, ich betreue zwölf laufende Projekte,
wenn  ich die Startseite öffne,
dann  sehe ich zuerst die Aufgaben, die heute fällig sind.

Angenommen, heute ist nichts fällig,
wenn  ich die Startseite öffne,
dann  steht das ausdrücklich da — zusammen mit dem, was als Nächstes ansteht.

Angenommen, die Aufgaben können nicht geladen werden,
wenn  ich die Startseite öffne,
dann  erfahre ich, was passiert ist, und kann es erneut versuchen.`;

const BRIEF_CODE = `# Feature-Brief: <Name>

## Problem
Was geht heute schief — und woher wissen wir das?
(Beobachtung, Ticket, Zahl. Noch keine Lösung.)

## Für wen
Rolle und Situation in ein, zwei Sätzen.
Stand: [ ] durch Gespräche belegt   [ ] Annahme

## Bedürfnis
Was will die Person erreichen — unabhängig von unserer Lösung?

## User Story
Als … möchte ich …, damit …

## Akzeptanzkriterien
- Angenommen …, wenn …, dann …
- Angenommen (nichts vorhanden) …, wenn …, dann …
- Angenommen (Fehler) …, wenn …, dann …

## Qualität
Geschwindigkeit · Barrierefreiheit (WCAG AA) · Geräte und Kontext

## Nicht-Ziele
Was wir bewusst nicht bauen.

## Offene Annahmen
Was wir glauben, aber nicht geprüft haben — und wie wir es prüfen.`;

const CONFIRM_CODE = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bestellung bestätigt</title>
<style>
  :root {
    --text-strong: #16191d;
    --text: #414a55;
    --text-muted: #5f6975;   /* 5,6:1 auf Weiß */
    --line: #dfe3e8;
    --surface: #ffffff;
    --page: #f3f5f7;
    --ok: #0f7a4f;
    --focus: #1d4ed8;
  }
  * { box-sizing: border-box; margin: 0; }
  body {
    font-family: system-ui, sans-serif;
    font-size: 15px;
    line-height: 1.5;
    color: var(--text);
    background: var(--page);
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px;
  }
  .confirm {
    width: 100%;
    max-width: 420px;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 32px;
  }

  /* Akzeptanzkriterium 1: eine eindeutige Bestätigung */
  .confirm-icon { color: var(--ok); margin-bottom: 8px; }
  h1 { font-size: 22px; line-height: 1.25; color: var(--text-strong); margin-bottom: 20px; }

  /* Inhalt: was die Unsicherheit beseitigt — in dieser Rangfolge */
  .arrival { font-weight: 600; color: var(--text-strong); }
  .number  { font-size: 14px; color: var(--text-muted); }

  /* Nächster Schritt */
  .next {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--line);
  }
  .button {
    display: inline-block;
    margin-top: 16px;
    padding: 10px 18px;
    border-radius: 8px;
    background: var(--text-strong);
    color: #fff;
    font-weight: 600;
    text-decoration: none;
  }
  .button:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }
</style>
</head>
<body>
  <main class="confirm">
    <svg class="confirm-icon" viewBox="0 0 24 24" width="32" height="32" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
    </svg>
    <h1>Danke, deine Bestellung ist da.</h1>

    <p class="arrival">Ankunft am Donnerstag, 19. November</p>
    <p>3 Artikel · 84,90 €</p>
    <p class="number">Bestellung #48213-DE</p>

    <div class="next">
      <p>Die Bestätigung ist unterwegs an lena@beispiel.de.</p>
      <a class="button" href="/bestellungen/48213">Bestellung ansehen</a>
    </div>
  </main>
</body>
</html>`;

/* ── Bausteine ─────────────────────────────────────────────────────────── */

function MarkList({ items, good }: { items: string[]; good: boolean }) {
  const Icon = good ? Check : X;
  return (
    <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-[13px] leading-[1.6] text-(--text-secondary)">
          <Icon size={15} className={`shrink-0 mt-1 ${good ? "text-(--success-color)" : "text-(--bad-color)"}`} />
          {item}
        </li>
      ))}
    </ul>
  );
}

function Quote({ children, reply }: { children: string; reply?: string }) {
  return (
    <div>
      <div className="text-[14px] font-medium leading-[1.5] text-(--text-primary)">„{children}“</div>
      {reply && <div className="text-[13px] leading-[1.5] text-(--text-tertiary)">{reply}</div>}
    </div>
  );
}

/* ── Seite ─────────────────────────────────────────────────────────────── */

export default function UnderstandingUsersModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      <div className={PAGE}>
        {/* ── TITEL ── */}
        <div className="mb-2">
          <Badge variant="module" dot>Modul {MODULE.number}</Badge>
        </div>
        <h1 className={H1}>Nutzer verstehen: Bedürfnisse, Research &amp; User Stories</h1>
        <p className={LEAD}>
          Das teuerste Feature ist das, das niemand braucht. Dieses Modul zeigt, wie du hinter einem Wunsch das
          Bedürfnis findest, es mit kleinem Aufwand prüfst und so aufschreibst, dass daraus eine Oberfläche wird — ohne
          Research-Abteilung.
        </p>

        <ModuleMeta duration="60 Min." practiceTime="~20 Min." />

        <BuildsOn modules="ux-ui-basics" />
        <LearningGoals
          goals={[
            "Lösungswunsch und Bedürfnis unterscheiden — und mit Rückfragen zum Bedürfnis vordringen",
            "Für eine offene Frage die leichteste passende Research-Methode wählen",
            "Einen Usability-Test mit fünf Personen selbst vorbereiten und durchführen",
            "KI im Research gezielt einsetzen — und wissen, wo sie echte Nutzer nicht ersetzt",
            "Eine Persona auf die fünf Zeilen reduzieren, die Entscheidungen lenken",
            "User Stories mit Akzeptanzkriterien schreiben und daraus die Zustände einer Oberfläche ableiten",
          ]}
        />

        <hr className={HR} />

        {/* ── KERNGEDANKE ── */}
        <p className={EYEBROW}>Kerngedanke</p>
        <InsightRow icon={UserRound} title="Du bist nicht dein Nutzer">
          Du kennst das Datenmodell, die Abkürzungen und jede versteckte Funktion. Genau deshalb kannst du nicht
          einschätzen, wie dein Produkt auf jemanden wirkt, der es zum ersten Mal sieht. Menschen überschätzen
          verlässlich, wie viele andere so denken wie sie selbst.
        </InsightRow>
        <InsightRow icon={MessageCircleQuestion} title="Menschen bestellen Lösungen — gebraucht wird der Grund">
          „Wir brauchen einen Export.“ „Bitte einen Filter.“ Wer um ein Feature bittet, hat sich bereits eine Lösung
          ausgedacht, meist die erstbeste. Baust du genau das, löst du vielleicht das falsche Problem sauber.
        </InsightRow>
        <InsightRow icon={FlaskConical} title="Research ist kein Projekt, sondern eine Gewohnheit">
          Niemand verlangt eine Studie. Ein Nachmittag mit fünf Menschen, die dein Produkt benutzen, zeigt mehr als
          jede Diskussion im Team — und kostet weniger als das Feature, das danach niemand verwendet.
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

        <ReferenceBox className="mt-6">
          <p>
            Die Nielsen Norman Group nennt das den <strong>False-Consensus-Effekt</strong>: die Neigung anzunehmen, dass
            andere die eigenen Ansichten und Gewohnheiten teilen (Raluca Budiu, „You Are Not the User: The
            False-Consensus Effect“, 2017). Wer ein Produkt baut, ist davon besonders betroffen — niemand kennt es
            besser, und niemand ist deshalb weiter vom Erstnutzer entfernt.
          </p>
        </ReferenceBox>

        <hr className={HR} />

        {/* ── SCHRITT 1 ── */}
        <p className={EYEBROW}>Schritt 1 — Freilegen</p>
        <h2 className={H2}>Bedürfnis statt Lösungswunsch</h2>
        <p className={P}>
          Ein Bedürfnis beschreibt, was jemand <strong className={STRONG}>erreichen</strong> will. Ein Lösungswunsch
          beschreibt, <strong className={STRONG}>womit</strong>. Der Unterschied entscheidet über deinen Spielraum: Der
          Wunsch lässt genau eine Umsetzung zu, das Bedürfnis viele — darunter oft eine einfachere.
        </p>

        <ComparisonPanel
          bad={{
            label: "Lösungswunsch",
            children: (
              <div className={`${STAGE} flex flex-col gap-2`}>
                <Quote>Ich möchte einen Filter-Button auf dieser Seite.</Quote>
                <p className={CAPTION}>
                  Legt das Bauteil fest. Ob es das Problem löst, weiß niemand — auch die Person nicht, die es bestellt.
                </p>
              </div>
            ),
          }}
          good={{
            label: "Bedürfnis",
            children: (
              <div className={`${STAGE} flex flex-col gap-2`}>
                <Quote>Ich will das richtige Teil finden, auch wenn ich nur das Gerät kenne.</Quote>
                <p className={CAPTION}>
                  Offen für viele Wege: Einstieg über das Gerät, eine bessere Suche, zuletzt bestellte Teile — oder
                  doch ein Filter.
                </p>
              </div>
            ),
          }}
        />

        <h3 className={H3}>Probier es aus — frag dreimal nach</h3>
        <p className={P}>
          Die Technik ist alt und simpel: Frag so lange „Warum?“, bis die Antwort kein Bauteil mehr enthält. Drei
          Wünsche, wie sie in jedem Backlog stehen.{" "}
          <strong className={STRONG}>Achte darauf, wann der ursprüngliche Wunsch aufhört, die naheliegende Lösung zu sein.</strong>
        </p>

        <NeedFinder />

        <RuleBox>
          Nimm den Wunsch ernst, aber nicht wörtlich. Er ist ein Hinweis darauf, dass ein Problem existiert — nicht die
          Anleitung, wie es zu lösen ist. Und manchmal, wie beim Dark Mode, stellt sich heraus: Der Wunsch war richtig.
          Dann weißt du jetzt, wofür.
        </RuleBox>

        <hr className={HR} />

        {/* ── SCHRITT 2 ── */}
        <p className={EYEBROW}>Schritt 2 — Prüfen</p>
        <h2 className={H2}>Research für Entwickler: klein, schnell, regelmäßig</h2>
        <p className={P}>
          Bis hierher hast du eine Vermutung. Research macht daraus Wissen — oder zeigt, dass die Vermutung falsch war,
          bevor du eine Woche daran gebaut hast. Zwei Arten von Erkenntnis ergänzen sich dabei:{" "}
          <strong className={STRONG}>Zahlen sagen, was passiert. Menschen sagen, warum.</strong>
        </p>

        <ComparisonPanel
          bad={{
            label: "Nur die Zahlen",
            children: (
              <div className={`${STAGE} flex flex-col gap-2`}>
                <div className="text-[14px] font-semibold text-(--text-primary)">60 % brechen bei Schritt 3 ab.</div>
                <p className={CAPTION}>
                  Du weißt, dass etwas nicht stimmt — aber nicht, was. Jede Reparatur ist geraten.
                </p>
              </div>
            ),
          }}
          good={{
            label: "Zahlen und Beobachtung",
            children: (
              <div className={`${STAGE} flex flex-col gap-2`}>
                <div className="text-[14px] font-semibold text-(--text-primary)">60 % brechen bei Schritt 3 ab.</div>
                <Quote>Hier wird meine Steuernummer verlangt. Die habe ich nicht im Kopf — ich mach das später.</Quote>
                <p className={CAPTION}>Jetzt ist klar, was zu tun ist: das Feld optional machen oder nach hinten verschieben.</p>
              </div>
            ),
          }}
        />

        <h3 className={H3}>Welche Frage — welche Methode?</h3>
        <p className={P}>
          Du brauchst kein Methodenlexikon. Fünf Fragen decken fast alles ab, was im Entwickleralltag vorkommt. Beginne
          immer mit der billigsten Methode, die deine Frage beantworten kann.
        </p>

        <div className={`${PANEL} overflow-hidden`}>
          <div className="hidden md:grid grid-cols-[minmax(0,5fr)_minmax(0,5fr)_minmax(0,3fr)_minmax(0,6fr)] gap-4 px-5 py-3 border-b border-(--bg-elevated) bg-(--bg-base)">
            <span className={MICRO}>Deine Frage</span>
            <span className={MICRO}>Methode</span>
            <span className={MICRO}>Aufwand</span>
            <span className={MICRO}>Was du bekommst</span>
          </div>
          <div className="divide-y divide-(--bg-elevated)">
            {METHODS.map((row) => (
              <div key={row.question} className="grid gap-x-4 gap-y-1 px-5 py-4 md:grid-cols-[minmax(0,5fr)_minmax(0,5fr)_minmax(0,3fr)_minmax(0,6fr)]">
                <div className="text-[14px] font-bold leading-[1.5] text-(--text-primary)">{row.question}</div>
                <div className="text-[13px] leading-[1.6] text-(--text-secondary)">{row.method}</div>
                <div className="font-mono text-[13px] leading-[1.6] text-(--text-tertiary)">{row.effort}</div>
                <div className="text-[13px] leading-[1.6] text-(--text-secondary)">{row.result}</div>
              </div>
            ))}
          </div>
        </div>

        <h3 className={H3}>Die wichtigste Methode: der Usability-Test mit fünf Personen</h3>
        <p className={P}>
          Wenn du nur eine Methode lernst, dann diese. Du gibst jemandem eine Aufgabe, schaust zu und hältst den Mund.
          Mehr ist es nicht — und es deckt Probleme auf, die im Team niemand mehr sieht.
        </p>

        <TheoryCard label="Usability-Test in fünf Schritten">
          <ConceptList>
            <ConceptItem title="Eine Aufgabe stellen, keine Frage">
              „Bestell einen Cappuccino zum Mitnehmen“ statt „Findest du den Bestell-Button?“. Die Aufgabe nennt das
              Ziel, nie den Weg und nie die Wörter, die auf der Oberfläche stehen.
            </ConceptItem>
            <ConceptItem title="Fünf Personen aus der Zielgruppe">
              Nicht das eigene Team und nicht, wer das Produkt schon kennt. Fünf reichen, um die größten Probleme zu
              finden.
            </ConceptItem>
            <ConceptItem title="Laut denken lassen — und nicht helfen">
              Bitte die Person auszusprechen, was sie sucht und erwartet. Wenn sie hängt, hilf nicht. Genau diese
              Stelle ist dein Ergebnis.
            </ConceptItem>
            <ConceptItem title="Beobachten, was passiert — nicht, was gesagt wird">
              „Sieht gut aus“ ist Höflichkeit. Dass jemand dreimal auf die falsche Stelle klickt, ist ein Befund.
              Notiere Verhalten, keine Meinungen.
            </ConceptItem>
            <ConceptItem title="Die drei größten Probleme beheben, dann wieder testen">
              Keine Liste mit vierzig Punkten. Was mehrere Personen aufgehalten hat, wird repariert — danach folgt die
              nächste kleine Runde.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <ReferenceBox>
          <p>
            Die Zahl fünf geht auf Jakob Nielsen zurück („Why You Only Need to Test with 5 Users“, Nielsen Norman
            Group, 2000): Fünf Testpersonen decken nach seinen Daten rund <strong>85 %</strong> der Usability-Probleme
            auf, jede weitere fördert vor allem Bekanntes zutage. Seine Empfehlung daraus: lieber{" "}
            <strong>drei Runden mit je fünf Personen</strong> als eine Runde mit fünfzehn — weil du zwischen den Runden
            verbessern kannst.
          </p>
        </ReferenceBox>

        <h3 className={H3}>Im Gespräch: nach der Vergangenheit fragen, nicht nach der Zukunft</h3>
        <p className={P}>
          Menschen sind schlecht darin, ihr künftiges Verhalten vorherzusagen, und zu höflich, um deine Idee schlecht
          zu finden. Verlässlich ist nur, was sie tatsächlich getan haben.
        </p>

        <ComparisonPanel
          bad={{
            label: "Meinung über die Zukunft",
            children: (
              <div className={`${STAGE} flex flex-col gap-3`}>
                <Quote reply="— „Ja, klar, wäre praktisch.“">Würdest du eine Export-Funktion nutzen?</Quote>
                <Quote reply="— „Gefällt mir.“">Wie findest du unsere Idee?</Quote>
                <p className={CAPTION}>Freundliche Antworten, aus denen nichts folgt.</p>
              </div>
            ),
          }}
          good={{
            label: "Verhalten in der Vergangenheit",
            children: (
              <div className={`${STAGE} flex flex-col gap-3`}>
                <Quote>Erzähl mir vom letzten Mal, als du Zahlen weitergeben musstest.</Quote>
                <Quote>Was hast du dann gemacht? Was war daran mühsam?</Quote>
                <p className={CAPTION}>Eine konkrete Geschichte — mit dem Umweg, den die Person heute geht.</p>
              </div>
            ),
          }}
        />

        <ReferenceBox>
          <p>
            Rob Fitzpatrick hat daraus in „The Mom Test“ (2013) drei Regeln gemacht: über das Leben der Person sprechen
            statt über die eigene Idee, nach konkreten Situationen in der Vergangenheit fragen statt nach Meinungen
            über die Zukunft — und weniger reden, mehr zuhören.
          </p>
        </ReferenceBox>

        <hr className={HR} />

        {/* ── KI IM RESEARCH ── */}
        <p className={EYEBROW}>Einordnung</p>
        <h2 className={H2}>KI im Research: Assistentin, nicht Ersatz</h2>
        <p className={P}>
          Sprachmodelle nehmen dir beim Research echte Arbeit ab — vor allem das Ordnen großer Textmengen. Sie können
          aber nur verarbeiten, was jemand aufgeschrieben hat. Was deine Nutzer in ihrem Alltag erleben, steht in
          keinem Trainingsdatensatz.
        </p>

        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 shadow-(--shadow-md)">
            <div className={`${MICRO} mb-3`}>Dafür ist KI gut</div>
            <MarkList items={AI_HELPS} good />
          </div>
          <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5">
            <div className={`${MICRO} mb-3`}>Das kann sie nicht</div>
            <MarkList items={AI_CANNOT} good={false} />
          </div>
        </div>

        <ReferenceBox>
          <p>
            Die Nielsen Norman Group hat KI-erzeugte Testpersonen untersucht und kommt zu einem klaren Schluss:
            Für ein paar Zwecke, etwa um Hypothesen zu sammeln, können sie nützlich sein —{" "}
            <strong>Nutzerforschung braucht echte Nutzer</strong> (Maria Rosala und Kate Moran, „Synthetic Users: If,
            When, and How to Use AI-Generated ‚Research‘“, 2024).
          </p>
        </ReferenceBox>

        <ExplanationBox title="Bevor du Gesprächsnotizen in ein KI-Werkzeug gibst">
          <p>
            Mitschnitte, Transkripte und Tickets enthalten personenbezogene Daten. Namen, E-Mail-Adressen und
            Kundennummern gehören vorher entfernt — und es muss geklärt sein, ob das Werkzeug in deinem Unternehmen
            für solche Daten freigegeben ist.
          </p>
        </ExplanationBox>

        <RuleBox>
          KI liefert Hypothesen. Belege liefern nur Menschen, die dein Produkt benutzen. Nutze das eine, um das andere
          besser vorzubereiten — nicht, um es zu überspringen.
        </RuleBox>

        <hr className={HR} />

        {/* ── PERSONA ── */}
        <p className={EYEBROW}>Werkzeug</p>
        <h2 className={H2}>Persona in fünf Zeilen</h2>
        <p className={P}>
          Eine Persona fasst zusammen, was du über eine Gruppe von Nutzern gelernt hast — damit das Team bei jeder
          Entscheidung dieselbe Person vor Augen hat. Brauchbar ist sie nur, wenn jede Zeile{" "}
          <strong className={STRONG}>eine Entscheidung beeinflusst</strong>. Alter, Hobbys und Lieblingskaffee tun das
          nie.
        </p>

        <ComparisonPanel
          bad={{
            label: "Steckbrief",
            children: (
              <div className={`${STAGE} flex flex-col gap-1.5`}>
                <div className="text-[15px] font-bold text-(--text-primary)">Max, 34</div>
                <div className="text-[13px] leading-[1.6] text-(--text-secondary)">
                  Marketing-Manager · verheiratet, zwei Kinder · fährt Rennrad · trinkt Flat White
                </div>
                <Quote>Ich liebe Technik!</Quote>
                <p className={`${CAPTION} pt-1.5`}>
                  Keine dieser Angaben ändert eine einzige Entscheidung am Interface. Und das Zitat hat niemand gesagt.
                </p>
              </div>
            ),
          }}
          good={{
            label: "Verhalten und Ziel",
            children: (
              <div className={`${STAGE} flex flex-col gap-1.5`}>
                <div className="text-[15px] font-bold text-(--text-primary)">Sarah, Teamleiterin</div>
                <div className="text-[13px] leading-[1.6] text-(--text-secondary)">
                  Betreut zwölf Projekte, sitzt den halben Tag in Terminen. Will morgens in zwei Minuten sehen, wo es
                  brennt. Der Status steckt in drei Tools — sie fragt deshalb per Chat nach. Schaut zwischen Terminen
                  aufs Handy.
                </div>
                <Quote>Ich will nicht suchen müssen. Ich will gesagt bekommen, wo ich hinschauen soll.</Quote>
                <p className={`${CAPTION} pt-1.5`}>
                  Jede Zeile hat eine Folge: Übersicht zuerst, das Dringende oben, auf dem Handy nutzbar.
                </p>
              </div>
            ),
          }}
        />

        <TheoryCard label="Die fünf Zeilen">
          <ConceptList>
            <ConceptItem title="Rolle und Situation">
              Wer ist die Person im Verhältnis zu deinem Produkt, und in welcher Lage benutzt sie es? Ein Satz.
            </ConceptItem>
            <ConceptItem title="Ziel">
              Was will sie erreichen — als Ergebnis formuliert, nicht als Feature.
            </ConceptItem>
            <ConceptItem title="Hindernis">
              Was hält sie heute davon ab, und welchen Umweg geht sie stattdessen? Hier liegt deine Chance.
            </ConceptItem>
            <ConceptItem title="Verhalten und Kontext">
              Gerät, Häufigkeit, Zeitdruck, Vorwissen — alles, was aus <ModuleRef slug="ux-ui-basics" /> zum
              Nutzungskontext gehört.
            </ConceptItem>
            <ConceptItem title="Ein Zitat, das jemand wirklich gesagt hat">
              Aus einem Gespräch, mit Quelle. Es ist die Abkürzung für Diskussionen: „Sarah will nicht suchen müssen.“
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <p className={P}>
          Der Test für jede Persona: Kannst du in einer Design-Diskussion fragen{" "}
          <strong className={STRONG}>„Was würde Sarah hier tun?“</strong> und bekommst eine Antwort, die etwas
          entscheidet? Wenn ja, taugt sie. Zwei bis drei Personas genügen für die meisten Produkte — würden zwei davon
          überall gleich entscheiden, sind sie eine.
        </p>

        <ExplanationBox title="Personas aus der KI">
          <p>
            Eine Persona zu generieren dauert zehn Sekunden — und genau das ist das Problem.{" "}
            <strong>Sie sieht belegt aus, ist es aber nicht.</strong> Als Startpunkt ist das in Ordnung, solange du sie
            als das kennzeichnest, was sie ist: eine Annahme. Ersetze Zeile für Zeile durch das, was du in echten
            Gesprächen hörst, und streiche, was sich nicht bestätigt.
          </p>
        </ExplanationBox>

        <hr className={HR} />

        {/* ── SCHRITT 3 ── */}
        <p className={EYEBROW}>Schritt 3 — Festhalten</p>
        <h2 className={H2}>User Stories: das Bedürfnis in einem Satz</h2>
        <p className={P}>
          Eine User Story ist das Format, in dem ein Bedürfnis im Backlog landet. Sie hat drei Teile, und jeder hat
          eine Aufgabe: <strong className={STRONG}>wer</strong> (für wen bauen wir),{" "}
          <strong className={STRONG}>was</strong> (was soll möglich sein) und{" "}
          <strong className={STRONG}>wozu</strong> (woran messen wir die Lösung).
        </p>

        <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl px-5 py-4 mb-6 font-mono text-[14px] leading-[1.7] text-(--text-tertiary) shadow-(--shadow-sm)">
          Als <span className="font-semibold text-(--text-primary)">[Rolle in einer Situation]</span> möchte ich{" "}
          <span className="font-semibold text-(--text-primary)">[etwas tun oder wissen können]</span>, damit{" "}
          <span className="font-semibold text-(--text-primary)">[ein Nutzen entsteht]</span>.
        </div>

        <h3 className={H3}>Probier es aus — die Story-Werkstatt</h3>
        <p className={P}>
          Das Startbeispiel macht die drei häufigsten Fehler auf einmal. Verbessere es, bis alle drei Prüfungen
          bestanden sind — oder schreib eine Story aus deinem eigenen Projekt.
        </p>

        <StoryWorkshop />

        <h3 className={H3}>Akzeptanzkriterien: Wann ist die Story erfüllt?</h3>
        <p className={P}>
          Die Story sagt, was erreicht werden soll. Akzeptanzkriterien sagen, woran man es erkennt — im Format, das du
          aus Tests kennst: <strong className={STRONG}>Angenommen … wenn … dann …</strong> Schreib nicht nur den
          Idealfall auf:
        </p>

        <CodeBlock language="Akzeptanzkriterien" code={CRITERIA_CODE} />

        <RuleBox>
          Jedes „Angenommen“ ist ein Zustand deiner Oberfläche. Drei Kriterien — gefüllt, leer, Fehler — ergeben drei
          Ansichten, die jemand gestalten muss. Wer nur den Idealfall aufschreibt, überlässt die anderen dem Zufall.
          Mehr dazu in <ModuleRef slug="structure-flows" />.
        </RuleBox>

        <h3 className={H3}>Vergiss die Qualität nicht</h3>
        <p className={P}>
          Hinter jedem Bedürfnis steckt neben der Funktion eine Erwartung an das <em>Wie</em>: schnell, zuverlässig,
          für alle bedienbar. Diese Anforderungen stehen selten im Ticket und entscheiden trotzdem, ob sich das
          Ergebnis gut anfühlt.
        </p>

        <div className={`${PANEL} overflow-hidden`}>
          <div className="hidden md:grid grid-cols-3 gap-4 px-5 py-3 border-b border-(--bg-elevated) bg-(--bg-base)">
            <span className={MICRO}>Bedürfnis</span>
            <span className={MICRO}>Was das System tut</span>
            <span className={MICRO}>Wie gut es das tut</span>
          </div>
          <div className="divide-y divide-(--bg-elevated)">
            {QUALITY.map((row) => (
              <div key={row.need} className="grid gap-x-4 gap-y-1 px-5 py-4 md:grid-cols-3">
                <div className="text-[14px] font-semibold leading-[1.5] text-(--text-primary)">„{row.need}“</div>
                <div className="text-[13px] leading-[1.6] text-(--text-secondary)">{row.functional}</div>
                <div className="text-[13px] leading-[1.6] text-(--text-secondary)">{row.quality}</div>
              </div>
            ))}
          </div>
        </div>

        <hr className={HR} />

        {/* ── STORY → UI ── */}
        <p className={EYEBROW}>Die Brücke zum Interface</p>
        <h2 className={H2}>Von der Story zum Screen</h2>
        <p className={P}>
          Eine gute Story enthält die Oberfläche bereits — man muss sie nur ableiten. Klick dich durch die fünf
          Schritte und beobachte, wie rechts ein Screen entsteht.{" "}
          <strong className={STRONG}>Kein Element steht dort, weil es üblich ist. Jedes beantwortet eine Frage aus der Story.</strong>
        </p>

        <StoryToUi />

        <ExplanationBox title="Was die Ableitung zeigt">
          <p>
            Der erste Entwurf — eine kurze Einblendung — erfüllt das Kriterium formal: Es gibt eine Bestätigung. Erst
            der Nutzen aus der Story („damit ich nicht aus Unsicherheit ein zweites Mal bestelle“) macht klar, dass das
            nicht reicht. <strong>Dafür ist das „damit“ da:</strong> Es ist der Maßstab, an dem du zwischen zwei
            Lösungen entscheidest.
          </p>
        </ExplanationBox>

        <hr className={HR} />

        {/* ── ZUM MITNEHMEN ── */}
        <p className={EYEBROW}>Zum Mitnehmen</p>
        <h2 className={H2}>Ein Feature-Brief für dein nächstes Ticket</h2>
        <p className={P}>
          Die Vorlage fasst das Modul auf einer Seite zusammen. Sie passt in ein Ticket, ein Pull-Request-Template oder
          eine <code className={CODE}>.md</code>-Datei im Repository. Und sie hat einen zweiten Nutzen: Genau diese
          Angaben braucht auch ein KI-Assistent, um mehr als den Durchschnitt zu liefern — darauf baut{" "}
          <ModuleRef slug="ai-workflow" /> auf.
        </p>
        <CodeBlock language="Markdown — Feature-Brief" code={BRIEF_CODE} />

        <h3 className={H3}>Die Bestellbestätigung als eigenständige Datei</h3>
        <p className={P}>
          Der Screen aus der Ableitung, mit HTML und CSS in einem Stück. Die Kommentare verweisen auf das Kriterium,
          aus dem das jeweilige Element entstanden ist.
        </p>
        <CodeBlock language="HTML + CSS — Bestellbestätigung" code={CONFIRM_CODE} />

        <TheoryCard label="Merkliste">
          <ConceptList>
            <ConceptItem title="Du bist nicht dein Nutzer">
              Was dir selbstverständlich erscheint, ist es für Erstnutzer nicht. Prüfen statt annehmen.
            </ConceptItem>
            <ConceptItem title="Warum, warum, warum">
              Frag nach, bis die Antwort kein Bauteil mehr enthält. Dann kennst du das Bedürfnis.
            </ConceptItem>
            <ConceptItem title="Die billigste Methode zuerst">
              Tickets lesen, Zahlen ansehen, fünf Leuten zuschauen — in dieser Reihenfolge.
            </ConceptItem>
            <ConceptItem title="Verhalten schlägt Meinung">
              Frag nach dem letzten Mal, nicht nach dem nächsten. Beobachte, statt zu erklären.
            </ConceptItem>
            <ConceptItem title="KI ordnet, Menschen belegen">
              Sprachmodelle helfen beim Vorbereiten und Auswerten. Die Daten kommen von echten Nutzern.
            </ConceptItem>
            <ConceptItem title="Wer, was, wozu — plus Kriterien">
              Eine Story ohne „damit“ hat keinen Maßstab. Kriterien ohne Leer- und Fehlerfall sind unvollständig.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <p className={EYEBROW}>Ausblick</p>
        <p className={P}>
          Du weißt jetzt, was gebaut werden soll und woran man es misst. Als Nächstes geht es um die Form: Wie ordnest
          du Inhalte, wie sieht der Ablauf aus, und welche Zustände braucht jede Ansicht — bevor die erste Farbe ins
          Spiel kommt. Weiter mit <ModuleRef slug="structure-flows" withTitle />.
        </p>
      </div>

      <ModuleNav prevModule={prevModule} nextModule={nextModule} />
    </div>
  );
}
