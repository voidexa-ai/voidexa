'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import IntroVideo, { IntroVideoHandle } from '@/components/home/IntroVideo'
import QuickMenuOverlay from '@/components/home/QuickMenuOverlay'
import WebsiteCreationModal from '@/components/home/WebsiteCreationModal'
import SkipButton from '@/components/home/SkipButton'
import { computeIntroMode, shouldSkipIntro } from '@/lib/intro/preferences'
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

  const videoRef = useRef<IntroVideoHandle>(null)
  const [redirecting, setRedirecting] = useState(false)
  const [showSkip, setShowSkip] = useState(false)
  const [videoEnded, setVideoEnded] = useState(menuOnly)
  const [showOverlay, setShowOverlay] = useState(menuOnly)
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const mode = computeIntroMode({ menuOnly, skipIntro: shouldSkipIntro() })
    if (mode === 'redirect') {
      setRedirecting(true)
      router.replace('/starmap')
    }
  }, [router, menuOnly])

  const handleEnded = useCallback(() => {
    setVideoEnded((prev) => {
      if (prev) return prev
      window.setTimeout(() => setShowOverlay(true), OVERLAY_FADE_IN_DELAY_MS)
      return true
    })
  }, [])

  if (redirecting) return null

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
      {videoEnded && BACKDROP_URL && (
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
            objectFit: 'cover',
            zIndex: 2,
          }}
        />
      )}

      {!menuOnly && !videoEnded && VIDEO_URL && (
        <IntroVideo
          ref={videoRef}
          src={VIDEO_URL}
          onSkipAvailable={() => setShowSkip(true)}
          onEnded={handleEnded}
        />
      )}

      {!menuOnly && (
        <SkipButton
          elapsed={showSkip ? 999 : 0}
          hidden={videoEnded}
          onSkip={() => videoRef.current?.jumpToEnd()}
        />
      )}

      <QuickMenuOverlay
        show={showOverlay}
        checkboxChecked={checkboxChecked}
        onCheckboxChange={setCheckboxChecked}
        onWebsiteClick={() => setModalOpen(true)}
      />

      <WebsiteCreationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
