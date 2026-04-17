'use client'

/**
 * Sprint 12 — top-level error boundary for routed errors.
 * See https://nextjs.org/docs/app/api-reference/file-conventions/error
 */

import { useEffect } from 'react'
import Link from 'next/link'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to console; future: ship to Sentry / posthog
    console.error('[voidexa.error]', error)
  }, [error])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        background: 'linear-gradient(180deg, #04060d 0%, #06091a 100%)',
        color: '#dce8f8',
        fontFamily: 'var(--font-inter, system-ui)',
      }}
    >
      <div
        style={{
          maxWidth: 540,
          width: '100%',
          padding: '36px 32px',
          background: 'rgba(8, 14, 28, 0.7)',
          border: '1px solid rgba(255, 80, 80, 0.4)',
          borderRadius: 14,
          backdropFilter: 'blur(14px)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 14,
            color: '#ff7060',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            opacity: 0.9,
          }}
        >
          ⚠ Reactor Misalignment
        </div>
        <h1
          style={{
            fontSize: 28,
            margin: '12px 0 6px',
            fontFamily: 'var(--font-space, system-ui)',
            fontWeight: 700,
          }}
        >
          Something went sideways.
        </h1>
        <p style={{ fontSize: 16, opacity: 0.8, lineHeight: 1.5, margin: '0 0 24px' }}>
          The page hit an unexpected error. The flight recorder logged it; you can try
          again, or head back to a known-stable orbit.
        </p>

        {error.digest && (
          <p
            style={{
              fontSize: 14,
              opacity: 0.55,
              fontFamily: 'monospace',
              margin: '0 0 24px',
            }}
          >
            ref: {error.digest}
          </p>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: '12px 22px',
              background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
              color: '#04060d',
              border: 'none',
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 0 28px rgba(0, 212, 255, 0.35)',
            }}
          >
            Try again
          </button>
          <Link
            href="/"
            style={{
              padding: '12px 22px',
              background: 'rgba(0, 20, 40, 0.6)',
              color: '#00d4ff',
              border: '1px solid rgba(0, 212, 255, 0.5)',
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            ← Home
          </Link>
        </div>
      </div>
    </div>
  )
}
