-- Everyday English approval system
-- Run this once in Supabase -> SQL Editor.
-- After your own account is created, replace YOUR_ADMIN_EMAIL below
-- with the email you used for your owner account and run that final UPDATE.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected','disabled')),
  role text not null default 'student'
    check (role in ('student','teacher','admin')),
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and status = 'approved'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do update
    set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin"
on public.profiles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

grant select, update on public.profiles to authenticated;
revoke all on public.profiles from anon;

-- IMPORTANT:
-- First create your owner account through the Everyday English login screen.
-- Then replace YOUR_ADMIN_EMAIL below with YOUR email and run this statement.
-- This makes your account the only initial administrator.
--
-- update public.profiles
-- set status = 'approved', role = 'admin', approved_at = now()
-- where lower(email) = lower('YOUR_ADMIN_EMAIL');

