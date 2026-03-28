// app/void-chat/[conversationId]/page.tsx
// Void Chat — Active conversation with streaming chat

'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChatArea } from '@/components/ghost-ai/ChatArea';
import { StreamingIndicator } from '@/components/ghost-ai/StreamingIndicator';
import type { ProviderSlug } from '@/config/providers';
import type { Conversation } from '@/types/chat';

export default function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const searchParams = useSearchParams();

  // Prefer URL params (set on new chat creation) — fall back to fetching from API
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);

  const urlProvider = searchParams.get('provider') as ProviderSlug | null;
  const urlModel    = searchParams.get('model');

  useEffect(() => {
    if (urlProvider && urlModel) {
      // Params already present — no fetch needed
      setConversation({
        id: conversationId,
        provider: urlProvider,
        model: urlModel,
        title: '',
        user_id: '',
        message_count: 0,
        tokens_saved: 0,
        compression_enabled: false,
        created_at: '',
        updated_at: '',
      });
      setLoading(false);
      return;
    }

    // No URL params — fetch from conversations list and find matching
    fetch('/api/chat/conversations')
      .then((r) => r.ok ? r.json() : { conversations: [] })
      .then((data) => {
        const found = (data.conversations as Conversation[]).find(
          (c) => c.id === conversationId
        );
        setConversation(found ?? {
          id: conversationId,
          provider: 'claude' as ProviderSlug,
          model: 'claude-sonnet',
          title: '',
          user_id: '',
          message_count: 0,
          tokens_saved: 0,
          compression_enabled: false,
          created_at: '',
          updated_at: '',
        });
      })
      .catch(() => {
        setConversation({
          id: conversationId,
          provider: 'claude' as ProviderSlug,
          model: 'claude-sonnet',
          title: '',
          user_id: '',
          message_count: 0,
          tokens_saved: 0,
          compression_enabled: false,
          created_at: '',
          updated_at: '',
        });
      })
      .finally(() => setLoading(false));
  }, [conversationId, urlProvider, urlModel]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <StreamingIndicator />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Conversation not found.
      </div>
    );
  }

  return (
    <ChatArea
      conversationId={conversation.id}
      provider={conversation.provider as ProviderSlug}
      model={conversation.model}
    />
  );
}
