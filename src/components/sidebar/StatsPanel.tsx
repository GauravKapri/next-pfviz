"use client";

import {
  Activity,
  Clock,
  GitBranch,
  Info,
  Milestone,
  MousePointer2,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { ALGO_META } from "@/types/algorithm";
import { cn } from "@/lib/utils/cn";

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/60 border border-border">
      <div className="p-1.5 rounded-md bg-card border border-border shrink-0">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground tabular-nums">
          {value}
        </p>
        {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

function SectionLabel({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

const CONTROLS = [
  { key: "Click / Drag", val: "Draw walls or weights" },
  { key: "Drag Start / End", val: "Reposition nodes" },
  { key: "Touch & drag", val: "Works on mobile" },
  { key: "Visualize", val: "Run selected algorithm" },
  { key: "Reset", val: "Clear everything" },
];

export const StatsPanel = () => {
  const graphAlgorithm = useStore((s) => s.graphAlgorithm);
  const stats = useStore((s) => s.stats);
  const meta = ALGO_META[graphAlgorithm];

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Algorithm info */}
      <section className="flex flex-col gap-2">
        <SectionLabel icon={Info} label="Algorithm" />

        <div className="rounded-lg border border-border bg-card p-3.5 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <span className="font-semibold text-foreground text-sm">
              {meta.label}
            </span>
            <span
              className={cn(
                "text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0",
                "border border-border bg-muted text-muted-foreground",
              )}
            >
              {meta.tag}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {meta.description}
          </p>
          <div className="flex gap-2 pt-0.5">
            <Badge active={meta.optimal} label="Optimal" />
            <Badge active={meta.weighted} label="Weighted" />
          </div>
        </div>
      </section>

      <div className="h-px bg-border" />

      {/* Stats */}
      <section className="flex flex-col gap-2">
        <SectionLabel icon={Activity} label="Last Run" />

        {stats ? (
          <div className="flex flex-col gap-2 animate-(--animate-fade-up)">
            <StatCard
              icon={Milestone}
              label="Nodes visited"
              value={stats.visitedNodes.toLocaleString()}
            />
            <StatCard
              icon={GitBranch}
              label="Path length"
              value={
                stats.pathLength > 0
                  ? `${stats.pathLength} cells`
                  : "No path found"
              }
            />
            <StatCard
              icon={Clock}
              label="Execution time"
              value={`${stats.executionTimeMs.toFixed(2)} ms`}
            />
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card/50 p-4 text-center">
            <p className="text-xs text-muted-foreground">
              Run an algorithm to see results
            </p>
          </div>
        )}
      </section>

      <div className="h-px bg-border" />

      {/* Controls */}
      <section className="flex flex-col gap-2">
        <SectionLabel icon={MousePointer2} label="Controls" />
        <div className="flex flex-col gap-2">
          {CONTROLS.map(({ key, val }) => (
            <div key={key} className="flex items-start justify-between gap-3">
              <span className="text-[11px] text-foreground/70 font-medium shrink-0">
                {key}
              </span>
              <span className="text-[11px] text-muted-foreground text-right">
                {val}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

function Badge({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={cn(
        "text-[10px] font-medium px-1.5 py-0.5 rounded border",
        active
          ? "bg-node-start/10 border-node-start/25 text-node-start"
          : "bg-muted border-border text-muted-foreground line-through",
      )}
    >
      {label}
    </span>
  );
}
