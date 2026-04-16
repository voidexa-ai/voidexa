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
import { useT, format } from '@/lib/i18n/context'
import type { Dict } from '@/lib/i18n/types'

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
  const t = useT()
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

  const translateFragment = (achievementId: string, fallback: string): string =>
    t.achievements.items[achievementId]?.titleFragment ?? fallback

  const composedTitle = useMemo(() => {
    const selected = availableFragments
      .filter(f => selectedFragments.includes(f.achievementId))
      .map(f => translateFragment(f.achievementId, f.fragment))
    return composeTitle(selected, { context })
  }, [availableFragments, selectedFragments, context, t])

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
              {t.achievements.eyebrow}
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
              {t.achievements.title}
            </h1>
            <div style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.65)',
            }}>
              {format(t.achievements.progress, { unlocked: unlockedCount, total: totalCount })}
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
              {t.achievements.closeEsc}
            </button>
          )}
        </header>

        {categories.map(cat => {
          const catAchievements = getAchievementsByCategory(cat)
          const catCompleted = catAchievements.filter(a => {
            const p = getProgress(a.id)
            return p.currentCount >= a.requiredCount
          }).length
          const catColor = CATEGORY_COLOR[cat]
          return (
            <section key={cat} style={{ marginBottom: 40 }}>
              {/* Decorative header — horizontal lines frame the title so
                  categories read as distinct chapters rather than a stack
                  of grids. */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginBottom: 18,
              }}>
                <div style={{
                  height: 1,
                  width: 28,
                  background: `linear-gradient(90deg, transparent, ${catColor}88)`,
                }} />
                <span style={{
                  fontSize: 26,
                  filter: `drop-shadow(0 0 8px ${catColor}aa)`,
                }}>{CATEGORY_ICON[cat]}</span>
                <h2 style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-space, system-ui)',
                  color: '#fff',
                  textShadow: `0 0 12px ${catColor}88`,
                }}>
                  {t.achievements.categories[cat as keyof Dict['achievements']['categories']] ?? cat}
                </h2>
                <div style={{
                  flex: 1,
                  height: 1,
                  background: `linear-gradient(90deg, ${catColor}55, transparent)`,
                }} />
                <span style={{
                  fontSize: 13,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: 'var(--font-space, monospace)',
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: `${catColor}18`,
                  border: `1px solid ${catColor}55`,
                }}>
                  {catCompleted} / {catAchievements.length} Completed
                </span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 16,
              }}>
                {catAchievements.map(a => (
                  <AchievementCard key={a.id} ach={a} progress={getProgress(a.id)} t={t} />
                ))}
              </div>
            </section>
          )
        })}

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
              {t.achievements.titleComposer}
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
              {t.achievements.preview}
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
                  {t.achievements.emptyComposer}
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
                  {t.achievements.availableFragments}
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
                        {translateFragment(f.achievementId, f.fragment)
                          .replace(/\[planet name\]/g, context?.planetName ?? 'your planet')}
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

