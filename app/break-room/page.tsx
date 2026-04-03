'use client';

import './styles/break-room.css';
import AILounge from './components/AILounge';
import ArcadeCorner from './components/ArcadeCorner';
import Jukebox from './components/Jukebox';
import YouTubeLounge from './components/YouTubeLounge';
import Leaderboard from './components/Leaderboard';

export default function BreakRoomPage() {
  return (
    <div className="break-room min-h-screen pt-24 pb-16">
      {/* Hero */}
      <div className="text-center px-4 mb-8">
        <h1 className="pixel-font text-2xl md:text-3xl neon-cyan mb-3">
          THE BREAK ROOM
        </h1>
        <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
          Where the AI team hangs out. Chat with characters, play retro games,
          listen to music, and chill in the void.
        </p>
      </div>

      {/* AI Lounge */}
      <AILounge />

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      </div>

      {/* Arcade Corner */}
      <ArcadeCorner />

      {/* Leaderboard */}
      <Leaderboard />

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      </div>

      {/* Jukebox + YouTube side by side on desktop */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-0">
        <Jukebox />
        <YouTubeLounge />
      </div>
    </div>
  );
}
