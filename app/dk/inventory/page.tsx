import EnglishInventory from '@/app/inventory/page'

export const metadata = {
  title: 'Din Beholdning — voidexa',
  description: 'Kort og kosmetik du ejer i voidexa-universet.',
  alternates: {
    canonical: '/dk/inventory',
    languages: {
      en: '/inventory',
      da: '/dk/inventory',
      'x-default': '/inventory',
    },
  },
}

export default function InventoryDk() {
  return <EnglishInventory />
}
