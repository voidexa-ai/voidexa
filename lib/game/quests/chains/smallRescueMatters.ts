/**
 * Sprint 4 — chain #3: A Small Rescue Matters.
 * Source: docs/VOIDEXA_UNIVERSE_CONTENT.md SECTION 4, chain #3.
 * Issuer: Gemini, supporting GPT.
 * Unlocks after: shape_of_safe.
 */

import type { QuestStep, QuestChainFinalReward } from './firstDayRealSky'

export const SMALL_RESCUE_CHAIN_ID = 'small_rescue_matters'

export const SMALL_RESCUE_STEPS: readonly QuestStep[] = [
  {
    id: 'small_rescue_find_tug',
    stepNumber: 1,
    name: 'Find the Tug',
    category: 'Hunt',
    issuer: 'gemini',
    timeEstimate: '7–10 min',
    rewardGhai: 320,
    objective: 'Locate the drifting maintenance tug near Hearth Span.',
    castLine: 'The beacon is intermittent. Trust the last coordinate that made sense.',
    trigger: { type: 'landmark_scan', target: 'hearth_span' },
  },
  {
    id: 'small_rescue_track_bleed',
    stepNumber: 2,
    name: 'Track the Bleed',
    category: 'Signal',
    issuer: 'gpt',
    timeEstimate: '6–8 min',
    rewardGhai: 380,
    objective: 'Follow the coolant trail back to Glass Anchor for diagnostics.',
    castLine: 'Fluid tells a truer story than the pilot will.',
    trigger: { type: 'landmark_scan', target: 'glass_anchor' },
  },
  {
    id: 'small_rescue_coolant',
    stepNumber: 3,
    name: 'Coolant for Two',
    category: 'Courier',
    issuer: 'gemini',
    timeEstimate: '7–9 min',
    rewardGhai: 460,
    objective: 'Deliver coolant canisters — one for the tug, one spare.',
    castLine: 'Bring two. Always bring two.',
    trigger: { type: 'mission_complete', target: 'm003_orchard_bloom_run' },
  },
  {
    id: 'small_rescue_escort',
    stepNumber: 4,
    name: 'Bring Them Through',
    category: 'Hunt',
    issuer: 'gpt',
    timeEstimate: '10–13 min',
    rewardGhai: 700,
    objective: 'Escort the tug safely home against a minor interception.',
    castLine: 'We finish the rescue. That is the assignment.',
    trigger: { type: 'battle_victory', target: 'tier_2' },
  },
] as const

export const SMALL_RESCUE_FINAL_REWARD: QuestChainFinalReward = {
  ghai: 900,
  title: 'Soft Hands',
  cosmetic: 'Rescue Beacon Charm',
}
