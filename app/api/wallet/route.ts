import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Try to fetch existing wallet
  let { data: wallet } = await supabaseAdmin
    .from('user_wallets')
    .select('balance_usd, total_deposited_usd, total_spent_usd')
    .eq('user_id', user.id)
    .single()

  // Auto-create wallet if none exists
  if (!wallet) {
    const { data: created } = await supabaseAdmin
      .from('user_wallets')
      .insert({ user_id: user.id })
      .select('balance_usd, total_deposited_usd, total_spent_usd')
      .single()
    wallet = created
  }

  return NextResponse.json(wallet ?? { balance_usd: 0, total_deposited_usd: 0, total_spent_usd: 0 })
}
