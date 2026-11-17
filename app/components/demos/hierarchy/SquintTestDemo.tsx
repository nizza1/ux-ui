import { useState } from "react";
import { RangeField } from "~/components/ui/RangeField";

const STATS = [
  { label: "Offen", value: "6" },
  { label: "In Arbeit", value: "4" },
  { label: "Erledigt", value: "12" },
];

const TASKS = [
  { name: "Startseite: Hero-Bereich umsetzen", meta: "Mo · Anna" },
  { name: "Kontaktformular validieren", meta: "Di · Jonas" },
  { name: "Bilder komprimieren", meta: "Mi · Mira" },
];

type Variant = "flat" | "clear";

/* Flach: jede Zeile bekommt exakt dieselbe Behandlung */
const FLAT_TEXT = "text-[13px] font-normal leading-[1.5] text-(--text-primary)";
const FLAT_BTN =
  "text-[13px] font-normal px-3 py-1.5 rounded-md bg-(--bg-elevated) text-(--text-primary) border border-(--bg-hover)";

const STYLES: Record<Variant, Record<string, string>> = {
  flat: {
    root: "flex flex-col gap-1.5",
    project: FLAT_TEXT,
    title: FLAT_TEXT,
    status: FLAT_TEXT,
    stats: "flex flex-col gap-1.5",
    stat: "flex gap-1.5",
    statLabel: FLAT_TEXT,
    statValue: FLAT_TEXT,
    actions: "flex flex-wrap gap-2",
    primary: FLAT_BTN,
    secondary: FLAT_BTN,
    tertiary: FLAT_BTN,
    listTitle: FLAT_TEXT,
    list: "flex flex-col gap-1.5",
    row: "flex justify-between gap-3",
    taskName: FLAT_TEXT,
    taskMeta: `${FLAT_TEXT} whitespace-nowrap`,
  },
  clear: {
    root: "flex flex-col",
    project: "font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost)",
    title: "text-[24px] font-extrabold leading-[1.2] tracking-[-0.3px] text-(--text-primary) mt-1",
    status: "text-[13px] leading-[1.5] text-(--text-tertiary) mt-1",
    stats: "grid grid-cols-3 gap-2 mt-5",
    stat: "flex flex-col rounded-lg bg-(--bg-surface) border border-(--bg-elevated) px-3 py-2 min-w-0",
    statLabel: "text-[13px] leading-[1.4] text-(--text-ghost) truncate",
    statValue: "text-[20px] font-bold leading-[1.25] text-(--text-primary) tabular-nums",
    actions: "flex flex-wrap items-center gap-2 mt-5",
    primary:
      "text-[13px] font-semibold px-3.5 py-1.5 rounded-md bg-(--text-primary) text-(--bg-surface) border border-(--text-primary)",
    secondary:
      "text-[13px] font-medium px-3.5 py-1.5 rounded-md bg-transparent text-(--text-primary) border border-(--text-ghost)",
    tertiary: "text-[13px] font-medium px-1.5 py-1.5 text-(--text-tertiary) underline underline-offset-2",
    listTitle: "text-[13px] font-bold text-(--text-primary) mt-6 mb-1",
    list: "flex flex-col divide-y divide-(--bg-elevated)",
    row: "flex justify-between items-baseline gap-3 py-2",
    taskName: "text-[13px] font-medium text-(--text-primary)",
    taskMeta: "text-[13px] text-(--text-ghost) whitespace-nowrap",
  },
};

function Screen({ variant }: { variant: Variant }) {
  const s = STYLES[variant];
  return (
    <div className={s.root}>
      <div className={s.project}>Website-Relaunch</div>
      <div className={s.title}>Sprint 14</div>
      <div className={s.status}>Endet in 3 Tagen · 12 von 18 Aufgaben erledigt</div>
      <div className={s.stats}>
        {STATS.map((stat) => (
          <div key={stat.label} className={s.stat}>
            <span className={s.statLabel}>{stat.label}</span>
            <span className={s.statValue}>{stat.value}</span>
          </div>
        ))}
      </div>
      <div className={s.actions}>
        <span className={s.primary}>Aufgabe anlegen</span>
        <span className={s.secondary}>Board öffnen</span>
        <span className={s.tertiary}>Exportieren</span>
      </div>
      <div className={s.listTitle}>Als Nächstes fällig</div>
      <div className={s.list}>
        {TASKS.map((task) => (
          <div key={task.name} className={s.row}>
            <span className={s.taskName}>{task.name}</span>
            <span className={s.taskMeta}>{task.meta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function caption(blur: number) {
  if (blur === 0) {
    return "Beide Flächen zeigen exakt denselben Inhalt. Zieh den Regler nach rechts und beobachte, was übrig bleibt, wenn niemand mehr lesen kann.";
  }
  if (blur < 5) {
    return "Links verschwimmt alles zu gleich schweren Zeilen. Rechts bleiben Titel, Kennzahlen und der Haupt-Button als Formen erkennbar.";
  }
  return "Kein Wort ist mehr lesbar — und trotzdem zeigt die rechte Seite, wo es losgeht und welche Aktion die wichtigste ist. Links gibt es keinen Einstiegspunkt.";
}

/**
 * Blinzel-Test (Squint Test): derselbe Inhalt, einmal flach, einmal mit Rangfolge.
 * Der Regler legt Unschärfe über beide — was dann noch erkennbar ist, ist die Hierarchie.
 */
export function SquintTestDemo() {
  const [blur, setBlur] = useState(0);

  const panels: { variant: Variant; label: string }[] = [
    { variant: "flat", label: "Alles gleich behandelt" },
    { variant: "clear", label: "Mit Rangfolge" },
  ];

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl shadow-(--shadow-sm) mb-6 overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-(--bg-elevated)">
        <RangeField
          label="Unschärfe — so sieht dein Interface beim Blinzeln aus"
          value={blur}
          min={0}
          max={10}
          display={blur === 0 ? "scharf" : `${blur} px`}
          onChange={setBlur}
          className="max-w-130"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-px bg-(--bg-elevated)">
        {panels.map((panel) => (
          <div key={panel.variant} className="bg-(--bg-surface) p-5 sm:p-6 min-w-0">
            <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-3">
              {panel.label}
            </div>
            <div className="rounded-xl border border-(--bg-elevated) bg-(--bg-base) overflow-hidden">
              <div
                className="p-4 sm:p-5 transition-[filter] duration-150"
                style={blur > 0 ? { filter: `blur(${blur}px)` } : undefined}
              >
                <Screen variant={panel.variant} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        aria-live="polite"
        className="px-5 sm:px-6 py-4 border-t border-(--bg-elevated) text-[13px] leading-[1.6] text-(--text-secondary)"
      >
        {caption(blur)}
      </div>
    </div>
  );
}
