import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Brain, Scan } from "lucide-react";
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
  * { box-sizing: border-box; margin: 0; }
  body {
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    background: #f4f4f8;
    padding: 40px;
    display: flex;
    justify-content: center;
    --text-primary: #12121e;
    --text-secondary: #52526e;
    --text-tertiary: #9090aa;
    --accent: #0ea5a0;
    --accent-dim: rgba(14,165,160,0.08);
    --accent-border: rgba(14,165,160,0.22);
    --bg-surface: #ffffff;
    --bg-elevated: #eeeef4;
  }

  .settings { max-width: 480px; width: 100%; }

  .nav {
    display: flex;
    gap: 4px;
    margin-bottom: 20px;
  }
  .nav-item {
    font-size: 13px;
    font-weight: 600;
    padding: 8px 16px;
    color: var(--text-secondary);
    cursor: pointer;
  }

  .settings-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .setting-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
  }
  .setting-value {
    font-size: 13px;
    color: var(--text-secondary);
  }
</style>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <div class="settings">
    <div class="nav">
      <div class="nav-item">Allgemein</div>
      <div class="nav-item">Benachrichtigungen</div>
      <div class="nav-item">Sicherheit</div>
    </div>
    <div class="settings-list">
      <div class="setting-label">Sprache</div>
      <div class="setting-value">Deutsch</div>
      <div class="setting-label">Dark Mode</div>
      <div class="setting-value">Aktiviert</div>
      <div class="setting-label">Zeitzone</div>
      <div class="setting-value">Europe/Berlin</div>
      <div class="setting-label">E-Mail-Benachrichtigungen</div>
      <div class="setting-value">Aktiviert</div>
      <div class="setting-label">Push-Benachrichtigungen</div>
      <div class="setting-value">Deaktiviert</div>
    </div>
  </div>
</body>
</html>`;

const EXERCISE_CONTROLS: PropertyControl[] = [
  {
    id: "nav-bg",
    property: "backgroundColor",
    label: "Nav — Hintergrund",
    type: "color",
    target: ".nav",
    group: "colors",
    defaultValue: "transparent",
  },
  {
    id: "nav-gap",
    property: "gap",
    label: "Nav — Abstand zwischen Items",
    type: "slider",
    target: ".nav",
    group: "spacing",
    defaultValue: 4,
    min: 0, max: 16, step: 2, unit: "px",
  },
  {
    id: "active-item-bg",
    property: "backgroundColor",
    label: "Aktives Nav-Item — Hintergrund",
    type: "color",
    target: ".nav-item:first-child",
    group: "colors",
    defaultValue: "transparent",
  },
  {
    id: "active-item-color",
    property: "color",
    label: "Aktives Nav-Item — Textfarbe",
    type: "color",
    target: ".nav-item:first-child",
    group: "colors",
    defaultValue: "#52526e",
  },
  {
    id: "settings-gap",
    property: "gap",
    label: "Settings-Liste — Abstand",
    type: "slider",
    target: ".settings-list",
    group: "spacing",
    defaultValue: 10,
    min: 4, max: 28, step: 2, unit: "px",
  },
  {
    id: "label-color",
    property: "color",
    label: "Label — Farbe",
    type: "color",
    target: ".setting-label",
    group: "colors",
    defaultValue: "#52526e",
  },
  {
    id: "label-size",
    property: "fontSize",
    label: "Label — Schriftgröße",
    type: "select",
    target: ".setting-label",
    group: "typography",
    defaultValue: "13px",
    options: [
      { label: "11px (Small)", value: "11px" },
      { label: "13px (Body)", value: "13px" },
    ],
  },
  {
    id: "value-color",
    property: "color",
    label: "Value — Farbe",
    type: "color",
    target: ".setting-value",
    group: "colors",
    defaultValue: "#52526e",
  },
];

const COPY_CODE = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Settings Panel — Gestaltprinzipien</title>
  <style>
    * { box-sizing: border-box; margin: 0; }
    body {
      font-family: system-ui, sans-serif;
      background: #f4f4f8;
      padding: 40px;
      display: flex;
      justify-content: center;
    }
    .settings {
      max-width: 480px;
      width: 100%;
    }
    /* --- Navigation: kein aktiver Zustand, kein Container --- */
    .nav {
      display: flex;
      gap: 4px;
      margin-bottom: 20px;
    }
    .nav-item {
      font-size: 13px;
      font-weight: 600;
      padding: 8px 16px;
      color: #52526e;
      cursor: pointer;
    }
    /* --- Alle Settings-Einträge gleichmäßig --- */
    .settings-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .setting-label {
      font-size: 13px;
      font-weight: 600;
      color: #52526e;
    }
    .setting-value {
      font-size: 13px;
      color: #52526e;
    }
    /* TODO: Proximity — Labels und Values eng gruppieren */
    /* TODO: Similarity — Labels vs Values differenzieren */
    /* TODO: Common Region — Sektionen in Cards */
    /* TODO: Continuity — Nav visuell verbinden */
    /* TODO: Figure-Ground — Aktiven Tab hervorheben */
  </style>
</head>
<body>
  <div class="settings">
    <div class="nav">
      <div class="nav-item">Allgemein</div>
      <div class="nav-item">Benachrichtigungen</div>
      <div class="nav-item">Sicherheit</div>
    </div>
    <div class="settings-list">
      <div class="setting-label">Sprache</div>
      <div class="setting-value">Deutsch</div>
      <div class="setting-label">Dark Mode</div>
      <div class="setting-value">Aktiviert</div>
      <div class="setting-label">Zeitzone</div>
      <div class="setting-value">Europe/Berlin</div>
      <div class="setting-label">E-Mail-Benachrichtigungen</div>
      <div class="setting-value">Aktiviert</div>
      <div class="setting-label">Push-Benachrichtigungen</div>
      <div class="setting-value">Deaktiviert</div>
    </div>
  </div>
</body>
</html>`;

