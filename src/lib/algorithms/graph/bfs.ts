import type { Grid, Position } from "@/types/cell";
import type { AlgorithmResult, AnimationStep } from "@/types/algorithm";
import { reconstructPath } from "@/lib/utils/pathUtils";

export function bfs(grid: Grid, start: Position, end: Position): AlgorithmResult {
  const steps: AnimationStep[] = [];
  const visited = new Set<string>();
  const parent = new Map<string, Position | null>();
  const queue: Position[] = [start];
  const key = (p: Position) => `${p.row}-${p.col}`;
  const DIRS: [number, number][] = [[-1, 0], [0, 1], [1, 0], [0, -1]];

  visited.add(key(start));
  parent.set(key(start), null);

  const t0 = performance.now();
  let visitedNodes = 0;

  while (queue.length) {
    const cur = queue.shift()!;
    visitedNodes++;

    if (cur.row === end.row && cur.col === end.col) {
      const pathSteps = reconstructPath(parent, start, end);
      return {
        steps: [...steps, ...pathSteps],
        stats: { visitedNodes, pathLength: pathSteps.length, executionTimeMs: performance.now() - t0 },
      };
    }

    if (!(cur.row === start.row && cur.col === start.col)) {
      steps.push({ mutations: [{ row: cur.row, col: cur.col, state: "visited" }], phase: "search" });
    }

    for (const [dr, dc] of DIRS) {
      const nr = cur.row + dr, nc = cur.col + dc;
      const nk = key({ row: nr, col: nc });
      if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length) continue;
      if (grid[nr][nc].state === "wall" || visited.has(nk)) continue;
      visited.add(nk);
      parent.set(nk, cur);
      queue.push({ row: nr, col: nc });
      if (!(nr === end.row && nc === end.col))
        steps.push({ mutations: [{ row: nr, col: nc, state: "frontier" }], phase: "search" });
    }
  }

  return { steps, stats: { visitedNodes, pathLength: 0, executionTimeMs: performance.now() - t0 } };
}
