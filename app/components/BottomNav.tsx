"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/",
    label: "Home",
    match: (path: string) => path === "/",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 3.2 3.5 10.2a1 1 0 0 0-.3.7V20a1 1 0 0 0 1 1h5.2v-5.5h5.2V21H19a1 1 0 0 0 1-1v-9.1a1 1 0 0 0-.3-.7L12 3.2z" />
      </svg>
    ),
  },
  {
    href: "/browse",
    label: "Browse",
    match: (path: string) =>
      path.startsWith("/browse") || path.startsWith("/cards"),
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="m20 20-3.5-3.5" />
      </svg>
    ),
  },
  {
    href: "/favorites",
    label: "Favorites",
    match: (path: string) => path.startsWith("/favorites"),
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 17.3 6.2 20.5l1.1-6.5L2.5 9.4l6.6-1L12 2.5l2.9 5.9 6.6 1-4.8 4.6 1.1 6.5L12 17.3z" />
      </svg>
    ),
  },
  {
    href: "/me",
    label: "Me",
    match: (path: string) => path.startsWith("/me"),
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12zm0 2.2c-4 0-7.5 2-7.5 4.5V21h15v-2.3c0-2.5-3.5-4.5-7.5-4.5z" />
      </svg>
    ),
  },
] as const;

/** Sticky glass-on-burgundy product tabs — always reachable. */
export function BottomNav() {
  const pathname = usePathname() || "/";

  return (
    <nav aria-label="Main" className="kt-bottom-nav fixed bottom-0 inset-x-0 z-40">
      <div className="max-w-md mx-auto flex items-stretch justify-around px-2 pt-1.5 pb-[max(0.55rem,env(safe-area-inset-bottom))]">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-1.5 min-h-[3.25rem] rounded-lg transition-colors ${
                active
                  ? "text-ktab-cream"
                  : "text-ktab-dusty-rose/80 hover:text-ktab-cream/90"
              }`}
              aria-current={active ? "page" : undefined}
            >
              {tab.icon}
              <span className="text-[11px] font-bold tracking-wide">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
