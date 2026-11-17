import { useState } from "react";
import { Search, Star } from "lucide-react";
import { SegmentedControl } from "~/components/ui/SegmentedControl";

type Fidelity = "lo" | "mid" | "hi";

const OPTIONS: { value: Fidelity; label: string }[] = [
  { value: "lo", label: "Lo-Fi" },
  { value: "mid", label: "Mid-Fi" },
  { value: "hi", label: "Hi-Fi" },
];

const INFO: Record<Fidelity, { title: string; question: string; feedback: string[]; note: string }> = {
  lo: {
    title: "Kästen und Linien",
    question: "Ist das die richtige Struktur?",
    feedback: ["„Warum steht der Filter links und nicht oben?“", "„Was passiert, wenn es keine Treffer gibt?“"],
    note: "Sieht unfertig aus — und genau deshalb traut sich jeder, die Grundidee infrage zu stellen.",
  },
  mid: {
    title: "Echte Texte, echte Proportionen, nur Grau",
    question: "Funktioniert das Layout mit echtem Inhalt?",
    feedback: ["„‚Neu eingetroffen‘ ist keine Kategorie, das ist eine Sortierung.“", "„Der Preis geht neben dem Titel unter.“"],
    note: "Sobald echte Wörter dastehen, fallen Benennung und Platzbedarf auf. Farbe würde davon nur ablenken.",
  },
  hi: {
    title: "Schrift, Farbe, Bilder — wie das fertige Produkt",
    question: "Stimmt der Gesamteindruck?",
    feedback: ["„Das Türkis gefällt mir nicht.“", "„Können die Bilder größer sein?“"],
    note: "Jetzt geht es um Geschmack und Feinschliff. Über die Struktur redet niemand mehr — sie wirkt entschieden.",
  },
};

const PRODUCTS = [
  { name: "Wanderrucksack 28 l", price: "89,00 €", rating: "4,8" },
  { name: "Trinkflasche 0,75 l", price: "24,90 €", rating: "4,6" },
  { name: "Stirnlampe LED", price: "39,00 €", rating: "4,7" },
  { name: "Regenjacke leicht", price: "129,00 €", rating: "4,5" },
  { name: "Wandersocken 2er", price: "18,00 €", rating: "4,9" },
  { name: "Sitzkissen faltbar", price: "12,50 €", rating: "4,4" },
];

const CATEGORIES = ["Rucksäcke", "Bekleidung", "Ausrüstung", "Angebote"];

/* Sechs Farbflächen als Platzhalter für Produktfotos — nur in der Hi-Fi-Stufe */
const TINTS = [
  "hsl(178 45% 82%)",
  "hsl(32 70% 84%)",
  "hsl(221 60% 86%)",
  "hsl(150 40% 82%)",
  "hsl(0 55% 88%)",
  "hsl(262 45% 87%)",
];

const LINE = "h-2 rounded bg-(--bg-elevated)";
const WIRE = "border-[1.5px] border-(--text-ghost) rounded";

