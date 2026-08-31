# Hobby Trail CMS and deployment setup

The public site works with approved local fallback content until Sanity and the form destinations are connected. No live credentials belong in this repository.

## Account ownership

- Vercel account: `hello@desgnmate.com`
- Authentication: start the official Vercel CLI login flow at deployment time and give the account owner the one-time URL produced by the CLI.
- Never request or store the account password in project files or chat.

## Sanity connection

1. Sign in to the approved Vercel account.
2. Link or create the Vercel project.
3. Install Sanity through the Vercel Marketplace, or create a Sanity project owned by the client.
4. Copy the variables listed in `.env.example` into the Development, Preview, and Production environments.
5. Open `/studio` and confirm the Event, Venue, Sponsor, Testimonial, Collection, Guide, Page, and Site Settings document types.
6. Configure the Sanity revalidation webhook to send signed POST requests to `/api/revalidate`.
7. Configure the Studio preview URL to `/api/draft?secret=<SANITY_DRAFT_SECRET>&slug=/`.

## Forms

Provide secure JSON webhook endpoints for:

- `CONTACT_FORM_WEBHOOK_URL`
- `NEWSLETTER_FORM_WEBHOOK_URL`
- `VENDOR_EOI_WEBHOOK_URL`

Until those endpoints exist, the website returns an explicit service-unavailable message and does not pretend that a submission succeeded.

## Content required before launch

- Verified ticket or registration URL and ticket status for every published event
- Approved sponsor names, tiers, logos, links, and usage permission
- Approved attendee/vendor testimonials and publication permission
- Final public brand wording: `The Hobby Trail` or `Hobby Trail`
- Public contact email and official social links
- Final production domain for `NEXT_PUBLIC_SITE_URL`

## Release checks

Run `npm run lint`, `npm run typecheck`, and `npm run build`, then test CMS publishing, draft preview, event calendar updates, ticket-state changes, each form webhook, responsive navigation, and keyboard navigation.
