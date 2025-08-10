// src/components/AuthStatus.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthStatus() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">Olá, {session.user.email}</span>
      <button onClick={handleLogout} className="px-3 py-1 rounded border">
        Sair
      </button>
    </div>
  );
}
