import EnglishTeam from '@/app/team/page'

export const metadata = {
  title: 'Hold — voidexa',
  description: 'Mød besætningen bag voidexa. Humor bevares i Danish-version.',
  alternates: {
    canonical: '/dk/team',
    languages: {
      en: '/team',
      da: '/dk/team',
      'x-default': '/team',
    },
  },
}

/**
 * Danish mirror of /team. Individual cast bios translation deferred to CW-4
 * (the master plan specifically calls out keeping the humor in Danish).
 */
export default function TeamDk() {
  return <EnglishTeam />
}
