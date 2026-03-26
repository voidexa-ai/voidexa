// components/ghost-ai/ModelSelector.tsx
// Provider tabs + model dropdown — vertical layout for sidebar

'use client';

import { useEffect, useState } from 'react';
import { PROVIDERS, MODELS, type ProviderSlug } from '@/config/providers';
import { GHAI_COSTS } from '@/config/pricing';

interface ModelSelectorProps {
  selectedProvider: ProviderSlug;
  selectedModel: string;
  onProviderChange: (provider: ProviderSlug) => void;
  onModelChange: (modelId: string) => void;
}

export function ModelSelector({
  selectedProvider,
  selectedModel,
  onProviderChange,
  onModelChange,
}: ModelSelectorProps) {
  const providerModels = MODELS.filter((m) => m.provider === selectedProvider);
  const [ghaiPriceUsd, setGhaiPriceUsd] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/ghai/price')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.priceUsd) setGhaiPriceUsd(d.priceUsd); })
      .catch(() => {});
  }, []);

  function msgPrice(modelId: string): string {
    const ghaiCost = GHAI_COSTS[modelId] ?? 1;
    if (ghaiPriceUsd !== null) {
      const usd = ghaiCost * ghaiPriceUsd;
      return usd < 0.01 ? `$${usd.toFixed(6)}/msg` : `$${usd.toFixed(4)}/msg`;
    }
    return `${ghaiCost} GHAI`;
  }

  return (
    <div className="space-y-2">
      {/* Provider tabs */}
      <div className="flex rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
        {(Object.keys(PROVIDERS) as ProviderSlug[]).map((slug) => (
          <button
            key={slug}
            onClick={() => {
              onProviderChange(slug);
              const def = MODELS.find((m) => m.provider === slug && !m.isPremium);
              if (def) onModelChange(def.id);
            }}
            className="flex-1 py-1.5 text-xs font-medium transition-colors"
            style={{
              color: selectedProvider === slug ? '#fff' : '#6b7280',
              background: selectedProvider === slug ? '#7c3aed' : 'transparent',
            }}
          >
            {PROVIDERS[slug].displayName}
          </button>
        ))}
      </div>

      {/* Model dropdown */}
      <select
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        className="w-full text-xs text-white rounded-lg px-2 py-2 focus:outline-none focus:border-purple-500 transition-colors"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {providerModels.map((m) => (
          <option key={m.id} value={m.id}>
            {m.displayName} — {msgPrice(m.id)}{m.isPremium ? ' ★' : ''}
          </option>
        ))}
      </select>
    </div>
  );
}
