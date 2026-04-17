/**
 * Sprint 3 — Task 1: First Day Real Sky onboarding chain.
 * Source: docs/VOIDEXA_UNIVERSE_CONTENT.md SECTION 4, chain #1.
 *
 * 4 scripted steps issued by Jix (supporting GPT). Each step hooks into an
 * existing completion path so the chain advances automatically when the
 * player hits the right activity — we don't force a bespoke "tutorial mode".
 */

import type { CastIssuer } from '@/lib/game/missions/board'

export type QuestStepTriggerType =
  | 'speedrun_complete'    // step 1 — any speed-run save on the configured track
  | 'mission_complete'     // step 2 — mission with matching id finalised
  | 'landmark_scan'        // step 3 — specific landmark scanned
  | 'battle_victory'       // step 4 — battle won at/above tier

export interface QuestStepTrigger {
  type: QuestStepTriggerType
  /** Track id, mission id, landmark id, or battle tier/boss id. */
  target: string
}

export interface QuestStep {
  /** Step id — also the row id in `user_quest_progress.quest_id`. */
  id: string
  stepNumber: 1 | 2 | 3 | 4
  name: string
  category: 'Rush' | 'Courier' | 'Signal' | 'Hunt'
  issuer: CastIssuer
  timeEstimate: string
  rewardGhai: number
  objective: string
  castLine: string
  trigger: QuestStepTrigger
}

export interface QuestChainFinalReward {
  ghai: number
  title: string
  cosmetic: string
}

export const FIRST_DAY_REAL_SKY_CHAIN_ID = 'first_day_real_sky'

export const FIRST_DAY_STEPS: readonly QuestStep[] = [
  {
    id: 'first_day_loop',
    stepNumber: 1,
    name: 'Loop Once, Breathe Once',
    category: 'Rush',
    issuer: 'jix',
    timeEstimate: '4–6 min',
    rewardGhai: 180,
    objective: "Complete Bob's First Loop under tutorial par time.",
    castLine: "Don't overthink the ship. Fly it. Breathe once. Then move.",
    trigger: { type: 'speedrun_complete', target: 'core_circuit' },
  },
  {
    id: 'first_day_coffee',
    stepNumber: 2,
    name: 'Coffee to Dock Nine',
    category: 'Courier',
    issuer: 'jix',
    timeEstimate: '5–7 min',
    rewardGhai: 240,
    objective: 'Deliver drink canisters to Dock Nine-Lark without jostling.',
    castLine: 'Congratulations. You can now be trusted with coffee.',
    trigger: { type: 'mission_complete', target: 'local_parcel_run' },
  },
  {
    id: 'first_day_pings',
    stepNumber: 3,
    name: 'Three Clean Pings',
    category: 'Signal',
    issuer: 'gpt',
    timeEstimate: '6–8 min',
    rewardGhai: 300,
    objective: 'Scan 3 nav nodes, upload to Saffron Relay, no corruption.',
    castLine: 'Scanning is not passive. It is awareness.',
    trigger: { type: 'landmark_scan', target: 'saffron_relay' },
  },
  {
    id: 'first_day_drones',
    stepNumber: 4,
    name: 'Loose Drone, Short Work',
    category: 'Hunt',
    issuer: 'gpt',
    timeEstimate: '7–10 min',
    rewardGhai: 420,
    objective: 'Neutralize 6 rogue maintenance drones near Echo Gymnasium.',
    castLine: "Simple targets. Don't decorate the engagement.",
    trigger: { type: 'battle_victory', target: 'tier_1' },
  },
] as const

export const FIRST_DAY_FINAL_REWARD: QuestChainFinalReward = {
  ghai: 600,
  title: 'Licensed Breather',
  cosmetic: 'Halo Starter Stripe',
}

export function getStepById(id: string): QuestStep | undefined {
  return FIRST_DAY_STEPS.find(s => s.id === id)
}

/** Returns the first not-yet-completed step, or null when the chain is done. */
export function nextStep(completedIds: ReadonlySet<string>): QuestStep | null {
  for (const step of FIRST_DAY_STEPS) {
    if (!completedIds.has(step.id)) return step
  }
  return null
}

export function isChainComplete(completedIds: ReadonlySet<string>): boolean {
  return FIRST_DAY_STEPS.every(s => completedIds.has(s.id))
}

/**
 * Check if a completion event matches the current step's trigger.
 * Used by each completion path (speed-run, mission, landmark, battle).
 */
export function triggerMatches(
  currentStep: QuestStep,
  event: { type: QuestStepTriggerType; target: string },
): boolean {
  if (currentStep.trigger.type !== event.type) return false
  return currentStep.trigger.target === event.target
}
