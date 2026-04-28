import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// AFS-18 - Walker pattern tests for the /cards page swap (V3 retired, Alpha
// mounted) and the two new V3 deck-builder 308 redirects.

const PAGE_EN_SRC = readFileSync(
  join(process.cwd(), 'app', 'cards', 'page.tsx'),
  'utf8',
)
const PAGE_DK_SRC = readFileSync(
  join(process.cwd(), 'app', 'dk', 'cards', 'page.tsx'),
  'utf8',
)
const NEXT_CONFIG_SRC = readFileSync(
  join(process.cwd(), 'next.config.ts'),
  'utf8',
)

describe('AFS-18 /cards (EN) - V3 retired, AlphaCatalog mounted', () => {
  it('does NOT import CardCollection or CardCollectionView from V3', () => {
    // Comment-level mentions of the V3 file path are allowed (the SKILL
    // tells future readers where the V3 file still lives). Block only real
    // import statements that pull V3 code into the bundle.
    expect(PAGE_EN_SRC).not.toMatch(/^\s*import[^\n]*CardCollection/m)
    expect(PAGE_EN_SRC).not.toMatch(
      /from\s+['"]@\/components\/combat\/CardCollection['"]/,
    )
  })

  it('imports AlphaCatalog from components/cards', () => {
    expect(PAGE_EN_SRC).toMatch(
      /import\s+AlphaCatalog[\s\S]*from\s+['"]@\/components\/cards\/AlphaCatalog['"]/,
    )
  })

  it('passes basePath="/cards" so tab + pagination links stay on this surface', () => {
    expect(PAGE_EN_SRC).toMatch(/basePath=['"]\/cards['"]/)
  })

  it('queries alpha_cards with type + active=true filters', () => {
    expect(PAGE_EN_SRC).toMatch(/from\(['"]alpha_cards['"]\)/)
    expect(PAGE_EN_SRC).toMatch(/\.eq\(['"]active['"],\s*true\)/)
  })

  it('canonical metadata + alternates point at /cards (not /cards/alpha)', () => {
    expect(PAGE_EN_SRC).toMatch(/canonical:\s*['"]\/cards['"]/)
    expect(PAGE_EN_SRC).toMatch(/da:\s*['"]\/dk\/cards['"]/)
  })
})

describe('AFS-18 /dk/cards - V3 retired, AlphaCatalog mounted', () => {
  it('does NOT import CardCollection from V3', () => {
    expect(PAGE_DK_SRC).not.toMatch(/CardCollection/)
  })

  it('imports AlphaCatalog', () => {
    expect(PAGE_DK_SRC).toMatch(
      /import\s+AlphaCatalog[\s\S]*from\s+['"]@\/components\/cards\/AlphaCatalog['"]/,
    )
  })

  it('passes basePath="/dk/cards"', () => {
    expect(PAGE_DK_SRC).toMatch(/basePath=['"]\/dk\/cards['"]/)
  })

  it('canonical metadata points at /dk/cards', () => {
    expect(PAGE_DK_SRC).toMatch(/canonical:\s*['"]\/dk\/cards['"]/)
  })
})

describe('AFS-18 next.config.ts - V3 deck-builder 308 redirects', () => {
  it('redirects /cards/deck-builder -> /cards/alpha/deck-builder (308)', () => {
    expect(NEXT_CONFIG_SRC).toMatch(
      /source:\s*['"]\/cards\/deck-builder['"][\s\S]*?destination:\s*['"]\/cards\/alpha\/deck-builder['"][\s\S]*?permanent:\s*true/,
    )
  })

  it('redirects /dk/cards/deck-builder -> /dk/cards/alpha/deck-builder (308)', () => {
    expect(NEXT_CONFIG_SRC).toMatch(
      /source:\s*['"]\/dk\/cards\/deck-builder['"][\s\S]*?destination:\s*['"]\/dk\/cards\/alpha\/deck-builder['"][\s\S]*?permanent:\s*true/,
    )
  })
})

describe('AFS-18 V3 regression - files still on disk (kept, just not rendered)', () => {
  it('components/combat/CardCollection.tsx is still readable (V3 file kept)', () => {
    const src = readFileSync(
      join(process.cwd(), 'components', 'combat', 'CardCollection.tsx'),
      'utf8',
    )
    expect(src.length).toBeGreaterThan(0)
  })

  it('lib/cards/full_library.ts is still readable (V3 data kept)', () => {
    const src = readFileSync(
      join(process.cwd(), 'lib', 'cards', 'full_library.ts'),
      'utf8',
    )
    expect(src.length).toBeGreaterThan(0)
  })
})
