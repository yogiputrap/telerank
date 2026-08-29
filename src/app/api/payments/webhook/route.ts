import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { getSupabaseAdmin } from '../../../../lib/supabase/server';
import { getPaykitaOrder, verifyPaykitaSignature } from '../../../../lib/paykita';

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-paykita-signature');
  const timestamp = request.headers.get('x-paykita-timestamp');

  if (!verifyPaykitaSignature(rawBody, timestamp, signature)) {
    return NextResponse.json({ error: 'INVALID_SIGNATURE' }, { status: 401 });
  }

  let payload: { id: string; event: string; data: Record<string, unknown> };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'INVALID_PAYLOAD' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const payloadHash = createHash('sha256').update(rawBody).digest('hex');

  const { error: insertError } = await supabase.from('webhook_events').insert({
    provider: 'paykita',
    provider_event_id: payload.id,
    payload_hash: payloadHash,
    status: 'received',
  });
  if (insertError) {
    if (insertError.code === '23505') return NextResponse.json({ ok: true, duplicate: true });
    console.error('POST /api/payments/webhook failed to record event', insertError);
    return NextResponse.json({ error: 'BACKEND_UNAVAILABLE' }, { status: 503 });
  }

  try {
    if (payload.event === 'order.paid') {
      const data = payload.data as { order_id: string; reference: string };
      const providerOrder = await getPaykitaOrder(data.order_id);
      if (providerOrder.status === 'paid') {
        const { error: rpcError } = await supabase.rpc('confirm_paid_order', { p_public_id: data.reference, p_provider_payment_id: data.order_id });
        if (rpcError) throw rpcError;
      }
    }
    await supabase.from('webhook_events').update({ status: 'processed' }).eq('provider', 'paykita').eq('provider_event_id', payload.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('POST /api/payments/webhook processing failed', error);
    await supabase.from('webhook_events').update({ status: 'error', error_message: String(error) }).eq('provider', 'paykita').eq('provider_event_id', payload.id);
    return NextResponse.json({ error: 'WEBHOOK_PROCESSING_FAILED' }, { status: 500 });
  }
}
