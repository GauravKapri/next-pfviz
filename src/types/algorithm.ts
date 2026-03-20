export type GraphAlgorithm = "bfs" | "dfs" | "dijkstra" | "astar";

export type MazeAlgorithm =
  | "recursive-division"
  | "randomized-prims"
  | "binary-tree";

export type DrawMode = "wall" | "weight" | "erase";

export type Speed = "slow" | "medium" | "fast";

export type AppMode = "idle" | "running" | "generating";

export interface AnimationStats {
  visitedNodes: number;
  pathLength: number;
  executionTimeMs: number;
}

export interface AnimationStep {
  mutations: {
    row: number;
    col: number;
    state: import("./cell").CellState;
  }[];
  phase: "search" | "path" | "maze";
}

export interface AlgorithmResult {
  steps: AnimationStep[];
  stats: AnimationStats;
}

export const ALGO_META: Record<
  GraphAlgorithm,
  { label: string; tag: string; weighted: boolean; optimal: boolean; description: string }
> = {
  bfs: {
    label: "Breadth-First Search",
    tag: "BFS",
    weighted: false,
    optimal: true,
    description:
      "Explores all neighbors level by level. Guarantees the shortest path on unweighted graphs.",
  },
  dfs: {
    label: "Depth-First Search",
    tag: "DFS",
    weighted: false,
    optimal: false,
    description:
      "Dives deep along one branch before backtracking. Fast but does not guarantee shortest path.",
  },
  dijkstra: {
    label: "Dijkstra's Algorithm",
    tag: "Dijkstra",
    weighted: true,
    optimal: true,
    description:
      "Optimal for weighted graphs. Accounts for weight nodes. Guarantees shortest weighted path.",
  },
  astar: {
    label: "A* Search",
    tag: "A*",
    weighted: true,
    optimal: true,
    description:
      "Uses Manhattan heuristic to guide search toward the goal. Fastest optimal algorithm here.",
  },
};

export const MAZE_META: Record<MazeAlgorithm, { label: string; description: string }> = {
  "recursive-division": {
    label: "Recursive Division",
    description: "Divides space with walls and punches holes. Creates long corridors.",
  },
  "randomized-prims": {
    label: "Randomized Prim's",
    description: "Grows a spanning tree from a seed. Creates organic, winding paths.",
  },
  "binary-tree": {
    label: "Binary Tree",
    description: "Each cell carves east or south. Creates a strong diagonal bias.",
  },
};

export const SPEED_MS: Record<Speed, number> = {
  slow: 40,
  medium: 12,
  fast: 2,
};
