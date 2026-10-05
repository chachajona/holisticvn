-- HolisticVN CRM: run with `supabase db push` against a new project.
create extension if not exists "pgcrypto";

create type public.app_role as enum ('admin', 'staff');
create type public.lead_kind as enum ('contact', 'booking');
create type public.lead_status as enum ('new', 'contacted', 'confirmed', 'completed', 'lost');
create type public.subscription_status as enum ('subscribed', 'unsubscribed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.app_role not null default 'staff',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  kind public.lead_kind not null,
  name text not null check (char_length(name) between 2 and 100),
  phone text not null check (char_length(phone) between 8 and 24),
  email text,
  message text check (message is null or char_length(message) <= 1000),
  treatment_name text,
  source text not null default 'website',
  status public.lead_status not null default 'new',
  assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status public.subscription_status not null default 'subscribed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_assigned_status_created_idx on public.leads (assigned_to, status, created_at desc);
create index leads_status_created_idx on public.leads (status, created_at desc);
create index leads_kind_created_idx on public.leads (kind, created_at desc);
create index lead_notes_lead_created_idx on public.lead_notes (lead_id, created_at asc);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger leads_updated_at before update on public.leads for each row execute function public.set_updated_at();
create trigger newsletter_updated_at before update on public.newsletter_subscribers for each row execute function public.set_updated_at();

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role) values (new.id, new.raw_user_meta_data ->> 'full_name', coalesce((new.raw_user_meta_data ->> 'role')::public.app_role, 'staff'));
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.lead_notes enable row level security;
alter table public.newsletter_subscribers enable row level security;

create policy "profile read authenticated" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "admin manage profiles" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin reads all leads" on public.leads for select to authenticated using (public.is_admin());
create policy "staff reads assigned leads" on public.leads for select to authenticated using (assigned_to = auth.uid());
create policy "admin updates leads" on public.leads for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "staff updates assigned leads" on public.leads for update to authenticated using (assigned_to = auth.uid()) with check (assigned_to = auth.uid());
create policy "admin reads all notes" on public.lead_notes for select to authenticated using (public.is_admin());
create policy "staff reads assigned notes" on public.lead_notes for select to authenticated using (exists(select 1 from public.leads where leads.id = lead_notes.lead_id and leads.assigned_to = auth.uid()));
create policy "admin writes notes" on public.lead_notes for insert to authenticated with check (public.is_admin() and author_id = auth.uid());
create policy "staff writes assigned notes" on public.lead_notes for insert to authenticated with check (author_id = auth.uid() and exists(select 1 from public.leads where leads.id = lead_notes.lead_id and leads.assigned_to = auth.uid()));
create policy "admin reads newsletter" on public.newsletter_subscribers for select to authenticated using (public.is_admin());

-- Service-role API writes bypass RLS. Bootstrap first admin once after invitation:
-- update public.profiles set role = 'admin' where id = '<admin-user-uuid>';
