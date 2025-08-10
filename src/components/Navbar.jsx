import React from 'react';
import { supabase } from '../lib/supabase';

function Navbar() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  return (
    <nav>
      {/* Outros elementos da sua navbar */}
      <button onClick={signInWithGoogle}>
        Login com Google
      </button>
    </nav>
  );
}

export default Navbar;
