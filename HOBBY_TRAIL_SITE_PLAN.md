# Hobby Trail Website Plan

## 1. Product direction

### Design read

Hobby Trail is a community and discovery website for TCG collectors and hobbyists. It should feel cheerful, welcoming, collectible, and adventurous, with the supplied mascot acting as the guide through the hobby.

Recommended design dials:

- Design variance: 7/10
- Motion intensity: 5/10
- Visual density: 4/10

### Working positioning

Hobby Trail helps collectors discover events, explore memorable collections, and learn the hobby without making it feel intimidating.

### Recommended launch focus

Launch as a content and community brand first, not as a full marketplace or portfolio tracker.

The primary visitor journeys should be:

1. Find an event worth attending.
2. Explore cards, sets, and collector stories.
3. Learn how to collect, protect, trade, and grade cards.
4. Follow Hobby Trail or join its mailing list.

Personal inventory, live valuations, wishlists, trading, and seller tools should be treated as later product phases. Those features require accounts, permissions, reliable card databases, pricing feeds, moderation, and ongoing operational support.

## 2. Why these features matter

The category research supports three clear needs:

- Local play and community discovery: official Pokemon, Magic, Lorcana, and Bandai experiences all prioritize event search, store discovery, registration, and event history.
- Collection organization: TCGplayer supports collection management plus Have, Want, and Trade lists. Cardmarket uses wants lists and listing alerts. Collectr focuses on portfolio value and market movement.
- Collector education and trust: pricing, condition, protection, and grading are high-consideration topics. PSA's collector guidance begins with condition assessment and card protection.

This makes Events, Collections, and Guides a stronger long-term foundation than a generic marketing site with only About and Contact pages.

## 3. Recommended sitemap

```text
Home /
├── Events /events
│   └── Event detail /events/[slug]
├── Collections /collections
│   └── Collection detail /collections/[slug]
├── Guides /guides
│   └── Guide article /guides/[slug]
├── About /about
├── Contact /contact
├── Search /search
├── Privacy /privacy
├── Terms /terms
├── Accessibility /accessibility
└── Not found /404
```

### Primary navigation

- Events
- Collections
- Guides
- About
- Contact

Recommended primary action: **Find an event**

The current navigation is a good start. Add Guides because beginner and evergreen collector content supports discovery, trust, and search traffic. Keep the desktop navigation on one line. Do not add Sign In until an account unlocks a real feature.

### Footer navigation

- Explore: Events, Collections, Guides
- Hobby Trail: About, Contact, Submit an Event
- Follow: real social channels only
- Legal: Privacy, Terms, Accessibility
- Newsletter form

## 4. Launch pages and section plans

### A. Home page

The home page should introduce the world, offer three clear routes, and surface fresh reasons to return.

#### 1. Floating navigation

- Use `Hobby Trail Nav Bar Logo.png` on the left of the black pill.
- Keep the bar between 64px and 72px tall.
- Desktop: logo, five links, and one yellow action.
- Mobile: logo plus menu button. The expanded menu can use the cream surface and large, easy targets.
- The bar may begin transparent or black over the hero, then settle into a solid black pill after the hero.

#### 2. Hero

- Use `hobby trail hero bg.png` as the full-width visual.
- Preserve the mascot as the focal point and reserve the open sky for concise messaging.
- Add one clear value statement and no more than two actions.
- Working headline: **Collect what you love. Find your people.**
- Supporting line: **Events, collections, and practical guides for every stop in the hobby.**
- Primary action: **Find an event**
- Secondary action: **Explore collections**
- Desktop: place the copy in a compact left-aligned block that does not cover the mascot.
- Mobile: show the image first, then move the copy into a cream panel below it. This protects readability and avoids awkward image cropping.
- Use `next/image` with `preload` for the LCP hero, fixed dimensions, and a tested `object-position` for each breakpoint.

The supplied concept currently communicates personality very well, but it needs a value proposition and action so a new visitor immediately understands what Hobby Trail offers.

