/**
 * lib/missions/catalogue.ts
 *
 * Authoritative list of every mission in voidexa v1 — 12 missions total.
 *   - 3 Timed   (AsteroidRun, SpeedDelivery, NebulaDash)
 *   - 3 Exploration (ScanMission, UnchartedSector, BeaconPlacement)
 *   - 1 Daily template (randomized from the Timed pool by daily.ts)
 *   - 5 Story  (sequence revealing voidexa's origin — see story.ts)
 *
 * Combat missions (Pirate Hunt / Escort / Base Defense) are intentionally
 * omitted from v1 — master plan gates them on "phase 10 dogfight".
 */

import {
  MissionDifficulty,
  MissionType,
  type Mission,
} from "./types";

// ── Timed (3) ──────────────────────────────────────────────────────────────

const ASTEROID_RUN: Mission = {
  id: "timed-asteroid-run",
  name: "Asteroid Run",
  type: MissionType.AsteroidRun,
  difficulty: MissionDifficulty.Medium,
  description:
    "Fly A to B through a dense asteroid field. Time penalties apply for collisions. Leaderboard tracked.",
  objectives: [
    { id: "reach-end", description: "Reach the end checkpoint before time runs out.", target: 1 },
    { id: "no-crashes", description: "Complete the run without colliding with more than 3 asteroids.", target: 1 },
  ],
  timeLimit: 120,
  rewardXP: 150,
  rewardCredits: 300,
  isDaily: false,
  isStory: false,
  isRepeatable: true,
  coopAllowed: false,
};

const SPEED_DELIVERY: Mission = {
  id: "timed-speed-delivery",
  name: "Speed Delivery",
  type: MissionType.SpeedDelivery,
  difficulty: MissionDifficulty.Medium,
  description:
    "Pick up a fragile cargo container at Station A and deliver it to Station B before the timer expires.",
  objectives: [
    { id: "pickup", description: "Collect the cargo from Station A.", target: 1 },
    { id: "deliver", description: "Dock at Station B with cargo intact.", target: 1 },
  ],
  timeLimit: 180,
  rewardXP: 180,
  rewardCredits: 350,
  isDaily: false,
  isStory: false,
  isRepeatable: true,
  coopAllowed: false,
};

const NEBULA_DASH: Mission = {
  id: "timed-nebula-dash",
  name: "Nebula Dash",
  type: MissionType.NebulaDash,
  difficulty: MissionDifficulty.Hard,
  description:
    "Thread a nebula zone with reduced visibility. Checkpoints available; shortcuts exist at your own risk.",
  objectives: [
    { id: "clear-checkpoints", description: "Pass every checkpoint in order.", target: 6 },
    { id: "finish-in-time", description: "Finish before the timer expires.", target: 1 },
  ],
  timeLimit: 150,
  rewardXP: 200,
  rewardCredits: 400,
  isDaily: false,
  isStory: false,
  isRepeatable: true,
  coopAllowed: false,
};

/** Exposed so daily.ts can pick a fresh Timed mission each day. */
export const TIMED_MISSIONS: readonly Mission[] = [
  ASTEROID_RUN,
  SPEED_DELIVERY,
  NEBULA_DASH,
];

// ── Exploration (3) ────────────────────────────────────────────────────────

const SCAN_MISSION: Mission = {
  id: "explore-scan-mission",
  name: "Derelict Survey",
  type: MissionType.ScanMission,
  difficulty: MissionDifficulty.Easy,
  description: "Locate and scan derelict ships scattered across the sector. Lore fragments reward successful scans.",
  objectives: [
    { id: "scan-derelicts", description: "Scan 4 derelict ships.", target: 4 },
  ],
  timeLimit: 0,
  rewardXP: 120,
  rewardCredits: 200,
  isDaily: false,
  isStory: false,
  isRepeatable: true,
  coopAllowed: true,
};

const UNCHARTED_SECTOR: Mission = {
  id: "explore-uncharted-sector",
  name: "Uncharted Sector",
  type: MissionType.UnchartedSector,
  difficulty: MissionDifficulty.Medium,
  description: "Fly to an unmapped zone. Content spawns on arrival — scan everything you find.",
  objectives: [
    { id: "reach-sector", description: "Fly to the target coordinates.", target: 1 },
    { id: "scan-all", description: "Scan every anomaly that appears.", target: 5 },
  ],
  timeLimit: 0,
  rewardXP: 220,
  rewardCredits: 450,
  rewardItem: "uncharted-sector-lore-fragment",
  isDaily: false,
  isStory: false,
  isRepeatable: true,
  coopAllowed: true,
};

const BEACON_PLACEMENT: Mission = {
  id: "explore-beacon-placement",
  name: "Beacon Placement",
  type: MissionType.BeaconPlacement,
  difficulty: MissionDifficulty.Easy,
  description: "A planet-owner has contracted beacon installation at the specified coordinates. Place and activate.",
  objectives: [
    { id: "fly-to-site", description: "Reach the beacon site.", target: 1 },
    { id: "place-beacon", description: "Deploy the beacon and wait for handshake.", target: 1 },
  ],
  timeLimit: 0,
  rewardXP: 100,
  rewardCredits: 250,
  isDaily: false,
  isStory: false,
  isRepeatable: true,
  coopAllowed: true,
};

export const EXPLORATION_MISSIONS: readonly Mission[] = [
  SCAN_MISSION,
  UNCHARTED_SECTOR,
  BEACON_PLACEMENT,
];

// ── Daily template (1) ─────────────────────────────────────────────────────

/**
 * Template for the daily challenge. `daily.ts::getDailyChallenge` swaps in
 * the selected Timed mission's id/type/objectives each day. The template
 * carries the meta (badge reward, repeatable flag, difficulty multiplier).
 */
