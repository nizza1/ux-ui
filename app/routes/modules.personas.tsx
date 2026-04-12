import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { modules } from "~/data/modules";
import { ModuleNav } from "~/routes/modules.$slug";
import { TheoryCard } from "~/components/ui/TheoryCard";
import { ConceptList, ConceptItem } from "~/components/ui/ConceptList";
import { RuleBox } from "~/components/ui/RuleBox";
import { LearningGoals } from "~/components/ui/LearningGoals";
import { ModuleMeta } from "~/components/ui/ModuleMeta";
import { ImagePlaceholder } from "~/components/ui/ImagePlaceholder";
import type { PropertyControl } from "~/components/live-editor/types";

export async function loader() {
  const slug = "personas";
  const currentIndex = modules.findIndex((m) => m.slug === slug);
  return {
    prevModule: currentIndex > 0 ? modules[currentIndex - 1] : null,
    nextModule: currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null,
  };
}

// ── Interactive Persona Card ──────────────────────────────────────────────────
const DEFAULT_PERSONA = {
  name: "Sarah Müller",
  role: "Senior Projektmanagerin",
  quote: "Ich brauche Tools, die mir Zeit sparen – nicht solche, die mehr Arbeit machen.",
  goals: [
    "Projektfortschritt auf einen Blick erfassen",
    "Team-Engpässe früh erkennen",
    "Berichte mit wenig Aufwand erstellen",
  ],
  frustrations: [
    "Zu viele manuelle Updates nötig",
    "Informationen über mehrere Tools verteilt",
    "Mobile-Erfahrung oft eingeschränkt",
  ],
  comfort: 3 as 1 | 2 | 3,
};

