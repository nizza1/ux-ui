import { useLoaderData } from "@remix-run/react";
import { modules } from "~/data/modules";
import { ModuleNav } from "~/routes/modules.$slug";
import { TheoryCard } from "~/components/ui/TheoryCard";
import { ConceptList, ConceptItem } from "~/components/ui/ConceptList";
import { RuleBox } from "~/components/ui/RuleBox";
import { LearningGoals } from "~/components/ui/LearningGoals";
import { BuildsOn } from "~/components/ui/BuildsOn";
import { ModuleMeta } from "~/components/ui/ModuleMeta";
import { ImagePlaceholder } from "~/components/ui/ImagePlaceholder";

export async function loader() {
  const slug = "wireframing";
  const currentIndex = modules.findIndex((m) => m.slug === slug);
  return {
    prevModule: currentIndex > 0 ? modules[currentIndex - 1] : null,
    nextModule: currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null,
  };
}

// ── Lo-Fi Wireframe component ─────────────────────────────────────────────────
function LoFiWireframe() {
  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl overflow-hidden mb-4">
      <div className="px-4 py-2.5 border-b border-(--bg-elevated) flex items-center justify-between">
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent)">
          Lo-Fi Wireframe: E-Commerce Suchergebnisse
        </p>
        <span className="font-mono text-[10px] text-(--text-ghost)">Keine Farbe, keine Styles</span>
      </div>
      <div className="p-4 bg-(--bg-surface)">
        {/* Search bar */}
        <div className="border-2 border-(--bg-elevated) rounded h-9 flex items-center px-3 mb-4">
          <div className="h-2 bg-(--bg-elevated) rounded w-32" />
          <div className="ml-auto h-6 w-14 bg-(--bg-elevated) rounded flex items-center justify-center">
            <span className="text-[10px] text-(--text-tertiary) font-mono">Suchen</span>
          </div>
        </div>
        <div className="flex gap-4">
          {/* Filter sidebar */}
          <div className="w-36 shrink-0">
            <div className="border border-(--bg-elevated) rounded p-2 space-y-2">
              <div className="h-2 bg-(--bg-elevated) rounded w-20" />
              <div className="space-y-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 border border-(--bg-elevated) rounded-sm" />
                    <div className="h-1.5 bg-(--bg-elevated) rounded" style={{ width: `${50 + i * 10}px` }} />
                  </div>
                ))}
              </div>
              <div className="border-t border-(--bg-elevated) pt-2">
                <div className="h-2 bg-(--bg-elevated) rounded w-16 mb-1.5" />
                <div className="flex gap-1">
                  <div className="flex-1 h-5 border border-(--bg-elevated) rounded" />
                  <div className="w-2 h-5 bg-(--bg-elevated)" />
                  <div className="flex-1 h-5 border border-(--bg-elevated) rounded" />
                </div>
              </div>
            </div>
            {/* Annotation */}
            <div className="mt-2 flex items-start gap-1">
              <span className="text-[10px] text-(--accent) font-bold mt-0.5">①</span>
              <p className="text-[10px] text-(--text-tertiary) leading-snug">Filter-Sidebar: kollabierbar auf Mobile</p>
            </div>
          </div>
          {/* Product grid */}
          <div className="flex-1">
            <div className="grid grid-cols-3 gap-2.5 mb-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border border-(--bg-elevated) rounded p-2">
                  <div className="bg-(--bg-elevated) rounded h-16 mb-2 flex items-center justify-center">
                    <span className="text-[9px] text-(--text-ghost) font-mono">Bild</span>
                  </div>
                  <div className="h-1.5 bg-(--bg-elevated) rounded mb-1 w-4/5" />
                  <div className="h-1.5 bg-(--bg-elevated) rounded w-1/2" />
                  <div className="mt-1.5 h-5 bg-(--bg-elevated) rounded flex items-center justify-center">
                    <span className="text-[9px] text-(--text-tertiary) font-mono">In Warenkorb</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Annotation */}
            <div className="flex items-start gap-1 mb-2">
              <span className="text-[10px] text-(--accent) font-bold mt-0.5">②</span>
              <p className="text-[10px] text-(--text-tertiary) leading-snug">Produktkarte: Bild, Titel, Preis, CTA — in dieser Reihenfolge</p>
            </div>
            {/* Pagination */}
            <div className="flex justify-center gap-1">
              {["←", "1", "2", "3", "→"].map((p) => (
                <div key={p} className="w-7 h-7 border border-(--bg-elevated) rounded flex items-center justify-center">
                  <span className="text-[11px] text-(--text-tertiary)">{p}</span>
                </div>
              ))}
            </div>
            <div className="mt-1.5 flex items-start justify-center gap-1">
              <span className="text-[10px] text-(--accent) font-bold">③</span>
              <p className="text-[10px] text-(--text-tertiary)">Paginierung: statt Infinite Scroll für E-Commerce</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mid-Fi Wireframe component ────────────────────────────────────────────────
