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
    <div className="min-h-screen" style={{ background: '#07070d' }}>
      {/* Tab bar */}
      <div
        className="sticky top-0 z-30 border-b"
        style={{
          background: 'rgba(7,7,13,0.95)',
          backdropFilter: 'blur(20px)',
          borderColor: `${ACCENT}22`,
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
                  className="relative flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition-colors shrink-0"
                  style={{
                    color: isActive ? ACCENT : '#64748b',
                    fontWeight: isActive ? 500 : 400,
                    fontSize: '0.9375rem',
                  }}
                >
                  <Icon size={15} />
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

      {/* Tab content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {active === 'leaderboard' && <LeaderboardTab />}
        {active === 'upload'      && <UploadBotTab />}
        {active === 'learn'       && <LearnTab />}
        {active === 'forum'       && <ForumTab />}
        {active === 'compete'     && <CompeteTab />}
      </div>
    </div>
  )
}
