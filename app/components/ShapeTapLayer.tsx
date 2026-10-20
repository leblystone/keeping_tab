"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { formatCurrency } from "@/lib/format";
import { getBoxMapCard, BOX_PAGE_W, BOX_PAGE_H, BoxMapCell } from "@/lib/overlays";

type Props = {
  cardId: string;
  amounts: Record<string, number>;
  filledIds: Set<string>;
  onToggle: (cellId: string) => void;
};

const W = BOX_PAGE_W;
const H = BOX_PAGE_H;
const MIN_HIT_PX = 44;

function roundRectPath(x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));
  return `M${x + rr},${y}H${x + w - rr}A${rr},${rr} 0 0 1 ${x + w},${y + rr}V${y + h - rr}A${rr},${rr} 0 0 1 ${x + w - rr},${y + h}H${x + rr}A${rr},${rr} 0 0 1 ${x},${y + h - rr}V${y + rr}A${rr},${rr} 0 0 1 ${x + rr},${y}Z`;
}

/** SVG path (in 1080x1643 viewBox units) for a box-map cell shape. */
export function cellPath(c: BoxMapCell): string {
  const x = c.x * W, y = c.y * H, w = c.w * W, h = c.h * H;
  switch (c.shape) {
    case "circle": {
      const cx = c.cx! * W, cy = c.cy! * H, r = c.r! * W;
      return `M${cx - r},${cy}a${r},${r} 0 1 0 ${2 * r},0a${r},${r} 0 1 0 ${-2 * r},0Z`;
    }
    case "ellipse": {
      const cx = c.cx! * W, cy = c.cy! * H, rx = c.rx! * W, ry = c.ry! * H;
      return `M${cx - rx},${cy}a${rx},${ry} 0 1 0 ${2 * rx},0a${rx},${ry} 0 1 0 ${-2 * rx},0Z`;
    }
    case "polygon":
      return "M" + c.points!.map(([px, py]) => `${px * W},${py * H}`).join("L") + "Z";
    case "roundrect":
      return roundRectPath(x, y, w, h, (c.cornerRadius ?? 0) * W);
    default:
      return `M${x},${y}h${w}v${h}h${-w}Z`;
  }
}

export function ShapeTapLayer({ cardId, amounts, filledIds, onToggle }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const [pxWidth, setPxWidth] = useState(390);
  const mapped = getBoxMapCard(cardId);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setPxWidth(e.contentRect.width || 390));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cells = useMemo(() => mapped?.cells ?? [], [mapped]);

  // Invisible minimum hit areas (>= 44 screen px) for small shapes, capped so they
  // don't reach past the midpoint to the nearest neighbour.
  const hits = useMemo(() => {
    const minU = (MIN_HIT_PX * W) / pxWidth; // 44px in viewBox units
    const centers = cells.map((c) => [(c.x + c.w / 2) * W, (c.y + c.h / 2) * H]);
    return cells.map((c, i) => {
      const [cx, cy] = centers[i];
      let nearX = Infinity, nearY = Infinity;
      centers.forEach(([ox, oy], j) => {
        if (j === i) return;
        const dx = Math.abs(ox - cx), dy = Math.abs(oy - cy);
        // neighbour mainly beside vs mainly above/below
        if (dx >= dy) nearX = Math.min(nearX, dx);
        else nearY = Math.min(nearY, dy);
      });
      const w = Math.max(c.w * W, Math.min(minU, nearX));
      const h = Math.max(c.h * H, Math.min(minU, nearY));
      return { x: cx - w / 2, y: cy - h / 2, w, h };
    });
  }, [cells, pxWidth]);

  if (!mapped) return null;
  const strokeW = (2.5 * W) / pxWidth; // ~2.5 screen px

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full touch-manipulation select-none"
      style={{ WebkitTapHighlightColor: "transparent" }}
      data-testid="shape-tap-layer"
    >
      {/* Layer 1: enlarged invisible hit areas (behind the real shapes). */}
      {cells.map((c, i) => (
        <rect
          key={`hit-${c.id}`}
          {...hits[i]}
          fill="transparent"
          pointerEvents="all"
          aria-hidden
          onClick={() => onToggle(c.id)}
        />
      ))}
      {/* Layer 2: the printed shapes — tap target and fill/outline. */}
      {cells.map((c) => {
        const filled = filledIds.has(c.id);
        const label = `${formatCurrency(amounts[c.id] ?? c.amountCents)} box${filled ? " (filled)" : ""}`;
        return (
          <path
            key={c.id}
            d={cellPath(c)}
            role="button"
            tabIndex={0}
            aria-pressed={filled}
            aria-label={label}
            data-cell={c.id}
            data-filled={filled ? "1" : "0"}
            pointerEvents="all"
            onClick={() => onToggle(c.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggle(c.id);
              }
            }}
            className="outline-none transition-[fill,stroke] duration-150 cursor-pointer"
            fill={filled ? "rgba(214, 140, 150, 0.45)" : "transparent"}
            stroke={filled ? "#48141c" : "rgba(255, 248, 240, 0.35)"}
            strokeWidth={filled ? strokeW * 1.4 : strokeW * 0.6}
            strokeLinejoin="round"
          />
        );
      })}
    </svg>
  );
}
