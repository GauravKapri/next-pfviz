import type { Grid, Position } from "@/types/cell";
import type { AlgorithmResult, AnimationStep } from "@/types/algorithm";
import { reconstructPath, MinPQ } from "@/lib/utils/pathUtils";

const h = (a: Position, b: Position) =>
  Math.abs(a.row - b.row) + Math.abs(a.col - b.col);

export function astar(grid: Grid, start: Position, end: Position): AlgorithmResult {
  const steps: AnimationStep[] = [];
  const visited = new Set<string>();
  const parent = new Map<string, Position | null>();
  const g = new Map<string, number>();
  const pq = new MinPQ<{ row: number; col: number; priority: number }>();
  const key = (p: Position) => `${p.row}-${p.col}`;
  const DIRS: [number, number][] = [[-1, 0], [0, 1], [1, 0], [0, -1]];

  const sk = key(start);
  g.set(sk, 0);
  parent.set(sk, null);
  pq.push({ ...start, priority: h(start, end) });

  const t0 = performance.now();
  let visitedNodes = 0;

  while (pq.size) {
    const { row, col } = pq.pop()!;
    const ck = key({ row, col });
    if (visited.has(ck)) continue;
    visited.add(ck);
    visitedNodes++;

    if (row === end.row && col === end.col) {
      const pathSteps = reconstructPath(parent, start, end);
      return {
        steps: [...steps, ...pathSteps],
        stats: { visitedNodes, pathLength: pathSteps.length, executionTimeMs: performance.now() - t0 },
      };
    }

    if (!(row === start.row && col === start.col))
      steps.push({ mutations: [{ row, col, state: "visited" }], phase: "search" });

    for (const [dr, dc] of DIRS) {
      const nr = row + dr, nc = col + dc;
      const nk = key({ row: nr, col: nc });
      if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length) continue;
      const cell = grid[nr][nc];
      if (cell.state === "wall" || visited.has(nk)) continue;
      const tg = (g.get(ck) ?? Infinity) + (cell.weight ?? 1);
      if (tg < (g.get(nk) ?? Infinity)) {
        g.set(nk, tg);
        parent.set(nk, { row, col });
        pq.push({ row: nr, col: nc, priority: tg + h({ row: nr, col: nc }, end) });
        if (!(nr === end.row && nc === end.col))
          steps.push({ mutations: [{ row: nr, col: nc, state: "frontier" }], phase: "search" });
      }
    }
  }

  return { steps, stats: { visitedNodes, pathLength: 0, executionTimeMs: performance.now() - t0 } };
}
