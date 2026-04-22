# SPRINT AFS-2 — AUTH ROUTE INFRASTRUCTURE
## Skill file for Claude Code
## Location: docs/skills/sprint-afs-2-auth-routes.md

---

## SCOPE

Close all 404 holes in the authentication + account surface. Users currently land on dead pages when they type natural URLs (`/login`, `/signup`, `/wallet`, `/settings`, `/account`). Only `/auth/login`, `/auth/signup`, and `/profile` return 200.

This sprint makes every reasonable entry point resolve to the correct destination — through redirects for canonical variants, and through new pages for `/wallet` and `/settings`.

**Sprint delivers:**
- 8 Next.js redirects in `next.config.js` (or equivalent `middleware.ts` rewrites)
- New page: `/wallet` (binds to existing wallet backend APIs)
- New page: `/settings` (user account settings)
- Redirect: `/account` → `/profile`
- Unit tests for redirects + page rendering
- Live verification all routes resolve

**Sprint does NOT cover:**
- Password reset flow (separate sprint)
- 2FA / MFA
- OAuth provider expansion beyond existing Supabase auth
- Wallet feature additions — this sprint only exposes existing backend as a page
- Settings feature depth — MVP fields only (name, email, language, notification prefs)

---

## CONTEXT

### Why this sprint

Live audit Apr 21-22 (BATCH 2) confirmed these 404s exist. Every external link, bookmark, or user guess on common auth URLs breaks. SEO-penalty and user-trust damage compound daily.

### Existing infrastructure (DO NOT rebuild)

From GROUND_TRUTH.md + 14_BASELINE_AUDIT_MAP.md:

**Wallet backend — LIVE on voidexa.com since Apr 11:**
- `app/api/wallet/route.ts` (GET balance)
- `app/api/wallet/credit/route.ts`
- `app/api/wallet/deduct/route.ts`
- `app/api/wallet/topup/route.ts` (Stripe top-up $5/$10/$25/$50)
- `app/api/wallet/webhook/route.ts` (`checkout.session.completed`)
- Supabase tables: `user_wallets`, `wallet_transactions`, `quantum_sessions`
- Stripe webhook: `we_1TLluLDVfBjAC4z8878uAbqXl` active
- Price ID: `STRIPE_PRICE_ID_PRO = price_1TEzSKRIEeuF5a1EnLjJnUXA`

**Existing component — reuse:**
- `WalletBar` component (currently embedded in `/quantum/chat`)
- Shows balance + $5/$10/$25/$50 Stripe top-up buttons
- Already handles Stripe checkout redirect + return

**Existing pages — reference for style match:**
- `/profile` (178 lines) — existing user account page, layout pattern
- `/auth/login`, `/auth/signup` (163 lines) — existing auth forms

**Auth system:** Supabase auth via `createServerClient` / `createBrowserClient`. `/api/auth/role` returns role from `profiles` table. `ceo@voidexa.com` is hardcoded admin (see `is_admin()` SECURITY DEFINER).

### Next.js version

`Next.js 16.2.3`, `React 19.2.4`. Redirects and new pages use App Router conventions (`app/` directory, `page.tsx`, server components by default).

---

## TASKS

### Task 1 — Redirects in `next.config.js`

Add `redirects()` async function. Use **permanent redirects (308)** for canonical auth aliases — these should be cached by browsers and search engines.

```javascript
async redirects() {
  return [
    { source: '/login',    destination: '/auth/login',  permanent: true },
    { source: '/signin',   destination: '/auth/login',  permanent: true },
    { source: '/signup',   destination: '/auth/signup', permanent: true },
    { source: '/register', destination: '/auth/signup', permanent: true },
    { source: '/auth/signin',   destination: '/auth/login',  permanent: true },
    { source: '/auth/register', destination: '/auth/signup', permanent: true },
    { source: '/account',  destination: '/profile',     permanent: true },
  ]
}
```

**DK mirror redirects** — if `/dk/login`, `/dk/signup`, etc. are reachable, add matching entries:

