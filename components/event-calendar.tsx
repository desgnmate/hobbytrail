import Link from "next/link";
import { MapPin } from "@phosphor-icons/react/dist/ssr";
import type { HobbyEvent } from "@/data/site-data";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function eventDateParts(date: string) {
  const parts = new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Melbourne", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(date));
  const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  return { year: get("year"), month: get("month"), day: get("day") };
}

export function EventCalendar({ events }: { events: HobbyEvent[] }) {
  const groups = new Map<string, HobbyEvent[]>();
  for (const event of events) {
    const { year, month } = eventDateParts(event.date);
    const key = `${year}-${String(month).padStart(2, "0")}`;
    groups.set(key, [...(groups.get(key) ?? []), event]);
  }

  if (!groups.size) return <div className="empty-state"><h2>No published events yet.</h2><p>The calendar will update automatically when an event is published in the CMS.</p></div>;

  return (
    <div className="calendar-list">
      {[...groups.entries()].map(([key, monthEvents]) => {
        const [year, month] = key.split("-").map(Number);
        const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
        const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
        const monthName = new Intl.DateTimeFormat("en-AU", { month: "long", year: "numeric", timeZone: "Australia/Melbourne" }).format(new Date(`${key}-01T12:00:00+10:00`));
        const eventsByDay = new Map<number, HobbyEvent[]>();
        for (const event of monthEvents) {
          const day = eventDateParts(event.date).day;
          eventsByDay.set(day, [...(eventsByDay.get(day) ?? []), event]);
        }

        return (
          <section className="calendar-month" key={key} aria-labelledby={`month-${key}`}>
            <div className="calendar-month__heading"><div><p className="detail-kicker">Event calendar</p><h2 id={`month-${key}`}>{monthName}</h2></div><p>{monthEvents.length} {monthEvents.length === 1 ? "event" : "events"}</p></div>
            <div className="calendar-grid" role="grid" aria-label={monthName}>
              {weekdayLabels.map((label) => <div className="calendar-grid__weekday" role="columnheader" key={label}>{label}</div>)}
              {Array.from({ length: firstWeekday }).map((_, index) => <div className="calendar-day calendar-day--empty" role="gridcell" key={`blank-${index}`} />)}
              {Array.from({ length: daysInMonth }, (_, index) => index + 1).map((day) => (
                <div className={`calendar-day${eventsByDay.has(day) ? " calendar-day--active" : ""}`} role="gridcell" key={day}>
                  <span className="calendar-day__number">{day}</span>
                  <div className="calendar-day__events">
                    {(eventsByDay.get(day) ?? []).map((event) => <Link href={`/events/${event.slug}`} key={event.slug}><strong>{event.title}</strong><span>{event.time}</span><small><MapPin size={13} weight="fill" />{event.city}</small></Link>)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
