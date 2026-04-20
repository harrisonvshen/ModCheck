import { createClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────
// Replace these with your Supabase project values
// Found at: https://app.supabase.com → Settings → API
// ─────────────────────────────────────────────
const SUPABASE_URL = 'https://nshihunkpqdsmtjlqtzx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_UE7dHMDwpZIaCln4VGMsWQ_yQvrbujC';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
