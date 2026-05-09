import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://ffowgyjdbgkphsflxybk.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmb3dneWpkYmdrcGhzZmx4eWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMjkwNzIsImV4cCI6MjA2ODYwNTA3Mn0.nhHxBCIloaci-emq6svbD2XT3kaR85Jl-SJTW3s9eiQ';

const g = globalThis;
if (!g.__snapgain_supabase__) {
  g.__snapgain_supabase__ = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'snapgain-auth',
      flowType: 'pkce',
    },
  });
}

export const supabase = g.__snapgain_supabase__;
export default supabase;
