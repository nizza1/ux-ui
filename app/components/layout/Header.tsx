import { Link } from "@remix-run/react";
import { PanelLeftClose, PanelLeftOpen, Layers } from "lucide-react";
import { ThemeToggle } from "~/components/ui/ThemeToggle";

interface HeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  currentModuleTitle?: string;
}

export function Header({
  sidebarCollapsed,
  onToggleSidebar,
  currentModuleTitle,
}: HeaderProps) {
  return (
    <header
      className="h-(--header-height) bg-(--bg-surface) border-b border-(--bg-hover) flex items-center px-(--space-md) gap-(--space-sm) sticky top-0 z-50 shadow-(--shadow-sm)"
    >
      {/* Sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        aria-label={sidebarCollapsed ? "Open sidebar" : "Collapse sidebar"}
        className="flex items-center justify-center w-8 h-8 rounded-sm bg-(--bg-elevated) border border-(--bg-hover) text-(--text-secondary) cursor-pointer shrink-0 transition-colors duration-150"
      >
        {sidebarCollapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
      </button>

      {/* Logo/Title */}
      <Link
        to="/"
        className="flex items-center gap-2.5 no-underline shrink-0"
      >
        <div
          className="w-7 h-7 rounded-sm bg-(--accent-dim) border border-(--accent-border) flex items-center justify-center text-(--accent-text)"
        >
          <Layers size={14} />
        </div>
        <span
          className="font-sans text-sm font-bold text-(--text-primary) tracking-[-0.2px]"
        >
          UX/UI Workshop
        </span>
      </Link>

      {/* Breadcrumb */}
      {currentModuleTitle && (
        <>
          <span className="text-(--text-ghost) text-sm select-none">/</span>
          <span
            className="text-[13px] text-(--text-secondary) font-medium overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {currentModuleTitle}
          </span>
        </>
      )}

      <div className="flex-1" />

      <ThemeToggle />
    </header>
  );
}
