import WhitePaperPageClient from './WhitePaperPageClient'

export const metadata = {
  title: 'voidexa White Paper',
  description: 'The infrastructure behind the voidexa universe — products, technology stack, and the GHAI platform currency.',
  alternates: {
    canonical: '/white-paper',
  },
}

export default function WhitePaperPage() {
  return <WhitePaperPageClient />
}
