"use client";

import Link from "next/link";
import { Book } from "@/lib/types";
import { BUNDLES, bundlesByTier } from "@/lib/bundles";
import { BundleTile } from "@/components/BundleTile";
import { usePaidUnlock } from "@/hooks/usePaidUnlock";
import bookData from "@/data/cards.json";

const book = bookData as Book;

export default function LibraryPage() {
  const { unlocked, unlock, lock } = usePaidUnlock();
  const free = bundlesByTier("free");
  const paid = bundlesByTier("paid");

  return (
    <div className="min-h-screen">
      <main className="max-w-md mx-auto px-4 pt-10 pb-16">
        <header className="mb-10 text-center">
          <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-ktab-dusty-rose/80 mb-3">
            Keeping Tab
          </p>
          <h1 className="h-display text-[2.35rem] leading-tight font-semibold text-ktab-cream tracking-tight">
            {book.title}
          </h1>
          <p className="mt-3 text-sm text-ktab-dusty-rose max-w-[20rem] mx-auto leading-relaxed">
            Open a pack, pick a card, tap the live $ overlays — same book, now
            trackable.
          </p>
        </header>

        <section className="mb-9">
          <div className="flex items-baseline justify-between mb-3 px-0.5">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-ktab-cream/70">
              Free packs
            </h2>
            <span className="text-xs text-ktab-dusty-rose/80">{free.length} packs</span>
          </div>
          <div className="space-y-3">
            {free.map((b) => (
              <BundleTile key={b.id} bundle={b} />
            ))}
          </div>
        </section>

        <section className="mb-9">
          <div className="flex items-baseline justify-between mb-3 px-0.5">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-ktab-cream">
              Paid packs
            </h2>
            <span className="text-xs text-ktab-dusty-rose/80">
              {paid.length} unique · {unlocked ? "unlocked" : "preview lock"}
            </span>
          </div>

          {!unlocked && (
            <div className="mb-3 kt-book-shell rounded-xl p-4">
              <p className="text-sm text-ktab-cream font-medium mb-1">
                Paid packs are the more unique sets.
              </p>
              <p className="text-xs text-ktab-dusty-rose mb-3 leading-relaxed">
                Soft lock for testing — unlock to browse every card now.
              </p>
              <button
                type="button"
                onClick={unlock}
                className="w-full bg-ktab-cream/90 hover:bg-ktab-cream text-ktab-burgundy font-semibold py-3 rounded-lg active:scale-[0.98] transition-all"
              >
                Unlock paid packs (test)
              </button>
            </div>
          )}

          {unlocked && (
            <button
              type="button"
              onClick={lock}
              className="mb-3 w-full text-xs text-ktab-dusty-rose/80 underline underline-offset-2"
            >
              Relock paid packs
            </button>
          )}

          <div className="space-y-3">
            {paid.map((b) => (
              <BundleTile key={b.id} bundle={b} locked={!unlocked} />
            ))}
          </div>
        </section>

        <div className="kt-book-shell rounded-xl p-4 text-center">
          <p className="text-xs text-ktab-dusty-rose/80 mb-2">
            {book.cards.length} challenges in book · {BUNDLES.length} packs
          </p>
          <Link
            href="/cards"
            className="inline-block text-sm font-semibold text-ktab-cream hover:text-ktab-dusty-rose"
          >
            Browse all cards →
          </Link>
        </div>
      </main>
    </div>
  );
}
