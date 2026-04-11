import { NavLink } from "@remix-run/react";
import { modules } from "~/data/modules";

// Slugs that have full content routes
const CONTENT_SLUGS = new Set([
  // UX/UI Foundations (modules 00–08)
  "ux-ui-basics",
  "usability",
  "user-needs",
  "research-methods",
  "personas",
  "information-architecture",
  "sketching-prototypes",
  "wireframing",
  "gestalt-principles",
  // Visual/Technical Design (modules 09–)
  "why-design",
  "visual-hierarchy",
  "typography-selection",
  "typography-systems",
  "color-systems",
  "color-contrast",
  "color-hierarchy",
]);

interface SidebarProps {
  collapsed: boolean;
}

const navItemBase =
  "flex items-center gap-2.5 px-3 py-2 rounded-lg no-underline text-[13px] font-medium transition-colors duration-150 cursor-pointer";
const navItemDefault = "text-(--text-secondary) hover:bg-(--bg-hover) hover:text-(--text-primary)";
const navItemActive = "bg-(--accent-dim) text-(--accent-text)";

export function Sidebar({ collapsed }: SidebarProps) {
  return (
    <aside
      className={`w-(--sidebar-width) shrink-0 h-[calc(100vh-var(--header-height))] overflow-y-auto bg-(--bg-surface) border-r border-(--bg-hover) p-4 flex flex-col gap-0.5 sticky top-(--header-height) transition-[width,opacity,transform] duration-250 ease overflow-hidden ${
        collapsed
          ? "w-0! p-0! opacity-0 -translate-x-2.5 border-0!"
          : "opacity-100 translate-x-0"
      }`}
    >
      <div className="font-mono text-[10px] font-semibold tracking-[0.12em] uppercase text-(--text-ghost) px-3 pt-1.5 pb-2">
        Modules
      </div>

      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `${navItemBase} ${isActive ? navItemActive : navItemDefault}`
        }
      >
        <span className="w-5 h-5 rounded-[5px] bg-(--bg-elevated) flex items-center justify-center font-mono text-[9px] font-bold text-(--text-tertiary) shrink-0">
          {"\u2302"}
        </span>
        <span>Overview</span>
      </NavLink>

      <div className="h-px bg-(--bg-hover) my-1.5" />

      {modules.map((module) => {
        const hasContent = CONTENT_SLUGS.has(module.slug);
        return (
          <NavLink
            key={module.id}
            to={`/modules/${module.slug}`}
            className={({ isActive }) =>
              `${navItemBase} ${isActive ? navItemActive : navItemDefault}`
            }
          >
            <span
              className={`w-5 h-5 rounded-[5px] flex items-center justify-center font-mono text-[9px] font-bold shrink-0 border ${
                hasContent
                  ? "bg-(--accent-dim) border-(--accent-border) text-(--accent-text)"
                  : "bg-(--bg-elevated) border-(--bg-hover) text-(--text-tertiary)"
              }`}
            >
              {module.number}
            </span>
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {module.title}
            </span>
          </NavLink>
        );
      })}
    </aside>
  );
}
