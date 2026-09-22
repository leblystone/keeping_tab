"use client";

import { useState, useEffect, useRef } from "react";
import { ProgressState, Card } from "@/lib/types";
import { loadProgress, saveProgress, getCardProgress } from "@/lib/storage";
import { buildOverlays, sumFilledOverlayCents } from "@/lib/overlays";

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
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
      const goalMet = newSavedCents >= card.goalCents;

      return {
        ...prev,
        [cardId]: {
          ...cardProgress,
          filledCells: newFilledCells,
          savedCents: newSavedCents,
          isComplete: allFilled || goalMet,
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
      const goalMet = newSavedCents >= card.goalCents;

      return {
        ...prev,
        [cardId]: {
          ...cardProgress,
          amountOverrides,
          savedCents: newSavedCents,
          isComplete: allFilled || goalMet,
        },
      };
    });
  };

  return { progress, toggleCell, setOverlayAmount };
}
