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

alter table public.portfolio_admins enable row level security;
alter table public.site_settings enable row level security;
alter table public.portfolio_projects enable row level security;

revoke all on public.portfolio_admins from anon;
grant select on public.portfolio_admins to authenticated;
grant select on public.site_settings to anon;
grant select, insert, update, delete on public.site_settings to authenticated;
grant select on public.portfolio_projects to anon;
grant select, insert, update, delete on public.portfolio_projects to authenticated;

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
