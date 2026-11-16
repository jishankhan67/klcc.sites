-- Create admins table
create table public.admins (
  id uuid default gen_random_uuid() primary key,
  name text,
  email text,
  username text unique,
  email_verified_at timestamp with time zone,
  image text,
  password text not null,
  remember_token text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.admins enable row level security;

-- Policy: Admins can read own data
create policy "Admins can view own data"
  on public.admins for select
  using ( auth.uid() = id );

-- Policy: Admins can update own data
create policy "Admins can update own data"
  on public.admins for update
  using ( auth.uid() = id );