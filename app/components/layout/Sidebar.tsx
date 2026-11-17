import { NavLink } from "@remix-run/react";
import { House } from "lucide-react";
import { moduleGroups, modules } from "~/data/modules";
import { IconWrapper } from "../ui/icon";

interface SidebarProps {
  collapsed: boolean;
}

const navItemBase =
  "flex items-center gap-2.5 px-3 py-2 rounded-lg no-underline text-[13px] font-medium transition-colors duration-150 cursor-pointer";
const navItemDefault = "text-(--text-secondary) hover:bg-(--bg-hover) hover:text-(--text-primary)";
const navItemActive = "bg-(--accent-dim) text-(--accent-text)";
const groupLabel =
  "font-mono text-[10px] font-semibold tracking-[0.12em] uppercase text-(--text-ghost) px-3 pt-4 pb-1.5";

export function Sidebar({ collapsed }: SidebarProps) {
  return (
    <aside
      className={`w-(--sidebar-width) shrink-0 h-[calc(100vh-var(--header-height))] overflow-y-auto bg-(--bg-surface) border-r border-(--bg-hover) p-4 flex flex-col gap-0.5 sticky top-(--header-height) transition-[width,opacity,transform] duration-250 ease overflow-hidden ${collapsed
        ? "w-0! p-0! opacity-0 -translate-x-2.5 border-0!"
        : "opacity-100 translate-x-0"
        }`}
    >
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `${navItemBase} ${isActive ? navItemActive : navItemDefault}`
        }
      >
        <IconWrapper m className="text-[--accent-text]">
          <House />
        </IconWrapper>
        <span>Übersicht</span>
      </NavLink>

      {moduleGroups.map((group) => (
        <div key={group.id} className="flex flex-col gap-0.5">
          <div className={groupLabel}>{group.label}</div>
          {modules
            .filter((module) => module.group === group.id)
            .map((module) => (
              <NavLink
                key={module.id}
                to={`/modules/${module.slug}`}
                title={module.titleDe}
                className={({ isActive }) =>
                  `${navItemBase} ${isActive ? navItemActive : navItemDefault}`
                }
              >
                <span className="w-5 h-5 rounded-[5px] flex items-center justify-center font-mono text-[9px] font-bold shrink-0 border bg-(--accent-dim) border-(--accent-border) text-(--accent-text)">
                  {module.number}
                </span>
                <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {module.titleDe}
                </span>
              </NavLink>
            ))}
        </div>
      ))}
    </aside>
  );
}
