import ShopPage from '@/components/shop/ShopPage'

export const metadata = {
  title: 'voidexa Butik — Skibsskins, kortpakker & kosmetik',
  description: 'Kosmetiske skibsskins, haler, cockpittemaer og kortpakker til voidexa Fri Flyvning.',
  alternates: {
    canonical: '/dk/shop',
    languages: {
      'en': '/shop',
      'da': '/dk/shop',
      'x-default': '/shop',
    },
  },
}

export default function Shop() {
  return <ShopPage />
}
