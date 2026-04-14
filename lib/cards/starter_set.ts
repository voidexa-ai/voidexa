/**
 * lib/cards/starter_set.ts
 *
 * 40-card Core Set for v1 launch.
 * Master plan Part 8: 15 Common / 10 Uncommon / 8 Rare / 5 Epic / 2 Legendary.
 *
 * Distribution per category (fits Part 8's wider pool ratios, scaled to 40):
 *   Attack      × 13  (5C, 3U, 2R, 2E, 1L)
 *   Defense     × 9   (4C, 2U, 2R, 1E)
 *   Tactical    × 8   (3C, 2U, 2R, 1E)
 *   Deployment  × 6   (2C, 2U, 1R, 1E)
 *   Alien       × 4   (1C, 1U, 1R, 0E, 1L)    20% backfire chance each
 *
 * Uses Card types from lib/game/cards.ts. Alien cards additionally carry a
 * `backfireChance` field (0.2) as required by Part 8.
 */

import {
  CardCategory,
  CardRarity,
  type Card,
} from "../game/cards";
import type { CardCatalogue } from "./deck";

/** A Core Set card — extends Card with an optional backfire probability (Alien only). */
export interface CoreSetCard extends Card {
  /** 0..1 probability that the card's backfireEffect fires instead of its primaryEffect. Alien only. */
  backfireChance?: number;
}

/** Every Alien card carries this backfire chance (Part 8, line 450). */
export const ALIEN_BACKFIRE_CHANCE = 0.2;

// ── the 40 cards ───────────────────────────────────────────────────────────

