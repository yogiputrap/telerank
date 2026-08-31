'use client';

import React from 'react';
import { Send, QrCode, TrendingUp } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <div className="w-full my-16 py-10" id="carakerja">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="px-3.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold uppercase tracking-wider">
          Cara Kerja Sederhana
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
          Tampil di Posisi Puncak dalam 3 Langkah
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Tanpa registrasi akun yang rumit. Pasang username bot, bayar via QRIS otomatis, dan bot Anda langsung tampil di peringkat atas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1 */}
        <div className="rounded-2xl p-6 bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-black text-lg shadow-xs">
            1
          </div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Input Username Bot</span>
            <Send className="w-4 h-4 text-teal-600" />
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Cukup masukkan username @bot Anda. Sistem kami memvalidasi foto profil dan bio resmi langsung dari Telegram API.
          </p>
        </div>

        {/* Step 2 */}
        <div className="rounded-2xl p-6 bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-black text-lg shadow-xs">
            2
          </div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Scan QRIS Instan</span>
            <QrCode className="w-4 h-4 text-amber-600" />
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Pilih nominal bid sponsor Anda dan scan QRIS via BCA, Mandiri, GoPay, OVO, Dana, atau ShopeePay via <span className="text-teal-600 font-semibold">pay.digikita.id</span>.
          </p>
        </div>

        {/* Step 3 */}
        <div className="rounded-2xl p-6 bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-black text-lg shadow-xs">
            3
          </div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Langsung Naik & Viral</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Dalam 1 detik setelah pembayaran berhasil, posisi bot Anda langsung melonjak di leaderboard dan dikunjungi oleh ribuan pencari bot aktif!
          </p>
        </div>
      </div>
    </div>
  );
};
