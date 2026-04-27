# SKILL v2 — AFS-6b: Real-world GHAI Commerce UX

**Sprint:** AFS-6b
**Status:** 🔄 v2 reshape after pre-flight (v1 had 5 wrong assumptions)
**Priority:** P0
**Repo:** `voidexa-ai/voidexa` (main branch)
**Depends on:** AFS-6a ✅ complete (`bf1ce98`) + AFS-6a-fix ✅ (`6144e08`)
**Parallel-safe with:** AFS-5 ✅ done, AFS-24b/c/d, GHAI top-up modal investigation
**Blocks:** AFS-6c (Shop v1 catalog reuses copy decisions locked here)

**Test baseline at start:** 1168/1168 (post Sprint 1 CommBubble Hotfix `aae6b64`)
**Backup tag to create FIRST:** `backup/pre-afs-6b-YYYYMMDD`

**Model:** `claude-opus-4-7`
**Execution flag:** `claude --dangerously-skip-permissions`

---

## v1 → v2 RESHAPE LOG (pre-flight findings 2026-04-27)

| # | v1 assumption | Reality | v2 fix |
|---|---|---|---|
| 1 | One `ContactForm.tsx` with checkboxes | TWO files: `app/contact/page.tsx` + `components/GetInTouchModal.tsx` with toggle pills | Task 1 updates BOTH, uses pills not checkboxes |
| 2 | AEGIS/Comlink/WebBuilder/Consulting have own pages | Only section cards on bundle pages (`/products`, `/apps`, `/services`, `/ai-tools`) | Task 2 places notice on all 4 bundle pages over relevant section cards |
| 3 | FAQ page may exist | No FAQ route exists | Task 4 deferred to follow-up sprint, documented in 09_WISHES_PENDING.md |
| 4 | Resend kontakt-pipeline | Supabase edge function `notify` handles delivery | Risk callout updated; test verifies edge fn payload still parses |
| 5 | `src/` path option | Only `app/` (Next.js 16 App Router) | Stylistic note, no functional change |

