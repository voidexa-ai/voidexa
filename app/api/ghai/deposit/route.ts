// src/app/api/ghai/deposit/route.ts
// Ghost AI Chat — Verify on-chain GHAI deposit and credit user

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { verifyGhaiDeposit } from '@/lib/ghai/verify-deposit';
import { creditGhaiDeposit, logGhaiTransaction } from '@/lib/supabase/credit-queries';
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
    const { txSignature, walletAddress, expectedAmount } = await req.json() as DepositRequest;

    if (!txSignature || !walletAddress || !expectedAmount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify on-chain
    const verification = await verifyGhaiDeposit(txSignature, expectedAmount);
    if (!verification.valid) {
      return NextResponse.json({
        error: 'Deposit verification failed',
        reason: verification.error,
      }, { status: 400 });
    }

    // Credit the user
    const result = await creditGhaiDeposit(
      user.id,
      verification.amount,
      txSignature,
      walletAddress
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Log transaction
    await logGhaiTransaction(user.id, verification.amount, 'purchase', 'ghost-ai', txSignature);

    return NextResponse.json({
      success: true,
      amount: verification.amount,
      message: `${verification.amount} GHAI credited to your account`,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Deposit error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
