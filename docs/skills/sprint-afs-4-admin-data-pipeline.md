# SPRINT AFS-4 — Admin Control Plane Data Pipeline (v2)
## Skill file for Claude Code
## Location: docs/skills/sprint-afs-4-admin-data-pipeline.md

**Version:** v2 (Apr 22 — 3 verified corrections + pre-flight verification added)

**Changes from v1:**
- **CORRECTION 1:** Server client import path `@/lib/supabase-server` (NOT `@/lib/supabase/server`). Raw log confirms wrapper files live at `lib/` root level: `lib/supabase.ts`, `lib/supabase-server.ts`, `lib/supabase-admin.ts`.
- **CORRECTION 2:** RLS `service_role_insert` policy REMOVED. Service role bypasses RLS by design. A `with check (false)` policy adds no value and blocks legitimate future non-service-role paths. Default-deny (RLS enabled + no insert policy) is the correct pattern.
- **CORRECTION 3:** Admin stats endpoint — OVERWRITE existing `app/api/kcp90/stats/route.ts` (131 lines, currently returns nulls). Do NOT create new `/api/admin/kcp90/stats/` path — that directory does not exist in the repo.
- **NEW:** Task 0.5 pre-flight verification added. Claude Code must run 6 grep/ls commands and STOP for Jix approval before Task 1.
- **NEW:** Every line where the exact export name or path comes from repo grep (not INDEX) is tagged `VERIFY-FIRST` — those values get confirmed in Task 0.5 before Task 2+ uses them.

---

## SCOPE

Wire real data into `/control-plane` dashboard. Create `kcp90_compression_events` Supabase table, add non-blocking write calls from Void Chat + Quantum + Break Room, rewire the existing `/api/kcp90/stats` endpoint to aggregate real events (it currently returns nulls), and update `ControlPlaneDashboard.tsx` to render real numbers.

Trading Bot repo-side wiring is OUT of scope (belongs to AFS-16). Only the receiving endpoint stub is built here.

---

## CONTEXT

### Why this sprint
`/control-plane` renders 861 lines of dashboard UI (`components/control-plane/ControlPlaneDashboard.tsx`) but all values show zero or mock. Products don't log usage to Supabase, and `/api/kcp90/stats` (131 lines) returns nulls. This is a P0 because the control plane is Jix's only production visibility into KCP-90 compression, chat volume, and Quantum session counts.

### Previous sprint state
- Last sprint: AFS-3 Game Hub 404 (tag `sprint-afs-3-complete`)
- HEAD: `0a7e853`
- Tests: 938/938 green
- Working tree: clean (post-cleanup `ac3cdcf`)
- Production branch: main (push target)

### What MUST NOT change
- ControlPlaneDashboard auth gate (`DashboardLoader.tsx` + server-side role check)
- `ADMIN_EMAILS = ['ceo@voidexa.com']` — only Jix reads admin data
- Void Chat streaming SSE path — event logging must never block the response
- Existing Void Chat credit deduction + GHAI transaction log pattern
- `lib/kcp90/compress-context.ts` — compression logic stays regex-based server variant
- Quantum client API shape (`POST /api/sessions` body + SSE response)
- `is_admin()` SECURITY DEFINER function in Supabase (existing)

### Supabase project
- Project ID: `ihuljnekxkyqgroklurp`
- Region: EU
- Shared with quantum-forge via voidexa-auth
- 55+ tables currently; this sprint adds 1

### Supabase wrapper files (from raw log, lib root level)
- `lib/supabase.ts` — client-side (browser)
- `lib/supabase-server.ts` — server-side (cookies-based) — **VERIFY-FIRST exact export names in Task 0.5**
- `lib/supabase-admin.ts` — service-role — **VERIFY-FIRST exact export names in Task 0.5**

---

## TASKS

Build in this exact order. Commit SKILL.md first. STOP after Task 0.5 for Jix approval.

### Task 0: Commit SKILL + backup tag