```javascript
{ source: '/dk/login',    destination: '/dk/auth/login',  permanent: true },
{ source: '/dk/signin',   destination: '/dk/auth/login',  permanent: true },
{ source: '/dk/signup',   destination: '/dk/auth/signup', permanent: true },
{ source: '/dk/register', destination: '/dk/auth/signup', permanent: true },
{ source: '/dk/account',  destination: '/dk/profile',     permanent: true },
```

**If `app/dk/auth/login` does NOT exist**, either:
- Skip DK auth redirects (English auth pages work for DK users too)
- OR add DK auth pages as stubs that re-export EN auth pages with DK metadata (same pattern as AFS-7 DK legal pages)

**Decision:** Follow AFS-7 pattern — re-export EN auth pages under `/dk/auth/*` with DK metadata. This keeps SEO clean and localized nav links work.

**Validation:** After Vercel deploy, each canonical should respond with `HTTP 308` and `Location:` header pointing to destination. Browser follows automatically. `curl -I https://voidexa.com/login` must show `308` not `404`.

**File touched:** `next.config.js` (or `next.config.mjs`).

---

### Task 2 — Build `/wallet` page

**Location:** `app/wallet/page.tsx`

**Purpose:** Standalone wallet management page. Users navigate here from nav or typed URL. Shows balance, top-up options, recent transactions.

**Layout pattern:** Match `/profile` page structure (server component wrapping client component for interactive parts).

**Server component (`app/wallet/page.tsx`):**
- Max 100 lines (page.tsx limit per file size rules)
- Auth check — if unauthenticated, redirect to `/auth/login?redirect=/wallet`
- Fetch balance server-side via Supabase service role
- Fetch last 10 `wallet_transactions` for current user
- Render layout shell, pass data to client component

**Client component (`components/wallet/WalletPageClient.tsx`):**
- Max 300 lines
- Receives balance + transactions as props
- Embeds existing `WalletBar` component (or equivalent — check actual component name with `git grep WalletBar components/`)
- Shows transaction history table (date, type, amount USD, GHAI delta, Stripe session_id if topup)
- "Insufficient balance" onboarding link to `/ghost-ai` for GHAI info

**Metadata:**
```typescript
export const metadata = {
  title: 'Wallet — voidexa',
  description: 'Manage your voidexa wallet balance and top up with Stripe.',
}
```

**DK mirror:** `app/dk/wallet/page.tsx` — re-export pattern. DK title, DK description.

**Files added:**
- `app/wallet/page.tsx`
- `app/dk/wallet/page.tsx`
- `components/wallet/WalletPageClient.tsx`

**Reuse (do NOT duplicate):**
- Existing `WalletBar` component
- Existing API routes under `/api/wallet/*`
- Existing Supabase helpers in `lib/supabase/`

---

### Task 3 — Build `/settings` page

**Location:** `app/settings/page.tsx`

**Purpose:** User account settings. MVP scope only. Settings that already exist somewhere in the codebase get surfaced; new settings go in a later sprint.

**MVP fields:**
- Display name (read/update `profiles.display_name`)
- Email (read-only, shows current email from auth)
- Language preference (`en` | `da`) — writes to `profiles.locale` if column exists, else stores in `localStorage` fallback
- Notification preferences — stubbed with "Coming soon" toggle (visual only, no backend)
- Logout button (calls existing auth signout)
- Delete account (links to `/contact` with pre-filled subject "Delete account request" — actual deletion is manual via support until GDPR automation sprint)

**Sections:**
1. Profile
2. Preferences
3. Danger zone

**Server component pattern:** same as `/wallet` — auth check, redirect to `/auth/login?redirect=/settings` if unauthenticated, fetch profile, pass to client component.

**Client component (`components/settings/SettingsPageClient.tsx`):**
- Form fields for editable values
- Save button triggers `PATCH /api/user/profile` (if route exists) or inline `supabase.from('profiles').update()` with RLS
- Toast on save success/failure
- Logout button calls `supabase.auth.signOut()` then redirects to `/`

**Check first:**
- `git grep "from('profiles')" app/` — find existing profile update pattern
- `git grep "auth.signOut" components/` — find existing logout button, reuse its handler

**Files added:**
- `app/settings/page.tsx`
- `app/dk/settings/page.tsx`
- `components/settings/SettingsPageClient.tsx`

