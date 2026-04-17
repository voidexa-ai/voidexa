'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import { UNMUTE_PROMPT_DURATION_MS, VOICEOVER_SCRIPT } from '@/lib/cinematic/config'
import { useVoiceoverSync } from '@/hooks/useVoiceoverSync'

interface Props {
  src?: string
  elapsed: number
  enabled?: boolean
}

export interface VoiceoverHandle {
  unmute: () => void
  stop: () => void
  isMuted: () => boolean
}

const VoiceoverPlayer = forwardRef<VoiceoverHandle, Props>(function VoiceoverPlayer(
  { src = '/audio/homepage-voiceover.mp3', elapsed, enabled = true },
  ref,
) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { muted, hasInteracted, unmute, stop } = useVoiceoverSync({ audioRef, elapsed, enabled })

  useImperativeHandle(
    ref,
    () => ({
      unmute,
      stop,
      isMuted: () => muted,
    }),
    [muted, unmute, stop],
  )

  const showPrompt =
    !hasInteracted && muted && elapsed * 1000 < UNMUTE_PROMPT_DURATION_MS

  // TODO: Replace silent placeholder MP3 with Eleven Labs render of VOICEOVER_SCRIPT
  // (lib/cinematic/config.ts) — voice: Rachel/Adam, calm + warm, normalized -16 LUFS.
  void VOICEOVER_SCRIPT

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        muted
        playsInline
        aria-hidden="true"
      />
      {showPrompt && (
        <button
          type="button"
          onClick={unmute}
          style={{
            position: 'fixed',
            top: 24,
            left: 24,
            zIndex: 45,
            background: 'rgba(8,12,24,0.55)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 999,
            color: 'rgba(230,240,255,0.95)',
            padding: '10px 16px',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}
        >
          🔊 Click to unmute
        </button>
      )}
    </>
  )
})

export default VoiceoverPlayer
