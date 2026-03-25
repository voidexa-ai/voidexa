'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Copy, Check, Wallet, ExternalLink } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import bs58 from 'bs58'

interface Profile {
  name: string | null
  role: string
  referral_code: string | null
}

interface WalletConnection {
  id: string
  wallet_address: string
  wallet_type: string
  created_at: string
}

interface WaitlistEntry {
  id: string
  product: string
  created_at: string
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { publicKey, signMessage, connected, wallet, disconnect } = useWallet()
  const { setVisible: openWalletModal } = useWalletModal()

  const [profile, setProfile]           = useState<Profile | null>(null)
  const [wallets, setWallets]           = useState<WalletConnection[]>([])
  const [waitlistEntries, setWaitlist]  = useState<WaitlistEntry[]>([])
  const [name, setName]                 = useState('')
  const [saving, setSaving]             = useState(false)
  const [saved, setSaved]               = useState(false)
  const [copied, setCopied]             = useState(false)
  const [signingWallet, setSigningWallet] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
  }, [user, loading, router])

  // Load profile data
  useEffect(() => {
    if (!user) return

    async function load() {
      const [profileRes, walletsRes, waitlistRes] = await Promise.all([
        supabase.from('profiles').select('name, role, referral_code').eq('id', user!.id).single(),
        supabase.from('wallet_connections').select('id, wallet_address, wallet_type, created_at').eq('user_id', user!.id),
        supabase.from('waitlist_signups').select('id, product, created_at').eq('user_id', user!.id).order('created_at', { ascending: false }),
      ])

      if (profileRes.data) {
        setProfile(profileRes.data)
        setName(profileRes.data.name ?? '')
      }
      if (walletsRes.data) setWallets(walletsRes.data)
      if (waitlistRes.data) setWaitlist(waitlistRes.data)
    }
    load()
  }, [user])

  async function saveName() {
    if (!user) return
    setSaving(true)
    await supabase.from('profiles').update({ name }).eq('id', user.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function copyReferral() {
    if (!profile?.referral_code) return
    navigator.clipboard.writeText(`https://voidexa.com/?ref=${profile.referral_code}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function connectAndVerifyWallet() {
    if (!connected || !publicKey || !signMessage || !user) return
    setSigningWallet(true)
    try {
      const timestamp = Date.now()
      const msgBytes = new TextEncoder().encode(`Verify wallet for voidexa: ${timestamp}`)
      const sig = await signMessage(msgBytes)
      const sigBase58 = bs58.encode(sig)

      const { error } = await supabase.from('wallet_connections').upsert({
        user_id: user.id,
        wallet_address: publicKey.toBase58(),
        wallet_type: wallet?.adapter.name ?? 'unknown',
        signature: sigBase58,
        verified: true,
      }, { onConflict: 'user_id,wallet_address' })

      if (!error) {
        const { data } = await supabase.from('wallet_connections').select('id, wallet_address, wallet_type, created_at').eq('user_id', user.id)
        if (data) setWallets(data)
      }
    } catch (e) {
      // User rejected signature
    }
    setSigningWallet(false)
  }

  if (loading || !user) return null

  const referralUrl = profile?.referral_code ? `voidexa.com/?ref=${profile.referral_code}` : null
  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: '24px',
  }

  return (
    <div className="min-h-screen" style={{ background: '#07070d' }}>
      <div className="max-w-2xl mx-auto px-6 pt-32 pb-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#334155' }}>Your account</p>
          <h1 className="text-3xl font-bold text-[#e2e8f0] mb-8" style={{ fontFamily: 'var(--font-space)' }}>
            Profile
          </h1>
        </motion.div>

        <div className="space-y-4">
          {/* Basic info */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} style={cardStyle}>
            <h2 className="text-sm font-semibold text-[#e2e8f0] mb-4">Account</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: '#7a8a9e' }}>Email</label>
                <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: '#64748b' }}>
                  {user.email}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: '#7a8a9e' }}>Name</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0' }}
                  />
                  <button
                    onClick={saveName}
                    disabled={saving}
                    className="px-4 py-2 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
                    style={{ background: saved ? 'rgba(34,197,94,0.15)' : 'rgba(0,212,255,0.1)', border: `1px solid ${saved ? 'rgba(34,197,94,0.3)' : 'rgba(0,212,255,0.2)'}`, color: saved ? '#22c55e' : '#00d4ff' }}
                  >
                    {saved ? <Check size={14} /> : saving ? '…' : 'Save'}
                  </button>
                </div>
              </div>

              {profile?.role && (
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: '#7a8a9e' }}>Role</label>
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#a78bfa' }}>
                    {profile.role}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Referral */}
          {referralUrl && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} style={cardStyle}>
              <h2 className="text-sm font-semibold text-[#e2e8f0] mb-3">Referral link</h2>
              <div className="flex gap-2">
                <div className="flex-1 px-4 py-3 rounded-xl text-sm font-mono truncate" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: '#64748b' }}>
                  {referralUrl}
                </div>
                <button
                  onClick={copyReferral}
                  className="px-3 py-2 rounded-xl transition-all hover:opacity-80"
                  style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: copied ? '#22c55e' : '#00d4ff' }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </motion.div>
          )}

          {/* Wallet connections */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} style={cardStyle}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#e2e8f0]">Connected wallets</h2>
              {!connected ? (
                <button
                  onClick={() => openWalletModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-opacity hover:opacity-80"
                  style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', color: '#a78bfa' }}
                >
                  <Wallet size={12} />
                  Connect wallet
                </button>
              ) : (
                <button
                  onClick={connectAndVerifyWallet}
                  disabled={signingWallet}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
                  style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff' }}
                >
                  {signingWallet ? 'Signing…' : 'Verify & save'}
                </button>
              )}
            </div>

            {wallets.length === 0 ? (
              <p className="text-xs" style={{ color: '#334155' }}>No wallets connected yet.</p>
            ) : (
              <div className="space-y-2">
                {wallets.map(w => (
                  <div key={w.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div>
                      <p className="text-xs font-mono text-[#94a3b8]">{w.wallet_address.slice(0, 8)}…{w.wallet_address.slice(-6)}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: '#334155' }}>{w.wallet_type}</p>
                    </div>
                    <a
                      href={`https://explorer.solana.com/address/${w.wallet_address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-opacity hover:opacity-70"
                      style={{ color: '#334155' }}
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Waitlist signups */}
          {waitlistEntries.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} style={cardStyle}>
              <h2 className="text-sm font-semibold text-[#e2e8f0] mb-3">Waitlist signups</h2>
              <div className="space-y-1.5">
                {waitlistEntries.map(e => (
                  <div key={e.id} className="flex items-center justify-between text-sm">
                    <span className="capitalize" style={{ color: '#94a3b8' }}>{e.product.replace(/-/g, ' ')}</span>
                    <span className="text-xs" style={{ color: '#334155' }}>
                      {new Date(e.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
