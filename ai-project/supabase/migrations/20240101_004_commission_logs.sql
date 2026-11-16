-- Create commission_logs table
create table public.commission_logs (
  id uuid default gen_random_uuid() primary key,
  to_id uuid,
  from_id uuid,
  level text not null,
  amount numeric(11,2) not null,
  type text,
  details text,
  trx text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.commission_logs enable row level security;

-- Policy: Users can read own commission logs
create policy "Users can view own commission logs"
  on public.commission_logs for select
  using ( auth.uid() = from_id or auth.uid() = to_id );