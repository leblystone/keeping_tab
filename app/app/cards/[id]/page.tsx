"use client";

import Link from "next/link";
import { Suspense, use, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Book } from "@/lib/types";
import { useProgress } from "@/hooks/useProgress";
import { getCardProgress } from "@/lib/storage";
import { formatCurrency } from "@/lib/format";
import { OverlayCardCanvas } from "@/components/OverlayCardCanvas";
import { buildOverlays, sumOverlayCents } from "@/lib/overlays";
import { getBundle } from "@/lib/bundles";
import bookData from "@/data/cards.json";

const book = bookData as Book;

type PageProps = {
  params: Promise<{ id: string }>;
};

function CardDetailInner({ params }: PageProps) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const fromBundle = searchParams.get("from");
  const bundle = fromBundle ? getBundle(fromBundle) : undefined;

  const { progress, toggleCell, setOverlayAmount } = useProgress();
  const card = book.cards.find((c) => c.id === resolvedParams.id);

  const backHref = bundle ? `/bundles/${bundle.id}` : "/cards";
  const backLabel = bundle ? bundle.name : "Cards";

  const cardProgress = card ? getCardProgress(progress, card.id) : null;

  const overlays = useMemo(() => {
    if (!card || !cardProgress) return [];
    return buildOverlays(card, cardProgress.amountOverrides);
  }, [card, cardProgress]);

  if (!card || !cardProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-ktab-brown mb-4">Card not found</p>
          <Link href="/cards" className="text-ktab-burgundy font-medium">
            Back to Cards
          </Link>
        </div>
      </div>
    );
  }

  const progressPercent = (cardProgress.savedCents / card.goalCents) * 100;
  const overlaySum = sumOverlayCents(overlays);
  const flagged = card.qaFlags?.includes("cell_sum_mismatch");
  const edited =
    Boolean(cardProgress.amountOverrides) &&
    Object.keys(cardProgress.amountOverrides || {}).length > 0;
  const showMismatchNote =
    flagged || (edited && Math.abs(overlaySum - card.goalCents) > 0);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-border bg-surface-raised/95">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href={backHref}
            className="text-ktab-taupe hover:text-ktab-burgundy transition-colors p-1"
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
            <p className="text-[10px] uppercase tracking-wider text-ktab-taupe font-bold truncate">
              {backLabel}
            </p>
            <h1 className="h-display text-lg font-semibold text-ktab-burgundy truncate">
              {card.title}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-5 pb-24">
        <div className="kt-book-shell rounded-xl p-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-ktab-taupe">Printed goal</p>
              <p className="text-xl font-bold text-ktab-ink">
                {formatCurrency(card.goalCents)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-ktab-taupe">Saved (overlays)</p>
              <p className="text-xl font-bold text-ktab-burgundy">
                {formatCurrency(cardProgress.savedCents)}
              </p>
            </div>
          </div>

          <div className="relative h-2.5 kt-progress-track rounded-full overflow-hidden mb-2">
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                cardProgress.isComplete
                  ? "kt-progress-fill-done"
                  : "kt-progress-fill"
              }`}
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-ktab-taupe">
            <span>
              {cardProgress.filledCells.size} of {overlays.length} filled
            </span>
            <span>{Math.round(progressPercent)}%</span>
          </div>

          {cardProgress.isComplete && (
            <div className="mt-3 bg-success-soft border border-ktab-sage/30 rounded-lg p-3">
              <span className="text-sm font-medium text-ktab-sage">
                Challenge completed!
              </span>
            </div>
          )}

          {showMismatchNote && (
            <div className="mt-3 bg-accent-soft border border-ktab-burgundy/20 rounded-lg p-3">
              <p className="text-xs text-ktab-brown leading-relaxed">
                Overlay amounts sum to {formatCurrency(overlaySum)}; printed
                goal is {formatCurrency(card.goalCents)}. Edit overlays to
                match — printed goal stays primary.
              </p>
            </div>
          )}
        </div>

        <OverlayCardCanvas
          card={card}
          filledIds={cardProgress.filledCells}
          amountOverrides={cardProgress.amountOverrides}
          onToggle={(overlayId) => toggleCell(card.id, overlayId, card)}
          onAmountChange={(overlayId, cents) =>
            setOverlayAmount(card.id, overlayId, cents, card)
          }
        />
      </main>
    </div>
  );
}

export default function CardDetailPage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-ktab-taupe text-sm">
          Loading card…
        </div>
      }
    >
      <CardDetailInner {...props} />
    </Suspense>
  );
}
