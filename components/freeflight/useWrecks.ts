'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { spendGhai } from '@/lib/credits/deduct'
import type { ShipTier, WreckRow } from '@/lib/game/wrecks/types'
import { basePrice, repairCost, timerWindow } from '@/lib/game/wrecks/economics'

const POLL_INTERVAL_MS = 30_000

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
  const [state, setState] = useState<UseWrecksState>({ wrecks: [], myActiveWreck: null, balance: null })
  const [userId, setUserId] = useState<string | null>(null)

  const load = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser()
    const uid = userData.user?.id ?? null
    setUserId(uid)
    const { data: rows } = await supabase
      .from('wrecks')
      .select('*')
      .in('phase', ['protected', 'abandoned'])
      .order('spawned_at', { ascending: false })
      .limit(50)
    const wrecks = ((rows ?? []) as unknown) as WreckRow[]
    const myActiveWreck = uid ? wrecks.find(w => w.owner_user_id === uid) ?? null : null
    let balance: number | null = null
    if (uid) {
      const { data: wallet } = await supabase
        .from('user_credits')
        .select('ghai_balance_platform')
        .eq('user_id', uid)
        .maybeSingle()
      balance = wallet?.ghai_balance_platform ?? 0
    }
    setState({ wrecks, myActiveWreck, balance })
  }, [])

  useEffect(() => {
    void load()
    const id = window.setInterval(load, POLL_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [load])

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
    await load()
    return true
  }, [userId, load])

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
    await load()
    return true
  }, [userId, load])

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
    refresh: load,
    spawnWreck,
    selfRepair,
    abandonWreck,
    buyNewShip,
    claimWreck,
    timerWindowFor: timerWindow,
  }
}