```
cd C:\Users\Jixwu\Desktop\voidexa
git status                                    # must be clean
git pull origin main                          # must be up-to-date
git tag backup/pre-afs-4-20260422
git add docs/skills/sprint-afs-4-admin-data-pipeline.md
git commit -m "docs(afs-4): SKILL v2 for admin data pipeline"
git push origin main
git status
git log origin/main --oneline -3
```

---

### Task 0.5: Pre-flight verification — STOP AND REPORT

**Claude Code must run these 6 commands verbatim and paste the full output to chat. Then STOP. Do NOT proceed to Task 1 without Jix's explicit approval.**

```
cd C:\Users\Jixwu\Desktop\voidexa

echo "=== 1. Server client exports ==="
grep -n 'export' lib/supabase-server.ts

echo "=== 2. Admin client exports ==="
grep -n 'export' lib/supabase-admin.ts

echo "=== 3. Dashboard fetch URLs ==="
grep -n 'fetch.*stats' components/control-plane/ControlPlaneDashboard.tsx

echo "=== 4. Existing kcp90 stats endpoint head ==="
cat app/api/kcp90/stats/route.ts | head -30
wc -l app/api/kcp90/stats/route.ts

echo "=== 5. compressForContext usage in chat send ==="
grep -rn 'compressForContext' app/api/chat/send/route.ts

echo "=== 6. Admin directory structure ==="
ls app/api/admin/

echo "=== PRE-FLIGHT COMPLETE — AWAITING JIX APPROVAL ==="
```

**Why this step exists:**
- The SKILL assumes exact export names from `lib/supabase-server.ts` and `lib/supabase-admin.ts`. If the exports are named differently (e.g. `createClient` instead of `createServerClient`, or `supabaseAdmin` as a pre-built instance instead of a factory), Task 2 + Task 4 + Task 7 imports must be adjusted.
- The SKILL assumes `/api/kcp90/stats` is 131 lines and returns nulls. If it's something different (e.g. aggregation already wired to another table), strategy changes.
- The SKILL assumes ControlPlaneDashboard fetches from `/api/kcp90/stats` OR `/api/admin/stats`. Must confirm before rewire.
- The SKILL assumes `/api/admin/` has no `kcp90/` subdirectory. Must confirm before deciding where to put admin guardrails.

**Expected results (from INDEX/raw log):**
1. `lib/supabase-server.ts` exports a `createServerClient` function (server-side cookie-based Supabase client)
2. `lib/supabase-admin.ts` exports either a `createAdminClient` factory or a pre-built `supabaseAdmin` instance
3. `ControlPlaneDashboard.tsx` fetches from `/api/kcp90/stats` or `/api/admin/stats`
4. `app/api/kcp90/stats/route.ts` is ~131 lines, returns `{totalEvents: 0, ...}` or similar null shape
5. `compressForContext` is imported from `@/lib/kcp90/compress-context` and called before history is sent to provider
6. `app/api/admin/` contains: `stats/`, `ship-tags/` (only 2 subdirectories)

**STOP HERE. Paste output. Wait for Jix approval.**

---

### Task 1: Supabase migration — kcp90_compression_events table

**File:** `supabase/migrations/20260422_kcp90_compression_events.sql`

**Implementation:**

