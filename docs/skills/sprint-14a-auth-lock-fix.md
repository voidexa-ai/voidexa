# SPRINT 14A — SUPABASE AUTH-LOCK STORM FIX
## Skill file for Claude Code
## Location: C:\Users\Jixwu\Desktop\voidexa\docs\skills\sprint-14a-auth-lock-fix.md

---

## SCOPE — READ THIS FIRST

**This sprint fixes ONE problem only: the main-thread freeze storm on `/freeflight`.**

Free Flight freezes ~12 seconds every ~12 seconds. Game unplayable. Root cause: concurrent `supabase.auth.getUser()` calls from multiple hooks create a gotrue navigator-lock storm — the lock gets acquired, held past the 5000ms timeout, forcefully stolen by the next caller, then stolen again, in a repeating cycle that blocks the main thread.

**This sprint does NOT touch:**
- Tutorial starter GHAI grant (Sprint 14b)
- Encounter modal UX (Sprint 14c)
- Audio wiring (Sprint 14d+)
- Holographic map redesign (deferred to Phase 2)
- Any gameplay logic, 3D scene, shaders, or game mechanics
- Any file outside the authentication / data-fetching hook layer

If Claude Code finds itself wanting to fix something else during this sprint, STOP and report. This sprint has surgical scope on purpose.

---

## ROOT CAUSE (verified by gameplay audit 2026-04-18)

### Observed symptoms
- Frame-gap monitor captured deterministic 12-second freezes every 12 seconds
- Console spams: `@supabase/gotrue-js: Lock "lock:sb-<project>-auth-token" was not released within 5000ms. Forcefully acquiring the lock to recover.`
- Followed by: `AbortError: Lock broken by another request with the 'steal' option.`
- Network panel shows a 3-call polling cycle every ~12 seconds:
  1. `GET supabase.co/auth/v1/user`
  2. `GET /rest/v1/wrecks?phase=in.(protected,abandoned)`
  3. `GET /rest/v1/user_credits?user_id=eq.<uuid>`

### Why it happens
Multiple React hooks each call `supabase.auth.getUser()` on their own polling interval or effect. Each call wraps itself in the gotrue navigator-lock. When two hooks poll at similar intervals, their lock-acquire calls overlap. The second one steals the lock, the first one aborts mid-execution, the third one steals again, and the main thread stalls while the lock state thrashes.

Primary offenders identified in audit:
- `components/freeflight/useWrecks.ts` — polls wrecks + calls getUser()
- `components/freeflight/useActiveMission.ts` (per Sprint 13d auto-payout wiring) — polls + calls getUser()
- `components/wallet/GhaiBalance.tsx` (commit `0cf0d22` Sprint 13d) — calls getUser() for balance
- Possibly: any other hook in Free Flight that reads user state

### Fix strategy (three layers, apply in order)

**Layer 1: Single shared user state**
- Create one `useCurrentUser` hook that calls `supabase.auth.getUser()` ONCE per session
- Memoize the result via React context at app root level
- All other hooks consume user from context, never call `getUser()` directly

**Layer 2: Reduce polling frequency**
- Wrecks polling: change from current interval to 60 seconds OR switch to Supabase realtime subscription
- User credits polling: change to event-driven (invalidate on mission complete, wallet top-up) instead of polling

**Layer 3: Deduplicate Supabase client**
- Verify only ONE `createClient()` call exists in the app
- If multiple clients exist, consolidate to single singleton via `lib/supabase-client.ts`
- Multiple clients each have their own lock → instant storm

---

## PRE-TASKS

1. `git status` — must be clean in voidexa repo. If dirty, stash or commit first.
2. `git tag backup/pre-sprint-14a-20260418`
3. `git push origin --tags`
4. `npm test` baseline — record number (expect 705/705 from Sprint 13f)
5. Verify Free Flight freeze is reproducible locally:
   ```powershell
   npm run dev
   ```
   Open http://localhost:3000/freeflight, open DevTools Console, watch for the "Lock was not released within 5000ms" warning. If it does NOT reproduce locally (only on production), document this and proceed anyway — fix is correct regardless.

---

## TASKS

### STEP 1 — Inventory all `getUser()` callers

Find every place in the codebase that calls `supabase.auth.getUser()` or equivalent:

```powershell
Get-ChildItem -Recurse -Path app,components,lib,hooks -Include *.ts,*.tsx | 
  Select-String -Pattern "auth\.getUser|auth\.getSession|createClient" -SimpleMatch |
  Select-Object Filename, LineNumber, Line
```

Produce a list: file, line, context. Include it in the final report.

**Expected findings (from audit):**
- `components/freeflight/useWrecks.ts`
- `components/freeflight/useActiveMission.ts` (or equivalent auto-payout hook)
- `components/wallet/GhaiBalance.tsx`
- `lib/credits/credit.ts` (or wherever credit API is)
- `app/api/*/route.ts` (server-side — these are FINE, do not modify)
- Possibly: `components/layout/Nav.tsx` if it reads user for nav state

