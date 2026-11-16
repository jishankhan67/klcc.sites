-- Create ptc_views table
create table public.ptc_views (
  id uuid default gen_random_uuid() primary key,
  ptc_id integer not null default 0,
  user_id integer not null default 0,
  view_date date,
  amount numeric(28,8) not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.ptc_views enable row level security;

-- Policy: Users can read own views
create policy "Users can view own views"
  on public.ptc_views for select
  using ( auth.uid() = user_id );