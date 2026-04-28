// components/ghost-ai/CreditDisplay.tsx
// Shows subscription tier — GHAI balance coming soon

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
          className="px-2 py-0.5 rounded text-sm font-semibold"
          style={
            balance.tier === 'pro'
              ? { background: 'rgba(234,179,8,0.15)', color: '#facc15', border: '1px solid rgba(234,179,8,0.2)' }
              : { background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }
          }
        >
          {balance.tier === 'pro' ? 'PRO' : 'USD'}
        </span>
      </div>

      {/* Pro status or upgrade CTA */}
      {balance.tier !== 'pro' && (
        <a
          href="/void-pro-ai/pricing"
          className="flex items-center justify-center w-full mt-2 px-3 py-2.5 rounded-xl text-sm font-bold text-center transition-all"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.5), rgba(6,182,212,0.3))',
            color: '#e2d9ff',
            border: '1px solid rgba(139,92,246,0.45)',
            boxShadow: '0 0 16px rgba(139,92,246,0.2)',
            letterSpacing: '0.02em',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(139,92,246,0.4)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 0 16px rgba(139,92,246,0.2)'}
        >
          Upgrade to Pro →
        </a>
      )}
    </div>
  );
}
