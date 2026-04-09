import { useState } from "react";
import { Outlet, useMatches } from "@remix-run/react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const matches = useMatches();

  const moduleMatch = matches.find((m) => m.id === "routes/modules.$slug");
  const moduleTitle = moduleMatch?.data
    ? (moduleMatch.data as { module?: { title: string } })?.module?.title
    : undefined;

  return (
    <div className="min-h-screen bg-(--bg-base)">
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        currentModuleTitle={moduleTitle}
      />

      <div className="flex max-w-[100vw]  relative">


        <Sidebar collapsed={sidebarCollapsed} />


        <main className="flex-1 min-w-0 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
