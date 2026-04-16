/**
 * Sprint 2 — Task 3: 15 scanner-triggered exploration encounters for /freeflight.
 * Source: docs/VOIDEXA_UNIVERSE_CONTENT.md SECTION 3.
 *
 * Mix: 8 Core Zone + 5 Inner Ring + 2 crossover. Covers all 4 trigger types
 * (visual / audio / scanner_ping / proximity). Once resolved per player the
 * encounter is stored in Supabase `exploration_encounters_resolved` and no
 * longer fires for that pilot.
 */

export type EncounterZone = 'Core Zone' | 'Inner Ring'

export type EncounterTrigger = 'visual' | 'audio' | 'scanner_ping' | 'proximity'

export type EncounterRarity = 'common' | 'uncommon' | 'rare'

export type ChoiceOutcomeKind = 'ghai' | 'lore' | 'reputation' | 'nothing'

export interface EncounterChoice {
  id: string
  label: string
  outcomeKind: ChoiceOutcomeKind
  /** GHAI delta when outcomeKind === 'ghai'. */
  reward?: number
  /** Short note surfaced to the player after they resolve. */
  note: string
}

export interface ExplorationEncounter {
  id: string
  name: string
  zone: EncounterZone
  rarity: EncounterRarity
  trigger: EncounterTrigger
  x: number
  y: number
  z: number
  /** Short description shown when the encounter activates. */
  description: string
  /** Evocative flavour sentence under the name in the modal. */
  flavor: string
  /** 2–4 player choices. */
  choices: EncounterChoice[]
}

