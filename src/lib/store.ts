"use client";

import { create } from "zustand";
import type { Grid, Position, CellState } from "@/types/cell";
import type {
  GraphAlgorithm,
  MazeAlgorithm,
  DrawMode,
  Speed,
  AppMode,
  AnimationStats,
  AnimationStep,
} from "@/types/algorithm";
import {
  CELL_SIZE,
  WEIGHT_VALUE,
  GRAPH_BATCH,
  MAZE_BATCH,
  MAZE_DELAY_MS,
  START_OFFSET,
  END_OFFSET,
} from "@/lib/constants";
import { SPEED_MS } from "@/types/algorithm";
import { runGraphAlgorithm } from "@/lib/algorithms/index";
import { runMazeAlgorithm } from "@/lib/algorithms/maze";

// ─── Grid helpers ────────────────────────────────────────

function buildGrid(rows: number, cols: number): Grid {
  const sr = START_OFFSET, sc = START_OFFSET;
  const er = rows - END_OFFSET, ec = cols - END_OFFSET;
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      position: { row: r, col: c },
      state: (r === sr && c === sc ? "start" : r === er && c === ec ? "end" : "empty") as CellState,
      weight: 1,
    }))
  );
}

function gridDims(containerW: number, containerH: number) {
  const rawR = Math.floor(containerH / CELL_SIZE);
  const rawC = Math.floor(containerW / CELL_SIZE);
  const rows = rawR % 2 === 0 ? rawR - 1 : rawR;
  const cols = rawC % 2 === 0 ? rawC - 1 : rawC;
  return { rows, cols };
}

// ─── Store types ─────────────────────────────────────────

interface StoreState {
  // Grid
  grid: Grid;
  rows: number;
  cols: number;
  startPos: Position;
  endPos: Position;

  // App
  mode: AppMode;
  isAnimating: boolean;
  graphAlgorithm: GraphAlgorithm;
  mazeAlgorithm: MazeAlgorithm | null;
  drawMode: DrawMode;
  speed: Speed;
  stats: AnimationStats | null;
  isDark: boolean;

  // Internal
  _cancelRef: { current: boolean };
}

interface StoreActions {
  initGrid: (w: number, h: number) => void;
  resizeGrid: (w: number, h: number) => void;

  setGraphAlgorithm: (a: GraphAlgorithm) => void;
  setMazeAlgorithm: (a: MazeAlgorithm) => void;
  setDrawMode: (m: DrawMode) => void;
  setSpeed: (s: Speed) => void;
  toggleTheme: () => void;

  paintCell: (row: number, col: number) => void;
  moveNode: (nodeType: "start" | "end", row: number, col: number) => void;

  resetGrid: () => void;
  clearPath: () => void;
  clearWalls: () => void;

  runAlgorithm: () => void;
  generateMaze: () => void;
  cancel: () => void;
}

// ─── Store ───────────────────────────────────────────────

