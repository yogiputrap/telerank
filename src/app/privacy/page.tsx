'use client';

import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
      <Header />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="rounded-2xl bg-white border border-[#e4ecf2] p-6 sm:p-8 shadow-xs space-y-3">
          <span className="px-3 py-1 rounded-lg bg-[#eef5fc] text-[#3390ec] text-xs font-bold uppercase tracking-wider">
            Privasi
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1c242b] tracking-tight">
            Kebijakan Privasi (Privacy Policy)
          </h1>
          <p className="text-xs text-[#707579]">
            Terakhir diperbarui: 27 Agustus 2026
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-[#e4ecf2] p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm text-[#707579] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1c242b]">1. Informasi yang Kami Kumpulkan</h2>
            <p>
              Kami hanya mengumpulkan data yang diperlukan untuk operasional direktori:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Username bot Telegram (`@NamaBot`) dan tautan publik bot.</li>
              <li>Nama bot, deskripsi singkat, dan kategori yang dipilih.</li>
              <li>Data agregat jumlah klik dan lalu lintas pengunjung.</li>
              <li>Riwayat transaksi pembayaran sponsor (ID Order, nominal, waktu transaksi).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1c242b]">2. Penggunaan Informasi</h2>
            <p>
              Data yang dikumpulkan digunakan untuk:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Menampilkan peringkat bot secara transparan di leaderboard.</li>
              <li>Memverifikasi dan memproses transaksi QRIS secara otomatis.</li>
              <li>Mencegah aktivitas bot spam dan penyalahgunaan platform.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1c242b]">3. Keamanan Data Transaksi</h2>
            <p>
              TeleRank.id tidak menyimpan data kartu kredit atau kredensial perbankan pengguna. Seluruh pemrosesan pembayaran dilakukan melalui gateway QRIS berstandar Bank Indonesia dengan enkripsi SSL 256-bit.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1c242b]">4. Kontak Kami</h2>
            <p>
              Jika Anda memiliki pertanyaan mengenai kebijakan privasi ini atau ingin mengajukan penghapusan data bot, silakan hubungi tim kami melalui Telegram di <strong>@telerank_id</strong>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
