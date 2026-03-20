"use client";

import { memo, useCallback } from "react";
import { cn } from "@/lib/utils/cn";
import { CELL_SIZE, WEIGHT_VALUE } from "@/lib/constants";
import type { Cell } from "@/types/cell";

const StartMarker = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className="pointer-events-none drop-shadow-sm"
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

const EndMarker = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className="pointer-events-none drop-shadow-sm"
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

const STATE_CLS: Record<string, string> = {
  empty: "bg-node-empty",
  wall: "bg-node-wall   animate-[var(--animate-cell-wall)]",
  weight: "bg-node-weight animate-[var(--animate-cell-weight)]",
  start: "bg-node-empty",
  end: "bg-node-empty",
  frontier: "bg-node-frontier animate-[var(--animate-cell-pop)]",
  visited: "bg-node-visited  animate-[var(--animate-cell-pop)]",
  path: "bg-node-path     animate-[var(--animate-cell-path)]",
};

interface CellProps {
  cell: Cell;
  isIdle: boolean;
  isMouseDownRef: React.RefObject<boolean>;
  dragNodeRef: React.RefObject<"start" | "end" | null>;
  onPaint: (row: number, col: number) => void;
  onDragStart: (type: "start" | "end") => void;
  onDragEnter: (row: number, col: number) => void;
  onDragEnd: () => void;
}

const CellBase = ({
  cell,
  isIdle,
  isMouseDownRef,
  dragNodeRef,
  onPaint,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: CellProps) => {
  const {
    state,
    position: { row, col },
  } = cell;
  const isNode = state === "start" || state === "end";

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isIdle) return;
      e.preventDefault();
      if (isNode) {
        onDragStart(state as "start" | "end");
        return;
      }
      isMouseDownRef.current = true;
      onPaint(row, col);
    },
    [isIdle, isNode, state, row, col, onPaint, onDragStart, isMouseDownRef],
  );

  const handleMouseEnter = useCallback(() => {
    if (!isIdle) return;
    if (dragNodeRef.current) {
      onDragEnter(row, col);
      return;
    }
    if (isMouseDownRef.current && !isNode) onPaint(row, col);
  }, [
    isIdle,
    isNode,
    row,
    col,
    onPaint,
    onDragEnter,
    isMouseDownRef,
    dragNodeRef,
  ]);

  const handleMouseUp = useCallback(() => {
    if (dragNodeRef.current) onDragEnd();
    isMouseDownRef.current = false;
  }, [dragNodeRef, onDragEnd, isMouseDownRef]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!isIdle) return;
      e.preventDefault();
      if (isNode) {
        onDragStart(state as "start" | "end");
        return;
      }
      isMouseDownRef.current = true;
      onPaint(row, col);
    },
    [isIdle, isNode, state, row, col, onPaint, onDragStart, isMouseDownRef],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isIdle) return;
      e.preventDefault();
      const t = e.touches[0];
      const el = document.elementFromPoint(t.clientX, t.clientY);
      if (!el) return;
      const r = el.getAttribute("data-row"),
        c = el.getAttribute("data-col");
      if (r === null || c === null) return;
      const nr = +r,
        nc = +c;
      if (dragNodeRef.current) {
        onDragEnter(nr, nc);
        return;
      }
      if (isMouseDownRef.current) onPaint(nr, nc);
    },
    [isIdle, onPaint, onDragEnter, isMouseDownRef, dragNodeRef],
  );

  const handleTouchEnd = useCallback(() => {
    if (dragNodeRef.current) onDragEnd();
    isMouseDownRef.current = false;
  }, [dragNodeRef, onDragEnd, isMouseDownRef]);

  return (
    <div
      data-row={row}
      data-col={col}
      style={{ width: CELL_SIZE, height: CELL_SIZE }}
      className={cn(
        "border-[0.5px] select-none shrink-0",
        "flex items-center justify-center",
        STATE_CLS[state] ?? "bg-node-empty",
        isNode && "cursor-grab active:cursor-grabbing",
        isIdle && !isNode && "cursor-crosshair",
      )}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {state === "start" && (
        <span className="text-node-start">
          <StartMarker />
        </span>
      )}
      {state === "end" && (
        <span className="text-node-end">
          <EndMarker />
        </span>
      )}
      {state === "weight" && (
        <span className="text-[7px] font-bold leading-none text-background/70 pointer-events-none select-none">
          {WEIGHT_VALUE}
        </span>
      )}
    </div>
  );
};

export const GridCell = memo(
  CellBase,
  (p, n) =>
    p.cell.state === n.cell.state &&
    p.cell.weight === n.cell.weight &&
    p.isIdle === n.isIdle,
);
