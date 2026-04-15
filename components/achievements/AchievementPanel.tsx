'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ACHIEVEMENTS,
  getAchievementsByCategory,
} from '@/lib/achievements/definitions'
import {
  AchievementCategory,
  AchievementTier,
  type Achievement,
  type AchievementProgress,
} from '@/lib/achievements/types'
import {
  composeTitle,
  getAvailableTitleFragments,
  getPlayerAchievements,
  type UnlockedFragment,
} from '@/lib/achievements/tracker'
import {
  getAllProgress,
  getSelectedTitleFragments,
  saveSelectedTitleFragments,
} from '@/lib/achievements/client-progress'

const TIER_COLOR: Record<AchievementTier, string> = {
  [AchievementTier.Bronze]: '#cd7f32',
  [AchievementTier.Silver]: '#c0c0c0',
  [AchievementTier.Gold]:   '#f5b642',
}

const CATEGORY_COLOR: Record<AchievementCategory, string> = {
  [AchievementCategory.Product]:     '#00d4ff',
  [AchievementCategory.Exploration]: '#a855f7',
  [AchievementCategory.PvP]:         '#ff3355',
}

const CATEGORY_ICON: Record<AchievementCategory, string> = {
  [AchievementCategory.Product]:     '🛠',
  [AchievementCategory.Exploration]: '🛰',
  [AchievementCategory.PvP]:         '⚔',
}

const ACH_ICON: Record<string, string> = {
  'first-debate': '💬',
  'debater': '🗣',
  'quantum-master': '⚛️',
  'paper-trader': '📈',
  'trader': '💰',
  'pioneer': '🪐',
  'investor': '💳',
  'communicator': '📡',
  'explorer': '🌍',
  'archaeologist': '🗿',
  'voyager': '🧭',
  'nebula-runner': '🌌',
  'secret': '🔍',
  'station-hopper': '🛸',
  'salvager': '🪙',
  'warrior': '🗡',
  'veteran': '🎖',
  'champion': '🏆',
  'gold-ace': '🥇',
  'legend': '👑',
  'racer': '🏁',
  'speed-demon': '⚡',
  'merchant': '🤝',
}

interface Props {
  /** When true, render as a full-screen overlay (used inside Free Flight ESC menu). */
  overlay?: boolean
  onClose?: () => void
  context?: { planetName?: string }
}

