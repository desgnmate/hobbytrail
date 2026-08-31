# The Hobby Trail — client brief gap analysis

Date reviewed: August 30, 2026

## Executive assessment

The current website is a strong branded editorial and event-discovery prototype, but it does not yet meet the complete operational brief. The visual identity, core event pages, collection and guide content, About page, responsive navigation, legal pages, and downloadable calendar files are already present. The CMS, automatic event calendar, vendor EOI workflow, ticket-purchase path, sponsor content, and testimonials are not yet implemented.

The current contact and newsletter forms validate in the browser and show a success message, but they do not transmit or persist submissions. They must not be treated as production-ready forms.

## Requirement-by-requirement audit

| Client requirement | Status | Current implementation | Required action |
| --- | --- | --- | --- |
| Existing branding | Applied | Supplied logos, mascot imagery, yellow/black/cream palette, display typography, responsive navigation, branded footer and scrollbar are in use. | Preserve. Confirm whether public copy should say “The Hobby Trail” or “Hobby Trail”; the supplied logo currently says “Hobby Trail.” |
| Easy-to-use CMS | Missing | Events, collections, and guides are hard-coded in `data/site-data.ts`. No CMS SDK, Studio, preview mode, or live-content connection exists. | Add a structured CMS and migrate editable content. Sanity is the recommended fit for this Next.js build because it provides a generated editing interface, embedded or hosted Studio, Draft Mode, Visual Editing, and live updates. |
| Automatically updated events calendar | Partial | Event list, filters, detail pages, structured event data, and per-event `.ics` downloads exist. There is no calendar view, and event data is static. | Add a calendar route driven by the same CMS event query used by listings. Publishing or updating an event in the CMS must update the list, calendar, event page, sitemap, and calendar export from one record. |
| Vendor Expression of Interest | Missing | The general contact form has no vendor-specific route or vendor fields, and it does not send data. | Add `/vendors` with a dedicated EOI form, server-side validation, spam protection, privacy consent, submission storage or CRM delivery, notification email, and success/error states. |
| Strong “Buy Tickets” CTA | Missing | Navigation and hero use “Find an event.” Event cards use “View event.” Event detail uses a placeholder email registration action. No ticket URL or ticket provider is modeled. | Add ticket URL, availability, label, price, and sale-window fields to events. Replace primary CTAs with “Buy tickets” only when a real purchase destination exists; preserve sold-out, free-registration, coming-soon, and closed states. |
| Featured sponsors | Missing | No sponsor data, logo assets, page section, or CMS schema exists. | Add sponsor records with name, logo, URL, tier, accessibility text, campaign dates, and display order. Render a featured sponsor band only from approved assets. |
| Testimonials and reviews | Missing | No approved quotes, attribution, consent records, or testimonial UI exists. | Add attendee and vendor testimonial records with quote, name, role/business, optional image, approval status, and display order. Do not publish invented endorsements. |
| About Us | Applied | A dedicated About page explains the mission, audience, community principles, and contact path. | Preserve. Optionally surface a shortened About strip on the homepage after the operational sections are added. |
| Broad hobby and creator positioning | Partial | The current experience is strongly focused on TCG collectors. The client brief also names collectibles, gaming, creators, and other hobby communities. | Expand the content taxonomy and selected copy without weakening the existing TCG foundation. Add CMS-managed hobby categories and event tags rather than hard-coding new verticals into components. |

## Recommended content architecture

### CMS recommendation

Use Sanity with the official `next-sanity` integration after the client approves the provider and creates the project. Keep the current TypeScript records as a temporary fallback during migration so the public site remains functional throughout the change.

Required document models:

1. **Site settings** — public brand name, default SEO, primary CTA, ticket landing URL, contact details, social links, footer copy.
2. **Event** — title, slug, summary, hero image, hobby categories, event type, start/end datetime, timezone, status, venue, full address, accessibility, age guidance, organizer, capacity, price, ticket URL, ticket label, sale dates, featured flag.
3. **Venue** — reusable venue name, address, map coordinates, transit, parking, accessibility notes.
4. **Sponsor** — name, logo, destination URL, tier, alt text, campaign dates, display order, featured flag.
5. **Testimonial** — quote, attribution, attendee/vendor type, role or business, optional photo, approval status, display order.
6. **Guide and collection story** — migrate the current hard-coded editorial content so editors can publish without a deployment.
7. **Page content** — homepage intro, About summary, vendor intro, ticket guidance, and section visibility.

