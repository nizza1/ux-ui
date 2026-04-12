import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { modules } from "~/data/modules";
import { Badge } from "~/components/ui/Badge";
import { ModuleMeta } from "~/components/ui/ModuleMeta";
import { LearningGoals } from "~/components/ui/LearningGoals";
import { RuleBox } from "~/components/ui/RuleBox";
import { TheoryCard } from "~/components/ui/TheoryCard";
import { ConceptItem } from "~/components/ui/ConceptList";
import { ComparisonPanel } from "~/components/ui/ComparisonPanel";
import { CodeBlock } from "~/components/ui/CodeBlock";
import { ModuleNav } from "~/routes/modules.$slug";
import { LiveEditor } from "~/components/live-editor/LiveEditor";

export const meta: MetaFunction = () => [
  { title: "Farbe I: Farbsysteme aufbauen — UX/UI Workshop" },
  { name: "description", content: "Warum fünf Farben nicht reichen — HSL-basierte Farbsysteme mit Abstufungen erstellen" },
];

export function loader() {
  const moduleIndex = modules.findIndex((m) => m.slug === "color-systems");
  const prevModule = moduleIndex > 0 ? modules[moduleIndex - 1] : null;
  const nextModule = moduleIndex < modules.length - 1 ? modules[moduleIndex + 1] : null;
  return { prevModule, nextModule };
}

