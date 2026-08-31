create extension if not exists citext;
create extension if not exists pgcrypto;

do $$ begin
  create type public.user_role as enum ('user','admin');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.bot_status as enum ('active','suspended','rejected','deleted');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.order_purpose as enum ('listing','replace_sponsor','outbid');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.order_status as enum ('pending','paid','expired','failed','cancelled','refunded');
exception when duplicate_object then null; end $$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'user',
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.bots (
  id uuid primary key default gen_random_uuid(),
  telegram_username citext not null unique,
  owner_id uuid references public.profiles(id) on delete set null,
  bot_name text not null check (char_length(bot_name) between 1 and 120),
  avatar_url text,
  description text not null default '' check (char_length(description) <= 150),
  category text not null check (category in ('DOWNLOADER','AI','ANON_CHAT','GAME','TOOLS','STORE')),
  custom_tagline text not null default '',
  contact_handle text,
  current_sponsor_amount bigint not null default 0 check (current_sponsor_amount >= 0),
  status public.bot_status not null default 'active',
  is_verified boolean not null default false,
  is_online boolean not null default true,
  sponsor_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique default ('TR-' || upper(encode(gen_random_bytes(8), 'hex'))),
  bot_id uuid references public.bots(id) on delete set null,
  purpose public.order_purpose not null,
  telegram_username citext not null,
  amount bigint not null check (amount >= 1000),
  target_amount bigint,
  draft_data jsonb,
  provider text not null default 'sandbox',
  provider_payment_id text unique,
  status public.order_status not null default 'pending',
  expires_at timestamptz not null default (now() + interval '15 minutes'),
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sponsor_events (
  id uuid primary key default gen_random_uuid(),
  bot_id uuid not null references public.bots(id) on delete restrict,
  order_id uuid not null unique references public.payment_orders(id) on delete restrict,
  previous_total bigint not null check (previous_total >= 0),
  new_total bigint not null check (new_total >= 1000),
  paid_amount bigint not null check (paid_amount >= 1000),
  event_kind public.order_purpose not null,
  created_at timestamptz not null default now()
);

create table public.rank_events (
  id uuid primary key default gen_random_uuid(),
  bot_id uuid not null references public.bots(id) on delete restrict,
  order_id uuid not null references public.payment_orders(id) on delete restrict,
  old_rank integer not null check (old_rank >= 1),
  new_rank integer not null check (new_rank >= 1),
  old_amount bigint not null,
  new_amount bigint not null,
  created_at timestamptz not null default now()
);

create table public.bot_daily_stats (
  bot_id uuid not null references public.bots(id) on delete cascade,
  stat_date date not null default (timezone('utc', now())::date),
  detail_clicks integer not null default 0 check (detail_clicks >= 0),
  outbound_clicks integer not null default 0 check (outbound_clicks >= 0),
  updated_at timestamptz not null default now(),
  primary key (bot_id, stat_date)
);

create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  feedback_type text not null check (feedback_type in ('SARAN','BUG','LAINNYA')),
  telegram_handle text,
  message text not null check (char_length(message) between 1 and 4000),
  status text not null default 'new' check (status in ('new','triaged','resolved','spam')),
  created_at timestamptz not null default now()
);

create table public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_event_id text not null,
  payload_hash text not null,
  status text not null default 'received',
  error_message text,
  created_at timestamptz not null default now(),
  unique(provider, provider_event_id)
);

create index bots_public_rank_idx on public.bots (current_sponsor_amount desc, sponsor_updated_at asc, id) where status = 'active';
create index bots_category_idx on public.bots (category, current_sponsor_amount desc) where status = 'active';
create index orders_status_expiry_idx on public.payment_orders (status, expires_at);
create index stats_date_idx on public.bot_daily_stats (stat_date);

create or replace view public.public_leaderboard as
select row_number() over (order by b.current_sponsor_amount desc, b.sponsor_updated_at asc nulls last, b.id) as rank,
  b.id, b.telegram_username, b.bot_name, b.avatar_url, b.description, b.category, b.custom_tagline,
  b.contact_handle, b.current_sponsor_amount as total_bid_amount, b.is_verified, b.is_online, b.created_at,
  coalesce(s.detail_clicks, 0) + coalesce(s.outbound_clicks, 0) as daily_clicks
from public.bots b
left join public.bot_daily_stats s on s.bot_id = b.id and s.stat_date = timezone('utc', now())::date
where b.status = 'active';

alter table public.profiles enable row level security;
alter table public.bots enable row level security;
alter table public.payment_orders enable row level security;
alter table public.sponsor_events enable row level security;
alter table public.rank_events enable row level security;
alter table public.bot_daily_stats enable row level security;
alter table public.feedback enable row level security;
alter table public.webhook_events enable row level security;

grant select on public.public_leaderboard to anon, authenticated;
revoke all on public.webhook_events from anon, authenticated;
