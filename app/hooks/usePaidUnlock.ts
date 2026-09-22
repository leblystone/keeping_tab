"use client";

import { useState } from "react";
import { loadPaidUnlock, savePaidUnlock } from "@/lib/storage";

export function usePaidUnlock() {
  const [unlocked, setUnlocked] = useState(() => loadPaidUnlock());

  const unlock = () => {
    savePaidUnlock(true);
    setUnlocked(true);
  };

  const lock = () => {
    savePaidUnlock(false);
    setUnlocked(false);
  };

  return { unlocked, ready: true, unlock, lock };
}
