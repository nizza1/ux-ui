import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { modules } from "~/data/modules";
import { ModuleNav } from "~/routes/modules.$slug";
import { TheoryCard } from "~/components/ui/TheoryCard";
import { ConceptList, ConceptItem } from "~/components/ui/ConceptList";
import { ComparisonPanel } from "~/components/ui/ComparisonPanel";
import { RuleBox } from "~/components/ui/RuleBox";
import { ExerciseBlock } from "~/components/ui/ExerciseBlock";
import { LearningGoals } from "~/components/ui/LearningGoals";
import { ModuleMeta } from "~/components/ui/ModuleMeta";
import { LiveEditor } from "~/components/live-editor/LiveEditor";
import type { PropertyControl } from "~/components/live-editor/types";

export async function loader() {
  const slug = "information-architecture";
  const currentIndex = modules.findIndex((m) => m.slug === slug);
  return {
    prevModule: currentIndex > 0 ? modules[currentIndex - 1] : null,
    nextModule: currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null,
  };
}

// ── Interactive Sitemap ───────────────────────────────────────────────────────
type SitemapNode = {
  id: string;
  label: string;
  preview: string;
  children?: SitemapNode[];
};

const SITEMAP: SitemapNode[] = [
  {
    id: "dashboard",
    label: "Home Dashboard",
    preview: "Aktivitäts-Feed, Schnellzugriff auf letzte Projekte, Team-Status",
    children: [
      {
        id: "projects",
        label: "Projekte",
        preview: "Liste aller Projekte mit Status, Fälligkeit und Verantwortlichem",
        children: [
          {
            id: "project-detail",
            label: "Projektdetail",
            preview: "Beschreibung, Aufgabenliste, Zeitplan, Dokumente",
            children: [
              { id: "tasks", label: "Aufgaben", preview: "Alle Aufgaben des Projekts, filterbar nach Status und Verantwortlichem" },
              { id: "task-detail", label: "Aufgabendetail", preview: "Beschreibung, Kommentare, Anhänge, Zeitprotokoll" },
            ],
          },
        ],
      },
      { id: "team", label: "Teammitglieder", preview: "Profile, Rollen, Auslastung, Kontaktdaten" },
      {
        id: "settings",
        label: "Einstellungen",
        preview: "Kontoeinstellungen, Benachrichtigungen, Abrechnung",
        children: [
          { id: "profile", label: "Profil", preview: "Name, Avatar, E-Mail, Passwort" },
          { id: "notifications", label: "Benachrichtigungen", preview: "E-Mail-Benachrichtigungen, In-App-Alerts" },
          { id: "billing", label: "Abrechnung", preview: "Abo-Plan, Rechnungsverlauf, Zahlungsmethoden" },
        ],
      },
    ],
  },
];

