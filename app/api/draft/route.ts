import { draftMode } from "next/headers";

function isSafePath(path: string) {
  return path.startsWith("/") && !path.startsWith("//") && !path.includes("\\");
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug") ?? "/";

  if (!process.env.SANITY_DRAFT_SECRET || secret !== process.env.SANITY_DRAFT_SECRET || !isSafePath(slug)) {
    return Response.json({ message: "Invalid preview request." }, { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();
  return Response.redirect(new URL(slug, origin));
}
