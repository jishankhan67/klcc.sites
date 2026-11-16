-- ============================================
-- Supabase Database Schema for AI Project
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase Auth users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Conversations table
create table public.conversations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null default 'New Chat',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Messages table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  content text not null,
  role text not null check (role in ('user', 'assistant')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Profiles: Users can read/update their own profile
alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Conversations: Users can CRUD their own conversations
alter table public.conversations enable row level security;

create policy "Users can view their own conversations"
  on public.conversations for select
  using ( auth.uid() = user_id );

create policy "Users can create their own conversations"
  on public.conversations for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own conversations"
  on public.conversations for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own conversations"
  on public.conversations for delete
  using ( auth.uid() = user_id );

-- Messages: Users can CRUD messages in their conversations
alter table public.messages enable row level security;

create policy "Users can view messages in their conversations"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations
      where id = conversation_id and user_id = auth.uid()
    )
  );

create policy "Users can insert messages in their conversations"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.conversations
      where id = conversation_id and user_id = auth.uid()
    )
  );

create policy "Users can delete messages in their conversations"
  on public.messages for delete
  using (
    exists (
      select 1 from public.conversations
      where id = conversation_id and user_id = auth.uid()
    )
  );

-- ============================================
-- Indexes for performance
-- ============================================

create index idx_conversations_user_id on public.conversations(user_id);
create index idx_messages_conversation_id on public.messages(conversation_id);
create index idx_messages_created_at on public.messages(created_at);

-- ============================================
-- Updated at trigger for profiles
-- ============================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row
  execute procedure public.handle_updated_at();