import { describe, it, expect } from 'vitest'
import {
  computeClaimEconomics,
  repairCost,
  insurancePayout,
  scrapPayout,
  timerWindow,
  basePrice,
  riskTierForZone,
} from '../economics'

describe('claim economics (V3 PART 7 table)', () => {
  it('common: base 500, claim 100, repair 50, total 150, 70% savings', () => {
    const e = computeClaimEconomics('common')!
    expect(e.basePrice).toBe(500)
    expect(e.claimFee).toBe(100)
    expect(e.repairCost).toBe(50)
    expect(e.total).toBe(150)
    expect(e.savingsVsNewPct).toBe(70)
  })

  it('uncommon: base 1000, total 300, 70% savings', () => {
    const e = computeClaimEconomics('uncommon')!
    expect(e.basePrice).toBe(1000)
    expect(e.total).toBe(300)
    expect(e.savingsVsNewPct).toBe(70)
  })

  it('rare: base 2500, total 750, 70% savings', () => {
    const e = computeClaimEconomics('rare')!
    expect(e.basePrice).toBe(2500)
    expect(e.total).toBe(750)
    expect(e.savingsVsNewPct).toBe(70)
  })

  it('legendary: base 5000, total 1500, 70% savings', () => {
    const e = computeClaimEconomics('legendary')!
    expect(e.basePrice).toBe(5000)
    expect(e.total).toBe(1500)
    expect(e.savingsVsNewPct).toBe(70)
  })

  it('soulbound / pioneer not claimable', () => {
    expect(computeClaimEconomics('soulbound')).toBeNull()
    expect(computeClaimEconomics('pioneer')).toBeNull()
  })
})

describe('repair + insurance + scrap payouts', () => {
  it('repair is 10% of base price per class', () => {
    expect(repairCost('common')).toBe(50)
    expect(repairCost('uncommon')).toBe(100)
    expect(repairCost('rare')).toBe(250)
    expect(repairCost('legendary')).toBe(500)
  })

  it('insurance is 10% of base price per class', () => {
    expect(insurancePayout('common')).toBe(50)
    expect(insurancePayout('uncommon')).toBe(100)
    expect(insurancePayout('rare')).toBe(250)
    expect(insurancePayout('legendary')).toBe(500)
  })

  it('scrap payout is 25% of base price', () => {
    expect(scrapPayout('common')).toBe(125)
    expect(scrapPayout('uncommon')).toBe(250)
    expect(scrapPayout('rare')).toBe(625)
    expect(scrapPayout('legendary')).toBe(1250)
  })

  it('base price mirrors the class table', () => {
    expect(basePrice('common')).toBe(500)
    expect(basePrice('legendary')).toBe(5000)
  })
})

describe('timer windows (V3 tier table)', () => {
  it('Low Risk = 15 protected / 60 total minutes', () => {
    const w = timerWindow('low')
    expect(w.protectedMs).toBe(15 * 60_000)
    expect(w.totalMs).toBe(60 * 60_000)
  })

  it('High Risk = 5 protected / 25 total minutes', () => {
    const w = timerWindow('high')
    expect(w.protectedMs).toBe(5 * 60_000)
    expect(w.totalMs).toBe(25 * 60_000)
  })
})

describe('riskTierForZone', () => {
  it('Core + Inner Ring = low risk', () => {
    expect(riskTierForZone('Core Zone')).toBe('low')
    expect(riskTierForZone('Inner Ring')).toBe('low')
  })

  it('Mid / Outer / Deep Void = high risk', () => {
    expect(riskTierForZone('Mid Ring')).toBe('high')
    expect(riskTierForZone('Outer Ring')).toBe('high')
    expect(riskTierForZone('Deep Void')).toBe('high')
  })

  it('unknown / null zones default to low', () => {
    expect(riskTierForZone(null)).toBe('low')
    expect(riskTierForZone(undefined)).toBe('low')
    expect(riskTierForZone('unrecognised')).toBe('low')
  })
})
