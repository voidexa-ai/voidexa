import type { Metadata } from 'next'
import ShopCosmeticsClient from '@/components/shop/ShopCosmeticsClient'

export const metadata: Metadata = {
  title: 'voidexa Butik Kosmetik — Racing, Kamp, Pilot, Premium',
  description: 'Gennemse kosmetiske loadouts pr. kategori og brug GHAI på racing-, kamp-, pilot- og premium-kosmetik.',
  alternates: {
    canonical: '/dk/shop/cosmetics',
    languages: {
      en: '/shop/cosmetics',
      da: '/dk/shop/cosmetics',
      'x-default': '/shop/cosmetics',
    },
  },
}

type SearchParams = { tab?: string }

export default async function ShopCosmeticsPageDk({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const tab = params.tab ?? 'racing'
  return <ShopCosmeticsClient tab={tab} />
}
