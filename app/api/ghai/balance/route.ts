// app/api/ghai/balance/route.ts
// Void Chat — Get user's GHAI balance (platform + on-chain)

import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getUserCredits } from '@/lib/supabase/credit-queries';
import { getWalletGhaiBalance } from '@/lib/ghai/balance';
import { createClient } from '@supabase/supabase-js';
import type { BalanceResponse, CreditTier } from '@/types/credits';

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const credits = await getUserCredits(user.id);
    if (!credits) return NextResponse.json({ error: 'Credits not found' }, { status: 404 });

    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: wallet } = await serviceClient
      .from('wallet_connections')
      .select('wallet_address')
      .eq('user_id', user.id)
      .single();

    let walletBalance: number | null = null;
    if (wallet?.wallet_address) {
      walletBalance = await getWalletGhaiBalance(wallet.wallet_address);
    }

    let tier: CreditTier = 'ghai';
    if (credits.subscription_status === 'active') tier = 'pro';

    const response: BalanceResponse = {
      platformBalance: credits.ghai_balance_platform,
      walletBalance,
      freeMessagesRemaining: 0, // free tier removed
      subscriptionStatus: credits.subscription_status,
      tier,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[ghai/balance]', error);
    return NextResponse.json({ error: 'Failed to fetch balance' }, { status: 500 });
  }
}
