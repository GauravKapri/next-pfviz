import type { Position } from "@/types/cell";
import type { AnimationStep } from "@/types/algorithm";

export function reconstructPath(
  parent: Map<string, Position | null>,
  start: Position,
  end: Position
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const path: Position[] = [];
  const key = (p: Position) => `${p.row}-${p.col}`;

  let cur: Position | null = end;
  while (cur !== null) {
    path.unshift(cur);
    const p = parent.get(key(cur));
    if (p === undefined) break;
    cur = p;
  }

  for (const pos of path) {
    if (
      (pos.row === start.row && pos.col === start.col) ||
      (pos.row === end.row && pos.col === end.col)
    )
      continue;
    steps.push({
      mutations: [{ row: pos.row, col: pos.col, state: "path" }],
      phase: "path",
    });
  }
  return steps;
}

export class MinPQ<T extends { priority: number }> {
  private h: T[] = [];

  push(item: T) {
    this.h.push(item);
    this.up(this.h.length - 1);
  }

  pop(): T | undefined {
    if (!this.h.length) return undefined;
    if (this.h.length === 1) return this.h.pop();
    const top = this.h[0];
    this.h[0] = this.h.pop()!;
    this.down(0);
    return top;
  }

  get size() {
    return this.h.length;
  }

  private up(i: number) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.h[i].priority >= this.h[p].priority) break;
      [this.h[i], this.h[p]] = [this.h[p], this.h[i]];
      i = p;
    }
  }

  private down(i: number) {
    const n = this.h.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < n && this.h[l].priority < this.h[s].priority) s = l;
      if (r < n && this.h[r].priority < this.h[s].priority) s = r;
      if (s === i) break;
      [this.h[i], this.h[s]] = [this.h[s], this.h[i]];
      i = s;
    }
  }
}
