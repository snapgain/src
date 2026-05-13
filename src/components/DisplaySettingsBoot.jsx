import { useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { loadUserPrefs } from '@/lib/userPrefs';
import {
  applyDisplaySettings,
  watchSystemTheme,
} from '@/lib/displaySettings';

/**
 * DisplaySettingsBoot — loads the user's saved theme / font-size /
 * motion / contrast prefs on mount and applies them to <html>. Also
 * listens for system theme changes when `theme: 'auto'` is in use.
 *
 * Renders nothing. Mounted once near the top of the tree.
 */
export function DisplaySettingsBoot() {
  const { user } = useAuth();

  // Apply saved prefs as soon as we know who the user is.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const prefs = await loadUserPrefs(user?.id);
        if (alive) applyDisplaySettings(prefs);
      } catch (err) {
        console.warn('[DisplaySettingsBoot] failed to apply prefs:', err);
      }
    })();
    return () => {
      alive = false;
    };
  }, [user?.id]);

  // Re-apply when the OS color-scheme flips, in case theme is 'auto'.
  useEffect(() => {
    const stop = watchSystemTheme(async () => {
      try {
        const prefs = await loadUserPrefs(user?.id);
        if (prefs.theme === 'auto') applyDisplaySettings(prefs);
      } catch {
        /* ignore */
      }
    });
    return stop;
  }, [user?.id]);

  return null;
}

export default DisplaySettingsBoot;
