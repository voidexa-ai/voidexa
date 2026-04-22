// Sprint AFS-3 regression coverage for Game Hub 404 fixes.
//
// Uses the same source-level assertion pattern as AFS-1, AFS-2, and AFS-7:
// read the relevant files off disk and verify invariants (redirect entries,
// tile data, component wiring). No Playwright runner — the AFS-1 deviation
// documented in CLAUDE.md stands.
//
// Covers 1:1 with sprint tasks:
//   Task 1 — 4 EN + 4 DK canonical game redirects, all permanent (308)
//   Task 2-5 — redirect pairs resolve to pre-existing working routes
//   Task 6 — Game Hub tile UX: icons, descriptions, responsive grid

import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const read = (...parts: string[]) => readFileSync(join(ROOT, ...parts), 'utf8')
const exists = (...parts: string[]) => existsSync(join(ROOT, ...parts))

const NEXT_CONFIG_SRC = read('next.config.ts')
const GAME_HUB_PAGE_SRC = read('app', 'game', 'page.tsx')
const GAME_HUB_TILES_SRC = read('components', 'game', 'GameHubTiles.tsx')

describe('AFS-3 Task 1 — next.config.ts game hub redirects', () => {
  const EN_PAIRS: Array<[string, string]> = [
    ['/game/card-battle',   '/game/battle'],
    ['/game/deck-builder',  '/game/cards/deck-builder'],
    ['/game/pilot-profile', '/game/profile'],
    ['/game/shop',          '/shop'],
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
    ['/dk/game/card-battle',   '/game/battle'],
    ['/dk/game/deck-builder',  '/game/cards/deck-builder'],
    ['/dk/game/pilot-profile', '/game/profile'],
    ['/dk/game/shop',          '/shop'],
  ]

  for (const [src, dst] of DK_PAIRS) {
    it(`DK: ${src} redirects to ${dst} (permanent)`, () => {
      const re = new RegExp(
        `source:\\s*['"]${src.replace(/\//g, '\\/')}['"][^}]*destination:\\s*['"]${dst.replace(/\//g, '\\/')}['"][^}]*permanent:\\s*true`
      )
      expect(NEXT_CONFIG_SRC).toMatch(re)
    })
  }

  it('every game redirect destination exists as a real page', () => {
    const destinations: Array<string[]> = [
      ['app', 'game', 'battle', 'page.tsx'],
      ['app', 'game', 'cards', 'deck-builder', 'page.tsx'],
      ['app', 'game', 'profile', 'page.tsx'],
      ['app', 'shop', 'page.tsx'],
    ]
    for (const parts of destinations) {
      expect(exists(...parts)).toBe(true)
    }
  })
})

