'use client';

import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export default function StatistikPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
      <Header />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="rounded-3xl bg-white border border-[#e4ecf2] p-6 sm:p-8 shadow-xs space-y-3">
          <span className="px-3 py-1 rounded-full bg-[#eef5fc] text-[#3390ec] text-xs font-bold uppercase tracking-wider">
            Live Metrics
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1c242b] tracking-tight">
            Statistik Ekosistem Bot TeleRank
          </h1>
          <p className="text-xs sm:text-sm text-[#707579] leading-relaxed">
            Data metrik performa publik, klik harian, dan distribusi kategori bot Telegram di Indonesia.
          </p>
        </div>

        {/* 4 Big Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-2xl bg-white border border-[#e4ecf2] shadow-2xs space-y-1">
            <span className="text-[10px] text-[#707579] font-bold uppercase">Total Bot Aktif</span>
            <span className="block text-2xl font-black text-[#1c242b] font-mono">84</span>
            <span className="text-[10px] text-emerald-600 font-semibold">+12 minggu ini</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#e4ecf2] shadow-2xs space-y-1">
            <span className="text-[10px] text-[#707579] font-bold uppercase">Total Klik Harian</span>
            <span className="block text-2xl font-black text-[#3390ec] font-mono">14.820</span>
            <span className="text-[10px] text-[#3390ec] font-semibold">Trafik organik</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#e4ecf2] shadow-2xs space-y-1">
            <span className="text-[10px] text-[#707579] font-bold uppercase">Volume Sponsor</span>
            <span className="block text-xl sm:text-2xl font-black text-[#1c242b] font-mono">Rp4.8M</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Transparan QRIS</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#e4ecf2] shadow-2xs space-y-1">
            <span className="text-[10px] text-[#707579] font-bold uppercase">Uptime Server</span>
            <span className="block text-2xl font-black text-emerald-600 font-mono">99.9%</span>
            <span className="text-[10px] text-[#707579] font-semibold">24 Jam Nonstop</span>
          </div>
        </div>

        {/* Category Breakdown (100% Identical Category Names) */}
        <div className="rounded-3xl bg-white border border-[#e4ecf2] p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#1c242b]">Distribusi Kategori Bot Paling Populer</h2>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold text-[#1c242b] mb-1">
                <span>Downloader</span>
                <span className="font-mono text-[#3390ec]">38% (32 bots)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#f0f2f5] overflow-hidden">
                <div className="h-full bg-[#3390ec] rounded-full" style={{ width: '38%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-[#1c242b] mb-1">
                <span>AI Copilot</span>
                <span className="font-mono text-[#3390ec]">27% (23 bots)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#f0f2f5] overflow-hidden">
                <div className="h-full bg-[#5ea5e6] rounded-full" style={{ width: '27%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-[#1c242b] mb-1">
                <span>Developer & Tools</span>
                <span className="font-mono text-[#3390ec]">18% (15 bots)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#f0f2f5] overflow-hidden">
                <div className="h-full bg-[#20a39e] rounded-full" style={{ width: '18%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-[#1c242b] mb-1">
                <span>Anon Chat</span>
                <span className="font-mono text-[#3390ec]">11% (9 bots)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#f0f2f5] overflow-hidden">
                <div className="h-full bg-[#facc15] rounded-full" style={{ width: '11%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-[#1c242b] mb-1">
                <span>Mini Apps</span>
                <span className="font-mono text-[#3390ec]">6% (5 bots)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#f0f2f5] overflow-hidden">
                <div className="h-full bg-[#a2d2ff] rounded-full" style={{ width: '6%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-[#1c242b] mb-1">
                <span>Store & Topup</span>
                <span className="font-mono text-[#3390ec]">4% (3 bots)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#f0f2f5] overflow-hidden">
                <div className="h-full bg-[#ffd166] rounded-full" style={{ width: '4%' }} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
