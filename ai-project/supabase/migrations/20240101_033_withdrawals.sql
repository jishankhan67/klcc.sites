-- Create withdrawals table
create table public.withdrawals (
  id uuid default gen_random_uuid() primary key,
  method_id uuid unsigned not null default 0,
  user_id uuid unsigned not null default 0,
  amount numeric(28,8) not null default 0,
  currency text,
  rate numeric(28,8) not null default 0,
  charge numeric(28,8) not null default 0,
  trx text,
  final_amount numeric(28,8) not null default 0,
  after_charge numeric(28,8) not null default 0,
  withdraw_information text,
  status smallint not null default 0 comment '1=>success, 2=>pending, 3=>cancel, ',
  admin_feedback text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.withdrawals enable row level security;

-- Policy: Users can read own withdrawals
create policy "Users can view own withdrawals"
  on public.withdrawals for select
  using ( auth.uid() = user_id );