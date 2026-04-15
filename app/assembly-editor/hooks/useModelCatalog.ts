'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useEditorStore } from './useEditorStore'
import { deriveCategory, type ModelEntry } from '../lib/editorTypes'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!

export function useModelCatalog() {
  const setCatalog = useEditorStore(s => s.setCatalog)
  const setLoading = useEditorStore(s => s.setCatalogLoading)
  const setError = useEditorStore(s => s.setCatalogError)
  const catalog = useEditorStore(s => s.modelCatalog)
  const loading = useEditorStore(s => s.catalogLoading)
  const error = useEditorStore(s => s.catalogError)

  useEffect(() => {
    let cancelled = false
    async function fetchModels() {
      setLoading(true)
      setError(null)
      try {
        const { data, error: err } = await supabase.storage
          .from('models')
          .list('', { limit: 500, sortBy: { column: 'name', order: 'asc' } })
        if (err) throw err
        if (!data) {
          if (!cancelled) setCatalog([])
          return
        }
        const entries: ModelEntry[] = data
          .filter(f => f.name.toLowerCase().endsWith('.glb'))
          .map(f => ({
            name: f.name.replace(/\.glb$/i, ''),
            url: `${SUPABASE_URL}/storage/v1/object/public/models/${f.name}`,
            category: deriveCategory(f.name),
            size: (f.metadata as { size?: number } | null)?.size || 0,
          }))
        if (!cancelled) setCatalog(entries)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load catalog')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    if (catalog.length === 0) fetchModels()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { catalog, loading, error }
}