**IMPORTANT:** Server-side callers (in `app/api/**`) are NOT affected by the storm. The storm is client-side only — the gotrue lock is browser-scoped. Do not refactor server-side handlers.

### STEP 2 — Create shared user context

Create `lib/auth/current-user-context.tsx` (max 200 lines):

```typescript
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabaseBrowser } from '@/lib/supabase-browser';

interface CurrentUserState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

const CurrentUserContext = createContext<CurrentUserState>({
  user: null,
  loading: true,
  error: null,
});

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CurrentUserState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;
    
    // Single getUser() call on mount
    supabaseBrowser.auth.getUser()
      .then(({ data, error }) => {
        if (!mounted) return;
        setState({ user: data?.user ?? null, loading: false, error });
      })
      .catch((error) => {
        if (!mounted) return;
        setState({ user: null, loading: false, error });
      });

    // Subscribe to auth state changes — updates without re-polling
    const { data: subscription } = supabaseBrowser.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        setState({
          user: session?.user ?? null,
          loading: false,
          error: null,
        });
      }
    );

    return () => {
      mounted = false;
      subscription?.subscription?.unsubscribe?.();
    };
  }, []);

  return (
    <CurrentUserContext.Provider value={state}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(CurrentUserContext);
}
```

### STEP 3 — Verify / create singleton Supabase browser client

Check `lib/supabase-browser.ts` (or equivalent). If it doesn't exist, create it.

If it exists, verify it exports a single shared instance:

```typescript
// lib/supabase-browser.ts (max 60 lines)
import { createBrowserClient } from '@supabase/ssr';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';

let clientInstance: ReturnType<typeof createBrowserClient> | null = null;

export const supabaseBrowser = (() => {
  if (!clientInstance) {
    clientInstance = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return clientInstance;
})();
```

Key rule: **ONE instance per browser tab**. No re-creation in hooks.

**If multiple `createClient` / `createBrowserClient` calls exist across the codebase**, refactor them ALL to import from `@/lib/supabase-browser`.

Search:
```powershell
Get-ChildItem -Recurse -Path app,components,lib,hooks -Include *.ts,*.tsx | 
  Select-String -Pattern "createClient\(|createBrowserClient\(" -SimpleMatch
```

### STEP 4 — Wrap app root with provider

Update `app/layout.tsx` to wrap children with `CurrentUserProvider`:

```tsx
// inside <body>
<CurrentUserProvider>
  {/* existing providers / children */}
</CurrentUserProvider>
```

If `app/layout.tsx` is already over line limit, extract providers into `app/providers.tsx` (max 100 lines) that composes all context providers and wrap with that.

### STEP 5 — Refactor hooks to consume context

For each hook identified in STEP 1 (client-side only):

**Before:**
```typescript
export function useWrecks() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);
  // ...polling logic
}
```

**After:**
```typescript
export function useWrecks() {
  const { user, loading } = useCurrentUser();
  useEffect(() => {
    if (loading || !user) return;
    // polling logic here, using user.id
  }, [user?.id, loading]);
}
```

Apply same pattern to:
- `useWrecks.ts`
- `useActiveMission.ts` (or whatever the mission completion hook is)
- `GhaiBalance.tsx` — use `useCurrentUser()` instead of fetching user separately
- Any other hook found in STEP 1

**DO NOT change the polling intervals in STEP 5.** That's STEP 6. Keep one variable per sprint to isolate impact.

### STEP 6 — Reduce polling frequency on heavy endpoints

Two polling endpoints identified as main-thread blockers:

**Wrecks polling (`useWrecks.ts`):**
- Current: unknown interval (need to read source) — audit suggests ~every ~12s
- Target: 60 seconds for background check
- OR: switch to Supabase realtime subscription on `wrecks` table (preferred, event-driven)

Preferred fix — realtime subscription:
```typescript
useEffect(() => {
  if (!user) return;
  
  // Initial fetch
  fetchWrecks().then(setWrecks);
  
  // Subscribe to changes instead of polling
  const channel = supabaseBrowser
    .channel(`wrecks:${user.id}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'wrecks',
      filter: `user_id=eq.${user.id}`,
    }, (payload) => {
      // update wrecks state based on payload
    })
    .subscribe();

  return () => {
    supabaseBrowser.removeChannel(channel);
  };
}, [user?.id]);
```

If realtime is too invasive for this sprint, fallback to `setInterval` with 60s and document in report that realtime upgrade is Sprint 14e.

**User credits polling (GhaiBalance + elsewhere):**
- Change to event-driven: invalidate on mission complete, wallet top-up, or manual refresh
- Remove all interval-based polling from credits reads

### STEP 7 — Run tests

```powershell
npm test
```

Must still be 705+ passing. If new failures appear, they relate to:
- Mocked Supabase clients need update to match singleton pattern
- Hooks tests need to be wrapped in CurrentUserProvider for test
- Write test wrappers as needed

Add at least these new tests:
- `tests/current-user-context.test.tsx` — provider renders children, useCurrentUser returns state (min 4 tests)
- `tests/supabase-singleton.test.ts` — multiple imports return same instance (min 2 tests)
- `tests/use-wrecks.test.ts` (update existing if exists) — verifies hook uses context, not direct getUser (min 2 tests)

Target: **707+ passing** (705 baseline + 6 new minimum).

### STEP 8 — Verify the fix locally

Run dev server:
```powershell
npm run dev
```

Open http://localhost:3000/freeflight. Open DevTools Console.

Expected after fix:
- NO "Lock was not released within 5000ms" warnings
- NO "AbortError: Lock broken by another request" errors
- Smooth continuous gameplay, no periodic freeze
- Network tab shows `auth/v1/user` called ONCE on page load, NOT every 12s

If freezes persist:
- Screenshot console errors
- STOP the sprint, report findings
- Do NOT ship a fix that doesn't fix the bug

### STEP 9 — Build + lint

```powershell
npm run build
npm run lint
```

Both must be clean.

### STEP 10 — Commit + deploy

```powershell
git add .
git commit -m "fix(sprint-14a): eliminate supabase auth-lock storm on /freeflight (performance critical)

