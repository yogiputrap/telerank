import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '../../../lib/supabase/server';
import { getClientKey, isRateLimited, jsonTooLarge } from '../../../lib/rate-limit';

export async function POST(request: Request) {
  if (jsonTooLarge(request)) return NextResponse.json({ error: 'PAYLOAD_TOO_LARGE' }, { status: 413 });
  if (isRateLimited(`feedback:${getClientKey(request)}`, 5, 10 * 60_000)) return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429 });
  try {
    const body = await request.json();
    const message = String(body.message || '').trim();
    const type = String(body.feedbackType || 'SARAN');
    const handle = String(body.telegramHandle || '').trim() || null;
    if (!message || message.length > 4000 || !['SARAN', 'BUG', 'LAINNYA'].includes(type) || (handle && handle.length > 64)) return NextResponse.json({ error: 'VALIDATION_ERROR' }, { status: 400 });

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ ok: true, source: 'local_fallback' }, { status: 201 });
    }

    const { error } = await getSupabaseAdmin().from('feedback').insert({ feedback_type: type, telegram_handle: handle, message });
    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error('POST /api/feedback failed', error);
    return NextResponse.json({ error: 'BACKEND_UNAVAILABLE' }, { status: 503 });
  }
}
