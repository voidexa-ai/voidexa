// lib/credits/deduct.ts
// Void Chat — Credit Deduction
// Two tiers: Pro (no charge for standard) and GHAI (deduct balance).

import { createClient } from '@supabase/supabase-js';
import { GHAI_COSTS } from '@/config/pricing';
import type { CreditTier } from '@/types/credits';

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
    // Pro on standard models — no charge
    return { success: true, ghaiDeducted: 0 };
  }

  if (tier === 'ghai') {
    // Try RPC first, fall back to manual update
    const { error } = await supabase.rpc('deduct_ghai_balance', {
      p_user_id: userId,
      p_amount: ghaiCost,
    });

    if (error) {
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

      if (updateError) return { success: false, error: updateError.message };
    }

    return { success: true, ghaiDeducted: ghaiCost };
  }

  return { success: false, error: 'No valid payment tier' };
}
