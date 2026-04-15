import FreeFlightPage from '@/components/freeflight/FreeFlightPage'

export const metadata = {
  title: 'voidexa Fri Flyvning — Udforsk universet',
  description: 'Styr dit skib gennem voidexa-galaksen. Asteroidebælter, stationer, warp-porte og mere.',
  alternates: {
    canonical: '/dk/freeflight',
    languages: {
      en: '/freeflight',
      da: '/dk/freeflight',
      'x-default': '/freeflight',
    },
  },
}

/**
 * Danish mirror of /freeflight. HUD text that reads through `useI18n()`
 * will render Danish automatically; any hardcoded English strings in
 * FreeFlightPage will need follow-up translation (CW-4).
 */
export default function FreeFlightDk() {
  return <FreeFlightPage />
}