export const EXPLORATION_ENCOUNTERS: readonly ExplorationEncounter[] = [
  // ─── Core Zone — 8 ──────────────────────────────────────────────────────
  {
    id: 'loose_breakfast_crate',
    name: 'Loose Breakfast Crate',
    zone: 'Core Zone',
    rarity: 'common',
    trigger: 'scanner_ping',
    x: 45, y: 20, z: -35,
    description: 'A single meal crate spins slowly near a route marker, still thermally warm.',
    flavor: 'Someone is going to be very disappointed at lunch.',
    choices: [
      { id: 'recover', label: 'Recover crate', outcomeKind: 'ghai', reward: 30, note: 'The station pays you a finder\'s fee. +30 GHAI.' },
      { id: 'ignore', label: 'Leave it', outcomeKind: 'nothing', note: 'Someone else will grab it.' },
      { id: 'return', label: 'Return to sender', outcomeKind: 'reputation', note: 'A warm reply comes back over comms.' },
    ],
  },
  {
    id: 'lantern_misfire',
    name: 'Lantern Misfire',
    zone: 'Core Zone',
    rarity: 'uncommon',
    trigger: 'proximity',
    x: -55, y: -30, z: 60,
    description: 'One memorial lantern drifts off pattern, blinking the wrong color.',
    flavor: 'Someone is missing today. The lantern knows it.',
    choices: [
      { id: 'nudge', label: 'Nudge it back', outcomeKind: 'reputation', note: 'Quiet goodwill. A family you\'ll never meet says thanks.' },
      { id: 'scan', label: 'Scan inscription', outcomeKind: 'lore', note: 'A name and a date. You\'ll remember it.' },
      { id: 'keep_moving', label: 'Keep moving', outcomeKind: 'nothing', note: 'Some memorials aren\'t yours to fix.' },
    ],
  },
  {
    id: 'friendly_flyby',
    name: 'Friendly Flyby',
    zone: 'Core Zone',
    rarity: 'common',
    trigger: 'audio',
    x: 70, y: 45, z: 50,
    description: 'An NPC pilot opens comms just to wave and compare paint jobs.',
    flavor: '"Nice decals. Mine are better. Just saying."',
    choices: [
      { id: 'reply', label: 'Reply in kind', outcomeKind: 'reputation', note: 'Your callsign goes on their "cool pilots" list.' },
      { id: 'race', label: 'Race them', outcomeKind: 'ghai', reward: 20, note: 'Quick lap. You win a small wager. +20 GHAI.' },
      { id: 'ignore', label: 'Ignore', outcomeKind: 'nothing', note: 'Comms stay silent. No harm done.' },
    ],
  },
  {
    id: 'training_drone_cluster',
    name: 'Training Drone Cluster',
    zone: 'Core Zone',
    rarity: 'common',
    trigger: 'scanner_ping',
    x: -40, y: 50, z: -65,
    description: 'Four inactive training drones drift outside their intended practice box.',
    flavor: 'They look bored. Can a drone look bored?',
    choices: [
      { id: 'reactivate', label: 'Reactivate', outcomeKind: 'reputation', note: 'Dock Nine-Lark files a formal thank-you.' },
      { id: 'tow', label: 'Tow them back', outcomeKind: 'ghai', reward: 25, note: 'Small retrieval fee. +25 GHAI.' },
      { id: 'scrap', label: 'Scrap them', outcomeKind: 'ghai', reward: 40, note: 'GPT sighs over comms. +40 GHAI, -rep.' },
    ],
  },
  {
    id: 'stone_whisper_echo',
    name: 'Stone Whisper Echo',
    zone: 'Core Zone',
    rarity: 'rare',
    trigger: 'audio',
    x: -80, y: -55, z: -35,
    description: 'Faint layered whispers pulse when approaching the Stones of Hush from below.',
    flavor: 'You can almost make out syllables. Almost.',
    choices: [
      { id: 'record', label: 'Record', outcomeKind: 'lore', note: 'The file will play differently every time.' },
      { id: 'triangulate', label: 'Triangulate source', outcomeKind: 'lore', note: 'Coordinates point to open space. That can\'t be right.' },
      { id: 'back_away', label: 'Back away', outcomeKind: 'nothing', note: 'Some things ask not to be listened to.' },
    ],
  },
  {
    id: 'lost_tool_satchel',
    name: 'Lost Tool Satchel',
    zone: 'Core Zone',
    rarity: 'common',
    trigger: 'proximity',
    x: 10, y: -65, z: 15,
    description: 'A maintenance satchel spins near Glass Anchor, locator beacon chirping politely.',
    flavor: '"If found, please do not use the wrench as a hammer."',
    choices: [
      { id: 'return', label: 'Return to owner', outcomeKind: 'ghai', reward: 15, note: 'Small thank-you gift. +15 GHAI.' },
      { id: 'open', label: 'Open it', outcomeKind: 'lore', note: 'A note and a half-eaten sandwich.' },
      { id: 'tow', label: 'Tow to lost-and-found', outcomeKind: 'reputation', note: 'Clean conscience, no reward.' },
    ],
  },
  {
    id: 'break_room_coupon_buoy',
    name: 'Break Room Coupon Buoy',
    zone: 'Core Zone',
    rarity: 'common',
    trigger: 'visual',
    x: 30, y: 60, z: 70,
    description: 'A promotional buoy fires a confetti ping and offers a free drink.',
    flavor: 'Genuinely, who funded this thing.',
    choices: [
      { id: 'scan', label: 'Scan code', outcomeKind: 'ghai', reward: 10, note: '10 GHAI voucher. Drinks cost 12. Still a win.' },
      { id: 'share', label: 'Share code', outcomeKind: 'reputation', note: 'Your comms list appreciates you.' },
      { id: 'ignore', label: 'Ignore', outcomeKind: 'nothing', note: 'Confetti drifts past. Peaceful.' },
    ],
  },
  {
    id: 'ember_soup_spill',
    name: 'Ember Soup Spill',
    zone: 'Core Zone',
    rarity: 'common',
    trigger: 'visual',
    x: 25, y: -40, z: 90,
    description: 'Warm soup globules float glittering around a cracked delivery pod near Ember Canteen.',
    flavor: 'Anti-grav soup is somehow even sadder than regular spilled soup.',
    choices: [
      { id: 'scoop', label: 'Scoop salvage', outcomeKind: 'ghai', reward: 20, note: 'Parts are sellable. +20 GHAI.' },
      { id: 'return_pod', label: 'Return pod', outcomeKind: 'reputation', note: 'Free soup voucher next dock.' },
      { id: 'taste', label: 'Sample soup', outcomeKind: 'lore', note: 'Surprisingly good. Probably fine.' },
    ],
  },

  // ─── Inner Ring — 5 ─────────────────────────────────────────────────────
  {
    id: 'silt_drifter_pods',
    name: 'Silt Drifter Pods',
    zone: 'Inner Ring',
    rarity: 'common',
    trigger: 'scanner_ping',
    x: 165, y: 55, z: -140,
    description: 'Three detachable cargo pods have separated from a hauler and drift toward debris.',
    flavor: 'Technically still someone\'s property. Technically.',
    choices: [
      { id: 'recover', label: 'Recover & call traffic control', outcomeKind: 'ghai', reward: 60, note: 'Lawful reward. +60 GHAI.' },
      { id: 'loot', label: 'Loot and vanish', outcomeKind: 'ghai', reward: 110, note: '+110 GHAI, rep hit, pirate attention chance.' },
      { id: 'mark', label: 'Mark for others', outcomeKind: 'reputation', note: 'Other pilots thank you.' },
    ],
  },
  {
    id: 'customs_false_alarm',
    name: 'Customs False Alarm',
    zone: 'Inner Ring',
    rarity: 'uncommon',
    trigger: 'audio',
    x: 185, y: -40, z: 45,
    description: 'Aureline Customs Ring broadcasts an alert about "highly suspicious vegetables."',
    flavor: 'You can hear an auditor trying not to laugh.',
    choices: [
      { id: 'investigate', label: 'Investigate ship', outcomeKind: 'lore', note: 'Cabbages. Just cabbages.' },
      { id: 'escort', label: 'Escort through inspection', outcomeKind: 'ghai', reward: 45, note: 'Lawful escort pay. +45 GHAI.' },
      { id: 'manifest', label: 'Scan the manifest', outcomeKind: 'lore', note: 'A suspicious pattern of vegetable shipments...' },
    ],
  },
  {
    id: 'orchard_ribbon_shadow',
    name: 'Orchard Ribbon Shadow',
    zone: 'Inner Ring',
    rarity: 'uncommon',
    trigger: 'visual',
    x: -145, y: 95, z: -160,
    description: 'Something large passes beneath Orchard Meridian\'s light bands. Sensors show nothing dangerous.',
    flavor: 'Nobody gets paid to chase shadows. That\'s the problem.',
    choices: [
      { id: 'follow', label: 'Follow the shadow', outcomeKind: 'lore', note: 'An Explorer NPC nods to you from afar.' },
      { id: 'scan_wake', label: 'Scan its wake', outcomeKind: 'lore', note: 'Pattern analysis returns... something old.' },
      { id: 'ignore', label: 'Ignore', outcomeKind: 'nothing', note: 'The shadow passes.' },
    ],
  },
  {
    id: 'veilrun_vapor_bloom',
    name: 'Veilrun Vapor Bloom',
    zone: 'Inner Ring',
    rarity: 'common',
    trigger: 'proximity',
    x: 175, y: -80, z: 130,
    description: 'A blue vapor burst creates a temporary shimmering cloud full of static crackle.',
    flavor: 'Static feels like it\'s trying to tell you something.',
    choices: [
      { id: 'harvest', label: 'Harvest vapor', outcomeKind: 'ghai', reward: 55, note: 'Volatile materials sold at Helio. +55 GHAI.' },
      { id: 'pass_through', label: 'Pass through', outcomeKind: 'lore', note: 'Engine hums at a new pitch for the next hour.' },
      { id: 'mark_location', label: 'Mark for survey', outcomeKind: 'reputation', note: 'Gemini files your report with a small honour.' },
    ],
  },
  {
    id: 'relay_orchard_ghost_packet',
    name: 'Relay Orchard Ghost Packet',
    zone: 'Inner Ring',
    rarity: 'rare',
    trigger: 'scanner_ping',
    x: -175, y: 65, z: 175,
    description: 'One relay sat repeats a corrupted message fragment from years ago.',
    flavor: '"...if anyone hears this, the route is still open..."',
    choices: [
      { id: 'decode', label: 'Decode', outcomeKind: 'lore', note: 'Coordinates for an old quest chain. Save them.' },
      { id: 'forward', label: 'Forward to Perplexity', outcomeKind: 'reputation', note: 'Archived. You\'ll hear back eventually.' },
      { id: 'archive', label: 'Archive & ignore', outcomeKind: 'nothing', note: 'Marked and forgotten.' },
    ],
  },

  // ─── Crossover — 2 ──────────────────────────────────────────────────────
  {
    id: 'chalk_dust_cache',
    name: 'Chalk Dust Cache',
    zone: 'Core Zone',
    rarity: 'common',
    trigger: 'scanner_ping',
    x: -35, y: 75, z: -90,
    description: 'A tiny equipment cache hidden behind a beginner route marker on the Chalk Run.',
    flavor: 'A racer\'s old stash. Not theirs anymore.',
    choices: [
      { id: 'loot', label: 'Loot', outcomeKind: 'ghai', reward: 35, note: 'Spare parts. +35 GHAI.' },
      { id: 'scan_owner', label: 'Scan owner tag', outcomeKind: 'lore', note: 'A retired racer. Still breathing. Maybe worth a message.' },
      { id: 'leave', label: 'Leave it', outcomeKind: 'nothing', note: 'Respect the old markers.' },
    ],
  },
  {
    id: 'penny_rails_hitchhiker',
    name: 'Penny Rails Hitchhiker',
    zone: 'Inner Ring',
    rarity: 'common',
    trigger: 'audio',
    x: 155, y: 30, z: -85,
    description: 'A tired hauler asks over comms if you can escort them "for literally two minutes".',
    flavor: 'They sound nervous. Pirate rumors, probably.',
    choices: [
      { id: 'escort', label: 'Escort', outcomeKind: 'ghai', reward: 40, note: 'Safe arrival. +40 GHAI.' },
      { id: 'decline', label: 'Decline', outcomeKind: 'nothing', note: 'They make it alone. Probably.' },
      { id: 'scan_area', label: 'Scan the area first', outcomeKind: 'lore', note: 'A pirate blip lights up, then vanishes. You stay alert.' },
    ],
  },
] as const

export const ENCOUNTER_PING_RADIUS = 150
export const ENCOUNTER_TRIGGER_RADIUS = 50

export function getEncounterById(id: string): ExplorationEncounter | undefined {
  return EXPLORATION_ENCOUNTERS.find(e => e.id === id)
}