export default function ColorSystemsModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-(--bg-primary)">
      {/* Title & Meta */}
      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6">
        <Badge variant="module" dot>Modul 13</Badge>
        <h1 className="text-4xl font-bold text-(--text-primary) mt-6 mb-3">
          Farbe I: Farbsysteme aufbauen
        </h1>
        <p className="text-lg text-(--text-secondary) mb-8">
          Warum fünf „perfekte" Farben nicht reichen — und wie du ein systematisches, praxistaugliches Farbsystem für deine Projekte erstellst.
        </p>
        <ModuleMeta duration="60 Min." practiceTime="~20 Min." />
      </div>

      {/* Learning Goals */}
      <div className="max-w-2xl mx-auto px-4 pb-8 sm:px-6">
        <LearningGoals
          goals={[
            "Farbformate verstehen: HEX, RGB, HSL, HSB — wann nutzt du welches?",
            "HSL als bevorzugtes Format für systematische Farbarbeit einsetzen",
            "Eine vollständige Farbpalette mit Grautönen, Primärfarbe und Akzentfarben aufbauen",
            "Abstufungen (Shades) für jede Farbe definieren — von 100 bis 900",
            "Die Rolle von Sättigung und Helligkeit beim Erstellen konsistenter Farbskalen verstehen",
          ]}
        />
      </div>

      {/* Core Concept */}
      <div className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <RuleBox title="Kerngedanke">
          Fünf Hex-Codes reichen nicht. Ein echtes Farbsystem besteht aus 8–10 Abstufungen pro Farbgruppe — Grautöne, Primärfarbe und mehrere Akzentfarben.
        </RuleBox>
      </div>

      {/* Theory: Color Formats */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Farbformate im Überblick</h2>
        <p className="text-(--text-secondary) mb-6">
          Als Entwickler begegnest du Farben in verschiedenen Formaten. Jedes hat seinen Zweck — aber <strong>nicht jedes ist gleich gut geeignet</strong>, wenn du systematisch mit Farbe arbeiten willst. Hier ein kurzer Überblick über die wichtigsten Formate.
        </p>
        <TheoryCard label="Fünf gängige Farbformate">
          <ConceptItem title="HEX (#0ea5a0)">
            6 Hexadezimalstellen für Rot, Grün, Blau. Am häufigsten in CSS, aber schwer zu lesen — du siehst den Werten nicht an, ob die Farbe hell oder dunkel ist.
          </ConceptItem>
          <ConceptItem title="RGB / RGBA (14, 165, 160)">
            Rot, Grün, Blau als 0–255. RGBA ergänzt einen Alpha-Kanal (Transparenz). Etwas lesbarer als HEX, aber Farbtöne bleiben schwer abschätzbar.
          </ConceptItem>
          <ConceptItem title="HSL (178, 84%, 35%)">
            <strong>Hue (Farbton), Saturation (Sättigung), Lightness (Helligkeit).</strong> Du siehst sofort: Welche Farbe? Wie kräftig? Wie hell? Ideal für Farbsysteme.
          </ConceptItem>
          <ConceptItem title="HSB / HSV (178, 92%, 65%)">
            Hue, Saturation, Brightness. Gängig in Design-Tools (Figma, Photoshop). Achtung: Brightness ≠ Lightness! Browser verstehen nur HSL, nicht HSB.
          </ConceptItem>
          <ConceptItem title="OKLCH / LCH (modern)">
            Perceptuell gleichmäßige Standards für barrierefreie Farbarbeit. Neuer, aber noch nicht überall unterstützt.
          </ConceptItem>
        </TheoryCard>
      </section>

      {/* Why HSL? */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Warum HSL das bessere Format ist</h2>
        <p className="text-(--text-secondary) mb-8">
          HEX und RGB beschreiben Farben aus der Perspektive eines Bildschirms — wie viel Rot, Grün und Blau leuchtet. <strong>HSL beschreibt Farben so, wie Menschen sie wahrnehmen</strong>: Welcher Farbton? Wie satt? Wie hell? Dadurch erkennst du Verwandtschaften auf einen Blick.
        </p>
        <ComparisonPanel
          bad={{
            label: "Vorher (HEX)",
            children: (
              <div className="space-y-3">
                <div className="text-xs font-mono text-(--text-ghost) tracking-wide">Drei „verwandte" Blautöne in HEX:</div>
                <div className="flex gap-2">
                  <div className="flex-1 h-10 rounded bg-[#1e40af] flex items-center justify-center">
                    <span className="text-[9px] font-mono text-white">#1e40af</span>
                  </div>
                  <div className="flex-1 h-10 rounded bg-[#3b82f6] flex items-center justify-center">
                    <span className="text-[9px] font-mono text-white">#3b82f6</span>
                  </div>
                  <div className="flex-1 h-10 rounded bg-[#93c5fd] flex items-center justify-center">
                    <span className="text-[9px] font-mono">#93c5fd</span>
                  </div>
                </div>
                <div className="text-[10px] text-(--text-tertiary) italic">Verwandtschaft kaum erkennbar</div>
              </div>
            ),
          }}
          good={{
            label: "Nachher (HSL)",
            children: (
              <div className="space-y-3">
                <div className="text-xs font-mono text-(--text-ghost) tracking-wide">Dieselben Blautöne in HSL:</div>
                <div className="flex gap-2">
                  <div className="flex-1 h-10 rounded flex items-center justify-center" style={{ background: "hsl(224, 66%, 40%)" }}>
                    <span className="text-[9px] font-mono text-white">224, 66%, 40%</span>
                  </div>
                  <div className="flex-1 h-10 rounded flex items-center justify-center" style={{ background: "hsl(217, 91%, 60%)" }}>
                    <span className="text-[9px] font-mono text-white">217, 91%, 60%</span>
                  </div>
                  <div className="flex-1 h-10 rounded flex items-center justify-center" style={{ background: "hsl(213, 93%, 78%)" }}>
                    <span className="text-[9px] font-mono text-[#1e40af]">213, 93%, 78%</span>
                  </div>
                </div>
                <div className="text-[10px] text-(--text-tertiary) italic">Gleicher Hue-Bereich → System erkennbar</div>
              </div>
            ),
          }}
        />
        <RuleBox>
          <strong>Praxis-Empfehlung:</strong> Verwende HSL als Arbeitsformat. Du kannst damit Abstufungen intuitiv erstellen — einfach Lightness anpassen, fertig. HEX bleibt dein Export-Format für Code.
        </RuleBox>
      </section>

      {/* Interactive HSL Lab */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-4">HSL Color Lab — Farben live erkunden</h2>
        <p className="text-(--text-secondary) mb-8">
          Bewege die Regler und beobachte, wie sich Hue, Saturation und Lightness auf die Farbe auswirken. Achte besonders darauf, was passiert, wenn du <strong>nur die Lightness änderst</strong> — genau so baust du später Abstufungen.
        </p>
        <LiveEditor
          title="HSL Color Lab"
          html={`<div style="padding: 20px; background: var(--bg-elevated); border-radius: 12px;">
  <div style="font-family: monospace; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-ghost); margin-bottom: 12px;">
    Aktuelle Farbe
  </div>
  <div style="height: 100px; border-radius: 8px; background: hsl(178, 84%, 35%); margin-bottom: 12px;"></div>
  <div style="font-family: monospace; font-size: 12px; color: var(--text-secondary); line-height: 1.6; space-y: 6px;">
    <div>HSL: 178°, 84%, 35%</div>
    <div>#0ea5a0</div>
    <div>RGB: 14, 165, 160</div>
  </div>
</div>`}
        />
      </section>

      {/* Palette Building */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Du brauchst mehr Farben als du denkst</h2>
        <p className="text-(--text-secondary) mb-8">
          Farbpaletten-Generatoren geben dir fünf Farben — das reicht vielleicht für ein Logo, aber nicht für eine echte UI. In der Praxis brauchst du <strong>drei Farbgruppen</strong>, jede mit mehreren Abstufungen.
        </p>
        <ComparisonPanel
          bad={{
            label: "Vorher",
            children: (
              <div className="space-y-3">
                <div className="text-xs font-mono text-(--text-ghost) mb-2">5-Farben-Palette vom Generator</div>
                <div className="flex gap-1">
                  <div className="flex-1 h-12 rounded bg-[#264653]"></div>
                  <div className="flex-1 h-12 rounded bg-[#2a9d8f]"></div>
                  <div className="flex-1 h-12 rounded bg-[#e9c46a]"></div>
                  <div className="flex-1 h-12 rounded bg-[#f4a261]"></div>
                  <div className="flex-1 h-12 rounded bg-[#e76f51]"></div>
                </div>
                <div className="text-[10px] text-(--text-tertiary)">Welcher Grauton für Text? Welche Farbe für Hover? Disabled?</div>
              </div>
            ),
          }}
          good={{
            label: "Nachher",
            children: (
              <div className="space-y-3">
                <div className="text-xs font-mono text-(--text-ghost) mb-2">Systematische Palette mit Abstufungen</div>
                <div className="flex gap-1">
                  <div className="w-1/4">
                    <div className="text-[9px] font-mono font-semibold text-(--text-ghost) mb-1">Greys</div>
                    <div className="space-y-1">
                      <div className="h-3 rounded bg-[#f4f4f8]"></div>
                      <div className="h-3 rounded bg-[#d4d4de]"></div>
                      <div className="h-3 rounded bg-[#9090aa]"></div>
                      <div className="h-3 rounded bg-[#52526e]"></div>
                    </div>
                  </div>
                  <div className="w-1/4">
                    <div className="text-[9px] font-mono font-semibold text-(--text-ghost) mb-1">Primary</div>
                    <div className="space-y-1">
                      <div className="h-3 rounded bg-[#ccfbf1]"></div>
                      <div className="h-3 rounded bg-[#2dd4bf]"></div>
                      <div className="h-3 rounded bg-[#0ea5a0]"></div>
                      <div className="h-3 rounded bg-[#0a6e6a]"></div>
                    </div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
                <div className="text-[10px] text-(--text-tertiary)">Jede Farbe hat 4–10 Abstufungen</div>
              </div>
            ),
          }}
        />
      </section>

      {/* Practice Exercise */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Farbsystem verbessern</h2>
        <p className="text-(--text-secondary) mb-8">
          Die folgende Dashboard-Karte verwendet unsystematische Farben — reine HEX-Werte ohne Abstufungs-Logik. Deine Aufgabe: <strong>Baue ein HSL-basiertes Farbsystem</strong> und wende es auf die Karte an.
        </p>
        <LiveEditor
          title="Aufgabenstellung"
          html={`<div style="max-width: 480px; background: #f8f8f8; border-radius: 12px; padding: 20px; font-family: system-ui, sans-serif;">
  <div style="font-size: 18px; font-weight: 700; color: #333333; margin-bottom: 16px;">Projekt-Status</div>
  <div style="display: flex; gap: 8px; margin-bottom: 16px;">
    <span style="background: #ff0000; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;">3 Kritisch</span>
    <span style="background: #ffaa00; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;">5 Warnung</span>
    <span style="background: #00cc00; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;">12 OK</span>
  </div>
  <div style="padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 8px; background: #ff0000; color: white;">⚠ Server-Latenz über 500ms seit 2h</div>
  <div style="padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 8px; background: #ffaa00; color: white;">⚡ API Rate Limit bei 80%</div>
  <div style="padding: 10px 14px; border-radius: 8px; font-size: 13px; background: #eeeeee; color: #666666;">ℹ Nächstes Deployment: Morgen 06:00</div>
</div>`}
        />
        <div className="space-y-3 mt-6">
          <h3 className="font-semibold text-(--text-primary)">Aufgabenstellung</h3>
          <ul className="list-disc list-inside space-y-2 text-(--text-secondary) text-sm">
            <li>Definiere CSS Custom Properties mit HSL-Werten für mindestens eine Farbfamilie (z.B. <code className="bg-(--bg-elevated) px-1 rounded text-[12px]">--blue-100</code> bis <code className="bg-(--bg-elevated) px-1 rounded text-[12px]">--blue-900</code>)</li>
            <li>Ersetze die festen HEX-Farbwerte durch deine Custom Properties</li>
            <li>Verwende verschiedene Abstufungen für Background, Border und Text der Alerts</li>
            <li>Gib den Grautönen einen leichten Farbstich (kühl oder warm — deine Wahl)</li>
            <li><strong>Bonus:</strong> Passe die Sättigung an — hellere und dunklere Töne etwas stärker sättigen</li>
          </ul>
        </div>
      </section>

      {/* Code Block */}
      <section className="max-w-2xl mx-auto px-4 pb-12 sm:px-6">
        <CodeBlock
          language="HTML + CSS — Aufgabe Modul 13"
          code={`<!-- Modul 13 — Praxisaufgabe: Farbsystem aufbauen -->
<!-- Ersetze die festen HEX-Farben durch ein HSL-basiertes System -->

<style>
  /* TODO: Definiere hier dein Farbsystem als CSS Custom Properties */
  /* Beispiel: */
  /* --red-50:  hsl(0, 86%, 97%);  */
  /* --red-200: hsl(0, 70%, 85%);  */
  /* --red-500: hsl(0, 72%, 51%);  */
  /* --red-800: hsl(0, 60%, 35%);  */

  .dashboard-card {
    background: #f8f8f8;    /* TODO: Grauton mit Farbstich */
    border-radius: 12px;
    padding: 20px;
    font-family: system-ui, sans-serif;
    max-width: 480px;
  }

  .card-title {
    font-size: 18px;
    font-weight: 700;
    color: #333333;      /* TODO: Grauton mit Farbstich */
    margin-bottom: 16px;
  }

  .status-badges {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }

  .badge-critical {
    background: #ff0000;   /* TODO: Verwende dein Farbsystem */
    color: white;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
  }

  .badge-warning {
    background: #ffaa00;   /* TODO: Verwende dein Farbsystem */
    color: white;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
  }

  .badge-ok {
    background: #00cc00;   /* TODO: Verwende dein Farbsystem */
    color: white;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
  }

  .alert {
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 13px;
    margin-bottom: 8px;
  }

  .alert-danger {
    background: #ff0000;   /* TODO: helle Abstufung */
    color: white;          /* TODO: dunkle Abstufung */
  }

  .alert-warning {
    background: #ffaa00;   /* TODO: helle Abstufung */
    color: white;          /* TODO: dunkle Abstufung */
  }

  .alert-info {
    background: #eeeeee;   /* TODO: helle Abstufung */
    color: #666666;        /* TODO: dunkle Abstufung */
  }
</style>

<div class="dashboard-card">
  <div class="card-title">Projekt-Status</div>

  <div class="status-badges">
    <span class="badge-critical">3 Kritisch</span>
    <span class="badge-warning">5 Warnung</span>
    <span class="badge-ok">12 OK</span>
  </div>

  <div class="alert alert-danger">
    ⚠ Server-Latenz über 500ms seit 2h
  </div>
  <div class="alert alert-warning">
    ⚡ API Rate Limit bei 80%
  </div>
  <div class="alert alert-info">
    ℹ Nächstes Deployment: Morgen 06:00
  </div>
</div>`}
        />
      </section>

      {/* Navigation */}
      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6">
        <ModuleNav prevModule={prevModule} nextModule={nextModule} />
      </div>
    </div>
  );
}
