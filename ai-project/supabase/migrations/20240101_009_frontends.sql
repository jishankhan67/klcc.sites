-- Create frontends table
create table public.frontends (
  id uuid default gen_random_uuid() primary key,
  data_keys text,
  data_values text,
  template_name text,
  view integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.frontends enable row level security;

-- Policy: Public can read frontends
create policy "Public can view frontends"
  on public.frontends for select
  using ( true );