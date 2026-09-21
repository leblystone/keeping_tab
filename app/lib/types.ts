export interface Cell {
  id: string;
  amountCents: number;
  label?: string;
}

export interface Card {
  id: string;
  title: string;
  theme: string;
  layout: "equal_grid" | "mixed_grid";
  orientation: "portrait";
  goalCents: number;
  brand?: string;
  cells: Cell[];
  qaFlags?: string[];
  cellsSumCents?: number;
}

export interface Book {
  id: string;
  title: string;
  version: string;
  orientation: "portrait";
  cards: Card[];
}

export interface CardProgress {
  filledCells: Set<string>;
  savedCents: number;
  isComplete: boolean;
}

export type ProgressState = Record<string, CardProgress>;
