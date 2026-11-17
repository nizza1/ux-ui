import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

type Screen = "menu" | "product" | "cart" | "done";
type Size = "S" | "M" | "L";

interface Item {
  name: string;
  description: string;
  prices: Record<Size, number>;
}

const MENU: Item[] = [
  { name: "Cappuccino", description: "Espresso mit Milchschaum", prices: { S: 3.2, M: 3.9, L: 4.5 } },
  { name: "Matcha Latte", description: "Grüntee mit Hafermilch", prices: { S: 3.8, M: 4.4, L: 5.0 } },
  { name: "Flat White", description: "Doppelter Espresso, wenig Milch", prices: { S: 3.4, M: 4.0, L: 4.6 } },
];

const FLOW: { id: Screen; label: string }[] = [
  { id: "menu", label: "Karte" },
  { id: "product", label: "Produkt" },
  { id: "cart", label: "Warenkorb" },
  { id: "done", label: "Bestätigung" },
];

const euro = (value: number) => `${value.toFixed(2).replace(".", ",")} €`;

/* Grey-Box-Stil: gestrichelte Rahmen, keine Farbe — es soll nach Entwurf aussehen */
const BOX = "border-2 border-dashed border-(--text-ghost) rounded-lg";
const PRIMARY =
  "w-full py-2.5 rounded-lg bg-(--text-primary) text-(--bg-surface) text-[14px] font-semibold cursor-pointer hover:opacity-90 transition-opacity duration-150";
const BACK =
  "inline-flex items-center gap-1.5 text-[13px] font-semibold text-(--text-secondary) cursor-pointer hover:text-(--text-primary) self-start";

/**
 * Klickbarer Grey-Box-Prototyp: vier Screens einer Café-Bestellung, verbunden durch Aktionen.
 * Zeigt, dass ein Ablauf testbar ist, lange bevor er gestaltet ist — und protokolliert den Weg,
 * den man tatsächlich gegangen ist.
 */
