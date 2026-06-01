import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';

/**
 * OAuthButtons — Google sign-in button that delegates to Supabase's
 * OAuth flow. Google must be enabled in Supabase Dashboard →
 * Authentication → Providers (see SETUP_OAUTH.md).
 *
 * Apple sign-in was removed (2026-06-01) — Apple Developer Program
 * membership costs $99/yr and we're not paying yet. Re-add the button
 * + provider in Supabase when we decide to enroll.
 */
function GoogleIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.4 4 9.8 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.4 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.7 39.6 16.3 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.4-2.4 4.5-4.5 5.9l6.2 5.2c-.4.4 6.6-4.8 6.6-15.1 0-1.3-.1-2.4-.4-3.5z"/>
    </svg>
  );
}

export function OAuthButtons({ disabled = false }) {
  const { signInWithProvider } = useAuth();
  const [busy, setBusy] = useState(null); // 'google' | null

  const handleClick = async (provider) => {
    if (busy) return;
    setBusy(provider);
    try {
      await signInWithProvider(provider);
      // On success the user is redirected away by Supabase.
      // On error the toast handles UX; reset busy here.
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="w-full bg-white text-gray-700 hover:bg-gray-50"
        onClick={() => handleClick('google')}
        disabled={disabled || !!busy}
      >
        {busy === 'google' ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <GoogleIcon className="w-5 h-5 mr-2" />
        )}
        Continue with Google
      </Button>
    </div>
  );
}

export default OAuthButtons;
