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
        <p className="text-xs text-gray-500">
          Overlay sum:{" "}
          <span className="font-semibold text-gray-800">
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
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
            editMode
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {editMode ? "Done editing" : "Edit $ amounts"}
        </button>
      </div>

      <div
        className="relative w-full mx-auto rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-[#f6efe6]"
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
          <div className="absolute inset-0 bg-gradient-to-b from-[#f3e7d8] via-[#efe2d2] to-[#e8d5c0]">
            <div className="absolute top-6 left-0 right-0 text-center px-6">
              <p className="font-serif text-3xl text-stone-700/80 italic">
                savings
              </p>
              <p className="text-xs tracking-[0.25em] uppercase text-stone-500 mt-1">
                challenge
              </p>
            </div>
            <p className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-stone-400">
              Art import pending · overlays live
            </p>
          </div>
        )}

        {/* Soft veil so $ overlays stay readable over busy art */}
        <div className="absolute inset-0 bg-white/10 pointer-events-none" />

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
              className={`absolute flex items-center justify-center rounded-lg border-2 transition-all active:scale-95 ${
                filled
                  ? "bg-amber-500/90 border-amber-600 text-white shadow-md"
                  : "bg-white/85 border-white/90 text-stone-800 shadow-sm backdrop-blur-[2px]"
              } ${editMode ? "ring-2 ring-orange-400 ring-offset-1" : ""}`}
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
                  className="w-[90%] text-center text-sm font-bold bg-white text-stone-900 rounded px-1 py-0.5 outline-none"
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

      <p className="text-center text-xs text-gray-500">
        {editMode
          ? "Tap a $ box to change the amount — live sum updates"
          : "Tap a $ overlay to fill · sum rolls up from overlays"}
      </p>
    </div>
  );
}
