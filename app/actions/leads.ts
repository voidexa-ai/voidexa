'use server'

import 'server-only'
import { supabaseAdmin } from '@/lib/supabase-admin'

export interface SubmitDevLeadResult {
  ok: boolean
  error?: string
}

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

// AFS-10 — Game Hub developer signup. Reuses the existing public-insert
// `leads` table from migration 20260418_website_leads.sql. The row is
// keyed by `contact` (email value) + `type` ('email') + `source`
// ('game-hub') so it can be distinguished from website-creation leads.
export async function submitDevLead(
  email: string,
): Promise<SubmitDevLeadResult> {
  const trimmed = (email ?? '').trim()
  if (trimmed.length === 0) return { ok: false, error: 'Email is required.' }
  if (trimmed.length > 320) return { ok: false, error: 'Email is too long.' }
  if (!EMAIL_RE.test(trimmed)) return { ok: false, error: 'Enter a valid email address.' }

  const { error } = await supabaseAdmin.from('leads').insert({
    contact: trimmed,
    type: 'email',
    source: 'game-hub',
  })

  if (error) {
    console.error('[leads] insert failed:', error.message)
    return { ok: false, error: 'Could not save your email. Try again later.' }
  }

  return { ok: true }
}
