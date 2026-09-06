import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isSameOrigin } from "@/lib/cms/request-security";
import { requireCmsAdmin } from "@/lib/cms/supabase-auth";
import { getResourceDefinition, isCmsResource, sanitizePayload } from "@/lib/cms/resources";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { CmsResource } from "@/lib/cms/types";

const publicPaths: Record<CmsResource, string[]> = {
  events: ["/", "/events", "/events/calendar"],
  collections: ["/", "/collections"],
  guides: ["/", "/guides"],
  sponsors: ["/", "/about"],
  testimonials: ["/", "/about"],
  settings: ["/", "/about", "/contact"],
};

function getResource(request: Request) {
  const resource = new URL(request.url).pathname.split("/").at(-1) ?? "";
  return isCmsResource(resource) ? resource : null;
}

function errorResponse(error: unknown, fallback: string, status = 500) {
  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json({ error: message }, { status });
}

function errorStatus(error: unknown, fallback = 500) {
  if (!(error instanceof Error)) return fallback;
  if (error.message.includes("Missing required") || error.message.includes("No editable")) return 400;
  if (error.message.includes("required") || error.message.includes("admin access")) return 401;
  return fallback;
}

function revalidateResource(resource: CmsResource) {
  for (const path of publicPaths[resource]) revalidatePath(path);
  if (resource === "events") revalidatePath("/events/[slug]", "page");
  if (resource === "collections") revalidatePath("/collections/[slug]", "page");
  if (resource === "guides") revalidatePath("/guides/[slug]", "page");
}

export async function GET(request: Request) {
  const resource = getResource(request);
  if (!resource) return NextResponse.json({ error: "Unknown CMS resource." }, { status: 404 });

  try {
    await requireCmsAdmin();
    if (!supabaseAdmin) return NextResponse.json({ error: "Supabase server credentials are not configured." }, { status: 503 });

    const definition = getResourceDefinition(resource);
    let query = supabaseAdmin.from(definition.table).select("*");
    if (resource === "settings") query = query.eq("id", "default");
    else if (resource === "sponsors") query = query.order("display_order", { ascending: true });
    else query = query.order("updated_at", { ascending: false });
    const { data, error } = await query.limit(resource === "settings" ? 1 : 100);
    if (error) return errorResponse(error, "Unable to load CMS records.");
    return NextResponse.json({ records: data ?? [] });
  } catch (error) {
    return errorResponse(error, "Unable to load CMS records.", errorStatus(error));
  }
}

export async function POST(request: Request) {
  const resource = getResource(request);
  if (!resource) return NextResponse.json({ error: "Unknown CMS resource." }, { status: 404 });
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });

  try {
    await requireCmsAdmin();
    if (!supabaseAdmin) return NextResponse.json({ error: "Supabase server credentials are not configured." }, { status: 503 });
    const input = await request.json() as Record<string, unknown>;
    const payload = sanitizePayload(resource, input);
    const definition = getResourceDefinition(resource);
    const { data, error } = await supabaseAdmin.from(definition.table).insert(payload).select("*").single();
    if (error) return errorResponse(error, "Unable to create CMS record.", error.code === "23505" ? 409 : 500);
    revalidateResource(resource);
    return NextResponse.json({ record: data }, { status: 201 });
  } catch (error) {
    return errorResponse(error, "Unable to create CMS record.", errorStatus(error));
  }
}
