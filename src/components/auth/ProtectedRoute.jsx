import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { SplashScreen } from '@/components/SplashScreen';

const PROFILE_TIMEOUT_MS = 4000;

/**
 * ProtectedRoute — gates a route on the following checks (in order):
 *
 *   1. Authenticated session (otherwise → /auth/login).
 *   2. Onboarding completed (otherwise → /onboarding) unless the
 *      route opts out via requireOnboarding={false}.
 *   3a. requirePremium  — active subscription OR in-trial users pass.
 *       Non-premium logged-in users → /pricing.
 *   3b. requirePremiumStrict — only active subscriptions pass.
 *       Trial users are NOT enough. Used for routes/features that we
 *       reveal only post-purchase (Strategy Library full playbooks,
 *       Saved Strategies, Alerts, Wallet, etc.).
 *
 * Both premium checks default to TRUE — opt out per route as needed.
 *
 * If both requirePremium and requirePremiumStrict are set, strict wins.
 */
function ProtectedRoute({
  children,
  requireOnboarding = true,
  requirePremium = true,
  requirePremiumStrict = false,
}) {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: subLoading } = useSubscription();
  const location = useLocation();
  const [profileTimedOut, setProfileTimedOut] = useState(false);

  useEffect(() => {
    if (!subLoading) {
      setProfileTimedOut(false);
      return;
    }
    const t = setTimeout(() => setProfileTimedOut(true), PROFILE_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [subLoading]);

  if (authLoading) return <SplashScreen />;

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  const needsProfile = requireOnboarding || requirePremium || requirePremiumStrict;
  const stillWaitingForProfile = needsProfile && subLoading && !profileTimedOut;
  if (stillWaitingForProfile) {
    return <SplashScreen />;
  }

  if (
    requireOnboarding &&
    profile &&
    profile.onboarding_done === false &&
    location.pathname !== '/onboarding'
  ) {
    return <Navigate to="/onboarding" replace />;
  }

  // Admins bypass ALL premium gates (founder + support access). Source of
  // truth is profile.role; fallback to JWT user_metadata.role in case the
  // sync trigger hasn't propagated yet for a brand-new admin.
  const isAdmin =
    profile?.role === 'admin' || user?.user_metadata?.role === 'admin';

  // Derive premium flags once
  const stripeActive =
    profile?.subscription_status === 'active' ||
    profile?.subscription_status === 'trialing';
  const trialEnd = profile?.trial_end ? new Date(profile.trial_end) : null;
  const inLocalTrial = trialEnd && trialEnd.getTime() > Date.now();

  // STRICT: only paying customers (trial does NOT count) — admins bypass
  if (
    requirePremiumStrict &&
    !stripeActive &&
    !isAdmin &&
    location.pathname !== '/pricing'
  ) {
    return <Navigate to="/pricing?subscribe=required" replace />;
  }

  // PREMIUM: paying customers OR trial users — admins bypass
  if (
    requirePremium &&
    !stripeActive &&
    !inLocalTrial &&
    !isAdmin &&
    location.pathname !== '/pricing'
  ) {
    return <Navigate to="/pricing?subscribe=required" replace />;
  }

  return children;
}

export default ProtectedRoute;
