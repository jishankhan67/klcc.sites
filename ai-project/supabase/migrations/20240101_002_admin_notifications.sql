-- Create admin_notifications table
create table public.admin_notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text,
  is_read boolean default false,
  click_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.admin_notifications enable row level security;

-- Policy: Users can read own notifications
create policy "Users can view own notifications"
  on public.admin_notifications for select
  using ( auth.uid() = user_id );

-- Policy: Users can update own notifications
create policy "Users can update own notifications"
  on public.admin_notifications for update
  using ( auth.uid() = user_id );