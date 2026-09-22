export interface Cell {
  id: string;
  amountCents: number;
  label?: string;
}

/** Live dollar overlay on a flattened card background. Amounts are editable; sums roll up from these. */
export interface Overlay {
  id: string;
  amountCents: number;
  /** Position as % of card canvas (0–100) */
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
  /** Temporary seed — overlays drive UX; cells kept for migration / QA notes */
  cells: Cell[];
  qaFlags?: string[];
  cellsSumCents?: number;
  /** Flattened Canva page art (optional until catalog imported) */
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
  accent: "amber" | "sky" | "rose" | "violet" | "emerald" | "fuchsia" | "orange";
  cardIds: string[];
}

export interface CardProgress {
  filledCells: Set<string>;
  savedCents: number;
  isComplete: boolean;
  /** Editable overlay amounts — source of truth for sums when present */
  amountOverrides?: Record<string, number>;
}

export type ProgressState = Record<string, CardProgress>;