#### 3. Choose your trail

Use an asymmetric destination grid, not three identical cards.

- Large feature: Upcoming Events
- Smaller feature: Featured Collections
- Smaller feature: Start Collecting

Each destination gets one illustration or real content preview, one short sentence, and one action. A thin trail line can connect the three destinations.

#### 4. Upcoming events

- One featured event with a large visual and registration action.
- Three to five nearby or upcoming events in a compact date-led rail.
- Filters limited to game and date on the home page.
- Show real data only: date, start time, venue, city, game, event type, skill level, entry fee, and registration status.
- Actions: View details and Add to calendar.

#### 5. Featured collections

- Present collections like binder spreads or collectible album covers.
- Feature one large collection story and a horizontal set of smaller entries.
- Useful labels: game, set or era, collector, and number of highlighted cards.
- Avoid price-led presentation unless accurate market data is available.
- Action: View the collection.

#### 6. The collector's path

A light educational section with four meaningful stages:

- Choose a game
- Build a collection
- Protect your cards
- Meet the community

Use a trail-map composition with the mascot moving between stops. On mobile, collapse to a vertical path. This section explains the brand's value without pretending it is a software feature list.

#### 7. Practical guides

- One large beginner guide.
- Two smaller current or seasonal articles.
- Recommended launch topics: card condition, storage basics, event etiquette, starting a binder, avoiding counterfeits, and when grading makes sense.
- Each card needs a real cover image or illustration, title, category, and reading time.

#### 8. About Hobby Trail

- A short brand story, not a full manifesto.
- Use `Hobby Trail Logo 1.png` as the main visual or `Hobby Trail Logo 2.png` as a patch.
- Explain who the site is for and what kind of hobby culture it wants to support.
- Action: Meet Hobby Trail.

#### 9. Community call to action

- Newsletter headline: **Keep up with the trail.**
- Promise only what can be delivered, such as upcoming events, new collection stories, and useful guides.
- One email field with a visible label, privacy note, success state, and error state.

#### 10. Footer

- Use `Hobby Trail Footer Logo.png` as the visual anchor.
- Include the navigation groups, newsletter, legal links, copyright, and any required TCG trademark disclaimer.
- Use the brown accent for a small supporting band or separator, not as a competing primary action.

### B. Events index

Purpose: help visitors find an event quickly, especially on mobile.

Sections and features:

1. Page intro with location search.
2. Date shortcuts: Today, This Weekend, This Month.
3. Filters for game, distance or city, event type, skill level, and date.
4. List and map toggle if reliable location data is available.
5. Event results grouped by date.
6. Empty state with clear options to broaden the search.
7. Submit an Event call to action for organizers.
8. Small FAQ covering registration, age requirements, accessibility, and what to bring.

On mobile, default to the list. Put filters in a bottom sheet and make the map optional.

### C. Event detail

Every public event needs a unique page and URL.

Sections and features:

1. Event title, game, event type, date, time, timezone, and status.
2. Primary registration action.
3. Add to Google, Apple, or Outlook calendar.
4. Venue name, full address, map, transit or parking notes, and accessibility information.
5. Entry fee, capacity, age guidance, skill level, format, and prize information.
6. What to bring and event rules.
7. Organizer profile and contact method.
8. Related events at the same venue or for the same game.
9. Clear cancelled, sold out, registration closed, and completed states.

Do not hide key event information in accordions. Date, venue, fee, status, and registration must be visible near the top.

### D. Collections index

For launch, treat Collections as curated public showcases rather than personal inventory software.

Sections and features:

1. Page intro and search.
2. Filters for game, set or era, collection theme, and format such as raw, graded, sealed, or mixed.
3. Featured collection with a strong visual story.
4. Collection grid with varied card and binder imagery.
5. Collector submission call to action if Hobby Trail accepts community features.
6. Empty and no-result states.

If Collections instead means a complete card database, the page will need a licensed or permitted data source, image rights, set metadata, search indexing, and a much denser interface. Confirm that product direction before development.

