'use client'

/**
 * Client-side progress store for the achievement system.
 * Persists per-achievement counts + completedAt in localStorage.
 *
 * Server/Supabase sync will layer on top in a later phase — the shape matches
 * the `AchievementProgress` type so migration is a direct map.
 */

import { ACHIEVEMENTS_BY_ID } from './definitions'
import type { AchievementProgress } from './types'

const KEY = 'voidexa_achievement_progress_v1'

interface StoreShape {
  [achievementId: string]: AchievementProgress
}

function load(): StoreShape {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as StoreShape
  } catch {}
  return {}
}

function save(store: StoreShape) {
  try { localStorage.setItem(KEY, JSON.stringify(store)) } catch {}
}

export function getProgress(achievementId: string): AchievementProgress {
  const store = load()
  return store[achievementId] ?? {
    achievementId,
    currentCount: 0,
    completed: false,
  }
}

export function getAllProgress(): StoreShape {
  return load()
}

/**
 * Advance progress to at least `count`. Returns the normalised record + whether
 * this call newly completed the achievement.
 */
export function setProgressAtLeast(
  achievementId: string,
  count: number,
): { progress: AchievementProgress; newlyCompleted: boolean } {
  const def = ACHIEVEMENTS_BY_ID[achievementId]
  if (!def) throw new Error(`Unknown achievement ${achievementId}`)
  const store = load()
  const prev = store[achievementId] ?? { achievementId, currentCount: 0, completed: false }
  if (count <= prev.currentCount && prev.currentCount < def.requiredCount) {
    return { progress: prev, newlyCompleted: false }
  }
  const nextCount = Math.min(def.requiredCount, Math.max(prev.currentCount, count))
  const wasCompleted = prev.completed
  const completed = nextCount >= def.requiredCount
  const record: AchievementProgress = {
    achievementId,
    currentCount: nextCount,
    completed,
    completedAt: completed ? (prev.completedAt ?? Date.now()) : undefined,
  }
  store[achievementId] = record
  save(store)
  return { progress: record, newlyCompleted: !wasCompleted && completed }
}

export function incrementProgress(
  achievementId: string,
  by = 1,
): { progress: AchievementProgress; newlyCompleted: boolean } {
  const prev = getProgress(achievementId)
  return setProgressAtLeast(achievementId, prev.currentCount + by)
}

const SELECTED_TITLES_KEY = 'voidexa_selected_titles_v1'

export function getSelectedTitleFragments(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(SELECTED_TITLES_KEY)
    if (raw) return JSON.parse(raw) as string[]
  } catch {}
  return []
}

export function saveSelectedTitleFragments(ids: string[]) {
  try { localStorage.setItem(SELECTED_TITLES_KEY, JSON.stringify(ids)) } catch {}
}
