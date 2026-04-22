import EnglishWallet from '@/app/wallet/page'

export const metadata = {
  title: 'Tegnebog — voidexa',
  description:
    'Administrer din voidexa-saldo, top op via Stripe, og gennemgå seneste transaktioner.',
  alternates: {
    canonical: '/dk/wallet',
    languages: {
      en: '/wallet',
      da: '/dk/wallet',
      'x-default': '/wallet',
    },
  },
}

export default function WalletDk() {
  return <EnglishWallet />
}
