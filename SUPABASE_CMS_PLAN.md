# Hobby Trail Supabase CMS plan

## Goal

Supabase is the single source of truth for the public site and the protected `/studio` editor. Editors can manage content without a deployment, while visitors only receive approved published records.

## CMS capabilities

- Supabase Auth email/password sign-in for editors.
- Explicit `cms_admins` approval list for dashboard access.
- Create, edit, publish/unpublish, feature, and delete workflows.
- Safe server-side writes using the Supabase secret/service-role key.
- Row Level Security so anonymous visitors can read published content only.
- Automatic Next.js route revalidation after each mutation.
- Responsive dashboard with record counts, drafts, status labels, and inline validation.

## Content model

The migration in `supabase/migrations/20260904000000_hobby_trail_cms.sql` creates:

- `cms_admins` — Supabase Auth users allowed to access the dashboard.
- `events` — date, Melbourne venue, ticket status, image, description, and what-to-bring details.
- `collections` — curator, game, era, image, story, and highlights.
- `guides` — category, reading time, cover image, intro, and structured sections.
- `sponsors` — tier, logo, link, ordering, and active state.
- `testimonials` — quote, attribution, audience, approval, and featured state.
- `site_settings` — public brand name, description, ticket CTA, contact email, and social links.

## One-time setup

1. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to local and Vercel environments.
2. Run the migration in the Supabase SQL editor (or with the Supabase CLI).
3. Create the first editor in Supabase Auth → Users with email/password.
4. Insert that user’s Auth UUID into `public.cms_admins`:

   ```sql
   insert into public.cms_admins (user_id, email)
   values ('AUTH_USER_UUID', 'editor@example.com');
   ```

5. Sign in at `/studio`, create content, review it, and enable `Published` when ready.

## Editorial workflow

1. Create an event, collection, guide, sponsor, or testimonial in `/studio`.
2. Add verified copy, Melbourne/Australia location details, approved imagery, and links.
3. Save as a draft while content is being reviewed.
4. Publish only after ticket, sponsor, testimonial, and privacy permissions are confirmed.
5. Changes automatically revalidate the relevant public routes.

## Safety and launch notes

- The anon key is constrained by RLS and may be used for public reads.
- The `SUPABASE_SERVICE_ROLE_KEY` is server-only and must stay in encrypted Vercel environment variables and ignored local env files.
- The local records remain only as a safe development fallback if Supabase is unavailable; they are not a second CMS.
- Add image files to Supabase Storage or use approved local assets; store their public URL in the record.
- Configure the contact, newsletter, and Vendor EOI webhook variables before presenting forms as operational.
- Rotate the Supabase secret if its exposure history is uncertain.
