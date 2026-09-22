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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50/60 to-stone-100">
      <main className="max-w-md mx-auto px-4 pt-10 pb-16">
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-amber-700/80 mb-2">
            Keeping Tab
          </p>
          <h1 className="text-4xl font-bold text-stone-800 tracking-tight">
            {book.title}
          </h1>
          <p className="text-stone-600 mt-2 text-sm">
            Browse free packs or unlock unique paid sets — then open a card and
            tap live $ overlays.
          </p>
        </div>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-700">
              Free packs
            </h2>
            <span className="text-xs text-stone-500">{free.length} packs</span>
          </div>
          <div className="space-y-3">
            {free.map((b) => (
              <BundleTile key={b.id} bundle={b} />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-violet-700">
              Paid packs
            </h2>
            <span className="text-xs text-stone-500">
              {paid.length} unique · {unlocked ? "unlocked" : "preview lock"}
            </span>
          </div>

          {!unlocked && (
            <div className="mb-3 rounded-2xl border border-violet-200 bg-violet-50 p-4">
              <p className="text-sm text-violet-900 font-medium mb-2">
                Paid packs are the more unique sets.
              </p>
              <p className="text-xs text-violet-700 mb-3">
                Soft lock for testing — tap unlock to browse every card now.
              </p>
              <button
                type="button"
                onClick={unlock}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl active:scale-[0.98] transition-all"
              >
                Unlock paid packs (test)
              </button>
            </div>
          )}

          {unlocked && (
            <button
              type="button"
              onClick={lock}
              className="mb-3 w-full text-xs text-violet-600 underline"
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

        <div className="rounded-2xl bg-white/80 border border-stone-200 p-4 text-center">
          <p className="text-xs text-stone-500 mb-2">
            {book.cards.length} challenges in book · {BUNDLES.length} packs
          </p>
          <Link
            href="/cards"
            className="inline-block text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            Browse all cards →
          </Link>
        </div>
      </main>
    </div>
  );
}
