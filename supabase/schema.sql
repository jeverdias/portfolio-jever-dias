-- Execute este arquivo no SQL Editor de um projeto Supabase NOVO e exclusivo do portfólio.

create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id text primary key default 'main',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_projects (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  featured boolean not null default true,
  position integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 254),
  subject text not null check (char_length(subject) between 2 and 180),
  message text not null check (char_length(message) between 10 and 5000),
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);

alter table public.portfolio_admins enable row level security;
alter table public.site_settings enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.contact_messages enable row level security;

revoke all on public.portfolio_admins from anon;
grant select on public.portfolio_admins to authenticated;
grant select on public.site_settings to anon;
grant select, insert, update, delete on public.site_settings to authenticated;
grant select on public.portfolio_projects to anon;
grant select, insert, update, delete on public.portfolio_projects to authenticated;
revoke all on public.contact_messages from anon, authenticated;
grant select, update, delete on public.contact_messages to authenticated;

create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.portfolio_admins where user_id = auth.uid()
  );
$$;

revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to authenticated;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings" on public.site_settings for select to anon, authenticated using (true);
drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings" on public.site_settings for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

drop policy if exists "Public can read featured projects" on public.portfolio_projects;
create policy "Public can read featured projects" on public.portfolio_projects for select to anon, authenticated using (featured = true or public.is_portfolio_admin());
drop policy if exists "Admins manage projects" on public.portfolio_projects;
create policy "Admins manage projects" on public.portfolio_projects for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

drop policy if exists "Public can send contact messages" on public.contact_messages;
drop policy if exists "Admins manage contact messages" on public.contact_messages;
create policy "Admins manage contact messages" on public.contact_messages for all to authenticated
using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index if not exists contact_messages_status_idx on public.contact_messages (status);
create index if not exists contact_messages_email_created_idx on public.contact_messages (lower(email), created_at desc);

create or replace function public.submit_contact_message(
  p_name text,
  p_email text,
  p_subject text,
  p_message text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(trim(p_email));
  v_id uuid;
begin
  if char_length(trim(p_name)) not between 2 and 120
    or char_length(v_email) not between 5 and 254
    or v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    or char_length(trim(p_subject)) not between 2 and 180
    or char_length(trim(p_message)) not between 10 and 5000 then
    raise exception 'Confira os dados antes de enviar.' using errcode = '22023';
  end if;

  if exists (
    select 1 from public.contact_messages
    where lower(email) = v_email
      and created_at > now() - interval '60 seconds'
  ) then
    raise exception 'Aguarde um minuto antes de enviar outra mensagem.' using errcode = 'P0001';
  end if;

  if (
    select count(*) from public.contact_messages
    where lower(email) = v_email
      and created_at > now() - interval '1 hour'
  ) >= 5 then
    raise exception 'Limite temporário de mensagens atingido. Tente novamente mais tarde.' using errcode = 'P0001';
  end if;

  if exists (
    select 1 from public.contact_messages
    where lower(email) = v_email
      and lower(message) = lower(trim(p_message))
      and created_at > now() - interval '10 minutes'
  ) then
    raise exception 'Mensagem repetida. Aguarde antes de reenviar.' using errcode = 'P0001';
  end if;

  insert into public.contact_messages (name, email, subject, message)
  values (trim(p_name), v_email, trim(p_subject), trim(p_message))
  returning id into v_id;
  return v_id;
end;
$$;

revoke all on function public.submit_contact_message(text, text, text, text) from public;
grant execute on function public.submit_contact_message(text, text, text, text) to anon, authenticated;

drop policy if exists "Admins can read own access" on public.portfolio_admins;
create policy "Admins can read own access" on public.portfolio_admins for select to authenticated using (user_id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-assets',
  'portfolio-assets',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view portfolio assets" on storage.objects;
create policy "Public can view portfolio assets" on storage.objects for select to public using (bucket_id = 'portfolio-assets');
drop policy if exists "Admins upload portfolio assets" on storage.objects;
create policy "Admins upload portfolio assets" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio-assets' and public.is_portfolio_admin());
drop policy if exists "Admins update portfolio assets" on storage.objects;
create policy "Admins update portfolio assets" on storage.objects for update to authenticated using (bucket_id = 'portfolio-assets' and public.is_portfolio_admin()) with check (bucket_id = 'portfolio-assets' and public.is_portfolio_admin());
drop policy if exists "Admins delete portfolio assets" on storage.objects;
create policy "Admins delete portfolio assets" on storage.objects for delete to authenticated using (bucket_id = 'portfolio-assets' and public.is_portfolio_admin());

-- Depois de criar o usuário em Authentication > Users, execute:
-- insert into public.portfolio_admins (user_id) values ('UUID-DO-USUARIO');
