import EnglishLogin from '@/app/auth/login/page'

export const metadata = {
  title: 'Log ind — voidexa',
  description: 'Log ind på din voidexa-konto.',
  alternates: {
    canonical: '/dk/auth/login',
    languages: {
      en: '/auth/login',
      da: '/dk/auth/login',
      'x-default': '/auth/login',
    },
  },
}

export default function LoginDk() {
  return <EnglishLogin />
}
