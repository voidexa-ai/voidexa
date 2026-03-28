// app/api/kcp90/public-stats/route.ts
// Public read of kcp90_summary — no auth required, used for homepage showcase

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 60 // revalidate every 60s in production

export async function GET() {
  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await serviceClient
    .from('kcp90_summary')
    .select('total_compressions, overall_ratio, total_tokens_saved, estimated_usd_saved, active_products')
    .single()

  if (error || !data) {
    return NextResponse.json({ data: null })
  }

  return NextResponse.json({ data })
}