function LoFi() {
  return (
    <div className="flex flex-col gap-3">
      <div className={`${WIRE} h-9 flex items-center px-3 gap-2`}>
        <span className={`${LINE} w-28`} />
        <span className={`${WIRE} ml-auto h-5 w-12`} />
      </div>
      <div className="flex gap-3">
        <div className={`${WIRE} hidden sm:flex w-28 shrink-0 p-2.5 flex-col gap-2.5`}>
          {[70, 55, 80, 60].map((width) => (
            <div key={width} className="flex items-center gap-2">
              <span className="size-3 border-[1.5px] border-(--text-ghost) rounded-sm shrink-0" />
              <span className={LINE} style={{ width: `${width}%` }} />
            </div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {PRODUCTS.map((product) => (
            <div key={product.name} className={`${WIRE} p-2 flex flex-col gap-2`}>
              <div className="h-14 rounded bg-(--bg-elevated) relative overflow-hidden">
                <span className="absolute inset-0 bg-[linear-gradient(to_top_right,transparent_49.5%,var(--text-ghost)_49.5%,var(--text-ghost)_50.5%,transparent_50.5%)] opacity-50" />
              </div>
              <span className={`${LINE} w-4/5`} />
              <span className={`${LINE} w-2/5`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MidFi() {
  return (
    <div className="flex flex-col gap-3">
      <div className="h-9 flex items-center gap-2 px-3 rounded-lg border border-(--text-ghost) bg-(--bg-surface)">
        <Search size={14} className="text-(--text-tertiary)" />
        <span className="text-[13px] text-(--text-tertiary)">Produkte suchen</span>
      </div>
      <div className="flex gap-3">
        <div className="hidden sm:flex w-28 shrink-0 flex-col gap-2">
          <div className="text-[13px] font-bold text-(--text-primary)">Kategorie</div>
          {CATEGORIES.map((category) => (
            <div key={category} className="flex items-center gap-2 text-[13px] text-(--text-secondary)">
              <span className="size-3 border-[1.5px] border-(--text-ghost) rounded-sm shrink-0" />
              {category}
            </div>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] text-(--text-tertiary) mb-2">24 Ergebnisse</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {PRODUCTS.map((product) => (
              <div key={product.name} className="rounded-lg border border-(--bg-elevated) bg-(--bg-surface) overflow-hidden">
                <div className="h-14 bg-(--bg-elevated)" />
                <div className="p-2">
                  <div className="text-[13px] font-semibold leading-[1.3] text-(--text-primary) truncate">{product.name}</div>
                  <div className="text-[13px] text-(--text-secondary)">{product.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HiFi() {
  return (
    <div className="flex flex-col gap-3">
      <div className="h-9 flex items-center gap-2 px-3 rounded-full border border-(--bg-hover) bg-(--bg-surface) shadow-(--shadow-sm)">
        <Search size={14} className="text-(--accent)" />
        <span className="text-[13px] text-(--text-tertiary)">Produkte suchen</span>
      </div>
      <div className="flex gap-3">
        <div className="hidden sm:flex w-28 shrink-0 flex-col gap-2">
          <div className="text-[13px] font-bold text-(--text-primary)">Kategorie</div>
          {CATEGORIES.map((category, index) => (
            <div key={category} className="flex items-center gap-2 text-[13px] text-(--text-secondary)">
              <span
                className={`size-3 rounded-sm shrink-0 border-[1.5px] ${
                  index === 0 ? "bg-(--accent) border-(--accent)" : "border-(--text-ghost)"
                }`}
              />
              {category}
            </div>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] text-(--text-tertiary) mb-2">24 Ergebnisse</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {PRODUCTS.map((product, index) => (
              <div key={product.name} className="rounded-xl bg-(--bg-surface) shadow-(--shadow-md) overflow-hidden">
                <div className="h-14" style={{ background: TINTS[index] }} />
                <div className="p-2">
                  <div className="text-[13px] font-semibold leading-[1.3] text-(--text-primary) truncate">{product.name}</div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[13px] font-bold text-(--text-primary)">{product.price}</span>
                    <span className="inline-flex items-center gap-0.5 text-[13px] text-(--text-tertiary)">
                      <Star size={11} className="text-(--warning-color) fill-(--warning-color)" />
                      {product.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Dieselbe Suchergebnis-Seite in drei Fidelity-Stufen.
 * Die Struktur ist in allen drei identisch — was sich ändert, ist die Frage,
 * die der Entwurf beantwortet, und die Art von Rückmeldung, die er auslöst.
 */
export function FidelitySwitcher() {
  const [fidelity, setFidelity] = useState<Fidelity>("lo");
  const info = INFO[fidelity];

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl shadow-(--shadow-sm) mb-6 overflow-hidden">
      <div className="px-5 sm:px-6 py-4 border-b border-(--bg-elevated)">
        <SegmentedControl label="Detailgrad" options={OPTIONS} value={fidelity} onChange={setFidelity} />
      </div>

      <div className="grid lg:grid-cols-[minmax(0,13fr)_minmax(0,9fr)]">
        <div className="p-4 sm:p-6 bg-(--bg-base)">
          {fidelity === "lo" && <LoFi />}
          {fidelity === "mid" && <MidFi />}
          {fidelity === "hi" && <HiFi />}
        </div>

        <div className="p-5 sm:p-6 border-t lg:border-t-0 lg:border-l border-(--bg-elevated) flex flex-col gap-4" aria-live="polite">
          <div>
            <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-1">
              {info.title}
            </div>
            <div className="text-[15px] font-bold leading-[1.4] text-(--text-primary)">{info.question}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-1.5">
              Rückmeldung, die du bekommst
            </div>
            <ul className="list-none m-0 p-0 flex flex-col gap-1.5">
              {info.feedback.map((line) => (
                <li key={line} className="text-[13px] leading-[1.55] font-medium text-(--text-primary)">
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0 pt-4 border-t border-(--bg-elevated)">{info.note}</p>
        </div>
      </div>
    </div>
  );
}
