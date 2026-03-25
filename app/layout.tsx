import type { Metadata } from 'next'
import { DM_Sans, Syne } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/layout/Navigation'
import ConditionalFooter from '@/components/layout/ConditionalFooter'
import GlobalStarfield from '@/components/layout/GlobalStarfield'
import JarvisAssistant from '@/components/ui/JarvisAssistant'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500'],
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-space',
  weight: ['600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'voidexa — Intelligent systems that work for you',
  description:
    'voidexa builds AI-powered trading systems, encrypted communication apps, and intelligent automation tools. Technology that thinks, adapts, and executes.',
  keywords: 'AI trading bot, encrypted communication, AI consulting, custom software, data intelligence',
  openGraph: {
    title: 'voidexa',
    description: 'Intelligent systems that work for you',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${syne.variable}`}>
      <body className="min-h-screen bg-[#0a0a0f] text-[#e2e8f0] antialiased overflow-x-hidden noise-body">
        <GlobalStarfield />
        <Navigation />
        <main className="relative">{children}</main>
        <ConditionalFooter />
        <JarvisAssistant />
      </body>
    </html>
  )
}
