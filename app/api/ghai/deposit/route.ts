// app/api/ghai/deposit/route.ts
// Void Chat — Verify on-chain GHAI deposit and credit user

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { verifyGhaiDeposit } from '@/lib/ghai/verify-deposit';
import { creditGhaiDeposit, logGhaiTransaction } from '@/lib/supabase/credit-queries';
import { sanitizeNumber } from '@/lib/sanitize';
import type { DepositRequest } from '@/types/credits';

export async function POST(req: NextRequest) {
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
    const body = await req.json() as DepositRequest;
    const { txSignature, walletAddress, expectedAmount } = body;

    if (!txSignature || !walletAddress || expectedAmount == null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate types and ranges
    if (typeof txSignature !== 'string' || txSignature.length < 80 || txSignature.length > 120) {
      return NextResponse.json({ error: 'Invalid transaction signature' }, { status: 400 });
    }
    if (typeof walletAddress !== 'string' || walletAddress.length < 32 || walletAddress.length > 44) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
    }
    let validatedAmount: number;
    try {
      validatedAmount = sanitizeNumber(expectedAmount, 1, 1_000_000);
    } catch {
      return NextResponse.json({ error: 'Invalid deposit amount' }, { status: 400 });
    }

    // Verify on-chain
    const verification = await verifyGhaiDeposit(txSignature, validatedAmount);
    if (!verification.valid) {
      return NextResponse.json({ error: 'Deposit verification failed' }, { status: 400 });
    }

    // Credit the user
    const result = await creditGhaiDeposit(
      user.id,
      verification.amount,
      txSignature,
      walletAddress
    );

    if (!result.success) {
      return NextResponse.json({ error: 'Failed to credit deposit' }, { status: 400 });
    }

    // Log transaction
    await logGhaiTransaction(user.id, verification.amount, 'purchase', 'ghost-ai', txSignature);

    return NextResponse.json({
      success: true,
      amount: verification.amount,
      message: `${verification.amount} GHAI credited to your account`,
    });
  } catch (error) {
    console.error('[ghai/deposit]', error);
    return NextResponse.json({ error: 'Deposit processing failed' }, { status: 500 });
  }
}
