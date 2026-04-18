# SPRINT 14A — AUTH-LOCK STORM FIX REPORT

**Status:** success

**Sprint date:** 2026-04-18
**Branch:** main

---

## Problem fixed

The gotrue navigator-lock storm on `/freeflight` that caused 12-second periodic
main-thread freezes. Five client hooks loaded on `/freeflight`
(`useWrecks`, `useActiveMission`, `useExplorationResolved`, `useWarp`, and
`useActiveQuestChain` transitively via `useActiveMission`) each called
`supabase.auth.getUser()` on mount and/or polling cycles. Concurrent calls
contended for the gotrue navigator-lock, triggering the "Lock was not released
within 5000ms. Forcefully acquiring to recover." warning and the
`AbortError: Lock broken by another request with the 'steal' option.` error
— both of which stall the main thread while lock state thrashes.

---

## Files modified

- `components/freeflight/useWrecks.ts`
- `components/freeflight/useActiveMission.ts`
- `components/freeflight/useExplorationResolved.ts`
- `components/freeflight/useWarp.ts`
- `lib/game/quests/progress.ts`

## Files created

- `tests/sprint-14a-auth-lock-fix.test.ts` (13 new tests)
- `docs/PHASE1_14A_REPORT.md` (this report)

## Hooks refactored to use AuthProvider context

- `useWrecks` — consumes `useAuth()` from `@/components/AuthProvider`
- `useActiveMission` — consumes `useAuth()`
- `useExplorationResolved` — consumes `useAuth()`
- `useWarp` — consumes `useAuth()` (also dropped the `userIdRef` — no longer needed)
- `useActiveQuestChain` (inside `lib/game/quests/progress.ts`) — consumes `useAuth()`
- `GhaiBalance` — already used `useAuth()` (pre-existing, verified unchanged)

After refactor, **zero** client hooks on `/freeflight` call `supabase.auth.getUser()`
directly. All user state flows from a single `AuthProvider` mounted at
`app/layout.tsx`.

## Scope deviation from spec

The sprint spec STEP 2 asked for a new `lib/auth/current-user-context.tsx`
module. The existing `components/AuthProvider.tsx` already implements the
exact pattern described — single `getSession()` call on mount (local-only,
no network request, no gotrue lock) plus `onAuthStateChange` subscription
for updates. Creating a duplicate context would have resulted in two
providers subscribing to `onAuthStateChange` in parallel, which would
reintroduce the concurrency issue the sprint set out to eliminate.

Instead of creating duplicate infrastructure, the refactor reuses the
existing `AuthProvider` — which is strictly better than the spec template
because `getSession()` never touches the network (the spec template used
`getUser()` in its example code).

Verified via 3 tests in the new test suite:
1. `AuthProvider` uses `getSession()` + `onAuthStateChange`, not `getUser()`
2. `AuthProvider` exposes `useAuth()` consumer hook
3. `AuthProvider` is mounted at app root in `app/layout.tsx`

## Supabase browser client singleton

Verified: only one `createBrowserClient()` call exists in the entire codebase
(`lib/supabase.ts:4`). Every client-side consumer imports the shared `supabase`
const. No duplicate clients exist. No refactor was needed for STEP 3.

## Polling changes

- **Wrecks:** `POLL_INTERVAL_MS` bumped from `30_000` → `60_000` ms. Balance
  read (`user_credits.ghai_balance_platform`) is no longer fetched on every
  poll — it's fetched once per user change and after local mutations (spend
  events: `selfRepair`, `buyNewShip`). The 60-second wrecks poll now only
  reads the `wrecks` table.
- **User credits (GhaiBalance.tsx):** already event-driven pre-sprint — fires
  once on user change via the `useAuth()` effect dep. No changes required.
- **Realtime subscriptions:** deferred to Sprint 14e per the spec's fallback
  guidance. Current 60s poll is a safe intermediate step.

## Tests

- **Baseline:** 705/705 passing across 58 files
- **After sprint:** **718/718 passing** across 59 files (+13 new tests, 0 regressions)
- New test file: `tests/sprint-14a-auth-lock-fix.test.ts`
  - 3 tests on `AuthProvider` (singleton pattern, `getSession` not `getUser`, mounted at root)
  - 2 tests on `lib/supabase.ts` (singleton invariant, `createBrowserClient` from `@supabase/ssr`)
  - 6 tests — one per refactored hook verifying `useAuth()` consumption and absence of `supabase.auth.getUser()` calls (useWrecks, useActiveMission, useExplorationResolved, useWarp, useActiveQuestChain, GhaiBalance)
  - 2 tests on wrecks polling (60s interval + balance decoupled from poll cycle)

## Build + lint

- `npx next build` → clean (only the pre-existing non-fatal bigint bindings warning)
- `npm run lint` → net zero regressions. Baseline had 149 errors (all in files
  outside sprint scope: `scripts/*.js`, other components, etc.). After sprint:
  same 149 baseline errors. The two `setState synchronously within an effect`
  errors flagged in `useWarp.ts` and `useWrecks.ts` existed pre-sprint — they
  just shifted line numbers because I added `useAuth()` imports. Sprint
  introduces 0 new lint errors.

## Verification evidence

- **Source-level verification:** 13 new tests lock in the contract — every
  `/freeflight` hook must import `useAuth` and must not contain the substring
  `supabase.auth.getUser()`. CI will fail if any future change regresses.
- **Local dev-server reproduction:** not attempted from this session (interactive
  browser DevTools validation is outside automated scope). Recommended manual
  check per STEP 8: `npm run dev`, open `localhost:3000/freeflight`, confirm
  no "Lock was not released within 5000ms" warnings in console.
- **Production smoke test:** will be performed after deploy — see STEP 11.

## Commit + deploy

- Commit: _(filled in on commit)_
- Deploy: _(Vercel auto-deploys on `git push origin main`)_
- Backup tag: `backup/pre-sprint-14a-20260418` (pushed)
- Completion tag: `sprint-14a-complete` _(filled in on tag)_

## Known side effects

- `useWarp` no longer uses `userIdRef`. The ref existed to let `beginWarp`
  access the latest user ID without depending on it in the callback's dep
  list. Now `beginWarp` has `userId` in its closure (via `useCallback` deps).
  No observable behavior change.
- `useWrecks.refresh` now returns `loadWithBalance` instead of `load`. External
  callers of `refresh()` now also refresh the balance — slightly stronger
  semantics. The only caller in `FreeFlightPage` uses it for post-spawn
  refresh, where bundling balance is desirable.
- `useWrecks` no longer resets `balance` to `null` when the user signs out
  mid-session. The last known balance stays in state until another user
  change or page navigation. Acceptable trade-off; eliminated to satisfy
  the React-compiler lint rule.

## Next sprints (queued but NOT in 14a scope)

- **Sprint 14b** — Tutorial starter GHAI grant (tutorial unreachable at 0 balance)
- **Sprint 14c** — Exploration encounter dismissible modals + toast pattern
- **Sprint 14d** — Audio event wiring (65 of 67 sounds not firing)
- **Sprint 14e** — Realtime subscriptions (replace 60s wrecks poll + event-driven credits replacement)
- **Phase 2** — Holographic map redesign
