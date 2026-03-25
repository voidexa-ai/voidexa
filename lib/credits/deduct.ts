// lib/credits/deduct.ts
// Void Chat — Credit Deduction
// Deducts credits after a successful message. Called from API route after provider response.

import { createClient } from '@supabase/supabase-js';
import { FREE_TIER, GHAI_COSTS } from '@/config/pricing';
import type { CreditTier } from '@/types/credits';

/**
 * Deduct credits for a sent message.
 * Must be called AFTER the provider returns a successful response.
 * Uses service_role key — API routes only.
 */
export async function deductCredits(
  userId: string,
  modelId: string,
  tier: CreditTier
): Promise<{ success: boolean; ghaiDeducted?: number; error?: string }> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const ghaiCost = GHAI_COSTS[modelId] || 1;

  if (tier === 'pro') {
    // Pro subscribers on standard models — no charge
    return { success: true, ghaiDeducted: 0 };
  }

  if (tier === 'ghai') {
    // Deduct GHAI from platform balance
    const { error } = await supabase.rpc('deduct_ghai_balance', {
      p_user_id: userId,
      p_amount: ghaiCost,
    });

    if (error) {
      // Fallback: manual update if RPC not yet created
      const { data: credits } = await supabase
        .from('user_credits')
        .select('ghai_balance_platform, total_ghai_spent')
        .eq('user_id', userId)
        .single();

      if (!credits || credits.ghai_balance_platform < ghaiCost) {
        return { success: false, error: 'Insufficient GHAI balance' };
      }

      const { error: updateError } = await supabase
        .from('user_credits')
        .update({
          ghai_balance_platform: credits.ghai_balance_platform - ghaiCost,
          total_ghai_spent: credits.total_ghai_spent + ghaiCost,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (updateError) {
        return { success: false, error: updateError.message };
      }
    }

    return { success: true, ghaiDeducted: ghaiCost };
  }

  if (tier === 'free') {
    // Increment free messages counter
    const now = new Date();

    // First check if reset is needed
    const { data: credits } = await supabase
      .from('user_credits')
      .select('free_messages_used_today, free_messages_reset_at')
      .eq('user_id', userId)
      .single();

    if (!credits) {
      return { success: false, error: 'Credits record not found' };
    }

    const resetAt = new Date(credits.free_messages_reset_at);
    const needsReset = now >= resetAt;

    const { error } = await supabase
      .from('user_credits')
      .update({
        free_messages_used_today: needsReset ? 1 : credits.free_messages_used_today + 1,
        free_messages_reset_at: needsReset
          ? new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
          : credits.free_messages_reset_at,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, ghaiDeducted: 0 };
  }

  return { success: false, error: `Unknown tier: ${tier}` };
}
