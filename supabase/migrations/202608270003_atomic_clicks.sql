create or replace function public.increment_bot_click(p_bot_id uuid, p_kind text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_kind not in ('detail', 'outbound') then raise exception 'INVALID_CLICK_KIND'; end if;
  if not exists (select 1 from bots where id = p_bot_id and status = 'active') then raise exception 'BOT_NOT_FOUND'; end if;
  insert into bot_daily_stats(bot_id, stat_date, detail_clicks, outbound_clicks)
  values (p_bot_id, timezone('utc', now())::date,
    case when p_kind = 'detail' then 1 else 0 end,
    case when p_kind = 'outbound' then 1 else 0 end)
  on conflict (bot_id, stat_date) do update set
    detail_clicks = bot_daily_stats.detail_clicks + excluded.detail_clicks,
    outbound_clicks = bot_daily_stats.outbound_clicks + excluded.outbound_clicks,
    updated_at = now();
end; $$;
revoke all on function public.increment_bot_click(uuid,text) from public;
grant execute on function public.increment_bot_click(uuid,text) to service_role;