- Consolidate getUser() to single CurrentUserContext provider
- Ensure singleton browser supabase client
- Reduce wrecks polling to 60s (or realtime)
- Event-driven user_credits refresh (no polling)

Resolves 12s periodic main-thread freeze on Free Flight.
Audit evidence: 2026-04-18 gameplay audit section B1."

git push origin main
```

Vercel auto-deploys. Wait for deploy green light.

### STEP 11 — Production smoke test

Open https://voidexa.com/freeflight in incognito browser (fresh session, no cache).

Observe in DevTools Console:
- No auth-lock warnings
- No repeating lock-steal errors
- Network tab: auth/v1/user requested once per page load, not every 12s
- Gameplay flows without periodic freeze

If any regression: rollback immediately via backup tag.

### STEP 12 — Tag success

```powershell
git tag sprint-14a-complete
git push origin --tags
```

### STEP 13 — Report

Produce `docs/PHASE1_14A_REPORT.md`:

```
SPRINT 14A — AUTH-LOCK STORM FIX REPORT
========================================

Status: [success/partial/blocked]

Problem fixed:
- 12-second periodic freezes on /freeflight caused by gotrue navigator-lock storm

Files modified:
- [list every file touched]

Hooks refactored to use CurrentUserContext:
- [list]

New files:
- lib/auth/current-user-context.tsx
- lib/supabase-browser.ts (if created)

Polling changes:
- wrecks: [from X to Y, or realtime]
- user_credits: [from polling to event-driven]

Tests: [N/N passing] (baseline 705 → now X)

Verification evidence:
- Local console: [auth-lock warnings still present? yes/no]
- Production console: [yes/no]
- Network: [frequency of auth/v1/user calls]
- Frame-gap observation: [still freezing? frequency? duration?]

Commit: [hash]
Deploy: [Vercel URL]
Tag: sprint-14a-complete

Known side effects (if any):
- [list anything that changed behavior]

Next sprints (queued but NOT in 14a scope):
- Sprint 14b: Tutorial starter GHAI grant (tutorial unreachable at 0 balance)
- Sprint 14c: Exploration encounter dismissible modals + toast pattern
- Sprint 14d: Audio event wiring (65 of 67 sounds not firing)
- Sprint 14e: Realtime subscriptions (if this sprint used setInterval fallback)
```

---

## EXIT CRITERIA

- `/freeflight` loads and plays without periodic main-thread freezes
- Console shows no "Lock was not released within 5000ms" warnings
- Network panel: `auth/v1/user` called once per page load, not on polling cycle
- Tests passing at 705+
- Build + lint clean
- Deployed to voidexa.com via `git push origin main`
- Tag `sprint-14a-complete` pushed
- Report produced

---

## STOP CONDITIONS

- Tests regress below 705 and cannot be recovered after 3 fix attempts → halt, rollback
- Auth-lock warnings persist after fix → halt, DO NOT ship broken fix, rollback and report
- `getUser()` inventory finds 10+ callers across files (indicates deeper refactor than this sprint scope) → halt, report, discuss approach with user
- Refactor requires changes outside auth/hooks layer (e.g., changes to game logic, 3D scene, gameplay components) → halt, reassess scope
- 3 hours wall clock reached → stop at next safe checkpoint, ship what works, document rest

---

## ROLLBACK

```powershell
cd C:\Users\Jixwu\Desktop\voidexa
git reset --hard backup/pre-sprint-14a-20260418
git push --force-with-lease origin main
```

---

## SCOPE REMINDER (keep reading if tempted to do more)

This sprint's ONLY goal is to make Free Flight playable by eliminating the auth-lock storm. Do NOT:

- Fix the tutorial unreachable bug (Sprint 14b)
- Change encounter modal behavior (Sprint 14c)
- Wire audio events (Sprint 14d)
- Redesign the map (Phase 2)
- Optimize 3D rendering
- Refactor unrelated components

Each of those is its own sprint with its own backup tag and rollback point. Isolated scope = safe deploys.
