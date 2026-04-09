import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Layers,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Type,
  Bold,
  Droplets,
  MoveVertical,
  Square,
  Lightbulb,
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
import { LiveEditor } from "~/components/live-editor/LiveEditor";
import type { PropertyControl } from "~/components/live-editor/types";

const EXERCISE_HTML = `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: system-ui, sans-serif; padding: 32px; background: #f4f4f8; }

  .card {
    max-width: 420px;
    background: #ffffff;
    border: 1px solid #eeeef4;
    border-radius: 12px;
    padding: 16px;
  }

  /* ── Header row ── */
  .header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
  .avatar {
    width: 36px; height: 36px; border-radius: 50%; background: #eeeef4;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 400; color: #12121e; flex-shrink: 0;
  }
  .meta { flex: 1; }

  .name        { font-size: 13px; font-weight: 400; color: #12121e; margin-bottom: 2px; }
  .action-text { font-size: 13px; font-weight: 400; color: #12121e; margin-bottom: 2px; }
  .timestamp   { font-size: 13px; font-weight: 400; color: #12121e; }

  /* ── Quote ── */
  .quote {
    background: #f4f4f8; border-radius: 8px;
    padding: 8px 12px; margin-bottom: 12px;
    font-size: 13px; font-weight: 400; color: #12121e; line-height: 1.5;
  }

  /* ── Buttons ── */
  .actions { display: flex; gap: 8px; flex-wrap: wrap; }
  .btn {
    font-family: inherit; font-size: 13px; font-weight: 400;
    color: #12121e; background: #eeeef4; border: 1px solid #eeeef4;
    padding: 6px 14px; border-radius: 8px; cursor: pointer;
  }
</style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="avatar">LK</div>
      <div class="meta">
        <div class="name">Lena Kaufmann</div>
        <div class="action-text">hat deinen Kommentar zu <strong style="font-weight:400">&bdquo;Q3 Roadmap Review&ldquo;</strong> beantwortet.</div>
        <div class="timestamp">vor 5 Minuten &middot; Projekt: Design System</div>
      </div>
    </div>
    <div class="quote">&bdquo;Stimme dir zu &mdash; wir sollten das bis Ende Sprint 3 abschlie&szlig;en.&ldquo;</div>
    <div class="actions">
      <button class="btn btn-reply">Antworten</button>
      <button class="btn btn-read">Als gelesen markieren</button>
      <button class="btn btn-ignore">Ignorieren</button>
    </div>
  </div>
</body>
</html>`;

