import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';

/**
 * OAuthButtons — Google and Apple sign-in buttons that delegate to
 * Supabase's OAuth flow. The providers must be enabled in Supabase
 * Dashboard → Authentication → Providers (see SETUP_OAUTH.md).
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

function AppleIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.41 2.18-1.23 3.13-1.01 1.16-2.23 1.83-3.55 1.72-.04-1.13.4-2.21 1.21-3.18.85-1.04 2.21-1.79 3.31-1.81.04.04.06.05.07.07.13.04.18.04.19.07zM20.4 17.4c-.55 1.27-.81 1.84-1.52 2.96-1 1.55-2.42 3.49-4.17 3.51-1.55.02-1.95-1.01-4.06-.99-2.11.01-2.55 1.01-4.1.99-1.75-.02-3.09-1.78-4.09-3.34-2.79-4.34-3.09-9.43-1.36-12.13.95-1.49 2.45-2.36 3.86-2.36 1.43 0 2.34.79 3.53.79 1.16 0 1.86-.79 3.52-.79 1.25 0 2.59.68 3.55 1.86-3.12 1.71-2.62 6.17.84 7.5z"/>
    </svg>
  );
}

export function OAuthButtons({ disabled = false }) {
  const { signInWithProvider } = useAuth();
  const [busy, setBusy] = useState(null); // 'google' | 'apple' | null

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
      <Button
        type="button"
        variant="outline"
        className="w-full bg-black text-white hover:bg-gray-900 border-black"
        onClick={() => handleClick('apple')}
        disabled={disabled || !!busy}
      >
        {busy === 'apple' ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <AppleIcon className="w-5 h-5 mr-2" />
        )}
        Continue with Apple
      </Button>
    </div>
  );
}

export default OAuthButtons;
