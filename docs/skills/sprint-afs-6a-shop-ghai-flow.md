# SPRINT AFS-6a v2 — In-game Shop GHAI Flow (Narrow Fix)
## Skill file for Claude Code
## Location: docs/skills/sprint-afs-6a-shop-ghai-flow.md

**SKILL VERSION:** v2 (v1 deprecated — based on false premise)
**Reason for v2:** Claude Code pre-flight 2026-04-24 proved that GHAI spend already ships for packs (`/shop/packs` via `PackShopClient`) and cosmetics (`CosmeticTab` via `spendGhai`). The real bug is narrower: `/shop` renders `ShopPage` with dead "Coming Soon · Stripe" modal buttons, and the working `ShopCosmeticsClient` wrapper is orphan code (zero imports in `app/`).

---

## SCOPE (v2 — narrow fix)

Fix the one actual broken surface: `/shop` modal BUY flow. Mount orphaned `ShopCosmeticsClient`. Add `/inventory` as read view over existing tables. **No new tables. No new RPC. No parallel schema.**

**What IS included:**
1. Mount `ShopCosmeticsClient` so `/shop/cosmetics` (and per-category tabs) are reachable
2. Rewire `ShopPage.tsx` ItemModal BUY button (line 508-523):
   - Cosmetic items → call existing `spendGhai()` + grant via `user_cosmetics`
   - Card pack items → redirect to `/shop/packs` (existing PackShopClient)
3. Remove `t.shop.comingSoonStripe` disabled-button branch
4. Build `/inventory` page — thin read over `user_cards` + `user_cosmetics`
5. Vitest unit tests for rewired BUY handler error cases
6. Playwright E2E: click BUY on ShopPage item → success/redirect path

**What is NOT included (explicit exclusions):**
- ❌ No new Supabase tables (`shop_packs`, `user_inventory`, `shop_transactions` — all rejected, existing infra covers)
- ❌ No `purchase_pack_atomic` RPC (existing `/api/shop/open-pack` has Mythic supply + optimistic concurrency)
- ❌ No migration of `ghai_balance_platform` column (stays in `user_credits`)
- ❌ No seed from `shop_alpha_master.md` — that doc is a **future rebuild generation spec** (Part 11-13), not a shippable seed for AFS-6a. 400-item rebuild = separate multi-sprint chain (design → art → render → UI rebuild).
- ❌ No PACK_DEFS expansion (currently 3 tiers, spec says 5 — out of scope, future rebuild)
- ❌ No /shop design overhaul — only fix the broken BUY path
- ❌ No Stripe top-up changes (AFS-14a territory)
- ❌ Danish translation of new strings (AFS-28)

---

## CONTEXT

### Why v2 exists
v1 SKILL assumed: "26 cosmetics have COMING SOON · STRIPE button. Pack system exists but not wired to GHAI."

**Reality (from Claude Code live audit 2026-04-24):**
- `/shop/packs` — fully working GHAI BUY via `/api/shop/open-pack` (Mythic supply, optimistic concurrency, downgrade, Universe Wall broadcast, ghai_transactions ledger)
- `CosmeticTab.tsx` — fully working GHAI BUY via `spendGhai()` from `lib/credits/deduct.ts`, writes `user_cosmetics`
- `ShopCosmeticsClient.tsx` — wrapper that mounts CosmeticTab per category — **unmounted orphan**, zero imports in `app/`
- `ShopPage.tsx` (1055 lines) — mounted at `/shop` + `/dk/shop`, ItemModal line 508-523 renders disabled `t.shop.comingSoonStripe` button for 19 STARTER_SHOP_ITEMS from `lib/shop/items.ts` — **this is the only real broken surface**

### Schema reality (do NOT duplicate)
| Concern | Existing (use this) |
|---|---|
| GHAI balance | `user_credits.ghai_balance_platform` (NOT `profiles.ghai_balance`) |
| Card inventory | `user_cards` |
| Cosmetic inventory | `user_cosmetics` |
| Transaction ledger | `ghai_transactions` |
| Mythic scarcity | `mythic_supply` |
| Social broadcast | `universe_wall` |
| Pilot rep | `pilot_reputation` |
| Pack definitions | `lib/game/packs/types.ts` → `PACK_DEFS` (code, not DB) |

### Previous sprint state
- HEAD: `a27f111`
- Tests: **973/973** (AFS-4 added +35; CLAUDE.md canonical)
- Working tree: clean except 5 V3 reference files intentionally untracked
- Supabase: Pro plan, EU Central Frankfurt, project `ihuljnekxkyqgroklurp`

