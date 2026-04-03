'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { submitScore, CEO_SCORES } from '../games/game-engine';

interface GameModalProps {
  game: string;
  title: string;
  onClose: () => void;
  startGame: (canvas: HTMLCanvasElement, onGameOver: (score: number) => void) => () => void;
}

export default function GameModal({ game, title, onClose, startGame }: GameModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [beatCeo, setBeatCeo] = useState(false);

  const handleGameOver = useCallback((score: number) => {
    setFinalScore(score);
    setGameOver(true);
    if (score > (CEO_SCORES[game] || Infinity)) {
      setBeatCeo(true);
    }
  }, [game]);

  useEffect(() => {
    if (canvasRef.current) {
      cleanupRef.current = startGame(canvasRef.current, handleGameOver);
    }
    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, [startGame, handleGameOver]);

  const handleSubmitScore = async () => {
    if (!playerName.trim()) return;
    await submitScore(game, playerName.trim(), finalScore);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative max-w-[520px] w-full br-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="pixel-font text-sm neon-cyan">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="game-container crt-overlay">
          <canvas ref={canvasRef} className="w-full" />
        </div>

        {/* Mobile touch hint */}
        <p className="text-center text-xs text-gray-500 mt-2 md:hidden">
          Arrows/WASD to move, Space to shoot/jump
        </p>
        <p className="text-center text-xs text-gray-500 mt-2 hidden md:block">
          Arrow keys / WASD to move &middot; Space to shoot/jump &middot; ESC to pause
        </p>

        {/* Beat the CEO banner */}
        <div className="beat-ceo-banner mt-3">
          <span className="crown-icon" />
          CEO Score: {CEO_SCORES[game]?.toLocaleString() || '???'} — Can you beat Jix?
        </div>

        {/* Game Over overlay */}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl">
            <div className="br-card p-6 text-center max-w-xs">
              {beatCeo && (
                <div className="text-yellow-400 pixel-font text-sm mb-3 animate-pulse">
                  YOU BEAT THE CEO!
                </div>
              )}
              <p className="text-xl font-bold neon-cyan mb-4">
                Score: {finalScore.toLocaleString()}
              </p>
              {!submitted ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    maxLength={20}
                    placeholder="Enter your name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full bg-black/50 border border-cyan-900/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmitScore()}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSubmitScore}
                      className="flex-1 bg-cyan-600/20 border border-cyan-500/30 rounded-lg py-2 text-sm text-cyan-400 hover:bg-cyan-600/30 transition-colors"
                    >
                      Submit Score
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 bg-gray-600/20 border border-gray-500/30 rounded-lg py-2 text-sm text-gray-400 hover:bg-gray-600/30 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-green-400 text-sm">Score submitted!</p>
                  <button
                    onClick={onClose}
                    className="w-full bg-gray-600/20 border border-gray-500/30 rounded-lg py-2 text-sm text-gray-400 hover:bg-gray-600/30 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
