-- Create ptc_engagements table
create table public.ptc_engagements (
  id uuid default gen_random_uuid() primary key,
  ptc_id uuid unsigned not null default 0,
  click timestamp with time zone,
  confirm timestamp with time zone,
  duration integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.ptc_engagements enable row level security;

-- Policy: Users can read own engagements
create policy "Users can view own engagements"
  on public.ptc_engagements for select
  using ( true );