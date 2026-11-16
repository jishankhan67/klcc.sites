-- Create languages table
create table public.languages (
  id uuid default gen_random_uuid() primary key,
  name text,
  code text,
  is_default smallint not null default 0 comment '0: not default language, 1: default language',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.languages enable row level security;

-- Policy: Public can read languages
create policy "Public can view languages"
  on public.languages for select
  using ( true );