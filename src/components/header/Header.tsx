"use client";

import {
  Play,
  Square,
  RotateCcw,
  Eraser,
  Trash2,
  Sun,
  Moon,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils/cn";
import { ALGO_META } from "@/types/algorithm";
import Link from "next/link";
import Image from "next/image";

export const Header = () => {
  const isAnimating = useStore((s) => s.isAnimating);
  const isDark = useStore((s) => s.isDark);
  const graphAlgorithm = useStore((s) => s.graphAlgorithm);
  const runAlgorithm = useStore((s) => s.runAlgorithm);
  const cancel = useStore((s) => s.cancel);
  const resetGrid = useStore((s) => s.resetGrid);
  const clearPath = useStore((s) => s.clearPath);
  const clearWalls = useStore((s) => s.clearWalls);
  const toggleTheme = useStore((s) => s.toggleTheme);

  const meta = ALGO_META[graphAlgorithm];

  return (
    <header className="grain shrink-0 border-b border-border bg-card/80 backdrop-blur-md px-4 h-14 flex items-center justify-between gap-4">
      {/* Logo */}
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="PathFinder Home"
        >
          <div className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
            <Image
              src="/logo.svg"
              alt=""
              width={32}
              height={32}
              className="w-6 h-6 object-contain"
              priority
            />
          </div>
          <span className="font-semibold text-base tracking-tight text-foreground hidden sm:block">
            PathFinder
          </span>
        </Link>
        <div
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/80 border border-border"
          aria-label="Algorithm info"
        >
          <span className="text-[11px] text-muted-foreground font-medium">
            {meta.tag}
          </span>
          {meta.optimal && (
            <>
              <span className="text-[10px] text-node-start font-semibold">
                · Optimal
              </span>
            </>
          )}
          {meta.weighted && (
            <>
              <span className="text-[10px] text-node-weight font-semibold">
                · Weighted
              </span>
            </>
          )}
        </div>
      </div>

      {/* Primary actions */}
      <div className="flex items-center gap-2">
        {!isAnimating ? (
          <button
            onClick={runAlgorithm}
            className={cn(
              "flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold",
              "bg-primary text-primary-foreground shadow-sm",
              "hover:bg-primary/90 active:scale-[0.98] transition-all",
            )}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Visualize</span>
          </button>
        ) : (
          <button
            onClick={cancel}
            className={cn(
              "flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold",
              "bg-destructive/15 text-destructive border border-destructive/25",
              "hover:bg-destructive/20 active:scale-[0.98] transition-all",
            )}
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop</span>
          </button>
        )}

        <button
          onClick={resetGrid}
          className={cn(
            "flex items-center gap-2 h-9 px-3 rounded-lg text-sm font-medium",
            "text-muted-foreground border border-border bg-transparent",
            "hover:text-foreground hover:bg-accent active:scale-[0.98] transition-all",
          )}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Secondary actions + theme */}
      <div className="flex items-center gap-1.5">
        <div className="hidden lg:flex items-center gap-1 mr-1">
          <IconBtn
            onClick={clearWalls}
            disabled={isAnimating}
            title="Clear walls"
          >
            <Eraser className="w-4 h-4" />
          </IconBtn>
          <IconBtn
            onClick={clearPath}
            disabled={isAnimating}
            title="Clear path"
          >
            <Trash2 className="w-4 h-4" />
          </IconBtn>
        </div>

        <button
          onClick={toggleTheme}
          title="Toggle theme"
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-lg",
            "text-muted-foreground border border-border bg-transparent",
            "hover:text-foreground hover:bg-accent active:scale-[0.98] transition-all",
          )}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};

function IconBtn({
  children,
  onClick,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "w-9 h-9 flex items-center justify-center rounded-lg",
        "text-muted-foreground border border-border bg-transparent",
        "hover:text-foreground hover:bg-accent active:scale-[0.98] transition-all",
        "disabled:opacity-40 disabled:pointer-events-none",
      )}
    >
      {children}
    </button>
  );
}
