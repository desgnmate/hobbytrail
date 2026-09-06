import { NextResponse } from "next/server";
import { isSameOrigin } from "@/lib/cms/request-security";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const client = await createSupabaseServerClient();
  if (client) await client.auth.signOut();
  return NextResponse.json({ ok: true });
}
