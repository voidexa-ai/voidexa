export const metadata = {
  title: 'White Paper — Coming Soon | Voidexa',
  description: 'The voidexa White Paper is in progress and will be published when ready.',
}

export default function WhitePaperPage() {
  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-16 text-center">
        <h1
          className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight mb-6"
          style={{ fontFamily: 'var(--font-space)', color: '#e2e8f0' }}
        >
          White Paper — Coming Soon
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.125rem', lineHeight: 1.7 }}>
          The voidexa White Paper is currently being written and will be published here when ready.
          Check back soon for the full breakdown of our architecture, tokenomics, and roadmap.
        </p>
      </div>
    </div>
  )
}