function PersonaCard() {
  const [persona, setPersona] = useState(DEFAULT_PERSONA);
  const [editing, setEditing] = useState<string | null>(null);

  const comfortLabels = { 1: "Einsteiger", 2: "Fortgeschrittener", 3: "Experte" };
  const comfortColors = {
    1: "var(--bad-color)",
    2: "var(--warning-color)",
    3: "var(--success-color)",
  };

  function EditableText({
    value,
    field,
    className,
  }: {
    value: string;
    field: string;
    className?: string;
  }) {
    if (editing === field) {
      return (
        <input
          autoFocus
          className={`bg-(--bg-elevated) rounded px-1 outline-none border border-(--accent-border) w-full ${className}`}
          value={value}
          onChange={(e) => setPersona((p) => ({ ...p, [field]: e.target.value }))}
          onBlur={() => setEditing(null)}
          onKeyDown={(e) => e.key === "Enter" && setEditing(null)}
        />
      );
    }
    return (
      <span
        className={`cursor-text hover:bg-(--bg-elevated) rounded px-1 transition-colors ${className}`}
        onClick={() => setEditing(field)}
        title="Klicken zum Bearbeiten"
      >
        {value}
      </span>
    );
  }

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl overflow-hidden mb-6">
      {/* Header */}
      <div className="bg-(--accent-dim) border-b border-(--accent-border) px-5 py-3 flex items-center justify-between">
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent)">
          Interaktive Persona-Karte
        </p>
        <p className="text-[11px] text-(--text-tertiary)">Klicke auf Felder zum Bearbeiten</p>
      </div>

      <div className="p-5">
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar placeholder */}
          <div className="w-14 h-14 rounded-full bg-(--bg-elevated) flex items-center justify-center text-2xl shrink-0 border-2 border-(--bg-hover)">
            👤
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[17px] font-bold text-(--text-primary)">
              <EditableText value={persona.name} field="name" />
            </p>
            <p className="text-[13px] text-(--text-secondary)">
              <EditableText value={persona.role} field="role" />
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-(--text-ghost)">
                Digitaler Komfort:
              </span>
              <div className="flex gap-1">
                {([1, 2, 3] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setPersona((p) => ({ ...p, comfort: level }))}
                    className="px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer"
                    style={{
                      background: persona.comfort >= level ? comfortColors[persona.comfort] : "var(--bg-elevated)",
                      color: persona.comfort >= level ? "white" : "var(--text-ghost)",
                    }}
                  >
                    {comfortLabels[level]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="bg-(--bg-elevated) rounded-lg px-4 py-3 mb-4 border-l-2 border-(--accent)">
          <p className="text-[13px] italic text-(--text-secondary) leading-snug">
            „<EditableText value={persona.quote} field="quote" />"
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Goals */}
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--success-color) mb-2">
              Ziele
            </p>
            <ul className="space-y-1.5">
              {persona.goals.map((g, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[13px] text-(--text-secondary)">
                  <span className="text-(--success-color) mt-0.5 shrink-0">▸</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
          {/* Frustrations */}
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--bad-color) mb-2">
              Frustrationen
            </p>
            <ul className="space-y-1.5">
              {persona.frustrations.map((f, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[13px] text-(--text-secondary)">
                  <span className="text-(--bad-color) mt-0.5 shrink-0">▸</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
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
<title>Persona-Karte</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: system-ui, sans-serif;
    background: #f5f7fa;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 24px;
  }
  .persona-card {
    background: white;
    border-radius: 12px;
    padding: 28px;
    max-width: 480px;
    width: 100%;
    /* TODO: Füge einen sichtbaren Schatten hinzu */
    box-shadow: none;
  }
  .header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
  /* TODO: Mache den Avatar visuell ansprechend – Hintergrund und Größe */
  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }
  .name { font-size: 17px; font-weight: 700; color: #111; }
  .role { font-size: 13px; color: #666; }
  /* TODO: Mache das Zitat erkennbar als Zitat */
  .quote {
    font-size: 13px;
    color: #555;
    font-style: italic;
    margin-bottom: 20px;
    padding: 12px;
    background: #f8f8f8;
    border-radius: 8px;
    /* TODO: Füge einen linken Akzent-Rand hinzu */
  }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .section-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    /* TODO: Gib Ziele und Frustrationen unterschiedliche Farben */
    color: #aaa;
    margin-bottom: 8px;
  }
  .item {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    font-size: 13px;
    color: #555;
    margin-bottom: 6px;
    line-height: 1.4;
  }
  .bullet { flex-shrink: 0; margin-top: 2px; }
  /* BONUS: Füge am unteren Rand einen Komfort-Indikator als farbige Leiste hinzu */
</style>
</head>
<body>
  <div class="persona-card">
    <div class="header">
      <div class="avatar">👤</div>
      <div>
        <div class="name">Markus Weber</div>
        <div class="role">Full-Stack Entwickler, 4 Jahre Erfahrung</div>
      </div>
    </div>
    <div class="quote">
      "Ich will mir keine Gedanken über Design machen müssen – aber ich will auch nicht, dass meine UIs schlecht aussehen."
    </div>
    <div class="two-col">
      <div>
        <div class="section-label">Ziele</div>
        <div class="item"><span class="bullet">▸</span>Schnell produktiven Code liefern</div>
        <div class="item"><span class="bullet">▸</span>Design-Entscheidungen sicher treffen</div>
        <div class="item"><span class="bullet">▸</span>Mit Designern effektiv zusammenarbeiten</div>
      </div>
      <div>
        <div class="section-label">Frustrationen</div>
        <div class="item"><span class="bullet">▸</span>Kein Design-System vorhanden</div>
        <div class="item"><span class="bullet">▸</span>Feedback: "Sieht nicht gut aus"</div>
        <div class="item"><span class="bullet">▸</span>Keine Zeit für Design-Recherche</div>
      </div>
    </div>
  </div>
</body>
</html>`;

const EXERCISE_CONTROLS: PropertyControl[] = [
  {
    id: "card-shadow",
    property: "boxShadow",
    label: "Karten-Schatten",
    type: "select",
    target: ".persona-card",
    group: "shadows",
    defaultValue: "none",
    options: [
      { label: "Kein", value: "none" },
      { label: "Subtil", value: "0 2px 12px rgba(0,0,0,0.08)" },
      { label: "Mittel", value: "0 4px 24px rgba(0,0,0,0.12)" },
      { label: "Stark", value: "0 8px 40px rgba(0,0,0,0.16)" },
    ],
  },
  {
    id: "card-radius",
    property: "borderRadius",
    label: "Karten-Rundung",
    type: "slider",
    target: ".persona-card",
    group: "borders",
    defaultValue: 12,
    min: 0,
    max: 24,
    step: 4,
    unit: "px",
  },
  {
    id: "avatar-size",
    property: "width",
    label: "Avatar Größe",
    type: "slider",
    target: ".avatar",
    group: "layout",
    defaultValue: 48,
    min: 40,
    max: 72,
    step: 4,
    unit: "px",
  },
  {
    id: "avatar-bg",
    property: "backgroundColor",
    label: "Avatar Hintergrundfarbe",
    type: "color",
    target: ".avatar",
    group: "colors",
    defaultValue: "#eeeeee",
  },
  {
    id: "quote-bg",
    property: "backgroundColor",
    label: "Zitat Hintergrund",
    type: "color",
    target: ".quote",
    group: "colors",
    defaultValue: "#f8f8f8",
  },
  {
    id: "quote-border",
    property: "borderLeft",
    label: "Zitat Akzent-Rand",
    type: "select",
    target: ".quote",
    group: "borders",
    defaultValue: "none",
    options: [
      { label: "Kein", value: "none" },
      { label: "Akzent (3px)", value: "3px solid #0ea5a0" },
      { label: "Akzent (4px)", value: "4px solid #0ea5a0" },
    ],
  },
  {
    id: "goals-color",
    property: "color",
    label: "\"Ziele\" Label Farbe",
    type: "color",
    target: ".two-col > div:first-child .section-label",
    group: "colors",
    defaultValue: "#aaaaaa",
  },
  {
    id: "frustrations-color",
    property: "color",
    label: "\"Frustrationen\" Label Farbe",
    type: "color",
    target: ".two-col > div:last-child .section-label",
    group: "colors",
    defaultValue: "#aaaaaa",
  },
  {
    id: "card-padding",
    property: "padding",
    label: "Karten-Padding",
    type: "slider",
    target: ".persona-card",
    group: "spacing",
    defaultValue: 28,
    min: 16,
    max: 40,
    step: 4,
    unit: "px",
  },
];

export default function PersonasModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      <div className="max-w-[1000px] mx-auto w-full px-8 py-12 flex-1">

        {/* ── Title ── */}
        <div className="inline-flex items-center gap-2 bg-(--accent-dim) border border-(--accent-border) rounded-full py-1 px-3.5 font-mono text-[11px] font-semibold text-(--accent) tracking-[1.5px] uppercase mb-6 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-(--accent) before:shadow-[0_0_6px_var(--accent)] before:shrink-0">
          Modul 04
        </div>
        <h1 className="text-[clamp(28px,4vw,36px)] font-extrabold leading-[1.15] tracking-[-0.5px] text-(--text-primary) mb-2 mt-0">
          User Personas erstellen
        </h1>
        <p className="text-[15px] font-medium leading-normal text-(--text-secondary) mb-8 mt-0 max-w-130">
          Evidenzbasierte Personas erstellen, die Teams helfen, konsistentere
          und nutzerfokussiertere Entscheidungen zu treffen.
        </p>

        <ModuleMeta duration="45 Minuten" practiceTime="~20 Min." />

        <LearningGoals
          goals={[
            "Definieren, was eine Persona ist – und was sie nicht ist",
            "Die Bestandteile einer nützlichen Persona kennen",
            "Eine eigene Persona nach der Vorlage erstellen",
            "Erklären, wie Personas Designentscheidungen leiten",
          ]}
        />

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── What is a Persona ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Definition
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Was ist eine Persona?
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Eine Persona ist eine <strong>fiktive, aber realistische Darstellung</strong>{" "}
          eines wichtigen Nutzersegments, aufgebaut aus echten Forschungsdaten.
          Sie gibt einem Cluster von Nutzern, die ähnliche Ziele, Verhaltensweisen
          und Schmerzpunkte teilen, einen Namen, ein Gesicht und eine Geschichte.
        </p>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-6">
          Personas sind <strong>keine demografischen Durchschnittswerte</strong>.
          Sie sind keine Marketing-Profile. Eine gute Persona konzentriert sich
          auf <em>Verhalten und Ziele</em> – nicht auf Alter oder Einkommen.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-(--bad-bg) border border-(--bad-border) rounded-xl p-4">
            <p className="font-mono text-[10px] font-semibold text-(--bad-color) uppercase tracking-wider mb-2">
              Keine Persona
            </p>
            <ul className="space-y-1.5 text-[13px] text-(--text-secondary)">
              <li className="flex gap-2"><span className="text-(--bad-color)">✗</span>„Frau, 35–44 Jahre, mittleres Einkommen"</li>
              <li className="flex gap-2"><span className="text-(--bad-color)">✗</span>„Nutzer, der unser Produkt täglich verwendet"</li>
              <li className="flex gap-2"><span className="text-(--bad-color)">✗</span>„Alle unsere Kunden"</li>
            </ul>
          </div>
          <div className="bg-(--success-bg) border border-(--success-border) rounded-xl p-4">
            <p className="font-mono text-[10px] font-semibold text-(--success-color) uppercase tracking-wider mb-2">
              Gute Persona
            </p>
            <ul className="space-y-1.5 text-[13px] text-(--text-secondary)">
              <li className="flex gap-2"><span className="text-(--success-color)">✓</span>Spezifisches Ziel, spezifische Frustration</li>
              <li className="flex gap-2"><span className="text-(--success-color)">✓</span>Aus Forschungsdaten abgeleitet</li>
              <li className="flex gap-2"><span className="text-(--success-color)">✓</span>Beantwortet: „Was würde [Name] hier tun?"</li>
            </ul>
          </div>
        </div>

        {/* ── Anatomy ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Aufbau
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Was macht eine nützliche Persona aus?
        </h2>

        <TheoryCard label="Bestandteile einer Persona">
          <ConceptList>
            <ConceptItem title="Name und Kontext">
              Ein realistischer Name und eine kurze Beschreibung ihrer Rolle
              und Situation. Keine Lebensgeschichte – nur genug, um sie
              greifbar zu machen.
            </ConceptItem>
            <ConceptItem title="Ziele">
              Was versuchen sie mit deinem Produkt zu erreichen? Wie sieht
              Erfolg für sie aus? Formuliere als Ergebnis, nicht als Feature.
            </ConceptItem>
            <ConceptItem title="Frustrationen / Schmerzpunkte">
              Welche Probleme haben sie aktuell? Was nervt sie an bestehenden
              Lösungen? Das sind die Chancen für dein Design.
            </ConceptItem>
            <ConceptItem title="Verhalten">
              Wie nutzen sie Technologie? Power-User oder vorsichtige
              Einsteiger? Mobile-first oder Desktop-first?
            </ConceptItem>
            <ConceptItem title="Repräsentatives Zitat">
              Ein einzeiliges Zitat in ihrer Stimme, das ihre Kernhaltung
              erfasst. Das ist eine nützliche Abkürzung in Team-Diskussionen:
              „Sarah würde das nie sagen."
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        {/* ── Interactive Persona ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-3 block">
          Interaktiv
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-3 mt-0">
          Persona-Karte erkunden
        </h2>
        <p className="text-[13px] text-(--text-secondary) mb-4">
          Klicke auf die Felder der Karte, um sie zu bearbeiten – erstelle
          deine eigene Persona für das Workshop-Szenario:
        </p>

        <PersonaCard />

        {/* ── How many ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Praxistipp
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-3 mt-0">
          Wie viele Personas?
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Ein häufiger Fehler ist, zu viele Personas zu erstellen. Wenn du 12
          Personas hast, hast du null – weil sie niemand erinnert oder benutzt.
        </p>

        <div className="bg-(--bg-elevated) rounded-xl p-4 mb-6 flex items-start gap-3">
          <span className="text-2xl mt-0.5">💡</span>
          <p className="text-[13px] text-(--text-secondary) leading-snug">
            <strong>Faustregel:</strong> 2–4 primäre Personas pro Produkt. Wenn
            zwei Personas in jeder Situation dieselben Designentscheidungen
            treffen würden, sollten sie zusammengeführt werden.
          </p>
        </div>

        <ImagePlaceholder
          aspectRatio="16/6"
          label="Persona-Vorlage: Name, Ziele, Frustrationen, Zitat, Komfort-Indikator"
          caption="Eine vollständige Persona-Karte mit allen Bestandteilen auf einen Blick"
        />

        <RuleBox title="Kernregel">
          Eine Persona ist nützlich, wenn du eine Designentscheidung diskutierst
          und fragen kannst: „Was würde [Name] hier tun?" – und eine sinnvolle
          Antwort erhältst. Das ist der Test.
        </RuleBox>


      </div>

      <ModuleNav prevModule={prevModule} nextModule={nextModule} />
    </div>
  );
}
