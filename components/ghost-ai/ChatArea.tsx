// src/components/ghost-ai/ChatArea.tsx
// Main chat area: message display + streaming + input

'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageBubble } from './MessageBubble';
import { StreamingIndicator } from './StreamingIndicator';
import { ChatInput } from './ChatInput';
import { ProviderBadge } from './ProviderBadge';
import type { ChatMessage } from '@/types/chat';
import type { ProviderSlug } from '@/config/providers';

interface ChatAreaProps {
  conversationId: string;
  provider: ProviderSlug;
  model: string;
}

export function ChatArea({ conversationId, provider, model }: ChatAreaProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load message history
  useEffect(() => {
    loadMessages();
  }, [conversationId]);

  // Auto-scroll on new content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  async function loadMessages() {
    setLoading(true);
    try {
      const res = await fetch(`/api/chat/history/${conversationId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }

  async function handleSend(message: string) {
    setError(null);
    setIsStreaming(true);
    setStreamingContent('');

    // Optimistic: add user message to list
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      conversation_id: conversationId,
      user_id: '',
      role: 'user',
      content: message,
      provider: null,
      model: null,
      tokens_input: 0,
      tokens_output: 0,
      ghai_cost: 0,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => {
      // Auto-name: if this is the first message, update conversation title
      if (prev.length === 0) {
        const title = message.slice(0, 40).trim();
        fetch('/api/chat/conversations', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId, title }),
        }).catch(() => {});
      }
      return [...prev, tempUserMsg];
    });

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          message,
          provider,
          model,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.reason || data.error || 'Failed to send message');
        setIsStreaming(false);
        return;
      }

      // Read SSE stream
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      if (!reader) {
        setError('No response stream');
        setIsStreaming(false);
        return;
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6);

          try {
            const event = JSON.parse(jsonStr);

            if (event.type === 'token') {
              accumulated += event.data;
              setStreamingContent(accumulated);
            } else if (event.type === 'done') {
              // Add final assistant message
              const assistantMsg: ChatMessage = {
                id: event.metadata?.messageId || `msg-${Date.now()}`,
                conversation_id: conversationId,
                user_id: '',
                role: 'assistant',
                content: accumulated,
                provider,
                model,
                tokens_input: event.metadata?.tokens_input || 0,
                tokens_output: event.metadata?.tokens_output || 0,
                ghai_cost: event.metadata?.ghai_cost || 0,
                created_at: new Date().toISOString(),
              };
              setMessages((prev) => [...prev, assistantMsg]);
              setStreamingContent('');
              setIsStreaming(false);
            } else if (event.type === 'error') {
              setError(event.data);
              setIsStreaming(false);
            }
          } catch {
            // Ignore malformed JSON chunks
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
      setIsStreaming(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <StreamingIndicator />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Start a conversation
          </div>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}

        {/* Streaming response */}
        {isStreaming && streamingContent && (
          <div className="flex justify-start mb-4">
            <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-gray-800 text-gray-100">
              <div className="whitespace-pre-wrap break-words">{streamingContent}</div>
              <ProviderBadge provider={provider} model={model} />
            </div>
          </div>
        )}

        {isStreaming && !streamingContent && <StreamingIndicator />}

        <div ref={bottomRef} />
      </div>

      {/* Error display — always below scroll area, never overlaps navbar */}
      {error && (
        <div className="px-4 py-2 border-t border-red-900/40">
          <div className="flex items-start justify-between gap-3 bg-red-950/50 border border-red-800/60 text-red-300 rounded-xl px-4 py-3 text-sm">
            <span>{friendlyError(error)}</span>
            <button
              onClick={() => setError(null)}
              className="shrink-0 text-red-500 hover:text-red-300 transition-colors mt-0.5"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-800 p-4">
        <ChatInput onSend={handleSend} disabled={isStreaming} />
      </div>
    </div>
  );
}

function friendlyError(msg: string): string {
  const lower = msg.toLowerCase();
  if (
    lower.includes('ghai') ||
    lower.includes('insufficient credits') ||
    lower.includes('subscription') ||
    lower.includes('requires')
  ) {
    return 'Insufficient GHAI balance. Deposit GHAI or buy credits with card.';
  }
  return msg;
}
