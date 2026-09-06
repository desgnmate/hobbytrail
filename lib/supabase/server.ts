import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured) return null;

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot always write cookies. Proxy refreshes the
          // session on navigations, while Route Handlers can still persist it.
        }
      },
    },
  });
}

export async function getSupabaseUser() {
  const client = await createSupabaseServerClient();
  if (!client) return null;

  const { data: { user } } = await client.auth.getUser();
  return user;
}
