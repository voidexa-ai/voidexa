import LegalPage from '@/components/legal/LegalPage'
import CookieSettings from '@/components/legal/CookieSettings'

export default function CookiePolicyPage() {
  return (
    <LegalPage
      kicker="Cookies"
      title={<>Cookie <span className="gradient-text">Policy.</span></>}
      lastUpdated="22 April 2026"
    >
      <p>
        voidexa.com uses a small number of cookies and similar browser storage
        to run the site, keep you signed in, and &mdash; with your consent
        &mdash; understand how the site is used. This page explains what is
        stored and how to change your choice.
      </p>

      <h2>1. What is a cookie?</h2>
      <p>
        A cookie is a small text file stored by your browser on your device.
        We also use <code>localStorage</code> and <code>sessionStorage</code>,
        which work similarly. This policy covers all three, which we refer to
        collectively as &ldquo;cookies&rdquo;.
      </p>

      <h2>2. Categories</h2>
      <h3>Essential cookies</h3>
      <p>
        These are required to run the site and cannot be switched off. They do
        not identify you as a person. Examples:
      </p>
      <ul>
        <li>Supabase session tokens (keep you signed in)</li>
        <li>Locale preference (<code>en</code> / <code>da</code>)</li>
        <li>Audio gate choice, quick-menu state, and other UX preferences</li>
        <li>Security tokens (CSRF, rate-limit state)</li>
        <li>
          Your cookie-consent choice itself, stored under{' '}
          <code>voidexa_cookie_consent_v1</code>
        </li>
      </ul>
      <h3>Analytics cookies (optional)</h3>
      <p>
        If you choose &ldquo;Allow all&rdquo; in the cookie banner, we may set
        analytics cookies to understand aggregate usage &mdash; which pages are
        read, which features are used, where errors occur. These do not track
        you across other websites. No analytics vendor is enabled as of the
        last-updated date; when one is added it will be listed here before
        deployment.
      </p>

      <h2>3. Your choice</h2>
      <p>
        The first time you visit voidexa.com we show a cookie banner with two
        options:
      </p>
      <ul>
        <li><strong>Essentials only</strong> &mdash; stores <code>essential</code> under the consent key. We do not set analytics cookies.</li>
        <li><strong>Allow all</strong> &mdash; stores <code>all</code> under the consent key. Analytics cookies may be set.</li>
      </ul>
      <p>
        Your choice is remembered in <code>localStorage</code> under{' '}
        <code>voidexa_cookie_consent_v1</code>. You can change it at any time
        below.
      </p>

      <CookieSettings />

      <h2>4. Third-party cookies</h2>
      <p>
        Embedded content from third parties (Stripe Checkout, YouTube player in
        the Break Room, Google sign-in) may set cookies under the third
        party&rsquo;s own policy when you actively use that embed. We do not
        control those cookies.
      </p>

      <h2>5. Do-Not-Track</h2>
      <p>
        We treat a browser <code>Do-Not-Track</code> signal as an implicit
        &ldquo;essentials only&rdquo; choice until you explicitly click
        &ldquo;Allow all&rdquo;.
      </p>

      <h2>6. Changes to this policy</h2>
      <p>
        When we add or change cookies we update this page and, if the change
        affects you, re-show the banner so you can renew your choice.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about cookies or this policy:{' '}
        <a href="mailto:contact@voidexa.com">contact@voidexa.com</a>. See also
        the <a href="/privacy">Privacy Policy</a> and{' '}
        <a href="/terms">Terms of Service</a>.
      </p>
    </LegalPage>
  )
}
