'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { setSkipIntroVideo, setSkipQuickMenu } from '@/lib/intro/preferences'
import {
  PRIMARY_CTA,
  QUICK_MENU_PANELS,
  QuickMenuPanel,
  SECONDARY_CTA,
} from '@/lib/intro/panels'

export type { QuickMenuPanel }
export { QUICK_MENU_PANELS }

const ctaBase: React.CSSProperties = {
  padding: '14px 28px',
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  borderRadius: 999,
  cursor: 'pointer',
  border: 'none',
  fontFamily: 'var(--font-sans)',
  minWidth: 220,
}

// Sprint 16 Task 4 — the video freeze-frame behind this overlay was too close
// in luminance to the old 0.35-opacity card, so copy barely read. The card is
// now a near-opaque dark slab with a 12 px blur (static overlay, 4 panels
// only — perf is fine) and a subtle cyan border.
const CARD_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  padding: '22px 24px',
  minHeight: 150,
  background: 'rgba(8, 12, 28, 0.72)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(0, 212, 255, 0.25)',
  borderRadius: 14,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(0, 180, 255, 0.05)',
  color: '#ffffff',
  cursor: 'pointer',
  transition: 'transform 0.25s ease, border-color 0.25s ease',
  textAlign: 'left',
}

interface Props {
  show: boolean
  checkboxSkipVideo: boolean
  checkboxSkipMenu: boolean
  onCheckboxSkipVideoChange: (value: boolean) => void
  onCheckboxSkipMenuChange: (value: boolean) => void
  onWebsiteClick: () => void
  onReplayVideo?: () => void
}

export default function QuickMenuOverlay({
  show,
  checkboxSkipVideo,
  checkboxSkipMenu,
  onCheckboxSkipVideoChange,
  onCheckboxSkipMenuChange,
  onWebsiteClick,
  onReplayVideo,
}: Props) {
  const router = useRouter()

  function persistPreferencesBeforeLeave() {
    if (checkboxSkipVideo) setSkipIntroVideo(true)
    if (checkboxSkipMenu) setSkipQuickMenu(true)
  }

  function handleNavigate(href: string) {
    persistPreferencesBeforeLeave()
    router.push(href)
  }

  const renderCard = (panel: QuickMenuPanel) => {
    const inner = (
      <div
        style={CARD_STYLE}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.55)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.25)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            aria-hidden
            style={{
              fontSize: 22,
              lineHeight: 1,
              width: 24,
              height: 24,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00d4ff',
              textShadow: '0 0 10px rgba(0,212,255,0.6)',
              filter: 'grayscale(1) brightness(1.6) sepia(1) hue-rotate(155deg) saturate(6)',
            }}
          >
            {panel.icon}
          </span>
          <span style={{ fontSize: 18, fontWeight: 600, color: '#ffffff', letterSpacing: '-0.01em', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
            {panel.title}
          </span>
        </div>
        <div style={{ fontSize: 16, color: '#e0e8f0', lineHeight: 1.45, opacity: 0.92, fontWeight: 400 }}>
          {panel.description}
        </div>
      </div>
    )

    if (panel.key === 'website') {
      return (
        <button
          key={panel.key}
          type="button"
          data-testid={`panel-${panel.key}`}
          onClick={onWebsiteClick}
          style={{ background: 'transparent', border: 'none', padding: 0, textAlign: 'left' }}
        >
          {inner}
        </button>
      )
    }

    return (
      <Link
        key={panel.key}
        href={panel.href ?? '/'}
        data-testid={`panel-${panel.key}`}
        onClick={(e) => {
          e.preventDefault()
          handleNavigate(panel.href ?? '/')
        }}
        style={{ textDecoration: 'none' }}
      >
        {inner}
      </Link>
    )
  }

  return (
    <div
      aria-hidden={!show}
      data-testid="quick-menu-overlay"
      style={{
        position: 'fixed', inset: 0, zIndex: 30,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 24, gap: 20,
        opacity: show ? 1 : 0,
        pointerEvents: show ? 'auto' : 'none',
        transition: 'opacity 800ms ease-out',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div className="quickmenu-grid" style={{ display: 'grid', gap: 16, width: 'min(720px, 100%)' }}>
        {QUICK_MENU_PANELS.map(renderCard)}
      </div>

      <div className="quickmenu-cta-row">
        <button
          type="button"
          data-testid="cta-free-flight"
          onClick={() => handleNavigate(PRIMARY_CTA.href)}
          data-href={PRIMARY_CTA.href}
          style={{ ...ctaBase, background: 'linear-gradient(120deg, #7fd8ff, #a78bfa)', color: '#02101e', boxShadow: '0 0 26px rgba(127,216,255,0.6), 0 0 64px rgba(167,139,250,0.4)' }}
        >{PRIMARY_CTA.label}</button>
        <button
          type="button"
          data-testid="cta-star-map"
          onClick={() => handleNavigate(SECONDARY_CTA.href)}
          data-href={SECONDARY_CTA.href}
          style={{ ...ctaBase, background: 'rgba(10, 20, 40, 0.6)', color: '#cfe6ff', border: '1px solid rgba(150, 200, 255, 0.5)', boxShadow: '0 0 14px rgba(127,216,255,0.25)' }}
        >{SECONDARY_CTA.label}</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.02em' }}>
          <input
            type="checkbox"
            data-testid="skip-video-checkbox"
            checked={checkboxSkipVideo}
            onChange={(e) => onCheckboxSkipVideoChange(e.target.checked)}
            style={{ width: 16, height: 16, cursor: 'pointer' }}
          />
          <span>Don&rsquo;t show intro video on future visits</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.02em' }}>
          <input
            type="checkbox"
            data-testid="skip-menu-checkbox"
            checked={checkboxSkipMenu}
            onChange={(e) => onCheckboxSkipMenuChange(e.target.checked)}
            style={{ width: 16, height: 16, cursor: 'pointer' }}
          />
          <span>Skip quick menu on future visits (go directly to star map)</span>
        </label>
        {onReplayVideo && (
          <button
            type="button"
            data-testid="replay-intro-link"
            onClick={onReplayVideo}
            style={{
              marginTop: 4,
              background: 'none',
              border: 'none',
              padding: 0,
              fontSize: 14,
              color: 'rgba(127,216,255,0.75)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Replay intro video
          </button>
        )}
      </div>

      <style jsx>{`
        .quickmenu-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .quickmenu-cta-row { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
        @media (max-width: 767px) {
          .quickmenu-grid { grid-template-columns: 1fr; }
          .quickmenu-cta-row { flex-direction: column; width: 100%; align-items: stretch; }
        }
      `}</style>
    </div>
  )
}
