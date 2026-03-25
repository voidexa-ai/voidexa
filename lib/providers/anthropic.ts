// src/lib/providers/anthropic.ts
// Ghost AI Chat — Claude (Anthropic) API Wrapper
// Server-side only. NEVER import this in client components.

import Anthropic from '@anthropic-ai/sdk';
import type { ProviderCallOptions, ProviderResponse, ProviderStreamCallbacks } from '@/types/providers';

let _client: Anthropic | null = null;
function getClient() {
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _client;
}

export async function callClaude(options: ProviderCallOptions): Promise<ProviderResponse> {
  const { model, messages, maxTokens = 4096 } = options;

  // Separate system message if present
  const systemMessage = messages.find((m) => m.role === 'system');
  const chatMessages = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

  const response = await getClient().messages.create({
    model,
    max_tokens: maxTokens,
    system: systemMessage?.content || undefined,
    messages: chatMessages,
  });

  const textContent = response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('');

  return {
    content: textContent,
    tokensInput: response.usage.input_tokens,
    tokensOutput: response.usage.output_tokens,
    model: response.model,
    finishReason: response.stop_reason || 'end_turn',
  };
}

export async function streamClaude(
  options: ProviderCallOptions,
  callbacks: ProviderStreamCallbacks
): Promise<void> {
  const { model, messages, maxTokens = 4096 } = options;

  const systemMessage = messages.find((m) => m.role === 'system');
  const chatMessages = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

  let fullContent = '';
  let inputTokens = 0;
  let outputTokens = 0;

  const stream = getClient().messages.stream({
    model,
    max_tokens: maxTokens,
    system: systemMessage?.content || undefined,
    messages: chatMessages,
  });

  stream.on('text', (text) => {
    fullContent += text;
    callbacks.onToken(text);
  });

  stream.on('message', (message) => {
    inputTokens = message.usage.input_tokens;
    outputTokens = message.usage.output_tokens;
  });

  stream.on('error', (error) => {
    callbacks.onError(error instanceof Error ? error : new Error(String(error)));
  });

  stream.on('end', () => {
    callbacks.onDone({
      content: fullContent,
      tokensInput: inputTokens,
      tokensOutput: outputTokens,
      model,
      finishReason: 'end_turn',
    });
  });

  // Wait for stream to complete
  await stream.finalMessage();
}
