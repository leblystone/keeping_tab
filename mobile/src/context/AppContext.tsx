import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as Haptics from "expo-haptics";
import { Card } from "../lib/types";
import { ProgressState } from "../lib/types";
import {
  exportProgressJson,
  getCardProgress,
  loadFavorites,
  loadOnboardingDone,
  loadProgress,
  loadReminderEnabled,
  loadUnlocks,
  saveFavorites,
  saveOnboardingDone,
  saveProgress,
  saveReminderEnabled,
  saveUnlocks,
} from "../lib/storage";
import { buildOverlays, sumFilledOverlayCents } from "../lib/overlays";

type UndoAction =
  | {
      type: "toggle";
      cardId: string;
      cellId: string;
      card: Card;
      prevFilled: boolean;
    }
  | {
      type: "amount";
      cardId: string;
      overlayId: string;
      card: Card;
      prevCents: number;
    };

type AppContextValue = {
  ready: boolean;
  progress: ProgressState;
  favorites: Set<string>;
  unlocks: Set<string>;
  onboardingDone: boolean;
  reminderEnabled: boolean;
  canUndo: boolean;
  toggleCell: (cardId: string, cellId: string, card: Card) => void;
  setOverlayAmount: (
    cardId: string,
    overlayId: string,
    amountCents: number,
    card: Card
  ) => void;
  toggleFavorite: (cardId: string) => void;
  unlockBundle: (bundleId: string) => void;
  isBundleUnlocked: (bundleId: string, tier: "free" | "paid") => boolean;
  completeOnboarding: () => void;
  setReminderEnabled: (on: boolean) => void;
  undo: () => void;
  exportProgress: () => string;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState<ProgressState>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [unlocks, setUnlocks] = useState<Set<string>>(new Set());
  const [onboardingDone, setOnboardingDone] = useState(true);
  const [reminderEnabled, setReminderEnabledState] = useState(false);
  const undoStack = useRef<UndoAction[]>([]);
  const [, bumpUndo] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [p, f, u, onboard, rem] = await Promise.all([
        loadProgress(),
        loadFavorites(),
        loadUnlocks(),
        loadOnboardingDone(),
        loadReminderEnabled(),
      ]);
      if (cancelled) return;
      setProgress(p);
      setFavorites(f);
      setUnlocks(u);
      setOnboardingDone(onboard);
      setReminderEnabledState(rem);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    void saveProgress(progress);
  }, [progress, ready]);

  const pushUndo = (action: UndoAction) => {
    undoStack.current = [...undoStack.current.slice(-19), action];
    bumpUndo((n) => n + 1);
  };

  const toggleCell = useCallback((cardId: string, cellId: string, card: Card) => {
    setProgress((prev) => {
      const cardProgress = getCardProgress(prev, cardId);
      const newFilledCells = new Set(cardProgress.filledCells);
      const overlays = buildOverlays(card, cardProgress.amountOverrides);
      const overlay = overlays.find((o) => o.id === cellId);
      if (!overlay) return prev;

      const wasFilled = newFilledCells.has(cellId);
      pushUndo({
        type: "toggle",
        cardId,
        cellId,
        card,
        prevFilled: wasFilled,
      });

      if (wasFilled) newFilledCells.delete(cellId);
      else newFilledCells.add(cellId);

      const newSavedCents = sumFilledOverlayCents(overlays, newFilledCells);
      const allFilled = overlays.every((o) => newFilledCells.has(o.id));
      const goalMet = newSavedCents >= card.goalCents;
      const becameComplete =
        (allFilled || goalMet) && !cardProgress.isComplete;

      if (becameComplete) {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      return {
        ...prev,
        [cardId]: {
          ...cardProgress,
          filledCells: newFilledCells,
          savedCents: newSavedCents,
          isComplete: allFilled || goalMet,
          lastTouchedAt: Date.now(),
        },
      };
    });
  }, []);

  const setOverlayAmount = useCallback(
    (cardId: string, overlayId: string, amountCents: number, card: Card) => {
      const safe = Math.max(0, Math.round(amountCents));
      setProgress((prev) => {
        const cardProgress = getCardProgress(prev, cardId);
        const prevCents =
          cardProgress.amountOverrides?.[overlayId] ??
          card.cells.find((c) => c.id === overlayId)?.amountCents ??
          0;
        pushUndo({
          type: "amount",
          cardId,
          overlayId,
          card,
          prevCents,
        });
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
            lastTouchedAt: Date.now(),
          },
        };
      });
      void Haptics.selectionAsync();
    },
    []
  );

  const undo = useCallback(() => {
    const action = undoStack.current.pop();
    bumpUndo((n) => n + 1);
    if (!action) return;
    if (action.type === "toggle") {
      setProgress((prev) => {
        const cardProgress = getCardProgress(prev, action.cardId);
        const filled = new Set(cardProgress.filledCells);
        if (action.prevFilled) filled.add(action.cellId);
        else filled.delete(action.cellId);
        const overlays = buildOverlays(action.card, cardProgress.amountOverrides);
        const savedCents = sumFilledOverlayCents(overlays, filled);
        const allFilled = overlays.every((o) => filled.has(o.id));
        const goalMet = savedCents >= action.card.goalCents;
        return {
          ...prev,
          [action.cardId]: {
            ...cardProgress,
            filledCells: filled,
            savedCents,
            isComplete: allFilled || goalMet,
            lastTouchedAt: Date.now(),
          },
        };
      });
    } else {
      setOverlayAmount(
        action.cardId,
        action.overlayId,
        action.prevCents,
        action.card
      );
      // remove the undo entry created by setOverlayAmount
      undoStack.current.pop();
      bumpUndo((n) => n + 1);
    }
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [setOverlayAmount]);

  const toggleFavorite = useCallback((cardId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      void saveFavorites(next);
      return next;
    });
    void Haptics.selectionAsync();
  }, []);

  const unlockBundle = useCallback((bundleId: string) => {
    setUnlocks((prev) => {
      const next = new Set(prev);
      next.add(bundleId);
      void saveUnlocks(next);
      return next;
    });
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const isBundleUnlocked = useCallback(
    (bundleId: string, tier: "free" | "paid") => {
      if (tier === "free") return true;
      return unlocks.has(bundleId);
    },
    [unlocks]
  );

  const completeOnboarding = useCallback(() => {
    setOnboardingDone(true);
    void saveOnboardingDone();
  }, []);

  const setReminderEnabled = useCallback((on: boolean) => {
    setReminderEnabledState(on);
    void saveReminderEnabled(on);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      ready,
      progress,
      favorites,
      unlocks,
      onboardingDone,
      reminderEnabled,
      canUndo: undoStack.current.length > 0,
      toggleCell,
      setOverlayAmount,
      toggleFavorite,
      unlockBundle,
      isBundleUnlocked,
      completeOnboarding,
      setReminderEnabled,
      undo,
      exportProgress: () => exportProgressJson(progress),
    }),
    [
      ready,
      progress,
      favorites,
      unlocks,
      onboardingDone,
      reminderEnabled,
      toggleCell,
      setOverlayAmount,
      toggleFavorite,
      unlockBundle,
      isBundleUnlocked,
      completeOnboarding,
      setReminderEnabled,
      undo,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
