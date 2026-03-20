import Link from 'next/link'
import { Mail, Github, Twitter } from 'lucide-react'

const pages = [
  { href: '/',          label: 'Home' },
  { href: '/trading',   label: 'Trading' },
  { href: '/apps',      label: 'Apps' },
  { href: '/ai-tools',  label: 'AI Tools' },
  { href: '/services',  label: 'Services' },
  { href: '/about',     label: 'About' },
  { href: '/contact',   label: 'Contact' },
]

const products = [
  { href: '/trading',   label: 'AI Trading Bot' },
  { href: '/apps',      label: 'Comlink' },
  { href: '/ai-tools',  label: 'AI Book Creator' },
  { href: '/ai-tools',  label: 'Website Builder' },
]

export default function Footer() {
  return (
    <footer
      className="relative border-t"
      style={{
        borderColor: 'rgba(0,212,255,0.08)',
        background: 'linear-gradient(180deg, #0a0a0f 0%, #0f0520 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span
                className="text-2xl font-bold gradient-text"
                style={{ fontFamily: 'var(--font-space)' }}
              >
                voidexa
              </span>
            </Link>
            <p className="text-[#475569] text-sm leading-relaxed mb-6">
              Intelligent systems that work for you. Built with AI at every layer.
            </p>
            <div className="flex gap-3">
              <a
                href="mailto:hello@voidexa.com"
                className="w-9 h-9 rounded-full flex items-center justify-center border border-[#00d4ff]/20 text-[#475569] hover:text-[#00d4ff] hover:border-[#00d4ff]/50 transition-all"
                aria-label="Email"
              >
                <Mail size={14} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full flex items-center justify-center border border-[#00d4ff]/20 text-[#475569] hover:text-[#00d4ff] hover:border-[#00d4ff]/50 transition-all"
                aria-label="Twitter/X"
              >
                <Twitter size={14} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full flex items-center justify-center border border-[#00d4ff]/20 text-[#475569] hover:text-[#00d4ff] hover:border-[#00d4ff]/50 transition-all"
                aria-label="GitHub"
              >
                <Github size={14} />
              </a>
            </div>
          </div>

          {/* Pages */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#00d4ff]/70 mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {pages.map(({ href, label }) => (
                <li key={href + label}>
                  <Link
                    href={href}
                    className="text-sm text-[#475569] hover:text-[#e2e8f0] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#00d4ff]/70 mb-4">
              Products
            </h3>
            <ul className="space-y-2">
              {products.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-[#475569] hover:text-[#e2e8f0] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#00d4ff]/70 mb-4">
              Contact
            </h3>
            <a
              href="mailto:hello@voidexa.com"
              className="text-sm text-[#475569] hover:text-[#00d4ff] transition-colors"
            >
              hello@voidexa.com
            </a>
            <p className="text-xs text-[#334155] mt-6 leading-relaxed">
              Based in the digital void. Operating globally.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(0,212,255,0.06)' }}
        >
          <p className="text-xs text-[#334155]">
            © {new Date().getFullYear()} voidexa. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#334155]">Built with AI</span>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(0,212,255,0.08)',
                border: '1px solid rgba(0,212,255,0.15)',
                color: '#00d4ff',
              }}
            >
              ⚡ Powered by Claude
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
