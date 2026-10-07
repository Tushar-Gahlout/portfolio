-- Run this once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.
-- Replace the email below if you ever change the owner email.

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  tech text[] default '{}',
  github text,
  demo text,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.hackathon_photos (
  id uuid primary key default gen_random_uuid(),
  hackathon_key text not null,
  image_url text not null,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.hackathon_photos enable row level security;

-- Everyone can read
create policy "public read projects" on public.projects for select using (true);
create policy "public read hackathon photos" on public.hackathon_photos for select using (true);

-- Only the owner can write
create policy "owner write projects" on public.projects for all
  using ((auth.jwt() ->> 'email') = 'rajputtushar119@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'rajputtushar119@gmail.com');
create policy "owner write hackathon photos" on public.hackathon_photos for all
  using ((auth.jwt() ->> 'email') = 'rajputtushar119@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'rajputtushar119@gmail.com');

-- Image storage (public bucket)
insert into storage.buckets (id, name, public) values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

create policy "public read images" on storage.objects for select using (bucket_id = 'portfolio-images');
create policy "owner upload images" on storage.objects for insert
  with check (bucket_id = 'portfolio-images' and (auth.jwt() ->> 'email') = 'rajputtushar119@gmail.com');
create policy "owner delete images" on storage.objects for delete
  using (bucket_id = 'portfolio-images' and (auth.jwt() ->> 'email') = 'rajputtushar119@gmail.com');
