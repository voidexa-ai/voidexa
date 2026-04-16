import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface SaveBody {
  generationId?: string
  variantIndex?: number
  name?: string
}

export async function POST(req: NextRequest) {
  let body: SaveBody
  try {
    body = (await req.json()) as SaveBody
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 })
  }

  const generationId = body.generationId
  const variantIndex = typeof body.variantIndex === 'number' ? body.variantIndex : 0
  const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : 'Untitled VoidForge Cockpit'
  if (!generationId) {
    return NextResponse.json({ error: 'generationId required' }, { status: 400 })
  }

  const { data: variant, error: vErr } = await supabaseAdmin
    .from('generation_variants')
    .select('assembly_json')
    .eq('generation_id', generationId)
    .eq('variant_index', variantIndex)
    .maybeSingle()
  if (vErr) return NextResponse.json({ error: vErr.message }, { status: 500 })
  if (!variant) return NextResponse.json({ error: 'variant not found' }, { status: 404 })

  const { data: gen } = await supabaseAdmin
    .from('generations')
    .select('template_id, user_id')
    .eq('id', generationId)
    .maybeSingle()

  const { data: assembly, error: aErr } = await supabaseAdmin
    .from('assemblies')
    .insert({
      user_id: gen?.user_id ?? null,
      name,
      source: 'voidforge',
      template_id: gen?.template_id ?? null,
      generation_id: generationId,
      assembly_json: variant.assembly_json,
    })
    .select('id, slug, name, created_at')
    .single()
  if (aErr) return NextResponse.json({ error: aErr.message }, { status: 500 })

  return NextResponse.json({ assembly })
}
