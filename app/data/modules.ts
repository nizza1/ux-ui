export interface Module {
  id: string;
  number: string;
  slug: string;
  title: string;
  titleDe: string;
  description: string;
}

export const modules: Module[] = [
  {
    id: "00",
    number: "00",
    slug: "kickoff",
    title: "Kickoff",
    titleDe: "Kickoff",
    description: "Workshop introduction, goals, and what developers need to know about design",
  },
  {
    id: "01",
    number: "01",
    slug: "why-design",
    title: "Why Design Matters",
    titleDe: "Warum Design",
    description: "Understanding the importance of design for developers",
  },
  {
    id: "02",
    number: "02",
    slug: "visual-hierarchy",
    title: "Visual Hierarchy",
    titleDe: "Visuelle Hierarchie",
    description: "How to guide users through visual priority and structure",
  },
  {
    id: "03",
    number: "03",
    slug: "typography-selection",
    title: "Typography & Font Selection",
    titleDe: "Typografie Schriftauswahl",
    description: "Choosing the right typefaces for your interfaces",
  },
  {
    id: "04",
    number: "04",
    slug: "typography-systems",
    title: "Typography Systems",
    titleDe: "Typografie Systeme",
    description: "Building a consistent and scalable type scale",
  },
  {
    id: "05",
    number: "05",
    slug: "spacing-layout",
    title: "Spacing & Layout",
    titleDe: "Spacing Layout",
    description: "Spacing systems, grids, and layout principles",
  },
  {
    id: "06",
    number: "06",
    slug: "color-systems",
    title: "Color Systems",
    titleDe: "Farbe Systeme",
    description: "Understanding color theory and building color systems",
  },
  {
    id: "07",
    number: "07",
    slug: "color-contrast",
    title: "Color Contrast",
    titleDe: "Farbe Kontrast",
    description: "Accessibility and WCAG contrast requirements",
  },
  {
    id: "08",
    number: "08",
    slug: "color-hierarchy",
    title: "Color Hierarchy",
    titleDe: "Farbhierarchie",
    description: "Using color strategically to create visual hierarchy",
  },
  {
    id: "09",
    number: "09",
    slug: "shadows-elevation",
    title: "Shadows & Elevation",
    titleDe: "Schatten Tiefe Elevation",
    description: "Creating depth and elevation with shadows",
  },
  {
    id: "10",
    number: "10",
    slug: "ui-components",
    title: "UI Components",
    titleDe: "UI Komponenten",
    description: "Core UI component patterns and best practices",
  },
  {
    id: "11",
    number: "11",
    slug: "images-icons",
    title: "Images & Icons",
    titleDe: "Bilder Icons",
    description: "Working with images and icon systems effectively",
  },
  {
    id: "12",
    number: "12",
    slug: "responsive-design",
    title: "Responsive Design",
    titleDe: "Responsive Design",
    description: "Building interfaces that work on all screen sizes",
  },
  {
    id: "13",
    number: "13",
    slug: "design-tokens",
    title: "Design Systems & Tokens",
    titleDe: "Design Systems Tokens",
    description: "Design tokens, systems thinking, and scalable design",
  },
  {
    id: "14",
    number: "14",
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
