// src/config/providers.ts
// Ghost AI Chat — Provider & Model Definitions
// Single source of truth for all supported AI providers and models.

export type ProviderSlug = 'claude' | 'chatgpt' | 'gemini';

export interface ModelDefinition {
  id: string;           // internal ID used in DB and pricing lookup (e.g. 'claude-sonnet')
  apiModel: string;     // actual model string sent to provider API
  displayName: string;  // shown to user in UI
  provider: ProviderSlug;
  isPremium: boolean;   // requires GHAI even for Pro subscribers
  maxTokens: number;    // max output tokens
  contextWindow: number;
  description: string;  // short description for model selector
}

export const PROVIDERS: Record<ProviderSlug, { name: string; displayName: string; icon: string }> = {
  claude: {
    name: 'claude',
    displayName: 'Claude',
    icon: '/icons/claude.svg',
  },
  chatgpt: {
    name: 'chatgpt',
    displayName: 'ChatGPT',
    icon: '/icons/openai.svg',
  },
  gemini: {
    name: 'gemini',
    displayName: 'Gemini',
    icon: '/icons/gemini.svg',
  },
};

export const MODELS: ModelDefinition[] = [
  // Claude
  {
    id: 'claude-sonnet',
    apiModel: 'claude-sonnet-4-20250514',
    displayName: 'Claude Sonnet',
    provider: 'claude',
    isPremium: false,
    maxTokens: 8192,
    contextWindow: 200000,
    description: 'Fast and capable. Best for everyday tasks.',
  },
  {
    id: 'claude-opus',
    apiModel: 'claude-opus-4-20250514',
    displayName: 'Claude Opus',
    provider: 'claude',
    isPremium: true,
    maxTokens: 8192,
    contextWindow: 200000,
    description: 'Most intelligent. For complex reasoning.',
  },
  // OpenAI
  {
    id: 'gpt-4o',
    apiModel: 'gpt-4o',
    displayName: 'GPT-4o',
    provider: 'chatgpt',
    isPremium: false,
    maxTokens: 4096,
    contextWindow: 128000,
    description: 'Powerful multimodal model.',
  },
  {
    id: 'gpt-4o-mini',
    apiModel: 'gpt-4o-mini',
    displayName: 'GPT-4o Mini',
    provider: 'chatgpt',
    isPremium: false,
    maxTokens: 4096,
    contextWindow: 128000,
    description: 'Fast and affordable.',
  },
  // Google
  {
    id: 'gemini-pro',
    apiModel: 'gemini-2.0-flash',
    displayName: 'Gemini Pro',
    provider: 'gemini',
    isPremium: false,
    maxTokens: 8192,
    contextWindow: 1000000,
    description: 'Advanced reasoning and analysis.',
  },
  {
    id: 'gemini-flash',
    apiModel: 'gemini-2.0-flash-lite',
    displayName: 'Gemini Flash',
    provider: 'gemini',
    isPremium: false,
    maxTokens: 8192,
    contextWindow: 1000000,
    description: 'Ultra-fast responses.',
  },
];

// Helper: get model by ID
export function getModelById(id: string): ModelDefinition | undefined {
  return MODELS.find((m) => m.id === id);
}

// Helper: get models by provider
export function getModelsByProvider(provider: ProviderSlug): ModelDefinition[] {
  return MODELS.filter((m) => m.provider === provider);
}

// Helper: get default model for a provider
export function getDefaultModel(provider: ProviderSlug): ModelDefinition {
  const models = getModelsByProvider(provider);
  return models.find((m) => !m.isPremium) || models[0];
}
