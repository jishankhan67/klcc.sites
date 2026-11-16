-- Create gateway_currencies table
create table public.gateway_currencies (
  id uuid default gen_random_uuid() primary key,
  name text,
  currency text,
  symbol text,
  method_code integer,
  gateway_alias text,
  min_amount numeric(28,8) not null default 0,
  max_amount numeric(28,8) not null default 0,
  percent_charge numeric(5,2) not null default 0,
  fixed_charge numeric(28,8) not null default 0,
  rate numeric(28,8) not null default 0,
  image text,
  gateway_parameter text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.gateway_currencies enable row level security;

-- Policy: Public can read gateway currencies
create policy "Public can view gateway currencies"
  on public.gateway_currencies for select
  using ( true );