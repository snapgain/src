import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { FcGoogle } from 'react-icons/fc';

export function GoogleAuthButton({ className }) {
  const { signInWithProvider } = useAuth();

  const handleGoogleLogin = async () => {
    await signInWithProvider('google');
  };

  return (
    <Button
      type="button"
      onClick={handleGoogleLogin}
      className={`w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 ${className}`}
      aria-label="Continue with Google"
    >
      <FcGoogle className="w-5 h-5" />
      Continue with Google
    </Button>
  );
}
