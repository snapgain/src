import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

/**
 * useSubscription — reads the current user's row from public.user_profiles
 * and exposes derived subscription state. Subscribes to Realtime so that
 * webhook-driven updates (active → canceled, etc.) propagate without a
 * page refresh.
 *
 * Derived flags:
 *   isActive  — Stripe says the subscription is `active` or `trialing`
 *   inTrial   — no active sub, but the locally-managed 7-day trial_end is in the future
 *   isPremium — isActive || inTrial. Use this to gate features.
 */
export function useSubscription() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(
          'id, role, plan, subscription_status, stripe_customer_id, stripe_subscription_id, current_period_end, trial_end, onboarding_done'
        )
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) {
        console.warn('[useSubscription] profile fetch error:', error.message);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.warn('[useSubscription] unexpected error:', err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Realtime: webhook updates flow back here without refresh. Suffix
  // the channel name with a random token so re-mounts (StrictMode,
  // navigation back-and-forth) don't collide with an already-subscribed
  // channel — which would throw "cannot add postgres_changes after subscribe()".
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`user_profile:${user.id}:${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles',
          filter: `user_id=eq.${user.id}`,
        },
        () => refresh()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refresh]);

  const now = Date.now();
  const trialEndMs = profile?.trial_end ? new Date(profile.trial_end).getTime() : 0;
  const periodEndMs = profile?.current_period_end
    ? new Date(profile.current_period_end).getTime()
    : 0;

  const status = profile?.subscription_status || null;
  const isActive = status === 'active' || status === 'trialing';
  const inTrial = !isActive && trialEndMs > now;
  const isPremium = isActive || inTrial;
  const isAdmin = (profile?.role || user?.user_metadata?.role) === 'admin';

  // Days remaining (rounded down) on whichever clock applies
  const trialDaysLeft = inTrial
    ? Math.max(0, Math.floor((trialEndMs - now) / (1000 * 60 * 60 * 24)))
    : 0;
  const periodDaysLeft = isActive && periodEndMs
    ? Math.max(0, Math.floor((periodEndMs - now) / (1000 * 60 * 60 * 24)))
    : 0;

  return {
    profile,
    loading,
    refresh,
    isPremium,
    inTrial,
    isActive,
    isAdmin,
    plan: profile?.plan || null,
    status,
    trialEndsAt: profile?.trial_end || null,
    periodEndsAt: profile?.current_period_end || null,
    trialDaysLeft,
    periodDaysLeft,
  };
}
