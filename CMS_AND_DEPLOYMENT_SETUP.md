# Hobby Trail CMS and deployment setup

The public site and `/studio` content dashboard use Supabase as the only CMS. The small local records in `data/site-data.ts` are development-safe fallback content; production content is read from published Supabase rows.

## Supabase setup

1. Add these variables to local development and Vercel Development, Preview, and Production environments:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only)
2. Run `supabase/migrations/20260904000000_hobby_trail_cms.sql` in the Supabase SQL editor.
3. Create the first editor in Supabase Auth → Users with email/password.
4. Insert that Auth user’s UUID into `public.cms_admins`.
5. Open `/studio` and confirm the dashboard can create, edit, publish, and delete records.

The public site reads only published content. CMS mutations run through authenticated server handlers and revalidate the homepage, Events, Collections, Guides, About, Contact, and calendar routes.

## Vercel deployment

- Use the approved `hello@desgnmate.com` Vercel account.
- Add the three Supabase variables before deploying so Supabase Storage images are allowed by the Next.js image configuration.
- Never paste the service-role/secret key into a client component, repository, screenshot, or public environment variable.
- After changing production environment variables, trigger a new deployment.

## Forms and content readiness

The existing contact, newsletter, and Vendor EOI forms still require approved webhook destinations before they are operational. Configure `CONTACT_FORM_WEBHOOK_URL`, `NEWSLETTER_FORM_WEBHOOK_URL`, and `VENDOR_EOI_WEBHOOK_URL` when those endpoints are ready.

Before launch, add verified event ticket URLs, Melbourne/Australia venue details, approved sponsor logos and links, approved testimonials, the public contact email, and official social links through the CMS.

## Release checks

Run `npm run lint`, `npm run typecheck`, and `npm run build`. Then test CMS sign-in, create/edit/publish/unpublish flows, event calendar updates, ticket links, form delivery, responsive navigation, and keyboard accessibility.
