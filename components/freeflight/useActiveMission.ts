'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import { creditGhai } from '@/lib/credits/credit'
import { getMissionById, type MissionTemplate } from '@/lib/game/missions/board'
import { generateMissionWaypoints, type MissionWaypoint } from '@/lib/game/missions/waypoints'
import { rollLootCard } from '@/lib/game/loot/table'
import type { CardTemplate, GameCardRarity } from '@/lib/game/cards/index'
import { useActiveQuestChain } from '@/lib/game/quests/progress'
import { emitDebut, isFirstEventForPilot } from '@/lib/game/universeWall/emit'

export interface ActiveMissionState {
  mission: MissionTemplate
  acceptanceId: string
  waypoints: MissionWaypoint[]
  currentIndex: number
}

/**
 * Loads the user's most recent `accepted` / `in_progress` mission from
 * Supabase, synthesises waypoints for it, tracks clearance progress, and
 * finalises the contract + credits GHAI on the last waypoint.
 */
export function useActiveMission(
  onPayout: (ghai: number, missionName: string) => void,
  onCardDrop?: (card: CardTemplate, rarity: GameCardRarity) => void,
) {
  const { user, loading: authLoading } = useAuth()
  const userId = user?.id ?? null
  const [active, setActive] = useState<ActiveMissionState | null>(null)
  const finalizingRef = useRef(false)
  const questChain = useActiveQuestChain()

  // Sprint 14A: user comes from AuthProvider context (single shared source).
  useEffect(() => {
    if (authLoading || !userId) return
    let cancelled = false
    ;(async () => {
      const { data: rows } = await supabase
        .from('mission_acceptances')
        .select('id, mission_id, status, accepted_at')
        .eq('user_id', userId)
        .in('status', ['accepted', 'in_progress'])
        .order('accepted_at', { ascending: false })
        .limit(1)
      if (cancelled) return
      const row = rows?.[0]
      if (!row) return
      const tpl = getMissionById(row.mission_id as string)
      if (!tpl) return
      setActive({
        mission: tpl,
        acceptanceId: row.id as string,
        waypoints: generateMissionWaypoints(tpl.id),
        currentIndex: 0,
      })
    })()
    return () => { cancelled = true }
  }, [userId, authLoading])

  const handleWaypointCleared = useCallback(async (_index: number) => {
    setActive(prev => {
      if (!prev) return prev
      const nextIdx = prev.currentIndex + 1
      // If mission complete, trigger finalize in a follow-up effect.
      return { ...prev, currentIndex: nextIdx }
    })
  }, [])

  // Finalise on completion — whenever currentIndex reaches waypoints.length,
  // credit GHAI and mark the contract complete.
  useEffect(() => {
    if (!active || !userId) return
    if (active.currentIndex < active.waypoints.length) return
    if (finalizingRef.current) return
    finalizingRef.current = true

    ;(async () => {
      const mission = active.mission
      const reward = Math.round((mission.rewardMin + mission.rewardMax) / 2)
      const { error: updErr } = await supabase
        .from('mission_acceptances')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          outcome_grade: 'gold',
          reward_ghai: reward,
        })
        .eq('id', active.acceptanceId)
      if (updErr) {
        console.error('[useActiveMission] update failed:', updErr.message)
        finalizingRef.current = false
        return
      }
      const credit = await creditGhai(userId, reward, {
        source: 'mission',
        sourceId: active.acceptanceId,
      })
      if (credit.ok) {
        onPayout(reward, mission.name)
      }
      // Sprint 3 Task 1: advance First Day Real Sky if this mission is a trigger.
      void questChain.recordEvent({ type: 'mission_complete', target: mission.id })
      // Sprint 4 Task 1: Universe Wall debut if this is the pilot's first event.
      if (userId) {
        const first = await isFirstEventForPilot(userId)
        if (first) {
          const { data: prof } = await supabase
            .from('pilot_reputation')
            .select('pilot_name')
            .eq('user_id', userId)
            .maybeSingle()
          void emitDebut({ userId, actorName: prof?.pilot_name ?? null })
        }
      }
      // Sprint 3 Task 3: card drop on mission completion.
      const rolled = rollLootCard({ source: 'mission', tier: 'gold', seedKey: active.acceptanceId })
      if (rolled) {
        await supabase.from('user_cards').upsert(
          { user_id: userId, template_id: rolled.card.id, quantity: 1, acquired_from: 'mission' },
          { onConflict: 'user_id,template_id' },
        )
        onCardDrop?.(rolled.card, rolled.rarity)
      }
      setActive(null)
      finalizingRef.current = false
    })()
  }, [active, userId, onPayout])

  return {
    mission: active?.mission ?? null,
    waypoints: active?.waypoints ?? [],
    currentIndex: active?.currentIndex ?? 0,
    total: active?.waypoints.length ?? 0,
    handleWaypointCleared,
  }
}
