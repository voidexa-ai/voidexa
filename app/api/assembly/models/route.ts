import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { deriveCategory } from '@/app/assembly-editor/lib/editorTypes'

export const dynamic = 'force-dynamic'

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim()

export async function GET() {
  try {
    // Pull the Storage listing and the canonical active-model list in parallel.
    // Storage is the source of binaries; the DB carries is_active flags used
    // to hide multi-part originals once they've been split into individual
    // pieces (see scripts/split-glb-models.ts).
    const [listRes, activeRes] = await Promise.all([
      supabaseAdmin.storage
        .from('models')
        .list('', { limit: 1000, sortBy: { column: 'name', order: 'asc' } }),
      supabaseAdmin.from('models').select('slug, is_active, display_name'),
    ])

    if (listRes.error) {
      return NextResponse.json({ error: listRes.error.message }, { status: 500 })
    }

    const activeBySlug = new Map<string, { is_active: boolean; display_name: string | null }>()
    for (const row of activeRes.data ?? []) {
      activeBySlug.set(row.slug, { is_active: row.is_active, display_name: row.display_name })
    }

    const entries = (listRes.data || [])
      .filter(f => f.name.toLowerCase().endsWith('.glb'))
      .map(f => {
        const slug = f.name.replace(/\.glb$/i, '')
        const dbRow = activeBySlug.get(slug)
        const url = `${SUPABASE_URL}/storage/v1/object/public/models/${f.name}`.replace(/\s+/g, '')
        return {
          name: slug,
          displayName: dbRow?.display_name ?? slug,
          url,
          category: deriveCategory(f.name),
          size: (f.metadata as { size?: number } | null)?.size || 0,
          // If the slug isn't in DB yet, keep it visible (default true) — only
          // rows explicitly marked is_active=false get filtered.
          _active: dbRow ? dbRow.is_active : true,
        }
      })
      .filter(e => e._active)
      .map(({ _active: _, ...rest }) => rest)

    return NextResponse.json({ entries })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
