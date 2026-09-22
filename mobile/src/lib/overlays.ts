import { Card, Overlay } from "./types";

/**
 * Build overlay positions from seed cells.
 * Tuned to sit inside the printed envelope boxes (skip header + TOTAL SAVED footer).
 */
export function buildOverlays(
  card: Card,
  amountOverrides?: Record<string, number>
): Overlay[] {
  const n = card.cells.length;
  if (n === 0) return [];

  const cols = n <= 6 ? 2 : n <= 12 ? 3 : n <= 16 ? 4 : 4;
  const rows = Math.ceil(n / cols);

  // Slightly tighter inset than web MVP so art edges don't peek around boxes
  const top = 27.5;
  const bottom = 78;
  const left = 9.5;
  const right = 90.5;
  const areaW = right - left;
  const areaH = bottom - top;
  const gapX = 2.2;
  const gapY = 2.2;
  const cellW = (areaW - gapX * (cols - 1)) / cols;
  const cellH = (areaH - gapY * (rows - 1)) / rows;

  return card.cells.map((cell, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const amountCents = amountOverrides?.[cell.id] ?? cell.amountCents;
    return {
      id: cell.id,
      amountCents,
      xPct: left + col * (cellW + gapX),
      yPct: top + row * (cellH + gapY),
      wPct: cellW,
      hPct: cellH,
    };
  });
}

export function sumOverlayCents(overlays: Overlay[]): number {
  return overlays.reduce((sum, o) => sum + o.amountCents, 0);
}

export function sumFilledOverlayCents(
  overlays: Overlay[],
  filledIds: Set<string>
): number {
  return overlays
    .filter((o) => filledIds.has(o.id))
    .reduce((sum, o) => sum + o.amountCents, 0);
}

/** Live TOTAL SAVED footer band on card face (printed box is dead art). */
export function totalSavedBand(): { xPct: number; yPct: number; wPct: number; hPct: number } {
  return { xPct: 18, yPct: 84, wPct: 64, hPct: 7.5 };
}
