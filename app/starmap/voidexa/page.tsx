'use client'

import { useRouter } from 'next/navigation'
import StarMapPage from '@/components/starmap/StarMapPage'

export default function VoidexaSystem() {
  const router = useRouter()
  return (
    <>
      <StarMapPage />
      <button
        onClick={() => router.push('/starmap')}
        style={{
          position: 'fixed',
          top: 80,
          left: 18,
          zIndex: 60,
          padding: '8px 16px',
          background: 'rgba(6, 8, 18, 0.72)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 212, 255, 0.35)',
          borderRadius: 6,
          color: 'rgba(255,255,255,0.92)',
          fontSize: 14,
          fontFamily: 'var(--font-inter, system-ui)',
          letterSpacing: '0.04em',
          cursor: 'pointer',
        }}
      >
        ← Back to Galaxy
      </button>
      <div style={{
        position: 'fixed',
        bottom: 10,
        right: 16,
        zIndex: 60,
        fontSize: 12,
        letterSpacing: '0.06em',
        color: 'rgba(255,255,255,0.5)',
        fontFamily: 'var(--font-inter, system-ui)',
        pointerEvents: 'none',
      }}>
        Operating globally from Denmark · CVR 46343387
      </div>
    </>
  )
}
