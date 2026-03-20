import type { Grid } from "@/types/cell";
import type { AnimationStep } from "@/types/algorithm";

export function binaryTree(grid: Grid): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const R = grid.length, C = grid[0].length;
  const isPersistent = (r: number, c: number) =>
    grid[r][c].state === "start" || grid[r][c].state === "end";

  for (let r = 0; r < R; r++) {
    const muts: AnimationStep["mutations"] = [];
    for (let c = 0; c < C; c++)
      if (!isPersistent(r, c)) muts.push({ row: r, col: c, state: "wall" });

    if (r % 2 !== 0) {
      for (let c = 1; c < C; c += 2) {
        const m = muts.find(x => x.row === r && x.col === c);
        if (m && !isPersistent(r, c)) m.state = "empty";
        const hasE = c + 2 < C, hasS = r + 2 < R;
        let dir: "e" | "s" | null = null;
        if (hasE && hasS) dir = Math.random() < 0.5 ? "e" : "s";
        else if (hasE) dir = "e";
        else if (hasS) dir = "s";
        if (dir === "e") {
          const m2 = muts.find(x => x.row === r && x.col === c + 1);
          if (m2 && !isPersistent(r, c + 1)) m2.state = "empty";
        }
      }
    }

    if (r > 0 && r % 2 === 0) {
      for (let c = 1; c < C; c += 2) {
        const pr = r - 1;
        const hasE = c + 2 < C, hasS = pr + 2 < R;
        const choseSouth =
          (!hasE && hasS) ||
          (hasE && hasS && ((pr * 31 + c) * 17) % 100 >= 50);
        if (choseSouth && !isPersistent(r, c)) {
          const m = muts.find(x => x.row === r && x.col === c);
          if (m) m.state = "empty";
        }
      }
    }

    if (muts.length) steps.push({ mutations: muts, phase: "maze" });
  }
  return steps;
}
