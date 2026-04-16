export const metadata = {
  title: 'White Paper — Coming Soon | Voidexa',
  description: 'The GHAI White Paper is being prepared for MiCA compliance.',
}

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-16 text-center">
        <p
          className="text-sm font-semibold uppercase tracking-[0.18em] mb-3"
          style={{ color: 'rgba(136,136,136,0.53)' }}
        >
          voidexa
        </p>
        <h1
          className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight mb-6"
          style={{ fontFamily: 'var(--font-space)', color: '#e2e8f0' }}
        >
          White Paper — Coming Soon
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.125rem', lineHeight: 1.7 }}>
          We are preparing the GHAI white paper ahead of regulatory review.
          It will cover architecture, the platform economy, and the full voidexa roadmap.
          Check back soon.
        </p>
      </div>
    </div>
  )
}
