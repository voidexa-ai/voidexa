import { describe, it, expect } from 'vitest'
import { rollPack, seededRng, downgradeMythic, resolveCard } from '../rollPack'
import { PACK_DEFS, PACK_TIERS, MYTHIC_CHANCE } from '../types'

const N = 10_000

describe('rollPack — shape', () => {
  it('every tier returns exactly 5 cards', () => {
    for (const tier of PACK_TIERS) {
      const r = rollPack(tier, seededRng(1))
      expect(r.cardIds).toHaveLength(5)
      expect(r.rarities).toHaveLength(5)
    }
  })

  it('returned cardIds all resolve to templates', () => {
    for (const tier of PACK_TIERS) {
      const r = rollPack(tier, seededRng(42))
      for (const id of r.cardIds) {
        expect(resolveCard(id)).toBeDefined()
      }
    }
  })

  it('every card rarity matches the slot schedule (excluding best-slot + mythic)', () => {
    const r = rollPack('standard', seededRng(7))
    // Base schedule: 4 commons. Best slot: uncommon|rare|legendary|(mythic).
    for (let i = 0; i < 4; i++) expect(r.rarities[i]).toBe('common')
  })
})

describe('rollPack — distribution', () => {
  it('Standard Pack: ≥4 commons on average, best slot uncommon+', () => {
    let commons = 0
    const bestSlotRarities = new Set<string>()
    for (let i = 0; i < N; i++) {
      const r = rollPack('standard', seededRng(i + 1))
      commons += r.rarities.filter(x => x === 'common').length
      bestSlotRarities.add(r.rarities[4])
    }
    // 4 commons per pack guaranteed — if any pack's best slot upgraded a
    // lower-rarity card, it would still only affect slot 5. 4 slots × N packs.
    expect(commons).toBeGreaterThanOrEqual(4 * N)
    expect(bestSlotRarities.has('uncommon') || bestSlotRarities.has('rare') || bestSlotRarities.has('legendary') || bestSlotRarities.has('mythic')).toBe(true)
    expect(bestSlotRarities.has('common')).toBe(false)
  })

  it('Premium Pack guarantees at least 1 Rare or better in best slot', () => {
    const bestSet = new Set<string>()
    for (let i = 0; i < 1000; i++) {
      const r = rollPack('premium', seededRng(i + 100))
      bestSet.add(r.rarities[4])
    }
    // Best slot pool is rare/legendary; with mythic upgrade it may be mythic.
    for (const r of bestSet) expect(['rare', 'legendary', 'mythic']).toContain(r)
  })

  it('Legendary Pack best slot is always legendary (or rare mythic upgrade)', () => {
    const bestSet = new Set<string>()
    for (let i = 0; i < 1000; i++) {
      const r = rollPack('legendary', seededRng(i + 200))
      bestSet.add(r.rarities[4])
    }
    for (const r of bestSet) expect(['legendary', 'mythic']).toContain(r)
  })

  it('Mythic rate across all tiers is within the expected 0.1% band', () => {
    let mythics = 0
    const total = N * PACK_TIERS.length
    for (const tier of PACK_TIERS) {
      for (let i = 0; i < N; i++) {
        const r = rollPack(tier, seededRng(i + tier.length * 1000))
        if (r.mythicPulled) mythics++
      }
    }
    // Expect ~0.1% (= 30 mythics out of 30k). Allow 0.05–0.25% envelope.
    const rate = mythics / total
    expect(rate).toBeGreaterThanOrEqual(MYTHIC_CHANCE * 0.5)
    expect(rate).toBeLessThanOrEqual(MYTHIC_CHANCE * 2.5)
  })
})

describe('rollPack — determinism', () => {
  it('same seed → same roll', () => {
    const a = rollPack('standard', seededRng(12345))
    const b = rollPack('standard', seededRng(12345))
    expect(a.cardIds).toEqual(b.cardIds)
    expect(a.rarities).toEqual(b.rarities)
  })
})

describe('downgradeMythic', () => {
  it('returns a legendary card when called', () => {
    const d = downgradeMythic(seededRng(99))
    expect(d.rarity).toBe('legendary')
    expect(resolveCard(d.cardId)?.rarity).toBe('legendary')
  })
})
