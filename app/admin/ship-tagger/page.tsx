import ShipTaggerClient from './ShipTaggerClient'

export const metadata = {
  title: 'Ship Tagger — voidexa Admin',
  robots: { index: false, follow: false },
}

export default function ShipTaggerPage() {
  return <ShipTaggerClient />
}
