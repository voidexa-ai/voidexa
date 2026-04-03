'use client';

import { useState, useEffect } from 'react';
import { Trophy, ChevronDown } from 'lucide-react';
import { CEO_SCORES } from '../games/game-engine';

interface Score {
  player_name: string;
  score: number;
  created_at: string;
}

const GAMES = [
  { id: 'ghai-invaders', label: 'GHAI Invaders' },
  { id: 'ghost-jump', label: 'Ghost Jump' },
  { id: 'void-pong', label: 'Void Pong' },
  { id: 'kcp-stacker', label: 'KCP Stacker' },
];

export default function Leaderboard() {
  const [game, setGame] = useState('ghai-invaders');
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/break-room/highscore?game=${game}`)
      .then(r => r.json())
      .then(d => { setScores(d.scores || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [game]);

  const ceoScore = CEO_SCORES[game] || 0;

  return (
    <section className="py-12 px-4">
      <button
        onClick={() => setOpen(!open)}
        className="section-header neon-purple flex items-center gap-2 mx-auto mb-6"
      >
        <Trophy size={20} />
        LEADERBOARD
        <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="max-w-md mx-auto br-card p-4">
          {/* Game selector */}
          <div className="flex flex-wrap gap-2 mb-4">
            {GAMES.map(g => (
              <button
                key={g.id}
                onClick={() => setGame(g.id)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  game === g.id
                    ? 'bg-purple-600/20 border-purple-500/40 text-purple-400'
                    : 'border-gray-700 text-gray-500 hover:text-gray-300'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* CEO Score */}
          <div className="beat-ceo-banner mb-3">
            <span className="crown-icon" />
            CEO Jix: {ceoScore.toLocaleString()}
          </div>

          {/* Scores */}
          {loading ? (
            <div className="text-center text-gray-500 py-8 text-sm">Loading...</div>
          ) : scores.length === 0 ? (
            <div className="text-center text-gray-500 py-8 text-sm">
              No scores yet. Be the first!
            </div>
          ) : (
            <div className="space-y-0">
              {scores.map((s, i) => (
                <div key={i} className="leaderboard-row">
                  <span className="flex items-center gap-2">
                    <span className="w-5 text-right opacity-60">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                    </span>
                    <span>{s.player_name}</span>
                    {s.score > ceoScore && <span title="Beat the CEO!">👑</span>}
                  </span>
                  <span className="font-mono">{s.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
