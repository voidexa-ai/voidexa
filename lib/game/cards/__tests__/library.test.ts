import { describe, it, expect } from 'vitest'
import { ALL_CARDS, ALL_CARDS_BY_ID, cardCount, getAnyCardTemplate } from '../library'
import { CARD_TEMPLATES, CARDS_BY_ID } from '../index'

const EXPECTED_COUNT = 257

const CARD_TYPES = ['weapon', 'defense', 'maneuver', 'drone', 'ai', 'consumable'] as const
const RARITIES = ['common', 'uncommon', 'rare', 'legendary', 'mythic', 'pioneer'] as const
const FACTIONS = ['core', 'pioneer', 'void', 'neutral'] as const

describe('full card library', () => {
  it('loads exactly 257 unique cards', () => {
    expect(ALL_CARDS).toHaveLength(EXPECTED_COUNT)
    expect(cardCount()).toBe(EXPECTED_COUNT)
    const ids = ALL_CARDS.map(c => c.id)
    expect(new Set(ids).size).toBe(EXPECTED_COUNT)
  })

  it('every card has a valid type, rarity, faction, cost', () => {
    for (const c of ALL_CARDS) {
      expect(CARD_TYPES).toContain(c.type)
      expect(RARITIES).toContain(c.rarity)
      expect(FACTIONS).toContain(c.faction)
      expect(c.cost).toBeGreaterThanOrEqual(0)
      expect(c.cost).toBeLessThanOrEqual(7)
    }
  })

  it('every card has a non-empty name and abilityText', () => {
    for (const c of ALL_CARDS) {
      expect(c.name.length).toBeGreaterThan(0)
      expect(c.abilityText.length).toBeGreaterThan(0)
    }
  })

  it('every card has a stats object', () => {
    for (const c of ALL_CARDS) {
      expect(c.stats).toBeDefined()
      expect(typeof c.stats).toBe('object')
    }
  })

  it('ALL_CARDS_BY_ID is a complete lookup', () => {
    for (const c of ALL_CARDS) {
      expect(ALL_CARDS_BY_ID[c.id]).toEqual(c)
    }
    expect(Object.keys(ALL_CARDS_BY_ID)).toHaveLength(EXPECTED_COUNT)
  })

  it('getAnyCardTemplate returns undefined for unknown ids', () => {
    expect(getAnyCardTemplate('does_not_exist_xyz')).toBeUndefined()
  })

  it('preserves the 26-card baseline registry in ./index', () => {
    expect(CARD_TEMPLATES).toHaveLength(26)
    for (const c of CARD_TEMPLATES) {
      expect(CARDS_BY_ID[c.id]).toBe(c)
      // Every baseline card should also exist in the full library.
      expect(ALL_CARDS_BY_ID[c.id]).toBeDefined()
      expect(ALL_CARDS_BY_ID[c.id].name).toBe(c.name)
    }
  })

  it('includes a mix of all rarities (more than 0 each)', () => {
    const byRarity = ALL_CARDS.reduce<Record<string, number>>((acc, c) => {
      acc[c.rarity] = (acc[c.rarity] ?? 0) + 1
      return acc
    }, {})
    // Baseline has no mythic/pioneer, but the full library expansion does.
    expect(byRarity.common).toBeGreaterThan(0)
    expect(byRarity.uncommon).toBeGreaterThan(0)
    expect(byRarity.rare).toBeGreaterThan(0)
    expect(byRarity.legendary).toBeGreaterThan(0)
    expect(byRarity.mythic).toBeGreaterThan(0)
  })

  it('has at least one card of each type', () => {
    const byType = new Set(ALL_CARDS.map(c => c.type))
    for (const t of CARD_TYPES) expect(byType.has(t)).toBe(true)
  })
})
