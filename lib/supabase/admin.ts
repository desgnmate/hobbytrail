import "server-only";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseAdminConfigured, supabaseUrl } from "@/lib/supabase/config";

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const supabaseAdmin = isSupabaseAdminConfigured
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    })
  : null;
