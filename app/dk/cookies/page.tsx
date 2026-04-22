import EnglishCookies from '@/app/cookies/page'

export const metadata = {
  title: 'Cookiepolitik — voidexa',
  description:
    'Hvilke cookies voidexa.com bruger, forskellen mellem nødvendige og analyse-cookies, og hvordan du ændrer dit samtykke.',
  alternates: {
    canonical: '/dk/cookies',
    languages: {
      en: '/cookies',
      da: '/dk/cookies',
      'x-default': '/cookies',
    },
  },
}

export default function CookiesDk() {
  return <EnglishCookies />
}
