-- public_leaderboard previously ran with the view owner's privileges (Postgres default),
-- bypassing RLS on public.bots / public.bot_daily_stats for every querying role.
-- Switch it to security_invoker so it enforces RLS as the querying role, and add the
-- narrow RLS policies + column grants needed for anon/authenticated to keep reading
-- the same public leaderboard data through it.

create policy bots_public_read on public.bots
  for select
  to anon, authenticated
  using (status = 'active');

create policy bot_daily_stats_public_read on public.bot_daily_stats
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.bots b
      where b.id = bot_daily_stats.bot_id and b.status = 'active'
    )
  );

grant select (
  id, telegram_username, bot_name, avatar_url, description, category, custom_tagline,
  contact_handle, current_sponsor_amount, status, is_verified, is_online,
  sponsor_updated_at, created_at
) on public.bots to anon, authenticated;

grant select (bot_id, stat_date, detail_clicks, outbound_clicks) on public.bot_daily_stats to anon, authenticated;

alter view public.public_leaderboard set (security_invoker = true);
