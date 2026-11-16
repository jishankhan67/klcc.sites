-- Create pages table
create table public.pages (
  id uuid default gen_random_uuid() primary key,
  name text,
  slug text,
  tempname text,
  secs text,
  is_default smallint not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.pages enable row level security;

-- Policy: Public can read pages
create policy "Public can view pages"
  on public.pages for select
  using ( true );