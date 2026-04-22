// Sprint AFS-4 regression coverage for the Admin Control Plane data pipeline.
//
// Follows AFS-2 / AFS-3 / AFS-7 precedent: mix source-level assertions (for
// wiring that can't be exercised without live Supabase) with pure unit tests
// for the dashboard adapter functions. No Playwright — matches the AFS-1
// deviation documented in CLAUDE.md.
//
// Coverage map 1:1 with sprint tasks:
//   Task 1 — kcp90_compression_events migration (table, indexes, RLS, policy)
//   Task 2 — server-side log-event helper (server-only + fire-and-forget shape)
//   Task 3 — Void Chat wiring (import + onDone call)
//   Task 4 — Quantum proxy endpoint + client-side session_complete hook
//   Task 5 — Break Room wiring
//   Task 6 — Trading Bot endpoint uses shared KCP90_API_SECRET
//   Task 7 — /api/kcp90/stats rewire (POST migrates, GET aggregates)
//   Task 8 — Dashboard adapter (pure fns) + page SSR trim

import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import {
  toLegacySummary,
  toLegacyRecent,
  type ProductCounters,
  type RecentEvent,
  type Kcp90Product,
} from '../lib/kcp90/dashboard-adapter'

const ROOT = process.cwd()
const read = (...parts: string[]) => readFileSync(join(ROOT, ...parts), 'utf8')
const exists = (...parts: string[]) => existsSync(join(ROOT, ...parts))

const MIGRATION = read('supabase', 'migrations', '20260422_kcp90_compression_events.sql')
const LOG_EVENT = read('lib', 'kcp90', 'log-event.ts')
const CHAT_SEND = read('app', 'api', 'chat', 'send', 'route.ts')
const QUANTUM_LOG = read('app', 'api', 'quantum', 'log-session', 'route.ts')
const QUANTUM_CLIENT = read('lib', 'quantum', 'client.ts')
const BREAK_ROOM = read('app', 'api', 'break-room', 'chat', 'route.ts')
const TRADING_BOT = read('app', 'api', 'trading-bot', 'events', 'route.ts')
const STATS_ROUTE = read('app', 'api', 'kcp90', 'stats', 'route.ts')
const CP_PAGE = read('app', 'control-plane', 'page.tsx')
const CP_DASHBOARD = read('components', 'control-plane', 'ControlPlaneDashboard.tsx')

// ─── Task 1 — migration ──────────────────────────────────────────────────────

describe('AFS-4 Task 1 — kcp90_compression_events migration', () => {
  it('creates the table idempotently', () => {
    expect(MIGRATION).toMatch(/create table if not exists kcp90_compression_events/)
  })

  it('enforces the 4-product CHECK constraint', () => {
    expect(MIGRATION).toMatch(
      /check \(product in \('void-chat','quantum','trading-bot','break-room'\)\)/,
    )
  })

  it('defines the three expected indexes', () => {
    expect(MIGRATION).toMatch(/kcp90_events_ts_idx/)
    expect(MIGRATION).toMatch(/kcp90_events_product_ts_idx/)
    expect(MIGRATION).toMatch(/kcp90_events_user_idx/)
  })

  it('enables RLS with only the admin_read_all policy', () => {
    expect(MIGRATION).toMatch(/enable row level security/)
    expect(MIGRATION).toMatch(/create policy "admin_read_all"/)
    expect(MIGRATION).not.toMatch(/service_role_insert/)
    expect(MIGRATION).toMatch(/using \(public\.is_admin\(\)\)/)
  })
})

// ─── Task 2 — log-event helper ───────────────────────────────────────────────

