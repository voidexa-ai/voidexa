import { Download } from 'lucide-react'

export const metadata = {
  title: 'White Paper — Ghost AI (GHAI) | Voidexa',
  description: 'Read the Ghost AI (GHAI) White Paper — infrastructure, tokenomics, and architecture.',
}

const ACCENT = '#888888'

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-16">

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <p
              className="text-sm font-semibold uppercase tracking-[0.18em] mb-3"
              style={{ color: `${ACCENT}88` }}
            >
              Ghost AI · GHAI Token
            </p>
            <h1
              className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight"
              style={{ fontFamily: 'var(--font-space)', color: '#e2e8f0' }}
            >
              Ghost AI (GHAI) White Paper
            </h1>
          </div>

          <a
            href="/GHAI_WHITE_PAPER_v1.pdf"
            download
            className="inline-flex items-center gap-2 rounded-full text-sm font-semibold shrink-0 transition-opacity hover:opacity-75"
            style={{
              background: `${ACCENT}14`,
              border: `1px solid ${ACCENT}40`,
              color: '#e2e8f0',
              padding: '10px 22px',
              whiteSpace: 'nowrap',
            }}
          >
            <Download size={14} />
            Download PDF
          </a>
        </div>

        {/* PDF viewer */}
        <div
          style={{
            borderRadius: 16,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.015)',
          }}
        >
          <iframe
            src="/GHAI_WHITE_PAPER_v1.pdf"
            title="Ghost AI White Paper"
            style={{
              display: 'block',
              width: '100%',
              height: 'calc(100vh - 260px)',
              minHeight: 600,
              border: 'none',
            }}
          />
        </div>

        {/* Fallback for browsers that block iframes */}
        <p className="mt-4 text-sm text-center" style={{ color: '#475569' }}>
          If the PDF does not render,{' '}
          <a
            href="/GHAI_WHITE_PAPER_v1.pdf"
            className="underline underline-offset-2 hover:text-[#94a3b8] transition-colors"
            style={{ color: ACCENT }}
          >
            open it directly
          </a>
          .
        </p>
      </div>
    </div>
  )
}
