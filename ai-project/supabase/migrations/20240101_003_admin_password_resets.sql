-- Create admin_password_resets table
create table public.admin_password_resets (
  id uuid default gen_random_uuid() primary key,
  email text,
  token text,
  status boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.admin_password_resets enable row level security;

-- Policy: Admins can read own password resets
create policy "Admins can view own password resets"
  on public.admin_password_resets for select
  using ( auth.uid() = id );