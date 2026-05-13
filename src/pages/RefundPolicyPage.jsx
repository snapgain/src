// RefundPolicyPage — required by Stripe, most affiliate networks, and UK
// consumer law (Consumer Contracts Regulations 2013). Kept clear so the
// rules are unambiguous if a customer asks for their money back.

import React from 'react';
import { Helmet } from 'react-helmet';

function RefundPolicyPage() {
  const lastUpdated = '12 May 2026';

  return (
    <>
      <Helmet>
        <title>Refund Policy — SnapGain</title>
        <meta
          name="description"
          content="SnapGain's refund policy for the Premium subscription."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
          Refund Policy
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: {lastUpdated}
        </p>

        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mt-8 mb-3">1. Our promise</h2>
            <p className="text-muted-foreground">
              SnapGain is a paid product. We want every customer to feel they got
              their money's worth. If the service did not do what you expected,
              we would rather refund you than keep an unhappy customer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-3">
              2. 14-day cooling-off period (UK consumer right)
            </h2>
            <p className="text-muted-foreground">
              Under the UK Consumer Contracts Regulations 2013, you have the
              right to cancel within 14 days of your first purchase and receive a
              full refund, no questions asked. To exercise this right, email{' '}
              <a
                href="mailto:support@snapgain.uk"
                className="text-primary hover:underline"
              >
                support@snapgain.uk
              </a>{' '}
              with the subject line "Refund — within 14 days".
            </p>
            <p className="text-muted-foreground mt-3">
              <strong>Important:</strong> if you have already used the Premium
              features substantially (e.g. exported strategies, run dozens of
              calculator queries) during this period, we may deduct a
              proportionate amount for the value already received, as the
              regulations allow.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-3">3. After 14 days — monthly plans</h2>
            <p className="text-muted-foreground">
              Monthly plans renew automatically. You can cancel at any time from
              your account Settings; cancellation takes effect at the end of your
              current billing period, and you keep Premium access until then. We
              do not pro-rate refunds for partial months.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-3">4. After 14 days — annual plans</h2>
            <p className="text-muted-foreground">
              Annual plans are non-refundable after the 14-day cooling-off period
              except where we have failed to deliver the service materially (for
              example, a prolonged outage, or a feature that was advertised but
              never delivered). In those cases, contact us and we will offer
              either a pro-rated refund or service credit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-3">5. Duplicate or accidental charges</h2>
            <p className="text-muted-foreground">
              If you were charged twice for the same subscription, or charged
              after cancelling, we will refund the duplicate within 5 business
              days. Send us proof of the charge (e.g. a card statement screenshot
              with sensitive numbers redacted).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-3">6. How refunds are returned</h2>
            <p className="text-muted-foreground">
              Refunds go back to the original payment method via our payment
              processor (Stripe). It typically takes 5–10 business days to appear
              on your card or bank statement; we have no control over that
              timeline once the refund is initiated.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-3">7. Affiliate commissions are separate</h2>
            <p className="text-muted-foreground">
              Cashback, miles or rewards you earn through partner platforms
              recommended by SnapGain are paid by those platforms directly into
              your account with them. We have no involvement in those payouts
              and cannot refund them. Refunds described here cover only your
              SnapGain subscription fee.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-3">8. Questions</h2>
            <p className="text-muted-foreground">
              Email{' '}
              <a
                href="mailto:support@snapgain.uk"
                className="text-primary hover:underline"
              >
                support@snapgain.uk
              </a>
              . Please include the email on your account and the approximate date
              of the charge so we can find it quickly.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}

export default RefundPolicyPage;
