'use client'

import { useState } from 'react'
import { submitDevLead } from '@/app/actions/leads'

export default function DevSignup() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)
    const res = await submitDevLead(email)
    setSubmitting(false)
    if (res.ok) {
      setDone(true)
      setEmail('')
    } else {
      setError(res.error ?? 'Could not submit. Try again.')
    }
  }

  return (
    <section
      aria-labelledby="dev-signup-heading"
      data-testid="dev-signup"
      className="mb-16 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-7"
    >
      <h2
        id="dev-signup-heading"
        className="mb-2 text-2xl font-semibold tracking-tight text-emerald-200"
      >
        Are you a game developer?
      </h2>
      <p className="mb-5 max-w-2xl text-base leading-relaxed text-zinc-300">
        We&rsquo;re opening voidexa to outside studios. Drop your email and we&rsquo;ll
        ping you when the SDK and revenue-share programme go live.
      </p>
      {done ? (
        <p
          data-testid="dev-signup-success"
          className="text-base font-semibold text-emerald-200"
        >
          Thanks — you&rsquo;re on the list.
        </p>
      ) : (
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
          noValidate
        >
          <label htmlFor="dev-signup-email" className="sr-only">
            Email address
          </label>
          <input
            id="dev-signup-email"
            type="email"
            name="email"
            required
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@studio.dev"
            className="flex-1 rounded-lg border border-emerald-500/30 bg-zinc-950/70 px-4 py-3 text-base text-white placeholder:text-zinc-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
          />
          <button
            type="submit"
            disabled={submitting}
            data-testid="dev-signup-submit"
            className="rounded-lg border border-emerald-400 bg-emerald-500 px-5 py-3 text-base font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Sending…' : 'Notify me'}
          </button>
        </form>
      )}
      {error && (
        <p
          role="alert"
          data-testid="dev-signup-error"
          className="mt-3 text-sm font-medium text-rose-300"
        >
          {error}
        </p>
      )}
    </section>
  )
}
