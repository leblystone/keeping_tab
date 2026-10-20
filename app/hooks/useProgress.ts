"use client";

import { useState, useEffect, useRef } from "react";
import { ProgressState, Card } from "@/lib/types";
import { loadProgress, saveProgress, getCardProgress } from "@/lib/storage";
import { buildOverlays, sumFilledOverlayCents } from "@/lib/overlays";
import bookData from "@/data/cards.json";
import { Book } from "@/lib/types";

const book = bookData as Book;

/**
 * Re-derive saved total + completion for every stored card on load so cards
 * marked complete under the old goal-met rule are corrected (every box rule).
 */
function recalcProgress(state: ProgressState): ProgressState {
  const next: ProgressState = {};
  for (const [cardId, cp] of Object.entries(state)) {
    const card = book.cards.find((c) => c.id === cardId);
    if (!card) {
      next[cardId] = cp;
      continue;
    }
    const overlays = buildOverlays(card, cp.amountOverrides);
    next[cardId] = {
      ...cp,
      savedCents: sumFilledOverlayCents(overlays, cp.filledCells),
      isComplete:
        overlays.length > 0 && overlays.every((o) => cp.filledCells.has(o.id)),
    };
  }
  return next;
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(() =>
    recalcProgress(loadProgress())
  );
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Persist the corrected completion state right away.
      if (typeof window !== "undefined" && Object.keys(progress).length > 0) {
        saveProgress(progress);
      }
      return;
    }
    saveProgress(progress);
  }, [progress]);

  const toggleCell = (cardId: string, cellId: string, card: Card) => {
    setProgress((prev) => {
      const cardProgress = getCardProgress(prev, cardId);
      const newFilledCells = new Set(cardProgress.filledCells);
      const overlays = buildOverlays(card, cardProgress.amountOverrides);
      const overlay = overlays.find((o) => o.id === cellId);
      if (!overlay) return prev;

      if (newFilledCells.has(cellId)) {
        newFilledCells.delete(cellId);
      } else {
        newFilledCells.add(cellId);
      }

      const newSavedCents = sumFilledOverlayCents(overlays, newFilledCells);
      const allFilled = overlays.every((o) => newFilledCells.has(o.id));

      return {
        ...prev,
        [cardId]: {
          ...cardProgress,
          filledCells: newFilledCells,
          savedCents: newSavedCents,
          // Complete only when every printed box is filled (goal-met no longer counts).
          isComplete: allFilled,
        },
      };
    });
  };

  const setOverlayAmount = (
    cardId: string,
    overlayId: string,
    amountCents: number,
    card: Card
  ) => {
    const safe = Math.max(0, Math.round(amountCents));
    setProgress((prev) => {
      const cardProgress = getCardProgress(prev, cardId);
      const amountOverrides = {
        ...(cardProgress.amountOverrides || {}),
        [overlayId]: safe,
      };
      const overlays = buildOverlays(card, amountOverrides);
      const newSavedCents = sumFilledOverlayCents(
        overlays,
        cardProgress.filledCells
      );
      const allFilled = overlays.every((o) =>
        cardProgress.filledCells.has(o.id)
      );

      return {
        ...prev,
        [cardId]: {
          ...cardProgress,
          amountOverrides,
          savedCents: newSavedCents,
          // Complete only when every printed box is filled (goal-met no longer counts).
          isComplete: allFilled,
        },
      };
    });
  };

  return { progress, toggleCell, setOverlayAmount };
}
