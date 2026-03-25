// src/components/ghost-ai/UpgradePrompt.tsx
// Shown when free tier is exhausted — prompts to deposit GHAI or subscribe

'use client';

import { useState } from 'react';
import { GHAI_DISCOUNT_PERCENT } from '@/config/pricing';

interface UpgradePromptProps {
  reason?: string;
  onDepositClick?: () => void;
}

export function UpgradePrompt({ reason, onDepositClick }: UpgradePromptProps) {
  const [subscribing, setSubscribing] = useState(false);

  async function handleSubscribe() {
    setSubscribing(true);
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setSubscribing(false);
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md mx-auto text-center">
      <h3 className="text-lg font-semibold mb-2">Upgrade to continue</h3>
      <p className="text-gray-400 text-sm mb-6">
        {reason || 'Your free messages are used up for today.'}
      </p>

      <div className="space-y-3">
        <button
          onClick={onDepositClick}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
        >
          Deposit GHAI ({GHAI_DISCOUNT_PERCENT}% cheaper)
        </button>
        <button
          onClick={handleSubscribe}
          disabled={subscribing}
          className="w-full py-3 border border-gray-600 hover:bg-gray-800 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {subscribing ? 'Redirecting to Stripe...' : 'Subscribe — $5/month'}
        </button>
      </div>
    </div>
  );
}
