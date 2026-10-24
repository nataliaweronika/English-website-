-- WordBloom Skills Studio – paid plans (1 / 3 / 6 months), teacher class codes and pupil progress.
-- Run once in Supabase -> SQL Editor. Safe to run again (idempotent).
-- Existing client codes (wb_check_code) are untouched and keep working.

create extension if not exists pgcrypto;

-- One row per paid plan. Student plan = one learner. Teacher plan = teacher code + class code for pupils.
create table if not exists public.wb_plans (
  code         text primary key,                 -- personal code, e.g. WB-7K2P-9QXM (teacher: NA-XXXX-XXXX)
  kind         text not null check (kind in ('student','teacher')),
  months       int  not null check (months between 1 and 24),
  name         text default '',
  email        text default '',
  class_code   text unique,                      -- teacher plans only, e.g. KL-4F7Q2
  class_name   text default '',
  seats        int  not null default 30,
  assignment   jsonb,
  expires_at   timestamptz not null,
  active       boolean not null default true,
  session_id   text unique,                      -- Stripe Checkout session (stops double issuing)
  created_at   timestamptz not null default now()
);

-- Pupils who joined a class with the class code.
create table if not exists public.wb_pupils (
  code        text primary key,                  -- personal pupil code, e.g. UC-3HD8-K2PW
  teacher     text not null references public.wb_plans(code) on delete cascade,
  name        text not null,
  progress    jsonb,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz
);
create index if not exists wb_pupils_teacher on public.wb_pupils(teacher);

-- Simple brute-force protection.
create table if not exists public.wb_plan_tries (at timestamptz not null default now());

alter table public.wb_plans enable row level security;
alter table public.wb_pupils enable row level security;
alter table public.wb_plan_tries enable row level security;
revoke all on public.wb_plans, public.wb_pupils, public.wb_plan_tries from anon, authenticated;

-- Readable random code without look-alike characters (0/O, 1/I/L).
create or replace function public.wb_gen_code(prefix text, parts int default 2)
returns text language plpgsql as $$
declare a text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; s text := prefix; i int; j int;
begin
  for i in 1..parts loop
    s := s || '-';
    for j in 1..4 loop s := s || substr(a, 1 + floor(random()*length(a))::int, 1); end loop;
  end loop;
  return s;
end $$;

-- Creates a plan. Used by the Stripe function (service role) and by the admin form below.
create or replace function public.wb_plan_issue(p_kind text, p_months int, p_name text, p_email text, p_session text default null)
returns json language plpgsql security definer set search_path = public as $$
declare r public.wb_plans; c text; cc text;
begin
  if p_session is not null then
    select * into r from wb_plans where session_id = p_session;
    if found then return json_build_object('ok',true,'code',r.code,'class_code',r.class_code,'expires_at',r.expires_at,'kind',r.kind); end if;
  end if;
  loop c := wb_gen_code(case when p_kind='teacher' then 'NA' else 'WB' end); exit when not exists (select 1 from wb_plans where code=c) and not exists (select 1 from wb_pupils where code=c); end loop;
  if p_kind = 'teacher' then
    loop cc := wb_gen_code('KL',1) || substr('ABCDEFGHJKMNPQRSTUVWXYZ23456789', 1 + floor(random()*31)::int, 1); exit when not exists (select 1 from wb_plans where class_code=cc); end loop;
  end if;
  insert into wb_plans(code,kind,months,name,email,class_code,class_name,expires_at,session_id)
  values (c, p_kind, p_months, coalesce(p_name,''), lower(coalesce(p_email,'')), cc,
          case when p_kind='teacher' then coalesce(nullif(p_name,''),'Moja klasa') else '' end,
          now() + make_interval(months => p_months), p_session)
  returning * into r;
  return json_build_object('ok',true,'code',r.code,'class_code',r.class_code,'expires_at',r.expires_at,'kind',r.kind);
end $$;
revoke all on function public.wb_plan_issue(text,int,text,text,text) from public, anon, authenticated;

-- Renewal: extends an existing plan (used when the buyer pays again with the same e-mail – optional).
create or replace function public.wb_plan_extend(p_code text, p_months int)
returns json language plpgsql security definer set search_path = public as $$
declare r public.wb_plans;
begin
  update wb_plans set expires_at = greatest(expires_at, now()) + make_interval(months => p_months), active = true
   where code = upper(p_code) returning * into r;
  if not found then return json_build_object('ok',false); end if;
  return json_build_object('ok',true,'code',r.code,'expires_at',r.expires_at);
end $$;
revoke all on function public.wb_plan_extend(text,int) from public, anon, authenticated;

