import QuantumLandingCard from '@/components/quantum/QuantumLandingCard'

const CARDS = [
  {
    title: 'Quantum Council',
    href: '/quantum/chat',
    tagline: 'Consensus from Claude, GPT, Gemini, Perplexity',
    description:
      'Four AI providers debate your question in real-time, challenge each other, and converge on a consensus answer with KCP-90 compression on every message.',
    cta: 'Start a debate',
    accent: '#a78bfa',
    testid: 'quantum-card-council',
  },
  {
    title: 'Quantum Forge',
    href: '/quantum-forge',
    tagline: 'From request to deploy in minutes',
    description:
      'Describe what you want built. The Forge runs a debate, locks a plan, and ships the work via the Claude Agent SDK — autonomous build pipeline end-to-end.',
    cta: 'Build something',
    accent: '#7c3aed',
    testid: 'quantum-card-forge',
  },
  {
    title: 'Void Pro AI',
    href: '/void-pro-ai',
    tagline: 'Pay-per-message access to top models',
    description:
      'Premium gateway to Claude, ChatGPT, and Gemini. No subscription. Top up GHAI once, then use the best model for each prompt at provider-passthrough rates.',
    cta: 'Open the gateway',
    accent: '#8b5cf6',
    testid: 'quantum-card-pro',
  },
] as const

export default function QuantumLandingPage() {
  return (
    <main className="min-h-[calc(100dvh-84px)] w-full px-6 pb-24 pt-28 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-violet-300/80">
            voidexa Quantum
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Three ways to think with AI.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-300">
            Quantum is the umbrella for voidexa&rsquo;s multi-AI surfaces — debate, build,
            and pay-per-message. Pick the one that fits the moment.
          </p>
        </header>
        <section
          aria-label="Quantum sub-products"
          className="grid gap-6 md:grid-cols-3"
        >
          {CARDS.map(card => (
            <QuantumLandingCard key={card.title} {...card} />
          ))}
        </section>
      </div>
    </main>
  )
}