export const meta: MetaFunction = () => [
  { title: "Gestaltprinzipien in der Praxis — UX/UI Workshop" },
];

export async function loader({ params: _ }: LoaderFunctionArgs) {
  const slug = "gestalt-principles";
  const currentIndex = modules.findIndex((m) => m.slug === slug);
  const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule =
    currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;
  return { prevModule, nextModule };
}

export default function GestaltPrinciplesModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      <div className="max-w-[1000px] mx-auto w-full px-8 py-12 flex-1">

        {/* ── TITELSEITE ── */}
        <div className="mb-2">
          <Badge variant="module" dot>Modul 08</Badge>
        </div>

        <h1 className="text-[clamp(28px,4vw,36px)] font-extrabold leading-[1.15] tracking-[-0.5px] text-(--text-primary) mb-2 mt-0">
          Gestaltprinzipien<br />in der Praxis
        </h1>
        <p className="text-[15px] font-medium leading-normal text-(--text-secondary) mb-8 mt-0 max-w-130">
          Warum unser Gehirn Ordnung sucht — und wie du sechs psychologische Grundprinzipien gezielt einsetzt, um Interfaces intuitiver und verständlicher zu gestalten.
        </p>

        <ModuleMeta duration="45 Minuten" practiceTime="~15 Min." />

        <LearningGoals
          goals={[
            "Die sechs zentralen Gestaltprinzipien benennen und erklären können",
            "Proximity (Nähe) bewusst einsetzen, um Zusammengehörigkeit visuell zu kommunizieren",
            "Similarity (Ähnlichkeit) nutzen, um Kategorien und Gruppen erkennbar zu machen",
            "Closure, Continuity, Figure-Ground und Common Region in UI-Elementen identifizieren",
            "Gestaltprinzipien gezielt kombinieren, um Interfaces ohne zusätzliche Erklärungen verständlich zu machen",
          ]}
        />

        <RuleBox title="Kerngedanke">
          Gutes UI-Design erklärt sich selbst — nicht durch Labels oder Hilfetext, sondern durch visuelle Struktur. Die Gestaltprinzipien beschreiben, wie unser Gehirn visuell Ordnung herstellt. Wer sie kennt, kann Interfaces bauen, die intuitiv funktionieren.
        </RuleBox>

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── THEORIE ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Theorie</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">Was sind Gestaltprinzipien?</h2>

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Die Gestaltpsychologie wurde Anfang des 20. Jahrhunderts in Deutschland entwickelt. Ihr zentraler Gedanke:{" "}
          <strong className="font-semibold text-(--text-primary)">Unser Gehirn nimmt nicht einzelne Elemente wahr, sondern organisiert sie automatisch zu sinnvollen Gruppen und Mustern.</strong>{" "}
          Das passiert unbewusst und sofort — lange bevor wir bewusst über eine Oberfläche nachdenken.
        </p>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Für UI-Design bedeutet das: Wenn du die Regeln kennst, nach denen das Gehirn Ordnung sucht, kannst du Interfaces so gestalten, dass Nutzer sie{" "}
          <strong className="font-semibold text-(--text-primary)">ohne Erklärung verstehen</strong>. Wenn du die Regeln ignorierst, erzeugst du Verwirrung — selbst wenn die Informationen technisch korrekt dargestellt sind.
        </p>

        <TheoryCard label="Die sechs Prinzipien">
          <ConceptList>
            <ConceptItem title="Proximity (Nähe)">
              Elemente, die räumlich nahe beieinander stehen, werden als zusammengehörig wahrgenommen. Das ist das wichtigste Prinzip für Layout und Spacing — und das am häufigsten verletzte.
            </ConceptItem>
            <ConceptItem title="Similarity (Ähnlichkeit)">
              Elemente, die sich visuell ähneln (Farbe, Form, Größe, Typografie), werden als zusammengehörig wahrgenommen. So erkennt man Kategorien, Gruppen und Rollen im UI auf einen Blick.
            </ConceptItem>
            <ConceptItem title="Closure (Geschlossenheit)">
              Das Gehirn vervollständigt unvollständige Formen automatisch. Deshalb funktionieren Progress Bars, abgeschnittene Karussells und teilweise sichtbare Listen — das Gehirn ergänzt den Rest.
            </ConceptItem>
            <ConceptItem title="Continuity (Fortsetzung)">
              Das Auge folgt bevorzugt Linien und Kurven. Elemente auf einer gemeinsamen Achse oder Linie wirken zusammengehörig — selbst ohne sichtbare Verbindung. Grundlage für Stepper, Timelines und Layouts.
            </ConceptItem>
            <ConceptItem title="Figure-Ground (Figur-Grund)">
              Wir trennen automatisch Vordergrund von Hintergrund. Modals, Overlays und Dropdowns nutzen dieses Prinzip — der abgedunkelte Hintergrund macht die Trennung sofort klar.
            </ConceptItem>
            <ConceptItem title="Common Region (Gemeinsame Region)">
              Elemente innerhalb einer gemeinsamen Begrenzung (Rahmen, Hintergrund, Card) werden als Gruppe wahrgenommen. Cards, Fieldsets und gruppierte Toolbar-Buttons basieren auf diesem Prinzip.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── BEISPIEL 1: PROXIMITY ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Beispiel 01 — Proximity</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">Formulare: Spacing erzeugt Zugehörigkeit</h2>

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Formularfelder und ihre Labels werden durch{" "}
          <strong className="font-semibold text-(--text-primary)">räumliche Nähe</strong> gruppiert. Wenn der Abstand zwischen Label und Input genauso groß ist wie zwischen den Feld-Gruppen, entsteht Ambiguität — der Nutzer weiß nicht sofort, welches Label zu welchem Feld gehört.
        </p>

        <ComparisonPanel
          bad={{
            label: "Vorher",
            children: (
              <div className="flex flex-col gap-3">
                {["Vorname", "Nachname", "E-Mail"].map((label, i) => (
                  <div key={label} className="flex flex-col gap-3">
                    <label style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, color: "var(--text-primary)" }}>{label}</label>
                    <input
                      readOnly
                      defaultValue={["Max", "Mustermann", "max@example.com"][i]}
                      style={{ fontFamily: "var(--font-body)", fontSize: 11, padding: "6px 10px", borderRadius: 6, border: "1px solid var(--bg-elevated)", background: "var(--bg-surface)", color: "var(--text-primary)", width: "100%", outline: "none" }}
                    />
                  </div>
                ))}
              </div>
            ),
          }}
          good={{
            label: "Nachher",
            children: (
              <div className="flex flex-col gap-5">
                {["Vorname", "Nachname", "E-Mail"].map((label, i) => (
                  <div key={label} className="flex flex-col gap-1">
                    <label style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, color: "var(--text-primary)" }}>{label}</label>
                    <input
                      readOnly
                      defaultValue={["Max", "Mustermann", "max@example.com"][i]}
                      style={{ fontFamily: "var(--font-body)", fontSize: 11, padding: "6px 10px", borderRadius: 6, border: "1px solid var(--bg-elevated)", background: "var(--bg-surface)", color: "var(--text-primary)", width: "100%", outline: "none" }}
                    />
                  </div>
                ))}
              </div>
            ),
          }}
        />

        <AnnotationGrid
          items={[
            { label: "Label → Input", value: "12px → 4px" },
            { label: "Gruppe → Gruppe", value: "12px → 20px" },
            { label: "Prinzip", value: "Proximity" },
          ]}
        />

        <ExplanationBox title="Analyse">
          <p>
            Im Vorher-Beispiel sind alle Abstände gleich — das Label „Nachname" schwebt genau in der Mitte zwischen dem Input von „Vorname" und seinem eigenen Input. Das Gehirn kann die Zugehörigkeit nicht sofort erkennen.
          </p>
          <p>
            Im Nachher-Beispiel ist der{" "}
            <strong className="font-semibold text-(--text-primary)">Abstand innerhalb einer Gruppe (4px)</strong> viel kleiner als der{" "}
            <strong className="font-semibold text-(--text-primary)">Abstand zwischen Gruppen (20px)</strong>. Dadurch wird die Zugehörigkeit sofort klar — ohne Hilfslinien, Rahmen oder Icons.
          </p>
        </ExplanationBox>

        <RuleBox>
          Der Abstand innerhalb einer zusammengehörigen Gruppe muss deutlich kleiner sein als der Abstand zwischen den Gruppen. Als Faustregel: Mindestens das 2–3-fache Verhältnis.
        </RuleBox>

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── BEISPIEL 2: SIMILARITY ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Beispiel 02 — Similarity</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">Tags: Visuelle Kodierung erzeugt Kategorien</h2>

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Wenn mehrere Tags nebeneinander stehen, erkennt das Gehirn automatisch Gruppen — vorausgesetzt, sie sind{" "}
          <strong className="font-semibold text-(--text-primary)">visuell unterschiedlich kodiert</strong>. Gleich aussehende Tags werden als gleichartig wahrgenommen, selbst wenn sie unterschiedliche Bedeutungen haben.
        </p>

        <ComparisonPanel
          bad={{
            label: "Vorher",
            children: (
              <div className="flex flex-wrap gap-1.5">
                {["Aktiv", "Design", "Dringend", "Frontend", "Review"].map((t) => (
                  <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 600, padding: "3px 10px", borderRadius: 100, letterSpacing: "0.5px", textTransform: "uppercase", background: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--bg-elevated)" }}>{t}</span>
                ))}
              </div>
            ),
          }}
          good={{
            label: "Nachher",
            children: (
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "Aktiv", type: "status" },
                  { label: "Design", type: "category" },
                  { label: "Dringend", type: "priority" },
                  { label: "Frontend", type: "category" },
                  { label: "Review", type: "status" },
                ].map(({ label, type }) => (
                  <span key={label} style={{
                    fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 600,
                    padding: "3px 10px", borderRadius: 100, letterSpacing: "0.5px", textTransform: "uppercase",
                    background: type === "status" ? "var(--accent-dim)" : type === "priority" ? "var(--warning-bg)" : "var(--bg-elevated)",
                    color: type === "status" ? "var(--accent)" : type === "priority" ? "var(--warning-color)" : "var(--text-secondary)",
                    border: `1px solid ${type === "status" ? "var(--accent-border)" : type === "priority" ? "var(--warning-border)" : "var(--bg-elevated)"}`,
                  }}>{label}</span>
                ))}
              </div>
            ),
          }}
        />

        <AnnotationGrid
          items={[
            { label: "Status-Tags", value: "Teal / Accent" },
            { label: "Kategorie-Tags", value: "Neutral / Grey" },
            { label: "Priorität-Tags", value: "Warning / Orange" },
          ]}
        />

        <ExplanationBox title="Analyse">
          <p>
            Im Vorher-Beispiel sehen alle Tags identisch aus. Es gibt keine Möglichkeit, auf einen Blick zu erkennen, welche Tags einen Status beschreiben, welche eine Kategorie, und welche eine Priorität markieren.
          </p>
          <p>
            Im Nachher-Beispiel signalisiert die{" "}
            <strong className="font-semibold text-(--text-primary)">Farbkodierung</strong> sofort drei verschiedene Typen. Das Gehirn gruppiert „Aktiv" und „Review" automatisch zusammen (gleiche Farbe = gleiche Rolle), ohne dass ein zusätzliches Label nötig ist.
          </p>
        </ExplanationBox>

        <RuleBox>
          Nutze visuelle Ähnlichkeit (Farbe, Form, Größe) bewusst, um Kategorien zu kommunizieren. Gleichartige Elemente müssen gleich aussehen — und verschiedenartige müssen sich sichtbar unterscheiden.
        </RuleBox>

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── BEISPIEL 3: CLOSURE & CONTINUITY ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Beispiel 03 — Closure &amp; Continuity</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">Stepper &amp; Progress: Das Gehirn ergänzt den Rest</h2>

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Progress Bars und Stepper funktionieren, weil unser Gehirn{" "}
          <strong className="font-semibold text-(--text-primary)">unvollständige Formen vervollständigt</strong> (Closure) und{" "}
          <strong className="font-semibold text-(--text-primary)">visuellen Linien folgt</strong> (Continuity). Eine teilweise gefüllte Leiste wird sofort als „zu X% abgeschlossen" gelesen — das Gehirn ergänzt automatisch den fehlenden Teil.
        </p>

        <ComparisonPanel
          bad={{
            label: "Vorher",
            children: (
              <div className="flex flex-col gap-3.5">
                <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Schritt 2 von 4 — Adresse</div>
                <div className="flex gap-1.5 flex-wrap">
                  {["1. Konto", "2. Adresse", "3. Zahlung", "4. Bestätigung"].map((s, i) => (
                    <span key={s} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 4, background: "var(--bg-elevated)", color: i === 1 ? "var(--text-primary)" : "var(--text-tertiary)", fontWeight: i === 1 ? 600 : 400 }}>{s}</span>
                  ))}
                </div>
              </div>
            ),
          }}
          good={{
            label: "Nachher",
            children: (
              <div className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-baseline">
                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-primary)" }}>Adresse eingeben</span>
                    <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>Schritt 2 / 4</span>
                  </div>
                  <div style={{ width: "100%", height: 8, borderRadius: 100, background: "var(--bg-elevated)", overflow: "hidden" }}>
                    <div style={{ width: "50%", height: "100%", borderRadius: 100, background: "var(--accent)" }} />
                  </div>
                </div>
                <div className="flex items-center">
                  {[
                    { label: "Konto", done: true },
                    { label: "Adresse", active: true },
                    { label: "Zahlung", done: false },
                    { label: "Fertig", done: false },
                  ].map(({ label, done, active }, i, arr) => (
                    <div key={label} className="flex items-center">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <div style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, background: done || active ? "var(--accent)" : "var(--bg-elevated)", color: done || active ? "#fff" : "var(--text-tertiary)", flexShrink: 0 }}>
                          {done ? "✓" : i + 1}
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "var(--text-secondary)" }}>{label}</span>
                      </div>
                      {i < arr.length - 1 && (
                        <div style={{ flex: 1, height: 2, minWidth: 20, margin: "0 8px", background: done ? "var(--accent)" : "var(--bg-elevated)" }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ),
          }}
        />

        <ExplanationBox title="Analyse">
          <p>
            Im Vorher-Beispiel sind die Schritte als isolierte Badges dargestellt. Es gibt keine visuelle Verbindung zwischen ihnen — der Nutzer muss den Text lesen, um den Fortschritt zu verstehen.
          </p>
          <p>
            Im Nachher-Beispiel erzeugen die{" "}
            <strong className="font-semibold text-(--text-primary)">Verbindungslinien</strong> (Continuity) einen klaren Pfad von links nach rechts. Die{" "}
            <strong className="font-semibold text-(--text-primary)">Progress Bar</strong> nutzt Closure: das Gehirn sieht den leeren Bereich und ergänzt automatisch „noch 50% übrig". Der farbige Wechsel von Teal zu Grau zeigt sofort, was erledigt ist und was noch kommt.
          </p>
        </ExplanationBox>

        <RuleBox>
          Verwende visuelle Linien und Verbindungen, um Reihenfolgen darzustellen. Nutze teilweise gefüllte Formen (Progress Bars, Ringe, Stepper-Linien), um Fortschritt intuitiv erfahrbar zu machen — das Gehirn ergänzt den Rest von selbst.
        </RuleBox>

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── BEISPIEL 4: FIGURE-GROUND ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Beispiel 04 — Figure-Ground</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">Modals: Vordergrund braucht einen klaren Hintergrund</h2>

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Wenn ein Modal geöffnet wird, muss der Nutzer sofort verstehen:{" "}
          <strong className="font-semibold text-(--text-primary)">„Das hier ist wichtig, der Rest wartet."</strong>{" "}
          Das gelingt durch eine klare Trennung von Figur (Modal) und Grund (Hintergrund). Ohne diese Trennung konkurriert der Inhalt des Modals mit dem dahinter liegenden Inhalt.
        </p>

        <ComparisonPanel
          bad={{
            label: "Vorher",
            children: (
              <div style={{ position: "relative", minHeight: 120, borderRadius: 6, overflow: "hidden", background: "var(--bg-base)" }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", gap: 6, padding: 10 }}>
                  {[80, 60, 90, 50, 70, 65, 85].map((w, i) => (
                    <div key={i} style={{ height: 8, borderRadius: 4, background: "var(--bg-elevated)", width: `${w}%`, opacity: 0.5 }} />
                  ))}
                </div>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ background: "var(--bg-surface)", borderRadius: 12, padding: "14px 18px", boxShadow: "0 1px 3px rgba(0,0,0,0.07)", textAlign: "center", minWidth: 140 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px" }}>Änderungen speichern?</p>
                    <p style={{ fontSize: 10, color: "var(--text-secondary)", margin: "0 0 8px", lineHeight: 1.4 }}>Möchtest du die Änderungen übernehmen?</p>
                    <button style={{ fontFamily: "inherit", fontSize: 10, fontWeight: 600, padding: "5px 14px", borderRadius: 6, border: "none", cursor: "pointer", color: "#fff", background: "var(--accent)" }}>Speichern</button>
                  </div>
                </div>
              </div>
            ),
          }}
          good={{
            label: "Nachher",
            children: (
              <div style={{ position: "relative", minHeight: 120, borderRadius: 6, overflow: "hidden", background: "var(--bg-base)" }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", gap: 6, padding: 10 }}>
                  {[80, 60, 90, 50, 70, 65, 85].map((w, i) => (
                    <div key={i} style={{ height: 8, borderRadius: 4, background: "var(--bg-elevated)", width: `${w}%`, opacity: 0.5 }} />
                  ))}
                </div>
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ background: "var(--bg-surface)", borderRadius: 12, padding: "14px 18px", boxShadow: "0 4px 12px rgba(0,0,0,0.4)", textAlign: "center", minWidth: 140 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px" }}>Änderungen speichern?</p>
                    <p style={{ fontSize: 10, color: "var(--text-secondary)", margin: "0 0 8px", lineHeight: 1.4 }}>Möchtest du die Änderungen übernehmen?</p>
                    <button style={{ fontFamily: "inherit", fontSize: 10, fontWeight: 600, padding: "5px 14px", borderRadius: 6, border: "none", cursor: "pointer", color: "#fff", background: "var(--accent)" }}>Speichern</button>
                  </div>
                </div>
              </div>
            ),
          }}
        />

        <AnnotationGrid
          items={[
            { label: "Overlay", value: "keins → rgba(0,0,0,0.35)" },
            { label: "Shadow", value: "sm → md" },
            { label: "Prinzip", value: "Figure-Ground" },
          ]}
        />

        <ExplanationBox title="Analyse">
          <p>
            Im Vorher-Beispiel schwebt das Modal ohne Overlay über dem Hintergrund. Der Hintergrund ist weiterhin voll sichtbar und konkurriert mit dem Modal um Aufmerksamkeit. Der Nutzer muss aktiv erkennen, dass das Modal den Fokus hat.
          </p>
          <p>
            Im Nachher-Beispiel erzeugt das{" "}
            <strong className="font-semibold text-(--text-primary)">halbtransparente Overlay</strong> eine klare Trennung. Der Hintergrund ist visuell „deaktiviert", das Modal springt als Figur in den Vordergrund. Der{" "}
            <strong className="font-semibold text-(--text-primary)">stärkere Schatten</strong> verstärkt die Tiefenwirkung zusätzlich.
          </p>
        </ExplanationBox>

        <RuleBox>
          Wenn ein Element den Fokus beansprucht (Modal, Dropdown, Overlay), muss der restliche Inhalt visuell zurücktreten. Nutze Overlays, Blur oder gedimmte Hintergründe, um die Figur-Grund-Trennung unmissverständlich zu machen.
        </RuleBox>

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── BEISPIEL 5: COMMON REGION ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Beispiel 05 — Common Region</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">Dashboard-Karten: Rahmen erzeugen Gruppen</h2>

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Auf Dashboards werden oft viele Datenpunkte gleichzeitig dargestellt. Ohne visuelle Begrenzung — eine Card, ein Hintergrund, ein Rahmen — verschwimmen die einzelnen Metriken und werden{" "}
          <strong className="font-semibold text-(--text-primary)">als ein großer Textblock wahrgenommen</strong> statt als separate Einheiten.
        </p>

        <ComparisonPanel
          bad={{
            label: "Vorher",
            children: (
              <div className="flex gap-5 justify-center">
                {[{ v: "2.847", l: "Nutzer" }, { v: "64%", l: "Conversion" }, { v: "12ms", l: "Latenz" }].map(({ v, l }) => (
                  <div key={l} className="text-center">
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>{v}</div>
                    <div style={{ fontSize: 9, fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
                  </div>
                ))}
              </div>
            ),
          }}
          good={{
            label: "Nachher",
            children: (
              <div className="flex gap-2.5">
                {[{ v: "2.847", l: "Nutzer" }, { v: "64%", l: "Conversion" }, { v: "12ms", l: "Latenz" }].map(({ v, l }) => (
                  <div key={l} style={{ flex: 1, padding: 10, borderRadius: 8, background: "var(--bg-surface)", border: "1px solid var(--bg-elevated)", textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>{v}</div>
                    <div style={{ fontSize: 9, fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
                  </div>
                ))}
              </div>
            ),
          }}
        />

        <AnnotationGrid
          items={[
            { label: "Container", value: "keiner → Card" },
            { label: "Border", value: "keiner → 1px solid" },
            { label: "Prinzip", value: "Common Region" },
          ]}
        />

        <ExplanationBox title="Analyse">
          <p>
            Im Vorher-Beispiel stehen die drei Metriken als freie Texte nebeneinander. Obwohl sie durch Abstand getrennt sind, fehlt eine visuelle Begrenzung — das Gehirn liest sie eher als zusammenhängenden Textblock.
          </p>
          <p>
            Im Nachher-Beispiel erzeugt jede{" "}
            <strong className="font-semibold text-(--text-primary)">Card (Background + Border + Border-Radius)</strong> eine klar abgegrenzte Region. Das Gehirn erkennt sofort: „Das sind drei separate Datenpunkte." Common Region ist einer der stärksten Gestalt-Effekte — er übertrumpft sogar Proximity in vielen Fällen.
          </p>
        </ExplanationBox>

        <RuleBox>
          Wenn Proximity allein nicht ausreicht, um Gruppen klar zu trennen, verwende gemeinsame Regionen: Cards, Hintergrundflächen oder dezente Rahmen. Aber Vorsicht — zu viele Regionen erzeugen visuelles Rauschen. Weniger ist mehr.
        </RuleBox>

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── PRAXISAUFGABE ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Praxisaufgabe</p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">Gestaltprinzipien anwenden</h2>

        <ExerciseBlock
          title="Aufgabenstellung"
          tasks={[
            "Proximity: Die Abstände zwischen Labels und ihren Werten sind nicht klar gruppiert — passe das Spacing an",
            "Similarity: Die Toggle-Beschriftungen und Sektionstiteln sehen identisch aus — differenziere sie visuell",
            "Common Region: Die drei Einstellungs-Sektionen haben keine visuelle Begrenzung — gruppiere sie in Cards",
            "Continuity: Die Navigationsleiste hat keine visuelle Verbindung zwischen den Items — verbessere den visuellen Fluss",
            "Figure-Ground: Der aktive Tab hebt sich nicht vom Hintergrund ab — schaffe eine klare Figur-Grund-Trennung",
          ]}
        >
          Analysiere das Settings-Panel unten und verbessere es, indem du gezielt Gestaltprinzipien einsetzt. Mehrere Prinzipien werden verletzt — erkenne sie und löse sie systematisch.
        </ExerciseBlock>

        <LiveEditor
          html={EXERCISE_HTML}
          controls={EXERCISE_CONTROLS}
        />

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── CODE BLOCK ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">Startcode — Zum Kopieren und Verbessern</p>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Kopiere den folgenden Code, öffne ihn im Browser und wende die Gestaltprinzipien an. Fokussiere dich auf Spacing, Farbdifferenzierung, Card-Gruppierung und die Navigation.
        </p>

        <CodeBlock language="HTML + CSS — Aufgabe Modul 08" code={COPY_CODE} />

      </div>

      <ModuleNav prevModule={prevModule} nextModule={nextModule} />
    </div>
  );
}