### What MUST NOT change
- `/shop/packs` flow (PackShopClient + `/api/shop/open-pack` — ship-working, do not touch)
- `CosmeticTab.tsx` BUY handler (ship-working)
- `spendGhai()` in `lib/credits/deduct.ts`
- `user_credits`, `user_cards`, `user_cosmetics`, `ghai_transactions`, `mythic_supply` schemas
- `PACK_DEFS` (3 tiers stay — 5-tier expansion is future rebuild)
- `/wallet` page (AFS-2)
- Admin Control Plane (AFS-4)

---

## PRE-FLIGHT (already done — included for audit trail)

Claude Code completed these on 2026-04-24. Re-run as sanity check before Task 1:

```
grep -rn "ShopCosmeticsClient" app/ src/ --include="*.tsx"   # expect: zero app/ imports
grep -n "comingSoonStripe" components/shop/ShopPage.tsx       # expect: line ~508-523
grep -rn "spendGhai" lib/credits/                              # expect: lib/credits/deduct.ts
grep -rn "ghai_balance_platform" lib/ src/ --include="*.ts*"  # expect: user_credits references
cat lib/game/packs/types.ts | grep -A 2 "PACK_DEFS"           # expect: 3 tiers (Standard/Premium/Ultimate)
ls components/shop/                                            # expect: ShopPage, PackShopClient, CosmeticTab, ShopCosmeticsClient
find app -name "page.tsx" -path "*/shop*"                     # expect: app/shop/page.tsx + app/shop/packs/page.tsx
```

**All findings already documented — no second stop point needed. Proceed to Task 1 after sanity check confirms state unchanged since audit.**

---

## TASKS

Build in order. Commit after each task.

### Task 1: SKILL documentation commit

**First commit of the sprint — MUST happen before any code changes.**

```
git add docs/skills/sprint-afs-6a-shop-ghai-flow.md
git commit -m "docs(afs-6a): SKILL v2 based on live codebase audit"
```

---

### Task 2: Mount ShopCosmeticsClient

**Decision:** Mount at `/shop/cosmetics` as new route, AND update `/shop` tabs to link into it. Do NOT replace `/shop` root yet (breaks SEO + existing nav).

**Files created:**
- `app/shop/cosmetics/page.tsx` (thin wrapper, max 40 lines)
- `app/dk/shop/cosmetics/page.tsx` (DK mirror, max 40 lines)

**Logic:**
```typescript
// app/shop/cosmetics/page.tsx
import ShopCosmeticsClient from '@/components/shop/ShopCosmeticsClient';

type SearchParams = { tab?: string };

export default async function ShopCosmeticsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const tab = params.tab ?? 'racing';
  return <ShopCosmeticsClient tab={tab} />;
}
```

(Verify exact `searchParams` signature against Next.js 16 conventions in this repo — AFS-3 used the `await` pattern.)

**Validation:**
- [ ] `/shop/cosmetics?tab=racing` → 200, CosmeticTab renders
- [ ] `/shop/cosmetics?tab=combat` → 200, different category
- [ ] `/shop/cosmetics?tab=packs` → redirects to `/shop/packs` (existing ShopCosmeticsClient logic)
- [ ] `/dk/shop/cosmetics` → 200, DK mirror works
- [ ] No regression on `/shop` root (still ShopPage)

---

### Task 3: Rewire ShopPage.tsx ItemModal BUY button

**File modified:**
- `components/shop/ShopPage.tsx` (lines ~508-523, ItemModal disabled button)

**Current (broken):**
```tsx
<button disabled>
  {t.shop.comingSoonStripe}
</button>
```

**New:**
- If `item.category === 'card_pack'` → redirect to `/shop/packs` (or open PackShopClient inline if already imported)
- If `item.category` in cosmetic categories (`racing`/`combat`/`pilot`/`premium`) → call `spendGhai()` + insert into `user_cosmetics`, matching the pattern already used in `CosmeticTab.tsx`
- On error: show toast, link to `/wallet` if insufficient balance
- On success: toast + optional redirect to `/inventory`

