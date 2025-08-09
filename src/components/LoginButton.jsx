// src/components/LoginButton.jsx
import { supabase } from '../lib/supabase';

export default function LoginButton() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }, // volta para seu domínio
    });
  };

  return (
    <button onClick={handleLogin} className="px-4 py-2 rounded bg-primary text-white">
      Entrar com Google
    </button>
  );
}
