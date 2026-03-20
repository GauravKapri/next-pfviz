export type CellState =
  | "empty"
  | "wall"
  | "weight"
  | "start"
  | "end"
  | "visited"
  | "frontier"
  | "path";

export interface Position {
  row: number;
  col: number;
}

export interface Cell {
  position: Position;
  state: CellState;
  weight: number; // 1 = normal, WEIGHT_VALUE = heavy
}

export type Grid = Cell[][];
