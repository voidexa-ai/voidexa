// components/ghost-ai/CreditDisplay.tsx
// Shows GHAI balance and tier — no free tier

'use client';

import { useEffect, useState } from 'react';
import type { BalanceResponse } from '@/types/credits';

export function CreditDisplay() {
  const [balance, setBalance] = useState<BalanceResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ghai/balance')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => setBalance(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-gray-800 rounded w-24" />
        <div className="h-3 bg-gray-800 rounded w-16" />
      </div>
    );
  }

  if (!balance) return null;

  return (
    <div className="space-y-2 text-sm">
      {/* Tier badge */}
      <div className="flex items-center gap-2">
        <span
          className="px-2 py-0.5 rounded text-xs font-medium"
          style={
            balance.tier === 'pro'
              ? { background: 'rgba(234,179,8,0.15)', color: '#facc15' }
              : { background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }
          }
        >
          {balance.tier === 'pro' ? 'PRO' : 'GHAI'}
        </span>
      </div>

      {/* GHAI balance */}
      {balance.platformBalance > 0 ? (
        <p className="text-gray-300">
          <span className="text-purple-400 font-medium">
            {balance.platformBalance.toFixed(2)}
          </span>{' '}
          GHAI
        </p>
      ) : balance.tier !== 'pro' ? (
        <p className="text-gray-500 text-xs">No GHAI balance</p>
      ) : null}

      {/* Wallet balance */}
      {balance.walletBalance !== null && balance.walletBalance > 0 && (
        <p className="text-gray-500 text-xs">
          Wallet: {balance.walletBalance.toFixed(0)} GHAI
        </p>
      )}

      {/* Deposit CTA when empty */}
      {balance.tier !== 'pro' && balance.platformBalance <= 0 && (
        <a
          href="/void-chat/pricing"
          className="block w-full mt-1 px-3 py-2 rounded-lg text-xs font-medium text-center transition-colors"
          style={{ background: 'rgba(139,92,246,0.2)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)' }}
        >
          Deposit GHAI or buy credits
        </a>
      )}
    </div>
  );
}
