'use client'

/**
 * Sprint 11 — banner shown on desktop-first surfaces (Free Flight, editors)
 * when the user is on a touch device. Dismissible per-session.
 */

import { useState } from 'react'
import { useIsTouch } from '@/lib/ui/isTouch'

interface Props {
  /** Short reason — e.g. "Free Flight needs a keyboard + mouse." */
  reason: string
  /** Optional CTA href — e.g. "/" to bounce back home. */
  fallbackHref?: string
  fallbackLabel?: string
}

export default function DesktopOnlyNotice({ reason, fallbackHref, fallbackLabel }: Props) {
  const isTouch = useIsTouch()
  const [dismissed, setDismissed] = useState(false)
  if (!isTouch || dismissed) return null

  return (
    <div
      role="status"
      style={{
        position: 'fixed',
        top: 12,
        left: 12,
        right: 12,
        zIndex: 200,
        padding: '12px 16px',
        background: 'rgba(8, 14, 28, 0.94)',
        border: '1px solid rgba(255, 186, 96, 0.5)',
        borderRadius: 10,
        backdropFilter: 'blur(10px)',
        color: '#ffd6a0',
        fontSize: 14,
        lineHeight: 1.45,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
        boxShadow: '0 8px 28px rgba(0,0,0,0.4)',
      }}
    >
      <span style={{ flex: '1 1 auto' }}>
        <strong style={{ color: '#ffba60' }}>Best on desktop —</strong> {reason}
      </span>
      <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {fallbackHref && (
          <a
            href={fallbackHref}
            style={{
              color: '#00d4ff',
              fontSize: 14,
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >
            {fallbackLabel ?? 'Go back'}
          </a>
        )}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss notice"
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff',
            borderRadius: 6,
            padding: '4px 10px',
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          ✕
        </button>
      </span>
    </div>
  )
}
