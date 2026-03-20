import type { Grid, Position } from "@/types/cell";
import type { AlgorithmResult, GraphAlgorithm } from "@/types/algorithm";
import { bfs } from "./graph/bfs";
import { dfs } from "./graph/dfs";
import { dijkstra } from "./graph/dijkstra";
import { astar } from "./graph/astar";

export function runGraphAlgorithm(
  algo: GraphAlgorithm,
  grid: Grid,
  start: Position,
  end: Position
): AlgorithmResult {
  switch (algo) {
    case "bfs": return bfs(grid, start, end);
    case "dfs": return dfs(grid, start, end);
    case "dijkstra": return dijkstra(grid, start, end);
    case "astar": return astar(grid, start, end);
  }
}
