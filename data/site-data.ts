export type EventStatus = "Open" | "Filling fast" | "Sold out";
export type TicketStatus = "On sale" | "Free registration" | "Coming soon" | "Sold out" | "Sales closed";

export type HobbyEvent = {
  slug: string;
  title: string;
  date: string;
  month: string;
  day: string;
  weekday: string;
  time: string;
  endTime: string;
  game: string;
  type: string;
  level: string;
  venue: string;
  address: string;
  city: string;
  fee: string;
  capacity: string;
  status: EventStatus;
  ticketStatus: TicketStatus;
  ticketUrl?: string;
  image: string;
  description: string;
  bring: string[];
};

export const events: HobbyEvent[] = [
  {
    slug: "weekend-trade-day",
    title: "Weekend Trade Day",
    date: "2026-09-12T10:00:00+10:00",
    month: "Sep",
    day: "12",
    weekday: "Saturday",
    time: "10:00 AM",
    endTime: "5:00 PM",
    game: "All TCGs",
    type: "Trading",
    level: "All levels",
    venue: "MCEC Convention Centre",
    address: "1 Convention Centre Place, South Wharf VIC 3006, Australia",
    city: "South Wharf",
    fee: "Free",
    capacity: "Open seating",
    status: "Open",
    ticketStatus: "Coming soon",
    image: "/stock/guide-first-event.jpg",
    description: "A relaxed all-day meet for collectors to trade, compare binders, and meet people across different games.",
    bring: ["A clearly organized trade binder", "Card sleeves and top loaders", "A written want list", "A valid photo ID for high-value trades"],
  },
  {
    slug: "beginner-league-night",
    title: "Beginner League Night",
    date: "2026-09-18T18:30:00+10:00",
    month: "Sep",
    day: "18",
    weekday: "Friday",
    time: "6:30 PM",
    endTime: "9:30 PM",
    game: "Pokemon TCG",
    type: "League",
    level: "Beginner",
    venue: "Queen Victoria Market",
    address: "Corner of Elizabeth Street and Victoria Street, Melbourne VIC 3000, Australia",
    city: "Melbourne",
    fee: "AUD 15",
    capacity: "24 seats",
    status: "Filling fast",
    ticketStatus: "Coming soon",
    image: "/stock/events-card-table.jpg",
    description: "A patient, welcoming league night with guided rounds and friendly help between matches.",
    bring: ["One legal 60-card deck", "Damage counters or dice", "Sleeves for your deck", "A curious attitude"],
  },
  {
    slug: "collector-swap-meet",
    title: "Collector Swap Meet",
    date: "2026-09-26T13:00:00+10:00",
    month: "Sep",
    day: "26",
    weekday: "Saturday",
    time: "1:00 PM",
    endTime: "6:00 PM",
    game: "All TCGs",
    type: "Community",
    level: "All levels",
    venue: "MCEC Exhibition Centre",
    address: "2 Clarendon Street, South Wharf VIC 3006, Australia",
    city: "South Wharf",
    fee: "AUD 8",
    capacity: "60 guests",
    status: "Open",
    ticketStatus: "Coming soon",
    image: "/stock/collection-overview.jpg",
    description: "Bring duplicates, sealed pieces, and collection goals for an afternoon built around fair, face-to-face trading.",
    bring: ["Trade cards in protective sleeves", "Your collection checklist", "Cashless payment for vendor tables", "Water bottle"],
  },
  {
    slug: "sunday-learn-to-play",
    title: "Sunday Learn to Play",
    date: "2026-10-04T11:00:00+11:00",
    month: "Oct",
    day: "04",
    weekday: "Sunday",
    time: "11:00 AM",
    endTime: "2:00 PM",
    game: "Multi-game",
    type: "Workshop",
    level: "First-time players",
    venue: "Carlton Community Room",
    address: "38 Elgin Street, Carlton VIC 3053, Australia",
    city: "Carlton",
    fee: "Free",
    capacity: "16 seats",
    status: "Open",
    ticketStatus: "Coming soon",
    image: "/stock/guide-card-condition.jpg",
    description: "Try a guided first game, learn how turns work, and leave with a clear path for building your first deck.",
    bring: ["No deck required", "Notebook if you like", "Parent or guardian for guests under 13"],
  },
];

export type Collection = {
  slug: string;
  title: string;
  curator: string;
  game: string;
  era: string;
  format: string;
  image: string;
  summary: string;
  story: string[];
  highlights: string[];
};

