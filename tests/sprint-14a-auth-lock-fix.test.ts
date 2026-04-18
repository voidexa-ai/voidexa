import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Sprint 14A: verifies the auth-lock storm fix on /freeflight — all client
// hooks loaded on that page must consume the shared AuthProvider context
// instead of calling supabase.auth.getUser() directly. Bypassing the context
// re-introduces the 12-second gotrue-lock thrash that froze the game.

const repo = process.cwd()
const read = (...p: string[]) => readFileSync(join(repo, ...p), 'utf8')

const AUTH_PROVIDER = read('components', 'AuthProvider.tsx')
const SUPABASE = read('lib', 'supabase.ts')
const LAYOUT = read('app', 'layout.tsx')
const WRECKS = read('components', 'freeflight', 'useWrecks.ts')
const ACTIVE_MISSION = read('components', 'freeflight', 'useActiveMission.ts')
const EXPLORATION = read('components', 'freeflight', 'useExplorationResolved.ts')
const WARP = read('components', 'freeflight', 'useWarp.ts')
const QUESTS = read('lib', 'game', 'quests', 'progress.ts')
const GHAI_BALANCE = read('components', 'wallet', 'GhaiBalance.tsx')

describe('AuthProvider — single shared user context', () => {
  it('uses getSession (local, no network) + onAuthStateChange — not polling getUser', () => {
    expect(AUTH_PROVIDER).toMatch(/supabase\.auth\.getSession\(\)/)
    expect(AUTH_PROVIDER).toMatch(/supabase\.auth\.onAuthStateChange/)
    expect(AUTH_PROVIDER).not.toMatch(/supabase\.auth\.getUser\(\)/)
  })

  it('exposes useAuth() consumer hook', () => {
    expect(AUTH_PROVIDER).toMatch(/export function useAuth/)
  })

  it('is mounted at app root in app/layout.tsx', () => {
    expect(LAYOUT).toMatch(/<AuthProvider>/)
    expect(LAYOUT).toMatch(/import { AuthProvider } from '@\/components\/AuthProvider'/)
  })
})

describe('Supabase browser client — singleton invariant', () => {
  it('exports a single shared supabase instance', () => {
    expect(SUPABASE).toMatch(/export const supabase = createClient\(\)/)
  })

  it('uses createBrowserClient from @supabase/ssr (the lock-safe client)', () => {
    expect(SUPABASE).toMatch(/createBrowserClient/)
    expect(SUPABASE).toMatch(/from '@supabase\/ssr'/)
  })
})

describe('/freeflight hooks consume AuthProvider — no direct getUser calls', () => {
  it('useWrecks consumes useAuth() and does not call supabase.auth.getUser', () => {
    expect(WRECKS).toMatch(/import { useAuth } from '@\/components\/AuthProvider'/)
    expect(WRECKS).toMatch(/const \{ user(?:,|\s|\s*})/)
    expect(WRECKS).not.toMatch(/supabase\.auth\.getUser\(\)/)
  })

  it('useActiveMission consumes useAuth() and does not call supabase.auth.getUser', () => {
    expect(ACTIVE_MISSION).toMatch(/import { useAuth } from '@\/components\/AuthProvider'/)
    expect(ACTIVE_MISSION).not.toMatch(/supabase\.auth\.getUser\(\)/)
  })

  it('useExplorationResolved consumes useAuth() and does not call supabase.auth.getUser', () => {
    expect(EXPLORATION).toMatch(/import { useAuth } from '@\/components\/AuthProvider'/)
    expect(EXPLORATION).not.toMatch(/supabase\.auth\.getUser\(\)/)
  })

  it('useWarp consumes useAuth() and does not call supabase.auth.getUser', () => {
    expect(WARP).toMatch(/import { useAuth } from '@\/components\/AuthProvider'/)
    expect(WARP).not.toMatch(/supabase\.auth\.getUser\(\)/)
  })

  it('useActiveQuestChain (lib/game/quests/progress.ts) consumes useAuth() — no direct getUser', () => {
    expect(QUESTS).toMatch(/import { useAuth } from '@\/components\/AuthProvider'/)
    expect(QUESTS).not.toMatch(/supabase\.auth\.getUser\(\)/)
  })

  it('GhaiBalance already consumes useAuth (pre-existing), stays consistent with pattern', () => {
    expect(GHAI_BALANCE).toMatch(/import { useAuth } from '@\/components\/AuthProvider'/)
    expect(GHAI_BALANCE).not.toMatch(/supabase\.auth\.getUser\(\)/)
  })
})

describe('/freeflight wrecks polling — reduced to 60s (no per-poll balance fetch)', () => {
  it('wrecks poll interval is 60 seconds (was 30s)', () => {
    // Must be declared in ms — 60_000 or 60000.
    expect(WRECKS).toMatch(/POLL_INTERVAL_MS\s*=\s*60_?000/)
    expect(WRECKS).not.toMatch(/POLL_INTERVAL_MS\s*=\s*30_?000/)
  })

  it('balance refresh is decoupled from wrecks polling — only fetched on user change or mutation', () => {
    // The load() function (called by setInterval) must not read user_credits.
    // Balance lives in a separate fetchBalance helper.
    expect(WRECKS).toMatch(/fetchBalance/)
    // The interval should call load, not loadWithBalance, so balance isn't
    // re-fetched every 60s.
    expect(WRECKS).toMatch(/setInterval\(load,\s*POLL_INTERVAL_MS\)/)
  })
})
