import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '../../../../lib/supabase/server';
import { getClientKey, isRateLimited, jsonTooLarge } from '../../../../lib/rate-limit';

export async function POST(request: Request) {
  if (jsonTooLarge(request, 2048)) return NextResponse.json({ error: 'PAYLOAD_TOO_LARGE' }, { status: 413 });
  if (isRateLimited(`click:${getClientKey(request)}`, 60, 60_000)) return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429 });
  try {
    const body = await request.json();
    const botId = String(body.botId || '');
    const kind = body.kind === 'outbound' ? 'outbound' : body.kind === 'detail' ? 'detail' : '';
    if (!kind) return NextResponse.json({ error: 'VALIDATION_ERROR' }, { status: 400 });

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ ok: true, source: 'local_fallback' });
    }

    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(botId)) {
      return NextResponse.json({ error: 'VALIDATION_ERROR' }, { status: 400 });
    }

    const { error } = await getSupabaseAdmin().rpc('increment_bot_click', { p_bot_id: botId, p_kind: kind });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('POST /api/bots/click failed', error);
    return NextResponse.json({ error: 'BACKEND_UNAVAILABLE' }, { status: 503 });
  }
}