describe('AFS-4 Task 2 — log-event helper', () => {
  it('is marked server-only so it cannot leak to the client bundle', () => {
    expect(LOG_EVENT).toMatch(/^import 'server-only'/m)
  })

  it('imports the shared supabaseAdmin singleton (no ad-hoc createClient)', () => {
    expect(LOG_EVENT).toMatch(/from '@\/lib\/supabase-admin'/)
    expect(LOG_EVENT).not.toMatch(/from '@supabase\/supabase-js'/)
  })

  it('wraps the insert in a fire-and-forget IIFE with try/catch', () => {
    expect(LOG_EVENT).toMatch(/void \(async \(\) => \{/)
    expect(LOG_EVENT).toMatch(/catch \(err\)/)
  })

  it('targets the kcp90_compression_events table', () => {
    expect(LOG_EVENT).toMatch(/\.from\('kcp90_compression_events'\)/)
  })
})

// ─── Task 3 — Void Chat wiring ───────────────────────────────────────────────

describe('AFS-4 Task 3 — Void Chat compression logging', () => {
  it('imports logKcp90Event', () => {
    expect(CHAT_SEND).toMatch(/from '@\/lib\/kcp90\/log-event'/)
  })

  it('captures raw + compressed history byte sizes', () => {
    expect(CHAT_SEND).toMatch(/rawHistoryBytes = JSON\.stringify\(history\)\.length/)
    expect(CHAT_SEND).toMatch(
      /compressedHistoryBytes = JSON\.stringify\(compressionResult\.messages\)\.length/,
    )
  })

  it('calls logKcp90Event with product void-chat inside onDone', () => {
    expect(CHAT_SEND).toMatch(/logKcp90Event\(\{[\s\S]*?product: 'void-chat'/)
  })
})

// ─── Task 4 — Quantum wiring ─────────────────────────────────────────────────

describe('AFS-4 Task 4 — Quantum session logging', () => {
  it('log-session endpoint file exists', () => {
    expect(exists('app', 'api', 'quantum', 'log-session', 'route.ts')).toBe(true)
  })

  it('endpoint uses createServerSupabaseClient (not createServerClient)', () => {
    expect(QUANTUM_LOG).toMatch(/createServerSupabaseClient/)
    expect(QUANTUM_LOG).not.toMatch(/from '@supabase\/ssr'/)
  })

  it('endpoint delegates to logKcp90Event with product quantum', () => {
    expect(QUANTUM_LOG).toMatch(/logKcp90Event\(\{[\s\S]*?product: 'quantum'/)
  })

  it('client.ts posts to /api/quantum/log-session on session_complete', () => {
    expect(QUANTUM_CLIENT).toMatch(/logQuantumSessionComplete/)
    expect(QUANTUM_CLIENT).toMatch(/'\/api\/quantum\/log-session'/)
  })
})

// ─── Task 5 — Break Room wiring ──────────────────────────────────────────────

describe('AFS-4 Task 5 — Break Room logging', () => {
  it('logs each chat turn with product break-room', () => {
    expect(BREAK_ROOM).toMatch(/from '@\/lib\/kcp90\/log-event'/)
    expect(BREAK_ROOM).toMatch(/logKcp90Event\(\{[\s\S]*?product: 'break-room'/)
  })
})

// ─── Task 6 — Trading Bot endpoint ───────────────────────────────────────────

describe('AFS-4 Task 6 — Trading Bot events endpoint', () => {
  it('endpoint file exists', () => {
    expect(exists('app', 'api', 'trading-bot', 'events', 'route.ts')).toBe(true)
  })

  it('uses the shared KCP90_API_SECRET (no new bespoke secret)', () => {
    expect(TRADING_BOT).toMatch(/process\.env\.KCP90_API_SECRET/)
    expect(TRADING_BOT).not.toMatch(/TRADING_BOT_WEBHOOK_SECRET/)
  })

  it('returns 401 on missing or wrong Bearer token', () => {
    expect(TRADING_BOT).toMatch(/'Unauthorized'/)
    expect(TRADING_BOT).toMatch(/401/)
  })

  it('logs with product trading-bot', () => {
    expect(TRADING_BOT).toMatch(/logKcp90Event\(\{[\s\S]*?product: 'trading-bot'/)
  })
})

// ─── Task 7 — /api/kcp90/stats rewire ────────────────────────────────────────

describe('AFS-4 Task 7 — /api/kcp90/stats rewire', () => {
  it('POST validates product against the 4-product allowlist', () => {
    expect(STATS_ROUTE).toMatch(/VALID_PRODUCTS/)
    expect(STATS_ROUTE).toMatch(/void-chat/)
    expect(STATS_ROUTE).toMatch(/break-room/)
  })

  it('POST delegates to logKcp90Event (no direct legacy kcp90_stats writes)', () => {
    expect(STATS_ROUTE).toMatch(/logKcp90Event\(/)
    expect(STATS_ROUTE).not.toMatch(/\.from\('kcp90_stats'\)/)
  })

  it('GET enforces admin role via profiles.role', () => {
    expect(STATS_ROUTE).toMatch(/profile\?\.role !== 'admin'/)
    expect(STATS_ROUTE).toMatch(/403/)
  })

  it('GET aggregates from kcp90_compression_events with 24h / 7d / 30d windows', () => {
    expect(STATS_ROUTE).toMatch(/\.from\('kcp90_compression_events'\)/)
    expect(STATS_ROUTE).toMatch(/'24h'/)
    expect(STATS_ROUTE).toMatch(/'7d'/)
    expect(STATS_ROUTE).toMatch(/'30d'/)
  })
})

// ─── Task 8a — dashboard adapter (pure unit tests) ───────────────────────────

describe('AFS-4 Task 8a — toLegacySummary adapter', () => {
  const blank = (): ProductCounters => ({
    events: 0, tokensIn: 0, tokensOut: 0, bytesRaw: 0, bytesCompressed: 0, successes: 0,
  })
  const emptyWin: Record<Kcp90Product, ProductCounters> = {
    'void-chat': blank(), 'quantum': blank(), 'trading-bot': blank(), 'break-room': blank(),
  }

  it('returns null when the window is undefined', () => {
    expect(toLegacySummary(undefined)).toBeNull()
  })

  it('returns zeros (not null) for an all-empty window', () => {
    const r = toLegacySummary(emptyWin)!
    expect(r.total_compressions).toBe(0)
    expect(r.overall_ratio).toBe(0)
    expect(r.active_products).toBe(0)
  })

  it('aggregates events, bytes, and tokens across products', () => {
    const win: Record<Kcp90Product, ProductCounters> = {
      ...emptyWin,
      'void-chat': { events: 3, tokensIn: 100, tokensOut: 200, bytesRaw: 1000, bytesCompressed: 400, successes: 3 },
      'quantum':   { events: 2, tokensIn:  50, tokensOut: 150, bytesRaw: 2000, bytesCompressed: 1600, successes: 2 },
    }
    const r = toLegacySummary(win)!
    expect(r.total_compressions).toBe(5)
    expect(r.total_original_chars).toBe(3000)
    expect(r.total_compressed_chars).toBe(2000)
    expect(r.total_tokens_saved).toBe(500)
    expect(r.active_products).toBe(2)
    // overall_ratio = (3000 - 2000) / 3000 = 0.333...
    expect(r.overall_ratio).toBeCloseTo(1 / 3, 4)
  })

  it('clamps overall_ratio to [0, 1]', () => {
    const weird: Record<Kcp90Product, ProductCounters> = {
      ...emptyWin,
      'void-chat': { events: 1, tokensIn: 0, tokensOut: 0, bytesRaw: 100, bytesCompressed: 500, successes: 1 },
    }
    const r = toLegacySummary(weird)!
    expect(r.overall_ratio).toBe(0)
  })
})

describe('AFS-4 Task 8a — toLegacyRecent adapter', () => {
  it('returns an empty array for undefined or empty input', () => {
    expect(toLegacyRecent(undefined)).toEqual([])
    expect(toLegacyRecent([])).toEqual([])
  })

  it('maps RecentEvent fields onto the legacy RecentStat shape', () => {
    const events: RecentEvent[] = [{
      id: 'abc',
      ts: '2026-04-22T10:00:00Z',
      product: 'void-chat',
      tokens_in: 40,
      tokens_out: 60,
      bytes_raw: 500,
      bytes_compressed: 250,
      compression_ratio: 0.5,
      layer_used: 'server-regex-v1',
      success: true,
    }]
    const [row] = toLegacyRecent(events)
    expect(row.id).toBe('abc')
    expect(row.created_at).toBe('2026-04-22T10:00:00Z')
    expect(row.product).toBe('void-chat')
    expect(row.encoder_used).toBe('server-regex-v1')
    expect(row.original_chars).toBe(500)
    expect(row.compressed_chars).toBe(250)
    expect(row.compression_ratio).toBe(0.5)
    expect(row.tokens_saved).toBe(100)
  })

  it('defaults layer_used to "none" and null bytes to 0', () => {
    const events: RecentEvent[] = [{
      id: 'x', ts: '2026-04-22T10:00:00Z', product: 'break-room',
      tokens_in: 10, tokens_out: 20,
      bytes_raw: null, bytes_compressed: null, compression_ratio: null,
      layer_used: null, success: true,
    }]
    const [row] = toLegacyRecent(events)
    expect(row.encoder_used).toBe('none')
    expect(row.original_chars).toBe(0)
    expect(row.compressed_chars).toBe(0)
    expect(row.compression_ratio).toBe(0)
    expect(row.tokens_saved).toBe(30)
  })
})

// ─── Task 8b — dashboard source wiring ───────────────────────────────────────

describe('AFS-4 Task 8b — dashboard + page rewire', () => {
  it('page.tsx no longer reads the legacy kcp90_stats / kcp90_summary tables', () => {
    expect(CP_PAGE).not.toMatch(/kcp90_summary/)
    expect(CP_PAGE).not.toMatch(/kcp90_daily_stats/)
    expect(CP_PAGE).not.toMatch(/from\('kcp90_stats'\)/)
  })

  it('page.tsx uses the shared server + admin client helpers', () => {
    expect(CP_PAGE).toMatch(/createServerSupabaseClient/)
    expect(CP_PAGE).toMatch(/supabaseAdmin/)
  })

  it('dashboard fetches /api/kcp90/stats and feeds the adapter', () => {
    expect(CP_DASHBOARD).toMatch(/'\/api\/kcp90\/stats'/)
    expect(CP_DASHBOARD).toMatch(/toLegacySummary/)
    expect(CP_DASHBOARD).toMatch(/toLegacyRecent/)
  })

  it('dashboard refreshes on mount in addition to the 30s interval', () => {
    expect(CP_DASHBOARD).toMatch(/void refresh\(\);\s*\n\s*const id = setInterval\(refresh, 30_000\)/)
  })
})
