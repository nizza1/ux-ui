import { useLoaderData } from "@remix-run/react";
import { modules } from "~/data/modules";
import { ModuleNav } from "~/routes/modules.$slug";
import { TheoryCard } from "~/components/ui/TheoryCard";
import { ConceptList, ConceptItem } from "~/components/ui/ConceptList";
import { ComparisonPanel } from "~/components/ui/ComparisonPanel";
import { RuleBox } from "~/components/ui/RuleBox";
import { ExerciseBlock } from "~/components/ui/ExerciseBlock";
import { LearningGoals } from "~/components/ui/LearningGoals";
import { ModuleMeta } from "~/components/ui/ModuleMeta";
import { ImagePlaceholder } from "~/components/ui/ImagePlaceholder";
import { LiveEditor } from "~/components/live-editor/LiveEditor";
import type { PropertyControl } from "~/components/live-editor/types";

export async function loader() {
  const slug = "ux-ui-basics";
  const currentIndex = modules.findIndex((m) => m.slug === slug);
  return {
    prevModule: currentIndex > 0 ? modules[currentIndex - 1] : null,
    nextModule: currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null,
  };
}

// ── User Journey Flow component ──────────────────────────────────────────────
function UserJourneyFlow() {
  const steps = [
    { id: 1, label: "Loginseite aufrufen", icon: "🌐", friction: false },
    { id: 2, label: '„Passwort vergessen" klicken', icon: "🔗", friction: false },
    { id: 3, label: "E-Mail-Adresse eingeben", icon: "✉️", friction: true, note: "Reibungspunkt: Welche E-Mail?" },
    { id: 4, label: "E-Mail erhalten & Link klicken", icon: "📬", friction: true, note: "Reibungspunkt: Link läuft ab" },
    { id: 5, label: "Neues Passwort setzen", icon: "🔑", friction: true, note: "Reibungspunkt: Unklare Anforderungen" },
    { id: 6, label: "Erfolg", icon: "✅", friction: false },
  ];

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 mb-6">
      <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-4">
        User Journey: Passwort zurücksetzen
      </p>
      <div className="flex flex-col gap-2">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-start gap-3">
            <div className="flex flex-col items-center shrink-0">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-base font-bold border-2 ${step.friction
                  ? "bg-(--bad-bg) border-(--bad-border) text-(--bad-color)"
                  : "bg-(--success-bg) border-(--success-border) text-(--success-color)"
                  }`}
              >
                {step.icon}
              </div>
              {i < steps.length - 1 && (
                <div className="w-0.5 h-4 bg-(--bg-elevated) mt-1" />
              )}
            </div>
            <div className="pt-1.5">
              <p className="text-[13px] font-semibold text-(--text-primary) leading-tight">{step.label}</p>
              {step.friction && step.note && (
                <p className="text-[12px] text-(--bad-color) mt-0.5">{step.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-4 pt-4 border-t border-(--bg-elevated)">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-(--success-color)" />
          <span className="text-[12px] text-(--text-secondary)">Reibungsfreier Schritt</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-(--bad-color)" />
          <span className="text-[12px] text-(--text-secondary)">Möglicher Reibungspunkt</span>
        </div>
      </div>
    </div>
  );
}

// ── Practice HTML ─────────────────────────────────────────────────────────────
const EXERCISE_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Login-Formular</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: system-ui, sans-serif;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 24px;
  }
  .form-card {
    background: white;
    border-radius: 8px;
    padding: 32px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  h1 {
    font-size: 20px;
    font-weight: 700;
    color: #111;
    margin-bottom: 4px;
  }
  .subtitle {
    font-size: 14px;
    color: #666;
    margin-bottom: 24px;
  }
  .field { margin-bottom: 16px; }
  label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #333;
    margin-bottom: 6px;
  }
  input {
    width: 100%;
    padding: 10px 12px;
    border: 1.5px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    color: #111;
    outline: none;
    transition: border-color 0.15s;
  }
  input:focus { border-color: #0ea5a0; }
  /* TODO: Gib dem primären Button eine klare Farbe und ausreichend Padding */
  .btn-primary {
    width: 100%;
    padding: 8px;
    background: #ddd;
    color: #666;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 8px;
  }
  /* TODO: Hebe den „Passwort vergessen"-Link als erkennbaren Link hervor */
  .forgot-link {
    display: block;
    font-size: 13px;
    color: #666;
    text-decoration: none;
    text-align: right;
    margin-top: 6px;
  }
  /* BONUS: Füge einen disabled-Zustand für den Button hinzu */
</style>
</head>
<body>
  <div class="form-card">
    <h1>Willkommen zurück</h1>
    <p class="subtitle">Melde dich in deinem Konto an</p>
    <div class="field">
      <label for="email">E-Mail-Adresse</label>
      <input type="email" id="email" placeholder="name@beispiel.de" />
    </div>
    <div class="field">
      <label for="password">Passwort</label>
      <input type="password" id="password" placeholder="Dein Passwort" />
      <a href="#" class="forgot-link">Passwort vergessen?</a>
    </div>
    <button class="btn-primary">Anmelden</button>
  </div>
</body>
</html>`;

const EXERCISE_CONTROLS: PropertyControl[] = [
  {
    id: "btn-bg",
    property: "backgroundColor",
    label: "Button Hintergrundfarbe",
    type: "color",
    target: ".btn-primary",
    group: "colors",
    defaultValue: "#dddddd",
  },
  {
    id: "btn-color",
    property: "color",
    label: "Button Textfarbe",
    type: "color",
    target: ".btn-primary",
    group: "colors",
    defaultValue: "#666666",
  },
  {
    id: "btn-padding-y",
    property: "paddingTop",
    label: "Button Padding (oben/unten)",
    type: "slider",
    target: ".btn-primary",
    group: "spacing",
    defaultValue: 8,
    min: 8,
    max: 20,
    step: 2,
    unit: "px",
  },
  {
    id: "btn-radius",
    property: "borderRadius",
    label: "Button Rundung",
    type: "slider",
    target: ".btn-primary",
    group: "borders",
    defaultValue: 6,
    min: 0,
    max: 28,
    step: 2,
    unit: "px",
  },
  {
    id: "btn-font-size",
    property: "fontSize",
    label: "Button Schriftgröße",
    type: "slider",
    target: ".btn-primary",
    group: "typography",
    defaultValue: 14,
    min: 13,
    max: 18,
    step: 1,
    unit: "px",
  },
  {
    id: "link-color",
    property: "color",
    label: "Link Farbe",
    type: "color",
    target: ".forgot-link",
    group: "colors",
    defaultValue: "#666666",
  },
  {
    id: "link-underline",
    property: "textDecoration",
    label: "Link Unterstreichung",
    type: "toggle",
    target: ".forgot-link",
    group: "typography",
    defaultValue: "none",
    options: [{ label: "An", value: "underline" }],
  },
  {
    id: "input-border-color",
    property: "borderColor",
    label: "Input Rahmenfarbe (Fokus)",
    type: "color",
    target: "input:focus",
    group: "colors",
    defaultValue: "#0ea5a0",
  },
  {
    id: "card-shadow",
    property: "boxShadow",
    label: "Karten-Schatten",
    type: "select",
    target: ".form-card",
    group: "shadows",
    defaultValue: "0 2px 8px rgba(0,0,0,0.08)",
    options: [
      { label: "Kein", value: "none" },
      { label: "Subtil", value: "0 2px 8px rgba(0,0,0,0.08)" },
      { label: "Mittel", value: "0 4px 20px rgba(0,0,0,0.12)" },
      { label: "Stark", value: "0 8px 32px rgba(0,0,0,0.18)" },
    ],
  },
  {
    id: "card-padding",
    property: "padding",
    label: "Karten-Padding",
    type: "slider",
    target: ".form-card",
    group: "spacing",
    defaultValue: 32,
    min: 16,
    max: 48,
    step: 4,
    unit: "px",
  },
];

export default function UxUiBasicsModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      <div className="max-w-[1000px] mx-auto w-full px-8 py-12 flex-1">

        {/* ── Title ── */}
        <div className="inline-flex items-center gap-2 bg-(--accent-dim) border border-(--accent-border) rounded-full py-1 px-3.5 font-mono text-[11px] font-semibold text-(--accent) tracking-[1.5px] uppercase mb-6 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-(--accent) before:shadow-[0_0_6px_var(--accent)] before:shrink-0">
          Modul 00
        </div>
        <h1 className="text-[clamp(28px,4vw,36px)] font-extrabold leading-[1.15] tracking-[-0.5px] text-(--text-primary) mb-2 mt-0">
          Was ist UX? Was ist UI?
        </h1>
        <p className="text-[15px] font-medium leading-normal text-(--text-secondary) mb-8 mt-0 max-w-130">
          Die Grundlagen: UX und UI definieren, den Unterschied verstehen und
          begreifen, warum beides entscheidend ist für Software, die Menschen
          wirklich gerne benutzen.
        </p>

        <ModuleMeta duration="20 Minuten" practiceTime="~15 Min." />

        <LearningGoals
          goals={[
            "UX (User Experience) und UI (User Interface) klar definieren können",
            "Den Unterschied zwischen UX und UI mit konkreten Beispielen erklären",
            "Verstehen, warum beide Disziplinen für Entwickler relevant sind",
            "Reibungspunkte in einem UI-Flow identifizieren",
            "Ein Login-Formular mit besserer UI-Qualität ausliefern",
          ]}
        />

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── Intro ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Die zentrale Frage
        </p>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Hast du jemals eine App benutzt und dich dabei frustriert gefühlt, ohne
          genau zu wissen warum? Vielleicht hat ein Formular deine Eingabe
          verloren, nachdem du auf „Zurück" gedrückt hast. Vielleicht sah ein
          Button klickbar aus, war es aber nicht. Vielleicht konntest du eine
          Funktion einfach nicht finden, obwohl du sicher warst, dass sie
          irgendwo existiert.
        </p>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-6">
          Dieses Gefühl – diese <strong>Reibung</strong> – ist genau das, was
          UX- und UI-Design verhindern sollen. Als Entwickler kontrollierst du
          bereits die wichtigste Schicht eines Produkts: die Logik, die Daten,
          das System. Aber was Nutzer anfassen, sehen und spüren, ist das
          Interface – und diese Schicht hat ihre eigenen Regeln, ihr eigenes
          Handwerk und ihre eigene Disziplin.
        </p>

        {/* ── Theory: UX ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Theorie
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          UX – User Experience Design
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          UX steht für <strong>User Experience</strong> (Nutzererfahrung). Es
          ist die Praxis, die <em>Gesamterfahrung</em> zu gestalten, die eine
          Person beim Umgang mit einem Produkt hat. UX geht nicht darum, wie
          etwas aussieht – sondern darum, wie etwas <em>funktioniert</em>, aus
          der Perspektive des Nutzers.
        </p>

        <TheoryCard label="UX stellt diese Fragen">
          <ConceptList>
            <ConceptItem title="Was versucht der Nutzer zu erreichen?">
              UX beginnt mit dem Ziel des Nutzers, nicht mit der Funktion des
              Systems. Ein Nutzer will keine „Passwortzurücksetzung" – er will
              wieder Zugang zu seinem Konto.
            </ConceptItem>
            <ConceptItem title="Welche Schritte muss er dafür unternehmen?">
              Jeder unnötige Schritt ist Reibung. Gute UX reduziert den Weg
              zwischen Nutzerwunsch und Ergebnis auf das absolut Notwendige.
            </ConceptItem>
            <ConceptItem title="Wo verliert er den Überblick oder bricht ab?">
              UX-Arbeit macht Abbruchpunkte sichtbar, bevor sie entstehen –
              durch Research, Prototypen und Tests.
            </ConceptItem>
            <ConceptItem title="Reagiert das System logisch?">
              Das System muss auf Nutzeraktionen so antworten, wie der Nutzer
              es erwartet – nicht so, wie der Entwickler die Logik gebaut hat.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-6">
          UX-Arbeit ist im fertigen Produkt weitgehend{" "}
          <strong>unsichtbar</strong>. Eine gut gestaltete Erfahrung fühlt sich
          selbstverständlich und natürlich an – weil jemand sehr viel Zeit damit
          verbracht hat, sie genau so zu gestalten.
        </p>

        {/* User Journey Diagram */}
        <UserJourneyFlow />

        {/* ── Theory: UI ── */}
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          UI – User Interface Design
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          UI steht für <strong>User Interface</strong> (Benutzeroberfläche). Es
          ist die Praxis, die <em>visuelle und interaktive Schicht</em> zu
          gestalten, die Nutzer direkt berühren und sehen: Buttons, Formulare,
          Typografie, Farben, Abstände, Icons, Layouts.
        </p>

        <TheoryCard label="UI beantwortet diese Fragen">
          <ConceptList>
            <ConceptItem title="Wirkt der Button klickbar?">
              Buttons müssen nach Buttons aussehen – durch Farbe, Tiefe,
              Cursor-Verhalten und klare Beschriftung.
            </ConceptItem>
            <ConceptItem title="Ist der Text lesbar?">
              Schriftgröße, Kontrast und Zeilenhöhe bestimmen, ob Nutzer Text
              mühelos lesen können oder sich anstrengen müssen.
            </ConceptItem>
            <ConceptItem title="Lenkt das Layout den Blick?">
              Visuelles Gewicht, Abstände und Positionierung steuern, was der
              Nutzer zuerst wahrnimmt – und was als Nächstes.
            </ConceptItem>
            <ConceptItem title="Ist der Stil konsistent?">
              Inkonsistente Farben, Abstände oder Typografie erzeugen
              Unsicherheit. Konsistenz schafft Vertrauen.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-6">
          Wenn UX der <strong>Grundriss eines Gebäudes</strong> ist, ist UI die{" "}
          <strong>Inneneinrichtung</strong> – die Materialien, das Licht, die
          Beschilderung.
        </p>

        {/* Login Comparison */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Vergleichsbeispiel
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Gleiches Formular – völlig unterschiedliche UI-Qualität
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Beide Versionen unten haben denselben UX-Flow: E-Mail eingeben,
          Passwort eingeben, Anmelden. Aber die UI-Qualität unterscheidet sich
          drastisch.
        </p>

        <ComparisonPanel
          bad={{
            label: "Schlechtes UI",
            children: (
              <div className="font-mono text-[12px] text-(--text-secondary) space-y-2 p-2">
                <div className="border border-gray-300 p-1 text-gray-400 text-[11px]">email eingeben</div>
                <div className="border border-gray-300 p-1 text-gray-400 text-[11px]">passwort</div>
                <button className="w-full border border-gray-400 bg-gray-100 text-gray-600 text-[11px] p-1 cursor-pointer">
                  senden
                </button>
                <div className="text-[10px] text-gray-400">passwort vergessen?</div>
                <p className="text-[10px] text-(--text-ghost) mt-2">Kein visuelles Gewicht · keine Hierarchie · kein Feedback · schwer zu bedienen</p>
              </div>
            ),
          }}
          good={{
            label: "Gutes UI",
            children: (
              <div className="p-2 space-y-2.5">
                <div>
                  <p className="text-[11px] font-semibold text-(--text-primary) mb-1">E-Mail-Adresse</p>
                  <div className="border-2 border-(--accent) rounded-md px-2.5 py-1.5 text-[12px] text-(--text-secondary)">
                    name@beispiel.de
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[11px] font-semibold text-(--text-primary)">Passwort</p>
                    <span className="text-[10px] text-(--accent) font-medium">Vergessen?</span>
                  </div>
                  <div className="border border-(--bg-elevated) rounded-md px-2.5 py-1.5 text-[12px] text-(--text-ghost)">
                    ••••••••
                  </div>
                </div>
                <button className="w-full bg-(--accent) text-white text-[12px] font-semibold rounded-md py-2 cursor-pointer">
                  Anmelden →
                </button>
                <p className="text-[10px] text-(--text-ghost) mt-2">Klare Hierarchie · sichtbarer Fokus · primärer CTA · erkennbarer Link</p>
              </div>
            ),
          }}
        />

        {/* ── UX vs UI Table ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-3 block">
          Zusammenfassung
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          UX vs. UI – der Unterschied auf einen Blick
        </h2>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-(--bg-elevated)">
                <th className="text-left py-2.5 pr-4 font-semibold text-(--text-primary) w-1/5"></th>
                <th className="text-left py-2.5 pr-4 font-semibold text-(--text-primary) w-2/5">UX-Design</th>
                <th className="text-left py-2.5 font-semibold text-(--text-primary) w-2/5">UI-Design</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Fokus", "Ablauf, Logik, Nutzerziele", "Visuelles, Layout, Interaktion"],
                ["Ergebnis", "User Flows, Wireframes, Prototypen", "Mockups, Komponenten, Styleguides"],
                ["Frage", '„Funktioniert das für den Nutzer?"', '„Fühlt sich das richtig an?"'],
                ["Werkzeuge", "Research, User Testing, IA", "Typografie, Farbe, Spacing-Systeme"],
              ].map(([label, ux, ui]) => (
                <tr key={label} className="border-b border-(--bg-elevated) last:border-0">
                  <td className="py-2.5 pr-4 font-semibold text-(--text-primary)">{label}</td>
                  <td className="py-2.5 pr-4 text-(--text-secondary)">{ux}</td>
                  <td className="py-2.5 text-(--text-secondary)">{ui}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ImagePlaceholder
          aspectRatio="21/9"
          label="UX = Grundriss / UI = Inneneinrichtung"
          caption="Illustration: UX definiert die Struktur, UI gibt ihr Form und Persönlichkeit"
        />

        <RuleBox title="Kernregel">
          UX ohne UI ist wie ein brillanter Grundriss für ein dunkles, unbeschildertes Gebäude.
          UI ohne UX ist wie ein wunderschöner Raum, in dem niemand die Ausgänge findet.
          Beides braucht das andere – und als Entwickler triffst du täglich Entscheidungen in beiden Bereichen.
        </RuleBox>

      </div>

      <ModuleNav prevModule={prevModule} nextModule={nextModule} />
    </div>
  );
}
