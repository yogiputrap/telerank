import { ImageResponse } from 'next/og';

export const alt = 'TeleRank - Papan Peringkat & Showcase Bot Telegram Indonesia';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
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
        {/* Top Header Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {/* Logo & Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: '#3390ec',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(51,144,236,0.4)',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.69c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.28-.431z" />
              </svg>
            </div>
            <span style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-1px', color: '#ffffff' }}>
              TeleRank
            </span>
          </div>

          {/* Indo Tag */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(51,144,236,0.15)',
              border: '1px solid rgba(51,144,236,0.4)',
              padding: '8px 20px',
              borderRadius: '999px',
              color: '#5ea5e6',
              fontSize: '16px',
              fontWeight: 700,
            }}
          >
            🇮🇩 Telegram Bot Leaderboard #1 Indonesia
          </div>
        </div>

        {/* Center Main Copy */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '100%',
            gap: '14px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#fbbf24',
              fontSize: '18px',
              fontWeight: 800,
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            🏆 Outbid & Showcase Sistem Lelang Transparan
          </div>
          <div
            style={{
              fontSize: '50px',
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-1.5px',
              color: '#ffffff',
              maxWidth: '1000px',
            }}
          >
            Papan Peringkat & Showcase Bot Telegram Terlengkap di Indonesia
          </div>
          <div
            style={{
              fontSize: '22px',
              color: '#94a3b8',
              lineHeight: 1.4,
              maxWidth: '900px',
            }}
          >
            Temukan bot AI, downloader, anon chat, dan tools produktivitas terbaik. Promosikan bot kamu ke peringkat teratas lewat pembayaran QRIS otomatis!
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '17px', fontWeight: 600 }}>
            <span style={{ color: '#22c55e' }}>●</span> Peringkat Real-Time 24 Jam
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '17px', fontWeight: 600 }}>
            <span style={{ color: '#38bdf8' }}>●</span> Pembayaran QRIS Instan Detik Itu Juga
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '17px', fontWeight: 600 }}>
            <span style={{ color: '#fbbf24' }}>●</span> 100% Transparan & Terverifikasi
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
