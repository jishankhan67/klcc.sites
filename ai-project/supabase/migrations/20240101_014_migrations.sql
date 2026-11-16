-- Create migrations table
create table public.migrations (
  id uuid default gen_random_uuid() primary key,
  migration varchar(255) not null,
  batch integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.migrations enable row level security;

-- Policy: Public can read migrations
create policy "Public can view migrations"
  on public.migrations for select
  using ( true );