```sql
-- AFS-4: Admin Control Plane Data Pipeline
-- kcp90_compression_events: unified event log for KCP-90 usage across products

create table if not exists kcp90_compression_events (
  id uuid primary key default gen_random_uuid(),
  ts timestamptz not null default now(),
  product text not null check (product in ('void-chat','quantum','trading-bot','break-room')),
  user_id uuid references auth.users(id) on delete set null,
  session_id text,
  tokens_in int not null default 0,
  tokens_out int not null default 0,
  bytes_raw int,
  bytes_compressed int,
  compression_ratio numeric(5,4),
  layer_used text,
  success boolean not null default true,
  meta jsonb
);

create index if not exists kcp90_events_ts_idx
  on kcp90_compression_events (ts desc);

create index if not exists kcp90_events_product_ts_idx
  on kcp90_compression_events (product, ts desc);

create index if not exists kcp90_events_user_idx
  on kcp90_compression_events (user_id)
  where user_id is not null;

alter table kcp90_compression_events enable row level security;

-- Admin read policy: uses existing is_admin() SECURITY DEFINER function
-- (already in place in Supabase — checks auth.jwt() email = 'ceo@voidexa.com')
create policy "admin_read_all"
  on kcp90_compression_events
  for select
  using (public.is_admin());

-- NOTE: No insert policy. RLS default-deny applies to anon + authed.
-- Service-role key (used by lib/kcp90/log-event.ts) bypasses RLS by design.
-- This matches the voidexa convention — no redundant "for clarity" policies.

comment on table kcp90_compression_events is
  'AFS-4: Event log for KCP-90 compression across Void Chat, Quantum, Trading Bot, Break Room. Insert only via server-side service-role client. Admin read via is_admin().';
```

**Validation:**
- [ ] Migration applies cleanly in Supabase dashboard
- [ ] RLS enabled, exactly ONE policy visible (`admin_read_all`)
- [ ] Table appears in Table Editor
- [ ] Manual insert via SQL editor with service_role succeeds
- [ ] Manual select as anon fails (0 rows returned, not error)
- [ ] Manual select as ceo@voidexa.com (admin) returns inserted rows

---

### Task 2: Server-side logging helper

**File:** `lib/kcp90/log-event.ts` (NEW, ~80 lines)

**VERIFY-FIRST:** Import from `@/lib/supabase-admin` (or inline `@supabase/supabase-js` with env vars). The exact import depends on Task 0.5 output. If `lib/supabase-admin.ts` exports `supabaseAdmin` as a pre-built instance, import it directly. If it exports a factory `createAdminClient()`, call that. Adjust the helper below accordingly.

**Implementation (using inline @supabase/supabase-js — universally safe):**

```typescript
import 'server-only';
import { createClient } from '@supabase/supabase-js';

type Product = 'void-chat' | 'quantum' | 'trading-bot' | 'break-room';

export interface Kcp90Event {
  product: Product;
  userId?: string | null;
  sessionId?: string | null;
  tokensIn: number;
  tokensOut: number;
  bytesRaw?: number;
  bytesCompressed?: number;
  layerUsed?: string;
  success?: boolean;
  meta?: Record<string, unknown>;
}

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    throw new Error('kcp90 log-event: missing Supabase env');
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Fire-and-forget logging of a KCP-90 event.
 * Never throws to the caller. Errors are logged to console only.
 * Must not block the hot path of chat / quantum / trading responses.
 */
export function logKcp90Event(event: Kcp90Event): void {
  void (async () => {
    try {
      const client = serviceClient();
      const ratio =
        event.bytesRaw && event.bytesCompressed && event.bytesRaw > 0
          ? Math.min(1, event.bytesCompressed / event.bytesRaw)
          : null;

      const { error } = await client.from('kcp90_compression_events').insert({
        product: event.product,
        user_id: event.userId ?? null,
        session_id: event.sessionId ?? null,
        tokens_in: event.tokensIn,
        tokens_out: event.tokensOut,
        bytes_raw: event.bytesRaw ?? null,
        bytes_compressed: event.bytesCompressed ?? null,
        compression_ratio: ratio,
        layer_used: event.layerUsed ?? null,
        success: event.success ?? true,
        meta: event.meta ?? null,
      });

      if (error) {
        console.error('[kcp90/log-event] insert failed:', error.message);
      }
    } catch (err) {
      console.error('[kcp90/log-event] unexpected:', err);
    }
  })();
}
```

**Alternative (if `lib/supabase-admin.ts` exports a usable client/factory, prefer it):**
```typescript
// If Task 0.5 shows: export function createAdminClient()
import { createAdminClient } from '@/lib/supabase-admin';
// then replace serviceClient() with createAdminClient()

// If Task 0.5 shows: export const supabaseAdmin = createClient(...)
import { supabaseAdmin } from '@/lib/supabase-admin';
// then remove serviceClient() entirely and call supabaseAdmin.from(...) directly
```