export const useStore = create<StoreState & StoreActions>((set, get) => ({
  // ── Initial state ──
  grid: [],
  rows: 0,
  cols: 0,
  startPos: { row: START_OFFSET, col: START_OFFSET },
  endPos: { row: 0, col: 0 },
  mode: "idle",
  isAnimating: false,
  graphAlgorithm: "astar",
  mazeAlgorithm: null,
  drawMode: "wall",
  speed: "medium",
  stats: null,
  isDark: true,
  _cancelRef: { current: false },

  // ── Grid init / resize ──

  initGrid: (w, h) => {
    const { rows, cols } = gridDims(w, h);
    const grid = buildGrid(rows, cols);
    set({
      grid,
      rows,
      cols,
      startPos: { row: START_OFFSET, col: START_OFFSET },
      endPos: { row: rows - END_OFFSET, col: cols - END_OFFSET },
    });
  },

  resizeGrid: (w, h) => {
    const { rows: nr, cols: nc } = gridDims(w, h);
    const { rows, cols } = get();
    if (nr === rows && nc === cols) return;
    const grid = buildGrid(nr, nc);
    set({
      grid,
      rows: nr,
      cols: nc,
      startPos: { row: START_OFFSET, col: START_OFFSET },
      endPos: { row: nr - END_OFFSET, col: nc - END_OFFSET },
      stats: null,
    });
  },

  // ── Settings ──

  setGraphAlgorithm: (graphAlgorithm) => set({ graphAlgorithm, stats: null }),
  setMazeAlgorithm: (mazeAlgorithm) => set({ mazeAlgorithm }),
  setDrawMode: (drawMode) => set({ drawMode }),
  setSpeed: (speed) => set({ speed }),
  toggleTheme: () => {
    const next = !get().isDark;
    set({ isDark: next });
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", next);
    }
  },

  // ── Painting ──

  paintCell: (row, col) => {
    const { grid, drawMode, isAnimating } = get();
    if (isAnimating) return;
    const cell = grid[row]?.[col];
    if (!cell || cell.state === "start" || cell.state === "end") return;

    set((s) => {
      const next = s.grid.map((r) => [...r]);
      const c = next[row][col];
      if (drawMode === "wall") {
        next[row][col] = { ...c, state: c.state === "wall" ? "empty" : "wall", weight: 1 };
      } else if (drawMode === "weight") {
        next[row][col] = {
          ...c,
          state: c.state === "weight" ? "empty" : "weight",
          weight: c.state === "weight" ? 1 : WEIGHT_VALUE,
        };
      } else {
        next[row][col] = { ...c, state: "empty", weight: 1 };
      }
      return { grid: next };
    });
  },

  moveNode: (nodeType, row, col) => {
    const { grid } = get();
    const cell = grid[row]?.[col];
    if (!cell || cell.state === "start" || cell.state === "end") return;

    set((s) => {
      const next = s.grid.map((r) => [...r]);
      // Remove old node
      for (let r = 0; r < next.length; r++)
        for (let c = 0; c < next[r].length; c++)
          if (next[r][c].state === nodeType)
            next[r][c] = { ...next[r][c], state: "empty" };
      // Place new
      next[row][col] = { ...next[row][col], state: nodeType };
      return {
        grid: next,
        ...(nodeType === "start" ? { startPos: { row, col } } : { endPos: { row, col } }),
      };
    });
  },

  // ── Grid resets ──

  resetGrid: () => {
    get()._cancelRef.current = true;
    const { rows, cols } = get();
    const grid = buildGrid(rows, cols);
    set({
      grid,
      startPos: { row: START_OFFSET, col: START_OFFSET },
      endPos: { row: rows - END_OFFSET, col: cols - END_OFFSET },
      mode: "idle",
      isAnimating: false,
      stats: null,
    });
  },

  clearPath: () => {
    set((s) => ({
      grid: s.grid.map((row) =>
        row.map((c) =>
          c.state === "visited" || c.state === "frontier" || c.state === "path"
            ? { ...c, state: "empty" as CellState }
            : c
        )
      ),
    }));
  },

  clearWalls: () => {
    set((s) => ({
      grid: s.grid.map((row) =>
        row.map((c) =>
          c.state === "wall" || c.state === "weight"
            ? { ...c, state: "empty" as CellState, weight: 1 }
            : c
        )
      ),
    }));
  },

  // ── Cancel ──

  cancel: () => {
    get()._cancelRef.current = true;
    set({ mode: "idle", isAnimating: false });
  },

  // ── Run algorithm ──

  runAlgorithm: async () => {
    const { grid, graphAlgorithm, startPos, endPos, speed, isAnimating, _cancelRef } = get();
    if (isAnimating) return;

    // Clear previous path
    const cleanGrid = grid.map((row) =>
      row.map((c) =>
        c.state === "visited" || c.state === "frontier" || c.state === "path"
          ? { ...c, state: "empty" as CellState }
          : c
      )
    );
    set({ grid: cleanGrid, mode: "running", isAnimating: true, stats: null });
    _cancelRef.current = false;

    const { steps, stats } = runGraphAlgorithm(graphAlgorithm, cleanGrid, startPos, endPos);

    // Animate
    let i = 0;
    const delay = SPEED_MS[speed];

    while (i < steps.length && !_cancelRef.current) {
      const batch: AnimationStep[] = [];
      for (let b = 0; b < GRAPH_BATCH && i < steps.length; b++, i++) {
        batch.push(steps[i]);
      }

      set((s) => {
        const next = s.grid.map((r) => [...r]);
        for (const step of batch) {
          for (const { row, col, state } of step.mutations) {
            const cell = next[row]?.[col];
            if (!cell) continue;
            if ((cell.state === "start" || cell.state === "end") && state !== "start" && state !== "end") continue;
            next[row][col] = { ...cell, state };
          }
        }
        return { grid: next };
      });

      if (i < steps.length) await sleep(delay);
    }

    if (!_cancelRef.current) set({ stats, mode: "idle", isAnimating: false });
  },

  // ── Generate maze ──

  generateMaze: async () => {
    const { mazeAlgorithm, rows, cols, isAnimating, _cancelRef } = get();
    if (isAnimating || !mazeAlgorithm) return;

    // Reset to clean grid first
    const cleanGrid = buildGrid(rows, cols);
    set({ grid: cleanGrid, mode: "generating", isAnimating: true, stats: null });
    _cancelRef.current = false;

    const steps = runMazeAlgorithm(mazeAlgorithm, cleanGrid);
    let i = 0;

    while (i < steps.length && !_cancelRef.current) {
      const batch: AnimationStep[] = [];
      for (let b = 0; b < MAZE_BATCH && i < steps.length; b++, i++) {
        batch.push(steps[i]);
      }

      set((s) => {
        const next = s.grid.map((r) => [...r]);
        for (const step of batch) {
          for (const { row, col, state } of step.mutations) {
            const cell = next[row]?.[col];
            if (!cell) continue;
            if ((cell.state === "start" || cell.state === "end") && state !== "start" && state !== "end") continue;
            next[row][col] = { ...cell, state };
          }
        }
        return { grid: next };
      });

      if (i < steps.length) await sleep(MAZE_DELAY_MS);
    }

    if (!_cancelRef.current) set({ mode: "idle", isAnimating: false });
  },
}));

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
