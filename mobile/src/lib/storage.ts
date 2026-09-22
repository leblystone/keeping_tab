import AsyncStorage from "@react-native-async-storage/async-storage";
import { CardProgress, ProgressState } from "./types";

const PROGRESS_KEY = "keeping-tab-progress";
const UNLOCKS_KEY = "keeping-tab-paid-unlocks";
const FAVORITES_KEY = "keeping-tab-favorites";
const ONBOARDING_KEY = "keeping-tab-onboarding-done";
const REMINDER_KEY = "keeping-tab-reminder";

type SerializedProgress = Record<
  string,
  {
    filledCells: string[];
    savedCents: number;
    isComplete: boolean;
    amountOverrides?: Record<string, number>;
    lastTouchedAt?: number;
  }
>;

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

export async function loadProgress(): Promise<ProgressState> {
  try {
    const stored = await AsyncStorage.getItem(PROGRESS_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored) as SerializedProgress;
    const result: ProgressState = {};
    for (const [cardId, data] of Object.entries(parsed)) {
      result[cardId] = {
        filledCells: new Set(data.filledCells || []),
        savedCents: data.savedCents || 0,
        isComplete: Boolean(data.isComplete),
        amountOverrides: data.amountOverrides,
        lastTouchedAt: data.lastTouchedAt,
      };
    }
    return result;
  } catch {
    return {};
  }
}

export async function saveProgress(progress: ProgressState): Promise<void> {
  try {
    const serializable: SerializedProgress = {};
    for (const [cardId, data] of Object.entries(progress)) {
      serializable[cardId] = {
        filledCells: Array.from(data.filledCells),
        savedCents: data.savedCents,
        isComplete: data.isComplete,
        amountOverrides: data.amountOverrides,
        lastTouchedAt: data.lastTouchedAt,
      };
    }
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(serializable));
  } catch (e) {
    console.warn("Failed to save progress", e);
  }
}

/** Per-pack unlocks (replaces single global flag). */
export async function loadUnlocks(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(UNLOCKS_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

export async function saveUnlocks(ids: Set<string>): Promise<void> {
  try {
    await AsyncStorage.setItem(UNLOCKS_KEY, JSON.stringify([...ids]));
  } catch (e) {
    console.warn("Failed to save unlocks", e);
  }
}

export async function loadFavorites(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

export async function saveFavorites(ids: Set<string>): Promise<void> {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify([...ids]));
  } catch (e) {
    console.warn("Failed to save favorites", e);
  }
}

export async function loadOnboardingDone(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(ONBOARDING_KEY)) === "1";
  } catch {
    return false;
  }
}

export async function saveOnboardingDone(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, "1");
}

export async function loadReminderEnabled(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(REMINDER_KEY)) === "1";
  } catch {
    return false;
  }
}

export async function saveReminderEnabled(on: boolean): Promise<void> {
  if (on) await AsyncStorage.setItem(REMINDER_KEY, "1");
  else await AsyncStorage.removeItem(REMINDER_KEY);
}

export function exportProgressJson(progress: ProgressState): string {
  const serializable: SerializedProgress = {};
  for (const [cardId, data] of Object.entries(progress)) {
    serializable[cardId] = {
      filledCells: Array.from(data.filledCells),
      savedCents: data.savedCents,
      isComplete: data.isComplete,
      amountOverrides: data.amountOverrides,
      lastTouchedAt: data.lastTouchedAt,
    };
  }
  return JSON.stringify(
    { exportedAt: new Date().toISOString(), progress: serializable },
    null,
    2
  );
}
