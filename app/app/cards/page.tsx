"use client";

import Link from "next/link";
import { Book } from "@/lib/types";
import { useProgress } from "@/hooks/useProgress";
import { getCardProgress } from "@/lib/storage";
import { formatCurrency } from "@/lib/format";
import bookData from "@/data/cards.json";

const book = bookData as Book;

export default function CardsPage() {
  const { progress, isLoaded } = useProgress();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 transition-colors"
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
          <h1 className="text-xl font-semibold text-gray-800 flex-1">
            Savings Challenges
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-3">
          {book.cards.map((card) => {
            const cardProgress = getCardProgress(progress, card.id);
            const progressPercent = (cardProgress.savedCents / card.goalCents) * 100;

            return (
              <Link
                key={card.id}
                href={`/cards/${card.id}`}
                className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-5 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-gray-800 truncate">
                      {card.title}
                    </h2>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Goal: {formatCurrency(card.goalCents)}
                    </p>
                  </div>
                  {cardProgress.isComplete && (
                    <div className="ml-3 flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
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
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-gray-600">Saved:</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(cardProgress.savedCents)}
                    </span>
                  </div>

                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                        cardProgress.isComplete
                          ? "bg-green-500"
                          : "bg-gradient-to-r from-amber-400 to-orange-500"
                      }`}
                      style={{ width: `${Math.min(progressPercent, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {cardProgress.filledCells.size} of {card.cells.length} cells
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
