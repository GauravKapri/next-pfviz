import type { Grid } from "@/types/cell";
import type { AnimationStep } from "@/types/algorithm";

export function recursiveDivision(grid: Grid): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const R = grid.length, C = grid[0].length;
  if (R < 3 || C < 3) return steps;

  const isPersistent = (r: number, c: number) =>
    grid[r][c].state === "start" || grid[r][c].state === "end";

  const border: AnimationStep["mutations"] = [];
  for (let c = 0; c < C; c++) {
    if (!isPersistent(0, c)) border.push({ row: 0, col: c, state: "wall" });
    if (!isPersistent(R - 1, c)) border.push({ row: R - 1, col: c, state: "wall" });
  }
  for (let r = 1; r < R - 1; r++) {
    if (!isPersistent(r, 0)) border.push({ row: r, col: 0, state: "wall" });
    if (!isPersistent(r, C - 1)) border.push({ row: r, col: C - 1, state: "wall" });
  }
  if (border.length) steps.push({ mutations: border, phase: "maze" });

  const randEven = (lo: number, hi: number) => {
    if (lo % 2 !== 0) lo++;
    if (hi % 2 !== 0) hi--;
    if (lo > hi) return -1;
    return lo + Math.floor(Math.random() * ((hi - lo) / 2 + 1)) * 2;
  };
  const randOdd = (lo: number, hi: number) => {
    if (lo % 2 === 0) lo++;
    if (hi % 2 === 0) hi--;
    if (lo > hi) return -1;
    return lo + Math.floor(Math.random() * ((hi - lo) / 2 + 1)) * 2;
  };

  const divide = (r1: number, r2: number, c1: number, c2: number) => {
    if (r2 - r1 < 1 || c2 - c1 < 1) return;
    const h = r2 - r1 + 1, w = c2 - c1 + 1;
    const horizontal = w > h ? false : h > w ? true : Math.random() < 0.5;
    const muts: AnimationStep["mutations"] = [];

    if (horizontal) {
      const wr = randEven(r1, r2); if (wr === -1) return;
      const hc = randOdd(c1, c2);
      for (let c = c1 - 1; c <= c2 + 1; c++) {
        if (c < 0 || c >= C || c === hc) continue;
        if (!isPersistent(wr, c)) muts.push({ row: wr, col: c, state: "wall" });
      }
      if (muts.length) steps.push({ mutations: muts, phase: "maze" });
      divide(r1, wr - 1, c1, c2);
      divide(wr + 1, r2, c1, c2);
    } else {
      const wc = randEven(c1, c2); if (wc === -1) return;
      const hr = randOdd(r1, r2);
      for (let r = r1 - 1; r <= r2 + 1; r++) {
        if (r < 0 || r >= R || r === hr) continue;
        if (!isPersistent(r, wc)) muts.push({ row: r, col: wc, state: "wall" });
      }
      if (muts.length) steps.push({ mutations: muts, phase: "maze" });
      divide(r1, r2, c1, wc - 1);
      divide(r1, r2, wc + 1, c2);
    }
  };

  divide(1, R - 2, 1, C - 2);
  return steps;
}
