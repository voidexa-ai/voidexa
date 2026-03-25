// app/void-chat/page.tsx
// Void Chat — Main chat page (new conversation or conversation list)

'use client';

export default function ChatPage() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">Void Chat</h1>
        <p className="text-gray-400 mb-8">
          Choose a provider and start chatting. Powered by the world&apos;s best AI models, orchestrated by voidexa.
        </p>
        {/* NewChatButton + ProviderSelector goes here */}
        <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
          New Chat
        </button>
      </div>
    </div>
  );
}
