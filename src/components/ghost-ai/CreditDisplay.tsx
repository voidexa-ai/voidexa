// src/components/ghost-ai/CreditDisplay.tsx
// Shows user's current credit tier and balance in sidebar

'use client';

import { useEffect, useState } from 'react';
import type { BalanceResponse } from '@/types/credits';

export function CreditDisplay() {
  const [balance, setBalance] = useState<BalanceResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalance();
  }, []);

  async function fetchBalance() {
    try {
      const res = await fetch('/api/ghai/balance');
      if (res.ok) {
        const data = await res.json();
        setBalance(data);
      }
    } catch {
      // Silently fail — display will show loading state
    } finally {
      setLoading(false);
    }
  }

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
          className={`px-2 py-0.5 rounded text-xs font-medium ${
            balance.tier === 'pro'
              ? 'bg-yellow-500/20 text-yellow-400'
              : balance.tier === 'ghai'
              ? 'bg-purple-500/20 text-purple-400'
              : 'bg-gray-700 text-gray-400'
          }`}
        >
          {balance.tier === 'pro' ? 'PRO' : balance.tier === 'ghai' ? 'GHAI' : 'FREE'}
        </span>
      </div>

      {/* Balance info */}
      {balance.tier === 'free' && (
        <p className="text-gray-400">
          {balance.freeMessagesRemaining} free messages left today
        </p>
      )}

      {balance.platformBalance > 0 && (
        <p className="text-gray-300">
          <span className="text-purple-400 font-medium">
            {balance.platformBalance.toFixed(0)}
          </span>{' '}
          GHAI
        </p>
      )}

      {balance.walletBalance !== null && (
        <p className="text-gray-500 text-xs">
          Wallet: {balance.walletBalance.toFixed(0)} GHAI
        </p>
      )}

      {/* Action buttons */}
      {balance.tier === 'free' && balance.freeMessagesRemaining === 0 && (
        <button className="w-full mt-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs font-medium transition-colors">
          Upgrade
        </button>
      )}
    </div>
  );
}