### E. Collection detail

Sections and features:

1. Collection cover, title, owner or curator, game, set or era, and short story.
2. Highlight cards in an asymmetric gallery.
3. Optional binder-view toggle for larger collections.
4. Notes about the collecting goal, condition, variants, or missing pieces.
5. Optional checklist with Owned and Seeking states if the data is maintained.
6. Share action and related collections.

Use a subtle foil or tilt interaction only on card images. It should communicate that the object is collectible, not decorate every container.

### F. Guides index

Sections and features:

1. Beginner-first introduction.
2. Topic filters: Getting Started, Care and Storage, Buying and Trading, Grading, Events, and Game-specific.
3. Featured guide.
4. Latest guides.
5. Start Here learning path for new collectors.
6. Newsletter call to action.

### G. Guide article

Sections and features:

1. Clear title, summary, author, published date, updated date, and reading time.
2. Table of contents for longer guides.
3. Large legible article body with useful images.
4. Source links and a visible update policy for pricing, grading, or rules content.
5. Related guides.
6. Newsletter call to action.

Avoid financial language that presents cards as guaranteed investments. If prices are discussed, show the source and time of retrieval.

### H. About

Sections and features:

1. Brand story and mission.
2. The meaning of the trail and mascot.
3. Who the community is for.
4. Principles such as welcoming beginners, responsible collecting, and respectful trading.
5. Team or founder information if available.
6. Contact or partnership action.

Do not add invented community counts, partner logos, testimonials, or press claims.

### I. Contact

Use intent routing so messages reach the right place:

- General question
- Event submission
- Collection feature
- Partnership
- Press

Fields: name, email, topic, message, optional relevant URL. Add visible labels, inline validation, success state, error state, response-time expectation, and spam protection.

## 5. Phase plan

### Phase 1: Brand and content MVP

- Home
- Events index and event detail
- Collections index and collection detail
- Guides index and article
- About and Contact
- Newsletter
- Search
- Legal and accessibility pages
- Responsive navigation and footer
- Content management workflow
- Metadata, sitemap, robots, Open Graph images, and structured data

### Phase 2: Community participation

- Event and collection submission workflows
- Saved events
- Calendar subscriptions
- Collector profiles
- Public wishlists or trade binders
- Moderation and reporting
- Followed games, stores, and collectors

### Phase 3: Collection product

- User accounts
- Personal inventory
- CSV import and export
- Camera scanning if mobile product scope supports it
- Have, Want, and Trade lists
- Price history and portfolio totals from a licensed data provider
- Alerts for wanted cards or event registration
- Privacy controls, account export, and account deletion

### Optional commerce branch

Add Shop, product detail, cart, checkout, shipping, returns, order status, and customer account pages only if Hobby Trail will sell products directly. Do not put a Shop link in the launch navigation without a real catalog and fulfillment plan.

## 6. Visual direction

### Color tokens

Use the Hobby Trail palette only:

```css
:root {
  --color-paper: #ffffff;
  --color-trail-yellow: #ffc83d;
  --color-ink: #000000;
  --color-map-cream: #fee7bf;
  --color-leather-brown: #91431d;
}
```

Recommended use:

- White: primary page canvas and breathing room.
- Yellow: primary action, active state, focus emphasis, and small collectible highlights.
- Black: navigation, footer, body text, borders, and strong contrast.
- Cream: alternate content surface, input fill, and quiet card background.
- Brown: supporting illustration accents, section dividers, and secondary surfaces.

Accessibility rules:

- Use black text on yellow.
- Do not use white text on yellow.
- Use black text on white and cream.
- Test white text on brown at the chosen size before release.
- Provide a visible black focus ring with a white offset on yellow controls.

### Typography

The logo is rounded, chunky, and playful. Extend that feeling through headings without copying the logo lettering.

