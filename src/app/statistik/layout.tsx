import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Statistik & Trafik Live TeleRank',
  description:
    'Data metrik pengunjung, pageviews, dan aktivitas trafik publik TeleRank secara terbuka dan real-time.',
  alternates: {
    canonical: '/statistik',
  },
};

export default function StatistikLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
