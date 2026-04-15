import AchievementPanel from '@/components/achievements/AchievementPanel'

export const metadata = {
  title: 'voidexa Mindehal — Bedrifter',
  description: 'Lås titler, skibe og badges op på tværs af Produkt, Udforskning og PvP.',
  alternates: {
    canonical: '/dk/achievements',
    languages: {
      'en': '/achievements',
      'da': '/dk/achievements',
      'x-default': '/achievements',
    },
  },
}

export default function AchievementsPage() {
  return <AchievementPanel />
}
