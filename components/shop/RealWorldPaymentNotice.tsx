'use client'

import { usePathname } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'

export function RealWorldPaymentNotice() {
  const pathname = usePathname()
  const isDanish = pathname?.startsWith('/dk/') ?? false

  const primary = isDanish
    ? 'Betales i DKK/EUR via Stripe. GHAI gælder ikke her.'
    : 'Paid in DKK/EUR via Stripe. GHAI tokens not accepted for this product.'

  const secondary = isDanish
    ? '2 års dansk reklamationsret er inkluderet.'
    : '2-year Danish reklamationsret included.'

  return (
    <div
      data-testid="real-world-payment-notice"
      data-locale={isDanish ? 'da' : 'en'}
      className="rounded-2xl px-5 py-4 mb-8 flex items-start gap-3"
      style={{
        background: 'rgba(0,212,255,0.04)',
        border: '1px solid rgba(0,212,255,0.18)',
      }}
    >
      <ShieldCheck
        size={18}
        className="flex-shrink-0 mt-0.5"
        style={{ color: '#00d4ff' }}
      />
      <div className="text-sm leading-relaxed">
        <p className="text-[#e2e8f0] font-medium mb-1">{primary}</p>
        <p className="text-[#7a8a9e]">{secondary}</p>
      </div>
    </div>
  )
}

export default RealWorldPaymentNotice
