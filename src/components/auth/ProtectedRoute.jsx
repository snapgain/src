import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { SplashScreen } from '@/components/SplashScreen';

/**
 * ProtectedRoute — gates a route on:
 *   1. Authenticated session (otherwise → /auth/login).
 *   2. Onboarding completed (otherwise → /onboarding) unless the
 *      route opts out via requireOnboarding={false}.
 *
 * While auth or profile is loading, renders the branded SplashScreen
 * instead of the bare spinner.
 */
function ProtectedRoute({ children, requireOnboarding = true }) {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: subLoading } = useSubscription();
  const location = useLocation();

  if (authLoading) return <SplashScreen />;

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Wait for the profile to resolve so we don't bounce them around
  if (requireOnboarding && subLoading) return <SplashScreen />;

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
