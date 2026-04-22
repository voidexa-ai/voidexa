import EnglishSettings from '@/app/settings/page'

export const metadata = {
  title: 'Indstillinger — voidexa',
  description:
    'Opdater din voidexa-profil, sprogpræference og kontohåndtering.',
  alternates: {
    canonical: '/dk/settings',
    languages: {
      en: '/settings',
      da: '/dk/settings',
      'x-default': '/settings',
    },
  },
}

export default function SettingsDk() {
  return <EnglishSettings />
}
