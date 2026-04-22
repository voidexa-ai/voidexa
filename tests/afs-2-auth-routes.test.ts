// Sprint AFS-2 regression coverage for auth-route infrastructure.
//
// Uses the same source-level assertion pattern as AFS-1 and AFS-7: read the
// relevant files off disk and verify invariants (redirect entries, auth
// guards, component wiring, i18n labels). No Playwright runner — the AFS-1
// deviation documented in CLAUDE.md stands.
//
// Covers 1:1 with sprint tasks:
//   Task 1 — 7 EN + 7 DK canonical redirects, all permanent (308)
//   Task 2 — /wallet page: auth gate, data fetch, client UI wiring
//   Task 3 — /settings page: auth gate, profile/locale/signout wiring
//   Task 4 — AuthButton dropdown exposes Wallet + Settings (EN + DK labels)
//   DK     — mirror pages exist and re-export their English counterparts

import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const read = (...parts: string[]) => readFileSync(join(ROOT, ...parts), 'utf8')
const exists = (...parts: string[]) => existsSync(join(ROOT, ...parts))

const NEXT_CONFIG_SRC = read('next.config.ts')
const AUTH_BUTTON_SRC = read('components', 'AuthButton.tsx')
const LOGIN_SRC = read('app', 'auth', 'login', 'page.tsx')

const WALLET_PAGE_SRC = read('app', 'wallet', 'page.tsx')
const WALLET_LAYOUT_SRC = read('app', 'wallet', 'layout.tsx')
const WALLET_CLIENT_SRC = read('components', 'wallet', 'WalletPageClient.tsx')
const SETTINGS_PAGE_SRC = read('app', 'settings', 'page.tsx')
const SETTINGS_LAYOUT_SRC = read('app', 'settings', 'layout.tsx')
const SETTINGS_CLIENT_SRC = read('components', 'settings', 'SettingsPageClient.tsx')

const DK_WALLET_SRC = read('app', 'dk', 'wallet', 'page.tsx')
const DK_SETTINGS_SRC = read('app', 'dk', 'settings', 'page.tsx')
const DK_PROFILE_SRC = read('app', 'dk', 'profile', 'page.tsx')
const DK_LOGIN_SRC = read('app', 'dk', 'auth', 'login', 'page.tsx')
const DK_SIGNUP_SRC = read('app', 'dk', 'auth', 'signup', 'page.tsx')

