import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TeleRank - Papan Peringkat Bot Telegram Indonesia',
    short_name: 'TeleRank',
    description: 'Papan peringkat, direktori showcase, dan sistem promosi lelang outbid bot Telegram terbaik di Indonesia.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f0f2f5',
    theme_color: '#3390ec',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
