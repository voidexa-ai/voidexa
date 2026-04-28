import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// AFS-18b - Walker tests for the rarity filter UI on AlphaCatalog and the
// matching server-side filter on /cards (EN + DK) pages.

const CATALOG_SRC = readFileSync(
  join(process.cwd(), 'components', 'cards', 'AlphaCatalog.tsx'),
  'utf8',
)
const PAGE_EN_SRC = readFileSync(
  join(process.cwd(), 'app', 'cards', 'page.tsx'),
  'utf8',
)
const PAGE_DK_SRC = readFileSync(
  join(process.cwd(), 'app', 'dk', 'cards', 'page.tsx'),
  'utf8',
)

describe('AFS-18b AlphaCatalog - rarity filter pill row', () => {
  it('imports VALID_ALPHA_RARITIES + ALPHA_RARITY_LABELS + AlphaRarityDb', () => {
    expect(CATALOG_SRC).toMatch(
      /import\s*\{[\s\S]*?VALID_ALPHA_RARITIES[\s\S]*?\}\s*from\s*['"]@\/lib\/cards\/alpha-types['"]/,
    )
    expect(CATALOG_SRC).toMatch(/ALPHA_RARITY_LABELS/)
    expect(CATALOG_SRC).toMatch(/AlphaRarityDb/)
  })

  it('declares activeRarity?: AlphaRarityDb | null on Props', () => {
    expect(CATALOG_SRC).toMatch(/activeRarity\?:\s*AlphaRarityDb\s*\|\s*null/)
  })

  it('renders a second nav with aria-label="Card rarity filter"', () => {
    expect(CATALOG_SRC).toMatch(/aria-label=['"]Card rarity filter['"]/)
  })

  it('renders an "All" link distinct from the rarity pills', () => {
    // The All link uses null as the rarity value in buildHref.
    expect(CATALOG_SRC).toMatch(
      /buildHref\(\s*basePath\s*,\s*activeType\s*,\s*null\s*,\s*1\s*\)[\s\S]*?All\s*<\/Link>/,
    )
  })

  it('iterates VALID_ALPHA_RARITIES.map for the rarity pills', () => {
    expect(CATALOG_SRC).toMatch(/VALID_ALPHA_RARITIES[\s\S]{0,200}\.map\(/)
  })

  it('uses ALPHA_RARITY_LABELS[dbRarity] for the pill text', () => {
    expect(CATALOG_SRC).toMatch(/ALPHA_RARITY_LABELS\[dbRarity\]/)
  })
})

describe('AFS-18b /cards (EN) - server-side rarity filter', () => {
  it('imports isValidAlphaRarity from alpha-types', () => {
    expect(PAGE_EN_SRC).toMatch(
      /import\s*\{[\s\S]*?isValidAlphaRarity[\s\S]*?\}\s*from\s*['"]@\/lib\/cards\/alpha-types['"]/,
    )
  })

  it('parses ?rarity= via isValidAlphaRarity, defaults to null', () => {
    expect(PAGE_EN_SRC).toMatch(
      /isValidAlphaRarity\(params\.rarity\)\s*\?\s*params\.rarity\s*:\s*null/,
    )
  })

  it('applies .eq("rarity", rarity) conditionally on both queries', () => {
    expect(PAGE_EN_SRC).toMatch(/if\s*\(rarity\)\s*countQ\s*=\s*countQ\.eq\(['"]rarity['"]/)
    expect(PAGE_EN_SRC).toMatch(/if\s*\(rarity\)\s*cardsQ\s*=\s*cardsQ\.eq\(['"]rarity['"]/)
  })

  it('passes activeRarity={rarity} to AlphaCatalog', () => {
    expect(PAGE_EN_SRC).toMatch(/activeRarity=\{rarity\}/)
  })
})

describe('AFS-18b /dk/cards - server-side rarity filter (DK shell)', () => {
  it('imports isValidAlphaRarity from alpha-types', () => {
    expect(PAGE_DK_SRC).toMatch(
      /import\s*\{[\s\S]*?isValidAlphaRarity[\s\S]*?\}\s*from\s*['"]@\/lib\/cards\/alpha-types['"]/,
    )
  })

  it('applies .eq("rarity", rarity) conditionally', () => {
    expect(PAGE_DK_SRC).toMatch(/if\s*\(rarity\)\s*countQ\s*=\s*countQ\.eq\(['"]rarity['"]/)
    expect(PAGE_DK_SRC).toMatch(/if\s*\(rarity\)\s*cardsQ\s*=\s*cardsQ\.eq\(['"]rarity['"]/)
  })

  it('passes activeRarity={rarity} to AlphaCatalog', () => {
    expect(PAGE_DK_SRC).toMatch(/activeRarity=\{rarity\}/)
  })
})
