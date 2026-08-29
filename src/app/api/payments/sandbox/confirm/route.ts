import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../../../lib/supabase/server';
import { isPaykitaConfigured } from '../../../../../lib/paykita';
import { getClientKey, isRateLimited, jsonTooLarge } from '../../../../../lib/rate-limit';

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'NOT_AVAILABLE' }, { status: 404 });
  }
  if (jsonTooLarge(request)) return NextResponse.json({ error: 'PAYLOAD_TOO_LARGE' }, { status: 413 });
  if (isRateLimited(`sandbox-confirm:${getClientKey(request)}`, 20, 60_000)) return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429 });
  try {
    const body = await request.json();
    const publicId = String(body.orderId || '').trim();
    if (!/^TR-[A-F0-9]{16}$/i.test(publicId)) return NextResponse.json({ error: 'VALIDATION_ERROR' }, { status: 400 });
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.rpc('confirm_paid_order', { p_public_id: publicId, p_provider_payment_id: `sandbox-manual-${publicId}` });
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error) {
    console.error('POST /api/payments/sandbox/confirm failed', error);
    return NextResponse.json({ error: 'PAYMENT_CONFIRMATION_FAILED' }, { status: 422 });
  }
}
