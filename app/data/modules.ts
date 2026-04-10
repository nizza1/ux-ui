export interface Module {
  id: string;
  number: string;
  slug: string;
  title: string;
  titleDe: string;
  description: string;
}

export const modules: Module[] = [
  // ── UX/UI Foundations (new curriculum) ──────────────────────────────────
  {
    id: "00",
    number: "00",
    slug: "ux-ui-basics",
    title: "What is UX? What is UI?",
    titleDe: "Was ist UX? Was ist UI?",
    description: "Die Grundlagen: UX und UI definieren, unterscheiden und verstehen, warum beides zählt",
  },
  {
    id: "01",
    number: "01",
    slug: "usability",
    title: "Usability & User-Centered Design",
    titleDe: "Usability & Nutzerzentriertes Design",
    description: "Was Usability bedeutet, wie der UCD-Prozess funktioniert und warum Kontext entscheidend ist",
  },
  {
    id: "02",
    number: "02",
    slug: "user-needs",
    title: "User Needs, Requirements & User Stories",
    titleDe: "Nutzererfordernisse & User Stories",
    description: "Nutzerbedürfnisse identifizieren, in Anforderungen übersetzen und als User Stories formulieren",
  },
  {
    id: "03",
    number: "03",
    slug: "research-methods",
    title: "User Research Methods",
    titleDe: "Methoden der Nutzerforschung",
    description: "Die wichtigsten Forschungsmethoden kennen und die richtige Methode für die richtige Frage wählen",
  },
  {
    id: "04",
    number: "04",
    slug: "personas",
    title: "Creating User Personas",
    titleDe: "User Personas erstellen",
    description: "Evidenzbasierte Personas erstellen, die Teams helfen, nutzerfokussierte Entscheidungen zu treffen",
  },
  {
    id: "05",
    number: "05",
    slug: "information-architecture",
    title: "Information Architecture",
    titleDe: "Informationsarchitektur",
    description: "Inhalte strukturieren, Sitemaps erstellen und Navigationsstrukturen bewerten",
  },
  {
    id: "06",
    number: "06",
    slug: "sketching-prototypes",
    title: "Sketching & Interactive Prototypes",
    titleDe: "Erste Ideenskizzen & Prototypen",
    description: "Früh skizzieren, Lo-Fi bis Hi-Fi verstehen und interaktive Prototypen erstellen",
  },
  {
    id: "07",
    number: "07",
    slug: "wireframing",
    title: "Wireframing: Lo-Fi to Mockup",
    titleDe: "Wireframing: Lo-Fi bis Hi-Fi",
    description: "Effektive Wireframes erstellen und wissen, wann der Übergang zum Hi-Fi-Mockup sinnvoll ist",
  },
  // ── Visual/Technical Design (original curriculum, shifted to 08–22) ─────
  {
    id: "08",
    number: "08",
    slug: "why-design",
    title: "Why UI Design Matters for Developers",
    titleDe: "Warum UI-Design für Entwickler wichtig ist",
    description: "UX/UI-Theorie mit der täglichen Arbeit als Entwickler verbinden — geschäftlich und menschlich",
  },
  {
    id: "09",
    number: "09",
    slug: "visual-hierarchy",
    title: "Visual Hierarchy",
    titleDe: "Visuelle Hierarchie",
    description: "How to guide users through visual priority and structure",
  },
  {
    id: "10",
    number: "10",
    slug: "typography-selection",
    title: "Typography & Font Selection",
    titleDe: "Typografie Schriftauswahl",
    description: "Choosing the right typefaces for your interfaces",
  },
  {
    id: "11",
    number: "11",
    slug: "typography-systems",
    title: "Typography Systems",
    titleDe: "Typografie Systeme",
    description: "Building a consistent and scalable type scale",
  },
  {
    id: "12",
    number: "12",
    slug: "spacing-layout",
    title: "Spacing & Layout",
    titleDe: "Spacing Layout",
    description: "Spacing systems, grids, and layout principles",
  },
  {
    id: "13",
    number: "13",
    slug: "color-systems",
    title: "Color Systems",
    titleDe: "Farbe Systeme",
    description: "Understanding color theory and building color systems",
  },
  {
    id: "14",
    number: "14",
    slug: "color-contrast",
    title: "Color Contrast",
    titleDe: "Farbe Kontrast",
    description: "Accessibility and WCAG contrast requirements",
  },
  {
    id: "15",
    number: "15",
    slug: "color-hierarchy",
    title: "Color Hierarchy",
    titleDe: "Farbhierarchie",
    description: "Using color strategically to create visual hierarchy",
  },
  {
    id: "16",
    number: "16",
    slug: "shadows-elevation",
    title: "Shadows & Elevation",
    titleDe: "Schatten Tiefe Elevation",
    description: "Creating depth and elevation with shadows",
  },
  {
    id: "17",
    number: "17",
    slug: "ui-components",
    title: "UI Components",
    titleDe: "UI Komponenten",
    description: "Core UI component patterns and best practices",
  },
  {
    id: "18",
    number: "18",
    slug: "images-icons",
    title: "Images & Icons",
    titleDe: "Bilder Icons",
    description: "Working with images and icon systems effectively",
  },
  {
    id: "19",
    number: "19",
    slug: "responsive-design",
    title: "Responsive Design",
    titleDe: "Responsive Design",
    description: "Building interfaces that work on all screen sizes",
  },
  {
    id: "20",
    number: "20",
    slug: "design-tokens",
    title: "Design Systems & Tokens",
    titleDe: "Design Systems Tokens",
    description: "Design tokens, systems thinking, and scalable design",
  },
  {
    id: "21",
    number: "21",
    slug: "gestalt-principles",
    title: "Gestalt Principles",
    titleDe: "Gestaltprinzipien",
    description: "Psychological principles of visual perception",
  },
];

export function getModuleBySlug(slug: string): Module | undefined {
  return modules.find((m) => m.slug === slug);
}

export function getModuleByNumber(number: string): Module | undefined {
  return modules.find((m) => m.number === number);
}
