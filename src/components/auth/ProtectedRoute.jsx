import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { SplashScreen } from '@/components/SplashScreen';

const PROFILE_TIMEOUT_MS = 4000;

/**
 * ProtectedRoute — gates a route on three checks (in order):
 *
 *   1. Authenticated session (otherwise → /auth/login).
 *   2. Onboarding completed (otherwise → /onboarding) unless the
 *      route opts out via requireOnboarding={false}.
 *   3. Premium subscription active or in trial (otherwise → /pricing)
 *      unless the route opts out via requirePremium={false}.
 *
 * While auth or profile is loading, renders the branded SplashScreen
 * instead of the bare spinner. If the profile lookup hangs (Supabase
 * down, RLS blocking, etc.) we fall through after PROFILE_TIMEOUT_MS
 * so the app stays usable instead of stuck on the splash.
 *
 * SnapGain is premium-only (no free tier), so requirePremium defaults
 * to true. Routes that must work without an active subscription
 * (onboarding, post-checkout success, account settings) opt out.
 */
function ProtectedRoute({
  children,
  requireOnboarding = true,
  requirePremium = true,
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

  // Wait for the profile to resolve so we don't bounce them around —
  // but cap it so a hung query doesn't trap the user on the splash.
  const stillWaitingForProfile =
    (requireOnboarding || requirePremium) && subLoading && !profileTimedOut;
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

  if (requirePremium) {
    // Active or trialing Stripe subscription counts as premium.
    // Local 7-day trial_end (set on signup elsewhere) is also honoured.
    const stripeActive =
      profile?.subscription_status === 'active' ||
      profile?.subscription_status === 'trialing';
    const trialEnd = profile?.trial_end ? new Date(profile.trial_end) : null;
    const inLocalTrial = trialEnd && trialEnd.getTime() > Date.now();
    const isPremium = stripeActive || inLocalTrial;

    if (!isPremium && location.pathname !== '/pricing') {
      return <Navigate to="/pricing?subscribe=required" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
