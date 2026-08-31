import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Daftarkan & Promosikan Bot Telegram',
  description:
    'Daftarkan bot Telegram kamu ke TeleRank untuk langsung menempati papan peringkat dan mendapatkan ribuan pengguna aktif baru setiap hari.',
  alternates: {
    canonical: '/new',
  },
};

export default function NewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
