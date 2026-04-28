// components/ghost-ai/ConversationList.tsx
// Sidebar list of user's conversations with provider indicator

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { Conversation } from '@/types/chat';

const PROVIDER_COLORS: Record<string, string> = {
  claude:  '#cc785c',
  chatgpt: '#10a37f',
  gemini:  '#4285f4',
};

const PROVIDER_INITIALS: Record<string, string> = {
  claude:  'C',
  chatgpt: 'G',
  gemini:  'G',
};

export function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams<{ conversationId?: string }>();

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
      // Silent fail
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(e: React.MouseEvent, conversationId: string) {
    e.stopPropagation();
    const res = await fetch('/api/chat/conversations', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId }),
    });
    if (res.ok) {
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      if (params.conversationId === conversationId) {
        router.push('/void-pro-ai');
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-1.5 p-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-11 bg-gray-800/60 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <p className="text-sm text-center py-6" style={{ color: '#374151' }}>
        No conversations yet
      </p>
    );
  }

  return (
    <div className="space-y-0.5 px-2">
      {conversations.map((conv) => {
        const active = params.conversationId === conv.id;
        const color = PROVIDER_COLORS[conv.provider] ?? '#6b7280';
        const initial = PROVIDER_INITIALS[conv.provider] ?? '?';
        return (
          <div
            key={conv.id}
            onClick={() => router.push(`/void-pro-ai/${conv.id}`)}
            className="group flex items-center gap-2.5 px-2.5 py-2 rounded-xl cursor-pointer transition-all"
            style={{
              background: active ? 'rgba(139,92,246,0.12)' : 'transparent',
              border: active ? '1px solid rgba(139,92,246,0.2)' : '1px solid transparent',
            }}
            onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
            onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            {/* Provider indicator dot */}
            <div
              className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
            >
              {initial}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate" style={{ color: active ? '#e2e8f0' : '#9ca3af' }}>
                {conv.title}
              </p>
              <p className="text-sm mt-0.5" style={{ color: '#374151' }}>
                {conv.message_count ?? 0} msgs
              </p>
            </div>

            <button
              onClick={(e) => handleDelete(e, conv.id)}
              className="opacity-0 group-hover:opacity-100 shrink-0 w-5 h-5 flex items-center justify-center rounded transition-all text-gray-600 hover:text-red-400"
              title="Delete"
              style={{ fontSize: 16 }}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
