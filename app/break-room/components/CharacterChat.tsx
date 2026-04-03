'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';

interface CharacterInfo {
  name: string;
  title: string;
  avatar: string;
  color: string;
  id: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function CharacterChat({
  character,
  onClose,
}: {
  character: CharacterInfo;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = async () => {
    const msg = input.trim();
    if (!msg || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/break-room/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ character: character.id, message: msg }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.error || 'No response.' }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection lost. Try again.' }]);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="br-card w-full max-w-md flex flex-col" style={{ maxHeight: '80vh' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{character.avatar}</span>
            <div>
              <div className="font-bold" style={{ color: character.color }}>
                {character.name}
              </div>
              <div className="text-xs text-gray-500">{character.title}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-8">
              Say something to {character.name}...
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-cyan-900/30 text-cyan-100 rounded-br-sm'
                    : 'character-bubble'
                }`}
                style={m.role === 'assistant' ? {
                  borderColor: `${character.color}22`,
                  background: `${character.color}0d`,
                } : undefined}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="character-bubble text-gray-400 text-sm animate-pulse">
                {character.name} is typing...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={`Talk to ${character.name}...`}
              maxLength={500}
              className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="p-2 bg-cyan-600/20 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-600/30 disabled:opacity-30 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-[11px] text-gray-600 mt-1 text-center">
            Powered by AI — orchestrated by voidexa
          </p>
        </div>
      </div>
    </div>
  );
}
