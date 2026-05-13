// CookiePolicyPage — what cookies we set, why, and how to opt out. Kept
// short and plain-English on purpose; required for UK GDPR / PECR
// compliance and asked for by some affiliate networks (Awin, FlexOffer)
// during site verification.

import React from 'react';
import { Helmet } from 'react-helmet';

function CookiePolicyPage() {
  const lastUpdated = '12 May 2026';

  return (
    <>
      <Helmet>
        <title>Cookie Policy — SnapGain</title>
        <meta
          name="description"
          content="How SnapGain uses cookies and similar technologies, and how you can control them."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
          Cookie Policy
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: {lastUpdated}
        </p>

        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mt-8 mb-3">1. What are cookies?</h2>
            <p className="text-muted-foreground">
              Cookies are small text files that websites place on your device to
              store information about your visit. They allow a site to remember
              who you are, keep you signed in, and understand how the service is
              being used so we can improve it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-3">2. The cookies SnapGain uses</h2>

            <h3 className="text-xl font-semibold mt-5 mb-2">Strictly necessary</h3>
            <p className="text-muted-foreground">
              These cookies are essential for the site to work. They keep you
              signed in, remember your language and theme preferences, and
              protect against fraud. You cannot turn these off if you want to use
              SnapGain.
            </p>

            <h3 className="text-xl font-semibold mt-5 mb-2">Performance & analytics</h3>
            <p className="text-muted-foreground">
              We use anonymised analytics to understand which pages people visit
              and where they get stuck. This helps us prioritise fixes and new
              features. We do not sell this data and we do not use it to identify
              you personally.
            </p>

            <h3 className="text-xl font-semibold mt-5 mb-2">Affiliate tracking</h3>
            <p className="text-muted-foreground">
              When you click a partner link (for example, to a cashback platform
              we recommend) a referral cookie is set by the partner so they can
              credit SnapGain for the introduction. We do not see your purchases
              — only that a click happened. You can block these by clearing
              cookies before clicking through.
            </p>

            <h3 className="text-xl font-semibold mt-5 mb-2">What we do not use</h3>
            <p className="text-muted-foreground">
              We do not use third-party advertising cookies, retargeting pixels,
              or social-media tracking on the public site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-3">3. Managing cookies</h2>
            <p className="text-muted-foreground">
              You can control cookies in your browser settings:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1 mt-2">
              <li>Block all cookies (note: SnapGain will not function)</li>
              <li>Delete existing cookies on close</li>
              <li>Allow only first-party cookies</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              On most browsers this lives under Settings → Privacy → Cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-3">4. Changes to this policy</h2>
            <p className="text-muted-foreground">
              If we add a new cookie category or change how an existing one
              works, we will update this page and the "Last updated" date above.
              Significant changes that affect your privacy will be flagged in the
              app.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-3">5. Contact</h2>
            <p className="text-muted-foreground">
              Questions about cookies or privacy? Email{' '}
              <a
                href="mailto:support@snapgain.uk"
                className="text-primary hover:underline"
              >
                support@snapgain.uk
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </>
  );
}

export default CookiePolicyPage;
