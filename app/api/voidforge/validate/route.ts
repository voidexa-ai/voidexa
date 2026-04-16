import { NextRequest, NextResponse } from 'next/server'
import { validateAssembly } from '@/lib/voidforge/validator'
import { fetchActiveModelCatalog } from '@/lib/voidforge/metadata'
import { ALL_TEMPLATES, getTemplateBySlug } from '@/lib/voidforge/templates'
import type { AssemblyJson } from '@/lib/voidforge/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface ValidateBody {
  assemblyJson?: AssemblyJson
  templateSlug?: string
}

export async function POST(req: NextRequest) {
  let body: ValidateBody
  try {
    body = (await req.json()) as ValidateBody
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 })
  }

  if (!body.assemblyJson || !Array.isArray(body.assemblyJson.instances)) {
    return NextResponse.json({ error: 'assemblyJson is required' }, { status: 400 })
  }

  const templateSlug = body.templateSlug ?? body.assemblyJson.templateSlug
  const template = templateSlug ? getTemplateBySlug(templateSlug) : ALL_TEMPLATES[0]
  if (!template) {
    return NextResponse.json({ error: `unknown template ${templateSlug}` }, { status: 400 })
  }

  const catalog = await fetchActiveModelCatalog()
  const report = validateAssembly(body.assemblyJson, template, catalog)
  return NextResponse.json({ report })
}
