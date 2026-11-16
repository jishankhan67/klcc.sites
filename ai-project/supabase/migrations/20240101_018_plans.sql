-- Create plans table
create table public.plans (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  price numeric(28,8) not null default 0,
  daily_limit integer not null default 0,
  status smallint not null default 0,
  ref_level integer not null default 0,
  validity integer not null default 0,
  tagline text,
  highlight smallint not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.plans enable row level security;

-- Policy: Public can read plans
create policy "Public can view plans"
  on public.plans for select
  using ( true );