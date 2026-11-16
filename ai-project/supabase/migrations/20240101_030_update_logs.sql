-- Create update_logs table
create table public.update_logs (
  id uuid default gen_random_uuid() primary key,
  version text,
  update_log text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.update_logs enable row level security;

-- Policy: Public can read update logs
create policy "Public can view update logs"
  on public.update_logs for select
  using ( true );