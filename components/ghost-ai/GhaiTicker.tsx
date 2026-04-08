// components/ghost-ai/GhaiTicker.tsx
// GHAI price ticker — Coming Soon placeholder

'use client';

export function GhaiTicker() {
  return (
    <div
      className="rounded-xl space-y-3"
      style={{
        background: 'rgba(139,92,246,0.07)',
        border: '1px solid rgba(139,92,246,0.25)',
        padding: '12px 14px',
        boxShadow: '0 0 20px rgba(139,92,246,0.06)',
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', color: '#fff' }}
          >
            G
          </div>
          <span className="text-sm font-bold text-gray-200">GHAI</span>
          <span className="text-sm uppercase tracking-wider px-1.5 py-0.5 rounded-full"
            style={{ background: 'rgba(136,136,136,0.1)', color: '#888', border: '1px solid rgba(136,136,136,0.25)' }}>
            Coming Soon
          </span>
        </div>
      </div>

      {/* Coming soon message */}
      <div>
        <p className="text-sm" style={{ color: '#64748b' }}>
          The ecosystem token of voidexa
        </p>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Token details available at launch
        </p>
      </div>
    </div>
  );
}
