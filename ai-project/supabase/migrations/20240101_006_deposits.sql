-- Create deposits table
create table public.deposits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid unsigned not null,
  plan_id integer unsigned not null default 0,
  method_code integer unsigned not null default 0,
  amount numeric(28,8) not null default 0,
  method_currency text,
  charge numeric(28,8) not null default 0,
  rate numeric(28,8) not null default 0,
  final_amo numeric(28,8) not null default 0,
  detail text,
  btc_amo text,
  btc_wallet text,
  trx text,
  payment_try integer not null default 0,
  status smallint not null default 0 comment '1=>success, 2=>pending, 3=>cancel',
  from_api boolean not null default false,
  admin_feedback text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.deposits enable row level security;

-- Policy: Users can read own deposits
create policy "Users can view own deposits"
  on public.deposits for select
  using ( auth.uid() = user_id );

-- Policy: Users can insert own deposits
create policy "Users can insert own deposits"
  on public.deposits for insert
  with check ( auth.uid() = user_id );