function SitemapNodeComp({
  node,
  depth = 0,
  onSelect,
  selected,
}: {
  node: SitemapNode;
  depth?: number;
  onSelect: (node: SitemapNode) => void;
  selected: string | null;
}) {
  return (
    <div className={`flex flex-col items-center ${depth > 0 ? "mt-3" : ""}`}>
      <button
        onClick={() => onSelect(node)}
        className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border-2 transition-all cursor-pointer whitespace-nowrap ${
          selected === node.id
            ? "bg-(--accent) border-(--accent) text-white"
            : "bg-(--bg-surface) border-(--bg-elevated) text-(--text-primary) hover:border-(--accent-border)"
        }`}
      >
        {node.label}
      </button>
      {node.children && node.children.length > 0 && (
        <div className="flex items-start gap-6 mt-0 relative">
          <div className="absolute top-0 left-0 right-0 h-3 flex items-center">
            <div className="w-full h-px bg-(--bg-elevated)" />
          </div>
          {node.children.map((child) => (
            <div key={child.id} className="flex flex-col items-center relative pt-3">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-3 bg-(--bg-elevated)" />
              <SitemapNodeComp
                node={child}
                depth={depth + 1}
                onSelect={onSelect}
                selected={selected}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InteractiveSitemap() {
  const [selected, setSelected] = useState<SitemapNode | null>(null);

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 mb-6">
      <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-1">
        Interaktive Sitemap — Team-Produktivitäts-App
      </p>
      <p className="text-[12px] text-(--text-tertiary) mb-4">
        Klicke auf einen Knoten, um die Inhalte dieses Bildschirms zu sehen:
      </p>
      <div className="overflow-x-auto pb-2">
        <div className="min-w-max">
          {SITEMAP.map((node) => (
            <SitemapNodeComp
              key={node.id}
              node={node}
              onSelect={setSelected}
              selected={selected?.id ?? null}
            />
          ))}
        </div>
      </div>
      {selected && (
        <div className="mt-4 bg-(--accent-dim) border border-(--accent-border) rounded-lg px-4 py-3">
          <p className="font-mono text-[10px] font-semibold text-(--accent) mb-1 uppercase tracking-wider">
            {selected.label}
          </p>
          <p className="text-[13px] text-(--text-secondary)">{selected.preview}</p>
        </div>
      )}
    </div>
  );
}

// ── Practice HTML ─────────────────────────────────────────────────────────────
const EXERCISE_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Navigation</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, sans-serif; background: #f5f7fa; min-height: 100vh; }
  /* TODO: Mache die Navigation klar erkennbar und vom Inhalt getrennt */
  nav {
    background: white;
    padding: 12px 24px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .nav-logo {
    font-size: 15px;
    font-weight: 800;
    color: #0ea5a0;
    margin-right: 16px;
  }
  /* TODO: Mache die Nav-Links klar unterscheidbar: aktiv vs. inaktiv */
  .nav-link {
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 14px;
    color: #666;
    text-decoration: none;
    cursor: pointer;
    background: transparent;
    border: none;
    font-family: inherit;
  }
  .nav-link:hover { background: #f5f5f5; }
  .nav-link.active {
    /* TODO: Hebe den aktiven Link deutlich hervor */
    color: #666;
    background: transparent;
  }
  .content {
    max-width: 720px;
    margin: 40px auto;
    padding: 0 24px;
  }
  /* TODO: Füge eine Breadcrumb hinzu, damit Nutzer wissen, wo sie sind */
  .breadcrumb {
    font-size: 13px;
    color: #aaa;
    margin-bottom: 16px;
    display: none; /* TODO: Einblenden */
  }
  h1 { font-size: 24px; font-weight: 700; color: #111; margin-bottom: 8px; }
  p { font-size: 14px; color: #555; line-height: 1.6; }
</style>
</head>
<body>
  <nav>
    <span class="nav-logo">AppName</span>
    <button class="nav-link active">Dashboard</button>
    <button class="nav-link">Projekte</button>
    <button class="nav-link">Team</button>
    <button class="nav-link">Einstellungen</button>
  </nav>
  <div class="content">
    <div class="breadcrumb">Dashboard → Projekte → Projektdetail</div>
    <h1>Willkommen zurück, Markus</h1>
    <p>Hier ist dein Aktivitäts-Feed. Du hast 3 offene Aufgaben und 1 überfällige Aufgabe.</p>
  </div>
</body>
</html>`;

const EXERCISE_CONTROLS: PropertyControl[] = [
  {
    id: "nav-bg",
    property: "backgroundColor",
    label: "Nav Hintergrundfarbe",
    type: "color",
    target: "nav",
    group: "colors",
    defaultValue: "#ffffff",
  },
  {
    id: "nav-shadow",
    property: "boxShadow",
    label: "Nav Schatten",
    type: "select",
    target: "nav",
    group: "shadows",
    defaultValue: "none",
    options: [
      { label: "Kein", value: "none" },
      { label: "Subtil", value: "0 1px 4px rgba(0,0,0,0.08)" },
      { label: "Mittel", value: "0 2px 12px rgba(0,0,0,0.1)" },
    ],
  },
  {
    id: "nav-border",
    property: "borderBottom",
    label: "Nav Unterlinie",
    type: "select",
    target: "nav",
    group: "borders",
    defaultValue: "none",
    options: [
      { label: "Kein", value: "none" },
      { label: "Subtil", value: "1px solid #e5e7eb" },
      { label: "Akzent", value: "2px solid #0ea5a0" },
    ],
  },
  {
    id: "active-bg",
    property: "backgroundColor",
    label: "Aktiver Link Hintergrund",
    type: "color",
    target: ".nav-link.active",
    group: "colors",
    defaultValue: "transparent",
  },
  {
    id: "active-color",
    property: "color",
    label: "Aktiver Link Textfarbe",
    type: "color",
    target: ".nav-link.active",
    group: "colors",
    defaultValue: "#666666",
  },
  {
    id: "active-font-weight",
    property: "fontWeight",
    label: "Aktiver Link Gewicht",
    type: "select",
    target: ".nav-link.active",
    group: "typography",
    defaultValue: "400",
    options: [
      { label: "Normal (400)", value: "400" },
      { label: "Semibold (600)", value: "600" },
      { label: "Bold (700)", value: "700" },
    ],
  },
  {
    id: "breadcrumb-display",
    property: "display",
    label: "Breadcrumb anzeigen",
    type: "toggle",
    target: ".breadcrumb",
    group: "layout",
    defaultValue: "none",
    options: [{ label: "An", value: "block" }],
  },
  {
    id: "breadcrumb-color",
    property: "color",
    label: "Breadcrumb Farbe",
    type: "color",
    target: ".breadcrumb",
    group: "colors",
    defaultValue: "#aaaaaa",
  },
  {
    id: "nav-padding",
    property: "padding",
    label: "Nav Padding",
    type: "slider",
    target: "nav",
    group: "spacing",
    defaultValue: 12,
    min: 8,
    max: 20,
    step: 2,
    unit: "px",
  },
];

export default function InformationArchitectureModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      <div className="max-w-[1000px] mx-auto w-full px-8 py-12 flex-1">

        {/* ── Title ── */}
        <div className="inline-flex items-center gap-2 bg-(--accent-dim) border border-(--accent-border) rounded-full py-1 px-3.5 font-mono text-[11px] font-semibold text-(--accent) tracking-[1.5px] uppercase mb-6 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-(--accent) before:shadow-[0_0_6px_var(--accent)] before:shrink-0">
          Modul 05
        </div>
        <h1 className="text-[clamp(28px,4vw,36px)] font-extrabold leading-[1.15] tracking-[-0.5px] text-(--text-primary) mb-2 mt-0">
          Informationsarchitektur
        </h1>
        <p className="text-[15px] font-medium leading-normal text-(--text-secondary) mb-8 mt-0 max-w-130">
          Inhalte strukturieren, Sitemaps erstellen und Navigationsstrukturen
          auf Klarheit und Usability bewerten.
        </p>

        <ModuleMeta duration="45 Minuten" practiceTime="~20 Min." />

        <LearningGoals
          goals={[
            "Informationsarchitektur (IA) definieren und ihre Bedeutung erklären",
            "Hierarchie, sequenzielle Abläufe und Inhaltsbeschriftung als IA-Konzepte verstehen",
            "Eine einfache Sitemap erstellen und lesen können",
            "Die vier Navigationsprinzipien auf eigene Projekte anwenden",
          ]}
        />

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── What is IA ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Definition
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Was ist Informationsarchitektur?
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Informationsarchitektur (IA) ist die Praxis, Inhalte und Funktionen
          so zu <strong>organisieren, strukturieren und beschriften</strong>, dass
          Nutzer finden, was sie brauchen, und verstehen, wo sie sich befinden.
        </p>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-6">
          IA ist einer der wenigen Bereiche, bei denen frühe Fehler{" "}
          <strong>eskalierend schwierige Probleme</strong> erzeugen. Visuelle
          Details neu zu gestalten ist relativ günstig. Die Navigationsstruktur
          einer 200-seitigen Website neu zu gestalten ist extrem schmerzhaft.
        </p>

        {/* ── IA Concepts ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Kernkonzepte
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Drei Strukturprinzipien
        </h2>

        <TheoryCard label="IA-Konzepte">
          <ConceptList>
            <ConceptItem title="Hierarchie">
              Inhalte in Kategorien und Unterkategorien organisieren. Die
              Herausforderung: Kategorien wählen, die den{" "}
              <strong>mentalen Modellen der Nutzer</strong> entsprechen – nicht
              der internen Organisationsstruktur.
            </ConceptItem>
            <ConceptItem title="Sequenzielle Abläufe">
              Inhalte als Schritte, die der Reihe nach abgeschlossen werden
              müssen – für Checkouts, Onboarding, mehrstufige Formulare. IA
              entscheidet: wie viele Schritte, welche Infos wo, wo zurückgehen.
            </ConceptItem>
            <ConceptItem title="Inhaltsbeschriftung">
              Dinge so benennen, dass Nutzer sie verstehen. Interner Fachjargon,
              unklare Abkürzungen und technische Terminologie gehören zu den{" "}
              <strong>häufigsten IA-Problemen</strong>.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        {/* IA Failure example */}
        <ComparisonPanel
          bad={{
            label: "Interne Struktur (IA-Fehler)",
            children: (
              <div className="space-y-1 p-1">
                <p className="text-[12px] text-(--text-tertiary) mb-2">E-Commerce Top-Level-Navigation:</p>
                {["Privatkundenprodukte", "Unternehmensprodukte", "Partnerschaften", "Investor Relations"].map((item) => (
                  <div key={item} className="px-2 py-1 bg-(--bg-elevated) rounded text-[13px] text-(--text-secondary)">
                    {item}
                  </div>
                ))}
                <p className="text-[11px] text-(--text-ghost) mt-2">
                  ↳ Spiegelt Abteilungen wider, nicht Nutzeraufgaben
                </p>
              </div>
            ),
          }}
          good={{
            label: "Nutzerorientierte Struktur",
            children: (
              <div className="space-y-1 p-1">
                <p className="text-[12px] text-(--text-tertiary) mb-2">Gleiche Website, nutzerorientiert:</p>
                {["Einkaufen", "Meine Bestellungen", "Rückgabe & Umtausch", "Hilfe & Support"].map((item) => (
                  <div key={item} className="px-2 py-1 bg-(--bg-elevated) rounded text-[13px] text-(--text-secondary)">
                    {item}
                  </div>
                ))}
                <p className="text-[11px] text-(--text-ghost) mt-2">
                  ↳ Beschreibt Aufgaben, die Nutzer erledigen wollen
                </p>
              </div>
            ),
          }}
        />

        {/* ── Sitemap ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Werkzeug
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Sitemaps
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Eine Sitemap ist ein visuelles Diagramm der Struktur einer Website
          oder App – jede Seite, jeder Bildschirm und die Navigationsverbindungen
          zwischen ihnen. Klicke auf einen Knoten, um zu sehen, was auf diesem
          Bildschirm ist:
        </p>

        <InteractiveSitemap />

        {/* ── Navigation Principles ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Prinzipien
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Die 4 Navigationsprinzipien
        </h2>

        <TheoryCard label="Best Practices">
          <ConceptList>
            <ConceptItem title="Flach und begrenzt">
              Nutzer haben Schwierigkeiten, mehr als 3–4 Ebenen tief zu
              navigieren. Begrenze die Hauptnavigation auf maximal{" "}
              <strong>5–7 Elemente</strong>.
            </ConceptItem>
            <ConceptItem title="Nutzersprache statt Fachjargon">
              Teste Navigationsbeschriftungen mit echten Nutzern. Wenn sie
              nicht vorhersagen können, was sich hinter einem Label verbirgt,
              ist das <strong>Label falsch</strong> – nicht der Nutzer.
            </ConceptItem>
            <ConceptItem title="Aktiver Zustand sichtbar">
              Aktive Zustände, Breadcrumbs und Seitentitel helfen Nutzern,
              ihren Standort zu behalten. Besonders wichtig in komplexen
              Strukturen: Nutzer müssen immer wissen, wo sie sind.
            </ConceptItem>
            <ConceptItem title="Nichts Wichtiges verstecken">
              Die Versuchung, die Navigation „sauber" zu halten, indem
              Elemente in verschachtelte Menüs wandern, bedeutet meist: Nutzer
              <strong> finden sie nie</strong>.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <RuleBox title="Kernregel">
          Gute IA ist für Nutzer unsichtbar – sie wissen einfach immer, wo sie
          sind und wohin sie gehen müssen. Wenn Nutzer suchen, raten oder zurückgehen
          müssen, ist das kein Nutzer-Problem. Es ist ein IA-Problem.
        </RuleBox>

        {/* ── Practice ── */}
        <hr className="border-0 border-t border-(--bg-elevated) my-8" />
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Praxisaufgabe
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Navigation: Aktiven Zustand und Orientierung kommunizieren
        </h2>

        <ExerciseBlock
          title="Navigation verbessern: Nutzer wissen lassen, wo sie sind"
          tasks={[
            "Füge der Navigation einen subtilen Schatten oder eine Unterlinie hinzu, damit sie sich vom Content abhebt",
            "Gib dem aktiven Nav-Link eine klare Hintergrundfarbe und Textfarbe – er muss sofort erkennbar sein",
            "Erhöhe das Schriftgewicht des aktiven Links auf Bold (700)",
            "Blende die Breadcrumb ein und gib ihr eine lesbare Farbe",
            "BONUS: Erhöhe das Navigation-Padding auf 16px für mehr Luft",
          ]}
        >
          Die Navigation unten hat vier Links – aber es ist kaum erkennbar,
          welcher aktiv ist. Nutzer wissen nicht, wo sie sich befinden.
          Außerdem gibt es eine versteckte Breadcrumb, die eingeblendet werden
          sollte. Wende die vier Navigationsprinzipien an.
        </ExerciseBlock>

        <LiveEditor
          html={EXERCISE_HTML}
          controls={EXERCISE_CONTROLS}
          defaultMode="controller"
        />
      </div>

      <ModuleNav prevModule={prevModule} nextModule={nextModule} />
    </div>
  );
}
