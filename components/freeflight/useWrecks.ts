'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import { spendGhai } from '@/lib/credits/deduct'
import type { ShipTier, WreckRow } from '@/lib/game/wrecks/types'
import { basePrice, repairCost, timerWindow } from '@/lib/game/wrecks/economics'

// Sprint 14A: polling bumped 30s → 60s to lower data-refresh pressure.
// Balance is no longer refreshed on every poll — it's fetched once per user
// change and after mutations only (event-driven, not interval-driven).
const POLL_INTERVAL_MS = 60_000

export interface UseWrecksState {
  wrecks: WreckRow[]
  myActiveWreck: WreckRow | null
  balance: number | null
}

/**
 * Client hook: polls active wrecks, exposes helpers for the 4 recovery paths
 * and for claiming someone else's abandoned wreck.
 */
export function useWrecks(shipTier: ShipTier = 'common') {
  const { user, loading: authLoading } = useAuth()
  const userId = user?.id ?? null
  const [state, setState] = useState<UseWrecksState>({ wrecks: [], myActiveWreck: null, balance: null })

  const fetchBalance = useCallback(async (uid: string): Promise<number> => {
    const { data: wallet } = await supabase
      .from('user_credits')
      .select('ghai_balance_platform')
      .eq('user_id', uid)
      .maybeSingle()
    return wallet?.ghai_balance_platform ?? 0
  }, [])

  const load = useCallback(async () => {
    const { data: rows } = await supabase
      .from('wrecks')
      .select('*')
      .in('phase', ['protected', 'abandoned'])
      .order('spawned_at', { ascending: false })
      .limit(50)
    const wrecks = ((rows ?? []) as unknown) as WreckRow[]
    const myActiveWreck = userId ? wrecks.find(w => w.owner_user_id === userId) ?? null : null
    setState(prev => ({ ...prev, wrecks, myActiveWreck }))
  }, [userId])

  const loadWithBalance = useCallback(async () => {
    await load()
    if (userId) {
      const balance = await fetchBalance(userId)
      setState(prev => ({ ...prev, balance }))
    }
  }, [load, fetchBalance, userId])

  useEffect(() => {
    if (authLoading) return
    void load()
    if (userId) {
      void fetchBalance(userId).then(balance =>
        setState(prev => ({ ...prev, balance })),
      )
    }
    const id = window.setInterval(load, POLL_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [load, fetchBalance, userId, authLoading])

  /** Spawn a wreck after the owner's ship goes down. */
  const spawnWreck = useCallback(async (
    opts: { shipId: string; position: { x: number; y: number; z: number }; zone: string | null },
  ): Promise<WreckRow | null> => {
    if (!userId) return null
    const res = await fetch('/api/wrecks/spawn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...opts, shipTier }),
    })
    if (!res.ok) return null
    const body = await res.json()
    await load()
    return body.wreck as WreckRow
  }, [userId, shipTier, load])

  const selfRepair = useCallback(async (wreck: WreckRow): Promise<boolean> => {
    if (!userId) return false
    const cost = repairCost((wreck.ship_tier as ShipTier) ?? 'common')
    const spend = await spendGhai(userId, cost, { source: 'repair', sourceId: wreck.id })
    if (!spend.ok) return false
    await supabase.from('wrecks')
      .update({ phase: 'repaired', resolution: 'self_repair' })
      .eq('id', wreck.id)
    await loadWithBalance()
    return true
  }, [userId, loadWithBalance])

  const abandonWreck = useCallback(async (wreck: WreckRow): Promise<void> => {
    await supabase.from('wrecks')
      .update({ resolution: 'abandoned' })
      .eq('id', wreck.id)
    await load()
  }, [load])

  const buyNewShip = useCallback(async (wreck: WreckRow): Promise<boolean> => {
    if (!userId) return false
    const cost = basePrice((wreck.ship_tier as ShipTier) ?? 'common')
    const spend = await spendGhai(userId, cost, { source: 'module_purchase', sourceId: `newship_${wreck.id}` })
    if (!spend.ok) return false
    await supabase.from('wrecks')
      .update({ phase: 'scrapped', resolution: 'scrapped' })
      .eq('id', wreck.id)
    await loadWithBalance()
    return true
  }, [userId, loadWithBalance])

  const claimWreck = useCallback(async (wreck: WreckRow): Promise<boolean> => {
    const res = await fetch('/api/wrecks/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wreckId: wreck.id }),
    })
    if (!res.ok) return false
    await load()
    return true
  }, [load])

  return {
    ...state,
    userId,
    refresh: loadWithBalance,
    spawnWreck,
    selfRepair,
    abandonWreck,
    buyNewShip,
    claimWreck,
    timerWindowFor: timerWindow,
  }
}
