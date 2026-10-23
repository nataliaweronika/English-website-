-- WordBloom – e-mail list for free downloads (freebie forms on the site).
-- Run this once in Supabase -> SQL Editor (after supabase_setup.sql, which creates public.is_admin()).
-- To see the list: Supabase -> Table Editor -> newsletter_signups (or export it as CSV).

create table if not exists public.newsletter_signups (
  id bigint generated always as identity primary key,
  email text not null,
  source text not null default 'site',
  lang text,
  page text,
  consent boolean not null default false,
  created_at timestamptz not null default now(),
  unique (email, source)
);

alter table public.newsletter_signups enable row level security;

-- Visitors may only ADD their own address (with consent ticked). They cannot read the list.
drop policy if exists "visitors can sign up" on public.newsletter_signups;
create policy "visitors can sign up" on public.newsletter_signups
  for insert to anon, authenticated
  with check (consent = true and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) < 200);

-- Only the WordBloom admin account can read the list.
drop policy if exists "admin can read signups" on public.newsletter_signups;
create policy "admin can read signups" on public.newsletter_signups
  for select to authenticated
  using (public.is_admin());
