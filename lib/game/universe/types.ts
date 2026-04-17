/**
 * Sprint 6 — typed schema for the Gemini universe content catalog.
 *
 * Source: docs/gemini_universe_content_complete.json — 80 landmarks, 45
 * encounters, 20 NPCs, 15 quest chains. This module is the lore-rich
 * companion to the gameplay-positioned `lib/game/freeflight/landmarks.ts`
 * (which only has 20 Core/Inner Ring landmarks). Both can coexist.
 */

export type UniverseZone =
  | 'inner_ring'
  | 'outer_rim'
  | 'contested_space'
  | 'deep_void'

export type UniverseVisualType =
  | 'station'
  | 'asteroid'
  | 'monument'
  | 'nebula'
  | 'wreck'
  | 'anomaly'

export interface UniverseLandmark {
  id: string
  name: string
  zone: UniverseZone
  description: string
  scannable: boolean
  lore_text: string
  visual_type: UniverseVisualType
}

export interface UniverseEncounterChoice {
  label: string
  outcome: string
  reward_ghai: number
}

export interface UniverseEncounter {
  id: string
  name: string
  zone: UniverseZone
  description: string
  choices: UniverseEncounterChoice[]
  /** 1 (trivial) – 5 (lethal) */
  danger_level: 1 | 2 | 3 | 4 | 5
}

export interface UniverseNpc {
  id: string
  name: string
  role: string
  zone: UniverseZone
  personality: string
  greeting: string
  hostile: boolean
  dialogue_lines: string[]
}

export interface UniverseQuestStep {
  step: number
  objective: string
  reward_ghai: number
}

export interface UniverseQuestChain {
  id: string
  name: string
  zone: UniverseZone
  description: string
  missions: UniverseQuestStep[]
  final_reward: string
}

export interface UniverseContent {
  landmarks: UniverseLandmark[]
  encounters: UniverseEncounter[]
  npcs: UniverseNpc[]
  quest_chains: UniverseQuestChain[]
}

/**
 * Spatial radius bands per zone — used by `landmarkPositions()` in loaders.ts
 * to scatter the 80 lore landmarks in outer rings, well clear of the 20
 * gameplay landmarks in `lib/game/freeflight/landmarks.ts` (which sit at
 * radius 60–240).
 */
export const ZONE_RADIUS: Record<UniverseZone, [number, number]> = {
  inner_ring: [320, 460],
  contested_space: [480, 640],
  outer_rim: [660, 820],
  deep_void: [860, 1100],
}
