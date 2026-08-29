alter table public.payment_orders
  add column if not exists provider_order_id text,
  add column if not exists pay_amount bigint,
  add column if not exists checkout_url text,
  add column if not exists qris_string text;

create unique index if not exists orders_provider_order_id_idx on public.payment_orders (provider_order_id) where provider_order_id is not null;
