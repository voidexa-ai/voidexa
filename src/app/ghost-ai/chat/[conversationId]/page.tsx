// src/app/ghost-ai/chat/[conversationId]/page.tsx
// Ghost AI Chat — Specific conversation view

'use client';

import { useParams } from 'next/navigation';

export default function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>();

  return (
    <div className="flex-1 flex flex-col">
      {/* ChatArea component goes here */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Messages render here */}
        <p className="text-gray-500 text-center">
          Loading conversation {conversationId}...
        </p>
      </div>

      {/* ChatInput component goes here */}
      <div className="border-t border-gray-800 p-4">
        {/* ChatInput goes here */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
          <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
