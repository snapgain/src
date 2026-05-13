import { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

/**
 * useAlerts — pulls the most-recent hot_deals (already RLS-filtered to
 * active in-window rows) and computes how many are "new" since the
 * user's `last_alerts_seen_at` watermark.
 *
 * markAllRead() updates the watermark to now() so the bell badge clears.
 */
export function useAlerts({ limit = 50 } = {}) {
  const { user } = useAuth();
  const [deals, setDeals] = useState([]);
  const [lastSeenAt, setLastSeenAt] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const dealsP = supabase
        .from('hot_deals')
        .select(
          'id, title, description, platform, badge, rate_display, cta_url, created_at, store:stores(id, slug, name, domain, logo_url)'
        )
        .order('created_at', { ascending: false })
        .limit(limit);
      const profileP = user
        ? supabase
            .from('user_profiles')
            .select('last_alerts_seen_at')
            .eq('user_id', user.id)
            .maybeSingle()
        : Promise.resolve({ data: null });

      const [dealsRes, profileRes] = await Promise.all([dealsP, profileP]);
      setDeals(dealsRes?.data || []);
      setLastSeenAt(profileRes?.data?.last_alerts_seen_at || null);
    } catch (err) {
      console.warn('[useAlerts] fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [user, limit]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Realtime: refetch when a hot_deal changes. Channel name is unique
  // per mount so React StrictMode's double-invoke doesn't try to add
  // `.on()` to an already-subscribed channel (which throws).
  useEffect(() => {
    const channel = supabase
      .channel(`alerts:hot_deals:${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'hot_deals' },
        () => refresh()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh]);

  const lastSeenMs = lastSeenAt ? new Date(lastSeenAt).getTime() : 0;
  const unreadCount = useMemo(
    () =>
      deals.filter((d) => new Date(d.created_at).getTime() > lastSeenMs).length,
    [deals, lastSeenMs]
  );

  const markAllRead = useCallback(async () => {
    if (!user) return;
    const nowIso = new Date().toISOString();
    await supabase
      .from('user_profiles')
      .update({ last_alerts_seen_at: nowIso })
      .eq('user_id', user.id);
    setLastSeenAt(nowIso);
  }, [user]);

  return { deals, unreadCount, lastSeenAt, loading, refresh, markAllRead };
}
