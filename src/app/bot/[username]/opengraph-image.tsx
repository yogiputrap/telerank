import { ImageResponse } from 'next/og';
import { INITIAL_BOTS } from '../../../lib/mockData';
import { getSupabaseAdmin, isSupabaseConfigured } from '../../../lib/supabase/server';
import { CATEGORY_LABELS } from '../../../types';

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const cleanUsername = decodeURIComponent(username).toLowerCase().replace(/^@/, '');

  let botName = cleanUsername;
  let category = 'TOOLS';
  let description = `Profil & statistik resmi bot Telegram @${cleanUsername} di TeleRank.`;
  let avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`;
  let totalBid = 1000;
  let rank = 1;

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      const { data } = await supabase.from('public_leaderboard').select('*').limit(100);
      if (data && data.length > 0) {
        const found = data.find((b) => b.telegram_username.toLowerCase() === cleanUsername);
        if (found) {
          botName = found.bot_name;
          category = found.category;
          description = found.description || description;
          avatarUrl = found.avatar_url || avatarUrl;
          totalBid = found.total_bid_amount;
          rank = data.findIndex((b) => b.id === found.id) + 1;
        }
      }
    } catch {
      const found = INITIAL_BOTS.find((b) => b.telegram_username.toLowerCase() === cleanUsername);
      if (found) {
        botName = found.bot_name;
        category = found.category;
        description = found.description || description;
        avatarUrl = found.avatar_url || avatarUrl;
        totalBid = found.total_bid_amount;
        rank = INITIAL_BOTS.findIndex((b) => b.id === found.id) + 1;
      }
    }
  } else {
    const found = INITIAL_BOTS.find((b) => b.telegram_username.toLowerCase() === cleanUsername);
    if (found) {
      botName = found.bot_name;
      category = found.category;
      description = found.description || description;
      avatarUrl = found.avatar_url || avatarUrl;
      totalBid = found.total_bid_amount;
      rank = INITIAL_BOTS.findIndex((b) => b.id === found.id) + 1;
    }
  }

  const categoryLabel = (CATEGORY_LABELS as Record<string, string>)[category] || category;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0d1624 0%, #162438 50%, #0d1624 100%)',
          padding: '50px 70px',
          fontFamily: 'sans-serif',
          color: 'white',
        }}
      >
        {/* Top Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: '#3390ec',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.69c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.28-.431z" />
              </svg>
            </div>
            <span style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff' }}>TeleRank</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(51,144,236,0.2)',
              border: '1px solid rgba(51,144,236,0.4)',
              padding: '8px 18px',
              borderRadius: '999px',
              color: '#5ea5e6',
              fontSize: '16px',
              fontWeight: 700,
            }}
          >
            {categoryLabel}
          </div>
        </div>

        {/* Center: Bot Profile Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            width: '100%',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '28px',
            padding: '36px 40px',
          }}
        >
          {/* Avatar */}
          <img
            src={avatarUrl}
            alt={botName}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '24px',
              objectFit: 'cover',
              border: '3px solid rgba(51,144,236,0.5)',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '36px', fontWeight: 900, color: '#ffffff', lineHeight: 1.2 }}>
                {botName}
              </span>
              <span
                style={{
                  background: '#3390ec',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 900,
                  padding: '4px 12px',
                  borderRadius: '10px',
                }}
              >
                #{rank}
              </span>
            </div>

            <span style={{ fontSize: '20px', color: '#38bdf8', fontWeight: 700 }}>
              @{cleanUsername}
            </span>

            <span
              style={{
                fontSize: '16px',
                color: '#94a3b8',
                lineHeight: 1.35,
                maxHeight: '44px',
                overflow: 'hidden',
              }}
            >
              {description}
            </span>
          </div>
        </div>

        {/* Bottom Bar: Stats & CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                Total Sponsor
              </span>
              <span style={{ fontSize: '22px', fontWeight: 900, color: '#fbbf24' }}>
                Rp{totalBid.toLocaleString('id-ID')}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                Status
              </span>
              <span style={{ fontSize: '22px', fontWeight: 900, color: '#4ade80' }}>
                Aktif 24 Jam
              </span>
            </div>
          </div>

          <div
            style={{
              background: '#3390ec',
              color: '#ffffff',
              padding: '12px 28px',
              borderRadius: '16px',
              fontSize: '18px',
              fontWeight: 800,
            }}
          >
            Lihat & Rebut di TeleRank →
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
