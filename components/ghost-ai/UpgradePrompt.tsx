// components/ghost-ai/UpgradePrompt.tsx
// Shown when free tier is exhausted — prompts to subscribe

'use client';

import { useState } from 'react';

interface UpgradePromptProps {
  reason?: string;
  onDepositClick?: () => void;
}

export function UpgradePrompt({ reason }: UpgradePromptProps) {
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
          onClick={handleSubscribe}
          disabled={subscribing}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {subscribing ? 'Redirecting to Stripe...' : 'Subscribe — $5/month'}
        </button>
        <p className="text-sm" style={{ color: '#888' }}>
          Token payments coming soon
        </p>
      </div>
    </div>
  );
}
