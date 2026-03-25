// app/void-chat/page.tsx
// Void Chat — Landing page: provider picker, model selector, new chat, recent conversations

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  PROVIDERS,
  MODELS,
  getModelsByProvider,
  getDefaultModel,
  type ProviderSlug,
} from '@/config/providers';
import { GHAI_COSTS } from '@/config/pricing';
import { useChatState } from '@/components/ghost-ai/VoidChatShell';
import type { Conversation } from '@/types/chat';

const PROVIDER_COLORS: Record<ProviderSlug, string> = {
  claude:  '#cc785c',
  chatgpt: '#10a37f',
  gemini:  '#4285f4',
};

export default function ChatPage() {
  const router = useRouter();
  const { provider, model, setProvider, setModel } = useChatState();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const providerModels = getModelsByProvider(provider);
  const color = PROVIDER_COLORS[provider];

  useEffect(() => {
    fetchConversations();
  }, []);

  async function fetchConversations() {
    try {
      const res = await fetch('/api/chat/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch {
      // silent
    } finally {
      setLoadingConvs(false);
    }
  }

  async function handleNewChat() {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, model }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create chat');
        return;
      }
      const data = await res.json();
      router.push(`/void-chat/${data.conversation.id}?provider=${provider}&model=${model}`);
    } catch {
      setError('Network error — please try again');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      {/* Welcome hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-2xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-2 text-center">Void Chat</h1>
        <p className="text-gray-400 text-center mb-10 text-sm">
          Choose a provider and model, then start chatting.
        </p>

        {/* Provider cards */}
        <div className="grid grid-cols-3 gap-4 w-full mb-6">
          {(Object.keys(PROVIDERS) as ProviderSlug[]).map((slug) => {
            const c = PROVIDER_COLORS[slug];
            const selected = provider === slug;
            return (
              <button
                key={slug}
                onClick={() => setProvider(slug)}
                className="rounded-2xl p-5 text-center transition-all border"
                style={{
                  background: selected ? `rgba(${hexToRgb(c)},0.12)` : 'rgba(255,255,255,0.02)',
                  borderColor: selected ? c : 'rgba(255,255,255,0.06)',
                  boxShadow: selected ? `0 0 20px rgba(${hexToRgb(c)},0.15)` : 'none',
                }}
              >
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ color: selected ? c : '#6b7280' }}
                >
                  {PROVIDERS[slug].displayName}
                </div>
                <div className="text-xs" style={{ color: selected ? c : '#374151' }}>
                  {getModelsByProvider(slug).length} models
                </div>
              </button>
            );
          })}
        </div>

        {/* Model selector */}
        <div className="w-full mb-6">
          <label className="block text-xs text-gray-500 mb-2 uppercase tracking-widest">Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
          >
            {providerModels.map((m) => (
              <option key={m.id} value={m.id}>
                {m.displayName} — {m.description} ({GHAI_COSTS[m.id]} GHAI{m.isPremium ? ' ★' : ''})
              </option>
            ))}
          </select>
        </div>

        {/* New Chat button */}
        {error && (
          <p className="text-red-400 text-sm mb-3">{error}</p>
        )}
        <button
          onClick={handleNewChat}
          disabled={creating}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
          style={{
            background: creating ? '#374151' : `linear-gradient(135deg, ${color}, ${color}cc)`,
            color: '#fff',
          }}
        >
          {creating ? 'Creating...' : '+ New Chat'}
        </button>
      </div>

      {/* Recent conversations */}
      {(loadingConvs || conversations.length > 0) && (
        <div className="border-t border-gray-800 px-6 py-6 max-w-2xl mx-auto w-full">
          <h2 className="text-xs text-gray-500 uppercase tracking-widest mb-4">Recent</h2>
          {loadingConvs ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.slice(0, 8).map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => router.push(`/void-chat/${conv.id}?provider=${conv.provider}&model=${conv.model}`)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-colors hover:bg-gray-800/60 border border-transparent hover:border-gray-700"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{conv.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {PROVIDERS[conv.provider as ProviderSlug]?.displayName ?? conv.provider} · {conv.message_count ?? 0} msgs
                    </p>
                  </div>
                  <span className="text-gray-600 text-lg ml-3">›</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
