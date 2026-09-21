# Keeping Tab v.1 — MVP interactive savings cards seed

Machine-readable seed for playable MVP cards from the **Printable Savings - TAB v.1** catalog (`DAFoV5QxO0U`).

## Files

| File | Purpose |
|------|---------|
| `keeping-tab-v1-mvp-cards.json` | Book + card seed (this pack) |
| `savings-challenge-catalog-DAFoV5QxO0U.md` | Source catalog (read-only) |

## Book

- **id:** `keeping-tab-v1`
- **title:** Printable Savings - TAB v.1
- **version:** `"1"`
- **orientation:** `portrait`

## Card count

**41** playable MVP cards (18 `equal_grid`, 23 `mixed_grid`).

Included card ids: v1-p01, v1-p02, v1-p03, v1-p06, v1-p07, v1-p13, v1-p14, v1-p15, v1-p16, v1-p17, v1-p18, v1-p19, v1-p20, v1-p23, v1-p24, v1-p25, v1-p26, v1-p27, v1-p28, v1-p29, v1-p30, v1-p31, v1-p32, v1-p33, v1-p34, v1-p35, v1-p36, v1-p37, v1-p38, v1-p39, v1-p40, v1-p41, v1-p42, v1-p43, v1-p44, v1-p45, v1-p46, v1-p47, v1-p48, v1-p49, v1-p50

## Exclusion rules

Only `equal_grid` and `mixed_grid` cards are included. Excluded layouts from the 50-page catalog:

| Layout | Pages skipped |
|--------|---------------|
| calendar | 5, 8 |
| weather | 9–12 |
| checklist | 4, 21, 22 |
| blank | — |
| cover_or_other | — |

**9 pages skipped** (not playable for this MVP interaction model).

## Schema (seed)

```
Book { id, title, version, orientation, cards[] }
Card {
  id,              // "v1-p01" … matching catalog page #
  title,
  theme,           // short thematic slug
  layout,          // equal_grid | mixed_grid
  orientation,     // portrait
  goalCents,       // integer cents (printed goal when known)
  brand?,          // "KeepingTABS" unless card notes otherwise
  cells: [{ id, amountCents, label? }],  // ids "c1","c2",…
  qaFlags?,        // e.g. cell_sum_mismatch, ambiguous_title
  cellsSumCents?   // present when cell sum ≠ goalCents
}
```

Progress is **omitted** in the seed (runtime state).

## QA flags in this pack

- **cell_sum_mismatch** (6): v1-p03, v1-p06, v1-p18, v1-p19, v1-p23, v1-p27  
  `goalCents` stays the **printed** catalog goal; `cellsSumCents` is the sum of cell amounts.  
  Catalog explicitly noted mismatches for v1-p03, v1-p06, v1-p27; additional arithmetic mismatches surfaced for v1-p18 (20×16=$320 vs $500), v1-p19 (cells sum $202 vs $200), v1-p23 (cells sum $1150 vs $1000).
- **ambiguous_title** (4): v1-p30, v1-p32, v1-p46, v1-p48  
  Catalog title kept as-is.
- **Non-default brand:** v1-p15 (theavearagebudget)

## How to use

1. Load `keeping-tab-v1-mvp-cards.json` as the book seed.
2. For each card, treat `cells[].amountCents` as the tap/fill amounts; track user progress separately (do not persist progress into this seed).
3. Display goal from `goalCents`. If `qaFlags` contains `cell_sum_mismatch`, UI/QA can surface that printed goal ≠ Σ cells (`cellsSumCents`).
4. Amounts are always integer **cents** (e.g. $1,000 → `100000`).
5. Do not mix in calendar / weather / checklist layouts here — those need different interaction models.

## Source

Catalog: `/workspace/savings-challenge-catalog-DAFoV5QxO0U.md`  
Generated for Keeping Tab MVP; Canva / Pep / GRiP untouched.
