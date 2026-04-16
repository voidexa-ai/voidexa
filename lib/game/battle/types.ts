/**
 * Phase 4a — PvE Card Battle Foundation (types only, no runtime).
 * Source of truth: docs/VOIDEXA_GAMING_COMBINED_V3.md PART 6.
 *
 * Pure data shapes. No React. No Supabase. No mutations.
 */

import type { CardTemplate, StatusEffect as StatusEffectId } from '../cards/index'

export type Side = 'player' | 'enemy'

export type BattlePhase = 'draw' | 'play' | 'resolve' | 'end_turn' | 'game_over'

export type Vec3 = readonly [number, number, number]

export interface CardInstance extends CardTemplate {
  /** Unique per-instance id so two copies of the same template are distinct. */
  instanceId: string
  exhausted: boolean
}

export type DroneTemplateId =
  | 'scout_drone'
  | 'gun_drone'
  | 'repair_drone'
  | 'intercept_drone'

export type DroneKeyword = 'cold_boot' | 'fragile' | 'loyal'

export interface DroneInstance {
  /** Unique per-drone id. */
  instanceId: string
  templateId: DroneTemplateId | string
  hp: number
  /** Damage dealt by this drone when it fires. 0 for non-attacking drones. */
  attack: number
  /** Turns left until auto-despawn. Negative means persistent. */
  turnsRemaining: number
  /** True while locked in a drone duel. Engaged drones don't fire the parent. */
  engaged: boolean
  keywords: DroneKeyword[]
  /**
   * Turn number when this drone was deployed. Used by Cold Boot: a drone with
   * the `cold_boot` keyword does not fire on its deploy turn.
   */
  deployedOnTurn: number
}

export interface StatusEffect {
  type: StatusEffectId
  /** Turns before expiry. 0 means expire at next resolveStatuses. */
  turnsRemaining: number
  stacks: number
}

export interface PlayerState {
  hull: number
  maxHull: number
  block: number
  energy: number
  maxEnergy: number
  hand: CardInstance[]
  deck: CardInstance[]
  discard: CardInstance[]
  drones: DroneInstance[]
  statuses: StatusEffect[]
}

export interface BattleState {
  player: PlayerState
  enemy: PlayerState
  turn: number
  /** Whose turn it is. */
  activeSide: Side
  phase: BattlePhase
  effectQueue: BattleEffect[]
  winner: Side | null
  /**
   * Monotonic counter used to mint unique ids. Kept in state so pure functions
   * remain deterministic per-input.
   */
  idCounter: number
  /** Optional log — caller can discard if not needed. */
  log: string[]
}

export type BattleEffectKind =
  | 'weapon_fire'
  | 'shield_up'
  | 'drone_deploy'
  | 'repair'
  | 'explosion'
  | 'hit_impact'
  | 'status_apply'
  | 'status_tick'
  | 'draw'
  | 'energy_gain'

export interface BattleEffect {
  kind: BattleEffectKind
  from?: Vec3
  to?: Vec3
  at?: Vec3
  damage?: number
  heal?: number
  block?: number
  status?: StatusEffectId
  target: Side
  /** Human-readable note for the battle log. */
  note?: string
}

export type BattleActionType = 'play_card' | 'end_turn'

export interface BattleAction {
  type: BattleActionType
  /** Required for play_card. */
  cardInstanceId?: string
  /** Optional — target a specific enemy drone instead of the enemy pilot. */
  targetDrone?: string
}

// --- Constants ---

export const BATTLE_CONSTANTS = {
  STARTING_HAND: 5,
  DRAW_PER_TURN: 2,
  HAND_LIMIT: 8,
  ENERGY_START: 1,
  ENERGY_MAX: 7,
  EXPOSE_MULTIPLIER: 1.25,
  BURN_DAMAGE_PER_TURN: 4,
  BURN_DURATION: 2,
  DEFAULT_PLAYER_HULL: 100,
  DEFAULT_ENEMY_HULL: 100,
} as const
