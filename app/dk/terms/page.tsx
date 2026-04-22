import EnglishTerms from '@/app/terms/page'

export const metadata = {
  title: 'Servicevilkår — voidexa',
  description:
    'Servicevilkår for voidexa.com: konti, GHAI-kreditter, brugerindhold, fysiske produkter under dansk reklamationsret og tvisteløsning.',
  alternates: {
    canonical: '/dk/terms',
    languages: {
      en: '/terms',
      da: '/dk/terms',
      'x-default': '/terms',
    },
  },
}

export default function TermsDk() {
  return <EnglishTerms />
}
