-- Create user_logins table
create table public.user_logins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid unsigned not null default 0,
  user_ip text,
  city text,
  country text,
  country_code text,
  longitude text,
  latitude text,
  browser text,
  os text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.user_logins enable row level security;

-- Policy: Users can read own logins
create policy "Users can view own logins"
  on public.user_logins for select
  using ( auth.uid() = user_id );