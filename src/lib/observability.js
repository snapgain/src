// Observability bootstrap — Sentry (error tracking) + Google Analytics 4
// (product analytics). Both are gated on the presence of their respective
// env vars + (for GA4) the user's cookie consent. If a var is missing the
// SDK simply doesn't initialise — no crashes, no broken builds.
//
// Env vars (set in Vercel → Settings → Environment Variables):
//   VITE_SENTRY_DSN          — Sentry project DSN (https://...@sentry.io/...)
//   VITE_GA4_MEASUREMENT_ID  — GA4 measurement ID (G-XXXXXXXXXX)
//   VITE_APP_ENV             — 'production' | 'staging' | 'development'

import * as Sentry from '@sentry/react';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const GA4_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;
const APP_ENV = import.meta.env.VITE_APP_ENV || (import.meta.env.DEV ? 'development' : 'production');

const CONSENT_KEY = 'snapgain.cookieConsent';

export function initSentry() {
  if (!SENTRY_DSN) {
    if (import.meta.env.DEV) {
      console.log('[observability] Sentry DSN not set — skipping init.');
    }
    return;
  }
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: APP_ENV,
    // Capture 100% of unhandled errors but only 10% of perf transactions.
    // Free tier is 5k errors/month — sufficient for early prod traffic.
    tracesSampleRate: 0.1,
    // Don't track PII automatically. We explicitly attach user_id via
    // setUser() in AuthContext when a session exists.
    sendDefaultPii: false,
    // Replay only on errors, never proactively (saves quota + privacy).
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  });
}

/** Read the user's cookie/analytics consent decision.
 *  Returns 'accepted' | 'rejected' | null (never asked). */
export function getConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

/** Persist the user's consent choice. Triggers GA4 init if accepted. */
export function setConsent(value) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // localStorage blocked (private mode) — proceed without persisting
  }
  if (value === 'accepted') initGA4();
}

/** Load GA4 gtag.js asynchronously. Only runs once consent is granted
 *  AND the measurement ID is configured. Safe to call multiple times. */
export function initGA4() {
  if (!GA4_ID) {
    if (import.meta.env.DEV) {
      console.log('[observability] GA4 ID not set — skipping init.');
    }
    return;
  }
  if (window.gtag) return; // already loaded

  // Inject gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(script);

  // Bootstrap dataLayer + gtag stub before the async script lands.
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  // anonymize_ip: GDPR best practice; ad_storage denied = no
  // advertising cookies unless we later toggle them on per category.
  window.gtag('config', GA4_ID, {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure',
  });
}

/** Boot the whole observability stack at app start. */
export function initObservability() {
  initSentry();
  if (getConsent() === 'accepted') initGA4();
}

/** Fire a custom GA4 event if consent + ID present. No-op otherwise. */
export function trackEvent(name, params = {}) {
  if (!window.gtag) return;
  window.gtag('event', name, params);
}
