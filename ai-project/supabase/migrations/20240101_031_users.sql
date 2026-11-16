-- Create users table
create table public.users (
  id uuid default gen_random_uuid() primary key,
  plan_id integer not null default 0,
  ref_by uuid unsigned not null default 0,
  daily_limit integer not null default 0,
  firstname text,
  lastname text,
  username text not null unique,
  email text not null unique,
  country_code text,
  mobile text,
  balance numeric(28,8) not null default 0,
  password text not null,
  address text,
  status smallint not null default 1 comment '0: banned, 1: active',
  kyc_data text,
  kv smallint not null default 0 comment '0: KYC Unverified, 2: KYC pending, 1: KYC verified',
  ev smallint not null default 0 comment '0: email unverified, 1: email verified',
  sv smallint not null default 1 comment '0: mobile unverified, 1: mobile verified',
  profile_complete smallint not null default 0,
  ver_code text,
  ver_code_send_at timestamp with time zone,
  ts smallint not null default 0 comment '0: 2fa off, 1: 2fa on',
  tv smallint not null default 1 comment '0: 2fa unverified, 1: 2fa verified',
  tsc text,
  ban_reason text,
  expire_date timestamp with time zone,
  remember_token text,
  login_by text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  points integer default 0,
  reward integer default 0,
  ref varchar(50),
  key text
);

-- Enable RLS
alter table public.users enable row level security;

-- Policy: Users can read own data
create policy "Users can view own data"
  on public.users for select
  using ( auth.uid() = id );

-- Policy: Users can update own data
create policy "Users can update own data"
  on public.users for update
  using ( auth.uid() = id );