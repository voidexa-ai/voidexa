# BUGFIX — AFS-6a-fix (Post-AFS-6a live audit fixes)
## Skill file for Claude Code
## Location: docs/skills/bugfix-afs-6a-fix.md

**Parent sprint:** AFS-6a (shipped 2026-04-24, HEAD `bf1ce98`, tag `sprint-afs-6a-complete`)
**Reason for bugfix:** Post-ship live audit on voidexa.com revealed 5 bugs — 3 pre-existing from Sprint 13e/14b silent-fail pattern, 2 introduced by AFS-6a cosmetic mount.

---

## BUG DESCRIPTIONS

### Bug 1: Universe dropdown missing Shop + Cards + Inventory links
**Severity:** P0
**Type:** Pre-existing (Sprint 13e/14b silent-fail pattern)

**Reproducible steps:**
1. Visit https://voidexa.com (logged in as test user)
2. Click Universe dropdown in top nav
3. Expected per INDEX (03_VOIDEXA_COM.md): 8 items — Star Map, voidexa System, Free Flight, Shop, Cards, Achievements, Assembly Editor, Break Room
4. Actual: only partial nav, Shop + Cards + Inventory unreachable

**Root cause analysis:**
- Sprint 14b commit `637a4d7` was tagged `sprint-14b-complete` with 8-item Universe dropdown
- Live audit Apr 21 + post-AFS-6a audit Apr 24 confirms links not live
- Classic "30 dages tavs fejl" pattern — commit tag exists, live state diverges
- AFS-6a created `/inventory` but never added nav entry (out of AFS-6a scope)

**Files to investigate:**
- `components/nav/NavBar.tsx` or equivalent top-nav component
- `components/nav/UniverseDropdown.tsx` if extracted
- `lib/i18n/*` translation keys for nav labels

---

### Bug 2: ShopCosmeticsClient back-link goes to homepage instead of /shop
**Severity:** P1
**Type:** Introduced by AFS-6a (mounted orphan component without updating internal link)

**Reproducible steps:**
1. Visit https://voidexa.com/shop/cosmetics
2. Click "← voidexa" top-left
3. Expected: redirect to `/shop`
4. Actual: redirect to `/` (homepage)

**Root cause:**
- `components/shop/ShopCosmeticsClient.tsx` line ~21 has `<Link href="/">← voidexa</Link>`
- Written when component was orphan reference — never updated when AFS-6a mounted it

**File:** `components/shop/ShopCosmeticsClient.tsx`

---

### Bug 3: /shop and /shop/cosmetics have no cross-nav between them
**Severity:** P1
**Type:** Partially introduced by AFS-6a (mount created new surface without linking from parent)

**Reproducible steps:**
1. Visit `/shop` (ShopPage)
2. Look for way to navigate to cosmetics per-category surface
3. Expected: tab or link visible to `/shop/cosmetics`
4. Actual: no link — siloed surfaces

**Fix approach:**
- Add tab/link in ShopPage to `/shop/cosmetics`
- Verify ShopTabs in ShopCosmeticsClient can route back to `/shop` (already has PACKS tab leading to `/shop/packs`)

**Files:**
- `components/shop/ShopPage.tsx`
- `components/shop/ShopTabs.tsx` (if separate)

---

### Bug 4: /shop/packs copy says "257-CARD LIBRARY" should be "1000-CARD ALPHA LIBRARY"
**Severity:** P2 (copy only, not functional)
**Type:** Pre-existing (never updated after Alpha 1000 scope-pivot Apr 23)

**Reproducible steps:**
1. Visit `/shop/packs`
2. Header reads "BOOSTER PACKS · 257-CARD LIBRARY"
3. Expected: "1000-CARD ALPHA LIBRARY" (per scope pivot Apr 23 — V3 257 dropped, Alpha 1000 is active)

**File:** `components/shop/PackShopClient.tsx` (grep for "257")

---

### Bug 5: /shop/packs BUY buttons active — should be "Coming Soon" until AFS-5 delivers art
**Severity:** P1
**Type:** Pre-existing — exposed by Apr 24 powerplan decision

**Context (from GROUND_TRUTH_APR24_APPENDIX SLUT 6):**
> "Cards gameplay = 'Coming Soon' pattern. Until 1000 Alpha cards are live (AFS-5 + AFS-18 done), the entire card-related parts of the game and shop = 'Coming Soon' placeholder. Eliminates risk of selling V3 card_ids that get retired in AFS-18. Eliminates customer refund risk under DK 2-year reklamationsret."

**Current state:** Pack buttons show "Not enough GHAI" when balance=0, would show "BUY" with sufficient balance. Working purchase flow = risk of selling cards that will be retired.

