// Sprint AFS-7 regression coverage for legal pages, sitemap, robots, and the
// cookie consent module. Uses the same source-level pattern as the AFS-1
// regression suite (reads files from disk, asserts invariants) plus direct
// exercise of the pure consent module under a stubbed window.

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const read = (...parts: string[]) => readFileSync(join(ROOT, ...parts), 'utf8')

const PRIVACY_SRC = read('app', 'privacy', 'page.tsx')
const TERMS_SRC = read('app', 'terms', 'page.tsx')
const COOKIES_SRC = read('app', 'cookies', 'page.tsx')
const SITEMAP_SRC = read('app', 'sitemap.ts')
const ROBOTS_SRC = read('app', 'robots.ts')
const LAYOUT_SRC = read('app', 'layout.tsx')
const BANNER_SRC = read('components', 'legal', 'CookieBanner.tsx')
const DK_PRIVACY_SRC = read('app', 'dk', 'privacy', 'page.tsx')
const DK_TERMS_SRC = read('app', 'dk', 'terms', 'page.tsx')
const DK_COOKIES_SRC = read('app', 'dk', 'cookies', 'page.tsx')

class MockStorage {
  private store = new Map<string, string>()
  getItem = (k: string) => (this.store.has(k) ? this.store.get(k)! : null)
  setItem = (k: string, v: string) => { this.store.set(k, v) }
  removeItem = (k: string) => { this.store.delete(k) }
  clear = () => { this.store.clear() }
  key = () => null
  get length() { return this.store.size }
}

function installWindow() {
  const local = new MockStorage()
  vi.stubGlobal('window', { localStorage: local })
  return { local }
}

describe('AFS-7 — /privacy page', () => {
  it('defines a default-exported React component', () => {
    expect(PRIVACY_SRC).toMatch(/export default function\s+\w+Page/)
  })

  it('names the correct data controller (CVR 46343387)', () => {
    expect(PRIVACY_SRC).toMatch(/CVR\s*46343387/)
  })

  it('references the Danish data protection authority (Datatilsynet)', () => {
    expect(PRIVACY_SRC).toMatch(/Datatilsynet/)
  })

  it('lists all named sub-processors', () => {
    for (const name of ['Supabase', 'Stripe', 'Vercel', 'Anthropic']) {
      expect(PRIVACY_SRC).toMatch(new RegExp(name))
    }
  })

  it('discloses GDPR user rights (access, erasure, portability)', () => {
    expect(PRIVACY_SRC.toLowerCase()).toContain('access')
    expect(PRIVACY_SRC.toLowerCase()).toMatch(/erase|erasure/)
    expect(PRIVACY_SRC.toLowerCase()).toMatch(/portable|portability/)
  })

  it('states retention periods including a 5-year tax record line', () => {
    expect(PRIVACY_SRC).toMatch(/5\s+years/)
    expect(PRIVACY_SRC.toLowerCase()).toMatch(/retention|retain|kept/)
  })

  it('picks Danish law as governing law', () => {
    expect(PRIVACY_SRC.toLowerCase()).toMatch(/danish law|governed by danish/)
  })
})

describe('AFS-7 — /terms page', () => {
  it('defines a default-exported React component', () => {
    expect(TERMS_SRC).toMatch(/export default function\s+\w+Page/)
  })

  it('marks GHAI as non-refundable, not crypto, not an investment', () => {
    expect(TERMS_SRC.toLowerCase()).toMatch(/non-refundable/)
    expect(TERMS_SRC.toLowerCase()).toMatch(/not a cryptocurrency/)
    expect(TERMS_SRC.toLowerCase()).toMatch(/not an investment/)
  })

  it('documents the 2-year reklamationsret for physical products', () => {
    expect(TERMS_SRC).toMatch(/2-year\s+reklamationsret/i)
  })

  it('names Vordingborg retskreds as Danish venue', () => {
    expect(TERMS_SRC).toMatch(/Vordingborg/)
    expect(TERMS_SRC).toMatch(/retskreds/)
  })

  it('covers user-generated content for Trading Hub and Break Room', () => {
    expect(TERMS_SRC).toMatch(/Trading Hub/)
    expect(TERMS_SRC).toMatch(/Break Room/)
  })
})

describe('AFS-7 — /cookies page', () => {
  it('defines a default-exported React component', () => {
    expect(COOKIES_SRC).toMatch(/export default function\s+\w+Page/)
  })

  it('references the consent storage key', () => {
    expect(COOKIES_SRC).toContain('voidexa_cookie_consent_v1')
  })

  it('documents both essential and analytics tiers', () => {
    expect(COOKIES_SRC.toLowerCase()).toContain('essential')
    expect(COOKIES_SRC.toLowerCase()).toContain('analytics')
  })

  it('embeds the CookieSettings toggle for mid-page consent change', () => {
    expect(COOKIES_SRC).toMatch(/CookieSettings/)
  })
})

