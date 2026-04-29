export default function AffiliatePlaceholder() {
  return (
    <section
      aria-labelledby="affiliate-heading"
      data-testid="affiliate-placeholder"
      className="mb-16 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-7"
    >
      <div className="flex items-center gap-3">
        <h2
          id="affiliate-heading"
          className="text-2xl font-semibold tracking-tight text-amber-200"
        >
          Affiliate
        </h2>
        <span
          data-testid="coming-soon-pulse"
          className="relative flex h-2 w-2"
          aria-hidden="true"
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
        </span>
      </div>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-300">
        Bring pilots to voidexa, earn GHAI back when they top up or unlock
        cosmetics. Programme launches alongside the dev SDK.
      </p>
    </section>
  )
}
