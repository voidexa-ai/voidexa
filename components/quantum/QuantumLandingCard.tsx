import Link from 'next/link'

export interface QuantumLandingCardProps {
  title: string
  href: string
  tagline: string
  description: string
  cta: string
  accent: string
  testid?: string
}

export default function QuantumLandingCard({
  title,
  href,
  tagline,
  description,
  cta,
  accent,
  testid,
}: QuantumLandingCardProps) {
  return (
    <Link
      href={href}
      data-testid={testid}
      className="group flex flex-col gap-4 rounded-2xl border bg-zinc-950/60 p-7 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl"
      style={{
        borderColor: `${accent}55`,
        boxShadow: `0 0 0 1px ${accent}22, 0 12px 40px ${accent}1a`,
      }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2
          className="text-2xl font-semibold tracking-tight"
          style={{ color: accent }}
        >
          {title}
        </h2>
      </div>
      <p
        className="text-sm font-medium uppercase tracking-[0.18em]"
        style={{ color: `${accent}cc` }}
      >
        {tagline}
      </p>
      <p className="text-base leading-relaxed text-zinc-300">
        {description}
      </p>
      <div className="mt-auto flex items-center gap-2 pt-2 text-base font-semibold transition group-hover:gap-3"
        style={{ color: accent }}
      >
        <span>{cta}</span>
        <span aria-hidden="true">→</span>
      </div>
    </Link>
  )
}
