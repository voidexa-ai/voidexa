/**
 * Sprint 5 — Task 3: gated gameplay tracer.
 *
 * Noops unless NEXT_PUBLIC_DEBUG_GAMEPLAY === 'true' at module init.
 * Zero prod cost — the branch short-circuits before any console work.
 */

const FLAG = (process.env.NEXT_PUBLIC_DEBUG_GAMEPLAY ?? '').trim() === 'true'

export type GameplayArea =
  | 'SPEEDRUN'
  | 'HAULING'
  | 'MISSION'
  | 'BATTLE'
  | 'PACK'
  | 'WRECK'
  | 'WARP'
  | 'TUTORIAL'

export function gplog(area: GameplayArea, ...args: unknown[]): void {
  if (!FLAG) return

  console.log(`[${area}]`, ...args)
}

export function gplogEnabled(): boolean {
  return FLAG
}
