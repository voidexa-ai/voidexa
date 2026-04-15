import EnglishContact from '@/app/contact/page'

export const metadata = {
  title: 'Kontakt voidexa',
  description: 'Skriv til hello@voidexa.com eller udfyld formularen. Vi svarer inden for 24 timer.',
  alternates: {
    canonical: '/dk/contact',
    languages: {
      en: '/contact',
      da: '/dk/contact',
      'x-default': '/contact',
    },
  },
}

/**
 * Danish mirror of /contact. Form labels translation deferred to CW-4.
 */
export default function ContactDk() {
  return <EnglishContact />
}
