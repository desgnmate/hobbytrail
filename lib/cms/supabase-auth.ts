import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CmsAuthStatus = {
  configured: boolean;
  user: { id: string; email?: string } | null;
  isAdmin: boolean;
  membershipError?: string;
};

export async function getCmsAuthStatus(): Promise<CmsAuthStatus> {
  const client = await createSupabaseServerClient();
  if (!client) return { configured: false, user: null, isAdmin: false };

  const { data: { user } } = await client.auth.getUser();
  if (!user) return { configured: true, user: null, isAdmin: false };

  const { data: membership, error } = await client
    .from("cms_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    configured: true,
    user: { id: user.id, email: user.email },
    isAdmin: Boolean(membership && !error),
    membershipError: error?.message,
  };
}

export async function requireCmsAdmin() {
  const status = await getCmsAuthStatus();
  if (!status.configured) throw new Error("Supabase is not configured.");
  if (!status.user) throw new Error("Authentication required.");
  if (status.membershipError) throw new Error("CMS database setup is incomplete.");
  if (!status.isAdmin) throw new Error("CMS admin access required.");
  return status.user;
}
