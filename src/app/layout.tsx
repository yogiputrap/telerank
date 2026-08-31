import './globals.css';
import type { Metadata } from 'next';
import { FloatingFeedbackSupport } from '../components/FloatingFeedbackSupport';

export const metadata: Metadata = {
  title: 'TeleRank - Papan Peringkat & Showcase Bot Telegram Indonesia',
  description: 'Temukan dan promosikan bot Telegram terbaik se-Indonesia. Sistem lelang peringkat (outbid) transparan dengan pembayaran QRIS instan.',
  keywords: 'bot telegram indonesia, telerank, pamerin bot, outbid telegram, bot downloader tiktok, bot ai telegram',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="8a719dbd-baf0-420b-aa86-567281849fd3"
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
