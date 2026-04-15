import Link from 'next/link'
import { da } from '@/lib/i18n/da'

export const metadata = {
  title: da.notFound.title,
  robots: { index: false, follow: false },
}

/**
 * Danish 404 page — triggered when any `/dk/*` route isn't matched.
 * Renders Danish-only copy directly from `lib/i18n/da.ts` so the text stays
 * in sync with the rest of the Danish dictionary.
 */
export default function NotFoundDk() {
  return (
    <main
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        color: '#e5f7fa',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: 14,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(103,232,249,0.7)',
          marginBottom: 16,
        }}
      >
        {da.notFound.title}
      </div>

      <h1
        style={{
          fontSize: 40,
          fontWeight: 700,
          margin: '0 0 12px',
          color: '#67e8f9',
          textShadow: '0 0 24px rgba(103,232,249,0.4)',
        }}
      >
        {da.notFound.message}
      </h1>

      <p style={{ fontSize: 16, color: 'rgba(229,247,250,0.7)', maxWidth: 480, margin: '0 0 32px' }}>
        Ruten findes ikke på det danske site. Prøv en af hovedruterne nedenfor, eller vend tilbage
        til forsiden.
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/dk"
          style={{
            padding: '12px 24px',
            borderRadius: 8,
            background: 'rgba(34,211,238,0.15)',
            border: '1px solid rgba(34,211,238,0.55)',
            color: '#67e8f9',
            fontSize: 16,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          {da.notFound.backHome}
        </Link>
        <Link
          href="/dk/starmap"
          style={{
            padding: '12px 24px',
            borderRadius: 8,
            background: 'transparent',
            border: '1px solid rgba(229,247,250,0.3)',
            color: 'rgba(229,247,250,0.85)',
            fontSize: 16,
            textDecoration: 'none',
          }}
        >
          Åbn stjernekortet
        </Link>
      </div>
    </main>
  )
}
