/**
 * lib/game/balance.ts — Phase 1 cost-power curve validator
 *
 * Source of truth: docs/VOIDEXA_GAMING_COMBINED_V2.md PART 5 "Cost-power curve".
 *
 * Use to sanity-check any proposed card template (baseline + future expansions)
 * against the locked cost bands before shipping. This is deliberately a
 * permissive heuristic — some cards trade raw damage for utility or
 * conditional effects, so utility-only cards at a given cost return
 * { ok: true } regardless of damage/block values.
 */

import type { CardTemplate, GameCardRarity } from './cards/index'

export interface CostBand {
  damage?: { min: number; max: number }
  block?: { min: number; max: number }
  note: string
}

export const COST_POWER_CURVE: Readonly<Record<number, CostBand>> = Object.freeze({
  0: {
    note: 'Utility only, no full-value damage.',
  },
  1: {
    damage: { min: 5, max: 7 },
    block: { min: 5, max: 5 },
    note: '5-7 damage or 5 block or light setup.',
  },
  2: {
    damage: { min: 9, max: 12 },
    block: { min: 8, max: 10 },
    note: '9-12 damage or 8-10 block or utility + minor effect.',
  },
  3: {
    damage: { min: 14, max: 18 },
    block: { min: 12, max: 16 },
    note: '14-18 damage or 12-16 block or strong status.',
  },
  4: {
    damage: { min: 18, max: 24 },
    block: { min: 16, max: 20 },
    note: '18-24 damage or major swing.',
  },
  5: {
    damage: { min: 24, max: 30 },
    block: { min: 20, max: 26 },
    note: '24-30 damage or summon/board-control.',
  },
  6: {
    damage: { min: 30, max: 36 },
    block: { min: 26, max: 32 },
    note: '30-36 damage or encounter-defining effect.',
  },
  7: {
    damage: { min: 36, max: 48 },
    block: { min: 32, max: 40 },
    note: 'Rare/legendary finisher only.',
  },
})

export interface BalanceInput {
  cost: number
  damage?: number
  block?: number
  rarity?: GameCardRarity
}

export interface BalanceVerdict {
  ok: boolean
  reasons: string[]
  band: CostBand | null
}

const TOLERANCE_FRACTION = 0.2

function outOfBand(value: number, band: { min: number; max: number }, label: string): string | null {
  const tol = Math.max(1, Math.round(band.max * TOLERANCE_FRACTION))
  if (value < band.min - tol) {
    return `${label} ${value} is below cost band (${band.min}-${band.max}, tolerance ±${tol}).`
  }
  if (value > band.max + tol) {
    return `${label} ${value} exceeds cost band (${band.min}-${band.max}, tolerance ±${tol}).`
  }
  return null
}

/**
 * Validate a card's raw damage/block values against the cost-power curve.
 *
 * Returns ok=true for utility-only cards (no damage, no block declared) at any
 * cost, since PART 5 explicitly permits cost 0 utility and higher-cost
 * status/summon cards to sit outside the numeric band.
 */
export function validateCostPowerCurve(input: BalanceInput): BalanceVerdict {
  const { cost, damage, block, rarity } = input
  const reasons: string[] = []

  if (cost < 0 || cost > 7 || !Number.isInteger(cost)) {
    return {
      ok: false,
      reasons: [`Cost ${cost} must be an integer 0-7.`],
      band: null,
    }
  }

  if (cost === 7 && rarity && rarity !== 'rare' && rarity !== 'legendary') {
    reasons.push('Cost 7 is reserved for rare/legendary finishers only.')
  }

  const band = COST_POWER_CURVE[cost]

  // Utility-only cards at cost 0 are allowed; damage/block optional.
  if (cost === 0) {
    if (typeof damage === 'number' && damage > 3) {
      reasons.push(`Cost 0 cards must not deal full-value damage (got ${damage}).`)
    }
    return { ok: reasons.length === 0, reasons, band: band ?? null }
  }

  if (!band) {
    reasons.push(`No curve band defined for cost ${cost}.`)
    return { ok: false, reasons, band: null }
  }

  if (typeof damage === 'number' && damage > 0 && band.damage) {
    const problem = outOfBand(damage, band.damage, 'Damage')
    if (problem) reasons.push(problem)
  }
  if (typeof block === 'number' && block > 0 && band.block) {
    const problem = outOfBand(block, band.block, 'Block')
    if (problem) reasons.push(problem)
  }

  return { ok: reasons.length === 0, reasons, band }
}

/**
 * Convenience wrapper: validate a CardTemplate directly.
 */
export function validateCardTemplate(card: CardTemplate): BalanceVerdict {
  return validateCostPowerCurve({
    cost: card.cost,
    damage: card.stats.damage,
    block: card.stats.block,
    rarity: card.rarity,
  })
}
