import EnglishSignup from '@/app/auth/signup/page'

export const metadata = {
  title: 'Opret konto — voidexa',
  description: 'Opret en voidexa-konto og kom i gang.',
  alternates: {
    canonical: '/dk/auth/signup',
    languages: {
      en: '/auth/signup',
      da: '/dk/auth/signup',
      'x-default': '/auth/signup',
    },
  },
}

export default function SignupDk() {
  return <EnglishSignup />
}
