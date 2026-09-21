"use client";

import Link from "next/link";
import { Book } from "@/lib/types";
import bookData from "@/data/cards.json";

const book = bookData as Book;

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {book.title}
          </h1>
          
          <p className="text-gray-600 mb-2">Version {book.version}</p>
          
          <div className="bg-amber-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-amber-700">{book.cards.length}</span> savings challenges
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Tap cells to track your progress
            </p>
          </div>

          <Link
            href="/cards"
            className="block w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            Start Saving
          </Link>
        </div>
      </div>
    </div>
  );
}
