import type { Grid } from "@/types/cell";
import type { AnimationStep, MazeAlgorithm } from "@/types/algorithm";
import { recursiveDivision } from "./maze/recursiveDivision";
import { randomizedPrims } from "./maze/randomizedPrims";
import { binaryTree } from "./maze/binaryTree";

export function runMazeAlgorithm(algo: MazeAlgorithm, grid: Grid): AnimationStep[] {
  switch (algo) {
    case "recursive-division": return recursiveDivision(grid);
    case "randomized-prims": return randomizedPrims(grid);
    case "binary-tree": return binaryTree(grid);
  }
}
