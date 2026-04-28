// src/components/ghost-ai/ChatSidebar.tsx
// Full sidebar: logo, new chat button, conversation list, credit display

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ConversationList } from './ConversationList';
import { CreditDisplay } from './CreditDisplay';
import { ModelSelector } from './ModelSelector';
import { GhaiTicker } from './GhaiTicker';
import { MODELS, getDefaultModel, type ProviderSlug } from '@/config/providers';

interface ChatSidebarProps {
  selectedProvider: ProviderSlug;
  selectedModel: string;
  onProviderChange: (provider: ProviderSlug) => void;
  onModelChange: (modelId: string) => void;
}

export function ChatSidebar({
  selectedProvider,
  selectedModel,
  onProviderChange,
  onModelChange,
}: ChatSidebarProps) {
  const router = useRouter();

  async function handleNewChat() {
    try {
      const res = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          model: selectedModel,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/void-chat/${data.conversation.id}`);
      }
    } catch {
      // Handle error
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold mb-3">Void Pro AI</h2>
        <button
          onClick={handleNewChat}
          className="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-sm transition-colors"
        >
          + New Chat
        </button>
      </div>

      {/* Provider selector */}
      <div className="p-3 border-b border-gray-800">
        <ModelSelector
          selectedProvider={selectedProvider}
          selectedModel={selectedModel}
          onProviderChange={onProviderChange}
          onModelChange={onModelChange}
        />
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto p-2">
        <ConversationList />
      </div>

      {/* Credits + GHAI ticker */}
      <div className="p-4 border-t border-gray-800 space-y-3">
        <CreditDisplay />
        <GhaiTicker />
      </div>
    </div>
  );
}
