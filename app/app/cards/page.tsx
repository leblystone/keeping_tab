"use client";

import Link from "next/link";
import { Suspense } from "react";
import { Book } from "@/lib/types";
import { useProgress } from "@/hooks/useProgress";
import { getCardProgress } from "@/lib/storage";
import { formatCurrency } from "@/lib/format";
import { getCardBackground } from "@/lib/overlays";
import bookData from "@/data/cards.json";

const book = bookData as Book;

function CardsList() {
  const { progress } = useProgress();

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="text-stone-600 hover:text-stone-900 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-xl font-semibold text-stone-800 flex-1">
            All Challenges
          </h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <p className="text-xs text-stone-500 mb-4 px-1">
          Prefer packs?{" "}
          <Link href="/" className="text-orange-600 font-medium">
            Free vs Paid on home
          </Link>
        </p>
        <div className="space-y-3">
          {book.cards.map((card) => {
            const cardProgress = getCardProgress(progress, card.id);
            const progressPercent =
              (cardProgress.savedCents / card.goalCents) * 100;
            const bg = getCardBackground(card.id);

            return (
              <Link
                key={card.id}
                href={`/cards/${card.id}`}
                className="flex gap-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-stone-100 overflow-hidden active:scale-[0.99]"
              >
                <div className="w-14 flex-shrink-0 relative bg-stone-100 min-h-[4.5rem]">
                  {bg ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={bg}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-orange-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0 py-3 pr-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-semibold text-stone-800 truncate">
                        {card.title}
                      </h2>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Goal: {formatCurrency(card.goalCents)}
                      </p>
                    </div>
                    {cardProgress.isComplete && (
                      <div className="ml-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-white"
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

                  <div className="relative h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full ${
                        cardProgress.isComplete
                          ? "bg-green-500"
                          : "bg-gradient-to-r from-amber-400 to-orange-500"
                      }`}
                      style={{ width: `${Math.min(progressPercent, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-stone-400 mt-1">
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

export default function CardsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-stone-500">Loading…</div>}>
      <CardsList />
    </Suspense>
  );
}
