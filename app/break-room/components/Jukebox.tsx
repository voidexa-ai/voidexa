'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Star, Music } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  language: string;
  file: string;
  duration: string;
}

export default function Jukebox() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [tab, setTab] = useState<'danish' | 'international'>('danish');
  const [playing, setPlaying] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, { avg: number; count: number }>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch('/music/tracks.json')
      .then(r => r.json())
      .then(d => setTracks(d.tracks || []))
      .catch(() => {});
  }, []);

  const filteredTracks = tracks.filter(t => t.language === tab);

  const togglePlay = (track: Track) => {
    if (playing === track.id) {
      audioRef.current?.pause();
      setPlaying(null);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(track.file);
    audio.addEventListener('ended', () => setPlaying(null));
    audio.addEventListener('error', () => setPlaying(null));
    audio.play().catch(() => setPlaying(null));
    audioRef.current = audio;
    setPlaying(track.id);
  };

  const rateTrack = async (trackId: string, rating: number) => {
    try {
      await fetch('/api/break-room/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track_id: trackId, rating }),
      });
      setRatings(prev => ({ ...prev, [trackId]: { avg: rating, count: (prev[trackId]?.count || 0) + 1 } }));
    } catch {
      // Silent fail
    }
  };

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return (
    <section className="py-12 px-4">
      <h2 className="section-header neon-purple text-center mb-8">
        <Music className="inline mr-2" size={20} />
        JUKEBOX
      </h2>

      <div className="max-w-md mx-auto jukebox p-5">
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab('danish')}
            className={`flex-1 text-xs py-2 rounded-lg border transition-colors ${
              tab === 'danish'
                ? 'bg-purple-600/20 border-purple-500/40 text-purple-400'
                : 'border-gray-700 text-gray-500'
            }`}
          >
            Danish Tracks
          </button>
          <button
            onClick={() => setTab('international')}
            className={`flex-1 text-xs py-2 rounded-lg border transition-colors ${
              tab === 'international'
                ? 'bg-purple-600/20 border-purple-500/40 text-purple-400'
                : 'border-gray-700 text-gray-500'
            }`}
          >
            International
          </button>
        </div>

        {/* Track list */}
        <div className="space-y-2">
          {filteredTracks.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-6">
              No tracks available yet. Coming soon!
            </div>
          ) : (
            filteredTracks.map(track => (
              <div
                key={track.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-black/30 border border-gray-800 hover:border-purple-800/30 transition-colors"
              >
                <button
                  onClick={() => togglePlay(track)}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-purple-600/20 border border-purple-500/30 text-purple-400 hover:bg-purple-600/30 shrink-0"
                >
                  {playing === track.id ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{track.title}</div>
                  <div className="text-xs text-gray-500">{track.artist} &middot; {track.duration}</div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => rateTrack(track.id, star)}
                      className="p-0.5"
                    >
                      <Star
                        size={14}
                        className={
                          star <= (ratings[track.id]?.avg || 0)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-600'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <p className="text-center text-[11px] text-gray-600 mt-4">
          All music generated with SUNO AI — fictional artists
        </p>
      </div>
    </section>
  );
}
