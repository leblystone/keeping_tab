# Keeping Tab

Interactive digital savings challenges / cash-envelope books — digitized from the printable TAB line.

Brand: **Keeping Tab** (singular). Separate from Pep Planner and GRiP.

## 🎯 MVP Status

**v.1 Interactive Book - COMPLETE**

The MVP web app is live in the `/app` directory with 41 playable savings-challenge cards.

### What's Built
- ✅ Next.js 16 app with TypeScript + Tailwind
- ✅ Three screens: library/book cover, card list, card detail
- ✅ 41 MVP cards loaded from seed data (`data/v1/mvp-cards.json`)
- ✅ Interactive grid cells (tap to fill/unfill)
- ✅ Running totals and progress tracking
- ✅ localStorage persistence (survives refresh)
- ✅ Completion detection (all cells or goal met)
- ✅ Mobile-first portrait design
- ✅ QA flag handling (shows note for cell sum mismatches)

### Quick Start
```bash
cd app
pnpm install
pnpm dev
# Open http://localhost:3000
```

See [`app/README.md`](app/README.md) for full documentation.

## Native (primary)

```bash
cd mobile && npm install && npx expo start
```

Open with Expo Go on device, or press `i` / `a` for simulators.

## 📁 Repository Structure

```
keeping_tab/
├── mobile/                 # Expo React Native (iOS + Android) — ship target
├── app/                    # Next.js web prototype (secondary)
│   ├── app/               # Pages and routes
│   ├── lib/               # Types, storage, utilities
│   ├── hooks/             # React hooks
│   ├── data/              # Seed data (cards.json)
│   ├── README.md          # App documentation
│   └── QA_CHECKLIST.md    # Manual test guide
├── data/
│   └── v1/
│       ├── mvp-cards.json     # 41 MVP cards (seed)
│       └── README.md          # Seed documentation
└── README.md              # This file
```

## 🚫 Out of Scope

This MVP intentionally excludes:
- Calendar, weather, and checklist layouts (different interaction models)
- Scratcher animations / envelope layouts
- v.2 or v.3 book content
- Theme customization
- Authentication or cloud sync
- Payments
- Pep Planner integration
- GRiP/Brothers Ledger integration

## 🔍 Testing

Run through the QA checklist in [`app/QA_CHECKLIST.md`](app/QA_CHECKLIST.md) to verify:
- All 41 cards load correctly
- Tap interaction works
- Progress persists after refresh
- Mobile-first layout is usable
- Cards with QA flags display appropriately

## 📊 Card Details

The v.1 book includes:
- **18 equal_grid** cards (uniform cell amounts)
- **23 mixed_grid** cards (varying amounts)
- **6 cards** with `cell_sum_mismatch` flags (printed goal ≠ sum of cells)
- **Goals range** from $60 to $1,500
- **Cell counts** vary from 6 to 24 per card

All amounts are stored as integer cents in the seed data.

## 📝 License

Proprietary - Keeping Tab
