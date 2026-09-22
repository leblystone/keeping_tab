import { Card, Overlay } from "./types";

/** Map of card id → local Canva PNG (partial catalog for live testing). */
export const CARD_BACKGROUNDS: Record<string, string> = {
  "v1-p01": "/cards/v1-p01.png",
  "v1-p03": "/cards/v1-p03.png",
  "v1-p06": "/cards/v1-p06.png",
  "v1-p17": "/cards/v1-p17.png",
};

/** Sample v.2 art shown as preview backgrounds on select paid cards without v.1 art yet. */
export const PREVIEW_BACKGROUNDS: Record<string, string> = {
  "v1-p24": "/cards/v2-p02.png",
  "v1-p23": "/cards/v2-p03.png",
};

export function getCardBackground(cardId: string): string | undefined {
  return CARD_BACKGROUNDS[cardId] ?? PREVIEW_BACKGROUNDS[cardId];
}

/**
 * Build overlay positions from seed cells.
 * Amounts start from seed but are meant to be edited in the UI — not long-term hardcoded source.
 */
export function buildOverlays(
  card: Card,
  amountOverrides?: Record<string, number>
): Overlay[] {
  const n = card.cells.length;
  if (n === 0) return [];

  const cols = n <= 6 ? 2 : n <= 12 ? 3 : n <= 16 ? 4 : 4;
  const rows = Math.ceil(n / cols);

  // Keep overlays in the typical Canva "$ box" band (skip header art + footer)
  const top = 26;
  const bottom = 82;
  const left = 8;
  const right = 92;
  const areaW = right - left;
  const areaH = bottom - top;
  const gapX = 2.5;
  const gapY = 2.5;
  const cellW = (areaW - gapX * (cols - 1)) / cols;
  const cellH = (areaH - gapY * (rows - 1)) / rows;

  return card.cells.map((cell, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const amountCents =
      amountOverrides?.[cell.id] ?? cell.amountCents;
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
