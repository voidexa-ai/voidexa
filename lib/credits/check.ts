// lib/credits/check.ts
// Void Chat — Credit Validation
// Determines if a user can send a message based on their tier.

import { createClient } from '@supabase/supabase-js';
import { FREE_TIER, GHAI_COSTS, PREMIUM_MODELS } from '@/config/pricing';
import type { CreditCheck, CreditTier, UserCredits } from '@/types/credits';

/**
 * Check if a user can send a message with the given model.
 * Returns tier, whether they can send, and remaining balance info.
 * Uses service_role key — call from API routes only.
 */
export async function checkCredits(
  userId: string,
  modelId: string
): Promise<CreditCheck> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch user credits
  const { data: credits, error } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !credits) {
    return { canSend: false, tier: 'free', reason: 'Credits record not found. Try refreshing.' };
  }

  const userCredits = credits as UserCredits;
  const ghaiCost = GHAI_COSTS[modelId] || 1;
  const isPremiumModel = PREMIUM_MODELS.includes(modelId as any);

  // Tier 1: Active Stripe Pro subscription
  if (userCredits.subscription_status === 'active') {
    // Pro subscribers get unlimited standard models
    if (!isPremiumModel) {
      return { canSend: true, tier: 'pro' };
    }
    // Premium models still require GHAI even for Pro
    if (userCredits.ghai_balance_platform >= ghaiCost) {
      return {
        canSend: true,
        tier: 'ghai',
        ghaiBalance: userCredits.ghai_balance_platform,
        ghaiCost,
      };
    }
    return {
      canSend: false,
      tier: 'pro',
      reason: `${modelId} is a premium model. You need ${ghaiCost} GHAI. Balance: ${userCredits.ghai_balance_platform} GHAI.`,
      ghaiBalance: userCredits.ghai_balance_platform,
      ghaiCost,
    };
  }

  // Tier 2: GHAI balance available
  if (userCredits.ghai_balance_platform >= ghaiCost) {
    return {
      canSend: true,
      tier: 'ghai',
      ghaiBalance: userCredits.ghai_balance_platform,
      ghaiCost,
    };
  }

  // Tier 3: Free tier
  const now = new Date();
  const resetAt = new Date(userCredits.free_messages_reset_at);

  // Check if free tier has reset
  let freeUsed = userCredits.free_messages_used_today;
  if (now >= resetAt) {
    // Reset happened — treat as 0 used (will be updated in deduct)
    freeUsed = 0;
  }

  // Free tier only allows budget models
  if (!FREE_TIER.allowedModels.includes(modelId as any)) {
    return {
      canSend: false,
      tier: 'free',
      reason: `${modelId} requires GHAI tokens or a Pro subscription.`,
      freeRemaining: Math.max(0, FREE_TIER.messagesPerDay - freeUsed),
    };
  }

  if (freeUsed < FREE_TIER.messagesPerDay) {
    return {
      canSend: true,
      tier: 'free',
      freeRemaining: FREE_TIER.messagesPerDay - freeUsed - 1, // -1 because this message will use one
    };
  }

  return {
    canSend: false,
    tier: 'free',
    reason: `Free tier limit reached (${FREE_TIER.messagesPerDay}/day). Deposit GHAI or upgrade to Pro.`,
    freeRemaining: 0,
  };
}