const EXERCISE_CONTROLS: PropertyControl[] = [
  // Typography — name (primary)
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
    id: "name-size",
    property: "fontSize",
    label: "Name — Font Size",
    type: "slider",
    target: ".name",
    group: "typography",
    defaultValue: 13,
    min: 12, max: 20, step: 1, unit: "px",
  },
  // Typography — action text (secondary)
  {
    id: "action-weight",
    property: "fontWeight",
    label: "Action Text — Font Weight",
    type: "select",
    target: ".action-text",
    group: "typography",
    defaultValue: "400",
    options: [
      { label: "400 Regular", value: "400" },
      { label: "500 Medium", value: "500" },
      { label: "600 Semibold", value: "600" },
    ],
  },
  // Typography — timestamp (tertiary)
  {
    id: "timestamp-size",
    property: "fontSize",
    label: "Timestamp — Font Size",
    type: "slider",
    target: ".timestamp",
    group: "typography",
    defaultValue: 13,
    min: 11, max: 15, step: 1, unit: "px",
  },
  // Colors — hierarchy through color
  {
    id: "name-color",
    property: "color",
    label: "Name — Color",
    type: "color",
    target: ".name",
    group: "colors",
    defaultValue: "#12121e",
  },
  {
    id: "action-color",
    property: "color",
    label: "Action Text — Color",
    type: "color",
    target: ".action-text",
    group: "colors",
    defaultValue: "#12121e",
  },
  {
    id: "timestamp-color",
    property: "color",
    label: "Timestamp — Color",
    type: "color",
    target: ".timestamp",
    group: "colors",
    defaultValue: "#12121e",
  },
  // Buttons — hierarchy
  {
    id: "btn-reply-bg",
    property: "backgroundColor",
    label: "Reply Button — Background",
    type: "color",
    target: ".btn-reply",
    group: "colors",
    defaultValue: "#eeeef4",
  },
  {
    id: "btn-reply-color",
    property: "color",
    label: "Reply Button — Text Color",
    type: "color",
    target: ".btn-reply",
    group: "colors",
    defaultValue: "#12121e",
  },
  {
    id: "btn-reply-weight",
    property: "fontWeight",
    label: "Reply Button — Weight",
    type: "select",
    target: ".btn-reply",
    group: "typography",
    defaultValue: "400",
    options: [
      { label: "400 Regular", value: "400" },
      { label: "500 Medium", value: "500" },
      { label: "600 Semibold", value: "600" },
    ],
  },
  {
    id: "btn-ignore-color",
    property: "color",
    label: "Ignore Button — Text Color",
    type: "color",
    target: ".btn-ignore",
    group: "colors",
    defaultValue: "#12121e",
  },
  {
    id: "btn-ignore-bg",
    property: "backgroundColor",
    label: "Ignore Button — Background",
    type: "color",
    target: ".btn-ignore",
    group: "colors",
    defaultValue: "#eeeef4",
  },
  // Borders
  {
    id: "btn-reply-border",
    property: "border",
    label: "Reply Button — Border",
    type: "toggle",
    target: ".btn-reply",
    group: "borders",
    defaultValue: "1px solid #eeeef4",
    options: [{ label: "Accent border", value: "1px solid #0ea5a0" }],
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
  // Shadows
  {
    id: "card-shadow",
    property: "boxShadow",
    label: "Card — Shadow",
    type: "select",
    target: ".card",
    group: "shadows",
    defaultValue: "none",
    options: [
      { label: "None", value: "none" },
      { label: "SM", value: "0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)" },
      { label: "MD", value: "0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)" },
    ],
  },
];


export const meta: MetaFunction = () => [
  { title: "Visual Hierarchy — UX/UI Workshop" },
];

export async function loader({ params: _ }: LoaderFunctionArgs) {
  const slug = "visual-hierarchy";
  const currentIndex = modules.findIndex((m) => m.slug === slug);
  const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule =
    currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;
  return { prevModule, nextModule };
}

