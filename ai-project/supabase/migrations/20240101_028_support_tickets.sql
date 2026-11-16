-- Create support_tickets table
create table public.support_tickets (
  id uuid default gen_random_uuid() primary key,
  user_id integer not null default 0,
  name text,
  email text,
  ticket text,
  subject text,
  status smallint not null default 0 comment '0: Open, 1: Answered, 2: Replied, 3: Closed',
  priority smallint not null default 0 comment '1 = Low, 2 = medium, 3 = heigh',
  last_reply timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.support_tickets enable row level security;

-- Policy: Users can read own tickets
create policy "Users can view own tickets"
  on public.support_tickets for select
  using ( auth.uid() = user_id );