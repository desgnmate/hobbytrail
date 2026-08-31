import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

async function exitPreview() {
  "use server";
  const draft = await draftMode();
  draft.disable();
  redirect("/");
}

export async function PreviewBanner() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;
  return <aside className="preview-banner" role="status"><span>Sanity preview mode is active.</span><form action={exitPreview}><button type="submit">Exit preview</button></form></aside>;
}