**Validation:**
- [ ] `import 'server-only'` prevents client bundle inclusion
- [ ] Unit test: helper never throws even with bad env
- [ ] Unit test: ratio calculated correctly
- [ ] Unit test: null handling for optional fields
- [ ] Build check: `next build` — no service role key leaked to client bundle

---

### Task 3: Wire Void Chat

**File:** `app/api/chat/send/route.ts` (EDIT — existing 200 lines)

**VERIFY-FIRST:** Task 0.5 step 5 shows how `compressForContext` is imported and where it's called. Use that exact pattern for capturing `rawHistoryBytes` + `compressedHistoryBytes`.

**Implementation:**
After the existing `onDone` handler (where assistant message is inserted + credits deducted + GHAI transaction logged), add a call to `logKcp90Event`. Event call goes LAST in the onDone chain, fire-and-forget, never awaited.

```typescript
import { logKcp90Event } from '@/lib/kcp90/log-event';

// Capture bytes around the existing compressForContext() call:
const historyBeforeCompression = /* existing history array */;
const rawHistoryBytes = JSON.stringify(historyBeforeCompression).length;
const compressedHistory = compressForContext(historyBeforeCompression);
const compressedHistoryBytes = JSON.stringify(compressedHistory).length;

// inside existing onDone handler, after GHAI log:
logKcp90Event({
  product: 'void-chat',
  userId: user.id,
  sessionId: conversationId,
  tokensIn: promptTokens,
  tokensOut: completionTokens,
  bytesRaw: rawHistoryBytes,
  bytesCompressed: compressedHistoryBytes,
  layerUsed: 'server-regex-v1',
  success: true,
  meta: { model: modelId, provider: modelDef.provider },
});
```

If compression threshold (4000 tokens) was not met, `compressedHistory === historyBeforeCompression` so bytes will be equal → ratio = 1.0. Still log — zero compression is valid data.

**Validation:**
- [ ] Existing Void Chat tests still pass (baseline 200)
- [ ] SSE stream completes normally (no regression)
- [ ] Manual test: send message in Void Chat, verify row appears in `kcp90_compression_events`
- [ ] Measured: logging adds < 5ms to response time (non-blocking)

---

### Task 4: Wire Quantum

**File 1:** `lib/quantum/client.ts` (EDIT — existing 182 lines)

`lib/quantum/client.ts` runs client-side, so it cannot import `logKcp90Event` directly (the `import 'server-only'` barrier). Instead, route through a new server endpoint.

**File 2:** `app/api/quantum/log-session/route.ts` (NEW, ~40 lines)

**VERIFY-FIRST:** Use the exact server-client import from `lib/supabase-server.ts` as confirmed by Task 0.5 step 1.

```typescript
import { NextRequest, NextResponse } from 'next/server';
// VERIFY-FIRST: exact export name from Task 0.5 step 1
import { createServerClient } from '@/lib/supabase-server';
import { logKcp90Event } from '@/lib/kcp90/log-event';

export async function POST(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  // authed or anon both allowed (Quantum is semi-public)

  const body = await req.json();
  logKcp90Event({
    product: 'quantum',
    userId: user?.id ?? null,
    sessionId: body.sessionId,
    tokensIn: Number(body.tokensIn) || 0,
    tokensOut: Number(body.tokensOut) || 0,
    layerUsed: body.layerUsed ?? null,
    success: Boolean(body.success),
    meta: body.meta ?? null,
  });
  return NextResponse.json({ ok: true });
}
```

**Client-side call in `lib/quantum/client.ts`:**
```typescript
// after session completes (SSE stream closed, all rounds done):
fetch('/api/quantum/log-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: sessionIdFromResponse,
    tokensIn: totalPromptTokens,
    tokensOut: totalCompletionTokens,
    layerUsed: mode === 'deep' ? 'kcp90-full' : 'none',
    success: !sessionHadError,
    meta: { mode, rounds, backend_version: 'railway-prod' },
  }),
}).catch(err => console.error('[quantum/log-session]', err));
```

