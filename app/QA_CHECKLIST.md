# Keeping Tab MVP - QA Checklist

Manual testing checklist for the interactive savings book MVP.

## ✅ Smoke Tests

### 1. App Loads
- [ ] Navigate to http://localhost:3000
- [ ] Library/book cover displays with title "Printable Savings - TAB v.1"
- [ ] Shows "41 savings challenges" count
- [ ] "Start Saving" button is visible and clickable

### 2. Navigation Works
- [ ] Click "Start Saving" → navigates to `/cards`
- [ ] Card list shows all 41 cards
- [ ] Click any card → navigates to detail page
- [ ] Back button in header returns to card list
- [ ] Back button on card list returns to library

### 3. Data Loads Correctly
- [ ] All 41 cards appear in the list
- [ ] Card titles match seed data (e.g., "Savings Challenge", "Money Milk", "$1000 Emergency Funds")
- [ ] Goals display in dollars (e.g., "$500", "$1,000", "$1,500")
- [ ] Cell counts are correct (varies: 7-24 cells per card)

## 📱 Mobile-First Design

### 4. Responsive Layout
- [ ] Resize browser to 375px width (iPhone SE)
- [ ] Content is readable without horizontal scroll
- [ ] Buttons are thumb-friendly (min 44px touch targets)
- [ ] Card grid adapts (3-4 columns)
- [ ] Text doesn't overflow containers

### 5. Portrait Orientation
- [ ] App looks good in vertical viewport
- [ ] No awkward landscape-only layouts

## 🎯 Core Functionality

### 6. Cell Interaction
- [ ] Open any card detail page
- [ ] Tap a cell → fills with orange gradient + checkmark
- [ ] Tap same cell again → unfills (returns to white)
- [ ] Running total updates immediately
- [ ] Progress bar updates in real-time
- [ ] Cell amounts display correctly

### 7. Progress Tracking
- [ ] Fill some cells on "v1-p20" (Money Lemonade, $100 goal)
- [ ] Return to card list
- [ ] Card shows updated progress bar and saved amount
- [ ] Navigate back to card detail
- [ ] Filled cells are still marked

### 8. localStorage Persistence
- [ ] Fill several cells across 3 different cards
- [ ] Note which cells are filled and saved amounts
- [ ] Refresh the page (F5 / Cmd+R)
- [ ] Navigate back to those cards
- [ ] All progress persists correctly

### 9. Completion Detection
- [ ] Choose a small card (e.g., "Conchas & Ghosts", 7 cells)
- [ ] Fill all cells
- [ ] Green checkmark badge appears on card list
- [ ] "Challenge completed!" message shows on detail page
- [ ] Progress bar turns green

### 10. Goal vs Sum Handling
Test cards with `cell_sum_mismatch` flag:

- [ ] Open "Money Milk" (v1-p03)
  - Goal shows: $1,000
  - Amber note appears: "Cell amounts sum to $1,008, but printed goal is $1,000"
- [ ] Open "$1000 Emergency Funds" (v1-p06)
  - Goal shows: $1,000  
  - Amber note appears with actual sum ($960)
- [ ] Card still marks complete when all cells filled
- [ ] Printed goal always displayed prominently

## 🔄 Edge Cases

### 11. Empty State
- [ ] Open browser in incognito/private mode
- [ ] All cards show 0% progress
- [ ] No cells are filled

### 12. Partial Progress
- [ ] Fill 5 cells on a 12-cell card
- [ ] Progress shows partial completion (not 0% or 100%)
- [ ] Can continue filling remaining cells

### 13. Large Goals
- [ ] Open "Debt Hunt" ($1,500 goal)
- [ ] Currency formats correctly with comma ($1,500 not $1500)
- [ ] All cells display correctly

### 14. Small Goals  
- [ ] Open "Order at the Panaderia" ($60 goal)
- [ ] Small amounts display correctly ($5.00)
- [ ] Progress bar still functional

## 🎨 UI/UX Polish

### 15. Visual Feedback
- [ ] Cells have hover state (border color change on desktop)
- [ ] Cells have active state (scale down on tap/click)
- [ ] Smooth transitions on progress bars
- [ ] Buttons have hover/active states

### 16. Accessibility Basics
- [ ] Text is readable (sufficient contrast)
- [ ] Touch targets are adequate size
- [ ] No text overlaps or gets cut off

### 17. Performance
- [ ] Card list scrolls smoothly
- [ ] No lag when tapping cells
- [ ] Page load is fast (<3s)

## 🧪 Data Integrity

### 18. All Card Types Present
Count by layout:
- [ ] 18 equal_grid cards (all cells same amount)
- [ ] 23 mixed_grid cards (varying amounts)
- [ ] Total = 41 cards

### 19. Themes Represented
Sample cards from different themes:
- [ ] General savings (v1-p01, v1-p02)
- [ ] Emergency fund (v1-p06, v1-p18)
- [ ] Halloween (v1-p17, v1-p24, v1-p26, v1-p27)
- [ ] Monthly (v1-p34 through v1-p45)
- [ ] Food/drink (v1-p16, v1-p20, v1-p28, v1-p33)

### 20. Amounts Are Sensible
- [ ] No negative amounts
- [ ] No absurdly large amounts
- [ ] Currency displays correctly ($ symbol, 2 decimals when needed)

## 🚫 Out of Scope Verification

### 21. Layouts Excluded
Confirm these are NOT in the card list:
- [ ] No calendar cards
- [ ] No weather cards
- [ ] No checklist cards
- [ ] Only equal_grid and mixed_grid

## 📝 Notes Template

Use this section to record any issues found:

**Issue:** [Brief description]  
**Steps:** [How to reproduce]  
**Expected:** [What should happen]  
**Actual:** [What actually happened]  
**Severity:** [Low/Medium/High]

---

## Summary

**Total Test Cases:** 21 categories, ~60+ individual checks  
**Estimated Time:** 20-30 minutes for full manual QA pass

**Pass Criteria:**
- ✅ All smoke tests pass
- ✅ Core functionality works (tap, save, persist)
- ✅ Data loads from seed correctly
- ✅ Mobile-first design is usable
- ✅ No critical bugs blocking MVP usage
