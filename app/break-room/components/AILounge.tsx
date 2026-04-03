'use client';

import { useState, useEffect } from 'react';
import CharacterChat from './CharacterChat';
import { CLAUDE_INFO } from '../prompts/claude';
import { GPT_INFO } from '../prompts/gpt';
import { GEMINI_INFO } from '../prompts/gemini';
import { PERPLEXITY_INFO } from '../prompts/perplexity';
import { LLAMA_INFO } from '../prompts/llama';
import { JIX_INFO } from '../prompts/jix';

const ALL_CHARACTERS = [
  { ...CLAUDE_INFO, id: 'claude' },
  { ...GPT_INFO, id: 'gpt' },
  { ...GEMINI_INFO, id: 'gemini' },
  { ...PERPLEXITY_INFO, id: 'perplexity' },
  { ...LLAMA_INFO, id: 'llama' },
  { ...JIX_INFO, id: 'jix' },
];

function pickCharacters() {
  // 2-3 random characters, Jix has 10% chance
  const pool = ALL_CHARACTERS.filter(c => c.id !== 'jix');
  const shuffled = pool.sort(() => Math.random() - 0.5);
  const count = Math.random() > 0.5 ? 3 : 2;
  const picked = shuffled.slice(0, count);
  if (Math.random() < 0.1) {
    picked[picked.length - 1] = ALL_CHARACTERS.find(c => c.id === 'jix')!;
  }
  return picked;
}

export default function AILounge() {
  const [characters, setCharacters] = useState<typeof ALL_CHARACTERS>([]);
  const [chatWith, setChatWith] = useState<typeof ALL_CHARACTERS[number] | null>(null);

  useEffect(() => {
    setCharacters(pickCharacters());
  }, []);

  return (
    <section className="py-12 px-4">
      <h2 className="section-header neon-cyan text-center mb-8">AI LOUNGE</h2>
      <p className="text-center text-gray-400 text-sm mb-8 max-w-lg mx-auto">
        The AI team is hanging out. Click a character to chat with them in-persona.
      </p>

      <div className="flex justify-center gap-6 flex-wrap max-w-3xl mx-auto">
        {characters.map(char => (
          <button
            key={char.id}
            onClick={() => setChatWith(char)}
            className="br-card p-5 flex flex-col items-center gap-3 w-40 hover:scale-105 transition-transform"
            style={{ borderColor: `${char.color}22` }}
          >
            <div className="text-4xl">{char.avatar}</div>
            <div className="font-bold text-sm" style={{ color: char.color }}>
              {char.name}
            </div>
            <div className="text-xs text-gray-500">{char.title}</div>
            <div className="character-bubble text-xs mt-2" style={{
              borderColor: `${char.color}22`,
              background: `${char.color}08`,
            }}>
              {char.quips[Math.floor(Math.random() * char.quips.length)]}
            </div>
          </button>
        ))}
      </div>

      {chatWith && (
        <CharacterChat
          character={chatWith}
          onClose={() => setChatWith(null)}
        />
      )}
    </section>
  );
}
