'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import WalletBar from '@/components/quantum/WalletBar'

export interface WalletTransaction {
  id: string
  type: string
  amount_usd: number | string
  description: string | null
  stripe_session_id: string | null
  balance_after: number | string | null
  created_at: string
}

interface WalletPageClientProps {
  email: string
  balance: number | string
  totalDeposited: number | string
  totalSpent: number | string
  transactions: WalletTransaction[]
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 16,
  padding: '24px',
}

function fmt(v: number | string | null): string {
  const n = typeof v === 'string' ? parseFloat(v) : v
  if (n == null || Number.isNaN(n)) return '0.00'
  return n.toFixed(2)
}

function typeLabel(t: string): string {
  if (t === 'deposit') return 'Top-up'
  if (t === 'deduction') return 'Usage'
  if (t === 'refund') return 'Refund'
  return t.charAt(0).toUpperCase() + t.slice(1)
}

export default function WalletPageClient({
  email, balance, totalDeposited, totalSpent, transactions,
}: WalletPageClientProps) {
  const balanceNum = typeof balance === 'string' ? parseFloat(balance) : balance
  const hasBalance = balanceNum > 0

  const pathname = usePathname()
  const isDanish = pathname?.startsWith('/dk/') ?? false

  const ghaiScope = isDanish
    ? {
        heading: 'Hvad kan jeg bruge GHAI til?',
        canUseLabel: 'GHAI kan bruges til:',
        canUse: [
          'In-game kosmetiske pakker (booster packs, ship skins, pilot avatars)',
          'Pay-per-use AI-tjenester (Void Pro AI sessions, Quantum Chat debates)',
          'Wallet top-up via Stripe ($5 / $10 / $25 / $50)',
        ],
        cannotUseLabel: 'GHAI kan IKKE bruges til:',
        cannotUse: [
          'Fysiske produkter (AEGIS Monitor, Comlink Node, Website Builder, AI Consulting)',
          'Abonnement',
          'Trading bot gebyrer',
        ],
        trailingPre: 'Til fysiske produkter, se ',
        trailingPost: ' — betaling i DKK/EUR via Stripe.',
      }
    : {
        heading: 'What can I use GHAI for?',
        canUseLabel: 'GHAI can be used for:',
        canUse: [
          'In-game cosmetic packs (booster packs, ship skins, pilot avatars)',
          'Pay-per-use AI services (Void Pro AI sessions, Quantum Chat debates)',
          'Wallet top-ups via Stripe ($5 / $10 / $25 / $50 tiers)',
        ],
        cannotUseLabel: 'GHAI cannot be used for:',
        cannotUse: [
          'Real-world products (AEGIS Monitor, Comlink Node, Website Builder, AI Consulting)',
          'Subscription billing',
          'Trading bot fees',
        ],
        trailingPre: 'For real-world products, see ',
        trailingPost: ' — payment in DKK/EUR via Stripe.',
      }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-sm font-medium uppercase tracking-widest mb-2" style={{ color: '#334155' }}>Your account</p>
          <h1 className="text-3xl font-bold text-[#e2e8f0] mb-2" style={{ fontFamily: 'var(--font-space)' }}>
            Wallet
          </h1>
          <p className="text-sm mb-8" style={{ color: '#64748b' }}>
            Signed in as <span style={{ color: '#94a3b8' }}>{email}</span>
          </p>
        </motion.div>

        <div className="space-y-4">
          {/* Balance + top-up control */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            style={cardStyle}
            data-testid="wallet-balance-card"
          >
            <h2 className="text-sm font-semibold text-[#e2e8f0] mb-4">Balance</h2>
            <WalletBar />

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <p className="text-sm uppercase tracking-wider mb-1" style={{ color: '#7a8a9e' }}>Total deposited</p>
                <p className="text-base font-semibold" style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>
                  ${fmt(totalDeposited)}
                </p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-wider mb-1" style={{ color: '#7a8a9e' }}>Total spent</p>
                <p className="text-base font-semibold" style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>
                  ${fmt(totalSpent)}
                </p>
              </div>
            </div>

            {!hasBalance && (
              <p className="text-sm mt-4" style={{ color: '#94a3b8' }}>
                New to voidexa credit? Read the{' '}
                <a href="/ghost-ai" className="underline" style={{ color: '#00d4ff' }}>
                  GHAI explainer
                </a>{' '}
                to see how top-ups power Quantum chat and in-game purchases.
              </p>
            )}
          </motion.div>

          {/* GHAI scope clarification */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.075 }}
            style={cardStyle}
            data-testid="ghai-scope-clarification"
            data-locale={isDanish ? 'da' : 'en'}
          >
            <h2 className="text-sm font-semibold text-[#e2e8f0] mb-4">{ghaiScope.heading}</h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
              <div>
                <p className="mb-2" style={{ color: '#cbd5e1' }}>{ghaiScope.canUseLabel}</p>
                <ul className="space-y-1.5 pl-5" style={{ listStyleType: 'disc' }}>
                  {ghaiScope.canUse.map(item => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div>
                <p className="mb-2" style={{ color: '#cbd5e1' }}>{ghaiScope.cannotUseLabel}</p>
                <ul className="space-y-1.5 pl-5" style={{ listStyleType: 'disc' }}>
                  {ghaiScope.cannotUse.map(item => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <p>
                {ghaiScope.trailingPre}
                <a href="/products" className="underline" style={{ color: '#00d4ff' }}>/products</a>
                {ghaiScope.trailingPost}
              </p>
            </div>
          </motion.div>

          {/* Transaction history */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={cardStyle}
            data-testid="wallet-transactions"
          >
            <h2 className="text-sm font-semibold text-[#e2e8f0] mb-4">Recent transactions</h2>

            {transactions.length === 0 ? (
              <p className="text-sm" style={{ color: '#64748b' }}>
                No transactions yet. Your top-ups and usage will appear here.
              </p>
            ) : (
              <div className="space-y-2">
                {transactions.map(tx => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-2"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>
                          {typeLabel(tx.type)}
                        </span>
                        {tx.stripe_session_id && (
                          <span className="text-sm" style={{ color: '#475569' }}>· Stripe</span>
                        )}
                      </div>
                      {tx.description && (
                        <p className="text-sm truncate" style={{ color: '#64748b' }}>{tx.description}</p>
                      )}
                      <p className="text-sm" style={{ color: '#334155' }}>
                        {new Date(tx.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-sm font-semibold"
                        style={{
                          color: tx.type === 'deposit' ? '#4ade80' : '#e2e8f0',
                          fontFamily: 'monospace',
                        }}
                      >
                        {tx.type === 'deposit' ? '+' : '-'}${fmt(tx.amount_usd)}
                      </p>
                      {tx.balance_after != null && (
                        <p className="text-sm" style={{ color: '#475569', fontFamily: 'monospace' }}>
                          bal ${fmt(tx.balance_after)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
