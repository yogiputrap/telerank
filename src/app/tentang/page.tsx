import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { MgcTelegram, MgcShield, MgcFlash, MgcArrowRight, MgcCheckCircle, MgcIndoFlag } from '../../components/MingCuteIcons';

export const metadata: Metadata = {
  title: 'Tentang TeleRank - Showcase & Leaderboard Bot Telegram Indonesia',
  description:
    'TeleRank diciptakan untuk mempermudah penemuan ribuan bot Telegram karya developer Indonesia secara terbuka, transparan, dan adil.',
  alternates: {
    canonical: '/tentang',
  },
};

export default function TentangPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
      <Header />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Hero Card */}
        <div className="rounded-2xl bg-white border border-[#e4ecf2] p-6 sm:p-8 shadow-xs space-y-3">
          <span className="px-3 py-1 rounded-lg bg-[#eef5fc] text-[#3390ec] text-xs font-bold uppercase tracking-wider">
            Tentang TeleRank
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1c242b] tracking-tight flex items-center flex-wrap gap-2">
            <span>Etalase & Leaderboard Bot Telegram Terbesar di Indonesia</span>
            <MgcIndoFlag size={26} className="inline-block" />
          </h1>
          <p className="text-xs sm:text-sm text-[#707579] leading-relaxed">
            TeleRank diciptakan untuk memecahkan masalah penemuan (*discoverability*) ribuan bot Telegram karya developer Indonesia. Kami memberikan panggung terbuka, transparan, dan adil bagi setiap kreator untuk memamerkan inovasi mereka.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-5 rounded-2xl bg-white border border-[#e4ecf2] shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#eef5fc] text-[#3390ec] flex items-center justify-center">
              <MgcFlash size={20} />
            </div>
            <h3 className="font-bold text-sm text-[#1c242b]">Eksposur Instan</h3>
            <p className="text-xs text-[#707579] leading-relaxed">
              Bot kamu langsung muncul di hadapan ribuan pengguna aktif Telegram setiap hari tanpa menunggu proses review berminggu-minggu.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#e4ecf2] shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#eef5fc] text-[#3390ec] flex items-center justify-center">
              <MgcShield size={20} />
            </div>
            <h3 className="font-bold text-sm text-[#1c242b]">Lelang Sponsor Adil</h3>
            <p className="text-xs text-[#707579] leading-relaxed">
              Peringkat ditentukan secara matematis dan transparan oleh nominal sponsor. Siapapun bisa merebut posisi atas mulai dari +Rp1.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#e4ecf2] shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#eef5fc] text-[#3390ec] flex items-center justify-center">
              <MgcCheckCircle size={20} />
            </div>
            <h3 className="font-bold text-sm text-[#1c242b]">Integrasi QRIS Otomatis</h3>
            <p className="text-xs text-[#707579] leading-relaxed">
              Dukungan pembayaran QRIS instan dari semua bank dan e-wallet (BCA, Mandiri, GoPay, OVO, Dana, ShopeePay) 24 jam nonstop.
            </p>
          </div>
        </div>

        {/* Story & Vision */}
        <div className="rounded-2xl bg-white border border-[#e4ecf2] p-6 sm:p-8 shadow-xs space-y-4 text-xs sm:text-sm text-[#707579] leading-relaxed">
          <h2 className="text-lg font-bold text-[#1c242b]">Mengapa TeleRank?</h2>
          <p>
            Di Telegram, terdapat jutaan utilitas hebat: mulai dari bot downloader video, asisten AI skripsi, bot anon chat untuk cari teman, hingga bot top up game otomatis. Namun, mencari bot yang benar-benar aktif dan aman seringkali sulit karena minimnya katalog terkurasi di Indonesia.
          </p>
          <p>
            TeleRank hadir sebagai jembatan antara pembuat bot (*indie hackers & developers*) dengan pengguna yang membutuhkan solusi cepat. Dengan sistem lelang sponsor (*outbid*), bot dengan dukungan komunitas terkuat akan mendapatkan visibilitas tertinggi.
          </p>
        </div>

        {/* CTA Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#3390ec] to-[#2481cc] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-extrabold">Punya Bot Telegram Keren?</h3>
            <p className="text-xs text-blue-100">Daftarkan sekarang dan rebut posisi #1 di TeleRank!</p>
          </div>
          <Link
            href="/new"
            className="px-5 py-2.5 rounded-xl bg-white text-[#3390ec] font-bold text-xs hover:bg-blue-50 active:scale-95 transition-all shadow-xs shrink-0 flex items-center gap-1.5"
          >
            <span>Pasang Bot Kamu</span>
            <MgcArrowRight size={14} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
