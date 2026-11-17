import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { SegmentedControl } from "~/components/ui/SegmentedControl";

interface Node {
  id: string;
  /** So nennen es Nutzer */
  label: string;
  /** So heißt es intern im Team */
  internal: string;
  path: string;
  content: string;
  children?: Node[];
}

const TREE: Node = {
  id: "home",
  label: "Übersicht",
  internal: "Dashboard-Modul",
  path: "/",
  content: "Was heute ansteht, zuletzt geöffnete Projekte, offene Rückfragen.",
  children: [
    {
      id: "projects",
      label: "Projekte",
      internal: "Entitäten",
      path: "/projekte",
      content: "Alle Projekte mit Status, Fälligkeit und verantwortlicher Person.",
      children: [
        {
          id: "project",
          label: "Projekt",
          internal: "Entität-Detail",
          path: "/projekte/:id",
          content: "Beschreibung, Aufgabenliste, Zeitplan und Dokumente eines Projekts.",
          children: [
            {
              id: "task",
              label: "Aufgabe",
              internal: "Task-Objekt",
              path: "/projekte/:id/aufgaben/:aufgabe",
              content: "Beschreibung, Kommentare, Anhänge und Verlauf einer Aufgabe.",
            },
          ],
        },
      ],
    },
    {
      id: "team",
      label: "Team",
      internal: "Ressourcen",
      path: "/team",
      content: "Wer arbeitet woran, wer ist ausgelastet, wer ist erreichbar.",
    },
    {
      id: "settings",
      label: "Einstellungen",
      internal: "Konfiguration",
      path: "/einstellungen",
      content: "Einstieg in Profil, Benachrichtigungen und Abrechnung.",
      children: [
        {
          id: "profile",
          label: "Profil",
          internal: "User-Stammdaten",
          path: "/einstellungen/profil",
          content: "Name, Bild, E-Mail-Adresse und Passwort.",
        },
        {
          id: "notifications",
          label: "Benachrichtigungen",
          internal: "Notification-Settings",
          path: "/einstellungen/benachrichtigungen",
          content: "Welche Ereignisse per E-Mail oder in der App gemeldet werden.",
        },
        {
          id: "billing",
          label: "Abrechnung",
          internal: "Billing",
          path: "/einstellungen/abrechnung",
          content: "Tarif, Rechnungen und Zahlungsart.",
        },
      ],
    },
  ],
};

type Naming = "user" | "internal";

/** Pfad von der Wurzel bis zum Knoten — für Breadcrumb und Tiefe */
function findTrail(node: Node, id: string, trail: Node[] = []): Node[] | null {
  const next = [...trail, node];
  if (node.id === id) return next;
  for (const child of node.children ?? []) {
    const found = findTrail(child, id, next);
    if (found) return found;
  }
  return null;
}

function TreeItem({
  node,
  depth,
  naming,
  selected,
  onSelect,
}: {
  node: Node;
  depth: number;
  naming: Naming;
  selected: string;
  onSelect: (id: string) => void;
}) {
  const active = node.id === selected;
  return (
    <li>
      <button
        type="button"
        aria-current={active ? "true" : undefined}
        onClick={() => onSelect(node.id)}
        style={{ paddingLeft: `${12 + depth * 20}px` }}
        className={`w-full flex items-center gap-2 pr-3 py-2 rounded-lg text-left text-[13px] cursor-pointer transition-colors duration-150 ${
          active
            ? "bg-(--text-primary) text-(--bg-surface) font-semibold"
            : "text-(--text-secondary) font-medium hover:bg-(--bg-elevated)"
        }`}
      >
        <ChevronRight size={13} className={`shrink-0 ${node.children ? "rotate-90" : "opacity-0"}`} />
        <span className="truncate">{naming === "user" ? node.label : node.internal}</span>
      </button>
      {node.children && (
        <ul className="list-none m-0 p-0 flex flex-col gap-0.5 mt-0.5">
          {node.children.map((child) => (
            <TreeItem key={child.id} node={child} depth={depth + 1} naming={naming} selected={selected} onSelect={onSelect} />
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * Sitemap einer Team-App als Baum — daneben Route, Inhalt und Standort des gewählten Screens.
 * Umschaltbar zwischen Nutzersprache und internem Jargon: Die Struktur bleibt gleich,
 * aber nur eine Benennung lässt erraten, was sich hinter einem Eintrag verbirgt.
 */
export function SitemapExplorer() {
  const [selected, setSelected] = useState("project");
  const [naming, setNaming] = useState<Naming>("user");

  const trail = findTrail(TREE, selected) ?? [TREE];
  const node = trail[trail.length - 1];
  const name = (item: Node) => (naming === "user" ? item.label : item.internal);
  const clicks = trail.length - 1;

  return (
    <div className="bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl shadow-(--shadow-sm) mb-6 overflow-hidden">
      <div className="px-5 sm:px-6 py-4 border-b border-(--bg-elevated)">
        <SegmentedControl
          label="Beschriftung"
          options={[
            { value: "user", label: "Wie Nutzer es nennen" },
            { value: "internal", label: "Wie das Team es nennt" },
          ]}
          value={naming}
          onChange={setNaming}
        />
      </div>

      <div className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        {/* Baum */}
        <nav aria-label="Sitemap der Beispiel-App" className="p-4 sm:p-5">
          <ul className="list-none m-0 p-0 flex flex-col gap-0.5">
            <TreeItem node={TREE} depth={0} naming={naming} selected={selected} onSelect={setSelected} />
          </ul>
        </nav>

        {/* Details */}
        <div className="p-5 sm:p-6 bg-(--bg-base) border-t md:border-t-0 md:border-l border-(--bg-elevated)" aria-live="polite">
          <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-2">
            Standort
          </div>
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-(--text-tertiary) mb-4">
            {trail.map((item, index) => (
              <span key={item.id} className="inline-flex items-center gap-1.5">
                {index > 0 && <ChevronRight size={12} className="text-(--text-ghost)" />}
                <span className={index === trail.length - 1 ? "font-semibold text-(--text-primary)" : ""}>{name(item)}</span>
              </span>
            ))}
          </div>

          <div className="text-[19px] font-extrabold leading-[1.25] tracking-[-0.2px] text-(--text-primary) mb-1">{name(node)}</div>
          <code className="inline-block font-mono text-[13px] text-(--text-secondary) bg-(--bg-elevated) px-1.5 py-0.5 rounded mb-4 break-all">
            {node.path}
          </code>

          <div className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-(--text-ghost) mb-1">
            Auf diesem Screen
          </div>
          <p className="text-[13px] leading-[1.6] text-(--text-secondary) mt-0 mb-4">{node.content}</p>

          <div className="text-[13px] leading-[1.6] text-(--text-secondary) pt-4 border-t border-(--bg-elevated)">
            <strong className="font-semibold text-(--text-primary)">
              Ebene {trail.length} · {clicks === 0 ? "Startpunkt" : `${clicks} ${clicks === 1 ? "Klick" : "Klicks"} von der Übersicht`}.
            </strong>{" "}
            {naming === "internal"
              ? "Mit den internen Namen stimmt die Struktur weiterhin — aber würde ein neuer Nutzer erraten, was sich hinter diesem Eintrag verbirgt?"
              : clicks >= 3
                ? "Tiefer sollte es nicht gehen. Ab hier braucht es eine Breadcrumb, damit der Rückweg sichtbar bleibt."
                : "Der Name sagt, was einen erwartet, und die Route folgt derselben Gliederung."}
          </div>
        </div>
      </div>
    </div>
  );
}
