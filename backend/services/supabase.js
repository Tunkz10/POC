import { createClient } from '@supabase/supabase-js';

let supabaseClient = null;

const getSupabase = () => {
  if (!supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseClient;
};

export const supabase = new Proxy({}, {
  get(target, prop) {
    return getSupabase()[prop];
  }
});

