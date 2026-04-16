import type { MetaFunction } from "@remix-run/node";
import { PraxisProject } from "~/components/praxis-project/PraxisProject";

export const meta: MetaFunction = () => [
    { title: "Praxis Project — Dashboard · UX/UI Workshop" },
    {
        name: "description",
        content:
            "Gestalte ein komplexes Dashboard-UI komplett aus einer flachen Vorlage — baue dein eigenes Design-System (Farben, Spacing, Radii, Typografie) und wende es gezielt auf Elemente an.",
    },
];

export default function PraxisProjectRoute() {
    return (
        <div className="py-8 px-6">
            <div className="mb-6 max-w-[1400px] mx-auto">
                <div className="font-mono text-[10px] font-semibold tracking-[0.15em] uppercase text-(--accent-text) mb-2">
                    Praxis Project
                </div>
                <h1 className="text-[26px] font-extrabold leading-tight tracking-tight text-(--text-primary) mb-2 mt-0">
                    Dashboard — Build Your Own Design System
                </h1>
                <p className="text-[14px] leading-[1.6] text-(--text-secondary) m-0 max-w-[72ch]">
                    Du bekommst ein komplett flaches Dashboard: keine Farben, keine Schrift­hierarchie, kein
                    Spacing. Deine Aufgabe: definiere Variablen (Farben, Spacing-Skala, Radius, Typografie)
                    im <strong>Design&nbsp;System</strong>-Tab, klicke dann Elemente an und weise ihnen deine
                    Tokens zu — oder überschreibe Werte direkt. Der Inspector ist rechts, klappbar, volle Höhe.
                </p>
            </div>
            <PraxisProject />
        </div>
    );
}
