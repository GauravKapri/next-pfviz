"use client";

import { useState } from "react";
import {
  ChevronDown,
  Cpu,
  Wand2,
  Pencil,
  Weight,
  Eraser,
  Zap,
  BookOpen,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils/cn";
import {
  ALGO_META,
  MAZE_META,
  type GraphAlgorithm,
  type MazeAlgorithm,
  type DrawMode,
  type Speed,
} from "@/types/algorithm";

// ─── Section wrapper ────────────────────────────────────

function Section({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

// ─── Custom select ───────────────────────────────────────

function Select<T extends string>({
  value,
  options,
  onChange,
  disabled,
}: {
  value: T;
  options: { value: T; label: string; sub?: string }[];
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        disabled={disabled}
        onClick={() => setOpen((p) => !p)}
        className={cn(
          "w-full flex items-center justify-between gap-2 h-9 px-3 rounded-lg text-sm",
          "bg-input border border-border text-foreground text-left",
          "hover:bg-accent transition-colors",
          "disabled:opacity-40 disabled:pointer-events-none",
        )}
      >
        <span className="truncate">{current?.label}</span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className={cn(
              "absolute top-full mt-1 left-0 right-0 z-50",
              "rounded-lg border border-border bg-popover shadow-xl overflow-hidden",
              "animate-fade-up",
            )}
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "w-full px-3 py-2.5 text-sm text-left flex flex-col gap-0.5",
                  "hover:bg-accent transition-colors",
                  opt.value === value ? "bg-accent/60" : "",
                )}
              >
                <span
                  className={cn(
                    "font-medium",
                    opt.value === value
                      ? "text-foreground"
                      : "text-foreground/80",
                  )}
                >
                  {opt.label}
                </span>
                {opt.sub && (
                  <span className="text-[11px] text-muted-foreground">
                    {opt.sub}
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Draw mode button ────────────────────────────────────

function DrawBtn({
  active,
  icon: Icon,
  label,
  onClick,
  disabled,
}: {
  mode: DrawMode;
  active: boolean;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-lg text-xs font-medium",
        "border transition-all disabled:opacity-40 disabled:pointer-events-none",
        active
          ? "bg-foreground text-background border-transparent"
          : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-accent",
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

// ─── Speed button ────────────────────────────────────────

function SpeedBtn({
  label,
  active,
  onClick,
  disabled,
}: {
  value: Speed;
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex-1 h-8 text-xs font-medium rounded-lg border transition-all",
        "disabled:opacity-40 disabled:pointer-events-none",
        active
          ? "bg-foreground/10 border-foreground/20 text-foreground font-semibold"
          : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-accent",
      )}
    >
      {label}
    </button>
  );
}

// ─── Legend row ──────────────────────────────────────────

function LegendRow({
  color,
  label,
  icon,
}: {
  color?: string;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      {icon ? (
        <div className="w-4 h-4 flex items-center justify-center">{icon}</div>
      ) : (
        <div
          className={cn("w-4 h-4 rounded-sm border border-border/50", color)}
        />
      )}
    </div>
  );
}

// Inline icons matching Cell.tsx exactly
const LegendStart = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    className="text-node-start drop-shadow-sm"
  >
    <rect
      x="4"
      y="4"
      width="16"
      height="16"
      rx="2"
      transform="rotate(45 12 12)"
      fill="currentColor"
      opacity="0.25"
    />
    <rect
      x="8"
      y="8"
      width="8"
      height="8"
      rx="1.5"
      transform="rotate(45 12 12)"
      fill="currentColor"
    />
  </svg>
);

const LegendEnd = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    className="text-node-end drop-shadow-sm"
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="2.5"
      fill="none"
      opacity="0.3"
    />
    <circle cx="12" cy="12" r="5" fill="currentColor" />
  </svg>
);

// ─── Main component ──────────────────────────────────────

const GRAPH_OPTIONS = (
  Object.entries(ALGO_META) as [
    GraphAlgorithm,
    (typeof ALGO_META)[GraphAlgorithm],
  ][]
).map(([value, m]) => ({ value, label: m.tag, sub: m.label }));

const MAZE_OPTIONS = (
  Object.entries(MAZE_META) as [
    MazeAlgorithm,
    (typeof MAZE_META)[MazeAlgorithm],
  ][]
).map(([value, m]) => ({ value, label: m.label }));

export const ControlPanel = () => {
  const graphAlgorithm = useStore((s) => s.graphAlgorithm);
  const mazeAlgorithm = useStore((s) => s.mazeAlgorithm);
  const drawMode = useStore((s) => s.drawMode);
  const speed = useStore((s) => s.speed);
  const isAnimating = useStore((s) => s.isAnimating);

  const setGraphAlgorithm = useStore((s) => s.setGraphAlgorithm);
  const setMazeAlgorithm = useStore((s) => s.setMazeAlgorithm);
  const setDrawMode = useStore((s) => s.setDrawMode);
  const setSpeed = useStore((s) => s.setSpeed);
  const generateMaze = useStore((s) => s.generateMaze);

  const meta = ALGO_META[graphAlgorithm];

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Algorithm */}
      <Section label="Algorithm" icon={Cpu}>
        <Select
          value={graphAlgorithm}
          options={GRAPH_OPTIONS}
          onChange={setGraphAlgorithm}
          disabled={isAnimating}
        />
        <p className="text-[11px] text-muted-foreground leading-relaxed px-0.5">
          {meta.description}
        </p>
      </Section>

      <div className="h-px bg-border" />

      {/* Maze */}
      <Section label="Generate Maze" icon={Wand2}>
        <Select
          value={mazeAlgorithm ?? ("" as MazeAlgorithm)}
          options={[
            { value: "" as MazeAlgorithm, label: "Pick a maze…" },
            ...MAZE_OPTIONS,
          ]}
          onChange={setMazeAlgorithm}
          disabled={isAnimating}
        />
        <button
          onClick={generateMaze}
          disabled={isAnimating || !mazeAlgorithm}
          className={cn(
            "w-full h-9 rounded-lg text-sm font-medium border transition-all",
            "bg-card border-border text-foreground",
            "hover:bg-accent disabled:opacity-40 disabled:pointer-events-none",
          )}
        >
          Generate
        </button>
      </Section>

      <div className="h-px bg-border" />

      {/* Draw mode */}
      <Section label="Draw" icon={Pencil}>
        <div className="flex gap-1.5">
          <DrawBtn
            mode="wall"
            active={drawMode === "wall"}
            icon={Pencil}
            label="Wall"
            onClick={() => setDrawMode("wall")}
            disabled={isAnimating}
          />
          <DrawBtn
            mode="weight"
            active={drawMode === "weight"}
            icon={Weight}
            label="Weight"
            onClick={() => setDrawMode("weight")}
            disabled={isAnimating}
          />
          <DrawBtn
            mode="erase"
            active={drawMode === "erase"}
            icon={Eraser}
            label="Erase"
            onClick={() => setDrawMode("erase")}
            disabled={isAnimating}
          />
        </div>
      </Section>

      <div className="h-px bg-border" />

      {/* Speed */}
      <Section label="Speed" icon={Zap}>
        <div className="flex gap-1.5">
          <SpeedBtn
            value="slow"
            label="Slow"
            active={speed === "slow"}
            onClick={() => setSpeed("slow")}
            disabled={isAnimating}
          />
          <SpeedBtn
            value="medium"
            label="Medium"
            active={speed === "medium"}
            onClick={() => setSpeed("medium")}
            disabled={isAnimating}
          />
          <SpeedBtn
            value="fast"
            label="Fast"
            active={speed === "fast"}
            onClick={() => setSpeed("fast")}
            disabled={isAnimating}
          />
        </div>
      </Section>

      <div className="h-px bg-border" />

      {/* Legend */}
      {/* Legend */}
      <Section label="Legend" icon={BookOpen}>
        <div className="flex flex-col gap-2">
          <LegendRow icon={<LegendStart />} label="Start node" />
          <LegendRow icon={<LegendEnd />} label="End node" />
          <LegendRow color="bg-node-wall" label="Wall" />
          <LegendRow color="bg-node-weight" label="Weight (cost ×5)" />
          <LegendRow color="bg-node-visited" label="Visited" />
          <LegendRow color="bg-node-frontier" label="Frontier" />
          <LegendRow color="bg-node-path" label="Shortest path" />
        </div>
      </Section>
    </div>
  );
};
