'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { creditGhai } from '@/lib/credits/credit'
import {
  FIRST_DAY_FINAL_REWARD,
  FIRST_DAY_REAL_SKY_CHAIN_ID,
  FIRST_DAY_STEPS,
  isChainComplete,
  nextStep,
  triggerMatches,
  type QuestStep,
  type QuestStepTriggerType,
} from './firstDayRealSky'

const SKIP_FLAG_KEY = 'voidexa:first_day_skipped'

export interface QuestChainState {
  step: QuestStep | null
  completedIds: Set<string>
  skipped: boolean
  loading: boolean
}

/**
 * Active quest chain hook. Reads `user_quest_progress` for completed steps,
 * exposes the current step, and handles:
 *   - trigger-based step advancement (called from completion screens)
 *   - final reward grant (600 GHAI + "Licensed Breather" title) on chain completion
 *   - skip flag via localStorage
 */
export function useActiveQuestChain(onChainComplete?: (title: string) => void) {
  const [state, setState] = useState<QuestChainState>({
    step: null,
    completedIds: new Set(),
    skipped: false,
    loading: true,
  })
  const [userId, setUserId] = useState<string | null>(null)
  const finalizingRef = useRef(false)

  useEffect(() => {
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      const uid = data.user?.id ?? null
      setUserId(uid)

      const skipped = typeof window !== 'undefined' && window.localStorage.getItem(SKIP_FLAG_KEY) === '1'

      let completedIds = new Set<string>()
      if (uid) {
        const { data: rows } = await supabase
          .from('user_quest_progress')
          .select('quest_id, status')
          .eq('user_id', uid)
          .in('quest_id', FIRST_DAY_STEPS.map(s => s.id))
          .eq('status', 'completed')
        completedIds = new Set((rows ?? []).map(r => r.quest_id as string))
      }

      setState({
        step: skipped ? null : nextStep(completedIds),
        completedIds,
        skipped,
        loading: false,
      })
    })()
  }, [])

  /**
   * Record a gameplay event that MAY advance the chain. Idempotent — re-firing
   * with the same trigger after the step is already completed is a no-op.
   */
  const recordEvent = useCallback(async (event: { type: QuestStepTriggerType; target: string }) => {
    if (state.skipped || !state.step || !userId) return
    const current = state.step
    if (!triggerMatches(current, event)) return
    if (state.completedIds.has(current.id)) return

    // Mark this step complete.
    const nextCompleted = new Set(state.completedIds)
    nextCompleted.add(current.id)
    const next = nextStep(nextCompleted)

    setState(prev => ({ ...prev, step: next, completedIds: nextCompleted }))

    await supabase.from('user_quest_progress').upsert({
      user_id: userId,
      quest_id: current.id,
      status: 'completed',
      completed_at: new Date().toISOString(),
    }, { onConflict: 'user_id,quest_id' })

    // Grant the step GHAI bonus.
    if (current.rewardGhai > 0) {
      await creditGhai(userId, current.rewardGhai, {
        source: 'mission',
        sourceId: `quest_${current.id}`,
      })
    }

    // If chain just completed, fire final reward once.
    if (isChainComplete(nextCompleted) && !finalizingRef.current) {
      finalizingRef.current = true
      await creditGhai(userId, FIRST_DAY_FINAL_REWARD.ghai, {
        source: 'mission',
        sourceId: `quest_${FIRST_DAY_REAL_SKY_CHAIN_ID}_final`,
      })
      await supabase.from('pilot_reputation').upsert({
        user_id: userId,
        composed_title: FIRST_DAY_FINAL_REWARD.title,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      onChainComplete?.(FIRST_DAY_FINAL_REWARD.title)
    }
  }, [state.step, state.completedIds, state.skipped, userId, onChainComplete])

  const skip = useCallback(() => {
    if (typeof window !== 'undefined') window.localStorage.setItem(SKIP_FLAG_KEY, '1')
    setState(prev => ({ ...prev, step: null, skipped: true }))
  }, [])

  return { ...state, recordEvent, skip }
}