export default function VisualHierarchyModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      <div className="max-w-[900px] mx-auto w-full px-8 py-12 flex-1">

        {/* ── PAGE 1: TITLE ── */}
        <div className="mb-2">
          <Badge variant="module" dot>Modul 02</Badge>
        </div>

        <h1 className="text-[clamp(28px,4vw,36px)] font-extrabold leading-[1.15] tracking-[-0.5px] text-(--text-primary) mb-2 mt-0">Visuelle Hierarchie</h1>
        <p className="text-[15px] font-medium leading-normal text-(--text-secondary) mb-8 mt-0 max-w-130">
          Das wirkungsvollste Werkzeug im UI-Design — und warum ein Interface
          ohne Hierarchie immer wie eine Wand aus Text wirkt, egal wie sauber
          der Code dahinter ist.
        </p>

        <ModuleMeta duration="60 Minuten" practiceTime="~20 Min." />

        <LearningGoals
          goals={[
            "Erklären, was visuelle Hierarchie ist und warum sie die Grundlage jedes guten Interfaces bildet",
            "Die drei Hierarchie-Ebenen (primär, sekundär, tertiär) in einer bestehenden UI benennen",
            "Die fünf Werkzeuge der Hierarchie (Größe, Gewicht, Farbe, Kontrast, Spacing) gezielt einsetzen",
            'Das Prinzip \u201EBetone durch Debetonung\u201C anwenden \u2014 unwichtige Elemente zur\u00FCcktreten lassen',
            "Button-Hierarchie (Primary / Secondary / Tertiary) korrekt umsetzen",
          ]}
        />

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Kerngedanke</p>

        <InsightRow
          icon={Layers}
          title="Hierarchie ist keine Ästhetik — sie ist Kommunikation"
        >
          Wenn ein Nutzer dein Interface öffnet, stellt er unbewusst sofort die
          Frage: „Was soll ich als Erstes tun?" Visuelle Hierarchie beantwortet
          diese Frage, ohne dass ein einziges Wort erklärt werden muss. Fehlt
          die Hierarchie, muss der Nutzer die Antwort selbst suchen — und das
          kostet Vertrauen.
        </InsightRow>

        <InsightRow
          icon={Eye}
          title="Das Auge folgt Unterschieden, nicht Inhalten"
        >
          Ein großes, fettes Element zieht Blicke auf sich — unabhängig davon,
          was drin steht. Deshalb ist visuelle Hierarchie erlernbar und
          systematisch anwendbar: Sie basiert auf messbaren Eigenschaften wie
          Größe, Gewicht und Kontrast, nicht auf künstlerischem Gespür.
        </InsightRow>

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── PAGE 2: DIE DREI EBENEN ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Theorie</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">Die drei Hierarchie-Ebenen</h2>

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Jedes UI-Element gehört zu einer von drei Ebenen. Das ist keine
          strenge Regel, sondern ein Denkmodell:{" "}
          <strong>
            Was muss zuerst gesehen werden? Was unterstützt? Was tritt zurück?
          </strong>{" "}
          Wer diese Fragen für jedes Element beantwortet, gestaltet bereits
          deutlich klarer als der Durchschnitt.
        </p>

        <TheoryCard label="Die drei Ebenen im Detail">
          <ConceptList>
            <ConceptItem title="Primär — die eine wichtigste Information">
              Was soll der Nutzer sofort sehen? Auf einer Profilseite: der Name.
              Auf einem Dashboard: die Kernmetrik. Auf einer Bestätigungsseite:
              die Aktion. Nur wenige Elemente können primär sein — sonst gibt es
              keine Hierarchie mehr, nur noch Gleichheit.
            </ConceptItem>
            <ConceptItem title="Sekundär — unterstützende Informationen">
              Texte, Labels und Aktionen, die das primäre Element
              kontextualisieren. Sie sind relevant, aber treten optisch zurück:
              etwas kleiner, etwas heller, etwas schmaler. Der Nutzer kommt erst
              hierher, wenn er das Primäre verarbeitet hat.
            </ConceptItem>
            <ConceptItem title="Tertiär — Metadaten und Randinfos">
              Zeitstempel, IDs, Copyright-Hinweise, selten gebrauchte Links.
              Diese Informationen müssen vorhanden und auffindbar sein, aber sie
              sollen die Aufmerksamkeit nicht stören. Sehr helle Textfarbe,
              kleine Schriftgröße, viel Abstand.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-4">
            <div className="text-[13px] font-bold text-(--text-primary) mb-1 flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              Gut: klare Pyramide
            </div>
            <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">
              Ein primäres Element zieht alle Blicke. Sekundäres ergänzt ruhig.
              Tertiäres ist fast unsichtbar, aber da.
            </p>
          </div>
          <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-4">
            <div className="text-[13px] font-bold text-(--text-primary) mb-1 flex items-center gap-1.5">
              <AlertTriangle size={14} />
              Problem: flache Hierarchie
            </div>
            <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">
              Wenn alles gleich groß, gleich fett, gleich dunkel ist — gibt es
              keine Hierarchie. Das Auge irrt umher.
            </p>
          </div>
        </div>

        <RuleBox>
          Bevor du ein Interface gestaltest, stelle dir diese Frage: „Was ist
          das Erste, das ein Nutzer sehen soll?" Alles andere ist sekundär oder
          tertiär. Nicht mehr als 2–3 Elemente pro Ansicht verdienen primäre
          Betonung.
        </RuleBox>

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── PAGE 3: DIE FÜNF WERKZEUGE ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Theorie — Fortsetzung</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">Die fünf Werkzeuge der Hierarchie</h2>

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Visuelle Hierarchie entsteht nicht durch Zufall — sie wird mit
          konkreten CSS-Eigenschaften gebaut. Diese fünf Werkzeuge kannst du
          einzeln oder kombiniert einsetzen.{" "}
          <strong>Wichtig: Immer nur so viele wie nötig.</strong> Wenn Font
          Weight allein reicht, brauchst du keine andere Farbe und keine andere
          Größe.
        </p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { Icon: Type, title: "Schriftgröße", body: "Das offensichtlichste Werkzeug. Größerer Text = mehr Gewicht. Aber: Größe allein überstrapaziert schnell — kombiniere mit Gewicht." },
            { Icon: Bold, title: "Font Weight", body: "Sehr effektiv bei gleichbleibender Größe. Bold hebt hervor ohne den Rhythmus zu brechen. Zwei Gewichtsstufen reichen meist." },
            { Icon: Droplets, title: "Farbe / Kontrast", body: null },
            { Icon: MoveVertical, title: "Spacing", body: "Mehr Abstand um ein Element = mehr visuelle Isolation = mehr Gewicht. Auch: Elemente mit wenig Spacing wirken zusammengehörig." },
            { Icon: Square, title: "Größe / Fläche", body: "Nicht nur Text: Buttons, Icons, Avatare. Größere Fläche zieht mehr Aufmerksamkeit. Icons sind oft zu groß und dominieren unbeabsichtigt." },
            { Icon: Lightbulb, title: "Kombination", body: "Die stärksten Effekte entstehen durch Kombination: groß + fett + dunkel = maximale Primär-Betonung. Klein + dünn + hell = fast unsichtbar." },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-4 text-center">
              <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-(--accent-dim) border border-(--accent-border) flex items-center justify-center text-(--accent)">
                <Icon size={18} strokeWidth={2} />
              </div>
              <h4 className="text-[13px] font-bold text-(--text-primary) mt-0 mb-1">{title}</h4>
              {body ? (
                <p className="text-[13px] leading-normal text-(--text-secondary) m-0">{body}</p>
              ) : (
                <p className="text-[13px] leading-normal text-(--text-secondary) m-0">
                  Dunkler Text wirkt prominenter als heller.{" "}
                  <code className="font-mono text-[13px] bg-(--bg-elevated) px-1 rounded">text-primary → secondary → tertiary → ghost</code>{" "}
                  ist ein vollständiges Hierarchiesystem.
                </p>
              )}
            </div>
          ))}
        </div>

        <TheoryCard label="De-Betonung als Technik">
          <ConceptList>
            <ConceptItem title="Betone durch Debetonung — nicht durch Hinzufügen">
              Wenn ein Element nicht genug hervorsticht, ist der Reflex: größer
              machen, fetter machen, Farbe hinzufügen. Oft wirksamer: die{" "}
              <em>konkurrierenden</em> Elemente zurücktreten lassen. Weniger
              Kontrast bei Nebenelementen macht das Hauptelement automatisch
              prominenter — ohne dass es selbst verändert wurde.
            </ConceptItem>
            <ConceptItem title="Beispiel: Inactive Navigation">
              Ein aktives Nav-Item hebt sich nicht ab, weil es zu unauffällig
              ist — aber statt es aggressiver zu machen, werden die inaktiven
              Items einfach heller (z.B.{" "}
              <code className="font-mono text-[13px] bg-(--bg-elevated) px-1 rounded">text-tertiary</code>
              ). Das aktive Item dominiert nun ohne zusätzliche Betonung.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <RuleBox>
          Wenn du ein Element betonst, ohne etwas anderes zu debetonieren,
          erhöhst du nur den allgemeinen Lärmpegel. Echter Kontrast entsteht
          durch Unterschied — nicht durch allgemeine Steigerung.
        </RuleBox>

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── PAGE 4: VERGLEICH 1 — DASHBOARD CARD ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Vergleichsbeispiel 1 von 4</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Flache vs. klare Hierarchie — Dashboard Card
        </h2>

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Ein Dashboard voller Cards ist ein klassisches Entwickler-UI. Die
          Daten sind korrekt, die Struktur ist logisch — aber wenn alle Werte
          gleich dargestellt werden, weiß der Nutzer nicht, wohin er schauen
          soll.{" "}
          <strong>
            Hierarchie entscheidet, welche Zahl zuerst verarbeitet wird.
          </strong>
        </p>

        <ComparisonPanel
          bad={{
            label: "Vorher",
            children: (
              <div className="bg-(--bg-base) border border-(--bg-elevated) rounded-sm p-4 min-h-20 flex flex-col justify-center">
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-(--bg-base) border border-(--bg-elevated) rounded-sm p-2 px-4">
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "var(--text-primary)",
                        marginBottom: "2px",
                      }}
                    >
                      Umsatz
                    </div>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 400,
                        color: "var(--text-primary)",
                      }}
                    >
                      € 48.200
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 400,
                        color: "var(--text-primary)",
                      }}
                    >
                      +12% ggü. Vormonat
                    </div>
                  </div>
                  <div className="bg-(--bg-base) border border-(--bg-elevated) rounded-sm p-2 px-4">
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "var(--text-primary)",
                        marginBottom: "2px",
                      }}
                    >
                      Bestellungen
                    </div>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 400,
                        color: "var(--text-primary)",
                      }}
                    >
                      1.284
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 400,
                        color: "var(--text-primary)",
                      }}
                    >
                      +8% ggü. Vormonat
                    </div>
                  </div>
                  <div className="bg-(--bg-base) border border-(--bg-elevated) rounded-sm p-2 px-4">
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "var(--text-primary)",
                        marginBottom: "2px",
                      }}
                    >
                      Kunden
                    </div>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 400,
                        color: "var(--text-primary)",
                      }}
                    >
                      392
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 400,
                        color: "var(--text-primary)",
                      }}
                    >
                      –3% ggü. Vormonat
                    </div>
                  </div>
                </div>
              </div>
            ),
          }}
          good={{
            label: "Nachher",
            children: (
              <div className="bg-(--bg-base) border border-(--bg-elevated) rounded-sm p-4 min-h-20 flex flex-col justify-center">
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-(--bg-base) border border-(--bg-elevated) rounded-sm p-2 px-4">
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        color: "var(--text-ghost)",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        fontFamily: "var(--font-mono)",
                        marginBottom: "4px",
                      }}
                    >
                      Umsatz
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        marginBottom: "2px",
                      }}
                    >
                      € 48.200
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: 500,
                        color: "var(--accent)",
                      }}
                    >
                      +12 %
                    </div>
                  </div>
                  <div className="bg-(--bg-base) border border-(--bg-elevated) rounded-sm p-2 px-4">
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        color: "var(--text-ghost)",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        fontFamily: "var(--font-mono)",
                        marginBottom: "4px",
                      }}
                    >
                      Bestellungen
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        marginBottom: "2px",
                      }}
                    >
                      1.284
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: 500,
                        color: "var(--accent)",
                      }}
                    >
                      +8 %
                    </div>
                  </div>
                  <div className="bg-(--bg-base) border border-(--bg-elevated) rounded-sm p-2 px-4">
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        color: "var(--text-ghost)",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        fontFamily: "var(--font-mono)",
                        marginBottom: "4px",
                      }}
                    >
                      Kunden
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        marginBottom: "2px",
                      }}
                    >
                      392
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: 500,
                        color: "var(--bad-color)",
                      }}
                    >
                      –3 %
                    </div>
                  </div>
                </div>
              </div>
            ),
          }}
        />

        <AnnotationGrid
          items={[
            { label: "Label-Behandlung", value: "body → mono ghost" },
            { label: "Zahl-Gewicht", value: "400 → 800" },
            { label: "Trend-Farbe", value: "primary → semantisch" },
          ]}
        />

        <ExplanationBox title="Analyse">
          <p>
            Im Vorher-Beispiel konkurrieren Label, Zahl und Trendwert
            gleichwertig um Aufmerksamkeit — alle haben dieselbe Farbe und
            denselben Gewicht. Das Auge weiß nicht, wo es anfangen soll.
          </p>
          <p>
            Im Nachher-Beispiel ist die Hierarchie eindeutig:{" "}
            <strong>Die Zahl ist primär</strong> (groß, fett, dunkel), das Label
            ist tertiär (Mono, Ghost-Farbe, Uppercase), der Trendwert ist
            sekundär und trägt zusätzlich semantische Farbe (Teal für positiv,
            Rot für negativ). Drei Ebenen, drei Werkzeuge, null
            Layout-Änderung.
          </p>
        </ExplanationBox>

        <RuleBox>
          Labels sind immer sekundär oder tertiär — sie beschreiben die Daten,
          sind aber nie die Daten selbst. Debetoniere Labels konsequent:
          kleinere Schrift, weniger Kontrast, Monospace. So treten die Zahlen
          automatisch hervor.
        </RuleBox>

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── PAGE 5: VERGLEICH 2 — BUTTON-HIERARCHIE ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Vergleichsbeispiel 2 von 4</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Button-Hierarchie: Primary / Secondary / Tertiary
        </h2>

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Buttons sind die explizitesten Hierarchie-Träger in einem Interface —
          sie repräsentieren Aktionen, und Aktionen haben immer eine
          Wichtigkeitsreihenfolge.{" "}
          <strong>
            Wenn alle Buttons gleich aussehen, signalisiert das Interface dem
            Nutzer: „Alles ist gleich wichtig."
          </strong>{" "}
          Das ist fast nie wahr.
        </p>

        <ComparisonPanel
          bad={{
            label: "Vorher — alle Buttons gleich",
            children: (
              <div className="bg-(--bg-base) border border-(--bg-elevated) rounded-sm p-4 min-h-20 flex flex-col justify-center gap-2.5 items-start">
                <div className="text-[13px] font-semibold text-(--text-primary)">Dokument löschen</div>
                <div className="text-[13px] text-(--text-secondary)">Diese Aktion kann nicht rückgängig gemacht werden.</div>
                <div className="flex gap-2 flex-wrap">
                  <button className="font-sans text-[13px] font-400 py-1.5 px-3.5 rounded-sm cursor-default border-none bg-(--bg-elevated) border border-(--bg-elevated) text-(--text-primary)">Löschen</button>
                  <button className="font-sans text-[13px] font-400 py-1.5 px-3.5 rounded-sm cursor-default border-none bg-(--bg-elevated) border border-(--bg-elevated) text-(--text-primary)">Abbrechen</button>
                  <button className="font-sans text-[13px] font-400 py-1.5 px-3.5 rounded-sm cursor-default border-none bg-(--bg-elevated) border border-(--bg-elevated) text-(--text-primary)">Mehr erfahren</button>
                </div>
              </div>
            ),
          }}
          good={{
            label: "Nachher — klare Hierarchie",
            children: (
              <div className="bg-(--bg-base) border border-(--bg-elevated) rounded-sm p-4 min-h-20 flex flex-col justify-center gap-2.5 items-start">
                <div className="text-[13px] font-semibold text-(--text-primary)">Dokument löschen</div>
                <div className="text-[13px] text-(--text-secondary)">Diese Aktion kann nicht rückgängig gemacht werden.</div>
                <div className="flex gap-2 flex-wrap">
                  <button className="font-sans text-[13px] font-semibold py-1.5 px-3.5 rounded-sm cursor-default border-none bg-(--bad-color) text-white">Löschen</button>
                  <button className="font-sans text-[13px] font-medium py-1.5 px-3.5 rounded-sm cursor-default bg-transparent border border-(--bg-hover) text-(--text-primary)">Abbrechen</button>
                  <button className="font-sans text-[13px] font-medium py-1.5 px-2 rounded-sm cursor-default bg-transparent border-none text-(--accent-text)">Mehr erfahren</button>
                </div>
              </div>
            ),
          }}
        />

        <AnnotationGrid
          items={[
            { label: "Primary Button", value: "Solid, hoher Kontrast" },
            { label: "Secondary Button", value: "Outline, mittlerer Kontrast" },
            { label: "Tertiary Button", value: "Nur Text / Link-Stil" },
          ]}
        />

        <ExplanationBox title="Analyse">
          <p>
            Im Vorher-Beispiel kämpfen drei Buttons mit identischem Gewicht um
            Aufmerksamkeit. Der Nutzer muss den Text lesen, um die Wichtigkeit
            zu verstehen — das ist cognitive load, der vermeidbar ist.
          </p>
          <p>
            Im Nachher-Beispiel kommuniziert die visuelle Behandlung sofort:{" "}
            <strong>„Löschen" ist die Hauptaktion</strong> (Primary, hier in Rot
            wegen destruktiver Semantik), „Abbrechen" ist die sichere
            Alternative (Secondary), und „Mehr erfahren" ist ein nachrangiger
            Link (Tertiary). Diese Hierarchie funktioniert auch ohne einen
            Buchstaben zu lesen.
          </p>
        </ExplanationBox>

        <RuleBox>
          Jede Ansicht hat genau einen Primary Button — die wichtigste Aktion.
          Sekundäre Aktionen bekommen Outline- oder Ghost-Styling. Tertiäre
          Aktionen werden wie Links behandelt. Mehr als ein „voller" Button pro
          Ansicht verwässert die Hierarchie.
        </RuleBox>

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── PAGE 6: PRAXISAUFGABE ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Praxisaufgabe</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Hierarchie in eine Benachrichtigungs-Card bringen
        </h2>

        <ExerciseBlock
          title="Aufgabenstellung"
          tasks={[
            "Identifiziere primäre, sekundäre und tertiäre Information in der Card",
            "Wende die passenden Font Weights an (min. zwei unterschiedliche Stufen)",
            "Nutze die Farbvariablen --text-primary, --text-secondary, --text-tertiary und --text-ghost",
            "Überlege, welche Textgröße für welche Ebene angemessen ist",
            "Bonusaufgabe: Passe auch die Buttons nach Primary/Secondary/Tertiary-Schema an",
          ]}
        >
          Du bekommst eine Benachrichtigungs-Card mit vollständig flacher
          Hierarchie: alle Textelemente haben dasselbe Gewicht, dieselbe Farbe
          und dieselbe Größe. Die Information ist da — aber das Interface sagt
          nicht, was wichtig ist. Bringe durch gezielte Änderungen an Font
          Weight, Textfarbe und Schriftgröße eine klare Drei-Ebenen-Hierarchie
          in die Card.
        </ExerciseBlock>

        <LiveEditor
          html={EXERCISE_HTML}
          controls={EXERCISE_CONTROLS}
          defaultMode="controller"
          previewHeight={380}
          title="Bringe Hierarchie in diese Benachrichtigungs-Card"
        />

      </div>
      <ModuleNav prevModule={prevModule} nextModule={nextModule} />
    </div>
  );
}
