import { describe, it, expect } from 'vitest'
import {
  ALPHA_PAGE_SIZE,
  ALPHA_RARITY_LABELS,
  DEFAULT_ALPHA_TYPE,
  VALID_ALPHA_RARITIES,
  VALID_ALPHA_TYPES,
  isValidAlphaRarity,
} from '@/lib/cards/alpha-types'

// AFS-18b - Runtime unit tests for the rarity helpers added in Task 1.
// AFS-6d invariants (VALID_ALPHA_TYPES count, ALPHA_PAGE_SIZE,
// DEFAULT_ALPHA_TYPE) are also re-asserted here as regression guards.

describe('AFS-18b VALID_ALPHA_RARITIES', () => {
  it('lists exactly 6 rarities in lowercase power order', () => {
    expect(VALID_ALPHA_RARITIES).toEqual([
      'common',
      'uncommon',
      'rare',
      'epic',
      'legendary',
      'mythic',
    ])
  })
})

describe('AFS-18b ALPHA_RARITY_LABELS', () => {
  it('maps each db rarity to its titlecase display label', () => {
    expect(ALPHA_RARITY_LABELS).toEqual({
      common: 'Common',
      uncommon: 'Uncommon',
      rare: 'Rare',
      epic: 'Epic',
      legendary: 'Legendary',
      mythic: 'Mythic',
    })
  })
})

describe('AFS-18b isValidAlphaRarity type guard', () => {
  it('accepts all 6 valid lowercase rarities', () => {
    for (const r of VALID_ALPHA_RARITIES) {
      expect(isValidAlphaRarity(r)).toBe(true)
    }
  })

  it('rejects invalid strings', () => {
    expect(isValidAlphaRarity('Mythic')).toBe(false) // titlecase wrong
    expect(isValidAlphaRarity('legendary ')).toBe(false) // trailing space
    expect(isValidAlphaRarity('not-a-rarity')).toBe(false)
    expect(isValidAlphaRarity('')).toBe(false)
    expect(isValidAlphaRarity(undefined)).toBe(false)
  })
})

describe('AFS-6d invariants - regression guards in AFS-18b', () => {
  it('VALID_ALPHA_TYPES still has the 9 canonical lowercase types', () => {
    expect(VALID_ALPHA_TYPES).toHaveLength(9)
    expect(VALID_ALPHA_TYPES).toEqual([
      'weapon',
      'drone',
      'ai_routine',
      'defense',
      'module',
      'maneuver',
      'equipment',
      'field',
      'ship_core',
    ])
  })

  it('ALPHA_PAGE_SIZE is still 20', () => {
    expect(ALPHA_PAGE_SIZE).toBe(20)
  })

  it('DEFAULT_ALPHA_TYPE is still weapon', () => {
    expect(DEFAULT_ALPHA_TYPE).toBe('weapon')
  })
})
