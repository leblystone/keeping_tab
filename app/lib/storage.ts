"use client";

import { ProgressState, CardProgress } from "./types";

const STORAGE_KEY = "keeping-tab-progress";
const UNLOCK_KEY = "keeping-tab-paid-unlock";

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};

    const parsed = JSON.parse(stored);
    const result: ProgressState = {};

    for (const [cardId, data] of Object.entries(parsed)) {
      const progressData = data as {
        filledCells: string[];
        savedCents: number;
        isComplete: boolean;
        amountOverrides?: Record<string, number>;
      };
      result[cardId] = {
        filledCells: new Set(progressData.filledCells),
        savedCents: progressData.savedCents,
        isComplete: progressData.isComplete,
        amountOverrides: progressData.amountOverrides,
      };
    }

    return result;
  } catch (error) {
    console.error("Failed to load progress:", error);
    return {};
  }
}

export function saveProgress(progress: ProgressState): void {
  if (typeof window === "undefined") return;

  try {
    const serializable: Record<
      string,
      {
        filledCells: string[];
        savedCents: number;
        isComplete: boolean;
        amountOverrides?: Record<string, number>;
      }
    > = {};

    for (const [cardId, data] of Object.entries(progress)) {
      serializable[cardId] = {
        filledCells: Array.from(data.filledCells),
        savedCents: data.savedCents,
        isComplete: data.isComplete,
        amountOverrides: data.amountOverrides,
      };
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  } catch (error) {
    console.error("Failed to save progress:", error);
  }
}

export function getCardProgress(
  progress: ProgressState,
  cardId: string
): CardProgress {
  return (
    progress[cardId] || {
      filledCells: new Set(),
      savedCents: 0,
      isComplete: false,
    }
  );
}

export function loadPaidUnlock(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(UNLOCK_KEY) === "1";
  } catch {
    return false;
  }
}

export function savePaidUnlock(unlocked: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (unlocked) localStorage.setItem(UNLOCK_KEY, "1");
    else localStorage.removeItem(UNLOCK_KEY);
  } catch (error) {
    console.error("Failed to save unlock:", error);
  }
}