**Fix:** Replace pack BUY button with "Coming Soon" banner on all 3 pack tiers. Keep pack info cards visible (marketing) but disable purchase.

**File:** `components/shop/PackShopClient.tsx`

---

## FIX STRATEGY

### Approach
Small, focused bugfix — no schema changes, no new routes. All changes in existing components. 5 distinct code changes, one commit per bug for clean rollback.

### Risk
- **Low** for Bugs 2, 3, 4, 5 (scoped component changes)
- **Medium** for Bug 1 (nav changes can cascade; verify mobile nav + DK nav + auth dropdown)

### Reversibility
Each bug = one commit. Revert individual commits if needed. Full rollback via backup tag.

---

## PRE-FLIGHT (VERIFY-FIRST — STOP for Jix approval)

Run these greps and report findings before Task 1:

```
# Bug 1 — find nav
find components -name "*Nav*" -o -name "*nav*" | head -20
grep -rn "Star Map\|starmap" components/nav/ 2>/dev/null
grep -rn "Universe" components/ --include="*.tsx" | grep -i "dropdown\|menu\|nav" | head -10

# Bug 2 — verify back-link location
grep -n "backLink\|← voidexa" components/shop/ShopCosmeticsClient.tsx

# Bug 3 — ShopPage structure
grep -n "ShopTabs\|tabs\|cosmetics" components/shop/ShopPage.tsx | head -20

# Bug 4 — 257 copy
grep -rn "257" components/shop/ --include="*.tsx"
grep -rn "257-CARD\|257 CARD" . --include="*.tsx" --include="*.ts" 2>/dev/null | head -10

# Bug 5 — pack buttons
grep -n "Not enough GHAI\|BUY\|purchase" components/shop/PackShopClient.tsx | head -20
```

