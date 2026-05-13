// AuthCallbackPage — the URL Supabase OAuth (Google, etc.) redirects
// back to after the user authorises. The Supabase JS SDK processes
// the access_token from the URL hash in the background and fires a
// SIGNED_IN auth event that the AuthContext picks up.
//
// We wait for the session to resolve, then either:
//   1. If the user clicked "Start subscription" before signing up,
//      we have a pendingCheckout intent in localStorage. Bounce them
//      to /pricing?action=checkout&plan=... so Stripe Checkout fires
//      immediately and the funnel completes.
//   2. Otherwise, send them to /home (their normal dashboard).

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { SplashScreen } from '@/components/SplashScreen';

const PENDING_TTL_MS = 30 * 60 * 1000; // 30 minutes

function AuthCallbackPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Wait for Supabase to finish processing the OAuth fragment.
    if (loading) return;

    // Check for a checkout intent stored before the auth round-trip.
    let pending = null;
    try {
      const raw = localStorage.getItem('pendingCheckout');
      if (raw) {
        pending = JSON.parse(raw);
        // Stale intents (older than 30 min) get discarded.
        if (!pending?.timestamp || Date.now() - pending.timestamp > PENDING_TTL_MS) {
          pending = null;
        }
      }
    } catch {
      pending = null;
    }

    if (pending && user) {
      // Hand them straight to Stripe Checkout via the pricing page's
      // auto-fire effect.
      localStorage.removeItem('pendingCheckout');
      const plan = pending.plan === 'yearly' ? 'yearly' : 'monthly';
      navigate(`/pricing?action=checkout&plan=${plan}`, { replace: true });
      return;
    }

    if (user) {
      navigate('/home', { replace: true });
    } else {
      navigate('/auth/login', { replace: true });
    }
  }, [user, loading, navigate]);

  return <SplashScreen />;
}

export default AuthCallbackPage;
