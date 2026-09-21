"use client";

import { useState, useEffect } from "react";
import { ProgressState, Card } from "@/lib/types";
import { loadProgress, saveProgress, getCardProgress } from "@/lib/storage";

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveProgress(progress);
    }
  }, [progress, isLoaded]);

  const toggleCell = (cardId: string, cellId: string, card: Card) => {
    setProgress((prev) => {
      const cardProgress = getCardProgress(prev, cardId);
      const newFilledCells = new Set(cardProgress.filledCells);
      const cell = card.cells.find((c) => c.id === cellId);
      
      if (!cell) return prev;

      let newSavedCents = cardProgress.savedCents;
      
      if (newFilledCells.has(cellId)) {
        newFilledCells.delete(cellId);
        newSavedCents -= cell.amountCents;
      } else {
        newFilledCells.add(cellId);
        newSavedCents += cell.amountCents;
      }

      const allCellsFilled = card.cells.every((c) => newFilledCells.has(c.id));
      const goalMet = newSavedCents >= card.goalCents;
      const isComplete = allCellsFilled || goalMet;

      return {
        ...prev,
        [cardId]: {
          filledCells: newFilledCells,
          savedCents: newSavedCents,
          isComplete,
        },
      };
    });
  };

  return { progress, toggleCell, isLoaded };
}
