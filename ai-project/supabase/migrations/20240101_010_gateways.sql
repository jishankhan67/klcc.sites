-- Create gateways table
create table public.gateways (
  id uuid default gen_random_uuid() primary key,
  form_id integer unsigned not null default 0,
  code integer,
  name text,
  alias text default 'NULL',
  image text,
  status smallint not null default 1 comment '1=>enable, 2=>disable',
  gateway_parameters text,
  supported_currencies text,
  crypto boolean not null default 0 comment '0: fiat currency, 1: crypto currency',
  extra text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.gateways enable row level security;

-- Policy: Public can read gateways
create policy "Public can view gateways"
  on public.gateways for select
  using ( true );