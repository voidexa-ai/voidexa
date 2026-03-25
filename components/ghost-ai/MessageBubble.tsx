// src/components/ghost-ai/MessageBubble.tsx
// Renders a single chat message (user or assistant)

'use client';

import { ProviderBadge } from './ProviderBadge';
import type { ChatMessage } from '@/types/chat';
import type { ProviderSlug } from '@/config/providers';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-purple-600 text-white'
            : 'bg-gray-800 text-gray-100'
        }`}
      >
        {/* TODO: Add markdown rendering for assistant messages */}
        <div className="whitespace-pre-wrap break-words">{message.content}</div>

        {/* Provider badge on assistant messages */}
        {!isUser && message.provider && (
          <ProviderBadge
            provider={message.provider as ProviderSlug}
            model={message.model || undefined}
          />
        )}
      </div>
    </div>
  );
}
