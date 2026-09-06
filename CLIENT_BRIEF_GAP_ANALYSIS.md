# The Hobby Trail — client brief implementation audit

Date reviewed: September 4, 2026

## Executive assessment

The branded public website and Supabase-powered CMS are now implemented. The CMS is available at `/studio`, and the public Events, Collections, Guides, Sponsors, Testimonials, and site settings content models are connected to Supabase. The local records remain only as a safe development fallback while the Supabase project is initialized.

## Requirement-by-requirement audit

| Client requirement | Status | Current implementation | Remaining action |
| --- | --- | --- | --- |
| Existing branding | Applied | Supplied logos, mascot imagery, yellow/black/cream palette, display typography, responsive navigation, branded footer, and Melbourne positioning are in use. | Confirm final public wording and approved production assets. |
| Easy-to-use CMS | Applied | Protected `/studio` dashboard with Supabase Auth, admin approval, CRUD forms, drafts, publish controls, featured flags, status labels, and responsive layout. | Run the migration and approve the first editor. |
| Automatically updated events calendar | Applied | Events are read from the same published Supabase table used by listings, detail pages, calendar views, sitemap data, and `.ics` exports. CMS mutations revalidate those routes. | Add verified production events and ticket links. |
| Vendor Expression of Interest | Partial | Dedicated `/vendors` page and form are present with validation, consent, and service-error handling. | Add the approved webhook or submission destination before launch. |
| Strong “Buy Tickets” CTA | Applied in UI | Ticket status and ticket URL are modeled per event; labels change for on-sale, free registration, coming soon, sold out, and closed states. | Add real ticket destinations and confirm provider wording. |
| Featured sponsors | Applied in UI | Sponsor records support tier, logo, URL, display order, active state, and publication controls. | Add approved sponsor information and usage permissions. |
| Testimonials and reviews | Applied in UI | Testimonial records support quote, attribution, audience, approval, featured state, and publication controls. | Add approved attendee/vendor/partner stories with permission. |
| About Us | Applied | Dedicated About page explains the mission, audience, community principles, and Melbourne context. | Confirm final brand copy. |
| Broad hobby and creator positioning | Applied | Content fields and copy cover Pokémon, TCGs, collectibles, gaming, creators, vendors, and community gatherings. | Add additional categories as the event program expands. |

## Supabase content architecture

The migration creates `cms_admins`, `events`, `collections`, `guides`, `sponsors`, `testimonials`, and `site_settings`. Row Level Security allows public reads only for published/approved records, while approved CMS editors can manage all content through server-side handlers.

## Launch checklist

1. Run `supabase/migrations/20260904000000_hobby_trail_cms.sql` in Supabase.
2. Create a Supabase Auth editor and insert its UUID into `public.cms_admins`.
3. Add the Supabase URL, anon key, and server-only secret key to Vercel Development, Preview, and Production environments.
4. Enter verified Melbourne/Australia venues, ticket URLs, sponsor assets, testimonials, social links, and contact details in `/studio`.
5. Configure the contact, newsletter, and Vendor EOI webhook destinations.
6. Test publishing, unpublishing, calendar output, ticket states, forms, responsive layouts, and keyboard accessibility.

## Non-destructive guardrails

- Do not publish invented sponsor relationships, testimonials, ticket links, contact addresses, or vendor approvals.
- Keep the service-role/secret key server-only and rotate it if its exposure history is uncertain.
- Use Supabase Storage or approved local assets for images and retain descriptive alt text.
- Never present a form as successfully submitted until the configured destination confirms delivery.
