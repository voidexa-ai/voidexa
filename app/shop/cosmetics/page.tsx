import type { Metadata } from 'next'
import ShopCosmeticsClient from '@/components/shop/ShopCosmeticsClient'

export const metadata: Metadata = {
  title: 'voidexa Shop Cosmetics — Racing, Combat, Pilot, Premium',
  description: 'Browse cosmetic loadouts by category and spend GHAI on racing, combat, pilot and premium cosmetics.',
  alternates: {
    canonical: '/shop/cosmetics',
    languages: {
      en: '/shop/cosmetics',
      da: '/dk/shop/cosmetics',
      'x-default': '/shop/cosmetics',
    },
  },
}

type SearchParams = { tab?: string }

export default async function ShopCosmeticsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const tab = params.tab ?? 'racing'
  return <ShopCosmeticsClient tab={tab} />
}
