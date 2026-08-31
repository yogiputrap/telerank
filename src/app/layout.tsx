import './globals.css';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { FloatingFeedbackSupport } from '../components/FloatingFeedbackSupport';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://telerank.com';

export const viewport: Viewport = {
  themeColor: '#3390ec',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'TeleRank - Papan Peringkat & Showcase Bot Telegram Indonesia',
    template: '%s | TeleRank',
  },
  description:
    'Direktori dan papan peringkat bot Telegram nomor 1 di Indonesia. Temukan bot AI, video downloader TikTok/YouTube, anon chat, dan mini tools terbaik. Promosikan bot kamu ke peringkat teratas dengan sistem lelang sponsor outbid transparan via QRIS otomatis.',
  keywords: [
    'bot telegram indonesia',
    'telerank',
    'peringkat bot telegram',
    'direktori bot telegram',
    'showcase bot telegram',
    'bot downloader tiktok telegram',
    'bot ai telegram indonesia',
    'bot anon chat telegram',
    'outbid bot telegram',
    'lelang sponsor telegram',
    'promosi bot telegram',
    'qris bot telegram',
    'daftar bot telegram terbaik',
  ],
  authors: [{ name: 'TeleRank', url: siteUrl }],
  creator: 'TeleRank',
  publisher: 'TeleRank',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: siteUrl,
    siteName: 'TeleRank',
    title: 'TeleRank - Papan Peringkat & Showcase Bot Telegram Indonesia',
    description:
      'Temukan dan promosikan bot Telegram terbaik se-Indonesia. Sistem lelang peringkat (outbid) transparan dengan pembayaran QRIS instan.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TeleRank - Papan Peringkat & Showcase Bot Telegram Indonesia',
    description:
      'Temukan dan promosikan bot Telegram terbaik se-Indonesia. Sistem lelang peringkat (outbid) transparan dengan pembayaran QRIS instan.',
    creator: '@telerank',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'technology',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'TeleRank',
      url: siteUrl,
      logo: `${siteUrl}/apple-icon`,
      description: 'Papan peringkat dan showcase direktori bot Telegram nomor 1 di Indonesia.',
      sameAs: ['https://t.me/telerank'],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'TeleRank',
      description: 'Papan peringkat & showcase bot Telegram Indonesia.',
      publisher: { '@id': `${siteUrl}/#organization` },
      inLanguage: 'id-ID',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        {/* Preconnect to external image & analytics CDN for fastest LCP */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://api.dicebear.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.dicebear.com" />
        <link rel="preconnect" href="https://cloud.umami.is" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cloud.umami.is" />

        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="8a719dbd-baf0-420b-aa86-567281849fd3"
          strategy="afterInteractive"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#f0f2f5] text-[#1c242b] antialiased selection:bg-[#3390ec] selection:text-white">
        {children}
        {/* Global Floating Action Button for Feedback & Help */}
        <FloatingFeedbackSupport />
      </body>
    </html>
  );
}
