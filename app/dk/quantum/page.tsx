import EnglishQuantum from '@/app/quantum/page'

export const metadata = {
  title: 'Quantum — voidexa',
  description: 'Multi-AI debatmotor. 5-stadie pipeline, fire modeller, én konsensus.',
  alternates: {
    canonical: '/dk/quantum',
    languages: {
      en: '/quantum',
      da: '/dk/quantum',
      'x-default': '/quantum',
    },
  },
}

/**
 * Danish mirror of /quantum. The in-page debate UI has its own English copy;
 * full Danish translation deferred to CW-4.
 */
export default function QuantumDk() {
  return <EnglishQuantum />
}
