-- Create extensions table
create table public.extensions (
  id uuid default gen_random_uuid() primary key,
  act text,
  name text,
  description text,
  image text,
  script text,
  shortcode text,
  support text,
  status smallint not null default 1 comment '1=>enable, 2=>disable',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.extensions enable row level security;

-- Policy: Public can read extensions
create policy "Public can view extensions"
  on public.extensions for select
  using ( true );