'use client';

import { useState } from 'react';
import { Monitor, X } from 'lucide-react';

const DEFAULT_VIDEO_ID = 'dQw4w9WgXcQ'; // Placeholder — replace with voidexa content

export default function YouTubeLounge() {
  const [open, setOpen] = useState(false);

  return (
    <section className="py-12 px-4">
      <h2 className="section-header neon-orange text-center mb-8">
        <Monitor className="inline mr-2" size={20} />
        YOUTUBE LOUNGE
      </h2>

      <div className="max-w-md mx-auto">
        {/* Laptop prop */}
        <button
          onClick={() => setOpen(true)}
          className="w-full group"
        >
          <div className="laptop-frame">
            <div className="bg-black rounded-lg aspect-video flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <Monitor size={48} className="text-gray-600 mx-auto mb-2 group-hover:text-cyan-400 transition-colors" />
                <p className="text-sm text-gray-500 group-hover:text-gray-300 transition-colors">
                  Click to watch
                </p>
              </div>
            </div>
          </div>
          <div className="laptop-base" />
        </button>

        <p className="text-center text-xs text-gray-500 mt-3">
          Curated AI & tech content
        </p>
      </div>

      {/* Video modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="br-card w-full max-w-2xl">
            <div className="flex items-center justify-between p-3 border-b border-gray-800">
              <span className="text-sm text-gray-400">YouTube Lounge</span>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${DEFAULT_VIDEO_ID}?autoplay=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
