import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ffowgyjdbgkphsflxybk.supabase.co';
// New "Publishable" key (sb_publishable_*) — replaces the old anon
// JWT format. Safe to expose in the browser bundle; RLS still
// controls what each user can read/write.
const supabaseAnonKey = 'sb_publishable_fG0AhiV3dznAp7DcHm5jPA_jepTG5-W';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);