import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// AFS-18 - AlphaCardFrame imageUrl prop wiring + AlphaCatalog and
// AlphaDeckBuilder pass per-card URL derived from getAlphaCardImageUrl.

const FRAME_SRC = readFileSync(
  join(process.cwd(), 'components', 'cards', 'AlphaCardFrame.tsx'),
  'utf8',
)
const CATALOG_SRC = readFileSync(
  join(process.cwd(), 'components', 'cards', 'AlphaCatalog.tsx'),
  'utf8',
)
const DECK_BUILDER_SRC = readFileSync(
  join(process.cwd(), 'components', 'cards', 'AlphaDeckBuilder.tsx'),
  'utf8',
)
const URL_HELPER_SRC = readFileSync(
  join(process.cwd(), 'lib', 'cards', 'alpha-image-url.ts'),
  'utf8',
)

describe('AFS-18 AlphaCardFrame - imageUrl prop + onError fallback', () => {
  it("declares 'use client' (required for the onError handler)", () => {
    expect(FRAME_SRC).toMatch(/^['"]use client['"]/m)
  })

  it('declares imageUrl?: string in AlphaCardFrameProps', () => {
    expect(FRAME_SRC).toMatch(/imageUrl\?:\s*string/)
  })

  it('renders <img> for the art slot (not next/image <Image>)', () => {
    expect(FRAME_SRC).toMatch(/<img\s/)
    expect(FRAME_SRC).not.toMatch(/from\s+['"]next\/image['"]/)
  })

  it('uses imageUrl ?? fallbackSrc as the initial src', () => {
    expect(FRAME_SRC).toMatch(/imageUrl\s*\?\?\s*fallbackSrc/)
  })

  it('onError swaps to the category PNG fallback (one-shot via dataset flag)', () => {
    expect(FRAME_SRC).toMatch(/onError=/)
    expect(FRAME_SRC).toMatch(/fallbackTried/)
  })

  it('TYPE_TO_IMAGE map is preserved (used as fallback source)', () => {
    expect(FRAME_SRC).toContain('/cards/category-art/01_weapon.png')
    expect(FRAME_SRC).toContain('/cards/category-art/09_ship_core.png')
  })
})

describe('AFS-18 alpha-image-url helper', () => {
  it('exports getAlphaCardImageUrl as a named export', () => {
    expect(URL_HELPER_SRC).toMatch(
      /export\s+function\s+getAlphaCardImageUrl/,
    )
  })

  it('reads NEXT_PUBLIC_SUPABASE_URL with .trim() (env hygiene)', () => {
    expect(URL_HELPER_SRC).toMatch(
      /NEXT_PUBLIC_SUPABASE_URL[\s\S]*\.trim\(\)/,
    )
  })

  it('builds the public bucket path (no signed token in URL)', () => {
    expect(URL_HELPER_SRC).toContain('/storage/v1/object/public/cards')
  })
})

describe('AFS-18 AlphaCatalog passes imageUrl per card', () => {
  it('imports getAlphaCardImageUrl from lib/cards/alpha-image-url', () => {
    expect(CATALOG_SRC).toMatch(
      /import\s*\{\s*getAlphaCardImageUrl\s*\}\s*from\s*['"]@\/lib\/cards\/alpha-image-url['"]/,
    )
  })

  it('passes imageUrl={getAlphaCardImageUrl(card.id, card.rarity)} to AlphaCardFrame', () => {
    expect(CATALOG_SRC).toMatch(
      /imageUrl=\{getAlphaCardImageUrl\(\s*card\.id\s*,\s*card\.rarity\s*\)\}/,
    )
  })
})

describe('AFS-18 AlphaDeckBuilder passes imageUrl per card', () => {
  it('imports getAlphaCardImageUrl from the same helper', () => {
    expect(DECK_BUILDER_SRC).toMatch(
      /import\s*\{\s*getAlphaCardImageUrl\s*\}\s*from\s*['"]@\/lib\/cards\/alpha-image-url['"]/,
    )
  })

  it('passes imageUrl on the AlphaCardFrame instance', () => {
    expect(DECK_BUILDER_SRC).toMatch(
      /imageUrl=\{getAlphaCardImageUrl\(\s*card\.id\s*,\s*card\.rarity\s*\)\}/,
    )
  })
})
