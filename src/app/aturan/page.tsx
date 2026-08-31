'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { MgcArrowRight, MgcCheckCircle, MgcClose } from '../../components/MingCuteIcons';

export default function AturanPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
      <Header />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="rounded-2xl bg-white border border-[#e4ecf2] p-6 sm:p-8 shadow-xs space-y-3">
          <span className="px-3 py-1 rounded-lg bg-[#eef5fc] text-[#3390ec] text-xs font-bold uppercase tracking-wider">
            Panduan & Aturan Main
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1c242b] tracking-tight">
            Cara Kerja & Aturan Lelang Sponsor TeleRank
          </h1>
          <p className="text-xs sm:text-sm text-[#707579] leading-relaxed">
            Pelajari bagaimana algoritma peringkat TeleRank bekerja secara transparan, cara merebut posisi teratas, dan ketentuan kelayakan bot.
          </p>
        </div>

        {/* Steps Card */}
        <div className="rounded-2xl bg-white border border-[#e4ecf2] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-[#3390ec] text-white font-black text-sm flex items-center justify-center shrink-0">
              1
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[#1c242b]">Pendaftaran Bot Mulai Rp1.000</h3>
              <p className="text-xs text-[#707579] leading-relaxed">
                Masukkan username bot Telegram kamu (`@NamaBot`). Tentukan kategori yang sesuai dan masukkan nominal sponsor awal. Bot kamu akan langsung aktif di leaderboard setelah pembayaran QRIS terkonfirmasi otomatis.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-[#3390ec] text-white font-black text-sm flex items-center justify-center shrink-0">
              2
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[#1c242b]">Penentuan Ranking Berdasarkan Total Sponsor</h3>
              <p className="text-xs text-[#707579] leading-relaxed">
                Peringkat #1 ditempati oleh bot dengan akumulasi sponsor tertinggi. Semakin tinggi sponsor yang kamu pasang, semakin atas posisi bot kamu di etalase utama.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-[#3390ec] text-white font-black text-sm flex items-center justify-center shrink-0">
              3
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[#1c242b]">Sistem Rebut Posisi Presisi +Rp1</h3>
              <p className="text-xs text-[#707579] leading-relaxed">
                Jika ingin merebut posisi bot lain, kamu hanya perlu membayar minimal **+Rp1 lebih tinggi** dari nominal sponsor bot tersebut saat ini. Bot kamu akan seketika naik peringkat dan menggeser bot di bawahnya.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-[#3390ec] text-white font-black text-sm flex items-center justify-center shrink-0">
              4
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[#1c242b]">Review Zone & Broadcast Komunitas</h3>
              <p className="text-xs text-[#707579] leading-relaxed">
                Setiap akhir periode hitung mundur (*Review Zone Countdown*), Top 3 Bot pemuncak klasemen akan dipromosikan secara khusus ke channel resmi Telegram `@telerank_id` dengan jangkauan puluhan ribu member.
              </p>
            </div>
          </div>
        </div>

        {/* Content Guidelines */}
        <div className="rounded-2xl bg-white border border-[#e4ecf2] p-6 sm:p-8 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-[#1c242b]">Bot yang Dilarang di TeleRank</h2>
          <ul className="space-y-2 text-xs text-[#707579]">
            <li className="flex items-center gap-2">
              <MgcClose size={14} className="text-rose-500 shrink-0" />
              <span>Bot phishing, pencuri akun Telegram, atau scam investasi bodong.</span>
            </li>
            <li className="flex items-center gap-2">
              <MgcClose size={14} className="text-rose-500 shrink-0" />
              <span>Bot bermuatan judi online ilegal atau promosi situs terlarang.</span>
            </li>
            <li className="flex items-center gap-2">
              <MgcClose size={14} className="text-rose-500 shrink-0" />
              <span>Bot penyebar malware, trojan, atau link eksploitasi berbahaya.</span>
            </li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
