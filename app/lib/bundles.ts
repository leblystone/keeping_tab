import { Book, Bundle } from "./types";

/** Curated Free vs Paid packs. Paid = more unique themes. */
export const BUNDLES: Bundle[] = [
  {
    id: "catalog-v1",
    name: "Volume 1 · Full Set",
    tagline: "All printable savings cards from v.1",
    tier: "free",
    accent: "rose",
    cardIds: [
      "v1-p01", "v1-p02", "v1-p03", "v1-p04", "v1-p05", "v1-p06", "v1-p07", "v1-p08", "v1-p09", "v1-p10", "v1-p11", "v1-p12", "v1-p13", "v1-p14", "v1-p15", "v1-p16", "v1-p17", "v1-p18", "v1-p19", "v1-p20", "v1-p21", "v1-p22", "v1-p23", "v1-p24", "v1-p25", "v1-p26", "v1-p27", "v1-p28", "v1-p29", "v1-p30", "v1-p31", "v1-p32", "v1-p33", "v1-p34", "v1-p35", "v1-p36", "v1-p37", "v1-p38", "v1-p39", "v1-p40", "v1-p41", "v1-p42", "v1-p43", "v1-p44", "v1-p45", "v1-p46", "v1-p47", "v1-p48", "v1-p49", "v1-p50"
    ],
  },
  {
    id: "catalog-v2",
    name: "Volume 2 · Full Set",
    tagline: "All illustrated savings cards from v.2",
    tier: "paid",
    priceLabel: "$9.99",
    accent: "violet",
    cardIds: [
      "v2-p02", "v2-p03", "v2-p04", "v2-p05", "v2-p06", "v2-p07", "v2-p08", "v2-p09", "v2-p10", "v2-p11", "v2-p12", "v2-p13", "v2-p14", "v2-p15", "v2-p16", "v2-p17", "v2-p18", "v2-p19", "v2-p20", "v2-p21", "v2-p22", "v2-p23", "v2-p24", "v2-p25", "v2-p26", "v2-p27", "v2-p28", "v2-p29", "v2-p30", "v2-p31", "v2-p32", "v2-p33", "v2-p34", "v2-p35", "v2-p36", "v2-p37", "v2-p38", "v2-p39", "v2-p40", "v2-p41", "v2-p42", "v2-p43", "v2-p44", "v2-p45", "v2-p46", "v2-p47", "v2-p48", "v2-p49", "v2-p50"
    ],
  },
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
    priceLabel: "$2.99",
    accent: "violet",
    cardIds: ["v1-p17", "v1-p24", "v1-p26", "v1-p27"],
  },
  {
    id: "paid-emergency",
    name: "Safety Net",
    tagline: "Emergency & utility funds that stand out",
    tier: "paid",
    priceLabel: "$2.99",
    accent: "emerald",
    cardIds: ["v1-p06", "v1-p18", "v1-p15"],
  },
  {
    id: "paid-storybook",
    name: "Storybook Saves",
    tagline: "Alice, wedding, books — one-of-a-kind pages",
    tier: "paid",
    priceLabel: "$3.99",
    accent: "fuchsia",
    cardIds: ["v1-p23", "v1-p46", "v1-p47", "v1-p19", "v1-p03"],
  },
  {
    id: "paid-debt-crush",
    name: "Debt Crushers",
    tagline: "Bold debt-free challenges",
    tier: "paid",
    priceLabel: "$1.99",
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

/** Brand-mapped accents — glass on burgundy, no neon. */
export function accentClasses(accent: Bundle["accent"]): {
  soft: string;
  solid: string;
  ring: string;
  text: string;
} {
  const glass = "kt-glass";
  const map = {
    amber: {
      soft: glass,
      solid: "bg-ktab-taupe",
      ring: "ring-ktab-cream/30",
      text: "text-ktab-cream",
    },
    sky: {
      soft: glass,
      solid: "bg-ktab-brown",
      ring: "ring-ktab-cream/30",
      text: "text-ktab-cream",
    },
    rose: {
      soft: glass,
      solid: "bg-ktab-dusty-rose",
      ring: "ring-ktab-dusty-rose/40",
      text: "text-ktab-cream",
    },
    violet: {
      soft: glass,
      solid: "bg-ktab-burgundy",
      ring: "ring-ktab-cream/25",
      text: "text-ktab-cream",
    },
    emerald: {
      soft: glass,
      solid: "bg-ktab-sage",
      ring: "ring-ktab-sage/40",
      text: "text-ktab-cream",
    },
    fuchsia: {
      soft: glass,
      solid: "bg-ktab-taupe",
      ring: "ring-ktab-cream/30",
      text: "text-ktab-cream",
    },
    orange: {
      soft: glass,
      solid: "bg-ktab-brown",
      ring: "ring-ktab-dusty-rose/40",
      text: "text-ktab-cream",
    },
  } as const;
  return map[accent];
}
