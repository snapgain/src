import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getConsent, setConsent } from '@/lib/observability';

// Minimal GDPR-friendly consent gate.
//
// Behaviour:
//   - Banner shows once until the visitor clicks Accept or Reject.
//   - "Accept" persists 'accepted' to localStorage AND immediately
//     loads GA4 via observability.setConsent('accepted').
//   - "Reject" persists 'rejected' — GA4 never loads. Sentry still
//     runs because it does NOT use cookies and only captures
//     anonymised error data (no PII by default, see observability.js).
//   - Already-decided visitors don't see it again.
//
// Why so plain: we only set strictly-necessary cookies (auth session)
// plus optional analytics. UK ICO + GDPR consider this acceptable
// without a per-category granular toggle; we'd add the granular UI
// only if we ever add ad/social tracking.

function CookieConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!getConsent()) setShow(true);
  }, []);

  if (!show) return null;

  const decide = (value) => {
    setConsent(value);
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg"
    >
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
        <p className="text-sm text-muted-foreground flex-1">
          We use a small set of cookies to keep you signed in and, with your
          permission, measure which pages help our visitors most. No ads, no
          third-party tracking.{' '}
          <Link to="/cookie-policy" className="underline text-foreground">
            Read the cookie policy
          </Link>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => decide('rejected')}>
            Reject analytics
          </Button>
          <Button size="sm" onClick={() => decide('accepted')}>
            Accept all
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsentBanner;
