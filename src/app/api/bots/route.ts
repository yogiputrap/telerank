import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '../../../lib/supabase/server';
import { INITIAL_BOTS } from '../../../lib/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search')?.trim() || '';
  if (search.length > 80 || /[(),]/.test(search)) return NextResponse.json({ error: 'VALIDATION_ERROR' }, { status: 400 });
  const limit = Math.min(Math.max(Number(searchParams.get('limit') || 20), 1), 100);
  const offset = Math.max(Number(searchParams.get('offset') || 0), 0);

  if (!isSupabaseConfigured()) {
    let filtered = [...INITIAL_BOTS].sort((a, b) => b.total_bid_amount - a.total_bid_amount);
    if (category && category !== 'ALL') {
      filtered = filtered.filter((b) => b.category === category);
    }
    if (search) {
      filtered = filtered.filter(
        (b) =>
          b.bot_name.toLowerCase().includes(search.toLowerCase()) ||
          b.telegram_username.toLowerCase().includes(search.toLowerCase()) ||
          b.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    const sliced = filtered.slice(offset, offset + limit).map((bot, index) => ({
      id: bot.id,
      rank: offset + index + 1,
      bot_name: bot.bot_name,
      telegram_username: bot.telegram_username,
      avatar_url: bot.avatar_url,
      description: bot.description,
      category: bot.category,
      custom_tagline: bot.custom_tagline,
      current_sponsor_amount: bot.total_bid_amount,
      total_bid_amount: bot.total_bid_amount,
      daily_clicks: bot.daily_clicks,
      is_verified: bot.is_verified,
      is_online: bot.is_online,
      created_at: bot.created_at,
    }));
    return NextResponse.json({ data: sliced, offset, limit, total: filtered.length, source: 'local_fallback' });
  }

  try {
    const supabase = getSupabaseAdmin();
    let query = supabase.from('public_leaderboard').select('*', { count: 'exact' }).range(offset, offset + limit - 1);
    if (category && category !== 'ALL') query = query.eq('category', category);
    if (search) query = query.or(`bot_name.ilike.%${search}%,telegram_username.ilike.%${search}%,description.ilike.%${search}%`);
    const { data, error, count } = await query;
    if (error) throw error;
    return NextResponse.json({ data: data ?? [], offset, limit, total: count ?? data?.length ?? 0 });
  } catch (error) {
    console.error('GET /api/bots failed', error);
    return NextResponse.json({ error: 'BACKEND_UNAVAILABLE' }, { status: 503 });
  }
}