- Display candidate: Lilita One, Bowlby One, or another licensed heavy rounded display face.
- Body and interface candidate: Manrope or DM Sans.
- Keep display headings compact and bold. Use calm sentence-case body copy.
- Avoid a different novelty font for every TCG or section.
- Final font selection should be tested next to all four supplied logos before locking the system.

### Shapes and components

- Navigation: full pill.
- Buttons: full pill or 12px radius, with one rule used consistently.
- Content cards: 20px radius and a 1px or 2px black outline.
- Image frames: trading-card proportions where the content supports it.
- Patch motifs: use the circular secondary logo and small trail badges sparingly.
- Shadows: subtle brown-tinted shadow only when elevation communicates a real interaction.
- Avoid generic white cards for every section. Use open layout, cream bands, image-led blocks, and sparse borders.

### Layout language

- Keep the illustrated landscape as the hero's visual world.
- Carry the trail idea through thin route lines, map-like curves, trail markers, and page transitions.
- Present collection content like binder pages, card sleeves, and album spreads.
- Use at least four section layouts on the home page: full-bleed hero, asymmetric destination grid, date-led event rail, horizontal collection gallery, trail map, editorial guide layout, and full-width final action.
- At widths below 768px, collapse every asymmetric layout to a clear single column.

### Motion

- Hero: restrained entrance for the nav and copy. A very slow image scale can add depth if it does not affect readability.
- Events: fast filter and result transitions that communicate state changes.
- Collection images: small lift or foil response on hover only.
- Trail section: optional scroll-linked progress along the route.
- Buttons: tactile press feedback.
- Respect `prefers-reduced-motion` and remove parallax, foil response, and scroll-linked movement when requested.
- Use Motion for component reveals and state transitions. Reserve GSAP for a future scroll-led story that truly needs pinning or scrubbing.

## 7. Asset assignment

| Asset | Recommended use |
|---|---|
| `hobby trail hero bg.png` | Home hero, with responsive art direction |
| `Hobby Trail Nav Bar Logo.png` | Main navigation wordmark |
| `Hobby Trail Footer Logo.png` | Footer brand anchor |
| `Hobby Trail Logo 1.png` | About page, social preview, or featured brand story |
| `Hobby Trail Logo 2.png` | Favicon source, profile image, sticker badge, or mobile menu mark |

Before implementation, export WebP or AVIF derivatives where suitable while preserving the original PNG files. Prepare a dedicated square icon at standard favicon and app-icon sizes rather than serving the full secondary logo everywhere.

## 8. Content model

### Event

- Title and slug
- Game
- Event type and format
- Skill level and age guidance
- Start and end date-time with timezone
- Venue and complete address
- Organizer and contact
- Entry fee and capacity
- Registration URL and registration status
- Accessibility, transit, and parking notes
- Hero image and alt text
- Rules, prizes, and what to bring
- Status: scheduled, sold out, cancelled, completed

### Collection

- Title and slug
- Collector or curator
- Game, set, era, and theme
- Cover image and alt text
- Story and collecting goal
- Highlight items
- Condition or grading notes where relevant
- Owned and seeking status if maintained
- Publish date and updated date

### Guide

- Title and slug
- Summary
- Author
- Published and updated dates
- Category and game tags
- Cover image and alt text
- Body content
- Source links
- Related guides

## 9. Next.js implementation notes

- Use the App Router and Server Components for page shells and content rendering.
- Isolate filters, maps, galleries, forms, and animation as client components.
- Use `next/image` for logos, hero art, event covers, and collection photography.
- Generate metadata per event, collection, and guide with `generateMetadata`.
- Add `sitemap.ts`, `robots.ts`, route-level Open Graph images, favicon, and app icons.
- Add JSON-LD for Organization, BreadcrumbList, Event, and Article. Add Product only if a page genuinely represents a product or merchant listing.
- Give every event a unique detail page. Google recommends a unique leaf URL for each event rather than marking up only a multi-event listing page.
- Prefer local MDX or a simple content source for a small launch. Use a CMS when non-developers need to publish events and guides regularly.
- Cache stable content and revalidate event listings on a schedule appropriate to registration changes.
- Track meaningful events such as event search, filter use, event detail view, registration click, calendar add, collection view, guide completion, and newsletter success.

