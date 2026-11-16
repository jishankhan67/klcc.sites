-- Create ptc_reports table
create table public.ptc_reports (
  id uuid default gen_random_uuid() primary key,
  ptc_id uuid unsigned not null default 0,
  user_id uuid unsigned not null default 0,
  ptc_report_type_id uuid unsigned not null default 0,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.ptc_reports enable row level security;

-- Policy: Users can read own reports
create policy "Users can view own reports"
  on public.ptc_reports for select
  using ( auth.uid() = user_id );