**STOP. Report.** Report:
- Exact path for top-nav component
- Current structure of Universe dropdown (what items ARE there, what's missing)
- Exact line numbers for each bug fix target

Wait for Jix approval before Task 1.

---

## IMPLEMENTATION

### Task 1: SKILL documentation commit

```
git add docs/skills/bugfix-afs-6a-fix.md
git commit -m "docs(afs-6a-fix): bugfix SKILL for post-ship live audit"
```

---

### Task 2: Fix Universe dropdown — restore Shop + Cards + Inventory

**File:** (path from pre-flight — likely `components/nav/NavBar.tsx` or similar)

**Action:**
- Verify Universe dropdown 8 items per INDEX canonical list:
  1. Star Map → `/starmap`
  2. voidexa System → `/starmap/voidexa`
  3. Free Flight → `/freeflight`
  4. **Shop → `/shop`**
  5. **Cards → `/cards`**
  6. Achievements → `/achievements`
  7. Assembly Editor → `/assembly-editor`
  8. Break Room → `/break-room`
- Add new 9th item: **Inventory → `/inventory`** (added by AFS-6a)
- DK mirror: same items with DK routes (`/dk/shop`, `/dk/cards`, etc.)
- Verify mobile nav receives same items
- Verify i18n strings exist for any new labels

**Validation:**
- [ ] Click Universe in nav → see 9 items (Star Map, voidexa System, Free Flight, Shop, Cards, Achievements, Assembly Editor, Break Room, Inventory)
- [ ] All 9 links work (no 404)
- [ ] Mobile nav shows same items
- [ ] DK version `/dk` shows DK labels + DK routes

**Commit:**
```
git commit -m "fix(afs-6a-fix): restore Universe dropdown 9 items incl. Shop/Cards/Inventory"
```

---

### Task 3: Fix ShopCosmeticsClient back-link

**File:** `components/shop/ShopCosmeticsClient.tsx` (line ~21)

**Change:**
```tsx
// Before:
<Link href="/" style={S.backLink}>← voidexa</Link>

// After:
<Link href="/shop" style={S.backLink}>← Shop</Link>
```

**Validation:**
- [ ] Visit `/shop/cosmetics` → click back-link → lands on `/shop`

**Commit:**
```
git commit -m "fix(afs-6a-fix): back-link on /shop/cosmetics points to /shop not /"
```

---

### Task 4: Add cross-nav between /shop and /shop/cosmetics

**Files:**
- `components/shop/ShopPage.tsx` — add "View All Cosmetics" link/tab pointing to `/shop/cosmetics`
- OR extract shared `ShopTopNav` component if cleaner

**Decision:** Add inline link below shop hero, not full tab system (avoid ShopPage growing past 1040 lines). Example placement:
```tsx
<div className="shop-hero">
  <h1>Shop</h1>
  <p>Starter items + card packs</p>
  <Link href="/shop/cosmetics">Browse all cosmetics →</Link>
  <Link href="/shop/packs">Booster packs →</Link>
</div>
```

**Validation:**
- [ ] `/shop` shows link to `/shop/cosmetics`
- [ ] `/shop` shows link to `/shop/packs`
- [ ] No regression on existing ItemModal BUY flow

**Commit:**
```
git commit -m "fix(afs-6a-fix): cross-nav links from /shop to cosmetics + packs"
```

---

### Task 5: Fix "257-CARD LIBRARY" copy to "1000-CARD ALPHA LIBRARY"

**File:** `components/shop/PackShopClient.tsx` (path from pre-flight)

**Change:**
```tsx
// Before:
<span>BOOSTER PACKS · 257-CARD LIBRARY</span>

// After:
<span>BOOSTER PACKS · 1000-CARD ALPHA LIBRARY</span>
```

**Also check i18n:**
- Search for "257-CARD" or "257 CARD" in `messages/` or `lib/i18n/`
- Update DK version: "1000-KORT ALPHA BIBLIOTEK"

**Validation:**
- [ ] `/shop/packs` shows "1000-CARD ALPHA LIBRARY"
- [ ] `/dk/shop/packs` shows Danish equivalent
- [ ] No other page references 257 (grep clean)

**Commit:**
```
git commit -m "fix(afs-6a-fix): pack shop copy 257-card → 1000-card Alpha library"
```

---

### Task 6: Pack BUY → "Coming Soon" lockdown

**Rationale (per Apr 24 powerplan SLUT 6 decision):**
Until AFS-5 delivers 1000 rendered cards + AFS-18 wires them into game engine, pack purchases are locked. Prevents selling V3 card_ids that get retired, prevents refund risk under DK 2-year reklamationsret.

**File:** `components/shop/PackShopClient.tsx`

**Change:**
- Replace each pack tier's BUY/Not-enough-GHAI button with disabled "Coming Soon" button
- Keep pack info cards fully visible (marketing: Standard 100 / Premium 300 / Legendary 1000 GHAI)
- Add subtle explanatory line under balance: "Pack opening unlocks when Alpha 1000 cards are live"
- Do NOT remove `/api/shop/open-pack` endpoint (infrastructure stays ready for when AFS-5/AFS-18 complete)

**Pseudo-code:**
```tsx
<button disabled className="coming-soon-btn">
  Coming Soon
</button>
```

**Validation:**
- [ ] All 3 pack tiers show "Coming Soon" button (disabled)
- [ ] Pack info still visible (price, contents)
- [ ] No purchase flow triggers
- [ ] Explanatory text visible
- [ ] `/api/shop/open-pack` endpoint still exists (server-side untouched)

**Commit:**
```
git commit -m "fix(afs-6a-fix): pack shop Coming Soon lockdown until Alpha 1000 ships"
```

---

### Task 7: Vitest tests

**File:** `tests/afs-6a-fix.test.ts`

**Cases:**
- Nav component exports Universe dropdown with exactly 9 items including /shop, /cards, /inventory
- ShopCosmeticsClient back-link href equals `/shop`
- ShopPage contains links to both `/shop/cosmetics` and `/shop/packs`
- PackShopClient no longer contains "257-CARD" string
- PackShopClient renders disabled "Coming Soon" button for each pack tier

**Target:** +5 assertions minimum (994 → ~999)

**Commit:**
```
git commit -m "test(afs-6a-fix): nav + back-link + coming-soon invariants"
```

---

## FILE SIZE LIMITS

- React components: MAX 300 lines
- `page.tsx`: MAX 100 lines
- `lib/` files: MAX 500 lines

`ShopPage.tsx` is at 1040 lines (pre-existing debt). Task 4 adds 2-3 link elements — should not push it over. If it grows past 1050, extract the hero block into `components/shop/ShopHero.tsx`.

---

## TESTING REQUIREMENTS

### Before commit
- [ ] `npm test` passes
- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] No console errors in dev

### Expected test count
- Baseline: **994** (post-AFS-6a)
- Target: **~999 (+5)**

---

## GIT WORKFLOW

### Repo + branch
- Push: `git push origin main` ONLY
- Never `main:master`, never `master`, never `npx vercel --prod`

### Before starting
```powershell
cd C:\Users\Jixwu\Desktop\voidexa
git status                                          # must be clean (5 V3 untracked OK)
git pull origin main
git tag backup/pre-afs-6a-fix-20260424
git push origin backup/pre-afs-6a-fix-20260424
```