-- Check any Skills Studio code: student, teacher, pupil, or a class code (asks the pupil to join).
create or replace function public.wb_plan_check(p_code text)
returns json language plpgsql security definer set search_path = public as $$
declare c text := upper(trim(p_code)); r public.wb_plans; u public.wb_pupils; n int;
begin
  delete from wb_plan_tries where at < now() - interval '15 minutes';
  select count(*) into n from wb_plan_tries;
  if n > 300 then return json_build_object('ok',false,'reason','too_many'); end if;

  select * into r from wb_plans where code = c;
  if found then
    if not r.active then return json_build_object('ok',false,'reason','inactive'); end if;
    if r.expires_at < now() then return json_build_object('ok',false,'reason','expired','kind',r.kind,'name',r.name,'expires_at',r.expires_at); end if;
    return json_build_object('ok',true,'kind',r.kind,'name',r.name,'expires_at',r.expires_at,'class_code',r.class_code,'class_name',r.class_name,
      'seats',r.seats,'used',(select count(*) from wb_pupils where teacher=r.code and active),'assignment',r.assignment);
  end if;

  select * into u from wb_pupils where code = c;
  if found then
    select * into r from wb_plans where code = u.teacher;
    if not u.active or not r.active then return json_build_object('ok',false,'reason','inactive'); end if;
    if r.expires_at < now() then return json_build_object('ok',false,'reason','expired','kind','pupil','name',u.name,'expires_at',r.expires_at); end if;
    return json_build_object('ok',true,'kind','pupil','name',u.name,'expires_at',r.expires_at,'class_code',r.class_code,'class_name',r.class_name,'teacher_name',r.name,'assignment',r.assignment);
  end if;

  select * into r from wb_plans where class_code = c and kind = 'teacher';
  if found then return json_build_object('ok',false,'reason','class','class_name',r.class_name,'teacher_name',r.name); end if;

  insert into wb_plan_tries default values;
  return json_build_object('ok',false,'reason','not_found');
end $$;

-- Pupil joins a class with the class code + their name, gets a personal code.
create or replace function public.wb_class_join(p_class_code text, p_name text)
returns json language plpgsql security definer set search_path = public as $$
declare r public.wb_plans; c text; nm text := left(trim(p_name), 40);
begin
  if length(nm) < 2 then return json_build_object('ok',false,'reason','name'); end if;
  select * into r from wb_plans where class_code = upper(trim(p_class_code)) and kind = 'teacher' and active;
  if not found then return json_build_object('ok',false,'reason','not_found'); end if;
  if r.expires_at < now() then return json_build_object('ok',false,'reason','expired'); end if;
  if (select count(*) from wb_pupils where teacher = r.code and active) >= r.seats then return json_build_object('ok',false,'reason','full'); end if;
  loop c := wb_gen_code('UC'); exit when not exists (select 1 from wb_pupils where code=c) and not exists (select 1 from wb_plans where code=c); end loop;
  insert into wb_pupils(code, teacher, name) values (c, r.code, nm);
  return json_build_object('ok',true,'code',c);
end $$;

-- Pupil progress summary (counts and scores only – no recordings, no texts).
create or replace function public.wb_progress_save(p_code text, p_progress jsonb)
returns json language plpgsql security definer set search_path = public as $$
begin
  if octet_length(p_progress::text) > 8000 then return json_build_object('ok',false); end if;
  update wb_pupils set progress = p_progress, updated_at = now() where code = upper(p_code) and active;
  return json_build_object('ok', found);
end $$;

-- Teacher: class list with progress.
create or replace function public.wb_class_report(p_code text)
returns json language plpgsql security definer set search_path = public as $$
declare r public.wb_plans;
begin
  select * into r from wb_plans where code = upper(p_code) and kind = 'teacher' and active;
  if not found then return json_build_object('ok',false); end if;
  return json_build_object('ok',true,'class_code',r.class_code,'class_name',r.class_name,'seats',r.seats,'expires_at',r.expires_at,'assignment',r.assignment,
    'pupils', coalesce((select json_agg(json_build_object('name',name,'code',code,'progress',progress,'updated_at',updated_at) order by name)
                        from wb_pupils where teacher = r.code and active), '[]'::json));
end $$;

-- Teacher: weekly task shown to all pupils of the class.
create or replace function public.wb_class_set_assignment(p_code text, p_assignment jsonb)
returns json language plpgsql security definer set search_path = public as $$
begin
  if p_assignment is not null and octet_length(p_assignment::text) > 4000 then return json_build_object('ok',false); end if;
  update wb_plans set assignment = p_assignment where code = upper(p_code) and kind = 'teacher' and active and expires_at > now();
  return json_build_object('ok', found);
end $$;

-- Teacher: remove a pupil (frees the seat).
create or replace function public.wb_class_remove_pupil(p_code text, p_pupil_code text)
returns json language plpgsql security definer set search_path = public as $$
begin
  update wb_pupils set active = false where code = upper(p_pupil_code) and teacher = upper(p_code);
  return json_build_object('ok', found);
end $$;

-- Admin (Natalia): issue a plan by hand – invoices, bank transfers, gifts.
-- Re-uses the existing admin login (wb_admin_check).
create or replace function public.wb_plan_admin_create(p_token text, p_kind text, p_months int, p_name text, p_email text)
returns json language plpgsql security definer set search_path = public as $$
begin
  if not coalesce(public.wb_admin_check(p_token), false) then return json_build_object('ok',false,'reason','admin'); end if;
  if p_kind not in ('student','teacher') or p_months not between 1 and 24 then return json_build_object('ok',false); end if;
  return public.wb_plan_issue(p_kind, p_months, p_name, p_email, null);
end $$;

grant execute on function public.wb_plan_check(text), public.wb_class_join(text,text), public.wb_progress_save(text,jsonb),
  public.wb_class_report(text), public.wb_class_set_assignment(text,jsonb), public.wb_class_remove_pupil(text,text),
  public.wb_plan_admin_create(text,text,int,text,text) to anon, authenticated;
grant execute on function public.wb_plan_issue(text,int,text,text,text), public.wb_plan_extend(text,int) to service_role;
