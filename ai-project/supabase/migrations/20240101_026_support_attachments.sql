-- Create support_attachments table
create table public.support_attachments (
  id uuid default gen_random_uuid() primary key,
  support_message_id uuid,
  attachment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.support_attachments enable row level security;

-- Policy: Users can read own attachments
create policy "Users can view own attachments"
  on public.support_attachments for select
  using ( true );