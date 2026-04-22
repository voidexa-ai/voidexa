'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import IntroVideo, { IntroVideoHandle } from '@/components/home/IntroVideo'
import QuickMenuOverlay from '@/components/home/QuickMenuOverlay'
import WebsiteCreationModal from '@/components/home/WebsiteCreationModal'
import AudioGatePopup from '@/components/home/AudioGatePopup'
import SkipButton from '@/components/home/SkipButton'
import {
  computeIntroMode,
  getAudioPreference,
  hasAnsweredAudioGateThisSession,
  hasSeenIntroThisSession,
  markAudioGateAnsweredThisSession,
  markIntroSeenThisSession,
  setAudioPreference,
  shouldSkipIntroVideo,
  shouldSkipQuickMenu,
  type AudioPreference,
} from '@/lib/intro/preferences'
import { OVERLAY_FADE_IN_DELAY_MS } from '@/lib/intro/panels'

const VIDEO_URL = (process.env.NEXT_PUBLIC_INTRO_VIDEO_URL ?? '').trim()
const BACKDROP_URL = (process.env.NEXT_PUBLIC_INTRO_BACKDROP_URL ?? '').trim()

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomePageInner />
    </Suspense>
  )
}

function HomePageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const menuOnly = searchParams?.get('menu') === 'true'
  const replay = searchParams?.get('replay') === 'video'

  const videoRef = useRef<IntroVideoHandle>(null)
  const [stage, setStage] = useState<'loading' | 'audio-gate' | 'video' | 'menu' | 'redirect'>('loading')
  const [audioPref, setAudioPrefState] = useState<AudioPreference>(null)
  const [showSkip, setShowSkip] = useState(false)
  const [checkboxSkipVideo, setCheckboxSkipVideo] = useState(false)
  const [checkboxSkipMenu, setCheckboxSkipMenu] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const mode = computeIntroMode({
      menuOnly,
      skipVideo: shouldSkipIntroVideo(),
      skipQuickMenu: shouldSkipQuickMenu(),
      sessionSeen: hasSeenIntroThisSession(),
    })

    // Replay link bypasses session flag + preferences to play the video again.
    if (replay) {
      setAudioPrefState(getAudioPreference() ?? 'enabled')
      setStage('video')
      return
    }

    if (mode === 'redirect') {
      setStage('redirect')
      router.replace('/starmap')
      return
    }
    if (mode === 'menu-only' || mode === 'quick-menu') {
      setStage('menu')
      return
    }
    // mode === 'video' — show audio gate once per browser session. The stored
    // preference (voidexaAudioPreference) stays as a smart default for the
    // gate's Yes/No highlight, but the gate itself re-asks every session.
    if (!hasAnsweredAudioGateThisSession()) {
      setStage('audio-gate')
    } else {
      setAudioPrefState(getAudioPreference() ?? 'muted')
      setStage('video')
    }
  }, [router, menuOnly, replay])

  const handleAudioChoice = useCallback((choice: 'enabled' | 'muted') => {
    setAudioPreference(choice)
    markAudioGateAnsweredThisSession()
    setAudioPrefState(choice)
    setStage('video')
  }, [])

  const handleEnded = useCallback(() => {
    markIntroSeenThisSession()
    window.setTimeout(() => setStage('menu'), OVERLAY_FADE_IN_DELAY_MS)
  }, [])

  if (stage === 'loading' || stage === 'redirect') return null

  const videoMuted = audioPref !== 'enabled'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#02060f',
      }}
    >
      {stage === 'menu' && BACKDROP_URL && (
        <img
          src={BACKDROP_URL}
          alt=""
          aria-hidden
          data-testid="intro-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'contain',
            zIndex: 2,
          }}
        />
      )}

      {stage === 'audio-gate' && (
        <AudioGatePopup onChoose={handleAudioChoice} defaultChoice={getAudioPreference()} />
      )}

      {stage === 'video' && VIDEO_URL && (
        <IntroVideo
          ref={videoRef}
          src={VIDEO_URL}
          initialMuted={videoMuted}
          onSkipAvailable={() => setShowSkip(true)}
          onEnded={handleEnded}
        />
      )}

      {stage === 'video' && (
        <SkipButton
          elapsed={showSkip ? 999 : 0}
          hidden={false}
          onSkip={() => videoRef.current?.jumpToEnd()}
        />
      )}

      <QuickMenuOverlay
        show={stage === 'menu'}
        checkboxSkipVideo={checkboxSkipVideo}
        checkboxSkipMenu={checkboxSkipMenu}
        onCheckboxSkipVideoChange={setCheckboxSkipVideo}
        onCheckboxSkipMenuChange={setCheckboxSkipMenu}
        onWebsiteClick={() => setModalOpen(true)}
        onReplayVideo={() => {
          setShowSkip(false)
          setStage('video')
        }}
      />

      <WebsiteCreationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
