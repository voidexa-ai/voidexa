import EnglishAbout from '@/app/about/page'

export const metadata = {
  title: 'Om voidexa — Suveræn AI-infrastruktur',
  description: 'voidexa blev født af tomrummet — rummet mellem hvad teknologi kan, og hvad den faktisk gør for mennesker.',
  alternates: {
    canonical: '/dk/about',
    languages: {
      en: '/about',
      da: '/dk/about',
      'x-default': '/about',
    },
  },
}

/**
 * Danish mirror of /about. Copy translation deferred to CW-4.
 */
export default function AboutDk() {
  return <EnglishAbout />
}