export const collections: Collection[] = [
  {
    slug: "moonlit-vault",
    title: "Moonlit Vault",
    curator: "Mika Santos",
    game: "Fantasy TCG",
    era: "Modern",
    format: "Raw cards",
    image: "/stock/collection-encased-card.jpg",
    summary: "A dark-fantasy binder built around moonlit landscapes, quiet spellcraft, and silver details.",
    story: [
      "Mika started the binder with one card pulled during a rainy weekend. The art, more than the rarity, set the direction for everything that followed.",
      "Every page is organized by atmosphere. Forests lead into ruins, ruins lead into night skies, and the final spread holds the cards still being searched for.",
    ],
    highlights: ["Moonlit landscapes", "Silver foil details", "Artist-led page order", "Nine-card final spread"],
  },
  {
    slug: "first-partner-binder",
    title: "First Partner Binder",
    curator: "Paolo Reyes",
    game: "Adventure TCG",
    era: "Mixed eras",
    format: "Raw and graded",
    image: "/stock/collection-protected-cards.jpg",
    summary: "A personal history of starter companions, organized by the games and friends connected to each card.",
    story: [
      "This collection is less about completing a set and more about remembering when each game entered Paolo's life.",
      "Notes behind selected sleeves record where a card came from, who traded it, and why it stayed.",
    ],
    highlights: ["Starter companions", "Trade notes", "Mixed-era cards", "Memory-led curation"],
  },
  {
    slug: "golden-era-pulls",
    title: "Golden Era Pulls",
    curator: "Ana Cruz",
    game: "Classic TCG",
    era: "1999-2006",
    format: "Graded",
    image: "/stock/collection-charizard-display.jpg",
    summary: "A carefully protected archive of the cards that defined Ana's first years in the hobby.",
    story: [
      "Ana rebuilt a childhood collection one card at a time, beginning with the same artwork she remembered carrying to school.",
      "Condition matters, but the collection keeps room for well-loved copies with a real story behind them.",
    ],
    highlights: ["Early print runs", "Condition notes", "Childhood favorites", "Archival storage"],
  },
];

export type Guide = {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  image: string;
  summary: string;
  intro: string;
  sections: { heading: string; body: string }[];
};

export type SponsorTier = "Presenting" | "Major" | "Community";

export type Sponsor = {
  name: string;
  tier: SponsorTier;
  logo: string;
  url?: string;
  description?: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  organization?: string;
  audience: "Attendee" | "Vendor" | "Partner";
};

// Sponsors and testimonials are intentionally empty until the client supplies
// approved names, logos, quotes, and publication permission. Sanity content
// replaces these arrays automatically once the project is connected.
export const sponsors: Sponsor[] = [];
export const testimonials: Testimonial[] = [];

export const guides: Guide[] = [
  {
    slug: "protect-every-card-you-care-about",
    title: "How to protect every card you care about",
    category: "Collecting",
    readTime: "7 min read",
    image: "/stock/guide-protect-cards.jpg",
    summary: "The essential tools and habits that keep a collection safe without making the hobby complicated.",
    intro: "Good protection starts with knowing which cards need daily-play durability and which need long-term storage.",
    sections: [
      { heading: "Start with clean hands and a clear surface", body: "Handle cards over a dry, uncluttered table. Food, drinks, dust, and hand oils cause more avoidable damage than most collectors expect." },
      { heading: "Match the sleeve to the job", body: "Use standard sleeves for play, inner sleeves for added protection, and semi-rigid or rigid holders when a card will be transported or stored individually." },
      { heading: "Store binders upright", body: "Choose side-loading, acid-free pages and avoid overfilling them. Store binders upright in a stable, dry place away from direct sunlight." },
      { heading: "Check the environment", body: "Heat, moisture, and sunlight can warp or fade cards. A consistent room environment is safer than a garage, attic, or car." },
    ],
  },
  {
    slug: "your-first-local-event",
    title: "Your first local event",
    category: "Play",
    readTime: "5 min read",
    image: "/stock/guide-first-event.jpg",
    summary: "What to expect, what to bring, and how to enjoy your first event from round one.",
    intro: "A local event should feel like a welcoming room full of people who already understand why the hobby matters to you.",
    sections: [
      { heading: "Read the event details", body: "Confirm the game, format, start time, entry fee, age guidance, and whether registration is required before you travel." },
      { heading: "Arrive a little early", body: "Give yourself time to check in, meet the organizer, find your seat, and ask any format questions before the first round." },
      { heading: "Bring only what you need", body: "Pack your deck, tokens, dice, sleeves, playmat, water, and a small trade binder. Keep valuable cards within sight." },
      { heading: "Ask for help", body: "Organizers and experienced players expect beginner questions. Clear communication makes games smoother and more enjoyable for everyone." },
    ],
  },
  {
    slug: "beginners-guide-to-card-condition",
    title: "A beginner's guide to card condition",
    category: "Care",
    readTime: "6 min read",
    image: "/stock/guide-card-condition.jpg",
    summary: "Learn the surfaces, edges, corners, and centering cues that shape a card's condition.",
    intro: "Condition is an observation, not a guarantee. A consistent inspection routine helps you describe a card fairly and make better decisions.",
    sections: [
      { heading: "Use soft, even light", body: "Tilt the card slowly under a diffuse lamp. This makes scratches, dents, print lines, and surface residue easier to see." },
      { heading: "Inspect corners and edges", body: "Look for whitening, bends, chips, and compression. Compare all four corners rather than judging from the front alone." },
      { heading: "Check both surfaces", body: "The back can reveal wear that is easy to miss from the front. Never inspect a card while it is still inside a cloudy sleeve." },
      { heading: "Describe what you see", body: "Use clear photos and conservative language when trading. Professional grading companies can still reach a different conclusion." },
    ],
  },
];

export function getEvent(slug: string) {
  return events.find((event) => event.slug === slug);
}

export function getCollection(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
