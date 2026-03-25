// components/ghost-ai/VoidChatShell.tsx
// Client shell — holds provider/model state shared between sidebar and pages

'use client';

import { useState, createContext, useContext } from 'react';
import { ChatSidebar } from './ChatSidebar';
import { getDefaultModel, type ProviderSlug } from '@/config/providers';

interface ChatStateContext {
  provider: ProviderSlug;
  model: string;
  setProvider: (p: ProviderSlug) => void;
  setModel: (m: string) => void;
}

const ChatState = createContext<ChatStateContext>({
  provider: 'claude',
  model: 'claude-sonnet',
  setProvider: () => {},
  setModel: () => {},
});

export function useChatState() {
  return useContext(ChatState);
}

export function VoidChatShell({ children }: { children: React.ReactNode }) {
  const [provider, setProviderRaw] = useState<ProviderSlug>('claude');
  const [model, setModel] = useState(getDefaultModel('claude').id);

  function setProvider(p: ProviderSlug) {
    setProviderRaw(p);
    setModel(getDefaultModel(p).id);
  }

  return (
    <ChatState.Provider value={{ provider, model, setProvider, setModel }}>
      <div className="flex h-screen bg-gray-950 text-white">
        {/* Sidebar */}
        <aside className="w-72 border-r border-gray-800 flex-shrink-0 hidden md:flex flex-col">
          <ChatSidebar
            selectedProvider={provider}
            selectedModel={model}
            onProviderChange={setProvider}
            onModelChange={setModel}
          />
        </aside>

        {/* Main content area */}
        <main className="flex-1 flex flex-col min-w-0">
          {children}
        </main>
      </div>
    </ChatState.Provider>
  );
}
