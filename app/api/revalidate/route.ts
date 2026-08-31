import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

const allowedTypes = new Set(["event", "venue", "sponsor", "testimonial", "collection", "guide", "page", "siteSettings"]);

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return Response.json({ message: "Revalidation is not configured." }, { status: 503 });

  const { isValidSignature, body } = await parseBody<{ _type?: string }>(request, secret);
  if (!isValidSignature) return Response.json({ message: "Invalid signature." }, { status: 401 });

  if (body?._type && allowedTypes.has(body._type)) revalidateTag(body._type, { expire: 0 });
  revalidateTag("cms-content", { expire: 0 });
  return Response.json({ revalidated: true, now: Date.now() });
}
