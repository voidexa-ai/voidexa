// lib/credits/check.ts
// Void Chat — Credit Validation
// Two tiers only: Pro (Stripe) and GHAI. No free tier.

import { createClient } from '@supabase/supabase-js';
import { GHAI_COSTS, PREMIUM_MODELS } from '@/config/pricing';
import type { CreditCheck, CreditTier, UserCredits } from '@/types/credits';

export async function checkCredits(
  userId: string,
  modelId: string
): Promise<CreditCheck> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: credits, error } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !credits) {
    return { canSend: false, tier: 'ghai', reason: 'Account not found. Please refresh.' };
  }

  const userCredits = credits as UserCredits;
  const ghaiCost = GHAI_COSTS[modelId] || 1;
  const isPremiumModel = PREMIUM_MODELS.includes(modelId as never);

  // Tier 1: Active Stripe Pro subscription
  if (userCredits.subscription_status === 'active') {
    if (!isPremiumModel) {
      return { canSend: true, tier: 'pro' };
    }
    // Premium models cost GHAI even for Pro
    if (userCredits.ghai_balance_platform >= ghaiCost) {
      return { canSend: true, tier: 'ghai', ghaiBalance: userCredits.ghai_balance_platform, ghaiCost };
    }
    return {
      canSend: false,
      tier: 'pro',
      reason: `${modelId} is a premium model requiring ${ghaiCost} GHAI. Balance: ${userCredits.ghai_balance_platform} GHAI.`,
      ghaiBalance: userCredits.ghai_balance_platform,
      ghaiCost,
    };
  }

  // Tier 2: GHAI balance
  if (userCredits.ghai_balance_platform >= ghaiCost) {
    return { canSend: true, tier: 'ghai', ghaiBalance: userCredits.ghai_balance_platform, ghaiCost };
  }

  // No access — prompt to deposit or subscribe
  return {
    canSend: false,
    tier: 'ghai',
    reason: 'Insufficient GHAI balance. Deposit GHAI or buy credits with card.',
    ghaiBalance: userCredits.ghai_balance_platform,
    ghaiCost,
  };
}
