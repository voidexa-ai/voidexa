// components/ghost-ai/ModelSelector.tsx
// Provider tabs + model dropdown — vertical layout for sidebar

'use client';

import { PROVIDERS, MODELS, type ProviderSlug } from '@/config/providers';
import { USD_COSTS } from '@/config/pricing';

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
            className="flex-1 py-1.5 text-sm font-medium transition-colors"
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
        className="w-full text-sm text-white rounded-lg px-2 py-2 focus:outline-none focus:border-purple-500 transition-colors"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {providerModels.map((m) => (
          <option key={m.id} value={m.id}>
            {m.displayName} — {USD_COSTS[m.id] ?? '$0.01'}/msg{m.isPremium ? ' ★' : ''}
          </option>
        ))}
      </select>
    </div>
  );
}
