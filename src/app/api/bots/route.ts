import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '../../../lib/supabase/server';
import { INITIAL_BOTS } from '../../../lib/mockData';
import { sanitizeSearchQuery } from '../../../lib/sanitize';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const rawSearch = searchParams.get('search') || '';
  const search = sanitizeSearchQuery(rawSearch);
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
      sponsor_updated_at: bot.sponsor_updated_at,
    })).map((bot) => ({
      ...bot,
      avatar_url: !bot.avatar_url || bot.avatar_url.includes('telesco.pe') ? `/api/avatar/${bot.telegram_username}` : bot.avatar_url,
    }));
    return NextResponse.json({ data: sliced, offset, limit, total: filtered.length, source: 'local_fallback' });
  }

  try {
    const supabase = getSupabaseAdmin();
    let query = supabase
      .from('public_leaderboard')
      .select('rank,id,telegram_username,bot_name,avatar_url,description,category,custom_tagline,contact_handle,total_bid_amount,is_verified,is_online,created_at,daily_clicks', { count: 'exact' })
      .range(offset, offset + limit - 1);
    if (category && category !== 'ALL') query = query.eq('category', category);
    if (search) query = query.or(`bot_name.ilike.%${search}%,telegram_username.ilike.%${search}%,description.ilike.%${search}%`);
    const { data, error, count } = await query;
    if (error) throw error;

    const botList = data ?? [];
    const botIds = botList.map((b) => b.id).filter(Boolean);

    if (botIds.length > 0) {
      const { data: allStats } = await supabase
        .from('bot_daily_stats')
        .select('bot_id,detail_clicks,outbound_clicks')
        .in('bot_id', botIds);

      if (allStats && allStats.length > 0) {
        const clicksMap = new Map<string, number>();
        for (const row of allStats) {
          const prev = clicksMap.get(row.bot_id) || 0;
          clicksMap.set(
            row.bot_id,
            prev + (Number(row.detail_clicks) || 0) + (Number(row.outbound_clicks) || 0)
          );
        }
        for (const bot of botList) {
          if (clicksMap.has(bot.id)) {
            bot.daily_clicks = clicksMap.get(bot.id) ?? 0;
          }
        }
      }
    }

    for (const bot of botList) {
      if (!bot.avatar_url || bot.avatar_url.includes('telesco.pe')) {
        bot.avatar_url = `/api/avatar/${bot.telegram_username}`;
      }
    }

    return NextResponse.json({ data: botList, offset, limit, total: count ?? botList.length });
  } catch (error) {
    console.error('GET /api/bots failed', error);
    return NextResponse.json({ error: 'BACKEND_UNAVAILABLE' }, { status: 503 });
  }
}