describe('AFS-3 Task 6 — Game Hub page shell', () => {
  it('imports the extracted GameHubTiles component', () => {
    expect(GAME_HUB_PAGE_SRC).toMatch(/import GameHubTiles from '@\/components\/game\/GameHubTiles'/)
    expect(GAME_HUB_PAGE_SRC).toMatch(/<GameHubTiles\s*\/>/)
  })

  it('retains the UniverseWallFeed below the tile grid', () => {
    expect(GAME_HUB_PAGE_SRC).toMatch(/UniverseWallFeed/)
  })

  it('declares a metadata title that starts with voidexa', () => {
    expect(GAME_HUB_PAGE_SRC).toMatch(/title:\s*['"]voidexa · Game Hub['"]/)
  })

  it('stays under the 100-line soft cap', () => {
    expect(GAME_HUB_PAGE_SRC.split('\n').length).toBeLessThanOrEqual(100)
  })
})

describe('AFS-3 Task 6 — GameHubTiles component', () => {
  it('imports the lucide-react icon set used by tiles', () => {
    const icons = ['Scroll', 'Zap', 'Package', 'Swords', 'LayoutGrid', 'Compass', 'User', 'ShoppingBag', 'ArrowRight']
    for (const icon of icons) {
      expect(GAME_HUB_TILES_SRC).toMatch(new RegExp(`\\b${icon}\\b`))
    }
  })

  it('exports a TILES data array with all 8 game hub surfaces', () => {
    expect(GAME_HUB_TILES_SRC).toMatch(/export const GAME_HUB_TILES/)
    const labels = [
      'Mission Board', 'Speed Run', 'Hauling', 'Card Battle',
      'Deck Builder', 'Quests', 'Pilot Profile', 'Shop',
    ]
    for (const label of labels) {
      expect(GAME_HUB_TILES_SRC).toContain(`label: '${label}'`)
    }
  })

  it('points the Card Battle tile at the existing /game/battle route', () => {
    expect(GAME_HUB_TILES_SRC).toMatch(
      /href:\s*['"]\/game\/battle['"][^}]*label:\s*['"]Card Battle['"]/
    )
  })

  it('points the Deck Builder tile at /game/cards/deck-builder', () => {
    expect(GAME_HUB_TILES_SRC).toMatch(
      /href:\s*['"]\/game\/cards\/deck-builder['"][^}]*label:\s*['"]Deck Builder['"]/
    )
  })

  it('points the Pilot Profile tile at /game/profile', () => {
    expect(GAME_HUB_TILES_SRC).toMatch(
      /href:\s*['"]\/game\/profile['"][^}]*label:\s*['"]Pilot Profile['"]/
    )
  })

  it('points the Shop tile at the top-level /shop route (not /game/shop)', () => {
    expect(GAME_HUB_TILES_SRC).toMatch(
      /href:\s*['"]\/shop['"][^}]*label:\s*['"]Shop['"]/
    )
    // Guard against regression — no tile should target /game/shop.
    expect(GAME_HUB_TILES_SRC).not.toMatch(/href:\s*['"]\/game\/shop['"]/)
  })

  it('every tile declares a 1-line description string', () => {
    const descriptions = [
      'Accept contracts from the Cast.',
      'Race tracks, beat the clock.',
      'Deliver cargo across zones.',
      'Challenge AI bosses in tactical combat.',
      'Build and save battle decks.',
      'Multi-stage story missions.',
      'Your callsign, stats, tales.',
      'Cosmetics and card packs.',
    ]
    for (const desc of descriptions) {
      expect(GAME_HUB_TILES_SRC).toContain(desc)
    }
  })

  it('uses a responsive Tailwind grid (4 cols desktop, 2 tablet, 1 mobile)', () => {
    expect(GAME_HUB_TILES_SRC).toMatch(/grid-cols-2/)
    expect(GAME_HUB_TILES_SRC).toMatch(/lg:grid-cols-4/)
  })

  it('each tile carries a data-testid for browser test harnesses', () => {
    expect(GAME_HUB_TILES_SRC).toMatch(/data-testid=\{`game-hub-tile-/)
  })

  it('stays under the 300-line soft cap', () => {
    expect(GAME_HUB_TILES_SRC.split('\n').length).toBeLessThanOrEqual(300)
  })
})

describe('AFS-3 — redirect targets are known working routes', () => {
  it('/game/battle uses the components/game/battle BattleClient', () => {
    const src = read('app', 'game', 'battle', 'page.tsx')
    expect(src).toMatch(/BattleClient/)
  })

  it('/game/cards/deck-builder has its own DeckBuilderClient', () => {
    const src = read('app', 'game', 'cards', 'deck-builder', 'page.tsx')
    expect(src).toMatch(/DeckBuilderClient/)
  })

  it('/game/profile hands off to the /[userId] public profile route', () => {
    const src = read('app', 'game', 'profile', 'page.tsx')
    expect(src).toMatch(/redirect\(`\/game\/profile\/\$\{uid\}`\)/)
  })

  it('the public /game/profile/[userId] page wires PilotCard + TalesLog', () => {
    const src = read('app', 'game', 'profile', '[userId]', 'page.tsx')
    expect(src).toMatch(/PilotCard/)
    expect(src).toMatch(/TalesLog/)
  })

  it('/shop exists as a top-level route', () => {
    expect(exists('app', 'shop', 'page.tsx')).toBe(true)
  })
})
