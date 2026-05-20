/**
 * useUserPrefs — reactive read of the current user's preferences blob.
 *
 * Reads via loadUserPrefs (Supabase + localStorage fallback). Listens
 * to a `snapgain:prefs-updated` window event so other parts of the app
 * (e.g. SettingsPage after save) can trigger a re-read without us
 * needing a global store.
 *
 * Returns the merged prefs object (always defined — defaults applied
 * by loadUserPrefs). For a single preference use the derived selectors
 * below to avoid re-renders on unrelated changes.
 */

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { loadUserPrefs } from '@/lib/userPrefs';

const REFRESH_EVENT = 'snapgain:prefs-updated';

export function useUserPrefs() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setPrefs(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const p = await loadUserPrefs(user.id);
    setPrefs(p);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Refresh when other components signal prefs were saved.
  useEffect(() => {
    const onUpdated = () => refresh();
    window.addEventListener(REFRESH_EVENT, onUpdated);
    return () => window.removeEventListener(REFRESH_EVENT, onUpdated);
  }, [refresh]);

  return { prefs, loading, refresh };
}

/** Helper for one-shot consumers: returns just the walletOnly flag.
 *  Defaults to false until prefs are loaded so we never accidentally
 *  hide all routes on first paint. setWalletOnly toggles + persists +
 *  notifies other views in the same window.
 *  2026-05-20: added setter so Hot Deals page can flip the toggle
 *  inline (was only readable before; SettingsPage owned the writes). */
export function useWalletOnlyPref() {
  const { prefs, loading, refresh } = useUserPrefs();
  const { user } = useAuth();
  const setWalletOnly = useCallback(
    async (value) => {
      if (!user) return;
      // Lazy-import to dodge a circular dep risk.
      const { saveUserPrefs } = await import('@/lib/userPrefs');
      await saveUserPrefs(user.id, { ...(prefs || {}), walletOnly: !!value });
      notifyPrefsChanged();
      await refresh();
    },
    [user, prefs, refresh]
  );
  return { walletOnly: !!prefs?.walletOnly, loading, setWalletOnly };
}

/** Components that save prefs should call this so other live views
 *  pick up the change immediately. */
export function notifyPrefsChanged() {
  try {
    window.dispatchEvent(new Event(REFRESH_EVENT));
  } catch {
    // server-side or constrained env — best effort only
  }
}
