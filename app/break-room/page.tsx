'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import './styles/break-room.css';
import ArcadeCorner from './components/ArcadeCorner';
import AILounge from './components/AILounge';
import Jukebox from './components/Jukebox';
import YouTubeLounge from './components/YouTubeLounge';
import Leaderboard from './components/Leaderboard';
import { X } from 'lucide-react';

type Section = 'arcade' | 'lounge' | 'jukebox' | 'youtube' | null;

const HOTSPOTS: {
  id: Section & string;
  label: string;
  tooltip: string;
  // percentage-based coords over the background image
  left: string; top: string; width: string; height: string;
  color: string;
}[] = [
  {
    id: 'arcade',
    label: 'ARCADE',
    tooltip: 'Play retro games',
    left: '1%', top: '8%', width: '33%', height: '82%',
    color: '#00d4ff',
  },
  {
    id: 'lounge',
    label: 'AI LOUNGE',
    tooltip: 'Chat with the AI crew',
    left: '28%', top: '28%', width: '34%', height: '65%',
    color: '#a855f7',
  },
  {
    id: 'youtube',
    label: 'WATCH',
    tooltip: 'YouTube lounge',
    left: '53%', top: '8%', width: '20%', height: '50%',
    color: '#ff6600',
  },
  {
    id: 'jukebox',
    label: 'JUKEBOX',
    tooltip: 'Listen to music',
    left: '73%', top: '8%', width: '26%', height: '85%',
    color: '#a855f7',
  },
];

export default function BreakRoomPage() {
  const [activeSection, setActiveSection] = useState<Section>(null);

  const closeSection = useCallback(() => setActiveSection(null), []);

  return (
    <div className="break-room-immersive">
      {/* Fullscreen background image */}
      <div className="br-bg-container">
        <Image
          src="/images/breakroom_chat_gpt.png"
          alt="The Break Room"
          fill
          priority
          className="br-bg-image"
          sizes="100vw"
        />
        {/* Dark overlay for readability */}
        <div className="br-bg-overlay" />

        {/* Title - floating on top */}
        <div className="br-title-float">
          <h1 className="pixel-font neon-cyan">THE BREAK ROOM</h1>
          <p>Click a zone to explore</p>
        </div>

        {/* Leaderboard toggle - floating bottom right */}
        <div className="br-leaderboard-toggle">
          <button
            onClick={() => setActiveSection(activeSection === 'arcade' ? null : 'arcade')}
            className="br-float-btn"
          >
            🏆 Leaderboard
          </button>
        </div>

        {/* Hotspot zones */}
        {HOTSPOTS.map((spot) => (
          <button
            key={spot.id}
            onClick={() => setActiveSection(spot.id as Section)}
            className="br-hotspot"
            style={{
              left: spot.left,
              top: spot.top,
              width: spot.width,
              height: spot.height,
              '--hotspot-color': spot.color,
            } as React.CSSProperties}
          >
            <span className="br-hotspot-label pixel-font" style={{ color: spot.color }}>
              {spot.label}
            </span>
            <span className="br-hotspot-tooltip">{spot.tooltip}</span>
          </button>
        ))}
      </div>

      {/* Section overlays */}
      {activeSection && (
        <div className="br-overlay-backdrop" onClick={closeSection}>
          <div
            className="br-overlay-panel"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button onClick={closeSection} className="br-overlay-close">
              <X size={24} />
            </button>

            {/* Content */}
            <div className="br-overlay-content">
              {activeSection === 'arcade' && (
                <>
                  <ArcadeCorner />
                  <Leaderboard />
                </>
              )}
              {activeSection === 'lounge' && <AILounge />}
              {activeSection === 'jukebox' && <Jukebox />}
              {activeSection === 'youtube' && <YouTubeLounge />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
