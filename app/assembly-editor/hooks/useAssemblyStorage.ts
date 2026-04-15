'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { AssemblyConfig } from '../lib/editorTypes'

export interface StoredAssembly {
  id: string
  name: string
  config_json: AssemblyConfig
  created_at: string
  updated_at: string
}

export function useAssemblyStorage() {
  const [assemblies, setAssemblies] = useState<StoredAssembly[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id || null)
    })
    return () => { sub.subscription.unsubscribe() }
  }, [])

  const refresh = useCallback(async () => {
    if (!userId) { setAssemblies([]); return }
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('assembly_configs')
        .select('id, name, config_json, created_at, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
      if (err) throw err
      setAssemblies(data as StoredAssembly[])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Load failed')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { refresh() }, [refresh])

  const save = useCallback(async (name: string, config: AssemblyConfig) => {
    if (!userId) throw new Error('Sign in to save assemblies')
    const { error: err } = await supabase
      .from('assembly_configs')
      .insert({ user_id: userId, name, config_json: config })
    if (err) throw err
    await refresh()
  }, [userId, refresh])

  const remove = useCallback(async (id: string) => {
    const { error: err } = await supabase.from('assembly_configs').delete().eq('id', id)
    if (err) throw err
    await refresh()
  }, [refresh])

  return { assemblies, loading, error, save, remove, refresh, userId }
}
