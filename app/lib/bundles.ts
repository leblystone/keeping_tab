import { Book, Bundle } from "./types";

/** Curated Free vs Paid packs. Paid = more unique themes. */
export const BUNDLES: Bundle[] = [
  {
    id: "free-starter",
    name: "Starter Saves",
    tagline: "Simple challenges to get going",
    tier: "free",
    accent: "amber",
    cardIds: ["v1-p01", "v1-p02", "v1-p16", "v1-p20", "v1-p28"],
  },
  {
    id: "free-monthly",
    name: "Monthly Pace",
    tagline: "One card per month — keep it steady",
    tier: "free",
    accent: "sky",
    cardIds: [
      "v1-p34",
      "v1-p35",
      "v1-p36",
      "v1-p37",
      "v1-p38",
      "v1-p39",
      "v1-p40",
      "v1-p41",
      "v1-p42",
      "v1-p43",
      "v1-p44",
      "v1-p45",
    ],
  },
  {
    id: "free-foodie",
    name: "Foodie Finds",
    tagline: "Treats, drinks, and dinner goals",
    tier: "free",
    accent: "rose",
    cardIds: [
      "v1-p07",
      "v1-p14",
      "v1-p16",
      "v1-p20",
      "v1-p28",
      "v1-p29",
      "v1-p30",
      "v1-p32",
      "v1-p33",
      "v1-p49",
    ],
  },
  {
    id: "paid-spooky",
    name: "Spooky Stack",
    tagline: "Halloween ghosts & mash — unique art set",
    tier: "paid",
    accent: "violet",
    cardIds: ["v1-p17", "v1-p24", "v1-p26", "v1-p27"],
  },
  {
    id: "paid-emergency",
    name: "Safety Net",
    tagline: "Emergency & utility funds that stand out",
    tier: "paid",
    accent: "emerald",
    cardIds: ["v1-p06", "v1-p18", "v1-p15"],
  },
  {
    id: "paid-storybook",
    name: "Storybook Saves",
    tagline: "Alice, wedding, books — one-of-a-kind pages",
    tier: "paid",
    accent: "fuchsia",
    cardIds: ["v1-p23", "v1-p46", "v1-p47", "v1-p19", "v1-p03"],
  },
  {
    id: "paid-debt-crush",
    name: "Debt Crushers",
    tagline: "Bold debt-free challenges",
    tier: "paid",
    accent: "orange",
    cardIds: ["v1-p13", "v1-p31"],
  },
];

export function getBundle(id: string): Bundle | undefined {
  return BUNDLES.find((b) => b.id === id);
}

export function bundlesByTier(tier: "free" | "paid"): Bundle[] {
  return BUNDLES.filter((b) => b.tier === tier);
}

export function cardsForBundle(book: Book, bundle: Bundle) {
  const byId = new Map(book.cards.map((c) => [c.id, c]));
  return bundle.cardIds
    .map((id) => byId.get(id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
}

export function accentClasses(accent: Bundle["accent"]): {
  soft: string;
  solid: string;
  ring: string;
  text: string;
} {
  const map = {
    amber: {
      soft: "bg-amber-50 border-amber-200",
      solid: "bg-gradient-to-br from-amber-400 to-orange-500",
      ring: "ring-amber-300",
      text: "text-amber-800",
    },
    sky: {
      soft: "bg-sky-50 border-sky-200",
      solid: "bg-gradient-to-br from-sky-400 to-cyan-500",
      ring: "ring-sky-300",
      text: "text-sky-800",
    },
    rose: {
      soft: "bg-rose-50 border-rose-200",
      solid: "bg-gradient-to-br from-rose-400 to-pink-500",
      ring: "ring-rose-300",
      text: "text-rose-800",
    },
    violet: {
      soft: "bg-violet-50 border-violet-200",
      solid: "bg-gradient-to-br from-violet-500 to-indigo-600",
      ring: "ring-violet-300",
      text: "text-violet-800",
    },
    emerald: {
      soft: "bg-emerald-50 border-emerald-200",
      solid: "bg-gradient-to-br from-emerald-400 to-teal-500",
      ring: "ring-emerald-300",
      text: "text-emerald-800",
    },
    fuchsia: {
      soft: "bg-fuchsia-50 border-fuchsia-200",
      solid: "bg-gradient-to-br from-fuchsia-500 to-pink-600",
      ring: "ring-fuchsia-300",
      text: "text-fuchsia-800",
    },
    orange: {
      soft: "bg-orange-50 border-orange-200",
      solid: "bg-gradient-to-br from-orange-400 to-red-500",
      ring: "ring-orange-300",
      text: "text-orange-800",
    },
  } as const;
  return map[accent];
}
