'use client'

import { useEffect, useState } from 'react'
import type { StarNode } from './nodes'

interface HoverHUDProps {
  node: StarNode | null
  screenPos: { x: number; y: number } | null
  viewportWidth: number
  viewportHeight: number
}

const HUD_WIDTH = 360
const HUD_PADDING = 60
const HUD_FADE_IN_MS = 200
const HUD_FADE_OUT_MS = 150

// FIX-17 — per-node HUD content authored from real route audits.
// Title/body/cta drives the HUD panel. All 10 node ids mapped; the
// fallback path inside the component should never trigger in practice.
type HudContent = {
  title: string
  body: string
  cta: string
}

const HUD_CONTENT: Record<string, HudContent> = {
  voidexa: {
    title: 'voidexa',
    body: 'Sovereign AI Infrastructure. An ecosystem where developers, hardware builders, creators, and businesses build alongside us — from a single product to your own planet.',
    cta: '→ ENTER ECOSYSTEM',
  },
  apps: {
    title: 'Apps',
    body: 'Tools for people who think in systems. Encrypted messaging (Comlink), custom apps, automation tools — software that respects your intelligence and your privacy.',
    cta: '→ EXPLORE APPS',
  },
  quantum: {
    title: 'Quantum',
    body: 'Three AI-powered tools in one orbit. Council — 4 AIs debate and converge. Forge — describe a project, AIs debate it, Claude builds it. Void Pro AI — premium pay-per-message access to Claude, ChatGPT, Gemini.',
    cta: '→ EXPLORE QUANTUM TOOLS',
  },
  'trading-hub': {
    title: 'Trading Hub',
    body: 'AI trading systems and a live bot leaderboard. APEX Trader Core + Scalper Core run V3 regime-based trading. +194.79% backtest. Compete with your bot or watch autonomous bots trade.',
    cta: '→ ENTER HUB',
  },
  services: {
    title: 'Services',
    body: 'Custom AI development, data intelligence, and consulting. We scope it, we ship it. No retainers, no padded teams — just the work, scoped and delivered.',
    cta: '→ START A PROJECT',
  },
  'game-hub': {
    title: 'Game Hub',
    body: 'Card battle, free flight, and a living sci-fi universe. Build decks, fly your ship, explore the voidexa galaxy.',
    cta: '→ COMING SOON',
  },
  'ai-tools': {
    title: 'AI Tools',
    body: "AI that does the work. From publishing a book to launching a website — voidexa's AI tools turn conversations into finished products.",
    cta: '→ EXPLORE TOOLS',
  },
  contact: {
    title: 'Contact',
    body: "Let's build something. Tell us what you're working on. We respond within 24 hours.",
    cta: '→ GET IN TOUCH',
  },
  station: {
    title: 'Space Station',
    body: 'The content hub for the voidexa universe. Cinema, Science, and Social decks — videos, full roadmap, and the team behind the mission.',
    cta: '→ EXPLORE STATION',
  },
  'claim-your-planet': {
    title: 'Your Planet?',
    body: "Pioneer Program — 10 slots open. You're not renting a page. You're building a sovereign system inside the voidexa galaxy. Your planet, your economy, your orbit.",
    cta: '→ CLAIM YOUR PLANET',
  },
}

export default function HoverHUD({ node, screenPos, viewportWidth, viewportHeight }: HoverHUDProps) {
  const [visible, setVisible] = useState(false)
  // Cache the last hovered node + position so the HUD can fade out after the
  // hover ends without immediately disappearing.
  const [renderedNode, setRenderedNode] = useState<StarNode | null>(null)
  const [renderedPos, setRenderedPos] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (node && screenPos) {
      setRenderedNode(node)
      setRenderedPos(screenPos)
      setVisible(true)
      return
    }
    // Hover ended — fade out, then clear cached node after the transition.
    setVisible(false)
    const t = window.setTimeout(() => {
      setRenderedNode(null)
      setRenderedPos(null)
    }, HUD_FADE_OUT_MS)
    return () => window.clearTimeout(t)
  }, [node, screenPos])

  if (!renderedNode || !renderedPos) return null

  // FIX-17 — resolve per-node HUD content. Fallback covers the unlikely case
  // of a node id missing from the map (defensive only — all 10 ids mapped).
  const content: HudContent = HUD_CONTENT[renderedNode.id] ?? {
    title: renderedNode.label,
    body: renderedNode.sublabel ?? '',
    cta: '→ CLICK TO ENTER',
  }

  // Side-aware: HUD appears on SAME side as hovered planet (FIX-16) so the
  // connector line stays in the same viewport half — no scene-crossing.
  const isPlanetOnLeft = renderedPos.x < viewportWidth / 2
  const hudSide: 'left' | 'right' = isPlanetOnLeft ? 'left' : 'right'
  const hudX = hudSide === 'left'
    ? HUD_PADDING
    : viewportWidth - HUD_WIDTH - HUD_PADDING
  // Vertically anchor to planet, but clamp away from screen edges.
  const hudY = Math.min(
    Math.max(renderedPos.y - 80, HUD_PADDING),
    viewportHeight - 200,
  )

  // Connector line endpoint: edge of HUD nearest the planet.
  const lineEndX = hudSide === 'left' ? hudX + HUD_WIDTH : hudX
  const lineEndY = hudY + 60

  const fadeIn = `opacity ${HUD_FADE_IN_MS}ms ease`
  const fadeOut = `opacity ${HUD_FADE_OUT_MS}ms ease`

  return (
    <>
      {/* SVG overlay — connector line from planet to HUD edge */}
      <svg
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 50,
          opacity: visible ? 1 : 0,
          transition: visible ? fadeIn : fadeOut,
        }}
      >
        <line
          x1={renderedPos.x}
          y1={renderedPos.y}
          x2={lineEndX}
          y2={lineEndY}
          stroke="#00d4ff"
          strokeWidth={1.5}
          strokeOpacity={0.6}
        />
      </svg>

      {/* HUD panel — clean minimalistic, cyan-accented */}
      <div
        style={{
          position: 'fixed',
          left: hudX,
          top: hudY,
          width: HUD_WIDTH,
          padding: '24px 28px',
          background: 'rgba(10, 14, 28, 0.85)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          borderRadius: 8,
          boxShadow: '0 0 40px rgba(0, 212, 255, 0.15)',
          color: 'white',
          fontFamily: 'var(--font-inter, system-ui)',
          opacity: visible ? 1 : 0,
          transition: visible ? fadeIn : fadeOut,
          zIndex: 51,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: '#00d4ff',
            marginBottom: 8,
            letterSpacing: '-0.01em',
          }}
        >
          {content.title}
        </div>
        <div
          style={{
            fontSize: 14,
            color: 'rgba(255, 255, 255, 0.75)',
            lineHeight: 1.5,
            marginBottom: 16,
          }}
        >
          {content.body}
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'rgba(0, 212, 255, 0.7)',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
        >
          {content.cta}
        </div>
      </div>
    </>
  )
}
