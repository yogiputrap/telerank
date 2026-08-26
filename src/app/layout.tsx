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
      <body className="min-h-screen bg-[#f0f2f5] text-[#1c242b] antialiased selection:bg-[#3390ec] selection:text-white">
        {children}
        {/* Global Floating Action Button for Feedback & Help */}
        <FloatingFeedbackSupport />
      </body>
    </html>
  );
}
