-- Create ptcs table
create table public.ptcs (
  id uuid default gen_random_uuid() primary key,
  user_id integer not null default 0,
  ads_type smallint not null default 0 comment '1 = link | 2 = image | 3 = script',
  title text,
  ads_body text,
  amount numeric(28,8) not null default 0,
  duration integer not null default 0,
  max_show integer not null default 0,
  showed integer not null default 0,
  remain integer not null default 0,
  reject_reason text,
  schedule text,
  status smallint not null default 1 comment '0 = inactive, 1 = active, 2 = pending, 3 = rejected',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ad_type text not null default 'daily'
);

-- Enable RLS
alter table public.ptcs enable row level security;

-- Policy: Users can read own PTs
create policy "Users can view own PTs"
  on public.ptcs for select
  using ( true );