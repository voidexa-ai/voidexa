import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// AFS-18c - Walker tests for the cross-surface integration: the
// "Read the rules" / "Læs reglerne" button on /cards and the
// "How to Play" entry in the Universe dropdown nav. Plus regression on
// the AFS-6a-fix "Inventory is last" assertion.

const CATALOG_SRC = readFileSync(
  join(process.cwd(), 'components', 'cards', 'AlphaCatalog.tsx'),
  'utf8',
)
const NAV_SRC = readFileSync(
  join(process.cwd(), 'components', 'layout', 'Navigation.tsx'),
  'utf8',
)
const I18N_EN_SRC = readFileSync(
  join(process.cwd(), 'lib', 'i18n', 'en.ts'),
  'utf8',
)
const I18N_DA_SRC = readFileSync(
  join(process.cwd(), 'lib', 'i18n', 'da.ts'),
  'utf8',
)

describe('AFS-18c "Read the rules" / "Læs reglerne" button on /cards', () => {
  it('AlphaCatalog renders a Link with data-testid="read-the-rules"', () => {
    expect(CATALOG_SRC).toMatch(/data-testid=['"]read-the-rules['"]/)
  })

  it('Both EN and DK label strings appear in source', () => {
    expect(CATALOG_SRC).toContain('Read the rules')
    expect(CATALOG_SRC).toContain('Læs reglerne')
  })

  it('Button href is locale-aware: /manual on EN, /dk/manual on DK', () => {
    expect(CATALOG_SRC).toMatch(/manualHref\s*=\s*isDk\s*\?\s*['"]\/dk\/manual['"]\s*:\s*['"]\/manual['"]/)
  })

  it('Includes the 📖 emoji in the button label per Q8', () => {
    expect(CATALOG_SRC).toContain('📖')
  })
})

describe('AFS-18c "How to Play" entry in Universe dropdown', () => {
  it('Navigation has /manual entry with default label "How to Play"', () => {
    expect(NAV_SRC).toMatch(
      /href:\s*['"]\/manual['"][\s\S]*?tLink\(['"]\/manual['"]\s*,\s*['"]How to Play['"]/,
    )
  })

  it('/manual entry sits between /cards and /achievements (idx 5)', () => {
    // String-match the three lines in source order so a future re-order
    // would break the test loudly.
    const cardsIdx = NAV_SRC.indexOf("href: '/cards'")
    const manualIdx = NAV_SRC.indexOf("href: '/manual'")
    const achIdx = NAV_SRC.indexOf("href: '/achievements'")
    expect(cardsIdx).toBeGreaterThan(0)
    expect(manualIdx).toBeGreaterThan(cardsIdx)
    expect(achIdx).toBeGreaterThan(manualIdx)
  })
})

describe('AFS-18c i18n keys - /manual', () => {
  it('lib/i18n/en.ts has /manual key with "How to Play" label', () => {
    expect(I18N_EN_SRC).toMatch(
      /'\/manual':\s*\{\s*label:\s*['"]How to Play['"]/,
    )
  })

  it('lib/i18n/da.ts has /manual key with "Sådan spiller du" label', () => {
    expect(I18N_DA_SRC).toMatch(
      /'\/manual':\s*\{\s*label:\s*['"]Sådan spiller du['"]/,
    )
  })
})

describe('AFS-6a-fix regression - Inventory is still LAST in Universe dropdown', () => {
  it('Inventory appears AFTER all other Universe entries', () => {
    // The Universe block starts at "label: t.nav.universe" and ends at the
    // next "label:" at the same indentation level. We only need to ensure
    // /inventory occurs after /achievements and after /manual.
    const invIdx = NAV_SRC.indexOf("href: '/inventory'")
    const achIdx = NAV_SRC.indexOf("href: '/achievements'")
    const manualIdx = NAV_SRC.indexOf("href: '/manual'")
    expect(invIdx).toBeGreaterThan(achIdx)
    expect(invIdx).toBeGreaterThan(manualIdx)
  })
})
