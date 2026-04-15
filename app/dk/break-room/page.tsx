import EnglishBreakRoom from '@/app/break-room/page'

export const metadata = {
  title: 'Pauserum — voidexa',
  description: 'Arkade-spil, AI-lounge, jukeboks, YouTube-lounge og ranglisten.',
  alternates: {
    canonical: '/dk/break-room',
    languages: {
      en: '/break-room',
      da: '/dk/break-room',
      'x-default': '/break-room',
    },
  },
}

/**
 * Danish mirror of /break-room. The arcade + lounge + jukebox sub-components
 * each have their own English copy; full translation deferred to CW-4.
 */
export default function BreakRoomDk() {
  return <EnglishBreakRoom />
}
