'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { creditGhai } from '@/lib/credits/credit'
import {
  CHAINS,
  getActiveSteps,
  computeChainCompletion,
  triggerMatches,
  type QuestStep,
  type QuestStepTriggerType,
} from './chains'

const SKIP_FLAG_KEY = 'voidexa:first_day_skipped'
const ALL_STEP_IDS: string[] = CHAINS.flatMap(c => c.steps.map(s => s.id))

export interface QuestChainState {
  activeSteps: readonly QuestStep[]
  completedStepIds: Set<string>
  completedChainIds: Set<string>
  skipped: boolean
  loading: boolean
}

/**
 * Generalised multi-chain hook.
 *   - Loads every known chain's completion state once on mount
 *   - Exposes `activeSteps` — one next step per chain whose prerequisites
 *     have been satisfied
 *   - Advances the matching active step on each `recordEvent`
 *   - Fires `onChainComplete` + grants the chain's final reward when all
 *     steps complete
 *
 * Backward compat: Sprint 3 callers reading `.step` / `.completedIds`
 * still work — `.step` returns the earliest active step across all chains.
 */
export function useActiveQuestChain(
  onChainComplete?: (title: string, chainId: string) => void,
) {
  const [state, setState] = useState<QuestChainState>({
    activeSteps: [],
    completedStepIds: new Set(),
    completedChainIds: new Set(),
    skipped: false,
    loading: true,
  })
  const [userId, setUserId] = useState<string | null>(null)
  const finalizingRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      const uid = data.user?.id ?? null
      setUserId(uid)
      const skipped = typeof window !== 'undefined' && window.localStorage.getItem(SKIP_FLAG_KEY) === '1'

      let completedStepIds = new Set<string>()
      if (uid) {
        const { data: rows } = await supabase
          .from('user_quest_progress')
          .select('quest_id, status')
          .eq('user_id', uid)
          .in('quest_id', ALL_STEP_IDS)
          .eq('status', 'completed')
        completedStepIds = new Set((rows ?? []).map(r => r.quest_id as string))
      }

      const completedChainIds = computeChainCompletion(completedStepIds)
      const activeSteps = skipped ? [] : getActiveSteps(completedStepIds)
      setState({ activeSteps, completedStepIds, completedChainIds, skipped, loading: false })
    })()
  }, [])

  const recordEvent = useCallback(async (event: { type: QuestStepTriggerType; target: string }) => {
    if (state.skipped || state.activeSteps.length === 0 || !userId) return
    const matched = state.activeSteps.find(s => triggerMatches(s, event))
    if (!matched || state.completedStepIds.has(matched.id)) return

    const nextCompletedSteps = new Set(state.completedStepIds)
    nextCompletedSteps.add(matched.id)
    const nextCompletedChains = computeChainCompletion(nextCompletedSteps)
    const nextActive = getActiveSteps(nextCompletedSteps)

    setState(prev => ({
      ...prev,
      completedStepIds: nextCompletedSteps,
      completedChainIds: nextCompletedChains,
      activeSteps: nextActive,
    }))

    await supabase.from('user_quest_progress').upsert({
      user_id: userId,
      quest_id: matched.id,
      status: 'completed',
      completed_at: new Date().toISOString(),
    }, { onConflict: 'user_id,quest_id' })

    if (matched.rewardGhai > 0) {
      await creditGhai(userId, matched.rewardGhai, {
        source: 'mission',
        sourceId: `quest_${matched.id}`,
      })
    }

    const freshlyComplete = [...nextCompletedChains].filter(id => !state.completedChainIds.has(id))
    for (const chainId of freshlyComplete) {
      if (finalizingRef.current.has(chainId)) continue
      finalizingRef.current.add(chainId)
      const chain = CHAINS.find(c => c.id === chainId)
      if (!chain) continue
      await creditGhai(userId, chain.finalReward.ghai, {
        source: 'mission',
        sourceId: `quest_${chainId}_final`,
      })
      await supabase.from('pilot_reputation').upsert({
        user_id: userId,
        composed_title: chain.finalReward.title,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      onChainComplete?.(chain.finalReward.title, chain.id)
    }
  }, [state.skipped, state.activeSteps, state.completedStepIds, state.completedChainIds, userId, onChainComplete])

  const skip = useCallback(() => {
    if (typeof window !== 'undefined') window.localStorage.setItem(SKIP_FLAG_KEY, '1')
    setState(prev => ({ ...prev, activeSteps: [], skipped: true }))
  }, [])

  // Back-compat shim for Sprint 3 single-chain callers.
  const firstActive = state.activeSteps[0] ?? null
  return {
    activeSteps: state.activeSteps,
    completedStepIds: state.completedStepIds,
    completedChainIds: state.completedChainIds,
    step: firstActive,
    completedIds: state.completedStepIds,
    skipped: state.skipped,
    loading: state.loading,
    recordEvent,
    skip,
  }
}

export { CHAINS } from './chains'
