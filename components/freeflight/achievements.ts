// Lightweight localStorage tracker for Free Flight — tracks unique station/derelict
// discoveries for deduplication and mirrors progress into the unified
// achievement store (lib/achievements/client-progress) so AchievementPanel reflects it.

import { incrementProgress, getProgress } from '@/lib/achievements/client-progress'

export type AchievementId = 'archaeologist' | 'salvager'

const STORAGE_KEY = 'voidexa_freeflight_achievements_v1'

interface AchievementState {
  archaeologist: { unlockedIds: string[] }
  salvager: { unlockedIds: string[] }
}

function load(): AchievementState {
  if (typeof window === 'undefined') return { archaeologist: { unlockedIds: [] }, salvager: { unlockedIds: [] } }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as AchievementState
  } catch {}
  return { archaeologist: { unlockedIds: [] }, salvager: { unlockedIds: [] } }
}

function save(state: AchievementState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
}

export function recordArchaeologist(stationId: string): { total: number; isNew: boolean } {
  const state = load()
  const isNew = !state.archaeologist.unlockedIds.includes(stationId)
  if (isNew) {
    state.archaeologist.unlockedIds.push(stationId)
    save(state)
    incrementProgress('archaeologist', 1)
  }
  return { total: state.archaeologist.unlockedIds.length, isNew }
}

export function recordSalvager(derelictId: string): { total: number; isNew: boolean } {
  const state = load()
  const isNew = !state.salvager.unlockedIds.includes(derelictId)
  if (isNew) {
    state.salvager.unlockedIds.push(derelictId)
    save(state)
    incrementProgress('salvager', 1)
  }
  return { total: state.salvager.unlockedIds.length, isNew }
}
