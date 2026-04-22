import EnglishPrivacy from '@/app/privacy/page'

export const metadata = {
  title: 'Privatlivspolitik — voidexa',
  description:
    'Sådan indsamler, bruger og beskytter voidexa personoplysninger under EU GDPR. Dataansvarlig, underdatabehandlere, opbevaring og dine rettigheder.',
  alternates: {
    canonical: '/dk/privacy',
    languages: {
      en: '/privacy',
      da: '/dk/privacy',
      'x-default': '/privacy',
    },
  },
}

export default function PrivacyDk() {
  return <EnglishPrivacy />
}
