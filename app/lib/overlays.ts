import { Card, Overlay } from "./types";

/** Full Canva catalog backgrounds (flattened / amounts stripped). */
export const CARD_BACKGROUNDS: Record<string, string> = {
  "v1-p01": "/cards/v1-p01.png?v=cat1",
  "v1-p02": "/cards/v1-p02.png?v=cat1",
  "v1-p03": "/cards/v1-p03.png?v=cat1",
  "v1-p04": "/cards/v1-p04.png?v=cat1",
  "v1-p05": "/cards/v1-p05.png?v=cat1",
  "v1-p06": "/cards/v1-p06.png?v=cat1",
  "v1-p07": "/cards/v1-p07.png?v=cat1",
  "v1-p08": "/cards/v1-p08.png?v=cat1",
  "v1-p09": "/cards/v1-p09.png?v=cat1",
  "v1-p10": "/cards/v1-p10.png?v=cat1",
  "v1-p11": "/cards/v1-p11.png?v=cat1",
  "v1-p12": "/cards/v1-p12.png?v=cat1",
  "v1-p13": "/cards/v1-p13.png?v=cat1",
  "v1-p14": "/cards/v1-p14.png?v=cat1",
  "v1-p15": "/cards/v1-p15.png?v=cat1",
  "v1-p16": "/cards/v1-p16.png?v=cat1",
  "v1-p17": "/cards/v1-p17.png?v=cat1",
  "v1-p18": "/cards/v1-p18.png?v=cat1",
  "v1-p19": "/cards/v1-p19.png?v=cat1",
  "v1-p20": "/cards/v1-p20.png?v=cat1",
  "v1-p21": "/cards/v1-p21.png?v=cat1",
  "v1-p22": "/cards/v1-p22.png?v=cat1",
  "v1-p23": "/cards/v1-p23.png?v=cat1",
  "v1-p24": "/cards/v1-p24.png?v=cat1",
  "v1-p25": "/cards/v1-p25.png?v=cat1",
  "v1-p26": "/cards/v1-p26.png?v=cat1",
  "v1-p27": "/cards/v1-p27.png?v=cat1",
  "v1-p28": "/cards/v1-p28.png?v=cat1",
  "v1-p29": "/cards/v1-p29.png?v=cat1",
  "v1-p30": "/cards/v1-p30.png?v=cat1",
  "v1-p31": "/cards/v1-p31.png?v=cat1",
  "v1-p32": "/cards/v1-p32.png?v=cat1",
  "v1-p33": "/cards/v1-p33.png?v=cat1",
  "v1-p34": "/cards/v1-p34.png?v=cat1",
  "v1-p35": "/cards/v1-p35.png?v=cat1",
  "v1-p36": "/cards/v1-p36.png?v=cat1",
  "v1-p37": "/cards/v1-p37.png?v=cat1",
  "v1-p38": "/cards/v1-p38.png?v=cat1",
  "v1-p39": "/cards/v1-p39.png?v=cat1",
  "v1-p40": "/cards/v1-p40.png?v=cat1",
  "v1-p41": "/cards/v1-p41.png?v=cat1",
  "v1-p42": "/cards/v1-p42.png?v=cat1",
  "v1-p43": "/cards/v1-p43.png?v=cat1",
  "v1-p44": "/cards/v1-p44.png?v=cat1",
  "v1-p45": "/cards/v1-p45.png?v=cat1",
  "v1-p46": "/cards/v1-p46.png?v=cat1",
  "v1-p47": "/cards/v1-p47.png?v=cat1",
  "v1-p48": "/cards/v1-p48.png?v=cat1",
  "v1-p49": "/cards/v1-p49.png?v=cat1",
  "v1-p50": "/cards/v1-p50.png?v=cat1",
  "v2-p02": "/cards/v2-p02.png?v=cat1",
  "v2-p03": "/cards/v2-p03.png?v=cat1",
  "v2-p04": "/cards/v2-p04.png?v=cat1",
  "v2-p05": "/cards/v2-p05.png?v=cat1",
  "v2-p06": "/cards/v2-p06.png?v=cat1",
  "v2-p07": "/cards/v2-p07.png?v=cat1",
  "v2-p08": "/cards/v2-p08.png?v=cat1",
  "v2-p09": "/cards/v2-p09.png?v=cat1",
  "v2-p10": "/cards/v2-p10.png?v=cat1",
  "v2-p11": "/cards/v2-p11.png?v=cat1",
  "v2-p12": "/cards/v2-p12.png?v=cat1",
  "v2-p13": "/cards/v2-p13.png?v=cat1",
  "v2-p14": "/cards/v2-p14.png?v=cat1",
  "v2-p15": "/cards/v2-p15.png?v=cat1",
  "v2-p16": "/cards/v2-p16.png?v=cat1",
  "v2-p17": "/cards/v2-p17.png?v=cat1",
  "v2-p18": "/cards/v2-p18.png?v=cat1",
  "v2-p19": "/cards/v2-p19.png?v=cat1",
  "v2-p20": "/cards/v2-p20.png?v=cat1",
  "v2-p21": "/cards/v2-p21.png?v=cat1",
  "v2-p22": "/cards/v2-p22.png?v=cat1",
  "v2-p23": "/cards/v2-p23.png?v=cat1",
  "v2-p24": "/cards/v2-p24.png?v=cat1",
  "v2-p25": "/cards/v2-p25.png?v=cat1",
  "v2-p26": "/cards/v2-p26.png?v=cat1",
  "v2-p27": "/cards/v2-p27.png?v=cat1",
  "v2-p28": "/cards/v2-p28.png?v=cat1",
  "v2-p29": "/cards/v2-p29.png?v=cat1",
  "v2-p30": "/cards/v2-p30.png?v=cat1",
  "v2-p31": "/cards/v2-p31.png?v=cat1",
  "v2-p32": "/cards/v2-p32.png?v=cat1",
  "v2-p33": "/cards/v2-p33.png?v=cat1",
  "v2-p34": "/cards/v2-p34.png?v=cat1",
  "v2-p35": "/cards/v2-p35.png?v=cat1",
  "v2-p36": "/cards/v2-p36.png?v=cat1",
  "v2-p37": "/cards/v2-p37.png?v=cat1",
  "v2-p38": "/cards/v2-p38.png?v=cat1",
  "v2-p39": "/cards/v2-p39.png?v=cat1",
  "v2-p40": "/cards/v2-p40.png?v=cat1",
  "v2-p41": "/cards/v2-p41.png?v=cat1",
  "v2-p42": "/cards/v2-p42.png?v=cat1",
  "v2-p43": "/cards/v2-p43.png?v=cat1",
  "v2-p44": "/cards/v2-p44.png?v=cat1",
  "v2-p45": "/cards/v2-p45.png?v=cat1",
  "v2-p46": "/cards/v2-p46.png?v=cat1",
  "v2-p47": "/cards/v2-p47.png?v=cat1",
  "v2-p48": "/cards/v2-p48.png?v=cat1",
  "v2-p49": "/cards/v2-p49.png?v=cat1",
  "v2-p50": "/cards/v2-p50.png?v=cat1",
};

export function getCardBackground(cardId: string): string | undefined {
  return CARD_BACKGROUNDS[cardId];
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
