/**
 * Wiederkehrende Text-Stile der Modulseiten (Referenz-Layout seit Modul 04, 07 und 14).
 * Reine Tailwind-Klassenlisten — neue Module importieren sie, statt sie erneut zu definieren.
 */
export const EYEBROW = "font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block";
export const H2 = "text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0";
export const H3 = "text-[15px] font-bold leading-[1.4] text-(--text-primary) mt-8 mb-2";
export const P = "text-[14px] leading-[1.7] text-(--text-secondary) mb-4 mt-0";
export const STRONG = "font-semibold text-(--text-primary)";
export const CAPTION = "text-[13px] leading-[1.6] text-(--text-tertiary) m-0";
export const MICRO = "font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost)";
export const HR = "border-0 border-t border-(--bg-elevated) my-10";
export const PANEL = "bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl mb-6 shadow-(--shadow-sm)";
/** Bühne für Mini-Oberflächen in Vergleichsbeispielen */
export const STAGE = "rounded-lg bg-(--bg-base) border border-(--bg-elevated) p-4";
/** Inline-Code im Fließtext */
export const CODE = "font-mono text-[13px] bg-(--bg-elevated) px-1 rounded";
/** Seitenrahmen einer Modulseite */
export const PAGE = "max-w-[1000px] mx-auto w-full px-4 sm:px-8 py-12 flex-1";
export const H1 =
  "text-[clamp(28px,4vw,36px)] font-extrabold leading-[1.15] tracking-[-0.5px] text-(--text-primary) mb-2 mt-0";
export const LEAD = "text-[15px] font-medium leading-normal text-(--text-secondary) mb-8 mt-0 max-w-140";
