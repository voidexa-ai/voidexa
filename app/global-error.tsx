'use client'

/**
 * Sprint 12 — root crash boundary. Fires when even the layout fails.
 * Must include its own <html>/<body> per Next.js docs.
 */

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[voidexa.global-error]', error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px',
          background: '#04060d',
          color: '#dce8f8',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          <div
            style={{
              fontSize: 14,
              color: '#ff7060',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            ⚠ CRITICAL FAILURE
          </div>
          <h1 style={{ fontSize: 26, marginTop: 12, marginBottom: 8 }}>
            voidexa hit a hard fault.
          </h1>
          <p style={{ fontSize: 16, opacity: 0.8, lineHeight: 1.5 }}>
            The whole app crashed. Try reloading. If it persists, contact{' '}
            <a href="mailto:contact@voidexa.com" style={{ color: '#00d4ff' }}>
              contact@voidexa.com
            </a>
            .
          </p>
          {error.digest && (
            <p
              style={{
                fontSize: 14,
                opacity: 0.5,
                fontFamily: 'monospace',
                margin: '12px 0 24px',
              }}
            >
              ref: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              padding: '12px 22px',
              background: '#00d4ff',
              color: '#04060d',
              border: 'none',
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: 16,
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  )
}