export const STARTER_CARDS: ReadonlyArray<CoreSetCard> = [
  // ────────── COMMON (15) ──────────

  // Common / Attack (5)
  {
    id: "laser-pulse",
    name: "Laser Pulse",
    rarity: CardRarity.Common,
    category: CardCategory.Attack,
    energyCost: 1,
    description: "A quick laser snap to soften the target.",
    primaryEffect: "Deal 8 damage to target ship.",
  },
  {
    id: "plasma-bolt",
    name: "Plasma Bolt",
    rarity: CardRarity.Common,
    category: CardCategory.Attack,
    energyCost: 2,
    description: "A slow, heavy plasma round.",
    primaryEffect: "Deal 14 damage to target ship.",
  },
  {
    id: "micro-missile",
    name: "Micro Missile",
    rarity: CardRarity.Common,
    category: CardCategory.Attack,
    energyCost: 2,
    description: "A light tracking missile.",
    primaryEffect: "Deal 10 damage; ignores cover modifiers.",
  },
  {
    id: "gatling-burst",
    name: "Gatling Burst",
    rarity: CardRarity.Common,
    category: CardCategory.Attack,
    energyCost: 1,
    description: "A quick spray of kinetic rounds.",
    primaryEffect: "Deal 3 damage x 3 to target.",
  },
  {
    id: "thermal-lance",
    name: "Thermal Lance",
    rarity: CardRarity.Common,
    category: CardCategory.Attack,
    energyCost: 2,
    description: "A focused heat beam.",
    primaryEffect: "Deal 12 damage; target loses 1 Energy next turn.",
  },

  // Common / Defense (4)
  {
    id: "energy-shield-small",
    name: "Energy Shield",
    rarity: CardRarity.Common,
    category: CardCategory.Defense,
    energyCost: 1,
    description: "Basic deflector bubble.",
    primaryEffect: "Gain 10 shield.",
  },
  {
    id: "emergency-weld",
    name: "Emergency Weld",
    rarity: CardRarity.Common,
    category: CardCategory.Defense,
    energyCost: 2,
    description: "Hasty hull patch-up.",
    primaryEffect: "Restore 10 hull.",
  },
  {
    id: "decoy-flare",
    name: "Decoy Flare",
    rarity: CardRarity.Common,
    category: CardCategory.Defense,
    energyCost: 1,
    description: "Dazzling flare to break targeting lock.",
    primaryEffect: "Cancel 1 incoming attack against you this turn.",
  },
  {
    id: "evasive-roll",
    name: "Evasive Roll",
    rarity: CardRarity.Common,
    category: CardCategory.Defense,
    energyCost: 1,
    description: "A barrel roll to dodge incoming fire.",
    primaryEffect: "Reduce damage taken by 5 this turn.",
  },

  // Common / Tactical (3)
  {
    id: "speed-boost",
    name: "Speed Boost",
    rarity: CardRarity.Common,
    category: CardCategory.Tactical,
    energyCost: 1,
    description: "Quick throttle surge.",
    primaryEffect: "+15 speed for 1 turn.",
  },
  {
    id: "jam-weapons",
    name: "Jam Weapons",
    rarity: CardRarity.Common,
    category: CardCategory.Tactical,
    energyCost: 2,
    description: "Local radar jam.",
    primaryEffect: "Target cannot play Attack cards next turn (50% chance).",
  },
  {
    id: "scan-target",
    name: "Scan Target",
    rarity: CardRarity.Common,
    category: CardCategory.Tactical,
    energyCost: 1,
    description: "Quick hostile scan.",
    primaryEffect: "Reveal the target's hand size and current shield.",
  },

  // Common / Deployment (2)
  {
    id: "laser-drone",
    name: "Laser Drone",
    rarity: CardRarity.Common,
    category: CardCategory.Deployment,
    energyCost: 2,
    description: "A small drone that orbits and fires.",
    primaryEffect: "Deploy a drone that deals 4 damage at the end of each of your turns for 2 turns.",
  },
  {
    id: "point-defense",
    name: "Point Defense",
    rarity: CardRarity.Common,
    category: CardCategory.Deployment,
    energyCost: 2,
    description: "Auto-turret that shoots down missiles.",
    primaryEffect: "Deploy PD turret; blocks 1 missile-type attack for 2 turns.",
  },

  // Common / Alien (1)
  {
    id: "minor-phase-ripple",
    name: "Minor Phase Ripple",
    rarity: CardRarity.Common,
    category: CardCategory.Alien,
    energyCost: 2,
    description: "A fragment of alien tech — usually safe.",
    primaryEffect: "Reposition your ship 1 square on the tactical grid.",
    backfireEffect: "You teleport onto a random square — possibly into an obstacle.",
    backfireChance: ALIEN_BACKFIRE_CHANCE,
  },

  // ────────── UNCOMMON (10) ──────────

  // Uncommon / Attack (3)
  {
    id: "railgun-shot",
    name: "Railgun Shot",
    rarity: CardRarity.Uncommon,
    category: CardCategory.Attack,
    energyCost: 3,
    description: "High-velocity kinetic slug.",
    primaryEffect: "Deal 20 damage; ignores 50% of shields.",
  },
  {
    id: "acid-cloud",
    name: "Acid Cloud",
    rarity: CardRarity.Uncommon,
    category: CardCategory.Attack,
    energyCost: 2,
    description: "A lingering corrosive cloud.",
    primaryEffect: "Deal 5 damage now and 5 damage at the start of target's next 2 turns.",
  },
  {
    id: "homing-missile",
    name: "Homing Missile",
    rarity: CardRarity.Uncommon,
    category: CardCategory.Attack,
    energyCost: 3,
    description: "Smart-tracking warhead.",
    primaryEffect: "Deal 18 damage; cannot miss.",
  },

  // Uncommon / Defense (2)
  {
    id: "magnetic-shield",
    name: "Magnetic Shield",
    rarity: CardRarity.Uncommon,
    category: CardCategory.Defense,
    energyCost: 2,
    description: "Deflects kinetic and plasma rounds.",
    primaryEffect: "Gain 20 shield; reduce incoming kinetic damage by 50% this turn.",
  },
  {
    id: "nano-repair",
    name: "Nano Repair",
    rarity: CardRarity.Uncommon,
    category: CardCategory.Defense,
    energyCost: 3,
    description: "Swarm of repair bots.",
    primaryEffect: "Restore 20 hull over 2 turns.",
  },

  // Uncommon / Tactical (2)
  {
    id: "damage-booster",
    name: "Damage Booster",
    rarity: CardRarity.Uncommon,
    category: CardCategory.Tactical,
    energyCost: 2,
    description: "Overcharge weapon capacitors.",
    primaryEffect: "Next Attack card you play deals +50% damage.",
  },
  {
    id: "blind-pulse",
    name: "Blind Pulse",
    rarity: CardRarity.Uncommon,
    category: CardCategory.Tactical,
    energyCost: 3,
    description: "Wide-spectrum EM pulse.",
    primaryEffect: "Target's next attack has -50% accuracy.",
  },

  // Uncommon / Deployment (2)
  {
    id: "missile-drone",
    name: "Missile Drone",
    rarity: CardRarity.Uncommon,
    category: CardCategory.Deployment,
    energyCost: 3,
    description: "Mobile missile platform.",
    primaryEffect: "Deploy; fires a 10-damage missile at the end of each of your turns for 2 turns.",
  },
  {
    id: "shield-drone",
    name: "Shield Drone",
    rarity: CardRarity.Uncommon,
    category: CardCategory.Deployment,
    energyCost: 2,
    description: "Orbital shield projector.",
    primaryEffect: "Deploy; grants +10 shield per turn for 2 turns.",
  },

  // Uncommon / Alien (1)
  {
    id: "void-pulse",
    name: "Void Pulse",
    rarity: CardRarity.Uncommon,
    category: CardCategory.Alien,
    energyCost: 3,
    description: "A pulse of disorienting void energy.",
    primaryEffect: "Drain 15 shield from target.",
    backfireEffect: "You lose 15 shield instead.",
    backfireChance: ALIEN_BACKFIRE_CHANCE,
  },

  // ────────── RARE (8) ──────────

  // Rare / Attack (2)
  {
    id: "torpedo-barrage",
    name: "Torpedo Barrage",
    rarity: CardRarity.Rare,
    category: CardCategory.Attack,
    energyCost: 4,
    description: "Triple torpedo launch.",
    primaryEffect: "Deal 12 damage x 3 to target.",
  },
  {
    id: "phase-beam",
    name: "Phase Beam",
    rarity: CardRarity.Rare,
    category: CardCategory.Attack,
    energyCost: 3,
    description: "A beam that phases through shields.",
    primaryEffect: "Deal 24 damage directly to hull; bypasses shields.",
  },

  // Rare / Defense (2)
  {
    id: "mirror-shield",
    name: "Mirror Shield",
    rarity: CardRarity.Rare,
    category: CardCategory.Defense,
    energyCost: 4,
    description: "Reflective plating returns energy to sender.",
    primaryEffect: "Reflect 50% of incoming laser/plasma damage to attacker this turn.",
  },
  {
    id: "phase-shift-defense",
    name: "Phase Shift",
    rarity: CardRarity.Rare,
    category: CardCategory.Defense,
    energyCost: 3,
    description: "Briefly phase out of reality.",
    primaryEffect: "Become untargetable until your next turn; any attacks queued against you fizzle.",
  },

  // Rare / Tactical (2)
  {
    id: "crit-amplifier",
    name: "Crit Amplifier",
    rarity: CardRarity.Rare,
    category: CardCategory.Tactical,
    energyCost: 3,
    description: "Focus targeting computers.",
    primaryEffect: "All your Attack cards crit (x2 damage) this turn.",
  },
  {
    id: "create-nebula",
    name: "Create Nebula",
    rarity: CardRarity.Rare,
    category: CardCategory.Tactical,
    energyCost: 4,
    description: "Deploy a concealing nebula cloud.",
    primaryEffect: "Nebula persists 2 turns; all ships inside have -30% accuracy.",
  },

  // Rare / Deployment (1)
  {
    id: "kamikaze-drone",
    name: "Kamikaze Drone",
    rarity: CardRarity.Rare,
    category: CardCategory.Deployment,
    energyCost: 4,
    description: "Single-use explosive drone.",
    primaryEffect: "Deploy and detonate immediately: 25 damage to target, 10 splash to adjacent.",
  },

  // Rare / Alien (1)
  {
    id: "time-reverse",
    name: "Time Reverse",
    rarity: CardRarity.Rare,
    category: CardCategory.Alien,
    energyCost: 4,
    description: "Rewind a short moment of time.",
    primaryEffect: "Undo the last damage you took this turn.",
    backfireEffect: "Undo the last healing you did this turn.",
    backfireChance: ALIEN_BACKFIRE_CHANCE,
  },

  // ────────── EPIC (5) ──────────

  // Epic / Attack (2)
  {
    id: "void-lance",
    name: "Void Lance",
    rarity: CardRarity.Epic,
    category: CardCategory.Attack,
    energyCost: 5,
    description: "A spear of dark-energy light.",
    primaryEffect: "Deal 40 damage; bypasses shields.",
  },
  {
    id: "nova-barrage",
    name: "Nova Barrage",
    rarity: CardRarity.Epic,
    category: CardCategory.Attack,
    energyCost: 5,
    description: "Chain-reaction missile storm.",
    primaryEffect: "Deal 20 damage to target and 15 damage to all adjacent ships.",
  },

  // Epic / Defense (1)
  {
    id: "plasma-ablative-shield",
    name: "Plasma Ablative Shield",
    rarity: CardRarity.Epic,
    category: CardCategory.Defense,
    energyCost: 4,
    description: "Sacrificial plasma shell.",
    primaryEffect: "Absorb up to 60 damage over the next 2 turns; discharge any remaining as 15 damage to attacker.",
  },

  // Epic / Tactical (1)
  {
    id: "mind-read",
    name: "Mind Read",
    rarity: CardRarity.Epic,
    category: CardCategory.Tactical,
    energyCost: 4,
    description: "Neural intercept.",
    primaryEffect: "Reveal opponent's hand and force them to discard 1 card of your choice.",
  },

  // Epic / Deployment (1)
  {
    id: "fortress-turret",
    name: "Fortress Turret",
    rarity: CardRarity.Epic,
    category: CardCategory.Deployment,
    energyCost: 5,
    description: "Orbital heavy turret platform.",
    primaryEffect: "Deploy; deals 18 damage to highest-HP enemy at end of each of your turns for 3 turns.",
  },

  // ────────── LEGENDARY (2) ──────────

  // Legendary / Attack (1)
  {
    id: "stellar-annihilator",
    name: "Stellar Annihilator",
    rarity: CardRarity.Legendary,
    category: CardCategory.Attack,
    energyCost: 7,
    description: "A focused star-core beam — full-screen animation.",
    primaryEffect: "Deal 80 damage; target's shields are reduced to 0 on hit.",
  },

  // Legendary / Alien (1)
  {
    id: "reality-warp",
    name: "Reality Warp",
    rarity: CardRarity.Legendary,
    category: CardCategory.Alien,
    energyCost: 6,
    description: "Collapse a region of spacetime to your will.",
    primaryEffect: "Swap HP totals (shield + hull) with target ship.",
    backfireEffect: "Swap occurs against a random combatant — possibly one of your allies.",
    backfireChance: ALIEN_BACKFIRE_CHANCE,
  },
];

// ── catalogue helpers ──────────────────────────────────────────────────────

/**
 * Map of id → card for fast lookup. Use this everywhere the game code needs to
 * resolve a card id. Drop-in compatible with `CardCatalogue` from ./deck.
 */
export const STARTER_CATALOGUE: CardCatalogue = Object.freeze(
  Object.fromEntries(STARTER_CARDS.map((c) => [c.id, c])) as Record<string, Card>,
);

export function countByRarity(): Record<CardRarity, number> {
  const out: Record<CardRarity, number> = {
    [CardRarity.Common]: 0,
    [CardRarity.Uncommon]: 0,
    [CardRarity.Rare]: 0,
    [CardRarity.Epic]: 0,
    [CardRarity.Legendary]: 0,
  };
  for (const c of STARTER_CARDS) out[c.rarity]++;
  return out;
}