Editorial capabilities:

- Hosted or embedded Studio
- Draft previews through Next.js Draft Mode
- Visual Editing for click-to-edit content
- Live published-content updates
- Role-based access for editors
- Image hotspot and alt-text fields
- Validation for required dates, ticket states, links, and sponsor accessibility text

## Implementation plan

### Phase 0 — client inputs and service decisions

Obtain these before presenting the new features as operational:

- CMS approval and Sanity project credentials
- Ticketing provider and a verified ticket URL for each ticketed event
- Sponsor names, approved logos, destination URLs, tiers, and usage permission
- Approved attendee/vendor testimonials and attribution permission
- Vendor EOI recipient, storage destination or CRM, required questions, privacy language, and notification recipients
- Confirmed public brand wording: “The Hobby Trail” or “Hobby Trail”
- Real contact address and social destinations

### Phase 1 — content foundation

1. Add Sanity configuration, schemas, content queries, preview routes, and live content.
2. Introduce a content adapter so existing components can consume CMS records without a visual rewrite.
3. Migrate events first, then guides, collections, site settings, sponsors, testimonials, and page copy.
4. Keep local fallback content until CMS parity is verified; remove it only after successful migration.

### Phase 2 — calendar and tickets

1. Add `/events/calendar` with accessible month and agenda views.
2. Drive the calendar, filtered event list, event details, sitemap, structured data, and `.ics` export from the same event source.
3. Model ticket states: buy now, free registration, coming soon, sold out, sales closed, and external organizer.
4. Change the navigation, hero, event cards, event details, and footer to a strong ticket CTA with state-aware labels.
5. Never display “Buy tickets” without a valid purchase destination.

### Phase 3 — vendor EOI

1. Add a dedicated `/vendors` page linked from navigation and footer.
2. Collect business/contact details, category, product offering, stall requirements, power needs, social/site links, prior event experience, insurance/compliance acknowledgements, and notes.
3. Validate on both client and server, add a honeypot and rate limiting, and include explicit privacy consent.
4. Persist to the approved CRM/database or form provider and send confirmation plus internal notification emails.
5. Add honest loading, success, duplicate, validation, and service-error states.

### Phase 4 — sponsors, testimonials, and broader positioning

1. Add a featured sponsor band with restrained logo treatment and tier-aware ordering.
2. Add a testimonial composition that supports attendee and vendor voices without a generic carousel.
3. Expand homepage and event taxonomy from TCG-only language to Pokémon, TCGs, collectibles, gaming, creators, and future categories managed through the CMS.
4. Add a concise homepage About section linked to the existing full About page if the client wants mission content on the landing page.

### Phase 5 — launch verification

1. Test CMS create/edit/publish/unpublish flows and draft previews.
2. Test timezone handling, past events, cancellations, sold-out states, and ticket-link failures.
3. Test vendor submissions end to end, including spam, delivery, persistence, consent, and error recovery.
4. Check sponsor logo permissions, testimonial approvals, alt text, keyboard access, screen-reader output, mobile layouts, structured data, sitemap updates, and analytics events.
5. Run lint, TypeScript, production build, responsive browser checks, and critical-flow testing before release.

## Non-destructive implementation guardrails

- Preserve the existing public routes and visual system.
- Migrate one content type at a time behind an adapter instead of rewriting pages.
- Keep a fallback for CMS outages during the migration period.
- Do not invent sponsor relationships, testimonials, ticket links, contact addresses, or vendor approvals.
- Do not replace working event detail, filtering, `.ics`, metadata, or accessibility behavior; connect them to the new source.
- Do not label simulated forms as submitted or operational.

## Recommended next decision

Approve Sanity as the CMS and supply the Phase 0 content/service inputs. Once those are available, implementation should begin with the content adapter and Event schema because every other high-priority requirement depends on reliable event records.
