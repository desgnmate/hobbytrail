import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { PageShell } from "@/components/page-shell";

export default function NotFound() {
  return <PageShell><section className="not-found"><Image src="/assets/brand/logo-badge.png" alt="Hobby Trail bear checking the map" width={1024} height={1024} /><div><p>Page not found</p><h1>This path ends here.</h1><p>The page may have moved, or the link may be out of date.</p><Link className="button button--yellow" href="/"><ArrowLeft size={18} /> Back to the trail</Link></div></section></PageShell>;
}
