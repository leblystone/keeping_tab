"use client";

import { useState } from "react";
import { Card } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import {
  buildOverlays,
  getCardBackground,
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
        <p className="text-xs text-ktab-taupe">
          Overlay sum:{" "}
          <span className="font-semibold text-ktab-ink">
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
              ? "bg-ktab-burgundy text-ktab-cream"
              : "bg-ktab-nude text-ktab-brown hover:bg-ktab-dusty-rose/50"
          }`}
        >
          {editMode ? "Done editing" : "Edit $ amounts"}
        </button>
      </div>

      <div
        className="relative w-full mx-auto rounded-xl overflow-hidden border border-border bg-ktab-nude shadow-sm"
        style={{ aspectRatio: "522 / 794", maxWidth: 420 }}
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
              }}
              className={`absolute flex items-center justify-center rounded-md border transition-all active:scale-95 ${
                filled
                  ? "bg-ktab-burgundy border-ktab-burgundy text-ktab-cream shadow-sm"
                  : "bg-ktab-cream border-ktab-taupe/45 text-ktab-ink shadow-sm"
              } ${editMode ? "outline outline-2 outline-ktab-taupe outline-offset-1" : ""}`}
            >
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
                  className="w-[90%] text-center text-sm font-bold bg-surface-raised text-ktab-ink rounded px-1 py-0.5 outline-none border border-ktab-taupe/40"
                  inputMode="decimal"
                />
              ) : (
                <span className="text-[11px] sm:text-xs font-bold leading-none px-0.5">
                  {formatCurrency(overlay.amountCents)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-ktab-taupe">
        {editMode
          ? "Tap a $ box to change the amount — live sum updates"
          : "Tap a $ overlay to fill · sum rolls up from overlays"}
      </p>
    </div>
  );
}
