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

/** Brand-mapped accents — solid KTab palette, no neon gradients. */
export function accentClasses(accent: Bundle["accent"]): {
  soft: string;
  solid: string;
  ring: string;
  text: string;
} {
  const map = {
    amber: {
      soft: "bg-surface-raised border-border",
      solid: "bg-ktab-taupe",
      ring: "ring-ktab-taupe/40",
      text: "text-ktab-burgundy",
    },
    sky: {
      soft: "bg-surface border-border",
      solid: "bg-ktab-brown",
      ring: "ring-ktab-brown/40",
      text: "text-ktab-brown",
    },
    rose: {
      soft: "bg-ktab-cream border-ktab-dusty-rose/60",
      solid: "bg-ktab-dusty-rose",
      ring: "ring-ktab-dusty-rose/50",
      text: "text-ktab-burgundy",
    },
    violet: {
      soft: "bg-accent-soft border-ktab-burgundy/25",
      solid: "bg-ktab-burgundy",
      ring: "ring-ktab-burgundy/35",
      text: "text-ktab-burgundy",
    },
    emerald: {
      soft: "bg-success-soft border-ktab-sage/35",
      solid: "bg-ktab-sage",
      ring: "ring-ktab-sage/40",
      text: "text-ktab-sage",
    },
    fuchsia: {
      soft: "bg-surface-raised border-ktab-taupe/40",
      solid: "bg-ktab-taupe",
      ring: "ring-ktab-taupe/40",
      text: "text-ktab-brown",
    },
    orange: {
      soft: "bg-ktab-nude border-ktab-dusty-rose/50",
      solid: "bg-ktab-brown",
      ring: "ring-ktab-brown/40",
      text: "text-ktab-burgundy",
    },
  } as const;
  return map[accent];
}
