/**
 * Sprint 2 — Task 4: 90-mission catalog loader.
 * Source: docs/VOIDEXA_UNIVERSE_CONTENT.md SECTION 2 (90 rows).
 *
 * The catalog lives as JSON (data, not code) and is imported + type-coerced
 * here. Shape matches `MissionTemplate` from ./board.
 *
 * Categories in the library: 20 Courier + 20 Rush + 20 Hunt + 20 Recovery + 10 Signal.
 */

import catalogJson from './catalog.json'
import type { MissionTemplate } from './board'

// JSON is hand-authored to match the MissionTemplate shape; we cast at the
// boundary. Runtime validation happens in catalog.test.ts.
export const MISSION_CATALOG: readonly MissionTemplate[] = Object.freeze(
  catalogJson as MissionTemplate[],
)

export function getCatalogedMission(id: string): MissionTemplate | undefined {
  return MISSION_CATALOG.find(m => m.id === id)
}
