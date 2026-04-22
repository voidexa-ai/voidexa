import EnglishProfile from '@/app/profile/page'

export const metadata = {
  title: 'Profil — voidexa',
  description: 'Administrer din voidexa-konto og indstillinger.',
  alternates: {
    canonical: '/dk/profile',
    languages: {
      en: '/profile',
      da: '/dk/profile',
      'x-default': '/profile',
    },
  },
}

export default function ProfileDk() {
  return <EnglishProfile />
}
