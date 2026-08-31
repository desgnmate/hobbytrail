import Link from "next/link";
import type { HobbyEvent } from "@/data/site-data";

export function TicketCta({ event, className = "button button--yellow", compact = false }: { event: HobbyEvent; className?: string; compact?: boolean }) {
  const live = Boolean(event.ticketUrl && (event.ticketStatus === "On sale" || event.ticketStatus === "Free registration"));
  const label = event.ticketStatus === "Free registration" ? "Register free" : event.ticketStatus === "On sale" ? "Buy tickets" : event.ticketStatus;

  if (live && event.ticketUrl) {
    const external = event.ticketUrl.startsWith("http");
    if (external) return <a className={className} href={event.ticketUrl} target="_blank" rel="noreferrer">{label}{!compact && <span className="sr-only"> for {event.title} (opens in a new tab)</span>}</a>;
    return <Link className={className} href={event.ticketUrl}>{label}{!compact && <span className="sr-only"> for {event.title}</span>}</Link>;
  }

  return <span className={`${className} button--disabled`} aria-disabled="true">{label}</span>;
}
