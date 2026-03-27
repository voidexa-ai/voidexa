'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Upload, BookOpen, MessageSquare, Sword } from 'lucide-react'
import LeaderboardTab from './LeaderboardTab'
import UploadBotTab from './UploadBotTab'
import LearnTab from './LearnTab'
import ForumTab from './ForumTab'
import CompeteTab from './CompeteTab'

const ACCENT = '#cc9955'

const TABS = [
  { id: 'leaderboard', label: 'Leaderboard', Icon: Trophy },
  { id: 'upload',      label: 'Upload Bot',  Icon: Upload },
  { id: 'learn',       label: 'Learn',       Icon: BookOpen },
  { id: 'forum',       label: 'Forum',       Icon: MessageSquare },
  { id: 'compete',     label: 'Compete',     Icon: Sword },
] as const

type TabId = typeof TABS[number]['id']

export default function TradingHubTabs() {
  const [active, setActive] = useState<TabId>('leaderboard')

  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>
      {/* Tab bar — sits below the main nav (nav ~64px = top-16), lower z-index than nav (z-50) */}
      <div
        className="sticky top-16 z-20 border-b"
        style={{
          background: 'rgba(7,7,13,0.95)',
          backdropFilter: 'blur(20px)',
          borderColor: `${ACCENT}22`,
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
        }}
      >
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-0 no-scrollbar">
            {TABS.map(({ id, label, Icon }) => {
              const isActive = active === id
              return (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  className="relative flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors shrink-0"
                  style={{
                    color: isActive ? ACCENT : '#64748b',
                    fontWeight: isActive ? 500 : 400,
                    fontSize: '0.9375rem',
                  }}
                >
                  <Icon size={16} />
                  {label}
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        height: 2, background: ACCENT,
                        boxShadow: `0 0 8px ${ACCENT}`,
                      }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab content — top padding accounts for both main nav (64px) and tab bar (~52px) */}
      <div className="max-w-5xl mx-auto px-4 py-8 pt-10">
        {active === 'leaderboard' && <LeaderboardTab />}
        {active === 'upload'      && <UploadBotTab />}
        {active === 'learn'       && <LearnTab />}
        {active === 'forum'       && <ForumTab />}
        {active === 'compete'     && <CompeteTab />}
      </div>
    </div>
  )
}
