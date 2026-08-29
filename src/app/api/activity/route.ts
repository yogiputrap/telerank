import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '../../../lib/supabase/server';
import { INITIAL_NOTIFICATIONS } from '../../../lib/mockData';

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit yang lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam yang lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari yang lalu`;
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ data: INITIAL_NOTIFICATIONS, source: 'local_fallback' });
  }
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('rank_events')
      .select('id,new_rank,old_rank,new_amount,created_at,bots(bot_name,telegram_username)')
      .order('created_at', { ascending: false })
      .limit(8);
    if (error) throw error;
    const notifications = (data ?? []).map((event: any) => ({
      id: event.id,
      bot_name: event.bots?.bot_name ?? '',
      telegram_username: event.bots?.telegram_username ?? '',
      old_rank: event.old_rank,
      new_rank: event.new_rank,
      amount_added: event.new_amount,
      timestamp: relativeTime(event.created_at),
    }));
    return NextResponse.json({ data: notifications });
  } catch (error) {
    console.error('GET /api/activity failed', error);
    return NextResponse.json({ error: 'BACKEND_UNAVAILABLE' }, { status: 503 });
  }
}
