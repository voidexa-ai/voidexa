// components/ghost-ai/DepositModal.tsx
// GHAI deposit — coming soon placeholder

'use client';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (amount: number) => void;
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">GHAI Deposits</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">&times;</button>
        </div>

        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full"
            style={{ background: 'rgba(136,136,136,0.1)', border: '1px solid rgba(136,136,136,0.25)' }}>
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: '#888' }}>
              Coming Soon
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            GHAI token deposits are not yet available.
            Join the waitlist to be notified when token payments go live.
          </p>
          <a
            href="/ghost-ai"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.35)', color: '#c4b5fd' }}
          >
            Join Waitlist
          </a>
        </div>
      </div>
    </div>
  );
}
