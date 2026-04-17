/**
 * Sprint 5 — Task 3: extracted delivery-grade logic.
 *
 * Pure function. Owned by tests and by `DeliveryResults.tsx`. Grade
 * is driven by cargo integrity for successful deliveries; failed
 * runs bypass grading entirely.
 */

import type { HaulingContract } from './contracts'

export type DeliveryOutcome = 'delivered' | 'failed'
export type DeliveryGrade = 'Gold' | 'Silver' | 'Bronze' | 'Failed'

export function deliveryGrade(outcome: DeliveryOutcome, cargoIntegrity: number): DeliveryGrade {
  if (outcome === 'failed') return 'Failed'
  if (cargoIntegrity >= 90) return 'Gold'
  if (cargoIntegrity >= 60) return 'Silver'
  return 'Bronze'
}

/**
 * Base GHAI payout before any bonus GHAI. Failed runs pay zero.
 * Integrity scales linearly 0–100%.
 */
export function deliveryBaseReward(
  contract: Pick<HaulingContract, 'rewardMin' | 'rewardMax'>,
  outcome: DeliveryOutcome,
  cargoIntegrity: number,
): number {
  if (outcome === 'failed') return 0
  const mid = (contract.rewardMin + contract.rewardMax) / 2
  return Math.round(mid * (cargoIntegrity / 100))
}
