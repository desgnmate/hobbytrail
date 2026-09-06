-- Hobby Trail CMS schema
-- Run this migration in the Supabase SQL editor or with the Supabase CLI.
-- Content is private by default. Only rows marked published are public.

create extension if not exists pgcrypto;

create table if not exists public.cms_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create or replace function public.is_cms_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.cms_admins
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_cms_admin() from public;
grant execute on function public.is_cms_admin() to anon, authenticated, service_role;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  start_date timestamptz not null,
  end_date timestamptz not null,
  game text not null,
  category text not null,
  level text not null,
  venue_name text not null,
  address text not null,
  city text not null,
  fee text not null,
  capacity text not null,
  status text not null default 'Open' check (status in ('Open', 'Filling fast', 'Sold out')),
  ticket_status text not null default 'Coming soon' check (ticket_status in ('On sale', 'Free registration', 'Coming soon', 'Sold out', 'Sales closed')),
  ticket_url text,
  image text,
  description text not null,
  bring text[] not null default '{}',
  published boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  curator text not null,
  game text not null,
  era text not null default '',
  format text not null default '',
  image text,
  summary text not null,
  story text[] not null default '{}',
  highlights text[] not null default '{}',
  published boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.guides (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  read_time text not null,
  image text,
  summary text not null,
  intro text not null,
  sections jsonb not null default '[]'::jsonb check (jsonb_typeof(sections) = 'array'),
  published_at timestamptz not null default now(),
  published boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tier text not null check (tier in ('Presenting', 'Major', 'Community')),
  logo text,
  url text,
  description text,
  active boolean not null default true,
  display_order integer not null default 10,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  name text not null,
  role text not null,
  organization text,
  audience text not null check (audience in ('Attendee', 'Vendor', 'Partner')),
  approved boolean not null default false,
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id text primary key default 'default',
  title text not null default 'Hobby Trail',
  description text,
  ticket_cta_label text not null default 'Buy tickets',
  contact_email text,
  social_links jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at before update on public.events for each row execute function public.set_updated_at();
drop trigger if exists collections_set_updated_at on public.collections;
create trigger collections_set_updated_at before update on public.collections for each row execute function public.set_updated_at();
drop trigger if exists guides_set_updated_at on public.guides;
create trigger guides_set_updated_at before update on public.guides for each row execute function public.set_updated_at();
drop trigger if exists sponsors_set_updated_at on public.sponsors;
create trigger sponsors_set_updated_at before update on public.sponsors for each row execute function public.set_updated_at();
drop trigger if exists testimonials_set_updated_at on public.testimonials;
create trigger testimonials_set_updated_at before update on public.testimonials for each row execute function public.set_updated_at();
drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

alter table public.cms_admins enable row level security;
alter table public.events enable row level security;
alter table public.collections enable row level security;
alter table public.guides enable row level security;
alter table public.sponsors enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_settings enable row level security;

grant select on public.events, public.collections, public.guides, public.sponsors, public.testimonials, public.site_settings to anon, authenticated;
grant select on public.cms_admins to authenticated;
grant insert, update, delete on public.events, public.collections, public.guides, public.sponsors, public.testimonials, public.site_settings to authenticated;

drop policy if exists "Admins can read their own membership" on public.cms_admins;
create policy "Admins can read their own membership"
  on public.cms_admins for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "Public can read published events" on public.events;
create policy "Public can read published events"
  on public.events for select to anon, authenticated
  using (published = true);
drop policy if exists "CMS admins manage events" on public.events;
create policy "CMS admins manage events"
  on public.events for all to authenticated
  using (public.is_cms_admin()) with check (public.is_cms_admin());

drop policy if exists "Public can read published collections" on public.collections;
create policy "Public can read published collections"
  on public.collections for select to anon, authenticated
  using (published = true);
drop policy if exists "CMS admins manage collections" on public.collections;
create policy "CMS admins manage collections"
  on public.collections for all to authenticated
  using (public.is_cms_admin()) with check (public.is_cms_admin());

drop policy if exists "Public can read published guides" on public.guides;
create policy "Public can read published guides"
  on public.guides for select to anon, authenticated
  using (published = true);
drop policy if exists "CMS admins manage guides" on public.guides;
create policy "CMS admins manage guides"
  on public.guides for all to authenticated
  using (public.is_cms_admin()) with check (public.is_cms_admin());

drop policy if exists "Public can read published sponsors" on public.sponsors;
create policy "Public can read published sponsors"
  on public.sponsors for select to anon, authenticated
  using (published = true and active = true);
drop policy if exists "CMS admins manage sponsors" on public.sponsors;
create policy "CMS admins manage sponsors"
  on public.sponsors for all to authenticated
  using (public.is_cms_admin()) with check (public.is_cms_admin());

drop policy if exists "Public can read approved testimonials" on public.testimonials;
create policy "Public can read approved testimonials"
  on public.testimonials for select to anon, authenticated
  using (published = true and approved = true);
drop policy if exists "CMS admins manage testimonials" on public.testimonials;
create policy "CMS admins manage testimonials"
  on public.testimonials for all to authenticated
  using (public.is_cms_admin()) with check (public.is_cms_admin());

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
  on public.site_settings for select to anon, authenticated
  using (true);
drop policy if exists "CMS admins manage site settings" on public.site_settings;
create policy "CMS admins manage site settings"
  on public.site_settings for all to authenticated
  using (public.is_cms_admin()) with check (public.is_cms_admin());

insert into public.site_settings (id)
values ('default')
on conflict (id) do nothing;
