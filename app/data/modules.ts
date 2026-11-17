export type ModuleGroupId = "verstehen" | "gestalten" | "system" | "praxis";

export interface Module {
  id: string;
  number: string;
  slug: string;
  title: string;
  titleDe: string;
  description: string;
  group: ModuleGroupId;
}

export interface ModuleGroup {
  id: ModuleGroupId;
  /** Kurzer Abschnittstitel für Sidebar und Startseite */
  label: string;
  /** Ein Satz: Was dieser Teil des Workshops leistet */
  description: string;
}

/** Die vier Teile des Workshops — Reihenfolge = Lernpfad. */
export const moduleGroups: ModuleGroup[] = [
  {
    id: "verstehen",
    label: "Verstehen & Strukturieren",
    description: "Was gebaut werden soll, für wen — und wie es aufgebaut ist, bevor es gut aussieht.",
  },
  {
    id: "gestalten",
    label: "Visuelles Handwerk",
    description: "Hierarchie, Typografie, Farbe, Abstand und Tiefe als Regeln, die du in CSS direkt umsetzt.",
  },
  {
    id: "system",
    label: "System & KI",
    description: "Aus Einzelentscheidungen ein System machen — und es als Leitplanke für KI-Assistenten nutzen.",
  },
  {
    id: "praxis",
    label: "Praxis",
    description: "Alles zusammen an einem vollständigen Dashboard anwenden.",
  },
];

