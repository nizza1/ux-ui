import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { modules } from "~/data/modules";
import { ModuleNav } from "~/routes/modules.$slug";
import { TheoryCard } from "~/components/ui/TheoryCard";
import { ConceptList, ConceptItem } from "~/components/ui/ConceptList";
import { RuleBox } from "~/components/ui/RuleBox";
import { ExerciseBlock } from "~/components/ui/ExerciseBlock";
import { LearningGoals } from "~/components/ui/LearningGoals";
import { ModuleMeta } from "~/components/ui/ModuleMeta";
import { ImagePlaceholder } from "~/components/ui/ImagePlaceholder";
import { LiveEditor } from "~/components/live-editor/LiveEditor";
import type { PropertyControl } from "~/components/live-editor/types";

export async function loader() {
  const slug = "sketching-prototypes";
  const currentIndex = modules.findIndex((m) => m.slug === slug);
  return {
    prevModule: currentIndex > 0 ? modules[currentIndex - 1] : null,
    nextModule: currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null,
  };
}

// ── Fidelity Comparison ───────────────────────────────────────────────────────
function FidelityComparison() {
  const levels = [
    {
      label: "Lo-Fi",
      color: "var(--text-ghost)",
      bg: "var(--bg-elevated)",
      border: "var(--bg-hover)",
      desc: "3 min · grobe Skizze",
      question: "Ist das die richtige Struktur?",
      content: (
        <div className="p-3 font-mono text-[11px] text-(--text-ghost) space-y-2">
          <div className="h-2 bg-(--text-ghost) opacity-30 rounded w-3/4" />
          <div className="h-1.5 bg-(--text-ghost) opacity-20 rounded w-1/2" />
          <div className="grid grid-cols-2 gap-1 mt-2">
            <div className="h-8 border border-(--text-ghost) border-opacity-20 rounded flex items-center justify-center text-[9px] opacity-40">IMG</div>
            <div className="h-8 border border-(--text-ghost) border-opacity-20 rounded flex items-center justify-center text-[9px] opacity-40">IMG</div>
          </div>
          <div className="h-1.5 bg-(--text-ghost) opacity-15 rounded w-full" />
          <div className="h-1.5 bg-(--text-ghost) opacity-15 rounded w-4/5" />
          <div className="h-5 bg-(--text-ghost) opacity-20 rounded mt-1" />
        </div>
      ),
    },
    {
      label: "Mid-Fi",
      color: "var(--accent)",
      bg: "var(--accent-dim)",
      border: "var(--accent-border)",
      desc: "30 min · klares Layout",
      question: "Funktioniert das Layout?",
      content: (
        <div className="p-3 space-y-2 font-sans text-[11px]">
          <div className="h-5 bg-(--bg-elevated) rounded w-3/4 flex items-center px-1.5">
            <div className="w-1 h-1 bg-(--text-ghost) rounded-full mr-1 opacity-50" />
            <div className="h-1.5 bg-(--text-ghost) opacity-30 rounded w-16" />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="h-10 bg-(--bg-elevated) rounded border border-(--bg-hover) flex items-center justify-center">
              <div className="w-4 h-4 bg-(--bg-hover) rounded opacity-50" />
            </div>
            <div className="h-10 bg-(--bg-elevated) rounded border border-(--bg-hover) flex items-center justify-center">
              <div className="w-4 h-4 bg-(--bg-hover) rounded opacity-50" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="h-1.5 bg-(--bg-elevated) rounded w-full" />
            <div className="h-1.5 bg-(--bg-elevated) rounded w-4/5" />
          </div>
          <div className="h-5 bg-(--bg-elevated) rounded border border-(--accent-border)" />
        </div>
      ),
    },
    {
      label: "Hi-Fi",
      color: "var(--success-color)",
      bg: "var(--success-bg)",
      border: "var(--success-border)",
      desc: "4 std · pixelgenau",
      question: "Fühlt sich das richtig an?",
      content: (
        <div className="p-3 space-y-2">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-3 h-3 rounded-full bg-(--accent) opacity-80" />
            <span className="font-bold text-[11px] text-(--text-primary)">Produktname</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="h-10 bg-(--bg-elevated) rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-(--accent-dim) to-(--bg-elevated)" />
              <div className="absolute bottom-1 left-1 right-1">
                <div className="h-1 bg-(--text-primary) opacity-60 rounded w-2/3" />
              </div>
            </div>
            <div className="h-10 bg-(--bg-elevated) rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-(--success-bg) to-(--bg-elevated)" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="h-1.5 bg-(--text-primary) opacity-50 rounded w-4/5" />
            <div className="h-1 bg-(--text-secondary) opacity-30 rounded w-3/5" />
          </div>
          <div className="h-5 bg-(--accent) rounded-md flex items-center justify-center">
            <div className="h-1 w-8 bg-white opacity-70 rounded" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 mb-6">
      <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-4">
        Vergleich: Lo-Fi / Mid-Fi / Hi-Fi
      </p>
      <div className="grid grid-cols-3 gap-3">
        {levels.map((level) => (
          <div
            key={level.label}
            className="rounded-xl overflow-hidden border"
            style={{ borderColor: level.border, background: level.bg }}
          >
            <div className="px-3 py-2 border-b" style={{ borderColor: level.border }}>
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: level.color }}>
                {level.label}
              </p>
              <p className="text-[11px] text-(--text-tertiary)">{level.desc}</p>
            </div>
            {level.content}
            <div className="px-3 pb-2.5">
              <p className="text-[11px] text-(--text-secondary) italic">{level.question}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Paper Prototype Simulator ─────────────────────────────────────────────────
type Screen = "menu" | "product" | "cart";

function PaperPrototypeSimulator() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [cart, setCart] = useState<{ name: string; size: string; price: string }[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>("M");

  const addToCart = (name: string) => {
    const prices: Record<string, string> = { S: "3,20", M: "3,90", L: "4,50" };
    setCart((prev) => [...prev, { name, size: selectedSize, price: prices[selectedSize] }]);
    setSelectedSize("M");
    setScreen("cart");
  };

  const screenLabels: Record<Screen, { title: string; hint: string }> = {
    menu: { title: "Speisekarte", hint: "Alle Produkte auf einen Blick" },
    product: { title: "Produkt", hint: "Details und Optionen wählen" },
    cart: { title: "Warenkorb", hint: "Bestellung prüfen" },
  };

  const menuItems = [
    { name: "Cappuccino", desc: "Espresso + Milchschaum", emoji: "☕" },
    { name: "Matcha Latte", desc: "Grüntee + Hafermilch", emoji: "🍵" },
    { name: "Croissant", desc: "Frisch gebacken, Butter", emoji: "🥐" },
  ];

  const screens: Record<Screen, React.ReactNode> = {
    menu: (
      <div className="p-4 space-y-3">
        <div className="border-b border-dashed border-(--text-ghost)/20 pb-2">
          <h3 className="font-bold text-[14px] text-(--text-primary)">Guten Morgen!</h3>
          <p className="text-[11px] text-(--text-tertiary)">Was darf es heute sein?</p>
        </div>
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setScreen("product")}
              className="w-full flex items-center gap-3 p-2.5 rounded-md border-2 border-dashed border-(--text-ghost)/20 text-left cursor-pointer hover:border-(--accent)/40 transition-colors group"
            >
              <span className="text-xl shrink-0">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <span className="text-[13px] font-semibold text-(--text-primary) group-hover:text-(--accent) transition-colors block">{item.name}</span>
                <span className="text-[11px] text-(--text-tertiary)">{item.desc}</span>
              </div>
              <span className="text-[12px] font-mono text-(--text-ghost) shrink-0">ab 3,20</span>
            </button>
          ))}
        </div>
        {cart.length > 0 && (
          <button
            onClick={() => setScreen("cart")}
            className="w-full py-2 border-2 border-(--accent) text-(--accent) text-[12px] font-bold rounded-md cursor-pointer hover:bg-(--accent) hover:text-white transition-colors"
          >
            Warenkorb ({cart.length})
          </button>
        )}
      </div>
    ),
    product: (
      <div className="p-4 space-y-3">
        <button onClick={() => setScreen("menu")} className="text-[12px] text-(--accent) font-semibold cursor-pointer hover:underline">
          ← Zurück
        </button>
        <div className="text-center border-b border-dashed border-(--text-ghost)/20 pb-3">
          <span className="text-3xl block mb-1">☕</span>
          <h3 className="font-bold text-[15px] text-(--text-primary)">Cappuccino</h3>
          <p className="text-[11px] text-(--text-tertiary)">Doppelter Espresso + cremiger Milchschaum</p>
        </div>
        {/* Size picker */}
        <div>
          <p className="text-[11px] font-semibold text-(--text-tertiary) mb-1.5 uppercase tracking-wide">Grösse wählen</p>
          <div className="flex gap-2">
            {(["S", "M", "L"] as const).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`flex-1 py-2 text-center rounded-md border-2 cursor-pointer transition-all ${
                  selectedSize === size
                    ? "border-(--accent) bg-(--accent)/10 text-(--accent) font-bold"
                    : "border-dashed border-(--text-ghost)/20 text-(--text-secondary) hover:border-(--accent)/30"
                }`}
              >
                <span className="text-[13px] block">{size}</span>
                <span className="text-[10px] text-(--text-ghost)">
                  {size === "S" ? "3,20" : size === "M" ? "3,90" : "4,50"} €
                </span>
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => addToCart("Cappuccino")}
          className="w-full py-2.5 border-2 border-(--accent) bg-(--accent) text-white text-[13px] font-bold rounded-md cursor-pointer hover:opacity-90 transition-opacity"
        >
          In den Warenkorb
        </button>
      </div>
    ),
    cart: (
      <div className="p-4 space-y-3">
        <button onClick={() => setScreen("menu")} className="text-[12px] text-(--accent) font-semibold cursor-pointer hover:underline">
          ← Weiter bestellen
        </button>
        <h3 className="font-bold text-[14px] text-(--text-primary) border-b border-dashed border-(--text-ghost)/20 pb-2">
          Deine Bestellung
        </h3>
        {cart.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-[13px] text-(--text-ghost)">Noch nichts im Warenkorb.</p>
            <button
              onClick={() => setScreen("menu")}
              className="mt-2 text-[12px] text-(--accent) font-semibold cursor-pointer hover:underline"
            >
              Zur Speisekarte
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {cart.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-md border-2 border-dashed border-(--text-ghost)/20">
                  <div>
                    <span className="text-[13px] font-semibold text-(--text-primary) block">{item.name}</span>
                    <span className="text-[11px] text-(--text-tertiary)">Grösse {item.size}</span>
                  </div>
                  <span className="text-[13px] font-mono font-semibold text-(--text-primary)">{item.price} €</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-dashed border-(--text-ghost)/20">
              <span className="text-[13px] font-semibold text-(--text-primary)">Gesamt</span>
              <span className="text-[14px] font-mono font-bold text-(--accent)">
                {cart.reduce((sum, item) => sum + parseFloat(item.price.replace(",", ".")), 0).toFixed(2).replace(".", ",")} €
              </span>
            </div>
            <button
              onClick={() => { setCart([]); setScreen("menu"); }}
              className="w-full py-2.5 border-2 border-(--accent) bg-(--accent) text-white text-[13px] font-bold rounded-md cursor-pointer hover:opacity-90 transition-opacity"
            >
              Bestellen
            </button>
          </>
        )}
      </div>
    ),
  };

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 mb-6">
      <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-1">
        Interaktive Demo
      </p>
      <p className="text-[13px] text-(--text-secondary) mb-1">
        So funktioniert ein klickbarer Paper-Prototyp: Einzelne Bildschirme werden
        durch Aktionen (Klick, Tippen) miteinander verbunden — ganz ohne echten Code.
      </p>
      <p className="text-[13px] text-(--text-tertiary) mb-4">
        Klicke dich durch diese Café-Bestell-App und beobachte, wie drei einfache Screens
        bereits ein testbares Erlebnis erzeugen:
      </p>

      {/* Screen tabs */}
      <div className="flex gap-2 mb-4">
        {(["menu", "product", "cart"] as Screen[]).map((s) => (
          <button
            key={s}
            onClick={() => setScreen(s)}
            className={`px-3 py-1.5 text-[12px] font-semibold rounded-md border-2 cursor-pointer transition-all ${screen === s
                ? "bg-(--accent) border-(--accent) text-white shadow-sm"
                : "bg-transparent border-(--text-ghost)/20 text-(--text-secondary) hover:border-(--accent)/40 hover:text-(--accent)"
              }`}
          >
            {screenLabels[s].title}
            {s === "cart" && cart.length > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-white/20">
                {cart.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Phone frame */}
      <div className="max-w-85">
        <div className="bg-(--bg-primary) rounded-2xl border-2 border-(--bg-elevated) overflow-hidden shadow-sm">
          {/* Status bar */}
          <div className="flex items-center justify-between px-4 py-1.5 border-b border-(--bg-elevated)">
            <span className="text-[10px] font-mono text-(--text-ghost)">9:41</span>
            <div className="w-16 h-1 rounded-full bg-(--bg-elevated)" />
            <div className="flex gap-1">
              <div className="w-3 h-2 rounded-sm bg-(--text-ghost)/30" />
              <div className="w-3 h-2 rounded-sm bg-(--text-ghost)/30" />
            </div>
          </div>
          {/* Screen content */}
          <div className="min-h-70">
            {screens[screen]}
          </div>
        </div>
        {/* Screen label below phone */}
        <p className="text-[11px] text-(--text-ghost) text-center mt-2 font-mono">
          Screen: {screenLabels[screen].title} — {screenLabels[screen].hint}
        </p>
      </div>

      {/* Flow diagram */}
      <div className="mt-4 pt-4 border-t border-dashed border-(--text-ghost)/15">
        <p className="text-[11px] font-semibold text-(--text-tertiary) mb-2 uppercase tracking-wide">Navigationsfluss</p>
        <div className="flex items-center gap-2 text-[11px] font-mono text-(--text-ghost) flex-wrap">
          <span className={`px-2 py-0.5 rounded border ${screen === "menu" ? "border-(--accent) text-(--accent) font-bold" : "border-(--text-ghost)/20"}`}>Speisekarte</span>
          <span>→ Produkt wählen →</span>
          <span className={`px-2 py-0.5 rounded border ${screen === "product" ? "border-(--accent) text-(--accent) font-bold" : "border-(--text-ghost)/20"}`}>Produkt</span>
          <span>→ Hinzufügen →</span>
          <span className={`px-2 py-0.5 rounded border ${screen === "cart" ? "border-(--accent) text-(--accent) font-bold" : "border-(--text-ghost)/20"}`}>Warenkorb</span>
        </div>
      </div>
    </div>
  );
}

// ── Sketch exploration visual ─────────────────────────────────────────────────
function SketchExploration() {
  const layouts = [
    {
      name: "Liste",
      desc: "Klare Struktur, wenig Kontext",
      content: (
        <div className="space-y-1.5">
          {["Benachrichtigung 1", "Benachrichtigung 2", "Benachrichtigung 3"].map((item) => (
            <div key={item} className="flex items-center gap-2 p-1.5 rounded bg-(--bg-elevated)">
              <div className="w-2 h-2 rounded-full bg-(--accent) opacity-60 shrink-0" />
              <div className="h-1.5 bg-(--text-ghost) opacity-30 rounded flex-1" />
            </div>
          ))}
        </div>
      ),
    },
    {
      name: "Karten-Grid",
      desc: "Mehr Kontext, weniger Items",
      content: (
        <div className="grid grid-cols-2 gap-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-(--bg-elevated) rounded p-2 space-y-1">
              <div className="h-1.5 bg-(--text-ghost) opacity-30 rounded w-3/4" />
              <div className="h-1 bg-(--text-ghost) opacity-20 rounded w-1/2" />
            </div>
          ))}
        </div>
      ),
    },
    {
      name: "Zeitstrahl",
      desc: "Zeitlicher Kontext sichtbar",
      content: (
        <div className="space-y-2 relative">
          <div className="absolute left-1.5 top-2 bottom-0 w-px bg-(--bg-elevated)" />
          {["Heute", "Gestern", "Vorgestern"].map((label) => (
            <div key={label} className="flex gap-3 items-start">
              <div className="w-3.5 h-3.5 rounded-full bg-(--accent) opacity-50 shrink-0 mt-0.5 relative z-10" />
              <div className="flex-1">
                <div className="text-[10px] text-(--text-ghost) mb-0.5">{label}</div>
                <div className="h-1.5 bg-(--bg-elevated) rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl p-5 mb-6">
      <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-1">
        3 Skizzen-Ideen für denselben Inhalt
      </p>
      <p className="text-[12px] text-(--text-tertiary) mb-4">
        Benachrichtigungs-Posteingang — drei verschiedene Layouts erkundet:
      </p>
      <div className="grid grid-cols-3 gap-3">
        {layouts.map((l) => (
          <div key={l.name} className="bg-(--bg-elevated) rounded-xl p-3">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-(--accent) mb-0.5">
              {l.name}
            </p>
            <p className="text-[11px] text-(--text-tertiary) mb-3">{l.desc}</p>
            {l.content}
          </div>
        ))}
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
<title>Lo-Fi Prototype</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: system-ui, sans-serif;
    background: #f5f7fa;
    padding: 24px;
    min-height: 100vh;
  }
  /* TODO: Mache die App-Shell erkennbar: Header, Nav, Content */
  .app-header {
    background: white;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .app-title { font-size: 16px; font-weight: 700; color: #111; }
  /* TODO: Gib dem Screen-Label eine klare Positionierung */
  .screen-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #aaa;
    margin-bottom: 12px;
  }
  .screen {
    background: white;
    border-radius: 10px;
    padding: 20px;
    max-width: 380px;
  }
  .task-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    margin-bottom: 8px;
    cursor: pointer;
  }
  .task-checkbox {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 2px solid #ddd;
    flex-shrink: 0;
  }
  .task-text { font-size: 13px; color: #333; }
  /* TODO: Mache den Add-Button als primäre Aktion erkennbar */
  .add-btn {
    width: 100%;
    padding: 10px;
    background: #eee;
    color: #888;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 4px;
  }
  /* BONUS: Füge einen Fortschrittsindikator hinzu (z.B. "2 von 5 erledigt") */
</style>
</head>
<body>
  <div class="app-header">
    <span class="app-title">Aufgaben</span>
    <span style="font-size:13px;color:#aaa;">Heute</span>
  </div>
  <div class="screen-label">Bildschirm 1 von 3: Aufgabenliste</div>
  <div class="screen">
    <div class="task-item">
      <div class="task-checkbox" style="background:#0ea5a0;border-color:#0ea5a0;"></div>
      <span class="task-text">Design Review vorbereiten</span>
    </div>
    <div class="task-item">
      <div class="task-checkbox"></div>
      <span class="task-text">Wireframe fertigstellen</span>
    </div>
    <div class="task-item">
      <div class="task-checkbox"></div>
      <span class="task-text">Nutzertest planen</span>
    </div>
    <button class="add-btn">+ Neue Aufgabe hinzufügen</button>
  </div>
</body>
</html>`;

const EXERCISE_CONTROLS: PropertyControl[] = [
  {
    id: "add-btn-bg",
    property: "backgroundColor",
    label: "Add-Button Farbe",
    type: "color",
    target: ".add-btn",
    group: "colors",
    defaultValue: "#eeeeee",
  },
  {
    id: "add-btn-color",
    property: "color",
    label: "Add-Button Text",
    type: "color",
    target: ".add-btn",
    group: "colors",
    defaultValue: "#888888",
  },
  {
    id: "add-btn-padding",
    property: "paddingTop",
    label: "Add-Button Padding",
    type: "slider",
    target: ".add-btn",
    group: "spacing",
    defaultValue: 10,
    min: 8,
    max: 20,
    step: 2,
    unit: "px",
  },
  {
    id: "header-shadow",
    property: "boxShadow",
    label: "Header Schatten",
    type: "select",
    target: ".app-header",
    group: "shadows",
    defaultValue: "none",
    options: [
      { label: "Kein", value: "none" },
      { label: "Subtil", value: "0 1px 4px rgba(0,0,0,0.06)" },
      { label: "Mittel", value: "0 2px 10px rgba(0,0,0,0.1)" },
    ],
  },
  {
    id: "screen-label-color",
    property: "color",
    label: "Screen-Label Farbe",
    type: "color",
    target: ".screen-label",
    group: "colors",
    defaultValue: "#aaaaaa",
  },
  {
    id: "task-hover-bg",
    property: "backgroundColor",
    label: "Task-Item Hintergrund",
    type: "color",
    target: ".task-item",
    group: "colors",
    defaultValue: "#ffffff",
  },
  {
    id: "task-radius",
    property: "borderRadius",
    label: "Task-Item Rundung",
    type: "slider",
    target: ".task-item",
    group: "borders",
    defaultValue: 8,
    min: 0,
    max: 16,
    step: 2,
    unit: "px",
  },
  {
    id: "screen-padding",
    property: "padding",
    label: "Screen-Padding",
    type: "slider",
    target: ".screen",
    group: "spacing",
    defaultValue: 20,
    min: 12,
    max: 32,
    step: 4,
    unit: "px",
  },
  {
    id: "screen-shadow",
    property: "boxShadow",
    label: "Screen-Schatten",
    type: "select",
    target: ".screen",
    group: "shadows",
    defaultValue: "none",
    options: [
      { label: "Kein", value: "none" },
      { label: "Subtil", value: "0 2px 12px rgba(0,0,0,0.06)" },
      { label: "Mittel", value: "0 4px 20px rgba(0,0,0,0.1)" },
    ],
  },
];

export default function SketchingPrototypesModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      <div className="max-w-[1000px] mx-auto w-full px-8 py-12 flex-1">

        {/* ── Title ── */}
        <div className="inline-flex items-center gap-2 bg-(--accent-dim) border border-(--accent-border) rounded-full py-1 px-3.5 font-mono text-[11px] font-semibold text-(--accent) tracking-[1.5px] uppercase mb-6 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-(--accent) before:shadow-[0_0_6px_var(--accent)] before:shrink-0">
          Modul 06
        </div>
        <h1 className="text-[clamp(28px,4vw,36px)] font-extrabold leading-[1.15] tracking-[-0.5px] text-(--text-primary) mb-2 mt-0">
          Erste Ideenskizzen & Interaktive Prototypen
        </h1>
        <p className="text-[15px] font-medium leading-normal text-(--text-secondary) mb-8 mt-0 max-w-130">
          Den Wert frühen Skizzierens verstehen, den Unterschied zwischen Lo-Fi-,
          Mid-Fi- und Hi-Fi-Prototypen kennen und einen einfachen interaktiven
          Prototyp erleben.
        </p>

        <ModuleMeta duration="45 Minuten" practiceTime="~20 Min." />

        <LearningGoals
          goals={[
            "Erklären, warum frühes Skizzieren effizienter ist als direkt Code zu schreiben",
            "Die drei Fidelitätsstufen (Lo-Fi, Mid-Fi, Hi-Fi) und ihren Zweck kennen",
            "Verstehen, welche Fragen jede Fidelitätsstufe beantworten kann",
            "Einen einfachen klickbaren Prototyp selbst erkunden",
          ]}
        />

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── Why Sketch ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Warum überhaupt?
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Skizzieren bevor man baut
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Entwickler neigen dazu, direkt zum Code zu springen, weil Code sich
          produktiv anfühlt. Aber Code ist eine der{" "}
          <strong>teuersten Möglichkeiten</strong>, eine Idee zu erkunden.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Skizze auf Papier", time: "3 Minuten", cost: "1×", color: "var(--success-color)", bg: "var(--success-bg)", border: "var(--success-border)" },
            { label: "Digitaler Wireframe", time: "30 Minuten", cost: "10×", color: "var(--warning-color)", bg: "var(--warning-bg)", border: "var(--warning-border)" },
            { label: "Code-Prototyp", time: "Stunden", cost: "100×", color: "var(--bad-color)", bg: "var(--bad-bg)", border: "var(--bad-border)" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl p-3.5 text-center" style={{ background: item.bg, border: `1px solid ${item.border}` }}>
              <p className="font-mono text-[20px] font-black mb-1" style={{ color: item.color }}>{item.cost}</p>
              <p className="text-[13px] font-semibold text-(--text-primary) mb-0.5">{item.label}</p>
              <p className="text-[12px] text-(--text-tertiary)">{item.time}</p>
            </div>
          ))}
        </div>

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-6">
          Das Ziel des frühen Skizzierens ist nicht, schöne Arbeit zu
          produzieren. Es geht darum,{" "}
          <strong>Ideen schnell zu externalisieren, damit du sie beurteilen
            und verwerfen kannst</strong>. Wenn eine Idee nur in deinem Kopf
          existiert, neigst du dazu, sie zu verteidigen. Wenn sie auf Papier
          ist, kannst du sie kritisch betrachten.
        </p>

        {/* 3 Sketches exploration */}
        <SketchExploration />

        {/* ── Fidelity Levels ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Theorie
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Prototyp-Fidelitätsstufen
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Fidelität beschreibt, wie eng ein Prototyp dem fertigen Produkt
          ähnelt. Jede Stufe dient einem anderen Zweck:
        </p>

        <TheoryCard label="Drei Stufen">
          <ConceptList>
            <ConceptItem title="Lo-Fi — Struktur testen">
              Grobe Skizzen oder einfache digitale Wireframes ohne Styling.
              Schnell zu erstellen, schnell zu verwerfen. Die Frage:{" "}
              <em>„Ist das die richtige Struktur?"</em>
            </ConceptItem>
            <ConceptItem title="Mid-Fi — Layout validieren">
              Detailliertere Wireframes mit realen Beschriftungen und
              Proportionen, aber ohne Markenfarben. Ideal für Stakeholder-Reviews.
              Die Frage: <em>„Funktioniert das Layout?"</em>
            </ConceptItem>
            <ConceptItem title="Hi-Fi — Ästhetik und Interaktion testen">
              Dem fertigen Produkt sehr ähnlich – mit echten Schriften, Farben
              und Interaktionen. Die Frage:{" "}
              <em>„Fühlt sich das richtig an?"</em>
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <FidelityComparison />

        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-6">
          Ein häufiger Fehler ist der zu frühe Sprung zum Hi-Fi. Nutzer und
          Stakeholder neigen dazu, Feedback zur Ästhetik zu geben (
          <em>„Ich mag dieses Blau nicht"</em>), statt zur Struktur – wenn der
          Prototyp fertig aussieht.
        </p>

        {/* ── Interactive Prototypes ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Interaktiv
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Klickbarer Prototyp — Selbst ausprobieren
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Ein Paper-Prototyp besteht aus einfachen Bildschirmen, die durch
          Nutzeraktionen (Klick, Tippen) verbunden werden. So lässt sich ein
          Ablauf testen, bevor eine einzige Zeile Code geschrieben wird.
        </p>

        <PaperPrototypeSimulator />

        <ImagePlaceholder
          aspectRatio="16/7"
          label="Lo-Fi Skizzen: 3 Ansätze für denselben Bildschirm"
          caption="Frühes Skizzieren erlaubt es, viele Ideen schnell zu erkunden und zu verwerfen"
        />

        <RuleBox title="Kernregel">
          Fang mit der grobsten möglichen Darstellung an. Verfeinere nur,
          wenn die Struktur validiert ist. Code ist der teuerste Weg, eine
          Idee zu testen – und Papier ist der günstigste.
        </RuleBox>


      </div>

      <ModuleNav prevModule={prevModule} nextModule={nextModule} />
    </div>
  );
}
