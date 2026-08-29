import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../../lib/supabase/server';
import { getClientKey, isRateLimited } from '../../../../lib/rate-limit';
import { getPaykitaOrder } from '../../../../lib/paykita';

function toOrderPayload(order: any) {
  return {
    public_id: order.public_id,
    status: order.status,
    amount: order.amount,
    pay_amount: order.pay_amount,
    qris: order.qris_string,
    checkout_url: order.checkout_url,
    expires_at: order.expires_at,
    paid_at: order.paid_at,
    telegram_username: order.telegram_username,
    bot_name: order.bots?.bot_name ?? order.draft_data?.bot_name ?? order.telegram_username,
    category: order.draft_data?.category ?? order.bots?.category ?? 'DOWNLOADER',
  };
}

export async function GET(request: Request, { params }: { params: Promise<{ publicId: string }> }) {
  if (isRateLimited(`order-status:${getClientKey(request)}`, 60, 60_000)) return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429 });
  const { publicId } = await params;
  if (!/^TR-[A-F0-9]{16}$/i.test(publicId)) return NextResponse.json({ error: 'ORDER_NOT_FOUND' }, { status: 404 });
  try {
    const supabase = getSupabaseAdmin();
    const { data: order, error } = await supabase
      .from('payment_orders')
      .select('public_id,status,amount,pay_amount,qris_string,checkout_url,expires_at,paid_at,provider_order_id,telegram_username,draft_data,bots(bot_name,category)')
      .eq('public_id', publicId)
      .maybeSingle();
    if (error) throw error;
    if (!order) return NextResponse.json({ error: 'ORDER_NOT_FOUND' }, { status: 404 });

    if (order.status === 'pending' && order.provider_order_id && new Date(order.expires_at) > new Date()) {
      try {
        const providerOrder = await getPaykitaOrder(order.provider_order_id);
        if (providerOrder.status === 'paid') {
          const { data: confirmed, error: rpcError } = await supabase.rpc('confirm_paid_order', { p_public_id: publicId, p_provider_payment_id: providerOrder.id });
          if (!rpcError && confirmed) {
            const { data: refreshed } = await supabase
              .from('payment_orders')
              .select('public_id,status,amount,pay_amount,qris_string,checkout_url,expires_at,paid_at,telegram_username,draft_data,bots(bot_name,category)')
              .eq('public_id', publicId)
              .maybeSingle();
            return NextResponse.json({ data: toOrderPayload(refreshed ?? order) });
          }
        }
      } catch (paykitaError) {
        console.error('GET /api/orders/[publicId] paykita fallback failed', paykitaError);
      }
    }

    return NextResponse.json({ data: toOrderPayload(order) });
  } catch (error) {
    console.error('GET /api/orders/[publicId] failed', error);
    return NextResponse.json({ error: 'BACKEND_UNAVAILABLE' }, { status: 503 });
  }
}
