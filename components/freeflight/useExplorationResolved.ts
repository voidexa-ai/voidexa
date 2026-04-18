'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import { creditGhai } from '@/lib/credits/credit'
import type { EncounterChoice, ExplorationEncounter } from '@/lib/game/freeflight/explorationEncounters'

/**
 * Tracks which exploration encounters the player has already resolved (so they
 * don't re-trigger) and handles the resolve flow: writes to Supabase, credits
 * GHAI if the choice awards any.
 */
export function useExplorationResolved(onReward: (amount: number, label: string) => void) {
  const { user, loading: authLoading } = useAuth()
  const userId = user?.id ?? null
  const [resolved, setResolved] = useState<Set<string>>(new Set())
  const inFlight = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (authLoading || !userId) return
    let cancelled = false
    ;(async () => {
      const { data: rows } = await supabase
        .from('exploration_encounters_resolved')
        .select('encounter_id')
        .eq('user_id', userId)
      if (cancelled) return
      if (rows) setResolved(new Set(rows.map(r => r.encounter_id as string)))
    })()
    return () => { cancelled = true }
  }, [userId, authLoading])

  const resolve = useCallback(async (enc: ExplorationEncounter, choice: EncounterChoice) => {
    // Mark as resolved locally immediately so the glyph disappears and
    // re-triggering is prevented even before Supabase round-trips.
    if (inFlight.current.has(enc.id)) return
    inFlight.current.add(enc.id)
    setResolved(prev => {
      const next = new Set(prev)
      next.add(enc.id)
      return next
    })

    if (userId) {
      const reward = choice.outcomeKind === 'ghai' ? (choice.reward ?? 0) : 0
      await supabase.from('exploration_encounters_resolved').insert({
        user_id: userId,
        encounter_id: enc.id,
        outcome: choice.label,
        reward_ghai: reward,
      })
      if (reward > 0) {
        await creditGhai(userId, reward, {
          source: 'mission',
          sourceId: `enc_${enc.id}`,
        })
        onReward(reward, enc.name)
      }
    }
    inFlight.current.delete(enc.id)
  }, [userId, onReward])

  return { resolved, resolve }
}