export const DAILY_CHALLENGE_TEMPLATE: Mission = {
  id: "daily-challenge",
  name: "Daily Challenge",
  type: MissionType.AsteroidRun, // placeholder; overwritten by daily.ts
  difficulty: MissionDifficulty.Hard,
  description:
    "Today's rotating Timed challenge. Finish for bonus XP + credits; top of the leaderboard earns a rare shop item.",
  objectives: [
    { id: "complete", description: "Finish today's timed challenge.", target: 1 },
  ],
  timeLimit: 180,
  rewardXP: 250,
  rewardCredits: 500,
  rewardItem: "daily-challenge-rare-reward",
  isDaily: true,
  isStory: false,
  isRepeatable: false, // one attempt counted per day
  coopAllowed: false,
};

// ── Story chain (5) ────────────────────────────────────────────────────────

const STORY_1: Mission = {
  id: "story-1-echoes-in-the-dark",
  name: "Echoes in the Dark",
  type: MissionType.ScanMission,
  difficulty: MissionDifficulty.Easy,
  description: "A signal pulses from an abandoned outpost. Find it. Scan the logs.",
  objectives: [
    { id: "find-outpost", description: "Locate the abandoned outpost.", target: 1 },
    { id: "scan-logs",    description: "Scan the remaining log terminals.", target: 3 },
  ],
  timeLimit: 0,
  rewardXP: 300,
  rewardCredits: 500,
  rewardItem: "story-chapter-1-lore",
  isDaily: false,
  isStory: true,
  isRepeatable: false,
  coopAllowed: false,
  storyOrder: 0,
};

const STORY_2: Mission = {
  id: "story-2-the-first-signal",
  name: "The First Signal",
  type: MissionType.UnchartedSector,
  difficulty: MissionDifficulty.Medium,
  description:
    "Decoded fragments point to a sector off every starmap. Go there. Find what's broadcasting.",
  objectives: [
    { id: "triangulate", description: "Triangulate the signal source.", target: 3 },
    { id: "approach",    description: "Approach the source within 500m.", target: 1 },
  ],
  timeLimit: 0,
  rewardXP: 400,
  rewardCredits: 650,
  rewardItem: "story-chapter-2-lore",
  isDaily: false,
  isStory: true,
  isRepeatable: false,
  coopAllowed: false,
  storyOrder: 1,
};

const STORY_3: Mission = {
  id: "story-3-ghost-fleet",
  name: "The Ghost Fleet",
  type: MissionType.ScanMission,
  difficulty: MissionDifficulty.Medium,
  description:
    "The signal leads to wreckage of a fleet that never officially existed. Scan the ships. Recover their manifests.",
  objectives: [
    { id: "scan-wrecks",  description: "Scan 5 hull fragments from the ghost fleet.", target: 5 },
    { id: "recover-core", description: "Recover the flagship's data core.", target: 1 },
  ],
  timeLimit: 0,
  rewardXP: 500,
  rewardCredits: 800,
  rewardItem: "story-chapter-3-lore",
  isDaily: false,
  isStory: true,
  isRepeatable: false,
  coopAllowed: false,
  storyOrder: 2,
};

const STORY_4: Mission = {
  id: "story-4-the-architect",
  name: "The Architect",
  type: MissionType.UnchartedSector,
  difficulty: MissionDifficulty.Hard,
  description:
    "The data core points at a facility nobody built. Someone — or something — is still inside. Find them.",
  objectives: [
    { id: "reach-facility",  description: "Reach the hidden facility.", target: 1 },
    { id: "scan-interior",   description: "Scan the interior chambers.", target: 4 },
    { id: "meet-architect",  description: "Make contact with the Architect.", target: 1 },
  ],
  timeLimit: 0,
  rewardXP: 650,
  rewardCredits: 1000,
  rewardItem: "story-chapter-4-lore",
  isDaily: false,
  isStory: true,
  isRepeatable: false,
  coopAllowed: false,
  storyOrder: 3,
};

const STORY_5: Mission = {
  id: "story-5-chroniclers-pact",
  name: "The Chronicler's Pact",
  type: MissionType.BeaconPlacement,
  difficulty: MissionDifficulty.Extreme,
  description:
    "The Architect's last request: place a beacon at the edge of the known void, so the story can never be erased.",
  objectives: [
    { id: "reach-edge",     description: "Reach the edge of the known void.", target: 1 },
    { id: "place-chronicle-beacon", description: "Deploy the chronicle beacon.", target: 1 },
    { id: "survive-backlash", description: "Survive the signal's backlash.", target: 1 },
  ],
  timeLimit: 0,
  rewardXP: 1000,
  rewardCredits: 2000,
  /** Epic cosmetic awarded on completion (master plan Part 10 reward table). */
  rewardItem: "chronicler-epic-cosmetic",
  isDaily: false,
  isStory: true,
  isRepeatable: false,
  coopAllowed: false,
  storyOrder: 4,
};

export const STORY_MISSIONS: readonly Mission[] = [
  STORY_1,
  STORY_2,
  STORY_3,
  STORY_4,
  STORY_5,
];

// ── aggregate catalogue ─────────────────────────────────────────────────────

/** Every mission, indexed for fast lookup. */
export const MISSIONS: readonly Mission[] = [
  ...TIMED_MISSIONS,
  ...EXPLORATION_MISSIONS,
  DAILY_CHALLENGE_TEMPLATE,
  ...STORY_MISSIONS,
];

export const MISSIONS_BY_ID: Readonly<Record<string, Mission>> = Object.freeze(
  Object.fromEntries(MISSIONS.map((m) => [m.id, m])),
);