function MidFiWireframe() {
  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-xl overflow-hidden mb-6">
      <div className="px-4 py-2.5 border-b border-(--bg-elevated) flex items-center justify-between">
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent)">
          Mid-Fi Wireframe: Gleiche Struktur, mehr Präzision
        </p>
        <span className="font-mono text-[10px] text-(--text-ghost)">Grautöne, reale Labels</span>
      </div>
      <div className="p-4 bg-(--bg-surface)">
        {/* Realistic search */}
        <div className="flex gap-2 mb-4 items-center">
          <div className="flex-1 border border-(--bg-elevated) rounded-lg h-9 flex items-center px-3 gap-2">
            <div className="w-3.5 h-3.5 rounded-full border border-(--text-ghost) opacity-40" />
            <span className="text-[12px] text-(--text-ghost)">Suche nach Produkten…</span>
          </div>
          <div className="h-9 px-4 bg-(--bg-elevated) rounded-lg flex items-center">
            <span className="text-[12px] font-semibold text-(--text-secondary)">Filter</span>
          </div>
        </div>
        <div className="flex gap-4">
          {/* Mid-fi sidebar */}
          <div className="w-40 shrink-0">
            <div className="bg-(--bg-elevated) rounded-xl p-3 space-y-3">
              <p className="text-[12px] font-semibold text-(--text-primary)">Kategorien</p>
              <div className="space-y-2">
                {["Alle Produkte", "Neu eingetroffen", "Bestseller", "Angebote"].map((cat) => (
                  <div key={cat} className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border border-(--text-ghost) rounded opacity-40" />
                    <span className="text-[12px] text-(--text-secondary)">{cat}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-(--bg-hover) pt-2">
                <p className="text-[12px] font-semibold text-(--text-primary) mb-1.5">Preis</p>
                <div className="flex gap-1 items-center">
                  <div className="flex-1 h-6 bg-(--bg-base) border border-(--bg-elevated) rounded text-center flex items-center justify-center">
                    <span className="text-[11px] text-(--text-ghost)">€ 0</span>
                  </div>
                  <span className="text-[11px] text-(--text-ghost)">–</span>
                  <div className="flex-1 h-6 bg-(--bg-base) border border-(--bg-elevated) rounded text-center flex items-center justify-center">
                    <span className="text-[11px] text-(--text-ghost)">€ 500</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Mid-fi grid */}
          <div className="flex-1">
            <p className="text-[12px] text-(--text-secondary) mb-3">24 Ergebnisse</p>
            <div className="grid grid-cols-3 gap-2.5 mb-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-(--bg-elevated) rounded-xl overflow-hidden">
                  <div className="h-16 bg-(--bg-hover) flex items-center justify-center">
                    <span className="text-[9px] text-(--text-ghost) font-mono">Produktbild</span>
                  </div>
                  <div className="p-2">
                    <div className="h-2 bg-(--text-ghost) opacity-25 rounded mb-1 w-4/5" />
                    <div className="h-2 bg-(--text-ghost) opacity-15 rounded w-1/2 mb-1.5" />
                    <div className="h-5 bg-(--text-ghost) opacity-15 rounded" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-1.5">
              {["←", "1", "2", "3", "→"].map((p) => (
                <div
                  key={p}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] ${p === "1"
                      ? "bg-(--text-secondary) text-white"
                      : "bg-(--bg-elevated) text-(--text-secondary)"
                    }`}
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WireframingModule() {
  const { prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      <div className="max-w-[1000px] mx-auto w-full px-8 py-12 flex-1">

        {/* ── Title ── */}
        <div className="inline-flex items-center gap-2 bg-(--accent-dim) border border-(--accent-border) rounded-full py-1 px-3.5 font-mono text-[11px] font-semibold text-(--accent) tracking-[1.5px] uppercase mb-6 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-(--accent) before:shadow-[0_0_6px_var(--accent)] before:shrink-0">
          Modul 07
        </div>
        <h1 className="text-[clamp(28px,4vw,36px)] font-extrabold leading-[1.15] tracking-[-0.5px] text-(--text-primary) mb-2 mt-0">
          Wireframing: Lo-Fi, Mid-Fi und der Übergang zum Mockup
        </h1>
        <p className="text-[15px] font-medium leading-normal text-(--text-secondary) mb-8 mt-0 max-w-130">
          Effektive Wireframes erstellen, Best Practices kennen und wissen,
          wann der Übergang vom Wireframe zum Hi-Fi-Mockup sinnvoll ist.
        </p>

        <ModuleMeta duration="45 Minuten" practiceTime="~20 Min." />

        <BuildsOn modules={"06"} />
        <LearningGoals
          goals={[
            "Den Zweck eines Wireframes erklären – und wann er kein Mockup sein sollte",
            "Lo-Fi-Wireframes mit korrekter Notation und Anmerkungen erstellen",
            "Den Übergang vom Wireframe zum Hi-Fi-Mockup begründen können",
            "Einen Mid-Fi-Wireframe visuell polieren, ohne Hi-Fi zu bauen",
          ]}
        />

        <hr className="border-0 border-t border-(--bg-elevated) my-4" />

        {/* ── What is wireframe ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Definition
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-4 mt-0">
          Was ist ein Wireframe?
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Ein Wireframe ist ein{" "}
          <strong>struktureller Grundriss eines Bildschirms</strong>. Er zeigt
          das Layout, die Inhaltshierarchie und die interaktiven Elemente einer
          Seite – ohne jedes visuelle Styling. Wireframes kommunizieren,{" "}
          <em>was</em> auf einem Bildschirm ist und <em>wie</em> es organisiert
          ist – nicht wie es aussieht.
        </p>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-6">
          Wireframes sind die wichtigste Brücke zwischen Informationsarchitektur
          und visuellem Design. Sie zwingen dich, strukturelle Entscheidungen zu
          treffen – wie viel Platz braucht jedes Element, was ist die
          Lesereihenfolge, was passiert, wenn keine Daten vorhanden sind –{" "}
          <strong>bevor du Zeit für Ästhetik aufwendest</strong>.
        </p>

        {/* ── Lo-Fi ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Stufe 1
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-3 mt-0">
          Lo-Fi-Wireframes
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Lo-Fi-Wireframes verwenden die einfachstmögliche Darstellung jedes
          Elements. Text wird als Linien dargestellt, Bilder als graue Boxen mit
          einem Label, Buttons als Rechtecke. Der Zweck ist{" "}
          <strong>Geschwindigkeit und Verwerfbarkeit</strong>.
        </p>

        <TheoryCard label="Lo-Fi Best Practices">
          <ConceptList>
            <ConceptItem title="Konsistente Notation">
              Verwende dieselben Symbole für jeden Elementtyp (immer eine graue
              Box für Bilder, immer Linien für Text). Inkonsistenz lenkt ab.
            </ConceptItem>
            <ConceptItem title="Anmerkungen hinzufügen">
              Kurze Notizen, die erklären, was jedes Element tut und warum es
              da ist. Anmerkungen sind oft wichtiger als das Wireframe selbst.
            </ConceptItem>
            <ConceptItem title="Mehrere Zustände zeigen">
              Leer, Laden, Fehler, Erfolg – auch auf Lo-Fi-Ebene. Ein
              Wireframe ohne Zustände ist unvollständig.
            </ConceptItem>
            <ConceptItem title="Flow, nicht Einzelbild">
              Designe nie isoliert. Wireframe den vollständigen Nutzerflow,
              nicht nur einzelne Bildschirme.
            </ConceptItem>
          </ConceptList>
        </TheoryCard>

        <LoFiWireframe />

        {/* ── Mid-Fi ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Stufe 2
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-3 mt-0">
          Mid-Fi-Wireframes
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Mid-Fi-Wireframes sind ausgefeilter. Sie verwenden echte
          Inhaltsbeschriftungen, realistische Proportionen und zeigen das Layout
          präziser – aber immer noch ohne Markenfarben oder benutzerdefinierte
          Typografie. <strong>Alles bleibt in Grautönen</strong>.
        </p>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Mid-Fi-Wireframes sind ideal für Stakeholder-Reviews. Sie sind
          spezifisch genug, um strukturelle Fragen zu beantworten – aber abstrakt
          genug, dass sich niemand auf Farbwahl fixiert.
        </p>

        <MidFiWireframe />

        {/* ── Transition to Hi-Fi ── */}
        <p className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-2 block">
          Der entscheidende Moment
        </p>
        <h2 className="text-[19px] font-bold leading-[1.3] tracking-[-0.2px] text-(--text-primary) mb-3 mt-0">
          Wann zum Hi-Fi-Mockup wechseln?
        </h2>
        <p className="text-[13px] leading-[1.7] text-(--text-secondary) mb-4">
          Der typische Ablauf:{" "}
          <strong>Lo-Fi-Skizze → Stakeholder-Review → Überarbeitungen → Mid-Fi-Wireframe → Nutzertest → Überarbeitungen → Hi-Fi-Mockup → Entwickler-Übergabe.</strong>
        </p>

        <div className="bg-(--accent-dim) border border-(--accent-border) rounded-xl p-4 mb-6">
          <p className="font-mono text-[10px] font-semibold text-(--accent) mb-2 uppercase tracking-wider">
            Die entscheidende Frage
          </p>
          <p className="text-[15px] font-bold text-(--text-primary) leading-snug">
            „Wissen wir genug über die Struktur, um sie gut aussehen zu lassen?"
          </p>
          <p className="text-[13px] text-(--text-secondary) mt-2">
            Wenn du noch unsicher bist, ob das Layout funktioniert – bleib bei
            Wireframes. Wenn die Struktur validiert ist – wechsle zu Hi-Fi.
          </p>
        </div>

        <ImagePlaceholder
          aspectRatio="21/8"
          label="Lo-Fi → Mid-Fi → Hi-Fi: Dieselbe Seite in drei Fidelitätsstufen"
          caption="Die Layoutentscheidungen aus dem Lo-Fi überleben in allen Stufen — nur die Präzision nimmt zu"
        />

        <RuleBox title="Kernregel">
          Wireframes sind Werkzeuge, keine Deliverables. Ihre Aufgabe ist es,
          strukturelle Entscheidungen zu dokumentieren und zu validieren – nicht
          zu beeindrucken. Zu früh Hi-Fi bedeutet: Zeit für Schönheit, bevor
          die Struktur stimmt.
        </RuleBox>


      </div>

      <ModuleNav prevModule={prevModule} nextModule={nextModule} />
    </div>
  );
}
