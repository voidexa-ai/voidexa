export const metadata = {
  title: 'Settings — voidexa',
  description:
    'Update your voidexa profile, language preference, and account controls.',
  alternates: {
    canonical: '/settings',
    languages: {
      en: '/settings',
      da: '/dk/settings',
      'x-default': '/settings',
    },
  },
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children
}
