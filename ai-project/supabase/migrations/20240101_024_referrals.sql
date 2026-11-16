-- Create referrals table
create table public.referrals (
  id uuid default gen_random_uuid() primary key,
  level integer not null default 0,
  percent numeric(11,2) not null default 0,
  status smallint not null default 0,
  commission_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  points integer
);

-- Enable RLS
alter table public.referrals enable row level security;

-- Policy: Public can read referrals
create policy "Public can view referrals"
  on public.referrals for select
  using ( true );