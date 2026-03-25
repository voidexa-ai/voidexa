// lib/supabase/credit-queries.ts
// Void Chat — Database queries for user credits

import { createClient } from '@supabase/supabase-js';
import type { UserCredits } from '@/types/credits';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function getUserCredits(userId: string): Promise<UserCredits | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) return null;
  return data as UserCredits;
}

export async function creditGhaiDeposit(
  userId: string,
  amount: number,
  txSignature: string,
  walletAddress: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();

  // Insert deposit record
  const { error: depositError } = await supabase
    .from('ghai_deposits')
    .insert({
      user_id: userId,
      amount,
      tx_signature: txSignature,
      wallet_address: walletAddress,
      status: 'confirmed',
      confirmed_at: new Date().toISOString(),
    });

  if (depositError) {
    // Duplicate tx_signature means already processed
    if (depositError.code === '23505') {
      return { success: false, error: 'This transaction has already been processed' };
    }
    return { success: false, error: depositError.message };
  }

  // Credit the user's platform balance
  const { data: credits } = await supabase
    .from('user_credits')
    .select('ghai_balance_platform, total_ghai_deposited')
    .eq('user_id', userId)
    .single();

  if (!credits) {
    return { success: false, error: 'User credits record not found' };
  }

  const { error: updateError } = await supabase
    .from('user_credits')
    .update({
      ghai_balance_platform: credits.ghai_balance_platform + amount,
      total_ghai_deposited: credits.total_ghai_deposited + amount,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  return { success: true };
}

// Also insert into existing ghai_transactions table (Phase 1 schema)
export async function logGhaiTransaction(
  userId: string,
  amount: number,
  type: 'purchase' | 'spend' | 'earn' | 'referral',
  product: string,
  txSignature?: string
): Promise<void> {
  const supabase = getServiceClient();
  await supabase
    .from('ghai_transactions')
    .insert({
      user_id: userId,
      amount,
      type,
      product,
      tx_signature: txSignature || null,
    });
}
