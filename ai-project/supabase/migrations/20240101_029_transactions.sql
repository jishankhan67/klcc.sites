-- Create transactions table
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid unsigned not null default 0,
  amount numeric(28,8) not null default 0,
  charge numeric(28,8) not null default 0,
  post_balance numeric(28,8) not null default 0,
  trx_type text,
  trx text,
  details text,
  remark text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.transactions enable row level security;

-- Policy: Users can read own transactions
create policy "Users can view own transactions"
  on public.transactions for select
  using ( auth.uid() = user_id );