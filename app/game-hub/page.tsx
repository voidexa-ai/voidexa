import GameHubHero from '@/components/game-hub/GameHubHero'
import PlayNow from '@/components/game-hub/PlayNow'
import ComingSoonRoadmap from '@/components/game-hub/ComingSoonRoadmap'
import DevSignup from '@/components/game-hub/DevSignup'
import AffiliatePlaceholder from '@/components/game-hub/AffiliatePlaceholder'
import RollingPromo from '@/components/game-hub/RollingPromo'

export const metadata = {
  title: 'voidexa Game Hub — Play · Build · Compete · Earn',
  description:
    'voidexa Game Hub: Free Flight, Break Room arcade, marketplace + tournament roadmap, developer SDK signup, and the affiliate programme.',
}

export default function GameHubPage() {
  return (
    <main className="min-h-[calc(100dvh-84px)] w-full px-6 pb-24 pt-28 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <GameHubHero />
        <PlayNow />
        <ComingSoonRoadmap />
        <DevSignup />
        <AffiliatePlaceholder />
        <RollingPromo />
      </div>
    </main>
  )
}
