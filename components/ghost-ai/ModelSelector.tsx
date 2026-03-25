// src/components/ghost-ai/ModelSelector.tsx
// Dropdown for selecting AI provider and model

'use client';

import { useState } from 'react';
import { PROVIDERS, MODELS, type ProviderSlug, type ModelDefinition } from '@/config/providers';
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

  return (
    <div className="flex gap-2 items-center">
      {/* Provider tabs */}
      <div className="flex bg-gray-800 rounded-lg p-1">
        {(Object.keys(PROVIDERS) as ProviderSlug[]).map((slug) => (
          <button
            key={slug}
            onClick={() => {
              onProviderChange(slug);
              const defaultModel = MODELS.find((m) => m.provider === slug && !m.isPremium);
              if (defaultModel) onModelChange(defaultModel.id);
            }}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              selectedProvider === slug
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {PROVIDERS[slug].displayName}
          </button>
        ))}
      </div>

      {/* Model dropdown */}
      <select
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
      >
        {providerModels.map((model) => (
          <option key={model.id} value={model.id}>
            {model.displayName} ({GHAI_COSTS[model.id]} GHAI)
            {model.isPremium ? ' ★' : ''}
          </option>
        ))}
      </select>
    </div>
  );
}
