/**
 * Sprint 2 — Task 2: 10 named NPC pilots for /freeflight.
 * Source: docs/VOIDEXA_UNIVERSE_CONTENT.md SECTION 5.
 *
 * Mix: 2 Haulers + 2 Pirates + 2 Salvagers + 2 Scouts (racer/explorer) +
 * 1 Mysterious Figure + 1 Wildcard (joker). Pirates display a hostile
 * warning instead of a greet prompt; combat AI is deferred to Sprint 3+.
 */

export type NPCRole = 'hauler' | 'pirate' | 'salvager' | 'scout' | 'mystery' | 'wildcard'

export type NPCShipClass = 'hauler' | 'fighter' | 'salvager' | 'explorer' | 'bob'

export type NPCHomeZone = 'Core Zone' | 'Inner Ring' | 'Mid Ring' | 'Outer Ring' | 'Deep Void'

export interface NPCDialogue {
  greeting: string
  combat: string
  farewell: string
}

export interface NPCDef {
  id: string
  name: string
  role: NPCRole
  shipClass: NPCShipClass
  homeZone: NPCHomeZone
  /** Anchor point for their patrol loop. Patrol is a small circle around this. */
  anchor: { x: number; y: number; z: number }
  /** Patrol radius in world units (controls how wide their loop is). */
  patrolRadius: number
  /** Patrol period in seconds — one full lap. */
  patrolPeriod: number
  /** Ship color — tints the primitive mesh. Role-driven. */
  color: string
  personality: string
  dialogue: NPCDialogue
  reputation: string
}

// Color scheme — role-driven so intent is legible at a glance.
export const NPC_ROLE_COLOR: Record<NPCRole, string> = {
  hauler:   '#7fd8ff',  // friendly cyan
  pirate:   '#ff6b6b',  // hostile red
  salvager: '#ff9447',  // scavenger orange
  scout:    '#af52de',  // explorer violet
  mystery:  '#ffd166',  // cast-adjacent yellow
  wildcard: '#ffffff',  // neutral white
}

