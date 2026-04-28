// lib/manual/etapes.ts
//
// AFS-18c - User manual etape metadata.
//
// All 5 source markdown files share an identical H1
// ("# VOIDEXA - USER MANUAL & UNIVERSE GUIDE"), so per-etape titles
// cannot be derived from the source. They are hard-coded here per the
// SKILL v2 Correction A locked decision. The shared H1 is stripped in
// lib/manual/load-markdown.ts before render.

export const ETAPE_META = {
  foundation: {
    title: 'Universe Foundation',
    description:
      'Lore, factions, sector geography - the world before the rules.',
    file: '01_UNIVERSE_FOUNDATION.md',
  },
  battle: {
    title: 'Battle Mechanics',
    description: 'Turn structure, phases, win conditions.',
    file: '02_BATTLE_MECHANICS.md',
  },
  cards: {
    title: 'The 9 Card Types',
    description:
      'Weapon, Drone, AI Routine, Defense, Module, Maneuver, Equipment, Field, Ship Core.',
    file: '03_THE_9_CARD_TYPES.md',
  },
  pilots: {
    title: 'Pilots, Cores & Archetypes',
    description: 'Pilot bios, ship-core abilities, archetype playstyles.',
    file: '04_PILOTS_CORES_ARCHETYPES.md',
  },
  glossary: {
    title: 'Keyword Glossary',
    description: 'Alphabetical reference for every keyword in the game.',
    file: '05_KEYWORD_GLOSSARY.md',
  },
} as const

export type EtapeSlug = keyof typeof ETAPE_META

// Rendering order: lore -> rules -> cards -> pilots -> reference. Used
// by ManualSidebar + ManualLanding.
export const ETAPE_ORDER: ReadonlyArray<EtapeSlug> = [
  'foundation',
  'battle',
  'cards',
  'pilots',
  'glossary',
]

export function isValidEtapeSlug(s: string | undefined): s is EtapeSlug {
  return typeof s === 'string' && s in ETAPE_META
}
