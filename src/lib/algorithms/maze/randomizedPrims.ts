import type { Grid, Position } from "@/types/cell";
import type { AnimationStep } from "@/types/algorithm";

export function randomizedPrims(grid: Grid): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const R = grid.length, C = grid[0].length;
  if (R < 3 || C < 3) return steps;

  const isPersistent = (r: number, c: number) =>
    grid[r][c].state === "start" || grid[r][c].state === "end";

  const initMuts: AnimationStep["mutations"] = [];
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++)
      if (!isPersistent(r, c)) initMuts.push({ row: r, col: c, state: "wall" });
  steps.push({ mutations: initMuts, phase: "maze" });

  const inBounds = (r: number, c: number) => r > 0 && r < R - 1 && c > 0 && c < C - 1;
  const neighbors2 = (r: number, c: number): Position[] =>
    ([[-2, 0], [2, 0], [0, -2], [0, 2]] as [number, number][])
      .map(([dr, dc]) => ({ row: r + dr, col: c + dc }))
      .filter(p => inBounds(p.row, p.col));

  const visited = new Set<string>();
  const frontier: Position[] = [];
  const key = (p: Position) => `${p.row},${p.col}`;

  const seed: Position = { row: 1, col: 1 };
  visited.add(key(seed));
  const seedMuts: AnimationStep["mutations"] = [];
  if (!isPersistent(seed.row, seed.col))
    seedMuts.push({ row: seed.row, col: seed.col, state: "empty" });
  for (const n of neighbors2(seed.row, seed.col)) {
    frontier.push(n);
    if (!isPersistent(n.row, n.col))
      seedMuts.push({ row: n.row, col: n.col, state: "frontier" });
  }
  steps.push({ mutations: seedMuts, phase: "maze" });

  while (frontier.length) {
    const idx = Math.floor(Math.random() * frontier.length);
    const cur = frontier[idx];
    frontier[idx] = frontier[frontier.length - 1];
    frontier.pop();
    if (visited.has(key(cur))) continue;

    const conns = neighbors2(cur.row, cur.col).filter(n => visited.has(key(n)));
    if (!conns.length) continue;

    const conn = conns[Math.floor(Math.random() * conns.length)];
    const wr = cur.row + (conn.row - cur.row) / 2;
    const wc = cur.col + (conn.col - cur.col) / 2;

    const muts: AnimationStep["mutations"] = [];
    if (!isPersistent(wr, wc)) muts.push({ row: wr, col: wc, state: "empty" });
    if (!isPersistent(cur.row, cur.col)) muts.push({ row: cur.row, col: cur.col, state: "empty" });
    visited.add(key(cur));

    for (const n of neighbors2(cur.row, cur.col)) {
      if (!visited.has(key(n))) {
        frontier.push(n);
        if (!isPersistent(n.row, n.col))
          muts.push({ row: n.row, col: n.col, state: "frontier" });
      }
    }
    if (muts.length) steps.push({ mutations: muts, phase: "maze" });
  }

  return steps;
}
