export interface Cell {
  id: string;
  amountCents: number;
  label?: string;
}

export interface Overlay {
  id: string;
  amountCents: number;
  xPct: number;
  yPct: number;
  wPct: number;
  hPct: number;
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
  backgroundSrc?: string;
}

export interface Book {
  id: string;
  title: string;
  version: string;
  orientation: "portrait";
  cards: Card[];
}

export interface Bundle {
  id: string;
  name: string;
  tagline: string;
  tier: "free" | "paid";
  priceLabel?: string;
  accent: "amber" | "sky" | "rose" | "violet" | "emerald" | "fuchsia" | "orange";
  cardIds: string[];
}

export interface CardProgress {
  filledCells: Set<string>;
  savedCents: number;
  isComplete: boolean;
  amountOverrides?: Record<string, number>;
  lastTouchedAt?: number;
}

export type ProgressState = Record<string, CardProgress>;

export type SortKey = "default" | "az" | "goal" | "progress";
export type FilterStatus = "all" | "not_started" | "in_progress" | "complete" | "favorites";