function AchievementCard({ ach, progress, t }: { ach: Achievement; progress: AchievementProgress; t: Dict }) {
  const completed = progress.currentCount >= ach.requiredCount
  const locked = !completed && progress.currentCount === 0
  const inProgress = !completed && progress.currentCount > 0
  const tName = t.achievements.items[ach.id]?.name ?? ach.name
  const tDesc = t.achievements.items[ach.id]?.description ?? ach.description
  const tTier = t.achievements.tiers[ach.tier as keyof Dict['achievements']['tiers']] ?? ach.tier
  const tCat = t.achievements.categories[ach.category as keyof Dict['achievements']['categories']] ?? ach.category
  const pct = Math.min(100, (progress.currentCount / ach.requiredCount) * 100)
  const tierColor = TIER_COLOR[ach.tier]
  const color = completed ? tierColor : CATEGORY_COLOR[ach.category]
  const icon = ACH_ICON[ach.id] ?? '🏅'

  const completedDate = progress.completedAt
    ? new Date(progress.completedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : null

  // Rarity glow around the whole card. Visible on every state, but the
  // completed state ramps it up with a gold shimmer animation.
  const glowColor = tierColor
  const cardGlow = completed
    ? `0 0 34px ${glowColor}aa, 0 0 12px ${glowColor} inset`
    : inProgress
      ? `0 0 20px ${glowColor}55`
      : `0 0 14px ${glowColor}33`
  const borderColor = completed ? glowColor : `${glowColor}44`
  const backgroundColor = completed
    ? `linear-gradient(160deg, ${glowColor}28, rgba(6,10,18,0.92))`
    : locked
      ? 'linear-gradient(160deg, rgba(10,14,22,0.85), rgba(4,6,12,0.95))'
      : 'linear-gradient(160deg, rgba(14,18,30,0.78), rgba(6,10,18,0.92))'

  return (
    <div style={{
      padding: 18,
      background: backgroundColor,
      border: `1px solid ${borderColor}`,
      borderRadius: 14,
      boxShadow: cardGlow,
      opacity: locked ? 0.55 : 1,
      position: 'relative',
      overflow: 'hidden',
      transform: completed ? 'scale(1.02)' : 'scale(1)',
      transition: 'transform 0.2s, box-shadow 0.2s, opacity 0.2s',
    }}>
      {/* Completed gold shimmer border. Animated via the shimmer-sweep keyframe
          declared once at the end of the card tree. */}
      {completed && (
        <div aria-hidden style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 14,
          pointerEvents: 'none',
          background: `linear-gradient(115deg, transparent 40%, ${glowColor}55 50%, transparent 60%)`,
          backgroundSize: '300% 100%',
          animation: 'ach-shimmer 3.6s linear infinite',
          mixBlendMode: 'screen',
        }} />
      )}

      {completed && (
        <div style={{
          position: 'absolute',
          top: 12, right: 12,
          width: 26, height: 26,
          borderRadius: '50%',
          background: glowColor,
          color: '#0a0a0a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900,
          fontSize: 15,
          boxShadow: `0 0 16px ${glowColor}, 0 0 4px #fff`,
          zIndex: 2,
        }}>
          ✓
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        {/* Large icon with rarity-colored backing circle. */}
        <div style={{
          width: 72,
          height: 72,
          flexShrink: 0,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `radial-gradient(circle, ${glowColor}44 0%, ${glowColor}11 60%, transparent 100%)`,
          border: `1px solid ${glowColor}66`,
          boxShadow: completed ? `0 0 24px ${glowColor}aa inset, 0 0 18px ${glowColor}88` : `0 0 12px ${glowColor}44 inset`,
          fontSize: 40,
          filter: locked ? 'grayscale(0.8) brightness(0.5)' : completed ? `drop-shadow(0 0 10px ${glowColor})` : 'none',
          position: 'relative',
        }}>
          {icon}
          {locked && (
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'rgba(4,6,14,0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              color: 'rgba(255,255,255,0.6)',
            }}>
              🔒
            </div>
          )}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flexWrap: 'wrap',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: tierColor,
            fontFamily: 'var(--font-space, monospace)',
            textShadow: `0 0 8px ${tierColor}99`,
          }}>
            <span>{tTier}</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>{tCat}</span>
          </div>
          <div style={{
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            marginTop: 6,
            fontFamily: 'var(--font-space, system-ui)',
            color: '#fff',
          }}>
            {tName}
          </div>
          <div style={{
            fontSize: 14,
            color: locked ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.72)',
            marginTop: 6,
            lineHeight: 1.5,
          }}>
            {locked ? 'Complete prerequisites to unlock.' : tDesc}
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{
              height: 10,
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 999,
              overflow: 'hidden',
              border: `1px solid ${color}55`,
              position: 'relative',
            }}>
              <div style={{
                width: `${pct}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${color}99, ${color})`,
                boxShadow: `0 0 14px ${color}`,
                transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
              }} />
              {/* X / Y text overlay on the progress bar. */}
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                letterSpacing: '0.08em',
                color: '#fff',
                fontFamily: 'var(--font-space, monospace)',
                textShadow: '0 0 6px rgba(0,0,0,0.8)',
              }}>
                {progress.currentCount} / {ach.requiredCount}
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 8,
              fontSize: 12,
              color: 'rgba(255,255,255,0.6)',
              fontFamily: 'var(--font-space, monospace)',
              letterSpacing: '0.06em',
            }}>
              <span>
                {completed && completedDate
                  ? `Completed ${completedDate}`
                  : inProgress
                    ? 'In progress'
                    : ''}
              </span>
              <span style={{
                color,
                textShadow: `0 0 8px ${color}99`,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 700,
              }}>
                {completed ? t.common.unlocked : t.common.locked}
              </span>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes ach-shimmer {
          0%   { background-position: 120% 0; }
          100% { background-position: -20% 0; }
        }
      `}</style>
    </div>
  )
}
