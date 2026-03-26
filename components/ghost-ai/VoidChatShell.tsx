// components/ghost-ai/VoidChatShell.tsx
// Client shell — holds provider/model state, fixes chat viewport below navbar + banner

'use client';

import { useState, useEffect, createContext, useContext } from 'react';
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

const BANNER_KEY = 'voidexa_beta_banner_dismissed';
const NAV_HEIGHT = 72;
const BANNER_HEIGHT = 33;

export function VoidChatShell({ children }: { children: React.ReactNode }) {
  const [provider, setProviderRaw] = useState<ProviderSlug>('claude');
  const [model, setModel] = useState(getDefaultModel('claude').id);
  const [topOffset, setTopOffset] = useState(NAV_HEIGHT);

  useEffect(() => {
    function calcOffset() {
      const bannerDismissed = localStorage.getItem(BANNER_KEY) === 'true';
      setTopOffset(bannerDismissed ? NAV_HEIGHT : NAV_HEIGHT + BANNER_HEIGHT);
    }
    calcOffset();
    window.addEventListener('banner-dismissed', calcOffset);
    return () => window.removeEventListener('banner-dismissed', calcOffset);
  }, []);

  function setProvider(p: ProviderSlug) {
    setProviderRaw(p);
    setModel(getDefaultModel(p).id);
  }

  return (
    <ChatState.Provider value={{ provider, model, setProvider, setModel }}>
      <div
        style={{
          position: 'fixed',
          top: topOffset,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          display: 'flex',
          background: '#030712',
          transition: 'top 0.3s ease',
        }}
      >
        {/* Sidebar */}
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

        {/* Main area */}
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
