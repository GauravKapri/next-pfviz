"use client";

import { useState, useEffect } from "react";
import { Menu, BarChart2, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ControlPanel } from "./ControlPanel";
import { StatsPanel } from "./StatsPanel";

type Panel = "controls" | "stats" | null;

export const MobileBar = () => {
  const [open, setOpen] = useState<Panel>(null);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Bottom bar */}
      <div className="lg:hidden shrink-0 border-t border-border bg-card px-4 py-2 flex items-center justify-between">
        <button
          onClick={() => setOpen(open === "controls" ? null : "controls")}
          className={cn(
            "flex items-center gap-2 h-9 px-3 rounded-lg text-sm font-medium border transition-colors",
            open === "controls"
              ? "bg-foreground text-background border-transparent"
              : "bg-muted border-border text-foreground hover:bg-accent",
          )}
        >
          <Menu className="w-4 h-4" />
          Controls
        </button>

        <button
          onClick={() => setOpen(open === "stats" ? null : "stats")}
          className={cn(
            "flex items-center gap-2 h-9 px-3 rounded-lg text-sm font-medium border transition-colors",
            open === "stats"
              ? "bg-foreground text-background border-transparent"
              : "bg-muted border-border text-foreground hover:bg-accent",
          )}
        >
          <BarChart2 className="w-4 h-4" />
          Stats
        </button>
      </div>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={() => setOpen(null)}
          />

          {/* Sheet */}
          <div className="relative bg-card border-t border-border rounded-t-2xl max-h-[80vh] overflow-y-auto animate-fade-up">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-8 h-1 rounded-full bg-border" />
            </div>

            {/* Title row */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <span className="font-semibold text-sm text-foreground">
                {open === "controls" ? "Controls" : "Statistics"}
              </span>
              <button
                onClick={() => setOpen(null)}
                className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-4">
              {open === "controls" ? <ControlPanel /> : <StatsPanel />}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
