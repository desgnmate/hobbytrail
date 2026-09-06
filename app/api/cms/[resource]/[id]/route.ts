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

function revalidateResource(resource: CmsResource) {
  for (const path of publicPaths[resource]) revalidatePath(path);
  if (resource === "events") revalidatePath("/events/[slug]", "page");
  if (resource === "collections") revalidatePath("/collections/[slug]", "page");
  if (resource === "guides") revalidatePath("/guides/[slug]", "page");
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

async function getContext(request: Request, context: { params: Promise<{ resource: string; id: string }> }) {
  const { resource: resourceParam, id } = await context.params;
  if (!isCmsResource(resourceParam)) return { resource: null, id };
  return { resource: resourceParam, id };
}

export async function PATCH(request: Request, context: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await getContext(request, context);
  if (!resource) return NextResponse.json({ error: "Unknown CMS resource." }, { status: 404 });
  if (resource === "settings" && id !== "default") return NextResponse.json({ error: "Unknown settings record." }, { status: 404 });
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });

  try {
    await requireCmsAdmin();
    if (!supabaseAdmin) return NextResponse.json({ error: "Supabase server credentials are not configured." }, { status: 503 });
    const payload = sanitizePayload(resource, await request.json() as Record<string, unknown>, true);
    const definition = getResourceDefinition(resource);
    const { data, error } = await supabaseAdmin.from(definition.table).update(payload).eq("id", id).select("*").single();
    if (error) return errorResponse(error, "Unable to update CMS record.", error.code === "23505" ? 409 : 500);
    revalidateResource(resource);
    return NextResponse.json({ record: data });
  } catch (error) {
    return errorResponse(error, "Unable to update CMS record.", errorStatus(error));
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await getContext(request, context);
  if (!resource) return NextResponse.json({ error: "Unknown CMS resource." }, { status: 404 });
  if (resource === "settings") return NextResponse.json({ error: "Site settings cannot be deleted." }, { status: 400 });
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });

  try {
    await requireCmsAdmin();
    if (!supabaseAdmin) return NextResponse.json({ error: "Supabase server credentials are not configured." }, { status: 503 });
    const definition = getResourceDefinition(resource);
    const { error } = await supabaseAdmin.from(definition.table).delete().eq("id", id);
    if (error) return errorResponse(error, "Unable to delete CMS record.");
    revalidateResource(resource);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error, "Unable to delete CMS record.", errorStatus(error));
  }
}