**Validation:**
- [ ] Client bundle does not contain service_role key (verify via `next build` + bundle analyzer)
- [ ] Quantum session completes, then `kcp90_compression_events` gets row within 2s
- [ ] Anon user Quantum session also logged (user_id = null)
- [ ] Network tab shows POST /api/quantum/log-session with 200 response

---

### Task 5: Wire Break Room

**File:** `app/api/break-room/chat/route.ts` (EDIT — existing 140 lines)

Same pattern as Void Chat. Break Room uses same 6-personality AI chat, so each response gets logged as `product: 'break-room'`.

```typescript
import { logKcp90Event } from '@/lib/kcp90/log-event';

// after AI response returned:
logKcp90Event({
  product: 'break-room',
  userId: user?.id ?? null,
  sessionId: conversationId,
  tokensIn: promptTokens,
  tokensOut: completionTokens,
  layerUsed: 'none',
  success: true,
  meta: { personality: personalityId, arcade: null },
});
```

**Validation:**
- [ ] Break Room chat works unchanged (baseline 140 lines behavior)
- [ ] Event row appears per chat turn

---

### Task 6: Trading Bot endpoint stub

**File:** `app/api/trading-bot/events/route.ts` (NEW, ~60 lines)

Trading Bot repo wiring is AFS-16. For AFS-4, only the receiving endpoint is built.

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { logKcp90Event } from '@/lib/kcp90/log-event';

const BOT_WEBHOOK_SECRET = process.env.TRADING_BOT_WEBHOOK_SECRET?.trim();

