/**
 * lib/achievements/titles.ts
 *
 * Title fragment registry. Every achievement maps to exactly one fragment.
 * The full composition (e.g. "Voice of the Consensus, Scourge of the Void,
 * Keeper of Lost Worlds") lives in `tracker.composeTitle()`.
 *
 * Style: Game-of-Thrones-ish short epithets, 2–5 words, consistent tone.
 * Must stay in sync with `definitions.ts` — the test in
 * `__tests__/titles.test.ts` enforces 1:1 mapping.
 */

/**
 * Placeholder used inside fragments that reference runtime data (currently
 * only "Sovereign of [planet name]"). Substitute at render time.
 */
export const TITLE_PLACEHOLDER = {
  PLANET: "[planet name]",
} as const;

/**
 * achievementId → title fragment. Exhaustive for all 23 Core achievements.
 */
export const ACHIEVEMENT_TITLES: Readonly<Record<string, string>> = {
  // ── Product ──
  "first-debate":   "The Curious One",
  "debater":        "Challenger of Minds",
  "quantum-master": "Voice of the Consensus",
  "paper-trader":   "Keeper of the Ledger",
  "trader":         "Merchant of Risk",
  "pioneer":        `Sovereign of ${TITLE_PLACEHOLDER.PLANET}`,
  "investor":       "First of the Backers",
  "communicator":   "Voice Among the Stars",

  // ── Exploration ──
  "explorer":       "Walker of Worlds",
  "archaeologist":  "Keeper of Lost Worlds",
  "voyager":        "The Far-Wanderer",
  "nebula-runner":  "Stormchaser",
  "secret":         "Finder of Hidden Truths",
  "station-hopper": "The Dockmaster",
  "salvager":       "Reader of Ruins",

  // ── PvP ──
  "warrior":        "The Bloodied",
  "veteran":        "Hardened by Battle",
  "champion":       "Scourge of the Void",
  "gold-ace":       "Gilded Wing",
  "legend":         "The Unbroken",
  "racer":          "Runner of the Outer Rim",
  "speed-demon":    "Stormwing",
  "merchant":       "The Fair Trader",
};

/** Returns the title fragment for an achievement id, or null if unknown. */
export function getTitleFragment(achievementId: string): string | null {
  return ACHIEVEMENT_TITLES[achievementId] ?? null;
}

/**
 * Fills runtime placeholders in a fragment. Currently handles `[planet name]`.
 * Returns the fragment unchanged if no substitution is needed.
 */
export function resolveTitleFragment(
  fragment: string,
  context: { planetName?: string } = {},
): string {
  let out = fragment;
  if (context.planetName !== undefined) {
    out = out.split(TITLE_PLACEHOLDER.PLANET).join(context.planetName);
  }
  return out;
}
