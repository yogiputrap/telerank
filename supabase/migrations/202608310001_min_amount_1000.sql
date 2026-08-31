-- Migration: Update minimum amount checks to Rp 1.000
alter table public.payment_orders drop constraint if exists payment_orders_amount_check;
alter table public.payment_orders add constraint payment_orders_amount_check check (amount >= 1000);

alter table public.sponsor_events drop constraint if exists sponsor_events_new_total_check;
alter table public.sponsor_events add constraint sponsor_events_new_total_check check (new_total >= 1000);

alter table public.sponsor_events drop constraint if exists sponsor_events_paid_amount_check;
alter table public.sponsor_events add constraint sponsor_events_paid_amount_check check (paid_amount >= 1000);
