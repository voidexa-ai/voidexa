// AFS-6a-fix post-ship bugfix invariants. Source-level checks because
// the affected UI surfaces are client-only and their behaviour is already
// exercised elsewhere — the fix bodies are small config/wording edits
// that are better guarded by tripwires than full mocks.

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const read = (...parts: string[]) => readFileSync(join(ROOT, ...parts), 'utf8')

const NAV_SRC = read('components', 'layout', 'Navigation.tsx')
const EN_I18N_SRC = read('lib', 'i18n', 'en.ts')
const DA_I18N_SRC = read('lib', 'i18n', 'da.ts')
const COSMETICS_CLIENT_SRC = read('components', 'shop', 'ShopCosmeticsClient.tsx')
const SHOP_PAGE_SRC = read('components', 'shop', 'ShopPage.tsx')
const CROSS_NAV_SRC = read('components', 'shop', 'ShopCrossNav.tsx')
const PACK_CLIENT_SRC = read('components', 'shop', 'PackShopClient.tsx')
const PACKS_META_SRC = read('app', 'shop', 'packs', 'page.tsx')

// Extract the Universe group block from Navigation.tsx so we assert on
// its children list specifically (not other nav groups).
function universeBlock(): string {
  const start = NAV_SRC.indexOf('label: t.nav.universe')
  expect(start).toBeGreaterThan(-1)
  const nextGroup = NAV_SRC.indexOf('label: t.nav.about', start)
  expect(nextGroup).toBeGreaterThan(start)
  return NAV_SRC.slice(start, nextGroup)
}

describe('AFS-6a-fix Bug 1 — Universe dropdown has 9 canonical items incl. Inventory', () => {
  const block = universeBlock()

  it('contains /shop href', () => {
    expect(block).toMatch(/href:\s*['"]\/shop['"]/)
  })

  it('contains /cards href', () => {
    expect(block).toMatch(/href:\s*['"]\/cards['"]/)
  })

  it('contains /inventory href (new in AFS-6a-fix)', () => {
    expect(block).toMatch(/href:\s*['"]\/inventory['"]/)
  })

  it('Universe dropdown has exactly 10 children (AFS-18c added /manual)', () => {
    // AFS-6a-fix originally locked 9 items. AFS-18c inserted "How to Play"
    // (/manual) at idx 5 between /cards and /achievements, raising the
    // total to 10 while keeping /inventory last.
    const hrefs = Array.from(block.matchAll(/href:\s*['"]([^'"]+)['"]/g)).map(m => m[1])
    expect(hrefs).toHaveLength(10)
    expect(hrefs).toContain('/manual')
    // Inventory still last (regression):
    expect(hrefs[hrefs.length - 1]).toBe('/inventory')
  })

  it('English i18n has an /inventory entry', () => {
    expect(EN_I18N_SRC).toMatch(/'\/inventory':\s*\{\s*label:\s*'Inventory'/)
  })

  it('Danish i18n has an /inventory entry (Beholdning)', () => {
    expect(DA_I18N_SRC).toMatch(/'\/inventory':\s*\{\s*label:\s*'Beholdning'/)
  })
})

describe('AFS-6a-fix Bug 2 — /shop/cosmetics back-link points to /shop', () => {
  it('ShopCosmeticsClient back-link href is /shop (not /)', () => {
    expect(COSMETICS_CLIENT_SRC).toMatch(/<Link\s+href="\/shop"\s+style=\{S\.backLink\}/)
    expect(COSMETICS_CLIENT_SRC).not.toMatch(/<Link\s+href="\/"\s+style=\{S\.backLink\}/)
  })

  it('ShopCosmeticsClient back-link text reads "← Shop"', () => {
    expect(COSMETICS_CLIENT_SRC).toContain('← Shop')
    expect(COSMETICS_CLIENT_SRC).not.toContain('← voidexa')
  })
})

describe('AFS-6a-fix Bug 3 — /shop hero has cross-nav links', () => {
  it('ShopPage imports ShopCrossNav', () => {
    expect(SHOP_PAGE_SRC).toContain("import ShopCrossNav from './ShopCrossNav'")
  })

  it('ShopPage renders <ShopCrossNav /> in the hero block', () => {
    expect(SHOP_PAGE_SRC).toMatch(/<ShopCrossNav\s*\/>/)
  })

  it('ShopCrossNav has link to /shop/cosmetics', () => {
    expect(CROSS_NAV_SRC).toMatch(/href="\/shop\/cosmetics"/)
  })

  it('ShopCrossNav has link to /shop/packs', () => {
    expect(CROSS_NAV_SRC).toMatch(/href="\/shop\/packs"/)
  })
})

describe('AFS-6a-fix Bug 4 — pack shop drops 257-card copy', () => {
  it('PackShopClient eyebrow no longer says "257-CARD"', () => {
    expect(PACK_CLIENT_SRC).not.toContain('257-CARD')
  })

  it('PackShopClient eyebrow reads "BOOSTER PACKS · ALPHA LIBRARY"', () => {
    expect(PACK_CLIENT_SRC).toContain('BOOSTER PACKS · ALPHA LIBRARY')
  })

  it('Pack route metadata description drops the "257 cards" claim', () => {
    expect(PACKS_META_SRC).not.toMatch(/257\s*cards/i)
    expect(PACKS_META_SRC).toMatch(/Alpha library/)
  })
})

describe('AFS-6a-fix Bug 5 — pack BUY locked down', () => {
  it('PackShopClient button label is "Coming Soon"', () => {
    expect(PACK_CLIENT_SRC).toContain('Coming Soon')
  })

  it('PackShopClient BUY button is unconditionally disabled', () => {
    // After the lockdown rewrite, the button carries a literal `disabled`
    // attribute rather than a computed conditional expression.
    expect(PACK_CLIENT_SRC).toMatch(/<button\s+disabled\s+aria-disabled="true"/)
  })

  it('PackShopClient no longer branches on Sign in / Not enough GHAI / Open Pack', () => {
    expect(PACK_CLIENT_SRC).not.toContain('Sign in to buy')
    expect(PACK_CLIENT_SRC).not.toContain('Not enough GHAI')
    expect(PACK_CLIENT_SRC).not.toContain('Open Pack →')
  })

  it('PackShopClient renders the explanatory lockdown line', () => {
    expect(PACK_CLIENT_SRC).toContain('Coming soon — Alpha library launches when art is ready')
  })

  it('Pack server endpoint /api/shop/open-pack still exists (backend untouched)', () => {
    const routeSrc = read('app', 'api', 'shop', 'open-pack', 'route.ts')
    expect(routeSrc).toMatch(/export\s+async\s+function\s+POST/)
  })
})
