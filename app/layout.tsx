import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import JarvisAssistant from '@/components/ui/JarvisAssistant'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
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
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-[#0a0a0f] text-[#e2e8f0] antialiased overflow-x-hidden">
        <Navigation />
        <main className="relative">{children}</main>
        <Footer />
        <JarvisAssistant />
      </body>
    </html>
  )
}
