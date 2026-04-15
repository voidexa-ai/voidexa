import GalaxyPage from '@/components/galaxy/GalaxyPage'

export const metadata = {
  title: 'voidexa Galakse — Stjernekort',
  description: 'voidexa-galaksen. Hvert firma en planet. Hver planet et system.',
  alternates: {
    canonical: '/dk/starmap',
    languages: {
      en: '/starmap',
      da: '/dk/starmap',
      'x-default': '/starmap',
    },
  },
}

/**
 * Danish mirror of /starmap — reuses the galaxy view, locale auto-detects
 * `/dk` prefix via `LocaleProvider`. Star map HUD labels that use `useI18n()`
 * render Danish automatically; hardcoded labels still need per-component
 * translation work (tracked in SKILL.md CW-4).
 */
export default function StarmapDk() {
  return <GalaxyPage />
}
