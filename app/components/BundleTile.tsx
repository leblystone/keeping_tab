"use client";

import Link from "next/link";
import { Bundle } from "@/lib/types";
import { accentClasses } from "@/lib/bundles";

type Props = {
  bundle: Bundle;
  locked?: boolean;
};

export function BundleTile({ bundle, locked }: Props) {
  const accent = accentClasses(bundle.accent);
  const href = `/bundles/${bundle.id}`;

  return (
    <Link
      href={href}
      className={`block relative overflow-hidden rounded-2xl border p-5 transition-all active:scale-[0.98] hover:shadow-md ${accent.soft}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white ${
                bundle.tier === "paid"
                  ? "bg-violet-600"
                  : "bg-emerald-600"
              }`}
            >
              {bundle.tier}
            </span>
            {locked && (
              <span className="text-[10px] font-semibold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full">
                locked
              </span>
            )}
          </div>
          <h3 className={`text-lg font-bold truncate ${accent.text}`}>
            {bundle.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {bundle.tagline}
          </p>
          <p className="text-xs text-gray-500 mt-3">
            {bundle.cardIds.length} cards · tap to open
          </p>
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex-shrink-0 shadow-sm ${accent.solid} flex items-center justify-center text-white font-bold`}
        >
          {locked ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 8V6a5 5 0 0110 0v2h1a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1h1zm2-2a3 3 0 016 0v2H7V6z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <span className="text-sm">{bundle.cardIds.length}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
