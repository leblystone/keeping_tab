"use client";

import { useState } from "react";
import { Card } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import {
  buildOverlays,
  getCardAspect,
  getCardBackground,
  hasBoxMap,
  sumOverlayCents,
} from "@/lib/overlays";

type Props = {
  card: Card;
  filledIds: Set<string>;
  amountOverrides?: Record<string, number>;
  onToggle: (overlayId: string) => void;
  onAmountChange: (overlayId: string, amountCents: number) => void;
};

export function OverlayCardCanvas({
  card,
  filledIds,
  amountOverrides,
  onToggle,
  onAmountChange,
}: Props) {
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const overlays = buildOverlays(card, amountOverrides);
  const background = getCardBackground(card.id) ?? card.backgroundSrc;
  const overlaySum = sumOverlayCents(overlays);
  const printed = hasBoxMap(card.id);
  const aspect = getCardAspect(card.id);

  const openEditor = (id: string, cents: number) => {
    setEditingId(id);
    setDraft(String(cents / 100));
  };

  const commitEditor = () => {
    if (!editingId) return;
    const dollars = parseFloat(draft.replace(/[^0-9.]/g, ""));
    if (!Number.isNaN(dollars)) {
      onAmountChange(editingId, Math.round(dollars * 100));
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-ktab-dusty-rose/80">
          Overlay sum:{" "}
          <span className="font-semibold text-ktab-cream">
            {formatCurrency(overlaySum)}
          </span>
          {background ? " · art on" : " · placeholder art"}
        </p>
        <button
          type="button"
          onClick={() => {
            setEditMode((v) => !v);
            setEditingId(null);
          }}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
            editMode
              ? "bg-ktab-cream text-ktab-burgundy"
              : "bg-ktab-cream/15 text-ktab-cream hover:bg-ktab-cream/25"
          }`}
        >
          {editMode ? "Done editing" : "Edit $ amounts"}
        </button>
      </div>

      <div
        className="relative w-full mx-auto rounded-2xl overflow-hidden kt-glass"
        style={{ aspectRatio: `${aspect}`, maxWidth: 480 }}
      >
        {background ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={background}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 bg-ktab-cream">
            <div className="absolute top-6 left-0 right-0 text-center px-6">
              <p className="h-display text-3xl text-ktab-burgundy/70 italic">
                savings
              </p>
              <p className="text-xs tracking-[0.25em] uppercase text-ktab-taupe mt-1">
                challenge
              </p>
            </div>
            <p className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-ktab-taupe">
              Art import pending · overlays live
            </p>
          </div>
        )}

        {overlays.map((overlay) => {
          const filled = filledIds.has(overlay.id);
          const isEditing = editingId === overlay.id;

          return (
            <button
              key={overlay.id}
              type="button"
              aria-pressed={filled}
              aria-label={`${formatCurrency(overlay.amountCents)} box${filled ? " (filled)" : ""}`}
              onClick={() => {
                if (editMode) {
                  openEditor(overlay.id, overlay.amountCents);
                } else {
                  onToggle(overlay.id);
                }
              }}
              style={{
                left: `${overlay.xPct}%`,
                top: `${overlay.yPct}%`,
                width: `${overlay.wPct}%`,
                height: `${overlay.hPct}%`,
                WebkitTapHighlightColor: "transparent",
              }}
              className={`absolute flex items-center justify-center rounded-xl transition-all duration-150 active:scale-95 touch-manipulation ${
                printed
                  ? filled
                    ? "bg-ktab-burgundy/25 ring-2 ring-ktab-burgundy/70"
                    : "bg-transparent"
                  : filled
                    ? "bg-ktab-burgundy border border-ktab-burgundy text-ktab-cream shadow-sm"
                    : "bg-ktab-cream/95 border border-ktab-cream/50 text-ktab-burgundy shadow-sm"
              } ${editMode ? "outline outline-2 outline-ktab-taupe outline-offset-1" : ""}`}
            >
              {/* Invisible hit area: at least 44px so small printed boxes are easy to tap. */}
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full min-w-11 min-h-11"
              />
              {isEditing ? (
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={commitEditor}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitEditor();
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-[90%] text-center text-sm font-bold bg-ktab-cream text-ktab-burgundy rounded px-1 py-0.5 outline-none border border-ktab-dusty-rose/40"
                  inputMode="decimal"
                />
              ) : printed ? (
                editMode ? (
                  <span className="relative text-[11px] font-bold leading-none px-1 py-0.5 rounded bg-ktab-cream/90 text-ktab-burgundy">
                    {formatCurrency(overlay.amountCents)}
                  </span>
                ) : filled ? (
                  <span className="absolute top-0.5 right-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-ktab-burgundy text-ktab-cream shadow ring-2 ring-ktab-cream">
                    <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                ) : null
              ) : (
                <span className="relative text-[11px] sm:text-xs font-bold leading-none px-0.5">
                  {formatCurrency(overlay.amountCents)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-ktab-dusty-rose/80">
        {editMode
          ? "Tap a $ box to change the amount — live sum updates"
          : printed
            ? "Tap a box to fill it · tap again to undo"
            : "Tap a $ overlay to fill · sum rolls up from overlays"}
      </p>
    </div>
  );
}