### During
- One commit per bug (7 commits total: SKILL + 5 bugs + tests)
- Descriptive messages: `fix(afs-6a-fix): <what>`

### After completion
```powershell
git status
git log origin/main --oneline -8                   # see all 7 commits + SKILL + AFS-6a parents
git tag afs-6a-fix-complete
git push origin afs-6a-fix-complete
```

**Note:** This is a bugfix, not a full sprint — tag format is `afs-6a-fix-complete` not `sprint-afs-6a-fix-complete`.

### MANDATORY post-push verification
```powershell
git status                                         # MUST be clean
git log origin/main --oneline -8                   # our commits on remote
# Wait 60-90s for Vercel
# Jix live-verifies voidexa.com:
#   - Universe dropdown shows Shop + Cards + Inventory
#   - /shop/cosmetics back-link goes to /shop
#   - /shop has links to cosmetics + packs
#   - /shop/packs shows "1000-CARD ALPHA LIBRARY"
#   - /shop/packs shows "Coming Soon" on all tiers
```

### Rollback per bug
```powershell
# Undo one commit (e.g., Task 6 coming-soon if decision reversed):
git revert <hash>
git push origin main
```

### Full rollback
```powershell
git reset --hard backup/pre-afs-6a-fix-20260424
git push --force-with-lease origin main
git push origin :refs/tags/afs-6a-fix-complete
```

---

## SAFETY RULES

- NO force push without `--with-lease`
- NO direct push to master
- NO commit of `.env.local`
- NO em-dashes in PowerShell — ASCII only
- NO `&&` in PowerShell — use `;`

---

## DEFINITION OF DONE

- [ ] SKILL committed FIRST
- [ ] Backup tag pushed
- [ ] Universe dropdown shows all 9 items including Shop/Cards/Inventory
- [ ] ShopCosmeticsClient back-link goes to `/shop`
- [ ] `/shop` has links to `/shop/cosmetics` + `/shop/packs`
- [ ] `/shop/packs` copy says "1000-CARD ALPHA LIBRARY"
- [ ] `/shop/packs` shows "Coming Soon" on all 3 tiers
- [ ] Explanatory line visible on /shop/packs
- [ ] 994 → ~999 tests, all green
- [ ] Build succeeds
- [ ] Tagged `afs-6a-fix-complete`
- [ ] Pushed to `origin/main`
- [ ] Post-push verified
- [ ] Jix live-verifies 5 fixes on voidexa.com

**NOT in scope:**
- GHAI top-up modal stuck-open bug (separate investigation, pre-existing)
- Other navs not yet audited (mobile, footer)
- STARTER_SHOP_ITEMS → COSMETIC_CATALOG bridge (known gap, future rebuild)
- 400-item Alpha shop rebuild (future sprint chain)

---

## BLOCKERS / RISKS

- **Risk:** Nav component path unknown → pre-flight grep must find it before Task 2
- **Risk:** Translation keys for new nav items missing → add English + DK fallback; AFS-28 will polish
- **Risk:** `/inventory` route name conflict with DK middleware → verify `/dk/inventory` works
- **Risk:** Someone already has packs in-flight via /api/shop/open-pack → Coming Soon UI only; backend stays functional; no data migration
- **Blocker:** If nav component is a tightly-coupled monolith and changing Universe items breaks other dropdowns → STOP, document, may need separate refactor sprint

---

## POST-BUGFIX DOCUMENTATION

At bugfix completion, the SLUT ritual will:

1. Build complete new CLAUDE.md with bugfix session log entry (added to AFS-6a session — same day)
2. Update INDEX files:
   - `03_VOIDEXA_COM.md` — Universe dropdown 9 items (was 8 per stale INDEX), Shop + Cards + Inventory confirmed live
   - `04_KNOWN_ISSUES_ADDENDUM.md` — 5 bugs resolved; GHAI top-up modal still open
   - `13_CORRECTIONS_ADDENDUM.md` — new corrections:
     - Universe dropdown was empty/partial before AFS-6a-fix (contradicts Sprint 13e/14b "complete" tags — classic silent-fail)
     - `/shop/packs` library size: 1000 Alpha (NOT 257 V3)
     - Pack purchases locked until AFS-5 + AFS-18 complete

---

## TOOLS USED

- Claude Code (`claude-opus-4-7` with `/effort xhigh`)
- Git + GitHub (voidexa-ai/voidexa)
- Vercel auto-deploy (production branch = main)
- Vitest 2.1.9
- PowerShell (`;` not `&&`, ASCII only)

---

**End bugfix SKILL AFS-6a-fix**
