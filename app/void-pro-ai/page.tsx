// app/void-chat/page.tsx
// Void Chat — Landing: provider picker, model selector, new chat button

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PROVIDERS,
  MODELS,
  getModelsByProvider,
  getDefaultModel,
  type ProviderSlug,
} from '@/config/providers';
import { USD_COSTS } from '@/config/pricing';
import { useChatState } from '@/components/ghost-ai/VoidChatShell';

const PROVIDER_COLORS: Record<ProviderSlug, string> = {
  claude:  '#cc785c',
  chatgpt: '#10a37f',
  gemini:  '#4285f4',
};

export default function ChatPage() {
  const router = useRouter();
  const { provider, model, setProvider, setModel } = useChatState();

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const providerModels = getModelsByProvider(provider);
  const color = PROVIDER_COLORS[provider];

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
      router.push(`/void-pro-ai/${data.conversation.id}?provider=${provider}&model=${model}`);
    } catch {
      setError('Network error — please try again');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">

      {/* Preview badge — inside chat area, below provider area */}
      <div className="flex items-center justify-center pt-5 pb-0 px-4">
        <span
          className="inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-[0.16em] px-3 py-1 rounded-full"
          style={{
            background: 'rgba(139,92,246,0.06)',
            border: '1px solid rgba(139,92,246,0.14)',
            color: 'rgba(139,92,246,0.5)',
          }}
        >
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(139,92,246,0.6)', display: 'inline-block' }} />
          Preview — You&apos;re among the first to experience Void Pro AI
        </span>
      </div>

      {/* Welcome hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 max-w-2xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-2 text-center">Void Pro AI</h1>
        <p className="text-gray-400 text-center mb-10 text-sm">
          Premium access to Claude, ChatGPT, and Gemini. Pay per message.
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
                <div className="text-2xl font-bold mb-1" style={{ color: selected ? c : '#6b7280' }}>
                  {PROVIDERS[slug].displayName}
                </div>
                <div className="text-sm" style={{ color: selected ? c : '#374151' }}>
                  {getModelsByProvider(slug).length} models
                </div>
              </button>
            );
          })}
        </div>

        {/* Model selector */}
        <div className="w-full mb-6">
          <label className="block text-sm text-gray-500 mb-2 uppercase tracking-widest">Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
          >
            {providerModels.map((m) => (
              <option key={m.id} value={m.id}>
                {m.displayName} — {m.description} ({USD_COSTS[m.id] ?? '$0.01'}/msg{m.isPremium ? ' ★' : ''})
              </option>
            ))}
          </select>
        </div>

        {/* New Chat button */}
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
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
    </div>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
