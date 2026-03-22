"use client";

import { useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { useStore } from "@/lib/store";
import { GridCell } from "./Cell";

export const GridBoard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMouseDown = useRef(false);
  const dragNode = useRef<"start" | "end" | null>(null);

  const grid = useStore((s) => s.grid);
  const mode = useStore((s) => s.mode);
  const initGrid = useStore((s) => s.initGrid);
  const resizeGrid = useStore((s) => s.resizeGrid);
  const paintCell = useStore((s) => s.paintCell);
  const moveNode = useStore((s) => s.moveNode);

  const isIdle = mode === "idle";

  // Init + resize
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const { offsetWidth: w, offsetHeight: h } = containerRef.current;
    if (w > 0 && h > 0) initGrid(w, h);
  }, [initGrid]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      resizeGrid(Math.floor(width), Math.floor(height));
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [resizeGrid]);

  // Drag handlers
  const handleDragStart = useCallback((type: "start" | "end") => {
    dragNode.current = type;
  }, []);

  const handleDragEnter = useCallback(
    (row: number, col: number) => {
      if (!dragNode.current) return;
      moveNode(dragNode.current, row, col);
    },
    [moveNode],
  );

  const handleDragEnd = useCallback(() => {
    dragNode.current = null;
    isMouseDown.current = false;
  }, []);

  const handleGlobalUp = useCallback(() => {
    dragNode.current = null;
    isMouseDown.current = false;
  }, []);

  if (!grid.length) return <div ref={containerRef} className="h-full w-full" />;

  return (
    <div
      ref={containerRef}
      className="grain h-full w-full overflow-hidden flex flex-col items-center justify-center outline-none"
      onMouseUp={handleGlobalUp}
      onMouseLeave={handleGlobalUp}
    >
      {grid.map((row) => (
        <div key={row[0].position.row} className="flex">
          {row.map((cell) => (
            <GridCell
              key={`${cell.position.row}-${cell.position.col}`}
              cell={cell}
              isIdle={isIdle}
              isMouseDownRef={isMouseDown}
              dragNodeRef={dragNode}
              onPaint={paintCell}
              onDragStart={handleDragStart}
              onDragEnter={handleDragEnter}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
