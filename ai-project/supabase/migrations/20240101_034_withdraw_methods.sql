-- Create withdraw_methods table
create table public.withdraw_methods (
  id uuid default gen_random_uuid() primary key,
  form_id uuid unsigned not null default 0,
  name text,
  min_limit numeric(28,8) not null default 0,
  max_limit numeric(28,8) not null default 0,
  fixed_charge numeric(28,8) not null default 0,
  rate numeric(28,8) not null default 0,
  percent_charge numeric(5,2),
  currency text,
  description text,
  status smallint not null default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.withdraw_methods enable row level security;

-- Policy: Public can read withdraw methods
create policy "Public can view withdraw methods"
  on public.withdraw_methods for select
  using ( true );