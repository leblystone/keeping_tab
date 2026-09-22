"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
import { Book } from "@/lib/types";
import { useProgress } from "@/hooks/useProgress";
import { useFavorites } from "@/hooks/useFavorites";
import { getCardProgress } from "@/lib/storage";
import { formatCurrency } from "@/lib/format";
import { getCardBackground } from "@/lib/overlays";
import bookData from "@/data/cards.json";

const book = bookData as Book;

function FavoritesList() {
  const { progress } = useProgress();
  const { favorites } = useFavorites();

  const cards = useMemo(
    () => book.cards.filter((c) => favorites.has(c.id)),
    [favorites]
  );

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 kt-header-glass">
        <div className="max-w-md mx-auto px-4 pt-6 pb-3">
          <h1 className="h-display text-[1.75rem] font-semibold text-ktab-cream">
            Favorites
          </h1>
          <p className="text-sm text-ktab-dusty-rose mt-1">
            {cards.length === 0
              ? "Star cards you want handy"
              : `${cards.length} starred`}
          </p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-3 pb-28">
        {cards.length === 0 ? (
          <div className="kt-glass rounded-2xl p-5 text-center">
            <p className="font-semibold text-ktab-cream">No favorites yet</p>
            <p className="text-sm text-ktab-dusty-rose mt-2 leading-relaxed">
              Open any card and tap ★ to pin it here — always one tab away.
            </p>
            <Link
              href="/browse"
              className="mt-4 inline-flex min-h-12 items-center justify-center rounded-xl bg-ktab-cream px-5 font-extrabold text-ktab-burgundy"
            >
              Browse cards
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {cards.map((card) => {
              const cardProgress = getCardProgress(progress, card.id);
              const progressPercent =
                (cardProgress.savedCents / card.goalCents) * 100;
              const bg = getCardBackground(card.id);

              return (
                <Link
                  key={card.id}
                  href={`/cards/${card.id}`}
                  className="flex gap-3 kt-glass rounded-2xl overflow-hidden active:scale-[0.99] transition-all"
                >
                  <div className="w-14 flex-shrink-0 relative bg-ktab-burgundy min-h-[4.5rem]">
                    {bg ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={bg}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-ktab-dusty-rose" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 py-3 pr-4">
                    <h2 className="text-base font-semibold text-ktab-cream truncate">
                      ★ {card.title}
                    </h2>
                    <p className="text-xs text-ktab-dusty-rose/75 mt-0.5">
                      Goal: {formatCurrency(card.goalCents)}
                    </p>
                    <div className="mt-2 relative h-1.5 kt-progress-track rounded-full overflow-hidden">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full ${
                          cardProgress.isComplete
                            ? "kt-progress-fill-done"
                            : "kt-progress-fill"
                        }`}
                        style={{ width: `${Math.min(progressPercent, 100)}%` }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-ktab-dusty-rose">Loading…</div>
      }
    >
      <FavoritesList />
    </Suspense>
  );
}
