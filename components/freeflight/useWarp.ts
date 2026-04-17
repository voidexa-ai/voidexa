'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { spendGhai } from '@/lib/credits/deduct'
import type { WarpNode } from '@/lib/game/warp/network'

const COOLDOWN_MS = 30_000

export interface WarpState {
  mapOpen: boolean
  warping: { destination: WarpNode; cost: number } | null
  cooldownUntil: number
  balance: number | null
  error: string | null
}

/**
 * Client hook for warp flow:
 *   - open/close holographic map
 *   - deduct GHAI via spendGhai (idempotent per warp uuid)
 *   - manage 30s cooldown
 *   - expose destination on complete → caller teleports the ship
 */
export function useWarp() {
  const [state, setState] = useState<WarpState>({
    mapOpen: false,
    warping: null,
    cooldownUntil: 0,
    balance: null,
    error: null,
  })
  const userIdRef = useRef<string | null>(null)

  const refreshBalance = useCallback(async () => {
    const { data } = await supabase.auth.getUser()
    const uid = data.user?.id ?? null
    userIdRef.current = uid
    if (!uid) return
    const { data: wallet } = await supabase
      .from('user_credits')
      .select('ghai_balance_platform')
      .eq('user_id', uid)
      .maybeSingle()
    setState(prev => ({ ...prev, balance: wallet?.ghai_balance_platform ?? 0 }))
  }, [])

  useEffect(() => { void refreshBalance() }, [refreshBalance])

  const openMap = useCallback(() => {
    if (Date.now() < state.cooldownUntil) {
      const secs = Math.ceil((state.cooldownUntil - Date.now()) / 1000)
      setState(prev => ({ ...prev, error: `Warp cooldown · ${secs}s remaining` }))
      window.setTimeout(() => setState(p => ({ ...p, error: null })), 2500)
      return
    }
    setState(prev => ({ ...prev, mapOpen: true, error: null }))
  }, [state.cooldownUntil])

  const closeMap = useCallback(() => {
    setState(prev => ({ ...prev, mapOpen: false }))
  }, [])

  const beginWarp = useCallback(async (destination: WarpNode, cost: number): Promise<boolean> => {
    const uid = userIdRef.current
    if (!uid) {
      setState(prev => ({ ...prev, error: 'Sign in to warp' }))
      return false
    }
    const sourceId = crypto.randomUUID()
    const result = await spendGhai(uid, cost, { source: 'warp', sourceId })
    if (!result.ok) {
      setState(prev => ({ ...prev, error: result.error ?? 'warp failed' }))
      return false
    }
    setState(prev => ({
      ...prev,
      mapOpen: false,
      warping: { destination, cost },
      balance: result.newBalance ?? prev.balance,
    }))
    return true
  }, [])

  const finishWarp = useCallback(() => {
    setState(prev => ({
      ...prev,
      warping: null,
      cooldownUntil: Date.now() + COOLDOWN_MS,
    }))
  }, [])

  return { state, openMap, closeMap, beginWarp, finishWarp, refreshBalance }
}
