/**
 * Sprint 4 — chain #2: The Shape of Safe.
 * Source: docs/VOIDEXA_UNIVERSE_CONTENT.md SECTION 4, chain #2.
 * Issuer: Claude, supporting Perplexity.
 * Unlocks after: first_day_real_sky.
 */

import type { QuestStep, QuestChainFinalReward } from './firstDayRealSky'

export const SHAPE_OF_SAFE_CHAIN_ID = 'shape_of_safe'

export const SHAPE_OF_SAFE_STEPS: readonly QuestStep[] = [
  {
    id: 'shape_of_safe_paint',
    stepNumber: 1,
    name: 'Paint Through Copper',
    category: 'Courier',
    issuer: 'claude',
    timeEstimate: '6–8 min',
    rewardGhai: 260,
    objective: 'Transport a sealed parcel from Break Room Halo through Copper Wicket without hull bumps.',
    castLine: 'The cargo is boring, which is wonderful.',
    trigger: { type: 'mission_complete', target: 'm002_quiet_parcel_to_glass_anchor' },
  },
  {
    id: 'shape_of_safe_lane_check',
    stepNumber: 2,
    name: 'Lane Validity Check',
    category: 'Signal',
    issuer: 'perplexity',
    timeEstimate: '7–9 min',
    rewardGhai: 340,
    objective: 'Scan the Trimline Array and verify lane-guidance calibration.',
    castLine: "The lane is mostly correct. 'Mostly' is not good enough.",
    trigger: { type: 'landmark_scan', target: 'trimline_array' },
  },
  {
    id: 'shape_of_safe_still_fast',
    stepNumber: 3,
    name: 'Safe Is Still Fast',
    category: 'Rush',
    issuer: 'claude',
    timeEstimate: '7–9 min',
    rewardGhai: 480,
    objective: 'Clean run through Nebula Run without missing a single gate.',
    castLine: 'Speed with discipline is elegance.',
    trigger: { type: 'speedrun_complete', target: 'nebula_run' },
  },
] as const

export const SHAPE_OF_SAFE_FINAL_REWARD: QuestChainFinalReward = {
  ghai: 750,
  title: 'Patient Course',
  cosmetic: 'Trimline Overlay Mk I',
}
