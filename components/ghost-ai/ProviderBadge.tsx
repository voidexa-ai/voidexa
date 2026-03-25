// src/components/ghost-ai/ProviderBadge.tsx
// Shows "Powered by [Provider] — orchestrated by voidexa" under each AI response.
// REQUIRED on every assistant message per scaffold transparency rule.

'use client';

import { PROVIDERS, type ProviderSlug } from '@/config/providers';

interface ProviderBadgeProps {
  provider: ProviderSlug;
  model?: string;
}

export function ProviderBadge({ provider, model }: ProviderBadgeProps) {
  const providerInfo = PROVIDERS[provider];
  if (!providerInfo) return null;

  return (
    <p className="text-xs text-gray-500 mt-2 select-none">
      Powered by {providerInfo.displayName}
      {model ? ` (${model})` : ''} — orchestrated by voidexa
    </p>
  );
}