## 10. Accessibility and trust checklist

- Keyboard-accessible navigation, filters, galleries, dialogs, and forms.
- Skip link and visible focus states.
- Semantic headings with one page-level H1.
- Text alternatives for every meaningful card, event, and mascot image.
- No essential text baked into raster images.
- Touch targets of at least 44px.
- Correct color contrast and no color-only statuses.
- Reduced-motion support.
- Event timezones, cancellation states, and registration status shown clearly.
- Source and update dates on pricing, rules, and grading content.
- Trademark disclaimer for the TCG names and properties shown on the site.
- Consent and privacy copy for newsletter, analytics, submissions, and future accounts.

## 11. Decisions needed before visual design begins

1. Is Hobby Trail a media and community brand, an event organizer, a retailer, or a software product?
2. Which TCGs are supported at launch?
3. Which country or cities should Events cover first?
4. Does Collections mean curated stories, a searchable card database, or each user's private inventory?
5. What is the single launch conversion: event registration, newsletter signup, product purchase, or account creation?
6. Who supplies and verifies event data?
7. Are collector submissions and public profiles allowed at launch?
8. Is live pricing required, and is there a licensed data source and budget for it?
9. Which social channels already have active Hobby Trail accounts?
10. Who owns or has permission to use each card image, game logo, event photo, and collector photo?

Until those decisions are settled, the safest launch assumption is a multi-TCG editorial and events site with curated collections and no user accounts.

## 12. Recommended design sequence

1. Confirm product direction and primary conversion.
2. Lock the sitemap and content model.
3. Create low-fidelity flows for Home, Events, Event Detail, Collections, and Collection Detail.
4. Build a small visual system from the supplied assets and Hobby Trail colors.
5. Design the responsive home page around the existing hero.
6. Design the two key task flows: finding an event and exploring a collection.
7. Design Guides, About, Contact, and utility states.
8. Prototype motion and responsive behavior.
9. Run accessibility, content, and performance checks.
10. Implement in Next.js and connect the chosen content source.

## 13. Research references

- [TCGplayer Collection Tracker](https://shop.tcgplayer.com/collection): collection management plus Have, Want, and Trade sharing.
- [TCGplayer App FAQ](https://help.tcgplayer.com/hc/en-us/articles/115009506407-TCGplayer-App-FAQ): scanning, card identification, collection lists, marketplace content, and pricing.
- [TCGplayer Market Price](https://help.tcgplayer.com/hc/en-us/articles/213588017-TCGplayer-Market-Price): recent-sales-based value information.
- [Cardmarket Wants List](https://help.cardmarket.com/en/wants-list): multiple wants lists and bulk buying workflows.
- [Play! Pokemon Access](https://www.pokemon.com/us/pokemon-video-games/play-pokemon-access): local event discovery, favorite stores, attendance history, points, and badges.
- [Magic Events](https://magic.wizards.com/en/play-events): local store events, beginner programs, weekly play, prereleases, and competitive formats.
- [Wizards Store and Event Locator](https://magic.wizards.com/en/news/feature/find-and-play-magic-with-the-improved-wizards-store-and-event-locator): mobile search, filters, maps, event details, venue details, fees, and calendar actions.
- [Disney Lorcana Organized Play](https://www.disneylorcana.com/en-US/play): local event discovery, formats, player accounts, and retailer event management.
- [Bandai TCG+](https://lp.bandai-tcg-plus.com/en/): event search and application plus deck registration.
- [PSA Getting Started With Grading](https://www.psacard.com/info/get-started): condition assessment, card protection, and grading education.
- [Google Event structured data](https://developers.google.com/search/docs/appearance/structured-data/event): unique event pages, required event details, and search eligibility.
- [Next.js Metadata](https://nextjs.org/learn/dashboard-app/adding-metadata): route metadata, social images, robots, and sitemaps.
