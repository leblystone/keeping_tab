"use client";

import Link from "next/link";
import { use } from "react";
import { Book } from "@/lib/types";
import { useProgress } from "@/hooks/useProgress";
import { getCardProgress } from "@/lib/storage";
import { formatCurrency } from "@/lib/format";
import bookData from "@/data/cards.json";

const book = bookData as Book;

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function CardDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { progress, toggleCell, isLoaded } = useProgress();
  
  const card = book.cards.find((c) => c.id === resolvedParams.id);

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Card not found</p>
          <Link
            href="/cards"
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Back to Cards
          </Link>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const cardProgress = getCardProgress(progress, card.id);
  const progressPercent = (cardProgress.savedCents / card.goalCents) * 100;
  const hasMismatch = card.qaFlags?.includes("cell_sum_mismatch");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/cards"
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
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-800 truncate">
              {card.title}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Goal</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(card.goalCents)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Saved</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(cardProgress.savedCents)}
              </p>
            </div>
          </div>

          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                cardProgress.isComplete
                  ? "bg-green-500"
                  : "bg-gradient-to-r from-amber-400 to-orange-500"
              }`}
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {cardProgress.filledCells.size} of {card.cells.length} cells filled
            </span>
            <span>{Math.round(progressPercent)}%</span>
          </div>

          {cardProgress.isComplete && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium text-green-800">
                Challenge completed!
              </span>
            </div>
          )}

          {hasMismatch && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800">
                Note: Cell amounts sum to {formatCurrency(card.cellsSumCents || 0)}, 
                but the printed goal is {formatCurrency(card.goalCents)}.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Tap cells to save
          </h2>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {card.cells.map((cell) => {
              const isFilled = cardProgress.filledCells.has(cell.id);
              
              return (
                <button
                  key={cell.id}
                  onClick={() => toggleCell(card.id, cell.id, card)}
                  className={`aspect-square rounded-xl border-2 transition-all active:scale-95 ${
                    isFilled
                      ? "bg-gradient-to-br from-amber-400 to-orange-500 border-orange-500 text-white shadow-md"
                      : "bg-white border-gray-300 text-gray-700 hover:border-orange-400 hover:bg-orange-50"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center h-full p-2">
                    {isFilled && (
                      <svg
                        className="w-4 h-4 mb-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <span className={`text-xs font-semibold ${isFilled ? "" : "text-gray-600"}`}>
                      {formatCurrency(cell.amountCents)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
