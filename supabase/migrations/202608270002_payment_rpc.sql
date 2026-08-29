create or replace function public.confirm_paid_order(p_public_id text, p_provider_payment_id text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare o payment_orders%rowtype; b bots%rowtype; previous_total bigint; old_rank integer; new_rank integer;
begin
  select * into o from payment_orders where public_id = p_public_id for update;
  if not found then raise exception 'ORDER_NOT_FOUND'; end if;
  if o.status = 'paid' then return jsonb_build_object('status','paid','order_id',o.public_id); end if;
  if o.status <> 'pending' or o.expires_at <= now() then raise exception 'ORDER_NOT_PAYABLE'; end if;
  select * into b from bots where id = o.bot_id for update;
  if o.bot_id is null then
    insert into bots (telegram_username, bot_name, avatar_url, description, category, current_sponsor_amount, sponsor_updated_at)
    values (o.telegram_username, coalesce(o.draft_data->>'bot_name', o.telegram_username::text), o.draft_data->>'avatar_url', coalesce(o.draft_data->>'description',''), coalesce(o.draft_data->>'category','DOWNLOADER'), o.amount, now()) returning * into b;
  else
    previous_total := b.current_sponsor_amount;
    if o.amount <= b.current_sponsor_amount then raise exception 'AMOUNT_MUST_INCREASE'; end if;
    select count(*) + 1 into old_rank from bots where status='active' and (current_sponsor_amount > b.current_sponsor_amount or (current_sponsor_amount = b.current_sponsor_amount and sponsor_updated_at < b.sponsor_updated_at));
    update bots set current_sponsor_amount=o.amount, sponsor_updated_at=now(), updated_at=now() where id=b.id;
  end if;
  update payment_orders set status='paid', provider_payment_id=p_provider_payment_id, paid_at=now(), updated_at=now() where id=o.id;
  insert into sponsor_events(bot_id,order_id,previous_total,new_total,paid_amount,event_kind) values (b.id,o.id,coalesce(previous_total,0),o.amount,o.amount,o.purpose);
  select count(*) + 1 into new_rank from bots where status='active' and (current_sponsor_amount > o.amount or (current_sponsor_amount = o.amount and sponsor_updated_at < (select sponsor_updated_at from bots where id=b.id)));
  insert into rank_events(bot_id,order_id,old_rank,new_rank,old_amount,new_amount) values (b.id,o.id,coalesce(old_rank,new_rank),new_rank,coalesce(previous_total,0),o.amount);
  return jsonb_build_object('status','paid','order_id',o.public_id,'bot_id',b.id,'rank',new_rank);
end; $$;
revoke all on function public.confirm_paid_order(text,text) from public;
grant execute on function public.confirm_paid_order(text,text) to service_role;
