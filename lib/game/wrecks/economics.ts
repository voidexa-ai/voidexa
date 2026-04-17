/**
 * Sprint 5 — Task 1: wreck claim + repair + insurance economics.
 *
 * V3 PART 7 GPT-fix: scale by SHIP CLASS, not cosmetic tier. Having a pretty
 * ship does not make losing it more expensive.
 *
 * Claim table (V3):
 *   Class       Base  ClaimFee  Repair  Total  Savings vs new
 *   common       500      100      50    150    70%
 *   uncommon    1000      200     100    300    70%
 *   rare        2500      500     250    750    70%
 *   legendary   5000     1000     500   1500    70%
 *
 * Insurance = 10% of base price to original owner on third-party claim.
 * Scrap payout = 20-30% of base price; we use 25% flat for MVP determinism.
 */

import { TIMER_WINDOWS, type ShipTier, type TimerWindow, type WreckRiskTier } from './types'

export interface ClaimEconomics {
  basePrice: number
  claimFee: number
  repairCost: number
  total: number
  savingsVsNewPct: number
}

/**
 * Class-based claim table. `ShipTier` in our schema doubles as the claim
 * tier for gameplay purposes (soulbound / pioneer don't claim — they're
 * excluded up front).
 */
const CLAIM_TIER_TABLE: Readonly<Partial<Record<ShipTier, { base: number; claim: number; repair: number }>>> = {
  common:    { base: 500,  claim: 100,  repair: 50  },
  uncommon:  { base: 1000, claim: 200,  repair: 100 },
  rare:      { base: 2500, claim: 500,  repair: 250 },
  legendary: { base: 5000, claim: 1000, repair: 500 },
}

export function computeClaimEconomics(tier: ShipTier): ClaimEconomics | null {
  const row = CLAIM_TIER_TABLE[tier]
  if (!row) return null
  const total = row.claim + row.repair
  const savingsVsNewPct = Math.round((1 - total / row.base) * 100)
  return {
    basePrice: row.base,
    claimFee: row.claim,
    repairCost: row.repair,
    total,
    savingsVsNewPct,
  }
}

export function repairCost(tier: ShipTier): number {
  const row = CLAIM_TIER_TABLE[tier]
  return row?.repair ?? 50
}

/** Owner insurance on third-party claim. 10% of base price. */
export function insurancePayout(tier: ShipTier): number {
  const row = CLAIM_TIER_TABLE[tier]
  return row ? Math.floor(row.base * 0.10) : 50
}

/** Scrap payout when a wreck is abandoned and expires to scrap. 25% flat. */
export function scrapPayout(tier: ShipTier): number {
  const row = CLAIM_TIER_TABLE[tier]
  return row ? Math.floor(row.base * 0.25) : 125
}

export function timerWindow(risk: WreckRiskTier): TimerWindow {
  return TIMER_WINDOWS[risk]
}

export function basePrice(tier: ShipTier): number {
  return CLAIM_TIER_TABLE[tier]?.base ?? 500
}

/**
 * Given a zone string, return the wreck risk tier. Core/Inner = low; Mid/Outer/Deep = high.
 * V3 rule: PvP dome (Instanced) never calls this — it produces no wreck.
 */
export function riskTierForZone(zone: string | null | undefined): WreckRiskTier {
  if (!zone) return 'low'
  const z = zone.toLowerCase()
  if (z.includes('mid') || z.includes('outer') || z.includes('deep')) return 'high'
  return 'low'
}
