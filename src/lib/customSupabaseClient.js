import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ffowgyjdbgkphsflxybk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmb3dneWpkYmdrcGhzZmx4eWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMjkwNzIsImV4cCI6MjA2ODYwNTA3Mn0.nhHxBCIloaci-emq6svbD2XT3kaR85Jl-SJTW3s9eiQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);