// src/lib/providers/types.ts
// Ghost AI Chat — Provider Router
// Routes requests to the correct provider based on model ID.

import type { ProviderCallOptions, ProviderResponse, ProviderStreamCallbacks } from '@/types/providers';
import type { ProviderSlug } from '@/config/providers';
import { callClaude, streamClaude } from './anthropic';
import { callOpenAI, streamOpenAI } from './openai';
import { callGemini, streamGemini } from './google';

type CallFn = (options: ProviderCallOptions) => Promise<ProviderResponse>;
type StreamFn = (options: ProviderCallOptions, callbacks: ProviderStreamCallbacks) => Promise<void>;

const CALL_MAP: Record<ProviderSlug, CallFn> = {
  claude: callClaude,
  chatgpt: callOpenAI,
  gemini: callGemini,
};

const STREAM_MAP: Record<ProviderSlug, StreamFn> = {
  claude: streamClaude,
  chatgpt: streamOpenAI,
  gemini: streamGemini,
};

export function callProvider(provider: ProviderSlug, options: ProviderCallOptions): Promise<ProviderResponse> {
  const fn = CALL_MAP[provider];
  if (!fn) throw new Error(`Unknown provider: ${provider}`);
  return fn(options);
}

export function streamProvider(
  provider: ProviderSlug,
  options: ProviderCallOptions,
  callbacks: ProviderStreamCallbacks
): Promise<void> {
  const fn = STREAM_MAP[provider];
  if (!fn) throw new Error(`Unknown provider: ${provider}`);
  return fn(options, callbacks);
}
