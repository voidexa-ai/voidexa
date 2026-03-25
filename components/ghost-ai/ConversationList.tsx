// src/components/ghost-ai/ConversationList.tsx
// Sidebar list of user's conversations

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { Conversation } from '@/types/chat';

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
        router.push('/void-chat');
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-2 p-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center p-4">
        No conversations yet
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((conv) => (
        <div
          key={conv.id}
          onClick={() => router.push(`/void-chat/${conv.id}`)}
          className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
            params.conversationId === conv.id
              ? 'bg-gray-800 text-white'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
          }`}
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm truncate">{conv.title}</p>
            <p className="text-xs text-gray-500">{conv.provider} · {conv.message_count} msgs</p>
          </div>
          <button
            onClick={(e) => handleDelete(e, conv.id)}
            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 ml-2 transition-opacity"
            title="Delete"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
