export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const isSupabaseAdminConfigured = Boolean(isSupabaseConfigured && process.env.SUPABASE_SERVICE_ROLE_KEY);
