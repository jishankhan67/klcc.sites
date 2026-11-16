-- Create ptc_report_types table
create table public.ptc_report_types (
  id uuid default gen_random_uuid() primary key,
  name text,
  status smallint not null default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.ptc_report_types enable row level security;

-- Policy: Public can read report types
create policy "Public can view report types"
  on public.ptc_report_types for select
  using ( true );