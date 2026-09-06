import "server-only";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

export const supabasePublic = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    })
  : null;
