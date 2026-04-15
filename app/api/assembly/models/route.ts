import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { deriveCategory } from '@/app/assembly-editor/lib/editorTypes'

export const dynamic = 'force-dynamic'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from('models')
      .list('', { limit: 500, sortBy: { column: 'name', order: 'asc' } })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const entries = (data || [])
      .filter(f => f.name.toLowerCase().endsWith('.glb'))
      .map(f => ({
        name: f.name.replace(/\.glb$/i, ''),
        url: `${SUPABASE_URL}/storage/v1/object/public/models/${f.name}`,
        category: deriveCategory(f.name),
        size: (f.metadata as { size?: number } | null)?.size || 0,
      }))

    return NextResponse.json({ entries })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
