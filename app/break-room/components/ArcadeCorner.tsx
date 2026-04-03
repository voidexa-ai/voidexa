'use client';

import { useState } from 'react';
import GameModal from './GameModal';
import { startGhaiInvaders } from '../games/ghai-invaders';
import { startGhostJump } from '../games/ghost-jump';
import { startVoidPong } from '../games/void-pong';
import { startKcpStacker } from '../games/kcp-stacker';

const GAMES = [
  {
    id: 'ghai-invaders',
    title: 'GHAI Invaders',
    description: 'Defend voidexa from bugs and exploits',
    color: '#00d4ff',
    icon: '👾',
    startFn: startGhaiInvaders,
  },
  {
    id: 'ghost-jump',
    title: 'Ghost Jump',
    description: 'Platformer across the voidexa universe',
    color: '#22c55e',
    icon: '👻',
    startFn: startGhostJump,
  },
  {
    id: 'void-pong',
    title: 'Void Pong',
    description: 'Quantum pong — ball splits after 5 hits',
    color: '#a855f7',
    icon: '🏓',
    startFn: startVoidPong,
  },
  {
    id: 'kcp-stacker',
    title: 'KCP Stacker',
    description: 'Stack and compress data blocks',
    color: '#ff6600',
    icon: '🧱',
    startFn: startKcpStacker,
  },
];

export default function ArcadeCorner() {
  const [activeGame, setActiveGame] = useState<typeof GAMES[number] | null>(null);

  return (
    <section className="py-12">
      <h2 className="section-header neon-cyan text-center mb-8">ARCADE CORNER</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto px-4">
        {GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => setActiveGame(game)}
            className="arcade-cabinet flex flex-col items-center gap-3 p-4"
            style={{ borderColor: `${game.color}33` }}
          >
            <div className="text-4xl">{game.icon}</div>
            <div
              className="pixel-font text-xs text-center"
              style={{ color: game.color }}
            >
              {game.title}
            </div>
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              {game.description}
            </p>
            <div
              className="text-xs px-3 py-1 rounded-full border"
              style={{
                color: game.color,
                borderColor: `${game.color}44`,
                background: `${game.color}11`,
              }}
            >
              PLAY
            </div>
          </button>
        ))}
      </div>

      {activeGame && (
        <GameModal
          game={activeGame.id}
          title={activeGame.title}
          onClose={() => setActiveGame(null)}
          startGame={activeGame.startFn}
        />
      )}
    </section>
  );
}
