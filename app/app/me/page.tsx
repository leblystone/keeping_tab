"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Book } from "@/lib/types";
import { BUNDLES, bundlesByTier } from "@/lib/bundles";
import { useProgress } from "@/hooks/useProgress";
import { usePaidUnlock } from "@/hooks/usePaidUnlock";
import { useFavorites } from "@/hooks/useFavorites";
import { getCardProgress } from "@/lib/storage";
import { formatCurrency } from "@/lib/format";
import bookData from "@/data/cards.json";

const book = bookData as Book;

export default function MePage() {
  const { progress } = useProgress();
  const { unlocked, unlock, lock } = usePaidUnlock();
  const { favorites } = useFavorites();
  const paid = bundlesByTier("paid");

  const stats = useMemo(() => {
    let savedCents = 0;
    let completed = 0;
    let started = 0;
    for (const card of book.cards) {
      const cp = getCardProgress(progress, card.id);
      savedCents += cp.savedCents;
      if (cp.isComplete) completed += 1;
      else if (cp.savedCents > 0 || cp.filledCells.size > 0) started += 1;
    }
    const totalCards = book.cards.length;
    const pctFilled =
      totalCards === 0 ? 0 : Math.round((completed / totalCards) * 100);
    return { savedCents, completed, started, totalCards, pctFilled };
  }, [progress]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 kt-header-glass">
        <div className="max-w-md mx-auto px-4 pt-6 pb-3">
          <h1 className="h-display text-[1.75rem] font-semibold text-ktab-cream">
            Me
          </h1>
          <p className="text-sm text-ktab-dusty-rose mt-1">
            Progress & unlocks
          </p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-3 pb-28 space-y-4">
        <section className="kt-glass-strong rounded-2xl p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-ktab-dusty-rose">
            Your book
          </p>
          <p className="text-2xl font-extrabold text-ktab-cream mt-1.5">
            {formatCurrency(stats.savedCents)} saved
          </p>
          <p className="text-sm text-ktab-dusty-rose mt-1.5">
            {stats.completed} of {stats.totalCards} done · {stats.started} in
            progress · {favorites.size} favorites
          </p>
          <div className="mt-3 h-2 kt-progress-track rounded-full overflow-hidden">
            <div
              className="h-full kt-progress-fill rounded-full"
              style={{ width: `${Math.min(100, stats.pctFilled)}%` }}
            />
          </div>
        </section>

        <section className="kt-glass rounded-2xl p-5">
          <h2 className="font-bold text-ktab-cream mb-2">Paid packs</h2>
          <p className="text-sm text-ktab-dusty-rose mb-3 leading-relaxed">
            Unlock unique art sets when you&apos;re ready.
          </p>
          {!unlocked ? (
            <button
              type="button"
              onClick={unlock}
              className="w-full min-h-12 rounded-xl bg-ktab-cream/90 text-ktab-burgundy font-semibold active:scale-[0.98] transition-all"
            >
              Unlock paid packs (test)
            </button>
          ) : (
            <button
              type="button"
              onClick={lock}
              className="text-xs text-ktab-dusty-rose underline underline-offset-2 mb-2"
            >
              Relock paid packs
            </button>
          )}
          <ul className="mt-3 divide-y divide-ktab-cream/15">
            {paid.map((b) => (
              <li
                key={b.id}
                className="py-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-bold text-sm text-ktab-cream truncate">
                    {b.name}
                  </p>
                  <p className="text-xs text-ktab-dusty-rose mt-0.5">
                    {b.priceLabel || "Paid"} · {b.cardIds.length} cards
                    {unlocked ? " · unlocked" : ""}
                  </p>
                </div>
                <Link
                  href={`/bundles/${b.id}`}
                  className="shrink-0 min-h-10 px-3 rounded-lg border border-ktab-cream/25 text-xs font-bold text-ktab-cream flex items-center"
                >
                  Open
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="text-center text-xs text-ktab-dusty-rose/80 pt-2">
          {book.cards.length} challenges · {BUNDLES.length} packs
        </p>
      </main>
    </div>
  );
}