**Optional (only if route doesn't exist):**
- `app/api/user/profile/route.ts` with PATCH handler

---

### Task 4 — Nav link hookup

**Why:** New pages exist but nothing links to them.

**Touch:**
- Find user menu component (likely `components/nav/UserMenu.tsx` or `components/header/`). `git grep "/profile" components/` should pinpoint.
- Add "Wallet" and "Settings" entries in user dropdown (beneath existing "Profile" link).
- DK nav gets DK labels: "Tegnebog" (Wallet), "Indstillinger" (Settings).

**Do NOT add these to main top-nav.** They belong in the authenticated user dropdown only.

---

### Task 5 — Unit tests

**Redirect tests** — `tests/redirects.spec.ts`:
```typescript
// Example shape — adapt to existing Playwright setup (voidexa-tests uses Playwright)
test('login redirects to auth/login', async ({ page }) => {
  const response = await page.goto('/login', { waitUntil: 'domcontentloaded' })
  expect(response?.status()).toBeLessThan(400)
  expect(page.url()).toContain('/auth/login')
})
```
Cover all 7 EN redirects + `/account` → `/profile`. DK mirrors if added.

**Wallet page tests** — `tests/wallet-page.spec.ts`:
- Unauthenticated visit → redirects to `/auth/login?redirect=/wallet`
- Authenticated visit → renders WalletBar, shows balance

**Settings page tests** — `tests/settings-page.spec.ts`:
- Unauthenticated redirect
- Display name update persists (mock Supabase)
- Logout button triggers signOut

**Smoke test** — `tests/auth-routes-smoke.spec.ts`:
- Every canonical auth URL returns a final 200 after redirects
- `/wallet`, `/settings`, `/profile` all render key elements

Target: **+15 to +25 new tests.** Final count should be ~875-885 green (was 860).

---

### Task 6 — Live verification

After Vercel deploy (~90s):

**curl checks (from any terminal):**
```bash
for path in /login /signin /signup /register /auth/signin /auth/register /account; do
  echo "$path:"
  curl -sI "https://voidexa.com$path" | head -2
done

for path in /wallet /settings /profile; do
  echo "$path:"
  curl -sI "https://voidexa.com$path" | head -1
done
```

**Expected:**
- 7 redirect URLs → `HTTP/2 308` + `location:` header pointing at `/auth/login`, `/auth/signup`, or `/profile`
- `/wallet`, `/settings`, `/profile` → `HTTP/2 200` (or `HTTP/2 307` to `/auth/login?redirect=...` if not authenticated — both are acceptable)

**Browser checks (incognito):**
- Type `voidexa.com/login` → lands on auth/login form with voidexa styling
- Type `voidexa.com/wallet` (unauthenticated) → redirects to `/auth/login?redirect=/wallet`
- Log in with test account → lands back on `/wallet`, sees balance + top-up buttons
- Navigate to `/settings` → sees profile form, update display name, save → toast confirms, value persists on reload

---

## GIT WORKFLOW

### Pre-sprint

```bash
cd C:\Users\Jixwu\Desktop\voidexa
git status                                       # must be clean
git pull origin main                             # sync with AFS-7 state (HEAD e33a344)
git tag backup/pre-sprint-afs-2-20260422
git push origin backup/pre-sprint-afs-2-20260422
```

### SKILL commit (first, separately)

```bash
git add docs/skills/sprint-afs-2-auth-routes.md
git commit -m "chore(afs-2): add sprint SKILL documentation"
git push origin main
```

### Implementation commits (one per task group)

```bash
# After Task 1 (redirects + tests)
git add next.config.js tests/redirects.spec.ts
git commit -m "feat(afs-2): 308 redirects for canonical auth aliases"

# After Task 2 (wallet page)
git add app/wallet app/dk/wallet components/wallet
git commit -m "feat(afs-2): /wallet page binds existing backend APIs"

# After Task 3 (settings page)
git add app/settings app/dk/settings components/settings app/api/user
git commit -m "feat(afs-2): /settings page MVP"

# After Task 4 (nav)
git add components/nav
git commit -m "feat(afs-2): wallet + settings in user dropdown"

# After Task 5 (remaining tests)
git add tests/
git commit -m "test(afs-2): wallet/settings/smoke coverage"
```

### Post-implementation validation

```bash
npm test                                         # must be 875+ green
npm run build                                    # must succeed, no type errors
git push origin main
git status                                       # working tree clean
git log origin/main --oneline -5                 # verify all commits on remote
```

### Tag

```bash
git tag sprint-afs-2-complete
git push origin sprint-afs-2-complete
```

### Post-sprint (session log)

Append entry to `CLAUDE.md` under the latest sprint history block:

```markdown
### Session 2026-04-22 — Sprint AFS-2: Auth Route Infrastructure

**Status:** Complete.
**Tag:** sprint-afs-2-complete
**HEAD:** [commit hash]
**Tests:** [N]/[N] green (was 860, +[delta])
**Backup:** backup/pre-sprint-afs-2-20260422

**Routes shipped:**
- 7 canonical redirects (308): /login, /signin, /signup, /register, /auth/signin, /auth/register, /account
- New page: /wallet (+ /dk/wallet)
- New page: /settings (+ /dk/settings)

**Verified live:**
- All redirects respond 308 with correct Location
- /wallet renders WalletBar + transaction history
- /settings saves display name successfully

**Rollback:** git reset --hard backup/pre-sprint-afs-2-20260422 && git push origin main --force-with-lease
```

Update `11_DAILY_VERIFICATION.md` timestamp + HEAD + test count + active sprints table (mark AFS-2 complete, AFS-3 next).

---

## DEFINITION OF DONE

All must be true before tagging `sprint-afs-2-complete`:

- [ ] `next.config.js` contains 7 EN redirects (+ DK mirrors if DK auth pages exist)
- [ ] `app/wallet/page.tsx` renders authenticated users' balance + top-up + transaction history
- [ ] `app/settings/page.tsx` allows display name + language update, saves to `profiles` table
- [ ] `/account` redirects to `/profile`
- [ ] User dropdown contains "Wallet" and "Settings" links (EN + DK)
- [ ] Unit tests green: redirects, wallet page auth gate, settings page save flow
- [ ] `npm test` — 875+ green (was 860)
- [ ] `npm run build` — no errors
- [ ] All commits on `origin/main`, working tree clean
- [ ] `curl -I` confirms: every 404'd auth URL from BATCH 2 audit now returns 308 or 200 on voidexa.com
- [ ] Incognito browser test: type `/login` → lands on auth form; type `/wallet` (unauthed) → redirect to login; log in → back to wallet with balance visible
- [ ] `sprint-afs-2-complete` tag pushed
- [ ] `CLAUDE.md` session log + `11_DAILY_VERIFICATION.md` updated
- [ ] ZERO regressions: existing `/auth/login`, `/auth/signup`, `/profile`, `/quantum/chat` still work identically

---

## ROLLBACK

If anything fails validation:

```bash
git reset --hard backup/pre-sprint-afs-2-20260422
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-2-complete   # only if tag was pushed
```

Do **NOT** tag complete if any checkbox above is unchecked. Document what failed in CLAUDE.md under "Blocked sprints" and report back.

---

## DEPENDENCIES + NOTES

**Unblocks:**
- AFS-3 (Game Hub 404 fixes) — independent, can run parallel
- AFS-6a (Shop GHAI flow) — depends on `/wallet` existing for top-up redirect UX

**Parallel-safe with:** AFS-4, AFS-5 (no shared files)

**Risks:**
- `next.config.js` redirect conflicts with `middleware.ts` rewrites — if middleware handles locale prefix (`/dk/*`), test DK redirects carefully
- `WalletBar` component may be tightly coupled to `/quantum/chat` context — may need light refactor to accept optional props for standalone use
- `profiles.locale` column may not exist — check migration history, add column via Supabase migration if needed (new commit: `chore(afs-2): add profiles.locale column`)

**File size watch:**
- `app/wallet/page.tsx` max 100 lines
- `components/wallet/WalletPageClient.tsx` max 300 lines
- Same limits for settings equivalents

**Authority hierarchy (if conflict arises):**
1. Live audit via Claude in Chrome
2. GROUND_TRUTH.md raw log
3. INDEX files (00-18)
4. userMemories
5. Claude session context

Never guess. Search INDEX → raw → past chats → only ask Jix if exhausted.
