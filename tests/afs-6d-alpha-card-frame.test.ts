import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// AFS-6d — Source-level invariants for AlphaCardFrame.tsx.
// Vitest runs in `environment: node` per vitest.config.ts — same pattern
// used by tests/nav-dropdown.test.ts (no jsdom, no React renderer).

const FRAME_SRC = readFileSync(
  join(process.cwd(), 'components', 'cards', 'AlphaCardFrame.tsx'),
  'utf8',
)

const CARD_ART_SRC = readFileSync(
  join(process.cwd(), 'components', 'combat', 'cardArt.ts'),
  'utf8',
)

const RARITIES = [
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary',
  'mythic',
] as const

const TYPE_IMAGE_MAP: ReadonlyArray<readonly [string, string]> = [
  ['Weapon', '/cards/category-art/01_weapon.png'],
  ['Drone', '/cards/category-art/02_drone.png'],
  ['AI Routine', '/cards/category-art/03_ai_routine.png'],
  ['Defense', '/cards/category-art/04_defense.png'],
  ['Module', '/cards/category-art/05_module.png'],
  ['Maneuver', '/cards/category-art/06_maneuver.png'],
  ['Equipment', '/cards/category-art/07_equipment.png'],
  ['Field', '/cards/category-art/08_field.png'],
  ['Ship Core', '/cards/category-art/09_ship_core.png'],
]

describe('AFS-6d AlphaCardFrame — rarity color sourcing', () => {
  it('reuses RARITY_GLOW from components/combat/cardArt (single source of truth)', () => {
    expect(FRAME_SRC).toMatch(
      /import\s*\{\s*RARITY_GLOW\s*\}\s*from\s*['"]@\/components\/combat\/cardArt['"]/,
    )
  })

  it('imports CardRarity enum from @/lib/game/cards', () => {
    expect(FRAME_SRC).toMatch(
      /import\s*\{\s*CardRarity\s*\}\s*from\s*['"]@\/lib\/game\/cards['"]/,
    )
  })

  it('cardArt.ts retains all 6 RARITY_GLOW entries (regression guard)', () => {
    for (const k of ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic']) {
      expect(CARD_ART_SRC).toContain(`CardRarity.${k}`)
    }
  })

  for (const r of RARITIES) {
    const enumKey = r[0].toUpperCase() + r.slice(1)
    it(`bridges lowercase prop "${r}" to CardRarity.${enumKey}`, () => {
      expect(FRAME_SRC).toMatch(
        new RegExp(`${r}\\s*:\\s*CardRarity\\.${enumKey}`),
      )
    })
  }
})

describe('AFS-6d AlphaCardFrame — type → image mapping (canonical "AI Routine", NOT "AI Routing")', () => {
  for (const [type, path] of TYPE_IMAGE_MAP) {
    it(`maps "${type}" → ${path}`, () => {
      expect(FRAME_SRC).toContain(path)
      expect(FRAME_SRC).toContain(`'${type}'`)
    })
  }

  it('contains zero references to deprecated "ai_routing" spelling', () => {
    expect(FRAME_SRC).not.toMatch(/ai_routing/)
  })
})

describe('AFS-6d AlphaCardFrame — props contract matches source data schema', () => {
  it('declares all 9 AlphaCardFrameProps fields from batch JSON schema', () => {
    for (const f of [
      'rarity',
      'type',
      'name',
      'energy_cost',
      'attack',
      'defense',
      'effect_text',
      'flavor_text',
      'comingSoon',
    ]) {
      expect(FRAME_SRC).toMatch(new RegExp(`\\b${f}\\b`))
    }
  })

  it('AlphaRarity union lists all 6 lowercase rarity strings', () => {
    for (const r of RARITIES) {
      expect(FRAME_SRC).toContain(`'${r}'`)
    }
  })

  it('renders Coming Soon overlay only when prop is set', () => {
    expect(FRAME_SRC).toMatch(/comingSoon\s*&&/)
    expect(FRAME_SRC).toMatch(/Coming Soon/i)
  })
})

describe('AFS-6d AlphaCardFrame — V3 isolation', () => {
  it('exports default function AlphaCardFrame (distinct name from any V3 CardFrame)', () => {
    expect(FRAME_SRC).toMatch(/export\s+default\s+function\s+AlphaCardFrame/)
  })

  it('does NOT import from components/combat/CardCollection or DeckBuilder', () => {
    expect(FRAME_SRC).not.toMatch(
      /from\s+['"][^'"]*components\/combat\/CardCollection['"]/,
    )
    expect(FRAME_SRC).not.toMatch(
      /from\s+['"][^'"]*components\/combat\/DeckBuilder['"]/,
    )
  })
})
