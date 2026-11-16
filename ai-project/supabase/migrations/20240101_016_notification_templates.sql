-- Create notification_templates table
create table public.notification_templates (
  id uuid default gen_random_uuid() primary key,
  act text,
  name text,
  subj text,
  email_body text,
  sms_body text,
  shortcodes text,
  email_status smallint not null default 1,
  sms_status smallint not null default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.notification_templates enable row level security;

-- Policy: Public can read notification templates
create policy "Public can view notification templates"
  on public.notification_templates for select
  using ( true );