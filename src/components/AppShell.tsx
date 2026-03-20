"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { Header } from "@/components/header/Header";
import { GridBoard } from "@/components/grid/GridBoard";
import { ControlPanel } from "@/components/sidebar/ControlPanel";
import { StatsPanel } from "@/components/sidebar/StatsPanel";
import { MobileBar } from "@/components/sidebar/MobileBar";

export const AppShell = () => {
  const isDark = useStore((s) => s.isDark);

  // Sync initial dark class on mount
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <div className="h-svh flex flex-col overflow-hidden bg-background text-foreground">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — desktop only */}
        <aside className="hidden lg:flex w-67 shrink-0 flex-col border-r border-border bg-card overflow-y-auto px-4 py-5">
          <ControlPanel />
        </aside>

        {/* Grid */}
        <main className="flex-1 min-w-0 overflow-hidden bg-node-empty relative">
          <GridBoard />
        </main>

        {/* Right sidebar — desktop XL+ */}
        <aside className="hidden xl:flex w-67 shrink-0 flex-col border-l border-border bg-card overflow-y-auto px-4 py-5">
          <StatsPanel />
        </aside>
      </div>

      {/* Mobile bottom bar + drawer */}
      <MobileBar />
    </div>
  );
};