**Implementation notes:**
- REUSE existing helpers: `spendGhai()` from `lib/credits/deduct.ts`, cosmetic grant pattern from `CosmeticTab.tsx`
- DO NOT introduce new server action — the existing path works
- Remove `t.shop.comingSoonStripe` usage from this call site (the translation key can stay in messages/*, but no UI call site)

**Validation:**
- [ ] Click BUY on a cosmetic starter item → spendGhai called → user_cosmetics row added → success toast
- [ ] Click BUY on a card_pack starter item → redirect to `/shop/packs`
- [ ] Click BUY with insufficient balance → error toast with /wallet link
- [ ] No "Coming Soon" button remains in ItemModal
- [ ] Mobile + desktop both work

---

### Task 4: /inventory read page

**Files created:**
- `app/inventory/page.tsx` (max 100 lines — page.tsx hard limit)
- `app/dk/inventory/page.tsx` (DK mirror, max 40 lines)
- `components/inventory/InventoryGrid.tsx` (max 300 lines — component hard limit)

**Scope:**
- Server-rendered, auth-gated (redirect to `/auth/login?redirect=/inventory` if unauthed)
- Reads `user_cards` + `user_cosmetics` for current user
- Tabs/filters: Cards / Cosmetics / All
- Links: "Get more packs → /shop/packs" and "Shop cosmetics → /shop/cosmetics"
- Uses existing RLS (user_cards + user_cosmetics already have `auth.uid() = user_id` policies)

**Validation:**
- [ ] Auth-gated (unauthed → 307 to login)
- [ ] Logged in → shows owned cards + cosmetics
- [ ] Empty state when user owns nothing
- [ ] Filter tabs work
- [ ] RLS verified: second user cannot see first user's inventory

---

### Task 5: Vitest unit tests

**Files created:**
- `tests/afs-6a-shop-rewire.test.ts`

**Cases:**
- ShopPage ItemModal: cosmetic item → BUY handler dispatches cosmetic purchase
- ShopPage ItemModal: card_pack item → BUY handler dispatches redirect
- BUY handler: insufficient balance surfaces error code
- BUY handler: unauthenticated user surfaces redirect to auth
- Inventory page: empty user → empty grid
- Inventory page: user with items → grid renders
- Route `/shop/cosmetics?tab=racing` server component returns ShopCosmeticsClient

**Target:** ~10 new assertions (973 → ~983)

---

### Task 6: Playwright E2E

**Files created:**
- `tests/e2e/afs6a-shop-buy.spec.ts`

**Flow:**
1. Log in as test user with known GHAI balance (seed fixture)
2. Navigate `/shop`
3. Click a cosmetic item tile → modal opens
4. Click BUY → wait for success toast
5. Navigate `/inventory` → expect item visible
6. Navigate `/wallet` → expect balance decreased
7. Navigate `/shop` → click a card_pack tile → BUY redirects to `/shop/packs`

**Validation:**
- [ ] Passes locally (`npm test:playwright` or similar)
- [ ] Passes in CI (3 browsers × 2 shards)

---

## FILE SIZE LIMITS (Tom's rules)

- React components: MAX 300 lines → split
- `page.tsx`: MAX 100 lines → imports only
- `lib/` files: MAX 500 lines
- hooks: MAX 300 lines

`ShopPage.tsx` is already 1055 lines (pre-existing debt). Do NOT make it longer. If rewiring the BUY handler needs helper logic, extract into `lib/shop/buy-handler.ts` — do not inline.

---

## TESTING REQUIREMENTS

### Before commit
- [ ] `npm test` passes
- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] No console errors in dev mode

### Expected test count
- Sprint start baseline: **973** (per CLAUDE.md — AFS-4 shipped +35)
- Sprint end target: **~983 (+10)**
- New Playwright specs: 1
- New Vitest cases: ~7-10

---

## GIT WORKFLOW (EXPLICIT)

### Repo + branch
- Repo: `voidexa-ai/voidexa`
- Local: `C:\Users\Jixwu\Desktop\voidexa`
- Push: `git push origin main` — ONLY
- NEVER: `main:master`, `origin master`, `npx vercel --prod`

### Vercel auto-deploy
- Production branch in Vercel: **main**
- Auto-deploy via GitHub integration, no manual command
- Verify URL: https://voidexa.com after 60-90s

### Before starting
```powershell
cd C:\Users\Jixwu\Desktop\voidexa
git status                                          # must be clean
git pull origin main
git tag backup/pre-sprint-afs-6a-20260424
git push origin backup/pre-sprint-afs-6a-20260424
```

### During sprint
- Task 1: `docs(afs-6a): SKILL v2 based on live codebase audit`
- Task 2: `feat(afs-6a): mount ShopCosmeticsClient at /shop/cosmetics`
- Task 3: `feat(afs-6a): rewire ShopPage ItemModal BUY to spendGhai + packs redirect`
- Task 4: `feat(afs-6a): /inventory page read view`
- Task 5: `test(afs-6a): vitest unit coverage`
- Task 6: `test(afs-6a): playwright e2e shop buy flow`

### After completion
```powershell
git status
git add <reviewed>
git commit -m "test(afs-6a): playwright e2e shop buy flow"
git tag sprint-afs-6a-complete
git push origin main
git push origin sprint-afs-6a-complete
```

### MANDATORY post-push verification
```powershell
git status                                         # MUST be clean
git log origin/main --oneline -3                   # our HEAD
# Wait 60-90s for Vercel
# Jix opens https://voidexa.com/shop and clicks BUY on a cosmetic
```

### Rollback
```powershell
git reset --hard backup/pre-sprint-afs-6a-20260424
git push --force-with-lease origin main
```
NEVER `--force` without `--with-lease`.

---

## SAFETY RULES

- NO force push without `--with-lease`
- NO direct push to master
- NO commit of `.env.local`
- NO commit of service role key
- NO em-dashes in PowerShell scripts
- NO `&&` in PowerShell — use `;`

---

## DEFINITION OF DONE

- [ ] SKILL v2 committed FIRST (docs/skills/sprint-afs-6a-shop-ghai-flow.md)
- [ ] Backup tag pushed
- [ ] `/shop/cosmetics` + `/dk/shop/cosmetics` routes mounted and return 200
- [ ] ShopPage ItemModal BUY no longer shows "Coming Soon · Stripe"
- [ ] Cosmetic BUY on `/shop` goes through `spendGhai` → `user_cosmetics` insert
- [ ] Card pack BUY on `/shop` redirects to `/shop/packs`
- [ ] `/inventory` + `/dk/inventory` routes render with auth gate
- [ ] 973 → ~983 tests, all green
- [ ] Playwright E2E passes
- [ ] `npm run build` succeeds
- [ ] Tagged `sprint-afs-6a-complete`
- [ ] Pushed to `origin/main`
- [ ] `git status` clean post-push
- [ ] `git log origin/main --oneline -3` shows our HEAD
- [ ] Live verified: Jix clicks BUY on voidexa.com/shop and sees inventory update
- [ ] No regressions on `/shop/packs`, `/wallet`, `/control-plane`

**NOT required (scope out):**
- New Supabase tables
- New RPCs
- 400-item catalog rebuild (future sprint chain)
- PACK_DEFS expansion to 5 tiers
- `t.shop.comingSoonStripe` translation key removal from messages (harmless dead key)

---

## BLOCKERS / RISKS

- **Risk:** Rewiring ShopPage BUY path may surface hidden coupling with legacy starter-shop logic → fallback: keep BUY disabled for any item category not in the known cosmetic/card_pack whitelist (explicit log)
- **Risk:** `/shop/cosmetics` route naming conflicts with existing middleware → pre-flight grep in Task 2 should catch
- **Risk:** `user_cosmetics` insert pattern differs subtly from `CosmeticTab.tsx` → copy handler verbatim from existing component, do not re-derive
- **Note:** If during Task 3 it becomes clear that ShopPage's 19 STARTER_SHOP_ITEMS cannot all be mapped cleanly to cosmetic/card_pack categories, document the gap and leave unmapped items disabled with a clearer label ("Unavailable — not part of AFS-6a scope") rather than fake-wiring them

---

## POST-SPRINT DOCUMENTATION

At sprint completion, the SLUT ritual (in separate Project Knowledge chat with Jix) will:

1. Build complete new CLAUDE.md with AFS-6a session log entry
2. Update INDEX files to reflect corrected shop state:
   - `03_VOIDEXA_COM.md` — /shop cosmetics now reachable, /inventory exists
   - `04_KNOWN_ISSUES_ADDENDUM.md` — "Shop 26 cosmetics COMING SOON" entry → resolved
   - `08_LATEST_STATE_DELTA.md` — append AFS-6a commit chain + test count
   - `11_DAILY_VERIFICATION.md` — timestamp update
   - `13_CORRECTIONS_ADDENDUM.md` — new corrections for:
     - Shop surface reality (packs + cosmetics already ship GHAI)
     - Schema: `user_credits.ghai_balance_platform` (NOT `profiles.ghai_balance`)
     - PACK_DEFS = 3 tiers in code (NOT 5 as design spec implies)
     - `shop_alpha_master.md` = future rebuild generation spec, not shippable seed
3. Update `17_BUILD_TEMPLATES.md` with lesson: "SKILL must be built from live codebase audit, not INDEX summaries. INDEX can drift."

---

## TOOLS USED

- Claude Code (`claude-opus-4-7` with `/effort xhigh`)
- Git + GitHub (voidexa-ai/voidexa, push origin main)
- Vercel (auto-deploy via GitHub, production branch = main)
- Supabase (existing tables — no new migrations)
- Vitest 2.1.9
- Playwright (voidexa-tests repo)
- PowerShell (`;` not `&&`, UTF-8 no BOM, ASCII only)

---

**End SKILL v2 AFS-6a**
