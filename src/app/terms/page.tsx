'use client';

import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
      <Header />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="rounded-2xl bg-white border border-[#e4ecf2] p-6 sm:p-8 shadow-xs space-y-3">
          <span className="px-3 py-1 rounded-lg bg-[#eef5fc] text-[#3390ec] text-xs font-bold uppercase tracking-wider">
            Legal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1c242b] tracking-tight">
            Syarat & Ketentuan Layanan (Terms of Service)
          </h1>
          <p className="text-xs text-[#707579]">
            Terakhir diperbarui: 27 Agustus 2026
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-[#e4ecf2] p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm text-[#707579] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1c242b]">1. Penerimaan Ketentuan</h2>
            <p>
              Dengan mengakses dan menggunakan situs web TeleRank.id serta melakukan pendaftaran bot atau pembayaran sponsor, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh Syarat & Ketentuan ini.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1c242b]">2. Layanan Listing & Sponsorship</h2>
            <p>
              TeleRank.id menyediakan platform leaderboard publik untuk menampilkan tautan bot Telegram. Peringkat tampilan ditentukan oleh besaran akumulasi nominal sponsor yang disetorkan pengguna melalui gateway pembayaran resmi.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1c242b]">3. Kebijakan Pembayaran & Pengembalian Dana (Refund)</h2>
            <p>
              Seluruh pembayaran sponsor yang dilakukan untuk penempatan ranking atau outbid bersifat **final dan non-refundable (tidak dapat dikembalikan)** setelah transaksi QRIS terkonfirmasi berhasil di sistem.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1c242b]">4. Tanggung Jawab Konten Bot</h2>
            <p>
              Pemilik dan pengelola bot bertanggung jawab penuh atas segala konten, transaksi, dan layanan yang disediakan di dalam bot Telegram masing-masing. TeleRank.id tidak bertanggung jawab atas kerugian materiil maupun immateriil yang timbul akibat interaksi antara pengguna dengan bot pihak ketiga.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1c242b]">5. Hak Moderasi & Penghapusan Listing</h2>
            <p>
              TeleRank.id berhak menghapus atau menonaktifkan listing bot tanpa pemberitahuan sebelumnya apabila bot tersebut terbukti melanggar hukum, melakukan penipuan, menyebarkan malware, atau melanggar kebijakan konten kami.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