**Pre-flight v1 outcome:** Claude Code grep run completed 2026-04-27, ~12 min runtime. v1 SKILL would have shipped wrong code on Task 1 (wrong file path, wrong UI primitive) and Task 4 (route doesn't exist). v2 is the actual sprint that should ship.

**Strategic decision Apr 27:** Task 2 covers ALL 4 bundle pages, not just /products. Disambiguation must be consistent across every sales surface — partial coverage creates false sense of compliance + weakens 2-year reklamationsret defensive position. AFS-6c later inherits locked copy with no further decisions needed.

---

## SCOPE (what + why)

### What
Disambiguate GHAI vs DKK/EUR payment surfaces across voidexa.com so users never confuse in-game GHAI currency with real-world product purchases.

### Why
**GHAI model LOCKED Apr 22 2026:**
- GHAI = in-game cosmetics + pay-per-use AI services (Void Chat, Quantum Chat) + wallet top-up only
- GHAI ≠ real-world products
- Real-world products = DKK/EUR direct via Stripe with 2-year DK reklamationsret

Current UI does not enforce this separation. Two contact surfaces conflate Void Chat with Ghost AI Services. Bundle pages have no payment-mode disclaimer. /wallet does not explain GHAI scope.

### Why NOW (before AFS-6c)
AFS-6c (Shop v1 catalog) reuses the exact copy strings AFS-6b defines. If 6c ships first, copy decisions split across two sprints and drift. Lock copy here, reference it in 6c.

---

## WHAT MUST NOT CHANGE

- `/shop` ItemModal BUY rewire (AFS-6a)
- `/shop/cosmetics` spendGhai flow (AFS-6a)
- `/shop/packs` GHAI pack purchase + Mythic supply (AFS-6a)
- `/inventory` page (AFS-6a)
- `/wallet` GHAI balance + Stripe top-up tiers ($5/$10/$25/$50)
- Universe dropdown 9-item structure (AFS-6a-fix)
- ShopCrossNav cyan/gold pills (AFS-6a-fix)
- Cards art generation (AFS-5 ✅ done, output in `images_tiered/` on Jix PC)
- Battle Scene v2 / Universal Skybox (AFS-6g)
- Supabase edge function `notify` payload schema (Task 1 verifies, doesn't change)

---

## CONFIRMED FILE PATHS (from pre-flight, do NOT re-grep)

- Contact form A: `app/contact/page.tsx`
- Contact form B (modal): `components/GetInTouchModal.tsx`
- Bundle pages: `app/products/page.tsx`, `app/apps/page.tsx`, `app/services/page.tsx`, `app/ai-tools/page.tsx`
- Wallet: `app/wallet/page.tsx`
- i18n dictionaries: `lib/i18n/en.ts`, `lib/i18n/da.ts`
- DK wallet (if mirror exists): `app/dk/wallet/page.tsx` — verify before Task 3 DK section

If any of these paths are wrong despite pre-flight saying they're correct → STOP, ask Jix.

---

## TASKS (execute in order, commit after each)

### Task 0: SKILL.md v2 commit FIRST + backup tag

```bash
cd C:\Users\Jixwu\Desktop\voidexa
git checkout main
git pull origin main
git tag backup/pre-afs-6b-$(date +%Y%m%d)
git push origin backup/pre-afs-6b-$(date +%Y%m%d)

# Place SKILL v2 at: skills/AFS-6b-realworld-ghai-ux/SKILL.md (overwrites v1)
git add skills/AFS-6b-realworld-ghai-ux/SKILL.md
git commit -m "docs(afs-6b): SKILL v2 reshape after pre-flight findings"
git push origin main
```

**Checkpoint:** Confirm SKILL v2 is on origin/main BEFORE Task 1. STOP.

---

### Task 1: Both contact surfaces — pills update

**File A:** `app/contact/page.tsx`
**File B:** `components/GetInTouchModal.tsx`

**Current state:** Both files use toggle-pill pattern (not checkboxes). One pill labeled `"ghost-ai"` or similar. No `"void-chat"` option.

**Changes (apply identically to both files):**
1. Replace pill label `"ghost-ai"` (or current Ghost AI variant) with `"Ghost AI Services (GHAI Token)"`
2. Add new pill: `"Void Chat"`
3. Both pills should serialize their selected state into the form payload sent to Supabase edge function `notify`
4. Verify the edge function payload schema accepts both new field values without breaking — if schema requires update, that's a separate sub-task (notify Jix, do not change schema unilaterally)

**EN copy (proper nouns, do not translate):**
- `Ghost AI Services (GHAI Token)` — for AI service inquiries (Void Chat, Quantum Chat pay-per-use)
- `Void Chat` — separate pill for the in-game Void Chat product

**DK strings (only if `/dk/contact` exists):** Same EN strings (proper nouns left in English).

**Commit:**
```bash
git commit -m "feat(afs-6b): update both contact surfaces — pill labels + Void Chat option"
```

---

### Task 2: RealWorldPaymentNotice across all 4 bundle pages

**New component:** `components/shop/RealWorldPaymentNotice.tsx`

Single source of truth for the disclaimer copy. Used 4 places.

**EN copy:**
```
Paid in DKK/EUR via Stripe. GHAI tokens not accepted for this product.
2-year Danish reklamationsret included.
```

**DK copy (if DK route exists for that bundle, otherwise skip the DK render):**
```
Betales i DKK/EUR via Stripe. GHAI gælder ikke her.
2 års dansk reklamationsret er inkluderet.
```

**Placement (4 files):**

1. **`app/products/page.tsx`** — banner above the AEGIS/Comlink/Website Builder/Consulting section cards (whichever subset lives here)
2. **`app/apps/page.tsx`** — banner above relevant real-world product section cards
3. **`app/services/page.tsx`** — banner above relevant real-world product section cards
4. **`app/ai-tools/page.tsx`** — banner above relevant real-world product section cards

**Logic:** If a bundle page mixes GHAI-eligible items (in-game) with real-world items, the banner only renders above the real-world section, not the entire page. If a bundle page has zero real-world items → skip that page entirely (don't render banner).

**Pre-task check inside Task 2:** Quickly grep each of the 4 bundle pages to confirm which contain AEGIS/Comlink/Website Builder/Consulting section cards. Render notice only on those that do. Document which pages got the banner in the commit message.

**Commit:**
```bash
git commit -m "feat(afs-6b): RealWorldPaymentNotice on bundle pages with real-world products"
```

---

### Task 3: /wallet page clarification section

**File:** `app/wallet/page.tsx`
**File (DK if exists):** `app/dk/wallet/page.tsx`

**Add new section below the GHAI balance display:**

**EN heading:** `What can I use GHAI for?`

**EN body:**
```
GHAI can be used for:
• In-game cosmetic packs (booster packs, ship skins, pilot avatars)
• Pay-per-use AI services (Void Chat sessions, Quantum Chat debates)
• Wallet top-ups via Stripe ($5 / $10 / $25 / $50 tiers)

GHAI cannot be used for:
• Real-world products (AEGIS Monitor, Comlink Node, Website Builder, AI Consulting)
• Subscription billing
• Trading bot fees

For real-world products, see /products — payment in DKK/EUR via Stripe.
```

**DK body (only if `/dk/wallet` exists, otherwise defer to AFS-26):**
```
GHAI kan bruges til:
• In-game kosmetiske pakker (booster packs, ship skins, pilot avatars)
• Pay-per-use AI-tjenester (Void Chat sessions, Quantum Chat debates)
• Wallet top-up via Stripe ($5 / $10 / $25 / $50)

GHAI kan IKKE bruges til:
• Fysiske produkter (AEGIS Monitor, Comlink Node, Website Builder, AI Consulting)
• Abonnement
• Trading bot gebyrer

Til fysiske produkter, se /products — betaling i DKK/EUR via Stripe.
```

**Commit:**
```bash
git commit -m "feat(afs-6b): /wallet GHAI scope clarification section (EN + DK if mirror exists)"
```

---

### Task 4: FAQ DEFERRED — document gap

No FAQ route exists per pre-flight finding. Adding one in this sprint doubles scope.

**Action this sprint:** Create entry in `docs/wishes-pending.md` (or whatever existing follow-up doc lives in repo — verify path):

```
## FAQ surface for GHAI vs DKK/EUR (deferred from AFS-6b)

Need 3 Q&A entries:
1. "Can I pay for AEGIS/Comlink/Website Builder/Consulting with GHAI?" → No, real-world = DKK/EUR via Stripe
2. "What's the difference between Void Chat and Ghost AI?" → Void Chat = in-game AI; Ghost AI Services = pay-per-use AI products billed in GHAI
3. "Why is GHAI not accepted for real-world products?" → Danish consumer law (reklamationsret) requires legal tender for physical goods

When FAQ surface is built (post-AFS-6c?), add these as initial seed content.
```

**Update INDEX file at SLUT:** add same gap to `09_WISHES_PENDING.md` in Project Knowledge.

**Commit:**
```bash
git commit -m "docs(afs-6b): defer FAQ surface to follow-up sprint, document gap"
```

---

### Task 5: Tests

**Coverage targets:**
1. `app/contact/page.tsx` renders both pills: `Ghost AI Services (GHAI Token)` + `Void Chat` (separate elements)
2. `components/GetInTouchModal.tsx` renders both pills (separate elements)
3. `<RealWorldPaymentNotice />` component renders correct EN copy with DKK/EUR + reklamationsret string
4. RealWorldPaymentNotice rendered exactly once per bundle page that contains real-world products (no double render)
5. /wallet page renders the GHAI scope clarification heading
6. Form submission: both new pill states serialize into payload sent to Supabase edge fn `notify` (mock-test, no live email)
7. (DK) /dk/wallet renders DK clarification IF mirror file exists
8. (Negative) Bundle pages with zero real-world products do NOT render the notice

**Target:** +8 tests minimum. Test count after sprint: ~1176/1176.

```bash
npm test
# All green before commit
git commit -m "test(afs-6b): coverage for disambiguation copy + edge fn payload"
```

---

### Task 6: Build + lint
```bash
npm run build
npm run lint
```

Both must pass. Fix any issues before push.

---

## GIT WORKFLOW

```bash
# Pre-sprint (Task 0 already covered backup + SKILL commit)

# Sprint completion
git status                                     # working tree clean
git tag sprint-afs-6b-complete
git push origin main
git push origin sprint-afs-6b-complete

# Mandatory post-push verification
git status                                     # clean
git log origin/main --oneline -8               # last 8 commits visible incl. ours
```

---

## DEFINITION OF DONE

- [ ] SKILL v2 committed FIRST on origin/main
- [ ] Backup tag pushed: `backup/pre-afs-6b-YYYYMMDD`
- [ ] Both contact surfaces have 2 pills: `Ghost AI Services (GHAI Token)` + `Void Chat`
- [ ] Edge function `notify` payload schema verified compatible (no schema change unless flagged)
- [ ] `<RealWorldPaymentNotice />` component exists in `components/shop/`
- [ ] All 4 bundle pages with real-world products render the notice (none missing, none double-render)
- [ ] /wallet has GHAI scope clarification section (EN, +DK if /dk/wallet exists)
- [ ] FAQ deferred + gap documented in repo wishes file + 09_WISHES_PENDING.md
- [ ] Tests: 1168 → ~1176, all green
- [ ] `npm run build` passes
- [ ] `npm run lint` clean
- [ ] Sprint tag `sprint-afs-6b-complete` pushed
- [ ] `git status` clean post-push
- [ ] `git log origin/main --oneline` shows our HEAD
- [ ] Live verified on voidexa.com (Jix permission required for browser audit)
- [ ] CLAUDE.md updated with sprint entry
- [ ] No regression on /shop, /shop/cosmetics, /shop/packs, /inventory, /wallet GHAI flow

---

## BLOCKERS / RISKS

- **Risk:** Supabase edge fn `notify` payload schema breaks if pill names change → MUST mock-test in Task 5; if schema needs update, STOP and notify Jix before changing edge fn code
- **Risk:** Some bundle pages (/apps, /services, /ai-tools) may have zero real-world products → skip notice on those; document which pages got it in Task 2 commit message
- **Risk:** DK copy drift between EN dictionary and DA dictionary → only update DA where DK route exists today; full DK i18n rebuild = AFS-26
- **Risk:** GHAI top-up modal stuck-open bug (separate P0) is on the same wallet surface → do NOT touch the modal in this sprint; document in 04_KNOWN_ISSUES.md if encountered
- **Risk:** Live audit blocked unless Jix permits Chrome bridge

---

## OUT OF SCOPE (defer)

- Building real-world Shop v1 catalog → AFS-6c
- Stripe checkout for real-world products → AFS-6c v2
- B2B portal / Claim Planet → AFS-35
- Full Danish translation of all 4 surfaces → AFS-26
- GHAI top-up modal stuck-open investigation → separate sprint
- AEGIS / Comlink / Website Builder / Consulting product page CONTENT (specs, pricing) → AFS-6c
- FAQ surface build → follow-up sprint after AFS-6c
- Supabase edge fn `notify` schema changes → flag to Jix, separate decision

---

## ROLLBACK

```bash
git reset --hard backup/pre-afs-6b-YYYYMMDD
git push --force-with-lease origin main
git push origin :refs/tags/sprint-afs-6b-complete   # only if tag was pushed
```

---

**End of SKILL v2.**

Pre-flight already done. Proceed straight to Task 0. STOP at every checkpoint marked above.