export const modules: Module[] = [
  // ── Teil 1: Verstehen & Strukturieren ───────────────────────────────────
  {
    id: "00",
    number: "00",
    slug: "ux-ui-basics",
    title: "UX & UI for Developers",
    titleDe: "UX & UI für Entwickler",
    description:
      "Was UX und UI unterscheidet, woran man Usability misst — und warum Urteilsvermögen wichtiger wird, wenn KI den Code schreibt",
    group: "verstehen",
  },
  {
    id: "01",
    number: "01",
    slug: "understanding-users",
    title: "Understanding Users",
    titleDe: "Nutzer verstehen",
    description:
      "Das Bedürfnis hinter dem Feature-Wunsch finden, mit wenig Aufwand prüfen und als User Story mit Akzeptanzkriterien festhalten",
    group: "verstehen",
  },
  {
    id: "02",
    number: "02",
    slug: "structure-flows",
    title: "Structure & Flows",
    titleDe: "Struktur & Flows",
    description:
      "Inhalte ordnen, Abläufe und Zustände planen und die Struktur als Grey-Box-Wireframe prüfen, bevor Farbe davon ablenkt",
    group: "verstehen",
  },
  // ── Teil 2: Visuelles Handwerk ──────────────────────────────────────────
  {
    id: "03",
    number: "03",
    slug: "gestalt-principles",
    title: "Gestalt Principles",
    titleDe: "Gestaltprinzipien in der Praxis",
    description:
      "Sechs psychologische Grundprinzipien gezielt einsetzen, um Interfaces intuitiver und verständlicher zu gestalten",
    group: "gestalten",
  },
  {
    id: "04",
    number: "04",
    slug: "visual-hierarchy",
    title: "Visual Hierarchy",
    titleDe: "Visuelle Hierarchie",
    description:
      "Rangfolge festlegen, mit Größe, Gewicht, Kontrast, Abstand und Position ausdrücken und mit dem Blinzel-Test prüfen",
    group: "gestalten",
  },
  {
    id: "05",
    number: "05",
    slug: "typography-selection",
    title: "Typography I: Font Selection",
    titleDe: "Typografie I: Schriftauswahl",
    description: "Die passende Schrift für ein Interface auswählen — Lesbarkeit, Charakter und Schriftpaare",
    group: "gestalten",
  },
  {
    id: "06",
    number: "06",
    slug: "typography-systems",
    title: "Typography II: Systems",
    titleDe: "Typografie II: Systeme",
    description: "Eine konsistente Type Scale aufbauen — Größen, Zeilenhöhe und Zeilenlänge als System",
    group: "gestalten",
  },
  {
    id: "07",
    number: "07",
    slug: "color-systems",
    title: "Color I: Color Systems",
    titleDe: "Farbe I: Farbsysteme aufbauen",
    description:
      "Warum fünf Farben nicht reichen — Farbfamilien mit Abstufungen aufbauen, HSL lesen und OKLCH verstehen",
    group: "gestalten",
  },
  {
    id: "08",
    number: "08",
    slug: "color-contrast",
    title: "Color II: Contrast & Accessibility",
    titleDe: "Farbe II: Kontrast, Accessibility & WCAG",
    description: "Contrast Ratios verstehen und Farben zugänglich einsetzen",
    group: "gestalten",
  },
  {
    id: "09",
    number: "09",
    slug: "color-hierarchy",
    title: "Color III: Hierarchy & Attention",
    titleDe: "Farbhierarchie & Aufmerksamkeitssteuerung",
    description: "Mit Farbe gezielt den Blick lenken — Primary, Secondary, Tertiary",
    group: "gestalten",
  },
  {
    id: "10",
    number: "10",
    slug: "spacing-layout",
    title: "Spacing & Layout",
    titleDe: "Spacing & Layout",
    description: "Abstände als System — Spacing-Skala, Gruppierung durch Nähe und Layout-Prinzipien",
    group: "gestalten",
  },
  {
    id: "11",
    number: "11",
    slug: "shadows-elevation",
    title: "Shadows & Elevation",
    titleDe: "Schatten, Tiefe & Elevation",
    description:
      "Schatten als Kommunikationswerkzeug — Elevation-Systeme, Zwei-Schatten-Technik und Depth ohne Schatten",
    group: "gestalten",
  },
  {
    id: "12",
    number: "12",
    slug: "images-icons",
    title: "Images & Icons",
    titleDe: "Bilder & Icons",
    description:
      "Icons und Bilder als Kommunikationswerkzeuge — Vektor vs. Raster, Stroke vs. Fill, Text-Overlays",
    group: "gestalten",
  },
  {
    id: "13",
    number: "13",
    slug: "responsive-design",
    title: "Responsive Design",
    titleDe: "Responsive Design",
    description:
      "Responsive Design als Denkweise — Mobile-First, Breakpoints, Fluid vs. Fixed Layouts, Content-Priorisierung",
    group: "gestalten",
  },
  // ── Teil 3: System & KI ─────────────────────────────────────────────────
  {
    id: "14",
    number: "14",
    slug: "design-tokens",
    title: "Design Systems & Tokens",
    titleDe: "Design Systems & Tokens",
    description:
      "Tokens als gemeinsame Sprache — Global, Alias und Component Tokens, Elevation als System und Theming mit Dark Mode",
    group: "system",
  },
  {
    id: "15",
    number: "15",
    slug: "ai-workflow",
    title: "Building UI with AI",
    titleDe: "UI mit KI bauen",
    description:
      "KI-Assistenten präzise briefen, generierte Oberflächen mit den Regeln aus dem Workshop prüfen und gezielt nachschärfen",
    group: "system",
  },
  // ── Praxis ──────────────────────────────────────────────────────────────
  {
    id: "PX",
    number: "PX",
    slug: "praxis-project",
    title: "Praxis Project: Dashboard",
    titleDe: "Praxis-Projekt: Dashboard",
    description:
      "Ein flaches Dashboard von Grund auf gestalten — eigenes Design-System bauen und per Inspector auf Elemente anwenden",
    group: "praxis",
  },
];

/**
 * Alte Adressen aus der Zeit vor der Neuordnung (17.11.2026).
 * Acht UX-Module wurden zu drei zusammengelegt — Lesezeichen sollen weiter funktionieren.
 */
export const legacySlugRedirects: Record<string, string> = {
  usability: "ux-ui-basics",
  "user-needs": "understanding-users",
  "research-methods": "understanding-users",
  personas: "understanding-users",
  "information-architecture": "structure-flows",
  "sketching-prototypes": "structure-flows",
  wireframing: "structure-flows",
};

export function getModuleBySlug(slug: string): Module | undefined {
  return modules.find((m) => m.slug === slug);
}

export function getModuleByNumber(number: string): Module | undefined {
  return modules.find((m) => m.number === number);
}

/** Vorheriges und nächstes Modul für die Fußnavigation. */
export function getModuleNeighbors(slug: string): { prevModule: Module | null; nextModule: Module | null } {
  const index = modules.findIndex((m) => m.slug === slug);
  return {
    prevModule: index > 0 ? modules[index - 1] : null,
    nextModule: index >= 0 && index < modules.length - 1 ? modules[index + 1] : null,
  };
}
