'use client';

import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { MgcExternalLink, MgcCheckCircle, MgcLoading } from '../../components/MingCuteIcons';

export default function StatistikPage() {
  const [isLoading, setIsLoading] = useState(true);
  const umamiShareUrl = 'https://cloud.umami.is/share/6U05PReYqXSbTa3k';

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Header Title Card */}
        <div className="rounded-2xl bg-white border border-[#e4ecf2] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#eef5fc] text-[#3390ec] text-xs font-bold uppercase tracking-wider">
                <MgcCheckCircle size={13} />
                Live Public Analytics
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-[#707579] bg-[#f4f7fa] px-2 py-0.5 rounded-md font-semibold">
                Powered by Umami
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1c242b] tracking-tight">
              Statistik Trafik & Pengunjung TeleRank
            </h1>
            <p className="text-xs sm:text-sm text-[#707579] leading-relaxed">
              Data analitik pengunjung, pageviews, dan performa trafik website TeleRank disajikan secara terbuka & transparan secara real-time.
            </p>
          </div>

          <div className="shrink-0">
            <a
              href={umamiShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#3390ec] hover:bg-[#2481cc] active:scale-98 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <span>Buka di Tab Baru</span>
              <MgcExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Embedded Umami Dashboard */}
        <div className="relative rounded-2xl bg-white border border-[#e4ecf2] shadow-xs overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-xs z-10 flex flex-col items-center justify-center gap-3 py-24 min-h-[500px]">
              <MgcLoading size={32} className="text-[#3390ec]" />
              <p className="text-xs text-[#707579] font-medium">Memuat data analitik live Umami...</p>
            </div>
          )}

          <iframe
            src={umamiShareUrl}
            onLoad={() => setIsLoading(false)}
            className="w-full min-h-[950px] border-0 rounded-2xl"
            title="TeleRank Live Analytics Umami"
            allowFullScreen
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
