import { Metadata } from 'next'
import PackShopClient from '@/components/shop/PackShopClient'

export const metadata: Metadata = {
  title: 'Booster Packs — voidexa',
  description: 'Standard, Premium, and Legendary packs. 0.1% Mythic chance. Alpha library.',
}

export default function PacksPage() {
  return <PackShopClient />
}
