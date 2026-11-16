-- Create notification_logs table
create table public.notification_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid unsigned not null default 0,
  sender text,
  sent_from text,
  sent_to text,
  subject text,
  message text,
  notification_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.notification_logs enable row level security;

-- Policy: Users can read own notification logs
create policy "Users can view own notification logs"
  on public.notification_logs for select
  using ( auth.uid() = user_id );