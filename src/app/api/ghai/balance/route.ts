// src/app/api/ghai/balance/route.ts
// Ghost AI Chat — Get user's GHAI balance (platform + on-chain)

import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getUserCredits } from '@/lib/supabase/credit-queries';
import { getWalletGhaiBalance } from '@/lib/ghai/balance';
import { createClient } from '@supabase/supabase-js';
import { FREE_TIER } from '@/config/pricing';
import type { BalanceResponse, CreditTier } from '@/types/credits';

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const credits = await getUserCredits(user.id);
    if (!credits) {
      return NextResponse.json({ error: 'Credits not found' }, { status: 404 });
    }

    // Get connected wallet address
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

    // Determine free messages remaining
    const now = new Date();
    const resetAt = new Date(credits.free_messages_reset_at);
    const freeUsed = now >= resetAt ? 0 : credits.free_messages_used_today;
    const freeRemaining = Math.max(0, FREE_TIER.messagesPerDay - freeUsed);

    // Determine active tier
    let tier: CreditTier = 'free';
    if (credits.subscription_status === 'active') tier = 'pro';
    else if (credits.ghai_balance_platform > 0) tier = 'ghai';

    const response: BalanceResponse = {
      platformBalance: credits.ghai_balance_platform,
      walletBalance,
      freeMessagesRemaining: freeRemaining,
      subscriptionStatus: credits.subscription_status,
      tier,
    };

    return NextResponse.json(response);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Balance error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
