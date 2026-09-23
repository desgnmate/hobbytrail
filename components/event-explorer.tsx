"use client";

import Link from "next/link";
import { ArrowRight, Clock, MapPin, UsersThree } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import type { HobbyEvent } from "@/data/site-data";
import { TicketCta } from "@/components/ticket-cta";

export function EventExplorer({ events }: { events: HobbyEvent[] }) {
  const [game, setGame] = useState("All");
  const [city, setCity] = useState("All");
  const [level, setLevel] = useState("All");

  const games = ["All", ...Array.from(new Set(events.map((event) => event.game)))];
  const cities = ["All", ...Array.from(new Set(events.map((event) => event.city)))];
  const levels = ["All", ...Array.from(new Set(events.map((event) => event.level)))];

  const filtered = useMemo(
    () => events.filter((event) => (game === "All" || event.game === game) && (city === "All" || event.city === city) && (level === "All" || event.level === level)),
    [events, game, city, level],
  );

  return (
    <>
      <div className="filter-bar" role="group" aria-label="Event filters">
        <div className="filter-field">
          <label htmlFor="event-game">Game</label>
          <select id="event-game" value={game} onChange={(event) => setGame(event.target.value)}>
            {games.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="event-city">City</label>
          <select id="event-city" value={city} onChange={(event) => setCity(event.target.value)}>
            {cities.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="event-level">Skill level</label>
          <select id="event-level" value={level} onChange={(event) => setLevel(event.target.value)}>
            {levels.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <p className="results-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? "event" : "events"}</p>
      </div>

      {filtered.length ? (
        <div className="event-index-grid">
          {filtered.map((event) => (
            <article className="event-index-card" key={event.slug}>
              <div className="event-index-card__date"><span>{event.month}</span><strong>{event.day}</strong><span>{event.weekday}</span></div>
              <div className="event-index-card__body">
                <div className="event-index-card__topline"><span>{event.game}</span><span className={`status status--${event.status.toLowerCase().replaceAll(" ", "-")}`}>{event.status}</span></div>
                <h2>{event.title}</h2>
                <p>{event.description}</p>
                <div className="event-meta">
                  <span><Clock size={18} weight="fill" /> {event.time}</span>
                  <span><MapPin size={18} weight="fill" /> {event.venue}, {event.city}</span>
                  <span><UsersThree size={18} weight="fill" /> {event.level}</span>
                </div>
                <div className="event-index-card__actions"><Link className="button button--light" href={`/events/${event.slug}`} prefetch={true}>View event <ArrowRight size={18} /></Link><TicketCta event={event} /></div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No events on this path yet.</h2>
          <p>Try another city, game, or skill level. New gatherings are added as soon as details are verified.</p>
          <button className="button button--black" type="button" onClick={() => { setGame("All"); setCity("All"); setLevel("All"); }}>Clear filters</button>
        </div>
      )}
    </>
  );
}
