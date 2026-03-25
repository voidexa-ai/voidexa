// src/components/ghost-ai/StreamingIndicator.tsx
// Animated dots shown while AI response is streaming

'use client';

export function StreamingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-gray-800 rounded-2xl w-fit mb-4">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
    </div>
  );
}
