import LegalPage from '@/components/legal/LegalPage'

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      kicker="Privacy"
      title={<>Privacy <span className="gradient-text">Policy.</span></>}
      lastUpdated="22 April 2026"
    >
      <p>
        voidexa (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates voidexa.com and the
        products listed on it. This policy explains what personal data we collect,
        why we collect it, who we share it with, and the rights you have under the
        EU General Data Protection Regulation (GDPR) and the Danish Data Protection
        Act (<em>Databeskyttelsesloven</em>).
      </p>

      <h2>1. Data controller</h2>
      <p>
        The data controller is <strong>Jimmi Wulff</strong>, trading as voidexa,
        registered in Denmark under <strong>CVR 46343387</strong>, with principal
        place of business in Vordingborg, Denmark. Contact:{' '}
        <a href="mailto:contact@voidexa.com">contact@voidexa.com</a>.
      </p>

      <h2>2. Personal data we collect</h2>
      <h3>Account and profile</h3>
      <ul>
        <li>Email address, display name, pilot callsign, profile picture</li>
        <li>Hashed password (when you use email sign-in) or provider ID (Google, Solana wallet)</li>
        <li>Locale preference and UI settings</li>
      </ul>
      <h3>Transactional</h3>
      <ul>
        <li>GHAI credit balance and purchase history</li>
        <li>Stripe customer ID and last-4 of payment card (we do not store full card numbers)</li>
        <li>Shipping address for any physical products</li>
      </ul>
      <h3>Product usage</h3>
      <ul>
        <li>Void Chat / Quantum / Trading Hub prompts and responses when you use those features</li>
        <li>Break Room and Universe Wall posts you publish</li>
        <li>Card collection, deck loadouts, and match history</li>
        <li>Server logs with IP address and user agent (retained for abuse prevention and security)</li>
      </ul>

      <h2>3. Why we process your data (lawful bases)</h2>
      <table>
        <thead>
          <tr>
            <th>Purpose</th>
            <th>Lawful basis (GDPR art. 6)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Running your account and delivering the service you asked for</td>
            <td>Contract (art. 6(1)(b))</td>
          </tr>
          <tr>
            <td>Processing payments and issuing invoices</td>
            <td>Contract + legal obligation (art. 6(1)(b), (c))</td>
          </tr>
          <tr>
            <td>Security, fraud, and abuse prevention</td>
            <td>Legitimate interest (art. 6(1)(f))</td>
          </tr>
          <tr>
            <td>Analytics cookies (optional)</td>
            <td>Consent (art. 6(1)(a))</td>
          </tr>
          <tr>
            <td>Bookkeeping under Danish <em>Bogføringsloven</em></td>
            <td>Legal obligation (art. 6(1)(c))</td>
          </tr>
        </tbody>
      </table>

      <h2>4. Sub-processors</h2>
      <p>
        We use the following sub-processors. Each has its own privacy policy and a
        Data Processing Agreement (DPA) in place with us.
      </p>
      <ul>
        <li><strong>Supabase</strong> (EU region, Frankfurt) — authentication, Postgres database, file storage</li>
        <li><strong>Vercel</strong> — edge hosting and deployment of the voidexa.com frontend</li>
        <li><strong>Stripe</strong> — payment processing</li>
        <li><strong>Anthropic</strong> (Claude API) — AI chat, quantum debate, and automation features</li>
        <li><strong>OpenAI</strong> — Void Chat, quantum debate</li>
        <li><strong>Google</strong> (Gemini API) — quantum debate and select AI tools</li>
        <li><strong>Perplexity</strong> — quantum debate research leg</li>
      </ul>
      <p>
        Non-EU sub-processors are bound by Standard Contractual Clauses. Prompts
        you submit to AI sub-processors are subject to each provider&rsquo;s own
        data-use terms. We do not send your email address or payment data to AI
        providers.
      </p>

      <h2>5. Retention</h2>
      <ul>
        <li><strong>Account data</strong> — kept until you delete your account, then purged within 30 days</li>
        <li><strong>Invoices and tax records</strong> — 5 years (Danish <em>Bogføringsloven</em>)</li>
        <li><strong>Security logs</strong> — 90 days</li>
        <li><strong>Chat transcripts</strong> — kept until you delete them or close the account</li>
        <li><strong>Backups</strong> — rolling 30-day encrypted backups, deleted on rotation</li>
      </ul>

      <h2>6. Your rights</h2>
      <p>Under the GDPR you have the right to:</p>
      <ul>
        <li>Access a copy of your data</li>
        <li>Correct inaccurate data</li>
        <li>Erase your data (&ldquo;right to be forgotten&rdquo;), subject to our legal retention duties</li>
        <li>Export your data in a portable format</li>
        <li>Object to processing based on legitimate interest</li>
        <li>Withdraw consent at any time, without affecting processing already carried out</li>
        <li>Lodge a complaint with <strong>Datatilsynet</strong>, the Danish Data Protection Authority (<a href="https://www.datatilsynet.dk" target="_blank" rel="noreferrer noopener">datatilsynet.dk</a>)</li>
      </ul>
      <p>
        To exercise any right, email{' '}
        <a href="mailto:contact@voidexa.com">contact@voidexa.com</a> from the
        address on your account. We respond within 30 days.
      </p>

      <h2>7. Security</h2>
      <p>
        Data is encrypted in transit (TLS 1.2+) and at rest. Passwords are hashed
        with bcrypt or equivalent. Access to production systems is limited to the
        operator under multi-factor authentication. We will notify you and
        Datatilsynet within 72 hours of becoming aware of any personal-data breach
        likely to affect your rights.
      </p>

      <h2>8. Children</h2>
      <p>
        voidexa.com is not directed at children under 13. If you believe a child
        has provided us personal data, email us and we will delete it.
      </p>

      <h2>9. Changes to this policy</h2>
      <p>
        We update this policy when processing changes. Material changes are
        announced by email or in-app notice 14 days before taking effect. The date
        at the top of this page is the latest update.
      </p>

      <h2>10. Governing law and jurisdiction</h2>
      <p>
        This policy is governed by Danish law. Disputes are resolved under EU
        GDPR supervision, with Vordingborg <em>retskreds</em> as the competent
        venue for any civil claim not otherwise assigned to Datatilsynet.
      </p>

      <h2>11. Disclaimer</h2>
      <p>
        This document is provided as a plain-language summary and technical
        compliance baseline. It is not legal advice. A full solicitor review of
        the voidexa legal surface is in progress (tracked internally as AFS-37).
      </p>
    </LegalPage>
  )
}
