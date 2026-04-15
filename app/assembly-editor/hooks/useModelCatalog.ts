'use client'

import { useEffect } from 'react'
import { useEditorStore } from './useEditorStore'
import type { ModelEntry } from '../lib/editorTypes'

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
        const res = await fetch('/api/assembly/models', { cache: 'no-store' })
        if (!res.ok) {
          const j = await res.json().catch(() => ({}))
          throw new Error(j.error || `HTTP ${res.status}`)
        }
        const json = await res.json()
        const entries: ModelEntry[] = Array.isArray(json.entries) ? json.entries : []
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
