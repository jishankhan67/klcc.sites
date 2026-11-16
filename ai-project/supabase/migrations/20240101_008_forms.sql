-- Create forms table
create table public.forms (
  id uuid default gen_random_uuid() primary key,
  act text,
  form_data text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.forms enable row level security;

-- Policy: Public can read forms
create policy "Public can view forms"
  on public.forms for select
  using ( true );