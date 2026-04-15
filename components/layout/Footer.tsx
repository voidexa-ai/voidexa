'use client'

import { useT, format } from '@/lib/i18n/context'

export default function Footer() {
  const t = useT()
  return (
    <footer
      className="relative border-t"
      style={{
        borderColor: 'rgba(0,212,255,0.08)',
        background: 'linear-gradient(180deg, #0a0a0f 0%, #0f0520 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-[#334155]">{t.footer.operating}</p>
        <p className="text-sm text-[#334155]">
          {format(t.footer.rights, { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  )
}
