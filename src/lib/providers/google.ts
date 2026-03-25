// src/lib/providers/google.ts
// Ghost AI Chat — Google (Gemini) API Wrapper
// Server-side only. NEVER import this in client components.

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ProviderCallOptions, ProviderResponse, ProviderStreamCallbacks } from '@/types/providers';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function callGemini(options: ProviderCallOptions): Promise<ProviderResponse> {
  const { model, messages, maxTokens = 4096 } = options;

  const geminiModel = genAI.getGenerativeModel({
    model,
    generationConfig: { maxOutputTokens: maxTokens },
  });

  // Convert messages to Gemini format
  const systemMessage = messages.find((m) => m.role === 'system');
  const chatMessages = messages.filter((m) => m.role !== 'system');

  const history = chatMessages.slice(0, -1).map((m) => ({
    role: m.role === 'assistant' ? 'model' as const : 'user' as const,
    parts: [{ text: m.content }],
  }));

  const lastMessage = chatMessages[chatMessages.length - 1];

  const chat = geminiModel.startChat({
    history,
    systemInstruction: systemMessage ? { role: 'user' as const, parts: [{ text: systemMessage.content }] } : undefined,
  });

  const result = await chat.sendMessage(lastMessage.content);
  const response = result.response;

  return {
    content: response.text(),
    tokensInput: response.usageMetadata?.promptTokenCount || 0,
    tokensOutput: response.usageMetadata?.candidatesTokenCount || 0,
    model,
    finishReason: 'stop',
  };
}

export async function streamGemini(
  options: ProviderCallOptions,
  callbacks: ProviderStreamCallbacks
): Promise<void> {
  const { model, messages, maxTokens = 4096 } = options;

  const geminiModel = genAI.getGenerativeModel({
    model,
    generationConfig: { maxOutputTokens: maxTokens },
  });

  const systemMessage = messages.find((m) => m.role === 'system');
  const chatMessages = messages.filter((m) => m.role !== 'system');

  const history = chatMessages.slice(0, -1).map((m) => ({
    role: m.role === 'assistant' ? 'model' as const : 'user' as const,
    parts: [{ text: m.content }],
  }));

  const lastMessage = chatMessages[chatMessages.length - 1];

  const chat = geminiModel.startChat({
    history,
    systemInstruction: systemMessage ? { role: 'user' as const, parts: [{ text: systemMessage.content }] } : undefined,
  });

  let fullContent = '';
  let inputTokens = 0;
  let outputTokens = 0;

  const result = await chat.sendMessageStream(lastMessage.content);

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      fullContent += text;
      callbacks.onToken(text);
    }

    if (chunk.usageMetadata) {
      inputTokens = chunk.usageMetadata.promptTokenCount || 0;
      outputTokens = chunk.usageMetadata.candidatesTokenCount || 0;
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
