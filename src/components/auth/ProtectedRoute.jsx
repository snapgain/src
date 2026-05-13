import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { SplashScreen } from '@/components/SplashScreen';

const PROFILE_TIMEOUT_MS = 4000;

/**
 * ProtectedRoute — gates a route on:
 *   1. Authenticated session (otherwise → /auth/login).
 *   2. Onboarding completed (otherwise → /onboarding) unless the
 *      route opts out via requireOnboarding={false}.
 *
 * While auth or profile is loading, renders the branded SplashScreen
 * instead of the bare spinner. If the profile lookup hangs (Supabase
 * down, RLS blocking, etc.) we fall through after PROFILE_TIMEOUT_MS
 * so the app stays usable instead of stuck on the splash.
 */
function ProtectedRoute({ children, requireOnboarding = true }) {
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
  if (requireOnboarding && subLoading && !profileTimedOut) {
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

  return children;
}

export default ProtectedRoute;
