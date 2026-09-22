# Keeping Tab MVP - Interactive Savings Book

An interactive digital book for tracking savings challenges. Digitizes printable cash-envelope and savings-challenge cards into a mobile-first web experience.

## What's Included

This MVP implements the **Printable Savings - TAB v.1** book with **41 interactive challenge cards**:
- 18 equal-grid layout cards (all cells same amount)
- 23 mixed-grid layout cards (varying cell amounts)

### Features
- 📱 **Mobile-first portrait design** - optimized for phone screens
- 🎯 **Three screens:**
  - Library/Book cover - welcome screen showing the v.1 book
  - Card list - all 41 challenges with progress indicators
  - Card detail - interactive grid where you tap cells to fill/unfill
- 💾 **localStorage persistence** - progress survives page refresh
- ✅ **Completion tracking** - cards marked complete when all cells filled or goal met
- 🔍 **QA flag awareness** - displays note when cell sums don't match printed goal

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (or npm/yarn)

### Installation

```bash
cd app
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

## How It Works

### Data Source
All 41 cards are loaded from `/app/data/cards.json`, which is copied from the seed data at `/data/v1/mvp-cards.json`. The seed uses integer cents for all amounts:
- `goalCents`: target savings amount in cents
- `amountCents`: value for each cell in cents

### User Flow
1. **Library screen** - Shows book cover with title and card count
2. **Card list** - Browse all challenges, see progress bars and completion status
3. **Card detail** - Tap individual grid cells to mark them as "saved":
   - Unfilled cells: white with gray border
   - Filled cells: orange gradient with checkmark
   - Running total updates immediately
   - Progress bar shows percentage complete
   - Green checkmark badge when challenge is complete

### Progress Persistence
Progress is saved in `localStorage` as:
```json
{
  "keeping-tab-progress": {
    "v1-p01": {
      "filledCells": ["c1", "c3", "c5"],
      "savedCents": 17500,
      "isComplete": false
    }
  }
}
```

### QA Flags
Some cards have `qaFlags` in the seed data:
- `cell_sum_mismatch` - The sum of cell amounts differs from the printed goal. The app shows the printed goal prominently but displays a small note in the card detail when this flag is present.
- `ambiguous_title` - Title kept as-is from catalog.

Cards with mismatches (6 total): v1-p03, v1-p06, v1-p18, v1-p19, v1-p23, v1-p27

## Project Structure

```
app/
├── app/
│   ├── page.tsx              # Library/book cover screen
│   ├── cards/
│   │   ├── page.tsx          # Card list screen
│   │   └── [id]/page.tsx     # Card detail screen
│   ├── layout.tsx            # Root layout with metadata
│   └── globals.css           # Tailwind styles
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   ├── storage.ts            # localStorage utilities
│   └── format.ts             # Currency formatting
├── hooks/
│   └── useProgress.ts        # Progress state management hook
├── data/
│   └── cards.json            # 41 MVP cards (copied from seed)
└── package.json
```

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State:** React hooks + localStorage
- **Package Manager:** pnpm

## What's NOT Included (Out of Scope)

This MVP intentionally excludes:
- ❌ Calendar layouts
- ❌ Weather layouts  
- ❌ Checklist layouts
- ❌ Scratcher animations
- ❌ Envelope layouts
- ❌ Auth/accounts
- ❌ Cloud sync
- ❌ Payments
- ❌ v.2 or v.3 books
- ❌ Theme customization
- ❌ Pep Planner integration
- ❌ GRiP/Brothers Ledger integration

## Testing

See `QA_CHECKLIST.md` for manual test scenarios.

## License

Proprietary - Keeping Tab
