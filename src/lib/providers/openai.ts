// src/lib/providers/openai.ts
// Ghost AI Chat — OpenAI (ChatGPT) API Wrapper
// Server-side only. NEVER import this in client components.

import OpenAI from 'openai';
import type { ProviderCallOptions, ProviderResponse, ProviderStreamCallbacks } from '@/types/providers';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function callOpenAI(options: ProviderCallOptions): Promise<ProviderResponse> {
  const { model, messages, maxTokens = 4096 } = options;

  const response = await client.chat.completions.create({
    model,
    max_tokens: maxTokens,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const choice = response.choices[0];

  return {
    content: choice.message.content || '',
    tokensInput: response.usage?.prompt_tokens || 0,
    tokensOutput: response.usage?.completion_tokens || 0,
    model: response.model,
    finishReason: choice.finish_reason || 'stop',
  };
}

export async function streamOpenAI(
  options: ProviderCallOptions,
  callbacks: ProviderStreamCallbacks
): Promise<void> {
  const { model, messages, maxTokens = 4096 } = options;

  let fullContent = '';
  let inputTokens = 0;
  let outputTokens = 0;

  const stream = await client.chat.completions.create({
    model,
    max_tokens: maxTokens,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
    stream: true,
    stream_options: { include_usage: true },
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) {
      fullContent += delta;
      callbacks.onToken(delta);
    }

    // Usage comes in the final chunk
    if (chunk.usage) {
      inputTokens = chunk.usage.prompt_tokens;
      outputTokens = chunk.usage.completion_tokens;
    }
  }

  callbacks.onDone({
    content: fullContent,
    tokensInput: inputTokens,
    tokensOutput: outputTokens,
    model,
    finishReason: 'stop',
  });
}
