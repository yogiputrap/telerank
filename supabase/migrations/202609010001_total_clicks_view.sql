-- Migration: Aggregate all-time clicks in public_leaderboard view
create or replace view public.public_leaderboard as
select
  row_number() over (order by b.current_sponsor_amount desc, b.sponsor_updated_at asc nulls last, b.id) as rank,
  b.id,
  b.telegram_username,
  b.bot_name,
  b.avatar_url,
  b.description,
  b.category,
  b.custom_tagline,
  b.contact_handle,
  b.current_sponsor_amount as total_bid_amount,
  b.is_verified,
  b.is_online,
  b.created_at,
  coalesce(s.total_clicks, 0) as daily_clicks
from public.bots b
left join (
  select bot_id, sum(detail_clicks + outbound_clicks)::integer as total_clicks
  from public.bot_daily_stats
  group by bot_id
) s on s.bot_id = b.id
where b.status = 'active';

grant select on public.public_leaderboard to anon, authenticated;
