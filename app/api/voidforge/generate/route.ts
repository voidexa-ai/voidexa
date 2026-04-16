import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { generate } from '@/lib/voidforge/generate'
import type { GenerateRequest } from '@/lib/voidforge/generate'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface GenerateBody {
  promptText?: string
  styleWeights?: GenerateRequest['style']
  templateHint?: string
  complexity?: 'low' | 'medium' | 'high'
  variantCount?: number
}

export async function POST(req: NextRequest) {
  let body: GenerateBody
  try {
    body = (await req.json()) as GenerateBody
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 })
  }

  const promptText = typeof body.promptText === 'string' ? body.promptText.trim() : ''
  if (!promptText) {
    return NextResponse.json({ error: 'promptText is required' }, { status: 400 })
  }

  const generationId = randomUUID()

  // Persist pending generation. user_id is optional — VoidForge Alpha runs without
  // auth for now; tie it to null and rely on RLS allow-user/service-role.
  const { error: insErr } = await supabaseAdmin.from('generations').insert({
    id: generationId,
    prompt_text: promptText,
    prompt_style: body.styleWeights ?? {},
    status: 'planning',
  })
  if (insErr) {
    return NextResponse.json({ error: `persist failed: ${insErr.message}` }, { status: 500 })
  }

  try {
    const result = await generate({
      promptText,
      style: body.styleWeights,
      templateSlug: body.templateHint,
      complexity: body.complexity,
      variantCount: Math.max(1, Math.min(5, body.variantCount ?? 3)),
    })

    // Update the parent generation row with normalized template + status.
    const { data: templateRow } = await supabaseAdmin
      .from('templates')
      .select('id')
      .eq('slug', result.template.slug)
      .maybeSingle()

    await supabaseAdmin
      .from('generations')
      .update({
        template_id: templateRow?.id ?? null,
        model_pool: result.pool.candidatesByRole,
        status: result.status,
        error_message: result.errorMessage ?? null,
        draft_assembly: result.variants[0]?.draftAssembly ?? null,
        validated_assembly: result.variants[0]?.finalAssembly ?? null,
        validation_report: result.variants[0]?.finalReport ?? null,
        repair_report: result.variants[0]?.repairReport ?? null,
        planner_response: result.variants[0]?.plan ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', generationId)

    // Insert one row per variant.
    if (result.variants.length > 0) {
      const variantRows = result.variants.map((v, i) => ({
        generation_id: generationId,
        variant_index: i,
        label: `variant_${i + 1}`,
        assembly_json: v.finalAssembly,
        validation_score: v.finalReport.score,
        style_score: null,
        usability_score: v.finalReport.passed ? 1 : 0.5,
      }))
      const { error: vErr } = await supabaseAdmin.from('generation_variants').insert(variantRows)
      if (vErr) {
        console.warn('[voidforge] failed to insert variants:', vErr.message)
      }
    }

    return NextResponse.json({
      generationId,
      status: result.status,
      errorMessage: result.errorMessage,
      templateSlug: result.template.slug,
      styleSummary: result.variants[0]?.plan.styleSummary ?? '',
      variants: result.variants.map((v, i) => ({
        variantIndex: i,
        label: `variant_${i + 1}`,
        temperature: v.temperature,
        assembly: v.finalAssembly,
        validation: v.finalReport,
        repair: v.repairReport,
        plan: v.plan,
        finalScore: v.finalScore,
      })),
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    await supabaseAdmin
      .from('generations')
      .update({ status: 'failed', error_message: message, updated_at: new Date().toISOString() })
      .eq('id', generationId)
    return NextResponse.json({ generationId, error: message }, { status: 500 })
  }
}