export function ClickPrototype() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [item, setItem] = useState<Item>(MENU[0]);
  const [size, setSize] = useState<Size>("M");
  const [cart, setCart] = useState<{ name: string; size: Size; price: number }[]>([]);
  const [steps, setSteps] = useState(0);

  const go = (next: Screen) => {
    setScreen(next);
    setSteps((value) => value + 1);
  };
  const reset = () => {
    setScreen("menu");
    setCart([]);
    setSize("M");
    setSteps(0);
  };
  const total = cart.reduce((sum, entry) => sum + entry.price, 0);

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl shadow-(--shadow-sm) mb-6 overflow-hidden">
      {/* Ablauf */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-2 px-5 sm:px-6 py-4 border-b border-(--bg-elevated)">
        {FLOW.map((entry, index) => (
          <span key={entry.id} className="inline-flex items-center gap-2">
            {index > 0 && <ArrowRight size={13} className="text-(--text-ghost)" />}
            <span
              className={`text-[13px] font-semibold px-2.5 py-1 rounded-md border ${
                screen === entry.id
                  ? "bg-(--text-primary) border-(--text-primary) text-(--bg-surface)"
                  : "border-(--bg-hover) text-(--text-tertiary)"
              }`}
            >
              {entry.label}
            </span>
          </span>
        ))}
      </div>

      <div className="grid md:grid-cols-[minmax(0,10fr)_minmax(0,11fr)]">
        {/* Gerät */}
        <div className="p-5 sm:p-8 bg-(--bg-base) flex justify-center">
          <div className="w-full max-w-75 bg-(--bg-surface) border-2 border-(--text-ghost) rounded-2xl overflow-hidden">
            <div className="h-6 border-b border-(--bg-elevated) flex items-center justify-center">
              <span className="w-14 h-1 rounded-full bg-(--bg-elevated)" />
            </div>
            <div className="min-h-80 p-4 flex flex-col gap-3" aria-live="polite">
              {screen === "menu" && (
                <>
                  <div className="text-[16px] font-bold text-(--text-primary)">Was darf es sein?</div>
                  {MENU.map((entry) => (
                    <button
                      key={entry.name}
                      type="button"
                      onClick={() => {
                        setItem(entry);
                        go("product");
                      }}
                      className={`${BOX} w-full flex items-center justify-between gap-3 p-3 text-left cursor-pointer hover:border-(--text-primary) transition-colors duration-150`}
                    >
                      <span>
                        <span className="block text-[14px] font-semibold text-(--text-primary)">{entry.name}</span>
                        <span className="block text-[13px] text-(--text-tertiary)">{entry.description}</span>
                      </span>
                      <span className="font-mono text-[13px] text-(--text-secondary) shrink-0">ab {euro(entry.prices.S)}</span>
                    </button>
                  ))}
                  {cart.length > 0 && (
                    <button type="button" onClick={() => go("cart")} className={`${PRIMARY} mt-auto`}>
                      Warenkorb ansehen ({cart.length})
                    </button>
                  )}
                </>
              )}

              {screen === "product" && (
                <>
                  <button type="button" onClick={() => go("menu")} className={BACK}>
                    <ArrowLeft size={14} /> Zur Karte
                  </button>
                  <div className={`${BOX} h-20 flex items-center justify-center font-mono text-[13px] text-(--text-ghost)`}>Bild</div>
                  <div>
                    <div className="text-[16px] font-bold text-(--text-primary)">{item.name}</div>
                    <div className="text-[13px] text-(--text-tertiary)">{item.description}</div>
                  </div>
                  <div role="group" aria-label="Größe" className="grid grid-cols-3 gap-2">
                    {(["S", "M", "L"] as Size[]).map((option) => (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={size === option}
                        onClick={() => setSize(option)}
                        className={`py-2 rounded-lg text-center cursor-pointer transition-colors duration-150 ${
                          size === option
                            ? "border-2 border-(--text-primary) bg-(--bg-elevated)"
                            : "border-2 border-dashed border-(--text-ghost) hover:border-(--text-primary)"
                        }`}
                      >
                        <span className="block text-[14px] font-bold text-(--text-primary)">{option}</span>
                        <span className="block font-mono text-[13px] text-(--text-tertiary)">{euro(item.prices[option])}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCart((prev) => [...prev, { name: item.name, size, price: item.prices[size] }]);
                      setSize("M");
                      go("cart");
                    }}
                    className={`${PRIMARY} mt-auto`}
                  >
                    In den Warenkorb
                  </button>
                </>
              )}

              {screen === "cart" && (
                <>
                  <button type="button" onClick={() => go("menu")} className={BACK}>
                    <ArrowLeft size={14} /> Weiter bestellen
                  </button>
                  <div className="text-[16px] font-bold text-(--text-primary)">Deine Bestellung</div>
                  {cart.length === 0 ? (
                    <div className={`${BOX} p-4 text-center`}>
                      <div className="text-[14px] font-semibold text-(--text-primary)">Noch nichts im Warenkorb</div>
                      <div className="text-[13px] text-(--text-tertiary)">Wähl etwas von der Karte aus.</div>
                    </div>
                  ) : (
                    <>
                      {cart.map((entry, index) => (
                        <div key={index} className={`${BOX} flex items-center justify-between gap-3 p-3`}>
                          <span>
                            <span className="block text-[14px] font-semibold text-(--text-primary)">{entry.name}</span>
                            <span className="block text-[13px] text-(--text-tertiary)">Größe {entry.size}</span>
                          </span>
                          <span className="font-mono text-[13px] text-(--text-secondary)">{euro(entry.price)}</span>
                        </div>
                      ))}
                      <div className="flex items-baseline justify-between text-[14px] font-bold text-(--text-primary)">
                        <span>Gesamt</span>
                        <span className="font-mono">{euro(total)}</span>
                      </div>
                      <button type="button" onClick={() => go("done")} className={`${PRIMARY} mt-auto`}>
                        Jetzt bestellen
                      </button>
                    </>
                  )}
                </>
              )}

              {screen === "done" && (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
                  <span className="size-10 rounded-full border-2 border-(--text-primary) flex items-center justify-center text-(--text-primary)">
                    <Check size={20} />
                  </span>
                  <div className="text-[16px] font-bold text-(--text-primary)">Bestellung ist da</div>
                  <div className="text-[13px] leading-[1.5] text-(--text-secondary)">
                    Abholbereit in etwa 5 Minuten.
                    <br />
                    Nummer 47 · {euro(total)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Auswertung */}
        <div className="p-5 sm:p-6 border-t md:border-t-0 md:border-l border-(--bg-elevated) flex flex-col gap-4" aria-live="polite">
          <div>
            <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-1">
              Deine Aufgabe
            </div>
            <p className="text-[14px] font-semibold leading-[1.5] text-(--text-primary) m-0">
              Bestell einen großen Cappuccino und einen Matcha Latte.
            </p>
          </div>
          <div>
            <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-1">
              Dein Weg
            </div>
            <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">
              <strong className="font-semibold text-(--text-primary)">
                {steps} {steps === 1 ? "Schritt" : "Schritte"}
              </strong>{" "}
              bisher.{" "}
              {screen === "done"
                ? steps <= 6
                  ? "Das ist der direkte Weg: zwei Produkte in sechs Schritten."
                  : "Der direkte Weg hat sechs Schritte. Wo bist du abgebogen — und lag es an dir oder am Ablauf?"
                : "Der kürzeste Weg zur Bestätigung hat sechs."}
            </p>
          </div>
          <div className="pt-4 border-t border-(--bg-elevated)">
            <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-1">
              Was ein Test hier zeigen würde
            </div>
            <p className="text-[13px] leading-[1.6] text-(--text-secondary) m-0">
              Nach „In den Warenkorb“ landest du im Warenkorb — für das zweite Produkt musst du zurück zur Karte. Wer
              meist mehrere Dinge bestellt, empfindet das als Umweg. Das fällt an vier grauen Screens auf, nicht erst
              nach zwei Wochen Entwicklung.
            </p>
          </div>
          {steps > 0 && (
            <button
              type="button"
              onClick={reset}
              className="self-start text-[13px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer bg-transparent border border-(--bg-hover) text-(--text-tertiary) hover:text-(--text-primary) transition-colors duration-150"
            >
              Von vorn
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
