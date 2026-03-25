import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const TO_EMAIL = 'contact@voidexa.com'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const body = await req.json()
    const { type, product, email, name, subject } = body

    const isWaitlist = type === 'waitlist'
    const emailSubject = isWaitlist
      ? `New waitlist signup — ${product}`
      : `New contact message — ${subject ?? product}`

    const html = `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #0a0a0f; margin-bottom: 8px;">${emailSubject}</h2>
        <table style="width:100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #666; width: 80px;">Type</td><td style="padding: 6px 0;">${type}</td></tr>
          ${product ? `<tr><td style="padding: 6px 0; color: #666;">Product</td><td style="padding: 6px 0;">${product}</td></tr>` : ''}
          ${name ? `<tr><td style="padding: 6px 0; color: #666;">Name</td><td style="padding: 6px 0;">${name}</td></tr>` : ''}
          <tr><td style="padding: 6px 0; color: #666;">Email</td><td style="padding: 6px 0;"><a href="mailto:${email}">${email}</a></td></tr>
        </table>
        <hr style="margin: 16px 0; border: none; border-top: 1px solid #eee;" />
        <p style="color: #999; font-size: 12px;">voidexa.com notification</p>
      </div>
    `

    if (!RESEND_API_KEY) {
      // Log to Supabase dashboard if no Resend key configured yet
      console.log('[notify]', JSON.stringify({ emailSubject, email, name, product }))
      return new Response(JSON.stringify({ ok: true, note: 'logged only — RESEND_API_KEY not set' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'voidexa notifications <noreply@voidexa.com>',
        to: [TO_EMAIL],
        subject: emailSubject,
        html,
        reply_to: email,
      }),
    })

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
