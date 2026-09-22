import { Book, Card, CardProgress, FilterStatus, ProgressState, SortKey } from "./types";
import { getCardProgress } from "./storage";

export function bookStats(book: Book, progress: ProgressState) {
  let savedCents = 0;
  let started = 0;
  let completed = 0;
  for (const card of book.cards) {
    const p = getCardProgress(progress, card.id);
    savedCents += p.savedCents;
    if (p.isComplete) completed += 1;
    else if (p.filledCells.size > 0 || p.savedCents > 0) started += 1;
  }
  return {
    totalCards: book.cards.length,
    savedCents,
    started,
    completed,
    notStarted: book.cards.length - started - completed,
    pctFilled: book.cards.length
      ? Math.round(((started + completed) / book.cards.length) * 100)
      : 0,
  };
}

export function bundleStats(
  cards: Card[],
  progress: ProgressState
): { done: number; started: number; savedCents: number } {
  let done = 0;
  let started = 0;
  let savedCents = 0;
  for (const card of cards) {
    const p = getCardProgress(progress, card.id);
    savedCents += p.savedCents;
    if (p.isComplete) done += 1;
    else if (p.filledCells.size > 0 || p.savedCents > 0) started += 1;
  }
  return { done, started, savedCents };
}

export function filterAndSortCards(
  cards: Card[],
  progress: ProgressState,
  opts: {
    query: string;
    status: FilterStatus;
    sort: SortKey;
    favorites: Set<string>;
    theme?: string;
  }
): Card[] {
  const q = opts.query.trim().toLowerCase();
  let list = cards.filter((c) => {
    if (q) {
      const hay = `${c.title} ${c.theme} ${c.id}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (opts.theme && opts.theme !== "all" && c.theme !== opts.theme) return false;
    const p = getCardProgress(progress, c.id);
    switch (opts.status) {
      case "favorites":
        return opts.favorites.has(c.id);
      case "complete":
        return p.isComplete;
      case "in_progress":
        return !p.isComplete && (p.filledCells.size > 0 || p.savedCents > 0);
      case "not_started":
        return p.filledCells.size === 0 && p.savedCents === 0 && !p.isComplete;
      default:
        return true;
    }
  });

  const score = (c: Card) => {
    const p = getCardProgress(progress, c.id);
    return c.goalCents > 0 ? p.savedCents / c.goalCents : 0;
  };

  list = [...list];
  switch (opts.sort) {
    case "az":
      list.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "goal":
      list.sort((a, b) => a.goalCents - b.goalCents);
      break;
    case "progress":
      list.sort((a, b) => score(b) - score(a));
      break;
    default:
      break;
  }
  return list;
}

export function streakDays(progress: ProgressState): number {
  const days = new Set<string>();
  for (const p of Object.values(progress)) {
    if (!p.lastTouchedAt) continue;
    const d = new Date(p.lastTouchedAt);
    days.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
  }
  if (days.size === 0) return 0;
  // Count consecutive days ending today or yesterday
  let streak = 0;
  const cursor = new Date();
  for (let i = 0; i < 60; i++) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    if (days.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else if (i === 0) {
      // allow starting from yesterday
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function idleNudge(
  progress: ProgressState,
  book: Book
): { cardId: string; title: string; days: number } | null {
  const now = Date.now();
  let best: { cardId: string; title: string; days: number } | null = null;
  for (const card of book.cards) {
    const p = getCardProgress(progress, card.id);
    if (p.isComplete || !p.lastTouchedAt) continue;
    if (p.filledCells.size === 0 && p.savedCents === 0) continue;
    const days = Math.floor((now - p.lastTouchedAt) / (1000 * 60 * 60 * 24));
    if (days < 3) continue;
    if (!best || days > best.days) {
      best = { cardId: card.id, title: card.title, days };
    }
  }
  return best;
}

export function statusLabel(p: CardProgress): "Not started" | "In progress" | "Complete" {
  if (p.isComplete) return "Complete";
  if (p.filledCells.size > 0 || p.savedCents > 0) return "In progress";
  return "Not started";
}
