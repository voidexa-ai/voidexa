import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'

const ADMIN_EMAIL = 'ceo@voidexa.com'

export async function GET() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Wallet stats
  const { data: wallets } = await supabaseAdmin
    .from('user_wallets')
    .select('user_id, balance_usd, total_deposited_usd, total_spent_usd')

  const totalUsers = wallets?.length ?? 0
  const totalDeposited = wallets?.reduce((s, w) => s + parseFloat(String(w.total_deposited_usd)), 0) ?? 0
  const totalSpent = wallets?.reduce((s, w) => s + parseFloat(String(w.total_spent_usd)), 0) ?? 0

  // Session stats
  const { data: sessions } = await supabaseAdmin
    .from('quantum_sessions')
    .select('user_id, cost_usd, customer_price_usd, tokens_used, mode, created_at, question, status')
    .order('created_at', { ascending: false })
    .limit(200)

  const totalSessions = sessions?.length ?? 0
  const totalApiCost = sessions?.reduce((s, ses) => s + parseFloat(String(ses.cost_usd ?? 0)), 0) ?? 0
  const totalRevenue = sessions?.reduce((s, ses) => s + parseFloat(String(ses.customer_price_usd ?? 0)), 0) ?? 0
  const totalTokens = sessions?.reduce((s, ses) => s + (ses.tokens_used ?? 0), 0) ?? 0

  // Top users by spend
  const userSpend: Record<string, number> = {}
  sessions?.forEach(ses => {
    const uid = ses.user_id
    userSpend[uid] = (userSpend[uid] ?? 0) + parseFloat(String(ses.customer_price_usd ?? 0))
  })
  const topUsers = Object.entries(userSpend)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([user_id, spent]) => ({ user_id, spent: parseFloat(spent.toFixed(4)) }))

  // Recent sessions
  const recentSessions = (sessions ?? []).slice(0, 20).map(s => ({
    user_id: s.user_id,
    question: (s.question ?? '').slice(0, 80),
    mode: s.mode,
    status: s.status,
    cost_usd: s.cost_usd,
    customer_price_usd: s.customer_price_usd,
    created_at: s.created_at,
  }))

  return NextResponse.json({
    total_users_with_wallets: totalUsers,
    total_deposited_usd: parseFloat(totalDeposited.toFixed(4)),
    total_spent_usd: parseFloat(totalSpent.toFixed(4)),
    total_sessions: totalSessions,
    total_api_cost_usd: parseFloat(totalApiCost.toFixed(4)),
    total_revenue_usd: parseFloat(totalRevenue.toFixed(4)),
    profit_usd: parseFloat((totalRevenue - totalApiCost).toFixed(4)),
    total_tokens: totalTokens,
    top_users: topUsers,
    recent_sessions: recentSessions,
  })
}
