// components/ghost-ai/VoidChatShell.tsx
// Client shell — holds provider/model state, fixes chat viewport below navbar

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

// Navbar is fixed at top — measured from Navigation.tsx py-5 + logo ≈ 72px
const NAVBAR_HEIGHT = 72;

export function VoidChatShell({ children }: { children: React.ReactNode }) {
  const [provider, setProviderRaw] = useState<ProviderSlug>('claude');
  const [model, setModel] = useState(getDefaultModel('claude').id);

  function setProvider(p: ProviderSlug) {
    setProviderRaw(p);
    setModel(getDefaultModel(p).id);
  }

  return (
    <ChatState.Provider value={{ provider, model, setProvider, setModel }}>
      {/*
        position: fixed — removes from normal flow, no body scroll
        top: NAVBAR_HEIGHT — starts exactly below the fixed navbar
        inset 0 on other sides — fills remaining viewport
        overflow: hidden — nothing bleeds out
      */}
      <div
        style={{
          position: 'fixed',
          top: NAVBAR_HEIGHT,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          display: 'flex',
          background: '#030712',
        }}
      >
        {/* Sidebar — scrolls internally */}
        <aside
          style={{
            width: 272,
            flexShrink: 0,
            borderRight: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
          className="hidden md:flex"
        >
          <ChatSidebar
            selectedProvider={provider}
            selectedModel={model}
            onProviderChange={setProvider}
            onModelChange={setModel}
          />
        </aside>

        {/* Main chat area — three-zone layout enforced by children */}
        <main
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {children}
        </main>
      </div>
    </ChatState.Provider>
  );
}
