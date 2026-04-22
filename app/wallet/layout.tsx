export const metadata = {
  title: 'Wallet — voidexa',
  description:
    'Manage your voidexa wallet balance, top up with Stripe, and review recent transactions.',
  alternates: {
    canonical: '/wallet',
    languages: {
      en: '/wallet',
      da: '/dk/wallet',
      'x-default': '/wallet',
    },
  },
}

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  return children
}
