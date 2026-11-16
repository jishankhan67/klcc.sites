-- Create general_settings table
create table public.general_settings (
  id uuid default gen_random_uuid() primary key,
  site_name text,
  cur_text text,
  cur_sym text,
  email_from text,
  email_template text,
  sms_body text,
  sms_from text,
  base_color text,
  secondary_color text,
  mail_config text,
  sms_config text,
  global_shortcodes text,
  kv smallint not null default 0,
  ev smallint not null default 0 comment 'email verification, 0 - dont check, 1 - check',
  en smallint not null default 0 comment 'email notification, 0 - dont send, 1 - send',
  sv smallint not null default 0 comment 'mobile verication, 0 - dont check, 1 - check',
  sn smallint not null default 0 comment 'sms notification, 0 - dont send, 1 - send',
  force_ssl smallint not null default 0,
  maintenance_mode smallint not null default 0,
  secure_password smallint not null default 0,
  agree smallint not null default 0,
  multi_language smallint not null default 1,
  registration smallint not null default 0 comment '0: Off, 1: On',
  active_template text,
  deposit_commission smallint not null default 0,
  plan_subscribe_commission smallint not null default 0,
  ptc_view_commission smallint not null default 0,
  system_info text,
  registration_bonus numeric(28,8) not null default 0,
  bt_fixed numeric(28,8) not null default 0,
  bt_percent numeric(11,2) not null default 0,
  balance_transfer smallint not null default 0,
  default_plan integer not null default 0,
  user_ads_post smallint not null default 0,
  ad_auto_approve smallint not null default 0,
  ads_setting text,
  socialite_credentials text,
  app_url text not null,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.general_settings enable row level security;

-- Policy: Public can read general settings
create policy "Public can view general settings"
  on public.general_settings for select
  using ( true );