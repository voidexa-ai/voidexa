/**
 * Phase 3 — encounter catalogue. Variants within each category
 * are chosen at random when the encounter fires.
 */

export type NavigationEncounterId = 'debris_field' | 'engine_flicker'
export type CombatEncounterId = 'pirate_ambush'
export type OpportunityEncounterId = 'floating_cargo_pod' | 'distress_signal'
export type AtmosphereEncounterId = 'cast_chatter' | 'deep_space_silence'

export interface EncounterDescriptor {
  id: string
  title: string
  description: string
}

export const NAVIGATION_ENCOUNTERS: Record<NavigationEncounterId, EncounterDescriptor> = {
  debris_field: {
    id: 'debris_field',
    title: 'Debris Field',
    description: 'Scattered wreckage. Dodge rocks for 10 seconds. Collisions cost speed.',
  },
  engine_flicker: {
    id: 'engine_flicker',
    title: 'Engine Flicker',
    description: 'Thrusters sputter. Speed drops 50% for 8 seconds.',
  },
}

export const COMBAT_ENCOUNTERS: Record<CombatEncounterId, EncounterDescriptor> = {
  pirate_ambush: {
    id: 'pirate_ambush',
    title: 'Pirate Ambush',
    description: 'A pirate frigate cuts your route. Fight or pay the cargo tax.',
  },
}

export const OPPORTUNITY_ENCOUNTERS: Record<OpportunityEncounterId, EncounterDescriptor> = {
  floating_cargo_pod: {
    id: 'floating_cargo_pod',
    title: 'Floating Cargo Pod',
    description: 'An unclaimed pod drifts past. Stop to collect? (+40 GHAI, +30s delay)',
  },
  distress_signal: {
    id: 'distress_signal',
    title: 'Distress Signal',
    description: 'A stranded pilot calls for help. Tow them? (+50 GHAI, +60s delay, +reputation)',
  },
}

export const ATMOSPHERE_ENCOUNTERS: Record<AtmosphereEncounterId, EncounterDescriptor> = {
  cast_chatter: {
    id: 'cast_chatter',
    title: 'Cast Chatter',
    description: 'Radio static, then a voice.',
  },
  deep_space_silence: {
    id: 'deep_space_silence',
    title: 'Deep Space Silence',
    description: 'All systems go quiet for a moment. Only the hum of the reactor.',
  },
}

// Cast chatter quotes — light colour for the universe.
export const CAST_CHATTER_QUOTES: readonly { speaker: string; line: string }[] = [
  { speaker: 'Llama', line: 'bro er du stadig ude der lmao' },
  { speaker: 'Jix', line: 'Hold afstand fra Mid Ring — der var aktivitet i morges.' },
  { speaker: 'Perplexity', line: 'Telemetry clean. You\'re ahead of schedule.' },
  { speaker: 'Claude', line: 'Safe run. Let\'s compare notes at the hub.' },
  { speaker: 'GPT', line: 'Nominal vectors. Do not deviate.' },
  { speaker: 'Gemini', line: 'Reviewed your approach. Slightly tight on fuel — ease throttle.' },
]

export function pickRandom<T>(arr: readonly T[], rand: number): T {
  return arr[Math.floor(rand * arr.length) % arr.length]
}

export function pickNavigationVariant(rand: number): NavigationEncounterId {
  return rand < 0.5 ? 'debris_field' : 'engine_flicker'
}

export function pickOpportunityVariant(rand: number): OpportunityEncounterId {
  return rand < 0.5 ? 'floating_cargo_pod' : 'distress_signal'
}

export function pickAtmosphereVariant(rand: number): AtmosphereEncounterId {
  return rand < 0.5 ? 'cast_chatter' : 'deep_space_silence'
}
