import { NextResponse } from "next/server";
import { isSameOrigin } from "@/lib/cms/request-security";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const client = await createSupabaseServerClient();
  if (!client) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });

  const body = await request.json().catch(() => null) as { email?: unknown; password?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!email || !password) return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });

  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.user) return NextResponse.json({ error: "That email or password is not valid." }, { status: 401 });

  const { data: membership, error: membershipError } = await client
    .from("cms_admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (membershipError) {
    await client.auth.signOut();
    return NextResponse.json({ error: "CMS database setup is incomplete. Run the Supabase migration first." }, { status: 503 });
  }

  if (!membership) {
    await client.auth.signOut();
    return NextResponse.json({ error: "Your account is not approved for the CMS." }, { status: 403 });
  }

  return NextResponse.json({ ok: true, email: data.user.email });
}
