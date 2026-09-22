"use client";

import Link from "next/link";
import { use } from "react";
import { Book } from "@/lib/types";
import {
  accentClasses,
  cardsForBundle,
  getBundle,
} from "@/lib/bundles";
import { useProgress } from "@/hooks/useProgress";
import { usePaidUnlock } from "@/hooks/usePaidUnlock";
import { getCardProgress } from "@/lib/storage";
import { formatCurrency } from "@/lib/format";
import { getCardBackground } from "@/lib/overlays";
import bookData from "@/data/cards.json";

const book = bookData as Book;

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function BundleDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const bundle = getBundle(id);
  const { progress } = useProgress();
  const { unlocked, unlock } = usePaidUnlock();

  if (!bundle) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-ktab-brown mb-4">Pack not found</p>
          <Link href="/" className="text-ktab-burgundy font-medium">
            Back home
          </Link>
        </div>
      </div>
    );
  }

  const accent = accentClasses(bundle.accent);
  const cards = cardsForBundle(book, bundle);
  const isLocked = bundle.tier === "paid" && !unlocked;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-border bg-surface-raised/95">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-ktab-taupe hover:text-ktab-burgundy p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ktab-taupe">
              {bundle.tier} pack
            </p>
            <h1 className="h-display text-lg font-semibold text-ktab-burgundy truncate">
              {bundle.name}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 pb-16">
        <div className={`rounded-xl border p-5 mb-6 ${accent.soft}`}>
          <p className={`text-sm ${accent.text}`}>{bundle.tagline}</p>
          <p className="text-xs text-ktab-taupe mt-2">
            {cards.length} cards · tap any to open overlays
          </p>
        </div>

        {isLocked && (
          <div className="mb-6 kt-book-shell rounded-xl p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-ktab-burgundy text-ktab-cream flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 8V6a5 5 0 0110 0v2h1a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1h1zm2-2a3 3 0 016 0v2H7V6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="font-semibold text-ktab-burgundy mb-1">Paid pack</p>
            <p className="text-xs text-ktab-brown mb-4">
              Unique set — unlock for testing to open every card.
            </p>
            <button
              type="button"
              onClick={unlock}
              className="w-full bg-ktab-burgundy text-ktab-cream font-semibold py-3 rounded-lg active:scale-[0.98]"
            >
              Unlock & browse
            </button>
          </div>
        )}

        <div className="space-y-3">
          {cards.map((card) => {
            const cardProgress = getCardProgress(progress, card.id);
            const pct = (cardProgress.savedCents / card.goalCents) * 100;
            const bg = getCardBackground(card.id);
            const href = isLocked ? "#" : `/cards/${card.id}?from=${bundle.id}`;

            const inner = (
              <div
                className={`flex gap-3 items-stretch kt-book-shell rounded-xl overflow-hidden ${
                  isLocked ? "opacity-60" : "active:scale-[0.99]"
                } transition-all`}
              >
                <div
                  className="w-16 flex-shrink-0 bg-ktab-nude relative"
                  style={{ minHeight: 72 }}
                >
                  {bg ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={bg}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`absolute inset-0 ${accent.solid}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0 py-3 pr-3">
                  <h2 className="font-semibold text-ktab-ink truncate">
                    {card.title}
                  </h2>
                  <p className="text-xs text-ktab-taupe mt-0.5">
                    Goal {formatCurrency(card.goalCents)} ·{" "}
                    {card.cells.length} overlays
                  </p>
                  <div className="mt-2 h-1.5 kt-progress-track rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        cardProgress.isComplete
                          ? "kt-progress-fill-done"
                          : "kt-progress-fill"
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );

            if (isLocked) {
              return (
                <div key={card.id} onClick={unlock} role="button" tabIndex={0}>
                  {inner}
                </div>
              );
            }

            return (
              <Link key={card.id} href={href}>
                {inner}
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
