import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Content Studio",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function StudioPage() {
  redirect("/admin");
}
