import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '../../../lib/supabase/server';
import { getClientKey } from '../../../lib/rate-limit';
import { touchPresence } from '../../../lib/presence';
import { INITIAL_BOTS } from '../../../lib/mockData';

export async function GET(request: Request) {
  const clientKey = getClientKey(request);
  const presence = touchPresence(clientKey);

  if (!isSupabaseConfigured()) {
    const totalBots = INITIAL_BOTS.length;
    const dailyClicks = INITIAL_BOTS.reduce((sum, b) => sum + (b.daily_clicks || 0), 0);
    const sponsorVolume = INITIAL_BOTS.reduce((sum, b) => sum + (b.total_bid_amount || 0), 0);
    const categories = INITIAL_BOTS.reduce<Record<string, number>>((acc, b) => {
      acc[b.category] = (acc[b.category] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      data: {
        totalBots,
        dailyClicks,
        sponsorVolume,
        categories,
        onlineCount: presence.onlineCount,
        visitorCount: presence.visitorCount + dailyClicks,
        source: 'local_fallback',
      },
    });
  }

  try {
    const supabase = getSupabaseAdmin();
    const [{ count: totalBots }, { data: bots }] = await Promise.all([
      supabase.from('bots').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('bots').select('category,current_sponsor_amount').eq('status', 'active'),
    ]);
    const { data: stats } = await supabase.from('bot_daily_stats').select('detail_clicks,outbound_clicks');
    const totalClicks = (stats ?? []).reduce((sum, row) => sum + row.detail_clicks + row.outbound_clicks, 0);

    return NextResponse.json({
      data: {
        totalBots: totalBots ?? 0,
        dailyClicks: totalClicks,
        sponsorVolume: (bots ?? []).reduce((sum, bot) => sum + Number(bot.current_sponsor_amount), 0),
        categories: (bots ?? []).reduce<Record<string, number>>((result, bot) => {
          result[bot.category] = (result[bot.category] ?? 0) + 1;
          return result;
        }, {}),
        onlineCount: presence.onlineCount,
        visitorCount: presence.visitorCount + totalClicks,
      },
    });
  } catch (error) {
    console.error('GET /api/stats failed', error);
    return NextResponse.json({ error: 'BACKEND_UNAVAILABLE' }, { status: 503 });
  }
}