export const NPCS: readonly NPCDef[] = [
  // ─── Haulers (friendly, cyan) ────────────────────────────────────────────
  {
    id: 'tessa_vale',
    name: 'Tessa Vale',
    role: 'hauler',
    shipClass: 'hauler',
    homeZone: 'Inner Ring',
    anchor: { x: 180, y: 70, z: 30 },
    patrolRadius: 45,
    patrolPeriod: 38,
    color: NPC_ROLE_COLOR.hauler,
    personality: 'Calm, practical, never wastes words.',
    dialogue: {
      greeting: 'Lane\'s clear on my side. You need the safe route?',
      combat:   'I do not enjoy this, but I am equipped for it.',
      farewell: 'Fly steady. Fast is optional.',
    },
    reputation: 'The hauler who always arrives, even late, never missing.',
  },
  {
    id: 'boro_finch',
    name: 'Boro Finch',
    role: 'hauler',
    shipClass: 'hauler',
    homeZone: 'Core Zone',
    anchor: { x: -60, y: 10, z: 20 },
    patrolRadius: 55,
    patrolPeriod: 42,
    color: NPC_ROLE_COLOR.hauler,
    personality: 'Cheerful, chatty, mildly chaotic.',
    dialogue: {
      greeting: 'Good timing. I was just about to become helpful.',
      combat:   'Oh, so we\'re doing this loud.',
      farewell: 'If you see my missing crate, it owes me money.',
    },
    reputation: 'Famous for surviving small disasters with a grin.',
  },

  // ─── Pirates (hostile, red) ──────────────────────────────────────────────
  {
    id: 'krail_venn',
    name: 'Krail Venn',
    role: 'pirate',
    shipClass: 'fighter',
    homeZone: 'Outer Ring',
    anchor: { x: 230, y: -50, z: -140 },
    patrolRadius: 60,
    patrolPeriod: 28,
    color: NPC_ROLE_COLOR.pirate,
    personality: 'Smooth, theatrical, selective about violence.',
    dialogue: {
      greeting: 'Relax. If I wanted your ship, you\'d already know.',
      combat:   'Ah. So today is educational.',
      farewell: 'Next time, carry something worth my effort.',
    },
    reputation: 'A pirate who robs for margin, not malice.',
  },
  {
    id: 'ossa_pike',
    name: 'Ossa Pike',
    role: 'pirate',
    shipClass: 'fighter',
    homeZone: 'Outer Ring',
    anchor: { x: -200, y: 80, z: 190 },
    patrolRadius: 70,
    patrolPeriod: 24,
    color: NPC_ROLE_COLOR.pirate,
    personality: 'Impatient, sharp, highly competent.',
    dialogue: {
      greeting: 'State cargo or state your regrets.',
      combat:   'Good. I hate a dull theft.',
      farewell: 'You got lucky. Don\'t decorate it.',
    },
    reputation: 'Feared for fast intercepts and perfect escape angles.',
  },

  // ─── Salvagers (scavenger orange) ────────────────────────────────────────
  {
    id: 'yara_flint',
    name: 'Yara Flint',
    role: 'salvager',
    shipClass: 'salvager',
    homeZone: 'Mid Ring',
    anchor: { x: 155, y: -60, z: 85 },
    patrolRadius: 40,
    patrolPeriod: 35,
    color: NPC_ROLE_COLOR.salvager,
    personality: 'Focused, fair, unforgiving about claims.',
    dialogue: {
      greeting: 'Claim first. Then conversation.',
      combat:   'You are interfering with organized scavenging.',
      farewell: 'Next wreck, read the buoy.',
    },
    reputation: 'The cleanest professional salvager in Mid Ring.',
  },
  {
    id: 'dax_miro',
    name: 'Dax Miro',
    role: 'salvager',
    shipClass: 'salvager',
    homeZone: 'Mid Ring',
    anchor: { x: -130, y: -85, z: -45 },
    patrolRadius: 50,
    patrolPeriod: 40,
    color: NPC_ROLE_COLOR.salvager,
    personality: 'Friendly, opportunistic, never idle.',
    dialogue: {
      greeting: 'We can both profit here. Very civilized.',
      combat:   'That is an aggressively rude negotiation.',
      farewell: 'Call me when something explodes nicely.',
    },
    reputation: 'Shares more than he should — popular among freelancers.',
  },

  // ─── Scouts / Racers / Explorers (violet) ────────────────────────────────
  {
    id: 'riko_vance',
    name: 'Riko Vance',
    role: 'scout',
    shipClass: 'fighter',
    homeZone: 'Core Zone',
    anchor: { x: 50, y: 75, z: -35 },
    patrolRadius: 35,
    patrolPeriod: 18,
    color: NPC_ROLE_COLOR.scout,
    personality: 'Cocky, likable, generous with tips after winning.',
    dialogue: {
      greeting: 'You look fast enough to embarrass yourself properly.',
      combat:   'Wrong venue, but I adapt.',
      farewell: 'You\'ll be quicker next time. Probably.',
    },
    reputation: "Local legend on Bob's First Loop.",
  },
  {
    id: 'orin_vale',
    name: 'Orin Vale',
    role: 'scout',
    shipClass: 'explorer',
    homeZone: 'Mid Ring',
    anchor: { x: 85, y: 120, z: 170 },
    patrolRadius: 55,
    patrolPeriod: 48,
    color: NPC_ROLE_COLOR.scout,
    personality: 'Thoughtful, patient, quietly enthusiastic.',
    dialogue: {
      greeting: 'You scan first. Good sign.',
      combat:   'I dislike this interruption.',
      farewell: 'There\'s a beautiful wrong thing two sectors east.',
    },
    reputation: 'Publishes accurate anomaly notes without hype.',
  },

  // ─── Mystery (cast-adjacent yellow) ──────────────────────────────────────
  {
    id: 'pale_neris',
    name: 'Pale Neris',
    role: 'mystery',
    shipClass: 'explorer',
    homeZone: 'Deep Void',
    anchor: { x: 220, y: 150, z: -230 },
    patrolRadius: 30,
    patrolPeriod: 60,
    color: NPC_ROLE_COLOR.mystery,
    personality: 'Sparse, composed, impossible to read.',
    dialogue: {
      greeting: 'You heard it too.',
      combat:   'Unnecessary.',
      farewell: 'Not every marker points outward.',
    },
    reputation: 'Rumored to know routes not on any atlas.',
  },

  // ─── Wildcard (neutral white) ────────────────────────────────────────────
  {
    id: 'kipp_lag_denzo',
    name: 'Kipp "Lag" Denzo',
    role: 'wildcard',
    shipClass: 'bob',
    homeZone: 'Core Zone',
    anchor: { x: -30, y: -45, z: 55 },
    patrolRadius: 45,
    patrolPeriod: 22,
    color: NPC_ROLE_COLOR.wildcard,
    personality: 'Meme-brained, fearless, somehow effective.',
    dialogue: {
      greeting: 'Race me upside down. Coward.',
      combat:   'Wow rude, I was jokingly alive.',
      farewell: 'Clip that. It was almost skill.',
    },
    reputation: 'Famous for losing spectacularly and winning annoyingly.',
  },
] as const

export const NPC_GREET_RADIUS = 30
export const NPC_WARN_RADIUS = 45

export function getNPCById(id: string): NPCDef | undefined {
  return NPCS.find(n => n.id === id)
}