describe('AFS-7 — CookieBanner + consent module', () => {
  beforeEach(() => { vi.unstubAllGlobals() })

  it('banner references the /cookies link and both consent buttons', () => {
    expect(BANNER_SRC).toContain('/cookies')
    expect(BANNER_SRC).toMatch(/Essentials only/)
    expect(BANNER_SRC).toMatch(/Allow all/)
  })

  it('consent key constant is exactly voidexa_cookie_consent_v1', async () => {
    const mod = await import('@/lib/cookies/consent')
    expect(mod.COOKIE_CONSENT_KEY).toBe('voidexa_cookie_consent_v1')
  })

  it('getCookieConsent returns null when storage is empty', async () => {
    installWindow()
    const { getCookieConsent } = await import('@/lib/cookies/consent')
    expect(getCookieConsent()).toBeNull()
  })

  it('setCookieConsent persists "essential" to localStorage', async () => {
    const { local } = installWindow()
    const { setCookieConsent, getCookieConsent } = await import('@/lib/cookies/consent')
    setCookieConsent('essential')
    expect(local.getItem('voidexa_cookie_consent_v1')).toBe('essential')
    expect(getCookieConsent()).toBe('essential')
  })

  it('setCookieConsent persists "all" to localStorage', async () => {
    const { local } = installWindow()
    const { setCookieConsent, getCookieConsent } = await import('@/lib/cookies/consent')
    setCookieConsent('all')
    expect(local.getItem('voidexa_cookie_consent_v1')).toBe('all')
    expect(getCookieConsent()).toBe('all')
  })

  it('getCookieConsent ignores malformed stored values', async () => {
    const { local } = installWindow()
    local.setItem('voidexa_cookie_consent_v1', 'garbage')
    const { getCookieConsent } = await import('@/lib/cookies/consent')
    expect(getCookieConsent()).toBeNull()
  })

  it('clearCookieConsent removes the stored value', async () => {
    const { local } = installWindow()
    const { setCookieConsent, clearCookieConsent } = await import('@/lib/cookies/consent')
    setCookieConsent('all')
    clearCookieConsent()
    expect(local.getItem('voidexa_cookie_consent_v1')).toBeNull()
  })

  it('root layout renders the CookieBanner', () => {
    expect(LAYOUT_SRC).toMatch(/import CookieBanner/)
    expect(LAYOUT_SRC).toMatch(/<CookieBanner/)
  })
})

describe('AFS-7 — app/sitemap.ts', () => {
  it('includes every required public route from the brief', () => {
    const required = [
      '/about', '/services', '/products', '/quantum', '/shop',
      '/cards', '/starmap', '/break-room', '/contact', '/team',
      '/achievements', '/freeflight', '/claim-your-planet',
      '/privacy', '/terms', '/cookies',
    ]
    for (const path of required) {
      expect(SITEMAP_SRC, `missing ${path}`).toContain(`'${path}'`)
    }
  })

  it('includes the root / and Danish mirror /dk', () => {
    expect(SITEMAP_SRC).toMatch(/'\/'[,\s]/)
    expect(SITEMAP_SRC).toMatch(/'\/dk'[,\s]/)
  })

  it('does not expose private route roots (/admin, /control-plane, /auth, /api)', () => {
    expect(SITEMAP_SRC).not.toMatch(/'\/admin'/)
    expect(SITEMAP_SRC).not.toMatch(/'\/control-plane'/)
    expect(SITEMAP_SRC).not.toMatch(/'\/auth'/)
    expect(SITEMAP_SRC).not.toMatch(/'\/api'/)
  })

  it('default export is a function returning >= 30 entries', async () => {
    const mod = await import('@/app/sitemap')
    const entries = mod.default()
    expect(Array.isArray(entries)).toBe(true)
    expect(entries.length).toBeGreaterThanOrEqual(30)
    for (const e of entries) {
      expect(e.url.startsWith('https://voidexa.com')).toBe(true)
    }
  })

  it('uses voidexa.com absolute URLs', () => {
    expect(SITEMAP_SRC).toContain('https://voidexa.com')
  })
})

describe('AFS-7 — app/robots.ts', () => {
  it('default export returns admin/control-plane/auth/api in the disallow list', async () => {
    const mod = await import('@/app/robots')
    const robots = mod.default()
    expect(robots.rules).toBeDefined()
    const rule = Array.isArray(robots.rules) ? robots.rules[0] : robots.rules
    const disallow = Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow]
    for (const blocked of ['/admin', '/control-plane', '/auth', '/api']) {
      expect(disallow).toContain(blocked)
    }
  })

  it('points sitemap to https://voidexa.com/sitemap.xml', async () => {
    const mod = await import('@/app/robots')
    const robots = mod.default()
    expect(robots.sitemap).toBe('https://voidexa.com/sitemap.xml')
  })

  it('allows / for all user agents', async () => {
    const mod = await import('@/app/robots')
    const robots = mod.default()
    const rule = Array.isArray(robots.rules) ? robots.rules[0] : robots.rules
    expect(rule.userAgent).toBe('*')
    expect(rule.allow).toBe('/')
  })
})

describe('AFS-7 — Danish mirrors re-export English counterparts', () => {
  it('/dk/privacy re-exports @/app/privacy/page', () => {
    expect(DK_PRIVACY_SRC).toMatch(/from\s+['"]@\/app\/privacy\/page['"]/)
    expect(DK_PRIVACY_SRC).toMatch(/<EnglishPrivacy\s*\/>/)
  })

  it('/dk/terms re-exports @/app/terms/page', () => {
    expect(DK_TERMS_SRC).toMatch(/from\s+['"]@\/app\/terms\/page['"]/)
    expect(DK_TERMS_SRC).toMatch(/<EnglishTerms\s*\/>/)
  })

  it('/dk/cookies re-exports @/app/cookies/page', () => {
    expect(DK_COOKIES_SRC).toMatch(/from\s+['"]@\/app\/cookies\/page['"]/)
    expect(DK_COOKIES_SRC).toMatch(/<EnglishCookies\s*\/>/)
  })
})
