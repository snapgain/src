// Legacy import path kept for backwards compatibility. 25+ files
// import from here; rather than touch them all, this file re-exports
// the canonical singleton from `./supabase`. Both paths now resolve
// to the SAME Supabase client instance, so getSession() works
// consistently regardless of which file is doing the auth dance.
//
// Prefer `import { supabase } from '@/lib/supabase'` in new code.

export { supabase, default } from './supabase';