export async function POST(req: NextRequest) {
  const auth = req.headers.get('x-bot-secret');
  if (!BOT_WEBHOOK_SECRET || auth !== BOT_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  logKcp90Event({
    product: 'trading-bot',
    userId: null,
    sessionId: body.runId ?? null,
    tokensIn: Number(body.tokensIn) || 0,
    tokensOut: Number(body.tokensOut) || 0,
    layerUsed: body.engine ?? null,   // 'season' | 'spot-rebalance' | 'risk'
    success: Boolean(body.success),
    meta: {
      decision: body.decision,
      symbol: body.symbol,
      regime: body.regime,
    },
  });

  return NextResponse.json({ ok: true });
}
```

Add `TRADING_BOT_WEBHOOK_SECRET=` to `.env.example`.

**Validation:**
- [ ] 401 without secret header
- [ ] 200 + event logged with correct secret
- [ ] Secret documented in `.env.example`

---

### Task 7: Rewire the existing stats endpoint

**File:** `app/api/kcp90/stats/route.ts` (OVERWRITE — existing 131 lines currently returns nulls per raw log: "kcp90 | 2 | stats 131 | Public + admin dashboard data")

**VERIFY-FIRST:** 
- Confirm from Task 0.5 step 4 that existing file returns nulls / mock shape
- Confirm from Task 0.5 step 3 which URL dashboard actually fetches (this file, `/api/admin/stats`, or something else)
- Confirm from Task 0.5 step 1 the exact server-client import name

**Implementation:**

```typescript
import { NextRequest, NextResponse } from 'next/server';
// VERIFY-FIRST: exact export name from Task 0.5 step 1
import { createServerClient } from '@/lib/supabase-server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  // Use existing is_admin() function via profiles role lookup
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const service = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!.trim(),
    { auth: { persistSession: false } }
  );

  const now = Date.now();
  const windows = {
    '24h': new Date(now - 24 * 3600 * 1000).toISOString(),
    '7d':  new Date(now - 7 * 24 * 3600 * 1000).toISOString(),
    '30d': new Date(now - 30 * 24 * 3600 * 1000).toISOString(),
  };

  const out: Record<string, unknown> = {};
  for (const [label, since] of Object.entries(windows)) {
    const { data, error } = await service
      .from('kcp90_compression_events')
      .select('product, tokens_in, tokens_out, bytes_raw, bytes_compressed, success')
      .gte('ts', since);

    if (error) {
      out[label] = { error: error.message };
      continue;
    }

    const byProduct: Record<string, {
      events: number;
      tokensIn: number;
      tokensOut: number;
      bytesRaw: number;
      bytesCompressed: number;
      successes: number;
    }> = {};

    for (const row of data ?? []) {
      const p = row.product as string;
      byProduct[p] ??= {
        events: 0, tokensIn: 0, tokensOut: 0,
        bytesRaw: 0, bytesCompressed: 0, successes: 0,
      };
      byProduct[p].events += 1;
      byProduct[p].tokensIn += row.tokens_in ?? 0;
      byProduct[p].tokensOut += row.tokens_out ?? 0;
      byProduct[p].bytesRaw += row.bytes_raw ?? 0;
      byProduct[p].bytesCompressed += row.bytes_compressed ?? 0;
      if (row.success) byProduct[p].successes += 1;
    }

    out[label] = byProduct;
  }

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    windows: out,
  });
}
```

**IMPORTANT — Backward compatibility:** If the existing `/api/kcp90/stats` endpoint also serves a PUBLIC consumer (e.g. `components/home/Kcp90Stats.tsx` on homepage, or similar), this rewrite will break that caller by requiring admin auth. 

**Check during Task 0.5:** Look for public consumers. If any public consumer fetches this URL, preserve the public branch — return a reduced shape for non-admins instead of 403:

```typescript
// If non-admin or anon:
if (!user || profile?.role !== 'admin') {
  // Return public-safe subset (aggregate only, no breakdown)
  return NextResponse.json({ 
    generatedAt: new Date().toISOString(),
    public: true,
    totalEvents24h: 0,  // or cached count
  });
}
```

Note: the public-stats route `/api/kcp90/public-stats` also exists per raw log — that may already be the public consumer path. Confirm in Task 0.5.

**Validation:**
- [ ] Anonymous GET → 401 OR public-safe shape (depending on consumer check)
- [ ] Non-admin authed GET → 403 OR public-safe shape
- [ ] Admin GET → JSON with 24h/7d/30d breakdown by product
- [ ] Existing tests that hit this endpoint still pass (or are updated to match new contract)

---

### Task 8: Dashboard rewire

**File:** `components/control-plane/ControlPlaneDashboard.tsx` (EDIT — existing 861 lines)

**VERIFY-FIRST:** Task 0.5 step 3 confirms which URL the dashboard fetches from today. If it's `/api/kcp90/stats`, keep that URL (now returns real data after Task 7). If it's `/api/admin/stats` instead, update either the fetch URL OR Task 7 to target the other endpoint.

Replace mock data initializers with real fetch. Keep existing layout, chart components, card layout.

```typescript
const [stats, setStats] = useState<StatsResponse | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  let cancelled = false;

  async function fetchStats() {
    try {
      // VERIFY-FIRST: confirm exact URL from Task 0.5 step 3
      const r = await fetch('/api/kcp90/stats', { cache: 'no-store' });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      if (!cancelled) { setStats(j); setError(null); }
    } catch (err) {
      if (!cancelled) setError((err as Error).message);
    } finally {
      if (!cancelled) setLoading(false);
    }
  }

  fetchStats();
  const id = setInterval(fetchStats, 30_000); // 30s auto-refresh
  return () => { cancelled = true; clearInterval(id); };
}, []);
```

Bind existing chart/card props to `stats.windows['24h']['void-chat']`, etc. Show empty-state ("No events in window") when zero. Show error banner when fetch fails.

Keep file under 900 lines (currently 861, adds ~40 lines — OK).

**Validation:**
- [ ] Dashboard renders real numbers when events exist
- [ ] Empty state shown when no events
- [ ] Auto-refresh fires every 30s
- [ ] Non-admin redirected by existing auth gate (unchanged)

---

### Task 9: Playwright tests

**File:** `tests/admin/control-plane-data.spec.ts` (NEW, ~120 lines)

Tests:
1. Anon visits `/control-plane` → redirect to `/auth/login`
2. Non-admin user visits → 403 or redirect
3. Admin user visits → dashboard renders, has "Events (24h)" card
4. Admin API call `GET /api/kcp90/stats` returns 200 with expected shape
5. Non-admin API call returns 403 (or public-safe shape — match Task 7 decision)
6. Mock insert event + verify dashboard updates after refresh

Use existing test auth helpers (see `tests/auth/` for pattern).

**Validation:**
- [ ] All 6 new tests pass
- [ ] Total: 938 → ~958 (est +20 across admin + API + dashboard)

---

## FILE SIZE LIMITS

- `lib/kcp90/log-event.ts`: target 80 lines, max 150
- `app/api/kcp90/stats/route.ts`: target 130 lines, max 200 (currently 131)
- `app/api/quantum/log-session/route.ts`: target 40 lines, max 80
- `app/api/trading-bot/events/route.ts`: target 60 lines, max 100
- `components/control-plane/ControlPlaneDashboard.tsx`: currently 861, max 900 after edits — split if exceeded

---

## TESTING REQUIREMENTS

### Before commit
- [ ] `npm test` — all green
- [ ] `npm run build` — no TS errors, no client bundle contamination
- [ ] `npm run lint` — clean

### Expected test count
- Start: 938 tests
- End target: ~958 tests (+20)
- Breakdown: ~6 Playwright (admin flow) + ~8 unit (log-event helper + stats aggregation) + ~6 integration (endpoint shapes)

---

## GIT WORKFLOW

### Before starting
```
cd C:\Users\Jixwu\Desktop\voidexa
git status                                # clean
git pull origin main
git tag backup/pre-afs-4-20260422
git log origin/main --oneline -3
```

### Commit SKILL first
```
git add docs/skills/sprint-afs-4-admin-data-pipeline.md
git commit -m "docs(afs-4): SKILL v2 for admin data pipeline"
git push origin main
```

### After Task 0.5 approval, commit per task
```
git commit -m "feat(afs-4): kcp90_compression_events migration"
git commit -m "feat(afs-4): server-side log-event helper"
git commit -m "feat(afs-4): wire void chat compression logging"
git commit -m "feat(afs-4): wire quantum session logging via proxy endpoint"
git commit -m "feat(afs-4): wire break room logging"
git commit -m "feat(afs-4): trading bot events endpoint stub"
git commit -m "feat(afs-4): rewire /api/kcp90/stats to aggregate real events"
git commit -m "feat(afs-4): rewire control plane dashboard to real data"
git commit -m "test(afs-4): playwright admin flow + unit tests"
```

### After completion
```
git push origin main
git status                                # clean
git log origin/main --oneline -3          # commits present
git tag sprint-afs-4-complete
git push origin sprint-afs-4-complete
```

---

## DEFINITION OF DONE

- [ ] SKILL.md committed first (commit precedes all code)
- [ ] Task 0.5 pre-flight output reported to Jix + approval received
- [ ] Supabase migration applied in production (`ihuljnekxkyqgroklurp`)
- [ ] Table `kcp90_compression_events` visible in Supabase Table Editor
- [ ] RLS enabled + exactly 1 policy (`admin_read_all`) active — NO `service_role_insert` policy
- [ ] Void Chat logs event per message (verified row insertion)
- [ ] Quantum logs event per session (via /api/quantum/log-session proxy)
- [ ] Break Room logs event per chat turn
- [ ] Trading Bot endpoint returns 401 without secret, 200 with
- [ ] `/api/kcp90/stats` returns 24h/7d/30d aggregation for admin
- [ ] Non-admin gets 403 OR public-safe shape on stats endpoint (per Task 7 decision)
- [ ] `/control-plane` dashboard shows real numbers (not mock)
- [ ] Dashboard auto-refreshes every 30s
- [ ] Tests green: 938 → ~958
- [ ] `npm run build` clean — no service_role in client bundle
- [ ] Pushed to origin/main
- [ ] Post-push verification done (`git status` clean + `git log origin/main --oneline -3`)
- [ ] Tag `sprint-afs-4-complete` created + pushed
- [ ] CLAUDE.md updated with sprint entry
- [ ] Same-day backup verified ran (per AFS-46 standard, once deployed; for now: harddisk backup job confirmed)

---

## RISKS & MITIGATIONS

| Risk | Mitigation |
|---|---|
| Wrong import path breaks build | Task 0.5 pre-flight — STOP before any code written |
| Service-role key in client bundle | `import 'server-only'` + route client events through `/api/quantum/log-session` |
| Logging blocks chat response | Fire-and-forget pattern, no `await` in hot path, errors only go to console |
| RLS misconfiguration exposes events to non-admins | Only `admin_read_all` policy. Default-deny handles rest. Playwright test for 403 path. |
| Migration fails on production | Idempotent `if not exists` clauses + backup tag before deploy |
| Dashboard renders undefined on empty state | Null-guard every field + explicit "No events" UI |
| Trading bot endpoint accepts unauthed traffic | Required `TRADING_BOT_WEBHOOK_SECRET` header check, 401 on miss |
| Rewrite of `/api/kcp90/stats` breaks public consumer | Task 0.5 identifies consumers. Public-safe branch in Task 7 if needed. |
| Supabase `is_admin()` function missing or named differently | Task 0.5 could add: `grep -rn 'is_admin' supabase/migrations/` — if absent, use `profiles.role = 'admin'` pattern inline |

---

## TOOLS USED

- Claude Code (`claude --dangerously-skip-permissions`)
- Git
- npm (test + build + lint)
- Supabase CLI (migration push) OR dashboard SQL editor
- Vercel (auto-deploy via GitHub push to main)
- Playwright (test runner)

---

## POST-SPRINT UPDATES REQUIRED

After DoD complete:
1. Update `CLAUDE.md` root with Session YYYY-MM-DD — Sprint AFS-4 entry
2. Update INDEX files:
   - `04_KNOWN_ISSUES.md`: remove "Admin Control Plane ZERO data" from P0 list
   - `09_WISHES_PENDING.md`: move entry to "Recently Resolved"
   - `11_DAILY_VERIFICATION.md`: new HEAD, new test count, AFS-4 marked complete
   - `16_AUDIT_ROADMAP.md`: AFS-4 status → ✅ COMPLETE
   - `00_MASTER_INDEX.md`: update Fase 2 P0 status line
3. Deliver updated files via `present_files` tool at SLUT

---

## APPENDIX: Corrections log (v1 → v2)

| # | v1 error | v2 correction | Source |
|---|---|---|---|
| 1 | `import { createServerClient } from '@/lib/supabase/server'` | `import { createServerClient } from '@/lib/supabase-server'` (VERIFY-FIRST in Task 0.5) | raw log: lib root inventory confirms `supabase-server.ts` at root |
| 2 | RLS policy `service_role_insert` with `check (false)` | Policy removed. Only `admin_read_all`. Default-deny handles non-service-role. | Voidexa convention: no `with check (false)` pattern found in existing migrations. Service role bypasses RLS by design. |
| 3 | NEW path `app/api/admin/kcp90/stats/route.ts` | OVERWRITE existing `app/api/kcp90/stats/route.ts` (131 lines) | raw log: only 2 admin routes exist (`stats`, `ship-tags`). No `admin/kcp90/` subdirectory. The existing `/api/kcp90/stats` is documented as "Public + admin dashboard data". |
| 4 | Task flow jumped from SKILL commit to migration | Task 0.5 pre-flight verification inserted between Task 0 and Task 1 with mandatory STOP | Jix request Apr 22 — prevent building on assumed exports |
