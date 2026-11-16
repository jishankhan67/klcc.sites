-- Create support_messages table
create table public.support_messages (
  id uuid default gen_random_uuid() primary key,
  support_ticket_id uuid not null default 0,
  admin_id uuid not null default 0,
  message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.support_messages enable row level security;

-- Policy: Users can read own messages
create policy "Users can view own messages"
  on public.support_messages for select
  using ( auth.uid() = admin_id );