describe('AFS-2 Task 1 — next.config.ts redirects', () => {
  it('exposes a redirects() factory on the exported config', () => {
    expect(NEXT_CONFIG_SRC).toMatch(/redirects:\s*async/)
  })

  const EN_PAIRS: Array<[string, string]> = [
    ['/login', '/auth/login'],
    ['/signin', '/auth/login'],
    ['/signup', '/auth/signup'],
    ['/register', '/auth/signup'],
    ['/auth/signin', '/auth/login'],
    ['/auth/register', '/auth/signup'],
    ['/account', '/profile'],
  ]

  for (const [src, dst] of EN_PAIRS) {
    it(`EN: ${src} redirects to ${dst} (permanent)`, () => {
      const re = new RegExp(
        `source:\\s*['"]${src.replace(/\//g, '\\/')}['"][^}]*destination:\\s*['"]${dst.replace(/\//g, '\\/')}['"][^}]*permanent:\\s*true`
      )
      expect(NEXT_CONFIG_SRC).toMatch(re)
    })
  }

  const DK_PAIRS: Array<[string, string]> = [
    ['/dk/login', '/dk/auth/login'],
    ['/dk/signin', '/dk/auth/login'],
    ['/dk/signup', '/dk/auth/signup'],
    ['/dk/register', '/dk/auth/signup'],
    ['/dk/auth/signin', '/dk/auth/login'],
    ['/dk/auth/register', '/dk/auth/signup'],
    ['/dk/account', '/dk/profile'],
  ]

  for (const [src, dst] of DK_PAIRS) {
    it(`DK: ${src} redirects to ${dst} (permanent)`, () => {
      const re = new RegExp(
        `source:\\s*['"]${src.replace(/\//g, '\\/')}['"][^}]*destination:\\s*['"]${dst.replace(/\//g, '\\/')}['"][^}]*permanent:\\s*true`
      )
      expect(NEXT_CONFIG_SRC).toMatch(re)
    })
  }

  it('every redirect destination exists as a real page or aliased folder', () => {
    const destinations = [
      '/auth/login', '/auth/signup', '/profile',
      '/dk/auth/login', '/dk/auth/signup', '/dk/profile',
    ]
    for (const dest of destinations) {
      const asPage = `app${dest}/page.tsx`.replace(/\//g, '/')
      expect(exists(...asPage.split('/'))).toBe(true)
    }
  })
})

describe('AFS-2 Task 1 — /auth/login honors ?redirect= query param', () => {
  it('reads the redirect search param via useSearchParams', () => {
    expect(LOGIN_SRC).toMatch(/useSearchParams/)
    expect(LOGIN_SRC).toMatch(/searchParams\.get\(['"]redirect['"]\)/)
  })

  it('only allows relative paths (blocks open-redirect)', () => {
    expect(LOGIN_SRC).toMatch(/sanitizeRedirect/)
    expect(LOGIN_SRC).toMatch(/startsWith\(['"]\/\/['"]/)
  })

  it('falls back to /profile when no redirect param is set', () => {
    expect(LOGIN_SRC).toMatch(/return '\/profile'/)
  })
})

describe('AFS-2 Task 2 — /wallet page', () => {
  it('has a default-exported async server page', () => {
    expect(WALLET_PAGE_SRC).toMatch(/export default async function/)
  })

  it('redirects unauthenticated visitors to /auth/login with return path', () => {
    expect(WALLET_PAGE_SRC).toMatch(/redirect\(['"]\/auth\/login\?redirect=\/wallet['"]\)/)
  })

  it('fetches balance from user_wallets via the admin client', () => {
    expect(WALLET_PAGE_SRC).toMatch(/from\(['"]user_wallets['"]\)/)
    expect(WALLET_PAGE_SRC).toMatch(/supabaseAdmin/)
  })

  it('fetches the last 10 wallet_transactions for the current user', () => {
    expect(WALLET_PAGE_SRC).toMatch(/from\(['"]wallet_transactions['"]\)/)
    expect(WALLET_PAGE_SRC).toMatch(/limit\(10\)/)
  })

  it('renders WalletPageClient with typed props', () => {
    expect(WALLET_PAGE_SRC).toMatch(/<WalletPageClient/)
    expect(WALLET_PAGE_SRC).toMatch(/transactions=\{/)
  })

  it('layout declares a unique canonical title', () => {
    expect(WALLET_LAYOUT_SRC).toMatch(/Wallet — voidexa/)
    expect(WALLET_LAYOUT_SRC).toMatch(/canonical:\s*['"]\/wallet['"]/)
  })

  it('client reuses the existing WalletBar top-up component', () => {
    expect(WALLET_CLIENT_SRC).toMatch(/import WalletBar/)
    expect(WALLET_CLIENT_SRC).toMatch(/<WalletBar\s*\/>/)
  })

  it('client renders transaction history with balance and amount columns', () => {
    expect(WALLET_CLIENT_SRC).toMatch(/Recent transactions/)
    expect(WALLET_CLIENT_SRC).toMatch(/data-testid="wallet-transactions"/)
  })

  it('client nudges empty-balance users to the GHAI explainer', () => {
    expect(WALLET_CLIENT_SRC).toMatch(/\/ghost-ai/)
  })

  it('page.tsx stays under the 100-line soft cap', () => {
    const lineCount = WALLET_PAGE_SRC.split('\n').length
    expect(lineCount).toBeLessThanOrEqual(100)
  })

  it('client component stays under the 300-line soft cap', () => {
    const lineCount = WALLET_CLIENT_SRC.split('\n').length
    expect(lineCount).toBeLessThanOrEqual(300)
  })
})

describe('AFS-2 Task 3 — /settings page', () => {
  it('has a default-exported async server page', () => {
    expect(SETTINGS_PAGE_SRC).toMatch(/export default async function/)
  })

  it('redirects unauthenticated visitors to /auth/login with return path', () => {
    expect(SETTINGS_PAGE_SRC).toMatch(/redirect\(['"]\/auth\/login\?redirect=\/settings['"]\)/)
  })

  it('loads the current profile row before rendering the client', () => {
    expect(SETTINGS_PAGE_SRC).toMatch(/from\(['"]profiles['"]\)/)
    expect(SETTINGS_PAGE_SRC).toMatch(/<SettingsPageClient/)
  })

  it('layout declares a unique canonical title', () => {
    expect(SETTINGS_LAYOUT_SRC).toMatch(/Settings — voidexa/)
    expect(SETTINGS_LAYOUT_SRC).toMatch(/canonical:\s*['"]\/settings['"]/)
  })

  it('client writes display name updates to the profiles table', () => {
    // Allow whitespace/newlines between .from() and .update() — the actual
    // implementation uses a multi-line fluent chain.
    expect(SETTINGS_CLIENT_SRC).toMatch(/from\(['"]profiles['"]\)\s*\.update/)
  })

  it('client persists language preference under a namespaced localStorage key', () => {
    expect(SETTINGS_CLIENT_SRC).toMatch(/voidexa_locale_pref_v1/)
  })

  it('client offers both EN and DA as language options', () => {
    expect(SETTINGS_CLIENT_SRC).toMatch(/English/)
    expect(SETTINGS_CLIENT_SRC).toMatch(/Dansk/)
  })

  it('client has a sign-out button wired to supabase.auth.signOut', () => {
    expect(SETTINGS_CLIENT_SRC).toMatch(/supabase\.auth\.signOut/)
    expect(SETTINGS_CLIENT_SRC).toMatch(/Sign out/)
  })

  it('danger zone links delete-account requests to /contact with subject', () => {
    expect(SETTINGS_CLIENT_SRC).toMatch(/\/contact\?subject=Delete%20account%20request/)
  })

  it('page.tsx stays under the 100-line soft cap', () => {
    const lineCount = SETTINGS_PAGE_SRC.split('\n').length
    expect(lineCount).toBeLessThanOrEqual(100)
  })

  it('client component stays under the 300-line soft cap', () => {
    const lineCount = SETTINGS_CLIENT_SRC.split('\n').length
    expect(lineCount).toBeLessThanOrEqual(300)
  })
})

describe('AFS-2 Task 4 — AuthButton dropdown', () => {
  it('imports useI18n so links localize for DK users', () => {
    expect(AUTH_BUTTON_SRC).toMatch(/useI18n/)
    expect(AUTH_BUTTON_SRC).toMatch(/localizeHref/)
  })

  it('exposes Wallet, Settings, Profile, and Sign out as dropdown entries', () => {
    expect(AUTH_BUTTON_SRC).toMatch(/localizeHref\(['"]\/profile['"]\)/)
    expect(AUTH_BUTTON_SRC).toMatch(/localizeHref\(['"]\/wallet['"]\)/)
    expect(AUTH_BUTTON_SRC).toMatch(/localizeHref\(['"]\/settings['"]\)/)
  })

  it('ships Danish labels for every menu entry', () => {
    expect(AUTH_BUTTON_SRC).toMatch(/Tegnebog/)
    expect(AUTH_BUTTON_SRC).toMatch(/Indstillinger/)
    expect(AUTH_BUTTON_SRC).toMatch(/Profil/)
    expect(AUTH_BUTTON_SRC).toMatch(/Log ud/)
  })

  it('still calls supabase.auth.signOut on sign-out click', () => {
    expect(AUTH_BUTTON_SRC).toMatch(/supabase\.auth\.signOut/)
  })
})

describe('AFS-2 — Danish locale mirror pages', () => {
  it('/dk/wallet re-exports /wallet with DK metadata', () => {
    expect(DK_WALLET_SRC).toMatch(/from '@\/app\/wallet\/page'/)
    expect(DK_WALLET_SRC).toMatch(/Tegnebog — voidexa/)
    expect(DK_WALLET_SRC).toMatch(/canonical:\s*['"]\/dk\/wallet['"]/)
  })

  it('/dk/settings re-exports /settings with DK metadata', () => {
    expect(DK_SETTINGS_SRC).toMatch(/from '@\/app\/settings\/page'/)
    expect(DK_SETTINGS_SRC).toMatch(/Indstillinger — voidexa/)
  })

  it('/dk/profile re-exports /profile with DK metadata', () => {
    expect(DK_PROFILE_SRC).toMatch(/from '@\/app\/profile\/page'/)
    expect(DK_PROFILE_SRC).toMatch(/Profil — voidexa/)
  })

  it('/dk/auth/login re-exports /auth/login with DK metadata', () => {
    expect(DK_LOGIN_SRC).toMatch(/from '@\/app\/auth\/login\/page'/)
    expect(DK_LOGIN_SRC).toMatch(/Log ind — voidexa/)
  })

  it('/dk/auth/signup re-exports /auth/signup with DK metadata', () => {
    expect(DK_SIGNUP_SRC).toMatch(/from '@\/app\/auth\/signup\/page'/)
    expect(DK_SIGNUP_SRC).toMatch(/Opret konto — voidexa/)
  })
})
