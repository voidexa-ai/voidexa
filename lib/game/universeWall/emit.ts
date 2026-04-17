'use client'

// Client-side wall-event emit helpers. Inserts into `public.universe_wall`.
// If the caller omits an actor_name we fall back to a short pilot id so the
// wall line is never empty-author'd.

import { supabase } from '@/lib/supabase'

export interface EmitBase {
  userId: string
  actorName?: string | null
}

function resolveActor(base: EmitBase): string {
  if (base.actorName && base.actorName.trim().length > 0) return base.actorName.trim()
  return `Pilot ${base.userId.slice(0, 6)}`
}

export async function emitBossDefeat(
  base: EmitBase & { bossId: string; tier?: number; sessionId?: string },
): Promise<void> {
  await supabase.from('universe_wall').insert({
    event_type: 'boss_defeat',
    actor_user_id: base.userId,
    actor_name: resolveActor(base),
    payload: { boss: base.bossId, tier: base.tier ?? null, session_id: base.sessionId ?? null },
  })
}

export async function emitSpeedRecord(
  base: EmitBase & { trackId: string; durationMs: number; runId?: string },
): Promise<void> {
  await supabase.from('universe_wall').insert({
    event_type: 'speed_record',
    actor_user_id: base.userId,
    actor_name: resolveActor(base),
    payload: { track: base.trackId, duration_ms: base.durationMs, run_id: base.runId ?? null },
  })
}

export async function emitDebut(base: EmitBase): Promise<void> {
  await supabase.from('universe_wall').insert({
    event_type: 'debut',
    actor_user_id: base.userId,
    actor_name: resolveActor(base),
    payload: {},
  })
}

/**
 * Helper for the "first time" check — returns true if the pilot has zero
 * prior universe_wall rows. The caller then emits debut once.
 */
export async function isFirstEventForPilot(userId: string): Promise<boolean> {
  const { count } = await supabase
    .from('universe_wall')
    .select('id', { count: 'exact', head: true })
    .eq('actor_user_id', userId)
    .limit(1)
  return (count ?? 0) === 0
}
