import type { Metadata } from 'next'
import { DM_Sans, Syne } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/layout/Navigation'
import EarlyAccessBanner from '@/components/layout/EarlyAccessBanner'
import ConditionalFooter from '@/components/layout/ConditionalFooter'
import GlobalStarfield from '@/components/layout/GlobalStarfield'
import JarvisAssistant from '@/components/ui/JarvisAssistant'
import UniverseChat from '@/components/chat/UniverseChat'
import { AuthProvider } from '@/components/AuthProvider'
import { GetInTouchProvider } from '@/components/GetInTouchModal'
import { LocaleProvider } from '@/lib/i18n/context'
import LocaleHtml from '@/components/layout/LocaleHtml'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500'],
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-space',
  weight: ['600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://voidexa.com'),
  title: {
    default: 'voidexa — Sovereign AI Infrastructure',
    template: '%s',
  },
  description:
    'voidexa builds AI-powered trading systems, encrypted communication apps, and intelligent automation tools. Technology that thinks, adapts, and executes.',
  keywords: 'AI trading bot, encrypted communication, AI consulting, custom software, data intelligence',
  alternates: {
    languages: {
      'en': '/',
      'da': '/dk',
      'x-default': '/',
    },
  },
  openGraph: {
    title: 'voidexa — Sovereign AI Infrastructure',
    description: 'Intelligent systems that work for you',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${syne.variable}`}>
      <body className="min-h-screen bg-[#0a0a0f] text-[#e2e8f0] antialiased overflow-x-hidden noise-body">
        <LocaleProvider>
          <LocaleHtml />
          <AuthProvider>
            <GetInTouchProvider>
              <GlobalStarfield />
              <EarlyAccessBanner />
              <Navigation />
              {/* paddingTop offsets the fixed Navigation (~69px) so page titles
                  aren't hidden behind it. Fullscreen pages (freeflight, starmap,
                  galaxy) use position:fixed and so are unaffected. */}
              <main className="relative" style={{ paddingTop: 72 }}>{children}</main>
              <ConditionalFooter />
              <JarvisAssistant />
              <UniverseChat />
            </GetInTouchProvider>
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}
