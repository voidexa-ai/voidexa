import EnglishServices from '@/app/services/page'

export const metadata = {
  title: 'Tjenester — voidexa',
  description: 'AI-udvikling, data-intelligens og AI-rådgivning. Projektbaseret. Kontakt os for at afstemme omfang.',
  alternates: {
    canonical: '/dk/services',
    languages: {
      en: '/services',
      da: '/dk/services',
      'x-default': '/services',
    },
  },
}

/**
 * Danish mirror of /services. Reuses the English component tree; any UI
 * reading through `useI18n()` auto-detects `/dk` → Danish strings. Hardcoded
 * English copy in the services page will be translated in CW-4.
 */
export default function ServicesDk() {
  return <EnglishServices />
}
