import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import WalletPageClient, { type WalletTransaction } from '@/components/wallet/WalletPageClient'

export const dynamic = 'force-dynamic'

export default async function WalletPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirect=/wallet')

  let { data: wallet } = await supabaseAdmin
    .from('user_wallets')
    .select('balance_usd, total_deposited_usd, total_spent_usd')
    .eq('user_id', user.id)
    .single()

  if (!wallet) {
    const { data: created } = await supabaseAdmin
      .from('user_wallets')
      .insert({ user_id: user.id })
      .select('balance_usd, total_deposited_usd, total_spent_usd')
      .single()
    wallet = created
  }

  const { data: txns } = await supabaseAdmin
    .from('wallet_transactions')
    .select('id, type, amount_usd, description, stripe_session_id, balance_after, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <WalletPageClient
      email={user.email ?? ''}
      balance={wallet?.balance_usd ?? 0}
      totalDeposited={wallet?.total_deposited_usd ?? 0}
      totalSpent={wallet?.total_spent_usd ?? 0}
      transactions={(txns ?? []) as WalletTransaction[]}
    />
  )
}