export default function AchievementPanel({ overlay = false, onClose, context }: Props) {
  const [progressMap, setProgressMap] = useState<Record<string, AchievementProgress>>({})
  const [selectedFragments, setSelectedFragments] = useState<string[]>([])

  useEffect(() => {
    setProgressMap(getAllProgress())
    setSelectedFragments(getSelectedTitleFragments())
    const onVis = () => setProgressMap(getAllProgress())
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const getProgress = (id: string): AchievementProgress =>
    progressMap[id] ?? { achievementId: id, currentCount: 0, completed: false }

  const progressList: AchievementProgress[] = Object.values(progressMap)
  const completedAchievements = getPlayerAchievements(progressList)
  const availableFragments: UnlockedFragment[] = getAvailableTitleFragments(completedAchievements)

  const unlockedCount = completedAchievements.length
  const totalCount = ACHIEVEMENTS.length

  const composedTitle = useMemo(() => {
    const selected = availableFragments.filter(f => selectedFragments.includes(f.achievementId))
    return composeTitle(selected, { context })
  }, [availableFragments, selectedFragments, context])

  const toggleFragment = (achievementId: string) => {
    setSelectedFragments(prev => {
      const next = prev.includes(achievementId)
        ? prev.filter(id => id !== achievementId)
        : [...prev, achievementId]
      saveSelectedTitleFragments(next)
      return next
    })
  }

  const categories: AchievementCategory[] = [
    AchievementCategory.Product,
    AchievementCategory.Exploration,
    AchievementCategory.PvP,
  ]

  const wrapStyle: React.CSSProperties = overlay
    ? {
        position: 'fixed', inset: 0, zIndex: 75,
        background: 'rgba(2, 4, 14, 0.92)',
        backdropFilter: 'blur(14px)',
        overflowY: 'auto',
        padding: '32px 24px',
        color: '#fff',
        fontFamily: 'var(--font-inter, system-ui)',
      }
    : {
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at top, #0a1124 0%, #050813 60%, #02030a 100%)',
        color: '#fff',
        fontFamily: 'var(--font-inter, system-ui)',
        padding: '96px 32px 80px',
      }

  return (
    <div style={wrapStyle}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <header style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 28,
        }}>
          <div>
            <div style={{
              fontSize: 14,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(0,212,255,0.75)',
              fontFamily: 'var(--font-space, monospace)',
            }}>
              voidexa · Hall of Records
            </div>
            <h1 style={{
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              margin: '6px 0 10px',
              fontFamily: 'var(--font-space, system-ui)',
              background: 'linear-gradient(135deg, #fff 0%, #00d4ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Achievements
            </h1>
            <div style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.65)',
            }}>
              {unlockedCount} / {totalCount} unlocked
            </div>
          </div>
          {overlay && onClose && (
            <button
              onClick={onClose}
              style={{
                padding: '10px 22px',
                background: 'rgba(6, 10, 20, 0.65)',
                border: '1px solid rgba(0,212,255,0.35)',
                borderRadius: 999,
                color: '#fff',
                fontFamily: 'var(--font-space, monospace)',
                fontSize: 14,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                textShadow: '0 0 8px #00d4ff88',
              }}
            >
              Close · ESC
            </button>
          )}
        </header>

        {categories.map(cat => (
          <section key={cat} style={{ marginBottom: 36 }}>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 10,
              marginBottom: 14,
            }}>
              <span style={{ fontSize: 22 }}>{CATEGORY_ICON[cat]}</span>
              <h2 style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-space, system-ui)',
                color: '#fff',
                borderLeft: `3px solid ${CATEGORY_COLOR[cat]}`,
                paddingLeft: 12,
                textShadow: `0 0 10px ${CATEGORY_COLOR[cat]}66`,
              }}>
                {cat}
              </h2>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 14,
            }}>
              {getAchievementsByCategory(cat).map(a => (
                <AchievementCard key={a.id} ach={a} progress={getProgress(a.id)} />
              ))}
            </div>
          </section>
        ))}

        {/* Title composer */}
        <section style={{ marginTop: 40 }}>
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 10,
            marginBottom: 14,
          }}>
            <span style={{ fontSize: 22 }}>🏷</span>
            <h2 style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-space, system-ui)',
              color: '#fff',
              borderLeft: '3px solid #f59e0b',
              paddingLeft: 12,
              textShadow: '0 0 10px #f59e0b66',
            }}>
              Title Composer
            </h2>
          </div>

          <div style={{
            padding: '18px 22px',
            background: 'linear-gradient(160deg, rgba(14,18,30,0.8), rgba(6,10,18,0.9))',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: 12,
            boxShadow: '0 0 24px rgba(245, 158, 11, 0.15)',
          }}>
            <div style={{
              fontSize: 13,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.55)',
              fontFamily: 'var(--font-space, monospace)',
              marginBottom: 8,
            }}>
              Preview
            </div>
            <div style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '-0.005em',
              color: '#ffe7ad',
              textShadow: '0 0 14px #f59e0b88',
              fontFamily: 'var(--font-space, system-ui)',
              minHeight: '1.6em',
            }}>
              {composedTitle || (
                <span style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                  Unlock achievements to reveal title fragments.
                </span>
              )}
            </div>

            {availableFragments.length > 0 && (
              <>
                <div style={{
                  fontSize: 13,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.55)',
                  fontFamily: 'var(--font-space, monospace)',
                  marginTop: 18,
                  marginBottom: 10,
                }}>
                  Available Fragments · tap to toggle
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {availableFragments.map(f => {
                    const active = selectedFragments.includes(f.achievementId)
                    return (
                      <button
                        key={f.achievementId}
                        onClick={() => toggleFragment(f.achievementId)}
                        style={{
                          padding: '8px 14px',
                          background: active
                            ? 'linear-gradient(135deg, rgba(245,158,11,0.35), rgba(245,158,11,0.2))'
                            : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${active ? 'rgba(245,158,11,0.7)' : 'rgba(255,255,255,0.14)'}`,
                          borderRadius: 999,
                          color: active ? '#fff' : 'rgba(255,255,255,0.75)',
                          fontFamily: 'var(--font-space, system-ui)',
                          fontSize: 14,
                          cursor: 'pointer',
                          textShadow: active ? '0 0 8px #f59e0b' : 'none',
                          boxShadow: active ? '0 0 14px rgba(245,158,11,0.35)' : 'none',
                        }}
                      >
                        {f.fragment.replace(/\[planet name\]/g, context?.planetName ?? 'your planet')}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function AchievementCard({ ach, progress }: { ach: Achievement; progress: AchievementProgress }) {
  const completed = progress.currentCount >= ach.requiredCount
  const pct = Math.min(100, (progress.currentCount / ach.requiredCount) * 100)
  const color = completed
    ? TIER_COLOR[ach.tier]
    : CATEGORY_COLOR[ach.category]
  const icon = ACH_ICON[ach.id] ?? '🏅'
  return (
    <div style={{
      padding: 14,
      background: completed
        ? `linear-gradient(160deg, ${color}22, rgba(6,10,18,0.9))`
        : 'linear-gradient(160deg, rgba(14,18,30,0.75), rgba(6,10,18,0.9))',
      border: `1px solid ${completed ? color : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 10,
      boxShadow: completed ? `0 0 20px ${color}55` : 'none',
      opacity: completed ? 1 : 0.82,
      position: 'relative',
      transition: 'all 0.2s',
    }}>
      {completed && (
        <div style={{
          position: 'absolute',
          top: 10, right: 10,
          width: 22, height: 22,
          borderRadius: '50%',
          background: color,
          color: '#0a0a0a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900,
          fontSize: 14,
          boxShadow: `0 0 12px ${color}`,
        }}>
          ✓
        </div>
      )}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{
          fontSize: 28,
          filter: completed ? `drop-shadow(0 0 10px ${color})` : 'grayscale(0.6)',
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flexWrap: 'wrap',
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: TIER_COLOR[ach.tier],
            fontFamily: 'var(--font-space, monospace)',
            textShadow: `0 0 6px ${TIER_COLOR[ach.tier]}77`,
          }}>
            <span>{ach.tier}</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>{ach.category}</span>
          </div>
          <div style={{
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            marginTop: 4,
            fontFamily: 'var(--font-space, system-ui)',
            color: '#fff',
          }}>
            {ach.name}
          </div>
          <div style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.65)',
            marginTop: 4,
            lineHeight: 1.45,
          }}>
            {ach.description}
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{
              height: 6,
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 999,
              overflow: 'hidden',
              border: `1px solid ${color}33`,
            }}>
              <div style={{
                width: `${pct}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                boxShadow: `0 0 10px ${color}`,
                transition: 'width 0.3s',
              }} />
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 4,
              fontSize: 12,
              color: 'rgba(255,255,255,0.55)',
              fontFamily: 'var(--font-space, monospace)',
              letterSpacing: '0.05em',
            }}>
              <span>{progress.currentCount} / {ach.requiredCount}</span>
              <span style={{
                color,
                textShadow: `0 0 6px ${color}77`,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                {completed ? 'Unlocked' : 'Locked'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
