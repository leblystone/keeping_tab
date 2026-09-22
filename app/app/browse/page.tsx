"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { Book } from "@/lib/types";
import { useProgress } from "@/hooks/useProgress";
import { useFavorites } from "@/hooks/useFavorites";
import { getCardProgress } from "@/lib/storage";
import { formatCurrency } from "@/lib/format";
import { getCardBackground } from "@/lib/overlays";
import bookData from "@/data/cards.json";

const book = bookData as Book;

type Status = "all" | "in_progress" | "complete" | "not_started" | "favorites";

function BrowseList() {
  const { progress } = useProgress();
  const { favorites, isFavorite } = useFavorites();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return book.cards.filter((card) => {
      if (
        q &&
        !card.title.toLowerCase().includes(q) &&
        !card.theme.toLowerCase().includes(q)
      ) {
        return false;
      }
      const cp = getCardProgress(progress, card.id);
      if (status === "favorites") return isFavorite(card.id);
      if (status === "complete") return cp.isComplete;
      if (status === "in_progress")
        return !cp.isComplete && (cp.savedCents > 0 || cp.filledCells.size > 0);
      if (status === "not_started")
        return !cp.isComplete && cp.savedCents === 0 && cp.filledCells.size === 0;
      return true;
    });
  }, [progress, query, status, favorites, isFavorite]);

  const chips: { id: Status; label: string }[] = [
    { id: "all", label: "All" },
    { id: "in_progress", label: "Active" },
    { id: "complete", label: "Done" },
    { id: "not_started", label: "New" },
    { id: "favorites", label: "★" },
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 kt-header-glass">
        <div className="max-w-md mx-auto px-4 pt-6 pb-3">
          <h1 className="h-display text-[1.75rem] font-semibold text-ktab-cream">
            Browse
          </h1>
          <p className="text-sm text-ktab-dusty-rose mt-1">
            All {book.cards.length} cards
          </p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-3 pb-28">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cards…"
          className="w-full mb-3 rounded-xl px-4 py-3 text-sm text-ktab-cream placeholder:text-ktab-taupe bg-ktab-cream/10 border border-ktab-cream/20 outline-none focus:border-ktab-cream/40"
        />

        <div className="flex flex-wrap gap-2 mb-4">
          {chips.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setStatus(c.id)}
              className={`px-3 py-2 min-h-9 rounded-full text-xs font-bold transition-colors ${
                status === c.id
                  ? "bg-ktab-cream text-ktab-burgundy"
                  : "bg-ktab-cream/10 text-ktab-dusty-rose"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-ktab-dusty-rose/80 mb-3 px-0.5">
          {filtered.length} cards
        </p>

        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="kt-glass rounded-2xl p-5 text-center">
              <p className="font-semibold text-ktab-cream">No matches</p>
              <p className="text-sm text-ktab-dusty-rose mt-2 leading-relaxed">
                Try clearing search or filters — or star favorites from a card
                page.
              </p>
            </div>
          )}

          {filtered.map((card) => {
            const cardProgress = getCardProgress(progress, card.id);
            const progressPercent =
              (cardProgress.savedCents / card.goalCents) * 100;
            const bg = getCardBackground(card.id);
            const starred = isFavorite(card.id);

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
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-semibold text-ktab-cream truncate">
                        {starred ? "★ " : ""}
                        {card.title}
                      </h2>
                      <p className="text-xs text-ktab-dusty-rose/75 mt-0.5">
                        Goal: {formatCurrency(card.goalCents)}
                      </p>
                    </div>
                    {cardProgress.isComplete && (
                      <div className="ml-2 w-7 h-7 bg-ktab-sage rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-ktab-cream"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="relative h-1.5 kt-progress-track rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full ${
                        cardProgress.isComplete
                          ? "kt-progress-fill-done"
                          : "kt-progress-fill"
                      }`}
                      style={{ width: `${Math.min(progressPercent, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-ktab-dusty-rose/75 mt-1">
                    <span>
                      {formatCurrency(cardProgress.savedCents)} saved
                    </span>
                    <span>{Math.round(progressPercent)}%</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-ktab-dusty-rose">Loading…</div>
      }
    >
      <BrowseList />
    </Suspense>
  );
}
