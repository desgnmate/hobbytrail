import { draftMode } from "next/headers";

export async function POST(request: Request) {
  const draft = await draftMode();
  draft.disable();
  return Response.redirect(new URL("/", request.url), 303);
}
